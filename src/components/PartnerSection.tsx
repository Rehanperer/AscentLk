import React from 'react';
import { Instagram, Youtube, Twitch, Gamepad2 } from 'lucide-react';

interface PartnerSectionProps {
    onSponsorClick?: () => void;
    onContactClick?: () => void;
}

const DiscordIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 127.14 96.36"
        className={className}
        fill="currentColor"
    >
        <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.11,77.11,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22c2.92-23.5-5.27-48-21.85-72.15ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5.06-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
    </svg>
);

const PartnerSection: React.FC<PartnerSectionProps> = ({ onSponsorClick, onContactClick }) => {
    return (
        <section className="relative py-24 overflow-hidden">
            <div className="absolute right-0 bottom-0 w-2/3 h-full bg-gradient-to-l from-[#ff4655]/10 to-transparent pointer-events-none"></div>

            <div className="z-10 w-full max-w-6xl px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center mx-auto relative">
                <div>
                    <h2 className="font-teko text-6xl md:text-8xl font-bold uppercase leading-none mb-4">PARTNER<br />WITH US</h2>
                    <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-md uppercase">
                        Join the fastest growing student esports league. Elevate your brand where legends ascend.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6">
                        <button
                            className="bg-[#ff4655] text-white px-8 py-4 font-bold font-teko text-2xl angled-btn hover:bg-white hover:text-black transition-all interactive-element relative z-20"
                            onClick={onSponsorClick}
                        >
                            SPONSOR NOW
                        </button>
                        <button
                            className="border border-white/30 text-white px-8 py-4 font-bold font-teko text-2xl angled-btn hover:bg-white hover:text-black transition-all interactive-element relative z-20"
                            onClick={onContactClick}
                        >
                            CONTACT US
                        </button>
                    </div>
                </div>

                <div className="border-l border-white/10 pl-0 md:pl-12 flex flex-col gap-8">
                    <div className="text-right">
                        <h3 className="font-teko text-4xl text-[#ff4655] mb-4">FOLLOW THE ACTION</h3>
                        <div className="flex gap-6 justify-end">
                            <a href="https://instagram.com/ascent.2026" target="_blank" rel="noopener noreferrer" className="w-12 h-12 border border-white/20 flex items-center justify-center hover:bg-[#ff4655] hover:border-[#ff4655] transition-all interactive-element angled-box">
                                <Instagram className="w-6 h-6" />
                            </a>
                            <a href="https://youtube.com/@ascent.2026" target="_blank" rel="noopener noreferrer" className="w-12 h-12 border border-white/20 flex items-center justify-center hover:bg-[#ff4655] hover:border-[#ff4655] transition-all interactive-element angled-box">
                                <Youtube className="w-6 h-6" />
                            </a>
                            <a href="#" className="w-12 h-12 border border-white/20 flex items-center justify-center hover:bg-[#ff4655] hover:border-[#ff4655] transition-all interactive-element angled-box">
                                <DiscordIcon className="w-6 h-6" />
                            </a>
                            <a href="#" className="w-12 h-12 border border-white/20 flex items-center justify-center hover:bg-[#ff4655] hover:border-[#ff4655] transition-all interactive-element angled-box">
                                <Twitch className="w-6 h-6" />
                            </a>
                        </div>
                    </div>

                    <div className="text-right mt-8">
                        <div className="text-sm font-mono opacity-50 uppercase tracking-widest mb-2">Inquiries</div>
                        <a href="mailto:ascent2026s@gmail.com" className="text-xl hover:text-[#ff4655] transition-colors interactive-element relative z-20">ascent2026s@gmail.com</a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PartnerSection;
