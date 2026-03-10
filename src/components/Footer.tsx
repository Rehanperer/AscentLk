import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="py-12 border-t border-white/5 text-center relative z-10 w-full bg-[#0d121f]/50 backdrop-blur-xl">
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 text-[10px] md:text-xs text-white/40 font-medium tracking-wide uppercase mb-8">
                <a href="https://www.instagram.com/ascent_2026/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
                <Link to="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link>
                <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
                <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
            <div className="text-[10px] text-white/40 font-inter tracking-wider space-y-2">
                <div>© 2026 ASCENT ESPORTS. ALL RIGHTS RESERVED.</div>
                <div className="text-[9px] text-[#ff4655]/60 tracking-[0.3em] font-mono select-none">
                    DESIGNED & DEVELOPED BY <span className="text-white/80">REHAN PERERA</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
