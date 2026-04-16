import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Instagram } from 'lucide-react';

const NAV_LINKS = [
    { label: 'About', href: '#about' },
    { label: 'Schools', href: '#schools' },
    { label: 'Path', href: '#path' },
    { label: 'Seasons', href: '#seasons' },
    { label: 'Partners', href: '#partners' },
];

const ModernNavbar: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    const scrollTo = useCallback((href: string) => {
        setMobileOpen(false);
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, []);

    return (
        <>
            <nav
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
                    scrolled
                        ? 'bg-[#0d121f]/80 backdrop-blur-xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
                        : 'bg-transparent border-b border-transparent'
                }`}
            >
                <div className="max-w-7xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
                    {/* Logo */}
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="flex items-center gap-3 group cursor-pointer"
                    >
                        <img
                            src="img/ASCENT2026.svg"
                            alt="Ascent 2026"
                            className="h-6 md:h-8 w-auto mix-blend-screen"
                        />
                    </button>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-1">
                        {NAV_LINKS.map((link) => (
                            <button
                                key={link.label}
                                onClick={() => scrollTo(link.href)}
                                className="relative px-4 py-2 text-[11px] font-mono tracking-[0.2em] uppercase text-white/50 hover:text-white transition-colors duration-300 group"
                            >
                                {link.label}
                                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-[#ff4655] group-hover:w-3/4 transition-all duration-300" />
                            </button>
                        ))}
                    </div>

                    {/* Desktop CTA & Social */}
                    <div className="hidden md:flex items-center gap-4">
                        <a
                            href="https://www.instagram.com/ascent.lk"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-white/50 hover:text-[#ff4655] hover:shadow-[0_0_15px_rgba(255,70,85,0.2)] transition-all duration-300"
                            aria-label="Instagram"
                        >
                            <Instagram size={18} strokeWidth={1.5} />
                        </a>
                        <button
                            onClick={() => navigate('/register')}
                            className="flex items-center gap-2 px-6 py-2.5 text-[11px] font-mono tracking-[0.25em] uppercase
                                bg-white/[0.04] backdrop-blur-md border border-white/10
                                text-white/80 hover:text-white hover:border-[#ff4655]/50 hover:bg-[#ff4655]/10 hover:shadow-[0_0_20px_rgba(255,70,85,0.15)]
                                transition-all duration-300 rounded-sm"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ff4655] animate-pulse" />
                            Register
                        </button>
                    </div>

                    {/* Mobile Hamburger */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden flex flex-col gap-1.5 w-7 group"
                        aria-label="Toggle menu"
                    >
                        <span className={`h-[1.5px] bg-white/70 transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-[4.5px] w-full' : 'w-full'}`} />
                        <span className={`h-[1.5px] bg-white/70 transition-all duration-300 ${mobileOpen ? 'opacity-0 w-0' : 'w-3/4'}`} />
                        <span className={`h-[1.5px] bg-white/70 transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[4.5px] w-full' : 'w-1/2'}`} />
                    </button>
                </div>
            </nav>

            {/* Mobile Fullscreen Overlay */}
            <div
                className={`fixed inset-0 z-40 transition-all duration-500 md:hidden ${
                    mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
            >
                <div className="absolute inset-0 bg-[#0d121f]/95 backdrop-blur-2xl" />
                <div className="relative z-10 flex flex-col items-center justify-center h-full gap-6">
                    {NAV_LINKS.map((link, i) => (
                        <button
                            key={link.label}
                            onClick={() => scrollTo(link.href)}
                            className="font-teko text-4xl font-bold tracking-[0.2em] uppercase text-white/70 hover:text-[#ff4655] transition-colors duration-300"
                            style={{
                                transitionDelay: mobileOpen ? `${i * 80}ms` : '0ms',
                                transform: mobileOpen ? 'translateY(0)' : 'translateY(20px)',
                                opacity: mobileOpen ? 1 : 0,
                                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                            }}
                        >
                            {link.label}
                        </button>
                    ))}

                    <div
                        className="mt-8 flex flex-col items-center gap-6"
                        style={{
                            transitionDelay: mobileOpen ? `${NAV_LINKS.length * 80}ms` : '0ms',
                            transform: mobileOpen ? 'translateY(0)' : 'translateY(20px)',
                            opacity: mobileOpen ? 1 : 0,
                            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                    >
                        <button
                            onClick={() => { setMobileOpen(false); navigate('/register'); }}
                            className="px-10 py-3.5 text-sm font-mono tracking-[0.3em] uppercase
                                bg-[#ff4655]/10 backdrop-blur-md border border-[#ff4655]/30
                                text-[#ff4655] hover:bg-[#ff4655] hover:text-white
                                transition-all duration-300 rounded-sm"
                        >
                            Register Now
                        </button>

                        <a
                            href="https://www.instagram.com/ascent.lk"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-6 py-2 text-white/40 hover:text-white transition-all duration-300 group"
                        >
                            <Instagram size={20} strokeWidth={1.5} className="group-hover:text-[#ff4655] transition-colors" />
                            <span className="font-mono text-[10px] tracking-[0.3em] uppercase underline-offset-4 group-hover:underline">Follow @ascent.lk</span>
                        </a>
                    </div>

                    {/* Mobile Decorative */}
                    <div className="absolute bottom-12 flex flex-col items-center gap-2">
                         <div className="font-mono text-[9px] tracking-[0.4em] text-white/10 uppercase">
                            ASCENT_NAV // V4.2
                         </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ModernNavbar;
