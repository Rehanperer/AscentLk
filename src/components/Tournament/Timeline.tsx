import React from 'react';
import { motion } from 'framer-motion';

const phases = [
    {
        id: '01',
        title: 'QUALIFIERS',
        subtitle: 'Swiss Online',
        desc: 'The gauntlet begins. Top schools compete in a Swiss-system bracket.',
        date: 'June 2026',
        icon: '⚔️'
    },
    {
        id: '02',
        title: 'GROUPS',
        subtitle: 'LAN Studio',
        desc: 'The best emerge. Offline group stages in a professional studio environment.',
        date: 'Early July',
        icon: '🛡️'
    },
    {
        id: '03',
        title: 'FINALS',
        subtitle: 'Grand Stage',
        desc: 'Legends ascend. The grand finale in front of a live audience.',
        date: 'July 17, 2026',
        icon: '🏆',
        highlight: true
    }
];

const Timeline: React.FC = () => {
    return (
        <div className="w-full max-w-7xl mx-auto px-6 py-12 relative">

            {/* Desktop Horizontal Line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] bg-white/10 -translate-y-1/2 z-0">
                <motion.div
                    className="h-full bg-[#ff4655] origin-left"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                />
            </div>

            {/* Mobile Vertical Line */}
            <div className="md:hidden absolute top-0 left-8 h-full w-[2px] bg-white/10 z-0">
                <motion.div
                    className="w-full bg-[#ff4655] origin-top"
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
                {phases.map((phase, index) => (
                    <motion.div
                        key={phase.id}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.3, duration: 0.5 }}
                        className={`relative group ${index % 2 === 0 ? 'md:mt-0' : 'md:mt-32'}`} // Stagger layout
                    >
                        {/* Dot on Line */}
                        <div className={`absolute w-4 h-4 rounded-full border-2 border-[#ff4655] bg-[#0f1923] 
                            md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2
                            left-8 -translate-x-1/2 top-8
                            group-hover:bg-[#ff4655] transition-colors duration-300 z-20`}
                        />

                        {/* Card */}
                        <div className={`ml-16 md:ml-0 md:text-center p-6 bg-[#white]/5 border border-white/10 hover:border-[#ff4655] transition-colors duration-300 angled-box relative bg-[#0f1923]/80 backdrop-blur-sm
                            ${phase.highlight ? 'border-[#ff4655] shadow-[0_0_20px_rgba(255,70,85,0.2)]' : ''}
                        `}>
                            {/* Phase Number */}
                            <div className="text-[#ff4655] font-mono text-xs tracking-widest mb-2 font-bold">
                                PHASE {phase.id}
                            </div>

                            {/* Title */}
                            <h3 className="font-teko text-4xl text-white uppercase leading-none mb-1">
                                {phase.title}
                            </h3>

                            {/* Subtitle */}
                            <div className="text-white/60 font-mono text-xs uppercase mb-4 tracking-wider">
                                {phase.subtitle}
                            </div>

                            {/* Description */}
                            <p className="text-sm text-gray-400 leading-relaxed mb-4 font-medium opacity-80">
                                {phase.desc}
                            </p>

                            {/* Date Badge */}
                            <div className="inline-block bg-white/5 px-3 py-1 text-xs font-teko tracking-wide text-[#ff4655] border border-white/5">
                                {phase.date}
                            </div>

                        </div>
                    </motion.div>
                ))}

                {/* Prize Pool Node (Last Item) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.2, type: "spring" }}
                    className="relative md:mt-16"
                >
                    {/* Dot on Line */}
                    <div className={`absolute w-6 h-6 rounded-full border-2 border-[#ff4655] bg-[#ff4655] 
                            md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2
                            left-8 -translate-x-1/2 top-24
                            shadow-[0_0_15px_rgba(255,70,85,0.8)] z-20 animate-pulse`}
                    />

                    <div className="ml-16 md:ml-0 text-center">
                        <div className="font-teko text-7xl font-bold text-white leading-none drop-shadow-[0_0_10px_rgba(255,70,85,0.5)]">
                            300K
                        </div>
                        <div className="text-[#ff4655] font-mono text-sm tracking-[0.3em] uppercase bg-[#0f1923] inline-block px-2 relative z-10">
                            LKR PRIZE POOL
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default Timeline;
