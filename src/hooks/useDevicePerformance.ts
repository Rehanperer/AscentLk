/**
 * Centralized device performance detection hook.
 * Cached at module level — device capabilities don't change during a session.
 * Replaces scattered `window.innerWidth < 768` checks throughout the app.
 */

const _cache: {
  isMobile: boolean;
  isLowEnd: boolean;
  prefersReducedMotion: boolean;
  isTouchDevice: boolean;
} = (() => {
  if (typeof window === 'undefined') {
    return { isMobile: false, isLowEnd: false, prefersReducedMotion: false, isTouchDevice: false };
  }

  const isMobile = window.innerWidth < 768;

  // Low-end device heuristic: few CPU cores or low memory
  const cores = (navigator as any).hardwareConcurrency || 4;
  const memory = (navigator as any).deviceMemory || 4; // GB, Chrome-only
  const isLowEnd = isMobile && (cores <= 4 || memory <= 2);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  return { isMobile, isLowEnd, prefersReducedMotion, isTouchDevice };
})();

/** Module-level cached values — no hook needed, just import directly */
export const devicePerf = _cache;

/**
 * Hook version for components that need to trigger re-render on resize.
 * Only use this if your component needs to react to window resize.
 */
import { useState, useEffect } from 'react';

export const useDevicePerformance = () => {
  const [isMobile, setIsMobile] = useState(_cache.isMobile);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      _cache.isMobile = mobile;
    };
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return {
    isMobile,
    isLowEnd: _cache.isLowEnd,
    prefersReducedMotion: _cache.prefersReducedMotion,
    isTouchDevice: _cache.isTouchDevice,
  };
};
