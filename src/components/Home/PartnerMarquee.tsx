import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const partners = [
    { name: "Mastercard", logo: "/partners/mastercard.png" },
    { name: "Red Bull", logo: "/partners/2.webp" },
    { name: "Star Garments", logo: "/partners/3.webp" },
    { name: "Scope Cinemas", logo: "/partners/4.webp" },
    { name: "ICSJC", logo: "/partners/Blue ICSJC svg.svg" },
    { name: "ASCENT", logo: "/img/SVG.svg" },
];

const PartnerMarquee: React.FC = () => {
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Track scroll through the tall wrapper — this is 100% stable because
    // the wrapper height never changes (fixed at 300vh)
    const { scrollYProgress } = useScroll({
        target: wrapperRef,
        offset: ["start start", "end end"]
    });

    // Horizontal pan: logos slide from right to left as you scroll down
    const x = useTransform(scrollYProgress, [0, 1], ["5%", "-65%"]);

    // Subtle opacity fade for the glow
    const glowOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

    // Duplicate logos enough times so the strip is wide enough to pan through
    const extendedPartners = [...partners, ...partners, ...partners, ...partners];

    return (
        // Tall wrapper — creates the scroll distance. Background matches site bg so no visible "gap"
        <div ref={wrapperRef} className="relative bg-[#08080a]" style={{ height: '300vh' }}>
            
            {/* Sticky container — pins the visual content in the center of the viewport */}
            <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
                
                {/* Subtle background red glow */}
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        opacity: glowOpacity,
                        background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255,70,85,0.08) 0%, transparent 70%)',
                    }}
                />

                {/* Scan line effect — subtle horizontal line that sweeps */}
                <motion.div
                    className="absolute left-0 right-0 h-px pointer-events-none z-30"
                    style={{
                        top: useTransform(scrollYProgress, [0, 1], ['30%', '70%']),
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255,70,85,0.15) 20%, rgba(255,70,85,0.3) 50%, rgba(255,70,85,0.15) 80%, transparent 100%)',
                    }}
                />

                {/* PARTNERS label */}
                <div className="flex items-center gap-3 mb-10 md:mb-14 z-10">
                    <div className="w-8 md:w-16 h-px bg-gradient-to-r from-transparent to-[#ff4655]/40" />
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-[#ff4655] rounded-full shadow-[0_0_6px_#ff4655]" />
                        <span className="font-mono text-[10px] md:text-xs tracking-[0.4em] text-white/40 uppercase font-semibold">
                            Partners
                        </span>
                        <div className="w-1.5 h-1.5 bg-[#ff4655] rounded-full shadow-[0_0_6px_#ff4655]" />
                    </div>
                    <div className="w-8 md:w-16 h-px bg-gradient-to-l from-transparent to-[#ff4655]/40" />
                </div>

                {/* Logo strip */}
                <div className="relative w-full z-10">
                    {/* Left edge fade */}
                    <div className="absolute inset-y-0 left-0 w-20 md:w-40 bg-gradient-to-r from-[#08080a] via-[#08080a]/80 to-transparent z-20 pointer-events-none" />
                    {/* Right edge fade */}
                    <div className="absolute inset-y-0 right-0 w-20 md:w-40 bg-gradient-to-l from-[#08080a] via-[#08080a]/80 to-transparent z-20 pointer-events-none" />

                    {/* The horizontally panning track */}
                    <motion.div
                        className="flex items-center gap-12 md:gap-20 w-max will-change-transform px-8"
                        style={{ x }}
                    >
                        {extendedPartners.map((partner, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-center shrink-0"
                            >
                                <img
                                    src={partner.logo}
                                    alt={partner.name}
                                    className={`object-contain brightness-[1.1] opacity-90 ${
                                        partner.name === "ASCENT"
                                            ? 'h-8 md:h-14'
                                            : 'h-10 md:h-16 lg:h-20'
                                    }`}
                                    loading="lazy"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Bottom decorative line */}
                <div className="mt-10 md:mt-14 flex items-center gap-4 z-10">
                    <div className="w-12 md:w-24 h-px bg-white/[0.06]" />
                    <div className="w-1 h-1 rounded-full bg-white/10" />
                    <div className="w-12 md:w-24 h-px bg-white/[0.06]" />
                </div>

                {/* Top/bottom section borders */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
            </div>
        </div>
    );
};

export default PartnerMarquee;
