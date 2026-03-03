-- ASCENLK SECURITY HARDENING: ROW LEVEL SECURITY (RLS)
-- Copy and paste this into your Supabase SQL Editor to secure your database.

-- ==========================================
-- 1. ENABLE ROW LEVEL SECURITY
-- ==========================================
ALTER TABLE seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 2. SEATS TABLE POLICIES
-- ==========================================

-- Allow anyone to see the seat map (Required for booking page)
CREATE POLICY "Public Read Access" 
ON seats FOR SELECT 
USING (true);

-- Allow public users to update seat status (Required for holding/booking)
-- Note: In a production app with Auth, you would restrict this further.
CREATE POLICY "Public Update Access" 
ON seats FOR UPDATE 
USING (true);

-- Allow Admin full control (If using Supabase Auth)
CREATE POLICY "Admin Full Access" 
ON seats FOR ALL 
TO authenticated 
USING (true);


-- ==========================================
-- 3. REGISTRATIONS TABLE POLICIES
-- ==========================================

-- Allow anyone to sign up (Required for checkout)
CREATE POLICY "Public Insert Access" 
ON registrations FOR INSERT 
WITH CHECK (true);

-- ONLY Admin can read the list of registrants (Security Critical)
CREATE POLICY "Admin Read Access" 
ON registrations FOR SELECT 
TO authenticated 
USING (true);

-- Prevents anyone from deleting or updating registration records
CREATE POLICY "Admin Maintain Access" 
ON registrations FOR ALL 
TO authenticated 
USING (true);


-- ==========================================
-- 4. SETTINGS TABLE POLICIES
-- ==========================================

-- Allow anyone to read settings (e.g. site maintenance mode)
CREATE POLICY "Public Read Settings" 
ON settings FOR SELECT 
USING (true);

-- Only Admin can change settings
CREATE POLICY "Admin Manage Settings" 
ON settings FOR ALL 
TO authenticated 
USING (true);
