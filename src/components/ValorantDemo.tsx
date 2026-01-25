import React from 'react';
import { SplineScene } from './ui/SplineScene';
import ScrambleText from './ScrambleText';

// Placeholder URL for now, user can swap it.
// Using the "Mini Room" example as it is a safe public URL.
const SCENE_URL = "https://prod.spline.design/igDTb8IKv8e0WEyu/scene.splinecode";

const ValorantDemo: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#0f1923] text-white flex flex-col relative overflow-hidden font-sans selection:bg-[#ff4655] selection:text-white">
            <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

            {/* Nav placeholder for context */}
            <nav className="p-6 flex justify-between items-center z-10 w-full max-w-7xl mx-auto">
                <div className="font-teko text-3xl text-[#ff4655] font-bold tracking-widest">ASCENT // REGISTRATION</div>
                <div className="flex gap-4 text-xs font-mono opacity-60">
                    <span>SERVER_TIME: {new Date().toLocaleTimeString()}</span>
                    <span>PING: 12ms</span>
                </div>
            </nav>

            <main className="flex-1 flex flex-col lg:flex-row items-center justify-center relative z-10 container mx-auto px-6 gap-12 lg:gap-0">

                {/* Text Content */}
                <div className="w-full lg:w-1/2 space-y-6 relative z-20 pl-4 lg:pl-0">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-1.5 h-1.5 bg-[#ff4655] animate-pulse"></div>
                        <div className="text-[#ff4655] text-xs font-mono tracking-[0.2em] uppercase font-bold opacity-80">
                            Protocol_Override // Active
                        </div>
                    </div>

                    <h1 className="font-teko text-6xl md:text-8xl font-bold leading-[0.8] uppercase tracking-tighter mix-blend-lighten">
                        <ScrambleText text="JOIN THE" className="block text-white mb-1" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4655] via-[#ff4655] to-white block filter drop-shadow-[0_0_15px_rgba(255,70,85,0.3)]">
                            REVOLUTION
                        </span>
                    </h1>

                    <div className="border-l border-[#ff4655]/50 pl-6 py-2 bg-gradient-to-r from-[#ff4655]/5 to-transparent backdrop-blur-sm max-w-xl">
                        <p className="text-white/80 text-lg font-medium leading-relaxed font-mono">
                            Registration for <span className="text-[#ff4655] font-bold">ASCENT 2026</span> is now open. <br />
                            <span className="text-xs uppercase tracking-widest opacity-60">Secure your spot in the ultimate gauntlet.</span>
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-6 items-start">
                        <button className="group relative bg-[#ff4655] text-white px-8 py-3 font-bold font-teko text-xl tracking-wider clip-path-polygon hover:bg-[#d63442] transition-all overflow-hidden shadow-lg shadow-[#ff4655]/20">
                            <span className="relative z-10 group-hover:-translate-y-0.5 transition-transform block">REGISTER // NOW</span>
                            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-0 mix-blend-overlay"></div>
                        </button>
                        <button className="border border-white/20 text-white px-8 py-3 font-bold font-teko text-xl tracking-wider hover:border-[#ff4655] hover:bg-[#ff4655]/5 transition-colors uppercase relative overflow-hidden group">
                            <span className="relative z-10">View Bracket</span>
                            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#ff4655] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300"></div>
                        </button>
                    </div>

                    <div className="flex items-center gap-4 text-[10px] font-mono opacity-30 pt-12 border-t border-white/5 mt-8 w-full max-w-md">
                        <div>// VCT_2026_OFFICIAL</div>
                        <div className="h-px bg-white/20 flex-1"></div>
                        <div>SECURE_CONNECTION</div>
                    </div>
                </div>

                {/* Spline Scene container */}
                <div className="w-full lg:w-1/2 h-[500px] lg:h-[800px] relative perspective-1000">

                    {/* Sharp Grid Box instead of Blob */}
                    <div className="absolute inset-10 border border-white/5 z-0 pointer-events-none">
                        <div className="absolute top-0 right-0 w-24 h-24 border-t border-r border-[#ff4655]/20"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 border-b border-l border-[#ff4655]/20"></div>
                    </div>

                    {/* Sharper, more contained glow - Cyan to match the model */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-[#00f0ff] rounded-full blur-[80px] opacity-20 pointer-events-none mix-blend-screen" />

                    <div className="w-full h-full relative z-10 scale-90">
                        <SplineScene
                            scene={SCENE_URL}
                            className="w-full h-full"
                        />
                        {/* Watermark Hider Overlay */}
                        <div className="absolute bottom-2 right-2 w-32 h-10 bg-[#0f1923] z-50 transform translate-y-2 translate-x-2 pointer-events-none"></div>
                    </div>
                </div>

            </main>

            {/* Bottom decorative bar */}
            <div className="h-2 w-full bg-[#ff4655] relative overflow-hidden">
                <div className="absolute inset-0 bg-white/20 w-1/3 animate-[shimmer_2s_infinite]"></div>
            </div>
        </div>
    );
};

export default ValorantDemo;
