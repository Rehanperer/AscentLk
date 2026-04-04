import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { devicePerf } from '../hooks/useDevicePerformance';

const seasons = [
    { id: 1, title: 'TOXIC', status: 'ACTIVE', color: '#00ff66', active: true, coords: "34.0522° N, 118.2437° W" },
    { id: 2, title: 'AWAKEN', status: 'LOCKED', color: '#00d4ff', active: false, coords: "40.7128° N, 74.0060° W" },
    { id: 3, title: 'VISIONS', status: 'LOCKED', color: '#bf00ff', active: false, coords: "51.5074° N, 0.1278° W" },
    { id: 4, title: 'SACRIFICE', status: 'LOCKED', color: '#ff0033', active: false, coords: "35.6762° N, 139.6503° E" },
    { id: 5, title: 'SCARS', status: 'LOCKED', color: '#ffaa00', active: false, coords: "25.2048° N, 55.2708° E" },
];

const SeasonsSection: React.FC = () => {
    const isMobile = devicePerf.isMobile;

    return (
        <section className="relative py-32 overflow-hidden bg-transparent">
            {/* MULTI-COLOR ATMOSPHERIC GAS - Desktop Only */}
            {!isMobile && (
                <div className="absolute inset-0 pointer-events-none z-0">
                    <motion.div
                        className="absolute left-[-10%] top-[-10%] w-[60%] h-[70%] opacity-20 blur-[120px]"
                        style={{ background: 'radial-gradient(circle, rgba(0,255,102,0.15) 0%, transparent 70%)' }}
                        animate={{
                            x: [0, 50, 0],
                            y: [0, 30, 0],
                            opacity: [0.1, 0.25, 0.1],
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                        className="absolute right-[-10%] bottom-[-10%] w-[60%] h-[70%] opacity-20 blur-[120px]"
                        style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.1) 0%, transparent 70%)' }}
                        animate={{
                            x: [0, -50, 0],
                            y: [0, -30, 0],
                            opacity: [0.1, 0.2, 0.1],
                        }}
                        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                    />
                </div>
            )}

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-white/5 pb-8">
                    <div>
                        <span className="text-[#00ff66] font-mono text-[10px] tracking-[0.5em] uppercase mb-4 block opacity-80">Seasonal Roadmap // 2026</span>
                        <h2 className="font-teko text-6xl md:text-8xl font-bold text-white leading-none uppercase tracking-tighter">
                            THE SEASONS
                        </h2>
                    </div>
                    <div className="text-right hidden md:block">
                        <div className="text-white/20 font-mono text-[10px] uppercase tracking-[0.3em]">Neural_Link: <span className="text-[#00ff66]">Online</span></div>
                        <div className="text-white/40 font-teko text-2xl tracking-widest mt-1">STREAM_ID: 2026_ASCENT</div>
                    </div>
                </div>

                {/* Desktop: Full Grid */}
                <div className="hidden md:grid md:grid-cols-5 gap-4 perspective-1000">
                    {seasons.map((season, index) => (
                        <SeasonCard key={season.id} season={season} index={index} isMobile={false} />
                    ))}
                </div>

                {/* Mobile: Active Season + Locked Summary */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                    {seasons.filter(s => s.active).map((season, index) => (
                        <SeasonCard key={season.id} season={season} index={index} isMobile={true} />
                    ))}
                    {/* Compact Locked Seasons Summary Card — No glitch animation on mobile */}
                    <div
                        className="relative group h-[180px] flex flex-col justify-center items-center p-6 border border-white/5 bg-white/[0.01]"
                    >
                        {/* Multi-color top bar */}
                        <div className="absolute top-0 left-0 w-full h-[2px] flex">
                            {seasons.filter(s => !s.active).map((s) => (
                                <div key={s.id} className="flex-1 h-full" style={{ backgroundColor: `${s.color}66` }} />
                            ))}
                        </div>

                        <div className="text-center">
                            <div className="font-mono text-[9px] tracking-[0.4em] text-white/30 uppercase mb-3">Upcoming Seasons</div>
                            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-4">
                                {seasons.filter(s => !s.active).map((s) => (
                                    <span key={s.id} className="font-teko text-2xl font-bold opacity-30" style={{ color: s.color }}>
                                        ENCRYPTED
                                    </span>
                                ))}
                            </div>
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                                <span className="font-mono text-[9px] tracking-[0.3em] text-white/20 uppercase">
                                    {seasons.filter(s => !s.active).length} Seasons Locked
                                </span>
                                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                            </div>
                        </div>

                        {/* Scanline — static on mobile */}
                        <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
                    </div>
                </div>
            </div>

            {/* Subtle Overlay Effects */}
            <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none z-0" />
        </section>
    );
};

const SeasonCard: React.FC<{ season: any; index: number; isMobile: boolean }> = ({ season, index, isMobile }) => {
    const isActive = season.active;
    const themeColor = season.color;

    // 3D TILT: Desktop only with lightweight CSS transform
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (isMobile || !cardRef.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const xPct = (e.clientX - rect.left) / rect.width - 0.5;
        const yPct = (e.clientY - rect.top) / rect.height - 0.5;
        cardRef.current.style.transform = `perspective(800px) rotateX(${yPct * -14}deg) rotateY(${xPct * 14}deg)`;
    }, [isMobile]);

    const handleMouseLeave = useCallback(() => {
        if (cardRef.current) {
            cardRef.current.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
        }
    }, []);

    const particles = useMemo(() => {
        if (isMobile || !isActive) return [];
        return [...Array(8)].map(() => ({
            left: `${Math.random() * 100}%`,
            xMove: (Math.random() - 0.5) * 100,
            duration: 3 + Math.random() * 4,
            delay: Math.random() * 2
        }));
    }, [isMobile, isActive]);

    // Mobile: static card with no motion wrapper
    if (isMobile) {
        return (
            <div
                className={`relative group h-[420px] flex flex-col justify-end p-6 border border-white/5 bg-white/[0.01]`}
            >
                {/* Top Status Bar */}
                <div
                    className="absolute top-0 left-0 w-full h-[2px] z-30"
                    style={{
                        backgroundColor: isActive ? themeColor : `${themeColor}66`,
                        boxShadow: isActive ? `0 0 15px ${themeColor}` : `0 0 5px ${themeColor}33`
                    }}
                />

                {/* Simple Mobile Active State */}
                {isActive && (
                    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                        <div
                            className="absolute inset-0 opacity-10"
                            style={{ background: `linear-gradient(to top, ${themeColor}, transparent)` }}
                        />
                    </div>
                )}

                {/* Persistent Ambient Glow for locked */}
                {!isActive && (
                    <div
                        className="absolute inset-0 opacity-10 pointer-events-none"
                        style={{
                            background: `radial-gradient(circle at 50% 100%, ${themeColor} 0%, transparent 80%)`
                        }}
                    />
                )}

                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-6">
                        <span
                            className="font-mono text-[10px] tracking-widest"
                            style={{ color: isActive ? themeColor : `${themeColor}99` }}
                        >
                            0{season.id}
                        </span>
                        <span
                            className="font-mono text-[9px] px-2 py-0.5 border rounded-full uppercase tracking-tighter"
                            style={{
                                borderColor: isActive ? themeColor : `${themeColor}66`,
                                color: themeColor,
                                backgroundColor: isActive ? `${themeColor}1a` : `${themeColor}0d`,
                                opacity: isActive ? 1 : 0.7
                            }}
                        >
                            {season.status}
                        </span>
                    </div>

                    <h3
                        className="font-teko text-5xl font-bold leading-none mb-6"
                        style={{
                            color: themeColor,
                            textShadow: isActive ? `0 0 20px ${themeColor}4d` : 'none',
                            opacity: isActive ? 1 : 0.4
                        }}
                    >
                        {isActive ? (
                            <div className="flex flex-col">
                                <span className="text-xs font-mono tracking-[0.4em] font-normal mb-1 opacity-60">PHASE_0{season.id}</span>
                                {season.title}
                            </div>
                        ) : (
                            <div className="flex flex-col w-full">
                                <span className="text-xs font-mono tracking-[0.4em] font-normal mb-1 opacity-40">LOCKED</span>
                                <span className="font-teko text-4xl tracking-widest block overflow-hidden text-ellipsis w-full whitespace-nowrap opacity-20">
                                    ENCRYPTED
                                </span>
                            </div>
                        )}
                    </h3>

                    {/* Status Bar */}
                    <div className="h-[1px] w-full bg-white/5 relative overflow-hidden">
                        <div
                            className="h-full"
                            style={{ backgroundColor: themeColor, width: isActive ? '100%' : '15%' }}
                        />
                    </div>
                </div>

                {/* Scanline */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
            </div>
        );
    }

    // Desktop: Full animated card
    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`relative group h-[420px] flex flex-col justify-end p-6 border border-white/5 transition-all duration-500 bg-white/[0.01] hover:bg-white/[0.02] cursor-crosshair`}
            style={{ transition: 'transform 0.15s ease-out', transformStyle: 'preserve-3d' }}
        >
            {/* Top Status Bar with Season Color */}
            <div
                className={`absolute top-0 left-0 w-full h-[2px] transition-all duration-700 z-30`}
                style={{
                    backgroundColor: isActive ? themeColor : `${themeColor}66`,
                    boxShadow: isActive ? `0 0 15px ${themeColor}` : `0 0 5px ${themeColor}33`
                }}
            />

            {/* Active Energy Effect — Desktop Only */}
            {isActive && (
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden translate-z-0">
                    <motion.div
                        className="absolute inset-0 opacity-20"
                        style={{
                            background: `radial-gradient(circle at 50% 100%, ${themeColor} 0%, transparent 70%)`
                        }}
                        animate={{
                            opacity: [0.1, 0.3, 0.1],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none">
                        <motion.path
                            d="M0,420 Q100,300 200,420 T400,420"
                            stroke={themeColor}
                            strokeWidth="2"
                            fill="none"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{
                                pathLength: [0, 1, 0],
                                opacity: [0, 1, 0],
                                d: [
                                    "M0,420 Q100,300 200,420 T400,420",
                                    "M0,420 Q150,200 300,420 T600,420",
                                    "M0,420 Q100,300 200,420 T400,420"
                                ]
                            }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </svg>
                    {particles.map((p, i) => (
                        <motion.div
                            key={`particle-${i}`}
                            className="absolute w-1 h-1 rounded-full opacity-40 shadow-[0_0_5px_currentColor]"
                            style={{
                                backgroundColor: themeColor,
                                color: themeColor,
                                left: p.left,
                                bottom: '0%'
                            }}
                            animate={{
                                y: [-20, -400],
                                x: [0, p.xMove],
                                opacity: [0, 1, 0],
                                scale: [0, 1.5, 0]
                            }}
                            transition={{
                                duration: p.duration,
                                repeat: Infinity,
                                delay: p.delay,
                                ease: "easeOut"
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Persistent Ambient Glow for all locked seasons */}
            {!isActive && (
                <div
                    className="absolute inset-0 opacity-10 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none"
                    style={{
                        background: `radial-gradient(circle at 50% 100%, ${themeColor} 0%, transparent 80%)`
                    }}
                />
            )}

            {/* TACTICAL HUD OVERLAYS */}
            <div className="absolute top-4 right-4 translate-z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="text-[8px] font-mono text-white/20 text-right leading-tight">
                    COORD_SYS: WGS84<br />
                    {season.coords}
                </div>
            </div>

            <div className="relative z-10 translate-z-30">
                <div className="flex justify-between items-center mb-6">
                    <span
                        className="font-mono text-[10px] tracking-widest"
                        style={{ color: isActive ? themeColor : `${themeColor}99` }}
                    >
                        0{season.id}
                    </span>
                    <span
                        className="font-mono text-[9px] px-2 py-0.5 border rounded-full uppercase tracking-tighter"
                        style={{
                            borderColor: isActive ? themeColor : `${themeColor}66`,
                            color: themeColor,
                            backgroundColor: isActive ? `${themeColor}1a` : `${themeColor}0d`,
                            opacity: isActive ? 1 : 0.7
                        }}
                    >
                        {season.status}
                    </span>
                </div>

                <h3
                    className={`font-teko text-5xl md:text-6xl font-bold leading-none mb-6 transition-all duration-500`}
                    style={{
                        color: themeColor,
                        textShadow: isActive ? `0 0 20px ${themeColor}4d` : 'none',
                        opacity: isActive ? 1 : 0.4
                    }}
                >
                    {isActive ? (
                        <div className="flex flex-col translate-z-40">
                            <span className="text-xs font-mono tracking-[0.4em] font-normal mb-1 opacity-60">PHASE_0{season.id}</span>
                            {season.title}
                        </div>
                    ) : (
                        <div className="translate-z-40 flex flex-col w-full">
                            <span className="text-xs font-mono tracking-[0.4em] font-normal mb-1 opacity-40">LOCKED</span>
                            <span className="font-teko text-4xl md:text-5xl tracking-widest block overflow-hidden text-ellipsis w-full whitespace-nowrap opacity-20 group-hover:opacity-60 glitch" data-text="ENCRYPTED">
                                ENCRYPTED
                            </span>
                        </div>
                    )}
                </h3>

                {/* Status Bar */}
                <div className="h-[1px] w-full bg-white/5 relative overflow-hidden">
                    <motion.div
                        className="h-full"
                        style={{ backgroundColor: themeColor }}
                        initial={{ width: 0 }}
                        whileInView={{ width: isActive ? '100%' : '15%' }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                </div>
            </div>

            {/* Scanline Effect on Card */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
        </motion.div>
    );
};

export default SeasonsSection;
