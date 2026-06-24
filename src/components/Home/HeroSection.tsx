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

                <div 
                    className="relative z-10 flex flex-row items-center justify-start w-full md:w-[50%] lg:w-[45%] ml-auto mt-24 md:mt-0 pl-4 md:pl-0"
                    style={{ transform: "translateZ(50px)" }}
                >
                    {/* The Sick Element: Tactical Esports Speed Stripes */}
                    <motion.div 
                        className="hidden md:flex gap-3 mr-8 lg:mr-12"
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        {/* Primary thick bar */}
                        <div className="w-5 lg:w-8 h-[300px] lg:h-[450px] bg-gradient-to-b from-[#ff4655] to-[#8a1c25] shadow-[0_0_30px_#ff4655] transform skew-x-[-12deg]" />
                        {/* Secondary thinner bar */}
                        <div className="w-2 lg:w-3 h-[300px] lg:h-[450px] bg-[#ff4655] opacity-60 transform skew-x-[-12deg]" />
                        {/* Tertiary accent line */}
                        <div className="w-1 lg:w-1.5 h-[300px] lg:h-[450px] bg-[#ff4655] opacity-30 transform skew-x-[-12deg]" />
                    </motion.div>

                    {/* The Text Lockup: Clean, Stacked, Cinematic */}
                    <motion.div 
                        className="flex flex-col items-start"
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                    >
                        <h1 className="font-teko text-[5rem] md:text-[8rem] lg:text-[11rem] leading-[0.75] font-bold text-white tracking-widest drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] uppercase">
                            ASCENT
                        </h1>
                        <h1 className="font-teko text-[5rem] md:text-[8rem] lg:text-[11rem] leading-[0.75] font-bold text-[#ff4655] tracking-widest drop-shadow-[0_10px_30px_rgba(255,70,85,0.4)] uppercase flex items-center gap-4">
                            2026
                            <div className="w-4 h-4 md:w-6 md:h-6 bg-white rounded-full shadow-[0_0_15px_white] animate-pulse hidden md:block"></div>
                        </h1>
                        
                        <div className="w-full h-[1px] bg-gradient-to-r from-zinc-500 to-transparent mt-6 md:mt-8 mb-4 md:mb-6 opacity-60"></div>

                        <h2 className="font-mono text-xs md:text-sm tracking-[0.6em] md:tracking-[0.8em] text-zinc-300 uppercase font-bold drop-shadow-md">
                            Where Legends Ascend
                        </h2>
                    </motion.div>
                </div>
                    {/* Replaced by inline content above */}

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
