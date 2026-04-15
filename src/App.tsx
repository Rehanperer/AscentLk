import React, { useState, useEffect, Suspense, lazy } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Routes, Route, Navigate } from 'react-router-dom';

import ModernNavbar from './components/Home/ModernNavbar';
import HeroSection from './components/Home/HeroSection';
import AboutSection from './components/Home/AboutSection';
import SchoolsMarquee from './components/Home/SchoolsMarquee';
import PathSection from './components/Home/PathSection';
import SeasonsSection from './components/Home/SeasonsSection';
import PartnerSection from './components/PartnerSection';
import CustomCursor from './components/CustomCursor';
import Footer from './components/Footer';


// Lazy Load Heavy Components
import LoadingScreen from './components/LoadingScreen';
import TacticalLoader from './components/TacticalLoader';

// Lazy Load Pages/Components
const MaintenancePage = lazy(() => import('./components/MaintenancePage'));
const TicketsPage = lazy(() => import('./components/Tickets/TicketsPage'));
const PartnerSection = lazy(() => import('./components/PartnerSection'));
const RegistrationModal = lazy(() => import('./components/RegistrationModal'));
const SponsorModal = lazy(() => import('./components/SponsorModal'));
const AdminPage = lazy(() => import('./components/Admin/AdminPage'));
const AdminLoginPage = lazy(() => import('./components/Admin/AdminLoginPage'));
const CheckoutPage = lazy(() => import('./components/Tickets/CheckoutPage'));
const RegistrationPage = lazy(() => import('./components/Registration/RegistrationPage'));

// Policy Pages
const RefundPolicy = lazy(() => import('./pages/Policies/RefundPolicy'));
const PrivacyPolicy = lazy(() => import('./pages/Policies/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/Policies/TermsOfService'));

// Demos
const AsciiDemoPage = lazy(() => import('./pages/AsciiDemoPage'));
const SchoolsDemoPage = lazy(() => import('./pages/SchoolsDemoPage'));

// Simple Auth Guard component
const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const session = localStorage.getItem('admin_session');
    if (!session) {
        return <Navigate to="/admin/login" replace />;
    }
    return <>{children}</>;
};

import { supabase } from './lib/supabase';
import { useLocation, useNavigate } from 'react-router-dom';

const MaintenanceGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [maintenance, setMaintenance] = useState<{ enabled: boolean; until: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');

    useEffect(() => {
        const checkMaintenance = async () => {
            const { data } = await supabase.from('settings').select('value').eq('key', 'maintenance').single();
            if (data?.value) {
                setMaintenance(data.value as any);
            }
            setIsLoading(false);
        };

        checkMaintenance();

        // Subscribe to maintenance toggle changes
        const channel = supabase.channel('maintenance_mode')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'settings', filter: 'key=eq.maintenance' }, (payload: any) => {
                if (payload.new && payload.new.value) {
                    setMaintenance(payload.new.value);
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    if (isLoading) return null; // Let the global LoadingScreen handle the initial load

    const isMaintenanceActive = maintenance?.enabled && new Date(maintenance.until) > new Date();

    if (isMaintenanceActive && !isAdminRoute && location.pathname !== '/maintenance') {
        return <Navigate to="/maintenance" replace />;
    }

    if (!isMaintenanceActive && location.pathname === '/maintenance') {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};


const App: React.FC = () => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    
    // Check if the intro has already played this session
    const hasIntroPlayed = sessionStorage.getItem('ascent_intro_played') === 'true';
    
    // Only show the full cinematic intro on homepage AND if it hasn't played yet
    const showCinematicIntro = isHomePage && !hasIntroPlayed;
    // Show the quick tactical loader on homepage refreshes (intro already played)
    const showTacticalReload = isHomePage && hasIntroPlayed;
    
    const [isLoading, setIsLoading] = useState(showCinematicIntro || showTacticalReload);
    const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
    const [ticketModalTitle, setTicketModalTitle] = useState('');
    const [isSponsorModalOpen, setIsSponsorModalOpen] = useState(false);
    const navigate = useNavigate();

    const [isMediaLoaded, setIsMediaLoaded] = useState(false);

    const handleLoadingComplete = () => {
        sessionStorage.setItem('ascent_intro_played', 'true');
        setIsLoading(false);
    };

    const handleTacticalComplete = () => {
        setIsLoading(false);
    };

    // Auto-dismiss tactical loader after 2 seconds
    React.useEffect(() => {
        if (showTacticalReload && isLoading) {
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [showTacticalReload, isLoading]);

    const [isHeroExpanded, setIsHeroExpanded] = useState(false);

    const openTicketModal = (title: string) => {
        setTicketModalTitle(title);
        setIsTicketModalOpen(true);
    };

    return (
        <div className="relative min-h-screen" style={{ background: 'var(--bg-gradient)' }}>
            <AnimatePresence>
                {isLoading && showCinematicIntro && <LoadingScreen onComplete={handleLoadingComplete} key="intro-loader" />}
                {isLoading && showTacticalReload && <TacticalLoader key="tactical-loader" />}
            </AnimatePresence>
        <AnimatePresence mode="wait">
            <MaintenanceGuard>
                <Routes>
                    <Route path="/maintenance" element={
                        <Suspense fallback={<TacticalLoader />}>
                            {/* We'll pass the 'until' prop later or fetch it in the component */}
                            <MaintenancePageWithProps />
                        </Suspense>
                    } />
                    <Route path="/tickets" element={
                        <Suspense fallback={<TacticalLoader />}>
                            <TicketsPage />
                        </Suspense>
                    } />
                    <Route path="/checkout" element={
                        <Suspense fallback={<TacticalLoader />}>
                            <CheckoutPage />
                        </Suspense>
                    } />
                    <Route path="/admin" element={
                        <Suspense fallback={<TacticalLoader />}>
                            <AdminGuard>
                                <AdminPage />
                            </AdminGuard>
                        </Suspense>
                    } />
                    <Route path="/admin/login" element={
                        <Suspense fallback={<TacticalLoader />}>
                            <AdminLoginPage />
                        </Suspense>
                    } />
                    <Route path="/register" element={
                        <Suspense fallback={<TacticalLoader />}>
                            <RegistrationPage />
                        </Suspense>
                    } />
                    <Route path="/refund-policy" element={
                        <Suspense fallback={<TacticalLoader />}>
                            <RefundPolicy />
                        </Suspense>
                    } />
                    <Route path="/ascii-demo" element={
                        <Suspense fallback={<TacticalLoader />}>
                            <AsciiDemoPage />
                        </Suspense>
                    } />
                    <Route path="/schools-demo" element={
                        <Suspense fallback={<TacticalLoader />}>
                            <SchoolsDemoPage />
                        </Suspense>
                    } />
                    <Route path="/privacy-policy" element={
                        <Suspense fallback={<TacticalLoader />}>
                            <PrivacyPolicy />
                        </Suspense>
                    } />
                    <Route path="/terms-of-service" element={
                        <Suspense fallback={<TacticalLoader />}>
                            <TermsOfService />
                        </Suspense>
                    } />
                    <Route path="/" element={
                        <div className="relative min-h-screen" style={{ background: 'var(--bg-gradient)' }}>
                            {/* Global LoadingScreen is now at the root of App */}
                            <CustomCursor />

                            {/* Premium HUD Navigation */}
                            <ModernNavbar />

                            {/* Phase 1: Modern Hero Block */}
                            <HeroSection />

                            {/* Phase 2: About Ascent (Split scrolling unblur) */}
                            <AboutSection />

                            {/* Phase 3: Schools Dual-Row Marquee */}
                            <SchoolsMarquee />

                            {/* Phase 4: Path to Ascent & Prize Pool */}
                            <PathSection />

                            {/* Phase 5: Toxic Season (ASCII Snake) */}
                            <SeasonsSection />

                            {/* Phase 6: Partnerships */}
                            <PartnerSection 
                                onSponsorClick={() => setIsSponsorModalOpen(true)}
                                onContactClick={() => setIsSponsorModalOpen(true)} 
                            />

                            {/* Footer */}
                            <Footer />

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
            </MaintenanceGuard>
        </AnimatePresence>
        </div>
    );
};

// Helper component to pass until prop from MaintenanceGuard context if needed
// Or we can just let MaintenancePage fetch it itself.
// But for now, let's just make it simple.
const MaintenancePageWithProps: React.FC = () => {
    const [until, setUntil] = useState<string>('');

    useEffect(() => {
        const fetchUntil = async () => {
            const { data } = await supabase.from('settings').select('value').eq('key', 'maintenance').single();
            if (data?.value) {
                setUntil((data.value as any).until);
            }
        };
        fetchUntil();
    }, []);

    if (!until) return <LoadingScreen onComplete={() => { }} />;
    return <MaintenancePage until={until} />;
};

export default App;
