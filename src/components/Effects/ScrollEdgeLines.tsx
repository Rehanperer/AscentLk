import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ScrollEdgeLines: React.FC = () => {
    const { scrollYProgress } = useScroll();

    // Lines grow from 0% to 100% height as user scrolls
    const lineHeight = useTransform(scrollYProgress, [0, 0.15, 1], ['0%', '100%', '100%']);
    const lineOpacity = useTransform(scrollYProgress, [0, 0.05, 0.15], [0, 0.6, 1]);

    return (
        <div className="fixed inset-0 z-40 pointer-events-none">
            {/* Left Edge Line */}
            <motion.div
                style={{ height: lineHeight, opacity: lineOpacity }}
                className="absolute top-0 left-0 w-[1px] md:w-[2px]"
            >
                <div className="w-full h-full bg-gradient-to-b from-[#ff4655] via-[#ff4655]/60 to-transparent" />
                {/* Glow effect */}
                <div className="absolute top-0 left-0 w-[6px] md:w-[10px] h-full -translate-x-1/2 bg-gradient-to-b from-[#ff4655]/40 via-[#ff4655]/20 to-transparent blur-[4px] md:blur-[6px]" />
            </motion.div>

            {/* Right Edge Line */}
            <motion.div
                style={{ height: lineHeight, opacity: lineOpacity }}
                className="absolute top-0 right-0 w-[1px] md:w-[2px]"
            >
                <div className="w-full h-full bg-gradient-to-b from-[#ff4655] via-[#ff4655]/60 to-transparent" />
                {/* Glow effect */}
                <div className="absolute top-0 right-0 w-[6px] md:w-[10px] h-full translate-x-1/2 bg-gradient-to-b from-[#ff4655]/40 via-[#ff4655]/20 to-transparent blur-[4px] md:blur-[6px]" />
            </motion.div>
        </div>
    );
};

export default ScrollEdgeLines;
