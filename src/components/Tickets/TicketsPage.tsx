import React, { useState, useCallback, useEffect, useRef } from 'react';
import SeatPicker from './SeatPicker';
import BookingSummary from './BookingSummary';
import TicketRegistrationModal from './TicketRegistrationModal';
import { Ticket, Info, ChevronRight, Layers, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLevelCapacity } from '../../utils/SeatingEngine';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Footer from '../Footer';
import SEO from '../SEO';
import '../../styles/tickets.css';

const TicketsPage: React.FC = () => {
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [bookedSeats, setBookedSeats] = useState<string[]>([]);
    const [activeLevel, setActiveLevel] = useState<'Ground' | 'Balcony' | 'Deck'>('Ground');
    const navigate = useNavigate();

    // 1. Fetch initial state & Subscribe to Realtime
    useEffect(() => {
        const fetchInitialSeats = async () => {
            const { data, error } = await supabase.from('seats').select('*');
            if (data && !error) {
                const booked = data.filter(s => s.status === 'booked').map(s => s.id);
                setBookedSeats(booked);
            }
        };

        fetchInitialSeats();

        // Subscribe to changes
        const channel = supabase
            .channel('seat_updates')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'seats' }, (payload: any) => {
                const { new: newSeat } = payload;

                if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
                    if (newSeat.status === 'booked') {
                        setBookedSeats(prev => [...new Set([...prev, newSeat.id])]);
                    } else if (newSeat.status === 'available') {
                        setBookedSeats(prev => prev.filter(id => id !== newSeat.id));
                    }
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const capacities: Record<string, number> = {
        Ground: getLevelCapacity('Ground'),
        Balcony: getLevelCapacity('Balcony'),
        Deck: getLevelCapacity('Deck'),
    };

    const grandTotalCapacity = Object.values(capacities).reduce((a, b) => a + b, 0);

    const handleSeatToggle = useCallback((seatId: string) => {
        setSelectedSeats(prev =>
            prev.includes(seatId)
                ? prev.filter(id => id !== seatId)
                : [...prev, seatId]
        );
    }, []);

    const levels = ['Ground', 'Balcony', 'Deck'] as const;

    return (
        <div className="tickets-page bg-atmospheric min-h-screen relative overflow-hidden">
            <SEO 
                title="Book Tickets | ASCENT 2026" 
                description="Secure your seats for the ASCENT 2026 Grand Finals at Lumina Ballroom. Interactive seat map and instant booking." 
                path="/tickets"
            />
            {/* Atmospheric Background & Pulsing Orb */}

            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#ff4655]/10 rounded-full blur-[150px] anim-pulse-slow" />
                <div className="absolute inset-0 bg-grid opacity-5" />
            </div>

            <div className="tickets-container relative z-10">
                {/* Back to main site */}
                <Link to="/" className="tickets-back-link">
                    <ArrowLeft size={18} />
                    <span>RETURN TO ASCENT</span>
                </Link>

                {/* Header */}
                <header className="tickets-header">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="tickets-badge-group">
                            <div className="tickets-badge tickets-badge--primary">
                                <Ticket size={12} className="mr-1" />
                                Interactive Seating Map
                            </div>
                            <div className="tickets-badge tickets-badge--capacity font-mono">
                                Venue Capacity: {grandTotalCapacity}
                            </div>
                        </div>

                        <h1 className="tickets-title font-teko text-white">
                            Royal Institute <br />
                            <span style={{ color: 'var(--t-primary)' }}>Seating Experience</span>
                        </h1>
                    </motion.div>
                </header>

                {/* Level Selector */}
                <nav className="tickets-nav">
                    <div className="tickets-switcher">
                        {levels.map(level => {
                            const isActive = activeLevel === level;
                            return (
                                <button
                                    key={level}
                                    onClick={() => setActiveLevel(level)}
                                    className={`tickets-tab ${isActive ? 'tickets-tab--active' : ''}`}
                                >
                                    <span>{level}</span>
                                    <span className="tickets-tab__cap font-mono ml-4 opacity-50 text-xs">// {capacities[level]} Seats</span>
                                </button>
                            );
                        })}
                    </div>
                </nav>

                <div className="tickets-layout">
                    <main className="tickets-picker">
                        <div className="tickets-picker__header border-b border-white/5 pb-4 mb-4">
                            <div className="tickets-picker__title-group">
                                <h2 className="font-teko text-2xl">{activeLevel} Floor</h2>
                                <p className="font-mono text-xs opacity-60">Status: Select your preferred seat</p>
                            </div>

                            <div className="tickets-legend">
                                {[
                                    { label: 'Available', color: '#ff4655' },
                                    { label: 'Selected', color: '#00ff88' },
                                    { label: 'Booked', color: 'rgba(255,255,255,0.1)' },
                                ].map(item => (
                                    <div key={item.label} className="tickets-legend__item font-mono text-[10px]">
                                        <div className="tickets-legend__swatch" style={{ background: item.color }} />
                                        <span>{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="tickets-picker__content">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeLevel}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.02 }}
                                    transition={{ duration: 0.2 }}
                                    className="tickets-picker__view"
                                >
                                    <SeatPicker
                                        activeLevel={activeLevel}
                                        selectedSeats={selectedSeats}
                                        bookedSeats={bookedSeats}
                                        onSeatToggle={handleSeatToggle}
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className="tickets-footer font-mono text-[11px] opacity-70">
                            <Info size={14} className="mr-2 text-[#ff4655]" />
                            <span>Select seats to include in your order manifesto.</span>
                            {selectedSeats.length > 0 && (
                                <span className="ml-auto text-[#ff4655] font-bold">{selectedSeats.length} Seats Selected</span>
                            )}
                        </div>
                    </main>

                    <aside className="tickets-summary">
                        <BookingSummary
                            selectedSeats={selectedSeats}
                            onCheckout={() => navigate('/checkout', { state: { selectedSeats } })}
                        />
                    </aside>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default TicketsPage;
