import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const DemoRedacted = () => {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        const t1 = setTimeout(() => setPhase(1), 500); // First line reveals
        const t2 = setTimeout(() => setPhase(2), 1200); // Second line reveals
        const t3 = setTimeout(() => setPhase(3), 2000); // Final huge block reveals logo
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, []);

    return (
        <div className="fixed inset-0 z-[9999] bg-[#050505] overflow-hidden font-mono cursor-pointer flex flex-col items-center justify-center text-white" onClick={() => window.location.reload()}>
            <p className="absolute top-4 left-4 text-white/30 text-xs z-[100] uppercase">3: Redacted - Click to replay</p>
            
            <div className="flex flex-col items-center justify-center gap-6 w-full max-w-2xl px-4 relative">
                
                {/* Line 1 */}
                <div className="relative text-sm tracking-widest uppercase font-bold text-center">
                    <span className="opacity-50">LOCATION: LUMINA BALLROOM</span>
                    <motion.div 
                        className="absolute inset-[-4px] bg-white z-10"
                        initial={{ scaleX: 1, transformOrigin: 'right' }}
                        animate={phase >= 1 ? { scaleX: 0 } : { scaleX: 1 }}
                        transition={{ duration: 0.4, ease: "circIn" }}
                    />
                </div>

                {/* Line 2 */}
                <div className="relative text-sm tracking-widest uppercase font-bold text-center">
                    <span className="opacity-50">DATE: NOVEMBER 2026</span>
                    <motion.div 
                        className="absolute inset-[-4px] bg-white z-10"
                        initial={{ scaleX: 1, transformOrigin: 'right' }}
                        animate={phase >= 2 ? { scaleX: 0 } : { scaleX: 1 }}
                        transition={{ duration: 0.4, ease: "circIn" }}
                    />
                </div>

                {/* The Logo Block */}
                <div className="relative mt-8 flex flex-col items-center">
                    <div className="opacity-100 flex flex-col items-center font-teko">
                        <img src="/img/crest.jpg" className="w-[180px] mix-blend-screen" alt="crest" />
                        <h1 className="text-white font-black text-8xl tracking-widest mt-2 leading-none">ASCENT</h1>
                    </div>
                    <motion.div 
                        className="absolute inset-[-10px] bg-white z-10"
                        initial={{ scaleY: 1, transformOrigin: 'bottom' }}
                        animate={phase >= 3 ? { scaleY: 0 } : { scaleY: 1 }}
                        transition={{ duration: 0.6, ease: "circIn" }}
                    />
                </div>
            </div>
        </div>
    );
};
export default DemoRedacted;
