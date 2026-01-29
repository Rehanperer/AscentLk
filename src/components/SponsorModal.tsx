import React, { useState } from 'react';
import { X, Handshake } from 'lucide-react';

interface SponsorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SponsorModal: React.FC<SponsorModalProps> = ({ isOpen, onClose }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const formData = new FormData(e.target as HTMLFormElement);
        const data = {
            formType: 'PARTNERSHIP INQUIRY',
            fullName: formData.get('fullName'),
            company: formData.get('company'),
            email: formData.get('email'),
            role: formData.get('role'),
            message: formData.get('message'),
            submittedAt: new Date().toISOString(),
        };

        try {
            const response = await fetch('https://ascent-forms-api.ascent2026s.workers.dev', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Failed to send inquiry. Please try again.');

            setIsSubmitted(true);
            setTimeout(() => {
                onClose();
                setTimeout(() => {
                    setIsSubmitted(false);
                    setIsSubmitting(false);
                }, 300);
            }, 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
            setIsSubmitting(false);
        }
    };

    return (
        <div className={`modal-overlay modal-sponsor ${isOpen ? 'open' : ''}`} onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal-content angled-box relative">
                <div className="absolute top-4 right-4 text-white cursor-pointer hover:text-[#eec758] transition-colors" onClick={onClose}>
                    <X size={24} />
                </div>

                {!isSubmitted ? (
                    <>
                        <div className="text-center mb-6">
                            <div className="inline-block px-2 py-0.5 bg-[#eec758] text-black text-[10px] font-bold tracking-widest mb-2">PARTNERSHIP</div>
                            <h2 className="font-teko text-5xl text-[#eec758] leading-none">JOIN THE ALLIANCE</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs uppercase tracking-widest mb-2 opacity-70 text-[#eec758]">Full Name</label>
                                    <input type="text" name="fullName" required className="vct-input interactive-element" />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-widest mb-2 opacity-70 text-[#eec758]">Company</label>
                                    <input type="text" name="company" required className="vct-input interactive-element" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs uppercase tracking-widest mb-2 opacity-70 text-[#eec758]">Email</label>
                                    <input type="email" name="email" required className="vct-input interactive-element" />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-widest mb-2 opacity-70 text-[#eec758]">Role / Position</label>
                                    <input type="text" name="role" required className="vct-input interactive-element" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-widest mb-2 opacity-70 text-[#eec758]">Message (Optional)</label>
                                <textarea name="message" rows={2} className="vct-input interactive-element"></textarea>
                            </div>
                            {error && <p className="text-[#ff4655] text-xs font-mono">{error}</p>}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="border border-[#eec758] text-[#eec758] py-3 font-teko text-xl font-bold angled-btn hover:bg-[#eec758] hover:text-black transition-colors mt-2 interactive-element disabled:opacity-50 disabled:cursor-wait"
                            >
                                {isSubmitting ? 'SENDING...' : 'SEND INQUIRY'}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="success-message mt-4 text-center py-10">
                        <Handshake className="text-[#eec758] w-16 h-16 mx-auto mb-4" />
                        <p className="font-teko text-3xl text-[#eec758]">INQUIRY SENT</p>
                        <p className="text-sm opacity-70 text-white font-mono">We'll get in touch within 2 days.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SponsorModal;
