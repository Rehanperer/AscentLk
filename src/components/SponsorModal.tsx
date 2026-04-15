import React, { useState } from 'react';
import { X, Handshake, Target, Shield, Terminal, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '../hooks/useAudio';

interface SponsorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const HUDBrackets = () => (
    <>
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#ff4655] -translate-x-1 -translate-y-1 opacity-50" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#ff4655] translate-x-1 -translate-y-1 opacity-50" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#ff4655] -translate-x-1 translate-y-1 opacity-50" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#ff4655] translate-x-1 translate-y-1 opacity-50" />
    </>
);

const Scanlines = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-2 bg-[length:100%_4px,3px_100%]" />
        <div className="absolute inset-0 bg-[rgba(18,16,16,0.1)] animate-[pulse_5s_ease-in-out_infinite]" />
    </div>
);

const SponsorModal: React.FC<SponsorModalProps> = ({ isOpen, onClose }) => {
    const { playHover, playClick, playSuccess } = useAudio();
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

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Connection failed. Please re-establish uplink.');
            }

            playSuccess();
            setIsSubmitted(true);
            setTimeout(() => {
                onClose();
                setTimeout(() => {
                    setIsSubmitted(false);
                    setIsSubmitting(false);
                }, 300);
            }, 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Uplink synchronization error.');
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div 
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
                    onClick={(e) => e.target === e.currentTarget && onClose()}
                >
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-[#08080a]/90 backdrop-blur-xl" 
                    />

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-2xl bg-[#0d121f]/80 border border-white/5 p-1 px-1 overflow-hidden group shadow-2xl"
                    >
                        <Scanlines />
                        
                        <div className="relative bg-[#0d121f] border border-white/10 p-6 md:p-12">
                            <HUDBrackets />

                            {/* Status Bar */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#ff4655]/40 to-transparent" />
                            
                            <div className="absolute top-4 right-4 z-50">
                                <motion.button
                                    whileHover={{ scale: 1.1, color: '#ff4655' }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={onClose}
                                    className="text-white/40 hover:text-white transition-colors"
                                >
                                    <X size={24} strokeWidth={1.5} />
                                </motion.button>
                            </div>

                            {!isSubmitted ? (
                                <div className="relative">
                                    <div className="mb-8">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-1.5 h-1.5 bg-[#ff4655] animate-pulse" />
                                            <span className="font-mono text-[10px] tracking-[0.4em] text-white/40 uppercase">Secure_Uplink_Established</span>
                                        </div>
                                        <h2 className="font-teko text-4xl md:text-7xl font-bold text-white uppercase leading-none mb-4">
                                            Initialize <span className="text-[#ff4655]">Alliance</span>
                                        </h2>
                                        <p className="font-mono text-[10px] text-white/30 tracking-widest uppercase">
                                            Decrypting strategic partnership protocols...
                                        </p>
                                    </div>

                                    <form onSubmit={(e) => { playClick(); handleSubmit(e); }} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="block font-mono text-[9px] text-white/40 tracking-[0.2em] uppercase">Operator_Full_Name</label>
                                                <input
                                                    type="text"
                                                    name="fullName"
                                                    required
                                                    onMouseEnter={() => playHover()}
                                                    className="w-full bg-white/[0.02] border border-white/10 py-3 px-4 md:py-4 font-mono text-base md:text-xs text-white outline-none focus:border-[#ff4655]/50 focus:bg-[#ff4655]/5 transition-all"
                                                    placeholder="NAME_REQUIRED"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block font-mono text-[9px] text-white/40 tracking-[0.2em] uppercase">Organization_Entity</label>
                                                <input
                                                    type="text"
                                                    name="company"
                                                    required
                                                    onMouseEnter={() => playHover()}
                                                    className="w-full bg-white/[0.02] border border-white/10 py-3 px-4 md:py-4 font-mono text-base md:text-xs text-white outline-none focus:border-[#ff4655]/50 focus:bg-[#ff4655]/5 transition-all"
                                                    placeholder="ENTITY_ID"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="block font-mono text-[9px] text-white/40 tracking-[0.2em] uppercase">Communications_Link</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    required
                                                    onMouseEnter={() => playHover()}
                                                    className="w-full bg-white/[0.02] border border-white/10 py-3 px-4 md:py-4 font-mono text-base md:text-xs text-white outline-none focus:border-[#ff4655]/50 focus:bg-[#ff4655]/5 transition-all"
                                                    placeholder="EMAIL_ADDRESS"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block font-mono text-[9px] text-white/40 tracking-[0.2em] uppercase">Operational_Role</label>
                                                <input
                                                    type="text"
                                                    name="role"
                                                    required
                                                    onMouseEnter={() => playHover()}
                                                    className="w-full bg-white/[0.02] border border-white/10 py-3 px-4 md:py-4 font-mono text-base md:text-xs text-white outline-none focus:border-[#ff4655]/50 focus:bg-[#ff4655]/5 transition-all"
                                                    placeholder="CURRENT_POSITION"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block font-mono text-[9px] text-white/40 tracking-[0.2em] uppercase">Message_Payload (Opt)</label>
                                            <textarea
                                                name="message"
                                                rows={3}
                                                onMouseEnter={() => playHover()}
                                                className="w-full bg-white/[0.02] border border-white/10 p-4 font-mono text-xs text-white outline-none focus:border-[#ff4655]/50 focus:bg-[#ff4655]/5 transition-all resize-none"
                                                placeholder="ENTER_DATA_HERE..."
                                            ></textarea>
                                        </div>

                                        {error && (
                                            <motion.div 
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="bg-[#ff4655]/10 border border-[#ff4655]/20 p-3 text-[#ff4655] text-[10px] font-mono tracking-widest uppercase flex items-center gap-3"
                                            >
                                                <X size={14} /> {error}
                                            </motion.div>
                                        )}

                                        <motion.button
                                            type="submit"
                                            disabled={isSubmitting}
                                            onMouseEnter={() => playHover()}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full bg-[#ff4655] py-4 text-white font-teko text-2xl font-bold tracking-[0.3em] uppercase hover:bg-[#ff4655]/90 transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-wait"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Terminal size={20} className="animate-pulse" /> Syncing_Link...
                                                </>
                                            ) : (
                                                <>
                                                    <Zap size={20} /> Transmit_Data
                                                </>
                                            )}
                                        </motion.button>
                                    </form>
                                </div>
                            ) : (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="py-20 text-center flex flex-col items-center"
                                >
                                    <div className="relative mb-8">
                                        <div className="absolute inset-0 bg-[#ff4655]/20 blur-xl rounded-full" />
                                        <Handshake className="text-[#ff4655] w-20 h-20 relative z-10" strokeWidth={1} />
                                    </div>
                                    <h3 className="font-teko text-5xl text-white font-bold uppercase mb-4 tracking-widest">Transmission_Confirmed</h3>
                                    <div className="space-y-2">
                                        <p className="text-white/40 font-mono text-[10px] uppercase tracking-[0.2em]">Data_Packet_Received // HQ_Notified</p>
                                        <p className="text-white/20 font-mono text-[9px] uppercase tracking-[0.1em]">Expected_Response_Window // 48_Hours</p>
                                    </div>
                                    <div className="mt-8 flex gap-2">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-1.5 h-1.5 bg-[#ff4655] rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                            
                            {/* HUD Decorative Numbers */}
                            <div className="absolute bottom-4 right-4 font-mono text-[8px] text-white/10 tracking-[0.4em] select-none">
                                SEC_LVL_4 // {new Date().getFullYear()}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SponsorModal;

