import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

const partners = [
    { name: "Mastercard", logo: "/partners/mastercard.png", tagline: "Title Partner" },
    { name: "Red Bull", logo: "/partners/2.webp", tagline: "Energy Partner" },
    { name: "Star Garments", logo: "/partners/3.webp", tagline: "Apparel Partner" },
    { name: "Scope Cinemas", logo: "/partners/4.webp", tagline: "Venue Partner" },
    { name: "ICSJC", logo: "/partners/Blue ICSJC svg.svg", tagline: "Institutional Partner" },
    { name: "ASCENT", logo: "/img/SVG.svg", tagline: "Tournament Organizer" },
];

/* ═══════════════════════════════════════════════
   MAIN — Spotlight stage reveal
═══════════════════════════════════════════════ */
const PartnerSpotlight: React.FC = () => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const { scrollYProgress } = useScroll({
        target: wrapperRef,
        offset: ["start start", "end end"]
    });

    // Track which partner is active based on scroll position
    useEffect(() => {
        return scrollYProgress.on("change", (v) => {
            const idx = Math.min(
                partners.length - 1,
                Math.floor(v * partners.length)
            );
            setActiveIndex(idx);
        });
    }, [scrollYProgress]);

    // Spotlight beam angle follows active partner
    const spotlightX = useTransform(
        scrollYProgress,
        partners.map((_, i) => i / partners.length),
        partners.map((_, i) => `${20 + (i / (partners.length - 1)) * 60}%`)
    );

    // Ambient glow color intensity
    const glowIntensity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

    const active = partners[activeIndex];
    const isAscent = active.name === "ASCENT";

    return (
        <div
            ref={wrapperRef}
            className="relative bg-[#050507]"
            style={{ height: `${partners.length * 80 + 40}vh` }}
        >
            <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">

                {/* Pitch black background */}
                <div className="absolute inset-0 bg-[#050507]" />

                {/* Spotlight cone from above */}
                <motion.div
                    className="absolute top-0 pointer-events-none z-0"
                    style={{
                        left: spotlightX,
                        transform: 'translateX(-50%)',
                        width: '40vw',
                        height: '120%',
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 40%, transparent 80%)',
                        clipPath: 'polygon(40% 0%, 60% 0%, 85% 100%, 15% 100%)',
                    }}
                />

                {/* Floor reflection */}
                <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-[#050507] via-[#050507]/90 to-transparent pointer-events-none z-10" />
                <motion.div
                    className="absolute bottom-0 inset-x-0 h-px pointer-events-none z-20"
                    style={{
                        opacity: glowIntensity,
                        background: 'linear-gradient(90deg, transparent 10%, rgba(255,70,85,0.2) 30%, rgba(255,70,85,0.4) 50%, rgba(255,70,85,0.2) 70%, transparent 90%)',
                        boxShadow: '0 0 30px rgba(255,70,85,0.15), 0 -5px 40px rgba(255,70,85,0.05)',
                    }}
                />

                {/* Header */}
                <div className="absolute top-6 md:top-10 left-0 right-0 flex items-center justify-center gap-3 z-30">
                    <div className="w-8 md:w-20 h-px bg-gradient-to-r from-transparent to-white/10" />
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-[#ff4655] rounded-full shadow-[0_0_6px_#ff4655]" />
                        <span className="font-mono text-[10px] md:text-xs tracking-[0.4em] text-white/30 uppercase font-semibold">
                            Partners — Spotlight
                        </span>
                        <div className="w-1.5 h-1.5 bg-[#ff4655] rounded-full shadow-[0_0_6px_#ff4655]" />
                    </div>
                    <div className="w-8 md:w-20 h-px bg-gradient-to-l from-transparent to-white/10" />
                </div>

                {/* Previously revealed partners — small row at top */}
                <div className="absolute top-20 md:top-28 left-0 right-0 flex items-center justify-center gap-6 md:gap-10 z-20 px-4">
                    {partners.map((p, i) => (
                        <motion.div
                            key={p.name}
                            animate={{
                                opacity: i < activeIndex ? 0.3 : i === activeIndex ? 0 : 0.08,
                                scale: i < activeIndex ? 1 : 0.8,
                            }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            className="shrink-0"
                        >
                            <img
                                src={p.logo}
                                alt={p.name}
                                className={`object-contain brightness-[1.1] ${
                                    p.name === "ASCENT" ? 'h-4 md:h-6' : 'h-5 md:h-8'
                                }`}
                            />
                        </motion.div>
                    ))}
                </div>

                {/* THE ACTIVE PARTNER — massive center stage */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={active.name}
                        initial={{ opacity: 0, scale: 0.8, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.1, y: -30 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="relative z-20 flex flex-col items-center gap-6 md:gap-10"
                    >
                        {/* Glow behind logo */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-[radial-gradient(circle,rgba(255,255,255,0.04)_0%,transparent_60%)] pointer-events-none" />

                        <img
                            src={active.logo}
                            alt={active.name}
                            className={`object-contain brightness-[1.2] drop-shadow-[0_0_40px_rgba(255,255,255,0.08)] relative ${
                                isAscent ? 'h-16 md:h-28 lg:h-32' : 'h-24 md:h-40 lg:h-52'
                            }`}
                        />

                        <div className="flex flex-col items-center gap-2">
                            <h3 className="font-teko text-4xl md:text-7xl font-bold uppercase text-white tracking-wider drop-shadow-lg">
                                {active.name}
                            </h3>
                            <span className="font-mono text-[9px] md:text-[11px] tracking-[0.5em] text-[#ff4655]/50 uppercase">
                                {active.tagline}
                            </span>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Counter */}
                <div className="absolute bottom-8 md:bottom-12 right-6 md:right-12 z-30">
                    <span className="font-mono text-xl md:text-3xl font-bold text-white/10">
                        {String(activeIndex + 1).padStart(2, '0')}
                        <span className="text-white/5">/{String(partners.length).padStart(2, '0')}</span>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PartnerSpotlight;
