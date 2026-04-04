import React, { useState, useMemo, useRef, useCallback } from 'react';
import { SCHOOLS_DATA, School } from '../../data/config';
import { devicePerf } from '../../hooks/useDevicePerformance';

/**
 * SchoolCard — Performance-optimized.
 * Mobile: Pure CSS, no Framer Motion springs, no 3D tilt.
 * Desktop: Lightweight CSS-based 3D tilt instead of 4 Framer Motion springs per card.
 */
const SchoolCard: React.FC<{ school: School; isMobile: boolean }> = ({ school, isMobile }) => {
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

    const cardRef = useRef<HTMLDivElement>(null);

    // Lightweight CSS-based 3D tilt — Desktop only, no Framer Motion springs
    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (isMobile || !cardRef.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const xPct = (e.clientX - rect.left) / rect.width - 0.5;
        const yPct = (e.clientY - rect.top) / rect.height - 0.5;
        cardRef.current.style.transform = `perspective(600px) rotateX(${yPct * -10}deg) rotateY(${xPct * 10}deg)`;
    }, [isMobile]);

    const handleMouseLeave = useCallback(() => {
        if (cardRef.current) {
            cardRef.current.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg)';
        }
    }, []);

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="flex-shrink-0 mx-3 py-4"
            style={{ transition: 'transform 0.15s ease-out' }}
        >
            <div className="relative w-44 h-60 md:w-52 md:h-72 flex flex-col items-center justify-between p-6 bg-[#0d121f] border border-white/5 hover:border-[#ff4655]/30 transition-all duration-300 cursor-crosshair group overflow-hidden shadow-2xl">
                {/* HUD Corner Accents */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/10 group-hover:border-[#ff4655]/50" />
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/10 group-hover:border-[#ff4655]/50" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/10 group-hover:border-[#ff4655]/50" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/10 group-hover:border-[#ff4655]/50" />

                {/* Status Indicator Top Right */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
                    <span className={`w-1 h-1 rounded-full ${isConfirmed ? 'bg-[#ff4655]' : 'bg-white/20'} ${!isMobile ? 'animate-pulse' : ''}`} />
                    <span className={`text-[8px] font-mono tracking-tighter uppercase ${statusColor}`}>{statusText}</span>
                </div>

                {/* Logo Frame - FULLY NORMALIZED */}
                <div className="relative w-22 h-22 md:w-28 md:h-28 flex items-center justify-center mt-8">
                    <div className="w-full h-full rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-center relative overflow-hidden group-hover:bg-[#ff4655]/5 transition-colors duration-500">
                        {/* Shield Icon Background - Lower opacity when logo is present */}
                        <i className={`fa-solid fa-shield-halved text-2xl md:text-3xl transition-all duration-500 ${isConfirmed ? 'text-[#ff4655]/5' : 'text-white/5'} absolute`}></i>

                        {/* School Logo - Ensuring it fits perfectly */}
                        <img
                            src={`img/schools/${school.logo || school.name}.png`}
                            className="absolute inset-0 w-full h-full object-contain p-1.5 opacity-90 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105 z-10"
                            alt={school.name}
                            loading="lazy"
                            decoding="async"
                            onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                    </div>
                </div>

                {/* Name Section - FIXED HEIGHT FOR ALIGNMENT */}
                <div className="w-full mt-auto pb-4 translate-z-20 flex flex-col items-center">
                    <div className="h-14 md:h-16 flex items-center justify-center w-full px-1">
                        <h4 className="font-teko text-base md:text-lg font-bold text-white tracking-[0.05em] uppercase leading-[1.0] transition-colors group-hover:text-[#ff4655] text-center whitespace-normal flex items-center justify-center w-full">
                            {school.name}
                        </h4>
                    </div>

                    <div className="font-mono text-[7px] md:text-[8px] text-[#ff4655]/60 uppercase tracking-[0.2em] mt-1 font-semibold">
                        ELITE_CHALLENGER // 2026_RG
                    </div>
                </div>

                {/* Bottom Bar Highlight */}
                <div className={`absolute bottom-0 left-0 w-full h-0.5 transition-all duration-500 ${isConfirmed ? 'bg-[#ff4655]' : 'bg-white/10'} opacity-30 group-hover:opacity-100 shadow-[0_0_20px_rgba(255,70,85,0.3)]`} />
            </div>
        </div>
    );
};

const SchoolsCarousel: React.FC = () => {
    const isMobile = devicePerf.isMobile;
    // Optimized data set size for performance
    const displaySchools = useMemo(() => [...SCHOOLS_DATA, ...SCHOOLS_DATA], []);
    const confirmedCount = SCHOOLS_DATA.filter(s => s.status === 'Confirmed' || s.status === 'Qualified').length;

    return (
        <div className="w-full relative py-8 group/carousel select-none overflow-hidden">
            <div className="w-full relative">
                {/* Visual Fades for Premium Blending */}
                <div className="absolute left-0 top-0 w-32 md:w-64 h-full bg-gradient-to-r from-[#0d121f] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 w-32 md:w-64 h-full bg-gradient-to-l from-[#0d121f] to-transparent z-10 pointer-events-none" />

                <div
                    className="flex will-change-transform animate-[scrollCarousel_40s_linear_infinite]"
                    style={{ width: `${displaySchools.length * 224}px` }}
                >
                    {displaySchools.map((school, i) => (
                        <SchoolCard key={`${school.name}-${i}`} school={school} isMobile={isMobile} />
                    ))}
                </div>
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
