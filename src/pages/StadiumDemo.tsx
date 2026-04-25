import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Spotlight = ({ color, duration, delay, initialRotate, targetRotate, origin }: any) => (
    <motion.div
        className="absolute w-[200%] h-[200%] z-30 pointer-events-none"
        initial={{ opacity: 0, rotate: initialRotate }}
        animate={{ 
            opacity: [0, 1, 0.8, 1], 
            rotate: targetRotate 
        }}
        exit={{ opacity: 0 }}
        transition={{ 
            opacity: { duration: 0.5, delay },
            rotate: { duration, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }
        }}
        style={{
            top: origin.y,
            left: origin.x,
            background: `radial-gradient(circle at 50% 0%, ${color} 0%, transparent 50%)`,
            maskImage: 'conic-gradient(from 150deg at 50% 0%, transparent 0deg, black 30deg, black 60deg, transparent 90deg)',
            WebkitMaskImage: 'conic-gradient(from 150deg at 50% 0%, transparent 0deg, black 30deg, black 60deg, transparent 90deg)',
            transformOrigin: '50% 0%',
        }}
    />
);

const StadiumDemo = () => {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        const t1 = setTimeout(() => setPhase(1), 500);
        const t2 = setTimeout(() => setPhase(2), 2500); // Glitch starts
        const t3 = setTimeout(() => setPhase(3), 3200); // Final drop

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, []);

    const dustParticles = useMemo(() => {
        return Array.from({ length: 60 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 3 + 1,
            duration: Math.random() * 8 + 8,
        }));
    }, []);

    return (
        <motion.div 
            className="fixed inset-0 z-[9999] bg-[#000000] overflow-hidden font-teko cursor-pointer"
            onClick={() => window.location.reload()}
            initial={{ opacity: 1 }}
        >
            {/* BACKGROUND 3D GRID (Tilted) */}
            <div 
                className="absolute inset-0 z-0 pointer-events-none opacity-20"
                style={{ 
                    perspective: '1000px',
                    transform: 'rotateX(60deg) translateY(-20%)',
                }}
            >
                <div 
                    className="w-full h-[200%] bg-[linear-gradient(rgba(255,70,85,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,70,85,0.2)_1px,transparent_1px)] bg-[size:60px_60px]"
                    style={{
                        maskImage: 'linear-gradient(to top, black 20%, transparent 80%)',
                        WebkitMaskImage: 'linear-gradient(to top, black 20%, transparent 80%)',
                    }}
                />
            </div>

            {/* SCANLINE OVERLAY */}
            <div className="absolute inset-0 z-50 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_bottom,transparent_50%,#fff_50%)] bg-[length:100%_4px] mix-blend-overlay" />

            {/* THE CENTERPIECE - NOW PERFECTLY CENTERED WITH MORE "MORE" */}
            <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
                <motion.div
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={
                        phase === 1 ? { opacity: 0.1, scale: 0.95 } :
                        phase >= 2 ? { opacity: 1, scale: 1 } : { opacity: 0 }
                    }
                >
                    <div className="relative flex flex-col items-center">
                        {/* THE LOGO */}
                        <motion.img 
                            src="/img/crest.jpg" 
                            className="w-[140px] md:w-[240px] mix-blend-screen" 
                            animate={phase < 3 ? { filter: 'brightness(0.1) blur(5px)' } : { filter: 'brightness(1.5) blur(0px) drop-shadow(0 0 30px rgba(255,70,85,0.6))' }}
                            alt="crest"
                        />
                        
                        {/* KINETIC TYPOGRAPHY */}
                        <div className="relative mt-[-20px] md:mt-[-40px] overflow-hidden">
                            <motion.h1 
                                className="text-white font-teko font-black text-[20vw] md:text-[14rem] tracking-tight leading-none uppercase mix-blend-difference"
                                animate={phase === 2 ? {
                                    x: [0, -5, 5, -2, 0],
                                    filter: ["blur(0px)", "blur(10px)", "blur(0px)"],
                                } : {}}
                                transition={{ duration: 0.3, repeat: phase === 2 ? Infinity : 0 }}
                            >
                                ASCENT
                            </motion.h1>
                        </div>
                    </div>

                    {/* DYNAMIC HUD UNDER THE LOGO */}
                    <motion.div
                        className="mt-4 flex flex-col items-center"
                        initial={{ opacity: 0 }}
                        animate={phase >= 3 ? { opacity: 1 } : { opacity: 0 }}
                    >
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-12 h-[1px] bg-[#ff4655]" />
                            <span className="text-[#ff4655] font-mono text-[9px] md:text-xs tracking-[1em] uppercase font-bold">2026</span>
                            <div className="w-12 h-[1px] bg-[#ff4655]" />
                        </div>
                        <p className="text-white/40 font-mono text-[8px] md:text-[10px] tracking-[0.5em] uppercase text-center max-w-xs">
                            Cinnamon Life Ballroom // November 2026
                        </p>
                    </motion.div>
                </motion.div>
            </div>

            {/* LIGHTING - INTENSIFIED */}
            <AnimatePresence>
                {phase >= 1 && phase < 3 && (
                    <>
                        <Spotlight 
                            color="rgba(255, 70, 85, 0.7)" 
                            duration={3.5} 
                            delay={0} 
                            initialRotate={-30} 
                            targetRotate={30} 
                            origin={{ x: '10%', y: '-10%' }}
                        />
                        <Spotlight 
                            color="rgba(100, 200, 255, 0.3)" 
                            duration={5} 
                            delay={0.5} 
                            initialRotate={30} 
                            targetRotate={-30} 
                            origin={{ x: '50%', y: '-10%' }}
                        />
                         <Spotlight 
                            color="rgba(255, 255, 255, 0.2)" 
                            duration={4} 
                            delay={1} 
                            initialRotate={-10} 
                            targetRotate={10} 
                            origin={{ x: '30%', y: '-5%' }}
                        />
                    </>
                )}
            </AnimatePresence>

            {/* DUST */}
            <div className="absolute inset-0 z-20 pointer-events-none">
                {dustParticles.map((p) => (
                    <motion.div
                        key={p.id}
                        className="absolute bg-white rounded-full opacity-[0.05]"
                        style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%` }}
                        animate={{ y: [0, -50, 0], x: [0, 20, 0] }}
                        transition={{ duration: p.duration, repeat: Infinity, ease: "linear" }}
                    />
                ))}
            </div>

            {/* FINAL IMPACT FLASH */}
            <motion.div 
                className="absolute inset-0 z-50 bg-white pointer-events-none"
                initial={{ opacity: 0 }}
                animate={phase === 3 ? { opacity: [0, 1, 0] } : { opacity: 0 }}
                transition={{ duration: 0.6 }}
            />

            {/* CORNER HUD */}
            <div className="absolute top-8 left-8 p-4 border-l-[1px] border-t-[1px] border-white/20 opacity-40 font-mono text-[8px] uppercase tracking-widest text-white">
                Input: Stadium_Feed_01<br/>Status: Synchronized
            </div>
        </motion.div>
    );
};

export default StadiumDemo;
