import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

/**
 * ScrollText — MOBILE OPTIMIZED + KEYWORD HIGHLIGHTING
 * Key phrases glow red for cinematic emphasis.
 */

const HIGHLIGHT_PHRASES = [
    "LUMINA", "BALLROOM", "ASCENT", "2026", "SRI", "LANKA'S", "FIRSTEVER",
    "HYBRID", "PRODUCTION", "STATEMENT", "GENERATION", "DEFINITIVE", "BLUEPRINT", "YOUTHLED", "STUDENTLED"
];

const ScrollWord: React.FC<{ children: string; progress: any; range: [number, number]; isHighlight?: boolean }> = ({ children, progress, range, isHighlight }) => {
    const opacity = useTransform(progress, range, [0.08, 0.85]);
    const y = useTransform(progress, range, [8, 0]);

    return (
        <span className="relative inline-block mx-[0.12em] mt-[0.1em]">
            <motion.span 
                style={{ opacity, y, display: 'inline-block' }}
                className={isHighlight ? 'text-[#ff4655] drop-shadow-[0_0_12px_rgba(255,70,85,0.4)]' : ''}
            >
                {children}
            </motion.span>
        </span>
    );
};

const ScrollText: React.FC<{ text: string }> = ({ text }) => {
    const containerRef = useRef<HTMLParagraphElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 85%", "end 50%"]
    });

    const words = text.split(" ");
    const totalWords = words.length;

    return (
        <p 
            ref={containerRef} 
            className="font-teko text-3xl sm:text-4xl md:text-5xl lg:text-7xl leading-[1.1] tracking-wide text-white uppercase flex flex-wrap justify-center text-center drop-shadow-xl"
        >
            {words.map((word, i) => {
                // Tighter per-word windows so each word pops sequentially L→R
                const wordSpan = 0.15; // each word takes 15% of scroll to fully reveal
                const start = (i / totalWords) * (1 - wordSpan);
                const end = start + wordSpan;
                const cleanWord = word.replace(/[^A-Za-z0-9']/g, '').toUpperCase();
                const isHighlight = HIGHLIGHT_PHRASES.includes(cleanWord);
                return (
                    <ScrollWord key={i} progress={scrollYProgress} range={[start, end]} isHighlight={isHighlight}>
                        {word}
                    </ScrollWord>
                );
            })}
        </p>
    );
};


const StatCounter: React.FC<{ value: string; label: string; delay?: number }> = ({ value, label, delay = 0 }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <div ref={ref} className="flex flex-col items-center text-center gap-2 relative overflow-hidden group px-2 sm:px-6">
            <motion.div 
                className="w-1.5 h-1.5 bg-[#ff4655] shadow-[0_0_10px_rgba(255,70,85,0.8)]" 
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : { scale: 0 }}
                transition={{ duration: 0.5, delay }}
            />
            <div className="flex flex-col items-center">
                <motion.span 
                    className="font-mono text-[#ff4655] font-bold text-xl sm:text-2xl md:text-3xl tracking-widest leading-none drop-shadow-[0_0_15px_rgba(255,70,85,0.6)]"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.6, delay: delay + 0.1 }}
                >
                    {value}
                </motion.span>
                <motion.span 
                    className="font-mono text-[7px] sm:text-[8px] md:text-[10px] text-white/50 uppercase tracking-[0.15em] sm:tracking-[0.3em] mt-1.5 sm:mt-2 whitespace-nowrap"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.6, delay: delay + 0.3 }}
                >
                    {label}
                </motion.span>
            </div>
        </div>
    );
};

const highlightItems = [
    {
        tag: "VENUE",
        title: "Lumina Ballroom",
        desc: "Cinnamon Life's premier event space — a world-class arena for the grand final and live concert.",
        icon: "◆",
    },
    {
        tag: "FORMAT",
        title: "5v5 Valorant",
        desc: "Open qualifiers → Regional playoffs → Grand final. Single-elimination brackets, best-of-three stages.",
        icon: "◈",
    },
    {
        tag: "PRODUCTION",
        title: "Broadcast Grade",
        desc: "Full live broadcast with professional casters, instant replays, player cams, and cinematic overlays.",
        icon: "◇",
    },
    {
        tag: "CONCERT",
        title: "Live Performance",
        desc: "A high-production musical concert fused with the championship — entertainment beyond the game.",
        icon: "♦",
    },
];

const HighlightCard: React.FC<{ item: typeof highlightItems[0]; index: number }> = ({ item, index }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-60px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.5, delay: index * 0.12, ease: [0.25, 1, 0.5, 1] }}
            className="relative group bg-white/[0.02] border border-white/5 p-6 md:p-8 hover:border-[#ff4655]/20 transition-all duration-500"
        >
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/10 group-hover:border-[#ff4655]/40 transition-colors duration-500" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/10 group-hover:border-[#ff4655]/40 transition-colors duration-500" />

            {/* Tag */}
            <div className="flex items-center gap-3 mb-4">
                <span className="text-[#ff4655] text-lg group-hover:drop-shadow-[0_0_8px_rgba(255,70,85,0.5)] transition-all">{item.icon}</span>
                <span className="font-mono text-[9px] tracking-[0.4em] text-[#ff4655] uppercase font-bold">{item.tag}</span>
            </div>

            {/* Content */}
            <h3 className="font-teko text-2xl md:text-3xl font-bold text-white uppercase tracking-wide leading-none mb-3">
                {item.title}
            </h3>
            <p className="font-mono text-[10px] md:text-xs text-white/35 tracking-wider uppercase leading-relaxed">
                {item.desc}
            </p>

            {/* Subtle hover glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#ff4655]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </motion.div>
    );
};

const HighlightsGrid: React.FC = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });

    return (
        <div ref={ref} className="relative z-30 w-full max-w-6xl mt-20 sm:mt-28 md:mt-36 px-4 sm:px-6">
            {/* Section label */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-4 mb-8 md:mb-12"
            >
                <div className="w-1.5 h-1.5 bg-[#ff4655] shadow-[0_0_8px_rgba(255,70,85,0.6)]" />
                <span className="font-mono text-[9px] md:text-[10px] tracking-[0.2em] sm:tracking-[0.4em] text-white/30 uppercase">Event Architecture</span>
                <div className="flex-1 h-[1px] bg-white/[0.05]" />
            </motion.div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                {highlightItems.map((item, i) => (
                    <HighlightCard key={item.tag} item={item} index={i} />
                ))}
            </div>
        </div>
    );
};

const AboutSection: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);

    return (
        <section 
            ref={sectionRef} 
            id="about" 
            className="relative py-32 md:py-56 px-4 sm:px-6 bg-[#080b13] overflow-x-clip overflow-y-visible flex flex-col justify-center items-center"
        >
            {/* ── HORIZON TEXT & SMUDGE (Bridging CinematicDoors and About) ── */}
            <motion.div 
                initial={{ opacity: 0, y: "-20%", scale: 0.95 }}
                whileInView={{ opacity: 1, y: "-50%", scale: 1 }}
                viewport={{ once: true, margin: "50px" }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute top-0 left-0 right-0 flex justify-center items-center z-50 pointer-events-none w-full h-32 md:h-48"
            >
                {/* 1. Volumetric Color Smudge (Blends Red & Blue) */}
                <div className="absolute left-1/2 -translate-x-1/2 w-[120%] md:w-full max-w-6xl h-32 md:h-56 bg-gradient-to-r from-[#ff4655]/20 via-[#a855f7]/30 to-[#3b82f6]/20 blur-[50px] md:blur-[80px] rounded-[100%]" />
                
                {/* 2. Glassmorphism Visor */}
                <div 
                    className="absolute left-1/2 -translate-x-1/2 w-full max-w-7xl h-12 md:h-20 backdrop-blur-md bg-[#080b13]/20 border-y border-white/[0.05]"
                    style={{ 
                        WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' 
                    }}
                />

                {/* 3. The Text */}
                <h4 className="relative z-10 font-mono text-[11px] sm:text-sm md:text-lg lg:text-xl xl:text-2xl tracking-[0.3em] sm:tracking-[0.5em] md:tracking-[0.6em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#ff4655] via-[#a855f7] to-[#64c8ff] font-bold text-center w-full max-w-7xl drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] px-4">
                    COMPETITION EVOLVED. ARTISTRY UNLEASHED.
                </h4>
            </motion.div>

            {/* ── VOLUMETRIC SIDE HAZE ── Pure CSS, zero perf cost */}
            {/* Left Haze — Deep Red */}
            <div 
                className="absolute left-0 top-0 w-[60%] md:w-[45%] h-full pointer-events-none z-0"
                style={{
                    background: 'radial-gradient(ellipse 80% 60% at 0% 50%, rgba(255, 70, 85, 0.12) 0%, transparent 70%)',
                }}
            />
            {/* Left Haze — Inner brighter core */}
            <div 
                className="absolute left-0 top-[20%] w-[35%] md:w-[25%] h-[60%] pointer-events-none z-0"
                style={{
                    background: 'radial-gradient(ellipse 100% 80% at 0% 50%, rgba(255, 70, 85, 0.08) 0%, transparent 60%)',
                }}
            />

            {/* Right Haze — Cool Cyan */}
            <div 
                className="absolute right-0 top-0 w-[60%] md:w-[45%] h-full pointer-events-none z-0"
                style={{
                    background: 'radial-gradient(ellipse 80% 60% at 100% 50%, rgba(100, 200, 255, 0.08) 0%, transparent 70%)',
                }}
            />
            {/* Right Haze — Inner brighter core */}
            <div 
                className="absolute right-0 top-[20%] w-[35%] md:w-[25%] h-[60%] pointer-events-none z-0"
                style={{
                    background: 'radial-gradient(ellipse 100% 80% at 100% 50%, rgba(100, 200, 255, 0.06) 0%, transparent 60%)',
                }}
            />

            {/* Bottom Floor Fog — ties the two side hazes together */}
            <div 
                className="absolute bottom-0 left-0 w-full h-[40%] md:h-[35%] pointer-events-none z-0"
                style={{
                    background: 'linear-gradient(to top, rgba(255, 70, 85, 0.06) 0%, transparent 100%)',
                }}
            />

            {/* Static container */}
            <div className="max-w-6xl mx-auto w-full relative z-10 flex flex-col items-center text-center justify-center min-h-[50vh] sm:min-h-[70vh]">
                
                {/* ── Deep Background ── */}
                <div className="absolute inset-0 pointer-events-none opacity-40 flex flex-col items-center justify-center">
                    {/* Glowing Core Orb */}
                    <div className="absolute w-[80vw] h-[80vw] md:w-[600px] md:h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(255,70,85,0.15)_0%,transparent_60%)]" />
                    
                    {/* Grid */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_30%,transparent_100%)]" />

                    {/* Ghost Watermark */}
                    <div className="absolute font-teko text-[35vw] leading-none text-white/[0.02] tracking-tighter mix-blend-overlay font-bold select-none">
                        //EVOLVE
                    </div>
                </div>

                {/* ── Core Text ── */}
                <div className="relative z-20 flex flex-col items-center w-full">
                    <div className="mb-8 md:mb-12 inline-flex items-center gap-3">
                        <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-l from-[#ff4655] to-transparent" />
                        <span className="font-mono text-[9px] sm:text-xs tracking-[0.4em] sm:tracking-[0.5em] uppercase text-[#ff4655] font-bold drop-shadow-[0_0_10px_rgba(255,70,85,0.6)]">
                            Initiating Phase Alpha
                        </span>
                        <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-r from-[#ff4655] to-transparent" />
                    </div>
                    
                    <div className="max-w-5xl mx-auto w-full px-2 flex flex-col items-center">
                        {/* ── Paragraph 1 ── */}
                        <div className="max-w-4xl w-full">
                            <ScrollText text="This November, the Lumina Ballroom at Cinnamon Life transforms into the epicenter of a new era. ASCENT 2026 is breaking the mold as Sri Lanka's first-ever student-led hybrid production of this scale." />
                        </div>

                        {/* ── Cinematic Pull-Quote Divider ── */}
                        <motion.div 
                            initial={{ opacity: 0, scaleX: 0 }}
                            whileInView={{ opacity: 1, scaleX: 1 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                            className="my-16 md:my-24 flex flex-col items-center w-full max-w-3xl origin-center"
                        >
                            {/* Top accent line */}
                            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff4655]/40 to-transparent mb-8 md:mb-12" />
                            
                            {/* The pull-quote */}
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="text-center relative px-4 flex flex-col items-center"
                            >
                                <span className="font-mono text-[8px] md:text-[10px] tracking-[0.6em] text-white/20 uppercase block mb-4">// Signal Intercept</span>
                                
                                <div className="relative">
                                    <h3 className="font-teko text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white/[0.07] uppercase leading-[0.9] tracking-tight select-none">
                                        WHERE THE BATTLEFIELD<br />BECOMES A STADIUM
                                    </h3>
                                    {/* Overlay glow text */}
                                    <h3 className="absolute inset-0 flex items-center justify-center font-teko text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.9] tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-[#ff4655] to-[#ff4655]/30 pointer-events-none" style={{ textShadow: '0 0 60px rgba(255,70,85,0.15)' }}>
                                        WHERE THE BATTLEFIELD<br />BECOMES A STADIUM
                                    </h3>
                                </div>
                            </motion.div>

                            {/* Bottom accent line */}
                            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff4655]/40 to-transparent mt-8 md:mt-12" />
                        </motion.div>

                        {/* ── Paragraph 2 ── */}
                        <div className="max-w-4xl w-full">
                            <ScrollText text="This isn't just a tournament or a performance — it's a statement. Born from sleepless nights and relentless ambition, ASCENT 2026 is living proof of what happens when you let our generation build the future instead of waiting for it. This is our heartbeat, our passion, and the definitive new blueprint for what youth-led entertainment can achieve when we refuse to think small." />
                        </div>
                    </div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="mt-12 md:mt-20 group inline-flex flex-col items-center cursor-pointer relative"
                    >
                        <div className="flex items-center gap-4 text-white/50 group-hover:text-[#ff4655] transition-colors duration-500">
                            <span className="font-mono text-[10px] tracking-[0.3em] uppercase">Deploy Protocol</span>
                            <div className="w-12 h-[1px] bg-white/20 group-hover:bg-[#ff4655] group-hover:w-20 transition-all duration-500 relative">
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#ff4655] opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_10px_#ff4655]" />
                            </div>
                        </div>
                    </motion.div>
                </div>
                
            </div>

            {/* ── Foreground Stats (FLAT, OUTSIDE ANY 3D) ── */}
            <div 
                className="relative z-30 flex flex-row items-center justify-center gap-4 sm:gap-12 md:gap-24 mt-16 sm:mt-24 pt-8 sm:pt-12 w-full max-w-4xl border-t border-white/[0.05]"
            >
                 <StatCounter value="50,000+" label="Student Reach" delay={0} />
                 <div className="h-10 w-[1px] bg-white/[0.05]" />
                 <StatCounter value="16" label="Elite Systems" delay={0.2} />
                 <div className="h-10 w-[1px] bg-white/[0.05]" />
                 <StatCounter value="300K" label="Prize Protocol" delay={0.4} />
            </div>

            {/* ── EVENT HIGHLIGHTS GRID ── */}
            <HighlightsGrid />
        </section>
    );
};

export default AboutSection;
