import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { SCHOOLS_DATA, School } from '../../data/config';
import ScrambleText from '../ScrambleText';

interface SchoolCardProps {
    school: School;
    index: number;
}

const SchoolCard: React.FC<SchoolCardProps> = ({ school, index }) => {
    const isConfirmed = school.status === 'Confirmed' || school.status === 'Qualified';
    const statusText = isConfirmed ? 'CONFIRMED' : 'PENDING';
    
    // We only use inView to delay the initial intro animation
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: (index % 5) * 0.1 }}
            className="group relative flex flex-col items-center justify-center p-6 bg-[#08080a] border border-white/5 hover:border-[#ff4655]/50 transition-colors duration-500 rounded-sm cursor-crosshair overflow-hidden"
        >
            {/* Background Hover Glow */}
            <div className="absolute inset-0 bg-radial-gradient from-[#ff4655]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/10 group-hover:border-[#ff4655] transition-colors" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/10 group-hover:border-[#ff4655] transition-colors" />

            {/* Status Badge */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
                <span className={`w-1.5 h-1.5 rounded-full ${isConfirmed ? 'bg-[#ff4655] animate-pulse shadow-[0_0_8px_#ff4655]' : 'bg-white/20'}`} />
                <span className={`text-[8px] font-mono tracking-widest uppercase ${isConfirmed ? 'text-[#ff4655]' : 'text-white/30'}`}>
                    {statusText}
                </span>
            </div>

            {/* Logo Container */}
            <div className="relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center mt-6 mb-4">
                <img
                    src={`img/schools/${school.logo || school.name}.png`}
                    alt={school.name}
                    className="absolute inset-0 w-full h-full object-contain p-2 
                               filter grayscale opacity-40 
                               group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 
                               transition-all duration-500 ease-out z-10"
                    loading="lazy"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                />
            </div>

            {/* School Name */}
            <div className="w-full mt-auto flex flex-col items-center text-center">
                <h4 className="font-teko text-lg md:text-xl font-bold tracking-[0.05em] uppercase text-white/70 group-hover:text-white transition-colors leading-[1.1]">
                    {school.name}
                </h4>
            </div>

            {/* Bottom Scanline Highlight */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff4655]/0 to-transparent group-hover:via-[#ff4655] transition-all duration-700" />
        </motion.div>
    );
};

const SchoolsGrid: React.FC = () => {
    const confirmedCount = SCHOOLS_DATA.filter(s => s.status === 'Confirmed' || s.status === 'Qualified').length;

    return (
        <section id="schools" className="relative py-24 md:py-32 px-6 bg-[#08080a] overflow-hidden">
            <div className="max-w-7xl mx-auto relative z-10">
                
                {/* Header */}
                <div className="flex flex-col items-center md:items-start mb-16 border-b border-white/5 pb-8">
                    <div className="inline-flex items-center gap-3 mb-2">
                        <span className="w-1.5 h-1.5 bg-[#ff4655] rotate-45" />
                        <ScrambleText text="ELIGIBLE INSTITUTIONS" className="text-[#ff4655] font-mono tracking-[0.4em] text-[10px] uppercase font-bold" />
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-end justify-between w-full">
                        <h2 className="font-teko text-5xl md:text-8xl font-bold leading-[0.8] tracking-widest text-white text-center md:text-left mt-2 md:mt-0">
                            PARTICIPATING <br className="hidden md:block"/>
                            <span className="text-white/50">SCHOOLS</span>
                        </h2>
                        
                        <div className="mt-8 md:mt-0 text-center md:text-right">
                            <div className="flex items-center justify-center md:justify-end gap-3">
                                <span className="font-teko text-4xl md:text-5xl text-[#ff4655] font-bold">{confirmedCount}</span>
                                <span className="font-mono text-xs text-white/30 tracking-[0.5em] uppercase">Systems Online</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                    {SCHOOLS_DATA.map((school, i) => (
                        <SchoolCard key={school.name} school={school} index={i} />
                    ))}
                </div>
            </div>
            
            {/* Background Texture Layers */}
            <div className="absolute top-[20%] left-[-10%] w-96 h-96 bg-[#ff4655]/5 rounded-full blur-[100px] pointer-events-none" />
        </section>
    );
};

export default SchoolsGrid;
