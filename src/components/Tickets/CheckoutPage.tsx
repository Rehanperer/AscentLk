import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
    ArrowLeft,
    CreditCard,
    ShieldCheck,
    User,
    Mail,
    Phone,
    School,
    CheckCircle,
    Loader2,
    Ticket,
    AlertCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAudio } from '../../hooks/useAudio';
import Footer from '../Footer';

const CheckoutPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { playClick, playHover, playSuccess } = useAudio();

    // Get selected seats from location state
    const selectedSeats = location.state?.selectedSeats || [];

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [transactionId, setTransactionId] = useState('');

    // Form states
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        school: ''
    });

    const [seatDetails, setSeatDetails] = useState<any[]>([]);

    // 1. Fetch seat details (including prices) from DB
    useEffect(() => {
        if (selectedSeats.length > 0) {
            const fetchDetails = async () => {
                const { data } = await supabase
                    .from('seats')
                    .select('id, level, section, row, num, price')
                    .in('id', selectedSeats);
                if (data) setSeatDetails(data);
            };
            fetchDetails();
        }
    }, [selectedSeats]);

    const totalPrice = seatDetails.reduce((sum, s) => sum + (s.price || 750), 0);

    // Redirect if no seats selected (to prevent accidental direct access)
    useEffect(() => {
        if (!isSubmitted && selectedSeats.length === 0) {
            // Give a small delay to see if they just refreshed
            const timer = setTimeout(() => {
                if (selectedSeats.length === 0) navigate('/tickets');
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [selectedSeats, navigate, isSubmitted]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value.toUpperCase() }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedSeats.length === 0) return;

        setIsSubmitting(true);
        setError(null);

        try {
            // 1. Double check if seats are still "held" or available (atomic-ish)
            const { data: currentSeats } = await supabase
                .from('seats')
                .select('id, status')
                .in('id', selectedSeats);

            const unavailable = currentSeats?.filter(s => s.status === 'booked');
            if (unavailable && unavailable.length > 0) {
                throw new Error(`SOME_SEATS_ALREADY_BOOKED: ${unavailable.map(s => s.id).join(', ')}`);
            }

            // 2. Finalize Seats
            const { error: seatError } = await supabase
                .from('seats')
                .update({
                    status: 'booked',
                    booked_by: formData.email
                })
                .in('id', selectedSeats);

            if (seatError) throw seatError;

            // 3. Create Registrations
            const regEntries = selectedSeats.map((id: string) => ({
                seat_id: id,
                full_name: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                school: formData.school,
                transaction_id: `ASCENT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
            }));

            const { error: regError } = await supabase
                .from('registrations')
                .insert(regEntries);

            if (regError) throw regError;

            // Success!
            setTransactionId(regEntries[0].transaction_id);
            playSuccess();
            setIsSubmitted(true);
            setIsSubmitting(false);

        } catch (err: any) {
            console.error("Checkout Error:", err);
            setError(err.message || 'TRANSACTION_FAILED');
            setIsSubmitting(false);
        }
    };

    if (selectedSeats.length === 0 && !isSubmitted) {
        return (
            <div className="min-h-screen bg-[#08080a] flex items-center justify-center font-mono text-[#ff4655]">
                <Loader2 className="animate-spin mr-3" /> INITIALIZING_SECURE_CHANNEL...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-atmospheric text-white flex flex-col font-inter selection:bg-[#ff4655] selection:text-white relative overflow-hidden">
            {/* Background Accents & Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* Animated atmospheric glow orb */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#ff4655]/10 rounded-full blur-[150px] anim-pulse-slow" />

                {/* Corner Accents */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#ff4655]/10 rounded-full blur-[120px]" />

                {/* Technical Grid Accent */}
                <div className="fixed inset-0 opacity-[0.05]"
                    style={{
                        backgroundImage: 'linear-gradient(#ff4655 1px, transparent 1px), linear-gradient(90deg, #ff4655 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}
                />
            </div>

            {/* Navigation Header */}
            <header className="relative z-10 px-8 py-6 flex justify-between items-center border-b border-white/10 backdrop-blur-md">
                <Link
                    to="/tickets"
                    onMouseEnter={() => playHover()}
                    className="flex items-center gap-2 text-white/70 hover:text-white transition-colors font-mono text-xs tracking-widest"
                >
                    <ArrowLeft size={14} /> // RECALL_SELECTION
                </Link>
                <div className="font-teko text-2xl tracking-[0.2em] text-[#ff4655]">ASCENT_SECURE_PAY</div>
                <div className="flex items-center gap-3 font-mono text-[10px] text-white/60">
                    <ShieldCheck size={14} className="text-[#00ff88]" />
                    ENCRYPTION_ACTIVE
                </div>
            </header>

            <main className="flex-1 relative z-10 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 p-8 lg:p-12">

                {!isSubmitted ? (
                    <>
                        {/* Left Side: Form */}
                        <div className="lg:col-span-7 space-y-10">
                            <div>
                                <h1 className="font-teko text-6xl leading-none uppercase mb-4">Finalize_Reservation</h1>
                                <p className="font-mono text-xs text-white/60 leading-relaxed uppercase">
                                    Operator ID: ASCENT-GUEST // SECURE_ACCESS_PORTAL_V2.1 <br />
                                    Please provide accurate identification for entry authorization.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="block font-mono text-[10px] text-white/80 tracking-widest uppercase flex items-center gap-2">
                                            <User size={12} /> Legal_Identity
                                        </label>
                                        <input
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            onMouseEnter={() => playHover()}
                                            required
                                            className="w-full bg-white/5 border border-white/20 p-4 font-mono text-sm text-white focus:border-[#ff4655] outline-none transition-all placeholder:text-white/30"
                                            placeholder="ENTER_FULL_NAME..."
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="block font-mono text-[10px] text-white/80 tracking-widest uppercase flex items-center gap-2">
                                            <Phone size={12} /> Comm_Link
                                        </label>
                                        <input
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            onMouseEnter={() => playHover()}
                                            required
                                            className="w-full bg-white/5 border border-white/20 p-4 font-mono text-sm text-white focus:border-[#ff4655] outline-none transition-all placeholder:text-white/30"
                                            placeholder="ENTER_PHONE_NUMBER..."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="block font-mono text-[10px] text-white/80 tracking-widest uppercase flex items-center gap-2">
                                        <Mail size={12} /> Digital_Address
                                    </label>
                                    <input
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        onMouseEnter={() => playHover()}
                                        required
                                        className="w-full bg-white/5 border border-white/20 p-4 font-mono text-sm text-white focus:border-[#ff4655] outline-none transition-all placeholder:text-white/30"
                                        placeholder="ENTER_EMAIL_FOR_TICKET_DELIVERY..."
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="block font-mono text-[10px] text-white/80 tracking-widest uppercase flex items-center gap-2">
                                        <School size={12} /> Sector_Affiliation
                                    </label>
                                    <input
                                        name="school"
                                        value={formData.school}
                                        onChange={handleInputChange}
                                        onMouseEnter={() => playHover()}
                                        required
                                        className="w-full bg-white/5 border border-white/20 p-4 font-mono text-sm text-white focus:border-[#ff4655] outline-none transition-all placeholder:text-white/30"
                                        placeholder="ENTER_SCHOOL_OR_INSTITUTION..."
                                    />
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="bg-[#ff4655]/10 border-l-4 border-[#ff4655] p-4 font-mono text-xs text-[#ff4655]"
                                    >
                                        CRITICAL_ERROR: {error}
                                    </motion.div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    onClick={() => playClick()}
                                    className="w-full group relative overflow-hidden bg-[#ff4655] hover:bg-white text-white hover:text-black py-6 mt-4 transition-all duration-300 clip-path-angled"
                                >
                                    <span className="relative z-10 font-teko text-3xl tracking-[0.2em] flex items-center justify-center gap-4">
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="animate-spin" size={24} />
                                                PROCESSING_ORDER
                                            </>
                                        ) : (
                                            <>
                                                <CreditCard size={24} />
                                                AUTHORIZE_RESERVATION
                                            </>
                                        )}
                                    </span>
                                </button>
                            </form>
                        </div>

                        {/* Right Side: Order Summary */}
                        <div className="lg:col-span-5">
                            <div className="sticky top-12 bg-white/5 border border-white/20 p-8 clip-path-angled shadow-2xl backdrop-blur-sm">
                                <h3 className="font-teko text-2xl mb-6 flex items-center justify-between">
                                    ORDER_MANIFEST
                                    <span className="text-[#ff4655] text-sm font-mono">[0{selectedSeats.length}]</span>
                                </h3>

                                <div className="space-y-4 mb-8 max-h-64 overflow-y-auto custom-scrollbar pr-4">
                                    {seatDetails.map((seat: any) => {
                                        return (
                                            <div key={seat.id} className="flex justify-between items-center py-3 border-b border-white/10 last:border-0">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-[#ff4655]/20 border border-[#ff4655]/50 flex items-center justify-center font-mono font-bold text-[#ff4655]">
                                                        {seat.row}{seat.num}
                                                    </div>
                                                    <div>
                                                        <div className="font-teko text-lg leading-none">{seat.level}</div>
                                                        <div className="font-mono text-[9px] text-white/50 uppercase">{seat.section} SECTION</div>
                                                    </div>
                                                </div>
                                                <div className="font-mono text-xs opacity-80">RS.{(seat.price || 750).toFixed(2)}</div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="space-y-3 pt-6 border-t border-white/20">
                                    <div className="flex justify-between font-mono text-[10px] text-white/60">
                                        <span>SUBTOTAL</span>
                                        <span>RS.{totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between font-mono text-[10px] text-white/60">
                                        <span>SYSTEM_FEES</span>
                                        <span>RS.0.00</span>
                                    </div>
                                    <div className="flex justify-between items-end pt-4">
                                        <span className="font-teko text-xl">TOTAL_AUTHORIZATION</span>
                                        <span className="font-teko text-4xl text-[#ff4655]">RS.{totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="mt-8 p-4 bg-[#ff4655]/5 border border-[#ff4655]/20 text-[10px] font-mono text-white/70 leading-relaxed uppercase">
                                    <AlertCircle size={12} className="inline mr-2 text-[#ff4655]" />
                                    No payment is required for this phase. Your selection will be converted to a confirmed booking in the operations database instantly.
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    /* Success State */
                    <div className="lg:col-span-12 flex flex-col items-center justify-center py-20 text-center">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-32 h-32 bg-[#00ff88]/10 border-2 border-[#00ff88] rounded-full flex items-center justify-center mb-8 relative"
                        >
                            <CheckCircle size={64} className="text-[#00ff88]" />
                            <motion.div
                                className="absolute inset-0 border-2 border-[#00ff88] rounded-full"
                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </motion.div>

                        <h1 className="font-teko text-8xl leading-none mb-4 tracking-tighter uppercase">RESERVATION_CONFIRMED</h1>
                        <p className="font-mono text-xs text-[#00ff88] tracking-[0.4em] mb-12">// OPERATIONS_UPDATE_SUCCESSFUL</p>

                        <div className="max-w-md w-full bg-white/5 border border-white/10 p-8 clip-path-angled space-y-6">
                            <div className="text-left font-mono text-[10px] text-white/40 uppercase space-y-4">
                                <div>
                                    <label className="block mb-1">Authorization_ID</label>
                                    <div className="text-white text-lg tracking-widest">{transactionId}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-1">Manifest_Size</label>
                                        <div className="text-white">{selectedSeats.length} SEATS</div>
                                    </div>
                                    <div>
                                        <label className="block mb-1">Status</label>
                                        <div className="text-[#00ff88]">VERIFIED_SECURE</div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block mb-1">Operator</label>
                                    <div className="text-white uppercase">{formData.fullName}</div>
                                </div>
                            </div>

                            <Link
                                to="/"
                                className="block w-full bg-[#ff4655] hover:bg-white text-white hover:text-black py-4 font-teko text-2xl tracking-[0.2em] transition-all clip-path-angled"
                            >
                                RETURN_TO_SURFACE
                            </Link>
                        </div>

                        <p className="mt-12 font-mono text-[10px] text-white/20 max-w-sm leading-relaxed uppercase">
                            Your reservation has been recorded in the central database. Our operations unit will contact you via email with your digital ticket slip.
                        </p>
                    </div>
                )}
            </main>

            <Footer />

            {/* Footer Brackets */}
            <div className="fixed bottom-10 left-10 w-20 h-20 border-b-2 border-l-2 border-[#ff4655]/10 pointer-events-none" />
            <div className="fixed bottom-10 right-10 w-20 h-20 border-b-2 border-r-2 border-[#ff4655]/10 pointer-events-none" />

            <style>{`
                .clip-path-angled {
                    clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px));
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255,255,255,0.05);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #ff4655;
                }
            `}</style>
        </div>
    );
};

export default CheckoutPage;
