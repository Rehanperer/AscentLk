import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

const HeroSection: React.FC = () => {
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Intro Flow State: 'curtain' -> 'step1' (tiny box) -> 'step2' (medium box) -> 'active' (full screen)
    const [heroState, setHeroState] = useState<'curtain' | 'step1' | 'step2' | 'active'>('curtain');
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [isVideoError, setIsVideoError] = useState(false);

    // Scroll depth parallax
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
    const textY = useTransform(scrollYProgress, [0, 1], [0, 60]);
    const textOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    // 3D Mouse Parallax Effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 30, stiffness: 200 };
    const smoothMouseX = useSpring(mouseX, springConfig);
    const smoothMouseY = useSpring(mouseY, springConfig);

    const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [5, -5]);
    const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-5, 5]);

    const rectRef = useRef<DOMRect | null>(null);

    const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
        rectRef.current = e.currentTarget.getBoundingClientRect();
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        if (!rectRef.current) return;
        const rect = rectRef.current;
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        mouseX.set(x);
        mouseY.set(y);
    };

    const handleMouseLeave = () => {
        rectRef.current = null;
        mouseX.set(0);
        mouseY.set(0);
    };

    useEffect(() => {
        if (heroState === 'curtain') {
            const t = setTimeout(() => setHeroState('step1'), 1500); // Hold curtain for 1.5s
            return () => clearTimeout(t);
        }
        if (heroState === 'step1') {
            // The curtain slide-up animation takes 1.2s. 
            // We hold step1 for 2.2s total so the user sees the small box for 1 full second after the curtain opens.
            const t = setTimeout(() => setHeroState('step2'), 2200);
            return () => clearTimeout(t);
        }
        if (heroState === 'step2') {
            // Hold medium box for 1s
            const t = setTimeout(() => setHeroState('active'), 1000);
            return () => clearTimeout(t);
        }
    }, [heroState]);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(() => {});
        }
    }, [heroState]);

    return (
        <motion.section
            ref={containerRef}
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            aria-label="ASCENT 2026 Hero"
            className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black select-none z-10"
            style={{ perspective: 1200 }}
        >
            {/* ── PHASE 0: THE CURTAIN ── */}
            <AnimatePresence>
                {heroState === 'curtain' && (
                    <motion.div
                        className="absolute inset-0 bg-[#ff4655] z-[100] flex items-center justify-center pointer-events-none"
                        initial={{ y: 0 }}
                        exit={{ y: '-100vh' }}
                        transition={{ duration: 1.2, ease: [0.7, 0, 0.3, 1] }}
                    >
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex items-center gap-2 font-mono text-[10px] md:text-xs tracking-widest text-white uppercase font-bold drop-shadow-md"
                        >
                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                            ■ WHERE LEGENDS ASCEND
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* ── BACKGROUND VIDEO & FALLBACK IMAGE LAYER ── */}
            <motion.div
                className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
                style={{ scale: videoScale }}
                initial={false}
                animate={{
                    clipPath: heroState === 'step1' 
                        ? 'inset(calc(50vh - 60px) calc(50vw - 60px))' 
                        : heroState === 'step2' 
                            ? 'inset(calc(50vh - 160px) calc(50vw - 260px))' 
                            : 'inset(0px 0px 0px 0px)'
                }}
                transition={{ duration: 0.8, ease: [0.7, 0, 0.3, 1] }}
            >
                {/* Fallback Image */}
                <img
                    src="/coverImage.png"
                    alt="ASCENT 2026 Fallback"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Video Foreground */}
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    onLoadedData={() => setIsVideoLoaded(true)}
                    onCanPlay={() => setIsVideoLoaded(true)}
                    onError={() => setIsVideoError(true)}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                        isVideoLoaded && !isVideoError ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    <source src="/HD AWAKEN.mp4" type="video/mp4" />
                </video>
            </motion.div>

            {/* ── PHASE 1 & 2: LOADER VIEWFINDER CORNER MARKS ── */}
            <AnimatePresence>
                {heroState !== 'active' && (
                    <motion.div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
                        initial={false}
                        animate={{
                            width: heroState === 'step1' ? 120 : 520,
                            height: heroState === 'step1' ? 120 : 320,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: [0.7, 0, 0.3, 1] }}
                    >
                        {/* Corners */}
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/80" />
                        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/80" />
                        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/80" />
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/80" />
                        
                        {/* Progress Text */}
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 font-mono text-[9px] text-white tracking-widest opacity-80">
                            {heroState === 'step1' || heroState === 'curtain' ? '47%' : '100%'}
                        </div>
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-px bg-white/20 overflow-hidden">
                            <motion.div 
                                className="h-full bg-white/80" 
                                initial={{ width: '47%' }}
                                animate={{ width: heroState === 'step2' ? '100%' : '47%' }}
                                transition={{ duration: 0.8 }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Subtle gradient overlays for readability in active state */}
            <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none z-[1]" 
                initial={{ opacity: 0 }}
                animate={{ opacity: heroState === 'active' ? 1 : 0 }}
                transition={{ duration: 1 }}
            />
            <motion.div 
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,0,0,0.6)_0%,transparent_60%)] pointer-events-none z-[1]" 
                initial={{ opacity: 0 }}
                animate={{ opacity: heroState === 'active' ? 1 : 0 }}
                transition={{ duration: 1 }}
            />

            {/* ── PHASE 3: ACTIVE HERO STATE (Exact NoArt Size & Glassmorphism Text Effect) ── */}
            <>
                {/* ── BOTTOM-LEFT HERO CONTENT: GLASSMORPHISM TITLE ── */}
                <motion.div
                    className="absolute bottom-16 left-4 md:bottom-12 md:left-12 z-20 flex flex-col items-start pointer-events-none"
                    style={{
                        y: textY,
                        opacity: textOpacity,
                        rotateX: rotateX,
                        rotateY: rotateY,
                        transformStyle: "preserve-3d",
                        mixBlendMode: "difference"
                    }}
                >
                    <div className="relative px-4 sm:px-8 py-3 sm:py-5 flex flex-col items-center justify-center text-center"
                        style={{ transform: "translateZ(40px)" }}
                    >
                            {/* Viewfinder Corner Brackets - Framed tightly around center title (1:1 NoArt) */}
                            <motion.div 
                                className="relative px-8 sm:px-12 py-5 sm:py-7"
                            >
                                <motion.div 
                                    initial={false}
                                    animate={{ opacity: heroState === 'active' ? 1 : 0 }}
                                    transition={{ duration: 0.8 }}
                                >
                                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/90" />
                                    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white/90" />
                                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white/90" />
                                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/90" />

                                    {/* Top Subtitle */}
                                    <div className="font-mono text-[9px] sm:text-[11px] tracking-[0.4em] text-[#ff4655] uppercase font-bold mb-1 flex items-center justify-center gap-2 drop-shadow-[0_0_12px_rgba(255,70,85,0.8)]">
                                        <span className="w-1.5 h-1.5 bg-[#ff4655] rounded-full animate-ping" />
                                        GAME RESPONSIBLY
                                    </div>
                                </motion.div>

                                    {/* ── "LIQUID GLASS" TEXT ── */}
                                    <div className="relative my-0 flex items-center justify-center text-center w-full">
                                        <h1 className="relative font-major-mono text-[3.5rem] sm:text-[4.5rem] md:text-[5.5rem] lg:text-[7rem] leading-[0.8] font-bold uppercase select-none text-white drop-shadow-2xl">
                                            ASCENT
                                        </h1>
                                    </div>

                                <motion.div 
                                    initial={false}
                                    animate={{ opacity: heroState === 'active' ? 1 : 0 }}
                                    transition={{ duration: 0.8 }}
                                >
                                    {/* Bottom Tagline */}
                                    <div className="font-mono text-[9px] sm:text-[11px] tracking-[0.5em] text-white/90 uppercase font-bold mt-1 drop-shadow-md flex items-center justify-center gap-2">
                                        <span className="text-[#00f0ff]">//</span>
                                        TOURNAMENT 2026
                                        <span className="text-[#00f0ff]">//</span>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>
                </>

            {/* SEO Crawlable Text */}
            <p className="sr-only">
                ASCENT 2026 is Sri Lanka's premier student-led esports tournament, featuring competitive 5v5 Valorant matches 
                with open qualifiers, regional playoffs, and a grand final at Cinnamon Life Colombo. 
                Register your team now for the biggest gaming event in Sri Lanka 2026.
            </p>
        </motion.section>
    );
};

export default HeroSection;
