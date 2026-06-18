-- ASCENLK INSTITUTION-GRADE SECURITY HARDENING
-- Copy and paste this script into your Supabase SQL Editor to secure your database.

-- ==========================================
-- 1. ADMIN REGISTRY & HELPER
-- ==========================================

CREATE TABLE IF NOT EXISTS admin_users (
    email TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed with default admin email (Change or add your admin emails here)
INSERT INTO admin_users (email) 
VALUES ('admin@ascentlk.com') 
ON CONFLICT (email) DO NOTHING;

-- Helper function to check if the current user is an authorized admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    -- Check if JWT claims have the admin role OR if the email is in our admin_users registry
    RETURN (
        auth.role() = 'authenticated' AND (
            auth.jwt() ->> 'role' = 'admin' OR
            EXISTS (SELECT 1 FROM admin_users WHERE lower(admin_users.email) = lower(auth.jwt() ->> 'email'))
        )
    );
END;
$$;


-- ==========================================
-- 2. RATE LIMITING ENGINE
-- ==========================================

CREATE TABLE IF NOT EXISTS rate_limits (
    ip_address TEXT,
    action TEXT,
    last_request_at TIMESTAMPTZ DEFAULT NOW(),
    request_count INT DEFAULT 1,
    PRIMARY KEY (ip_address, action)
);

-- Safe Client IP Extractor
CREATE OR REPLACE FUNCTION get_client_ip()
RETURNS TEXT LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    headers_text TEXT;
    ip_text TEXT;
BEGIN
    BEGIN
        headers_text := current_setting('request.headers', true);
        IF headers_text IS NOT NULL AND headers_text <> '' THEN
            ip_text := headers_text::json->>'x-forwarded-for';
            IF ip_text IS NOT NULL THEN
                -- Extract first IP in list (in case of proxy chaining) and trim whitespace
                RETURN trim(split_part(ip_text, ',', 1));
            END IF;
        END IF;
    EXCEPTION WHEN OTHERS THEN
        -- Fallback if request.headers is missing or not parseable
    END;
    RETURN '127.0.0.1';
END;
$$;

-- Core Rate Limiter Function
CREATE OR REPLACE FUNCTION check_rate_limit(
    action_name TEXT,
    max_requests INT,
    period_seconds INT
) RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    client_ip TEXT;
    current_count INT;
    last_time TIMESTAMPTZ;
BEGIN
    client_ip := get_client_ip();

    SELECT request_count, last_request_at INTO current_count, last_time
    FROM rate_limits
    WHERE ip_address = client_ip AND action = action_name;

    IF NOT FOUND THEN
        INSERT INTO rate_limits (ip_address, action, last_request_at, request_count)
        VALUES (client_ip, action_name, NOW(), 1);
        RETURN TRUE;
    END IF;

    -- If period has elapsed, reset counter
    IF last_time + (period_seconds || ' seconds')::INTERVAL < NOW() THEN
        UPDATE rate_limits
        SET request_count = 1, last_request_at = NOW()
        WHERE ip_address = client_ip AND action = action_name;
        RETURN TRUE;
    END IF;

    -- If requests within limits, increment
    IF current_count < max_requests THEN
        UPDATE rate_limits
        SET request_count = current_count + 1, last_request_at = NOW()
        WHERE ip_address = client_ip AND action = action_name;
        RETURN TRUE;
    END IF;

    -- Limit exceeded
    RETURN FALSE;
END;
$$;

-- Rate limit triggers for public inserts
CREATE OR REPLACE FUNCTION enforce_insert_rate_limit()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    -- Limit team registration and ticket booking inserts to 3 per minute per IP
    IF NOT check_rate_limit(TG_TABLE_NAME || '_insert', 3, 60) THEN
        RAISE EXCEPTION 'RATE_LIMIT_EXCEEDED: Too many submissions. Please try again after 1 minute.';
    END IF;
    RETURN NEW;
END;
$$;

-- Apply triggers
DROP TRIGGER IF EXISTS trigger_registrations_rate_limit ON registrations;
CREATE TRIGGER trigger_registrations_rate_limit
BEFORE INSERT ON registrations
FOR EACH ROW EXECUTE FUNCTION enforce_insert_rate_limit();

DROP TRIGGER IF EXISTS trigger_tournament_teams_rate_limit ON tournament_teams;
CREATE TRIGGER trigger_tournament_teams_rate_limit
BEFORE INSERT ON tournament_teams
FOR EACH ROW EXECUTE FUNCTION enforce_insert_rate_limit();


-- ==========================================
-- 3. SERVER-SIDE DATA VALIDATION
-- ==========================================

-- Registrations Validation
CREATE OR REPLACE FUNCTION validate_registration()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    -- 1. Validate Email format
    IF NEW.email !~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$' THEN
        RAISE EXCEPTION 'INVALID_EMAIL: The email format is invalid.';
    END IF;

    -- 2. Validate Phone format
    IF NEW.phone !~ '^[0-9+\-\s()]{7,20}$' THEN
        RAISE EXCEPTION 'INVALID_PHONE: The phone number format is invalid.';
    END IF;

    -- 3. Validate Name is not empty
    IF trim(NEW.full_name) = '' THEN
        RAISE EXCEPTION 'INVALID_NAME: Full name cannot be empty.';
    END IF;

    -- 4. Check seat status match (Integrity verification)
    IF NEW.seat_id IS NOT NULL AND NOT EXISTS (
        SELECT 1 FROM seats 
        WHERE id = NEW.seat_id 
          AND status = 'booked' 
          AND booked_by = NEW.email
    ) THEN
        RAISE EXCEPTION 'INVALID_SEAT_STATE: The seat must be booked/locked by the registrant first.';
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_validate_registration ON registrations;
CREATE TRIGGER trigger_validate_registration
BEFORE INSERT ON registrations
FOR EACH ROW EXECUTE FUNCTION validate_registration();

-- Tournament Teams Validation
CREATE OR REPLACE FUNCTION validate_tournament_team()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    -- 1. Validate Email format
    IF NEW.email !~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$' THEN
        RAISE EXCEPTION 'INVALID_EMAIL: The email format is invalid.';
    END IF;

    -- 2. Validate school, IGL name
    IF trim(NEW.school) = '' THEN
        RAISE EXCEPTION 'INVALID_SCHOOL: School/Institution name cannot be empty.';
    END IF;

    IF trim(NEW.igl_name) = '' THEN
        RAISE EXCEPTION 'INVALID_IGL_NAME: IGL name cannot be empty.';
    END IF;

    -- 3. Validate phone numbers
    IF NEW.igl_phone !~ '^[0-9+\-\s()]{7,20}$' THEN
        RAISE EXCEPTION 'INVALID_IGL_PHONE: The IGL phone number format is invalid.';
    END IF;

    IF NEW.teacher_phone !~ '^[0-9+\-\s()]{7,20}$' THEN
        RAISE EXCEPTION 'INVALID_TEACHER_PHONE: The teacher phone number format is invalid.';
    END IF;

    -- 4. Validate player 1..5 names and Riot IDs
    IF trim(NEW.player1_name) = '' OR trim(NEW.player1_riot_id) = '' OR
       trim(NEW.player2_name) = '' OR trim(NEW.player2_riot_id) = '' OR
       trim(NEW.player3_name) = '' OR trim(NEW.player3_riot_id) = '' OR
       trim(NEW.player4_name) = '' OR trim(NEW.player4_riot_id) = '' OR
       trim(NEW.player5_name) = '' OR trim(NEW.player5_riot_id) = '' THEN
        RAISE EXCEPTION 'INVALID_ROSTER: Main roster players (1-5) and Riot IDs are required.';
    END IF;

    -- 5. Anti-Duplicate checks: Prevent double registration from same school or email
    IF EXISTS (
        SELECT 1 FROM tournament_teams 
        WHERE lower(school) = lower(NEW.school) AND id != NEW.id
    ) THEN
        RAISE EXCEPTION 'DUPLICATE_SCHOOL: A team is already registered for this institution.';
    END IF;

    IF EXISTS (
        SELECT 1 FROM tournament_teams 
        WHERE lower(email) = lower(NEW.email) AND id != NEW.id
    ) THEN
        RAISE EXCEPTION 'DUPLICATE_EMAIL: A team is already registered with this email address.';
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_validate_tournament_team ON tournament_teams;
CREATE TRIGGER trigger_validate_tournament_team
BEFORE INSERT ON tournament_teams
FOR EACH ROW EXECUTE FUNCTION validate_tournament_team();


-- ==========================================
-- 4. ENABLE ROW LEVEL SECURITY (RLS)
-- ==========================================

ALTER TABLE seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- 4.1 ADMIN_USERS POLICIES
DROP POLICY IF EXISTS "Admins Manage Admins" ON admin_users;
CREATE POLICY "Admins Manage Admins" ON admin_users
FOR ALL TO authenticated USING (is_admin());

-- 4.1.2 RATE_LIMITS POLICIES
DROP POLICY IF EXISTS "Admins Manage Rate Limits" ON rate_limits;
CREATE POLICY "Admins Manage Rate Limits" ON rate_limits
FOR ALL TO authenticated USING (is_admin());

-- 4.2 SEATS POLICIES
DROP POLICY IF EXISTS "Public Read Seats" ON seats;
CREATE POLICY "Public Read Seats" ON seats 
FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Public Update Seats" ON seats;
CREATE POLICY "Public Update Seats" ON seats 
FOR UPDATE TO public 
USING (status = 'available' OR status = 'held')
WITH CHECK (status = 'booked' OR status = 'held');

DROP POLICY IF EXISTS "Admin Full Access Seats" ON seats;
CREATE POLICY "Admin Full Access Seats" ON seats 
FOR ALL TO authenticated USING (is_admin());

-- 4.3 REGISTRATIONS POLICIES
DROP POLICY IF EXISTS "Public Insert Registrations" ON registrations;
CREATE POLICY "Public Insert Registrations" ON registrations 
FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Admin Full Access Registrations" ON registrations;
CREATE POLICY "Admin Full Access Registrations" ON registrations 
FOR ALL TO authenticated USING (is_admin());

-- 4.4 SETTINGS POLICIES
DROP POLICY IF EXISTS "Public Read Settings" ON settings;
CREATE POLICY "Public Read Settings" ON settings 
FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Admin Full Access Settings" ON settings;
CREATE POLICY "Admin Full Access Settings" ON settings 
FOR ALL TO authenticated USING (is_admin());

-- 4.5 TOURNAMENT_TEAMS POLICIES
DROP POLICY IF EXISTS "Public Insert Teams" ON tournament_teams;
CREATE POLICY "Public Insert Teams" ON tournament_teams 
FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Admin Full Access Teams" ON tournament_teams;
CREATE POLICY "Admin Full Access Teams" ON tournament_teams 
FOR ALL TO authenticated USING (is_admin());


-- ==========================================
-- 5. SECURING RPC FUNCTIONS & EXECUTION
-- ==========================================

-- Revoke validation execution from public, grant to auth admins and anon (for Clerk)
REVOKE EXECUTE ON FUNCTION validate_ticket(TEXT[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION validate_ticket(TEXT[]) TO authenticated;
GRANT EXECUTE ON FUNCTION validate_ticket(TEXT[]) TO anon;

-- Hardened get_ticket (includes rate limit)
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
    IF NOT check_rate_limit('get_ticket', 20, 60) THEN
        RAISE EXCEPTION 'RATE_LIMIT_EXCEEDED: Too many ticket lookups. Please wait 1 minute.';
    END IF;

    RETURN QUERY
    SELECT r.id, r.seat_id, r.full_name, r.ticket_status, r.active_color_sequence, r.sequence_expires_at
    FROM registrations r
    WHERE r.id = ticket_id;
END;
$$;

-- Hardened charge_ticket (includes rate limit)
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
    IF NOT check_rate_limit('charge_ticket', 10, 60) THEN
        RAISE EXCEPTION 'RATE_LIMIT_EXCEEDED: Too many ticket charges. Please wait 1 minute.';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM registrations WHERE id = ticket_id AND ticket_status = 'issued') THEN
        RETURN NULL;
    END IF;

    LOOP
        new_seq := ARRAY[]::TEXT[];
        sum_val := 0;
        
        FOR i IN 1..6 LOOP
            rand_idx := floor(random() * 3)::INT;
            sum_val := sum_val + rand_idx;
            new_seq := array_append(new_seq, gaps[rand_idx + 1]);
        END LOOP;

        new_seq := array_append(new_seq, gaps[(sum_val % 3) + 1]);

        IF NOT ('N' = ANY(new_seq[1:6])) THEN
            rand_idx := floor(random() * 6)::INT + 1;
            sum_val := sum_val - array_position(gaps, new_seq[rand_idx]) + 1;
            new_seq[rand_idx] := 'N';
            sum_val := sum_val + 0;
            new_seq[7] := gaps[(sum_val % 3) + 1];
        END IF;

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

-- Hardened validate_ticket (includes rate limit, allows Clerk anon)
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
    IF NOT check_rate_limit('validate_ticket', 30, 60) THEN
        RAISE EXCEPTION 'RATE_LIMIT_EXCEEDED: Too many ticket scans. Please wait 1 minute.';
    END IF;

    SELECT r.id INTO matched_id
    FROM registrations r
    WHERE r.active_color_sequence = scanned_sequence
      AND r.sequence_expires_at > NOW()
      AND r.ticket_status = 'issued'
    LIMIT 1;

    IF matched_id IS NOT NULL THEN
        UPDATE registrations
        SET ticket_status = 'scanned',
            active_color_sequence = NULL,
            sequence_expires_at = NULL
        WHERE registrations.id = matched_id;

        RETURN QUERY
        SELECT r.id, r.seat_id, r.full_name, r.email, r.phone, r.school
        FROM registrations r
        WHERE r.id = matched_id;
    END IF;
END;
$$;
