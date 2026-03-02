// ==========================================
// SeatingEngine.ts
// Procedurally generates seat coordinates for each level
// based on the RIIA Fixed Seating Layout
// ==========================================

export type SeatStatus = 'available' | 'selected' | 'held' | 'booked';

export interface SeatData {
    id: string;
    level: 'Ground' | 'Balcony' | 'Deck';
    section: string;
    row: string;
    number: number;
    x: number;
    y: number;
    status: SeatStatus;
}

// ---- Ground Floor Layout ----
const GROUND_ML_SEATS = [11, 12, 13, 15, 16, 17, 17, 17, 16, 15, 14, 13, 12, 12];
const GROUND_MR_SEATS = [11, 12, 13, 15, 16, 17, 17, 17, 16, 15, 14, 13, 12, 13];

// ---- Balcony Layout ----
const BALCONY_BL_SEATS = [8, 8, 8, 8, 8];
const BALCONY_BC_SEATS = [14, 15, 16, 16, 15];
const BALCONY_BR_SEATS = [8, 8, 8, 8, 8];
const BALCONY_SIDEBOX_COUNT = 12;

// ---- Deck Layout ----
const DECK_DL_SEATS = [9, 8, 6];
const DECK_DR_SEATS = [9, 8, 5];

// ---- Coordinate Constants ----
const SEAT_W = 24;
const SEAT_H = 20;
const ROW_GAP = 28;
const SEAT_STEP = SEAT_W + 2; // 26px per seat

// ===========================================================
// Ground Floor
// ===========================================================
function generateGroundSeats(): SeatData[] {
    const seats: SeatData[] = [];
    const stageBottom = 160;
    const centerX = 525;
    const aisleGap = 50;

    for (let rIdx = 0; rIdx < 14; rIdx++) {
        const rowLabel = String.fromCharCode(65 + rIdx);
        const y = stageBottom + rIdx * ROW_GAP;

        // ML – numbered high to low, placed right-to-left from center
        const mlCount = GROUND_ML_SEATS[rIdx];
        for (let s = 0; s < mlCount; s++) {
            const seatNum = mlCount - s;
            const x = centerX - aisleGap / 2 - (s + 1) * SEAT_STEP;
            const dist = x - centerX;
            const curve = 0.00008 * dist * dist;

            seats.push({
                id: `Ground-ML-${rowLabel}-${seatNum}`,
                level: 'Ground', section: 'ML', row: rowLabel, number: seatNum,
                x, y: y + curve, status: 'available'
            });
        }

        // MR – numbered low to high, placed left-to-right from center
        const mrCount = GROUND_MR_SEATS[rIdx];
        for (let s = 0; s < mrCount; s++) {
            const seatNum = s + 1;
            const x = centerX + aisleGap / 2 + s * SEAT_STEP;
            const dist = x - centerX;
            const curve = 0.00008 * dist * dist;

            seats.push({
                id: `Ground-MR-${rowLabel}-${seatNum}`,
                level: 'Ground', section: 'MR', row: rowLabel, number: seatNum,
                x, y: y + curve, status: 'available'
            });
        }
    }
    return seats;
}

// ===========================================================
// Balcony – PROPERLY SPACED
// Key: Calculate all widths first, then position with explicit gaps
// ===========================================================
function generateBalconySeats(): SeatData[] {
    const seats: SeatData[] = [];
    const centerX = 600;      // Shifted center for wider layout
    const balconyTop = 280;
    const sectionGap = 40;    // Explicit gap between BL-BC and BC-BR

    // --- Calculate section widths for the widest row ---
    const maxBLWidth = 8 * SEAT_STEP;           // 208px
    const maxBCWidth = 16 * SEAT_STEP;          // 416px
    const maxBRWidth = 8 * SEAT_STEP;           // 208px
    // Total main area = 208 + 40 + 416 + 40 + 208 = 912px

    // BC is centered at centerX
    const bcLeftEdge = centerX - maxBCWidth / 2; // 600 - 208 = 392
    const bcRightEdge = centerX + maxBCWidth / 2; // 600 + 208 = 808

    // BL is to the left of BC with a gap
    const blRightEdge = bcLeftEdge - sectionGap; // 392 - 40 = 352
    const blLeftEdge = blRightEdge - maxBLWidth; // 352 - 208 = 144

    // BR is to the right of BC with a gap
    const brLeftEdge = bcRightEdge + sectionGap; // 808 + 40 = 848
    const brRightEdge = brLeftEdge + maxBRWidth; // 848 + 208 = 1056

    // Side Boxes: well outside the main sections
    const lboxX = blLeftEdge - 60;  // 144 - 60 = 84
    const rboxX = brRightEdge + 36; // 1056 + 36 = 1092

    // LBOX (Left wall – vertical column)
    for (let i = 0; i < BALCONY_SIDEBOX_COUNT; i++) {
        seats.push({
            id: `Balcony-LBOX-A-${i + 1}`,
            level: 'Balcony', section: 'LBOX', row: 'A', number: i + 1,
            x: lboxX, y: 160 + i * (SEAT_H + 8), status: 'available'
        });
    }

    // RBOX (Right wall – vertical column)
    for (let i = 0; i < BALCONY_SIDEBOX_COUNT; i++) {
        seats.push({
            id: `Balcony-RBOX-A-${i + 1}`,
            level: 'Balcony', section: 'RBOX', row: 'A', number: i + 1,
            x: rboxX, y: 160 + i * (SEAT_H + 8), status: 'available'
        });
    }

    // Main balcony sections
    for (let rIdx = 0; rIdx < 5; rIdx++) {
        const rowLabel = String.fromCharCode(65 + rIdx);
        const y = balconyTop + rIdx * ROW_GAP;

        // BL – right-aligned to blRightEdge
        const blCount = BALCONY_BL_SEATS[rIdx];
        const blRowWidth = blCount * SEAT_STEP;
        const blRowStart = blRightEdge - blRowWidth;
        for (let s = 0; s < blCount; s++) {
            seats.push({
                id: `Balcony-BL-${rowLabel}-${blCount - s}`,
                level: 'Balcony', section: 'BL', row: rowLabel, number: blCount - s,
                x: blRowStart + s * SEAT_STEP, y, status: 'available'
            });
        }

        // BC – centered at centerX
        const bcCount = BALCONY_BC_SEATS[rIdx];
        const bcRowWidth = bcCount * SEAT_STEP;
        const bcRowStart = centerX - bcRowWidth / 2;
        for (let s = 0; s < bcCount; s++) {
            seats.push({
                id: `Balcony-BC-${rowLabel}-${s + 1}`,
                level: 'Balcony', section: 'BC', row: rowLabel, number: s + 1,
                x: bcRowStart + s * SEAT_STEP, y, status: 'available'
            });
        }

        // BR – left-aligned to brLeftEdge
        const brCount = BALCONY_BR_SEATS[rIdx];
        for (let s = 0; s < brCount; s++) {
            seats.push({
                id: `Balcony-BR-${rowLabel}-${s + 1}`,
                level: 'Balcony', section: 'BR', row: rowLabel, number: s + 1,
                x: brLeftEdge + s * SEAT_STEP, y, status: 'available'
            });
        }
    }

    return seats;
}

// ===========================================================
// Deck
// ===========================================================
function generateDeckSeats(): SeatData[] {
    const seats: SeatData[] = [];
    const deckTop = 260;
    const centerX = 525;
    const deckGap = 120;

    for (let rIdx = 0; rIdx < 3; rIdx++) {
        const rowLabel = String.fromCharCode(65 + rIdx);
        const y = deckTop + rIdx * ROW_GAP;

        const dlCount = DECK_DL_SEATS[rIdx];
        const dlEndX = centerX - deckGap / 2;
        for (let s = 0; s < dlCount; s++) {
            seats.push({
                id: `Deck-DL-${rowLabel}-${dlCount - s}`,
                level: 'Deck', section: 'DL', row: rowLabel, number: dlCount - s,
                x: dlEndX - (s + 1) * SEAT_STEP, y, status: 'available'
            });
        }

        const drCount = DECK_DR_SEATS[rIdx];
        const drStartX = centerX + deckGap / 2;
        for (let s = 0; s < drCount; s++) {
            seats.push({
                id: `Deck-DR-${rowLabel}-${s + 1}`,
                level: 'Deck', section: 'DR', row: rowLabel, number: s + 1,
                x: drStartX + s * SEAT_STEP, y, status: 'available'
            });
        }
    }

    return seats;
}

// ===========================================================
// Exports
// ===========================================================
export function generateSeats(level: 'Ground' | 'Balcony' | 'Deck'): SeatData[] {
    switch (level) {
        case 'Ground': return generateGroundSeats();
        case 'Balcony': return generateBalconySeats();
        case 'Deck': return generateDeckSeats();
    }
}

export function getViewBox(level: 'Ground' | 'Balcony' | 'Deck'): string {
    switch (level) {
        case 'Ground': return '0 0 1050 600';
        case 'Balcony': return '0 0 1200 460';  // Wider to fit RBOX
        case 'Deck': return '0 0 1050 380';
    }
}

export function getLevelCapacity(level: 'Ground' | 'Balcony' | 'Deck'): number {
    switch (level) {
        case 'Ground': return GROUND_ML_SEATS.reduce((a, b) => a + b, 0) + GROUND_MR_SEATS.reduce((a, b) => a + b, 0);
        case 'Balcony': return BALCONY_BL_SEATS.reduce((a, b) => a + b, 0) + BALCONY_BC_SEATS.reduce((a, b) => a + b, 0) + BALCONY_BR_SEATS.reduce((a, b) => a + b, 0) + BALCONY_SIDEBOX_COUNT * 2;
        case 'Deck': return DECK_DL_SEATS.reduce((a, b) => a + b, 0) + DECK_DR_SEATS.reduce((a, b) => a + b, 0);
    }
}
