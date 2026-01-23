import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CountdownSection: React.FC = () => {
    const [timeLeft, setTimeLeft] = useState({ d: '00', h: '00', m: '00', s: '00' });

    useEffect(() => {
        const target = new Date("2026-01-26T00:00:00").getTime();
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
        <section className="bg-[#ff4655] relative overflow-hidden py-24">
            <div className="absolute top-0 right-0 w-full h-full opacity-10 font-teko font-bold text-[15rem] md:text-[30rem] leading-none text-black select-none pointer-events-none overflow-hidden whitespace-nowrap -rotate-12 translate-x-1/4">
                JAN 26
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row w-full max-w-6xl px-4 md:px-8 items-center gap-8 md:gap-12 justify-center mx-auto">
                <div className="w-full lg:w-1/2 text-center lg:text-left">
                    <div className="inline-block px-3 py-1 bg-black text-white font-mono text-xs md:text-sm mb-4">status: PENDING</div>
                    <h2 className="font-teko text-6xl md:text-8xl font-bold text-black leading-[0.9] mb-4 md:mb-6 uppercase">
                        REGISTRATION<br />OPENS IN
                    </h2>
                    <p className="text-black/80 font-semibold text-base md:text-xl max-w-md mx-auto lg:mx-0 uppercase">
                        Prepare your roster. The battle for the Ascent trophy begins on January 26th. Don't miss the drop.
                    </p>
                </div>

                <div className="w-full lg:w-1/2 flex gap-2 md:gap-4 lg:gap-8 justify-center">
                    {[
                        { val: timeLeft.d, label: 'Days', bg: 'bg-black', text: 'text-white' },
                        { val: timeLeft.h, label: 'Hours', bg: 'bg-white', text: 'text-[#ff4655]' },
                        { val: timeLeft.m, label: 'Minutes', bg: 'bg-black', text: 'text-white' },
                        { val: timeLeft.s, label: 'Seconds', bg: 'bg-white', text: 'text-[#ff4655]' }
                    ].map((unit, i) => (
                        <div key={i} className="flex flex-col items-center">
                            <div className={`w-14 h-16 md:w-24 md:h-32 ${unit.bg} angled-box flex items-center justify-center mb-2`}>
                                <span className={`font-teko text-3xl md:text-7xl ${unit.text}`}>{unit.val}</span>
                            </div>
                            <span className="font-mono text-[10px] md:text-sm text-black font-bold uppercase tracking-widest">{unit.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CountdownSection;
