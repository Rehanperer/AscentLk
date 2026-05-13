import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

/**
 * PartnerMarquee — Infinite scrolling partner/sponsor logos.
 * Pure CSS animation (no JS loops). Replace placeholder logos with real images.
 * Placed between HeroSection and CinematicDoors.
 */

// ── PARTNER LOGOS ──
// Images in /public/img/partners/
const partners: { name: string; logo: string; scale?: number }[] = [
    { name: "Cinnamon Life", logo: "/img/partners/Untitled%20design%20(1)/1.png", scale: 1.25 },
    { name: "Red Bull", logo: "/img/partners/Untitled%20design%20(1)/2.png", scale: 1.25 },
    { name: "Star Garments", logo: "/img/partners/Untitled%20design%20(1)/3.png", scale: 1.25 },
    { name: "Scope Cinemas", logo: "/img/partners/Untitled%20design%20(1)/4.png", scale: 1.25 },
    { name: "Leo Club EIC", logo: "/img/partners/Untitled%20design%20(1)/5.png", scale: 1.4 },
    { name: "Aivance", logo: "/img/partners/Untitled%20design%20(1)/6.png", scale: 1.3 },
    { name: "ASCENT", logo: "/img/SVG.svg" },
];

const LogoItem: React.FC<{ partner: typeof partners[0] }> = ({ partner }) => (
    <div className="flex-shrink-0 flex items-center justify-center px-10 md:px-14 group cursor-default">
        {partner.logo ? (
            <img 
                src={partner.logo} 
                alt={partner.name} 
                style={partner.scale ? { transform: `scale(${partner.scale})` } : undefined}
                className="h-10 md:h-12 w-auto object-contain opacity-100 transition-all duration-500"
                onError={(e) => {
                    // Fallback to text if image not found
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                }}
            />
        ) : null}
        {/* Text fallback (shown if no logo or image fails) */}
        <span className={`font-mono text-[10px] md:text-xs tracking-[0.4em] text-white/20 group-hover:text-white/50 uppercase whitespace-nowrap transition-colors duration-500 select-none ${partner.logo ? 'hidden' : ''}`}>
            {partner.name}
        </span>
    </div>
);

const MarqueeRow: React.FC<{ items: typeof partners; direction?: 'left' | 'right'; speed?: number }> = ({ 
    items, 
    direction = 'left', 
    speed = 30 
}) => {
    // Duplicate items for seamless loop
    const allItems = [...items, ...items, ...items];
    const animClass = direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right';

    return (
        <div className="relative w-full overflow-hidden">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-[#08080a] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-[#08080a] to-transparent z-10 pointer-events-none" />

            <div 
                className={`flex ${animClass}`}
                style={{ '--marquee-speed': `${speed}s` } as React.CSSProperties}
            >
                {allItems.map((partner, i) => (
                    <LogoItem key={`${partner.name}-${i}`} partner={partner} />
                ))}
            </div>
        </div>
    );
};

const PartnerMarquee: React.FC = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <section 
            ref={ref}
            className="relative w-full py-10 md:py-14 overflow-hidden bg-[#08080a]"
        >
            {/* Top border accent */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

            {/* Section label */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center justify-center gap-4 mb-6 md:mb-8 px-4"
            >
                <div className="h-[1px] w-6 bg-white/10" />
                <span className="font-mono text-[8px] md:text-[9px] tracking-[0.5em] text-white/15 uppercase">Strategic Partners</span>
                <div className="h-[1px] w-6 bg-white/10" />
            </motion.div>

            {/* Marquee row */}
            <MarqueeRow items={partners} direction="left" speed={35} />

            {/* Bottom border accent */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
        </section>
    );
};

export default PartnerMarquee;
