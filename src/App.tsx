import React, { useState, useEffect, Suspense, lazy } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Routes, Route, Navigate } from 'react-router-dom';

import ModernNavbar from './components/Home/ModernNavbar';
import HeroSection from './components/Home/HeroSection';
import AboutSection from './components/Home/AboutSection';
import SchoolsMarquee from './components/Home/SchoolsMarquee';
import PathSection from './components/Home/PathSection';
import SeasonsSection from './components/Home/SeasonsSection';
import CinematicDoors from './components/Home/CinematicDoors';
import PartnerMarquee from './components/Home/PartnerMarquee';
import CustomCursor from './components/CustomCursor';
import Footer from './components/Footer';
import RegisterSection from './components/PartnerSection';
import SEO from './components/SEO';

// Lazy Load Heavy Components
import LoadingScreen from './components/LoadingScreen';
import TacticalLoader from './components/TacticalLoader';

// Lazy Load Pages/Components
const MaintenancePage = lazy(() => import('./components/MaintenancePage'));
const TicketsPage = lazy(() => import('./components/Tickets/TicketsPage'));
const RadianiteTicket = lazy(() => import('./components/Tickets/RadianiteTicket'));

const RegistrationModal = lazy(() => import('./components/RegistrationModal'));

const AdminPage = lazy(() => import('./components/Admin/AdminPage'));
const AdminLoginPage = lazy(() => import('./components/Admin/AdminLoginPage'));
const AdminScanner = lazy(() => import('./components/Admin/AdminScanner'));
const CheckoutPage = lazy(() => import('./components/Tickets/CheckoutPage'));
const RegistrationPage = lazy(() => import('./components/Registration/RegistrationPage'));

// Policy & Info Pages
const RefundPolicy = lazy(() => import('./pages/Policies/RefundPolicy'));
const PrivacyPolicy = lazy(() => import('./pages/Policies/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/Policies/TermsOfService'));
const Rulebook = lazy(() => import('./pages/Rulebook'));
const SupportPage = lazy(() => import('./pages/SupportPage'));
const ScoresPage = lazy(() => import('./pages/ScoresPage'));

// Demos
const AsciiDemoPage = lazy(() => import('./pages/AsciiDemoPage'));
const SchoolsDemoPage = lazy(() => import('./pages/SchoolsDemoPage'));
const TransitionsDemoPage = lazy(() => import('./pages/TransitionsDemoPage'));
const EclipseDemo = lazy(() => import('./pages/EclipseDemo'));
const FocusDemo = lazy(() => import('./pages/FocusDemo'));
const StadiumDemo = lazy(() => import('./pages/StadiumDemo'));
const DemoCountdown = lazy(() => import('./pages/DemoCountdown'));
const DemoRedacted = lazy(() => import('./pages/DemoRedacted'));
const DemoSignal = lazy(() => import('./pages/DemoSignal'));
const DemoAperture = lazy(() => import('./pages/DemoAperture'));
const ConceptSelectorPage = lazy(() => import('./pages/ConceptSelectorPage'));

import { useAuth, useUser, useSignIn } from '@clerk/clerk-react';

// Clerk Admin Guard component
const ClerkAdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isLoaded, isSignedIn } = useAuth();
    const { user } = useUser();

    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-[#08080a] flex items-center justify-center font-mono text-[#ff4655]">
                <TacticalLoader />
            </div>
        );
    }

    if (!isSignedIn) {
        return <Navigate to="/admin/login" replace />;
    }

    const allowedEmails = import.meta.env.VITE_ALLOWED_ADMIN_EMAILS?.split(',').map((e: string) => e.trim().toLowerCase()) || [];
    const userEmail = user?.emailAddresses[0]?.emailAddress?.toLowerCase();
    const isAllowedEmail = allowedEmails.length === 0 || (userEmail && allowedEmails.includes(userEmail));
    const isAdminRole = user?.publicMetadata?.role === 'admin';

    if (!isAllowedEmail && !isAdminRole) {
        return (
            <div className="min-h-screen bg-[#08080a] flex flex-col items-center justify-center font-mono text-white p-4 relative overflow-hidden">
                <div className="fixed inset-0 pointer-events-none z-0 opacity-20"
                    style={{
                        backgroundImage: 'linear-gradient(#ff4655 1px, transparent 1px), linear-gradient(90deg, #ff4655 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}
                />
                <div className="bg-[#0c0e1a] border border-[#ff4655] p-8 max-w-md w-full text-center space-y-6 relative z-10 rounded-sm shadow-[0_0_50px_rgba(255,70,85,0.15)]">
                    <div className="w-16 h-16 bg-[#ff4655]/10 border border-[#ff4655] rounded-full flex items-center justify-center mx-auto animate-pulse">
                        <span className="text-[#ff4655] text-2xl font-bold">⚠️</span>
                    </div>
                    <div>
                        <h2 className="text-[#ff4655] font-teko text-4xl tracking-widest uppercase">ACCESS_DENIED</h2>
                        <p className="text-[10px] text-white/30 tracking-[0.2em] uppercase mt-1">UNAUTHORIZED IDENTITY DETECTED</p>
                    </div>
                    <div className="text-left bg-black/40 border border-white/5 p-4 rounded-sm space-y-2 text-xs uppercase text-white/60">
                        <div><span className="text-white/30">OPERATOR:</span> {user?.fullName || 'UNKNOWN'}</div>
                        <div><span className="text-white/30">EMAIL:</span> {userEmail}</div>
                        <div><span className="text-white/30">STATUS:</span> AUTHENTICATED // UNAUTHORIZED</div>
                    </div>
                    <p className="text-[10px] text-white/40 leading-relaxed uppercase">
                        Your credentials are valid, but your account has not been cleared for administrative privileges. Please contact the Operations Director.
                    </p>
                    <button 
                        onClick={() => window.location.href = '/'}
                        className="bg-[#ff4655] hover:bg-white text-white hover:text-black font-teko text-xl py-3 px-6 tracking-widest transition-colors w-full clip-path-angled uppercase"
                    >
                        ABORT_MISSION
                    </button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

// Mock Admin Guard component
const MockAdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const session = localStorage.getItem('admin_session');
    if (!session) {
        return <Navigate to="/admin/login" replace />;
    }
    return <>{children}</>;
};

// Router Guard Selector
const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
    if (publishableKey) {
        return <ClerkAdminGuard>{children}</ClerkAdminGuard>;
    } else {
        return <MockAdminGuard>{children}</MockAdminGuard>;
    }
};

// Clerk AdminLoginPage Wrapper
const ClerkAdminLoginPageWrapper: React.FC = () => {
    const { isLoaded, signIn, setActive } = useSignIn();
    
    const handleLogin = async (username: string, secret: string) => {
        if (!isLoaded || !signIn || !setActive) return;
        const result = await signIn.create({
            identifier: username,
            password: secret,
        });
        if (result.status === 'complete') {
            await setActive({ session: result.createdSessionId });
        } else {
            throw new Error(`AUTH_INCOMPLETE: ${result.status?.toUpperCase() || 'UNKNOWN'}`);
        }
    };

    return <AdminLoginPage onLogin={handleLogin} />;
};

// Mock AdminLoginPage Wrapper
const MockAdminLoginPageWrapper: React.FC = () => {
    const ADMIN_USERNAME = 'AscentAdmin';
    const ADMIN_PASSWORD = 'ASCENT_7F9E23';

    const handleLogin = async (username: string, secret: string) => {
        await new Promise(resolve => setTimeout(resolve, 1500)); // simulate delay
        if (username === ADMIN_USERNAME && secret === ADMIN_PASSWORD) {
            localStorage.setItem('admin_session', 'active_' + Date.now());
        } else {
            throw new Error('ACCESS_DENIED: INVALID_CREDENTIALS');
        }
    };

    return <AdminLoginPage onLogin={handleLogin} />;
};

// AdminLoginPage Selector Container
const AdminLoginPageContainer: React.FC = () => {
    const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
    return publishableKey ? <ClerkAdminLoginPageWrapper /> : <MockAdminLoginPageWrapper />;
};

// Clerk AdminPage Wrapper
const ClerkAdminPageWrapper: React.FC = () => {
    const { signOut } = useAuth();
    const { user } = useUser();
    const email = user?.emailAddresses[0]?.emailAddress;
    return <AdminPage onSignOut={signOut} userEmail={email} />;
};

// Mock AdminPage Wrapper
const MockAdminPageWrapper: React.FC = () => {
    const signOut = async () => {
        localStorage.removeItem('admin_session');
    };
    return <AdminPage onSignOut={signOut} userEmail="admin@ascentlk.com" />;
};

// AdminPage Selector Container
const AdminPageContainer: React.FC = () => {
    const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
    return publishableKey ? <ClerkAdminPageWrapper /> : <MockAdminPageWrapper />;
};

// Clerk AdminScanner Wrapper
const ClerkAdminScannerWrapper: React.FC = () => {
    const { signOut } = useAuth();
    const { user } = useUser();
    const email = user?.emailAddresses[0]?.emailAddress;
    return <AdminScanner onSignOut={signOut} userEmail={email} />;
};

// Mock AdminScanner Wrapper
const MockAdminScannerWrapper: React.FC = () => {
    const signOut = async () => {
        localStorage.removeItem('admin_session');
    };
    return <AdminScanner onSignOut={signOut} userEmail="admin@ascentlk.com" />;
};

// AdminScanner Selector Container
const AdminScannerContainer: React.FC = () => {
    const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
    return publishableKey ? <ClerkAdminScannerWrapper /> : <MockAdminScannerWrapper />;
};

import { supabase } from './lib/supabase';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePageView } from './hooks/usePageView';

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

    const [scrolledPastHero, setScrolledPastHero] = useState(false);
    const [scrolledPastPartners, setScrolledPastPartners] = useState(false);
    const [isAtFooter, setIsAtFooter] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show the sticky text once we scroll past 80% of the viewport (mostly past the hero)
            if (window.scrollY > window.innerHeight * 0.8) {
                setScrolledPastHero(true);
            } else {
                setScrolledPastHero(false);
            }

            // Show partner logos after scrolling past the partner section (~4x viewport height)
            setScrolledPastPartners(window.scrollY > window.innerHeight * 4);

            // Hide the sticky text when we reach the footer (within ~150px of the bottom)
            const isBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 150;
            setIsAtFooter(isBottom);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initialize state
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Scroll to top or specific hash on route change
    useEffect(() => {
        if (location.hash) {
            setTimeout(() => {
                const el = document.querySelector(location.hash);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            window.scrollTo(0, 0);
        }
    }, [location.pathname, location.hash]);

    // Track page views for analytics
    usePageView();
    
    // Check if the app is being prerendered by Puppeteer during build
    // @ts-ignore
    const isPrerendering = typeof window !== 'undefined' && window.__PRERENDER_INJECTED?.isPrerendering;

    // Check if the intro has already played this session
    const hasIntroPlayed = sessionStorage.getItem('ascent_intro_played') === 'true';
    
    // Only show the full cinematic intro on homepage AND if it hasn't played yet AND we are not prerendering
    // DISABLED: HeroSection now handles the cinematic intro/loader sequence!
    const showCinematicIntro = false;
    // Show the quick tactical loader on homepage refreshes (intro already played)
    const showTacticalReload = false;
    
    const [isLoading, setIsLoading] = useState(false);
    const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
    const [ticketModalTitle, setTicketModalTitle] = useState('');

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
                    <Route path="/ticket/:id" element={
                        <Suspense fallback={<TacticalLoader />}>
                            <RadianiteTicket />
                        </Suspense>
                    } />
                    <Route path="/admin" element={
                        <Suspense fallback={<TacticalLoader />}>
                            <AdminGuard>
                                <AdminPageContainer />
                            </AdminGuard>
                        </Suspense>
                    } />
                    <Route path="/admin/scanner" element={
                        <Suspense fallback={<TacticalLoader />}>
                            <AdminGuard>
                                <AdminScannerContainer />
                            </AdminGuard>
                        </Suspense>
                    } />
                    <Route path="/admin/login" element={
                        <Suspense fallback={<TacticalLoader />}>
                            <AdminLoginPageContainer />
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
                    <Route path="/transitions-demo" element={
                        <Suspense fallback={<TacticalLoader />}>
                            <TransitionsDemoPage />
                        </Suspense>
                    } />
                    <Route path="/demo-eclipse" element={
                        <Suspense fallback={<TacticalLoader />}>
                            <EclipseDemo />
                        </Suspense>
                    } />
                    <Route path="/demo-focus" element={
                        <Suspense fallback={<TacticalLoader />}>
                            <FocusDemo />
                        </Suspense>
                    } />
                    <Route path="/demo-stadium" element={
                        <Suspense fallback={<TacticalLoader />}>
                            <StadiumDemo />
                        </Suspense>
                    } />
                    <Route path="/demo-countdown" element={
                        <Suspense fallback={<TacticalLoader />}>
                            <DemoCountdown />
                        </Suspense>
                    } />
                    <Route path="/demo-redacted" element={
                        <Suspense fallback={<TacticalLoader />}>
                            <DemoRedacted />
                        </Suspense>
                    } />
                    <Route path="/demo-signal" element={
                        <Suspense fallback={<TacticalLoader />}>
                            <DemoSignal />
                        </Suspense>
                    } />
                    <Route path="/demo-aperture" element={
                        <Suspense fallback={<TacticalLoader />}>
                            <DemoAperture />
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
                    <Route path="/rulebook" element={
                        <Suspense fallback={<TacticalLoader />}>
                            <Rulebook />
                        </Suspense>
                    } />
                    <Route path="/support" element={
                        <Suspense fallback={<TacticalLoader />}>
                            <SupportPage />
                        </Suspense>
                    } />
                    <Route path="/scores" element={
                        <Suspense fallback={<TacticalLoader />}>
                            <ScoresPage />
                        </Suspense>
                    } />
                    <Route path="/concepts" element={
                        <Suspense fallback={<div className="min-h-screen bg-[#08080a] flex items-center justify-center"><TacticalLoader /></div>}>
                            <ConceptSelectorPage />
                        </Suspense>
                    } />

                    <Route path="/" element={
                        <div className="relative min-h-screen" style={{ background: 'var(--bg-gradient)' }}>
                            <SEO 
                                title="ASCENT 2026 | Sri Lanka's Premier Student Esports Tournament" 
                                description="ASCENT 2026: Sri Lanka's biggest student-led 5v5 Valorant esports tournament. Qualifiers & grand finals live at Cinnamon Life Colombo. Register your team now!"
                                keywords="ASCENT 2026, Esports Sri Lanka, Student Gaming Tournament, Valorant Tournament Sri Lanka, Sri Lanka Esports, Student Esports Colombo, Gaming Tournament 2026, Cinnamon Life Esports"
                                path="/"
                            />
                            {/* Global LoadingScreen is now at the root of App */}
                            <CustomCursor />

                            {/* Sticky Left Text */}
                            <div className={`fixed bottom-4 left-4 md:bottom-8 md:left-8 z-50 pointer-events-none flex items-end drop-shadow-md transition-opacity duration-500 ${scrolledPastHero && !isAtFooter ? 'opacity-100' : 'opacity-0'}`}>
                                <p className="font-teko text-white/60 text-xl md:text-2xl tracking-[0.2em] uppercase">
                                    GAME RESPONSIBLY
                                </p>
                            </div>

                            {/* Sticky Bottom-Right Partner Logos — appears after partner section */}
                            <div className={`fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 pointer-events-none flex items-center gap-3 md:gap-4 transition-all duration-700 ${scrolledPastPartners && !isAtFooter ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                <img src="/partners/mastercard.png" alt="Mastercard" className="h-5 md:h-7 object-contain opacity-50 brightness-[1.2]" />
                                <div className="w-px h-4 bg-white/10" />
                                <img src="/partners/2.webp" alt="Red Bull" className="h-5 md:h-7 object-contain opacity-50 brightness-[1.2]" />
                                <div className="w-px h-4 bg-white/10" />
                                <img src="/partners/4.webp" alt="Scope Cinemas" className="h-5 md:h-7 object-contain opacity-50 brightness-[1.2]" />
                            </div>

                            {/* Premium HUD Navigation */}
                            <ModernNavbar />

                            {/* Phase 1: Modern Hero Block */}
                            <HeroSection />

                            {/* Partner logo marquee */}
                            <PartnerMarquee />

                            {/* Cinematic door reveal transition */}
                            <CinematicDoors />

                            {/* Phase 2: About Ascent (Split scrolling unblur) */}
                            <AboutSection />

                            {/* Phase 3: Schools Dual-Row Marquee */}
                            <SchoolsMarquee />

                            {/* Phase 4: Path to Ascent & Prize Pool */}
                            <PathSection />

                            {/* Phase 5: Toxic Season (ASCII Snake) */}
                            <SeasonsSection />

                            {/* Phase 6: Registration CTA */}
                            <RegisterSection />

                            {/* Footer */}
                            <Footer />

                            {/* Modals */}
                            <Suspense fallback={null}>
                                <RegistrationModal
                                    isOpen={isTicketModalOpen}
                                    onClose={() => setIsTicketModalOpen(false)}
                                    title={ticketModalTitle}
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
