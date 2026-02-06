import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const phases = [
    {
        id: '01',
        title: 'QUALIFIERS',
        subtitle: 'Swiss Online',
        desc: 'The gauntlet begins. Swiss-system bracket.',
        date: 'JUNE 2026',
    },
    {
        id: '02',
        title: 'GROUPS',
        subtitle: 'LAN Studio',
        desc: 'Offline group stages. Pro environment.',
        date: 'EARLY JULY',
    },
    {
        id: '03',
        title: 'FINALS',
        subtitle: 'Grand Stage',
        desc: 'The grand finale. Live audience.',
        date: 'JULY 17',
        highlight: true
    }
];

const Timeline: React.FC = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any } }
    };

    return (
        <div ref={ref} className="w-full max-w-7xl mx-auto px-6 py-24 relative mt-12">

            {/* Desktop Top Line */}
            <div className="hidden md:block absolute top-[96px] left-0 w-full h-[1px] bg-white/5 z-0">
                <motion.div
                    className="h-full bg-gradient-to-r from-transparent via-[#ff4655] to-transparent opacity-50"
                    initial={{ scaleX: 0 }}
                    animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                />
            </div>

            <motion.div
                className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 relative z-10"
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
            >
                {phases.map((phase) => (
                    <motion.div
                        key={phase.id}
                        variants={itemVariants}
                        className="relative group h-full"
                    >
                        {/* Mobile Connecting Line */}
                        <div className="md:hidden absolute left-[-24px] top-8 bottom-[-48px] w-[1px] bg-white/10" />
                        <div className="md:hidden absolute left-[-27px] top-10 w-[7px] h-[7px] bg-[#ff4655] rounded-full border border-black z-20" />

                        {/* Card */}
                        <motion.div
                            className={`
                                h-full flex flex-col justify-between p-6 md:p-8
                                bg-[#0f1923]/80 backdrop-blur-md 
                                border border-white/5 
                                transition-all duration-500 hover:-translate-y-2
                                hover:shadow-[0_10px_40px_-10px_rgba(255,70,85,0.1)]
                                relative overflow-hidden
                            `}
                            whileInView={{ borderColor: 'rgba(255, 70, 85, 0.3)' }}
                            viewport={{ margin: "-20%" }}
                        >
                            {/* Mobile/Desktop Shine Effect */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0"
                                initial={{ x: '-100%' }}
                                whileInView={{ x: '100%' }}
                                transition={{ repeat: Infinity, repeatDelay: 3, duration: 1.5, ease: "easeInOut" }}
                            />

                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <span className="font-mono text-[9px] tracking-[0.2em] text-[#ff4655]">PHASE // {phase.id}</span>
                                    {/* Top Connector Dot (Desktop) */}
                                    <div className="hidden md:block absolute -top-[5px] left-1/2 -translate-x-1/2 w-2 h-2 bg-[#0f1923] border border-[#ff4655] rotate-45 z-20" />
                                </div>

                                <h3 className="font-teko text-4xl lg:text-5xl text-white mb-2 leading-[0.85] tracking-tight">{phase.title}</h3>
                                <div className="text-white/40 font-mono text-[10px] tracking-[0.2em] uppercase mb-6">{phase.subtitle}</div>
                                <p className="text-sm text-gray-400 font-medium leading-relaxed opacity-80">{phase.desc}</p>
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                                <span className={`font-teko text-xl tracking-wider ${phase.highlight ? 'text-[#ff4655]' : 'text-white/60'}`}>
                                    {phase.date}
                                </span>
                            </div>
                        </motion.div>
                    </motion.div>
                ))}

                {/* Prize Pool */}
                <motion.div variants={itemVariants} className="relative flex items-center justify-center md:justify-end">
                    <div className="md:hidden absolute left-[-24px] top-0 h-[50%] w-[1px] bg-white/10" />

                    <div className="text-center md:text-right group cursor-default relative">
                        {/* Desktop Connector for Prize Pool */}
                        <div className="hidden md:block absolute -top-[5px] right-1/2 translate-x-1/2 w-2 h-2 bg-[#0f1923] border border-[#ff4655] rotate-45 z-20" />

                        <div className="font-mono text-[10px] tracking-[0.4em] text-white/40 mb-2 group-hover:text-[#ff4655] transition-colors">GRAND PRIZE</div>
                        <div className="font-teko text-[7rem] md:text-[6.5rem] lg:text-[7.5rem] font-bold leading-[0.8] text-white tracking-tighter relative">
                            <motion.span
                                className="relative z-10 transition-all duration-500"
                                whileInView={{ color: "transparent", WebkitTextStroke: "1px #ff4655" } as any}
                                viewport={{ margin: "-10%" }}
                            >
                                300K
                            </motion.span>
                            <motion.div
                                className="absolute -inset-4 bg-[#ff4655]/20 blur-3xl"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                        <div className="font-mono text-sm text-[#ff4655] tracking-[0.5em] mt-2 opacity-80">LKR POOL</div>
                    </div>
                </motion.div>

            </motion.div>
        </div>
    );
};

export default Timeline;
