import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AscentCoreVisual from './Effects/AscentCoreVisual';
import AscentRegisterButton from './Effects/AscentRegisterButton';

const CountdownSection: React.FC = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <section id="countdown" className="relative overflow-hidden py-16 md:py-24 bg-atmospheric-blood">
            {/* TACTICAL BACKGROUND LAYER */}
            <div className="absolute inset-0 z-0">
                {/* Atmospheric crimson glow orbs - Centered away from edges */}
                <div className="absolute top-1/4 left-0 w-full h-80 bg-[#4a0000]/40 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-1/4 left-0 w-full h-80 bg-[#4a0000]/40 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#4a0000]/20 rounded-full blur-[180px] anim-pulse-slow pointer-events-none" />

                {/* Technical Grid Accent */}
                <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />

                {/* Corner Markers */}
                <div className="absolute top-10 left-10 w-20 h-20 border-t border-l border-[#ff4655]/30" />
                <div className="absolute top-10 right-10 w-20 h-20 border-t border-r border-[#ff4655]/30" />
                <div className="absolute bottom-10 left-10 w-20 h-20 border-b border-l border-[#ff4655]/30" />
                <div className="absolute bottom-10 right-10 w-20 h-20 border-b border-r border-[#ff4655]/30" />
            </div>

            {/* MAR 06 GHOST TEXT */}
            <div className="absolute inset-0 flex items-center justify-center font-teko font-bold text-[12rem] md:text-[25rem] text-white/[0.02] select-none pointer-events-none -rotate-6">
                MARCH 13
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-20">
                    <div className="text-center lg:text-left">
                        <motion.div
                            initial={isMobile ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                            animate={isMobile ? { opacity: 1, x: 0 } : undefined}
                            whileInView={!isMobile ? { opacity: 1, x: 0 } : undefined}
                            viewport={!isMobile ? { once: true } : undefined}
                            className="inline-flex items-center gap-2 px-3 py-1 border border-[#ff4655]/30 bg-[#ff4655]/10 text-[#ff4655] font-mono text-xs mb-6 uppercase tracking-wider"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
                            Status: ALLIANCE_PORTAL_ACTIVE
                        </motion.div>

                        <motion.h2
                            initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            animate={isMobile ? { opacity: 1, y: 0 } : undefined}
                            whileInView={!isMobile ? { opacity: 1, y: 0 } : undefined}
                            viewport={!isMobile ? { once: true } : undefined}
                            className="font-teko text-5xl md:text-7xl font-bold text-white leading-[0.9] mb-6 uppercase tracking-tight"
                        >
                            REGISTRATION IS<br />
                            <span className="text-[#ff4655] drop-shadow-[0_0_15px_rgba(255,70,85,0.4)]">OFFICIALLY LIVE</span>
                        </motion.h2>

                        <motion.p
                            initial={isMobile ? { opacity: 1 } : { opacity: 0 }}
                            animate={isMobile ? { opacity: 1 } : undefined}
                            whileInView={!isMobile ? { opacity: 1 } : undefined}
                            viewport={!isMobile ? { once: true } : undefined}
                            transition={!isMobile ? { delay: 0.2 } : undefined}
                            className="text-white/40 font-mono text-sm md:text-base max-w-md mx-auto lg:mx-0 leading-relaxed mb-10"
                        >
                            REGISTRATION PORTAL IS NOW OPERATIONAL.
                            CLAIM YOUR SPOT IN THE GAUNTLET. THE ASCENT AWAITS.
                        </motion.p>

                        <motion.div
                            initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                            animate={isMobile ? { opacity: 1, y: 0 } : undefined}
                            whileInView={!isMobile ? { opacity: 1, y: 0 } : undefined}
                            viewport={!isMobile ? { once: true } : undefined}
                            transition={!isMobile ? { delay: 0.8 } : undefined}
                            className="flex justify-center lg:justify-start"
                        >
                            <AscentRegisterButton />
                        </motion.div>
                    </div>

                    <div className="flex flex-col items-center lg:items-end justify-center mt-10 lg:mt-0 px-6">
                        <AscentCoreVisual />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CountdownSection;
