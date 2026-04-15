import React from 'react';
import { motion } from 'framer-motion';

/**
 * TacticalLoader – A lightweight "operator reloading" animation
 * used as a Suspense fallback for lazy-loaded routes.
 * 
 * Pure CSS + inline SVG. Zero external dependencies.
 * Mobile-optimized with no heavy GPU work.
 */

const STYLES = `
@keyframes tl-slide-down {
  0% { transform: translateY(-30px); opacity: 0; }
  30% { transform: translateY(0); opacity: 1; }
  70% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(30px); opacity: 0; }
}

@keyframes tl-slide-up {
  0% { transform: translateY(30px); opacity: 0; }
  30% { transform: translateY(0); opacity: 1; }
  70% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(-2px); opacity: 1; }
}

@keyframes tl-lock {
  0%, 80% { transform: translateY(0); opacity: 1; }
  85% { transform: translateY(-3px); }
  90%, 100% { transform: translateY(0); opacity: 1; }
}

@keyframes tl-eject {
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  50% { transform: translateY(-20px) rotate(15deg); opacity: 0.6; }
  100% { transform: translateY(-40px) rotate(30deg); opacity: 0; }
}

@keyframes tl-hand-pull {
  0% { transform: translateX(0); }
  30% { transform: translateX(-8px); }
  60% { transform: translateX(-8px); }
  100% { transform: translateX(0); }
}

@keyframes tl-pulse-line {
  0%, 100% { opacity: 0.1; }
  50% { opacity: 0.4; }
}

@keyframes tl-progress {
  0% { width: 0%; }
  100% { width: 100%; }
}

@keyframes tl-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

@keyframes tl-scanline {
  0% { top: -10%; }
  100% { top: 110%; }
}

.tl-reload-group {
  animation: tl-hand-pull 1.8s ease-in-out infinite;
}

.tl-mag-eject {
  animation: tl-eject 1.8s ease-out infinite;
  transform-origin: bottom center;
}

.tl-mag-insert {
  animation: tl-slide-up 1.8s ease-in-out infinite;
  animation-delay: 0.6s;
  opacity: 0;
}

.tl-chamber-lock {
  animation: tl-lock 1.8s ease-in-out infinite;
  animation-delay: 1.2s;
}

.tl-scanline {
  animation: tl-scanline 3s linear infinite;
}
`;

const TacticalLoader: React.FC = () => {
    return (
        <motion.div
            className="fixed inset-0 z-[9999] bg-[#08080a] flex flex-col items-center justify-center overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeOut" } }}
        >
            <style dangerouslySetInnerHTML={{ __html: STYLES }} />

            {/* Scanline overlay */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.04]">
                <div className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white to-transparent tl-scanline" />
            </div>

            {/* Grid background */}
            <div 
                className="absolute inset-0 pointer-events-none opacity-[0.02]"
                style={{
                    backgroundSize: '40px 40px',
                    backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.3) 1px, transparent 1px)',
                }}
            />

            {/* Main reload animation */}
            <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
                <svg 
                    viewBox="0 0 200 200" 
                    className="w-full h-full"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    {/* Magazine ejecting DOWN out of the grip */}
                    <g className="tl-mag-eject">
                        <rect x="76" y="145" width="18" height="30" rx="1.5" fill="#151a28" stroke="rgba(255,70,85,0.15)" strokeWidth="0.8" />
                        <circle cx="85" cy="152" r="1.2" fill="rgba(255,70,85,0.2)" />
                        <circle cx="85" cy="157" r="1.2" fill="rgba(255,70,85,0.15)" />
                        <circle cx="85" cy="162" r="1.2" fill="rgba(255,70,85,0.1)" />
                    </g>

                    {/* Weapon body */}
                    <g className="tl-reload-group">
                        {/* Slide (top of gun) */}
                        <g className="tl-chamber-lock">
                            <rect x="50" y="68" width="100" height="22" rx="2" fill="#1a1e2e" stroke="rgba(255,70,85,0.25)" strokeWidth="1" />
                            {/* Muzzle */}
                            <rect x="146" y="72" width="6" height="14" rx="1" fill="#151a28" stroke="rgba(255,70,85,0.15)" strokeWidth="0.5" />
                            {/* Front sight */}
                            <rect x="145" y="65" width="3" height="5" rx="0.5" fill="rgba(255,70,85,0.5)" />
                            {/* Rear sight */}
                            <rect x="56" y="65" width="6" height="4" rx="0.5" fill="#1a1e2e" stroke="rgba(255,70,85,0.2)" strokeWidth="0.5" />
                            {/* Ejection port */}
                            <rect x="88" y="71" width="18" height="10" rx="1" fill="rgba(255,70,85,0.03)" stroke="rgba(255,70,85,0.12)" strokeWidth="0.5" />
                            {/* Serrations */}
                            <line x1="56" y1="73" x2="56" y2="85" stroke="rgba(255,70,85,0.08)" strokeWidth="0.5" />
                            <line x1="60" y1="73" x2="60" y2="85" stroke="rgba(255,70,85,0.08)" strokeWidth="0.5" />
                            <line x1="64" y1="73" x2="64" y2="85" stroke="rgba(255,70,85,0.08)" strokeWidth="0.5" />
                        </g>

                        {/* Frame (lower receiver between slide and grip) */}
                        <rect x="55" y="90" width="95" height="8" rx="1" fill="#141924" stroke="rgba(255,70,85,0.15)" strokeWidth="0.5" />
                        
                        {/* Trigger guard */}
                        <path 
                            d="M88 98 L88 112 Q88 117 93 117 L105 117 Q110 117 110 112 L110 98" 
                            fill="none" stroke="rgba(255,70,85,0.2)" strokeWidth="1" 
                        />
                        {/* Trigger */}
                        <line x1="100" y1="100" x2="100" y2="113" stroke="rgba(255,70,85,0.35)" strokeWidth="1.5" />

                        {/* Grip — the magazine goes INSIDE this */}
                        <path 
                            d="M70 98 L70 145 Q70 148 73 148 L97 148 Q100 148 100 145 L100 98" 
                            fill="#0d121f" stroke="rgba(255,70,85,0.2)" strokeWidth="1" 
                        />
                        {/* Grip texture lines */}
                        <line x1="74" y1="106" x2="96" y2="106" stroke="rgba(255,70,85,0.06)" strokeWidth="0.5" />
                        <line x1="74" y1="112" x2="96" y2="112" stroke="rgba(255,70,85,0.06)" strokeWidth="0.5" />
                        <line x1="74" y1="118" x2="96" y2="118" stroke="rgba(255,70,85,0.06)" strokeWidth="0.5" />
                        <line x1="74" y1="124" x2="96" y2="124" stroke="rgba(255,70,85,0.06)" strokeWidth="0.5" />
                        <line x1="74" y1="130" x2="96" y2="130" stroke="rgba(255,70,85,0.06)" strokeWidth="0.5" />
                        <line x1="74" y1="136" x2="96" y2="136" stroke="rgba(255,70,85,0.06)" strokeWidth="0.5" />
                        
                        {/* Magazine well opening — visible gap at bottom of grip */}
                        <rect x="76" y="145" width="18" height="4" rx="0.5" fill="#0a0e18" />
                    </g>

                    {/* New magazine inserting UP into the grip */}
                    <g className="tl-mag-insert">
                        <rect x="76" y="145" width="18" height="30" rx="1.5" fill="#1a1e2e" stroke="rgba(255,70,85,0.35)" strokeWidth="1" />
                        {/* Full ammo dots (bright = loaded) */}
                        <circle cx="85" cy="152" r="1.2" fill="rgba(255,70,85,0.8)" />
                        <circle cx="85" cy="157" r="1.2" fill="rgba(255,70,85,0.8)" />
                        <circle cx="85" cy="162" r="1.2" fill="rgba(255,70,85,0.8)" />
                        {/* Mag base plate */}
                        <rect x="74" y="172" width="22" height="3" rx="1" fill="#1a1e2e" stroke="rgba(255,70,85,0.2)" strokeWidth="0.5" />
                    </g>

                    {/* Shell casing eject hint */}
                    <circle cx="106" cy="68" r="1.5" fill="rgba(255,70,85,0.12)" className="tl-chamber-lock" />
                </svg>
            </div>

            {/* Loading text */}
            <div className="mt-8 flex flex-col items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-[#ff4655] rounded-full" style={{ animation: 'tl-blink 1s infinite' }} />
                    <span className="font-mono text-[10px] md:text-xs tracking-[0.4em] text-white/50 uppercase">
                        Reloading
                    </span>
                </div>

                {/* Progress bar */}
                <div className="w-32 md:w-40 h-[2px] bg-white/5 overflow-hidden">
                    <div 
                        className="h-full bg-gradient-to-r from-[#ff4655] to-[#ff4655]/60"
                        style={{ animation: 'tl-progress 1.8s ease-in-out infinite' }}
                    />
                </div>

                <span className="font-mono text-[8px] tracking-[0.3em] text-white/20 uppercase">
                    Sec_Lvl_4 // Standby
                </span>
            </div>

            {/* Corner HUD brackets */}
            <div className="absolute top-6 left-6 w-6 h-6 border-t border-l border-[#ff4655]/20" />
            <div className="absolute top-6 right-6 w-6 h-6 border-t border-r border-[#ff4655]/20" />
            <div className="absolute bottom-6 left-6 w-6 h-6 border-b border-l border-[#ff4655]/20" />
            <div className="absolute bottom-6 right-6 w-6 h-6 border-b border-r border-[#ff4655]/20" />
        </motion.div>
    );
};

export default TacticalLoader;
