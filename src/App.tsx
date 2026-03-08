import React, { useState, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
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

// Lazy Load Pages/Components
const TicketsPage = lazy(() => import('./components/Tickets/TicketsPage'));
const Timeline = lazy(() => import('./components/Tournament/Timeline'));
const PartnerSection = lazy(() => import('./components/PartnerSection'));
const RegistrationModal = lazy(() => import('./components/RegistrationModal'));
const SponsorModal = lazy(() => import('./components/SponsorModal'));
const AdminPage = lazy(() => import('./components/Admin/AdminPage'));
const AdminLoginPage = lazy(() => import('./components/Admin/AdminLoginPage'));
const CheckoutPage = lazy(() => import('./components/Tickets/CheckoutPage'));
const RegistrationPage = lazy(() => import('./components/Registration/RegistrationPage'));

// Simple Auth Guard component
const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const session = localStorage.getItem('admin_session');
    if (!session) {
        return <Navigate to="/admin/login" replace />;
    }
    return <>{children}</>;
};


const App: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
    const [ticketModalTitle, setTicketModalTitle] = useState('');
    const [isSponsorModalOpen, setIsSponsorModalOpen] = useState(false);

    const [isMediaLoaded, setIsMediaLoaded] = useState(false);

    const handleLoadingComplete = () => {
        setIsLoading(false);
    };

    const [isHeroExpanded, setIsHeroExpanded] = useState(false);

    const openTicketModal = (title: string) => {
        setTicketModalTitle(title);
        setIsTicketModalOpen(true);
    };

    return (
        <AnimatePresence mode="wait">
            <Routes>
                <Route path="/tickets" element={
                    <Suspense fallback={<LoadingScreen onComplete={() => { }} />}>
                        <TicketsPage />
                    </Suspense>
                } />
                <Route path="/checkout" element={
                    <Suspense fallback={<LoadingScreen onComplete={() => { }} />}>
                        <CheckoutPage />
                    </Suspense>
                } />
                <Route path="/admin" element={
                    <Suspense fallback={<LoadingScreen onComplete={() => { }} />}>
                        <AdminGuard>
                            <AdminPage />
                        </AdminGuard>
                    </Suspense>
                } />
                <Route path="/admin/login" element={
                    <Suspense fallback={<LoadingScreen onComplete={() => { }} />}>
                        <AdminLoginPage />
                    </Suspense>
                } />
                <Route path="/register" element={
                    <Suspense fallback={<LoadingScreen onComplete={() => { }} />}>
                        <RegistrationPage />
                    </Suspense>
                } />
                <Route path="/" element={
                    <div className="relative min-h-screen bg-[#000000]">
                        <AnimatePresence>
                            {isLoading && <LoadingScreen onComplete={handleLoadingComplete} key="loader" />}
                        </AnimatePresence>
                        <CustomCursor />

                        {/* Premium HUD Navigation */}
                        <Navbar
                            onRegister={() => openTicketModal('GENERAL REGISTRATION')}
                            onNavigate={() => setIsHeroExpanded(true)}
                        />

                        {/* Hero Section with Scroll Expansion */}
                        <ScrollExpandMedia
                            mediaType="video"
                            mediaSrc="ascent_vid.mp4"
                            bgImageSrc="grid"
                            title="ASCENT 2026"
                            date="Tournament // 01"
                            scrollToExpand="SCROLL"
                            partners={['img/StarGarments.svg', 'img/Aivance.svg']}
                            textBlend={false}
                            onMediaLoaded={() => setIsMediaLoaded(true)}
                            forceExpand={isHeroExpanded}
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
                                    <section id="schools" className="py-24 relative overflow-hidden bg-atmospheric">
                                        {/* Animated atmospheric glow orb */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#ff4655]/10 rounded-full blur-[150px] anim-pulse-slow pointer-events-none" />

                                        <ParallaxBackground text="VALORANT // 5v5" velocity={-30} direction="horizontal" className="top-0 opacity-5" />
                                        <SectionReveal className="relative z-10 p-8 border border-white/5 backdrop-blur-sm bg-black/20">
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

                                    <section id="timeline" className="relative">
                                        <Suspense fallback={
                                            <div className="w-full h-96 flex items-center justify-center bg-[#000000]">
                                                <div className="font-mono text-[10px] tracking-[0.5em] animate-pulse text-[#ff4655]">SYNCING_CHRONICLE...</div>
                                            </div>
                                        }>
                                            <section className="py-24 relative overflow-hidden bg-atmospheric">
                                                {/* Moving Scanline - Intensified */}
                                                <div className="bg-scanline opacity-60" />

                                                {/* Animated atmospheric glow orb */}
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#ff4655]/10 rounded-full blur-[150px] anim-pulse-slow pointer-events-none" />

                                                <ParallaxBackground text="ASCENT" velocity={50} direction="horizontal" className="top-1/2 -translate-y-1/2 opacity-[0.03]" />
                                                <SectionReveal className="relative z-10">
                                                    <div className="max-w-7xl mx-auto px-6 mb-16 text-center">

                                                        <ScrambleText text="TOURNAMENT STRUCTURE" className="text-[#ff4655] font-bold tracking-widest text-xs mb-2 block" />
                                                        <h2 className="font-teko text-6xl md:text-8xl font-bold leading-none">PATH TO ASCENT</h2>
                                                    </div>
                                                    <Timeline />
                                                    <SeasonsSection />
                                                </SectionReveal>
                                            </section>
                                        </Suspense>
                                    </section>

                                    <ComingSoonSection onNotifyClick={() => openTicketModal('WAITLIST')} />

                                    <section id="partners" className="relative">
                                        <Suspense fallback={null}>
                                            <SectionReveal>
                                                <PartnerSection
                                                    onSponsorClick={() => setIsSponsorModalOpen(true)}
                                                    onContactClick={() => openTicketModal('GENERAL INQUIRY')}
                                                />
                                            </SectionReveal>
                                        </Suspense>
                                    </section>

                                    <footer className="py-12 border-t border-white/5 text-center">
                                        <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 text-[10px] md:text-xs text-white/40 font-medium tracking-wide uppercase mb-8">
                                            <a href="https://www.instagram.com/ascent_2026/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
                                            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                                            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                                            <a href="#" className="hover:text-white transition-colors">Code of Conduct</a>
                                            <a href="#" className="hover:text-white transition-colors">Support</a>
                                        </div>
                                        <div className="text-[10px] text-white/40 font-inter tracking-wider space-y-2">
                                            <div>© 2026 ASCENT ESPORTS. ALL RIGHTS RESERVED.</div>
                                            <div className="text-[9px] text-[#ff4655]/60 tracking-[0.3em] font-mono select-none">
                                                DESIGNED & DEVELOPED BY <span className="text-white/80">REHAN PERERA</span>
                                            </div>
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
                } />
            </Routes>
        </AnimatePresence>
    );
};

export default App;
