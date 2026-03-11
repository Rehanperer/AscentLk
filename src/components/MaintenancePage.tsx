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

            {/* Glowing Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ff4655]/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />

            <div className="relative z-10 w-full max-w-4xl border border-white/10 bg-black/40 backdrop-blur-xl p-8 md:p-16 text-center">
                {/* Decorative Corners */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#ff4655]" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/20" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/20" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#ff4655]" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center"
                >
                    <div className="w-20 h-20 bg-[#ff4655]/10 border border-[#ff4655]/30 flex items-center justify-center mb-8 relative">
                        <Settings className="text-[#ff4655] animate-spin-slow" size={40} />
                        <div className="absolute -top-1 -right-1">
                            <ShieldAlert className="text-[#ff4655]" size={20} />
                        </div>
                    </div>

                    <h1 className="font-teko text-5xl md:text-7xl leading-none mb-4 tracking-tight">
                        SYSTEM_MAINTENANCE
                    </h1>

                    <div className="font-mono text-[#ff4655] text-xs md:text-sm tracking-[0.4em] mb-12 uppercase flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#ff4655] animate-ping" />
                        CORE_UPGRADE_IN_PROGRESS
                    </div>

                    {/* Countdown Display */}
                    <div className="grid grid-cols-3 gap-4 md:gap-8 mb-12">
                        {[
                            { label: 'HOURS', value: timeLeft.hours },
                            { label: 'MINUTES', value: timeLeft.minutes },
                            { label: 'SECONDS', value: timeLeft.seconds }
                        ].map((unit, idx) => (
                            <div key={idx} className="bg-white/5 border border-white/10 p-6 md:p-8 min-w-[100px] md:min-w-[140px]">
                                <div className="font-teko text-5xl md:text-7xl leading-none text-white">{unit.value}</div>
                                <div className="font-mono text-[9px] md:text-[11px] text-white/30 tracking-[0.3em] mt-2">{unit.label}</div>
                            </div>
                        ))}
                    </div>

                    <p className="max-w-md font-inter text-white/60 text-sm md:text-base leading-relaxed mb-12">
                        We are currently performing scheduled maintenance to enhance your experience.
                        The database and registration systems are being optimized.
                    </p>

                    <div className="flex flex-col md:flex-row items-center gap-6 font-mono text-[10px] text-white/40 uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            NETWORK: STABLE
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#00ff88]" />
                            AUTH_BYPASS: DISABLED
                        </div>
                        <div className="flex items-center gap-2">
                            <RefreshCw size={14} className="animate-spin text-[#ff4655]" />
                            AUTO_RELOAD: ACTIVE
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
