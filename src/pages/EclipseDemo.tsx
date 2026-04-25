import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EclipseDemo = () => {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        // Phase 0: Eclipse holds (0-1.0s)
        // Phase 1: Eclipse shifts, flare burns out screen (1.0s - 2.5s)
        // Phase 2: Logo reveal (2.5s - 4.5s)
        const t1 = setTimeout(() => setPhase(1), 1000);
        const t2 = setTimeout(() => setPhase(2), 2200);
        const t3 = setTimeout(() => setPhase(3), 4000); // Complete
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, []);

    return (
        <motion.div 
            className="fixed inset-0 z-[9999] bg-[#000000] overflow-hidden flex flex-col items-center justify-center font-teko cursor-pointer"
            onClick={() => window.location.reload()}
            initial={{ opacity: 1 }}
        >
            <p className="absolute top-4 left-4 text-white/50 font-mono text-xs z-50">OPTION A: THE ECLIPSE - CLICK ANYWHERE TO REPLAY</p>

            {/* Deep Red Corona Backlight */}
            <motion.div
                className="absolute w-[150vw] h-[150vw] md:w-[100vw] md:h-[100vw] rounded-full bg-[radial-gradient(circle_at_center,#ff4655_0%,transparent_60%)]"
                initial={{ scale: 1, opacity: 0.3 }}
                animate={
                    phase === 0 ? { scale: 1.1, opacity: 0.6 } :
                    phase === 1 ? { scale: 5, opacity: 1 } :
                    { scale: 6, opacity: 0 }
                }
                transition={{ duration: phase === 1 ? 1.5 : 2, ease: "easeInOut" }}
            />

            {/* The Black Eclipsing Sphere */}
            <motion.div
                className="absolute w-[70vw] h-[70vw] md:w-[40vh] md:h-[40vh] rounded-full bg-[#030000] shadow-[0_0_150px_rgba(0,0,0,1)]"
                initial={{ y: 0, scale: 1 }}
                animate={
                    phase >= 1 ? { y: '120vh', scale: 0.2 } : { y: 0, scale: 1 }
                }
                transition={{ duration: 1.8, ease: "easeInOut" }}
            />

            {/* The White Overexposure Flash */}
            <motion.div
                className="absolute inset-0 bg-white"
                initial={{ opacity: 0 }}
                animate={
                    phase === 1 ? { opacity: [0, 1, 0] } :
                    { opacity: 0 }
                }
                transition={{ duration: 1.5, ease: "circIn" }}
            />

            {/* Logo Drop within the flash */}
            <AnimatePresence>
                {phase >= 2 && (
                    <motion.div
                        className="relative z-20 flex flex-col items-center"
                        initial={{ opacity: 0, scale: 1.5, filter: "blur(30px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        transition={{ duration: 1.5, ease: "circOut" }}
                    >
                        <img src="/img/crest.jpg" className="w-[120px] md:w-[160px] mix-blend-screen drop-shadow-[0_0_20px_rgba(255,70,85,0.6)]" alt="crest" />
                        <h1 className="text-white font-teko font-black text-7xl md:text-9xl tracking-widest mt-4">ASCENT</h1>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {phase === 3 && (
                <div className="absolute bottom-10 text-white font-mono text-sm uppercase animate-pulse">Loading Complete - Automatically routing to website</div>
            )}
        </motion.div>
    );
};
export default EclipseDemo;
