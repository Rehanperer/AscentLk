import React, { useEffect, useState } from 'react';

const HudBrackets: React.FC = () => {
    return (
        <>
            {/* Top Left */}
            <div className="hud-bracket top-10 left-10">
                <svg width="40" height="40" viewBox="0 0 40 40">
                    <path d="M 40 0 L 0 0 L 0 40" strokeDasharray="80" strokeDashoffset="0" />
                </svg>
            </div>
            {/* Top Right */}
            <div className="hud-bracket top-10 right-10">
                <svg width="40" height="40" viewBox="0 0 40 40">
                    <path d="M 0 0 L 40 0 L 40 40" strokeDasharray="80" strokeDashoffset="0" />
                </svg>
            </div>
            {/* Bottom Left */}
            <div className="hud-bracket bottom-10 left-10">
                <svg width="40" height="40" viewBox="0 0 40 40">
                    <path d="M 40 40 L 0 40 L 0 0" strokeDasharray="80" strokeDashoffset="0" />
                </svg>
            </div>
            {/* Bottom Right */}
            <div className="hud-bracket bottom-10 right-10">
                <svg width="40" height="40" viewBox="0 0 40 40">
                    <path d="M 0 40 L 40 40 L 40 0" strokeDasharray="80" strokeDashoffset="0" />
                </svg>
            </div>

            {/* Tactical Readouts (Desktop ONLY) */}
            <div className="fixed left-10 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-8 opacity-40 z-50 pointer-events-none">
                <div className="rotate-90 origin-left text-[10px] tracking-[0.5em] font-mono whitespace-nowrap">
                    SYSTEM_STATUS // ONLINE
                </div>
                <div className="w-[1px] h-32 bg-gradient-to-b from-transparent via-[#ff4655] to-transparent ml-2"></div>
                <div className="rotate-90 origin-left text-[10px] tracking-[0.5em] font-mono whitespace-nowrap">
                    SIGNAL_STRENGTH // 98%
                </div>
            </div>

            <div className="fixed right-10 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-8 opacity-40 z-50 items-end pointer-events-none">
                <div className="-rotate-90 origin-right text-[10px] tracking-[0.5em] font-mono whitespace-nowrap">
                    SECURE_LINK // ENCRYPTED
                </div>
                <div className="w-[1px] h-32 bg-gradient-to-b from-transparent via-[#ff4655] to-transparent mr-2"></div>
                <div className="-rotate-90 origin-right text-[10px] tracking-[0.5em] font-mono whitespace-nowrap">
                    PHASE_01 // ACTIVE
                </div>
            </div>
        </>
    );
};

export default HudBrackets;
