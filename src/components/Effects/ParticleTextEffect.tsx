import React, { useEffect, useRef, useState } from 'react';

interface Pointer {
    x?: number;
    y?: number;
}

interface Particle {
    ox: number;
    oy: number;
    cx: number;
    cy: number;
    or: number;
    cr: number;
    f: number;
    rgb: number[];
}

interface TextBox {
    str: string;
    x?: number;
    y?: number;
    w?: number;
    h?: number;
}

export interface ParticleTextEffectProps {
    text?: string;
    colors?: string[];
    className?: string;
    animationForce?: number;
    particleDensity?: number;
    fontSize?: number;
}

const ParticleTextEffect: React.FC<ParticleTextEffectProps> = ({
    text = 'HOVER!',
    colors = [
        'ffffff', 'eeeeee', 'd1d1d1', 'a1a1a1', '717171'
    ],
    className = '',
    animationForce = 80,
    particleDensity = 3,
    fontSize
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const animationIdRef = useRef<number | null>(null);
    const particlesRef = useRef<ParticleClass[]>([]);
    const pointerRef = useRef<Pointer>({});
    const hasPointerRef = useRef<boolean>(false);
    const interactionRadiusRef = useRef<number>(100);

    const [canvasSize, setCanvasSize] = useState<{ width: number; height: number }>({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    const [textBox] = useState<TextBox>({ str: text });

    const rand = (max = 1, min = 0, dec = 0): number => {
        return +(min + Math.random() * (max - min)).toFixed(dec);
    };

    class ParticleClass implements Particle {
        ox: number;
        oy: number;
        cx: number;
        cy: number;
        or: number;
        cr: number;
        f: number;
        rgb: number[];

        constructor(x: number, y: number, rgb: number[] = [255, 255, 255]) {
            this.ox = x;
            this.oy = y;
            this.cx = x;
            this.cy = y;
            this.or = rand(3, 1);
            this.cr = this.or;
            this.f = rand(animationForce + 10, animationForce - 10);
            this.rgb = rgb.map(c => Math.max(0, Math.min(255, c + rand(10, -10))));
        }

        draw() {
            const ctx = ctxRef.current;
            if (!ctx) return;
            ctx.fillStyle = `rgb(${this.rgb.join(',')})`;
            ctx.beginPath();
            ctx.arc(this.cx, this.cy, this.cr, 0, 2 * Math.PI);
            ctx.fill();
        }

        move(interactionRadius: number, hasPointer: boolean) {
            if (hasPointer && pointerRef.current.x !== undefined && pointerRef.current.y !== undefined) {
                const dx = this.cx - pointerRef.current.x;
                const dy = this.cy - pointerRef.current.y;
                const dist = Math.hypot(dx, dy);
                if (dist < interactionRadius && dist > 0) {
                    const force = (interactionRadius - dist) / interactionRadius;
                    const push = force * this.f * 0.2;
                    this.cx += (dx / dist) * push;
                    this.cy += (dy / dist) * push;
                }
            }

            const odx = this.ox - this.cx;
            const ody = this.oy - this.cy;
            const od = Math.hypot(odx, ody);

            if (od > 0.1) {
                const restore = 0.08;
                this.cx += odx * restore;
                this.cy += ody * restore;
            } else {
                this.cx = this.ox;
                this.cy = this.oy;
            }

            this.draw();
        }
    }

    const dottify = () => {
        const ctx = ctxRef.current;
        const canvas = canvasRef.current;
        if (!ctx || !canvas || !textBox.x || !textBox.y || !textBox.w || !textBox.h) return;

        const data = ctx.getImageData(textBox.x, textBox.y, textBox.w, textBox.h).data;
        const pixels = [];

        // Use a step to control density
        for (let y = 0; y < textBox.h; y += particleDensity) {
            for (let x = 0; x < textBox.w; x += particleDensity) {
                const index = (y * textBox.w + x) * 4;
                const alpha = data[index + 3];
                if (alpha > 128) {
                    pixels.push({
                        x,
                        y,
                        rgb: [data[index], data[index + 1], data[index + 2]]
                    });
                }
            }
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particlesRef.current = pixels.map(p => new ParticleClass(
            textBox.x! + p.x,
            textBox.y! + p.y,
            p.rgb
        ));

        particlesRef.current.forEach(p => p.draw());
    };

    const write = () => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!canvas || !ctx) return;

        textBox.str = text;
        // Responsive font size calculation
        const calculatedH = fontSize || Math.min(canvas.height * 0.4, (canvas.width / textBox.str.length) * 1.2);
        textBox.h = Math.floor(calculatedH);

        interactionRadiusRef.current = Math.max(80, textBox.h * 0.8);

        ctx.font = `700 ${textBox.h}px Teko, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (ctx.measureText(textBox.str).width === 0) {
            // Font might not be loaded yet, retry shortly
            setTimeout(write, 50);
            return;
        }

        textBox.w = Math.round(ctx.measureText(textBox.str).width);
        textBox.x = (canvas.width - textBox.w) / 2;
        textBox.y = (canvas.height - textBox.h) / 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const gradient = ctx.createLinearGradient(textBox.x, textBox.y, textBox.x + textBox.w, textBox.y + textBox.h);
        const N = colors.length - 1;
        colors.forEach((c, i) => gradient.addColorStop(i / N, `#${c}`));
        ctx.fillStyle = gradient;

        ctx.fillText(textBox.str, canvas.width / 2, canvas.height / 2);

        // Use a small timeout to ensure fillText has landed before getImageData
        requestAnimationFrame(dottify);
    };

    const animate = () => {
        const ctx = ctxRef.current;
        const canvas = canvasRef.current;
        if (!ctx || !canvas) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particlesRef.current.forEach(p => p.move(interactionRadiusRef.current, hasPointerRef.current));
        animationIdRef.current = requestAnimationFrame(animate);
    };

    const initialize = () => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!canvas || !ctx) return;

        // Handle high DPI screens
        const dpr = window.devicePixelRatio || 1;
        canvas.width = canvasSize.width * dpr;
        canvas.height = canvasSize.height * dpr;
        ctx.scale(dpr, dpr);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        write();

        if (!animationIdRef.current) {
            animate();
        }
    };

    useEffect(() => {
        const handleResize = () => {
            setCanvasSize({
                width: canvasRef.current?.parentElement?.clientWidth || window.innerWidth,
                height: canvasRef.current?.parentElement?.clientHeight || window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial call
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (ctxRef.current) {
            initialize();
        }
    }, [text, colors, animationForce, particleDensity, canvasSize]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        ctxRef.current = ctx;
        initialize();

        return () => {
            if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
        };
    }, []);

    const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        pointerRef.current.x = (e.clientX - rect.left);
        pointerRef.current.y = (e.clientY - rect.top);
        hasPointerRef.current = true;
    };

    const handlePointerLeave = () => {
        hasPointerRef.current = false;
        pointerRef.current.x = undefined;
        pointerRef.current.y = undefined;
    };

    const handlePointerEnter = () => {
        hasPointerRef.current = true;
    };

    return (
        <canvas
            ref={canvasRef}
            className={`w-full h-full ${className} pointer-events-auto`}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            onPointerEnter={handlePointerEnter}
        />
    );
};

export { ParticleTextEffect };
