import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, AlertTriangle, RefreshCw, ShieldAlert } from 'lucide-react';
import ScrambleText from './ScrambleText';

interface MaintenancePageProps {
    until: string; // ISO String
}

const MaintenancePage: React.FC<MaintenancePageProps> = ({ until }) => {
    const [timeLeft, setTimeLeft] = useState({
        hours: '00',
        minutes: '00',
        seconds: '00'
    });

    useEffect(() => {
        const calculateTime = () => {
            const difference = +new Date(until) - +new Date();

            if (difference <= 0) {
                // Auto reload when countdown ends
                window.location.reload();
                return;
            }

            const h = Math.floor(difference / (1000 * 60 * 60));
            const m = Math.floor((difference / 1000 / 60) % 60);
            const s = Math.floor((difference / 1000) % 60);

            setTimeLeft({
                hours: h.toString().padStart(2, '0'),
                minutes: m.toString().padStart(2, '0'),
                seconds: s.toString().padStart(2, '0')
            });
        };

        const timer = setInterval(calculateTime, 1000);
        calculateTime();

        return () => clearInterval(timer);
    }, [until]);

    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-6 text-white overflow-hidden"
            style={{ background: 'var(--bg-gradient)' }}>

            {/* Background Grid */}
            <div className="absolute inset-0 pointer-events-none opacity-5"
                style={{
                    backgroundImage: 'linear-gradient(#ff4655 1px, transparent 1px), linear-gradient(90deg, #ff4655 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Glowing Orbs & Side Gradients */}
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#ff4655]/30 rounded-full blur-[150px] animate-pulse" />
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#ff4655]/20 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />

            {/* Side Vignettes */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#ff4655]/10 to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#ff4655]/10 to-transparent pointer-events-none" />

            <div className="relative z-10 w-full max-w-4xl border-x md:border border-[#ff4655]/20 bg-[#0d121f]/80 backdrop-blur-xl p-6 md:p-16 text-center shadow-[0_0_50px_rgba(255,70,85,0.1)] mx-4">
                {/* Decorative Corners - Hidden on very small screens to save space */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#ff4655] hidden sm:block" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#ff4655]/30 hidden sm:block" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#ff4655]/30 hidden sm:block" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#ff4655] hidden sm:block" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center"
                >
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-[#ff4655]/10 border border-[#ff4655]/40 flex items-center justify-center mb-6 md:mb-8 relative">
                        <Settings className="text-[#ff4655] animate-spin-slow" size={32} />
                        <div className="absolute -top-1 -right-1">
                            <ShieldAlert className="text-[#ff4655]" size={16} />
                        </div>
                    </div>

                    <h1 className="font-teko text-4xl md:text-7xl leading-none mb-3 md:mb-4 tracking-tight text-[#ff4655]">
                        SYSTEM_MAINTENANCE
                    </h1>

                    <div className="font-mono text-white/60 text-[10px] md:text-sm tracking-[0.2em] md:tracking-[0.4em] mb-8 md:mb-12 uppercase flex items-center gap-2 md:gap-3">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#ff4655] animate-ping" />
                        CORE_UPGRADE_IN_PROGRESS
                    </div>

                    {/* Countdown Display */}
                    <div className="grid grid-cols-3 gap-3 md:gap-8 mb-8 md:mb-12 w-full">
                        {[
                            { label: 'HOURS', value: timeLeft.hours },
                            { label: 'MINS', value: timeLeft.minutes },
                            { label: 'SECS', value: timeLeft.seconds }
                        ].map((unit, idx) => (
                            <div key={idx} className="bg-white/5 border border-white/10 p-4 md:p-8 min-w-0 group hover:border-[#ff4655]/40 transition-colors">
                                <div className="font-teko text-4xl md:text-7xl leading-none text-[#ff4655] group-hover:scale-105 transition-transform duration-500">{unit.value}</div>
                                <div className="font-mono text-[8px] md:text-[11px] text-white/30 tracking-[0.2em] md:tracking-[0.3em] mt-1 md:mt-2">{unit.label}</div>
                            </div>
                        ))}
                    </div>

                    <p className="max-w-md font-inter text-white/60 text-xs md:text-base leading-relaxed mb-8 md:mb-12 px-4">
                        We are currently performing scheduled maintenance to enhance your experience.
                        The database and registration systems are being optimized.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 font-mono text-[9px] md:text-[10px] text-white/40 uppercase tracking-widest px-4">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#ff4655]" />
                            NETWORK: STABLE
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#ff4655]" />
                            AUTH: SECURE
                        </div>
                        <div className="flex items-center gap-2">
                            <RefreshCw size={12} className="animate-spin text-[#ff4655]" />
                            RELOAD: AUTO
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Footer Tag */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-teko text-xl tracking-[0.5em] text-white/20">
                ASCENT_OPERATIONS_GROUP_2026
            </div>

            <style>{`
                .animate-spin-slow {
                    animation: spin 8s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default MaintenancePage;
