import React from 'react';
import { motion } from 'framer-motion';
import ScrambleText from './ScrambleText';
import { useAudio } from '../hooks/useAudio';
import { devicePerf } from '../hooks/useDevicePerformance';

interface ComingSoonProps {
    onNotifyClick?: () => void;
}

const ComingSoonSection: React.FC<ComingSoonProps> = ({ onNotifyClick }) => {
    const { playHover, playClick } = useAudio();
    const isMobile = devicePerf.isMobile;

    return (
        <section className={`relative py-24 md:py-48 overflow-hidden bg-atmospheric`} id="registration-portal">
            {/* Blending Gradients */}
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0d121f] to-transparent pointer-events-none z-10" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0d121f] to-transparent pointer-events-none z-10" />

            {/* Background Radar Sweep VFX - Desktop Only */}
            {!isMobile && (
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
            )}

            {/* Tactical Grid Overlay */}
            <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />

            {/* Atmospheric glow orbs - Desktop only (expensive GPU compositing on mobile) */}
            {!isMobile && (
                <>
                    <div className="absolute top-1/4 right-0 w-[800px] h-[800px] bg-[#0044ff]/15 rounded-full blur-[150px] pointer-events-none" />
                    <div className="absolute bottom-1/4 left-0 w-[800px] h-[800px] bg-[#4a0000]/25 rounded-full blur-[150px] pointer-events-none" />
                </>
            )}


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
                        {isMobile ? (
                            /* Mobile: Static title, no infinite glitch animation */
                            <h2 className="font-teko text-6xl md:text-8xl lg:text-9xl font-bold uppercase leading-[0.9] text-white tracking-widest relative">
                                <span className="relative inline-block">REGISTER</span>
                                <br />
                                <span className="text-[#ff4655] drop-shadow-[0_0_30px_rgba(255,70,85,0.6)]">NOW LIVE</span>
                            </h2>
                        ) : (
                            /* Desktop: Full animated title */
                            <motion.h2
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                className="font-teko text-6xl md:text-8xl lg:text-9xl font-bold uppercase leading-[0.9] text-white tracking-widest relative"
                            >
                                <span className="relative inline-block">
                                    REGISTER
                                    <motion.span
                                        className="absolute inset-0 text-[#ff4655] -z-10"
                                        animate={{
                                            x: [-1, 1, -0.5, 0],
                                            opacity: [0.3, 0.6, 0.3, 0]
                                        }}
                                        transition={{ repeat: Infinity, duration: 0.2, repeatDelay: 4 }}
                                    >REGISTER</motion.span>
                                </span>
                                <br />
                                <span className="text-[#ff4655] drop-shadow-[0_0_30px_rgba(255,70,85,0.6)]">NOW LIVE</span>
                            </motion.h2>
                        )}
                        {!isMobile && <div className="absolute -inset-4 bg-[#ff4655]/10 blur-[150px] rounded-full -z-10" />}
                    </div>

                    <div className="max-w-3xl mx-auto mb-8 md:mb-12">
                        <p className="font-mono text-sm md:text-lg text-white/80 tracking-[0.2em] uppercase leading-relaxed border-y border-white/10 py-6 md:py-8 px-4">
                            The gates are open. The protocol is active.
                            <span className={`text-[#ff4655] block mt-2 font-bold ${!isMobile ? 'animate-pulse' : ''}`}>DEPLOY YOUR SQUAD TO THE FRONT LINES.</span>
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
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#ff4655] via-white/50 to-blue-500 rounded-sm opacity-50 group-hover:opacity-100 transition-opacity blur-[4px]" />
                        <button className="relative px-12 md:px-20 py-4 md:py-6 bg-[#ff4655] text-white font-teko text-2xl md:text-4xl tracking-[0.2em] rounded-sm transition-all flex items-center gap-4 md:gap-6 overflow-hidden group-hover:bg-white group-hover:text-black border border-[#ff4655] uppercase shadow-[0_0_30px_rgba(255,70,85,0.4)]">
                            <span className="relative z-10">INITIALIZE_ENTRY</span>
                            <div className={`w-3 h-3 rounded-full bg-white group-hover:bg-black ${!isMobile ? 'group-hover:animate-ping' : ''}`} />
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
