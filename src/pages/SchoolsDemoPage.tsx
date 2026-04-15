import React from 'react';
import SchoolsMarquee from '../components/Home/SchoolsMarquee';
import SchoolsTerminal from '../components/Home/SchoolsTerminal';

/**
 * Side-by-side demo page to compare two Schools section designs.
 * Navigate to /schools-demo to view.
 */
const SchoolsDemoPage: React.FC = () => {
    return (
        <div className="min-h-screen" style={{ background: 'var(--bg-gradient)' }}>
            
            {/* Option Label 1 */}
            <div className="w-full py-12 flex flex-col items-center border-b border-[#ff4655]/20">
                <div className="font-mono text-[10px] tracking-[0.5em] text-[#ff4655] uppercase mb-2">Option 1</div>
                <h2 className="font-teko text-5xl md:text-6xl font-bold text-white tracking-widest">DUAL-ROW MARQUEE</h2>
                <p className="font-mono text-xs text-white/40 mt-3 max-w-lg text-center tracking-wide">
                    Two infinite-scrolling ribbons moving in opposite directions. Logos + names. Compact ~250px height.
                </p>
            </div>

            {/* Option 1: Marquee */}
            <SchoolsMarquee />

            {/* Divider */}
            <div className="w-full py-6 flex items-center justify-center gap-8">
                <div className="h-[1px] flex-1 bg-white/5" />
                <div className="font-mono text-[10px] text-white/20 tracking-[0.5em] uppercase">VS</div>
                <div className="h-[1px] flex-1 bg-white/5" />
            </div>

            {/* Option Label 3 */}
            <div className="w-full py-12 flex flex-col items-center border-b border-[#ff4655]/20">
                <div className="font-mono text-[10px] tracking-[0.5em] text-[#ff4655] uppercase mb-2">Option 3</div>
                <h2 className="font-teko text-5xl md:text-6xl font-bold text-white tracking-widest">TERMINAL ROSTER</h2>
                <p className="font-mono text-xs text-white/40 mt-3 max-w-lg text-center tracking-wide">
                    Fake CLI that types out school names with status codes and a blinking cursor. Ultra compact.
                </p>
            </div>

            {/* Option 3: Terminal */}
            <SchoolsTerminal />

            <div className="py-24" />
        </div>
    );
};

export default SchoolsDemoPage;
