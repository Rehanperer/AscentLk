import React from 'react';
import { SCHOOLS_DATA } from '../../data/config';
import ScrambleText from '../ScrambleText';

/**
 * SchoolsMarquee — Dual-row infinite scroll with center-spotlight color reveal.
 * 
 * Performance strategy:
 * - Pure CSS `@keyframes` animations only (GPU-composited translateX)
 * - Zero JS scroll listeners or intersection observers for the scroll
 * - Images always render in FULL COLOR; a `backdrop-filter: grayscale()` overlay
 *   with a mask-image center cutout creates the illusion of grayscale → color
 * - `will-change: transform` on the scrolling strips only
 * - `loading="lazy"` on all images
 */

const MarqueeRow: React.FC<{
    schools: typeof SCHOOLS_DATA;
    direction: 'right' | 'left';
    duration: number;
}> = ({ schools, direction, duration }) => {
    // Triple the data for seamless infinite loop
    const tripled = [...schools, ...schools, ...schools];

    return (
        <div className="relative w-full overflow-hidden">
            {/* Edge fades */}
            <div className="absolute left-0 top-0 w-24 md:w-48 h-full bg-gradient-to-r from-[#08080a] to-transparent z-20 pointer-events-none" />
            <div className="absolute right-0 top-0 w-24 md:w-48 h-full bg-gradient-to-l from-[#08080a] to-transparent z-20 pointer-events-none" />

            {/* 
                Center spotlight: A grayscale overlay with a transparent hole in the middle.
                Everything under the overlay appears grayscale.
                The center gap reveals the true full-color logos underneath.
            */}
            <div 
                className="absolute inset-0 z-10 pointer-events-none"
                style={{
                    backdropFilter: 'grayscale(100%) brightness(0.6)',
                    WebkitBackdropFilter: 'grayscale(100%) brightness(0.6)',
                    maskImage: 'linear-gradient(to right, black 0%, black 35%, transparent 45%, transparent 55%, black 65%, black 100%)',
                    WebkitMaskImage: 'linear-gradient(to right, black 0%, black 35%, transparent 45%, transparent 55%, black 65%, black 100%)',
                }}
            />

            {/* Scrolling strip */}
            <div
                className="flex items-center gap-4 md:gap-6 will-change-transform"
                style={{
                    animation: `${direction === 'right' ? 'marqueeRight' : 'marqueeLeft'} ${duration}s linear infinite`,
                    width: 'max-content',
                }}
            >
                {tripled.map((school, i) => {
                    const isConfirmed = school.status === 'Confirmed' || school.status === 'Qualified';
                    return (
                        <div
                            key={`${direction}-${i}`}
                            className="flex items-center gap-3 md:gap-4 px-4 md:px-6 py-3 md:py-4 bg-white/[0.02] border border-white/5 flex-shrink-0"
                        >
                            <div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
                                <img
                                    src={`img/schools/${school.logo || school.name}.png`}
                                    alt={school.name}
                                    className="w-full h-full object-contain"
                                    loading="lazy"
                                    decoding="async"
                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="font-teko text-base md:text-lg font-bold tracking-wider text-white/80 uppercase leading-none whitespace-nowrap">
                                    {school.name}
                                </span>
                                <span className={`font-mono text-[7px] md:text-[8px] tracking-[0.3em] uppercase mt-0.5 ${isConfirmed ? 'text-[#ff4655]' : 'text-white/20'}`}>
                                    {isConfirmed ? 'CONFIRMED' : 'PENDING'}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const SchoolsMarquee: React.FC = () => {
    const half = Math.ceil(SCHOOLS_DATA.length / 2);
    const topRow = SCHOOLS_DATA.slice(0, half);
    const bottomRow = SCHOOLS_DATA.slice(half);
    const confirmedCount = SCHOOLS_DATA.filter(s => s.status === 'Confirmed' || s.status === 'Qualified').length;

    return (
        <section id="schools" className="relative py-16 md:py-24 bg-[#08080a] overflow-hidden">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-6 mb-10 md:mb-14 flex flex-col md:flex-row justify-between items-center md:items-end">
                <div className="text-center md:text-left">
                    <div className="inline-flex items-center gap-3 mb-2">
                        <span className="w-1.5 h-1.5 bg-[#ff4655] rotate-45" />
                        <ScrambleText text="ELIGIBLE INSTITUTIONS" className="text-[#ff4655] font-mono tracking-[0.4em] text-[10px] uppercase font-bold" />
                    </div>
                    <h2 className="font-teko text-5xl md:text-7xl font-bold leading-[0.85] text-white">
                        PARTICIPATING SCHOOLS
                    </h2>
                </div>
                <div className="mt-4 md:mt-0 flex items-center gap-3">
                    <span className="font-teko text-4xl text-[#ff4655] font-bold">{confirmedCount}</span>
                    <span className="font-mono text-[10px] text-white/30 tracking-[0.4em] uppercase">Confirmed</span>
                </div>
            </div>

            {/* Row 1 → scrolls right */}
            <MarqueeRow schools={topRow} direction="right" duration={40} />

            <div className="h-4 md:h-6" />

            {/* Row 2 → scrolls left */}
            <MarqueeRow schools={bottomRow} direction="left" duration={35} />

            {/* Keyframes injected once */}
            <style>{`
                @keyframes marqueeRight {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.333%); }
                }
                @keyframes marqueeLeft {
                    0% { transform: translateX(-33.333%); }
                    100% { transform: translateX(0); }
                }
            `}</style>
        </section>
    );
};

export default SchoolsMarquee;
