import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate, useInView } from 'framer-motion';

/**
 * PartnerDecryptionWall (ASCII Hacker Effect)
 * Slowly decrypts random hacker code into partner logos via a sweeping laser as you scroll.
 */

// ── PARTNER LOGOS ──
const partners = [
    { name: "Cinnamon Life", logo: "/Untitled%20design%20(3)/1.png" },
    { name: "Red Bull", logo: "/Untitled%20design%20(3)/2.png" },
    { name: "Star Garments", logo: "/Untitled%20design%20(3)/3.png" },
    { name: "Scope Cinemas", logo: "/Untitled%20design%20(3)/4.png" },
    { name: "Leo Club EIC", logo: "/Untitled%20design%20(3)/5.png" },
    { name: "Aivance", logo: "/Untitled%20design%20(3)/6.png" },
    { name: "ASCENT", logo: "/img/SVG.svg" },
];

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";

const RandomAscii: React.FC = () => {
    const [text, setText] = useState("");
    const ref = useRef(null);
    const isInView = useInView(ref, { margin: "200px" }); // Trigger earlier so it looks seamless
    
    useEffect(() => {
        let initialText = "";
        for (let i = 0; i < 8; i++) initialText += CHARS[Math.floor(Math.random() * CHARS.length)];
        setText(initialText);

        if (!isInView) return; // Pause calculation when out of view

        const interval = setInterval(() => {
            let newText = "";
            for (let i = 0; i < 8; i++) {
                newText += CHARS[Math.floor(Math.random() * CHARS.length)];
            }
            setText(newText);
        }, 150); // Slower interval (150ms) to guarantee smooth scrolling on mobile
        return () => clearInterval(interval);
    }, [isInView]);

    return <span ref={ref} className="font-mono text-[10px] sm:text-xs md:text-sm text-[#ff4655]/40 tracking-[0.2em] font-bold">{text}</span>;
};

const LogoCell: React.FC<{ partner: typeof partners[0], isDecrypted: boolean }> = ({ partner, isDecrypted }) => {
    const isAscent = partner.name === "ASCENT";
    
    return (
        <div className="h-16 md:h-24 flex items-center justify-center w-[40%] sm:w-[30%] md:w-1/4 relative group cursor-pointer shrink-0">
            {isDecrypted ? (
                <div className="relative flex flex-col items-center justify-center w-full h-full">
                    <img 
                        src={partner.logo} 
                        alt={partner.name} 
                        className={`object-contain opacity-80 md:group-hover:scale-110 group-hover:opacity-100 transition-all duration-300 z-10 ${
                            isAscent 
                                ? "max-h-[30px] sm:max-h-[45px] md:max-h-[55px] max-w-[90px] sm:max-w-[120px] md:max-w-[140px]" 
                                : "max-h-[50px] sm:max-h-[70px] md:max-h-[85px] max-w-[140px] sm:max-w-[180px] md:max-w-[220px]"
                        }`}
                        onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                        }}
                    />
                    <span className={`hidden font-mono text-[9px] md:text-xs tracking-widest text-white/50 uppercase whitespace-nowrap z-10 md:group-hover:text-white transition-colors`}>
                        {partner.name}
                    </span>
                    
                    {/* Target lock on hover (Desktop only to save mobile perf) */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] md:w-[130%] h-[160%] opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0 hidden md:block">
                        <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-[#ff4655]" />
                        <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-[#ff4655]" />
                        <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-[#ff4655]" />
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-[#ff4655]" />
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 font-mono text-[7px] text-[#ff4655] tracking-widest whitespace-nowrap">
                            AUTH_{partner.name.replace(/\s+/g, '').toUpperCase().substring(0,6)}
                        </div>
                    </div>
                </div>
            ) : (
                <RandomAscii />
            )}
        </div>
    );
};

const PartnerGrid: React.FC<{ isDecrypted: boolean }> = ({ isDecrypted }) => {
    const topRow = partners.slice(0, 4);
    const bottomRow = partners.slice(4);

    return (
        <div className="relative w-full flex flex-col items-center gap-2 md:gap-6">
            {/* Top Row (4 logos) */}
            <div className="flex flex-wrap md:flex-nowrap justify-center gap-4 md:gap-0 w-full z-10">
                {topRow.map((partner, i) => (
                    <LogoCell key={i} partner={partner} isDecrypted={isDecrypted} />
                ))}
            </div>
            
            {/* Bottom Row (3 logos) */}
            <div className="flex flex-wrap md:flex-nowrap justify-center gap-4 md:gap-0 w-full z-10">
                {bottomRow.map((partner, i) => (
                    <LogoCell key={i} partner={partner} isDecrypted={isDecrypted} />
                ))}
            </div>
        </div>
    );
};

const PartnerMarquee: React.FC = () => {
    const containerRef = useRef<HTMLElement>(null);
    
    // Track scroll over this specific section. 
    // Laser starts sweeping when the top of the section reaches 75% of the viewport (just entered).
    // Laser finishes sweeping when the bottom reaches 40% of the viewport.
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 90%", "end 40%"]
    });

    // We use motion templates to map scroll progress to CSS clip-path and top coordinates
    const laserPercent = useTransform(scrollYProgress, [0, 1], [0, 100]);
    
    return (
        <section 
            ref={containerRef}
            className="relative w-full py-12 md:py-20 bg-[#08080a] flex flex-col items-center justify-center border-y border-white/[0.02] overflow-hidden"
        >
            {/* Massive Header Text (Moved to absolute top to prevent obscuring logos) */}
            <div className="absolute top-0 left-0 w-full flex justify-center pointer-events-none z-0">
                <span className="font-teko text-[20vw] md:text-[15vw] font-bold text-white/[0.02] uppercase tracking-widest leading-none select-none whitespace-nowrap mt-4 md:mt-2">
                    PARTNERS
                </span>
            </div>

            {/* Header Badge */}
            <div className="absolute top-6 md:top-8 left-4 md:left-12 flex items-center gap-3 z-50">
                <div className="w-1.5 h-1.5 bg-[#ff4655] animate-pulse shadow-[0_0_8px_rgba(255,70,85,0.8)]" />
                <span className="font-mono text-[8px] md:text-[10px] tracking-[0.4em] md:tracking-[0.5em] text-[#ff4655]/60 uppercase font-bold">
                    Decryption Sequence <span className="hidden sm:inline">// Initiated</span>
                </span>
            </div>

            {/* Grid Container */}
            <div className="relative w-full max-w-6xl mx-auto px-4 mt-12 md:mt-16 z-10">
                
                {/* 0. Invisible Placeholder (Dictates the physical height of the container perfectly) */}
                <div className="flex items-center justify-center w-full pointer-events-none opacity-0 py-6 md:py-8">
                    <PartnerGrid isDecrypted={false} />
                </div>
                
                {/* 1. Encrypted Background Layer (ASCII Chaos) - Clips the TOP as laser moves down */}
                <motion.div 
                    className="absolute inset-0 flex items-center justify-center w-full pointer-events-none opacity-50 py-6 md:py-8"
                    style={{ clipPath: useMotionTemplate`polygon(0 ${laserPercent}%, 100% ${laserPercent}%, 100% 100%, 0 100%)` }}
                >
                    <PartnerGrid isDecrypted={false} />
                </motion.div>

                {/* 2. Decrypted Foreground Layer (Logos) - Clips the BOTTOM as laser moves down */}
                <motion.div 
                    className="absolute inset-0 flex items-center justify-center pointer-events-auto py-6 md:py-8"
                    style={{ clipPath: useMotionTemplate`polygon(0 0, 100% 0, 100% ${laserPercent}%, 0 ${laserPercent}%)` }}
                >
                    <PartnerGrid isDecrypted={true} />
                </motion.div>

                {/* 3. The Sweeping Laser */}
                <motion.div 
                    className="absolute left-0 right-0 h-[2px] bg-[#ff4655] shadow-[0_0_20px_#ff4655,0_0_40px_#ff4655] z-30 pointer-events-none"
                    style={{ top: useMotionTemplate`${laserPercent}%` }}
                >
                    {/* Glowing ends of the laser */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-1 bg-white rounded-full shadow-[0_0_10px_white]" />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-1 bg-white rounded-full shadow-[0_0_10px_white]" />
                </motion.div>
                
            </div>

            {/* Background Details (Subtle grid lines) */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none z-0 flex justify-evenly">
                <div className="w-px h-full bg-white" />
                <div className="w-px h-full bg-white" />
                <div className="w-px h-full bg-white" />
                <div className="w-px h-full bg-white" />
            </div>
        </section>
    );
};

export default PartnerMarquee;

