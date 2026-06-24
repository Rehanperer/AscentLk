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
                    className="relative z-10 flex flex-row items-center justify-start w-full md:w-[55%] lg:w-[50%] ml-auto mt-24 md:mt-0 pl-8 lg:pl-12"
                    style={{ transform: "translateZ(50px)" }}
                >
                    {/* Valorant Themed Tactical Separator */}
                    <div className="absolute inset-y-0 left-0 w-[80px] z-10 hidden md:flex flex-col justify-center items-center pointer-events-none transform -translate-x-full pr-8">
                        
                        {/* Top decorative lines */}
                        <div className="flex gap-1 mb-8 opacity-80">
                            <div className="w-1.5 h-10 bg-white transform skew-x-[-20deg] shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                            <div className="w-1.5 h-10 bg-[#ff4655] transform skew-x-[-20deg] shadow-[0_0_10px_rgba(255,70,85,0.5)]"></div>
                        </div>

                        {/* Main separator body */}
                        <div className="relative w-full flex items-center justify-center">
                            {/* Glowing core line */}
                            <motion.div 
                                className="w-[2px] h-[45vh] bg-white shadow-[0_0_15px_#ff4655,0_0_30px_#ff4655]"
                                initial={{ scaleY: 0 }}
                                animate={{ scaleY: 1 }}
                                transition={{ duration: 1, ease: "circOut" }}
                            />
                            {/* Thick red accent block overlay */}
                            <motion.div 
                                className="absolute left-1/2 w-5 h-40 bg-[#ff4655] shadow-[8px_8px_0_rgba(0,0,0,0.6)] transform -translate-x-1/2 flex flex-col justify-between py-2 items-center"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "10rem", opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.5, ease: "backOut" }}
                            >
                                {/* Inner tech details inside the red block */}
                                <div className="w-2 h-1 bg-white/80"></div>
                                <div className="w-2 h-1 bg-white/80"></div>
                            </motion.div>
                            
                            {/* Floating HUD brackets */}
                            <motion.div 
                                className="absolute left-[-10px] top-[15%] text-[#ff4655] font-mono text-2xl opacity-60 tracking-widest font-bold"
                                animate={{ x: [0, -5, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            >
                                [
                            </motion.div>
                            <motion.div 
                                className="absolute right-[-10px] bottom-[15%] text-[#ff4655] font-mono text-2xl opacity-60 tracking-widest font-bold"
                                animate={{ x: [0, 5, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                            >
                                ]
                            </motion.div>
                        </div>

                        {/* Bottom decorative diamonds */}
                        <div className="flex flex-col gap-2 mt-8 opacity-80 items-center">
                            <div className="w-3 h-3 bg-[#ff4655] transform rotate-45 shadow-[0_0_10px_#ff4655]"></div>
                            <div className="w-3 h-3 bg-transparent border-2 border-[#ff4655] transform rotate-45"></div>
                            <div className="w-[2px] h-20 bg-gradient-to-t from-transparent to-[#ff4655] mt-2"></div>
                        </div>
                    </div>

                    {/* The Text Lockup: Clean, Stacked, Cinematic */}
                    <motion.div 
                        className="flex flex-col items-start w-full relative"
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                    >
                        {/* Tactical Overline */}
                        <div className="font-mono text-[10px] md:text-xs text-[#ff4655] tracking-[0.3em] mb-3 flex items-center gap-3 drop-shadow-[0_0_5px_#ff4655]">
                            <span className="w-10 h-[2px] bg-[#ff4655]"></span>
                            SYS_INIT_2026
                        </div>

                        <h1 className="font-teko text-[5rem] md:text-[7.5rem] lg:text-[9.5rem] leading-[0.8] font-bold text-white tracking-widest drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] uppercase">
                            ASCENT
                        </h1>
                        <h1 className="font-teko text-[5rem] md:text-[7.5rem] lg:text-[9.5rem] leading-[0.8] font-bold text-[#ff4655] tracking-widest drop-shadow-[0_10px_30px_rgba(255,70,85,0.4)] uppercase flex items-center gap-4">
                            2026
                            {/* Valorant style cursor box */}
                            <div className="w-5 h-5 md:w-8 md:h-8 bg-transparent border-[3px] border-[#ff4655] shadow-[0_0_15px_#ff4655] animate-pulse hidden md:flex items-center justify-center">
                                <div className="w-2 h-2 md:w-4 md:h-4 bg-[#ff4655]"></div>
                            </div>
                        </h1>
                        
                        <div className="w-full max-w-[500px] h-[2px] bg-gradient-to-r from-zinc-500 to-transparent mt-6 md:mt-8 mb-4 md:mb-6 opacity-60 relative">
                            {/* Tactical white notch */}
                            <div className="absolute left-0 top-[-1px] w-12 h-[4px] bg-white shadow-[0_0_10px_white]"></div>
                        </div>

                        <h2 className="font-mono text-xs md:text-sm tracking-[0.6em] md:tracking-[0.8em] text-white uppercase font-bold drop-shadow-md">
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
