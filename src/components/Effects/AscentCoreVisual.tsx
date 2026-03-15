import React, { useEffect, useRef } from 'react';
// @ts-ignore
import anime from 'animejs';

const AscentCoreVisual: React.FC = () => {
    const visualRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!visualRef.current) return;

        // Reset any existing animations
        anime.remove('.core-ring');
        anime.remove('.core-dash');
        anime.remove('.core-logo');

        const timeline = anime.timeline({
            easing: 'easeInOutQuad',
            loop: true
        });

        // 1. Logo Path Drawing
        timeline.add({
            targets: '.core-logo',
            strokeDashoffset: [anime.setDashoffset, 0],
            opacity: [0, 1],
            duration: 2000,
            delay: anime.stagger(200)
        });

        // 2. Rotating Rings
        anime({
            targets: '.ring-outer',
            rotate: '1turn',
            duration: 10000,
            easing: 'linear',
            loop: true
        });

        anime({
            targets: '.ring-inner',
            rotate: '-1turn',
            duration: 15000,
            easing: 'linear',
            loop: true
        });

        // 3. Pulsing Glow
        anime({
            targets: '.core-glow',
            scale: [0.95, 1.05],
            opacity: [0.3, 0.6],
            duration: 3000,
            direction: 'alternate',
            easing: 'easeInOutSine',
            loop: true
        });

        // 4. Dash Pulses
        anime({
            targets: '.core-dash',
            opacity: [0.1, 0.8],
            scaleY: [1, 1.5],
            delay: anime.stagger(100),
            duration: 1000,
            direction: 'alternate',
            easing: 'easeInOutQuad',
            loop: true
        });

    }, []);

    return (
        <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-[#ff4655]/5 rounded-full blur-[60px] core-glow" />

            <svg
                ref={visualRef}
                viewBox="0 0 200 200"
                className="w-full h-full relative z-10"
            >
                {/* Outer Dashed Ring */}
                <circle
                    cx="100" cy="100" r="90"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="0.5"
                    strokeDasharray="4 8"
                    className="ring-outer"
                />

                {/* Tactical Dashes */}
                {Array.from({ length: 12 }).map((_, i) => (
                    <rect
                        key={i}
                        x="99.5" y="5"
                        width="1" height="8"
                        fill="#ff4655"
                        className="core-dash"
                        style={{
                            transformOrigin: '100px 100px',
                            transform: `rotate(${i * 30}deg)`
                        }}
                    />
                ))}

                {/* Inner Complex Ring */}
                <path
                    d="M 100,25 A 75,75 0 0,1 175,100 M 100,175 A 75,75 0 0,1 25,100"
                    fill="none"
                    stroke="#ff4655"
                    strokeWidth="1"
                    strokeLinecap="round"
                    className="ring-inner opacity-40"
                />

                {/* Stylized "A" Logo (Ascent) */}
                <g className="core-logo-group">
                    {/* Left diagonal */}
                    <path
                        d="M 70,140 L 100,60"
                        fill="none"
                        stroke="white"
                        strokeWidth="4"
                        strokeLinecap="square"
                        className="core-logo"
                    />
                    {/* Right diagonal */}
                    <path
                        d="M 100,60 L 130,140"
                        fill="none"
                        stroke="white"
                        strokeWidth="4"
                        strokeLinecap="square"
                        className="core-logo"
                    />
                    {/* Crossbar (Tactical gap) */}
                    <path
                        d="M 85,110 L 115,110"
                        fill="none"
                        stroke="#ff4655"
                        strokeWidth="2"
                        className="core-logo"
                    />
                    {/* Top Dot */}
                    <circle cx="100" cy="50" r="2" fill="#ff4655" className="core-logo" />
                </g>

                {/* Scanning sweep */}
                <circle
                    cx="100" cy="100" r="75"
                    fill="none"
                    stroke="rgba(255,70,85,0.05)"
                    strokeWidth="15"
                />
            </svg>

            {/* Floating Metadata */}
            <div className="absolute top-0 right-0 font-mono text-[8px] text-white/30 tracking-tighter text-right">
                CORE_LOCK//STABLE<br />
                GEN_SYNC//99.2%
            </div>
            <div className="absolute bottom-0 left-0 font-mono text-[8px] text-white/30 tracking-tighter">
                VOLTAGE_LEVEL//MAX<br />
                AUTH_KEY//0x7F4A
            </div>
        </div>
    );
};

export default AscentCoreVisual;
