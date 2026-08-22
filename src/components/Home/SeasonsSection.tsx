import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Lock, ShieldAlert, Biohazard, Eye } from 'lucide-react';

/* ═══════════════════════════════════════════════
   DUAL PARTICLE FIELD — morphs from green to gray
═══════════════════════════════════════════════ */
const SeasonParticles: React.FC<{ progress: number }> = ({ progress }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const progressRef = useRef(progress);
    progressRef.current = progress;

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
        const MAX = 70;

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
            const p2 = progressRef.current; // 0 = fully green, 1 = fully gray

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.alpha -= p.decay;
                if (p.alpha <= 0 || p.y < -10) { particles.splice(i, 1); continue; }

                // Interpolate color: green(0,255,64) → silver(160,190,210)
                const r = Math.round(0 + p2 * 160);
                const g = Math.round(255 - p2 * 65);
                const b = Math.round(64 + p2 * 146);

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha})`;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha * 0.12})`;
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
   LOCKED SEASON ROW
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
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#ff4655]/[0.03] via-transparent to-transparent" />
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#ff4655]/40 via-[#ff4655]/10 to-transparent animate-pulse" />
            </div>
            <span className="font-mono text-[10px] md:text-xs text-white/15 tracking-[0.3em] w-16 md:w-20 flex-shrink-0">{num}</span>
            <div className="w-8 h-8 md:w-10 md:h-10 border border-white/[0.06] flex items-center justify-center flex-shrink-0 group-hover:border-[#ff4655]/20 transition-colors">
                <Lock size={14} strokeWidth={1.5} className="text-white/15 group-hover:text-[#ff4655]/40 transition-colors" />
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
                <div className="h-4 md:h-5 w-32 md:w-48 bg-white/[0.04] rounded-[1px]" />
                <div className="h-2.5 w-20 md:w-28 bg-white/[0.02] rounded-[1px]" />
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                <span className="font-mono text-[8px] md:text-[9px] text-white/15 tracking-[0.3em] uppercase hidden sm:inline">Classified</span>
            </div>
        </motion.div>
    );
};

/* ═══════════════════════════════════════════════
   MAIN SECTION — scroll-driven TOXIC → AWAKEN morph
═══════════════════════════════════════════════ */
const SeasonsSection: React.FC = () => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [particleProgress, setParticleProgress] = useState(0);

    // Scroll progress through the tall wrapper
    const { scrollYProgress } = useScroll({
        target: wrapperRef,
        offset: ["start start", "end end"]
    });

    // Morph progress: 0 = TOXIC, 1 = AWAKEN
    const morphProgress = useTransform(scrollYProgress, [0.1, 0.9], [0, 1]);

    // Feed progress to particles (via state → ref in canvas)
    useEffect(() => {
        return morphProgress.on("change", (v) => setParticleProgress(v));
    }, [morphProgress]);

    // ── Color transitions ──
    const greenGlow = useTransform(scrollYProgress, [0, 0.3, 0.55], [1, 0.5, 0]);
    const grayGlow = useTransform(scrollYProgress, [0.45, 0.7, 1], [0, 0.5, 1]);

    // ── Text crossfade — overlapping so there's NEVER a gap ──
    const toxicOpacity = useTransform(scrollYProgress, [0, 0.3, 0.5], [1, 1, 0]);
    const toxicY = useTransform(scrollYProgress, [0.3, 0.5], ["0%", "-12%"]);
    const toxicScale = useTransform(scrollYProgress, [0.3, 0.5], [1, 0.9]);

    const awakenOpacity = useTransform(scrollYProgress, [0.45, 0.65, 1], [0, 1, 1]);
    const awakenY = useTransform(scrollYProgress, [0.45, 0.65], ["12%", "0%"]);
    const awakenScale = useTransform(scrollYProgress, [0.45, 0.65], [0.9, 1]);

    // ── Season tag crossfade ──
    const tagToxicOpacity = useTransform(scrollYProgress, [0, 0.25, 0.45], [1, 1, 0]);
    const tagAwakenOpacity = useTransform(scrollYProgress, [0.5, 0.7, 1], [0, 1, 1]);

    // ── Subtitle crossfade ──
    const subToxicOpacity = useTransform(scrollYProgress, [0, 0.3, 0.48], [1, 1, 0]);
    const subAwakenOpacity = useTransform(scrollYProgress, [0.5, 0.7, 1], [0, 1, 1]);

    // ── Icon crossfade ──
    const iconToxicOpacity = useTransform(scrollYProgress, [0, 0.3, 0.48], [1, 1, 0]);
    const iconAwakenOpacity = useTransform(scrollYProgress, [0.5, 0.7, 1], [0, 1, 1]);

    // ── Horizontal wipe line ──
    const wipeX = useTransform(scrollYProgress, [0.35, 0.65], ["-100%", "200%"]);
    const wipeOpacity = useTransform(scrollYProgress, [0.3, 0.4, 0.6, 0.7], [0, 1, 1, 0]);

    return (
        // NO overflow-hidden here — it kills position:sticky
        <section id="seasons" className="relative bg-[#08080a]">

            {/* ── SCROLL-DRIVEN MORPH ZONE ── */}
            <div ref={wrapperRef} className="relative" style={{ height: '300vh' }}>
                <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">

                    {/* Green glow (TOXIC) */}
                    <motion.div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            opacity: greenGlow,
                            background: 'radial-gradient(ellipse at center, rgba(0,255,64,0.08) 0%, rgba(0,255,64,0.02) 40%, transparent 70%)',
                        }}
                    />

                    {/* Gray glow (AWAKEN) */}
                    <motion.div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            opacity: grayGlow,
                            background: 'radial-gradient(ellipse at center, rgba(160,175,190,0.08) 0%, rgba(160,175,190,0.02) 40%, transparent 70%)',
                        }}
                    />

                    {/* Vignettes */}
                    <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-[#08080a] to-transparent pointer-events-none" />
                    <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-[#08080a] to-transparent pointer-events-none" />
                    <div className="absolute inset-0 scanlines opacity-[0.05] pointer-events-none" />

                    {/* Morphing particles */}
                    <SeasonParticles progress={particleProgress} />

                    {/* Horizontal wipe line during transition */}
                    <motion.div
                        className="absolute left-0 right-0 top-1/2 -translate-y-1/2 pointer-events-none z-20"
                        style={{ x: wipeX, opacity: wipeOpacity }}
                    >
                        <div className="w-[60vw] h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                        <div className="w-[40vw] h-[3px] -mt-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent blur-sm" />
                    </motion.div>

                    {/* ── CONTENT ── */}
                    <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center text-center">

                        {/* Season Tags — crossfade */}
                        <div className="relative h-8 mb-6 flex items-center justify-center">
                            {/* TOXIC tag */}
                            <motion.div
                                className="absolute flex items-center gap-3"
                                style={{ opacity: tagToxicOpacity }}
                            >
                                <div className="w-2 h-2 bg-[#00ff40] shadow-[0_0_12px_#00ff40,0_0_24px_rgba(0,255,64,0.4)]" />
                                <span className="font-mono text-[10px] md:text-xs tracking-[0.5em] text-[#00ff40] uppercase font-bold drop-shadow-[0_0_8px_rgba(0,255,64,0.5)]">
                                    Season 01 // Deployed
                                </span>
                            </motion.div>
                            {/* AWAKEN tag */}
                            <motion.div
                                className="absolute flex items-center gap-3"
                                style={{ opacity: tagAwakenOpacity }}
                            >
                                <div className="w-2 h-2 bg-[#a0afbe] shadow-[0_0_12px_rgba(160,175,190,0.6),0_0_24px_rgba(160,175,190,0.3)]" />
                                <span className="font-mono text-[10px] md:text-xs tracking-[0.5em] text-[#a0afbe] uppercase font-bold drop-shadow-[0_0_8px_rgba(160,175,190,0.4)]">
                                    Season 02 // Active
                                </span>
                            </motion.div>
                        </div>

                        {/* Titles — crossfade with scale + Y movement */}
                        <div className="relative w-full" style={{ height: 'clamp(100px, 22vw, 250px)' }}>
                            <motion.h2
                                className="absolute inset-0 flex items-center justify-center font-teko text-[22vw] md:text-[16rem] font-bold uppercase leading-[0.75] text-white"
                                style={{ opacity: toxicOpacity, y: toxicY, scale: toxicScale }}
                            >
                                <span className="absolute text-[#00ff40] blur-[60px] opacity-30 select-none pointer-events-none" aria-hidden="true">TOXIC</span>
                                TOXIC
                            </motion.h2>
                            <motion.h2
                                className="absolute inset-0 flex items-center justify-center font-teko text-[20vw] md:text-[16rem] font-bold uppercase leading-[0.75] text-white"
                                style={{ opacity: awakenOpacity, y: awakenY, scale: awakenScale }}
                            >
                                <span className="absolute text-[#a0afbe] blur-[60px] opacity-25 select-none pointer-events-none" aria-hidden="true">AWAKEN</span>
                                AWAKEN
                            </motion.h2>
                        </div>

                        {/* Subtitles — crossfade */}
                        <div className="relative mt-8 md:mt-10 h-20 w-full max-w-lg flex items-start justify-center">
                            <motion.p
                                className="absolute font-mono text-xs md:text-sm tracking-widest uppercase leading-relaxed text-white/40 text-center"
                                style={{ opacity: subToxicOpacity }}
                            >
                                The initial perimeter breach. Bio-hazards unleashed in the arena. Only the immune survive the first purge.
                            </motion.p>
                            <motion.p
                                className="absolute font-mono text-xs md:text-sm tracking-widest uppercase leading-relaxed text-white/40 text-center"
                                style={{ opacity: subAwakenOpacity }}
                            >
                                The fog has lifted. Survivors emerge sharper and deadlier. The second protocol demands clarity — or annihilation.
                            </motion.p>
                        </div>

                        {/* Icons — crossfade */}
                        <div className="relative mt-10 md:mt-14 h-12 flex items-center justify-center">
                            <motion.div className="absolute" style={{ opacity: iconToxicOpacity }}>
                                <Biohazard size={40} strokeWidth={1} className="text-[#00ff40]/30" />
                            </motion.div>
                            <motion.div className="absolute" style={{ opacity: iconAwakenOpacity }}>
                                <Eye size={40} strokeWidth={1} className="text-[#a0afbe]/30" />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── UPCOMING SEASONS (Locked) ── */}
            <div className="relative z-10 max-w-4xl mx-auto px-6 pb-24 md:pb-32">
                <div className="flex items-center gap-4 mb-2 pt-8">
                    <ShieldAlert size={14} strokeWidth={1.5} className="text-white/15" />
                    <span className="font-mono text-[9px] md:text-[10px] text-white/25 tracking-[0.4em] uppercase">Upcoming Operations</span>
                    <div className="h-[1px] flex-1 bg-white/[0.04]" />
                </div>
                <LockedSeasonRow num="SZN_03" delay={0} />
                <LockedSeasonRow num="SZN_04" delay={0.1} />
                <LockedSeasonRow num="SZN_05" delay={0.2} />
            </div>

        </section>
    );
};

export default SeasonsSection;
