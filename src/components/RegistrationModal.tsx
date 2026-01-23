import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';

interface RegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({ isOpen, onClose, title = "SECURE YOUR SPOT" }) => {
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
        setTimeout(() => {
            onClose();
            // Reset after closing
            setTimeout(() => setIsSubmitted(false), 300);
        }, 3000);
    };

    return (
        <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal-content angled-box relative overflow-hidden">
                {/* Decorative accent line */}
                <div className="absolute top-0 left-0 w-1 h-full bg-[#ff4655]"></div>

                <div className="absolute top-4 right-4 text-white cursor-pointer hover:text-[#ff4655] transition-colors" onClick={onClose}>
                    <X size={24} />
                </div>

                {!isSubmitted ? (
                    <>
                        <h2 className="font-teko text-4xl text-white mb-6 border-b border-white/10 pb-2 pl-4">
                            {title}
                        </h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5 pl-4">
                            <div>
                                <label className="block text-xs uppercase tracking-widest mb-2 opacity-70 text-[#ff4655] font-bold">Full Name</label>
                                <input type="text" required className="vct-input interactive-element" placeholder="Jett Windwalker" />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-widest mb-2 opacity-70 text-[#ff4655] font-bold">Email Address</label>
                                <input type="email" required className="vct-input interactive-element" placeholder="agent@valorant.com" />
                            </div>
                            <button type="submit" className="bg-[#ff4655] text-white py-3 font-teko text-xl font-bold angled-btn hover:bg-white hover:text-black transition-colors mt-4 interactive-element">
                                CONFIRM REGISTRATION
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="success-message mt-4 text-center py-10">
                        <CheckCircle className="text-[#ff4655] w-16 h-16 mx-auto mb-4" />
                        <p className="font-teko text-3xl text-white">RECEIVED</p>
                        <p className="text-sm opacity-70 font-mono">We'll get in touch within 2 days.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RegistrationModal;
