import React, { useState, useMemo } from 'react';
import { SCHOOLS_DATA, School } from '../../data/config';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const SchoolCard: React.FC<{ school: School }> = ({ school }) => {
    let statusText = "PENDING";
    let statusColor = "text-white/30";
    let isConfirmed = false;

    if (school.status === 'Qualified') {
        statusText = "QUALIFIED";
        statusColor = "text-[#ff4655]";
        isConfirmed = true;
    } else if (school.status === 'Confirmed') {
        statusText = "CONFIRMED";
        statusColor = "text-[#ff4655] font-bold";
        isConfirmed = true;
    }

    // High Performance Spring Config
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x, { stiffness: 100, damping: 20 });
    const mouseYSpring = useSpring(y, { stiffness: 100, damping: 20 });
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="flex-shrink-0 perspective-1000 mx-3 py-4 will-change-transform"
        >
            <div className="relative w-44 h-60 md:w-52 md:h-72 flex flex-col items-center justify-between p-6 bg-[#0f1923] border border-white/5 hover:border-[#ff4655]/30 transition-all duration-300 cursor-crosshair group overflow-hidden shadow-2xl">
                {/* HUD Corner Accents */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/10 group-hover:border-[#ff4655]/50" />
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/10 group-hover:border-[#ff4655]/50" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/10 group-hover:border-[#ff4655]/50" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/10 group-hover:border-[#ff4655]/50" />

                {/* Status Indicator Top Right */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
                    <span className={`w-1 h-1 rounded-full ${isConfirmed ? 'bg-[#ff4655]' : 'bg-white/20'} animate-pulse`} />
                    <span className={`text-[8px] font-mono tracking-tighter uppercase ${statusColor}`}>{statusText}</span>
                </div>

                {/* Logo Frame - FULLY NORMALIZED */}
                <div className="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center mt-6">
                    <div className="w-full h-full rounded-full border border-white/5 bg-white/[0.02] flex items-center justify-center relative overflow-hidden group-hover:bg-[#ff4655]/5 transition-colors duration-500">
                        <i className={`fa-solid fa-shield-halved text-3xl md:text-4xl transition-all duration-500 ${isConfirmed ? 'text-[#ff4655]/10' : 'text-white/5'} group-hover:text-white/10`}></i>

                        {/* School Logo - Ensuring it fits perfectly */}
                        <img
                            src={`img/schools/${school.name}.png`}
                            className="absolute inset-0 w-full h-full object-contain p-4 md:p-5 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                            alt={school.name}
                            onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                    </div>
                </div>

                {/* Name Section - FIXED HEIGHT FOR ALIGNMENT */}
                <div className="w-full mt-auto pb-4 translate-z-20 flex flex-col items-center">
                    <div className="h-12 md:h-16 flex items-center justify-center w-full px-2">
                        <h4 className="font-teko text-lg md:text-xl font-bold text-white tracking-[0.05em] uppercase leading-[1.1] transition-colors group-hover:text-[#ff4655] text-center whitespace-normal overflow-hidden h-full flex items-center">
                            {school.name}
                        </h4>
                    </div>

                    <div className="font-mono text-[7px] md:text-[8px] text-[#ff4655]/60 uppercase tracking-[0.2em] mt-2 font-semibold">
                        ELITE_CHALLENGER // 2026_RG
                    </div>
                </div>

                {/* Bottom Bar Highlight */}
                <div className={`absolute bottom-0 left-0 w-full h-0.5 transition-all duration-500 ${isConfirmed ? 'bg-[#ff4655]' : 'bg-white/10'} opacity-30 group-hover:opacity-100 shadow-[0_0_20px_rgba(255,70,85,0.3)]`} />
            </div>
        </motion.div>
    );
};

const SchoolsCarousel: React.FC = () => {
    // Optimized data set size for performance
    const displaySchools = useMemo(() => [...SCHOOLS_DATA, ...SCHOOLS_DATA], []);
    const confirmedCount = SCHOOLS_DATA.filter(s => s.status === 'Confirmed' || s.status === 'Qualified').length;

    return (
        <div className="w-full relative py-8 group/carousel select-none overflow-hidden">
            <div className="w-full relative">
                {/* Visual Fades for Premium Blending */}
                <div className="absolute left-0 top-0 w-32 md:w-64 h-full bg-gradient-to-r from-[#0a1016] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 w-32 md:w-64 h-full bg-gradient-to-l from-[#0a1016] to-transparent z-10 pointer-events-none" />

                <motion.div
                    className="flex will-change-transform"
                    animate={{ x: [0, -224 * SCHOOLS_DATA.length] }}
                    transition={{
                        repeat: Infinity,
                        duration: 40,
                        ease: "linear"
                    }}
                >
                    {displaySchools.map((school, i) => (
                        <SchoolCard key={`${school.name}-${i}`} school={school} />
                    ))}
                </motion.div>
            </div>

            <div className="flex flex-col items-center mt-12 gap-3 relative">
                <div className="flex items-center gap-6">
                    <div className="h-[1px] w-12 bg-white/5 md:w-24" />
                    <div className="flex items-baseline gap-3">
                        <span className="text-4xl md:text-5xl font-teko text-[#ff4655] font-bold tracking-tighter tabular-nums">{confirmedCount}</span>
                        <span className="text-sm md:text-base font-teko text-white/20 uppercase tracking-[0.6em]">SYSTEMS_VALIDATED</span>
                    </div>
                    <div className="h-[1px] w-12 bg-white/5 md:w-24" />
                </div>

                <div className="font-mono text-[10px] text-white/5 tracking-[0.4em] uppercase">
                    NODE_REGISTRY_V2.0.4L // AUTH_SIG_GNTL
                </div>
            </div>
        </div>
    );
};

export default SchoolsCarousel;
