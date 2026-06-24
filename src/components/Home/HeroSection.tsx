import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';

const HeroSection: React.FC = () => {
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);

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

    // Store rect to avoid layout thrashing on every mouse move
    const rectRef = useRef<DOMRect | null>(null);

    const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
        rectRef.current = e.currentTarget.getBoundingClientRect();
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        if (!rectRef.current) return;
        const rect = rectRef.current;
        const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
        mouseX.set(x);
        mouseY.set(y);
    };

    const handleMouseLeave = () => {
        rectRef.current = null;
        mouseX.set(0);
        mouseY.set(0);
    };

    useEffect(() => {
        // Any initial animations or logic can go here
    }, []);

    return (
        <section 
            ref={containerRef}
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            aria-label="ASCENT 2026 Hero — Sri Lanka's biggest student-led esports tournament"
            className="relative w-full min-h-[85vh] md:min-h-screen flex items-center justify-center overflow-hidden bg-[#08080a]"
            style={{ perspective: 1500 }}
        >
            {/* Background Image */}
            <motion.div 
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ scale: videoScale }}
            >
                <img
                    src="/coverImage.png"
                    alt="Ascent 2026 Background"
                    className="w-full h-full object-cover md:object-cover object-left md:object-[60%_center] opacity-100 brightness-90"
                />
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

                {/* Sick Tech/Cyberpunk Elements at the split */}
                <div className="absolute inset-y-0 left-[45%] lg:left-[50%] w-px z-10 hidden md:flex flex-col justify-center items-center pointer-events-none mix-blend-screen" style={{ transform: 'rotate(12deg) scaleY(1.5)' }}>
                    <motion.div 
                        className="w-[2px] h-[60%] bg-[#ff4655] shadow-[0_0_20px_#ff4655,0_0_40px_#ff4655]"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 1.5, ease: "circOut" }}
                    />
                    <motion.div 
                        className="w-[1px] h-[40%] bg-white/40 mt-4"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 1.5, delay: 0.3, ease: "circOut" }}
                    />
                </div>

                <div 
                    className="relative z-10 flex flex-col items-start w-full md:w-[50%] lg:w-[45%] ml-auto mt-24 md:mt-0 pl-4 md:pl-0"
                    style={{ transform: "translateZ(50px)" }}
                >
                    <h1 className="font-teko text-[4.5rem] md:text-[6.5rem] lg:text-[8.5rem] leading-[0.80] font-bold tracking-widest text-left flex flex-col items-start w-full">
                        
                        {/* ASCENT (Solid, aggressive, crisp) */}
                        <motion.div 
                            className="text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] pb-2 -mb-2"
                            initial={{ x: 50, opacity: 0, filter: 'blur(10px)' }}
                            animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        >
                            ASCENT
                        </motion.div>
                        
                        {/* 2026 (Aggressive Red, Solid) */}
                        <motion.div 
                            className="flex items-center gap-3 md:gap-4 -mt-1 md:-mt-2 relative z-10"
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <span className="text-[#ff4655] opacity-80 font-mono text-sm md:text-lg tracking-widest align-top mr-2 mt-4 hidden md:block drop-shadow-[0_0_10px_#ff4655]">
                                [ YR ]
                            </span>
                            
                            <motion.span 
                                className="text-[#ff4655] relative z-10 font-bold"
                                style={{ 
                                    textShadow: '3px 3px 0px rgba(0,0,0,1), 0 0 30px rgba(255, 70, 85, 0.8)'
                                }}
                            >
                                2026
                            </motion.span>
                            
                            {/* Static Solid Block Cursor matching cover art's sharp edges */}
                            <motion.div 
                                className="w-4 md:w-5 lg:w-6 h-[3rem] md:h-[4.5rem] lg:h-[6.5rem] bg-[#ff4655] shadow-[0_0_20px_#ff4655] mb-2 md:mb-4"
                                animate={{ opacity: [1, 0.5, 1] }}
                                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            />
                        </motion.div>
                    </h1>

                    {/* Animated divider line */}
                    <motion.div 
                        className="h-[1px] bg-gradient-to-r from-[#ff4655] to-transparent w-[80%] md:w-[100%] mt-6 opacity-80"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.8 }}
                    />
                    
                    <motion.div 
                        className="font-mono text-xs md:text-sm tracking-[0.4em] md:tracking-[0.6em] text-white/80 uppercase mt-4 mb-10 text-left font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
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
