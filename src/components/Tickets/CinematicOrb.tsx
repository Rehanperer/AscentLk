import React, { useEffect, useRef, useMemo } from 'react';

export type OrbState = 'idle' | 'charging' | 'charged' | 'scanned';

interface CinematicOrbProps {
    state: OrbState;
    chargeProgress: number; // 0 to 100
    size?: number;
}

export const CinematicOrb: React.FC<CinematicOrbProps> = ({
    state,
    chargeProgress,
    size = 280,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafRef = useRef<number>(0);

    // Track state transitions for the explosion
    const prevStateRef = useRef<OrbState>(state);
    const particlesRef = useRef<Array<{ x: number, y: number, vx: number, vy: number, life: number, maxLife: number, color: string, size: number }>>([]);
    const explodedRef = useRef(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = size * dpr;
        canvas.height = size * dpr;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.scale(dpr, dpr);

        const cx = size / 2;
        const cy = size / 2;

        let t0: number | null = null;
        let time = 0;

        const draw = (now: number) => {
            if (!t0) t0 = now;
            const dt = (now - t0) * 0.001;
            t0 = now;
            time += dt;

            ctx.clearRect(0, 0, size, size);
            ctx.globalCompositeOperation = 'screen';

            // Check for explosion trigger
            if (state === 'scanned' && prevStateRef.current !== 'scanned' && !explodedRef.current) {
                explodedRef.current = true;
                // Generate explosion particles
                for (let i = 0; i < 200; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const speed = 2 + Math.random() * 8; // Explosive speed
                    const hue = (time * 50 + Math.random() * 60) % 360;
                    particlesRef.current.push({
                        x: cx,
                        y: cy,
                        vx: Math.cos(angle) * speed,
                        vy: Math.sin(angle) * speed,
                        life: 1.0,
                        maxLife: 0.5 + Math.random() * 1.5,
                        color: `hsl(${hue}, 100%, 60%)`,
                        size: 1 + Math.random() * 4
                    });
                }
            }
            prevStateRef.current = state;

            // Render Explosion Particles
            if (explodedRef.current) {
                let activeParticles = 0;
                for (const p of particlesRef.current) {
                    if (p.life <= 0) continue;
                    activeParticles++;

                    p.x += p.vx;
                    p.y += p.vy;
                    p.vx *= 0.95; // friction
                    p.vy *= 0.95;
                    p.life -= dt;

                    const alpha = Math.max(0, p.life / p.maxLife);
                    
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fillStyle = p.color;
                    ctx.globalAlpha = alpha;
                    ctx.fill();

                    // Glow
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
                    const rgb = ctx.fillStyle; // getting computed rgb is tricky, just use a generic glow or the same color with lower alpha
                    ctx.fillStyle = p.color;
                    ctx.globalAlpha = alpha * 0.3;
                    ctx.fill();
                }
                ctx.globalAlpha = 1.0;
                
                // Keep animating if particles exist, else we could stop.
                if (activeParticles > 0) {
                    rafRef.current = requestAnimationFrame(draw);
                }
                return; // Don't render the orb if exploded
            }

            // ─── Render Cinematic Deforming Orb ───
            
            // Base radius scales down slightly when charged to fit inside rings
            const targetBaseR = state === 'charged' ? 23 : 60;
            // Charge intensity
            const intensity = state === 'charging' ? (chargeProgress / 100) : (state === 'charged' ? 0.8 : 0.2);
            const baseR = targetBaseR + (state === 'charging' ? intensity * 15 : 0);

            // Shifting Hue over time
            const baseHue = (time * 30) % 360;

            const numLayers = 5;
            for (let i = 0; i < numLayers; i++) {
                const layerHue = (baseHue + i * 20 + intensity * 60) % 360;
                const saturation = 80 + intensity * 20;
                const lightness = 40 + i * 5 + intensity * 20;
                
                // Inner layers are brighter and smaller
                const layerScale = 1 - (i * 0.15);
                const layerR = baseR * layerScale;

                ctx.beginPath();

                const points = 60;
                for (let j = 0; j <= points; j++) {
                    const a = (j / points) * Math.PI * 2;
                    
                    // Complex noise deformation
                    // Using overlapping sine waves to simulate 2D noise (mobile friendly)
                    const speed = 2 + intensity * 5;
                    const wScale = baseR / 60; // Scale amplitudes based on size
                    const w1 = Math.sin(a * 3 + time * speed + i) * (8 + intensity * 12) * wScale;
                    const w2 = Math.cos(a * 5 - time * (speed * 1.2) + i * 2) * (5 + intensity * 8) * wScale;
                    const w3 = Math.sin(a * 8 + time * (speed * 2)) * (2 + intensity * 5) * wScale;
                    
                    // Add unstable jitter if charging highly
                    const jitter = intensity > 0.8 && Math.random() > 0.7 ? (Math.random() - 0.5) * 6 * wScale : 0;

                    const r = layerR + w1 + w2 + w3 + jitter;
                    
                    const px = cx + Math.cos(a) * r;
                    const py = cy + Math.sin(a) * r;

                    if (j === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }

                ctx.closePath();
                
                // Gradients for volume
                const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, layerR * 1.5);
                grad.addColorStop(0, `hsla(${layerHue}, ${saturation}%, ${lightness + 20}%, ${0.8 - i * 0.1})`);
                grad.addColorStop(1, `hsla(${layerHue + 30}, ${saturation}%, ${lightness - 20}%, 0)`);
                
                ctx.fillStyle = grad;
                ctx.fill();

                // Outline for crisp sci-fi look
                ctx.strokeStyle = `hsla(${layerHue + 15}, 100%, 70%, ${0.3 + intensity * 0.4})`;
                ctx.lineWidth = 1 + intensity * 2;
                ctx.stroke();
            }

            // Core singularity
            ctx.beginPath();
            ctx.arc(cx, cy, 5 + intensity * 10, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${(baseHue + 180) % 360}, 100%, 90%, 0.9)`;
            ctx.fill();

            rafRef.current = requestAnimationFrame(draw);
        };

        rafRef.current = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(rafRef.current);
    }, [size, state, chargeProgress]);

    return (
        <div className="relative flex items-center justify-center select-none pointer-events-none" style={{ width: size, height: size }}>
            <canvas
                ref={canvasRef}
                className="relative z-10"
                style={{ width: size, height: size, filter: state === 'charging' ? 'drop-shadow(0 0 15px rgba(255,255,255,0.4))' : 'none' }}
            />
        </div>
    );
};

export default CinematicOrb;
