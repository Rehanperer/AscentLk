import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

/**
 * CinematicDoors — A scroll-driven gatekeeper component.
 * Features two massive industrial panels that open to reveal the ASCENT text.
 */

const CinematicDoors: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Smoothen the scroll progress for heavy organic movement
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 40,
        damping: 20,
        restDelta: 0.001
    });

    // Left door: Slides across 100% of the screen width
    const leftX = useTransform(smoothProgress, [0.1, 0.8], ["0%", "-100%"]);
    // Right door: Slides across 100% of the screen width
    const rightX = useTransform(smoothProgress, [0.1, 0.8], ["0%", "100%"]);
    
    // Background text reveal: Wait until doors are open significantly
    const textScale = useTransform(smoothProgress, [0.3, 0.9], [0.7, 1.2]);
    const textOpacity = useTransform(smoothProgress, [0.3, 0.6], [0, 1]); // Reveal later
    const coreGlow = useTransform(smoothProgress, [0.3, 0.8], [0, 1]);
    
    // Initial Hint: Show when user first reaches the section, fade as they start
    const initialHintOpacity = useTransform(smoothProgress, [0, 0.15], [1, 0]);

    return (
        <section 
            ref={containerRef} 
            className="relative h-[300vh] bg-black"
            id="cinematic-reveal"
        >
            <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
                
                {/* ── BACKGROUND REVEAL ── */}
                <div className="absolute inset-0 flex items-center justify-center z-0 bg-[#08080a]">
                    {/* Radial Atmosphere */}
                    <motion.div 
                        style={{ opacity: coreGlow }}
                        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,70,85,0.15)_0%,transparent_70%)]"
                    />
                    
                    {/* The Logo Reveal */}
                    <motion.div 
                        style={{ scale: textScale, opacity: textOpacity }}
                        className="relative z-10 flex flex-col items-center text-center px-4"
                    >
                        <h2 className="font-teko text-[8vw] md:text-[7rem] font-bold text-white leading-tight drop-shadow-[0_0_50px_rgba(255,255,255,0.3)] uppercase">
                            Where Legends <span className="text-[#ff4655]">Ascend</span>
                        </h2>
                        <div className="flex items-center gap-4 mt-4">
                            <div className="h-px w-8 md:w-16 bg-white/20" />
                            <span className="font-mono text-[9px] md:text-xs tracking-[0.5em] text-white/60 uppercase font-bold">
                                Welcome to Ascent 2026
                            </span>
                            <div className="h-px w-8 md:w-16 bg-white/20" />
                        </div>
                        
                        {/* Keep Scrolling Hint */}
                        <motion.div 
                            style={{ opacity: useTransform(smoothProgress, [0.4, 0.7], [0, 1]) }}
                            className="mt-12 flex flex-col items-center gap-4"
                        >
                            <div className="w-px h-12 bg-gradient-to-b from-[#ff4655] to-transparent" />
                            <span className="font-mono text-[8px] tracking-[0.4em] text-[#ff4655] uppercase animate-pulse">
                                Keep Scrolling to Enter
                            </span>
                        </motion.div>
                    </motion.div>
                </div>

                {/* ── LEFT DOOR ── */}
                <motion.div 
                    style={{ x: leftX }}
                    className="absolute top-0 left-0 h-full w-1/2 z-20 bg-[#121214] border-r border-white/10 shadow-[20px_0_40px_rgba(0,0,0,0.8)]"
                >
                    {/* Metal Texture & Industrial Details */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')]" />
                    
                    <div className="absolute top-1/2 right-10 -translate-y-1/2 flex flex-col items-end gap-12">
                        <div className="w-1.5 h-32 bg-white/5 order-last" />
                        {/* Red Status Light */}
                        <div className="flex flex-col items-end gap-2">
                            <div className="text-[10px] font-mono text-white/30 tracking-[0.3em] uppercase">Security Level B</div>
                            <div className="h-2 w-12 bg-[#ff4655] shadow-[0_0_15px_#ff4655]" />
                        </div>
                        <div className="w-px h-24 bg-gradient-to-t from-white/10 to-transparent" />
                    </div>

                    {/* Industrial Label */}
                    <div className="absolute bottom-12 right-12 text-right">
                        <div className="font-mono text-[8px] text-white/10 tracking-[0.5em] uppercase mb-1 underline">Sector_001A</div>
                        <div className="font-teko text-3xl text-white/5 opacity-50">HEAVY CARGO</div>
                    </div>
                </motion.div>

                {/* ── RIGHT DOOR ── */}
                <motion.div 
                    style={{ x: rightX }}
                    className="absolute top-0 right-0 h-full w-1/2 z-20 bg-[#121214] border-l border-white/10 shadow-[-20px_0_40px_rgba(0,0,0,0.8)]"
                >
                    <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')]" />

                    <div className="absolute top-1/2 left-10 -translate-y-1/2 flex flex-col items-start gap-12">
                        <div className="w-1.5 h-32 bg-white/5" />
                        {/* Cyan Status Light */}
                        <div className="flex flex-col items-start gap-2">
                            <div className="text-[10px] font-mono text-white/30 tracking-[0.3em] uppercase">Hydraulic Status</div>
                            <div className="h-2 w-12 bg-[#64c8ff] shadow-[0_0_15px_#64c8ff]" />
                        </div>
                        <div className="w-px h-24 bg-gradient-to-b from-white/10 to-transparent" />
                    </div>

                     {/* Industrial Label */}
                     <div className="absolute top-12 left-12">
                        <div className="font-mono text-[8px] text-white/10 tracking-[0.5em] uppercase mb-1">Restricted Access</div>
                        <div className="font-teko text-3xl text-white/5 opacity-50 uppercase">Maintenance Required</div>
                    </div>
                </motion.div>

                {/* ── INITIAL SCROLL HINT ── */}
                <motion.div 
                    style={{ opacity: initialHintOpacity }}
                    className="absolute top-[10vh] inset-x-0 z-40 flex flex-col items-center gap-4 pointer-events-none"
                >
                    <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-2">
                        <motion.div 
                            animate={{ y: [0, 12, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            className="w-1 h-2 bg-[#ff4655] rounded-full"
                        />
                    </div>
                    <span className="font-mono text-[9px] tracking-[0.4em] text-white/40 uppercase">
                        Scroll to Decrypt
                    </span>
                </motion.div>

                {/* ── GAP PARTICLES / HYDRAULIC STEAM ── */}
                <motion.div 
                    style={{ opacity: useTransform(smoothProgress, [0.1, 0.4], [0.8, 0]) }}
                    className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center"
                >
                    <div className="h-full w-2 bg-white/20 blur-xl animate-pulse" />
                </motion.div>

            </div>
        </section>
    );
};

export default CinematicDoors;
