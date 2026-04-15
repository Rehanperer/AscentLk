import React, { useState, useEffect, useRef } from 'react';
import { SCHOOLS_DATA } from '../../data/config';
import ScrambleText from '../ScrambleText';

/**
 * OPTION 3: Terminal Roster
 * A stylized CLI terminal that "types out" school names with status codes.
 */
const SchoolsTerminal: React.FC = () => {
    const [visibleLines, setVisibleLines] = useState(0);
    const terminalRef = useRef<HTMLDivElement>(null);
    const hasStarted = useRef(false);

    const confirmedCount = SCHOOLS_DATA.filter(s => s.status === 'Confirmed' || s.status === 'Qualified').length;

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasStarted.current) {
                    hasStarted.current = true;
                    // Start typing effect
                    let line = 0;
                    const interval = setInterval(() => {
                        line++;
                        setVisibleLines(line);
                        if (line >= SCHOOLS_DATA.length + 3) { // +3 for header lines
                            clearInterval(interval);
                        }
                    }, 120);
                }
            },
            { threshold: 0.3 }
        );

        if (terminalRef.current) observer.observe(terminalRef.current);
        return () => observer.disconnect();
    }, []);

    const getStatusTag = (status: string) => {
        if (status === 'Confirmed' || status === 'Qualified') {
            return <span className="text-[#00ff40]">[CONFIRMED]</span>;
        }
        return <span className="text-yellow-500/70">[PENDING]</span>;
    };

    return (
        <section id="schools" className="relative py-16 md:py-24 bg-[#08080a] overflow-hidden">
            <div className="max-w-4xl mx-auto px-6" ref={terminalRef}>
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-8">
                    <div className="text-center md:text-left">
                        <div className="inline-flex items-center gap-3 mb-2">
                            <span className="w-1.5 h-1.5 bg-[#ff4655] rotate-45" />
                            <ScrambleText text="ELIGIBLE INSTITUTIONS" className="text-[#ff4655] font-mono tracking-[0.4em] text-[10px] uppercase font-bold" />
                        </div>
                        <h2 className="font-teko text-5xl md:text-7xl font-bold leading-[0.85] text-white">
                            PARTICIPATING SCHOOLS
                        </h2>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center gap-3">
                        <span className="font-teko text-4xl text-[#ff4655] font-bold">{confirmedCount}</span>
                        <span className="font-mono text-[10px] text-white/30 tracking-[0.4em] uppercase">Confirmed</span>
                    </div>
                </div>

                {/* Terminal Window */}
                <div className="relative border border-white/10 bg-[#0a0e18] overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                    
                    {/* Title Bar */}
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] border-b border-white/10">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#ff4655]/80" />
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                        </div>
                        <span className="font-mono text-[10px] text-white/30 tracking-[0.3em] ml-3 uppercase">
                            ascent_roster@gauntlet:~
                        </span>
                    </div>

                    {/* Terminal Body */}
                    <div className="p-6 font-mono text-xs md:text-sm leading-relaxed max-h-[420px] overflow-y-auto custom-scrollbar">
                        {/* Boot Lines */}
                        {visibleLines >= 1 && (
                            <div className="text-white/30 mb-1">
                                <span className="text-[#ff4655]">$</span> ascent --roster --season 2026 --status all
                            </div>
                        )}
                        {visibleLines >= 2 && (
                            <div className="text-white/20 mb-1">
                                Connecting to ASCENT registry... <span className="text-[#00ff40]">OK</span>
                            </div>
                        )}
                        {visibleLines >= 3 && (
                            <div className="text-white/20 mb-4 border-b border-white/5 pb-3">
                                Fetching roster data for {SCHOOLS_DATA.length} institutions...
                            </div>
                        )}

                        {/* School Entries */}
                        {SCHOOLS_DATA.map((school, i) => {
                            if (visibleLines < i + 4) return null; // +4 because of 3 header lines
                            const isConfirmed = school.status === 'Confirmed' || school.status === 'Qualified';

                            return (
                                <div
                                    key={school.name}
                                    className={`flex items-center justify-between py-1.5 border-b border-white/[0.03] group hover:bg-white/[0.03] px-2 -mx-2 transition-colors cursor-default ${
                                        visibleLines === i + 4 ? 'animate-pulse' : ''
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-white/20 w-6 text-right tabular-nums">
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                        <span className={`w-1.5 h-1.5 rounded-full ${isConfirmed ? 'bg-[#00ff40] shadow-[0_0_6px_#00ff40]' : 'bg-yellow-500/50'}`} />
                                        <span className="text-white/80 group-hover:text-white transition-colors tracking-wide">
                                            {school.name}
                                        </span>
                                    </div>
                                    <div className="font-mono text-[10px] tracking-wider">
                                        {getStatusTag(school.status)}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Completion Line */}
                        {visibleLines >= SCHOOLS_DATA.length + 4 && (
                            <div className="mt-4 pt-3 border-t border-white/5">
                                <span className="text-[#00ff40]">✓</span>
                                <span className="text-white/40 ml-2">
                                    Roster loaded. {confirmedCount}/{SCHOOLS_DATA.length} confirmed.
                                </span>
                            </div>
                        )}

                        {/* Blinking cursor */}
                        {visibleLines < SCHOOLS_DATA.length + 4 && (
                            <span className="inline-block w-2 h-4 bg-[#ff4655] animate-pulse mt-2" />
                        )}
                        {visibleLines >= SCHOOLS_DATA.length + 4 && (
                            <div className="mt-2 text-white/30">
                                <span className="text-[#ff4655]">$</span> <span className="inline-block w-2 h-4 bg-white/50 animate-pulse" />
                            </div>
                        )}
                    </div>

                    {/* Glow effect at bottom */}
                    <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[#0a0e18] to-transparent pointer-events-none" />
                </div>

                {/* Subtle scanline overlay on the terminal */}
                <div className="absolute inset-0 bg-scanlines opacity-5 pointer-events-none rounded-sm" />
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255,70,85,0.3);
                    border-radius: 2px;
                }
            `}</style>
        </section>
    );
};

export default SchoolsTerminal;
