import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import AsciiShootout from '../components/Home/AsciiShootout';

/**
 * OPTION 3: ATMOSPHERIC SMOKE DISSOLVE
 * Performance: Uses 4 large blurred divs (GPU composited) rather than 
 * heavy SVG filters or particle systems. Extremely fast on mobile.
 */
const SmokeTransition: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 60%", "end start"]
    });

    // Cloud movements: as you scroll, the clouds slowly clear outwards and fade out
    const cloud1X = useTransform(scrollYProgress, [0, 1], ["-10%", "-50%"]);
    const cloud2X = useTransform(scrollYProgress, [0, 1], ["10%", "50%"]);
    const cloud3Y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.4, 0.8], [0, 1, 0]);
    const overallOpacity = useTransform(scrollYProgress, [0.5, 1], [1, 0]);

    return (
        <div ref={containerRef} className="relative w-full h-48 -mt-24 pointer-events-none z-30 select-none overflow-hidden">
            <motion.div className="absolute inset-0" style={{ opacity: overallOpacity }}>
                
                {/* Dark dense smoke base */}
                <motion.div 
                    className="absolute bottom-0 w-[150%] h-[200%] rounded-[50%] bg-[#08080a] blur-[40px] opacity-80"
                    style={{ left: "-25%", y: cloud3Y, willChange: 'transform' }}
                />

                {/* Left red smoke plume */}
                <motion.div 
                    className="absolute -bottom-10 w-[80%] h-[150%] rounded-[50%] blur-[60px]"
                    style={{ 
                        left: "-10%", 
                        x: cloud1X, 
                        opacity, 
                        background: 'radial-gradient(circle, rgba(180,20,30,0.8) 0%, rgba(13,18,31,0.5) 60%, transparent 80%)',
                        willChange: 'transform, opacity'
                    }}
                />

                {/* Right red smoke plume */}
                <motion.div 
                    className="absolute -bottom-10 w-[80%] h-[150%] rounded-[50%] blur-[60px]"
                    style={{ 
                        right: "-10%", 
                        x: cloud2X, 
                        opacity, 
                        background: 'radial-gradient(circle, rgba(255,70,85,0.6) 0%, rgba(13,18,31,0.5) 60%, transparent 80%)',
                        willChange: 'transform, opacity'
                    }}
                />

                {/* Center bright core that dissipates quickly */}
                <motion.div 
                    className="absolute left-1/2 bottom-0 w-[40%] h-[100%] -translate-x-1/2 rounded-[50%] bg-[#ff4655] blur-[80px]"
                    style={{ 
                        opacity: useTransform(scrollYProgress, [0, 0.3, 0.6], [0, 0.4, 0]),
                        willChange: 'opacity' 
                    }}
                />

            </motion.div>
        </div>
    );
};

/**
 * OPTION 4: SCI-FI BLAST DOORS
 * Performance: Uses standard clip-paths and hardware-accelerated transforms (x).
 * Excellent on mobile.
 */
const BlastDoorTransition: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 70%", "end 20%"]
    });

    // Doors slide open horizontally
    const leftDoorX = useTransform(scrollYProgress, [0, 0.5, 1], ["0%", "0%", "-100%"]);
    const rightDoorX = useTransform(scrollYProgress, [0, 0.5, 1], ["0%", "0%", "100%"]);
    
    // Seam glow pulses then fades as doors open
    const seamOpacity = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.6], [0, 1, 1, 0]);

    return (
        <div ref={containerRef} className="relative w-full h-[100vh] -mt-[50vh] pointer-events-none z-30 select-none overflow-hidden flex items-center justify-center">
            
            {/* LEFT DOOR */}
            <motion.div 
                className="absolute left-0 h-full w-[50.5%] bg-[#08080a] border-r-4 border-[#0d121f] flex flex-col items-end justify-center"
                style={{ 
                    x: leftDoorX,
                    clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)',
                    willChange: 'transform'
                }}
            >
                {/* Mechanical details */}
                <div className="w-full h-[2px] bg-white/5 mb-20" />
                <div className="w-3/4 h-[2px] bg-white/5 mb-4" />
                <div className="text-[#ff4655] font-mono text-[10px] uppercase tracking-widest opacity-50 mr-8 mb-2">Sector_01_Locked</div>
                {/* The glowing red seal edge */}
                <div className="absolute right-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-transparent via-[#ff4655] to-transparent opacity-80 shadow-[0_0_20px_#ff4655]" />
            </motion.div>

            {/* RIGHT DOOR */}
            <motion.div 
                className="absolute right-0 w-[50.5%] h-full bg-[#08080a] border-l-4 border-[#0d121f] flex flex-col items-start justify-center"
                style={{ 
                    x: rightDoorX,
                    clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0 100%)',
                    willChange: 'transform'
                }}
            >
                {/* Mechanical details */}
                <div className="w-full h-[2px] bg-white/5 mb-20" />
                <div className="w-3/4 h-[2px] bg-white/5 mb-4 ml-16" />
                <div className="text-[#ff4655] font-mono text-[10px] uppercase tracking-widest opacity-50 ml-16 mb-2 mt-4">// Authorization Required</div>
                {/* The glowing red seal edge */}
                <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-transparent via-[#ff4655] to-transparent opacity-80 shadow-[0_0_20px_#ff4655]" />
            </motion.div>

            {/* INTENSE CENTER GLOW (Fades as doors open) */}
            <motion.div 
                className="absolute left-1/2 -translate-x-1/2 w-[10px] h-[40vh] bg-[#ff4655] rounded-full blur-[10px]"
                style={{ opacity: seamOpacity, willChange: 'opacity' }}
            />
            <motion.div 
                className="absolute left-1/2 -translate-x-1/2 w-[40VW] h-[60vh] bg-gradient-to-r from-transparent via-[rgba(255,70,85,0.2)] to-transparent blur-[30px]"
                style={{ opacity: seamOpacity, willChange: 'opacity' }}
            />
        </div>
    );
};


// ─── DUMMY SECTIONS FOR SCROLLING ──────────────────────────────────────────

const DummyHero = ({ title }: { title: string }) => (
    <section className="relative w-full h-[80vh] flex flex-col items-center justify-center bg-[#08080a]">
        <div className="font-mono text-[10px] text-[#ff4655] tracking-[0.4em] mb-4">SCROLL DOWN TO REVEAL</div>
        <h1 className="font-teko text-7xl md:text-9xl font-bold text-white tracking-wider">
            {title}
        </h1>
        <div className="mt-8 px-8 py-4 bg-white/5 border border-white/10 text-white font-mono uppercase text-xs">
            Test Hero Area
        </div>
    </section>
);

const DummyContent = () => (
    <section className="w-full min-h-screen py-32 px-8 flex flex-col items-center bg-[#0d121f]">
        <div className="w-full max-w-4xl pt-20 border-t border-[#ff4655]/20 flex flex-col items-center">
            <h2 className="font-teko text-5xl md:text-7xl text-white uppercase mb-8">System Initialized</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                <div className="h-64 bg-white/5 rounded border border-white/10" />
                <div className="h-64 bg-white/5 rounded border border-white/10" />
            </div>
            <p className="font-mono text-white/40 text-center mt-12 max-w-2xl text-sm leading-relaxed">
                This is the content that lies beneath the transition. The doors sliding open or the smoke parting reveals this area organically as part of the scrolling flow.
            </p>
        </div>
    </section>
);

const TransitionsDemoPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#08080a] text-white overflow-x-hidden">
            {/* Header info */}
            <div className="fixed top-0 left-0 w-full p-4 bg-black/80 backdrop-blur border-b border-white/10 z-50 flex items-center justify-between">
                <div className="font-mono text-xs text-white/60">Transitions Demo Lab</div>
                <button 
                    onClick={() => window.location.href = '/'}
                    className="font-mono text-[10px] text-[#ff4655] hover:text-white transition-colors border border-[#ff4655]/30 px-3 py-1 rounded"
                >
                    RETURN HOME
                </button>
            </div>

            {/* OPTION 3 DEMO */}
            <div className="pt-20">
                <div className="text-center mb-8">
                    <span className="font-mono text-sm bg-white/10 px-4 py-2 rounded text-[#ff4655]">OPTION 3: Smoke Dissolve</span>
                </div>
                <DummyHero title="THE PROTOCOL" />
                <SmokeTransition />
                <DummyContent />
            </div>

            {/* Divider between demos */}
            <div className="w-full h-32 bg-gradient-to-b from-[#0d121f] to-[#08080a] flex items-center justify-center border-y border-white/5">
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff4655]/40 to-transparent" />
            </div>

            {/* OPTION 4 DEMO */}
            <div className="pt-20">
                <div className="text-center mb-8">
                    <span className="font-mono text-sm bg-white/10 px-4 py-2 rounded text-[#ff4655]">OPTION 4: Blast Doors</span>
                </div>
                <DummyHero title="SECTOR 01" />
                <BlastDoorTransition />
                <DummyContent />
            </div>

            {/* Divider between demos */}
            <div className="w-full h-32 bg-gradient-to-b from-[#0d121f] to-[#08080a] flex items-center justify-center border-y border-white/5">
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff4655]/40 to-transparent" />
            </div>

            {/* OPTION 5 DEMO: ASCII SHOOTOUT */}
            <div className="pt-20">
                <div className="text-center mb-8">
                    <span className="font-mono text-sm bg-white/10 px-4 py-2 rounded text-[#ff4655]">OPTION 5: ASCII Shootout</span>
                </div>
                <DummyHero title="CROSSFIRE" />
                <AsciiShootout />
                <DummyContent />
            </div>

        </div>
    );
};

export default TransitionsDemoPage;
