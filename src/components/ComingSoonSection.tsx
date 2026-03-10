import React from 'react';
import { motion } from 'framer-motion';
import ScrambleText from './ScrambleText';
import { useAudio } from '../hooks/useAudio';

interface ComingSoonProps {
    onNotifyClick?: () => void;
}

const ComingSoonSection: React.FC<ComingSoonProps> = ({ onNotifyClick }) => {
    const { playHover, playClick } = useAudio();
    return (
        <section className="relative py-20 md:py-48 overflow-hidden bg-atmospheric-blood backdrop-blur-md" id="coming-soon">
            {/* Background Radar Sweep VFX */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="w-[400px] md:w-[800px] h-[400px] md:h-[800px] rounded-full border border-white/20 relative"
                >
                    <div className="absolute top-0 left-1/2 w-[1px] h-1/2 bg-gradient-to-t from-transparent to-white/40 origin-bottom shadow-[0_0_15px_white]" />
                </motion.div>
                <div className="absolute w-[600px] h-[600px] rounded-full border border-white/5" />
                <div className="absolute w-[400px] h-[400px] rounded-full border border-white/5" />
            </div>

            {/* Tactical Grid Overlay */}
            <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />

            {/* Atmospheric crimson glow orbs - Centered away from edges */}
            <div className="absolute top-1/4 left-0 w-full h-80 bg-[#4a0000]/40 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 left-0 w-full h-80 bg-[#4a0000]/40 rounded-full blur-[120px] pointer-events-none" />


            <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center">
                {/* HUD Header Decor */}
                <div className="flex items-center gap-4 mb-8 md:mb-12 opacity-40">
                    <div className="h-[1px] w-12 bg-white/20" />
                    <div className="font-mono text-[9px] tracking-[0.4em] uppercase text-white/40">Transmission_Incoming</div>
                    <div className="h-[1px] w-12 bg-white/20" />
                </div>

                <div className="text-center relative">
                    {/* Glitch Title */}
                    <div className="relative mb-6 md:mb-8">
                        <motion.h2
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="font-teko text-5xl md:text-9xl font-bold uppercase leading-none text-white tracking-widest relative"
                        >
                            COMING SOON
                        </motion.h2>
                        <div className="absolute -inset-4 bg-white/5 blur-[120px] rounded-full -z-10" />
                    </div>

                    <div className="max-w-2xl mx-auto mb-8 md:mb-12">
                        <p className="font-mono text-xs md:text-lg text-white/60 tracking-widest uppercase leading-relaxed border-y border-white/5 py-4 md:py-6 px-2">
                            Secure your place in the next evolution of student esports.
                            <span className="text-white/60 block mt-1 font-bold">REGISTRATION PORTAL OPENING SOON.</span>
                        </p>
                    </div>

                    {/* Premium CTA Button */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="relative group inline-block cursor-pointer"
                        onMouseEnter={() => playHover()}
                        onClick={() => {
                            playClick();
                            onNotifyClick?.();
                        }}
                    >
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-white/20 to-transparent rounded-sm opacity-50 group-hover:opacity-100 transition-opacity blur-[2px]" />
                        <button className="relative px-8 md:px-12 py-3 md:py-4 bg-[#08080a]/80 text-white font-teko text-xl md:text-2xl tracking-[0.15em] md:tracking-[0.2em] rounded-sm transition-all flex items-center gap-3 md:gap-4 overflow-hidden group-hover:bg-transparent group-hover:text-white border border-white/10 uppercase pointer-events-none">
                            <span className="relative z-10">ENABLE_NOTIFICATIONS</span>
                            <div className="w-2 h-2 rounded-full bg-white/40 group-hover:animate-ping" />
                        </button>
                    </motion.div>

                    {/* Technical Readouts Decoration */}
                    <div className="mt-12 md:mt-20 grid grid-cols-3 gap-4 md:gap-24 opacity-20">
                        {[
                            { label: 'UPLINK_STATUS', val: 'STABLE' },
                            { label: 'GAUNTLET_SYNC', val: '98.4%' },
                            { label: 'AUTH_LEVEL', val: 'PRIME' }
                        ].map((item, i) => (
                            <div key={i} className="text-center">
                                <div className="font-mono text-[6px] md:text-[8px] tracking-[0.2em] md:tracking-[0.3em] mb-1">{item.label}</div>
                                <div className="font-teko text-base md:text-xl font-bold">{item.val}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Section Edge */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </section>
    );
};

export default ComingSoonSection;
