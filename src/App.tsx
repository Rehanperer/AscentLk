import React, { useState, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import ScrollExpandMedia from './components/Hero/ScrollExpandMedia';
import HudBrackets from './components/HudBrackets';
import CustomCursor from './components/CustomCursor';
import Particles from './components/Particles';
import ScrambleText from './components/ScrambleText';
import CountdownSection from './components/CountdownSection';
import ComingSoonSection from './components/ComingSoonSection';
import SectionReveal from './components/Effects/SectionReveal';
import ParallaxBackground from './components/Effects/ParallaxBackground';

// Lazy Load Heavy Components
const SchoolsCarousel = lazy(() => import('./components/Schools/SchoolsCarousel'));
const Timeline = lazy(() => import('./components/Tournament/Timeline'));
const PartnerSection = lazy(() => import('./components/PartnerSection'));
const RegistrationModal = lazy(() => import('./components/RegistrationModal'));
const SponsorModal = lazy(() => import('./components/SponsorModal'));


const App: React.FC = () => {
    const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
    const [ticketModalTitle, setTicketModalTitle] = useState('');
    const [isSponsorModalOpen, setIsSponsorModalOpen] = useState(false);

    const openTicketModal = (title: string) => {
        setTicketModalTitle(title);
        setIsTicketModalOpen(true);
    };

    return (
        <div className="relative min-h-screen bg-[#0f1923]">
            <CustomCursor />
            <HudBrackets />
            <Particles />
            <div className="scanlines" />
            <div className="grain" />

            {/* Nav Overlay */}
            <nav className="fixed top-0 left-0 w-full p-4 md:p-6 z-[100] flex justify-between items-start pointer-events-none">
                <div className="flex flex-col">
                    <span className="font-teko text-xl md:text-2xl tracking-widest text-[#ff4655] font-bold transition-colors duration-300">
                        ASCENT // 2026
                    </span>
                    <span className="text-[10px] md:text-xs tracking-wider opacity-60 mix-blend-difference text-white uppercase font-medium">
                        WHERE LEGENDS ASCEND
                    </span>
                </div>

                <div className="flex items-start gap-4 pointer-events-auto">
                    <div className="hidden md:flex gap-4">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-white/5 border border-white/20 flex items-center justify-center rounded-sm hover:border-[#ff4655] transition-colors cursor-pointer interactive-element" title="Club">
                            <img src="img/SVG.svg" className="w-6 h-6 object-contain opacity-80" alt="Club" />
                        </div>
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-white/5 border border-white/20 flex items-center justify-center rounded-sm hover:border-[#ff4655] transition-colors cursor-pointer interactive-element" title="Valorant">
                            <img src="img/Valorant.svg" className="w-6 h-6 object-contain opacity-80" alt="Valorant" />
                        </div>
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-white/5 border border-white/20 flex items-center justify-center rounded-sm hover:border-[#ff4655] transition-colors cursor-pointer interactive-element" title="Event">
                            <img src="img/ASCENT2026.svg" className="w-6 h-6 object-contain opacity-80" alt="Ascent" />
                        </div>
                    </div>

                    <div
                        onClick={() => openTicketModal('GENERAL REGISTRATION')}
                        className="bg-[#ff4655] text-white px-4 py-1.5 md:px-6 md:py-2 font-bold font-teko text-base md:text-xl angled-box cursor-pointer hover:bg-white hover:text-black transition-colors duration-300 interactive-element"
                    >
                        REGISTER NOW
                    </div>
                </div>
            </nav>

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
                            <span>Initializing_Gauntlet...</span>
                            <span className="text-white/80 font-teko text-sm tracking-[0.3em]">Where Legends Ascend</span>
                            <span>CRC_OK // Battle_Ready</span>
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

                        <Suspense fallback={
                            <div className="w-full h-96 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff4655]"></div>
                            </div>
                        }>
                            <section className="py-24 relative">
                                <ParallaxBackground text="VALORANT // 5v5" velocity={-30} direction="horizontal" className="top-0" />
                                <SectionReveal className="relative z-10 p-8 border border-white/5 bg-[#0f1923]/50 backdrop-blur-sm">
                                    <div className="max-w-7xl mx-auto px-6 mb-12 flex justify-between items-end border-b border-white/10 pb-4">
                                        <div>
                                            <ScrambleText text="ELIGIBLE INSTITUTIONS" className="text-[#ff4655] font-bold tracking-widest text-xs mb-2 block" />
                                            <h2 className="font-teko text-6xl md:text-8xl font-bold leading-none"><ScrambleText text="PARTICIPATING SCHOOLS" triggerOnScroll /></h2>
                                        </div>
                                        <div className="text-right hidden md:block">
                                            <div className="text-3xl font-teko">SEASON 2026</div>
                                            <div className="text-xs tracking-[0.4em] text-white/40 uppercase">Auth_Required // Gauntlet_V2</div>
                                        </div>
                                    </div>
                                    <SchoolsCarousel />
                                </SectionReveal>
                            </section>

                            <section className="py-24 relative overflow-hidden bg-grid">
                                <ParallaxBackground text="PROTOCOL_INIT" velocity={50} direction="horizontal" className="top-1/2 -translate-y-1/2 opacity-10" />
                                <SectionReveal className="relative z-10">
                                    <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
                                        <ScrambleText text="TOURNAMENT STRUCTURE" className="text-[#ff4655] font-bold tracking-widest text-xs mb-2 block" />
                                        <h2 className="font-teko text-6xl md:text-8xl font-bold leading-none">PATH TO ASCENT</h2>
                                    </div>
                                    <Timeline />
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

                        <footer className="py-20 border-t border-white/10 text-center">
                            <div className="text-[10px] md:text-xs text-white/30 font-mono tracking-widest uppercase">
                                COPYRIGHT © ASCENT 2026. ALL RIGHTS RESERVED.
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
