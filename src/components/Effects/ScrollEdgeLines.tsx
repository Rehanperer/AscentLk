import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { devicePerf } from '../../hooks/useDevicePerformance';

/**
 * ScrollEdgeLines — Optimized.
 * Skips rendering entirely on mobile (1px lines are barely visible
 * and not worth the continuous scroll tracking overhead).
 */
const ScrollEdgeLines: React.FC = React.memo(() => {
    // Skip on mobile — the visual impact is negligible for the perf cost
    if (devicePerf.isMobile) return null;

    return <ScrollEdgeLinesDesktop />;
});

const ScrollEdgeLinesDesktop: React.FC = () => {
    const { scrollYProgress } = useScroll();

    // Lines grow from 0% to 100% height as user scrolls. Using scaleY for better GPU performance.
    const lineScaleY = useTransform(scrollYProgress, [0, 0.15, 1], [0, 1, 1]);
    const lineOpacity = useTransform(scrollYProgress, [0, 0.05, 0.15], [0, 0.6, 1]);

    return (
        <div className="fixed inset-0 z-40 pointer-events-none">
            {/* Left Edge Line */}
            <motion.div
                style={{ scaleY: lineScaleY, opacity: lineOpacity, transformOrigin: 'top' }}
                className="absolute top-0 left-0 w-[2px] h-full"
            >
                <div className="w-full h-full bg-gradient-to-b from-[#ff4655] via-[#ff4655]/60 to-transparent" />
                {/* Glow effect */}
                <div className="absolute top-0 left-0 w-[10px] h-full -translate-x-1/2 bg-gradient-to-b from-[#ff4655]/40 via-[#ff4655]/20 to-transparent blur-[6px]" />
            </motion.div>

            {/* Right Edge Line */}
            <motion.div
                style={{ scaleY: lineScaleY, opacity: lineOpacity, transformOrigin: 'top' }}
                className="absolute top-0 right-0 w-[2px] h-full"
            >
                <div className="w-full h-full bg-gradient-to-b from-[#ff4655] via-[#ff4655]/60 to-transparent" />
                {/* Glow effect */}
                <div className="absolute top-0 right-0 w-[10px] h-full translate-x-1/2 bg-gradient-to-b from-[#ff4655]/40 via-[#ff4655]/20 to-transparent blur-[6px]" />
            </motion.div>
        </div>
    );
};

export default ScrollEdgeLines;
