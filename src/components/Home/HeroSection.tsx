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
            {/* The Black Void (revealed by the claw tear) */}
            <div className="absolute inset-0 bg-[#08080a] w-full h-full pointer-events-none z-0" />

            {/* Tech Grid in the Void */}
            <div 
                className="absolute right-0 top-0 w-1/2 h-full pointer-events-none z-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                    backgroundPosition: 'center center'
                }}
            />
            {/* The Full Cover Image (Base Layer for Desktop & Mobile) */}
            <div 
                className="absolute inset-0 w-full h-full pointer-events-none z-0"
            >
                <motion.img
                    src="/coverImage.png"
                    alt="Cover"
                    className="w-full h-full object-cover object-[25%_center] lg:object-center"
                    style={{ scale: videoScale }}
                />
            </div>

            {/* DESKTOP ONLY: The Wiper that draws the tear and void downwards */}
            <motion.div
                className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block z-10"
                initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
                animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                transition={{ duration: 1.0, ease: [0.77, 0, 0.175, 1], delay: 0.2 }}
            >
                {/* 1. The Black Void (Covers the right side of the background image) */}
                <div 
                    className="absolute inset-0 w-full h-full bg-[#08080a]"
                    style={{ clipPath: "polygon(55% 0%, 100% 0%, 100% 100%, 38% 100%, 42% 92%, 56% 82%, 50% 72%, 58% 62%, 54% 52%, 68% 40%, 54% 28%, 62% 18%, 55% 8%)" }}
                />

                {/* Giant watermark moved INSIDE the void */}
                <div className="absolute right-[-10%] top-[20%] text-[20rem] lg:text-[30rem] font-teko font-black text-white opacity-[0.03] transform -rotate-90 pointer-events-none z-0 tracking-tighter mix-blend-overlay">
                    ASCENT
                </div>

                {/* 2. Glow Layers (Left polygon shifted right, so they bleed into the void) */}
                {/* Deepest Red Ambient Glow */}
                <div 
                    className="absolute inset-0 w-full h-full pointer-events-none bg-[#00f0ff] opacity-60 blur-[40px] transform translate-x-[25px]"
                    style={{ clipPath: "polygon(0_0,55%_0,55%_8%,62%_18%,54%_28%,68%_40%,54%_52%,58%_62%,50%_72%,56%_82%,42%_92%,38%_100%,0_100%)" }}
                />
                {/* Glowing Hot Edge */}
                <div 
                    className="absolute inset-0 w-full h-full pointer-events-none bg-[#00f0ff] opacity-100 blur-[12px] transform translate-x-[10px]"
                    style={{ clipPath: "polygon(0_0,55%_0,55%_8%,62%_18%,54%_28%,68%_40%,54%_52%,58%_62%,50%_72%,56%_82%,42%_92%,38%_100%,0_100%)" }}
                />
                {/* Sharper hot core */}
                <div 
                    className="absolute inset-0 w-full h-full pointer-events-none bg-white opacity-100 blur-[4px] transform translate-x-[4px]"
                    style={{ clipPath: "polygon(0_0,55%_0,55%_8%,62%_18%,54%_28%,68%_40%,54%_52%,58%_62%,50%_72%,56%_82%,42%_92%,38%_100%,0_100%)" }}
                />
                {/* Intense white spark core */}
                <div 
                    className="absolute inset-0 w-full h-full pointer-events-none bg-white opacity-100 blur-[1px] transform translate-x-[1px]"
                    style={{ clipPath: "polygon(0_0,55%_0,55%_8%,62%_18%,54%_28%,68%_40%,54%_52%,58%_62%,50%_72%,56%_82%,42%_92%,38%_100%,0_100%)" }}
                />

                {/* 3. Left Side Image (Perfectly covers the glow layers on the left side) */}
                <div 
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    style={{ clipPath: "polygon(0_0,55%_0,55%_8%,62%_18%,54%_28%,68%_40%,54%_52%,58%_62%,50%_72%,56%_82%,42%_92%,38%_100%,0_100%)" }}
                >
                    <motion.img
                        src="/coverImage.png"
                        alt="Cover Torn"
                        className="w-full h-full object-cover"
                        style={{ scale: videoScale }}
                    />
                </div>
            </motion.div>

            {/* Radial Vignette Mask (Darker on mobile for text readability) */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#08080a_110%)] md:bg-[radial-gradient(ellipse_at_center,transparent_0%,#08080a_110%)] pointer-events-none z-10 opacity-90" />
            
            {/* Darker gradient at the bottom to smoothly blend into the next section */}
            <div className="absolute bottom-0 left-0 w-full h-48 md:h-48 bg-gradient-to-t from-[#0d121f] to-transparent pointer-events-none z-10" />
            <div className="absolute bottom-0 left-0 w-full h-80 bg-gradient-to-t from-[#0d121f] via-[#0d121f]/80 to-transparent pointer-events-none z-10 lg:hidden" />

            {/* Content Container */}
            <motion.div 
                className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-16 lg:px-24 flex flex-col items-center lg:items-end justify-end lg:justify-center h-full pb-16 lg:pb-0"
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
                {/* Localized Frost/Blur Panel (Mobile Only) */}
                <div 
                    className="absolute inset-[-40px] pointer-events-none z-0 mix-blend-hard-light lg:hidden"
                    style={{
                        backdropFilter: 'blur(8px) brightness(0.8)',
                        WebkitBackdropFilter: 'blur(8px) brightness(0.8)',
                        maskImage: 'linear-gradient(to top, black 20%, transparent 60%)',
                        WebkitMaskImage: 'linear-gradient(to top, black 20%, transparent 60%)',
                        transform: "translateZ(-50px)"
                    }}
                />

                <div 
                    className="relative z-10 flex flex-col lg:flex-row items-center lg:items-center justify-center lg:justify-start w-full md:w-[65%] lg:w-[45%] lg:ml-auto mt-auto lg:mt-0 pl-0 lg:pl-12 xl:pl-16"
                    style={{ transform: "translateZ(50px)" }}
                >

                    {/* The Text Lockup: Clean, Stacked, Valorant UI Style */}
                    <motion.div 
                        className="flex flex-col items-center w-full relative z-10"
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                    >
                        {/* Huge ambient blue glow behind text for contrast */}
                        <div className="absolute top-1/2 left-1/2 w-[300px] lg:w-[500px] h-[300px] lg:h-[400px] bg-[#00f0ff] opacity-20 blur-[80px] lg:blur-[120px] rounded-full transform -translate-x-1/2 -translate-y-1/2 pointer-events-none mix-blend-screen z-0" />

                        {/* Top: GAME RESPONSIBLY */}
                        <div className="text-[#ff4655] font-sans font-bold tracking-[0.2em] md:tracking-[0.3em] text-sm md:text-base lg:text-lg mb-2 md:mb-4 relative z-10 drop-shadow-md uppercase">
                            GAME RESPONSIBLY
                        </div>

                        {/* Middle: ASCENT (The massive title) */}
                        <div className="font-teko text-[5.5rem] sm:text-[7rem] md:text-[9rem] lg:text-[11rem] leading-[0.8] font-black tracking-normal uppercase text-[#ece8e1] z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
                            ASCENT
                        </div>

                        {/* Bottom: TOURNAMENT // 2026 */}
                        <div className="font-mono text-[10px] md:text-sm tracking-[0.4em] md:tracking-[0.6em] text-white uppercase font-bold drop-shadow-lg relative z-10 mt-2 md:mt-0">
                            TOURNAMENT // 2026
                        </div>

                        {/* Tiny Red Geometric Accents (Valorant V abstraction) */}
                        <div className="mt-6 md:mt-8 flex gap-1.5 relative z-10 opacity-90">
                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#ff4655] transform rotate-45"></div>
                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#ff4655] transform rotate-45"></div>
                        </div>

                        <div className="w-full max-w-[200px] md:max-w-[300px] h-[1px] bg-white/20 mt-6 md:mt-8 mb-4 md:mb-6 relative z-10"></div>

                        <h2 className="font-mono text-xs sm:text-sm md:text-base lg:text-lg tracking-[0.3em] md:tracking-[0.5em] text-white/60 uppercase font-medium drop-shadow-md relative z-10">
                            Where Legends Ascend
                        </h2>
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
