import React, { useState, useEffect, useCallback, useRef } from 'react';

interface TextScrambleProps {
    text: string;
    className?: string;
    delay?: number;
    duration?: number;
    triggerOnScroll?: boolean;
}

const chars = '!<>-_\\/[]{}—=+*^?#________';

// Cache mobile check to avoid repeated matchMedia calls
const isMobileDevice = typeof window !== 'undefined' && window.innerWidth < 768;

const ScrambleText: React.FC<TextScrambleProps> = ({ text, className, delay = 0, duration = 40, triggerOnScroll = false }) => {
    // On mobile, skip the entire scramble animation and render text directly
    const elementRef = useRef<HTMLSpanElement>(null);

    if (isMobileDevice) {
        return <span ref={elementRef} className={className}>{text}</span>;
    }

    return <ScrambleTextDesktop text={text} className={className} delay={delay} duration={duration} triggerOnScroll={triggerOnScroll} />;
};

// Desktop-only scramble component (all animation logic isolated here)
const ScrambleTextDesktop: React.FC<TextScrambleProps> = ({ text, className, delay = 0, duration = 40, triggerOnScroll = false }) => {
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
                output += '';
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

    useEffect(() => {
        if (!hasTriggered) {
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
