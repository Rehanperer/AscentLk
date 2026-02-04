import React, { useState, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollExpandMedia from './components/Hero/ScrollExpandMedia';
import CustomCursor from './components/CustomCursor';
import ScrambleText from './components/ScrambleText';
import CountdownSection from './components/CountdownSection';
import ComingSoonSection from './components/ComingSoonSection';
import SectionReveal from './components/Effects/SectionReveal';
import ParallaxBackground from './components/Effects/ParallaxBackground';
import SeasonsSection from './components/SeasonsSection';
import SchoolsCarousel from './components/Schools/SchoolsCarousel';

// Lazy Load Heavy Components
import LoadingScreen from './components/LoadingScreen';

// Lazy Load Modal Components (Keep these lazy as they aren't needed on first render)
const Timeline = lazy(() => import('./components/Tournament/Timeline'));
const PartnerSection = lazy(() => import('./components/PartnerSection'));
const RegistrationModal = lazy(() => import('./components/RegistrationModal'));
const SponsorModal = lazy(() => import('./components/SponsorModal'));


const App: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
    const [ticketModalTitle, setTicketModalTitle] = useState('');
    const [isSponsorModalOpen, setIsSponsorModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrollPercent, setScrollPercent] = useState(0);

    // Simulation finished - Instant load for premium feel
    React.useEffect(() => {
        setIsLoading(false);
        const handleScroll = () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            setScrollPercent(scrolled);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const openTicketModal = (title: string) => {
        setTicketModalTitle(title);
        setIsTicketModalOpen(true);
        setIsMobileMenuOpen(false);
    };

    return (
        <div className="relative min-h-screen bg-[#0a1016]">
            <AnimatePresence>
                {isLoading && <LoadingScreen key="loader" />}
            </AnimatePresence>
            <CustomCursor />

            {/* Premium HUD Navigation */}
            <nav className="fixed top-0 left-0 w-full z-[100] px-4 py-3 md:px-8 md:py-4">
                <div className="max-w-7xl mx-auto relative">
                    <div className="absolute inset-0 bg-[#0a1016]/60 backdrop-blur-2xl border border-white/5 shadow-2xl rounded-sm" />

                    {/* Stealth Progress Bar */}
                    <div className="absolute top-0 left-0 h-[1px] bg-[#ff4655]/40 transition-all duration-300" style={{ width: `${scrollPercent}%` }} />

                    <div className="relative px-4 py-2 flex justify-between items-center">
                        {/* Logo Area */}
                        <div className="flex items-center gap-6">
                            <div className="relative group cursor-pointer flex items-center">
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
                                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[#ff4655] text-white text-[8px] font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                            {item.toUpperCase()}_LINK
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Register Button */}
                            <div
                                onClick={() => openTicketModal('GENERAL REGISTRATION')}
                                className="hidden md:block group cursor-pointer"
                            >
                                <div className="relative overflow-hidden bg-[#ff4655] text-white px-8 py-2 font-bold font-teko text-xl tracking-wider rounded-sm transition-all duration-300 hover:bg-white hover:text-[#0a1016]">
                                    <div className="relative z-10">REGISTER NOW</div>
                                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 skew-x-12" />
                                </div>
                            </div>

                            {/* Mobile Toggle */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 focus:outline-none relative z-[110]"
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

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-[105] bg-[#0a1016] md:hidden"
                    >
                        {/* Background VFX */}
                        <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
                        <div className="absolute -top-[20%] -right-[20%] w-full h-full bg-[#ff4655]/5 blur-[120px] rounded-full" />

                        <div className="h-full flex flex-col p-8 pt-24">
                            <div className="flex flex-col gap-8">
                                {[
                                    { name: 'CHALLENGE', link: '#countdown' },
                                    { name: 'SCHOOLS', link: '#schools' },
                                    { name: 'TIMELINE', link: '#timeline' },
                                    { name: 'PARTNERS', link: '#partners' }
                                ].map((item, i) => (
                                    <motion.a
                                        key={item.name}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 + (i * 0.1) }}
                                        href={item.link}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="font-teko text-5xl font-bold text-white/40 hover:text-white transition-colors flex items-center gap-4 group"
                                    >
                                        <span className="text-xl font-mono text-[#ff4655] group-hover:translate-x-2 transition-transform">0{i + 1}</span>
                                        {item.name}
                                    </motion.a>
                                ))}
                            </div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="mt-auto border-t border-white/5 pt-8"
                            >
                                <button
                                    onClick={() => openTicketModal('GENERAL REGISTRATION')}
                                    className="w-full bg-[#ff4655] text-white py-4 font-bold font-teko text-2xl tracking-widest rounded-sm"
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

            {/* Hero Section with Scroll Expansion */}
            <ScrollExpandMedia
                mediaType="video"
                mediaSrc="ascent_final.mov"
                bgImageSrc="grid"
                title="ASCENT 2026"
                date="Tournament // 01"
                scrollToExpand="SCROLL"
                partners={['img/StarGarments.svg', 'img/Aivance.svg']}
                textBlend={false}
            >
                {/* Children content that shows after expansion */}
                <div className="flex flex-col items-center">
                    <div className="w-full max-w-2xl mb-16 px-6">
                        <div className="h-[2px] bg-white/10 w-full relative overflow-hidden">
                            <motion.div
                                className="absolute left-0 top-0 h-full bg-[#ff4655]"
                                initial={{ width: 0 }}
                                whileInView={{ width: '60%' }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                            />
                        </div>
                        <div className="flex justify-between items-center mt-3 font-mono text-[9px] md:text-[11px] tracking-[0.2em] text-white/40 uppercase">
                            <span className="opacity-0">.</span>
                            <span className="text-white/60 font-teko text-sm tracking-[0.3em]">Where Legends Ascend</span>
                            <span className="opacity-0">.</span>
                        </div>
                    </div>

                    <div className="max-w-xl text-center px-6">
                        <ScrambleText
                            text="THE ULTIMATE STUDENT-LED ESPORTS GAUNTLET IN SRI LANKA."
                            className="text-lg md:text-2xl font-medium tracking-wide opacity-80 uppercase"
                            duration={80}
                        />
                    </div>

                    {/* Transition to next sections */}
                    <div className="w-full mt-32">
                        <CountdownSection />

                        {/* Participating Schools Section - Standard Import for zero perceived delay */}
                        <section className="py-24 relative">
                            <ParallaxBackground text="VALORANT // 5v5" velocity={-30} direction="horizontal" className="top-0" />
                            <SectionReveal className="relative z-10 p-8 border border-white/5 bg-[#0f1923]/50 backdrop-blur-sm">
                                <div className="max-w-7xl mx-auto px-6 mb-12 flex justify-between items-end border-b border-white/10 pb-4">
                                    <div>
                                        <ScrambleText text="ELIGIBLE INSTITUTIONS" className="text-[#ff4655] font-bold tracking-widest text-xs mb-2 block" />
                                        <h2 className="font-teko text-4xl md:text-8xl font-bold leading-[0.9] md:leading-none"><ScrambleText text="PARTICIPATING SCHOOLS" triggerOnScroll /></h2>
                                    </div>
                                    <div className="text-right hidden md:block">
                                        <div className="text-3xl font-teko">SEASON 2026</div>
                                        <div className="text-xs tracking-[0.4em] text-white/40 uppercase">Auth_Required // Gauntlet_V2</div>
                                    </div>
                                </div>
                                <SchoolsCarousel />
                            </SectionReveal>
                        </section>

                        {/* Other Lazy Components */}
                        <Suspense fallback={
                            <div className="w-full h-96 flex items-center justify-center bg-[#0a1016]">
                                <div className="font-mono text-[10px] tracking-[0.5em] animate-pulse text-[#ff4655]">SYNCING_CHRONICLE...</div>
                            </div>
                        }>
                            <section className="py-24 relative overflow-hidden bg-grid">
                                <ParallaxBackground text="ASCENT" velocity={50} direction="horizontal" className="top-1/2 -translate-y-1/2 opacity-5" />
                                <SectionReveal className="relative z-10">
                                    <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
                                        <ScrambleText text="TOURNAMENT STRUCTURE" className="text-[#ff4655] font-bold tracking-widest text-xs mb-2 block" />
                                        <h2 className="font-teko text-6xl md:text-8xl font-bold leading-none">PATH TO ASCENT</h2>
                                    </div>
                                    <Timeline />
                                    <SeasonsSection />
                                </SectionReveal>
                            </section>

                            <ComingSoonSection onNotifyClick={() => openTicketModal('WAITLIST')} />

                            <section className="relative">
                                <SectionReveal>
                                    <PartnerSection
                                        onSponsorClick={() => setIsSponsorModalOpen(true)}
                                        onContactClick={() => openTicketModal('GENERAL INQUIRY')}
                                    />
                                </SectionReveal>
                            </section>
                        </Suspense>

                        <footer className="py-12 border-t border-white/5 text-center">
                            <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 text-[10px] md:text-xs text-white/40 font-medium tracking-wide uppercase mb-8">
                                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                                <a href="#" className="hover:text-white transition-colors">Code of Conduct</a>
                                <a href="#" className="hover:text-white transition-colors">Support</a>
                            </div>
                            <div className="text-[10px] text-white/20 font-inter tracking-wider">
                                © 2026 ASCENT ESPORTS. ALL RIGHTS RESERVED.
                            </div>
                        </footer>
                    </div>
                </div>
            </ScrollExpandMedia>

            {/* Modals */}
            <Suspense fallback={null}>
                <RegistrationModal
                    isOpen={isTicketModalOpen}
                    onClose={() => setIsTicketModalOpen(false)}
                    title={ticketModalTitle}
                />
                <SponsorModal
                    isOpen={isSponsorModalOpen}
                    onClose={() => setIsSponsorModalOpen(false)}
                />
            </Suspense>
        </div>
    );
};

export default App;
