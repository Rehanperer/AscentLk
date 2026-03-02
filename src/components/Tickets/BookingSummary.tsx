import React from 'react';
import { ShoppingCart, IndianRupee, Eye, Trash2, Layers, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BookingSummaryProps {
    selectedSeats: string[];
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

const BookingSummary: React.FC<BookingSummaryProps> = ({ selectedSeats }) => {
    const selectedDetails = selectedSeats.map(getSeatInfo);
    const totalPrice = selectedDetails.reduce((sum, item) => sum + item.price, 0);

    return (
        <div className="glass-card" style={{
            position: 'sticky',
            top: '2.5rem',
            padding: '2.5rem',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
            <h2 style={{
                fontSize: '1.4rem',
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                fontWeight: 800
            }}>
                <ShoppingCart size={22} color="var(--primary)" />
                Final Order
            </h2>

            {selectedSeats.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '4rem 0',
                    color: 'var(--text-dim)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <Layers size={40} opacity={0.2} />
                    <div>
                        <p style={{ fontWeight: 600 }}>Your basket is empty</p>
                        <p style={{ fontSize: '0.8rem', marginTop: '0.4rem' }}>Select seats to continue</p>
                    </div>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={{
                        maxHeight: '400px',
                        overflowY: 'auto',
                        paddingRight: '0.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                    }}>
                        <AnimatePresence>
                            {selectedDetails.map((seat, idx) => (
                                <motion.div
                                    key={selectedSeats[idx]}
                                    initial={{ opacity: 0, scale: 0.9, x: 20 }}
                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, x: -20 }}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0.6rem',
                                        padding: '1.2rem',
                                        background: 'rgba(255,255,255,0.03)',
                                        borderRadius: '1rem',
                                        border: '1px solid rgba(255,255,255,0.02)'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                            <div style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '0.5rem',
                                                background: 'rgba(255, 60, 60, 0.1)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '0.7rem',
                                                fontWeight: 800,
                                                color: 'var(--primary)'
                                            }}>
                                                {seat.label}
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{seat.level} Level</div>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{seat.section} Section</div>
                                            </div>
                                        </div>
                                        <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>
                                            Rs. {seat.price}
                                        </div>
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        fontSize: '0.7rem',
                                        borderTop: '1px solid rgba(255,255,255,0.05)',
                                        paddingTop: '0.6rem'
                                    }}>
                                        <div style={{ display: 'flex', gap: '2px' }}>
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <div key={i} style={{
                                                    width: '8px',
                                                    height: '2px',
                                                    background: i < seat.rating ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                                                    borderRadius: '1px'
                                                }} />
                                            ))}
                                        </div>
                                        <span style={{ color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>{seat.quality}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    <div style={{
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                        paddingTop: '2rem',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'flex-end' }}>
                            <span style={{ color: 'var(--text-dim)', fontSize: '0.9rem', fontWeight: 500 }}>Total Investment</span>
                            <motion.span
                                key={totalPrice}
                                initial={{ scale: 1.1, color: 'var(--primary)' }}
                                animate={{ scale: 1, color: 'var(--text-main)' }}
                                style={{ fontSize: '1.8rem', fontWeight: 800 }}
                            >
                                Rs. {totalPrice.toLocaleString()}
                            </motion.span>
                        </div>

                        <button className="btn-premium" style={{ width: '100%', padding: '1.25rem' }}>
                            Secure Reservations
                            <ChevronRight size={18} />
                        </button>

                        <p style={{
                            fontSize: '0.7rem',
                            color: 'var(--text-dim)',
                            textAlign: 'center',
                            marginTop: '1rem',
                            padding: '0 1rem'
                        }}>
                            Price includes all local government taxes and institute service fees.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingSummary;
