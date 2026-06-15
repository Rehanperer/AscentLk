import React, { useRef, useEffect } from 'react';

interface VenomBlobProps {
    hexColors: string[];
    tilt: { x: number; y: number };
}

/**
 * VenomBlob — Organic, random, living symbiote-like gradient blob.
 * 
 * Renders to a <canvas> using Fractal Brownian Motion (FBM) noise
 * to create continuously morphing, truly random shapes with sharp
 * tendril spikes. Three layered blobs provide depth, each filled
 * with a slowly rotating gradient mapped to the color sequence.
 * 
 * The primary layer gets volumetric shading (gyroscope-reactive
 * specular highlight + scanline overlay) for a cinematic sci-fi feel.
 * 
 * Energy motes orbit the blob for additional visual complexity.
 * 
 * Performance: ~60fps on modern mobile. Uses requestAnimationFrame
 * with refs for tilt/colors so the effect loop never re-mounts.
 */
const VenomBlob: React.FC<VenomBlobProps> = ({ hexColors, tilt }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const frameRef = useRef<number>(0);
    const tiltRef = useRef(tilt);
    const colorsRef = useRef(hexColors);

    // Update refs without re-running the animation effect
    useEffect(() => { tiltRef.current = tilt; }, [tilt]);
    useEffect(() => { colorsRef.current = hexColors; }, [hexColors]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const size = 340;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = size * dpr;
        canvas.height = size * dpr;
        ctx.scale(dpr, dpr);

        const cx = size / 2;
        const cy = size / 2;

        // ─── Noise Functions ─────────────────────────────────────
        // Fast hash-based pseudo-random (deterministic for given inputs)
        const hash = (x: number, y: number): number => {
            const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
            return n - Math.floor(n);
        };

        // Smooth interpolated value noise with Hermite curve
        const smoothNoise = (x: number, y: number): number => {
            const ix = Math.floor(x), iy = Math.floor(y);
            const fx = x - ix, fy = y - iy;
            const sx = fx * fx * (3 - 2 * fx);
            const sy = fy * fy * (3 - 2 * fy);
            return (
                hash(ix, iy) * (1 - sx) * (1 - sy) +
                hash(ix + 1, iy) * sx * (1 - sy) +
                hash(ix, iy + 1) * (1 - sx) * sy +
                hash(ix + 1, iy + 1) * sx * sy
            );
        };

        // Fractal Brownian Motion — layered noise for organic detail
        const fbm = (x: number, y: number): number => {
            let val = 0, amp = 0.5, freq = 1;
            for (let i = 0; i < 4; i++) {
                val += smoothNoise(x * freq, y * freq) * amp;
                amp *= 0.5;
                freq *= 2.0;
            }
            return val;
        };

        // ─── Color Utilities ─────────────────────────────────────
        const hexToRgb = (hex: string) => ({
            r: parseInt(hex.slice(1, 3), 16),
            g: parseInt(hex.slice(3, 5), 16),
            b: parseInt(hex.slice(5, 7), 16),
        });

        // ─── Main Animation Loop ────────────────────────────────
        const draw = (timestamp: number) => {
            const t = timestamp * 0.001; // seconds
            const currentTilt = tiltRef.current;
            const currentHexes = colorsRef.current;
            const rgbs = currentHexes.map(hexToRgb);

            ctx.clearRect(0, 0, size, size);

            // ── Ambient outer glow field ──
            const glowGrad = ctx.createRadialGradient(
                cx + currentTilt.x * 0.8, cy + currentTilt.y * 0.8, 40,
                cx, cy, 170
            );
            glowGrad.addColorStop(0, currentHexes[0] + '22');
            glowGrad.addColorStop(0.5, (currentHexes[2] || currentHexes[0]) + '0D');
            glowGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = glowGrad;
            ctx.fillRect(0, 0, size, size);

            // ── Draw 3 blob layers (back → front) for depth ──
            for (let layer = 2; layer >= 0; layer--) {
                const points: [number, number][] = [];
                const numPoints = 80;
                const phase = layer * 2.5;
                const baseR = 62 + layer * 10;
                const noiseAmp = 22 + layer * 12;

                for (let i = 0; i < numPoints; i++) {
                    const angle = (i / numPoints) * Math.PI * 2;

                    // FBM noise-based radius variation
                    const nx = Math.cos(angle) * 1.4 + t * 0.3 + phase;
                    const ny = Math.sin(angle) * 1.4 + t * 0.24 + phase;
                    const n = fbm(nx, ny);

                    // Venom tendril spikes — multiple overlapping harmonics
                    // High exponents create sharp, narrow extensions
                    const tp = t * 0.65 + phase;
                    const s1 = Math.pow(Math.max(0, Math.cos(angle * 2.3 + tp)), 14) * 32;
                    const s2 = Math.pow(Math.max(0, Math.sin(angle * 3.7 - tp * 0.55)), 12) * 26;
                    const s3 = Math.pow(Math.max(0, Math.cos(angle * 5.1 + tp * 1.2)), 18) * 20;
                    const s4 = Math.pow(Math.max(0, Math.sin(angle * 7.0 + tp * 0.35)), 22) * 16;
                    const s5 = Math.pow(Math.max(0, Math.cos(angle * 11.0 - tp * 0.9)), 25) * 12;

                    // Organic breathing pulse
                    const breathe = Math.sin(t * 0.9 + layer * 0.4) * 4;
                    // Slow undulation wave
                    const undulate = Math.sin(angle * 1.5 + t * 0.4 + phase) * 6;

                    const r = baseR + (n - 0.5) * noiseAmp * 2
                        + s1 + s2 + s3 + s4 + s5
                        + breathe + undulate;

                    const px = cx + Math.cos(angle) * r + currentTilt.x * 0.4;
                    const py = cy + Math.sin(angle) * r + currentTilt.y * 0.4;
                    points.push([px, py]);
                }

                // Catmull-Rom → Cubic Bézier smooth closed curve
                ctx.beginPath();
                for (let i = 0; i < numPoints; i++) {
                    const p0 = points[(i - 1 + numPoints) % numPoints];
                    const p1 = points[i];
                    const p2 = points[(i + 1) % numPoints];
                    const p3 = points[(i + 2) % numPoints];

                    if (i === 0) ctx.moveTo(p1[0], p1[1]);
                    ctx.bezierCurveTo(
                        p1[0] + (p2[0] - p0[0]) / 6,
                        p1[1] + (p2[1] - p0[1]) / 6,
                        p2[0] - (p3[0] - p1[0]) / 6,
                        p2[1] - (p3[1] - p1[1]) / 6,
                        p2[0], p2[1]
                    );
                }
                ctx.closePath();

                // ── Rotating gradient fill mapped to color sequence ──
                const ga = t * 0.35 + layer * 1.2;
                const grad = ctx.createLinearGradient(
                    cx + Math.cos(ga) * 120, cy + Math.sin(ga) * 120,
                    cx - Math.cos(ga) * 120, cy - Math.sin(ga) * 120
                );

                rgbs.forEach((c, idx) => {
                    const shift = Math.sin(t * 0.55 + idx * 1.1) * 0.04;
                    const stop = Math.max(0, Math.min(1, idx / Math.max(1, rgbs.length - 1) + shift));
                    const alpha = layer === 0 ? 1 : (layer === 1 ? 0.28 : 0.12);
                    grad.addColorStop(stop, `rgba(${c.r},${c.g},${c.b},${alpha})`);
                });

                ctx.fillStyle = grad;
                ctx.fill();

                // ── Volumetric shading on primary blob layer ──
                if (layer === 0) {
                    ctx.save();
                    ctx.clip();

                    // Gyroscope-reactive specular highlight
                    const specGrad = ctx.createRadialGradient(
                        cx + currentTilt.x * 3, cy + currentTilt.y * 3 - 12, 6,
                        cx, cy, 110
                    );
                    specGrad.addColorStop(0, 'rgba(255,255,255,0.32)');
                    specGrad.addColorStop(0.25, 'rgba(255,255,255,0.08)');
                    specGrad.addColorStop(0.65, 'rgba(0,0,0,0.04)');
                    specGrad.addColorStop(1, 'rgba(0,0,0,0.22)');
                    ctx.fillStyle = specGrad;
                    ctx.fill();

                    // Scanline overlay for sci-fi aesthetic
                    ctx.fillStyle = 'rgba(0,0,0,0.05)';
                    for (let sy = 0; sy < size; sy += 4) {
                        ctx.fillRect(0, sy, size, 1.5);
                    }

                    ctx.restore();
                }
            }

            // ── Floating energy motes orbiting the blob ──
            for (let i = 0; i < 10; i++) {
                const mAngle = t * 0.25 + (i / 10) * Math.PI * 2;
                const mR = 100 + Math.sin(t * 1.1 + i * 1.9) * 35;
                const mx = cx + Math.cos(mAngle) * mR + currentTilt.x * 0.2;
                const my = cy + Math.sin(mAngle) * mR + currentTilt.y * 0.2;
                const mAlpha = 0.12 + Math.sin(t * 2.2 + i * 1.3) * 0.12;
                const mSize = 1.2 + Math.sin(t * 1.4 + i * 2.7) * 0.8;

                ctx.beginPath();
                ctx.arc(mx, my, Math.max(0.5, mSize), 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${Math.max(0, mAlpha)})`;
                ctx.fill();
            }

            frameRef.current = requestAnimationFrame(draw);
        };

        frameRef.current = requestAnimationFrame(draw);

        return () => {
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <canvas
            ref={canvasRef}
            className="pointer-events-none"
            style={{ width: 340, height: 340 }}
        />
    );
};

export default VenomBlob;
