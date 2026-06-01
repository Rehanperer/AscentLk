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



const PhaseBlock: React.FC<{ 
    phaseNum: string; 
    date: string;
    title: string; 
    desc: string; 
    imgSrc: string; 
    isReversed?: boolean;
    containerProgress: any;
    startRange: number;
    endRange: number;
}> = ({ phaseNum, date, title, desc, imgSrc, isReversed = false, containerProgress, startRange, endRange }) => {
    
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
                <div className="font-mono text-xs tracking-[0.4em] text-[#ff4655] uppercase mb-4 flex items-center flex-wrap gap-2">
                    {phaseNum}
                    <span className="text-white/20">|</span>
                    <span className="text-white/70">{date}</span>
                </div>
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

    // Animate the central red line filling up the Timeline
    const lineFillHeight = useTransform(scrollYProgress, [0, 0.7], ["0%", "100%"]);
    
    // Animate the diamond lighting up as the scroll reaches the bottom
    const diamondGlowOpacity = useTransform(scrollYProgress, [0.85, 0.95], [0, 1]);

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
                        THE ASCENT TO GLORY
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
                        date="Oct 2nd"
                        title="Qualifiers"
                        desc="Hundreds of units battle in a ruthless single-elimination bracket. Only the most disciplined tacticians survive the initial purge. No margin for error."
                        imgSrc="/img/phase_01.png"
                        containerProgress={scrollYProgress}
                        startRange={0.05}
                        endRange={0.2}
                    />

                    <PhaseBlock 
                        phaseNum="Phase 02"
                        date="Oct 9th"
                        title="Playoffs"
                        desc="The surviving elite clash in high-stakes, broadcasted best-of-threes. The pressure mounts as the nation watches. Every flash, every peek matters."
                        imgSrc="/img/phase_02.png"
                        isReversed
                        containerProgress={scrollYProgress}
                        startRange={0.25}
                        endRange={0.4}
                    />
                    
                    <PhaseBlock 
                        phaseNum="Phase 03"
                        date="Nov 13th"
                        title="Redemption"
                        desc="A second chance for fallen squads. Fight through the brutal lower bracket crucible to earn a final spot in the ultimate showdown."
                        imgSrc="/img/phase_01.png"
                        containerProgress={scrollYProgress}
                        startRange={0.45}
                        endRange={0.6}
                    />

                    <PhaseBlock 
                        phaseNum="Terminal"
                        date="Nov 14th"
                        title="Grand Finals"
                        desc="Live from the Lumina Ballroom. Two titans remain. A state-of-the-art arena, roaring crowds, and absolute immortality on the line. The Gauntlet ends here."
                        imgSrc="/img/phase_03.png"
                        isReversed
                        containerProgress={scrollYProgress}
                        startRange={0.65}
                        endRange={0.8}
                    />

                </div>

                {/* ═══════════════════════════════════════════════
                    CONCEPT A — "THE ARENA FLOOR"
                    Top-down spike site. Geometric grid. Planted prize.
                ═══════════════════════════════════════════════ */}
                <div className="mt-32 md:mt-48 mb-8 relative w-full min-h-[80vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden">
                    
                    {/* --- ROUTING & CONNECTION LINES --- */}
                    
                    {/* Desktop: Straight line down from timeline to diamond center */}
                    <div className="hidden md:block absolute -top-[12rem] left-1/2 bottom-1/2 w-[2px] bg-white/5 -translate-x-1/2 pointer-events-none z-0">
                        <motion.div 
                            className="absolute top-0 left-0 w-full h-full bg-[#ff4655] shadow-[0_0_15px_#ff4655] origin-top"
                            style={{ scaleY: useTransform(scrollYProgress, [0.7, 0.85], [0, 1]) }}
                        />
                    </div>

                    {/* Mobile: Drop down left margin */}
                    <div className="md:hidden absolute -top-[8rem] left-[20px] h-[8rem] w-[2px] bg-white/5 -translate-x-1/2 pointer-events-none z-0">
                        <motion.div 
                            className="absolute top-0 left-0 w-full h-full bg-[#ff4655] shadow-[0_0_15px_#ff4655] origin-top"
                            style={{ scaleY: useTransform(scrollYProgress, [0.7, 0.73], [0, 1]) }}
                        />
                    </div>
                    
                    {/* Mobile: Horizontal bridge to center */}
                    <div className="md:hidden absolute top-0 left-[20px] w-[calc(50%-20px)] h-[2px] bg-white/5 pointer-events-none z-0">
                        <motion.div 
                            className="absolute top-0 left-0 w-full h-full bg-[#ff4655] shadow-[0_0_15px_#ff4655] origin-left"
                            style={{ scaleX: useTransform(scrollYProgress, [0.73, 0.75], [0, 1]) }}
                        />
                    </div>

                    {/* Mobile: Drop into diamond center */}
                    <div className="md:hidden absolute top-0 left-1/2 bottom-1/2 w-[2px] bg-white/5 -translate-x-1/2 pointer-events-none z-0">
                        <motion.div 
                            className="absolute top-0 left-0 w-full h-full bg-[#ff4655] shadow-[0_0_15px_#ff4655] origin-top"
                            style={{ scaleY: useTransform(scrollYProgress, [0.75, 0.85], [0, 1]) }}
                        />
                    </div>

                    {/* Arena floor grid pattern */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        {/* Outer diamond */}
                        <motion.div 
                            className="absolute w-[85vw] h-[85vw] max-w-[700px] max-h-[700px] border rotate-45 transition-colors"
                            style={{ borderColor: useTransform(diamondGlowOpacity, v => `rgba(255,255,255,${0.03 + v * 0.1})`) }}
                        />
                        {/* Mid diamond */}
                        <motion.div 
                            className="absolute w-[60vw] h-[60vw] max-w-[500px] max-h-[500px] border rotate-45"
                            style={{ borderColor: useTransform(diamondGlowOpacity, v => `rgba(255,70,85,${0.06 + v * 0.2})`) }}
                        />
                        {/* Inner diamond */}
                        <motion.div 
                            className="absolute w-[35vw] h-[35vw] max-w-[300px] max-h-[300px] border rotate-45"
                            style={{ borderColor: useTransform(diamondGlowOpacity, v => `rgba(255,70,85,${0.12 + v * 0.4})`), boxShadow: useTransform(diamondGlowOpacity, v => `0 0 ${20 * v}px rgba(255,70,85,${0.2 * v})`) }}
                        />
                        {/* Core diamond */}
                        <motion.div 
                            className="absolute w-[15vw] h-[15vw] max-w-[130px] max-h-[130px] border rotate-45 bg-[#ff4655]/5"
                            style={{ 
                                borderColor: useTransform(diamondGlowOpacity, v => `rgba(255,70,85,${0.2 + v * 0.8})`),
                                boxShadow: useTransform(diamondGlowOpacity, v => `0 0 ${40 * v}px rgba(255,70,85,${0.4 * v}) inset, 0 0 ${40 * v}px rgba(255,70,85,${0.4 * v})`)
                            }}
                        />
                        
                        {/* Cross lines through center */}
                        <motion.div 
                            className="absolute w-[90vw] max-w-[750px] h-[1px]" 
                            style={{ background: useTransform(diamondGlowOpacity, v => `linear-gradient(90deg, transparent, rgba(255,70,85,${0.04 + v * 0.4}), transparent)`) }} 
                        />
                        <motion.div 
                            className="absolute h-[90vw] max-h-[750px] w-[1px]" 
                            style={{ background: useTransform(diamondGlowOpacity, v => `linear-gradient(180deg, transparent, rgba(255,70,85,${0.04 + v * 0.4}), transparent)`) }} 
                        />
                        
                        {/* Diagonal cross lines */}
                        <motion.div 
                            className="absolute w-[120vw] max-w-[900px] h-[1px] rotate-45" 
                            style={{ background: useTransform(diamondGlowOpacity, v => `linear-gradient(90deg, transparent, rgba(255,70,85,${0.03 + v * 0.3}), transparent)`) }} 
                        />
                        <motion.div 
                            className="absolute w-[120vw] max-w-[900px] h-[1px] -rotate-45" 
                            style={{ background: useTransform(diamondGlowOpacity, v => `linear-gradient(90deg, transparent, rgba(255,70,85,${0.03 + v * 0.3}), transparent)`) }} 
                        />

                        {/* Corner markers on mid diamond */}
                        {/* Top */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 pointer-events-none" style={{ transform: 'translate(-50%, -50%)' }}>
                            <div className="absolute -top-[30vw] md:-top-[250px] left-1/2 -translate-x-1/2 w-3 h-3 border border-[#ff4655]/30 rotate-45" />
                            <div className="absolute -bottom-[30vw] md:-bottom-[250px] left-1/2 -translate-x-1/2 w-3 h-3 border border-[#ff4655]/30 rotate-45" />
                            <div className="absolute top-1/2 -translate-y-1/2 -left-[30vw] md:-left-[250px] w-3 h-3 border border-[#ff4655]/30 rotate-45" />
                            <div className="absolute top-1/2 -translate-y-1/2 -right-[30vw] md:-right-[250px] w-3 h-3 border border-[#ff4655]/30 rotate-45" />
                        </div>

                        {/* Radial glow from center — the "spike" energy */}
                        <motion.div className="absolute w-[50vw] h-[50vw] max-w-[400px] max-h-[400px] rounded-full pointer-events-none" style={{
                            background: 'radial-gradient(circle at center, rgba(255,70,85,1) 0%, rgba(255,70,85,0.4) 40%, transparent 70%)',
                            opacity: useTransform(diamondGlowOpacity, v => v * 0.25)
                        }} />
                        
                        {/* Floor glow wash */}
                        <div className="absolute inset-0" style={{
                            background: 'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(255,70,85,0.06) 0%, transparent 60%)'
                        }} />
                    </div>

                    {/* Spike site labels */}
                    <div className="absolute top-[12%] left-1/2 -translate-x-1/2 font-mono text-[8px] md:text-[10px] tracking-[0.6em] text-[#ff4655]/20 uppercase">Site_Alpha</div>
                    <div className="absolute bottom-[12%] left-1/2 -translate-x-1/2 font-mono text-[8px] md:text-[10px] tracking-[0.6em] text-white/10 uppercase">Payload_Active</div>

                    {/* Corner tactical markers */}
                    <div className="absolute top-[8%] left-[8%] w-8 h-8 border-t border-l border-[#ff4655]/15" />
                    <div className="absolute top-[8%] right-[8%] w-8 h-8 border-t border-r border-[#ff4655]/15" />
                    <div className="absolute bottom-[8%] left-[8%] w-8 h-8 border-b border-l border-[#ff4655]/15" />
                    <div className="absolute bottom-[8%] right-[8%] w-8 h-8 border-b border-r border-[#ff4655]/15" />

                    {/* ── THE NUMBER (planted spike) ── */}
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
