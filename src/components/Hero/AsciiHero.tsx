import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// ── ASCII chars used for the morph ──
const CHARS = 'ASCENT20@#$%&*+O0X!?=-:.';

// ── Phase timing (ms) ──
const T_EXPLODE = 1800;
const T_SPIRAL  = 4000;
const T_WAVE    = 5800;
const T_FORM    = 8000;

interface Particle {
    x: number; y: number;
    vx: number; vy: number;
    tx: number; ty: number;
    char: string;
    color: string;
    baseAlpha: number;
    orbitSpeed: number;
}

interface Spark {
    x: number; y: number;
    vx: number; vy: number;
    life: number;
    maxLife: number;
    char: string;
}

const AsciiDemoPage: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [logoVisible, setLogoVisible] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        let animId = 0;
        let W = window.innerWidth;
        let H = window.innerHeight;
        canvas.width = W;
        canvas.height = H;

        const mouse = { x: -9999, y: -9999 };
        let cx = W / 2;
        let cy = H / 2;

        let particles: Particle[] = [];
        let sparks: Spark[] = [];
        
        // Mutable time trackers so init() can safely reset them during resize events
        let lastTime = 0;
        let elapsed = 0;

        let loadedLogo: HTMLImageElement | null = null;
        let logoProps = { x: 0, y: 0, w: 0, h: 0 };
        let textProps = { subSize: 0, subY: 0, mainSize: 0, mainY: 0 };

        let running = true;

        // ── Shared Layout calculation for PERFECT Canvas/DOM match ──
        const getLayout = () => {
            const isMobile = W < 768;
            const _logoW = isMobile ? Math.min(W * 0.5, 300) : Math.min(W * 0.22, 350);
            const _logoH = _logoW; // Square image
            const _logoY = H * 0.05;

            const _subSize = Math.max(Math.min(W * 0.055, 55), 24);
            const _subY = H * 0.52;

            const _mainSize = Math.min(W * 0.18, 220);
            const _mainY = H * 0.70;

            return { _logoW, _logoH, _logoY, _subSize, _subY, _mainSize, _mainY };
        };

        // ────────── INIT: sample text + logo into particle targets ──────────
        const init = async (isResize = false) => {
            cx = W / 2;
            cy = H / 2;
            
            // Wait for fonts but only if not unmounted
            await document.fonts.ready;
            if (!running) return;

            const off = document.createElement('canvas');
            off.width = W;
            off.height = H;
            const o = off.getContext('2d', { willReadFrequently: true })!;

            o.fillStyle = '#000';
            o.fillRect(0, 0, W, H);

            const { _logoW, _logoH, _logoY, _subSize, _subY, _mainSize, _mainY } = getLayout();
            
            logoProps.w = _logoW;
            logoProps.h = _logoH;
            logoProps.x = cx - (_logoW / 2);
            logoProps.y = _logoY;

            // ── 1. Draw new Crest Logo ──
            const logo = new Image();
            logo.src = 'img/crest.jpg';
            await new Promise<void>(r => { logo.onload = () => r(); logo.onerror = () => r(); });
            if (!running) return;

            if (logo.complete && logo.naturalWidth > 0 && logo.naturalHeight > 0) {
                loadedLogo = logo;
                o.drawImage(logo, logoProps.x, logoProps.y, logoProps.w, logoProps.h);
            }

            // ── 2. Draw "2026" and "ASCENT" EXACTLY matching the DOM properties ──
            o.textAlign = 'center';
            o.textBaseline = 'middle';

            textProps.subSize = _subSize;
            textProps.subY = _subY;
            o.font = `700 ${_subSize}px Rajdhani, monospace`;
            o.fillStyle = '#ff4655';
            (o as any).letterSpacing = '0.4em'; // Force canvas to match DOM letter-spacing
            o.fillText('2026', W / 2, _subY);

            textProps.mainSize = _mainSize;
            textProps.mainY = _mainY;
            o.font = `900 ${_mainSize}px Teko, sans-serif`;
            o.fillStyle = '#ffffff';
            (o as any).letterSpacing = '0.1em'; // Matches tracking-widest
            o.fillText('ASCENT', W / 2, _mainY);
            (o as any).letterSpacing = '0px';

            // Reset arrays
            particles = [];
            sparks = [];

            // ── 3. Sample pixels ──
            const data = o.getImageData(0, 0, W, H).data;
            const gap = W < 768 ? 6 : 8; // denser grid
            
            for (let y = 0; y < H; y += gap) {
                for (let x = 0; x < W; x += gap) {
                    const i = (y * W + x) * 4;
                    const r = data[i], g = data[i + 1], b = data[i + 2];

                    // STRICT Threshold to ignore JPEG compression black background noise
                    // The crest.jpg has a black background, which might be rgb(20,20,30).
                    // We only want to sample the vibrant RED and WHITE triangles.
                    if (r > 60 || g > 60 || b > 60) {
                        const bright = (r + g + b) / 3;
                        const isRed = r > g + 40;
                        const angle = Math.random() * Math.PI * 2;
                        const speed = 4 + Math.random() * 14;

                        particles.push({
                            x: cx + (Math.random() - 0.5) * 6,
                            y: cy + (Math.random() - 0.5) * 6,
                            vx: Math.cos(angle) * speed,
                            vy: Math.sin(angle) * speed,
                            tx: x,
                            ty: y,
                            char: CHARS[Math.floor(Math.random() * CHARS.length)],
                            color: isRed ? '#ff4655' : `rgb(${r},${g},${b})`,
                            baseAlpha: Math.min(1, bright / 160),
                            orbitSpeed: 0.0015 + Math.random() * 0.004,
                        });
                    }
                }
            }

            // Initial spark burst
            for (let i = 0; i < 300; i++) {
                const a = Math.random() * Math.PI * 2;
                const s = 3 + Math.random() * 12;
                sparks.push({
                    x: cx, y: cy,
                    vx: Math.cos(a) * s,
                    vy: Math.sin(a) * s,
                    life: 0,
                    maxLife: 50 + Math.random() * 150,
                    char: CHARS[Math.floor(Math.random() * CHARS.length)],
                });
            }

            // Reset time trackers so animation completely restarts
            lastTime = performance.now();
            elapsed = 0;
            
            if (!isResize) {
                loop();
            }
        };

        // ────────── ANIMATION LOOP ──────────
        const loop = () => {
            if (!running) return;
            const now = performance.now();
            
            let dt = now - lastTime;
            if (dt > 100) dt = 16; // Prevent massive leaps in time from background tabs
            
            lastTime = now;
            elapsed += dt;
            
            const time = elapsed * 0.001;

            let trail = 0.88;
            if      (elapsed < T_EXPLODE) trail = 0.1;
            else if (elapsed < T_SPIRAL)  trail = 0.13;
            else if (elapsed < T_WAVE)    trail = 0.22;
            else if (elapsed < T_FORM)    trail = 0.55;

            ctx.fillStyle = `rgba(8, 8, 10, ${trail})`;
            ctx.fillRect(0, 0, W, H);

            ctx.font = '11px "Courier New", monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            const inExplode = elapsed < T_EXPLODE;
            const inSpiral  = elapsed >= T_EXPLODE && elapsed < T_SPIRAL;
            const inWave    = elapsed >= T_SPIRAL  && elapsed < T_WAVE;
            const inForm    = elapsed >= T_WAVE    && elapsed < T_FORM;
            const settled   = elapsed >= T_FORM;

            if (settled && !logoVisible) setLogoVisible(true);

            let spring = 0;
            if (inWave) {
                spring = ((elapsed - T_SPIRAL) / (T_WAVE - T_SPIRAL)) * 0.012;
            } else if (inForm) {
                spring = 0.012 + ((elapsed - T_WAVE) / (T_FORM - T_WAVE)) * 0.075;
            } else if (settled) {
                spring = 0.087;
            }

            const friction = settled ? 0.84 : 0.93;

            // ── Update particles ──
            for (const p of particles) {
                if (inExplode) {
                    p.vx += (Math.random() - 0.5) * 1.2;
                    p.vy += (Math.random() - 0.5) * 1.2;
                    if (Math.random() < 0.12) p.char = CHARS[Math.floor(Math.random() * CHARS.length)];
                }

                if (inSpiral) {
                    const dx = p.x - cx;
                    const dy = p.y - cy;
                    const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
                    const spiralFade = 1 - ((elapsed - T_EXPLODE) / (T_SPIRAL - T_EXPLODE)) * 0.4;
                    const tangentForce = spiralFade * p.orbitSpeed * 65;
                    p.vx += (-dy / dist) * tangentForce;
                    p.vy += (dx / dist) * tangentForce;
                    p.vx -= dx * 0.00018;
                    p.vy -= dy * 0.00018;
                    if (Math.random() < 0.04) p.char = CHARS[Math.floor(Math.random() * CHARS.length)];
                }

                if (inWave) {
                    const waveFade = 1 - ((elapsed - T_SPIRAL) / (T_WAVE - T_SPIRAL));
                    const force = waveFade * 3.5;
                    p.vx += Math.sin(p.y * 0.012 + time * 3) * force;
                    p.vy += Math.cos(p.x * 0.012 + time * 2.2) * force;
                    if (Math.random() < 0.025) p.char = CHARS[Math.floor(Math.random() * CHARS.length)];
                }

                if (spring > 0) {
                    p.vx += (p.tx - p.x) * spring;
                    p.vy += (p.ty - p.y) * spring;
                }

                if (settled) {
                    const mdx = p.x - mouse.x;
                    const mdy = p.y - mouse.y;
                    const md = Math.sqrt(mdx * mdx + mdy * mdy);
                    if (md < 130 && md > 0) {
                        const f = (130 - md) / 130 * 8;
                        p.vx += (mdx / md) * f;
                        p.vy += (mdy / md) * f;
                        if (Math.random() > 0.4) p.char = CHARS[Math.floor(Math.random() * CHARS.length)];
                    }
                }

                p.vx *= friction;
                p.vy *= friction;
                p.x += p.vx;
                p.y += p.vy;

                if (!settled) {
                    if (p.x < 0)  { p.x = 0;  p.vx *= -0.6; }
                    if (p.x > W)  { p.x = W;  p.vx *= -0.6; }
                    if (p.y < 0)  { p.y = 0;  p.vy *= -0.6; }
                    if (p.y > H)  { p.y = H;  p.vy *= -0.6; }
                }

                const dTarget = Math.sqrt((p.x - p.tx) ** 2 + (p.y - p.ty) ** 2);

                if (settled && dTarget < 8) {
                    // Make settled particles virtually invisible so they don't form a "fat shadow" 
                    // behind the crisp DOM text. Double text solved.
                    ctx.fillStyle = p.color;
                    ctx.globalAlpha = 0.01; 
                } else {
                    // Particles flying around or disturbed by mouse are glowing and visible
                    const a = settled ? Math.max(0.1, 1 - dTarget / 80) : 0.5 + Math.random() * 0.5;
                    ctx.fillStyle = (settled && dTarget < 40) ? p.color : '#ff4655';
                    ctx.globalAlpha = a;
                }

                ctx.fillText(p.char, p.x, p.y);
            }

            ctx.globalAlpha = 1;

            if (elapsed < T_FORM + 1000) {
                for (let i = sparks.length - 1; i >= 0; i--) {
                    const s = sparks[i];
                    s.life++;
                    s.x += s.vx;
                    s.y += s.vy;
                    s.vx *= 0.97;
                    s.vy *= 0.97;
                    s.vy += 0.025;

                    const lifeRatio = 1 - s.life / s.maxLife;
                    if (lifeRatio <= 0) { sparks.splice(i, 1); continue; }

                    ctx.fillStyle = `rgba(255, 70, 85, ${lifeRatio * 0.45})`;
                    ctx.fillText(s.char, s.x, s.y);
                }
            }

            // ── DRAW EFFECTS ──
            ctx.globalAlpha = 1;

            if (settled) {
                const sy = (elapsed * 0.07) % H;
                ctx.fillStyle = 'rgba(255, 70, 85, 0.025)';
                ctx.fillRect(0, sy - 1, W, 2);
            }

            animId = requestAnimationFrame(loop);
        };

        const onMM = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
        const onTM = (e: TouchEvent) => { if (e.touches[0]) { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; } };
        const onML = () => { mouse.x = -9999; mouse.y = -9999; };
        const onResize = () => {
            W = window.innerWidth; H = window.innerHeight;
            canvas.width = W; canvas.height = H;
            init(true); // pass true so it doesn't double-call loop()
        };

        canvas.addEventListener('mousemove', onMM);
        canvas.addEventListener('touchmove', onTM, { passive: true });
        canvas.addEventListener('mouseleave', onML);
        window.addEventListener('resize', onResize);

        init();

        return () => {
            running = false;
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', onResize);
            canvas.removeEventListener('mousemove', onMM);
            canvas.removeEventListener('touchmove', onTM);
            canvas.removeEventListener('mouseleave', onML);
        };
    }, []);

    const { _logoW, _logoH, _logoY, _subSize, _subY, _mainSize, _mainY } = (() => {
        // Safe replicate for initial render sizing
        const w = typeof window !== 'undefined' ? window.innerWidth : 1000;
        const h = typeof window !== 'undefined' ? window.innerHeight : 800;
        const isMobile = w < 768;
        return {
            _logoW: isMobile ? Math.min(w * 0.5, 300) : Math.min(w * 0.22, 350),
            _logoH: isMobile ? Math.min(w * 0.5, 300) : Math.min(w * 0.22, 350),
            _logoY: h * 0.05,
            _subSize: Math.max(Math.min(w * 0.055, 55), 24),
            _subY: h * 0.52,
            _mainSize: Math.min(w * 0.18, 220),
            _mainY: h * 0.70
        };
    })();

    return (
        <div className="relative w-full h-screen bg-[#08080a] overflow-hidden font-teko">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full cursor-crosshair z-0" />

            {/* DOM Overlay for Premium Crisp Graphics */}
            <div 
                // We apply mix-blend-screen to the wrapper so it blends safely through the stacking context into the document
                className="absolute inset-0 pointer-events-none flex flex-col items-center z-10 transition-opacity duration-1000 ease-in mix-blend-screen"
                style={{ opacity: logoVisible ? 1 : 0 }}
            >
                {/* Extracted exactly matching the offscreen pixel target coordinates */}
                <img 
                    src="img/crest.jpg" 
                    alt="Ascent Crest" 
                    className="absolute z-10 transition-transform duration-1000 hover:scale-105 pointer-events-auto"
                    style={{
                        top: `${_logoY}px`,
                        width: `${_logoW}px`,
                        height: `${_logoH}px`,
                        transform: 'translateX(0)'
                    }}
                />

                <div 
                    className="absolute text-[#ff4655] font-rajdhani font-bold drop-shadow-md z-10 pointer-events-auto"
                    style={{ 
                        top: `${_subY}px`, 
                        transform: 'translate(-50%, -50%)',
                        left: '50%',
                        fontSize: `${_subSize}px`,
                        letterSpacing: '0.4em'
                    }}
                >
                    2026
                </div>

                <h1 
                    className="absolute text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-100 to-gray-500 font-teko font-black whitespace-nowrap z-10 pointer-events-auto"
                    style={{ 
                        top: `${_mainY}px`, 
                        transform: 'translate(-50%, -50%)',
                        left: '50%',
                        fontSize: `${_mainSize}px`,
                        letterSpacing: '0.1em', // Matches canvas tracking
                        lineHeight: 0.8,
                        filter: 'drop-shadow(0 0 25px rgba(255, 255, 255, 0.15))' 
                    }}
                >
                    ASCENT
                </h1>
            </div>

            {/* Top HUD */}
            <div className="absolute top-0 left-0 w-full p-6 z-10 flex justify-between items-center pointer-events-none">
                <div className="font-mono text-[10px] text-[#ff4655] tracking-[0.3em] uppercase opacity-60">
                    ASCII_MORPH_ENGINE // V3
                </div>
                <Link
                    to="/"
                    className="pointer-events-auto border border-white/10 bg-[#0d121f]/60 px-5 py-2 text-[10px] font-mono text-white/60 hover:bg-white hover:text-black transition-colors tracking-widest font-sans"
                >
                    ← BACK
                </Link>
            </div>

            {/* Bottom hint */}
            <div className="absolute bottom-8 inset-x-0 z-10 pointer-events-none flex justify-center">
                <div className="border border-white/5 bg-[#08080a]/70 px-6 py-2.5 font-mono text-[10px] text-white/30 tracking-[0.3em] uppercase">
                    move cursor to disturb the field
                </div>
            </div>

            {/* Scanline texture */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.025] bg-[linear-gradient(to_bottom,transparent_50%,#fff_50%)] bg-[length:100%_4px] z-20 mix-blend-overlay" />
        </div>
    );
};

export default AsciiDemoPage;
