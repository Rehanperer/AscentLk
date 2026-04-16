import React, { useRef, useEffect, useState } from 'react';

/**
 * AsciiShootout — 26s Valorant-inspired cinematic ASCII animation.
 * Features ultra-smooth fluid dynamics, a Matrix Gun-Fu duel, Void Explosion, and ASCII Text resolve.
 */

const CHARS = '@#$%&*+XO0!?=-:.';
const OW = 480, OH = 240;
const CYCLE = 26000; // 26 seconds

const clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * clamp(t);
const easeOut = (t: number) => 1 - (1 - clamp(t)) ** 3;
const easeIn = (t: number) => clamp(t) ** 2;
const easeInOut = (t: number) => { const t2 = clamp(t); return t2 < 0.5 ? 2*t2*t2 : 1 - (-2*t2+2)**2/2; };

// ─── Drawing helpers ─────────────────────────────────────────

function drawLedge(c: CanvasRenderingContext2D, x: number, y: number) {
    c.fillStyle = 'rgba(255,255,255,0.3)';
    c.fillRect(x - 35, y, 70, 8);
    c.fillStyle = 'rgba(255,255,255,0.1)';
    c.fillRect(x - 20, y + 8, 40, 82); // pillar reaching ground
}

function drawSpike(c: CanvasRenderingContext2D, x: number, y: number, intensity: number, levitate: number) {
    const floatY = y - levitate;
    
    // Holographic aura
    if (intensity > 0) {
        c.fillStyle = `rgba(255, 50, 50, ${intensity * 0.4})`;
        c.beginPath(); c.arc(x, floatY - 10, 10 + intensity * 40, 0, Math.PI * 2); c.fill();
    }
    
    // Base pedestal
    c.fillStyle = 'rgba(180,180,200,0.9)';
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
    c.fillStyle = `rgba(255, 20, 20, ${0.5 + intensity * 0.5})`;
    c.beginPath(); c.arc(x, coreY, 4, 0, Math.PI * 2); c.fill();
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
    
    const col = 'rgba(255,255,255,1)';
    const gunCol = 'rgba(200,200,220,1)';
    const lx = lean * dir;
    const cy = crouch * -10; 

    // head
    c.fillStyle = col;
    c.beginPath();
    c.arc(lx * 2, cy - 54, 6, 0, Math.PI * 2);
    c.fill();

    // torso
    c.fillRect(lx - 5, cy - 43, 10, Math.max(10, 26 + crouch * 10));

    // legs
    c.strokeStyle = col; c.lineWidth = 3.5;
    if (crouch < 0) {
        c.beginPath(); c.moveTo(0, cy - 17); c.lineTo(-8, -8); c.lineTo(-4, 0); c.stroke();
        c.beginPath(); c.moveTo(0, cy - 17); c.lineTo(8, -8); c.lineTo(4, 0); c.stroke();
    } else {
        const swing = stride * 8; // leg spread distance
        // back leg
        c.beginPath(); c.moveTo(-2, cy - 17); c.lineTo(-2 - swing, 0); c.stroke();
        // front leg
        c.beginPath(); c.moveTo(2, cy - 17); c.lineTo(2 + swing, 0); c.stroke();
    }

    // front arm
    const sx = lx + 5 * dir, sy = cy - 39;
    const armL = 14;
    const ax = sx + Math.cos(armAng) * armL * dir;
    const ay = sy + Math.sin(armAng) * armL;
    c.strokeStyle = col; c.lineWidth = 4; c.lineCap = 'round';
    c.beginPath(); c.moveTo(sx, sy); c.lineTo(ax, ay); c.stroke();

    // back arm
    const bsx = lx - 3 * dir, bsy = cy - 36;
    const bax = bsx + Math.cos(backArmAng) * 9 * dir;
    const bay = bsy + Math.sin(backArmAng) * 9;
    c.strokeStyle = 'rgba(255,255,255,0.7)'; c.lineWidth = 3;
    c.beginPath(); c.moveTo(bsx, bsy); c.lineTo(bax, bay); c.stroke();

    // gun
    if (drawGun) {
        const gunL = 20;
        const gx = ax + Math.cos(armAng) * gunL * dir;
        const gy = ay + Math.sin(armAng) * gunL;
        // barrel
        c.strokeStyle = gunCol; c.lineWidth = 3;
        c.beginPath(); c.moveTo(ax, ay); c.lineTo(gx, gy); c.stroke();
        // stock
        c.strokeStyle = 'rgba(180,180,190,0.8)'; c.lineWidth = 2.5;
        c.beginPath();
        c.moveTo(ax, ay);
        c.lineTo(ax - Math.cos(armAng) * 8 * dir, ay - Math.sin(armAng) * 8);
        c.stroke();
    }
    
    c.restore();
}

function drawMuzzleFlash(c: CanvasRenderingContext2D, x: number, y: number, size: number) {
    c.fillStyle = 'rgba(255,255,200,0.95)';
    c.beginPath(); c.arc(x, y, size * 2, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#ffffff';
    c.beginPath(); c.arc(x, y, size, 0, Math.PI * 2); c.fill();
}

function drawBullet(c: CanvasRenderingContext2D, x: number, y: number, dir: number) {
    c.fillStyle = 'rgba(255,100,100,0.6)';
    c.beginPath(); c.arc(x, y, 4, 0, Math.PI * 2); c.fill();
    c.strokeStyle = '#ffffff'; c.lineWidth = 2; c.lineCap = 'round';
    c.beginPath(); c.moveTo(x - 12 * dir, y); c.lineTo(x + 4 * dir, y); c.stroke();
}

function drawSniperLaser(c: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, fade: number) {
    c.strokeStyle = `rgba(255, 40, 40, ${fade * 0.8})`; c.lineWidth = 8;
    c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
    c.strokeStyle = `rgba(255, 200, 200, ${fade})`; c.lineWidth = 3;
    c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
}

function drawDefuseHolo(c: CanvasRenderingContext2D, hx: number, hy: number, sx: number, sy: number) {
    c.strokeStyle = `rgba(100, 200, 255, ${0.4 + Math.random() * 0.4})`; c.lineWidth = 2;
    c.beginPath(); c.moveTo(hx, hy); 
    c.lineTo(hx + (sx-hx)/2 + (Math.random()-0.5)*10, hy + (sy-hy)/2 + (Math.random()-0.5)*10);
    c.lineTo(sx, sy); c.stroke();
    
    c.fillStyle = 'rgba(100, 200, 255, 0.6)';
    c.fillRect(sx - 15, sy - 20, 30, 4);
}

function drawVoidExplosion(c: CanvasRenderingContext2D, x: number, y: number, t: number) {
    const r = Math.pow(t, 2) * 600; // quadratic expansion
    // The violent edge (survives pixel threshold)
    c.globalCompositeOperation = 'source-over';
    c.fillStyle = `rgba(255, ${20 + Math.random()*50}, 20, 0.9)`;
    c.beginPath(); c.arc(x, y, r + 15, 0, Math.PI * 2); c.fill();
    
    // The VOID: Pure black (#000000) falls below brightness threshold, literally deleting particles.
    c.fillStyle = '#000000';
    c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill();
}

function drawAscentText(c: CanvasRenderingContext2D, x: number, y: number, t: number) {
    if (t <= 0) return;
    c.fillStyle = `rgba(255, 255, 255, ${easeOut(t)})`;
    c.font = 'bold 74px "Courier New", monospace';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText('ASCENT', x, y - 10);
    
    c.fillStyle = `rgba(255, 70, 70, ${easeOut(t) * 0.8})`;
    c.font = 'bold 20px "Courier New", monospace';
    c.fillText('PROTOCOL OMEGA', x, y + 40);
}

// ─── Scene state ─────────────────────────────────────────────

interface SoldierState {
    x: number; y: number; dir: number; armAng: number; lean: number; backArm: number; 
    gun: boolean; crouch: number; rotation: number; dead: boolean; visible: boolean; stride: number;
}

interface Bullet { x: number; y: number; dir: number }

function getScene(t: number) {
    const p = clamp((t % CYCLE) / CYCLE);
    const GY = 190;
    const SPIKE_X = 240;

    let left: SoldierState = { x: -40, y: GY, dir: 1, armAng: 1.5, lean: 0, backArm: 1.5, gun: true, crouch: 0, rotation: 0, dead: false, visible: true, stride: 0 };
    let right: SoldierState = { x: 520, y: GY, dir: -1, armAng: 1.5, lean: 0, backArm: 1.5, gun: true, crouch: 0, rotation: 0, dead: false, visible: true, stride: 0 };
    
    let bullets: Bullet[] = [];
    let flashes: number[][] = []; 
    let sniperLaser: number[] | null = null; // [x1, y1, x2, y2, fade]
    let defusing = false;
    
    let spikeInt = 0.2;
    let spikeLev = 0;
    
    let voidR = null; // t
    let textFade = null; // t

    const pr = (s: number, e: number) => clamp((p - s) / (e - s));
    const walkArm = Math.sin(t * 0.02) * 1.2;
    const legSwing = Math.sin(t * 0.02);

    // ── 0.00-0.12: Tactical Infiltration ──
    if (p < 0.12) {
        const wt = easeOut(pr(0.0, 0.12));
        left.x = lerp(-40, 180, wt); left.armAng = 1.2 + walkArm; left.backArm = 1.2 - walkArm; left.y = GY - Math.abs(Math.sin(t * 0.03)) * 4 + 4; left.stride = legSwing;
        right.x = lerp(520, 300, wt); right.armAng = 1.2 - walkArm; right.backArm = 1.2 + walkArm; right.y = GY - Math.abs(Math.sin(t * 0.03)) * 4 + 4; right.stride = -legSwing;
    }
    // ── 0.12-0.38: Matrix Gun-Fu ──
    else if (p < 0.38) {
        if (p < 0.18) {
            // Stand-off close range
            left.x = 180; left.armAng = -0.1; right.x = 300; right.armAng = -0.1;
            if (p > 0.14 && p < 0.17) {
                if (Math.random() > 0.5) flashes.push([180 + 35, GY - 41, Math.random() * 8]);
                if (Math.random() > 0.5) flashes.push([300 - 35, GY - 41, Math.random() * 8]);
                const bx = (t * 0.8) % 480;
                if (bx > left.x && bx < right.x) {
                    bullets.push({ x: bx, y: GY - 39 + (Math.random()-0.5)*10, dir: 1 });
                    bullets.push({ x: right.x - (bx - left.x), y: GY - 39 + (Math.random()-0.5)*10, dir: -1 });
                }
            }
        } 
        else if (p < 0.25) {
            // Left jumps massive arc OVER right
            const jp = easeInOut(pr(0.18, 0.25));
            left.x = lerp(180, 340, jp);
            left.y = GY - Math.sin(jp * Math.PI) * 120;
            left.rotation = jp * Math.PI * 2; // Front flip over!
            left.crouch = -1; // Tucked legs
            left.armAng = Math.PI / 2; // Aims down
            
            // Right ducks under it
            right.x = 300; right.crouch = 0.8; right.armAng = -0.5;
            
            // Left shooting downwards while flipping
            if (jp > 0.3 && jp < 0.7) {
                flashes.push([left.x, left.y + 20, Math.random() * 8]);
                bullets.push({ x: left.x, y: lerp(left.y + 20, GY, Math.random()), dir: 0 }); // downwards
            }
        }
        else if (p < 0.32) {
            // Landed crossed!
            left.x = 340; left.y = GY; left.dir = -1; left.armAng = -0.1; left.crouch = 1; // Left crouched facing left
            right.x = 300; right.dir = 1; right.armAng = -0.1; // Right standing facing right
            
            // Intense crossfire
            if (Math.random() > 0.5) flashes.push([left.x - 35, GY - 31, Math.random() * 8]);
            if (Math.random() > 0.5) flashes.push([right.x + 35, GY - 41, Math.random() * 8]);
        }
        else {
            // Right realizes he's trapped, jumps back and UP to ledge
            left.x = 340; left.dir = -1; left.armAng = -0.1; left.crouch = 1;
            const rt = easeOut(pr(0.32, 0.38));
            right.dir = 1;
            right.x = lerp(300, 80, rt);
            right.y = lerp(GY, GY - 90, rt);
            right.crouch = -0.5;
            right.rotation = -rt * Math.PI * 2; // backward jump flip
        }
    }
    // ── 0.38-0.58: Sniper Retreat ──
    else if (p < 0.58) {
        right.x = 80; right.y = GY - 90; right.dir = 1; 
        left.x = 340; left.y = GY; left.dir = -1;

        if (p < 0.44) {
            // Right stands, aims sniper heavy
            right.armAng = 0.3; right.lean = 5; right.crouch = 0;
            left.crouch = 0; left.armAng = 1.3;
        } else if (p < 0.52) {
            // Left enters Neo DODGE
            const neo = pr(0.44, 0.48);
            left.lean = lerp(0, -4, easeOut(neo)); // minor shift
            left.rotation = lerp(0, Math.PI / 3, easeOut(neo)); // Matrix Bend rightwards pivoting at feet
            left.crouch = lerp(0, 1.0, easeOut(neo)); // deeply crouch while bending back
            left.armAng = lerp(1.3, -0.6, easeOut(neo));
            
            // Right charges
            right.armAng = 0.3; right.lean = 5;
            
            // SNIPER FIRE
            if (p > 0.50) {
                const sFade = 1 - pr(0.50, 0.52);
                sniperLaser = [80 + 30, GY - 110, 480, GY - 75, sFade]; // Shoot higher so Left ducks under it
                flashes.push([80 + 35, GY - 110, 20 * sFade]); // massive flash
            }
        } else {
            // Left recovers and bursts
            const rec = pr(0.52, 0.55);
            left.lean = lerp(-4, 0, easeOut(rec));
            left.rotation = lerp(Math.PI / 3, 0, easeOut(rec)); // Snap back upright
            left.crouch = lerp(1.0, 0, easeOut(rec));
            left.armAng = -0.2;
            
            if (rec < 1) {
                bullets.push({ x: lerp(340, 80, rec), y: lerp(GY - 40, GY - 130, rec), dir: -1 });
                flashes.push([340 - 35, GY - 41, Math.random() * 8]);
            } else {
                // Right dies and falls
                right.dead = true;
                const fall = pr(0.55, 0.58);
                right.x = lerp(80, 50, fall);
                right.y = lerp(GY - 90, GY, easeIn(fall)); // accelerates down
                right.rotation = fall * Math.PI; // limp spin
            }
        }
    }
    // ── 0.58-0.77: Defusal Protocol ──
    else if (p < 0.77) {
        right.visible = false;
        
        const run = easeOut(pr(0.58, 0.63));
        left.dir = -1; left.x = lerp(340, 240, run); left.y = GY;
        left.gun = p < 0.62;
        left.armAng = p > 0.62 ? 1.5 : -0.2;
        left.stride = p < 0.63 ? Math.sin(t * 0.04) : 0;
        
        if (p > 0.63) {
            // Defusing!
            left.crouch = 1; left.lean = 5; left.stride = 0;
            left.armAng = 1.0 + Math.sin(t*0.05)*0.1; left.backArm = 1.0 + Math.cos(t*0.05)*0.1;
            defusing = true;
            spikeInt = 0.5 + Math.sin(t*0.1)*0.2; // stabilized pulse
        }
    }
    // ── 0.77-0.85: Critical Failure ──
    else if (p < 0.85) {
        right.visible = false; left.gun = false; defusing = false;
        
        const shock = easeOut(pr(0.77, 0.80));
        left.x = lerp(240, 320, shock); left.crouch = lerp(1, 0, shock); 
        left.armAng = -1.5; left.backArm = -1.5; left.lean = -5; // hands up in horror
        left.stride = shock < 1 ? Math.sin(t * 0.05) : 0;
        
        // Spike goes crazy
        spikeLev = lerp(0, 30, pr(0.77, 0.85)); // Floats up
        spikeInt = 1.0 + pr(0.77, 0.85) * 2.0; // Overglows
        
        if (p > 0.82) {
            left.x = lerp(320, 380, easeIn(pr(0.82, 0.85))); // starts bolting away
            left.armAng = 1.2 + walkArm * 2; left.backArm = 1.2 - walkArm * 2;
            left.stride = Math.sin(t * 0.06) * 1.5; // frantic running
        }
    }
    // ── 0.85-0.92: VOID EXPLOSION ──
    else if (p < 0.92) {
        left.visible = false; right.visible = false;
        voidR = pr(0.85, 0.92);
    }
    // ── 0.92-1.0: ASCENT TEXT ──
    else {
        left.visible = false; right.visible = false;
        voidR = 1; // keep void full
        textFade = pr(0.92, 0.98);
    }

    return { left, right, bullets, flashes, sniperLaser, defusing, voidR, textFade, spikeInt, spikeLev, GY };
}

// ─── Component ───────────────────────────────────────────────

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

        const off = document.createElement('canvas');
        off.width = OW; off.height = OH;
        const oc = off.getContext('2d', { willReadFrequently: true })!;

        const scale = Math.min(W / OW, H / OH);
        const offsetX = (W - OW * scale) / 2;
        const offsetY = (H - OH * scale) / 2;
        
        const gap = W < 600 ? 5 : 4; 

        interface Pt {
            x: number; y: number; vx: number; vy: number; tx: number; ty: number;
            char: string; cr: number; cg: number; cb: number; active: boolean;
        }

        const cols = Math.ceil(OW / gap);
        const rows = Math.ceil(OH / gap);
        const particles: Pt[] = [];
        
        for (let gy = 0; gy < rows; gy++) {
            for (let gx = 0; gx < cols; gx++) {
                const initX = (gx * gap + gap / 2) * scale + offsetX;
                const initY = (gy * gap + gap / 2) * scale + offsetY;
                particles.push({
                    x: initX + (Math.random()-0.5)*W, y: initY + (Math.random()-0.5)*H,
                    vx: 0, vy: 0, tx: initX, ty: initY,
                    char: CHARS[Math.floor(Math.random() * CHARS.length)],
                    cr: 0, cg: 0, cb: 0, active: false,
                });
            }
        }

        let running = true;
        let lastFrame = performance.now();
        const charSize = W < 500 ? 7 : 9;

        const loop = (now: number) => {
            if (!running) return;
            const dt = now - lastFrame;
            lastFrame = now;
            accumulatedTime.current += dt;
            const elapsed = accumulatedTime.current;

            // ── Draw scene on offscreen canvas ──
            oc.clearRect(0, 0, OW, OH);
            const scene = getScene(elapsed);

            // Ground/Floor
            oc.fillStyle = 'rgba(255,255,255,0.1)';
            oc.fillRect(10, scene.GY, OW - 20, 1);

            // Floating Ledge (persistent)
            drawLedge(oc, 80, scene.GY - 90);

            // Spike
            if (scene.voidR === null) drawSpike(oc, 240, scene.GY, scene.spikeInt, scene.spikeLev);

            // Characters
            if (scene.left.visible) drawFigure(oc, scene.left.x, scene.left.y, scene.left.dir, scene.left.armAng, scene.left.lean, scene.left.backArm, scene.left.gun, scene.left.crouch, scene.left.rotation, scene.left.dead, scene.left.stride);
            if (scene.right.visible) drawFigure(oc, scene.right.x, scene.right.y, scene.right.dir, scene.right.armAng, scene.right.lean, scene.right.backArm, scene.right.gun, scene.right.crouch, scene.right.rotation, scene.right.dead, scene.right.stride);

            // Munitions
            scene.bullets.forEach(b => drawBullet(oc, b.x, b.y, b.dir));
            scene.flashes.forEach(f => drawMuzzleFlash(oc, f[0], f[1], f[2]));
            if (scene.sniperLaser) drawSniperLaser(oc, scene.sniperLaser[0], scene.sniperLaser[1], scene.sniperLaser[2], scene.sniperLaser[3], scene.sniperLaser[4]);
            
            // Defuse Wires
            if (scene.defusing) {
                drawDefuseHolo(oc, scene.left.x - 20, scene.left.y - 10, 240, scene.GY - 10);
                drawDefuseHolo(oc, scene.left.x - 25, scene.left.y - 8, 240, scene.GY - 10);
            }

            // Void & Text
            if (scene.voidR !== null) drawVoidExplosion(oc, 240, scene.GY - 30, scene.voidR);
            if (scene.textFade !== null) drawAscentText(oc, 240, scene.GY - 30, scene.textFade);

            // ── Sample pixels ──
            // Using pure black (#000000) inside Void will explicitly map to active=false
            const imgData = oc.getImageData(0, 0, OW, OH).data;
            let idx = 0;
            const threshold = 15;

            for (let gy = 0; gy < rows; gy++) {
                for (let gx = 0; gx < cols; gx++) {
                    const px = Math.min(gx * gap + Math.floor(gap / 2), OW - 1);
                    const py = Math.min(gy * gap + Math.floor(gap / 2), OH - 1);
                    const i = (py * OW + px) * 4;
                    const bright = (imgData[i] + imgData[i + 1] + imgData[i + 2]) / 3;

                    const pt = particles[idx];
                    
                    if (bright > threshold) {
                        pt.active = true;
                        pt.cr = imgData[i]; pt.cg = imgData[i + 1]; pt.cb = imgData[i + 2];
                        if (Math.random() < 0.05) pt.char = CHARS[Math.floor(Math.random() * CHARS.length)];
                    } else {
                        pt.active = false;
                    }
                    idx++;
                }
            }

            // ── Ultra-Smooth Fluid Physics ──
            const spring = 0.12;   
            const friction = 0.78; 

            for (let i = 0; i < particles.length; i++) {
                const pt = particles[i];
                if (pt.active) {
                    pt.vx += (pt.tx - pt.x) * spring;
                    pt.vy += (pt.ty - pt.y) * spring;
                } else {
                    // gentle drift to the void when erased
                    if (scene.voidR !== null && scene.textFade === null) {
                        // Suck into the black hole!
                        const cx = 240 * scale + offsetX;
                        const cy = (scene.GY - 30) * scale + offsetY;
                        pt.vx += (cx - pt.x) * 0.02;
                        pt.vy += (cy - pt.y) * 0.02;
                    } else {
                        pt.vx *= 0.96; pt.vy *= 0.96; 
                    }
                }
                pt.vx *= friction; pt.vy *= friction;
                pt.x += pt.vx; pt.y += pt.vy;
            }

            // ── Render ──
            // Clear trail buffer
            let trail = scene.voidR !== null ? 0.3 : 0.35;
            ctx.fillStyle = `rgba(8, 8, 10, ${trail})`;
            ctx.fillRect(0, 0, W, H);

            ctx.font = `${charSize}px "Courier New", monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            for (let i = 0; i < particles.length; i++) {
                const pt = particles[i];
                if (!pt.active && (scene.voidR === null)) continue; // Keep rendering inactive particles falling into void
                if (!pt.active && scene.textFade !== null) continue; // Hide them completely once text surfaces

                const d = Math.abs(pt.x - pt.tx) + Math.abs(pt.y - pt.ty);
                const a = pt.active ? clamp(1 - d / 50, 0.15, 0.95) : clamp(Math.random(), 0, 0.4); // faint glitch if inactive

                if (d < 10 && pt.active) {
                    ctx.fillStyle = `rgba(${pt.cr},${pt.cg},${pt.cb},${a})`;
                } else {
                    ctx.fillStyle = pt.active ? `rgba(255, 70, 85, ${a * 0.7})` : `rgba(20, 0, 0, ${a})`;
                }
                ctx.fillText(pt.char, pt.x, pt.y);
            }

            // ── HUD Overlay ──
            ctx.globalAlpha = 0.25;
            ctx.strokeStyle = '#ff4655';
            ctx.lineWidth = 1;
            const cm = 22;
            ctx.beginPath();
            ctx.moveTo(cm, 10); ctx.lineTo(10, 10); ctx.lineTo(10, cm);
            ctx.moveTo(W - cm, 10); ctx.lineTo(W - 10, 10); ctx.lineTo(W - 10, cm);
            ctx.moveTo(cm, H - 10); ctx.lineTo(10, H - 10); ctx.lineTo(10, H - cm);
            ctx.moveTo(W - cm, H - 10); ctx.lineTo(W - 10, H - 10); ctx.lineTo(W - 10, H - cm);
            ctx.stroke();

            ctx.globalAlpha = 0.5;
            ctx.font = `${W < 500 ? 7 : 10}px "Courier New", monospace`;
            ctx.textAlign = 'center';
            const phase = (elapsed % CYCLE) / CYCLE;
            let status = '// INFILTRATING';
            if (phase >= 0.12 && phase < 0.38) status = '// LETHAL_ENGAGEMENT';
            else if (phase >= 0.38 && phase < 0.58) status = '// EVASIVE_MANEUVERS';
            else if (phase >= 0.58 && phase < 0.77) status = '// DEFUSAL_INITIATED';
            else if (phase >= 0.77 && phase < 0.85) status = '// CORE_DESTABILIZATION_IMMINENT';
            else if (phase >= 0.85 && phase < 0.92) status = '// ANOMALY_DETECTED';
            else if (phase >= 0.92 && phase < 1.0) status = '// INITIALIZING_ASCENT';
            
            ctx.fillStyle = scene.voidR !== null ? '#ffffff' : '#ff4655';
            ctx.fillText(status, W / 2, H - 18);
            ctx.globalAlpha = 1;

            requestAnimationFrame(loop);
        };

        const raf = requestAnimationFrame(loop);

        const onResize = () => {
             W = canvas.parentElement!.clientWidth;
             H = canvas.parentElement!.clientHeight;
             canvas.width = W; canvas.height = H;
        };
        window.addEventListener('resize', onResize);

        return () => {
            running = false;
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', onResize);
        };
    }, [visible]);

    return (
        <div
            ref={containerRef}
            className="relative w-full h-[60vh] md:h-[70vh] bg-[#08080a] overflow-hidden"
        >
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>
    );
};

export default AsciiShootout;
