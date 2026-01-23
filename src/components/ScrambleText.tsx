import React, { useState, useEffect, useCallback, useRef } from 'react';

interface TextScrambleProps {
    text: string;
    className?: string;
    delay?: number;
    duration?: number;
    triggerOnScroll?: boolean;
}

const chars = '!<>-_\\/[]{}—=+*^?#________';

const ScrambleText: React.FC<TextScrambleProps> = ({ text, className, delay = 0, duration = 40, triggerOnScroll = false }) => {
    const [displayText, setDisplayText] = useState(text);
    const [isComplete, setIsComplete] = useState(false);
    const [hasTriggered, setHasTriggered] = useState(false);
    const frame = useRef(0);
    const queue = useRef<{ from: string; to: string; start: number; end: number; char?: string }[]>([]);
    const rafId = useRef<number | null>(null);
    const elementRef = useRef<HTMLSpanElement>(null);

    const update = useCallback((_time?: number) => {
        let output = '';
        let complete = 0;

        for (let i = 0, n = queue.current.length; i < n; i++) {
            let { to, start, end, char } = queue.current[i];
            if (frame.current >= end) {
                complete++;
                output += to;
            } else if (frame.current >= start) {
                if (!char || Math.random() < 0.28) {
                    char = chars[Math.floor(Math.random() * chars.length)];
                    queue.current[i].char = char;
                }
                output += char;
            } else {
                output += ''; // Start empty or keep existing char if needed, but logic below handles it
            }
        }

        setDisplayText(output);

        if (complete === queue.current.length) {
            setIsComplete(true);
        } else {
            frame.current++;
            rafId.current = requestAnimationFrame(update);
        }
    }, []);

    // Handle Trigger
    useEffect(() => {
        if (!triggerOnScroll) {
            setHasTriggered(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setHasTriggered(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => observer.disconnect();
    }, [triggerOnScroll]);

    // Handle Scramble Logic
    useEffect(() => {
        if (!hasTriggered) {
            // Keep initial text hidden or processed
            // Ideally we might want it to be invisible or just static until triggered.
            // But for scramble effect, usually it starts empty or from placeholder.
            // Based on update logic, it builds up.
            //lets jkeep it like this for now
            setDisplayText('');
            return;
        }

        const length = text.length;
        queue.current = [];
        for (let i = 0; i < length; i++) {
            const to = text[i];
            const start = Math.floor(Math.random() * duration);
            const end = start + Math.floor(Math.random() * duration);
            queue.current.push({ from: '', to, start, end });
        }

        const timeoutId = setTimeout(() => {
            frame.current = 0;
            update();
        }, delay);

        return () => {
            clearTimeout(timeoutId);
            if (rafId.current) cancelAnimationFrame(rafId.current);
        };
    }, [text, delay, duration, update, hasTriggered]);

    return (
        <span ref={elementRef} className={className}>
            {displayText.split('').map((char, i) => (
                <span key={i} className={isComplete ? '' : 'opacity-50 text-[#ff4655]'}>
                    {char}
                </span>
            ))}
        </span>
    );
};

export default ScrambleText;
