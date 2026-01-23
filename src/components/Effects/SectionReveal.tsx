import React from 'react';
import { motion } from 'framer-motion';

interface SectionRevealProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

const SectionReveal: React.FC<SectionRevealProps> = ({ children, className = "", delay = 0 }) => {
    return (
        <div className={`relative ${className}`}>
            {/* Tactical Corners */}
            <div className="absolute top-0 left-0 w-8 h-8 pointer-events-none">
                <motion.div
                    initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: delay }}
                    className="absolute top-0 left-0 w-full h-[2px] bg-[#ff4655] origin-left"
                />
                <motion.div
                    initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: delay }}
                    className="absolute top-0 left-0 h-full w-[2px] bg-[#ff4655] origin-top"
                />
            </div>
            <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none">
                <motion.div
                    initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: delay }}
                    className="absolute top-0 right-0 w-full h-[2px] bg-[#ff4655] origin-right"
                />
                <motion.div
                    initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: delay }}
                    className="absolute top-0 right-0 h-full w-[2px] bg-[#ff4655] origin-top"
                />
            </div>
            <div className="absolute bottom-0 left-0 w-8 h-8 pointer-events-none">
                <motion.div
                    initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: delay }}
                    className="absolute bottom-0 left-0 w-full h-[2px] bg-[#ff4655] origin-left"
                />
                <motion.div
                    initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: delay }}
                    className="absolute bottom-0 left-0 h-full w-[2px] bg-[#ff4655] origin-bottom"
                />
            </div>
            <div className="absolute bottom-0 right-0 w-8 h-8 pointer-events-none">
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
