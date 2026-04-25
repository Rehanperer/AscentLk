import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const FocusDemo = () => {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        // Phase 0: Trigger pullback immediately
        const t1 = setTimeout(() => setPhase(1), 100);
        const t2 = setTimeout(() => setPhase(2), 3500); // Complete
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);

    return (
        <motion.div 
            className="fixed inset-0 z-[9999] bg-[#020305] overflow-hidden flex flex-col items-center justify-center font-teko cursor-pointer"
            onClick={() => window.location.reload()}
            initial={{ opacity: 1 }}
        >
            <p className="absolute top-4 left-4 text-white/50 font-mono text-xs z-50">OPTION C: THE FOCUS DROP - CLICK ANYWHERE TO REPLAY</p>

            <motion.div
                className="flex flex-col items-center justify-center w-full h-full"
                initial={{ scale: 4, filter: "blur(25px)", opacity: 0 }}
                animate={
                    phase >= 1 
                    ? { scale: 1, filter: "blur(0px)", opacity: 1 } 
                    : { scale: 4, filter: "blur(25px)", opacity: 0 }
                }
                transition={{ duration: 2.8, ease: [0.16, 1, 0.3, 1] }} // Heavy custom Apple-style spring easing
            >
                <img src="/img/crest.jpg" className="w-[120px] md:w-[150px] mix-blend-screen drop-shadow-[0_0_20px_rgba(255,70,85,0.4)]" alt="crest" />
                <h1 className="text-white font-teko font-bold text-8xl md:text-[10rem] tracking-wide mt-4 uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] leading-none">
                    ASCENT
                </h1>
                <p className="text-[#ff4655] font-mono tracking-[0.5em] mt-2 uppercase text-[10px] md:text-sm drop-shadow-[0_0_10px_rgba(255,70,85,0.8)]">
                    Initiating Protocol 2026
                </p>
            </motion.div>

            {phase === 2 && (
                <div className="absolute bottom-10 text-white font-mono text-sm uppercase animate-pulse">Loading Complete - Automatically routing to website</div>
            )}
        </motion.div>
    );
};
export default FocusDemo;
