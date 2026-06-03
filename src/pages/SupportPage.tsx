import React, { useEffect } from 'react';
import { Mail, User, Phone, Terminal, ChevronRight, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import ModernNavbar from '../components/Home/ModernNavbar';
import Footer from '../components/Footer';

const SupportPage: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const contacts = [
        {
            icon: <Mail className="w-6 h-6 text-[#ff4655]" />,
            label: "Comms Channel",
            value: "ascent2026s@gmail.com",
            action: "mailto:ascent2026s@gmail.com"
        },
        {
            icon: <Phone className="w-6 h-6 text-[#ff4655]" />,
            label: "Direct Line",
            value: "+94 76 003 4101",
            action: "tel:+94760034101"
        },
        {
            icon: <User className="w-6 h-6 text-[#ff4655]" />,
            label: "Event Coordinator",
            value: "Ethan Peter",
            action: null
        }
    ];

    return (
        <div className="min-h-screen bg-[#040814] text-white flex flex-col relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('/img/grid.svg')] opacity-[0.05] pointer-events-none mix-blend-overlay" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#ff4655]/10 rounded-full blur-[120px] pointer-events-none z-0" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#ff4655]/5 rounded-full blur-[100px] pointer-events-none z-0" />
            
            <ModernNavbar />

            <div className="flex-grow pt-32 pb-20 relative z-10 container mx-auto px-6 md:px-12 flex flex-col items-center justify-center min-h-[80vh]">
                
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16 relative"
                >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-20">
                        <HelpCircle className="w-32 h-32 text-[#ff4655] blur-sm" />
                    </div>
                    
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-[#ff4655]/30 bg-[#ff4655]/10 text-[#ff4655] font-mono text-xs uppercase tracking-[0.2em] mb-6 shadow-[0_0_15px_rgba(255,70,85,0.2)]">
                        <Terminal className="w-3.5 h-3.5" />
                        <span>Support Protocol Activated</span>
                    </div>
                    
                    <h1 className="font-teko text-6xl md:text-8xl font-bold uppercase tracking-wider mb-4 drop-shadow-[0_0_20px_rgba(255,70,85,0.3)]">
                        Need <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4655] to-[#ff8c95]">Backup?</span>
                    </h1>
                    
                    <p className="text-white/60 font-mono text-sm md:text-base max-w-xl mx-auto">
                        If you're facing technical difficulties, transmission errors, or need operational guidance, contact our command center below.
                    </p>
                </motion.div>

                {/* Contact Cards */}
                <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                    
                    {/* Decorative connecting lines for desktop */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff4655]/20 to-transparent -translate-y-1/2 z-0" />

                    {contacts.map((contact, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            className="relative z-10 group"
                        >
                            {/* Card Wrapper */}
                            <div className="relative h-full bg-[#0d121f]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-[#ff4655]/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,70,85,0.15)] flex flex-col items-center text-center overflow-hidden">
                                
                                {/* Hover Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-b from-[#ff4655]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                
                                {/* Icon Container */}
                                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-[#ff4655]/30 transition-all duration-500 relative">
                                    <div className="absolute inset-0 rounded-full bg-[#ff4655] opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-500" />
                                    {contact.icon}
                                </div>
                                
                                <h3 className="font-mono text-xs text-white/50 uppercase tracking-[0.2em] mb-3">
                                    {contact.label}
                                </h3>
                                
                                {contact.action ? (
                                    <a 
                                        href={contact.action}
                                        className="font-mono text-lg md:text-xl font-bold text-white hover:text-[#ff4655] transition-colors duration-300 break-all"
                                    >
                                        {contact.value}
                                    </a>
                                ) : (
                                    <p className="font-mono text-lg md:text-xl font-bold text-white">
                                        {contact.value}
                                    </p>
                                )}

                                {/* Action Indicator */}
                                {contact.action && (
                                    <div className="mt-6 flex items-center gap-2 text-[10px] text-[#ff4655] font-mono uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                                        <span>Initialize</span>
                                        <ChevronRight className="w-3 h-3" />
                                    </div>
                                )}
                                
                                {/* Geometric Accents */}
                                <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-white/5 group-hover:border-[#ff4655]/40 transition-colors duration-500 rounded-tl-2xl" />
                                <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-white/5 group-hover:border-[#ff4655]/40 transition-colors duration-500 rounded-br-2xl" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Additional Info / Footer Note */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="mt-20 text-center font-mono text-[10px] text-white/40 tracking-[0.2em] uppercase max-w-2xl border-t border-white/5 pt-8"
                >
                    <p>Response times may vary based on server load and current operations.</p>
                    <p className="mt-2 text-[#ff4655]/60">Expected SLA: T+24 Hours</p>
                </motion.div>
            </div>

            <Footer />
        </div>
    );
};

export default SupportPage;
