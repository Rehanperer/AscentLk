import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
    onComplete?: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        const t1 = setTimeout(() => setPhase(1), 1500);
        const t2 = setTimeout(() => setPhase(2), 1900);
        const t3 = setTimeout(() => {
            if (onComplete) onComplete();
        }, 3200);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, [onComplete]);

    return (
        <motion.div 
            className="fixed inset-0 z-[9999] bg-[#06080e] overflow-hidden flex flex-col items-center justify-center font-teko"
            initial={{ opacity: 1 }}
            exit={{
                opacity: 0,
                filter: "brightness(250%) blur(12px)",
                scale: 1.05,
                transition: { duration: 0.9, ease: "circOut" }
            }}
        >
            {/* Background Architectural Blueprint Grid */}
            <motion.div 
                className="absolute inset-0 z-0 bg-[linear-gradient(rgba(100,200,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(100,200,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: phase >= 2 ? 0 : 1 }}
                transition={{ duration: 0.5 }}
            />
            
            {/* Center Grid Shadow Vignette */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,#06080e_70%)] pointer-events-none" />

            {/* Tactical Grid Origin Crosshairs */}
            <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center opacity-20">
                <div className="w-[1px] h-full bg-[#64c8ff]" />
                <div className="absolute h-[1px] w-full bg-[#64c8ff]" />
            </div>

            {/* Center content container — logo + hexagon + text all centered via flexbox */}
            <div className="relative z-10 flex flex-col items-center justify-center">
                
                {/* Hexagon + Logo overlay container */}
                <div className="relative w-[120px] h-[120px] md:w-[160px] md:h-[160px]">
                    
                    {/* SVG Hexagon Trace */}
                    <motion.svg 
                        viewBox="0 0 100 100" 
                        className="absolute inset-0 w-full h-full overflow-visible"
                        animate={{ 
                            filter: phase >= 1 
                                ? 'drop-shadow(0 0 15px rgba(255,70,85,0.8)) drop-shadow(0 0 30px rgba(100,200,255,0.4))' 
                                : 'drop-shadow(0 0 0px rgba(0,0,0,0))' 
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Hexagon Shield Base Line */}
                        <motion.path
                            d="M 50 5 L 90 25 L 90 75 L 50 95 L 10 75 L 10 25 Z"
                            fill={phase >= 1 ? "rgba(255,70,85,0.05)" : "none"}
                            stroke="rgba(255,70,85,0.2)"
                            strokeWidth="1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        />
                        
                        {/* Hexagon Shield Laser Tracer */}
                        <motion.path
                            d="M 50 5 L 90 25 L 90 75 L 50 95 L 10 75 L 10 25 Z"
                            fill="none"
                            stroke="#ff4655"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            initial={{ pathLength: 0, pathOffset: 0 }}
                            animate={
                                phase >= 1 
                                    ? { pathLength: 1, pathOffset: 0, opacity: 1 } 
                                    : { pathLength: 0.25, pathOffset: 1, opacity: 1 }
                            }
                            transition={
                                phase >= 1 
                                    ? { duration: 0.2 } 
                                    : { duration: 1.5, ease: "anticipate" }
                            }
                        />

                        {/* Core Power Node flash */}
                        <motion.circle
                            cx="50" cy="50" r="3"
                            fill="#ffffff"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={phase >= 1 ? { scale: [0, 3, 0], opacity: [0, 1, 0] } : { scale: 0, opacity: 0 }}
                            transition={{ duration: 0.6 }}
                        />
                    </motion.svg>

                    {/* The ACTUAL LOGO — positioned as a normal HTML element, perfectly centered */}
                    <motion.img 
                        src="img/ASCENT2026.svg" 
                        alt="Ascent Crest"
                        className="absolute inset-0 m-auto w-[55%] h-[55%] object-contain"
                        style={{ filter: 'drop-shadow(0 0 20px rgba(255,70,85,0.8))' }}
                        initial={{ scale: 0.2, opacity: 0 }}
                        animate={
                            phase >= 1 
                                ? { scale: [0.2, 1.4, 1], opacity: [0, 1, 0.8, 1] } 
                                : { scale: 0.2, opacity: 0 }
                        }
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    />
                </div>

                {/* Text Reveal Block — ALWAYS in DOM, avoids mount-jank */}
                <motion.div 
                    className="mt-8 flex flex-col items-center whitespace-nowrap will-change-transform"
                    initial={false}
                    animate={phase >= 2 
                        ? { opacity: 1, y: 0 } 
                        : { opacity: 0, y: 20 }
                    }
                    transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                >
                    <span 
                        className="font-mono text-[#ff4655] tracking-[0.8em] text-[10px] md:text-sm font-bold mb-3 uppercase"
                        style={{ textShadow: "0 0 15px rgba(255,70,85,0.8)" }}
                    >
                        System Protocol 2026
                    </span>
                    <h1 
                        className="text-white font-teko font-black text-7xl md:text-[10rem] leading-none tracking-wider"
                        style={{ textShadow: "0 0 40px rgba(255,255,255,0.4)" }}
                    >
                        ASCENT
                    </h1>
                </motion.div>
            </div>

            {/* Aggressive System Glitch Flash */}
            <motion.div 
                className="absolute inset-0 z-40 bg-white pointer-events-none mix-blend-overlay"
                initial={{ opacity: 0 }}
                animate={phase === 1 ? { opacity: [0, 0.8, 0, 0.4, 0] } : { opacity: 0 }}
                transition={{ duration: 0.4 }}
            />

            {/* CRT TV Flicker Overlay */}
            <div className="absolute inset-0 z-50 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_bottom,transparent_50%,#fff_50%)] bg-[length:100%_4px] mix-blend-overlay" />
        </motion.div>
    );
};

export default LoadingScreen;
