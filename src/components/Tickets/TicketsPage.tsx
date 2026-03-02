import React, { useState, useCallback, useEffect, useRef } from 'react';
import SeatPicker from './SeatPicker';
import BookingSummary from './BookingSummary';
import { Ticket, Info, ChevronRight, Layers, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLevelCapacity } from '../../utils/SeatingEngine';
import { Link } from 'react-router-dom';
import '../../styles/tickets.css';

const HOLD_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

const TicketsPage: React.FC = () => {
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [heldSeats, setHeldSeats] = useState<string[]>([]);
    const [bookedSeats] = useState<string[]>([]);
    const [activeLevel, setActiveLevel] = useState<'Ground' | 'Balcony' | 'Deck'>('Ground');
    const holdTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

    const capacities: Record<string, number> = {
        Ground: getLevelCapacity('Ground'),
        Balcony: getLevelCapacity('Balcony'),
        Deck: getLevelCapacity('Deck'),
    };

    const grandTotalCapacity = Object.values(capacities).reduce((a, b) => a + b, 0);

    const startHoldTimer = useCallback((seatId: string) => {
        const timer = setTimeout(() => {
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

    const handleSeatToggle = useCallback((seatId: string) => {
        setSelectedSeats(prev => {
            if (prev.includes(seatId)) {
                clearHoldTimer(seatId);
                return prev.filter(id => id !== seatId);
            } else {
                startHoldTimer(seatId);
                return [...prev, seatId];
            }
        });
    }, [startHoldTimer, clearHoldTimer]);

    useEffect(() => {
        return () => {
            holdTimers.current.forEach(timer => clearTimeout(timer));
        };
    }, []);

    const levels = ['Ground', 'Balcony', 'Deck'] as const;

    return (
        <div className="tickets-page">
            {/* Back to main site */}
            <Link to="/" className="tickets-back-link">
                <ArrowLeft size={16} />
                <span>Back to ASCENT</span>
            </Link>

            {/* Header */}
            <header className="tickets-header">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="tickets-badge-group">
                        <div className="tickets-badge tickets-badge--primary">
                            <Ticket size={14} />
                            Live Event Experience
                        </div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="tickets-badge tickets-badge--capacity"
                        >
                            <span className="tickets-badge__label">Total Venue Capacity:</span>
                            <span className="tickets-badge__value">{grandTotalCapacity} SEATS</span>
                        </motion.div>
                    </div>

                    <h1 className="tickets-title">
                        Royal Institute <br />
                        <span className="tickets-title__accent">Seating Experience</span>
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
                                {isActive && (
                                    <motion.div layoutId="tickets-nav-indicator" className="tickets-tab__indicator" />
                                )}
                                <Layers size={14} />
                                <span>{level}</span>
                                <span className="tickets-tab__cap">{capacities[level]}</span>
                            </button>
                        );
                    })}
                </div>
            </nav>

            <div className="tickets-layout">
                <main className="tickets-picker">
                    <div className="tickets-picker__header">
                        <div className="tickets-picker__title-group">
                            <h2>{activeLevel} Floor</h2>
                            <p>Interactive Seat Map <ChevronRight size={12} /> {activeLevel} Level</p>
                        </div>

                        <div className="tickets-legend">
                            {[
                                { label: 'Available', color: '#ef4444' },
                                { label: 'Selected', color: '#00ff88' },
                                { label: 'Held', color: '#f59e0b' },
                                { label: 'Booked', color: '#1e293b' },
                            ].map(item => (
                                <div key={item.label} className="tickets-legend__item">
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
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.25 }}
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

                    <div className="tickets-footer">
                        <Info size={14} />
                        <span>Click seats to select • Auto-hold for 5 min</span>
                        {selectedSeats.length > 0 && (
                            <span className="tickets-footer__count">{selectedSeats.length} selected</span>
                        )}
                    </div>
                </main>

                <aside className="tickets-summary">
                    <BookingSummary selectedSeats={selectedSeats} />
                </aside>
            </div>
        </div>
    );
};

export default TicketsPage;
