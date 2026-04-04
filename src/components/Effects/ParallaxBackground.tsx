import React from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { devicePerf } from "../../hooks/useDevicePerformance";

interface ParallaxProps {
    text: string;
    velocity?: number;
    className?: string;
    direction?: 'vertical' | 'horizontal';
}

/**
 * ParallaxBackground — Optimized.
 * Mobile: Returns static text immediately, no hooks.
 * Desktop: Full parallax with scroll tracking.
 *
 * Split into two components because React hooks cannot be called conditionally.
 */
const ParallaxBackground: React.FC<ParallaxProps> = (props) => {
    // On mobile, render static text — no scroll tracking hooks at all
    if (devicePerf.isMobile) {
        return (
            <div className={`absolute inset-0 overflow-hidden pointer-events-none z-0 flex items-center justify-center ${props.className || ""}`}>
                <div className="whitespace-nowrap font-teko font-bold text-[15vw] leading-none text-white/5 select-none">
                    {props.text} {props.text} {props.text}
                </div>
            </div>
        );
    }

    return <ParallaxDesktop {...props} />;
};

/** Desktop-only component — safe to use hooks here */
const ParallaxDesktop: React.FC<ParallaxProps> = ({
    text,
    velocity = 50,
    className = "",
    direction = 'horizontal'
}) => {
    const { scrollYProgress } = useScroll();
    const smoothProgress = useSpring(scrollYProgress, { damping: 15, stiffness: 100 });
    const yRange = useTransform(smoothProgress, [0, 1], [0, velocity * 10]);
    const xRange = useTransform(smoothProgress, [0, 1], [0, velocity * 10]);

    const transformStyle = direction === 'vertical' ? { y: yRange } : { x: xRange };

    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none z-0 flex items-center justify-center ${className}`}>
            <motion.div
                style={transformStyle}
                className="whitespace-nowrap font-teko font-bold text-[15vw] leading-none text-white/5 select-none"
            >
                {text} {text} {text}
            </motion.div>
        </div>
    );
};

export default ParallaxBackground;
