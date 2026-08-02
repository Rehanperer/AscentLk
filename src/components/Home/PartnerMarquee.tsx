import React, { useState, useEffect, useRef } from 'react';

/**
 * PartnerStrip — Clean, premium single-row partner display.
 * 1. Sequential boot decrypt reveal on scroll
 * 2. After reveal: stationary logos with a slow-moving light shimmer across the strip
 */

const partners = [
    { name: "Mastercard", logo: "/partners/mastercard.png" },
    { name: "Red Bull", logo: "/partners/2.webp" },
    { name: "Star Garments", logo: "/partners/3.webp" },
    { name: "Scope Cinemas", logo: "/partners/4.webp" },
    { name: "ASCENT", logo: "/img/SVG.svg" },
];

const GLITCH_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";

const BootLogo: React.FC<{
    partner: typeof partners[0];
    shouldDecrypt: boolean;
    index: number;
    allRevealed: boolean;
}> = React.memo(({ partner, shouldDecrypt, index, allRevealed }) => {
    const [phase, setPhase] = useState<'glitch' | 'flash' | 'revealed'>('glitch');
    const [glitchText, setGlitchText] = useState('');
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        let t = '';
        for (let i = 0; i < 5; i++) t += GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        setGlitchText(t);
        if (phase !== 'glitch') return;
        intervalRef.current = setInterval(() => {
            let newT = '';
            for (let i = 0; i < 5; i++) newT += GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
            setGlitchText(newT);
        }, 80);
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [phase]);

    useEffect(() => {
        if (!shouldDecrypt || phase !== 'glitch') return;
        if (intervalRef.current) clearInterval(intervalRef.current);
        setPhase('flash');
        const t = setTimeout(() => setPhase('revealed'), 200);
        return () => clearTimeout(t);
    }, [shouldDecrypt]);

    const isAscent = partner.name === "ASCENT";
    const imgClasses = isAscent
        ? 'max-h-[16px] md:max-h-[30px] max-w-[40px] md:max-w-[75px]'
        : 'max-h-[24px] md:max-h-[46px] max-w-[52px] md:max-w-[130px]';

    return (
        <div className="flex items-center justify-center shrink-0 relative flex-1 p-0 h-[45px] md:h-full min-w-0">
            {phase === 'glitch' && (
                <span className="font-mono text-[8px] md:text-[11px] text-[#ff4655]/40 tracking-[0.3em] font-bold select-none">
                    {glitchText}
                </span>
            )}

            {phase === 'flash' && (
                <div className="flex items-center justify-center w-full h-full relative">
                    <div className="absolute inset-0 bg-white/[0.06] rounded-sm"
                        style={{ animation: 'partner-flash 0.2s ease-out forwards' }}
                    />
                    <img src={partner.logo} alt={partner.name}
                        className={`object-contain relative z-10 brightness-200 ${imgClasses}`}
                    />
                </div>
            )}

            {phase === 'revealed' && (
                <div
                    className="flex items-center justify-center w-full h-full"
                    style={{ animation: 'partner-pop 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
                >
                    <img
                        src={partner.logo}
                        alt={partner.name}
                        className={`object-contain opacity-[0.85] brightness-[1.15] ${imgClasses}`}
                        loading="lazy"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            if (e.currentTarget.nextElementSibling)
                                (e.currentTarget.nextElementSibling as HTMLElement).classList.remove('hidden');
                        }}
                    />
                    <span className="hidden font-mono text-[9px] tracking-widest text-white/50 uppercase whitespace-nowrap">
                        {partner.name}
                    </span>
                </div>
            )}

            {/* Clean separator line (Desktop only) */}
            {index < partners.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-5 bg-white/[0.06]" />
            )}
        </div>
    );
});

const PartnerMarquee: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [decryptedIndices, setDecryptedIndices] = useState<Set<number>>(new Set());
    const [allRevealed, setAllRevealed] = useState(false);

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting && !isVisible) setIsVisible(true); },
            { threshold: 0.4 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [isVisible]);

    useEffect(() => {
        if (!isVisible) return;
        const timers: ReturnType<typeof setTimeout>[] = [];
        partners.forEach((_, i) => {
            const timer = setTimeout(() => {
                setDecryptedIndices(prev => { const next = new Set(prev); next.add(i); return next; });
                if (i === partners.length - 1) setTimeout(() => setAllRevealed(true), 600);
            }, 500 + i * 350);
            timers.push(timer);
        });
        return () => timers.forEach(t => clearTimeout(t));
    }, [isVisible]);

    return (
        <section
            ref={sectionRef}
            className="relative w-full py-6 md:py-7 bg-[#08080a] border-y border-white/[0.04] overflow-hidden"
        >
            <div className="relative flex flex-col md:flex-row items-center w-full max-w-[1400px] mx-auto z-10 gap-4 md:gap-0">

                {/* Left Label */}
                <div className="shrink-0 flex items-center gap-2 md:gap-3 w-full md:w-auto justify-center md:justify-start md:pl-10 md:pr-8">
                    <div className="w-1 h-1 bg-[#ff4655] rounded-full shadow-[0_0_4px_#ff4655]" />
                    <span className="font-mono text-[9px] md:text-[10px] tracking-[0.3em] md:tracking-[0.4em] text-white/30 uppercase whitespace-nowrap font-semibold">
                        Partners
                    </span>
                    <div className="hidden md:block w-10 h-px bg-gradient-to-r from-white/10 to-transparent" />
                </div>

                {/* Logo Row/Grid */}
                <div className="relative flex-1 w-full md:h-[70px]">
                    <div className="flex flex-nowrap items-center justify-between h-full w-full px-1 md:px-0 gap-0">
                        {partners.map((p, i) => (
                            <BootLogo
                                key={i}
                                partner={p}
                                shouldDecrypt={decryptedIndices.has(i)}
                                index={i}
                                allRevealed={allRevealed}
                            />
                        ))}
                    </div>

                    {/* Slow shimmer light that glides across the logos */}
                    {allRevealed && (
                        <div className="absolute inset-0 pointer-events-none partner-shimmer overflow-hidden">
                            <div
                                className="absolute top-0 bottom-0 w-[250px] md:w-[400px]"
                                style={{
                                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 40%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.04) 60%, transparent 100%)',
                                    animation: 'partner-shimmer-move 8s ease-in-out infinite',
                                }}
                            />
                        </div>
                    )}

                    {/* Boot progress bar */}
                    {!allRevealed && isVisible && (
                        <div className="absolute bottom-0 left-0 h-[1px] bg-[#ff4655]/50 transition-all duration-300 ease-out shadow-[0_0_3px_#ff4655]"
                            style={{ width: `${(decryptedIndices.size / partners.length) * 100}%` }}
                        />
                    )}
                </div>
            </div>

            {/* Edge accents */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />
        </section>
    );
};

export default PartnerMarquee;
