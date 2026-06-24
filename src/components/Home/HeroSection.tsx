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

                {/* Massive Cinematic Flare Separator */}
                <div 
                    className="absolute inset-y-0 left-[55%] lg:left-[58%] w-[100px] z-10 hidden md:flex flex-col justify-center items-center pointer-events-none mix-blend-screen" 
                    style={{ transform: 'rotate(15deg) scaleY(1.5) translateX(-50%)' }}
                >
                    {/* Core intense beam */}
                    <motion.div 
                        className="absolute w-[3px] h-[100%] bg-white rounded-full shadow-[0_0_30px_10px_#ff4655,0_0_80px_20px_#ff4655]"
                        initial={{ scaleY: 0, opacity: 0 }}
                        animate={{ scaleY: 1, opacity: 1 }}
                        transition={{ duration: 1.2, ease: "circOut" }}
                    />
                    {/* Vertical energy bleeds */}
                    <motion.div 
                        className="absolute w-[20px] h-[80%] bg-[#ff4655] opacity-50 blur-[15px]"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 1.5, ease: "circOut" }}
                    />
                    {/* Traveling energy pulse */}
                    <motion.div 
                        className="absolute w-[60px] h-[300px] bg-white rounded-full blur-[40px] opacity-40"
                        animate={{ 
                            y: ['-100%', '100%']
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                </div>

                <div 
                    className="relative z-10 flex flex-col items-start w-full md:w-[45%] lg:w-[35%] ml-auto mt-24 md:mt-0 pl-4 md:pl-0"
                    style={{ transform: "translateZ(50px)" }}
                >
                    <h1 className="relative font-teko font-bold tracking-widest text-left flex flex-col items-start w-full uppercase pb-8">
                        
                        {/* ASCENT - Large Hollow Background Text */}
                        <motion.div 
                            className="text-[6rem] md:text-[9rem] lg:text-[12rem] leading-[0.75] text-transparent relative z-0"
                            style={{ 
                                WebkitTextStroke: '2px rgba(255, 70, 85, 0.9)',
                                textShadow: '0 0 40px rgba(255, 70, 85, 0.5)'
                            }}
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        >
                            ASCENT
                        </motion.div>
                        
                        {/* 2026 - Solid Foreground Text with Hard Shadow */}
                        <motion.div 
                            className="text-[4rem] md:text-[7rem] lg:text-[9.5rem] leading-[0.8] text-white absolute top-[40%] left-[8%] z-10 flex items-center gap-4"
                            style={{ 
                                textShadow: '6px 6px 0px #ff4655, 15px 15px 30px rgba(0,0,0,0.8)'
                            }}
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        >
                            2026
                            
                            {/* Static Solid Block Cursor matching cover art's sharp edges */}
                            <motion.div 
                                className="w-4 md:w-5 lg:w-6 h-[3.5rem] md:h-[5.5rem] lg:h-[7.5rem] bg-[#ff4655] shadow-[0_0_20px_#ff4655]"
                                style={{ boxShadow: '6px 6px 0px rgba(0,0,0,0.5)' }}
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
