import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrambleText from './ScrambleText';

// Warp Speed Canvas Component - Optimized
const WarpSpeedBackground: React.FC<{ speed: number }> = ({ speed }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Optimization: Reduce resolution on mobile
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.scale(dpr, dpr);

        let stars: { x: number; y: number; z: number; o: number }[] = [];
        // Reduced star count for better performance (Mobile: 75, Desktop: 150)
        const count = window.innerWidth < 768 ? 75 : 150;
        const focalLength = rect.width / 2;
        let animationFrameId: number;

        // Initialize stars
        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * rect.width - rect.width / 2,
                y: Math.random() * rect.height - rect.height / 2,
                z: Math.random() * rect.width,
                o: '0.' + Math.floor(Math.random() * 99) + 1 as any
            });
        }

        const animate = () => {
            ctx.fillStyle = "#0a1016";
            ctx.fillRect(0, 0, rect.width, rect.height);

            stars.forEach(star => {
                star.z -= speed;

                if (star.z <= 0) {
                    star.z = rect.width;
                    star.x = Math.random() * rect.width - rect.width / 2;
                    star.y = Math.random() * rect.height - rect.height / 2;
                }

                const x = (star.x * focalLength) / star.z + rect.width / 2;
                const y = (star.y * focalLength) / star.z + rect.height / 2;
                const size = (focalLength / star.z) * 1.5;

                ctx.fillStyle = `rgba(255, 255, 255, ${star.o})`;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => cancelAnimationFrame(animationFrameId);
    }, [speed]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full opacity-30"
        />
    );
};

interface LoadingScreenProps {
    onComplete?: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
    const [stage, setStage] = useState(0);
    const [warpSpeed, setWarpSpeed] = useState(2);

    useEffect(() => {
        // Enforce fixed timing for the sequence (Total 4.7s)
        const sequence = async () => {
            // Stage 0: Logos (0ms)

            // Stage 1: PRESENTS (1200ms)
            await new Promise(r => setTimeout(r, 1200));
            setStage(1);

            // Stage 2: ASCENT Reveal (Total ~2.6s)
            await new Promise(r => setTimeout(r, 1400));
            setStage(2);
            setWarpSpeed(20); // Hyperdrive

            // Complete (Total 4700ms)
            await new Promise(r => setTimeout(r, 2100));
            if (onComplete) onComplete();
        };

        sequence();
    }, [onComplete]);

    const letterContainerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const letterVariants = {
        hidden: { opacity: 0, y: 50, filter: 'blur(10px)' },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }
        }
    };

    return (
        <motion.div
            className="fixed inset-0 z-[9999] bg-[#0a1016] flex flex-col items-center justify-center pointer-events-none overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{
                opacity: 0,
                scaleY: 0.005,
                scaleX: 0,
                filter: "brightness(500%)",
                transition: { duration: 0.5, ease: "circIn" }
            }}
        >
            <WarpSpeedBackground speed={warpSpeed} />

            {/* TACTICAL BACKGROUND GRID */}
            <div className="absolute inset-0 bg-grid opacity-20" />

            {/* SCANLINE EFFECT */}
            <div className="absolute inset-0 z-50 pointer-events-none bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.2)_50%,transparent_100%)] bg-[length:100%_4px]" />
            <motion.div
                className="absolute inset-x-0 h-[2px] bg-[#ff4655]/30 z-50 blur-[1px]"
                animate={{ top: ["0%", "100%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />

            {/* VIGNETTE & GLOW */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#000000_150%)] opacity-80" />

            <div className="relative z-10 flex flex-col items-center w-full max-w-xl px-6">

                <div className="h-64 md:h-80 flex items-center justify-center relative w-full mb-8">
                    {/* Targeting Ring */}
                    {stage >= 2 && (
                        <motion.div
                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 0.6, rotate: 360 }}
                            transition={{ duration: 10, ease: "linear" }}
                        >
                            <svg viewBox="0 0 100 100" className="w-64 h-64 md:w-96 md:h-96 opacity-10">
                                <circle cx="50" cy="50" r="48" stroke="#ff4655" strokeWidth="0.5" fill="none" strokeDasharray="10 5" />
                                <circle cx="50" cy="50" r="30" stroke="white" strokeWidth="0.5" fill="none" strokeDasharray="5 5" />
                            </svg>
                        </motion.div>
                    )}

                    <AnimatePresence mode="wait">
                        {stage === 0 && (
                            <motion.div
                                key="logos-1"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, filter: "blur(10px)" }}
                                className="flex items-center gap-8 md:gap-12"
                            >
                                <motion.img
                                    src="img/SVG.svg"
                                    className="h-20 md:h-24 w-auto brightness-200"
                                    animate={{
                                        opacity: [0.8, 1, 0.8],
                                        scale: [1, 1.02, 1]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                />
                                <div className="h-12 w-[1px] bg-white/30" />
                                <motion.img
                                    src="img/Valorant.svg"
                                    className="h-16 md:h-20 w-auto brightness-200"
                                    animate={{
                                        opacity: [0.8, 1, 0.8],
                                        scale: [1, 1.02, 1]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity, delay: 0.5, ease: "easeInOut" }}
                                />
                            </motion.div>
                        )}

                        {stage === 1 && (
                            <motion.div
                                key="interlude"
                                className="flex flex-col items-center justify-center"
                                initial={{ opacity: 0, scale: 1.5, letterSpacing: '1em' }}
                                animate={{ opacity: 1, scale: 1, letterSpacing: '0.2em' }}
                                exit={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
                                transition={{ duration: 0.8, ease: "circOut" }}
                            >
                                <h2 className="font-teko text-7xl md:text-9xl font-bold text-white leading-none">
                                    PRESENTS
                                </h2>
                            </motion.div>
                        )}

                        {stage >= 2 && (
                            <motion.div
                                key="main-title"
                                className="relative flex flex-col items-center justify-center z-10"
                                variants={letterContainerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {/* Added Logo Above Text */}
                                <motion.img
                                    src="img/ASCENT2026.svg"
                                    className="h-16 md:h-24 w-auto mb-4 drop-shadow-[0_0_15px_rgba(255,70,85,0.4)]"
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                />

                                <div className="flex overflow-hidden">
                                    {Array.from("ASCENT").map((char, i) => (
                                        <motion.span
                                            key={i}
                                            variants={letterVariants}
                                            className="font-teko text-[6rem] md:text-[10rem] font-bold text-white leading-none tracking-tighter"
                                            style={{
                                                textShadow: '0 0 30px rgba(255, 70, 85, 0.5)'
                                            }}
                                        >
                                            {char}
                                        </motion.span>
                                    ))}
                                </div>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1.5, duration: 1 }}
                                    className="text-[#ff4655] font-mono tracking-[1em] text-sm md:text-base mt-[-10px] md:mt-[-20px]"
                                >
                                    2026
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Progress Bar Area - Fixed Duration */}
                <div className="w-full max-w-md relative mt-4">
                    {/* Decorative markers */}
                    <div className="flex justify-between mb-1 opacity-50">
                        <div className="h-1 w-1 bg-[#ff4655]" />
                        <div className="h-1 w-1 bg-[#ff4655]" />
                    </div>

                    <div className="w-full bg-white/5 h-[2px] relative overflow-hidden">
                        <motion.div
                            className="absolute inset-0 bg-[#ff4655]"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 4.7, ease: "linear" }}
                        />
                    </div>

                    <div className="flex justify-between mt-3 text-[10px] font-mono uppercase tracking-[0.2em] text-white/60">
                        <div className="flex gap-2">
                            <ScrambleText text={stage < 2 ? "INITIALIZING_SYSTEMS..." : "ESTABLISHING_CONNECTION"} duration={40} />
                        </div>
                        <div className="tabular-nums font-bold text-[#ff4655]">
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                {stage < 2 ? "LOADING" : "READY"}
                            </motion.span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Random Code Snippets Overlay */}
            <div className="absolute top-10 right-10 flex flex-col items-end gap-1 opacity-20 pointer-events-none hidden md:flex">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="text-[8px] font-mono text-[#ff4655]">
                        <ScrambleText text={`0x${Math.random().toString(16).slice(2, 8).toUpperCase()}_DATA_STREAM`} duration={50} />
                    </div>
                ))}
            </div>

        </motion.div>
    );
};

export default LoadingScreen;
