import React, { useMemo, useCallback, useRef, useEffect, useState } from 'react';
import { generateSeats, getViewBox, SeatData } from '../../utils/SeatingEngine';

// ===========================================================
// Types
// ===========================================================
export type SeatStatus = 'available' | 'selected' | 'booked';

interface SeatPickerProps {
    activeLevel: 'Ground' | 'Balcony' | 'Deck';
    selectedSeats: string[];
    bookedSeats?: string[];
    onSeatToggle: (seatId: string) => void;
}

// ===========================================================
// Colour palette
// ===========================================================
const COLORS: Record<SeatStatus, { fill: string; stroke: string }> = {
    available: { fill: '#ef4444', stroke: 'rgba(255,255,255,0.15)' },
    selected: { fill: '#00ff88', stroke: '#34d399' },
    booked: { fill: '#1e293b', stroke: '#0f172a' },
};

// ===========================================================
// Individual Seat (pure SVG)
// ===========================================================
const SeatNode: React.FC<{
    seat: SeatData;
    status: SeatStatus;
    onToggle: (id: string) => void;
}> = React.memo(({ seat, status, onToggle }) => {
    const { fill, stroke } = COLORS[status];
    const isInteractive = status === 'available' || status === 'selected';
    const w = 22;
    const h = 18;

    return (
        <g
            onClick={isInteractive ? () => onToggle(seat.id) : undefined}
            style={{ cursor: isInteractive ? 'pointer' : 'default' }}
            className={`seat-node seat-node--${status}`}
        >
            {/* Shadow */}
            <rect x={seat.x + 1} y={seat.y + 2} width={w} height={h} rx={4} ry={5} fill="rgba(0,0,0,0.25)" />
            {/* Body */}
            <rect x={seat.x} y={seat.y} width={w} height={h} rx={4} ry={5}
                fill={fill} stroke={stroke} strokeWidth={status === 'selected' ? 2 : 0.6}
            />
            {/* Number */}
            <text x={seat.x + w / 2} y={seat.y + h / 2 + 1} textAnchor="middle" dominantBaseline="middle"
                fontSize={7} fontWeight={700}
                fill={status === 'selected' ? '#020617' : '#fff'}
                style={{ pointerEvents: 'none', fontFamily: 'Outfit, sans-serif' }}
            >
                {seat.number}
            </text>
            {/* Selected glow ring */}
            {status === 'selected' && (
                <rect x={seat.x - 2} y={seat.y - 2} width={w + 4} height={h + 4} rx={6}
                    fill="none" stroke="#00ff88" strokeWidth={1} opacity={0.35}
                />
            )}
        </g>
    );
});

// ===========================================================
// Stage / Screen
// ===========================================================
const StageGraphic: React.FC<{ level: string }> = ({ level }) => {
    const cx = level === 'Balcony' ? 600 : 525;
    const stageW = level === 'Balcony' ? 1100 : 950;

    if (level === 'Deck') {
        return (
            <g>
                <rect x={50} y={10} width={950} height={100} rx={6} fill="#3e2723" opacity={0.4} />
                <path d="M 200 50 Q 525 90 850 50" fill="none" stroke="#fff" strokeWidth={1.5} opacity={0.3} />
                <text x={525} y={50} textAnchor="middle" fill="#fff" fontSize={14} fontWeight={800}
                    letterSpacing={10} opacity={0.25}>SCREEN</text>
            </g>
        );
    }

    const left = cx - stageW / 2;
    const right = cx + stageW / 2;

    return (
        <g>
            <defs>
                <linearGradient id="woodGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#5d4037" />
                    <stop offset="100%" stopColor="#2d1e18" />
                </linearGradient>
                <filter id="screenGlow">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>
            <rect x={left} y={10} width={stageW} height={120} rx={6} fill="url(#woodGrad)" />
            <path d={`M ${left + 50} 60 Q ${cx} 110 ${right - 50} 60`}
                fill="none" stroke="#fff" strokeWidth={3} filter="url(#screenGlow)" opacity={0.4} />
            <path d={`M ${left + 50} 60 Q ${cx} 110 ${right - 50} 60`}
                fill="none" stroke="#fff" strokeWidth={1} opacity={0.9} />
            <text x={cx} y={50} textAnchor="middle" fill="#fff" fontSize={16} fontWeight={900}
                letterSpacing={14} opacity={0.35} style={{ fontFamily: 'Outfit, sans-serif' }}>SCREEN</text>
            <path d={`M ${left + 50} 130 Q ${cx} 155 ${right - 50} 130`}
                fill="none" stroke="#ef4444" strokeWidth={2} strokeDasharray="8 6" opacity={0.35} />
        </g>
    );
};

// ===========================================================
// Row Labels (leftmost seat per section-row)
// ===========================================================
const RowLabels: React.FC<{ seats: SeatData[] }> = ({ seats }) => {
    const rowMap = new Map<string, { x: number; y: number }>();
    for (const s of seats) {
        // Only label main sections (skip side boxes)
        if (s.section === 'LBOX' || s.section === 'RBOX') continue;
        const key = `${s.section}-${s.row}`;
        const cur = rowMap.get(key);
        if (!cur || s.x < cur.x) rowMap.set(key, { x: s.x, y: s.y });
    }
    return (
        <g>
            {Array.from(rowMap.entries()).map(([key, pos]) => {
                const row = key.split('-').pop();
                return (
                    <text key={key} x={pos.x - 14} y={pos.y + 10} textAnchor="end"
                        fill="rgba(255,255,255,0.25)" fontSize={9} fontWeight={700}
                        style={{ fontFamily: 'Outfit, sans-serif', pointerEvents: 'none' }}
                    >{row}</text>
                );
            })}
        </g>
    );
};

// ===========================================================
// Section Labels (positioned to match corrected coordinates)
// ===========================================================
const SectionLabels: React.FC<{ level: string }> = ({ level }) => {
    const labelStyle = { fontFamily: 'Outfit, sans-serif', pointerEvents: 'none' as const };
    if (level === 'Ground') {
        return (
            <g>
                <text x={280} y={153} textAnchor="middle" fill="#f59e0b" fontSize={11} fontWeight={800} letterSpacing={2} opacity={0.5} style={labelStyle}>MAIN LEFT (ML)</text>
                <text x={770} y={153} textAnchor="middle" fill="#f59e0b" fontSize={11} fontWeight={800} letterSpacing={2} opacity={0.5} style={labelStyle}>MAIN RIGHT (MR)</text>
            </g>
        );
    }
    if (level === 'Balcony') {
        // Coordinates matched to SeatingEngine output
        return (
            <g>
                <text x={84} y={148} textAnchor="middle" fill="#f59e0b" fontSize={9} fontWeight={800} letterSpacing={1} opacity={0.5} style={labelStyle}>L-BOX</text>
                <text x={1092} y={148} textAnchor="middle" fill="#f59e0b" fontSize={9} fontWeight={800} letterSpacing={1} opacity={0.5} style={labelStyle}>R-BOX</text>
                <text x={248} y={268} textAnchor="middle" fill="#f59e0b" fontSize={10} fontWeight={800} letterSpacing={1} opacity={0.5} style={labelStyle}>BALCONY LEFT (BL)</text>
                <text x={600} y={268} textAnchor="middle" fill="#f59e0b" fontSize={10} fontWeight={800} letterSpacing={1} opacity={0.5} style={labelStyle}>BALCONY CENTRE (BC)</text>
                <text x={952} y={268} textAnchor="middle" fill="#f59e0b" fontSize={10} fontWeight={800} letterSpacing={1} opacity={0.5} style={labelStyle}>BALCONY RIGHT (BR)</text>
            </g>
        );
    }
    if (level === 'Deck') {
        return (
            <g>
                <text x={300} y={250} textAnchor="middle" fill="#f59e0b" fontSize={11} fontWeight={800} letterSpacing={2} opacity={0.5} style={labelStyle}>DECK LEFT (DL)</text>
                <text x={750} y={250} textAnchor="middle" fill="#f59e0b" fontSize={11} fontWeight={800} letterSpacing={2} opacity={0.5} style={labelStyle}>DECK RIGHT (DR)</text>
            </g>
        );
    }
    return null;
};

// ===========================================================
// Main SeatPicker Component
// ===========================================================
const SeatPicker: React.FC<SeatPickerProps> = ({
    activeLevel, selectedSeats, bookedSeats = [], onSeatToggle,
}) => {
    const allSeats = useMemo(() => generateSeats(activeLevel), [activeLevel]);
    const viewBox = useMemo(() => getViewBox(activeLevel), [activeLevel]);

    const getStatus = useCallback(
        (id: string): SeatStatus => {
            if (bookedSeats.includes(id)) return 'booked';
            if (selectedSeats.includes(id)) return 'selected';
            return 'available';
        },
        [selectedSeats, bookedSeats]
    );

    return (
        <div className="seat-picker-svg-wrap">
            <svg viewBox={viewBox} preserveAspectRatio="xMidYMid meet" className="seat-picker-svg">
                <StageGraphic level={activeLevel} />
                <SectionLabels level={activeLevel} />
                <RowLabels seats={allSeats} />
                {allSeats.map(seat => (
                    <SeatNode key={seat.id} seat={seat} status={getStatus(seat.id)} onToggle={onSeatToggle} />
                ))}
            </svg>
        </div>
    );
};

export default SeatPicker;
