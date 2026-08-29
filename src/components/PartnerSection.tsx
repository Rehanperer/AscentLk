import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Trophy, Gamepad2, Music, Users, Shield, GraduationCap, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScrambleText from './ScrambleText';
import { useAudio } from '../hooks/useAudio';

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; desc: string; delay: number }> = ({ icon, title, desc, delay }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay, ease: [0.25, 1, 0.5, 1] }}
            className="relative group bg-white/[0.02] border border-white/5 p-6 md:p-8 hover:border-[#ff4655]/30 transition-colors duration-500"
        >
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/10 group-hover:border-[#ff4655]/40 transition-colors" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/10 group-hover:border-[#ff4655]/40 transition-colors" />

            <div className="text-[#ff4655] mb-5 group-hover:drop-shadow-[0_0_10px_rgba(255,70,85,0.4)] transition-all">
                {icon}
            </div>
            <h3 className="font-teko text-2xl md:text-3xl font-bold text-white uppercase tracking-wide mb-2">{title}</h3>
            <p className="font-mono text-[10px] md:text-xs text-white/40 tracking-widest uppercase leading-relaxed">{desc}</p>
        </motion.div>
    );
};

const RequirementItem: React.FC<{ text: string; delay: number }> = ({ text, delay }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -15 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -15 }}
            transition={{ duration: 0.4, delay }}
            className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0"
        >
            <div className="w-1.5 h-1.5 bg-[#ff4655] flex-shrink-0 shadow-[0_0_8px_rgba(255,70,85,0.5)]" />
            <span className="font-mono text-xs md:text-sm text-white/60 tracking-wide uppercase">{text}</span>
        </motion.div>
    );
};

const RegisterSection: React.FC = () => {
    const { playHover, playClick } = useAudio();
    const sectionRef = useRef(null);
    const headerRef = useRef(null);
    const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });

    return (
        <section ref={sectionRef} id="register" className="relative bg-[#08080a] overflow-hidden py-24 md:py-40 content-auto">
            
            {/* Background atmosphere */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Subtle grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_20%,transparent_100%)]" />
                {/* Central glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-[radial-gradient(ellipse_at_center,rgba(255,70,85,0.06)_0%,transparent_60%)]" />
            </div>

            <div className="max-w-6xl mx-auto px-6 relative z-10">

                {/* ── Header ── */}
                <div ref={headerRef} className="text-center mb-20 md:mb-28">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-4 mb-6"
                    >
                        <div className="h-[1px] w-12 bg-gradient-to-l from-[#ff4655] to-transparent" />
                        <ScrambleText text="REGISTRATION OPEN" className="text-[#ff4655] font-mono tracking-[0.5em] text-[10px] uppercase font-bold" />
                        <div className="h-[1px] w-12 bg-gradient-to-r from-[#ff4655] to-transparent" />
                    </motion.div>
                    
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="font-teko text-6xl md:text-[8rem] font-black text-white leading-none uppercase tracking-tight"
                    >
                        ENTER THE ARENA
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={isHeaderInView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="font-mono text-xs md:text-sm text-white/30 tracking-widest uppercase mt-6 max-w-xl mx-auto leading-relaxed"
                    >
                        Register your school's best 5v5 Valorant roster for Sri Lanka's premier student esports championship
                    </motion.p>
                </div>

                {/* ── Feature Grid ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-20 md:mb-28">
                    <FeatureCard
                        icon={<Trophy size={32} strokeWidth={1.5} />}
                        title="300K+ Prize Pool"
                        desc="Sri Lanka's largest student esports purse. Glory and rewards for the worthy."
                        delay={0}
                    />
                    <FeatureCard
                        icon={<Gamepad2 size={32} strokeWidth={1.5} />}
                        title="5v5 Valorant"
                        desc="Tier-1 competitive format with live broadcast production across all stages."
                        delay={0.15}
                    />
                    <FeatureCard
                        icon={<Music size={32} strokeWidth={1.5} />}
                        title="Hybrid Event"
                        desc="Championship finals fused with a live concert at Cinnamon Life's Lumina Ballroom."
                        delay={0.3}
                    />
                </div>

                {/* ── Requirements + CTA ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
                    
                    {/* Requirements */}
                    <div className="bg-white/[0.02] border border-white/5 p-6 md:p-10 relative">
                        <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-[#ff4655]/30" />
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-[#ff4655]/30" />
                        
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                            <Shield size={16} className="text-[#ff4655]" />
                            <span className="font-mono text-[10px] tracking-[0.4em] text-[#ff4655] uppercase font-bold">Entry Requirements</span>
                        </div>
                        
                        <RequirementItem text="5 main players per team" delay={0} />
                        <RequirementItem text="Up to 2 substitutes (optional)" delay={0.08} />
                        <RequirementItem text="School / institution verification" delay={0.16} />
                        <RequirementItem text="Teacher-in-charge approval" delay={0.24} />
                        <RequirementItem text="Valid Riot IDs for all players" delay={0.32} />
                        <RequirementItem text="One team per institution" delay={0.4} />
                    </div>

                    {/* CTA Block */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <div className="flex items-center gap-3 mb-4">
                            <Users size={18} className="text-white/30" />
                            <span className="font-mono text-[10px] tracking-[0.3em] text-white/30 uppercase">16 Schools. Limited Slots.</span>
                        </div>

                        <h3 className="font-teko text-4xl md:text-6xl font-bold text-white uppercase leading-none mb-4">
                            Lock In<br />Your Team
                        </h3>
                        
                        <p className="text-white/40 font-mono text-[10px] md:text-xs tracking-widest uppercase leading-relaxed mb-10 max-w-sm">
                            Slots are filling fast. Secure your institution's position before the roster deadline.
                        </p>

                        <Link
                            to="/register"
                            onMouseEnter={() => playHover()}
                            onClick={() => playClick()}
                        >
                            <motion.div
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="group relative px-10 md:px-14 py-5 md:py-6 bg-[#ff4655] text-white font-teko text-xl md:text-2xl font-bold tracking-[0.2em] uppercase overflow-hidden flex items-center gap-4 shadow-[0_0_30px_rgba(255,70,85,0.3)] hover:shadow-[0_0_50px_rgba(255,70,85,0.5)] transition-shadow"
                            >
                                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                                <GraduationCap size={22} className="relative z-10" />
                                <span className="relative z-10">Register Your Team</span>
                                <ChevronRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                            </motion.div>
                        </Link>

                        {/* Secondary link */}
                        <div className="mt-6 font-mono text-[9px] md:text-[10px] text-white/20 tracking-[0.3em] uppercase">
                            Registration closes before event day
                        </div>
                    </div>
                </div>

                {/* ── Bottom Divider ── */}
                <div className="mt-24 md:mt-32 flex flex-col items-center gap-4 opacity-40">
                    <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-white/50">Scroll for footer</span>
                    <div className="h-16 w-[1px] bg-gradient-to-b from-[#ff4655] to-transparent" />
                </div>
            </div>
        </section>
    );
};

export default RegisterSection;
