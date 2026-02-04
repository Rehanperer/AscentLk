import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

const seasons = [
    { id: 1, title: 'TOXIC', status: 'ACTIVE', color: '#00ff66', active: true, coords: "34.0522° N, 118.2437° W" },
    { id: 2, title: 'AWAKEN', status: 'LOCKED', color: '#00d4ff', active: false, coords: "40.7128° N, 74.0060° W" },
    { id: 3, title: 'VISIONS', status: 'LOCKED', color: '#bf00ff', active: false, coords: "51.5074° N, 0.1278° W" },
    { id: 4, title: 'SACRIFICE', status: 'LOCKED', color: '#ff0033', active: false, coords: "35.6762° N, 139.6503° E" },
    { id: 5, title: 'SCARS', status: 'LOCKED', color: '#ffaa00', active: false, coords: "25.2048° N, 55.2708° E" },
];

const SeasonsSection: React.FC = () => {
    return (
        <section className="relative py-32 overflow-hidden bg-[#0a1016]">
            {/* MULTI-COLOR ATMOSPHERIC GAS */}
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

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 perspective-1000">
                    {seasons.map((season, index) => (
                        <SeasonCard key={season.id} season={season} index={index} />
                    ))}
                </div>
            </div>

            {/* Subtle Overlay Effects */}
            <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a1016] via-transparent to-[#0a1016] pointer-events-none" />
        </section>
    );
};

const SeasonCard: React.FC<{ season: any; index: number }> = ({ season, index }) => {
    const isActive = season.active;
    const themeColor = season.color;

    // 3D TILT EFFECT
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`relative group h-[420px] flex flex-col justify-end p-6 border border-white/5 transition-all duration-500 bg-white/[0.01] hover:bg-white/[0.02] cursor-crosshair`}
        >
            {/* Top Status Bar with Season Color - ALWAYS VISIBLE */}
            <div
                className={`absolute top-0 left-0 w-full h-[2px] transition-all duration-700 z-30`}
                style={{
                    backgroundColor: isActive ? themeColor : `${themeColor}66`,
                    boxShadow: isActive ? `0 0 15px ${themeColor}` : `0 0 5px ${themeColor}33`
                }}
            />

            {/* Active Green Energy Effect */}
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
                    {[...Array(8)].map((_, i) => (
                        <motion.div
                            key={`particle-${i}`}
                            className="absolute w-1 h-1 rounded-full opacity-40 shadow-[0_0_5px_currentColor]"
                            style={{
                                backgroundColor: themeColor,
                                color: themeColor,
                                left: `${Math.random() * 100}%`,
                                bottom: '0%'
                            }}
                            animate={{
                                y: [-20, -400],
                                x: [0, (Math.random() - 0.5) * 100],
                                opacity: [0, 1, 0],
                                scale: [0, 1.5, 0]
                            }}
                            transition={{
                                duration: 3 + Math.random() * 4,
                                repeat: Infinity,
                                delay: Math.random() * 2,
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
                        <div className="translate-z-40">
                            <PersistentGlitch text={season.title} />
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

// AUTO-ACTIVE Persistent Glitch for Encrypted Seasons
const PersistentGlitch: React.FC<{ text: string }> = ({ text }) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    const [scrambled, setScrambled] = useState(text.split('').map(() => chars[Math.floor(Math.random() * chars.length)]).join(''));

    useEffect(() => {
        const interval = setInterval(() => {
            setScrambled(text.split('').map(() => chars[Math.floor(Math.random() * chars.length)]).join(''));
        }, 120);
        return () => clearInterval(interval);
    }, [text]);

    return (
        <span className="font-mono tracking-tighter transition-opacity block overflow-hidden whitespace-nowrap opacity-20 group-hover:opacity-60">
            {scrambled}
        </span>
    );
};

export default SeasonsSection;
