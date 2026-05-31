import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import SectionReveal from '../../components/Effects/SectionReveal';
import Footer from '../../components/Footer';

const PrivacyPolicy: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#000000] text-white/80 font-inter selection:bg-[#ff4655] selection:text-white">
            <Navbar onRegister={() => { }} onNavigate={() => { }} />

            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#ff4655]/5 rounded-full blur-[150px]" />
                <div className="absolute inset-0 bg-grid opacity-5" />
            </div>

            <div className="relative z-10 pt-32 pb-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <Link to="/" className="inline-flex items-center gap-2 text-[#ff4655] font-mono text-xs tracking-widest hover:gap-3 transition-all mb-12 group">
                        <ArrowLeft size={14} />
                        BACK TO ASCENT
                    </Link>

                    <SectionReveal>
                        <header className="mb-16">
                            <h1 className="font-teko text-7xl md:text-9xl font-bold leading-none mb-4 uppercase">Privacy Policy</h1>
                            <div className="h-1 w-24 bg-[#ff4655]" />
                        </header>

                        <div className="space-y-12 text-lg leading-relaxed">
                            <section>
                                <p>
                                    At ASCENT, we are committed to protecting the privacy and security of our community, players, and attendees. This Privacy Policy outlines how we collect, use, and safeguard your information when you use our website portal, register for our tournament, purchase tickets, or attend our live event.
                                </p>
                            </section>

                            <section>
                                <h2 className="font-teko text-3xl text-white mb-4 uppercase tracking-wider">1. Information We Collect</h2>
                                <p className="mb-4">We collect information directly from you when you interact with our platform. This includes:</p>
                                <ul className="list-disc list-inside space-y-4 ml-4">
                                    <li><strong className="text-white">Account & Registration Data:</strong> Full name, email address, contact number, and date of birth (to verify eligibility).</li>
                                    <li><strong className="text-white">Esports & Team Data:</strong> In-Game Names (IGNs), Riot IDs, team rosters, and regional competitive history.</li>
                                    <li><strong className="text-white">Ticketing & Transaction Data:</strong> Information required to secure your seat at the live finals. Payment processing is handled entirely by secure, trusted third-party payment gateways; ASCENT does not view or store your credit/debit card numbers.</li>
                                    <li><strong className="text-white">Event Media:</strong> Photographs, audio, and video recordings captured during the live production at the Lumina Ballroom, Cinnamon Life.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="font-teko text-3xl text-white mb-4 uppercase tracking-wider">2. How We Use Your Information</h2>
                                <p className="mb-4">We use your data to power the ASCENT experience, specifically:</p>
                                <ul className="list-disc list-inside space-y-4 ml-4">
                                    <li><strong className="text-white">Tournament Operations:</strong> Managing tournament brackets, verifying player eligibility, displaying public leaderboards, and coordinating match schedules.</li>
                                    <li><strong className="text-white">Ticketing & Access Control:</strong> Issuing digital tickets, verifying entry at the venue via QR codes, and providing event updates.</li>
                                    <li><strong className="text-white">Broadcast & Promotion:</strong> Featuring player profiles, IGNs, and live-venue crowd footage on our official streams, VODs, and social media recaps.</li>
                                    <li><strong className="text-white">Platform Optimization:</strong> Using basic, anonymized analytics (like device type and browser settings) to ensure our match dashboard and registration portal load seamlessly during peak traffic.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="font-teko text-3xl text-white mb-4 uppercase tracking-wider">3. Information Sharing & Public Visibility</h2>
                                <p className="mb-4">We respect your privacy and do not sell your personal data. However, by participating, certain elements are shared as a natural part of a major esports tournament:</p>
                                <ul className="list-disc list-inside space-y-4 ml-4">
                                    <li><strong className="text-white">Public Tournament Data:</strong> Your Riot ID, IGN, team name, and match statistics will be publicly visible on the tournament platform and broadcast.</li>
                                    <li><strong className="text-white">Production Partners:</strong> We share necessary operational data with our direct event production partners, venue coordinators at Cinnamon Life, and authorized tournament administrators.</li>
                                    <li><strong className="text-white">Legal Compliance:</strong> We may disclose information if required to do so by law or to protect the safety of our attendees and staff at the physical venue.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="font-teko text-3xl text-white mb-4 uppercase tracking-wider">4. Minor's Privacy (Under 18)</h2>
                                <p className="mb-4">Given that ASCENT 2026 serves a large student demographic, we are highly cautious about youth data.</p>
                                <ul className="list-disc list-inside space-y-4 ml-4">
                                    <li>Players under the age of 18 must have parental or legal guardian consent before submitting personal information or registering a team.</li>
                                    <li>If we discover we have inadvertently collected data from a minor without verified guardian consent, we will take steps to delete that data immediately.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="font-teko text-3xl text-white mb-4 uppercase tracking-wider">5. Data Security & Storage</h2>
                                <p>
                                    We employ industry-standard encryption and security protocols to safeguard account and registration data against unauthorized access. While no system is entirely foolproof, we routinely monitor our database and registration portal to protect our database.
                                </p>
                            </section>

                            <section>
                                <h2 className="font-teko text-3xl text-white mb-4 uppercase tracking-wider">6. Cookies and Community Links</h2>
                                <ul className="list-disc list-inside space-y-4 ml-4">
                                    <li><strong className="text-white">Cookies:</strong> We use basic cookies to keep you logged into the portal and to remember your ticketing preferences. You can disable these in your browser, though it may disrupt the checkout process.</li>
                                    <li><strong className="text-white">Third-Party Links:</strong> Our website may link to external platforms like Discord (for tournament coordination) or third-party streaming sites. We are not responsible for the privacy practices of external platforms; please review their respective policies.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="font-teko text-3xl text-white mb-4 uppercase tracking-wider">7. Changes to this Policy</h2>
                                <p>
                                    We may update this Privacy Policy as we edge closer to the event to reflect production or venue adjustments. Any updates will be pushed directly to this page with an updated timestamp.
                                </p>
                            </section>

                            <section>
                                <h2 className="font-teko text-3xl text-white mb-4 uppercase tracking-wider">8. Contact Us</h2>
                                <p>
                                    For any questions regarding your data, team removal requests, or privacy inquiries, please contact the ASCENT Event Operations team through our official communication channels or our designated community server.
                                </p>
                            </section>
                        </div>
                    </SectionReveal>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
