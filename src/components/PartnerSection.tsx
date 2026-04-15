import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView, useMotionTemplate, useSpring } from 'framer-motion';
import { Shield, Users, Globe, Trophy, Radio, Signal } from 'lucide-react';
import ScrambleText from './ScrambleText';
import { useAudio } from '../hooks/useAudio';

interface StrategicTierProps {
    index: number;
    title: string;
    sub: string;
    desc: string;
    icon: React.ReactNode;
}

const StrategicTier: React.FC<StrategicTierProps> = ({ index, title, sub, desc, icon }) => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [150, -150]);
    const opacity = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [0, 1, 1, 0]);
    const scale = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [0.85, 1, 1, 0.85]);
    const blurPx = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [20, 0, 0, 20]);
    
    // Smooth the motion values for extra premium feel
    const smoothOpacity = useSpring(opacity, { damping: 20, stiffness: 100 });
    const smoothScale = useSpring(scale, { damping: 20, stiffness: 100 });
    const smoothBlur = useSpring(blurPx, { damping: 20, stiffness: 100 });
    const filter = useMotionTemplate`blur(${smoothBlur}px)`;

    return (
        <div ref={containerRef} className="relative min-h-[80vh] flex items-center justify-center py-20">
            <motion.div 
                style={{ y, opacity: smoothOpacity, scale: smoothScale, filter }}
                className="relative z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center px-6"
            >
                {/* Visual HUD Element */}
                <div className="md:col-span-4 flex justify-center md:justify-end">
                    <div className="relative w-32 h-32 md:w-48 md:h-48 flex items-center justify-center">
                        <div className="absolute inset-0 border border-[#ff4655]/20 rounded-full animate-[spin_10s_linear_infinite]" />
                        <div className="absolute inset-2 border border-white/5 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                        <div className="absolute inset-6 border-2 border-t-[#ff4655] border-transparent rounded-full animate-spin" />
                        <div className="text-[#ff4655] drop-shadow-[0_0_15px_rgba(255,70,85,0.5)]">
                            {React.cloneElement(icon as React.ReactElement<any>, { size: 64, strokeWidth: 1 })}
                        </div>
                    </div>
                </div>

                {/* Text Content */}
                <div className="md:col-span-8 space-y-4 text-center md:text-left">
                    <div className="font-mono text-[10px] tracking-[0.6em] text-[#ff4655] uppercase opacity-70">
                        Module_{String(index + 1).padStart(2, '0')} // {sub}
                    </div>
                    <h3 className="font-teko text-6xl md:text-8xl font-bold text-white leading-none tracking-tight uppercase">
                        {title}
                    </h3>
                    <p className="text-white/40 font-mono text-xs md:text-sm tracking-widest leading-relaxed uppercase max-w-xl">
                        {desc}
                    </p>
                    
                    {/* Tactical Hud Line */}
                    <div className="flex items-center gap-4 pt-4 justify-center md:justify-start">
                        <div className="h-[1px] w-12 bg-[#ff4655]/40" />
                        <div className="w-1 h-1 bg-[#ff4655] rounded-full animate-pulse" />
                        <div className="font-mono text-[8px] text-white/20 tracking-[0.2em]">DECRYPTED_ACCESS_GRANTED</div>
                    </div>
                </div>
            </motion.div>

            {/* Background Perspective Index */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02] select-none">
                <span className="font-teko text-[40vh] md:text-[60vh] font-black text-white">{String(index + 1).padStart(2, '0')}</span>
            </div>
        </div>
    );
};

const RadarGrid: React.FC = () => {
    return (
        <div className="absolute inset-0 pointer-events-none">
            {/* Pulsing Radar Rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] border border-white/[0.03] rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] border border-white/[0.03] rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] border border-white/[0.03] rounded-full" />
            
            {/* Diagonal Crosshair Lines */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[1px] bg-white/[0.02] rotate-45" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[1px] bg-white/[0.02] -rotate-45" />
            
            {/* Moving Radar Line */}
            <div className="absolute top-1/2 left-1/2 w-[100vw] h-[100vw] bg-gradient-to-tr from-[#ff4655]/10 to-transparent -translate-x-1/2 -translate-y-1/2 origin-center animate-[spin_8s_linear_infinite]" style={{ clipPath: 'polygon(50% 50%, 100% 0%, 100% 50%)' }} />
        </div>
    );
};

interface PartnerSectionProps {
    onSponsorClick?: () => void;
    onContactClick?: () => void;
}

const PartnerSection: React.FC<PartnerSectionProps> = ({ onSponsorClick, onContactClick }) => {
    const { playHover, playClick } = useAudio();
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const tiers = [
        {
            title: "CORPORATE",
            sub: "ELITE TIER",
            desc: "PREMIUM PLACEMENT ACROSS ALL DIGITAL AND PHYSICAL ASSETS WITH EXCLUSIVE BROADCAST INTEGRATION.",
            icon: <Shield />
        },
        {
            title: "YOUTH",
            sub: "REACH MODULE",
            desc: "DIRECT ACCESS TO 50,000+ STUDENTS ACROSS SRI LANKA'S LEADING EDUCATIONAL INSTITUTIONS.",
            icon: <Users />
        },
        {
            title: "GLOBAL",
            sub: "SCALE ENGINE",
            desc: "LEVERAGE HIGH-ENGAGEMENT DIGITAL BROADCASTS REACHING VIEWERS ACROSS REGIONAL BOUNDARIES.",
            icon: <Globe />
        },
        {
            title: "HERITAGE",
            sub: "LEGACY CORE",
            desc: "BECOME A CORNERSTONE OF SRI LANKAN ESPORTS HISTORY BY SUPPORTING THE PREMIER STUDENT PLATFORM.",
            icon: <Trophy />
        }
    ];

    return (
        <section ref={sectionRef} id="partners" className="relative bg-[#08080a] overflow-hidden">
            <RadarGrid />

            {/* Static Header HUD */}
            <div className="relative z-20 pt-32 pb-16 text-center">
                <div className="inline-flex items-center gap-4 mb-4">
                    <div className="w-2 h-2 bg-[#ff4655] animate-pulse" />
                    <span className="font-mono text-[10px] tracking-[0.5em] uppercase text-white/40">Strategic_Alliances_Pending</span>
                </div>
                <h2 className="font-teko text-8xl md:text-[12rem] font-black text-white leading-none opacity-10 select-none">ALLIANCE</h2>
            </div>

            {/* Scrolling Tiers */}
            <div className="relative">
                {tiers.map((tier, i) => (
                    <StrategicTier 
                        key={i}
                        index={i}
                        {...tier}
                    />
                ))}
            </div>

            {/* Final CTA HUD */}
            <div className="relative z-20 py-32 border-t border-white/5 flex flex-col items-center">
                <div className="max-w-xl text-center px-6 mb-16">
                    <div className="font-mono text-[10px] text-[#ff4655] tracking-[0.8em] mb-4 uppercase">Initialize_Uplink</div>
                    <h2 className="font-teko text-5xl md:text-7xl font-bold text-white uppercase mb-6 leading-tight">Secure Your Tactical Presence</h2>
                    <p className="font-mono text-[10px] md:text-xs text-white/30 tracking-widest uppercase leading-relaxed">
                        The Gauntlet awaits those who lead. Connect with the operations team to secure the future of Sri Lankan esports.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 relative px-6">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onMouseEnter={() => playHover()}
                        className="group relative px-8 md:px-12 py-4 md:py-5 bg-[#ff4655] text-white font-teko text-xl md:text-2xl font-bold tracking-[0.2em] uppercase overflow-hidden"
                        onClick={() => { playClick(); onSponsorClick?.(); }}
                    >
                        <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                        <span className="relative z-10 flex items-center gap-3">
                            <Radio size={20} /> Corporate_Uplink
                        </span>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onMouseEnter={() => playHover()}
                        className="group relative px-8 md:px-12 py-4 md:py-5 bg-transparent border border-white/10 text-white font-teko text-xl md:text-2xl font-bold tracking-[0.2em] uppercase overflow-hidden hover:border-white/40 transition-colors"
                        onClick={() => { playClick(); onContactClick?.(); }}
                    >
                        <span className="relative z-10 flex items-center gap-3">
                            <Signal size={20} /> General_Inquiry
                        </span>
                    </motion.button>
                </div>

                {/* Scroll to Reveal Signal */}
                <div className="mt-32 mb-10 flex flex-col items-center gap-4 opacity-60">
                    <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-white/50">Scroll for footer</span>
                    <div className="h-24 w-[1px] bg-gradient-to-b from-[#ff4655] to-transparent animate-bounce shadow-[0_0_10px_rgba(255,70,85,0.3)]" />
                </div>
            </div>

            {/* Side HUD coordinates */}
            <div className="absolute left-6 top-1/2 -translate-y-1/2 space-y-8 hidden lg:block opacity-20">
                {['001', '010', '011', '100'].map(bin => (
                    <div key={bin} className="font-mono text-[10px] tracking-widest vertical-text text-white">LN_COORD_SEC_{bin}</div>
                ))}
            </div>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 space-y-8 hidden lg:block opacity-20">
                {['AUTH', 'SYNC', 'LINK', 'OPER'].map(stat => (
                    <div key={stat} className="font-mono text-[10px] tracking-widest vertical-text text-white text-right">STAT_{stat}_99%</div>
                ))}
            </div>
        </section>
    );
};

export default PartnerSection;

