import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

const partners = [
    { name: "Mastercard", logo: "/partners/mastercard.png" },
    { name: "Red Bull", logo: "/partners/2.webp" },
    { name: "Star Garments", logo: "/partners/3.webp" },
    { name: "Scope Cinemas", logo: "/partners/4.webp" },
    { name: "ICSJC", logo: "/partners/Blue ICSJC svg.svg" },
    { name: "ASCENT", logo: "/img/SVG.svg" },
];

/* ═══════════════════════════════════════════════
   STAIRCASE STEP — slides in from alternating sides
═══════════════════════════════════════════════ */
const StaircaseStep: React.FC<{
    partner: typeof partners[0];
    index: number;
    total: number;
}> = ({ partner, index, total }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-15%" });
    const isEven = index % 2 === 0;
    const isAscent = partner.name === "ASCENT";

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: isEven ? -120 : 120, y: 30 }}
            animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
            transition={{
                duration: 0.9,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1],
            }}
            className={`relative flex items-center gap-6 md:gap-10 ${
                isEven ? 'self-start' : 'self-end'
            }`}
            style={{
                // Each step shifts further right/left to create the staircase diagonal
                marginLeft: isEven ? `${index * 3}vw` : undefined,
                marginRight: !isEven ? `${index * 3}vw` : undefined,
            }}
        >
            {/* Step number */}
            <div className="shrink-0 w-12 md:w-16 flex flex-col items-center">
                <span className="font-mono text-[9px] md:text-[10px] tracking-[0.3em] text-white/15 uppercase">
                    {String(index + 1).padStart(2, '0')}
                </span>
                <div className="w-px h-8 md:h-12 bg-gradient-to-b from-[#ff4655]/30 to-transparent mt-2" />
            </div>

            {/* The card */}
            <div className="group relative flex items-center gap-6 md:gap-10 bg-white/[0.02] border border-white/[0.06] hover:border-[#ff4655]/20 px-8 md:px-14 py-6 md:py-10 transition-all duration-500 backdrop-blur-sm">
                {/* Red accent on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#ff4655]/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Left red bar */}
                <div className="absolute left-0 top-3 bottom-3 w-[2px] bg-[#ff4655]/20 group-hover:bg-[#ff4655]/50 transition-colors duration-500" />

                {/* Logo */}
                <img
                    src={partner.logo}
                    alt={partner.name}
                    className={`object-contain brightness-[1.15] shrink-0 ${
                        isAscent ? 'h-8 md:h-12' : 'h-12 md:h-20 lg:h-24'
                    }`}
                />

                {/* Divider */}
                <div className="w-px h-12 md:h-16 bg-white/[0.06] shrink-0" />

                {/* Name & role */}
                <div className="flex flex-col gap-1">
                    <h3 className="font-teko text-2xl md:text-4xl font-bold uppercase text-white tracking-wider">
                        {partner.name}
                    </h3>
                    <span className="font-mono text-[8px] md:text-[10px] tracking-[0.4em] text-white/20 uppercase">
                        Official Partner
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

/* ═══════════════════════════════════════════════
   MAIN — Staircase layout
═══════════════════════════════════════════════ */
const PartnerStaircase: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);

    return (
        <section ref={sectionRef} className="relative bg-[#08080a] py-24 md:py-40 overflow-hidden">

            {/* Background diagonal lines suggesting depth/perspective */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
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

            {/* Red accent glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-[radial-gradient(ellipse_at_center,rgba(255,70,85,0.04)_0%,transparent_60%)] pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-center gap-3 mb-16 md:mb-24 relative z-10">
                <div className="w-8 md:w-20 h-px bg-gradient-to-r from-transparent to-[#ff4655]/30" />
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#ff4655] rounded-full shadow-[0_0_6px_#ff4655]" />
                    <span className="font-mono text-[10px] md:text-xs tracking-[0.4em] text-white/30 uppercase font-semibold">
                        Partners — Staircase
                    </span>
                    <div className="w-1.5 h-1.5 bg-[#ff4655] rounded-full shadow-[0_0_6px_#ff4655]" />
                </div>
                <div className="w-8 md:w-20 h-px bg-gradient-to-l from-transparent to-[#ff4655]/30" />
            </div>

            {/* The staircase — each card staggers diagonally */}
            <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 flex flex-col gap-6 md:gap-10">
                {/* Red connecting line down the left side */}
                <div className="absolute left-[30px] md:left-[40px] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#ff4655]/15 to-transparent" />

                {partners.map((partner, i) => (
                    <StaircaseStep
                        key={partner.name}
                        partner={partner}
                        index={i}
                        total={partners.length}
                    />
                ))}
            </div>
        </section>
    );
};

export default PartnerStaircase;
