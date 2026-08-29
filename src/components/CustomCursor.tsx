import React, { useEffect, useRef, useCallback } from 'react';

/**
 * CustomCursor — Performance-optimized version.
 * - Uses direct DOM manipulation via refs instead of React state (no re-renders)
 * - The rAF loop only writes to DOM elements, never triggers setState
 * - Skips entirely on touch/non-fine-pointer devices
 */
const CustomCursor: React.FC = React.memo(() => {
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);
    const mousePos = useRef({ x: -100, y: -100 });
    const ringPos = useRef({ x: -100, y: -100 });
    const isHovering = useRef(false);
    const rafId = useRef<number>(0);
    const isFinePointer = useRef(false);
    const mounted = useRef(true);

    // Check pointer type once
    useEffect(() => {
        isFinePointer.current = window.matchMedia("(pointer: fine)").matches;
        if (!isFinePointer.current) return;

        mounted.current = true;

        let isLoopRunning = false;

        const animate = () => {
            if (!mounted.current) {
                isLoopRunning = false;
                return;
            }

            const dx = mousePos.current.x - ringPos.current.x;
            const dy = mousePos.current.y - ringPos.current.y;

            // If settled within 0.1px, stop the loop to save CPU
            if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
                ringPos.current.x = mousePos.current.x;
                ringPos.current.y = mousePos.current.y;
                if (ringRef.current) {
                    ringRef.current.style.transform = `translate(${ringPos.current.x - 16}px, ${ringPos.current.y - 16}px)`;
                }
                isLoopRunning = false;
                return;
            }

            ringPos.current.x += dx * 0.15;
            ringPos.current.y += dy * 0.15;

            if (ringRef.current) {
                ringRef.current.style.transform = `translate(${ringPos.current.x - 16}px, ${ringPos.current.y - 16}px)`;
            }

            rafId.current = requestAnimationFrame(animate);
        };

        const startLoop = () => {
            if (!isLoopRunning) {
                isLoopRunning = true;
                rafId.current = requestAnimationFrame(animate);
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            mousePos.current.x = e.clientX;
            mousePos.current.y = e.clientY;

            // Move dot immediately
            if (dotRef.current) {
                dotRef.current.style.transform = `translate(${e.clientX - 2}px, ${e.clientY - 2}px)`;
            }

            startLoop();
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const interactive = target.closest('.interactive-element, a, button, .cursor-pointer, input, textarea, .mesh-node');
            const hovering = !!interactive;

            if (hovering !== isHovering.current) {
                isHovering.current = hovering;
                if (ringRef.current) {
                    if (hovering) {
                        ringRef.current.style.width = '48px';
                        ringRef.current.style.height = '48px';
                        ringRef.current.style.backgroundColor = 'rgba(255, 70, 85, 0.1)';
                        ringRef.current.style.borderColor = '#ff4655';
                    } else {
                        ringRef.current.style.width = '32px';
                        ringRef.current.style.height = '32px';
                        ringRef.current.style.backgroundColor = 'transparent';
                        ringRef.current.style.borderColor = 'rgba(255, 70, 85, 0.5)';
                    }
                }
            }
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        window.addEventListener('mouseover', handleMouseOver, { passive: true });
        startLoop();

        return () => {
            mounted.current = false;
            isLoopRunning = false;
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseover', handleMouseOver);
            cancelAnimationFrame(rafId.current);
        };
    }, []);

    // Only render on fine-pointer (desktop with mouse)
    // Use a quick sync check to avoid an initial flash
    if (typeof window !== 'undefined' && !window.matchMedia("(pointer: fine)").matches) {
        return null;
    }

    return (
        <>
            <style>{`
                @media (pointer: fine) {
                    body { cursor: none !important; }
                    body * { cursor: none !important; }
                }
            `}</style>
            <div
                ref={dotRef}
                className="fixed top-0 left-0 bg-[#ff4655] rounded-full pointer-events-none z-[9999] w-1 h-1"
                style={{ willChange: 'transform' }}
            />
            <div
                ref={ringRef}
                className="fixed top-0 left-0 border border-[#ff4655]/50 rounded-full pointer-events-none z-[9998] w-8 h-8"
                style={{
                    willChange: 'transform',
                    transition: 'width 0.3s ease, height 0.3s ease, background-color 0.3s ease, border-color 0.3s ease'
                }}
            />
        </>
    );
});

export default CustomCursor;
