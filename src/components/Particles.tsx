import React, { useEffect, useRef } from 'react';

const Particles: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true }); // Optimization: hints
        if (!ctx) return;

        let particles: Particle[] = [];
        let animationFrameId: number;

        const isMobile = window.innerWidth < 768;
        const particleCount = isMobile ? 40 : 80; // Reduced count for performance
        const connectionDistance = isMobile ? 80 : 120;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        class Particle {
            x: number; y: number; size: number; speedX: number; speedY: number; color: string; opacity: number;
            constructor() {
                this.x = Math.random() * canvas!.width;
                this.y = Math.random() * canvas!.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = (Math.random() - 0.5) * (isMobile ? 1 : 2);
                this.speedY = (Math.random() - 0.5) * (isMobile ? 1 : 2);
                this.color = Math.random() > 0.8 ? '#ff4655' : '#ffffff';
                this.opacity = Math.random() * 0.3 + 0.1;
            }
            update() {
                this.x += this.speedX; this.y += this.speedY;
                if (this.x > canvas!.width) this.x = 0; if (this.x < 0) this.x = canvas!.width;
                if (this.y > canvas!.height) this.y = 0; if (this.y < 0) this.y = canvas!.height;
            }
            draw() {
                ctx!.fillStyle = this.color; ctx!.globalAlpha = this.opacity;
                ctx!.beginPath();
                ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2); // Circle is slightly smoother than rect
                ctx!.fill();
                ctx!.globalAlpha = 1.0;
            }
        }

        const init = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) particles.push(new Particle());
        };

        const animate = () => {
            // Optimization: Detect if canvas is off-screen (not fully reliable without IntersectionObserver but good hygiene)
            if (!canvas.offsetParent) {
                animationFrameId = requestAnimationFrame(animate);
                return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update and draw particles
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }

            // Draw lines - Optimized Loop
            ctx.strokeStyle = 'rgba(255, 70, 85, 0.2)';
            ctx.lineWidth = 1;

            for (let a = 0; a < particles.length; a++) {
                // Limit connection checks to avoid O(N^2) on large counts, though N=80 is small enough.
                for (let b = a + 1; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    // Quick check to avoid expensive sqrt if obviously too far
                    if (Math.abs(dx) > connectionDistance) continue;

                    const dy = particles[a].y - particles[b].y;
                    if (Math.abs(dy) > connectionDistance) continue;

                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < connectionDistance) {
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        // Opacity based on distance for smoothness
                        ctx.globalAlpha = 1 - (distance / connectionDistance);
                        ctx.stroke();
                        ctx.globalAlpha = 1.0;
                    }
                }
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);
        resize();
        init();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />;
};

export default Particles;
