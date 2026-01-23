import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface ParallaxProps {
    text: string;
    velocity?: number; // Speed and direction (negative for up/left)
    className?: string;
    direction?: 'vertical' | 'horizontal';
}

const ParallaxBackground: React.FC<ParallaxProps> = ({
    text,
    velocity = 50,
    className = "",
    direction = 'horizontal'
}) => {
    const { scrollYProgress } = useScroll();

    // Create a smooth scroll effect
    const smoothProgress = useSpring(scrollYProgress, {
        damping: 15,
        stiffness: 100
    });

    // Map scroll (0-1) to transform range
    // e.g. move from -100px to 100px based on velocity
    const yRange = useTransform(smoothProgress, [0, 1], [0, velocity * 10]);
    const xRange = useTransform(smoothProgress, [0, 1], [0, velocity * 10]);

    const transformStyle = direction === 'vertical' ? { y: yRange } : { x: xRange };

    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none z-0 flex items-center justify-center ${className}`}>
            <motion.div
                style={transformStyle}
                className="whitespace-nowrap font-teko font-bold text-[15vw] leading-none text-white/5 select-none"
            >
                {text} {text} {text} {/* Repeat for marquee effect if needed */}
            </motion.div>
        </div>
    );
};

export default ParallaxBackground;
