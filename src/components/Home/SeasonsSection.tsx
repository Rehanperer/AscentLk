import React, { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Lock, ShieldAlert, Skull, Biohazard } from 'lucide-react';
import ScrambleText from '../ScrambleText';

/* ═══════════════════════════════════════════════
   PARTICLE FIELD — floating toxic spores
═══════════════════════════════════════════════ */
const ToxicParticles: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let w = (canvas.width = canvas.offsetWidth);
        let h = (canvas.height = canvas.offsetHeight);

        interface Particle {
            x: number; y: number; vx: number; vy: number;
            size: number; alpha: number; decay: number;
        }

        const particles: Particle[] = [];
        const MAX = 80;

        const spawn = () => {
            if (particles.length >= MAX) return;
            particles.push({
                x: Math.random() * w,
                y: h + 10,
                vx: (Math.random() - 0.5) * 0.4,
                vy: -(0.3 + Math.random() * 0.6),
                size: 1 + Math.random() * 2.5,
                alpha: 0.15 + Math.random() * 0.35,
                decay: 0.0005 + Math.random() * 0.001,
            });
        };

        let animId = 0;
        const loop = () => {
            ctx.clearRect(0, 0, w, h);
            if (Math.random() < 0.3) spawn();

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.alpha -= p.decay;
                if (p.alpha <= 0 || p.y < -10) { particles.splice(i, 1); continue; }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 255, 64, ${p.alpha})`;
                ctx.fill();

                // Tiny glow
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 255, 64, ${p.alpha * 0.15})`;
                ctx.fill();
            }
            animId = requestAnimationFrame(loop);
        };
        loop();

        const onResize = () => { w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; };
        window.addEventListener('resize', onResize);
        return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onResize); };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
};

/* ═══════════════════════════════════════════════
   LOCKED SEASON ROW — minimal, horizontal bar
═══════════════════════════════════════════════ */
const LockedSeasonRow: React.FC<{ num: string; delay: number }> = ({ num, delay }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-5%" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
            className="group relative flex items-center gap-4 md:gap-6 py-5 md:py-6 border-b border-white/[0.04] hover:border-white/10 transition-colors duration-500"
        >
            {/* Scan-line hover effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#ff4655]/[0.03] via-transparent to-transparent" />
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#ff4655]/40 via-[#ff4655]/10 to-transparent animate-pulse" />
            </div>

            {/* Season Number */}
            <span className="font-mono text-[10px] md:text-xs text-white/15 tracking-[0.3em] w-16 md:w-20 flex-shrink-0">{num}</span>

            {/* Lock Icon */}
            <div className="w-8 h-8 md:w-10 md:h-10 border border-white/[0.06] flex items-center justify-center flex-shrink-0 group-hover:border-[#ff4655]/20 transition-colors">
                <Lock size={14} strokeWidth={1.5} className="text-white/15 group-hover:text-[#ff4655]/40 transition-colors" />
            </div>

            {/* Redacted Title Bars */}
            <div className="flex-1 flex flex-col gap-1.5">
                <div className="h-4 md:h-5 w-32 md:w-48 bg-white/[0.04] rounded-[1px]" />
                <div className="h-2.5 w-20 md:w-28 bg-white/[0.02] rounded-[1px]" />
            </div>

            {/* Status */}
            <div className="flex items-center gap-2 flex-shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                <span className="font-mono text-[8px] md:text-[9px] text-white/15 tracking-[0.3em] uppercase hidden sm:inline">Classified</span>
            </div>
        </motion.div>
    );
};

/* ═══════════════════════════════════════════════
   MAIN SECTION
═══════════════════════════════════════════════ */
const SeasonsSection: React.FC = () => {
    const heroRef = useRef(null);
    const isHeroInView = useInView(heroRef, { once: true, margin: "-10%" });

    return (
        <section id="seasons" className="relative bg-[#08080a] overflow-hidden">

            {/* ── TOXIC HERO BLOCK ── */}
            <div ref={heroRef} className="relative min-h-[80vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden">
                
                {/* Atmospheric layers */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* Deep green radial glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vh] bg-[radial-gradient(ellipse_at_center,rgba(0,255,64,0.08)_0%,rgba(0,255,64,0.02)_40%,transparent_70%)]" />
                    {/* Top vignette */}
                    <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-[#08080a] to-transparent" />
                    {/* Bottom vignette */}
                    <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-[#08080a] to-transparent" />
                    {/* Scanlines */}
                    <div className="absolute inset-0 bg-scanlines opacity-[0.06]" />
                </div>

                {/* Floating toxic particles */}
                <ToxicParticles />

                {/* ── CONTENT ── */}
                <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center text-center">

                    {/* Season Tag */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="flex items-center gap-3 mb-6"
                    >
                        <div className="w-2 h-2 bg-[#00ff40] shadow-[0_0_12px_#00ff40,0_0_24px_rgba(0,255,64,0.4)]" />
                        <span className="font-mono text-[10px] md:text-xs tracking-[0.5em] text-[#00ff40] uppercase font-bold drop-shadow-[0_0_8px_rgba(0,255,64,0.5)]">
                            Season 01 // Deployed
                        </span>
                    </motion.div>

                    {/* Massive TOXIC Title */}
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={isHeroInView ? { opacity: 1, scale: 1, y: 0 } : {}}
                        transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                        className="font-teko text-[22vw] md:text-[16rem] font-bold uppercase leading-[0.75] text-white relative"
                    >
                        {/* Green glow behind text */}
                        <span className="absolute inset-0 text-[#00ff40] blur-[60px] opacity-30 select-none pointer-events-none" aria-hidden="true">TOXIC</span>
                        TOXIC
                    </motion.h2>

                    {/* Subtitle / Lore */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="mt-8 md:mt-10 max-w-lg font-mono text-xs md:text-sm tracking-widest uppercase leading-relaxed text-white/40"
                    >
                        The initial perimeter breach. Bio-hazards unleashed in the arena. Only the immune survive the first purge of the Gauntlet.
                    </motion.p>

                    {/* Biohazard Icon */}
                    <motion.div
                        initial={{ opacity: 0, rotate: -90 }}
                        animate={isHeroInView ? { opacity: 1, rotate: 0 } : {}}
                        transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="mt-10 md:mt-14"
                    >
                        <Biohazard size={40} strokeWidth={1} className="text-[#00ff40]/30" />
                    </motion.div>
                </div>
            </div>

            {/* ── UPCOMING SEASONS (Locked) ── */}
            <div className="relative z-10 max-w-4xl mx-auto px-6 pb-24 md:pb-32">
                
                {/* Section Label */}
                <div className="flex items-center gap-4 mb-2 pt-8">
                    <ShieldAlert size={14} strokeWidth={1.5} className="text-white/15" />
                    <span className="font-mono text-[9px] md:text-[10px] text-white/25 tracking-[0.4em] uppercase">Upcoming Operations</span>
                    <div className="h-[1px] flex-1 bg-white/[0.04]" />
                </div>

                {/* Locked Season Rows */}
                <LockedSeasonRow num="SZN_02" delay={0} />
                <LockedSeasonRow num="SZN_03" delay={0.1} />
                <LockedSeasonRow num="SZN_04" delay={0.2} />
                <LockedSeasonRow num="SZN_05" delay={0.3} />
            </div>

        </section>
    );
};

export default SeasonsSection;
