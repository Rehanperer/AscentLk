import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DemoAperture = () => {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        const t1 = setTimeout(() => setPhase(1), 500); // Iris opens
        const t2 = setTimeout(() => setPhase(2), 1500); // Flash
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);

    return (
        <div className="fixed inset-0 z-[9999] bg-black overflow-hidden font-teko cursor-pointer flex flex-col items-center justify-center text-white" onClick={() => window.location.reload()}>
            <p className="absolute top-4 left-4 text-white/50 font-mono text-xs z-[100] uppercase">6: Aperture - Click to replay</p>
            
            {/* The revealed content behind the iris */}
            <motion.div 
                className="absolute inset-0 bg-[#050505] flex flex-col items-center justify-center z-10"
                initial={{ clipPath: 'circle(0% at 50% 50%)' }}
                animate={phase >= 1 ? { clipPath: 'circle(150% at 50% 50%)' } : { clipPath: 'circle(0% at 50% 50%)' }}
                transition={{ duration: 1.5, ease: [0.7, 0, 0.3, 1] }}
            >
                <div className="flex flex-col items-center">
                    <img src="/img/crest.jpg" className="w-[180px] mix-blend-screen" alt="crest" />
                    <h1 className="text-white font-black text-8xl tracking-widest mt-4 leading-none">ASCENT</h1>
                </div>
            </motion.div>
            
            {/* White flash on fully open */}
            <AnimatePresence>
                {phase === 2 && (
                    <motion.div 
                        className="absolute inset-0 bg-white z-50 pointer-events-none"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                )}
            </AnimatePresence>

            {/* Aperture ring graphics overlay */}
            <motion.div 
                className="absolute inset-0 z-20 pointer-events-none border-[1px] border-white/10 rounded-full"
                initial={{ scale: 0, opacity: 1 }}
                animate={phase >= 1 ? { scale: 3, opacity: 0 } : { scale: 0, opacity: 1 }}
                transition={{ duration: 1.5, ease: [0.7, 0, 0.3, 1] }}
            />
            <motion.div 
                className="absolute inset-0 z-20 pointer-events-none border-[1px] border-[#ff4655]/30 rounded-full"
                initial={{ scale: 0, opacity: 1 }}
                animate={phase >= 1 ? { scale: 2.5, opacity: 0 } : { scale: 0, opacity: 1 }}
                transition={{ duration: 1.5, ease: [0.7, 0, 0.3, 1], delay: 0.1 }}
            />
        </div>
    );
};
export default DemoAperture;
