import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAudio } from '../hooks/useAudio';

interface NavbarProps {
    onRegister: () => void;
    onNavigate?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onRegister, onNavigate }) => {
    const { playHover, playClick } = useAudio();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const progressBarRef = useRef<HTMLDivElement>(null);

    // Scroll progress — direct DOM manipulation, no React state
    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
                    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                    const scrolled = (winScroll / height) * 100;
                    if (progressBarRef.current) {
                        progressBarRef.current.style.width = `${scrolled}%`;
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'CHALLENGE', link: '#countdown' },
        { name: 'SCHOOLS', link: '#schools' },
        { name: 'TIMELINE', link: '#timeline' },
        { name: 'REGISTER', link: '#register' }
    ];

    return (
        <>
            {/* Premium HUD Navigation */}
            <nav className="fixed top-0 left-0 w-full z-[900] px-4 py-3 md:px-8 md:py-4 pointer-events-none">
                <div className="max-w-[1400px] mx-auto relative pointer-events-auto">
                    {/* Glassmorphism backing for top nav */}
                    <div className="absolute inset-0 bg-[#0d121f]/40 backdrop-blur-md border-b border-white/5" />

                    {/* Stealth Progress Bar */}
                    <div
                        ref={progressBarRef}
                        className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-[#64c8ff] to-[#ff4655] transition-none z-10"
                        style={{ width: '0%', willChange: 'width' }}
                    />

                    <div className="relative px-4 py-3 flex justify-between items-center z-10">
                        {/* Logo Area */}
                        <div className="flex items-center gap-6">
                            <Link
                                to="/"
                                className="relative group cursor-pointer flex items-center"
                                onMouseEnter={() => playHover()}
                                onClick={() => {
                                    playClick();
                                    onNavigate?.();
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                            >
                                <span className="font-teko text-2xl md:text-3xl tracking-widest text-white font-bold leading-none group-hover:text-[#ff4655] transition-colors duration-300">
                                    ASCENT <span className="text-[#ff4655] group-hover:text-white transition-colors duration-300">//</span> 2026
                                </span>
                            </Link>
                        </div>

                        {/* Right Actions: Register Button + Hamburger Menu */}
                        <div className="flex items-center gap-4 md:gap-8">
                            {/* Register Button (Desktop & Mobile) */}
                            <Link
                                to="/register"
                                onMouseEnter={() => playHover()}
                                onClick={() => playClick()}
                                className="group cursor-pointer"
                            >
                                <div className="relative overflow-hidden bg-[#ff4655] text-white px-5 md:px-8 py-1.5 md:py-2 font-bold font-teko text-lg md:text-xl tracking-wider rounded-sm transition-all duration-300 hover:bg-white hover:text-[#0a1016]">
                                    <div className="relative z-10">REGISTER</div>
                                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 skew-x-12" />
                                </div>
                            </Link>

                            {/* Innovative Tactical Hamburger Toggle */}
                            <button
                                onClick={() => {
                                    playClick();
                                    setIsMenuOpen(true);
                                }}
                                onMouseEnter={() => playHover()}
                                className="group w-12 h-12 flex flex-col items-end justify-center gap-2 focus:outline-none relative z-[110] transition-transform"
                            >
                                <motion.span
                                    className="w-8 h-[2px] bg-white group-hover:bg-[#ff4655] transition-colors"
                                />
                                <motion.span
                                    className="w-5 h-[2px] bg-[#ff4655] group-hover:bg-white group-hover:w-8 transition-all"
                                />
                                <motion.span
                                    className="w-8 h-[2px] bg-white group-hover:bg-[#ff4655] transition-colors"
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Sidebar Overlay System */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Backdrop Blur covering the rest of the site */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 z-[998] bg-[#040814]/40 backdrop-blur-sm"
                        />

                        {/* Sliding Sidebar Panel */}
                        <motion.div
                            initial={{ x: '100%', skewX: -5 }}
                            animate={{ x: 0, skewX: 0 }}
                            exit={{ x: '100%', skewX: 5 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 180 }}
                            className="fixed top-0 right-0 h-screen w-full md:w-[450px] lg:w-[500px] z-[999] bg-[#0d121f]/95 backdrop-blur-2xl border-l border-white/5 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
                        >
                            {/* Futuristic Tech Accents */}
                            <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff4655] to-transparent opacity-50" />
                            <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-[#64c8ff] to-transparent opacity-50" />
                            <div className="absolute inset-0 bg-[url('/img/grid.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay" />

                            {/* Sidebar Header with Close Button */}
                            <div className="flex justify-between items-center p-6 md:p-8 border-b border-white/5 relative z-10">
                                <span className="font-mono text-xs text-white/40 tracking-[0.3em] uppercase">Navigation_Sys // Online</span>
                                <button 
                                    onClick={() => {
                                        playClick();
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-12 h-12 flex flex-col items-center justify-center group"
                                >
                                    <span className="w-8 h-[2px] bg-white group-hover:bg-[#ff4655] rotate-45 translate-y-[2px] transition-colors" />
                                    <span className="w-8 h-[2px] bg-white group-hover:bg-[#ff4655] -rotate-45 -translate-y-[0px] transition-colors" />
                                </button>
                            </div>

                            {/* Navigation Links */}
                            <div className="flex-1 flex flex-col justify-center px-8 md:px-12 relative z-10 gap-2">
                                {navLinks.map((item, i) => (
                                    <motion.button
                                        key={item.name}
                                        initial={{ opacity: 0, x: 40 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 + (i * 0.1), type: 'spring', stiffness: 100 }}
                                        onMouseEnter={() => playHover()}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            playClick();
                                            setIsMenuOpen(false);
                                            onNavigate?.(); 

                                            setTimeout(() => {
                                                const targetId = item.link.replace('#', '');
                                                const element = document.getElementById(targetId);
                                                if (element) {
                                                    const headerOffset = 80; 
                                                    const elementPosition = element.getBoundingClientRect().top;
                                                    const offsetPosition = elementPosition + window.scrollY - headerOffset;

                                                    window.scrollTo({
                                                        top: offsetPosition,
                                                        behavior: "smooth"
                                                    });
                                                }
                                            }, 300);
                                        }}
                                        className="group relative flex items-center justify-between py-4 outline-none w-full border-b border-white/5 last:border-transparent"
                                    >
                                        <div className="flex items-center gap-6">
                                            <span className="text-sm font-mono text-[#ff4655] opacity-50 group-hover:opacity-100 transition-opacity">
                                                0{i + 1}
                                            </span>
                                            <span className="font-teko text-5xl md:text-6xl font-bold text-white/60 group-hover:text-white uppercase tracking-wider transition-colors drop-shadow-lg">
                                                {item.name}
                                            </span>
                                        </div>
                                        <motion.div 
                                            className="w-0 h-[2px] bg-[#ff4655] group-hover:w-12 transition-all duration-300"
                                        />
                                    </motion.button>
                                ))}
                            </div>

                            {/* Sidebar Footer with Socials */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="p-8 md:p-12 border-t border-white/5 relative z-10 bg-black/20"
                            >
                                <p className="font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase mb-6 text-center">
                                    Connect to Database
                                </p>
                                <div className="flex justify-center gap-6">
                                    <a
                                        href="https://www.instagram.com/ethosalumniassociation/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-12 h-12 flex items-center justify-center opacity-40 hover:opacity-100 hover:text-[#ff4655] hover:-translate-y-1 transition-all"
                                    >
                                        <Instagram className="w-5 h-5" />
                                    </a>
                                    {['Club', 'Valorant', 'Event'].map((item, i) => (
                                        <div 
                                            key={i} 
                                            className="w-12 h-12 flex items-center justify-center opacity-40 hover:opacity-100 hover:-translate-y-1 transition-all cursor-pointer"
                                        >
                                            <img 
                                                src={`img/${item === 'Event' ? 'ASCENT2026' : item === 'Club' ? 'SVG' : 'Valorant'}.svg`} 
                                                className="w-5 h-5 brightness-150" 
                                                alt={item} 
                                            />
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
