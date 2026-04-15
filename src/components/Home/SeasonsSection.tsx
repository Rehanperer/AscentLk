import React, { useRef, useEffect } from 'react';
import { Lock } from 'lucide-react';
import ScrambleText from '../ScrambleText';

const AsciiSnakeCanvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let w = canvas.width = canvas.offsetWidth;
        let h = canvas.height = canvas.offsetHeight;

        const chars = "TOXIC☠⚠✕".split("");
        
        // Setup snake segments
        const segments: { x: number; y: number; c: string }[] = [];
        const numSegments = 60;
        for (let i = 0; i < numSegments; i++) {
            segments.push({
                x: -i * 20, // Start offscreen left
                y: h / 2,
                c: chars[i % chars.length]
            });
        }

        let time = 0;
        let animId = 0;

        const loop = () => {
            ctx.clearRect(0, 0, w, h);
            
            // Atmospheric toxic fog (very faint green)
            ctx.fillStyle = "rgba(0, 255, 64, 0.05)";
            ctx.font = "bold 14px monospace";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            // Update head
            const head = segments[0];
            head.x += 2.5; // Move right
            head.y = h / 2 + Math.sin(time * 0.03 + head.x * 0.01) * 150; // Sine wave

            // Wrap around
            if (head.x > w + 20) {
                head.x = -20;
            }

            // Follow the leader
            for (let i = numSegments - 1; i > 0; i--) {
                const cur = segments[i];
                const prev = segments[i - 1];
                
                // Interpolate towards the previous segment's position from the previous frame
                const dx = prev.x - cur.x;
                const dy = prev.y - cur.y;
                
                cur.x += dx * 0.4;
                cur.y += dy * 0.4;
            }

            // Draw line connecting them faint green
            ctx.beginPath();
            ctx.moveTo(segments[0].x, segments[0].y);
            for (let i = 1; i < numSegments; i++) {
                ctx.lineTo(segments[i].x, segments[i].y);
            }
            ctx.strokeStyle = "rgba(0, 255, 64, 0.1)";
            ctx.lineWidth = 1;
            ctx.stroke();

            // Draw chars
            for (let i = 0; i < numSegments; i++) {
                const s = segments[i];
                ctx.fillText(s.c, s.x, s.y);
            }

            time++;
            animId = requestAnimationFrame(loop);
        };

        loop();

        const onResize = () => {
            w = canvas.width = canvas.offsetWidth;
            h = canvas.height = canvas.offsetHeight;
        };
        window.addEventListener('resize', onResize);

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', onResize);
        };
    }, []);

    return (
        <canvas 
            ref={canvasRef} 
            className="absolute inset-0 w-full h-full pointer-events-none opacity-60 mix-blend-screen mix-blend-color-dodge"
        />
    );
};

const LockedSeason: React.FC<{ delay: string }> = ({ delay }) => (
    <div 
        className="relative group border border-white/5 bg-white/[0.01] overflow-hidden p-6 aspect-[4/3] flex flex-col justify-end"
        style={{ animationDelay: delay }}
    >
        {/* Blurred background implying content */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a24] to-[#0a0a0f] opacity-50 filter blur-md pointer-events-none" />
        
        {/* Frost / Scanlines */}
        <div className="absolute inset-0 bg-scanlines opacity-10 filter blur-[1px]" />
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/20 group-hover:text-white/40 transition-colors">
            <Lock size={32} strokeWidth={1} />
        </div>

        <div className="relative z-10 flex flex-col items-center w-full opacity-30 select-none">
            <div className="font-mono text-[9px] text-[#ff4655] tracking-[0.4em] uppercase mb-2">Classified Data</div>
            {/* Redacted bar instead of readable text */}
            <div className="w-24 h-6 bg-white/20 rounded-sm filter blur-[2px]" />
        </div>
    </div>
);

const SeasonsSection: React.FC = () => {
    return (
        <section id="seasons" className="relative py-24 md:py-32 bg-[#08080a] overflow-hidden">
            
            {/* Toxic Green Backlight */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00ff40]/5 rounded-full blur-[150px] pointer-events-none" />

            {/* ASCII Snake Canvas Container */}
            <div className="absolute inset-0 z-0 h-[60%] top-0">
                <AsciiSnakeCanvas />
                {/* Fade edges */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#08080a] to-transparent" />
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#08080a] to-transparent" />
                <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#08080a] to-transparent" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Header Phase 01: TOXIC */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b border-[#00ff40]/20 pb-8 relative">
                    <div className="absolute left-0 bottom-[-1px] h-[1px] bg-[#00ff40] w-32 shadow-[0_0_10px_#00ff40]" />

                    <div>
                        <ScrambleText text="SEASON 01 // DEPLOYED" className="text-[#00ff40] font-mono tracking-[0.5em] text-[10px] uppercase font-bold mb-4 block drop-shadow-[0_0_8px_rgba(0,255,64,0.5)]" />
                        <h2 className="font-teko text-7xl md:text-9xl font-bold uppercase leading-[0.8] text-white">
                            TOXIC
                        </h2>
                    </div>
                    
                    <div className="mt-8 md:mt-0 max-w-sm text-left md:text-right">
                        <p className="text-white/60 font-mono text-xs tracking-widest uppercase leading-relaxed text-[#00ff40]/80">
                            The initial perimeter breach. 
                            Bio-hazards unleashed in the arena. Only the immune survive the first purge of the Gauntlet.
                        </p>
                    </div>
                </div>

                {/* Sub-seasons Grid (Locked) */}
                <div className="mt-32">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-1.5 h-1.5 bg-white/20" />
                        <span className="font-mono text-[10px] text-white/40 tracking-[0.4em] uppercase">Upcoming Operatives</span>
                        <div className="h-[1px] flex-1 bg-white/5" />
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        <LockedSeason delay="0ms" />
                        <LockedSeason delay="10ms" />
                        <LockedSeason delay="200ms" />
                        <LockedSeason delay="300ms" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SeasonsSection;
