import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Instagram } from 'lucide-react';

const NAV_LINKS = [
    { label: 'About', href: '#about' },
    { label: 'Schools', href: '#schools' },
    { label: 'Path', href: '#path' },
    { label: 'Seasons', href: '#seasons' },
    { label: 'Register', href: '#register' },
];

const ModernNavbar: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', onScroll, { passive: true });
        
        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    const scrollTo = useCallback((href: string) => {
        setMobileOpen(false);
        if (href.startsWith('http')) {
            window.open(href, '_blank');
            return;
        }
        const el = document.querySelector(href);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        } else {
            navigate(`/${href}`);
        }
    }, [navigate]);

    return (
        <>
            {/* Premium HUD Navigation - Completely Floating Islands */}
            <nav
                className={`fixed top-0 left-0 w-full z-[900] pointer-events-none transition-all duration-500 pt-2 md:pt-4`}
            >
                <div className="relative max-w-[1400px] mx-auto px-4 py-3 md:px-8 md:py-4 flex justify-between items-center pointer-events-none">
                    
                    {/* Logo Area (Left Island) */}
                    <div className="relative pointer-events-auto flex items-center">
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="relative group cursor-pointer flex items-center z-10"
                        >
                            <img
                                src="img/ASCENT2026.svg"
                                alt="Ascent 2026"
                                className={`w-auto mix-blend-screen transition-all duration-500 ease-out ${scrolled ? 'h-5 md:h-6 opacity-100 drop-shadow-[0_0_15px_rgba(255,70,85,0.6)]' : 'h-6 md:h-8 opacity-90 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] group-hover:opacity-100 group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]'}`}
                            />
                        </button>
                    </div>

                    {/* Right Actions (Right Island) */}
                    <div className="relative pointer-events-auto flex items-center gap-4 md:gap-6 px-4 py-2 -mr-4 md:px-5 md:py-2 md:-mr-5">
                        {/* Glass Island Backdrop */}
                        <div className={`absolute inset-0 bg-[#040814]/60 backdrop-blur-md border border-white/10 rounded-full transition-all duration-500 ${scrolled ? 'opacity-100 shadow-[0_4px_30px_rgba(0,0,0,0.5)]' : 'opacity-0 scale-95 pointer-events-none'}`} />

                        {/* Instagram Button */}
                        <a
                            href="https://www.instagram.com/ascent_2026/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`group relative z-10 transition-opacity duration-300 cursor-pointer flex items-center justify-center pointer-events-auto ${mobileOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                        >
                            <div className="relative flex items-center justify-center w-10 h-10 border border-white/30 rounded-full transition-all duration-300 group-hover:border-[#ff4655] group-hover:bg-[#ff4655]/10 group-hover:shadow-[0_0_15px_rgba(255,70,85,0.3)]">
                                <Instagram className="w-4 h-4 text-white/80 group-hover:text-[#ff4655] transition-colors duration-300" />
                            </div>
                        </a>

                        {/* Open Button (Only visible when sidebar is closed) */}
                        <button
                            onClick={() => setMobileOpen(true)}
                            className={`group z-10 w-12 h-12 flex flex-col items-end justify-center gap-2.5 focus:outline-none relative transition-opacity duration-300 ${mobileOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                        >
                            <span className="w-8 h-[2px] bg-white transition-all duration-300 shadow-[0_0_10px_rgba(255,255,255,0.5)] group-hover:bg-[#ff4655] group-hover:shadow-[0_0_10px_rgba(255,70,85,0.8)]" />
                            <span className="w-5 h-[2px] bg-white transition-all duration-300 shadow-[0_0_10px_rgba(255,255,255,0.5)] group-hover:bg-[#ff4655] group-hover:w-8 group-hover:shadow-[0_0_10px_rgba(255,70,85,0.8)]" />
                            <span className="w-8 h-[2px] bg-[#ff4655] transition-all duration-300 shadow-[0_0_10px_rgba(255,70,85,0.8)] group-hover:bg-white group-hover:shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Cinematic Sidebar Overlay */}
            <div
                className={`fixed inset-0 z-[998] transition-all duration-700 ${
                    mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
            >
                {/* Heavy Backdrop Blur for Cinematic Depth */}
                <div 
                    className="absolute inset-0 bg-[#040814]/60 backdrop-blur-lg md:backdrop-blur-xl transition-opacity duration-700 will-change-opacity"
                    onClick={() => setMobileOpen(false)}
                />

                {/* Avant-Garde Sidebar Panel (Slanted on ALL screens now) */}
                <div
                    className="absolute top-0 right-0 h-screen w-[85vw] sm:w-[400px] md:w-[650px] lg:w-[750px] z-[999] flex flex-col overflow-hidden transition-transform duration-[800ms] transform-gpu will-change-transform"
                    style={{
                        transform: mobileOpen ? 'translate3d(0,0,0)' : 'translate3d(100%,0,0)',
                        transitionTimingFunction: 'cubic-bezier(0.76, 0, 0.24, 1)'
                    }}
                >
                    {/* The Glass Background with consistent clip path */}
                    <div 
                        className="absolute inset-0 bg-[#08080a]/90 backdrop-blur-2xl md:backdrop-blur-3xl shadow-[-20px_0_50px_rgba(0,0,0,0.5)] md:shadow-[-30px_0_100px_rgba(0,0,0,0.8)]"
                        style={{ clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)' }}
                    >
                        {/* Glowing Red Blade Edge */}
                        <div 
                            className="absolute top-0 left-[7.5%] bottom-0 w-[3px] md:w-[4px] bg-[#ff4655] shadow-[0_0_20px_#ff4655] md:shadow-[0_0_30px_#ff4655]" 
                            style={{ transform: 'skewX(-9deg)' }}
                        />
                        
                        {/* Noise Texture */}
                        <div className="absolute inset-0 bg-[url('/img/grid.svg')] opacity-[0.05] pointer-events-none mix-blend-overlay" />
                    </div>

                    {/* Dedicated Close Button (Always visible when open) */}
                    <button 
                        onClick={() => setMobileOpen(false)}
                        className="absolute top-4 right-4 md:top-6 md:right-8 w-12 h-12 flex flex-col items-center justify-center group z-[1000] focus:outline-none"
                    >
                        <span className="absolute w-6 h-[2px] md:w-8 bg-white group-hover:bg-[#ff4655] rotate-45 transition-all duration-500 shadow-[0_0_10px_rgba(255,255,255,0.5)] group-hover:shadow-[0_0_10px_rgba(255,70,85,0.8)] group-hover:rotate-[225deg]" />
                        <span className="absolute w-6 h-[2px] md:w-8 bg-white group-hover:bg-[#ff4655] -rotate-45 transition-all duration-500 shadow-[0_0_10px_rgba(255,255,255,0.5)] group-hover:shadow-[0_0_10px_rgba(255,70,85,0.8)] group-hover:-rotate-[225deg]" />
                    </button>

                    {/* Content Container (Scrollable for smaller screens) */}
                    <div className="relative z-10 w-full h-full flex flex-col pt-24 md:pt-32 pb-12 overflow-y-auto overflow-x-hidden scrollbar-hide">
                        
                        {/* Status Header (Top Left) */}
                        <div className="flex justify-between items-start pl-[28%] sm:pl-[20%] pr-6 md:pl-[20%] md:pr-12 mb-8 md:mb-12">
                            <div className="flex flex-col">
                                <span className="font-mono text-[9px] md:text-xs text-[#ff4655] tracking-[0.2em] md:tracking-[0.4em] uppercase font-bold animate-pulse">Live // Sys Online</span>
                                <span className="font-mono text-[7px] md:text-[9px] text-white/30 tracking-[0.1em] md:tracking-[0.2em] uppercase mt-1">Auth Level: Alpha</span>
                            </div>
                        </div>

                        {/* Massive Typography Navigation Links */}
                        <div className="flex-1 flex flex-col justify-center pl-[32%] sm:pl-[24%] md:pl-[20%] pr-4 md:pl-[20%] md:pr-12 gap-1 md:gap-2 my-auto">
                            {NAV_LINKS.map((link, i) => (
                                <button
                                    key={link.label}
                                    onClick={() => {
                                        scrollTo(link.href);
                                        setMobileOpen(false); // Close sidebar after navigation
                                    }}
                                    className="group relative text-left outline-none w-full cursor-pointer flex items-center h-[3.5rem] md:h-[5rem] lg:h-[7rem] transform-gpu will-change-transform"
                                    style={{
                                        transitionDelay: mobileOpen ? `${i * 80 + 200}ms` : '0ms',
                                        transform: mobileOpen ? 'translate3d(0,0,0) rotateX(0)' : 'translate3d(60px,0,0) rotateX(-45deg)',
                                        opacity: mobileOpen ? 1 : 0,
                                        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                                    }}
                                >
                                    {/* HUD Target Crosshair (Desktop Only) */}
                                    <div className="absolute -left-12 w-6 h-6 border border-[#ff4655] opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300 hidden md:block rounded-full">
                                        <div className="absolute inset-1/2 w-1 h-1 bg-[#ff4655] -translate-x-1/2 -translate-y-1/2 rounded-full" />
                                    </div>

                                    {/* Index Number (Visible on mobile by default) */}
                                    <span className="font-mono text-[9px] md:text-[10px] text-[#ff4655] opacity-80 md:opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity absolute -left-6 sm:-left-10 md:-left-14 md:-rotate-90">
                                        0{i + 1}
                                    </span>

                                    {/* Mobile: Brighter Hollow Text */}
                                    <span 
                                        className="md:hidden font-teko text-[3rem] sm:text-[3.5rem] font-bold uppercase leading-none tracking-tighter text-transparent relative z-10"
                                        style={{ WebkitTextStroke: '1px rgba(255,255,255,0.6)' }}
                                    >
                                        {link.label}
                                    </span>

                                    {/* Desktop: Dimmer Hollow Text */}
                                    <span 
                                        className="hidden md:block font-teko text-[5rem] lg:text-[7rem] font-bold uppercase leading-none tracking-tighter text-transparent transition-all duration-300 relative z-10 group-active:scale-95"
                                        style={{ WebkitTextStroke: '2px rgba(255,255,255,0.15)' }}
                                    >
                                        {link.label}
                                    </span>

                                    {/* Solid Text Overlay on Hover / Touch Active */}
                                    <span 
                                        className="absolute left-0 font-teko text-[3rem] sm:text-[3.5rem] md:text-[5rem] lg:text-[7rem] font-bold uppercase leading-none tracking-tighter text-white opacity-0 group-hover:opacity-100 group-active:opacity-100 md:group-active:scale-95 transition-all duration-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] z-20 pointer-events-none"
                                    >
                                        {link.label}
                                    </span>

                                    {/* Mobile Default Accent Line */}
                                    <div className="md:hidden absolute left-0 bottom-1 w-4 h-[2px] bg-[#ff4655]/60 group-hover:opacity-0 group-active:opacity-0 transition-opacity duration-300" />

                                    {/* Clean Underline Slash (Shoots across on hover/tap) */}
                                    <div className="absolute left-0 bottom-1 md:bottom-3 lg:bottom-6 w-0 h-[2px] md:h-[3px] bg-[#ff4655] group-hover:w-full group-active:w-full transition-all duration-500 ease-out z-30 shadow-[0_0_10px_#ff4655]" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ModernNavbar;
