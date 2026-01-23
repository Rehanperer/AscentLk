import React from 'react';
import { motion } from 'framer-motion';

interface ComingSoonProps {
    onNotifyClick?: () => void;
}

const ComingSoonSection: React.FC<ComingSoonProps> = ({ onNotifyClick }) => {
    return (
        <section className="section py-24 relative overflow-hidden" id="coming-soon">
            <div className="w-full h-full px-4 md:px-8 flex flex-col justify-center items-center relative z-10">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none"></div>

                <div className="text-center max-w-4xl mx-auto relative z-10">
                    <h2
                        className="font-teko text-6xl md:text-8xl font-bold uppercase leading-none mb-6 text-white glitch relative"
                        data-text="COMING SOON"
                    >
                        COMING SOON
                    </h2>

                    <p className="font-mono text-lg md:text-2xl text-[#ff4655] tracking-widest uppercase mb-8 border-y border-[#ff4655]/30 py-4">
                        Wishlist and Preorder Tickets Later
                    </p>

                    <button
                        className="px-10 py-3 bg-white/5 border border-white/20 text-white font-teko text-xl hover:bg-[#ff4655] hover:text-black transition-all duration-300 angled-btn group cursor-pointer interactive-element"
                        onClick={onNotifyClick}
                    >
                        NOTIFY ME
                    </button>

                    {/* Decorative Elements */}
                    <motion.div
                        className="flex justify-center gap-1 mt-12"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className={`h-2 w-4 transform -skew-x-12 ${i === 2 ? 'bg-[#ff4655]' : 'bg-white/20'}`}></div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ComingSoonSection;
