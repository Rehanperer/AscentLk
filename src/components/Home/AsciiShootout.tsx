import React, { useRef, useEffect, useState } from 'react';

/**
 * NeonTacticalShootout — 60fps high-fidelity vector animation.
 * Features ultra-smooth movement, holographic glows, and the same cinematic story.
 */

const OW = 480, OH = 240;
const CYCLE = 26000; // 26 seconds

const clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * clamp(t);
const easeOut = (t: number) => 1 - (1 - clamp(t)) ** 3;
const easeIn = (t: number) => clamp(t) ** 2;
const easeInOut = (t: number) => { const t2 = clamp(t); return t2 < 0.5 ? 2*t2*t2 : 1 - (-2*t2+2)**2/2; };

// ─── Drawing helpers ─────────────────────────────────────────

function applyGlow(c: CanvasRenderingContext2D, color: string, blur: number = 10) {
    c.shadowColor = color;
    c.shadowBlur = blur;
}

function clearGlow(c: CanvasRenderingContext2D) {
    c.shadowBlur = 0;
}

function drawLedge(c: CanvasRenderingContext2D, x: number, y: number) {
    applyGlow(c, 'rgba(255,255,255,0.5)', 15);
    c.fillStyle = 'rgba(255,255,255,0.15)';
    c.fillRect(x - 35, y, 70, 8);
    c.fillStyle = 'rgba(255,255,255,0.05)';
    c.fillRect(x - 20, y + 8, 40, 82); 
    clearGlow(c);
}

function drawSpike(c: CanvasRenderingContext2D, x: number, y: number, intensity: number, levitate: number) {
    const floatY = y - levitate;
    
    // Holographic aura
    if (intensity > 0) {
        c.fillStyle = `rgba(255, 50, 50, ${intensity * 0.15})`;
        c.beginPath(); c.arc(x, floatY - 10, 10 + intensity * 60, 0, Math.PI * 2); c.fill();
        
        // Pulse ring
        const ring = (Date.now() * 0.002) % 1;
        c.strokeStyle = `rgba(255, 50, 50, ${(1-ring) * 0.5})`;
        c.lineWidth = 2;
        c.beginPath(); c.arc(x, floatY - 10, ring * 80, 0, Math.PI * 2); c.stroke();
    }
    
    applyGlow(c, 'rgba(255,50,50,0.8)', 20);
    // Base pedestal
    c.fillStyle = 'rgba(180,180,200,1)';
    c.beginPath();
    c.moveTo(x - 12, floatY); c.lineTo(x + 12, floatY); c.lineTo(x + 8, floatY - 8); c.lineTo(x - 8, floatY - 8);
    c.fill();
    
    // Floating core 
    const coreY = floatY - 14 - Math.sin(Date.now() * 0.01) * (2 + levitate * 0.1);
    c.fillStyle = `rgba(255, ${200 - intensity * 200}, ${200 - intensity * 200}, 1)`;
    c.beginPath();
    c.moveTo(x, coreY - 12); c.lineTo(x + 6, coreY); c.lineTo(x, coreY + 6); c.lineTo(x - 6, coreY);
    c.fill();
    
    // Core glow
    c.fillStyle = `rgba(255, 20, 20, ${0.8 + intensity * 0.2})`;
    c.beginPath(); c.arc(x, coreY, 4, 0, Math.PI * 2); c.fill();
    clearGlow(c);
}

function drawFigure(
    c: CanvasRenderingContext2D,
    x: number, y: number, dir: number,
    armAng: number, lean: number, backArmAng: number,
    drawGun: boolean, crouch: number = 0, rotation: number = 0, isDead: boolean = false, stride: number = 0
) {
    if (isDead) return;
    
    c.save();
    c.translate(x, y);
    c.rotate(rotation);
    
    const colMain = 'rgba(255,255,255,1)';
    const colGlow = 'rgba(255,46,85,0.8)'; // Red-ish accent like Valorant
    const lx = lean * dir;
    const cy = crouch * -10; 

    applyGlow(c, colGlow, 15);

    // head
    c.fillStyle = colMain;
    c.beginPath();
    c.arc(lx * 2, cy - 56, 7.5, 0, Math.PI * 2);
    c.fill();

    // torso (tapered & more anatomical)
    c.beginPath();
    c.moveTo(lx - 7, cy - 45);
    c.lineTo(lx + 7, cy - 45);
    c.lineTo(lx + 4, cy - 18 + crouch * 10);
    c.lineTo(lx - 4, cy - 18 + crouch * 10);
    c.closePath();
    c.fill();

    // legs
    c.strokeStyle = colMain; c.lineWidth = 5;
    c.lineCap = 'round';
    if (crouch < 0) {
        c.beginPath(); c.moveTo(0, cy - 18); c.lineTo(-10, -10); c.lineTo(-6, 0); c.stroke();
        c.beginPath(); c.moveTo(0, cy - 18); c.lineTo(10, -10); c.lineTo(6, 0); c.stroke();
    } else {
        const swing = stride * 12;
        // back leg
        c.strokeStyle = 'rgba(255,255,255,0.3)';
        c.beginPath(); c.moveTo(-3, cy - 18); c.lineTo(-3 - swing, 0); c.stroke();
        // front leg
        c.strokeStyle = colMain;
        c.beginPath(); c.moveTo(3, cy - 18); c.lineTo(3 + swing, 0); c.stroke();
    }

    // arms
    const sx = lx + 6 * dir, sy = cy - 40;
    const armL = 18;
    const ax = sx + Math.cos(armAng) * armL * dir;
    const ay = sy + Math.sin(armAng) * armL;
    c.strokeStyle = colMain; c.lineWidth = 6;
    c.beginPath(); c.moveTo(sx, sy); c.lineTo(ax, ay); c.stroke();

    const bsx = lx - 4 * dir, bsy = cy - 37;
    const bax = bsx + Math.cos(backArmAng) * 12 * dir;
    const bay = bsy + Math.sin(backArmAng) * 12;
    c.strokeStyle = 'rgba(255,255,255,0.35)'; c.lineWidth = 5;
    c.beginPath(); c.moveTo(bsx, bsy); c.lineTo(bax, bay); c.stroke();

    // gun
    if (drawGun) {
        const gunL = 24;
        const gx = ax + Math.cos(armAng) * gunL * dir;
        const gy = ay + Math.sin(armAng) * gunL;
        
        c.strokeStyle = 'rgba(220,220,240,1)'; c.lineWidth = 4;
        c.beginPath(); c.moveTo(ax, ay); c.lineTo(gx, gy); c.stroke();
        
        // laser
        c.strokeStyle = 'rgba(255,46,85,0.4)'; c.lineWidth = 1;
        c.beginPath(); c.moveTo(gx, gy); c.lineTo(gx + 15 * dir, gy + Math.tan(armAng) * 15 * dir); c.stroke();
    }
    
    c.restore();
    clearGlow(c);
}

function drawMuzzleFlash(c: CanvasRenderingContext2D, x: number, y: number, size: number) {
    applyGlow(c, '#ff4655', 20);
    c.fillStyle = 'rgba(255,255,200,0.95)';
    c.beginPath(); c.arc(x, y, size * 2.5, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#ffffff';
    c.beginPath(); c.arc(x, y, size, 0, Math.PI * 2); c.fill();
    clearGlow(c);
}

function drawBullet(c: CanvasRenderingContext2D, x: number, y: number, dir: number) {
    applyGlow(c, '#ff4655', 10);
    c.fillStyle = '#ff4655';
    c.beginPath(); c.arc(x, y, 3, 0, Math.PI * 2); c.fill();
    
    // Trail
    const grad = c.createLinearGradient(x - 20 * dir, y, x, y);
    grad.addColorStop(0, 'transparent');
    grad.addColorStop(1, '#ff4655');
    c.strokeStyle = grad;
    c.lineWidth = 2.5;
    c.beginPath(); c.moveTo(x - 30 * dir, y); c.lineTo(x, y); c.stroke();
    clearGlow(c);
}

function drawSniperLaser(c: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, fade: number) {
    applyGlow(c, '#ff2828', 40 * fade);
    c.strokeStyle = `rgba(255, 40, 40, ${fade * 0.8})`; c.lineWidth = 14;
    c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
    c.strokeStyle = `rgba(255, 200, 200, ${fade})`; c.lineWidth = 6;
    c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
    clearGlow(c);
}

function drawDefuseHolo(c: CanvasRenderingContext2D, hx: number, hy: number, sx: number, sy: number) {
    applyGlow(c, '#64c8ff', 15);
    c.strokeStyle = `rgba(100, 200, 255, ${0.5 + Math.random() * 0.4})`; c.lineWidth = 2.5;
    c.beginPath(); c.moveTo(hx, hy); 
    c.lineTo(hx + (sx-hx)/2 + (Math.random()-0.5)*15, hy + (sy-hy)/2 + (Math.random()-0.5)*15);
    c.lineTo(sx, sy); c.stroke();
    
    c.fillStyle = 'rgba(100, 200, 255, 0.4)';
    c.fillRect(sx - 20, sy - 25, 40, 5);
    clearGlow(c);
}

function drawVoidExplosion(c: CanvasRenderingContext2D, x: number, y: number, t: number) {
    const r = Math.pow(t, 1.5) * 1000;
    
    c.save();
    // Distortion/Heat distortion simulation (lens flare-y rays)
    const rayCount = 8;
    for(let i=0; i<rayCount; i++) {
        const ang = (i / rayCount) * Math.PI * 2 + t * 5;
        const lx = x + Math.cos(ang) * r * 1.5;
        const ly = y + Math.sin(ang) * r * 1.5;
        const grad = c.createLinearGradient(x, y, lx, ly);
        grad.addColorStop(0, '#ff4655');
        grad.addColorStop(1, 'transparent');
        c.strokeStyle = grad;
        c.lineWidth = 30 * (1-t);
        c.beginPath(); c.moveTo(x, y); c.lineTo(lx, ly); c.stroke();
    }

    const grd = c.createRadialGradient(x, y, 0, x, y, r);
    grd.addColorStop(0, '#000000');
    grd.addColorStop(0.85, '#000000');
    grd.addColorStop(0.95, '#ff4655');
    grd.addColorStop(1, 'transparent');

    c.fillStyle = grd;
    c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill();
    c.restore();
}

function drawAscentText(c: CanvasRenderingContext2D, x: number, y: number, t: number) {
    if (t <= 0) return;
    c.save();
    c.globalAlpha = easeOut(t);
    applyGlow(c, '#ffffff', 25);
    
    c.fillStyle = '#ffffff';
    c.font = 'bold 84px "Rajdhani", sans-serif';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText('ASCENT', x, y - 10);
    
    clearGlow(c);
    c.fillStyle = 'rgba(255, 70, 70, 0.9)';
    c.font = 'bold 22px "Rajdhani", sans-serif';
    c.letterSpacing = '10px';
    c.fillText('PROTOCOL OMEGA', x, y + 45);
    c.restore();
}

// ─── Scene state engine (preserved logic) ────────────────────

interface SoldierState {
    x: number; y: number; dir: number; armAng: number; lean: number; backArm: number; 
    gun: boolean; crouch: number; rotation: number; dead: boolean; visible: boolean; stride: number;
}
interface Bullet { x: number; y: number; dir: number }

function getScene(t: number) {
    const p = clamp((t % CYCLE) / CYCLE);
    const GY = 190;

    let left: SoldierState = { x: -40, y: GY, dir: 1, armAng: 1.5, lean: 0, backArm: 1.5, gun: true, crouch: 0, rotation: 0, dead: false, visible: true, stride: 0 };
    let right: SoldierState = { x: 520, y: GY, dir: -1, armAng: 1.5, lean: 0, backArm: 1.5, gun: true, crouch: 0, rotation: 0, dead: false, visible: true, stride: 0 };
    
    let bullets: Bullet[] = [];
    let flashes: number[][] = []; 
    let sniperLaser: number[] | null = null;
    let defusing = false;
    let spikeInt = 0.2;
    let spikeLev = 0;
    let voidR = null;
    let textFade = null;

    const pr = (s: number, e: number) => clamp((p - s) / (e - s));
    const walkArm = Math.sin(t * 0.02) * 1.2;
    const legSwing = Math.sin(t * 0.02);

    if (p < 0.12) {
        const wt = easeOut(pr(0.0, 0.12));
        left.x = lerp(-40, 180, wt); left.armAng = 1.2 + walkArm; left.backArm = 1.2 - walkArm; left.stride = legSwing;
        right.x = lerp(520, 300, wt); right.armAng = 1.2 - walkArm; right.backArm = 1.2 + walkArm; right.stride = -legSwing;
    }
    else if (p < 0.38) {
        if (p < 0.18) {
            left.x = 180; left.armAng = -0.1; right.x = 300; right.armAng = -0.1;
            if (p > 0.14 && p < 0.17) {
                const bx = (t * 0.8) % 480;
                if (bx > left.x && bx < right.x) {
                    bullets.push({ x: bx, y: GY - 39 + (Math.random()-0.5)*10, dir: 1 });
                    bullets.push({ x: right.x - (bx - left.x), y: GY - 39 + (Math.random()-0.5)*10, dir: -1 });
                }
            }
        } 
        else if (p < 0.25) {
            const jp = easeInOut(pr(0.18, 0.25));
            left.x = lerp(180, 340, jp);
            left.y = GY - Math.sin(jp * Math.PI) * 120;
            left.rotation = jp * Math.PI * 2;
            left.crouch = -1; left.armAng = Math.PI / 2;
            right.x = 300; right.crouch = 0.8; right.armAng = -0.5;
        }
        else if (p < 0.32) {
            left.x = 340; left.y = GY; left.dir = -1; left.armAng = -0.1; left.crouch = 1;
            right.x = 300; right.dir = 1; right.armAng = -0.1;
        }
        else {
            left.x = 340; left.dir = -1; left.armAng = -0.1; left.crouch = 1;
            const rt = easeOut(pr(0.32, 0.38));
            right.dir = 1; right.x = lerp(300, 80, rt); right.y = lerp(GY, GY - 90, rt); right.crouch = -0.5; right.rotation = -rt * Math.PI * 2;
        }
    }
    else if (p < 0.58) {
        right.x = 80; right.y = GY - 90; right.dir = 1; 
        left.x = 340; left.y = GY; left.dir = -1;

        if (p < 0.44) {
            right.armAng = 0.3; right.crouch = 0;
            left.crouch = 0; left.armAng = 1.3;
        } else if (p < 0.52) {
            const neo = pr(0.44, 0.48);
            left.rotation = lerp(0, Math.PI / 3, easeOut(neo));
            left.crouch = lerp(0, 1.0, easeOut(neo));
            left.armAng = lerp(1.3, -0.6, easeOut(neo));
            right.armAng = 0.3;
            if (p > 0.50) {
                const sFade = 1 - pr(0.50, 0.52);
                sniperLaser = [80 + 30, GY - 110, 480, GY - 75, sFade];
            }
        } else {
            const rec = pr(0.52, 0.55);
            left.rotation = lerp(Math.PI / 3, 0, easeOut(rec));
            left.crouch = lerp(1.0, 0, easeOut(rec));
            left.armAng = -0.2;
            
            if (rec < 1) {
                bullets.push({ x: lerp(340, 80, rec), y: lerp(GY - 40, GY - 130, rec), dir: -1 });
            } else {
                right.dead = true;
                const fall = pr(0.55, 0.58);
                right.x = lerp(80, 50, fall); right.y = lerp(GY - 90, GY, easeIn(fall)); right.rotation = fall * Math.PI;
            }
        }
    }
    else if (p < 0.77) {
        right.visible = false;
        const run = easeOut(pr(0.58, 0.63));
        left.dir = -1; left.x = lerp(340, 240, run); left.y = GY;
        left.gun = p < 0.62; left.armAng = p > 0.62 ? 1.5 : -0.2;
        left.stride = p < 0.63 ? Math.sin(t * 0.04) : 0;
        
        if (p > 0.63) {
            left.crouch = 1; left.stride = 0;
            left.armAng = 1.0 + Math.sin(t*0.05)*0.1; left.backArm = 1.0 + Math.cos(t*0.05)*0.1;
            defusing = true; spikeInt = 0.5 + Math.sin(t*0.1)*0.2;
        }
    }
    else if (p < 0.85) {
        right.visible = false; left.gun = false; defusing = false;
        const shock = easeOut(pr(0.77, 0.80));
        left.x = lerp(240, 320, shock); left.crouch = lerp(1, 0, shock); 
        left.armAng = -1.5; left.backArm = -1.5; left.stride = shock < 1 ? Math.sin(t * 0.05) : 0;
        spikeLev = lerp(0, 30, pr(0.77, 0.85)); spikeInt = 1.0 + pr(0.77, 0.85) * 2.0;
        if (p > 0.82) {
            left.x = lerp(320, 380, easeIn(pr(0.82, 0.85)));
            left.armAng = 1.2 + walkArm * 2; left.stride = Math.sin(t * 0.06) * 1.5;
        }
    }
    else if (p < 0.92) {
        left.visible = false; right.visible = false;
        voidR = pr(0.85, 0.92);
    }
    else {
        left.visible = false; right.visible = false;
        voidR = 1; textFade = pr(0.92, 0.98);
    }

    return { left, right, bullets, flashes, sniperLaser, defusing, voidR, textFade, spikeInt, spikeLev, GY };
}

// ─── Main Component ──────────────────────────────────────────

const AsciiShootout: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const accumulatedTime = useRef(0);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.65 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    useEffect(() => {
        if (!visible) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        let W = canvas.parentElement!.clientWidth;
        let H = canvas.parentElement!.clientHeight;
        canvas.width = W;
        canvas.height = H;

        let running = true;
        let lastFrame = performance.now();

        const loop = (now: number) => {
            if (!running) return;
            const dt = now - lastFrame;
            lastFrame = now;
            accumulatedTime.current += dt;
            const elapsed = accumulatedTime.current;

            const scale = Math.min(W / OW, H / OH);
            const offsetX = (W - OW * scale) / 2;
            const offsetY = (H - OH * scale) / 2;

            // Background
            ctx.fillStyle = '#08080a';
            ctx.fillRect(0, 0, W, H);

            // Frame scaling
            ctx.save();
            ctx.translate(offsetX, offsetY);
            ctx.scale(scale, scale);

            const scene = getScene(elapsed);

            // Ground line (glowing)
            ctx.strokeStyle = 'rgba(255,46,85,0.1)';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(10, scene.GY); ctx.lineTo(OW - 10, scene.GY); ctx.stroke();

            drawLedge(ctx, 80, scene.GY - 90);
            if (scene.voidR === null) drawSpike(ctx, 240, scene.GY, scene.spikeInt, scene.spikeLev);

            if (scene.left.visible) drawFigure(ctx, scene.left.x, scene.left.y, scene.left.dir, scene.left.armAng, scene.left.lean, scene.left.backArm, scene.left.gun, scene.left.crouch, scene.left.rotation, scene.left.dead, scene.left.stride);
            if (scene.right.visible) drawFigure(ctx, scene.right.x, scene.right.y, scene.right.dir, scene.right.armAng, scene.right.lean, scene.right.backArm, scene.right.gun, scene.right.crouch, scene.right.rotation, scene.right.dead, scene.right.stride);

            scene.bullets.forEach(b => drawBullet(ctx, b.x, b.y, b.dir));
            if (scene.sniperLaser) drawSniperLaser(ctx, scene.sniperLaser[0], scene.sniperLaser[1], scene.sniperLaser[2], scene.sniperLaser[3], scene.sniperLaser[4]);

            if (scene.voidR !== null) drawVoidExplosion(ctx, 240, scene.GY - 30, scene.voidR);
            if (scene.textFade !== null) drawAscentText(ctx, 240, 110, scene.textFade);

            ctx.restore();

            // HUD Overlays
            ctx.globalAlpha = 0.3;
            ctx.strokeStyle = '#ff4655';
            ctx.lineWidth = 1.5;
            const cm = 30;
            ctx.beginPath();
            ctx.moveTo(cm, 10); ctx.lineTo(10, 10); ctx.lineTo(10, cm);
            ctx.moveTo(W - cm, 10); ctx.lineTo(W - 10, 10); ctx.lineTo(W - 10, cm);
            ctx.moveTo(cm, H - 10); ctx.lineTo(10, H - 10); ctx.lineTo(10, H - cm);
            ctx.moveTo(W - cm, H - 10); ctx.lineTo(W - 10, H - 10); ctx.lineTo(W - 10, H - cm);
            ctx.stroke();

            ctx.globalAlpha = 1;
            requestAnimationFrame(loop);
        };

        const raf = requestAnimationFrame(loop);
        const onResize = () => {
             W = canvas.parentElement!.clientWidth; H = canvas.parentElement!.clientHeight;
             canvas.width = W; canvas.height = H;
        };
        window.addEventListener('resize', onResize);
        return () => { running = false; cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
    }, [visible]);

    return (
        <div ref={containerRef} className="relative w-full h-[60vh] md:h-[70vh] bg-[#08080a] overflow-hidden">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>
    );
};

export default AsciiShootout;
