import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const TournamentMesh: React.FC = () => {
    const [days, setDays] = useState('00');
    const [hours, setHours] = useState('00');

    useEffect(() => {
        const target = new Date("2026-07-17T09:00:00").getTime();
        const update = () => {
            const now = new Date().getTime();
            const distance = target - now;
            if (distance < 0) return;
            const d = Math.floor(distance / (1000 * 60 * 60 * 24));
            const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            setDays(d < 10 ? "0" + d : d.toString());
            setHours(h < 10 ? "0" + h : h.toString());
        };
        const interval = setInterval(update, 60000);
        update();
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="network-container w-full max-w-[800px] aspect-square relative mx-auto flex items-center justify-center scale-90 md:scale-100">
            {/* SVG Lines */}
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0" viewBox="0 0 800 800" preserveAspectRatio="xMidYMid meet" style={{ overflow: 'visible' }}>
                <defs>
                    <linearGradient id="mesh-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{ stopColor: 'rgba(255, 70, 85, 0.1)' }} />
                        <stop offset="50%" style={{ stopColor: 'rgba(255, 70, 85, 0.5)' }} />
                        <stop offset="100%" style={{ stopColor: 'rgba(255, 70, 85, 0.1)' }} />
                    </linearGradient>
                </defs>

                {/* Center to Nodes */}
                {[1, 2, 3, 4, 5, 6].map(i => {
                    const coords = [
                        { x: 400, y: 120 }, { x: 640, y: 224 }, { x: 640, y: 576 },
                        { x: 400, y: 680 }, { x: 160, y: 576 }, { x: 160, y: 224 }
                    ][i - 1];
                    return (
                        <motion.line
                            key={i}
                            x1="400" y1="400" x2={coords.x} y2={coords.y}
                            className="mesh-line active"
                            initial={{ pathLength: 0, opacity: 0 }}
                            whileInView={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1, delay: i * 0.1 }}
                        />
                    );
                })}

                {/* Outer Ring */}
                {[0, 1, 2, 3, 4, 5].map(i => {
                    const p1 = [
                        { x: 400, y: 120 }, { x: 640, y: 224 }, { x: 640, y: 576 },
                        { x: 400, y: 680 }, { x: 160, y: 576 }, { x: 160, y: 224 }
                    ][i];
                    const p2 = [
                        { x: 640, y: 224 }, { x: 640, y: 576 }, { x: 400, y: 680 },
                        { x: 160, y: 576 }, { x: 160, y: 224 }, { x: 400, y: 120 }
                    ][i];
                    return (
                        <motion.line
                            key={`outer-${i}`}
                            x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                            className="mesh-line"
                            initial={{ pathLength: 0, opacity: 0 }}
                            whileInView={{ pathLength: 1, opacity: 0.3 }}
                            transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                        />
                    );
                })}
            </svg>

            {/* Central Hub */}
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 15 }}
                className="hub-core absolute z-20 w-[clamp(140px,25vw,220px)] aspect-square rounded-full border border-[#ff4655]/50 flex flex-col items-center justify-center bg-radial-gradient"
                style={{ background: 'radial-gradient(circle, rgba(255, 70, 85, 0.2) 0%, rgba(15, 25, 35, 1) 70%)', boxShadow: '0 0 50px rgba(255, 70, 85, 0.2)' }}
            >
                <div className="text-[#ff4655] text-xs font-mono tracking-[0.3em] uppercase mb-1">Total Prize</div>
                <div className="font-teko text-5xl md:text-7xl text-white font-bold leading-none drop-shadow-glow">300K</div>
                <div className="text-white/30 text-[14px] font-mono uppercase mt-2">LKR Currency</div>
            </motion.div>

            {/* Nodes */}
            {[
                { label: 'Live Event', val: `${days}d ${hours}h`, sub: 'July 17, 2026', pos: 'top-[15%] left-[50%]', color: 'text-[#ff4655]' },
                { label: 'Phase 01', val: 'QUALIFIERS', sub: 'Swiss Online', pos: 'top-[28%] left-[80%]' },
                { label: 'Phase 02', val: 'GROUPS', sub: 'LAN Studio', pos: 'top-[72%] left-[80%]' },
                { label: 'Phase 03', val: 'FINALS', sub: 'Grand Stage', pos: 'top-[85%] left-[50%]', color: 'text-[#ff4655]', border: 'border-[#ff4655]/80' },
                { label: 'System', val: 'DBL ELIM', sub: 'Competitive', pos: 'top-[72%] left-[20%]' },
                { label: 'Region', val: 'SRI LANKA', sub: 'National', pos: 'top-[28%] left-[20%]' },
            ].map((node, i) => (
                <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className={`mesh-node absolute -translate-x-1/2 -translate-y-1/2 z-10 w-[clamp(100px,18vw,140px)] p-2 bg-[#0f1923]/90 border ${node.border || 'border-white/20'} text-center interactive-element ${node.pos}`}
                >
                    <div className={`text-[11px] uppercase tracking-widest mb-1 ${node.color || 'text-white/50'}`}>{node.label}</div>
                    <div className="font-teko text-xl md:text-2xl leading-none">{node.val}</div>
                    <div className="text-[11px] opacity-60 mt-1 font-mono">{node.sub}</div>
                </motion.div>
            ))}
        </div>
    );
};

export default TournamentMesh;
