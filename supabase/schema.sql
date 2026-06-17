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
    ticket_status TEXT DEFAULT 'issued', -- 'issued', 'scanned'
    active_color_sequence TEXT[], -- array of colors e.g. {'CYAN', 'YELLOW', 'MAGENTA', 'GREEN', 'PURPLE'}
    sequence_expires_at TIMESTAMPTZ,
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
ALTER PUBLICATION supabase_realtime ADD TABLE registrations;

-- INDEXING for performance
CREATE INDEX idx_seats_status ON seats(status);
CREATE INDEX idx_seats_level ON seats(level);
CREATE INDEX idx_registrations_ticket_status ON registrations(ticket_status);

-- RPC FUNCTIONS FOR SECURE COLOR TICKETING (Radianite Core)

-- 1. Fetch details of an individual ticket securely without exposing other tickets
CREATE OR REPLACE FUNCTION get_ticket(ticket_id UUID)
RETURNS TABLE (
    id UUID,
    seat_id TEXT,
    full_name TEXT,
    ticket_status TEXT,
    active_color_sequence TEXT[],
    sequence_expires_at TIMESTAMPTZ
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    RETURN QUERY
    SELECT r.id, r.seat_id, r.full_name, r.ticket_status, r.active_color_sequence, r.sequence_expires_at
    FROM registrations r
    WHERE r.id = ticket_id;
END;
$$;

-- 2. Request a new temporary, unique color sequence when holding/charging the button
CREATE OR REPLACE FUNCTION charge_ticket(ticket_id UUID)
RETURNS TEXT[] LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    gaps TEXT[] := ARRAY['N', 'M', 'W'];
    new_seq TEXT[];
    is_unique BOOLEAN;
    rand_idx INT;
    i INT;
    attempts INT := 0;
    sum_val INT;
BEGIN
    -- Verify ticket is still active
    IF NOT EXISTS (SELECT 1 FROM registrations WHERE id = ticket_id AND ticket_status = 'issued') THEN
        RETURN NULL;
    END IF;

    LOOP
        new_seq := ARRAY[]::TEXT[];
        sum_val := 0;
        
        -- Generate 6 random rings
        FOR i IN 1..6 LOOP
            rand_idx := floor(random() * 3)::INT; -- 0, 1, or 2
            sum_val := sum_val + rand_idx;
            new_seq := array_append(new_seq, gaps[rand_idx + 1]);
        END LOOP;

        -- 7th ring is the checksum (modulo 3)
        new_seq := array_append(new_seq, gaps[(sum_val % 3) + 1]);

        -- Ensure at least one 'N' is present (excluding checksum) so ratio decoding is stable
        IF NOT ('N' = ANY(new_seq[1:6])) THEN
            rand_idx := floor(random() * 6)::INT + 1;
            sum_val := sum_val - array_position(gaps, new_seq[rand_idx]) + 1; -- Remove old value
            new_seq[rand_idx] := 'N';
            sum_val := sum_val + 0; -- 'N' is 0
            new_seq[7] := gaps[(sum_val % 3) + 1]; -- Recalculate checksum
        END IF;

        -- Check if this sequence is already active elsewhere to prevent collision
        SELECT NOT EXISTS (
            SELECT 1 FROM registrations 
            WHERE active_color_sequence = new_seq 
              AND sequence_expires_at > NOW()
              AND id != ticket_id
        ) INTO is_unique;

        EXIT WHEN is_unique OR attempts > 10;
        attempts := attempts + 1;
    END LOOP;

    UPDATE registrations
    SET active_color_sequence = new_seq,
        sequence_expires_at = NOW() + INTERVAL '180 seconds'
    WHERE id = ticket_id AND ticket_status = 'issued';

    RETURN new_seq;
END;
$$;

-- 3. Validate a scanned sequence and mark it as scanned, returning the ticket/seat owner info
CREATE OR REPLACE FUNCTION validate_ticket(scanned_sequence TEXT[])
RETURNS TABLE (
    id UUID,
    seat_id TEXT,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    school TEXT
) LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    matched_id UUID;
BEGIN
    -- Find the ticket with this active sequence
    SELECT r.id INTO matched_id
    FROM registrations r
    WHERE r.active_color_sequence = scanned_sequence
      AND r.sequence_expires_at > NOW()
      AND r.ticket_status = 'issued'
    LIMIT 1;

    IF matched_id IS NOT NULL THEN
        -- Mark as scanned
        UPDATE registrations
        SET ticket_status = 'scanned',
            active_color_sequence = NULL,
            sequence_expires_at = NULL
        WHERE registrations.id = matched_id;

        -- Return details
        RETURN QUERY
        SELECT r.id, r.seat_id, r.full_name, r.email, r.phone, r.school
        FROM registrations r
        WHERE r.id = matched_id;
    END IF;
END;
$$;
