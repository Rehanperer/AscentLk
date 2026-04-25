import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * CinematicDoors — A scroll-driven gatekeeper component.
 * PERFORMANCE OPTIMIZED: Removed useSpring (heavy physics), removed blur filters,
 * removed infinitely-animating lightning SVGs. Pure transform + opacity only.
 */

const CinematicDoors: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Direct scroll-linked transforms (no spring physics overhead)
    const leftX = useTransform(scrollYProgress, [0.1, 0.8], ["0%", "-100%"]);
    const rightX = useTransform(scrollYProgress, [0.1, 0.8], ["0%", "100%"]);
    
    // Crack light — simple opacity, NO blur
    const crackLightOpacity = useTransform(scrollYProgress, [0.05, 0.15, 0.3], [0, 1, 0]);
    
    // Background text reveal
    const textScale = useTransform(scrollYProgress, [0.3, 0.9], [0.8, 1.1]);
    const textOpacity = useTransform(scrollYProgress, [0.25, 0.6], [0, 1]);
    const textY = useTransform(scrollYProgress, [0.3, 0.8], [80, 0]);
    const coreGlow = useTransform(scrollYProgress, [0.3, 0.8], [0, 1]);
    
    // Subtitle line
    const lineScaleX = useTransform(scrollYProgress, [0.4, 0.7], [0, 1]);
    
    // Initial hint
    const initialHintOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

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
                        style={{ 
                            scale: textScale, 
                            opacity: textOpacity,
                            y: textY
                        }}
                        className="relative z-10 flex flex-col items-center text-center px-4 w-full"
                    >
                        {/* Radial Glow */}
                        <motion.div 
                            style={{ opacity: coreGlow }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[150vh] bg-[radial-gradient(ellipse_at_center,rgba(255,70,85,0.25)_0%,transparent_60%)] pointer-events-none"
                        />
                        
                        {/* Text content — removed floating animation (saves constant repaints) */}
                        <div className="flex flex-col items-center w-full">
                            <h2 
                                className="relative font-teko text-[16vw] sm:text-[12vw] md:text-[7rem] font-bold text-white leading-[0.9] md:leading-tight uppercase"
                                style={{ textShadow: "0 0 40px rgba(255,70,85,0.4)" }}
                            >
                                <span className="block md:inline">Where Legends</span> <span className="text-[#ff4655]" style={{ textShadow: "0 0 20px rgba(255,70,85,0.8)" }}>Ascend</span>
                            </h2>
                            <div className="flex items-center gap-2 md:gap-4 mt-6 md:mt-4 w-full max-w-sm md:max-w-md justify-center">
                                <motion.div 
                                    style={{ scaleX: lineScaleX, transformOrigin: 'right' }} 
                                    className="h-px w-10 md:w-16 bg-white/40" 
                                />
                                <span className="font-mono text-[10px] md:text-xs tracking-[0.4em] md:tracking-[0.5em] text-white/60 uppercase font-bold text-center">
                                    Welcome to Ascent
                                </span>
                                <motion.div 
                                    style={{ scaleX: lineScaleX, transformOrigin: 'left' }} 
                                    className="h-px w-10 md:w-16 bg-white/40" 
                                />
                            </div>
                        </div>
                        
                        {/* Keep Scrolling Hint */}
                        <motion.div 
                            style={{ opacity: useTransform(scrollYProgress, [0.4, 0.7], [0, 1]) }}
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
                    style={{ x: leftX, willChange: 'transform' }}
                    className="absolute top-0 left-0 h-full w-1/2 z-20 bg-gradient-to-r from-[#0a0a0c] via-[#101014] to-[#18181c] border-r border-[#ffffff30] shadow-[inset_-2px_0_10px_rgba(0,0,0,0.8)] overflow-hidden"
                >
                    {/* Metal texture via CSS pattern (no external URL load) */}
                    <div className="absolute inset-0 opacity-5 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.03)_2px,rgba(255,255,255,0.03)_4px)]" />
                    
                    <div className="absolute top-1/2 right-4 md:right-10 -translate-y-1/2 flex flex-col items-end gap-12">
                        <div className="w-1 md:w-1.5 h-20 md:h-32 bg-white/5 order-last" />
                        <div className="flex flex-col items-end gap-2">
                            <div className="text-[8px] md:text-[10px] font-mono text-white/30 tracking-[0.3em] uppercase">Security Level B</div>
                            <div className="h-1.5 md:h-2 w-8 md:w-12 bg-[#ff4655] shadow-[0_0_15px_#ff4655]" />
                        </div>
                        <div className="w-px h-16 md:h-24 bg-gradient-to-t from-white/10 to-transparent" />
                    </div>

                    <div className="absolute bottom-8 md:bottom-12 right-4 md:right-12 text-right opacity-30 md:opacity-100">
                        <div className="font-mono text-[7px] md:text-[8px] text-white/10 tracking-[0.4em] md:tracking-[0.5em] uppercase mb-1 underline">Sector_001A</div>
                        <div className="font-teko text-2xl md:text-3xl text-white/5 opacity-50">HEAVY CARGO</div>
                    </div>
                </motion.div>

                {/* ── RIGHT DOOR ── */}
                <motion.div 
                    style={{ x: rightX, willChange: 'transform' }}
                    className="absolute top-0 right-0 h-full w-1/2 z-20 bg-gradient-to-l from-[#0a0a0c] via-[#101014] to-[#18181c] border-l border-[#ffffff30] shadow-[inset_2px_0_10px_rgba(0,0,0,0.8)] overflow-hidden"
                >
                    <div className="absolute inset-0 opacity-5 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.03)_2px,rgba(255,255,255,0.03)_4px)]" />

                    <div className="absolute top-1/2 left-4 md:left-10 -translate-y-1/2 flex flex-col items-start gap-12">
                        <div className="w-1 md:w-1.5 h-20 md:h-32 bg-white/5" />
                        <div className="flex flex-col items-start gap-2">
                            <div className="text-[8px] md:text-[10px] font-mono text-white/30 tracking-[0.3em] uppercase">Hydraulic Status</div>
                            <div className="h-1.5 md:h-2 w-8 md:w-12 bg-[#64c8ff] shadow-[0_0_15px_#64c8ff]" />
                        </div>
                        <div className="w-px h-16 md:h-24 bg-gradient-to-b from-white/10 to-transparent" />
                    </div>

                     <div className="absolute top-8 md:top-12 left-4 md:left-12 opacity-30 md:opacity-100">
                        <div className="font-mono text-[7px] md:text-[8px] text-white/10 tracking-[0.4em] md:tracking-[0.5em] uppercase mb-1">Restricted Access</div>
                        <div className="font-teko text-2xl md:text-3xl text-white/5 opacity-50 uppercase">Maintenance Required</div>
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
                    <span className="font-mono text-[8px] md:text-[9px] tracking-[0.4em] text-white/40 uppercase">
                        Scroll to Decrypt
                    </span>
                </motion.div>

                {/* ── CINEMATIC CRACK LIGHT — No blur, just opacity gradient ── */}
                <motion.div 
                    style={{ opacity: crackLightOpacity }}
                    className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[100px] z-30 bg-[radial-gradient(ellipse_at_center,rgba(255,70,85,0.6)_0%,transparent_70%)] pointer-events-none mix-blend-screen"
                />

                {/* ── LASER CUT LINE ── */}
                <motion.div 
                    style={{ opacity: useTransform(scrollYProgress, [0.05, 0.3], [1, 0]) }}
                    className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center mix-blend-screen"
                >
                    <div className="h-full w-[2px] bg-white shadow-[0_0_30px_rgba(255,70,85,1),0_0_60px_rgba(255,70,85,1)] animate-pulse" />
                </motion.div>

            </div>
        </section>
    );
};

export default CinematicDoors;
