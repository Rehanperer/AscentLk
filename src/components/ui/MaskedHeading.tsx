import React from 'react';

interface MaskedHeadingProps {
    text: string;
    subtext?: string;
    videoSrc: string;
    fallbackImgSrc?: string;
    className?: string;
    onExplore?: () => void;
}

export const MaskedHeading: React.FC<MaskedHeadingProps> = ({
    text,
    subtext,
    videoSrc,
    fallbackImgSrc = '/coverImage.png',
    className = '',
    onExplore
}) => {
    return (
        <div className={`relative w-full h-full flex flex-col items-center justify-center bg-black overflow-hidden select-none ${className}`}>
            {/* Background Video (clipped to text via background-clip: text or SVG mask) */}
            <div className="relative flex flex-col items-center justify-center text-center px-4">
                
                {/* Masked Video Text Container */}
                <div className="relative">
                    {/* The Video Layer masked inside text */}
                    <div 
                        className="relative font-teko text-[7.5rem] sm:text-[11rem] md:text-[15rem] lg:text-[18rem] leading-[0.78] font-black tracking-wider uppercase"
                        style={{
                            background: `url(${fallbackImgSrc}) center/cover no-repeat`,
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent',
                        }}
                    >
                        {/* Inline Video playing inside text background clip */}
                        <div className="absolute inset-0 overflow-hidden mix-blend-screen pointer-events-none">
                            <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover"
                            >
                                <source src={videoSrc} type="video/mp4" />
                            </video>
                        </div>
                        {text}
                    </div>
                </div>

                {subtext && (
                    <p className="font-mono text-xs sm:text-sm tracking-[0.4em] text-white/80 uppercase font-semibold mt-4 drop-shadow-lg">
                        {subtext}
                    </p>
                )}

                {/* Optional Action trigger */}
                {onExplore && (
                    <button
                        onClick={onExplore}
                        className="mt-8 px-6 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-mono text-xs tracking-[0.3em] uppercase rounded-full transition-all duration-300 hover:scale-105"
                    >
                        [ ENTER EXPERIENCE ]
                    </button>
                )}
            </div>
        </div>
    );
};

export default MaskedHeading;
