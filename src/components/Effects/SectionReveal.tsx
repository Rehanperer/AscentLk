import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SectionRevealProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

const SectionReveal: React.FC<SectionRevealProps> = ({ children, className = "", delay = 0 }) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Bypass Framer Motion observers entirely on mobile to fix scroll lag
    if (isMobile) {
        return (
            <div className={`relative ${className}`}>
                <div>{children}</div>
            </div>
        );
    }

    return (
        <div className={`relative ${className}`}>
            {/* Tactical Corners - Hidden on Mobile for Performance */}
            <div className="hidden md:block absolute top-0 left-0 w-8 h-8 pointer-events-none">
                <motion.div
                    initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: delay }}
                    className="absolute top-0 left-0 w-full h-[2px] bg-[#ff4655] origin-left"
                />
                <motion.div
                    initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: delay }}
                    className="absolute top-0 left-0 h-full w-[2px] bg-[#ff4655] origin-top"
                />
            </div>
            <div className="hidden md:block absolute top-0 right-0 w-8 h-8 pointer-events-none">
                <motion.div
                    initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: delay }}
                    className="absolute top-0 right-0 w-full h-[2px] bg-[#ff4655] origin-right"
                />
                <motion.div
                    initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: delay }}
                    className="absolute top-0 right-0 h-full w-[2px] bg-[#ff4655] origin-top"
                />
            </div>
            <div className="hidden md:block absolute bottom-0 left-0 w-8 h-8 pointer-events-none">
                <motion.div
                    initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: delay }}
                    className="absolute bottom-0 left-0 w-full h-[2px] bg-[#ff4655] origin-left"
                />
                <motion.div
                    initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: delay }}
                    className="absolute bottom-0 left-0 h-full w-[2px] bg-[#ff4655] origin-bottom"
                />
            </div>
            <div className="hidden md:block absolute bottom-0 right-0 w-8 h-8 pointer-events-none">
                <motion.div
                    initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: delay }}
                    className="absolute bottom-0 right-0 w-full h-[2px] bg-[#ff4655] origin-right"
                />
                <motion.div
                    initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: delay }}
                    className="absolute bottom-0 right-0 h-full w-[2px] bg-[#ff4655] origin-bottom"
                />
            </div>

            {/* Content Reveal */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: delay + 0.2, ease: "easeOut" }}
            >
                {children}
            </motion.div>
        </div>
    );
};

export default SectionReveal;
