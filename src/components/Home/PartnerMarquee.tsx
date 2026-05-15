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
    <div className="flex-shrink-0 flex items-center justify-center px-12 md:px-16 cursor-pointer relative group/item py-6">
        
        {/* Tech Brackets - appear on hover */}
        <div className="absolute inset-0 flex items-center justify-between px-6 opacity-0 group-hover/item:opacity-100 transition-all duration-300 pointer-events-none scale-75 group-hover/item:scale-100 z-0">
            <div className="w-3 h-8 border-l-2 border-t-2 border-b-2 border-[#ff4655] shadow-[0_0_10px_rgba(255,70,85,0.4)]" />
            <div className="w-3 h-8 border-r-2 border-t-2 border-b-2 border-[#ff4655] shadow-[0_0_10px_rgba(255,70,85,0.4)]" />
        </div>

        {/* Small hex code label that appears below */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 opacity-0 group-hover/item:opacity-100 transition-all duration-300 font-mono text-[8px] text-[#ff4655] tracking-widest whitespace-nowrap z-0">
            AUTH_{partner.name.replace(/\s+/g, '').toUpperCase().substring(0,6)}
        </div>

        <div 
            style={partner.scale ? { transform: `scale(${partner.scale})` } : undefined}
            className="relative z-10 transition-transform duration-500 group-hover/item:scale-110"
        >
            {partner.logo ? (
                <img 
                    src={partner.logo} 
                    alt={partner.name} 
                    className="h-10 md:h-12 w-auto object-contain opacity-100"
                    onError={(e) => {
                        // Fallback to text if image not found
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                    }}
                />
            ) : null}
            {/* Text fallback (shown if no logo or image fails) */}
            <span className={`font-mono text-[10px] md:text-xs tracking-[0.4em] text-white/50 group-hover/item:text-white uppercase whitespace-nowrap transition-colors duration-500 select-none ${partner.logo ? 'hidden' : ''}`}>
                {partner.name}
            </span>
        </div>
    </div>
);

const MarqueeRow: React.FC<{ items: typeof partners; direction?: 'left' | 'right'; speed?: number }> = ({ 
    items, 
    direction = 'left', 
    speed = 35 
}) => {
    // Duplicate items for seamless loop
    const allItems = [...items, ...items, ...items];
    const animClass = direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right';

    return (
        <div className="relative w-full overflow-hidden group/track">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-[#08080a] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-[#08080a] to-transparent z-10 pointer-events-none" />

            {/* Subtle scanline overlay on hover */}
            <div className="absolute inset-0 pointer-events-none z-10 opacity-0 group-hover/track:opacity-30 transition-opacity duration-700 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.8)_50%)] bg-[length:100%_4px]" />

            <div 
                className={`flex ${animClass} group-hover/track:[animation-play-state:paused] mix-blend-lighten`}
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
            className="relative w-full py-12 md:py-16 overflow-hidden bg-[#08080a] flex flex-col items-center justify-center"
        >
            {/* Top border accent with laser */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/[0.05]">
                <motion.div 
                    animate={{ left: ['-20%', '120%'] }}
                    transition={{ duration: 4, ease: 'linear', repeat: Infinity }}
                    className="absolute top-0 w-[30%] h-[1px] bg-gradient-to-r from-transparent via-[#ff4655] to-transparent"
                />
            </div>

            {/* Section label */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center justify-between px-6 md:px-12 mb-8 md:mb-12 w-full max-w-[1400px]"
            >
                <div className="flex items-center gap-4">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#ff4655] animate-pulse shadow-[0_0_8px_rgba(255,70,85,0.8)]" />
                    <span className="font-mono text-[9px] md:text-[11px] tracking-[0.4em] md:tracking-[0.5em] text-white/50 uppercase font-bold">
                        Strategic Partners <span className="hidden sm:inline">// Network Active</span>
                    </span>
                </div>
                <div className="hidden md:flex items-center gap-1.5">
                    <span className="w-1 h-3 bg-white/20" />
                    <span className="w-1 h-3 bg-white/20" />
                    <span className="w-1 h-3 bg-[#ff4655] shadow-[0_0_8px_rgba(255,70,85,0.6)]" />
                </div>
            </motion.div>

            {/* Marquee row */}
            <MarqueeRow items={partners} direction="left" speed={40} />

            {/* Bottom border accent with laser */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/[0.05]">
                <motion.div 
                    animate={{ right: ['-20%', '120%'] }}
                    transition={{ duration: 5, ease: 'linear', repeat: Infinity }}
                    className="absolute top-0 w-[20%] h-[1px] bg-gradient-to-l from-transparent via-[#ff4655] to-transparent"
                />
            </div>
        </section>
    );
};

export default PartnerMarquee;
