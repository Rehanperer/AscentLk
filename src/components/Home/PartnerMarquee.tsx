import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const partners = [
    { name: "Mastercard", logo: "/partners/mastercard.png", role: "Official Partner" },
    { name: "Red Bull", logo: "/partners/2.webp", role: "Official Partner" },
    { name: "Star Garments", logo: "/partners/3.webp", role: "Official Partner" },
    { name: "Scope Cinemas", logo: "/partners/4.webp", role: "Official Partner" },
    { name: "ICSJC", logo: "/partners/Blue ICSJC svg.svg", role: "Official Partner" },
    { name: "ASCENT", logo: "/img/SVG.svg", role: "Official Partner" },
];

/* ═══════════════════════════════════════════════
   STAIRCASE STEP — slides in from alternating sides
   Mobile: all cards stack vertically, slide from left
   Desktop: alternates left/right with diagonal offset
═══════════════════════════════════════════════ */
const StaircaseStep: React.FC<{
    partner: typeof partners[0];
    index: number;
}> = ({ partner, index }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10%" });
    const isEven = index % 2 === 0;
    const isAscent = partner.name === "ASCENT";

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: isEven ? -80 : 80, y: 20 }}
            animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
            transition={{
                duration: 0.8,
                delay: 0.05,
                ease: [0.22, 1, 0.36, 1],
            }}
            className="relative w-full"
            style={{
                // Desktop: each step shifts further right to create the staircase
                // Mobile: no offset (handled by padding below)
                paddingLeft: `clamp(0px, ${index * 3}vw, ${index * 40}px)`,
            }}
        >
            <div className="flex items-center gap-3 md:gap-6">
                {/* Step number + connector */}
                <div className="shrink-0 flex flex-col items-center w-8 md:w-14">
                    <span className="font-mono text-[9px] md:text-[10px] tracking-[0.3em] text-[#ff4655]/40 font-bold">
                        {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="w-px h-6 md:h-10 bg-gradient-to-b from-[#ff4655]/30 to-transparent mt-1" />
                </div>

                {/* The card */}
                <div className="group relative flex-1 flex items-center bg-white/[0.02] border border-white/[0.06] hover:border-[#ff4655]/20 transition-all duration-500 backdrop-blur-sm overflow-hidden">
                    
                    {/* Red accent on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#ff4655]/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Left red accent bar */}
                    <div className="absolute left-0 top-2 bottom-2 w-[2px] bg-[#ff4655]/25 group-hover:bg-[#ff4655]/60 transition-colors duration-500" />

                    {/* Mobile: stacked layout / Desktop: horizontal layout */}
                    <div className="relative flex flex-col sm:flex-row items-center gap-4 sm:gap-8 md:gap-10 w-full px-5 py-5 sm:px-8 sm:py-6 md:px-12 md:py-8">
                        
                        {/* Logo */}
                        <img
                            src={partner.logo}
                            alt={partner.name}
                            className={`object-contain brightness-[1.15] shrink-0 ${
                                isAscent
                                    ? 'h-8 sm:h-10 md:h-14'
                                    : 'h-12 sm:h-14 md:h-20 lg:h-24'
                            }`}
                        />

                        {/* Divider — horizontal on mobile, vertical on desktop */}
                        <div className="w-12 h-px sm:w-px sm:h-12 md:sm:h-16 bg-white/[0.08] shrink-0" />

                        {/* Name & role */}
                        <div className="flex flex-col items-center sm:items-start gap-1">
                            <h3 className="font-teko text-2xl sm:text-3xl md:text-4xl font-bold uppercase text-white tracking-wider">
                                {partner.name}
                            </h3>
                            <span className="font-mono text-[8px] md:text-[10px] tracking-[0.4em] text-white/20 uppercase">
                                {partner.role}
                            </span>
                        </div>

                        {/* Verified badge — far right on desktop */}
                        <div className="sm:ml-auto flex items-center gap-2 shrink-0">
                            <div className="w-2.5 h-2.5 border border-[#ff4655]/30 flex items-center justify-center">
                                <div className="w-1 h-1 bg-[#ff4655]/50" />
                            </div>
                            <span className="font-mono text-[7px] md:text-[8px] tracking-[0.3em] text-white/15 uppercase hidden sm:inline">
                                Verified
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

/* ═══════════════════════════════════════════════
   MAIN SECTION
═══════════════════════════════════════════════ */
const PartnerMarquee: React.FC = () => {
    return (
        <section className="relative bg-[#08080a] py-20 md:py-32 overflow-hidden">

            {/* Background diagonal lines — depth perspective */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.025]">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute h-px bg-white/30"
                        style={{
                            top: `${12 + i * 12}%`,
                            left: 0,
                            right: 0,
                            transform: `rotate(${-2 + i * 0.5}deg)`,
                        }}
                    />
                ))}
            </div>

            {/* Subtle red glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-[radial-gradient(ellipse_at_center,rgba(255,70,85,0.04)_0%,transparent_60%)] pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-center gap-3 mb-14 md:mb-20 relative z-10">
                <div className="w-8 md:w-20 h-px bg-gradient-to-r from-transparent to-[#ff4655]/30" />
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#ff4655] rounded-full shadow-[0_0_6px_#ff4655]" />
                    <span className="font-mono text-[10px] md:text-xs tracking-[0.4em] text-white/30 uppercase font-semibold">
                        Partners
                    </span>
                    <div className="w-1.5 h-1.5 bg-[#ff4655] rounded-full shadow-[0_0_6px_#ff4655]" />
                </div>
                <div className="w-8 md:w-20 h-px bg-gradient-to-l from-transparent to-[#ff4655]/30" />
            </div>

            {/* The staircase */}
            <div className="relative z-10 max-w-5xl mx-auto px-3 md:px-8 flex flex-col gap-5 md:gap-8">
                {/* Red connecting line */}
                <div className="absolute left-[18px] md:left-[38px] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#ff4655]/15 to-transparent pointer-events-none" />

                {partners.map((partner, i) => (
                    <StaircaseStep
                        key={partner.name}
                        partner={partner}
                        index={i}
                    />
                ))}
            </div>

            {/* Section borders */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
        </section>
    );
};

export default PartnerMarquee;
