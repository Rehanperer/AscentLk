import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
// @ts-ignore
import anime from 'animejs';

const AscentRegisterButton: React.FC = () => {
    const buttonRef = useRef<HTMLAnchorElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (!buttonRef.current || !textRef.current) return;

        // 1. Initial State: Hide text and reset paths
        const text = "REGISTER_NOW";
        textRef.current.innerHTML = text.split('').map(char =>
            `<span class="letter opacity-0 inline-block">${char}</span>`
        ).join('');

        const timeline = anime.timeline({
            easing: 'easeOutExpo',
            loop: false
        });

        // 2. Play drawing animation for SVG border
        timeline.add({
            targets: '.btn-border-path',
            strokeDashoffset: [anime.setDashoffset, 0],
            duration: 1500,
            opacity: [0, 1]
        }, 0);

        // 3. Play writing text animation
        timeline.add({
            targets: '.letter',
            opacity: [0, 1],
            translateY: [10, 0],
            translateZ: 0,
            duration: 800,
            delay: anime.stagger(50),
            easing: 'easeOutExpo'
        }, 500);

        // 4. Hover animations
        const handleMouseEnter = () => {
            anime({
                targets: buttonRef.current,
                scale: 1.02,
                duration: 400,
                easing: 'easeOutElastic(1, .8)'
            });
            anime({
                targets: '.btn-border-path',
                strokeWidth: [1, 2],
                stroke: '#ffffff',
                duration: 400,
                easing: 'easeOutQuad'
            });
            anime({
                targets: '.btn-fill',
                opacity: [0, 1],
                duration: 400,
                easing: 'easeOutQuad'
            });
        };

        const handleMouseLeave = () => {
            anime({
                targets: buttonRef.current,
                scale: 1,
                duration: 400,
                easing: 'easeOutQuad'
            });
            anime({
                targets: '.btn-border-path',
                strokeWidth: [2, 1],
                stroke: '#ff4655',
                duration: 400,
                easing: 'easeOutQuad'
            });
            anime({
                targets: '.btn-fill',
                opacity: [1, 0],
                duration: 400,
                easing: 'easeOutQuad'
            });
        };

        buttonRef.current.addEventListener('mouseenter', handleMouseEnter);
        buttonRef.current.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            if (buttonRef.current) {
                buttonRef.current.removeEventListener('mouseenter', handleMouseEnter);
                buttonRef.current.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, []);

    return (
        <Link
            to="/register"
            ref={buttonRef}
            className="relative group inline-flex items-center justify-center px-8 md:px-12 py-3 md:py-4 bg-transparent transition-all duration-300 overflow-hidden"
        >
            {/* SVG Border Drawing Layer */}
            <svg
                className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
                viewBox="0 0 200 60"
                preserveAspectRatio="none"
            >
                {/* Background Fill (Matches path exactly) */}
                <path
                    d="M 20,2 L 198,2 L 198,40 L 178,58 L 2,58 L 2,20 Z"
                    className="btn-fill fill-[#ff4655] opacity-0"
                />

                {/* Tactical Border Path */}
                <path
                    d="M 20,2 L 198,2 L 198,40 L 178,58 L 2,58 L 2,20 Z"
                    fill="none"
                    stroke="#ff4655"
                    strokeWidth="1"
                    className="btn-border-path"
                />

                {/* Accent Corner Line */}
                <line x1="185" y1="2" x2="198" y2="15" stroke="white" strokeWidth="1" className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </svg>

            <span
                ref={textRef}
                className="relative z-10 font-teko text-xl md:text-3xl tracking-[0.2em] text-[#ff4655] group-hover:text-white transition-colors duration-300 font-bold uppercase whitespace-nowrap"
            >
                REGISTER_NOW
            </span>

            {/* Tactical Glitch Decor */}
            <div className="absolute top-0 right-4 w-1.5 h-1.5 bg-white opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
            <div className="absolute bottom-0 left-4 w-1.5 h-1.5 bg-[#ff4655] opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
    );
};

export default AscentRegisterButton;
