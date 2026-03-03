import React, { useState, useCallback, useEffect, useRef } from 'react';
import SeatPicker from './SeatPicker';
import BookingSummary from './BookingSummary';
import TicketRegistrationModal from './TicketRegistrationModal';
import { Ticket, Info, ChevronRight, Layers, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLevelCapacity } from '../../utils/SeatingEngine';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import '../../styles/tickets.css';

const HOLD_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

const TicketsPage: React.FC = () => {
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [heldSeats, setHeldSeats] = useState<string[]>([]);
    const [bookedSeats, setBookedSeats] = useState<string[]>([]);
    const [activeLevel, setActiveLevel] = useState<'Ground' | 'Balcony' | 'Deck'>('Ground');
    const navigate = useNavigate();
    const holdTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

    // 1. Fetch initial state & Subscribe to Realtime
    useEffect(() => {
        const fetchInitialSeats = async () => {
            const { data, error } = await supabase.from('seats').select('*');
            if (data && !error) {
                const booked = data.filter(s => s.status === 'booked').map(s => s.id);
                const held = data.filter(s => s.status === 'held').map(s => s.id);
                setBookedSeats(booked);
                setHeldSeats(held);
            }
        };

        fetchInitialSeats();

        // Subscribe to changes
        const channel = supabase
            .channel('seat_updates')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'seats' }, (payload: any) => {
                const { new: newSeat, old: oldSeat } = payload;

                if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
                    if (newSeat.status === 'booked') {
                        setBookedSeats(prev => [...new Set([...prev, newSeat.id])]);
                        setHeldSeats(prev => prev.filter(id => id !== newSeat.id));
                    } else if (newSeat.status === 'held') {
                        setHeldSeats(prev => [...new Set([...prev, newSeat.id])]);
                        setBookedSeats(prev => prev.filter(id => id !== newSeat.id));
                    } else if (newSeat.status === 'available') {
                        setBookedSeats(prev => prev.filter(id => id !== newSeat.id));
                        setHeldSeats(prev => prev.filter(id => id !== newSeat.id));
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

    const startHoldTimer = useCallback((seatId: string) => {
        const timer = setTimeout(async () => {
            // Revert status in DB if not booked
            const { data } = await supabase.from('seats').select('status').eq('id', seatId).single();
            if (data?.status === 'held') {
                await supabase.from('seats').update({ status: 'available' }).eq('id', seatId);
            }
            setSelectedSeats(prev => prev.filter(id => id !== seatId));
            holdTimers.current.delete(seatId);
        }, HOLD_TIMEOUT_MS);
        holdTimers.current.set(seatId, timer);
    }, []);

    const clearHoldTimer = useCallback((seatId: string) => {
        const timer = holdTimers.current.get(seatId);
        if (timer) {
            clearTimeout(timer);
            holdTimers.current.delete(seatId);
        }
    }, []);

    const handleSeatToggle = useCallback(async (seatId: string) => {
        const isSelected = selectedSeats.includes(seatId);

        if (isSelected) {
            // Unselect: Set available in DB
            await supabase.from('seats').update({ status: 'available' }).eq('id', seatId);
            clearHoldTimer(seatId);
            setSelectedSeats(prev => prev.filter(id => id !== seatId));
        } else {
            // Try to Hold in DB
            const { error } = await supabase
                .from('seats')
                .update({ status: 'held', held_until: new Date(Date.now() + HOLD_TIMEOUT_MS).toISOString() })
                .eq('id', seatId)
                .eq('status', 'available'); // Atomic check

            if (!error) {
                startHoldTimer(seatId);
                setSelectedSeats(prev => [...prev, seatId]);
            } else {
                console.error("Seat already taken or error occurred");
            }
        }
    }, [selectedSeats, startHoldTimer, clearHoldTimer]);

    useEffect(() => {
        return () => {
            holdTimers.current.forEach(timer => clearTimeout(timer));
        };
    }, []);

    const levels = ['Ground', 'Balcony', 'Deck'] as const;

    return (
        <div className="tickets-page">
            <div className="tickets-container">
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
                                    { label: 'Held', color: '#f59e0b' },
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
                                        heldSeats={heldSeats}
                                        bookedSeats={bookedSeats}
                                        onSeatToggle={handleSeatToggle}
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className="tickets-footer font-mono text-[11px] opacity-70">
                            <Info size={14} className="mr-2 text-[#ff4655]" />
                            <span>Select seats to lock reservation • Auto-release after 5 minutes</span>
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
            </div>
        </div>
    );
};

export default TicketsPage;
