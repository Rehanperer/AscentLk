import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen: React.FC = () => {
    return (
        <motion.div
            className="fixed inset-0 z-[9999] bg-[#0a1016] flex flex-col items-center justify-center pointer-events-none"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
            <div className="relative">
                {/* Center Logo Pulse */}
                <motion.div
                    className="w-16 h-16 md:w-24 md:h-24 bg-[#ff4655]"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{
                        scale: [0.8, 1.1, 1],
                        opacity: [0, 1, 1],
                        rotate: [0, 45, 0]
                    }}
                    transition={{
                        duration: 1.2,
                        ease: "easeOut",
                        times: [0, 0.6, 1]
                    }}
                />

                {/* Decorative Brackets */}
                <motion.div
                    className="absolute -inset-4 md:-inset-6 border border-white/10"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                />
            </div>

            <div className="mt-8 md:mt-12 w-48 md:w-64">
                <div className="flex justify-between text-[10px] md:text-xs font-mono text-white/40 mb-2 uppercase tracking-widest">
                    <span>LOADING</span>
                </div>

                {/* Progress Bar */}
                <div className="h-[2px] w-full bg-white/10 overflow-hidden relative">
                    <motion.div
                        className="absolute top-0 left-0 h-full bg-[#ff4655]"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    />
                </div>

                <div className="flex justify-between mt-2 text-[9px] text-[#ff4655] font-mono tracking-wider opacity-80">
                    <span>LOADING ASSETS</span>
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                    >
                        100%
                    </motion.span>
                </div>
            </div>
        </motion.div>
    );
};

export default LoadingScreen;
