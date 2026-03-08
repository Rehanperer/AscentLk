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
                                    At ASCENT ESPORTS, we are committed to protecting the privacy and security of our customers' personal information. This Privacy Policy outlines how we collect, use, and safeguard your information when you visit or make a purchase on our website. By using our website, you consent to the practices described in this policy.
                                </p>
                            </section>

                            <section>
                                <h2 className="font-teko text-3xl text-white mb-4 uppercase tracking-wider">Information We Collect</h2>
                                <p className="mb-4">When you visit our website, we may collect certain information about you, including:</p>
                                <ul className="list-disc list-inside space-y-4 ml-4">
                                    <li><strong className="text-white">Personal identification information</strong> (such as your name, email address, and phone number) provided voluntarily by you during the registration or checkout process.</li>
                                    <li><strong className="text-white">Payment and billing information</strong> necessary to process your orders, including credit card details, which are securely handled by trusted third-party payment processors.</li>
                                    <li><strong className="text-white">Browsing information</strong>, such as your IP address, browser type, and device information, collected automatically using cookies and similar technologies.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="font-teko text-3xl text-white mb-4 uppercase tracking-wider">Use of Information</h2>
                                <p className="mb-4">We may use the collected information for the following purposes:</p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>To process and fulfill your orders, including shipping and delivery.</li>
                                    <li>To communicate with you regarding your purchases, provide customer support, and respond to inquiries or requests.</li>
                                    <li>To personalize your shopping experience and present relevant product recommendations and promotions.</li>
                                    <li>To improve our website, products, and services based on your feedback and browsing patterns.</li>
                                    <li>To detect and prevent fraud, unauthorized activities, and abuse of our website.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="font-teko text-3xl text-white mb-4 uppercase tracking-wider">Information Sharing</h2>
                                <p className="mb-4">We respect your privacy and do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:</p>
                                <ul className="space-y-4">
                                    <li>
                                        <strong className="text-white block mb-1">Trusted service providers</strong>
                                        We may share your information with third-party service providers who assist us in operating our website, processing payments, and delivering products. These providers are contractually obligated to handle your data securely and confidentially.
                                    </li>
                                    <li>
                                        <strong className="text-white block mb-1">Legal requirements</strong>
                                        We may disclose your information if required to do so by law or in response to valid legal requests or orders.
                                    </li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="font-teko text-3xl text-white mb-4 uppercase tracking-wider">Data Security</h2>
                                <p>
                                    We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, please be aware that no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                                </p>
                            </section>

                            <section>
                                <h2 className="font-teko text-3xl text-white mb-4 uppercase tracking-wider">Cookies and Tracking Technologies</h2>
                                <p>
                                    We use cookies and similar technologies to enhance your browsing experience, analyze website traffic, and gather information about your preferences and interactions with our website. You have the option to disable cookies through your browser settings, but this may limit certain features and functionality of our website.
                                </p>
                            </section>

                            <section>
                                <h2 className="font-teko text-3xl text-white mb-4 uppercase tracking-wider">Changes to the Privacy Policy</h2>
                                <p>
                                    We reserve the right to update or modify this Privacy Policy at any time. Any changes will be posted on this page with a revised "last updated" date. We encourage you to review this Privacy Policy periodically to stay informed about how we collect, use, and protect your information.
                                </p>
                            </section>

                            <section>
                                <h2 className="font-teko text-3xl text-white mb-4 uppercase tracking-wider">Contact Us</h2>
                                <p>
                                    If you have any questions, concerns, or requests regarding our Privacy Policy or the handling of your personal information, please contact us using the information provided on our website.
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
