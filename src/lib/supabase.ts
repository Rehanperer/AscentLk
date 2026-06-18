import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials missing. Database features will be disabled.');
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder',
    {
        global: {
            fetch: async (url, options = {}) => {
                const clerk = (window as any).Clerk;
                let clerkToken = '';
                
                if (clerk?.session) {
                    try {
                        // Use native Clerk session token (required for Supabase Third-Party Auth / JWKS)
                        clerkToken = await clerk.session.getToken() || '';
                    } catch (err) {
                        console.error('Failed to retrieve Clerk session token:', err);
                    }
                }

                const headers = new Headers(options?.headers);
                if (clerkToken) {
                    headers.set('Authorization', `Bearer ${clerkToken}`);
                }

                return fetch(url, { ...options, headers });
            }
        }
    }
);
