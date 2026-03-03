import React, { useState } from 'react';
import { X, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAudio } from '../../hooks/useAudio';
import { motion, AnimatePresence } from 'framer-motion';

interface TicketRegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedSeats: string[];
    onSuccess: () => void;
}

const TicketRegistrationModal: React.FC<TicketRegistrationModalProps> = ({
    isOpen,
    onClose,
    selectedSeats,
    onSuccess
}) => {
    const { playSuccess, playClick } = useAudio();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const formData = new FormData(e.target as HTMLFormElement);
        const fullName = formData.get('fullName') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;
        const school = formData.get('school') as string;

        try {
            // 1. Transaction-like update (simplified)
            // Update seats status to booked
            const { error: seatError } = await supabase
                .from('seats')
                .update({
                    status: 'booked',
                    booked_by: email
                })
                .in('id', selectedSeats);

            if (seatError) throw seatError;

            // 2. Insert registrations
            const registrationEntries = selectedSeats.map(seatId => ({
                seat_id: seatId,
                full_name: fullName,
                email: email,
                phone: phone,
                school: school
            }));

            const { error: regError } = await supabase
                .from('registrations')
                .insert(registrationEntries);

            if (regError) throw regError;

            playSuccess();
            setIsSubmitted(true);
            onSuccess();

            setTimeout(() => {
                onClose();
                setTimeout(() => {
                    setIsSubmitted(false);
                    setIsSubmitting(false);
                }, 500);
            }, 3000);

        } catch (err: any) {
            setError(err.message || 'Booking failed');
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-lg bg-[#0a1016] border border-white/10 p-8 clip-path-angled shadow-2xl overflow-hidden">
                {/* HUD Red Accent */}
                <div className="absolute top-0 left-0 w-full h-[3px] bg-[#ff4655]" />

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>

                {!isSubmitted ? (
                    <>
                        <h2 className="font-teko text-4xl mb-2">COMPLETE_REGISTRATION</h2>
                        <p className="font-mono text-[10px] text-[#ff4655] mb-8 tracking-widest uppercase">
                            // Securing {selectedSeats.length} Selected Seats
                        </p>

                        <form onSubmit={(e) => { playClick(); handleSubmit(e); }} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block font-teko text-lg text-white/70 mb-1">FULL_NAME</label>
                                    <input
                                        name="fullName"
                                        required
                                        className="w-full bg-white/5 border border-white/10 p-3 font-mono text-sm text-white focus:border-[#ff4655] outline-none transition-colors"
                                        placeholder="EX. REHAN PERERA"
                                    />
                                </div>
                                <div>
                                    <label className="block font-teko text-lg text-white/70 mb-1">PHONE_NUMBER</label>
                                    <input
                                        name="phone"
                                        required
                                        className="w-full bg-white/5 border border-white/10 p-3 font-mono text-sm text-white focus:border-[#ff4655] outline-none transition-colors"
                                        placeholder="EX. 077 123 4567"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-teko text-lg text-white/70 mb-1">EMAIL_ADDRESS</label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full bg-white/5 border border-white/10 p-3 font-mono text-sm text-white focus:border-[#ff4655] outline-none transition-colors"
                                    placeholder="EX. REHAN@ASCENLK.COM"
                                />
                            </div>

                            <div>
                                <label className="block font-teko text-lg text-white/70 mb-1">EDUCATIONAL_INSTITUTION</label>
                                <input
                                    name="school"
                                    required
                                    className="w-full bg-white/5 border border-white/10 p-3 font-mono text-sm text-white focus:border-[#ff4655] outline-none transition-colors"
                                    placeholder="EX. ROYAL INSTITUTE"
                                />
                            </div>

                            {error && (
                                <div className="bg-[#ff4655]/10 border-l-2 border-[#ff4655] p-3 font-mono text-[10px] text-[#ff4655]">
                                    ERROR: {error.toUpperCase()}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-[#ff4655] hover:bg-white hover:text-[#ff4655] text-white py-4 font-teko text-2xl tracking-widest transition-all clip-path-angled flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="animate-spin" size={24} />
                                        PROCESSING_ORDER
                                    </>
                                ) : (
                                    "FINALIZE_RESERVATIONS"
                                )}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="text-center py-12">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", damping: 12 }}
                        >
                            <CheckCircle size={80} className="text-[#00ff88] mx-auto mb-6" />
                        </motion.div>
                        <h2 className="font-teko text-5xl mb-2">BOOKING_CONFIRMED</h2>
                        <p className="font-mono text-xs text-white/50">
                            TRANSACTION_ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
                        </p>
                        <p className="mt-8 font-mono text-[10px] text-[#ff4655]">
                            PLEASE CHECK YOUR EMAIL FOR THE TICKET SLIP
                        </p>
                    </div>
                )}
            </div>

            <style>{`
                .clip-path-angled {
                    clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px));
                }
            `}</style>
        </div>
    );
};

export default TicketRegistrationModal;
