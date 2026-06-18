-- ASCENLK ROLE-BASED ACCESS CONTROL (RBAC) MIGRATION
-- Copy and paste this script into your Supabase SQL Editor to enable database-driven admin roles.

-- 1. ADD ROLE COLUMN TO admin_users
ALTER TABLE admin_users 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'scanner';

-- Add Check Constraint to enforce valid roles
ALTER TABLE admin_users 
DROP CONSTRAINT IF EXISTS check_admin_role;

ALTER TABLE admin_users 
ADD CONSTRAINT check_admin_role 
CHECK (role IN ('super_admin', 'scanner'));

-- 2. SEED SUPER ADMIN PRIVILEGES FOR CURRENT USERS
-- Ensure all existing users default to super_admin so you don't lose admin capabilities
INSERT INTO admin_users (email, role)
VALUES 
  ('admin@ascentlk.com', 'super_admin'),
  ('ascent2026s@gmail.com', 'super_admin'),
  ('pererarehan2007@gmail.com', 'super_admin')
ON CONFLICT (email) DO UPDATE SET role = 'super_admin';

-- Seed default scanner user account
INSERT INTO admin_users (email, role)
VALUES ('scanner@ascentlk.com', 'scanner')
ON CONFLICT (email) DO UPDATE SET role = 'scanner';

-- 3. ENABLE RLS FOR ALL ADMIN TABLES (Re-hardening & ensuring no unrestricted tables)
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE comms_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- 4. UTILITY FUNCTIONS FOR ROLE VERIFICATION

-- Helper for general admin privileges (either super_admin or scanner)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    RETURN (
        auth.role() = 'authenticated' AND (
            auth.jwt() ->> 'role' = 'super_admin' OR
            auth.jwt() ->> 'role' = 'admin' OR
            EXISTS (
                SELECT 1 FROM admin_users 
                WHERE lower(admin_users.email) = lower(auth.jwt() ->> 'email')
            )
        )
    );
END;
$$;

-- Helper for super_admin privileges only
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    RETURN (
        auth.role() = 'authenticated' AND (
            auth.jwt() ->> 'role' = 'super_admin' OR
            EXISTS (
                SELECT 1 FROM admin_users 
                WHERE lower(admin_users.email) = lower(auth.jwt() ->> 'email')
                  AND admin_users.role = 'super_admin'
            )
        )
    );
END;
$$;

-- 5. REBUILD ROW LEVEL SECURITY (RLS) POLICIES

-- 5.1 admin_users Policies
DROP POLICY IF EXISTS "Admins Manage Admins" ON admin_users;
DROP POLICY IF EXISTS "Super Admins Manage Admins" ON admin_users;
DROP POLICY IF EXISTS "Admins Read Admins" ON admin_users;

-- Any authorized admin can read emails/roles
CREATE POLICY "Admins Read Admins" ON admin_users
FOR SELECT TO authenticated USING (is_admin());

-- Only super admins can insert, update, or delete admin users
CREATE POLICY "Super Admins Manage Admins" ON admin_users
FOR ALL TO authenticated USING (is_super_admin());


-- 5.2 rate_limits Policies
DROP POLICY IF EXISTS "Admins Manage Rate Limits" ON rate_limits;
DROP POLICY IF EXISTS "Super Admins Manage Rate Limits" ON rate_limits;

CREATE POLICY "Super Admins Manage Rate Limits" ON rate_limits
FOR ALL TO authenticated USING (is_super_admin());


-- 5.3 settings Policies
DROP POLICY IF EXISTS "Public Read Settings" ON settings;
DROP POLICY IF EXISTS "Admin Full Access Settings" ON settings;
DROP POLICY IF EXISTS "Super Admin Full Access Settings" ON settings;

-- Anyone can read settings
CREATE POLICY "Public Read Settings" ON settings 
FOR SELECT TO public USING (true);

-- Only super admins can modify settings
CREATE POLICY "Super Admin Full Access Settings" ON settings 
FOR ALL TO authenticated USING (is_super_admin());


-- 5.4 seats Policies
DROP POLICY IF EXISTS "Public Read Seats" ON seats;
DROP POLICY IF EXISTS "Public Update Seats" ON seats;
DROP POLICY IF EXISTS "Admin Full Access Seats" ON seats;
DROP POLICY IF EXISTS "Super Admin Full Access Seats" ON seats;
DROP POLICY IF EXISTS "Admin Read Seats" ON seats;

-- Public can read and make bookings
CREATE POLICY "Public Read Seats" ON seats 
FOR SELECT TO public USING (true);

CREATE POLICY "Public Update Seats" ON seats 
FOR UPDATE TO public 
USING (status = 'available' OR status = 'held')
WITH CHECK (status = 'booked' OR status = 'held');

-- Scanners can read seats
CREATE POLICY "Admin Read Seats" ON seats 
FOR SELECT TO authenticated USING (is_admin());

-- Only super admins can add, delete, or reset seats
CREATE POLICY "Super Admin Full Access Seats" ON seats 
FOR ALL TO authenticated USING (is_super_admin());


-- 5.5 registrations Policies
DROP POLICY IF EXISTS "Public Insert Registrations" ON registrations;
DROP POLICY IF EXISTS "Admin Full Access Registrations" ON registrations;
DROP POLICY IF EXISTS "Admin Select Registrations" ON registrations;
DROP POLICY IF EXISTS "Super Admin Full Access Registrations" ON registrations;

-- Public can register
CREATE POLICY "Public Insert Registrations" ON registrations 
FOR INSERT TO public WITH CHECK (true);

-- All admins can view tickets
CREATE POLICY "Admin Select Registrations" ON registrations 
FOR SELECT TO authenticated USING (is_admin());

-- Only super admins can edit or delete registrations
CREATE POLICY "Super Admin Full Access Registrations" ON registrations 
FOR ALL TO authenticated USING (is_super_admin());


-- 5.6 tournament_teams Policies
DROP POLICY IF EXISTS "Public Insert Teams" ON tournament_teams;
DROP POLICY IF EXISTS "Admin Full Access Teams" ON tournament_teams;
DROP POLICY IF EXISTS "Admin Select Teams" ON tournament_teams;
DROP POLICY IF EXISTS "Super Admin Full Access Teams" ON tournament_teams;

-- Public can register teams
CREATE POLICY "Public Insert Teams" ON tournament_teams 
FOR INSERT TO public WITH CHECK (true);

-- All admins can view teams
CREATE POLICY "Admin Select Teams" ON tournament_teams 
FOR SELECT TO authenticated USING (is_admin());

-- Only super admins can update/delete teams
CREATE POLICY "Super Admin Full Access Teams" ON tournament_teams 
FOR ALL TO authenticated USING (is_super_admin());


-- 5.7 comms_messages Policies
DROP POLICY IF EXISTS "Admin Select Comms" ON comms_messages;
DROP POLICY IF EXISTS "Super Admin Send Comms" ON comms_messages;

-- Scanners can view communications
CREATE POLICY "Admin Select Comms" ON comms_messages 
FOR SELECT TO authenticated USING (is_admin());

-- Only super admins can send communication messages
CREATE POLICY "Super Admin Send Comms" ON comms_messages 
FOR ALL TO authenticated USING (is_super_admin());


-- 5.8 page_views (Analytics) Policies
DROP POLICY IF EXISTS "Public Insert Page Views" ON page_views;
DROP POLICY IF EXISTS "Admin Select Page Views" ON page_views;
DROP POLICY IF EXISTS "Super Admin Manage Page Views" ON page_views;

-- Anyone can submit page views anonymously
CREATE POLICY "Public Insert Page Views" ON page_views 
FOR INSERT TO public WITH CHECK (true);

-- Any admin can view page traffic stats
CREATE POLICY "Admin Select Page Views" ON page_views 
FOR SELECT TO authenticated USING (is_admin());

-- Only super admins can reset or manage page views
CREATE POLICY "Super Admin Manage Page Views" ON page_views 
FOR ALL TO authenticated USING (is_super_admin());


-- 6. RPC PERMISSIONS LOCKS
REVOKE EXECUTE ON FUNCTION validate_ticket(TEXT[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION validate_ticket(TEXT[]) TO authenticated;
