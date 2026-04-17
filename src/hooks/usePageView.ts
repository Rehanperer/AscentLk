import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

/**
 * Tracks page views by inserting a row into the `page_views`
 * Supabase table on every route change. Debounced to avoid
 * duplicate inserts from rapid navigation or React strict mode.
 */
export const usePageView = () => {
    const location = useLocation();
    const lastPath = useRef<string | null>(null);
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const path = location.pathname;

        // Skip if same path (prevents double-fire)
        if (path === lastPath.current) return;

        // Skip admin routes — don't track admin's own navigation
        if (path.startsWith('/admin')) return;

        // Clear any pending insert
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(() => {
            lastPath.current = path;

            supabase.from('page_views').insert({
                path,
                referrer: document.referrer || null,
                user_agent: navigator.userAgent || null,
            }).then(({ error }) => {
                if (error) {
                    // Silently fail — don't break the site for analytics
                    console.warn('[PageView] Insert failed:', error.message);
                }
            });
        }, 300);

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [location.pathname]);
};
