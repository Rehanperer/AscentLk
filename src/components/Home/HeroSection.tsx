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
            {/* Giant watermark in the void */}
            <div className="absolute right-[-10%] top-[20%] text-[20rem] lg:text-[30rem] font-teko font-black text-white opacity-[0.02] transform -rotate-90 pointer-events-none z-0 tracking-tighter mix-blend-overlay">
                ASCENT
            </div>

            {/* Deepest Red Ambient Glow for the Tear */}
            <motion.div 
                className="absolute inset-0 w-full h-full pointer-events-none bg-[#ff4655] opacity-40 blur-[40px] transform translate-x-[25px] [clip-path:polygon(0_0,100%_0,100%_100%,0_100%)] lg:[clip-path:polygon(0_0,69%_0,62%_15%,71%_30%,59%_48%,70%_65%,58%_80%,68%_92%,62%_100%,0_100%)] z-0"
                style={{ scale: videoScale }}
            />
            {/* Glowing Hot Edge Behind Tear */}
            <motion.div 
                className="absolute inset-0 w-full h-full pointer-events-none bg-[#ff4655] opacity-80 blur-[10px] transform translate-x-[10px] [clip-path:polygon(0_0,100%_0,100%_100%,0_100%)] lg:[clip-path:polygon(0_0,69%_0,62%_15%,71%_30%,59%_48%,70%_65%,58%_80%,68%_92%,62%_100%,0_100%)] z-0"
                style={{ scale: videoScale }}
            />
            {/* Sharper hot core of the tear edge */}
            <motion.div 
                className="absolute inset-0 w-full h-full pointer-events-none bg-white opacity-90 blur-[3px] transform translate-x-[4px] [clip-path:polygon(0_0,100%_0,100%_100%,0_100%)] lg:[clip-path:polygon(0_0,69%_0,62%_15%,71%_30%,59%_48%,70%_65%,58%_80%,68%_92%,62%_100%,0_100%)] z-0"
                style={{ scale: videoScale }}
            />

            {/* The Claw-Torn Cover Image */}
            <motion.div 
                className="absolute inset-0 w-full h-full pointer-events-none [clip-path:polygon(0_0,100%_0,100%_100%,0_100%)] lg:[clip-path:polygon(0_0,69%_0,62%_15%,71%_30%,59%_48%,70%_65%,58%_80%,68%_92%,62%_100%,0_100%)] z-0"
                style={{ scale: videoScale }}
            >
                <img
                    src="/coverImage.png"
                    alt="Ascent 2026 Background"
                    className="w-full h-full object-cover md:object-[30%_center] opacity-100 brightness-90"
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
                {/* Localized Frost/Blur Panel pushed to the right side (Mobile Only since Desktop is black) */}
                <div 
                    className="absolute inset-[-40px] pointer-events-none z-0 mix-blend-hard-light lg:hidden"
                    style={{
                        backdropFilter: 'blur(16px) brightness(0.6)',
                        WebkitBackdropFilter: 'blur(16px) brightness(0.6)',
                        maskImage: 'radial-gradient(ellipse at 85% 50%, black 40%, transparent 70%)',
                        WebkitMaskImage: 'radial-gradient(ellipse at 85% 50%, black 40%, transparent 70%)',
                        transform: "translateZ(-50px)"
                    }}
                />

                <div 
                    className="relative z-10 flex flex-row items-center justify-start w-full md:w-[55%] lg:w-[40%] ml-auto mt-24 md:mt-0 pl-8 lg:pl-6 xl:pl-16"
                    style={{ transform: "translateZ(50px)" }}
                >
                    {/* Floating Embers emitting from the tear */}
                    <div className="absolute inset-0 pointer-events-none z-0 hidden lg:block overflow-hidden transform -translate-x-[50%]">
                        {[...Array(15)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1 h-1 md:w-1.5 md:h-1.5 bg-white rounded-full shadow-[0_0_15px_#ff4655,0_0_30px_#ff4655]"
                                style={{
                                    left: `${50 + Math.random() * 20}%`,
                                    top: `${Math.random() * 100}%`,
                                }}
                                animate={{
                                    y: [0, -100 - Math.random() * 300],
                                    x: [0, (Math.random() - 0.5) * 150],
                                    opacity: [0, 0.9, 0],
                                    scale: [0, Math.random() * 1.5 + 0.5, 0]
                                }}
                                transition={{
                                    duration: 3 + Math.random() * 5,
                                    repeat: Infinity,
                                    delay: Math.random() * 5,
                                    ease: "easeOut"
                                }}
                            />
                        ))}
                    </div>
                    {/* The Text Lockup: Clean, Stacked, Cinematic */}
                    <motion.div 
                        className="flex flex-col items-start w-full relative z-10"
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                    >
                        {/* Huge ambient red glow behind text */}
                        <div className="absolute top-[40%] left-[20%] w-[400px] h-[300px] bg-[#ff4655] opacity-20 blur-[100px] rounded-full transform -translate-y-1/2 pointer-events-none mix-blend-screen z-0" />

                        {/* Tactical Overline */}
                        <div className="font-mono text-[10px] md:text-xs text-[#ff4655] tracking-[0.3em] mb-4 flex items-center gap-3 drop-shadow-[0_0_5px_#ff4655] relative z-10">
                            <span className="w-10 h-[2px] bg-[#ff4655]"></span>
                            SYS_INIT_2026
                        </div>

                        {/* Shattered "ASCENT" text */}
                        <div className="relative font-teko text-[5rem] md:text-[6rem] lg:text-[7.5rem] leading-[0.85] font-bold tracking-widest uppercase z-10 w-full">
                            {/* Base drop shadow layer */}
                            <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500 drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)] opacity-40">ASCENT</span>
                            {/* Sliced Piece 1 */}
                            <span className="absolute top-0 left-0 text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-300 [clip-path:polygon(0_0,35%_0,25%_100%,0_100%)] transform -translate-x-[2px] translate-y-[2px]">ASCENT</span>
                            {/* Sliced Piece 2 */}
                            <span className="absolute top-0 left-0 text-transparent bg-clip-text bg-gradient-to-b from-zinc-200 to-zinc-500 [clip-path:polygon(35%_0,70%_0,55%_100%,25%_100%)] transform translate-x-[3px] -translate-y-[1px]">ASCENT</span>
                            {/* Sliced Piece 3 */}
                            <span className="relative text-transparent bg-clip-text bg-gradient-to-b from-zinc-300 to-zinc-600 [clip-path:polygon(70%_0,100%_0,100%_100%,55%_100%)] transform -translate-x-[1px] translate-y-[3px] inline-block">ASCENT</span>
                        </div>

                        {/* Shattered "2026" text */}
                        <div className="relative font-teko text-[5rem] md:text-[6rem] lg:text-[7.5rem] leading-[0.85] font-bold tracking-widest uppercase flex items-center gap-6 z-10 w-full mb-2">
                            <div className="relative inline-block">
                                <span className="absolute inset-0 text-[#ff4655] drop-shadow-[0_0_30px_rgba(255,70,85,0.6)] opacity-40">2026</span>
                                <span className="absolute top-0 left-0 text-[#ff4655] [clip-path:polygon(0_0,30%_0,40%_100%,0_100%)] transform translate-x-[2px] -translate-y-[2px]">2026</span>
                                <span className="absolute top-0 left-0 text-[#ff5b68] [clip-path:polygon(30%_0,60%_0,70%_100%,40%_100%)] transform -translate-x-[2px] translate-y-[1px]">2026</span>
                                <span className="relative text-[#e83b49] [clip-path:polygon(60%_0,100%_0,100%_100%,70%_100%)] transform translate-x-[1px] inline-block">2026</span>
                            </div>
                            
                            {/* Valorant style cursor box */}
                            <div className="w-5 h-5 md:w-6 md:h-6 bg-transparent border-[3px] border-[#ff4655] shadow-[0_0_15px_#ff4655] animate-pulse hidden md:flex items-center justify-center relative mt-2">
                                <div className="w-2 h-2 md:w-3 md:h-3 bg-[#ff4655]"></div>
                            </div>
                        </div>
                        
                        <div className="w-full max-w-[500px] h-[2px] bg-gradient-to-r from-[#ff4655] to-transparent mt-6 md:mt-8 mb-4 md:mb-6 opacity-80 relative z-10">
                            {/* Tactical white notch */}
                            <div className="absolute left-0 top-[0px] w-12 h-[2px] bg-white shadow-[0_0_10px_white]"></div>
                        </div>

                        <h2 className="font-mono text-xs md:text-sm tracking-[0.6em] md:tracking-[0.8em] text-white uppercase font-bold drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] relative z-10">
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
