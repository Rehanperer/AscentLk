import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';

const HeroSection: React.FC = () => {
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Parallax on scroll
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    // Scale the video up slightly as user scrolls down to create cinematic depth
    const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
    const textY = useTransform(scrollYProgress, [0, 1], [0, 80]);
    const textOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    // 3D Mouse Parallax Effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth out the mouse movement using springs
    const springConfig = { damping: 25, stiffness: 150 };
    const smoothMouseX = useSpring(mouseX, springConfig);
    const smoothMouseY = useSpring(mouseY, springConfig);

    // Transform mouse position into subtle 3D rotation
    const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [8, -8]);
    const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-8, 8]);

    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
        mouseX.set(x);
        mouseY.set(y);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    useEffect(() => {
        if (videoRef.current) {
            // Attempt to force play for mobile data saving policies
            videoRef.current.play().catch(e => console.log("Video autoplay blocked:", e));
        }
    }, []);

    return (
        <section 
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            aria-label="ASCENT 2026 Hero — Sri Lanka's biggest student-led esports tournament"
            className="relative w-full min-h-[85vh] md:min-h-screen flex items-center justify-center overflow-hidden bg-[#08080a]"
            style={{ perspective: 1500 }}
        >
            {/* Venom Distortion Filter */}
            <svg className="absolute w-0 h-0 pointer-events-none">
                <defs>
                    <filter id="venom-distortion">
                        <feTurbulence type="fractalNoise" baseFrequency="0.03 0.1" numOctaves="3" result="noise" seed="4">
                            <animate attributeName="baseFrequency" values="0.03 0.1; 0.05 0.15; 0.03 0.1" dur="8s" repeatCount="indefinite" />
                        </feTurbulence>
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="25" xChannelSelector="R" yChannelSelector="G" />
                    </filter>
                </defs>
            </svg>

            {/* Background Parallax Video */}
            <motion.div 
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ scale: videoScale }}
            >
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster="/img/ASCENT2026-banner.jpg"
                    aria-hidden="true"
                    className="w-full h-full object-cover opacity-80"
                >
                    <source src="/ascent_vid.mp4" type="video/mp4" />
                </video>
            </motion.div>

            {/* Radial Vignette Mask */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#08080a_110%)] pointer-events-none z-10 opacity-90" />
            
            {/* Darker gradient at the bottom to smoothly blend into the next section */}
            <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-[#0d121f] to-transparent pointer-events-none z-10" />

            {/* Content Container */}
            <motion.div 
                className="relative z-20 w-full max-w-7xl mx-auto px-8 md:px-16 lg:px-24 flex flex-col items-end justify-center h-full"
                style={{ 
                    y: textY, 
                    opacity: textOpacity,
                    rotateX: rotateX,
                    rotateY: rotateY,
                    transformStyle: "preserve-3d"
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            >
                {/* Localized Frost/Blur Panel pushed to the right side */}
                <div 
                    className="absolute inset-[-40px] pointer-events-none z-0 mix-blend-hard-light"
                    style={{
                        backdropFilter: 'blur(16px) brightness(0.6)',
                        WebkitBackdropFilter: 'blur(16px) brightness(0.6)',
                        maskImage: 'radial-gradient(ellipse at 85% 50%, black 40%, transparent 70%)',
                        WebkitMaskImage: 'radial-gradient(ellipse at 85% 50%, black 40%, transparent 70%)',
                        transform: "translateZ(-50px)"
                    }}
                />

                <div 
                    className="relative z-10 flex flex-col items-end w-full md:w-3/4 lg:w-2/3 mt-12 md:mt-0"
                    style={{ transform: "translateZ(50px)" }}
                >
                    <h1 className="font-teko text-[6rem] md:text-[10rem] lg:text-[13rem] leading-[0.80] font-bold tracking-widest text-right flex flex-col items-end">
                        
                        {/* ASCENT (Solid with glow) */}
                        <motion.div 
                            className="text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.15)] relative"
                            initial={{ y: 50, opacity: 0, filter: 'blur(10px)' }}
                            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        >
                            ASCENT
                        </motion.div>
                        

                        
                        {/* 2026 (Hollow stroke + Venom fill animation + Cursor) */}
                        <motion.div 
                            className="flex items-center gap-3 md:gap-5 -mt-2 md:-mt-6 relative z-10"
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <span className="text-[#ff4655] opacity-50 font-mono text-sm md:text-xl tracking-widest align-top mr-2 mt-4 hidden md:block">
                                [ YR ]
                            </span>
                            
                            {/* Venom Text Container */}
                            <div className="relative inline-block py-8 -my-8 px-4 -mx-4">
                                {/* Base hollow outline */}
                                <motion.span 
                                    className="text-transparent absolute inset-0 flex items-center justify-center pointer-events-none"
                                    style={{ 
                                        WebkitTextStroke: '3px #ff4655',
                                        textShadow: '0 0 40px rgba(255, 70, 85, 0.4)'
                                    }}
                                    animate={{ 
                                        x: [0, -3, 3, -1, 0, 0, 0, 0],
                                        skewX: [0, -10, 10, -5, 0, 0, 0, 0],
                                    }}
                                    transition={{
                                        x: { duration: 0.6, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" },
                                        skewX: { duration: 0.6, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }
                                    }}
                                >
                                    2026
                                </motion.span>
                                
                                {/* Venom Fill Overlay */}
                                <motion.span 
                                    className="text-[#ff4655] relative z-10 flex items-center justify-center"
                                    style={{ 
                                        filter: 'url(#venom-distortion) drop-shadow(0 0 20px rgba(255,70,85,0.8))',
                                        WebkitMaskImage: 'linear-gradient(to top, black 45%, transparent 55%)',
                                        WebkitMaskSize: '100% 250%',
                                        WebkitMaskRepeat: 'no-repeat',
                                        padding: '20px', // Extra padding for distortion bleed
                                        margin: '-20px'
                                    }}
                                    animate={{ 
                                        WebkitMaskPosition: ['0% 120%', '0% -20%', '0% 120%'],
                                        x: [0, -3, 3, -1, 0, 0, 0, 0],
                                        skewX: [0, -10, 10, -5, 0, 0, 0, 0],
                                    } as any}
                                    transition={{
                                        WebkitMaskPosition: { duration: 7, repeat: Infinity, ease: "easeInOut" },
                                        x: { duration: 0.6, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" },
                                        skewX: { duration: 0.6, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }
                                    } as any}
                                >
                                    2026
                                </motion.span>
                            </div>
                            
                            {/* Blinking block cursor */}
                            <motion.div 
                                className="w-4 md:w-6 lg:w-8 h-[4rem] md:h-[7.5rem] lg:h-[10rem] bg-[#ff4655] shadow-[0_0_30px_#ff4655] mb-2 md:mb-4"
                                animate={{ opacity: [1, 0, 1] }}
                                transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                            />
                        </motion.div>
                    </h1>

                    {/* Animated divider line */}
                    <motion.div 
                        className="h-[2px] bg-gradient-to-l from-[#ff4655] to-transparent w-full md:w-[120%] mt-6 opacity-80"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.8 }}
                    />
                    
                    <motion.div 
                        className="font-mono text-sm md:text-lg tracking-[0.4em] md:tracking-[0.6em] text-white/60 uppercase mt-4 mb-10 text-right"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 1.5 }}
                    >
                        Where Legends Ascend
                    </motion.div>

                    {/* SEO: Visually hidden but crawlable description for search engines */}
                    <p className="sr-only">
                        ASCENT 2026 is Sri Lanka's premier student-led esports tournament, featuring competitive 5v5 Valorant matches 
                        with open qualifiers, regional playoffs, and a grand final at Lumina Ballroom, Cinnamon Life Colombo. 
                        This student gaming tournament brings together top school teams from across Sri Lanka for an unforgettable 
                        esports experience with broadcast-grade production, live concerts, and professional casting. 
                        Register your team now for the biggest gaming event in Sri Lanka 2026.
                    </p>
                </div>
            </motion.div>
            
        </section>
    );
};

export default HeroSection;
