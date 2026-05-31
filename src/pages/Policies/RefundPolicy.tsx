import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import SectionReveal from '../../components/Effects/SectionReveal';
import Footer from '../../components/Footer';

// @ts-ignore
import policyPdf from '../../assets/ASCENT_2026_Ticketing_and_Refund_Policy.pdf';

const RefundPolicy: React.FC = () => {
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
                            <h1 className="font-teko text-7xl md:text-9xl font-bold leading-none mb-4 uppercase">Refund Policy</h1>
                            <div className="h-1 w-24 bg-[#ff4655]" />
                        </header>

                        <div className="space-y-12 text-lg leading-relaxed">
                            <section>
                                <p>
                                    Thank you for choosing ASCENT ESPORTS. Our seating reservation system is designed to provide a fair and organized experience for all attendees. This Refund Policy specifically governs ticket purchases and seating reservations for our events.
                                </p>
                            </section>

                            <section>
                                <h2 className="font-teko text-3xl text-white mb-4 uppercase tracking-wider">Ticket Cancellations</h2>
                                <p>
                                    We offer a full refund for ticket cancellations made at least 7 days prior to the event date. Cancellations made within 7 days of the event are eligible for a 50% refund. No refunds will be issued for cancellations made within 48 hours of the event commencement.
                                </p>
                            </section>

                            <section>
                                <h2 className="font-teko text-3xl text-white mb-4 uppercase tracking-wider">Refund Process</h2>
                                <p>
                                    To initiate a refund, please contact our support team with your Authorization ID (Transaction ID). Once approved, the refund will be processed to your original method of payment within 5-10 business days. Note that system fees or processing charges may be non-refundable.
                                </p>
                            </section>

                            <section>
                                <h2 className="font-teko text-3xl text-white mb-4 uppercase tracking-wider">Seating Assignments</h2>
                                <p>
                                    Seating is reserved at the time of purchase. If you wish to change your seat, you may do so up to 72 hours before the event, subject to availability. Please contact us to facilitate a seat exchange.
                                </p>
                            </section>

                            <section>
                                <h2 className="font-teko text-3xl text-white mb-4 uppercase tracking-wider">Event Postponement or Cancellation</h2>
                                <p>
                                    In the event that the tournament is postponed, your tickets will remain valid for the rescheduled date. If the event is cancelled entirely, all ticket holders will receive a full refund automaticlly.
                                </p>
                            </section>

                            <section>
                                <h2 className="font-teko text-3xl text-white mb-4 uppercase tracking-wider">Non-Refundable Scenarios</h2>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Failure to attend the event without prior notification.</li>
                                    <li>Late arrivals may result in seat forfeiture if the venue reaches critical capacity.</li>
                                    <li>Violations of the Code of Conduct resulting in removal from the venue.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="font-teko text-3xl text-white mb-4 uppercase tracking-wider">Contact Support</h2>
                                <p>
                                    For all refund inquiries or issues regarding your seating reservation, please reach out to our operations unit through the support link provided in the footer of our website.
                                </p>
                            </section>

                            <section className="pt-8">
                                <h2 className="font-teko text-3xl text-white mb-6 uppercase tracking-wider">Official Policy Document</h2>
                                
                                <div className="w-full h-[60vh] md:h-[800px] border border-white/10 rounded-lg overflow-hidden bg-[#08080a] mb-6">
                                    <object 
                                        data={policyPdf} 
                                        type="application/pdf" 
                                        className="w-full h-full"
                                    >
                                        <div className="flex items-center justify-center h-full p-6 text-center">
                                            <p className="text-white/50 font-mono text-sm tracking-widest uppercase">
                                                Your browser cannot display the PDF inline.
                                            </p>
                                        </div>
                                    </object>
                                </div>

                                <div className="flex justify-center md:justify-start">
                                    <a 
                                        href={policyPdf} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center px-8 py-4 bg-[#ff4655]/10 hover:bg-[#ff4655]/20 border border-[#ff4655]/30 text-[#ff4655] font-teko text-xl tracking-widest rounded transition-all uppercase pointer-events-auto"
                                    >
                                        Download Official PDF
                                    </a>
                                </div>
                            </section>
                        </div>
                    </SectionReveal>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default RefundPolicy;
