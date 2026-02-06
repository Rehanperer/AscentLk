import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const CountdownSection: React.FC = () => {
    const [timeLeft, setTimeLeft] = useState({ d: '00', h: '00', m: '00', s: '00' });

    useEffect(() => {
        const target = new Date("2026-03-06T00:00:00").getTime();
        const update = () => {
            const now = new Date().getTime();
            const distance = target - now;
            if (distance < 0) return;
            const d = Math.floor(distance / (1000 * 60 * 60 * 24));
            const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeLeft({
                d: d < 10 ? "0" + d : d.toString(),
                h: h < 10 ? "0" + h : h.toString(),
                m: m < 10 ? "0" + m : m.toString(),
                s: s < 10 ? "0" + s : s.toString()
            });
        };
        const interval = setInterval(update, 1000);
        update();
        return () => clearInterval(interval);
    }, []);

    return (
        <section id="countdown" className="relative overflow-hidden py-16 md:py-24 bg-[#0a0a0c]">
            {/* TACTICAL BACKGROUND LAYER */}
            <div className="absolute inset-0 z-0">
                {/* Metallic Red Gradient */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#3a0a0d_0%,#0a0a0c_100%)] opacity-80" />

                {/* HUD Scanline/Radar Sweep */}
                <motion.div
                    className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0%,rgba(255,70,85,0.05)_50%,transparent_100%)]"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />

                {/* Technical Grid Accent */}
                <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />

                {/* Corner Markers */}
                <div className="absolute top-10 left-10 w-20 h-20 border-t border-l border-[#ff4655]/30" />
                <div className="absolute top-10 right-10 w-20 h-20 border-t border-r border-[#ff4655]/30" />
                <div className="absolute bottom-10 left-10 w-20 h-20 border-b border-l border-[#ff4655]/30" />
                <div className="absolute bottom-10 right-10 w-20 h-20 border-b border-r border-[#ff4655]/30" />
            </div>

            {/* MAR 06 GHOST TEXT */}
            <div className="absolute inset-0 flex items-center justify-center font-teko font-bold text-[12rem] md:text-[25rem] text-white/[0.02] select-none pointer-events-none -rotate-6">
                MARCH 06
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-20">
                    <div className="text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-3 py-1 border border-[#ff4655]/30 bg-[#ff4655]/10 text-[#ff4655] font-mono text-xs mb-6 uppercase tracking-wider"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ff4655] animate-pulse" />
                            Status: Initializing_Drop
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="font-teko text-5xl md:text-7xl xl:text-8xl font-bold text-white leading-[0.85] mb-6 uppercase tracking-tighter"
                        >
                            THE COUNTDOWN<br />
                            <span className="text-[#ff4655]">HAS BEGUN</span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-white/40 font-mono text-sm md:text-base max-w-md mx-auto lg:mx-0 leading-relaxed"
                        >
                            REGISTRATION WINDOW OPENS MARCH 06.
                            READY YOUR WEAPONS. SYNC YOUR SITES. THE ASCENT AWAITS.
                        </motion.p>
                    </div>

                    <div className="flex flex-wrap gap-4 md:gap-6 justify-center lg:justify-end mt-10 lg:mt-0">
                        <CountdownUnit val={timeLeft.d} label="Days" />
                        <CountdownUnit val={timeLeft.h} label="Hours" />
                        <CountdownUnit val={timeLeft.m} label="Minutes" />
                        <CountdownUnit val={timeLeft.s} label="Seconds" />
                    </div>
                </div>
            </div>
        </section>
    );
};

const CountdownUnit: React.FC<{ val: string; label: string }> = ({ val, label }) => {
    // 3D TILT EFFECT
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="flex flex-col items-center group perspective-1000"
        >
            <div className="relative w-20 h-28 md:w-28 md:h-40 bg-[#1a1a1f] border border-white/5 group-hover:border-[#ff4655]/50 transition-colors duration-500 overflow-hidden shadow-2xl">
                {/* Card Background Patterns */}
                <div className="absolute inset-0 opacity-[0.03] bg-grid" />
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,70,85,0.05)_50%,transparent_75%)] bg-[length:200%_200%] group-hover:animate-shimmer" />

                {/* Internal HUD Elements */}
                <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-white/20" />
                <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-white/20" />

                <div className="absolute inset-0 flex items-center justify-center translate-z-10 mt-2">
                    <DigitalScramble value={val} />
                </div>

                {/* Label Overlay */}
                <div className="absolute bottom-4 w-full text-center">
                    <div className="h-[2px] w-4 bg-[#ff4655] mx-auto mb-2 opacity-50" />
                </div>
            </div>
            <span className="font-mono text-[10px] md:text-xs text-white/30 uppercase tracking-[0.3em] font-bold mt-4">
                {label}
            </span>
        </motion.div>
    );
};

const DigitalScramble: React.FC<{ value: string }> = ({ value }) => {
    const [displayValue, setDisplayValue] = useState(value);
    const chars = "0123456789";

    useEffect(() => {
        if (value === displayValue) return;

        let iteration = 0;
        const interval = setInterval(() => {
            setDisplayValue(prev =>
                prev.split('').map((char, index) => {
                    if (index < iteration) return value[index];
                    return chars[Math.floor(Math.random() * chars.length)];
                }).join('')
            );

            if (iteration >= value.length) clearInterval(interval);
            iteration += 1 / 3;
        }, 30);

        return () => clearInterval(interval);
    }, [value]);

    return (
        <span className="font-teko text-5xl md:text-8xl font-bold text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,70,85,0.3)]">
            {displayValue}
        </span>
    );
};

export default CountdownSection;
