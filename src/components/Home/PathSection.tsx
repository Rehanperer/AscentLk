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
            <h3 className="font-teko text-[12vw] sm:text-[15vw] md:text-[11rem] leading-[0.85] font-bold text-white drop-shadow-[0_0_50px_rgba(255,70,85,1)] whitespace-nowrap transform-gpu">
                <span className="text-[8vw] sm:text-[10vw] md:text-[7rem] text-white">{prefix}</span>
                <span ref={ref}>0</span>
                <span className="text-[8vw] sm:text-[10vw] md:text-[7rem] text-[#ff4655]">{suffix}</span>
            </h3>
            <div className="font-mono text-sm md:text-2xl tracking-[0.3em] md:tracking-[0.5em] text-white uppercase mt-6 drop-shadow-[0_0_20px_rgba(255,70,85,0.8)]" style={{ opacity: isInView ? 1 : 0, transition: 'opacity 1s ease' }}>
                <ScrambleText text={label} duration={60} />
            </div>
        </div>
    );
};

const CinematicSlide: React.FC<{
    phaseNum: string;
    date: string;
    title: string;
    desc: string;
    imgSrc: string;
    scrollYProgress: any;
}> = ({ phaseNum, date, title, desc, imgSrc, scrollYProgress }) => {
    // Deep Parallax: Image moves right as container moves left
    const bgX = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

    return (
        <div className="w-screen h-screen flex-shrink-0 relative flex items-center justify-center overflow-hidden snap-center">
            {/* Background Texture / Image */}
            <motion.div className="absolute inset-0 w-[130%] h-full -left-[15%]" style={{ x: bgX }}>
                <img 
                    src={imgSrc} 
                    alt={title}
                    className="w-full h-full object-cover opacity-30 mix-blend-luminosity"
                />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-black/80 pointer-events-none" />

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-center h-full pt-32 md:pt-0 md:pl-48 lg:pl-[24rem]">
                <div className="max-w-2xl">
                    <div className="font-mono text-xs md:text-sm tracking-[0.4em] text-[#ff4655] uppercase mb-4 flex items-center flex-wrap gap-4">
                        <span className="bg-[#ff4655] text-black px-2 py-1 font-bold">{phaseNum}</span>
                        <span className="text-white/20">|</span>
                        <span className="text-white/70">{date}</span>
                    </div>
                    
                    <h2 className="font-teko text-7xl md:text-9xl font-bold uppercase text-white leading-[0.8] mb-6 drop-shadow-2xl">
                        {title}
                    </h2>
                    
                    <p className="text-white/60 text-base md:text-xl leading-relaxed uppercase tracking-wider font-medium max-w-xl">
                        {desc}
                    </p>
                    
                    {/* Tactical HUD Element */}
                    <div className="mt-12 flex items-center gap-4 border border-white/10 bg-white/5 p-4 max-w-xs backdrop-blur-sm">
                        <div className="w-2 h-2 bg-[#ff4655] animate-pulse" />
                        <span className="font-mono text-[10px] text-white/60 tracking-[0.3em] uppercase">Phase_Active</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PathSection: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"] // Track entire 500vh
    });

    // Horizontal scroll calculation (5 slides total, so we move -80% to see all 5 full screens)
    const xTransform = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"]);
    
    // Header Text morph logic
    // [0, 0.1] -> "ASCENT"
    // [0.1, 0.2] -> "FOR GLORY"
    const headerOpacity1 = useTransform(scrollYProgress, [0, 0.05, 0.1], [1, 1, 0]);
    const headerOpacity2 = useTransform(scrollYProgress, [0.05, 0.1, 0.15], [0, 0, 1]);
    const headerScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
    
    return (
        // 500vh container allows plenty of scroll depth to drive the horizontal track
        <section id="path" ref={containerRef} className="relative h-[500vh] bg-[#08080a]">
            
            {/* Sticky Viewport */}
            <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center bg-[#08080a]">
                
                {/* ── DYNAMIC BACKGROUND GRID / GLOW ── */}
                <div className="absolute inset-0 pointer-events-none z-0">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,70,85,0.05)_0%,transparent_70%)]" />
                    <div className="absolute inset-0 bg-scanlines opacity-10" />
                </div>

                {/* ── FIXED "ASCENT -> FOR GLORY" HEADER ── */}
                <div className="absolute top-8 left-6 md:top-20 md:left-12 z-20 pointer-events-none mix-blend-difference">
                    <motion.div className="relative" style={{ scale: headerScale, originX: 0, originY: 0 }}>
                        <motion.h2 
                            style={{ opacity: headerOpacity1 }}
                            className="absolute top-0 left-0 font-major-mono text-4xl sm:text-5xl md:text-8xl font-bold uppercase text-white"
                        >
                            ASCENT
                        </motion.h2>
                        <motion.h2 
                            style={{ opacity: headerOpacity2 }}
                            className="absolute top-0 left-0 font-major-mono text-4xl sm:text-5xl md:text-8xl font-bold uppercase text-[#ff4655] whitespace-nowrap"
                        >
                            FOR GLORY
                        </motion.h2>
                        {/* Ghost spacer to hold height */}
                        <h2 className="font-major-mono text-4xl sm:text-5xl md:text-8xl font-bold uppercase text-transparent select-none">
                            ASCENT
                        </h2>
                    </motion.div>
                </div>

                {/* ── THE HORIZONTAL TRACK ── */}
                <motion.div 
                    className="flex h-full w-[500vw]"
                    style={{ x: xTransform }}
                >
                    {/* SLIDE 1: Qualifiers */}
                    <CinematicSlide 
                        phaseNum="Phase 01"
                        date="Oct 2nd"
                        title="Qualifiers"
                        desc="Hundreds of units battle in a ruthless single-elimination bracket. Only the most disciplined tacticians survive the initial purge."
                        imgSrc="/img/qualifiers.jpg"
                        scrollYProgress={scrollYProgress}
                    />

                    {/* SLIDE 2: Playoffs */}
                    <CinematicSlide 
                        phaseNum="Phase 02"
                        date="Oct 9th"
                        title="Playoffs"
                        desc="The surviving elite clash in high-stakes, broadcasted best-of-threes. The pressure mounts as the nation watches."
                        imgSrc="/img/playoffs.png"
                        scrollYProgress={scrollYProgress}
                    />

                    {/* SLIDE 3: Redemption */}
                    <CinematicSlide 
                        phaseNum="Phase 03"
                        date="Nov 13th"
                        title="Redemption"
                        desc="A second chance for fallen squads. Fight through the brutal lower bracket crucible to earn a final spot."
                        imgSrc="/img/redemption.png"
                        scrollYProgress={scrollYProgress}
                    />

                    {/* SLIDE 4: Grand Finals */}
                    <CinematicSlide 
                        phaseNum="Terminal"
                        date="Nov 14th"
                        title="Grand Finals"
                        desc="Live from the Lumina Ballroom. Two titans remain. A state-of-the-art arena, roaring crowds, and absolute immortality on the line."
                        imgSrc="/img/grand-finals.jpg"
                        scrollYProgress={scrollYProgress}
                    />

                    {/* SLIDE 5: PRIZE POOL (The end of the track) */}
                    <div className="w-screen h-screen flex-shrink-0 relative flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-[#08080a]" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,70,85,0.15)_0%,transparent_50%)]" />
                        
                        <div className="relative z-10 w-full flex flex-col items-center justify-center mt-12 md:mt-0">
                            <div className="font-mono text-xs md:text-sm tracking-[0.4em] text-[#ff4655] uppercase mb-8 md:mb-12 flex items-center flex-wrap justify-center gap-4">
                                <span className="bg-[#ff4655] text-black px-2 py-1 font-bold">REWARD</span>
                                <span className="text-white/20">|</span>
                                <span className="text-white/70">CHAMPIONS STAKE</span>
                            </div>

                            <AnimatedCounter value={300000} label="LKR Total Prize Pool" suffix="+" duration={3} />
                        </div>
                    </div>
                </motion.div>
                
            </div>
            
        </section>
    );
};

export default PathSection;
