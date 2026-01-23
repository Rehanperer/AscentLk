import React, { useEffect, useState } from 'react';

const CustomCursor: React.FC = () => {
    const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
    const [ringPos, setRingPos] = useState({ x: -100, y: -100 });
    const [isHovering, setIsHovering] = useState(false);
    const [isFinePointer, setIsFinePointer] = useState(false);

    useEffect(() => {
        const checkPointer = () => setIsFinePointer(window.matchMedia("(pointer: fine)").matches);
        checkPointer();

        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isInteractive = target.closest('.interactive-element, a, button, .cursor-pointer, input, textarea, .mesh-node');
            setIsHovering(!!isInteractive);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, []);

    useEffect(() => {
        let rafId: number;
        const animate = () => {
            setRingPos(prev => ({
                x: prev.x + (mousePos.x - prev.x) * 0.15,
                y: prev.y + (mousePos.y - prev.y) * 0.15
            }));
            rafId = requestAnimationFrame(animate);
        };
        rafId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafId);
    }, [mousePos]);

    if (!isFinePointer) return null;

    return (
        <>
            <style>
                {`
                    @media (pointer: fine) {
                        body { cursor: none !important; }
                        body * { cursor: none !important; }
                    }
                `}
            </style>
            <div
                id="cursor-dot"
                className="fixed bg-[#ff4655] rounded-full pointer-events-none z-[9999] w-1 h-1"
                style={{ left: mousePos.x, top: mousePos.y, transform: 'translate(-50%, -50%)' }}
            />
            <div
                id="cursor-ring"
                className={`fixed border border-[#ff4655]/50 rounded-full pointer-events-none z-[9998] transition-[width,height,background-color,border-color] duration-300 ${isHovering ? 'w-12 h-12 bg-[#ff4655]/10 border-[#ff4655]' : 'w-8 h-8'}`}
                style={{ left: ringPos.x, top: ringPos.y, transform: 'translate(-50%, -50%)' }}
            />
        </>
    );
};

export default CustomCursor;
