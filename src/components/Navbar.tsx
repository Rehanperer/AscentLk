import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
    onRegister: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onRegister }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrollPercent, setScrollPercent] = useState(0);

    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
                    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                    const scrolled = (winScroll / height) * 100;
                    setScrollPercent(scrolled);
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'CHALLENGE', link: '#countdown' },
        { name: 'SCHOOLS', link: '#schools' },
        { name: 'TIMELINE', link: '#timeline' },
        { name: 'PARTNERS', link: '#partners' }
    ];

    return (
        <>
            {/* Premium HUD Navigation */}
            <nav className="fixed top-0 left-0 w-full z-[999] px-4 py-3 md:px-8 md:py-4 pointer-events-none">
                <div className="max-w-7xl mx-auto relative pointer-events-auto">
                    {/* Mobile optimized blur (reduced intensity) */}
                    <div className="absolute inset-0 bg-[#0a1016]/80 backdrop-blur-md md:backdrop-blur-xl border border-white/5 shadow-2xl rounded-sm" />

                    {/* Stealth Progress Bar */}
                    <div className="absolute top-0 left-0 h-[1px] bg-[#ff4655]/60 transition-all duration-100 ease-out" style={{ width: `${scrollPercent}%` }} />

                    <div className="relative px-4 py-2 flex justify-between items-center">
                        {/* Logo Area */}
                        <div className="flex items-center gap-6">
                            <div className="relative group cursor-pointer flex items-center" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                                <span className="font-teko text-2xl md:text-3xl tracking-widest text-white font-bold leading-none group-hover:text-[#ff4655] transition-colors duration-300">
                                    ASCENT <span className="text-[#ff4655] group-hover:text-white transition-colors duration-300">//</span> 2026
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 md:gap-8">
                            {/* Desktop Social Icons */}
                            <div className="hidden md:flex gap-1">
                                {['Club', 'Valorant', 'Event'].map((item, i) => (
                                    <div key={i} className="w-10 h-10 flex items-center justify-center opacity-40 hover:opacity-100 hover:bg-white/5 transition-all cursor-pointer rounded-sm group relative">
                                        <img
                                            src={`img/${item === 'Event' ? 'ASCENT2026' : item === 'Club' ? 'SVG' : 'Valorant'}.svg`}
                                            className="w-4 h-4 object-contain brightness-150 group-hover:scale-110 transition-transform"
                                            alt={item}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Register Button (Desktop) */}
                            <div onClick={onRegister} className="hidden md:block group cursor-pointer">
                                <div className="relative overflow-hidden bg-[#ff4655] text-white px-8 py-2 font-bold font-teko text-xl tracking-wider rounded-sm transition-all duration-300 hover:bg-white hover:text-[#0a1016]">
                                    <div className="relative z-10">REGISTER NOW</div>
                                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 skew-x-12" />
                                </div>
                            </div>

                            {/* Mobile Register Button (New) */}
                            <div onClick={onRegister} className="md:hidden group cursor-pointer mr-2">
                                <div className="relative overflow-hidden bg-[#ff4655] text-white px-4 py-1.5 font-bold font-teko text-lg tracking-wider rounded-sm active:scale-95 transition-transform">
                                    REGISTER
                                </div>
                            </div>

                            {/* Mobile Toggle - Enhanced Tap Target */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden w-12 h-12 flex flex-col items-center justify-center gap-1.5 focus:outline-none relative z-[110] active:scale-95 transition-transform"
                            >
                                <motion.span
                                    animate={isMobileMenuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                                    className="w-6 h-[2px] bg-white rounded-full"
                                />
                                <motion.span
                                    animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                                    className="w-4 h-[2px] bg-[#ff4655] rounded-full self-end mx-2"
                                />
                                <motion.span
                                    animate={isMobileMenuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                                    className="w-6 h-[2px] bg-white rounded-full"
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay - Portal Behavior */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-[1000] bg-[#0a1016] md:hidden overflow-hidden"
                    >
                        {/* Force Close Button in Overlay */}
                        <div className="absolute top-4 right-4 z-[1010] p-4" onClick={() => setIsMobileMenuOpen(false)}>
                            <div className="w-10 h-10 flex flex-col items-center justify-center">
                                <span className="w-6 h-[2px] bg-white rotate-45 translate-y-[1px]" />
                                <span className="w-6 h-[2px] bg-white -rotate-45 -translate-y-[1px]" />
                            </div>
                        </div>

                        {/* Background VFX */}
                        <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
                        <div className="absolute -top-[20%] -right-[20%] w-full h-full bg-[#ff4655]/5 blur-[100px] rounded-full" />

                        <div className="h-full flex flex-col p-8 pt-32 overflow-y-auto">
                            <div className="flex flex-col gap-8">
                                {navLinks.map((item, i) => (
                                    <motion.button
                                        key={item.name}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 + (i * 0.1) }}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setIsMobileMenuOpen(false);
                                            // Robust scroll logic
                                            const targetId = item.link.replace('#', '');
                                            const element = document.getElementById(targetId);
                                            if (element) {
                                                setTimeout(() => {
                                                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                }, 100);
                                            }
                                        }}
                                        className="font-teko text-5xl font-bold text-white/40 hover:text-white transition-colors flex items-center gap-4 group active:text-white cursor-pointer w-full text-left bg-transparent border-none p-0 outline-none"
                                    >
                                        <span className="text-xl font-mono text-[#ff4655] group-hover:translate-x-2 transition-transform">0{i + 1}</span>
                                        {item.name}
                                    </motion.button>
                                ))}
                            </div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="mt-auto border-t border-white/5 pt-8 mb-8"
                            >
                                <button
                                    onClick={() => {
                                        onRegister();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="w-full bg-[#ff4655] text-white py-4 font-bold font-teko text-2xl tracking-widest rounded-sm active:scale-95 transition-transform"
                                >
                                    REGISTER NOW
                                </button>
                                <div className="mt-8 flex justify-center gap-8">
                                    {['Club', 'Valorant', 'Event'].map((item, i) => (
                                        <div key={i} className="w-12 h-12 border border-white/5 flex items-center justify-center opacity-60">
                                            <img src={`img/${item === 'Event' ? 'ASCENT2026' : item === 'Club' ? 'SVG' : 'Valorant'}.svg`} className="w-5 h-5" alt={item} />
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
