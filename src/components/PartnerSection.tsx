import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Youtube, Globe, Shield, Users, Trophy } from 'lucide-react';
import ScrambleText from './ScrambleText';
import { useAudio } from '../hooks/useAudio';

interface PartnerSectionProps {
    onSponsorClick?: () => void;
    onContactClick?: () => void;
}



const PartnershipCard: React.FC<{
    title: string;
    icon: React.ReactNode;
    desc: string;
    delay: number
}> = ({ title, icon, desc, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="group relative p-6 bg-white/[0.02] border border-white/5 hover:border-[#ff4655]/30 hover:bg-white/[0.04] transition-all duration-300 rounded-sm"
    >
        {/* HUD Corners */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/10 group-hover:border-[#ff4655]/50 transition-colors" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/10 group-hover:border-[#ff4655]/50 transition-colors" />

        <div className="text-[#ff4655] mb-4 group-hover:scale-110 transition-transform duration-300">
            {icon}
        </div>
        <h4 className="font-teko text-2xl font-bold tracking-wider mb-2 text-white uppercase">{title}</h4>
        <p className="text-white/40 text-xs font-mono tracking-widest leading-relaxed uppercase">{desc}</p>
    </motion.div>
);

const PartnerSection: React.FC<PartnerSectionProps> = ({ onSponsorClick, onContactClick }) => {
    const { playHover, playClick } = useAudio();
    const [isMobile, setIsMobile] = useState(false); // Added isMobile state

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <section className="relative py-24 md:py-32 overflow-hidden bg-atmospheric" id="partners">
            {/* Background Branding */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/4 font-teko text-[20rem] md:text-[30rem] font-bold text-white/[0.01] select-none pointer-events-none">
                CORP
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-start">
                    {/* Left Column: CTA & Vision */}
                    <div>
                        <div className="inline-block px-3 py-1 bg-[#ff4655]/10 border border-[#ff4655]/20 mb-6">
                            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-[#ff4655]">Strategic_Alliance_Portal</span>
                        </div>

                        <h2 className="font-teko text-6xl md:text-8xl font-bold uppercase leading-[0.85] mb-8 text-white">
                            PARTNER<br />
                            <span className="text-[#ff4655]">WITH THE ELITE</span>
                        </h2>

                        <div className="max-w-md mb-12">
                            <p className="text-white/60 font-medium tracking-wide leading-relaxed mb-8 uppercase text-sm md:text-base">
                                JOIN THE FASTEST GROWING STUDENT ESPORTS ECOSYSTEM IN SOUTH ASIA.
                                ALIGN YOUR BRAND WITH THE NEXT GENERATION OF DIGITAL COMPETITORS.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onMouseEnter={() => playHover()}
                                    className="bg-[#ff4655] text-white px-10 py-4 font-bold font-teko text-2xl tracking-widest hover:bg-white hover:text-[#0a1016] transition-all rounded-sm shadow-[0_0_20px_rgba(255,70,85,0.2)]"
                                    onClick={() => { playClick(); onSponsorClick?.(); }}
                                >
                                    CORPORATE ENQUIRY
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onMouseEnter={() => playHover()}
                                    className="border border-white/20 text-white px-8 py-4 font-bold font-teko text-2xl tracking-widest hover:bg-white hover:text-[#0a1016] transition-all rounded-sm"
                                    onClick={() => { playClick(); onContactClick?.(); }}
                                >
                                    GENERAL CONTACT
                                </motion.button>
                            </div>
                        </div>

                        {/* Social HUD */}
                        <div className="border-t border-white/5 pt-12">
                            <div className="text-[10px] font-mono tracking-[0.5em] text-white/20 mb-6 uppercase">Sync_Social_Channels</div>
                            <div className="flex flex-wrap gap-4">
                                {[
                                    { icon: <Instagram />, link: 'https://www.instagram.com/ascent_2026/' },
                                    { icon: <Youtube />, link: 'https://youtube.com/@ascent.2026' }

                                ].map((social, i) => (
                                    <motion.a
                                        key={i}
                                        whileHover={{ y: -5, borderColor: '#ff4655' }}
                                        onMouseEnter={() => playHover()}
                                        onClick={() => playClick()}
                                        href={social.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-14 h-14 border border-white/10 bg-white/[0.02] flex items-center justify-center text-white/60 hover:text-[#ff4655] transition-all rounded-sm"
                                    >
                                        {/* @ts-ignore - cloning logic is safe here */}
                                        {React.cloneElement(social.icon as React.ReactElement, { size: 24 })}
                                    </motion.a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Tiers/Features Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <PartnershipCard
                            title="Corporate Tiers"
                            icon={<Shield size={32} />}
                            desc="Premium placement across all digital and physical assets with exclusive broadcast integration."
                            delay={0.1}
                        />
                        <PartnershipCard
                            title="Youth Reach"
                            icon={<Users size={32} />}
                            desc="Direct access to 50,000+ students across Sri Lanka's leading educational institutions."
                            delay={0.2}
                        />
                        <PartnershipCard
                            title="Global Scale"
                            icon={<Globe size={32} />}
                            desc="Leverage high-engagement digital broadcasts reaching viewers across regional boundaries."
                            delay={0.3}
                        />
                        <PartnershipCard
                            title="Brand Legacy"
                            icon={<Trophy size={32} />}
                            desc="Become a cornerstone of Sri Lankan esports history by supporting the premier student platform."
                            delay={0.4}
                        />

                        {/* Additional Decorative HUD element */}
                        <div className="sm:col-span-2 mt-4 p-8 border border-white/5 bg-gradient-to-r from-transparent via-[#ff4655]/5 to-transparent flex flex-col items-center justify-center opacity-50">
                            <div className="font-mono text-[9px] tracking-[0.6em] text-white/30 uppercase mb-4 text-center">Inquiries // ascent2026s@gmail.com</div>
                            <div className="flex items-center gap-6">
                                <div className="h-[1px] w-24 bg-white/10" />
                                <div className="font-teko text-xl font-bold tracking-widest text-[#ff4655]">OPERATIONAL_SIG</div>
                                <div className="h-[1px] w-24 bg-white/10" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Visual Edge */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#ff4655]/5 to-transparent pointer-events-none" />
        </section>
    );
};

export default PartnerSection;
