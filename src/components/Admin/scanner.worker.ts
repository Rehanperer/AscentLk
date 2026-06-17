// src/components/Admin/scanner.worker.ts
// High-performance ring scanner — runs entirely off the main thread.

const GAP_VAL: Record<string, number> = { N: 0, M: 1, W: 2 };

// ─── Helpers ────────────────────────────────────────────────────────────────

function getLuminance(data: Uint8ClampedArray, w: number, h: number, x: number, y: number): number {
    const ix = Math.round(x);
    const iy = Math.round(y);
    if (ix < 0 || ix >= w || iy < 0 || iy >= h) return 0;
    const idx = (iy * w + ix) * 4;
    const r = data[idx], g = data[idx + 1], b = data[idx + 2];
    // Standard luminance with a mild cyan boost (rings are cyan)
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    const cyanBias = (g > r && b > r) ? 1.2 : 1.0;
    return Math.min(255, lum * cyanBias);
}

// Average a 3x3 patch for noise reduction
function sampleLuminance(data: Uint8ClampedArray, w: number, h: number, x: number, y: number): number {
    let sum = 0;
    for (let ox = -1; ox <= 1; ox++) {
        for (let oy = -1; oy <= 1; oy++) {
            sum += getLuminance(data, w, h, x + ox, y + oy);
        }
    }
    return sum / 9;
}

// ─── True Center Detection ─────────────────────────────────────────────────
// Find the brightest region in the central area of the frame (the orb).
function findCenter(data: Uint8ClampedArray, w: number, h: number): { cx: number, cy: number } {
    const startX = Math.floor(w * 0.25);
    const endX = Math.floor(w * 0.75);
    const startY = Math.floor(h * 0.25);
    const endY = Math.floor(h * 0.75);

    let maxLum = 0;
    let bestX = w / 2;
    let bestY = h / 2;

    // Subsample every 3 pixels for speed while still being accurate
    for (let y = startY; y < endY; y += 3) {
        for (let x = startX; x < endX; x += 3) {
            const idx = (y * w + x) * 4;
            const r = data[idx], g = data[idx + 1], b = data[idx + 2];
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            if (lum > maxLum) {
                maxLum = lum;
                bestX = x;
                bestY = y;
            }
        }
    }

    // If nothing bright found, fall back to frame center
    if (maxLum < 80) return { cx: Math.round(w / 2), cy: Math.round(h / 2) };
    return { cx: bestX, cy: bestY };
}

// ─── Scan a single radial axis ─────────────────────────────────────────────
// Returns an array of peak positions (distances from center).
function scanAxis(
    data: Uint8ClampedArray, w: number, h: number,
    cx: number, cy: number, dx: number, dy: number
): number[] {
    const maxDist = Math.min(w, h) / 2 - 10;
    const samples: number[] = [];

    // Sample luminance along the ray
    for (let d = 0; d < maxDist; d++) {
        samples.push(sampleLuminance(data, w, h, cx + dx * d, cy + dy * d));
    }

    if (samples.length < 30) return [];

    // Compute statistics for adaptive thresholding
    let sumAll = 0, maxAll = 0;
    for (let i = 0; i < samples.length; i++) {
        sumAll += samples[i];
        if (samples[i] > maxAll) maxAll = samples[i];
    }
    const meanAll = sumAll / samples.length;
    const contrast = maxAll - meanAll;

    // Need minimum contrast to detect anything
    if (contrast < 10) return [];

    const threshold = meanAll + 0.3 * contrast;

    // Skip the central orb: walk outward from center until we drop below threshold,
    // then add a small buffer to clear any orb halo/glow.
    let orbEnd = 0;
    // First find where brightness initially drops below threshold
    for (let d = 0; d < samples.length; d++) {
        if (samples[d] < threshold) {
            orbEnd = d;
            break;
        }
    }
    // If the orb never drops (whole line is bright), skip
    if (orbEnd === 0 && samples[0] >= threshold) {
        // Walk until it drops
        for (let d = 0; d < samples.length; d++) {
            if (samples[d] < threshold) { orbEnd = d; break; }
        }
    }

    // Start scanning for ring peaks after the orb ends
    const scanStart = Math.max(orbEnd, 5);

    // Find peaks (local maxima above threshold)
    const peaks: number[] = [];
    const minPeakDist = 4;

    for (let i = scanStart + 2; i < samples.length - 2; i++) {
        if (samples[i] > threshold &&
            samples[i] >= samples[i - 1] &&
            samples[i] >= samples[i + 1] &&
            samples[i] >= samples[i - 2] &&
            samples[i] >= samples[i + 2]) {
            if (peaks.length === 0 || i - peaks[peaks.length - 1] >= minPeakDist) {
                peaks.push(i);
            }
        }
    }

    return peaks;
}

// ─── Decode gaps into N/M/W using ratio-based classification ────────────────
function decodeGaps(peaks: number[]): string[] | null {
    if (peaks.length < 8) return null;

    // Take exactly 8 peaks → 7 gaps
    const p = peaks.slice(0, 8);
    const gaps: number[] = [];
    for (let i = 0; i < 7; i++) {
        gaps.push(p[i + 1] - p[i]);
    }

    // Use ratio-based classification instead of absolute pixel templates.
    // Find the smallest gap — that should be N.
    const minGap = Math.min(...gaps);
    const maxGap = Math.max(...gaps);

    // Sanity check: the widest gap should be at least 2x the narrowest
    if (maxGap < minGap * 1.5) {
        // All gaps are roughly the same — can't differentiate
        return null;
    }

    // Classify using ratio thresholds relative to the smallest gap.
    // Expected ratios: N=1x, M≈2.5x, W≈4.5x (from 8+4=12, 20+4=24, 36+4=40)
    // Boundaries: < 1.75x → N, 1.75x-3.25x → M, > 3.25x → W
    const decoded: string[] = gaps.map(g => {
        const ratio = g / minGap;
        if (ratio < 1.75) return 'N';
        if (ratio < 3.25) return 'M';
        return 'W';
    });

    return decoded;
}

// ─── Checksum validation ────────────────────────────────────────────────────
function validateChecksum(decoded: string[]): boolean {
    let sum = 0;
    for (let i = 0; i < 6; i++) {
        sum += GAP_VAL[decoded[i]];
    }
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

    // Collect decoded sequences from all axes that produce exactly 8 peaks
    const candidates: { decoded: string[], peaks: number[] }[] = [];

    for (const axis of axes) {
        const peaks = scanAxis(data, width, height, center.cx, center.cy, axis.dx, axis.dy);
        if (peaks.length >= 8) {
            const decoded = decodeGaps(peaks);
            if (decoded) {
                candidates.push({ decoded, peaks: peaks.slice(0, 8) });
            }
        }
    }

    if (candidates.length === 0) {
        self.postMessage({ success: false, center });
        return;
    }

    // Find the best candidate using majority vote
    // Group identical decodings and pick the one with the most axis agreements
    const voteMap = new Map<string, { decoded: string[], count: number }>();
    for (const c of candidates) {
        const key = c.decoded.join(',');
        const existing = voteMap.get(key);
        if (existing) {
            existing.count++;
        } else {
            voteMap.set(key, { decoded: c.decoded, count: 1 });
        }
    }

    // Sort by vote count descending
    const sorted = Array.from(voteMap.values()).sort((a, b) => b.count - a.count);
    const best = sorted[0];

    // Require at least 2 axes to agree for confidence
    if (best.count < 2) {
        self.postMessage({ success: false, center, decoded: best.decoded, lowConfidence: true });
        return;
    }

    // Validate checksum
    const checksumOk = validateChecksum(best.decoded);

    if (!checksumOk) {
        // Even if checksum fails, still send the decoded sequence for HUD display
        self.postMessage({ success: false, center, decoded: best.decoded, checksumFail: true });
        return;
    }

    self.postMessage({ success: true, center, decoded: best.decoded });
};
