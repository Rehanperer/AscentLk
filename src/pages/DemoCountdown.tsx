import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DemoCountdown = () => {
    const [phase, setPhase] = useState(0); // 0=3, 1=2, 2=1, 3=Detonation, 4=Settle

    useEffect(() => {
        const t1 = setTimeout(() => setPhase(1), 1000);
        const t2 = setTimeout(() => setPhase(2), 2000);
        const t3 = setTimeout(() => setPhase(3), 3000);
        const t4 = setTimeout(() => setPhase(4), 3500);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
    }, []);

    const number = phase === 0 ? "3" : phase === 1 ? "2" : phase === 2 ? "1" : null;

    return (
        <div className="fixed inset-0 z-[9999] bg-black overflow-hidden font-teko cursor-pointer flex items-center justify-center" onClick={() => window.location.reload()}>
            <p className="absolute top-4 left-4 text-white/30 font-mono text-xs z-[100] uppercase">1: Countdown - Click to replay</p>
            
            <AnimatePresence mode="wait">
                {number && (
                    <motion.div
                        key={number}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.5 }}
                        transition={{ duration: 0.3 }}
                        className="text-white font-black text-[30vh] leading-none"
                    >
                        {number}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Detonation Shockwave */}
            {phase >= 3 && (
                <motion.div 
                    className="absolute inset-0 border-[100px] border-[#ff4655] rounded-full pointer-events-none"
                    initial={{ opacity: 1, scale: 0 }}
                    animate={{ opacity: 0, scale: 3, borderWidth: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                />
            )}

            {/* White Flash */}
            {phase === 3 && (
                 <motion.div 
                    className="absolute inset-0 bg-white z-50 pointer-events-none"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                />
            )}

            {/* The Logo Settle */}
            <AnimatePresence>
                {phase >= 3 && (
                    <motion.div 
                        className="flex flex-col items-center relative z-10"
                        initial={{ opacity: 0, scale: 1.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "backOut", delay: 0.1 }}
                    >
                        <img src="/img/crest.jpg" className="w-[150px] mix-blend-screen" alt="crest" />
                        <h1 className="text-white font-black text-8xl tracking-widest mt-4">ASCENT</h1>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
export default DemoCountdown;
