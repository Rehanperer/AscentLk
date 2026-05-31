import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import SectionReveal from '../../components/Effects/SectionReveal';
import Footer from '../../components/Footer';

const TermsOfService: React.FC = () => {
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
                            <h1 className="font-teko text-7xl md:text-9xl font-bold leading-none mb-4 uppercase">Terms & Conditions</h1>
                            <div className="h-1 w-24 bg-[#ff4655]" />
                        </header>

                        <div className="space-y-12 text-lg leading-relaxed">
                            <section>
                                <p>
                                    Welcome to ASCENT 2026. These Terms and Conditions govern your use of our platform, tournament registration, ticket purchases, and attendance at the live event. By accessing our website, registering a team, or purchasing a ticket, you agree to comply with these terms.
                                </p>
                            </section>

                            <section>
                                <h2 className="font-teko text-3xl text-white mb-4 uppercase tracking-wider">1. Eligibility & Accounts</h2>
                                <ol className="list-none space-y-4 ml-4">
                                    <li><strong className="text-white">Age Requirements:</strong> The live event and tournament are open to participants of all ages. However, if you are under 18 years old, you represent that you have obtained the consent of a parent or legal guardian to attend the event or participate in the tournament.</li>
                                    <li><strong className="text-white">Account Security:</strong> You are responsible for maintaining the confidentiality of your account credentials used on the ASCENT portal.</li>
                                    <li><strong className="text-white">Information Accuracy:</strong> You agree to provide accurate, current, and complete information during tournament registration and ticket checkout.</li>
                                </ol>
                            </section>

                            <section>
                                <h2 className="font-teko text-3xl text-white mb-4 uppercase tracking-wider">2. Tournament Registration & Competitive Integrity</h2>
                                <ol className="list-none space-y-4 ml-4">
                                    <li><strong className="text-white">Team Eligibility:</strong> All registered teams must meet the specific roster requirements outlined in the official ASCENT 2026 Rulebook.</li>
                                    <li><strong className="text-white">Roster Deadlines:</strong> Roster locks and changes are subject to strict deadlines. Failure to field a valid roster will result in disqualification without a refund of any registration fees (if applicable).</li>
                                    <li><strong className="text-white">Competitive Integrity:</strong> Any form of cheating, exploiting, match-fixing, or toxic behavior—both online and at the live finals—will result in immediate disqualification, forfeiture of prizing, and a potential ban from future events.</li>
                                </ol>
                            </section>

                            <section>
                                <h2 className="font-teko text-3xl text-white mb-4 uppercase tracking-wider">3. Ticket Purchases, Payments & Cancellations</h2>
                                <ol className="list-none space-y-4 ml-4">
                                    <li><strong className="text-white">Ticket Sales:</strong> All ticket purchases for the live finals at the Lumina Ballroom, Cinnamon Life, are final.</li>
                                    <li><strong className="text-white">No Refunds or Exchanges:</strong> Tickets cannot be refunded, exchanged, or resold for commercial premium. If the event is postponed or rescheduled, your ticket will automatically be valid for the new date.</li>
                                    <li><strong className="text-white">Payment Processing:</strong> We utilize secure, trusted third-party payment gateways. ASCENT does not store or have access to your full payment card details.</li>
                                </ol>
                            </section>

                            <section>
                                <h2 className="font-teko text-3xl text-white mb-4 uppercase tracking-wider">4. Live Event Regulations (Lumina Ballroom)</h2>
                                <ol className="list-none space-y-4 ml-4">
                                    <li><strong className="text-white">Admission:</strong> A valid digital or physical ticket QR code must be presented at the venue for entry. The organizers reserve the right to refuse entry or eject any individual displaying disruptive, unsafe, or inappropriate behavior.</li>
                                    <li><strong className="text-white">Prohibited Items:</strong> Weapons, illegal substances, outside food and beverages, and professional laser pointers are strictly prohibited inside the venue.</li>
                                    <li><strong className="text-white">Schedule Adjustments:</strong> While we strive to stick to the planned schedule, match timings and orchestral performance blocks are subject to real-time adjustments due to broadcast dynamics or technical pacing.</li>
                                </ol>
                            </section>

                            <section>
                                <h2 className="font-teko text-3xl text-white mb-4 uppercase tracking-wider">5. Media, Broadcast & Intellectual Property License</h2>
                                <ol className="list-none space-y-4 ml-4">
                                    <li><strong className="text-white">Media Consent:</strong> By attending the live event or participating in the tournament, you acknowledge and agree that you may be photographed, filmed, or recorded. You grant ASCENT 2026 the absolute, global right to use your likeness, voice, and team branding in official livestreams, promotional videos, and post-event highlights.</li>
                                    <li><strong className="text-white">Intellectual Property:</strong> All original visual assets, web code, music arrangements, and event branding are the exclusive property of ASCENT 2026 and its licensors. Riot Games, Valorant, and associated assets are the property of Riot Games, Inc.</li>
                                </ol>
                            </section>

                            <section>
                                <h2 className="font-teko text-3xl text-white mb-4 uppercase tracking-wider">6. Limitation of Liability</h2>
                                <ol className="list-none space-y-4 ml-4">
                                    <li><strong className="text-white">Event Disruption:</strong> ASCENT 2026, its executive team, partners, and the venue (Cinnamon Life) will not be held liable for personal injury, property damage, or unexpected logistical delays arising from technical faults, server outages, or force majeure events.</li>
                                    <li><strong className="text-white">Technical Integrity:</strong> We do not guarantee uninterrupted access to the online tournament portal or ticket booking engine during high-traffic windows.</li>
                                </ol>
                            </section>

                            <section>
                                <h2 className="font-teko text-3xl text-white mb-4 uppercase tracking-wider">7. Amendments</h2>
                                <p>
                                    We reserve the right to modify or update these Terms and Conditions at any time to preserve competitive balance or adjust to venue policies.
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

export default TermsOfService;
