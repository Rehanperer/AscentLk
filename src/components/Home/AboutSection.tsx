import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

const UnblurWord: React.FC<{ children: string; progress: any; range: [number, number] }> = ({ children, progress, range }) => {
    // Map the overall scroll progress to this specific word's range
    const opacity = useTransform(progress, range, [0.1, 1]);
    const blur = useTransform(progress, range, [10, 0]);

    return (
        <span className="relative inline-block mr-[0.25em] mt-[0.1em]">
            <motion.span
                style={{ 
                    opacity, 
                    filter: useTransform(blur, (v) => `blur(${v}px)`),
                }}
            >
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
            className="font-teko text-3xl md:text-5xl lg:text-6xl leading-[1.1] tracking-wide text-white uppercase flex flex-wrap"
        >
            {words.map((word, i) => {
                const start = i / words.length;
                const end = start + (1 / words.length);
                return (
                    <UnblurWord key={i} progress={scrollYProgress} range={[start, end]}>
                        {word}
                    </UnblurWord>
                );
            })}
        </p>
    );
};

const StatCounter: React.FC<{ value: string; label: string; delay?: number }> = ({ value, label, delay = 0 }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <div ref={ref} className="flex items-center gap-4 py-4 border-b border-white/5 last:border-0 relative overflow-hidden group">
            {/* Hover highlight sweep */}
            <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out pointer-events-none" />
            
            <motion.div 
                className="w-1.5 h-1.5 bg-[#ff4655]" 
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : { scale: 0 }}
                transition={{ duration: 0.5, delay }}
            />
            <div className="flex flex-col">
                <motion.span 
                    className="font-mono text-[#ff4655] font-bold text-lg md:text-xl tracking-widest leading-none drop-shadow-[0_0_10px_rgba(255,70,85,0.4)]"
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ duration: 0.6, delay: delay + 0.1 }}
                >
                    {value}
                </motion.span>
                <motion.span 
                    className="font-mono text-[9px] md:text-[10px] text-white/50 uppercase tracking-[0.3em] mt-1"
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
    return (
        <section id="about" className="relative py-32 md:py-48 px-6 bg-[#0d121f] overflow-hidden">
            {/* Atmospheric Background Layer */}
            <div className="absolute inset-0 opacity-30 bg-scanlines pointer-events-none" />
            
            {/* Subdued structural lines in background */}
            <div className="absolute left-[10%] top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-white/[0.03] to-transparent pointer-events-none hidden md:block" />
            <div className="absolute right-[10%] top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-white/[0.03] to-transparent pointer-events-none hidden md:block" />

            <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8">
                
                {/* Left Side Text - Higher vertically */}
                <div className="col-span-1 md:col-span-5 md:mt-12">
                    <div className="mb-6 inline-flex items-center gap-3">
                        <div className="h-[1px] w-8 bg-[#ff4655]" />
                        <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-[#ff4655] font-bold">
                            // Genesis Phase
                        </span>
                    </div>
                    
                    <ScrollText text="Ascent lk is set to be the first student-led hybrid production of its scale in Sri Lanka." />
                </div>

                {/* Center Stats Bar (Vertical) */}
                <div className="col-span-1 md:col-span-2 flex justify-start md:justify-center hidden md:flex">
                    <div className="flex flex-col justify-center h-full pt-20">
                        <StatCounter value="50,000+" label="Student Reach" delay={0} />
                        <StatCounter value="18" label="Elite Systems" delay={0.2} />
                        <StatCounter value="300K" label="Prize Protocol" delay={0.4} />
                    </div>
                </div>

                {/* Right Side Text - Lower vertically offset */}
                <div className="col-span-1 md:col-span-5 md:mt-48">
                    {/* Mobile only stats fallback */}
                    <div className="flex justify-between md:hidden mb-12 border-y border-white/5 py-4">
                        <div className="text-center">
                            <div className="font-mono text-[#ff4655] font-bold text-sm">50K+</div>
                            <div className="font-mono text-[8px] text-white/40 uppercase tracking-[0.2em]">Reach</div>
                        </div>
                        <div className="w-[1px] bg-white/10" />
                        <div className="text-center">
                            <div className="font-mono text-[#ff4655] font-bold text-sm">18</div>
                            <div className="font-mono text-[8px] text-white/40 uppercase tracking-[0.2em]">Schools</div>
                        </div>
                        <div className="w-[1px] bg-white/10" />
                        <div className="text-center">
                            <div className="font-mono text-[#ff4655] font-bold text-sm">300K</div>
                            <div className="font-mono text-[8px] text-white/40 uppercase tracking-[0.2em]">Pool</div>
                        </div>
                    </div>

                    <ScrollText text="Taking place this November at the Lumina Ballroom, Cinnamon Life, ASCENT 2026 is a fusion of a Tier-1 Valorant Championship and a high-production musical concert." />
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="mt-12 group inline-block cursor-pointer relative"
                    >
                        <div className="flex items-center gap-4 text-white/60 group-hover:text-white transition-colors">
                            <span className="font-mono text-xs tracking-[0.3em] uppercase">Initialize Protocol</span>
                            <div className="w-12 h-[1px] bg-white/20 group-hover:bg-[#ff4655] group-hover:w-16 transition-all duration-300 relative">
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-[#ff4655] opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
            
            {/* Watermark */}
            <div className="absolute bottom-[-10%] right-[-5%] font-teko text-[25vw] leading-none text-white/[0.01] pointer-events-none select-none tracking-tighter mix-blend-overlay font-bold">
                EVOLVE
            </div>
        </section>
    );
};

export default AboutSection;
