import React from 'react';
import { ShoppingCart, Layers, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BookingSummaryProps {
    selectedSeats: string[];
    onCheckout: () => void;
}

const getSeatInfo = (seatId: string) => {
    const [level, section, row, num] = seatId.split('-');
    const rowIdx = row.charCodeAt(0) - 65;

    let price = 750;
    let quality = 'Standard View';
    let rating = 3;

    if (level === 'Ground') {
        if (rowIdx < 4) { price = 1500; quality = 'Premium Front'; rating = 5; }
        else if (rowIdx < 9) { price = 1000; quality = 'Great View'; rating = 4; }
    } else if (level === 'Balcony') {
        if (rowIdx < 3) { price = 1200; quality = 'Balcony Front'; rating = 5; }
        else { price = 900; quality = 'High View'; rating = 4; }
    } else if (level === 'Deck') {
        price = 600; quality = 'Distant View'; rating = 2;
    }

    return { label: `${row}${num}`, section, level, price, quality, rating };
};

const BookingSummary: React.FC<BookingSummaryProps> = ({ selectedSeats, onCheckout }) => {
    const selectedDetails = selectedSeats.map(getSeatInfo);
    const totalPrice = selectedDetails.reduce((sum, item) => sum + item.price, 0);

    return (
        <div className="glass-card tickets-summary-card">
            <h2 className="font-teko" style={{
                fontSize: '1.8rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                borderBottom: '1px solid var(--t-border)',
                paddingBottom: '0.5rem'
            }}>
                <ShoppingCart size={20} className="text-[#ff4655]" />
                Final Order
            </h2>

            {selectedSeats.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '3rem 1rem',
                    color: 'var(--t-text-dim)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem',
                    border: '1px dashed var(--t-border)',
                    background: 'rgba(255,255,255,0.02)'
                }} className="font-mono">
                    <Layers size={32} opacity={0.3} />
                    <div>
                        <p style={{ fontWeight: 600, color: 'var(--t-text-muted)' }}>Selection is empty</p>
                        <p style={{ fontSize: '0.7rem', marginTop: '0.4rem' }}>Please select seats to continue</p>
                    </div>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{
                        maxHeight: '400px',
                        overflowY: 'auto',
                        paddingRight: '0.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.8rem'
                    }} className="custom-scrollbar">
                        <AnimatePresence>
                            {selectedDetails.map((seat, idx) => (
                                <motion.div
                                    key={selectedSeats[idx]}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0.5rem',
                                        padding: '1rem',
                                        background: 'rgba(255, 70, 85, 0.03)',
                                        borderLeft: '2px solid var(--t-primary)'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div className="font-mono" style={{
                                                fontSize: '1rem',
                                                fontWeight: 800,
                                                color: 'var(--t-primary)'
                                            }}>
                                                {seat.label}
                                            </div>
                                            <div className="font-teko">
                                                <div style={{ fontSize: '1.1rem', lineHeight: 1 }}>{seat.level} Level</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--t-text-dim)', letterSpacing: '0.1em' }}>{seat.section} Section</div>
                                            </div>
                                        </div>
                                        <div className="font-mono" style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                                            Rs.{seat.price}
                                        </div>
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        fontSize: '0.7rem',
                                        borderTop: '1px solid rgba(255,255,255,0.05)',
                                        paddingTop: '0.5rem'
                                    }} className="font-mono">
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <div key={i} style={{
                                                    width: '10px',
                                                    height: '2px',
                                                    background: i < seat.rating ? 'var(--t-primary)' : 'rgba(255,255,255,0.1)'
                                                }} />
                                            ))}
                                        </div>
                                        <span style={{ color: 'var(--t-primary)', fontWeight: 700 }}>{seat.quality}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    <div style={{
                        borderTop: '1px solid var(--t-border)',
                        paddingTop: '1.5rem',
                    }}>
                        <div className="font-teko" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'flex-end' }}>
                            <span style={{ color: 'var(--t-text-dim)', fontSize: '1.2rem' }}>Total Investment</span>
                            <motion.span
                                key={totalPrice}
                                initial={{ opacity: 0.5 }}
                                animate={{ opacity: 1 }}
                                style={{ fontSize: '2.5rem', fontWeight: 700, lineHeight: 1 }}
                            >
                                Rs.{totalPrice.toLocaleString()}
                            </motion.span>
                        </div>

                        <button
                            className="btn-premium font-teko"
                            style={{ width: '100%' }}
                            onClick={onCheckout}
                        >
                            Confirm Seating
                            <ChevronRight size={20} className="ml-2" />
                        </button>

                        <p className="font-mono" style={{
                            fontSize: '0.65rem',
                            color: 'var(--t-text-dim)',
                            textAlign: 'center',
                            marginTop: '1.2rem',
                            lineHeight: 1.4
                        }}>
                            Secure Digital Payment // Taxes Included // Refund Policy V2.4
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingSummary;
