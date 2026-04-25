import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DemoSignal = () => {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        const t1 = setTimeout(() => setPhase(1), 2500); // Signal Lock!
        return () => { clearTimeout(t1); };
    }, []);

    return (
        <div className="fixed inset-0 z-[9999] bg-black overflow-hidden font-teko cursor-pointer flex flex-col items-center justify-center text-white" onClick={() => window.location.reload()}>
            <p className="absolute top-4 left-4 text-white/50 font-mono text-xs z-[100] uppercase mix-blend-difference">8: Signal - Click to replay</p>
            
            {/* The Logo (Always here, but starts faint) */}
            <div className="flex flex-col items-center relative z-10">
                <motion.img 
                    src="/img/crest.jpg" 
                    className="w-[180px] mix-blend-screen" 
                    alt="crest"
                    initial={{ opacity: 0.1, scale: 0.9 }}
                    animate={phase >= 1 ? { opacity: 1, scale: 1 } : { opacity: [0.1, 0.4, 0.2, 0.5, 0.1], scale: [0.9, 0.95, 0.9] }}
                    transition={phase >= 1 ? { duration: 0.2 } : { duration: 0.5, repeat: Infinity, repeatType: "mirror" }}
                />
                <motion.h1 
                    className="text-white font-black text-8xl tracking-widest mt-4 leading-none"
                    initial={{ opacity: 0.1 }}
                    animate={phase >= 1 ? { opacity: 1 } : { opacity: [0.1, 0.3, 0.1] }}
                    transition={phase >= 1 ? { duration: 0.2 } : { duration: 0.3, repeat: Infinity, repeatType: "mirror" }}
                >
                    ASCENT
                </motion.h1>
            </div>

            {/* Static / Interference Overlay */}
            {phase === 0 && (
                <motion.div 
                    className="absolute inset-0 z-20 pointer-events-none mix-blend-screen opacity-50"
                    style={{
                        backgroundImage: `repeating-radial-gradient(circle at 17% 32%, white, black 0.00085px)`
                    }}
                    animate={{ backgroundPosition: ["0% 0%", "100% 100%", "50% 150%", "0% 0%"] }}
                    transition={{ duration: 0.2, repeat: Infinity, ease: "linear" }}
                />
            )}
            
            {/* Signal Locked Text */}
            <AnimatePresence>
                {phase >= 1 && (
                    <motion.div 
                        className="absolute bottom-12 font-mono text-green-400 text-sm tracking-[0.5em] font-bold z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 0.5 }}
                    >
                        [ SIGNAL LOCKED ]
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
export default DemoSignal;
