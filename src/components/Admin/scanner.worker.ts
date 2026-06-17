// src/components/Admin/scanner.worker.ts
// High-performance ring scanner — runs entirely off the main thread.
// Optimized for SPEED and reliability on mobile cameras.

const GAP_VAL: Record<string, number> = { N: 0, M: 1, W: 2 };

// ─── Helpers ────────────────────────────────────────────────────────────────

function getLuminance(data: Uint8ClampedArray, w: number, h: number, x: number, y: number): number {
    const ix = Math.round(x);
    const iy = Math.round(y);
    if (ix < 0 || ix >= w || iy < 0 || iy >= h) return 0;
    const idx = (iy * w + ix) * 4;
    const r = data[idx], g = data[idx + 1], b = data[idx + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    const cyanBias = (g > r && b > r) ? 1.15 : 1.0;
    return Math.min(255, lum * cyanBias);
}

// Average a 3x3 patch for noise reduction
function sampleLum(data: Uint8ClampedArray, w: number, h: number, x: number, y: number): number {
    let sum = 0;
    for (let ox = -1; ox <= 1; ox++) {
        for (let oy = -1; oy <= 1; oy++) {
            sum += getLuminance(data, w, h, x + ox, y + oy);
        }
    }
    return sum / 9;
}

// ─── True Center Detection ─────────────────────────────────────────────────
function findCenter(data: Uint8ClampedArray, w: number, h: number): { cx: number, cy: number } {
    const sx = Math.floor(w * 0.25), ex = Math.floor(w * 0.75);
    const sy = Math.floor(h * 0.25), ey = Math.floor(h * 0.75);
    let maxLum = 0, bestX = w >> 1, bestY = h >> 1;

    for (let y = sy; y < ey; y += 4) {
        for (let x = sx; x < ex; x += 4) {
            const idx = (y * w + x) * 4;
            const lum = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
            if (lum > maxLum) { maxLum = lum; bestX = x; bestY = y; }
        }
    }
    if (maxLum < 60) return { cx: w >> 1, cy: h >> 1 };
    return { cx: bestX, cy: bestY };
}

// ─── Scan a single radial axis ─────────────────────────────────────────────
function scanAxis(
    data: Uint8ClampedArray, w: number, h: number,
    cx: number, cy: number, dx: number, dy: number
): number[] {
    const maxDist = Math.min(w, h) / 2 - 10;
    const samples: number[] = [];

    for (let d = 0; d < maxDist; d++) {
        samples.push(sampleLum(data, w, h, cx + dx * d, cy + dy * d));
    }

    if (samples.length < 30) return [];

    // Compute stats
    let sumAll = 0, maxAll = 0;
    for (let i = 0; i < samples.length; i++) {
        sumAll += samples[i];
        if (samples[i] > maxAll) maxAll = samples[i];
    }
    const meanAll = sumAll / samples.length;
    const contrast = maxAll - meanAll;
    if (contrast < 8) return [];

    const threshold = meanAll + 0.25 * contrast;

    // Skip central orb blob
    let orbEnd = 0;
    for (let d = 0; d < samples.length; d++) {
        if (samples[d] < threshold) { orbEnd = d; break; }
    }
    const scanStart = Math.max(orbEnd, 3);

    // Find peaks
    const peaks: number[] = [];
    for (let i = scanStart + 2; i < samples.length - 2; i++) {
        if (samples[i] > threshold &&
            samples[i] >= samples[i - 1] &&
            samples[i] >= samples[i + 1] &&
            samples[i] >= samples[i - 2] &&
            samples[i] >= samples[i + 2]) {
            if (peaks.length === 0 || i - peaks[peaks.length - 1] >= 3) {
                peaks.push(i);
            }
        }
    }
    return peaks;
}

// ─── Decode gaps using ratio-based classification ───────────────────────────
function decodeGaps(peaks: number[]): string[] | null {
    if (peaks.length < 8) return null;
    const p = peaks.slice(0, 8);
    const gaps: number[] = [];
    for (let i = 0; i < 7; i++) gaps.push(p[i + 1] - p[i]);

    const minGap = Math.min(...gaps);
    const maxGap = Math.max(...gaps);
    if (minGap < 1) return null;
    // Need some variance to distinguish gap types
    if (maxGap < minGap * 1.3) return null;

    // Classify using ratio. Expected: N≈1x, M≈2x, W≈3.3x
    // Use generous boundaries to handle camera noise
    return gaps.map(g => {
        const ratio = g / minGap;
        if (ratio < 1.6) return 'N';
        if (ratio < 2.8) return 'M';
        return 'W';
    });
}

// ─── Checksum validation (soft — used for confidence, not blocking) ─────────
function checksumValid(decoded: string[]): boolean {
    let sum = 0;
    for (let i = 0; i < 6; i++) sum += GAP_VAL[decoded[i]];
    return (sum % 3) === GAP_VAL[decoded[6]];
}

// ─── Main message handler ───────────────────────────────────────────────────
self.onmessage = (e: MessageEvent) => {
    const { width, height, buffer } = e.data;
    const data = new Uint8ClampedArray(buffer);
    const center = findCenter(data, width, height);

    const axes = [
        { dx: 1, dy: 0 }, { dx: -1, dy: 0 },
        { dx: 0, dy: 1 }, { dx: 0, dy: -1 },
        { dx: 0.707, dy: 0.707 }, { dx: -0.707, dy: 0.707 },
        { dx: 0.707, dy: -0.707 }, { dx: -0.707, dy: -0.707 }
    ];

    // Collect ALL decoded sequences from valid axes
    const decodings: string[][] = [];
    for (const axis of axes) {
        const peaks = scanAxis(data, width, height, center.cx, center.cy, axis.dx, axis.dy);
        if (peaks.length >= 8) {
            const decoded = decodeGaps(peaks);
            if (decoded) decodings.push(decoded);
        }
    }

    if (decodings.length === 0) {
        self.postMessage({ success: false, center });
        return;
    }

    // Pick the most common decoding via majority vote
    const voteMap = new Map<string, { decoded: string[], count: number }>();
    for (const d of decodings) {
        const key = d.join(',');
        const e = voteMap.get(key);
        if (e) e.count++; else voteMap.set(key, { decoded: d, count: 1 });
    }
    const best = Array.from(voteMap.values()).sort((a, b) => b.count - a.count)[0];

    // Accept ANY single axis match — the rolling history lock on the main thread
    // (3 identical frames in a row) is the real reliability gate.
    const decoded = best.decoded;
    const csOk = checksumValid(decoded);

    // Send it! The main thread will handle rolling-history validation.
    self.postMessage({
        success: true,
        center,
        decoded,
        checksumOk: csOk,
        axisCount: best.count
    });
};
