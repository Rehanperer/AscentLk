// src/components/Admin/scanner.worker.ts

// Gap Value Map for Checksum
const GAP_VAL: Record<string, number> = { N: 0, M: 1, W: 2 };

// Find the brightest cyan blob in the center region to act as the True Center
function findTrueCenter(data: Uint8ClampedArray, w: number, h: number): { cx: number, cy: number } | null {
    // We only search the central 40% of the image to save time
    const startX = Math.floor(w * 0.3);
    const endX = Math.floor(w * 0.7);
    const startY = Math.floor(h * 0.3);
    const endY = Math.floor(h * 0.7);

    let maxLum = 0;
    let bestX = w / 2;
    let bestY = h / 2;

    // Subsample every 4 pixels for speed
    for (let y = startY; y < endY; y += 4) {
        for (let x = startX; x < endX; x += 4) {
            const idx = (y * w + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            
            // Look for bright white/cyan (the orb center)
            if (g > 200 && b > 200) {
                const lum = 0.299 * r + 0.587 * g + 0.114 * b;
                if (lum > maxLum) {
                    maxLum = lum;
                    bestX = x;
                    bestY = y;
                }
            }
        }
    }

    if (maxLum < 150) return null; // No bright orb found
    return { cx: bestX, cy: bestY };
}

function getCyanLuminance(data: Uint8ClampedArray, w: number, h: number, x: number, y: number): number {
    if (x < 0 || x >= w || y < 0 || y >= h) return 0;
    const idx = (y * w + x) * 4;
    const r = data[idx], g = data[idx + 1], b = data[idx + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    const cyanBias = (g > r && b > r) ? 1.2 : 1.0;
    return Math.min(255, lum * cyanBias);
}

function scanAxis(data: Uint8ClampedArray, w: number, h: number, cx: number, cy: number, dx: number, dy: number): number[] {
    const maxDist = Math.min(w, h) / 2 - 10;
    const rawSamples: number[] = [];
    
    // 1. Gather all samples first
    for (let d = 0; d < maxDist; d++) {
        const x = cx + dx * d;
        const y = cy + dy * d;
        let sum = 0;
        let count = 0;
        for (let ox = -1; ox <= 1; ox++) {
            for (let oy = -1; oy <= 1; oy++) {
                sum += getCyanLuminance(data, w, h, Math.round(x + ox), Math.round(y + oy));
                count++;
            }
        }
        rawSamples.push(sum / count);
    }

    if (rawSamples.length < 20) return [];

    const maxLum = Math.max(...rawSamples);
    const meanLum = rawSamples.reduce((a, b) => a + b, 0) / rawSamples.length;
    // Adaptive Threshold
    const threshold = meanLum + 0.25 * (maxLum - meanLum);

    if (maxLum - meanLum < 12) return [];

    // 2. Skip the central orb blob
    // The orb is at d=0. We walk forward until brightness drops below the threshold to exit the orb
    let startD = 5;
    while (startD < rawSamples.length && rawSamples[startD] >= threshold) {
        startD++;
    }

    // Now startD is the first pixel OUTSIDE the orb
    const peaks: number[] = [];
    const minPeakDist = 3;

    for (let i = startD + 2; i < rawSamples.length - 2; i++) {
        if (rawSamples[i] > threshold &&
            rawSamples[i] >= rawSamples[i - 1] &&
            rawSamples[i] >= rawSamples[i + 1] &&
            rawSamples[i] >= rawSamples[i - 2] &&
            rawSamples[i] >= rawSamples[i + 2]) {
            
            if (peaks.length === 0 || i - peaks[peaks.length - 1] >= minPeakDist) {
                peaks.push(i);
            }
        }
    }

    return peaks.slice(0, 8); // 7 gaps = 8 peaks
}

self.onmessage = (e: MessageEvent) => {
    const { imageData, width, height } = e.data;
    const data = imageData.data;

    const center = findTrueCenter(data, width, height) || { cx: width / 2, cy: height / 2 };
    
    const axes = [
        { dx: 1, dy: 0 }, { dx: -1, dy: 0 }, { dx: 0, dy: 1 }, { dx: 0, dy: -1 },
        { dx: 0.707, dy: 0.707 }, { dx: -0.707, dy: 0.707 }, 
        { dx: 0.707, dy: -0.707 }, { dx: -0.707, dy: -0.707 }
    ];

    const allPeaks: number[][] = [];
    
    for (const axis of axes) {
        const peaks = scanAxis(data, width, height, center.cx, center.cy, axis.dx, axis.dy);
        if (peaks.length === 8) {
            allPeaks.push(peaks);
        }
    }

    if (allPeaks.length === 0) {
        self.postMessage({ success: false, center, allPeaks });
        return;
    }

    // Try to decode using the first valid axis
    const peaksToUse = allPeaks[0];
    const gaps: number[] = [];
    for (let g = 0; g < 7; g++) {
        gaps.push(peaksToUse[g + 1] - peaksToUse[g]);
    }

    let bestS = 1.0;
    let minError = Infinity;

    // Expected templates: N=12, M=24, W=40
    for (let s = 0.15; s <= 4.0; s += 0.02) {
        let error = 0;
        for (let i = 0; i < gaps.length; i++) {
            // Apply slight quadratic scaling to expected gaps to handle lens pincushion distortion
            const lensScale = s * (1 + i * 0.015); 
            const diffN = Math.abs(gaps[i] - 12 * lensScale);
            const diffM = Math.abs(gaps[i] - 24 * lensScale);
            const diffW = Math.abs(gaps[i] - 40 * lensScale);
            error += Math.min(diffN, diffM, diffW);
        }
        if (error < minError) {
            minError = error;
            bestS = s;
        }
    }

    const decoded: string[] = gaps.map((gap, i) => {
        const lensScale = bestS * (1 + i * 0.015);
        const diffN = Math.abs(gap - 12 * lensScale);
        const diffM = Math.abs(gap - 24 * lensScale);
        const diffW = Math.abs(gap - 40 * lensScale);
        const m = Math.min(diffN, diffM, diffW);
        if (m === diffN) return 'N';
        if (m === diffM) return 'M';
        return 'W';
    });

    // Checksum Validation
    let sum = 0;
    for (let i = 0; i < 6; i++) {
        sum += GAP_VAL[decoded[i]];
    }
    const expectedChecksum = sum % 3;
    const actualChecksum = GAP_VAL[decoded[6]];

    if (expectedChecksum !== actualChecksum) {
        self.postMessage({ success: false, center, allPeaks, decoded, checksumFail: true });
        return;
    }

    self.postMessage({ success: true, center, allPeaks, decoded });
};
