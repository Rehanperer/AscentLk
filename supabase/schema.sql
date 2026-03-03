-- ASCENLK SEATING & REGISTRATION SCHEMA

-- Create Enum for seat status
-- available: free to be picked
-- held: temporary lock (5-minute window)
-- booked: finalized purchase
CREATE TYPE seat_status AS ENUM ('available', 'held', 'booked');

-- SEATS TABLE
-- Stores the physical seat map state
CREATE TABLE IF NOT EXISTS seats (
    id TEXT PRIMARY KEY, -- standard format: level-section-row-number
    level TEXT NOT NULL,
    section TEXT NOT NULL,
    row TEXT NOT NULL,
    num TEXT NOT NULL,
    status seat_status DEFAULT 'available',
    held_until TIMESTAMPTZ, -- For automatic expiration of holds
    booked_by TEXT, -- Email or reference ID of the registrant
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- REGISTRATIONS TABLE
-- Stores participant data
CREATE TABLE IF NOT EXISTS registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seat_id TEXT REFERENCES seats(id),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    school TEXT,
    transaction_id TEXT, -- For tracking payments
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SETTINGS TABLE
-- Global site control (e.g., toggling ticket sales on/off)
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE REALTIME
-- This allows the frontend to listen for seat status changes instantly
ALTER PUBLICATION supabase_realtime ADD TABLE seats;

-- INDEXING for performance
CREATE INDEX idx_seats_status ON seats(status);
CREATE INDEX idx_seats_level ON seats(level);
