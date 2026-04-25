import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

/**
 * ScrollText — MOBILE OPTIMIZED
 * Instead of per-word blur (40+ simultaneous filter animations = GPU death),
 * we use OPACITY ONLY which is fully GPU-composited and costs almost nothing.
 */
const ScrollWord: React.FC<{ children: string; progress: any; range: [number, number] }> = ({ children, progress, range }) => {
    const opacity = useTransform(progress, range, [0.08, 1]);
    const y = useTransform(progress, range, [8, 0]);

    return (
        <span className="relative inline-block mx-[0.12em] mt-[0.1em]">
            <motion.span style={{ opacity, y, display: 'inline-block' }}>
                {children}
            </motion.span>
        </span>
    );
};

const ScrollText: React.FC<{ text: string }> = ({ text }) => {
    const containerRef = useRef<HTMLParagraphElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 85%", "end 50%"]
    });

    const words = text.split(" ");

    return (
        <p 
            ref={containerRef} 
            className="font-teko text-3xl sm:text-4xl md:text-5xl lg:text-7xl leading-[1.1] tracking-wide text-white uppercase flex flex-wrap justify-center text-center drop-shadow-xl"
        >
            {words.map((word, i) => {
                const start = i / words.length;
                const end = start + (1 / words.length);
                return (
                    <ScrollWord key={i} progress={scrollYProgress} range={[start, end]}>
                        {word}
                    </ScrollWord>
                );
            })}
        </p>
    );
};

const StatCounter: React.FC<{ value: string; label: string; delay?: number }> = ({ value, label, delay = 0 }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <div ref={ref} className="flex flex-col items-center text-center gap-2 relative overflow-hidden group px-2 sm:px-6">
            <motion.div 
                className="w-1.5 h-1.5 bg-[#ff4655] shadow-[0_0_10px_rgba(255,70,85,0.8)]" 
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : { scale: 0 }}
                transition={{ duration: 0.5, delay }}
            />
            <div className="flex flex-col items-center">
                <motion.span 
                    className="font-mono text-[#ff4655] font-bold text-xl sm:text-2xl md:text-3xl tracking-widest leading-none drop-shadow-[0_0_15px_rgba(255,70,85,0.6)]"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.6, delay: delay + 0.1 }}
                >
                    {value}
                </motion.span>
                <motion.span 
                    className="font-mono text-[7px] sm:text-[8px] md:text-[10px] text-white/50 uppercase tracking-[0.2em] sm:tracking-[0.3em] mt-2 sm:whitespace-nowrap"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.6, delay: delay + 0.3 }}
                >
                    {label}
                </motion.span>
            </div>
        </div>
    );
};

const AboutSection: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);

    return (
        <section 
            ref={sectionRef} 
            id="about" 
            className="relative py-32 md:py-56 px-4 sm:px-6 bg-[#080b13] overflow-hidden flex flex-col justify-center items-center"
        >
            {/* ── VOLUMETRIC SIDE HAZE ── Pure CSS, zero perf cost */}
            {/* Left Haze — Deep Red */}
            <div 
                className="absolute left-0 top-0 w-[60%] md:w-[45%] h-full pointer-events-none z-0"
                style={{
                    background: 'radial-gradient(ellipse 80% 60% at 0% 50%, rgba(255, 70, 85, 0.12) 0%, transparent 70%)',
                }}
            />
            {/* Left Haze — Inner brighter core */}
            <div 
                className="absolute left-0 top-[20%] w-[35%] md:w-[25%] h-[60%] pointer-events-none z-0"
                style={{
                    background: 'radial-gradient(ellipse 100% 80% at 0% 50%, rgba(255, 70, 85, 0.08) 0%, transparent 60%)',
                }}
            />

            {/* Right Haze — Cool Cyan */}
            <div 
                className="absolute right-0 top-0 w-[60%] md:w-[45%] h-full pointer-events-none z-0"
                style={{
                    background: 'radial-gradient(ellipse 80% 60% at 100% 50%, rgba(100, 200, 255, 0.08) 0%, transparent 70%)',
                }}
            />
            {/* Right Haze — Inner brighter core */}
            <div 
                className="absolute right-0 top-[20%] w-[35%] md:w-[25%] h-[60%] pointer-events-none z-0"
                style={{
                    background: 'radial-gradient(ellipse 100% 80% at 100% 50%, rgba(100, 200, 255, 0.06) 0%, transparent 60%)',
                }}
            />

            {/* Bottom Floor Fog — ties the two side hazes together */}
            <div 
                className="absolute bottom-0 left-0 w-full h-[40%] md:h-[35%] pointer-events-none z-0"
                style={{
                    background: 'linear-gradient(to top, rgba(255, 70, 85, 0.06) 0%, transparent 100%)',
                }}
            />

            {/* Static container */}
            <div className="max-w-6xl mx-auto w-full relative z-10 flex flex-col items-center text-center justify-center min-h-[50vh] sm:min-h-[70vh]">
                
                {/* ── Deep Background ── */}
                <div className="absolute inset-0 pointer-events-none opacity-40 flex flex-col items-center justify-center">
                    {/* Glowing Core Orb */}
                    <div className="absolute w-[80vw] h-[80vw] md:w-[600px] md:h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(255,70,85,0.15)_0%,transparent_60%)]" />
                    
                    {/* Grid */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_30%,transparent_100%)]" />

                    {/* Ghost Watermark */}
                    <div className="absolute font-teko text-[35vw] leading-none text-white/[0.02] tracking-tighter mix-blend-overlay font-bold select-none">
                        //EVOLVE
                    </div>
                </div>

                {/* ── Core Text ── */}
                <div className="relative z-20 flex flex-col items-center w-full">
                    <div className="mb-8 md:mb-12 inline-flex items-center gap-3">
                        <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-l from-[#ff4655] to-transparent" />
                        <span className="font-mono text-[9px] sm:text-xs tracking-[0.4em] sm:tracking-[0.5em] uppercase text-[#ff4655] font-bold drop-shadow-[0_0_10px_rgba(255,70,85,0.6)]">
                            Initiating Phase Alpha
                        </span>
                        <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-r from-[#ff4655] to-transparent" />
                    </div>
                    
                    <div className="max-w-4xl mx-auto w-full px-2">
                        <ScrollText text="Ascent lk is set to be the first student-led hybrid production of its scale in Sri Lanka. Taking place this November at the Lumina Ballroom, Cinnamon Life, ASCENT 2026 is a fusion of a Tier-1 Valorant Championship and a high-production musical concert." />
                    </div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="mt-12 md:mt-20 group inline-flex flex-col items-center cursor-pointer relative"
                    >
                        <div className="flex items-center gap-4 text-white/50 group-hover:text-[#ff4655] transition-colors duration-500">
                            <span className="font-mono text-[10px] tracking-[0.3em] uppercase">Deploy Protocol</span>
                            <div className="w-12 h-[1px] bg-white/20 group-hover:bg-[#ff4655] group-hover:w-20 transition-all duration-500 relative">
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#ff4655] opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_10px_#ff4655]" />
                            </div>
                        </div>
                    </motion.div>
                </div>
                
            </div>

            {/* ── Foreground Stats (FLAT, OUTSIDE ANY 3D) ── */}
            <div 
                className="relative z-30 flex flex-row items-center justify-center gap-6 sm:gap-12 md:gap-24 mt-16 sm:mt-24 pt-8 sm:pt-12 w-full max-w-4xl border-t border-white/[0.05]"
            >
                 <StatCounter value="50,000+" label="Student Reach" delay={0} />
                 <div className="h-10 w-[1px] bg-white/[0.05]" />
                 <StatCounter value="16" label="Elite Systems" delay={0.2} />
                 <div className="h-10 w-[1px] bg-white/[0.05]" />
                 <StatCounter value="300K" label="Prize Protocol" delay={0.4} />
            </div>
        </section>
    );
};

export default AboutSection;
