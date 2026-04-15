import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView, animate } from 'framer-motion';
import ScrambleText from '../ScrambleText';

// Custom lightweight counter hook for the 300K slot machine effect
const AnimatedCounter: React.FC<{ value: number; label: string; prefix?: string; suffix?: string; duration?: number }> = ({ value, label, prefix = "", suffix = "", duration = 2 }) => {
    const ref = useRef<HTMLSpanElement>(null);
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, margin: "-10%" });

    useEffect(() => {
        if (!isInView || !ref.current) return;
        
        const controls = animate(0, value, {
            duration,
            ease: [0.22, 1, 0.36, 1], // Custom sophisticated easing
            onUpdate(currentValue) {
                if (ref.current) {
                    ref.current.textContent = Math.floor(currentValue).toLocaleString();
                }
            }
        });

        return () => controls.stop();
    }, [value, duration, isInView]);

    return (
        <div ref={containerRef} className="flex flex-col items-center justify-center text-center group px-4">
            <h3 className="font-teko text-[15vw] md:text-[10rem] leading-[0.85] font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-[#ff4655]/20 drop-shadow-[0_0_40px_rgba(255,70,85,0.3)] whitespace-nowrap">
                <span className="text-[10vw] md:text-[6rem] text-white/50">{prefix}</span>
                <span ref={ref}>0</span>
                <span className="text-[10vw] md:text-[6rem]">{suffix}</span>
            </h3>
            <div className="font-mono text-xs md:text-xl tracking-[0.3em] md:tracking-[0.5em] text-[#ff4655] uppercase mt-4" style={{ opacity: isInView ? 1 : 0, transition: 'opacity 1s ease' }}>
                <ScrambleText text={label} duration={60} />
            </div>
        </div>
    );
};

/**
 * SpotlightCanvas — Draws two volumetric cinematic spotlight beams
 * from the top-left and top-right corners converging on the center.
 * Includes dust motes floating in the beams for that stage-show feel.
 */
const SpotlightCanvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let w = 0, h = 0;
        let animId = 0;
        let running = true;

        // Dust particles floating in the beams
        const dustCount = 40;
        const dust: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];

        const resize = () => {
            w = canvas.offsetWidth;
            h = canvas.offsetHeight;
            canvas.width = w * (window.devicePixelRatio > 1 ? 2 : 1);
            canvas.height = h * (window.devicePixelRatio > 1 ? 2 : 1);
            ctx.scale(window.devicePixelRatio > 1 ? 2 : 1, window.devicePixelRatio > 1 ? 2 : 1);
        };

        const initDust = () => {
            dust.length = 0;
            for (let i = 0; i < dustCount; i++) {
                dust.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: -0.2 - Math.random() * 0.4,
                    size: 0.5 + Math.random() * 1.5,
                    alpha: Math.random() * 0.6,
                });
            }
        };

        const drawBeam = (
            sx: number, sy: number,   // source point (top corner)
            tx: number, ty: number,   // target point (center bottom)
            beamWidth: number         // width of beam at the target
        ) => {
            // The beam is a trapezoid: narrow at source, wide at target
            const sourceHalf = 8; // very narrow at source (the light fixture)

            // Draw the volumetric cone with layered gradients for depth
            // Core bright beam (narrow)
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(sx - sourceHalf, sy);
            ctx.lineTo(sx + sourceHalf, sy);
            ctx.lineTo(tx + beamWidth * 0.3, ty);
            ctx.lineTo(tx - beamWidth * 0.3, ty);
            ctx.closePath();

            const coreGrad = ctx.createLinearGradient(sx, sy, tx, ty);
            coreGrad.addColorStop(0, 'rgba(255, 90, 100, 0.25)');
            coreGrad.addColorStop(0.3, 'rgba(255, 70, 85, 0.08)');
            coreGrad.addColorStop(0.7, 'rgba(255, 70, 85, 0.03)');
            coreGrad.addColorStop(1, 'rgba(255, 70, 85, 0.01)');
            ctx.fillStyle = coreGrad;
            ctx.fill();
            ctx.restore();

            // Outer haze (wider, more diffuse)
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(sx - sourceHalf * 3, sy);
            ctx.lineTo(sx + sourceHalf * 3, sy);
            ctx.lineTo(tx + beamWidth, ty);
            ctx.lineTo(tx - beamWidth, ty);
            ctx.closePath();

            const outerGrad = ctx.createLinearGradient(sx, sy, tx, ty);
            outerGrad.addColorStop(0, 'rgba(255, 70, 85, 0.08)');
            outerGrad.addColorStop(0.4, 'rgba(255, 70, 85, 0.03)');
            outerGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = outerGrad;
            ctx.fill();
            ctx.restore();

            // Source glow (the light fixture itself)
            ctx.save();
            const sourceGlow = ctx.createRadialGradient(sx, sy, 0, sx, sy, 40);
            sourceGlow.addColorStop(0, 'rgba(255, 120, 130, 0.5)');
            sourceGlow.addColorStop(0.3, 'rgba(255, 70, 85, 0.15)');
            sourceGlow.addColorStop(1, 'transparent');
            ctx.fillStyle = sourceGlow;
            ctx.fillRect(sx - 50, sy - 10, 100, 60);
            ctx.restore();
        };

        const isInBeam = (px: number, py: number, sx: number, sy: number, tx: number, ty: number, beamWidth: number): boolean => {
            // Check if a point is roughly within the beam cone
            if (py < sy || py > ty) return false;
            const t = (py - sy) / (ty - sy); // 0 at source, 1 at target
            const halfW = 8 + t * beamWidth;
            const cx = sx + t * (tx - sx);
            return Math.abs(px - cx) < halfW;
        };

        let time = 0;
        const loop = () => {
            if (!running) return;
            ctx.clearRect(0, 0, w, h);

            const targetX = w / 2;
            const targetY = h * 0.65;
            const beamW = w * 0.18;

            // Draw left spotlight
            drawBeam(w * 0.05, 0, targetX, targetY, beamW);
            // Draw right spotlight
            drawBeam(w * 0.95, 0, targetX, targetY, beamW);

            // Convergence pool glow where beams meet
            ctx.save();
            const poolGrad = ctx.createRadialGradient(targetX, targetY, 0, targetX, targetY, w * 0.2);
            poolGrad.addColorStop(0, 'rgba(255, 70, 85, 0.12)');
            poolGrad.addColorStop(0.5, 'rgba(255, 70, 85, 0.04)');
            poolGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = poolGrad;
            ctx.fillRect(0, targetY - w * 0.2, w, w * 0.4);
            ctx.restore();

            // Animate dust particles
            for (const d of dust) {
                d.x += d.vx + Math.sin(time * 0.01 + d.y * 0.01) * 0.2;
                d.y += d.vy;
                
                // Wrap
                if (d.y < 0) { d.y = h; d.x = Math.random() * w; }
                if (d.x < 0) d.x = w;
                if (d.x > w) d.x = 0;

                // Only draw dust that's inside one of the beams
                const inLeft = isInBeam(d.x, d.y, w * 0.05, 0, targetX, targetY, beamW);
                const inRight = isInBeam(d.x, d.y, w * 0.95, 0, targetX, targetY, beamW);
                
                if (inLeft || inRight) {
                    const flicker = 0.5 + Math.sin(time * 0.05 + d.x) * 0.5;
                    ctx.save();
                    ctx.globalAlpha = d.alpha * flicker;
                    ctx.fillStyle = 'rgba(255, 180, 180, 0.8)';
                    ctx.beginPath();
                    ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
            }

            time++;
            animId = requestAnimationFrame(loop);
        };

        resize();
        initDust();
        loop();

        window.addEventListener('resize', () => { resize(); initDust(); });
        return () => {
            running = false;
            cancelAnimationFrame(animId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
        />
    );
};

const PhaseBlock: React.FC<{ 
    phaseNum: string; 
    title: string; 
    desc: string; 
    imgSrc: string; 
    isReversed?: boolean;
    containerProgress: any;
    startRange: number;
    endRange: number;
}> = ({ phaseNum, title, desc, imgSrc, isReversed = false, containerProgress, startRange, endRange }) => {
    
    // Map the section's active state to this specific block's scrolling range
    const isActive = useTransform(containerProgress, [startRange - 0.1, startRange, endRange, endRange + 0.1], [0, 1, 1, 0]);
    const dotScale = useTransform(containerProgress, [startRange - 0.05, startRange], [0, 1]);
    const yOffset = useTransform(containerProgress, [startRange - 0.2, startRange], [50, 0]);

    return (
        <div className={`relative flex flex-col md:flex-row items-center justify-between w-full min-h-[50vh] ${isReversed ? 'md:flex-row-reverse' : ''} mb-32 md:mb-0`}>
            
            {/* Center Timeline Node */}
            <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 flex items-center justify-center -translate-x-1/2 z-20">
                <motion.div 
                    className="w-4 h-4 rounded-full bg-[#0d121f] border-2 border-white/20 flex items-center justify-center relative"
                    style={{ scale: dotScale, borderColor: useTransform(isActive, v => v > 0.5 ? '#ff4655' : 'rgba(255,255,255,0.2)') }}
                >
                    <motion.div 
                        className="w-1.5 h-1.5 rounded-full bg-[#ff4655]"
                        style={{ opacity: isActive }}
                    />
                    {/* Glowing pulse when active */}
                    <motion.div 
                        className="absolute inset-0 rounded-full bg-[#ff4655] -z-10"
                        style={{ opacity: useTransform(isActive, v => v * 0.5), scale: useTransform(isActive, v => 1 + v * 2) }}
                        animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                </motion.div>
            </div>

            {/* Text Content */}
            <motion.div 
                className={`w-full md:w-5/12 pl-12 md:pl-0 ${isReversed ? 'md:pl-16' : 'md:pr-16'} z-10`}
                style={{ opacity: isActive, y: yOffset }}
            >
                <div className="font-mono text-xs tracking-[0.4em] text-[#ff4655] uppercase mb-4">{phaseNum}</div>
                <h3 className="font-teko text-5xl md:text-7xl font-bold uppercase text-white leading-[0.9] mb-6">{title}</h3>
                <p className="text-white/50 text-sm md:text-base leading-relaxed uppercase tracking-wide font-medium">{desc}</p>
                
                {/* Tactical HUD Element */}
                <div className="mt-8 flex items-center gap-4 border border-white/5 bg-white/[0.02] p-4 max-w-xs">
                    <div className="w-1.5 h-1.5 bg-white/20 animate-ping" />
                    <span className="font-mono text-[9px] text-white/40 tracking-[0.3em] uppercase">Status: Monitoring</span>
                </div>
            </motion.div>

            {/* Image Content */}
            <motion.div 
                className={`w-full md:w-5/12 pl-12 md:pl-0 mt-8 md:mt-0 ${isReversed ? 'md:pr-16 md:pl-0' : 'md:pl-16'} z-10 relative`}
                style={{ opacity: isActive, scale: useTransform(isActive, [0, 1], [0.95, 1]) }}
            >
                <div className="relative w-full aspect-video md:aspect-[4/3] border border-white/10 bg-[#08080a] p-2 flex group overflow-hidden">
                    <img 
                        src={imgSrc} 
                        alt={title} 
                        className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-scanlines opacity-20 pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-transparent to-transparent opacity-80" />
                </div>
            </motion.div>

        </div>
    );
};

const PathSection: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end 80%"]
    });

    // Animate the central red line filling up
    const lineFillHeight = useTransform(scrollYProgress, [0, 0.7], ["0%", "100%"]);

    return (
        <section id="path" className="relative pb-32 pt-24 bg-[#0d121f]">
            {/* Atmospheric Overlay */}
            <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-[#08080a] to-transparent z-10 pointer-events-none" />
            
            <div className="max-w-7xl mx-auto px-6 relative z-10" ref={containerRef}>
                
                {/* Header */}
                <div className="text-center mb-32 md:mb-48 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-teko font-bold text-white/[0.02] leading-none pointer-events-none select-none">
                        GAUNTLET
                    </div>
                    <ScrambleText text="PROTOCOL HIERARCHY" className="text-[#ff4655] font-mono tracking-[0.5em] text-[10px] uppercase font-bold mb-4 block" />
                    <h2 className="font-teko text-6xl md:text-8xl font-bold uppercase leading-none text-white">
                        ROAD TO THE CROWN
                    </h2>
                </div>

                {/* Timeline Container */}
                <div className="relative w-full flex flex-col pt-10 border-t border-white/5">
                    
                    {/* The Background Line (Dim) */}
                    <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[1px] bg-white/5 -translate-x-1/2" />
                    
                    {/* The Foreground Line (Red Filling) */}
                    <motion.div 
                        className="absolute left-[20px] md:left-1/2 top-0 w-[2px] bg-[#ff4655] -translate-x-1/2 shadow-[0_0_15px_#ff4655]"
                        style={{ height: lineFillHeight }}
                    />

                    <PhaseBlock 
                        phaseNum="Phase 01"
                        title="Open Qualifiers"
                        desc="Hundreds of units battle in a ruthless single-elimination bracket. Only the most disciplined tacticians survive the initial purge. No margin for error."
                        imgSrc="/img/phase_01.png"
                        containerProgress={scrollYProgress}
                        startRange={0.1}
                        endRange={0.3}
                    />

                    <PhaseBlock 
                        phaseNum="Phase 02"
                        title="Regional Playoffs"
                        desc="The surviving elite clash in high-stakes, broadcasted best-of-threes. The pressure mounts as the nation watches. Every flash, every peek matters."
                        imgSrc="/img/phase_02.png"
                        isReversed
                        containerProgress={scrollYProgress}
                        startRange={0.35}
                        endRange={0.55}
                    />

                    <PhaseBlock 
                        phaseNum="Terminal"
                        title="The Grand Final"
                        desc="Live from the Lumina Ballroom. Two titans remain. A state-of-the-art arena, roaring crowds, and absolute immortality on the line. The Gauntlet ends here."
                        imgSrc="/img/phase_03.png"
                        containerProgress={scrollYProgress}
                        startRange={0.6}
                        endRange={0.8}
                    />

                </div>

                {/* THE 300K JACKPOT REVEAL — Cinematic Spotlights */}
                <div className="mt-32 md:mt-48 mb-16 md:mb-24 relative w-full py-32 md:py-44">
                    <SpotlightCanvas />
                    <div className="relative z-10">
                        <AnimatedCounter value={300000} label="LKR Total Prize Pool" suffix="+" duration={3} />
                    </div>
                </div>
                
            </div>
            
            {/* Atmospheric Gradient out */}
            <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-[#08080a] to-transparent z-10 pointer-events-none" />
        </section>
    );
};

export default PathSection;
