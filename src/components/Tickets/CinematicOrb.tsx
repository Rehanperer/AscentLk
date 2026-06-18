import React, { useEffect, useRef } from 'react';

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
    
    // Refs for explosion tracking
    const particlesRef = useRef<Array<{ 
        type: 'spark' | 'smoke',
        x: number, 
        y: number, 
        vx: number, 
        vy: number, 
        life: number, 
        maxLife: number, 
        color: string, 
        size: number,
        decay: number,
        r: number,
        g: number,
        b: number,
        growth: number,
        maxOpacity: number
    }>>([]);
    
    const explodedRef = useRef(false);
    const detonatedRef = useRef(false);
    const overloadTimeRef = useRef(0);
    const shockwaveRadiusRef = useRef(0);
    const shockwaveAlphaRef = useRef(1);
    const flashAlphaRef = useRef(1);

    // Reset refs if state is not scanned
    useEffect(() => {
        if (state !== 'scanned') {
            explodedRef.current = false;
            detonatedRef.current = false;
            overloadTimeRef.current = 0;
            shockwaveRadiusRef.current = 0;
            shockwaveAlphaRef.current = 1;
            flashAlphaRef.current = 1;
            particlesRef.current = [];
        }
    }, [state]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const isScanned = state === 'scanned';

        const resizeCanvas = () => {
            const w = isScanned ? window.innerWidth : size;
            const h = isScanned ? window.innerHeight : size;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            const ctxTemp = canvas.getContext('2d');
            if (ctxTemp) {
                ctxTemp.scale(dpr, dpr);
                ctxTemp.imageSmoothingEnabled = true;
            }
        };

        resizeCanvas();

        if (isScanned) {
            window.addEventListener('resize', resizeCanvas);
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let t0: number | null = null;
        let time = 0;

        const draw = (now: number) => {
            if (!t0) t0 = now;
            const dt = (now - t0) * 0.001;
            t0 = now;
            time += dt;

            const currentW = canvas.width / dpr;
            const currentH = canvas.height / dpr;

            ctx.clearRect(0, 0, currentW, currentH);
            ctx.globalCompositeOperation = 'screen';

            // Calculate center dynamically
            let cx = currentW / 2;
            let cy = currentH / 2;
            if (isScanned) {
                const parent = canvas.parentElement;
                if (parent) {
                    const rect = parent.getBoundingClientRect();
                    cx = rect.left + rect.width / 2;
                    cy = rect.top + rect.height / 2;
                }
            }

            // ─── Scanned State Build-Up & Detonation ───
            const isOverloading = state === 'scanned' && !detonatedRef.current;
            const MOVE_DURATION = 0.8;
            const GROW_DURATION = 0.4;
            const DETONATION_TIME = MOVE_DURATION + GROW_DURATION;
            const overloadRatio = isOverloading ? overloadTimeRef.current / DETONATION_TIME : 0;

            let expandRatio = 0;
            if (isOverloading) {
                overloadTimeRef.current += dt;
                
                // Starting position is the parent element's location (cx, cy)
                const startCx = cx;
                const startCy = cy;
                // Target center is the middle of the screen
                const screenCx = currentW / 2;
                const screenCy = currentH / 2;

                // 1. Position Interpolation (Move to center & vibrate erratically)
                if (overloadTimeRef.current < MOVE_DURATION) {
                    const t = overloadTimeRef.current / MOVE_DURATION;
                    const easeT = t * t * (3 - 2 * t); // smoothstep
                    cx = startCx + (screenCx - startCx) * easeT;
                    cy = startCy + (screenCy - startCy) * easeT;

                    // Erratic fast circular movement (vibrating/orbiting fast)
                    const angle = time * 35;
                    const radius = 28 * (1.0 - t);
                    cx += Math.cos(angle) * radius;
                    cy += Math.sin(angle) * radius;
                } else {
                    // Centered
                    cx = screenCx;
                    cy = screenCy;
                    // High-pressure micro-jitter right before detonation
                    cx += (Math.random() - 0.5) * 4;
                    cy += (Math.random() - 0.5) * 4;
                }

                // 2. Expansion Ratio (Grows rapidly during last 0.4s)
                if (overloadTimeRef.current > MOVE_DURATION) {
                    expandRatio = (overloadTimeRef.current - MOVE_DURATION) / GROW_DURATION;
                }

                // 3. Detonate when total time (1.2s) is reached
                if (overloadTimeRef.current >= DETONATION_TIME) {
                    detonatedRef.current = true;
                    explodedRef.current = true;
                    flashAlphaRef.current = 1.0;
                    
                    // Detonation! Generate 280 high-velocity sparks/embers (NO smoke)
                    for (let i = 0; i < 280; i++) {
                        const angle = Math.random() * Math.PI * 2;
                        const speed = 4 + Math.random() * 26;
                        const isRed = Math.random() > 0.45;
                        const hue = isRed ? 350 : 185; 
                        const life = 0.5 + Math.random() * 0.9;
                        
                        particlesRef.current.push({
                            type: 'spark',
                            x: cx,
                            y: cy,
                            vx: Math.cos(angle) * speed,
                            vy: Math.sin(angle) * speed,
                            life: life,
                            maxLife: life,
                            color: isRed ? `hsl(${hue}, 100%, 62%)` : `hsl(${hue}, 100%, 72%)`,
                            size: 1.5 + Math.random() * 5,
                            decay: 0.9 + Math.random() * 0.7,
                            r: 0, g: 0, b: 0, growth: 0, maxOpacity: 0
                        });
                    }
                }
            }
            prevStateRef.current = state;

            // ─── Render Explosion State (Post-Detonation) ───
            if (detonatedRef.current) {
                // 1. Render radial shockwaves (expanded speed and diagonal scale)
                const maxDist = Math.hypot(currentW, currentH) * 0.75;
                shockwaveRadiusRef.current += dt * 1100;
                shockwaveAlphaRef.current = Math.max(0, 1 - shockwaveRadiusRef.current / maxDist);

                if (shockwaveAlphaRef.current > 0) {
                    // Cyan Shockwave
                    ctx.beginPath();
                    ctx.arc(cx, cy, shockwaveRadiusRef.current, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(0, 255, 255, ${shockwaveAlphaRef.current * 0.85})`;
                    ctx.lineWidth = 6 * shockwaveAlphaRef.current;
                    ctx.stroke();

                    // Inner Red Shockwave
                    ctx.beginPath();
                    ctx.arc(cx, cy, shockwaveRadiusRef.current * 0.84, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(255, 70, 85, ${shockwaveAlphaRef.current * 0.65})`;
                    ctx.lineWidth = 4 * shockwaveAlphaRef.current;
                    ctx.stroke();
                }

                // 2. Render particle dispersal (sparks & smoke)
                let activeParticles = 0;
                for (const p of particlesRef.current) {
                    if (p.life <= 0) continue;
                    activeParticles++;

                    p.x += p.vx;
                    p.y += p.vy;

                    if (p.type === 'spark') {
                        p.vx *= 0.92;
                        p.vy *= 0.92;
                        p.y -= dt * 15;
                        p.life -= dt * p.decay;

                        const alpha = Math.max(0, p.life / p.maxLife);
                        
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                        ctx.fillStyle = p.color;
                        ctx.globalAlpha = alpha;
                        ctx.fill();

                        // Spark glow
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.size * 3.5, 0, Math.PI * 2);
                        ctx.fillStyle = p.color;
                        ctx.globalAlpha = alpha * 0.25;
                        ctx.fill();
                    } else if (p.type === 'smoke') {
                        p.vx *= 0.94;
                        p.vy *= 0.94;
                        p.y -= dt * 38; // steady upward drift
                        p.size += dt * p.growth;
                        p.life -= dt * p.decay;

                        const progress = p.life / p.maxLife;
                        let alpha = 1.0;
                        if (progress > 0.85) {
                            alpha = (1.0 - progress) / 0.15;
                        } else {
                            alpha = progress / 0.85;
                        }
                        alpha = Math.max(0, Math.min(1, alpha));
                        const currentOpacity = alpha * p.maxOpacity;

                        const smokeGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
                        smokeGrad.addColorStop(0, `rgba(${p.r}, ${p.g}, ${p.b}, ${currentOpacity})`);
                        smokeGrad.addColorStop(0.4, `rgba(${p.r}, ${p.g}, ${p.b}, ${currentOpacity * 0.45})`);
                        smokeGrad.addColorStop(0.8, `rgba(${p.r}, ${p.g}, ${p.b}, ${currentOpacity * 0.1})`);
                        smokeGrad.addColorStop(1, `rgba(${p.r}, ${p.g}, ${p.b}, 0)`);
                        
                        ctx.fillStyle = smokeGrad;
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
                ctx.globalAlpha = 1.0;

                // 3. Screen-filling white-hot blast flash
                flashAlphaRef.current = Math.max(0, flashAlphaRef.current - dt * 1.6);
                if (flashAlphaRef.current > 0) {
                    ctx.fillStyle = `rgba(255, 255, 255, ${flashAlphaRef.current * 0.88})`;
                    ctx.fillRect(0, 0, currentW, currentH);

                    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(currentW, currentH) * 0.75);
                    grad.addColorStop(0, `rgba(255, 255, 255, ${flashAlphaRef.current})`);
                    grad.addColorStop(0.25, `rgba(0, 255, 255, ${flashAlphaRef.current * 0.85})`);
                    grad.addColorStop(0.55, `rgba(255, 70, 85, ${flashAlphaRef.current * 0.45})`);
                    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
                    
                    ctx.fillStyle = grad;
                    ctx.fillRect(0, 0, currentW, currentH);
                }

                // Continue drawing if particles or smoke or flash are still active
                if (activeParticles > 0 || flashAlphaRef.current > 0 || shockwaveAlphaRef.current > 0) {
                    rafRef.current = requestAnimationFrame(draw);
                }
                return; // Prevent rendering deforming layers
            }

            // ─── Render Cinematic Deforming Orb ───
            
            // Base radius scales down slightly when charged to fit inside rings
            const targetBaseR = state === 'charged' ? 23 : 60;
            // Charge intensity: increases during grow phase
            const intensity = state === 'charging' 
                ? (chargeProgress / 100) 
                : (state === 'charged' 
                    ? 0.8 
                    : (isOverloading ? 0.2 + expandRatio * 0.8 : 0.2));
            
            // Expand core during overload build-up
            let baseR = targetBaseR + (state === 'charging' ? intensity * 15 : 0);
            if (isOverloading) {
                // Grow base radius exponentially up to 3.2x in the last GROW_DURATION phase
                baseR = baseR * (1.0 + Math.pow(expandRatio, 2.5) * 2.2);
            }

            // Shifting Hue over time
            const baseHue = (time * 30) % 360;

            const numLayers = 5;
            for (let i = 0; i < numLayers; i++) {
                // If overloading, shift hues dramatically between red (350) and cyan (180)
                let layerHue = (baseHue + i * 20 + intensity * 60) % 360;
                if (isOverloading) {
                    layerHue = (layerHue + overloadRatio * 180) % 360;
                }
                
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
                    const speed = (2 + intensity * 5) * (1.0 + overloadRatio * 2.0);
                    const wScale = baseR / 60;
                    const w1 = Math.sin(a * 3 + time * speed + i) * (8 + intensity * 12) * wScale;
                    const w2 = Math.cos(a * 5 - time * (speed * 1.2) + i * 2) * (5 + intensity * 8) * wScale;
                    const w3 = Math.sin(a * 8 + time * (speed * 2)) * (2 + intensity * 5) * wScale;
                    
                    // Shaking jitter increases violently during overload build-up
                    let jitter = intensity > 0.8 && Math.random() > 0.7 ? (Math.random() - 0.5) * 6 * wScale : 0;
                    if (isOverloading) {
                        jitter += (Math.random() - 0.5) * 22 * overloadRatio * wScale;
                    }

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
                ctx.strokeStyle = `hsla(${layerHue + 15}, 100%, 70%, ${0.3 + intensity * 0.4 + overloadRatio * 0.4})`;
                ctx.lineWidth = 1 + intensity * 2 + overloadRatio * 2;
                ctx.stroke();
            }

            // Core singularity (heats up to white-hot red during build-up)
            ctx.beginPath();
            ctx.arc(cx, cy, 5 + intensity * 10 + overloadRatio * 15, 0, Math.PI * 2);
            if (isOverloading) {
                ctx.fillStyle = `rgba(255, 255, 255, ${0.9 + overloadRatio * 0.1})`;
            } else {
                ctx.fillStyle = `hsla(${(baseHue + 180) % 360}, 100%, 90%, 0.9)`;
            }
            ctx.fill();

            rafRef.current = requestAnimationFrame(draw);
        };

        rafRef.current = requestAnimationFrame(draw);
        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [size, state, chargeProgress]);

    return (
        <div className="relative flex items-center justify-center select-none pointer-events-none" style={{ width: size, height: size }}>
            <canvas
                ref={canvasRef}
                className={state === 'scanned' ? 'fixed inset-0 w-full h-full z-50 pointer-events-none' : 'relative z-10'}
                style={state === 'scanned' ? {} : { 
                    width: size, 
                    height: size, 
                    filter: state === 'charging' ? 'drop-shadow(0 0 15px rgba(255,255,255,0.4))' : 'none' 
                }}
            />
        </div>
    );
};

export default CinematicOrb;
