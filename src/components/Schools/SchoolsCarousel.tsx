import React from 'react';
import { SCHOOLS_DATA, School } from '../../data/config';
import { motion } from 'framer-motion';

const SchoolCard: React.FC<{ school: School }> = ({ school }) => {
    let statusText = "PENDING";
    let colorClass = "text-white/50";

    if (school.status === 'Qualified') { statusText = "QUALIFIED"; colorClass = "text-[#ff4655]"; }
    else if (school.status === 'Confirmed') { statusText = "CONFIRMED"; colorClass = "text-white font-bold"; }

    return (
        <div className="carousel-logo w-32 h-40 flex-shrink-0 bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-2 cursor-pointer relative overflow-hidden group interactive-element mx-2">
            <div className={`absolute top-1 right-1 text-[8px] font-mono ${colorClass}`}>{statusText}</div>
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#ff4655] transition-colors duration-300 relative overflow-hidden">
                <i className="fa-solid fa-shield-halved text-xl text-white"></i>
                <img
                    src={`${import.meta.env.BASE_URL}img/schools/${school.name}.png`}
                    className="absolute inset-0 w-full h-full object-contain opacity-0 group-hover:opacity-100 transition-opacity"
                    alt={school.name}
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                />
            </div>
            <div className="font-teko text-sm tracking-wide text-center px-2 leading-3 uppercase whitespace-normal w-full break-words">{school.name}</div>
        </div>
    );
};

const SchoolsCarousel: React.FC = () => {
    const doubleSchools = [...SCHOOLS_DATA, ...SCHOOLS_DATA];

    const confirmedCount = SCHOOLS_DATA.filter(s => s.status === 'Confirmed' || s.status === 'Qualified').length;

    return (
        <div className="w-full relative">
            <div className="w-full overflow-hidden py-12 bg-black/20 border-y border-white/5 backdrop-blur-sm relative">
                <motion.div
                    className="flex whitespace-nowrap"
                    animate={{ x: [0, -132 * SCHOOLS_DATA.length] }}
                    transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                >
                    {doubleSchools.map((school, i) => (
                        <SchoolCard key={i} school={school} />
                    ))}
                </motion.div>
            </div>

            <div className="text-center mt-6 text-xl font-teko tracking-widest text-[#ff4655] animate-pulse">
                <span>{confirmedCount}</span>/{SCHOOLS_DATA.length} SCHOOLS CONFIRMED
            </div>
        </div>
    );
};

export default SchoolsCarousel;
