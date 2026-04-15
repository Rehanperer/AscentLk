import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

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

    useEffect(() => {
        if (videoRef.current) {
            // Attempt to force play for mobile data saving policies
            videoRef.current.play().catch(e => console.log("Video autoplay blocked:", e));
        }
    }, []);

    return (
        <section 
            ref={containerRef}
            className="relative w-full h-[70vh] md:h-[75vh] flex items-center justify-center overflow-hidden bg-[#08080a]"
        >
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
                className="relative z-20 flex flex-col items-center justify-center w-full max-w-4xl px-6"
                style={{ y: textY, opacity: textOpacity }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            >
                {/* Localized Frost/Blur Panel using a Mask Image so edges feather out smoothly */}
                <div 
                    className="absolute inset-[-40px] pointer-events-none z-0 mix-blend-hard-light"
                    style={{
                        backdropFilter: 'blur(16px) brightness(0.6)',
                        WebkitBackdropFilter: 'blur(16px) brightness(0.6)',
                        maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
                        WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
                    }}
                />

                <div className="relative z-10 flex flex-col items-center">
                    <h1 className="font-teko text-[5.5rem] md:text-[9rem] lg:text-[11rem] leading-none font-bold text-white tracking-widest text-center drop-shadow-2xl">
                        ASCENT <span className="text-[#ff4655]">2026</span>
                    </h1>

                    {/* Animated divider line */}
                    <motion.div 
                        className="h-[2px] bg-gradient-to-r from-transparent via-[#ff4655] to-transparent w-full mt-2 md:mt-4 opacity-80"
                        initial={{ width: 0 }}
                        animate={{ width: "80%" }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.8 }}
                    />
                    
                    <motion.div 
                        className="font-mono text-[9px] md:text-xs tracking-[0.4em] md:tracking-[0.6em] text-white/50 uppercase mt-4 mb-10 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 1.5 }}
                    >
                        Where Legends Ascend
                    </motion.div>

                    {/* Glassmorphism Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/register')}
                        className="group relative flex items-center gap-3 px-8 md:px-12 py-4 cursor-pointer overflow-hidden transition-all duration-300"
                    >
                        {/* Glass Background */}
                        <div className="absolute inset-0 bg-white/5 backdrop-blur-md border border-white/20 group-hover:border-[#ff4655]/50 group-hover:bg-[#ff4655]/10 rounded-sm transition-all duration-500" />
                        
                        {/* Shimmer Effect */}
                        <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] group-hover:animate-[shimmer_1.5s_infinite]" />

                        <span className="relative z-10 font-teko text-2xl md:text-3xl font-bold tracking-widest text-white group-hover:text-white transition-colors uppercase">
                            Register Now
                        </span>
                        
                        {/* Red tactical dot */}
                        <span className="relative z-10 w-1.5 h-1.5 rounded-full bg-[#ff4655] shadow-[0_0_10px_#ff4655] group-hover:shadow-[0_0_15px_#ff4655] group-hover:scale-150 transition-all duration-300" />
                    </motion.button>
                </div>
            </motion.div>

        </section>
    );
};

export default HeroSection;
