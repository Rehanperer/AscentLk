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
                                    Welcome to ASCENT ESPORTS. These Terms and Conditions govern your use of our website and the purchase and sale of products from our platform. By accessing and using our website, you agree to comply with these terms. Please read them carefully before proceeding with any transactions.
                                </p>
                            </section>

                            <section>
                                <h2 className="font-teko text-3xl text-white mb-4 uppercase tracking-wider">1. Use of the Website</h2>
                                <ol className="list-none space-y-4 ml-4">
                                    <li>a. You must be at least 18 years old to use our website or make purchases.</li>
                                    <li>b. You are responsible for maintaining the confidentiality of your account information, including your username and password.</li>
                                    <li>c. You agree to provide accurate and current information during the registration and checkout process.</li>
                                    <li>d. You may not use our website for any unlawful or unauthorized purposes.</li>
                                </ol>
                            </section>

                            <section>
                                <h2 className="font-teko text-3xl text-white mb-4 uppercase tracking-wider">2. Product Information and Pricing</h2>
                                <ol className="list-none space-y-4 ml-4">
                                    <li>a. We strive to provide accurate product descriptions, images, and pricing information. However, we do not guarantee the accuracy or completeness of such information.</li>
                                    <li>b. Prices are subject to change without notice. Any promotions or discounts are valid for a limited time and may be subject to additional terms and conditions.</li>
                                </ol>
                            </section>

                            <section>
                                <h2 className="font-teko text-3xl text-white mb-4 uppercase tracking-wider">3. Orders and Payments</h2>
                                <ol className="list-none space-y-4 ml-4">
                                    <li>a. By placing an order on our website, you are making an offer to purchase the selected products.</li>
                                    <li>b. We reserve the right to refuse or cancel any order for any reason, including but not limited to product availability, errors in pricing or product information, or suspected fraudulent activity.</li>
                                    <li>c. You agree to provide valid and up-to-date payment information and authorize us to charge the total order amount, including applicable taxes and shipping fees, to your chosen payment method.</li>
                                    <li>d. We use trusted third-party payment processors to handle your payment information securely. We do not store or have access to your full payment details.</li>
                                </ol>
                            </section>

                            <section>
                                <h2 className="font-teko text-3xl text-white mb-4 uppercase tracking-wider">4. Shipping and Delivery</h2>
                                <ol className="list-none space-y-4 ml-4">
                                    <li>a. We will make reasonable efforts to ensure timely shipping and delivery of your orders.</li>
                                    <li>b. Shipping and delivery times provided are estimates and may vary based on your location and other factors.</li>
                                </ol>
                            </section>

                            <section>
                                <h2 className="font-teko text-3xl text-white mb-4 uppercase tracking-wider">5. Returns and Refunds</h2>
                                <p>
                                    Our Returns and Refund Policy governs the process and conditions for returning products and seeking refunds. Please refer to the policy provided on our website for more information.
                                </p>
                            </section>

                            <section>
                                <h2 className="font-teko text-3xl text-white mb-4 uppercase tracking-wider">6. Intellectual Property</h2>
                                <ol className="list-none space-y-4 ml-4">
                                    <li>a. All content and materials on our website, including but not limited to text, images, logos, and graphics, are protected by intellectual property rights and are the property of ASCENT ESPORTS or its licensors.</li>
                                    <li>b. You may not use, reproduce, distribute, or modify any content from our website without our prior written consent.</li>
                                </ol>
                            </section>

                            <section>
                                <h2 className="font-teko text-3xl text-white mb-4 uppercase tracking-wider">7. Limitation of Liability</h2>
                                <ol className="list-none space-y-4 ml-4">
                                    <li>a. In no event shall ASCENT ESPORTS, its directors, employees, or affiliates be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in connection with your use of our website or the purchase and use of our products.</li>
                                    <li>b. We make no warranties or representations, express or implied, regarding the quality, accuracy, or suitability of the products offered on our website.</li>
                                </ol>
                            </section>

                            <section>
                                <h2 className="font-teko text-3xl text-white mb-4 uppercase tracking-wider">8. Amendments and Termination</h2>
                                <p>
                                    We reserve the right to modify, update, or terminate these Terms and Conditions at any time without prior notice. It is your responsibility to review these terms periodically for any changes.
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
