import {
    useEffect,
    useRef,
    useState,
    ReactNode,
    TouchEvent,
    WheelEvent,
} from 'react';
import { motion } from 'framer-motion';
import ScrambleText from '../ScrambleText';

interface ScrollExpandMediaProps {
    mediaType?: 'video' | 'image';
    mediaSrc: string;
    posterSrc?: string;
    bgImageSrc: string;
    title?: string;
    date?: string;
    scrollToExpand?: string;
    textBlend?: boolean;
    partners?: string[];
    children?: ReactNode;
    onMediaLoaded?: () => void;
}

const ScrollExpandMedia = ({
    mediaType = 'video',
    mediaSrc,
    posterSrc,
    bgImageSrc,
    title,
    date,
    scrollToExpand,
    textBlend = true,
    partners = [],
    children,
    onMediaLoaded,
}: ScrollExpandMediaProps) => {
    const [scrollProgress, setScrollProgress] = useState<number>(0);
    const [showContent, setShowContent] = useState<boolean>(false);
    const [mediaFullyExpanded, setMediaFullyExpanded] = useState<boolean>(false);
    const [touchStartY, setTouchStartY] = useState<number>(0);
    const [isMobileState, setIsMobileState] = useState<boolean>(false);

    const sectionRef = useRef<HTMLDivElement | null>(null);

    // If it's a YouTube embed, we can't easily track load, so we treat it as loaded immediately (or after a timeout)
    useEffect(() => {
        if (mediaType === 'video' && (mediaSrc.includes('youtube.com') || mediaSrc.includes('youtu.be'))) {
            // Give a small buffer for iframe to likely init
            const t = setTimeout(() => {
                onMediaLoaded && onMediaLoaded();
            }, 1000);
            return () => clearTimeout(t);
        }
    }, [mediaType, mediaSrc, onMediaLoaded]);

    const handleMediaLoad = () => {
        if (onMediaLoaded) onMediaLoaded();
    };

    useEffect(() => {
        setScrollProgress(0);
        setShowContent(false);
        setMediaFullyExpanded(false);
    }, [mediaType]);

    // ... rest of effects ...

    // (Skipping existing useEffect for scroll logic - assume it's unchanged)
    useEffect(() => {
        let rafId: number;
        let isProcessing = false;

        const handleWheel = (e: WheelEvent) => {
            if (e.ctrlKey) return; // Allow pinch-zoom

            if (isProcessing) return;
            isProcessing = true;

            rafId = requestAnimationFrame(() => {
                if (mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= 5) {
                    setMediaFullyExpanded(false);
                } else if (!mediaFullyExpanded) {
                    const scrollDelta = e.deltaY * 0.0012;
                    const newProgress = Math.min(Math.max(scrollProgress + scrollDelta, 0), 1);

                    if (newProgress !== scrollProgress) {
                        setScrollProgress(newProgress);
                    }

                    if (newProgress >= 1) {
                        setMediaFullyExpanded(true);
                        setShowContent(true);
                    } else if (newProgress < 0.75) {
                        setShowContent(false);
                    }
                }
                isProcessing = false;
            });

            if (!mediaFullyExpanded || (mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= 5)) {
                e.preventDefault();
            }
        };

        const handleTouchStart = (e: TouchEvent) => {
            setTouchStartY(e.touches[0].clientY);
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!touchStartY) return;
            if (e.touches.length > 1) return;

            if (!mediaFullyExpanded) {
                if (e.cancelable) e.preventDefault();
            }

            if (isProcessing) return;
            isProcessing = true;

            rafId = requestAnimationFrame(() => {
                const touchY = e.touches[0].clientY;
                const deltaY = touchStartY - touchY;

                if (mediaFullyExpanded && deltaY < -20 && window.scrollY <= 5) {
                    setMediaFullyExpanded(false);
                } else if (!mediaFullyExpanded) {
                    const scrollFactor = deltaY < 0 ? 0.008 : 0.005;
                    const scrollDelta = deltaY * scrollFactor;
                    const newProgress = Math.min(Math.max(scrollProgress + scrollDelta, 0), 1);

                    if (newProgress !== scrollProgress) {
                        setScrollProgress(newProgress);
                    }

                    if (newProgress >= 1) {
                        setMediaFullyExpanded(true);
                        setShowContent(true);
                    } else if (newProgress < 0.75) {
                        setShowContent(false);
                    }
                    setTouchStartY(touchY);
                }
                isProcessing = false;
            });
        };

        const handleTouchEnd = (): void => {
            setTouchStartY(0);
        };

        const handleScroll = (): void => {
            if (!mediaFullyExpanded) {
                window.scrollTo(0, 0);
            }
        };

        window.addEventListener('wheel', handleWheel as unknown as EventListener, { passive: false });
        window.addEventListener('scroll', handleScroll as EventListener);
        window.addEventListener('touchstart', handleTouchStart as unknown as EventListener, { passive: false });
        window.addEventListener('touchmove', handleTouchMove as unknown as EventListener, { passive: false });
        window.addEventListener('touchend', handleTouchEnd as EventListener);

        return () => {
            window.removeEventListener('wheel', handleWheel as unknown as EventListener);
            window.removeEventListener('scroll', handleScroll as EventListener);
            window.removeEventListener('touchstart', handleTouchStart as unknown as EventListener);
            window.removeEventListener('touchmove', handleTouchMove as unknown as EventListener);
            window.removeEventListener('touchend', handleTouchEnd as EventListener);
            cancelAnimationFrame(rafId);
        };
    }, [scrollProgress, mediaFullyExpanded, touchStartY]);

    useEffect(() => {
        const checkIfMobile = (): void => {
            setIsMobileState(window.innerWidth < 768);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    const mediaWidth = isMobileState
        ? 240 + scrollProgress * (window.innerWidth - 240)
        : 300 + scrollProgress * 1250;
    const mediaHeight = isMobileState
        ? 340 + scrollProgress * (window.innerHeight - 340)
        : 400 + scrollProgress * 400;
    const textTranslateX = scrollProgress * (isMobileState ? 100 : 150);

    const firstWord = title ? title.split(' ')[0] : '';
    const restOfTitle = title ? title.split(' ').slice(1).join(' ') : '';

    return (
        <div
            ref={sectionRef}
            className='transition-colors duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-x-hidden'
        >
            <section className='relative flex flex-col items-center justify-start min-h-[100dvh]'>
                <div className='relative w-full flex flex-col items-center min-h-[100dvh]'>
                    <motion.div
                        className='absolute inset-0 z-0 h-full overflow-hidden'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 - scrollProgress }}
                        transition={{ duration: 0.1 }}
                    >
                        {bgImageSrc && bgImageSrc !== 'grid' ? (
                            <>
                                <img
                                    src={bgImageSrc}
                                    alt='Background'
                                    className='w-screen h-screen object-cover object-center'
                                />
                                <div className='absolute inset-0 bg-black/40' />
                            </>
                        ) : (
                            <div className="w-full h-full relative overflow-hidden">
                                <div className="absolute inset-0 bg-grid opacity-60" />
                                <div className="absolute inset-0 bg-radial-glow opacity-40" />
                                <div className="absolute inset-0 bg-gradient-to-b from-[#0f1923]/60 via-transparent to-[#0f1923]/60" />
                            </div>
                        )}
                    </motion.div>

                    <div className='container mx-auto flex flex-col items-center justify-start relative z-10'>
                        <div className='flex flex-col items-center justify-center w-full h-[100dvh] relative'>
                            <motion.div
                                className='absolute z-0 top-1/2 left-1/2 rounded-3xl overflow-hidden'
                                style={{
                                    x: '-50%',
                                    y: '-50%',
                                    width: mediaWidth,
                                    height: mediaHeight,
                                    borderRadius: isMobileState ? (1 - scrollProgress) * 32 : 4,
                                    boxShadow: '0px 0px 50px rgba(0, 0, 0, 0.4)'
                                }}
                            >
                                {mediaType === 'video' ? (
                                    mediaSrc.includes('youtube.com') || mediaSrc.includes('youtu.be') ? (
                                        <div className='relative w-full h-full pointer-events-none'>
                                            <iframe
                                                width='100%'
                                                height='100%'
                                                src={
                                                    mediaSrc.includes('embed')
                                                        ? mediaSrc +
                                                        (mediaSrc.includes('?') ? '&' : '?') +
                                                        'autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1'
                                                        : mediaSrc.replace('watch?v=', 'embed/') +
                                                        '?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1'
                                                }
                                                className='w-full h-full rounded-3xl'
                                                frameBorder='0'
                                                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                                                allowFullScreen
                                            />
                                            <div className='absolute inset-0 z-10' style={{ pointerEvents: 'none' }}></div>
                                            <motion.div
                                                className='absolute inset-0 bg-black/30 rounded-3xl'
                                                initial={{ opacity: 0.7 }}
                                                animate={{ opacity: 0.5 - scrollProgress * 0.3 }}
                                                transition={{ duration: 0.2 }}
                                            />
                                        </div>
                                    ) : (
                                        <div className='relative w-full h-full pointer-events-none'>
                                            <video
                                                src={mediaSrc}
                                                poster={posterSrc}
                                                autoPlay
                                                muted
                                                loop
                                                playsInline
                                                preload='auto'
                                                className='w-full h-full object-cover rounded-3xl bg-black/20'
                                                controls={false}
                                                disablePictureInPicture
                                                disableRemotePlayback
                                                onCanPlayThrough={handleMediaLoad}
                                                onError={handleMediaLoad} // Fail safely
                                            />
                                            <div className='absolute inset-0 z-10' style={{ pointerEvents: 'none' }}></div>
                                            <motion.div
                                                className='absolute inset-0 bg-black/30 rounded-3xl'
                                                initial={{ opacity: 0.7 }}
                                                animate={{ opacity: 0.5 - scrollProgress * 0.3 }}
                                                transition={{ duration: 0.2 }}
                                            />
                                        </div>
                                    )
                                ) : (
                                    <div className='relative w-full h-full'>
                                        <img
                                            src={mediaSrc}
                                            alt={title || 'Media content'}
                                            className='w-full h-full object-cover rounded-3xl'
                                            onLoad={handleMediaLoad}
                                            onError={handleMediaLoad} // Fail safely
                                        />
                                        <motion.div
                                            className='absolute inset-0 bg-black/50 rounded-3xl'
                                            initial={{ opacity: 0.7 }}
                                            animate={{ opacity: 0.7 - scrollProgress * 0.3 }}
                                            transition={{ duration: 0.2 }}
                                        />
                                    </div>
                                )}

                                <div className='flex flex-col items-center text-center relative z-10 mt-4 transition-none'>
                                    {date && (
                                        <p
                                            className='text-2xl text-white font-teko uppercase'
                                            style={{ transform: `translateX(-${textTranslateX}vw)` }}
                                        >
                                            {date}
                                        </p>
                                    )}
                                    {scrollToExpand && (
                                        <p
                                            className='text-white/50 font-medium text-center uppercase tracking-widest text-[10px] md:text-xs'
                                            style={{ transform: `translateX(${textTranslateX}vw)` }}
                                        >
                                            {scrollToExpand}
                                        </p>
                                    )}
                                </div>
                            </motion.div>

                            <motion.div
                                className="absolute bottom-10 left-10 hidden md:flex items-center gap-3 opacity-60 z-20"
                                style={{ opacity: 1 - scrollProgress }}
                            >
                                <span className="uppercase text-[10px] tracking-[0.3em] font-mono opacity-50">SCROLL TO BEGIN</span>
                                <div className="w-12 h-[1px] bg-white/20"></div>
                            </motion.div>

                            <motion.div
                                className="absolute bottom-10 right-10 hidden md:flex flex-col items-end z-20 opacity-40 mix-blend-difference"
                                style={{ opacity: 1 - scrollProgress }}
                            >
                                <div className="text-[10px] uppercase tracking-widest mb-1 text-white font-medium">Supported By</div>
                                <div className="flex gap-4">
                                    {[...partners].map((src: string, i: number) => (
                                        <img key={i} src={src} className="h-4 w-auto grayscale brightness-200" alt="Partner" />
                                    ))}
                                </div>
                            </motion.div>

                            <div
                                className={`flex items-center justify-center text-center gap-4 w-full relative z-10 transition-none flex-col ${textBlend ? 'mix-blend-difference' : 'mix-blend-normal'}`}
                            >
                                <motion.h2
                                    className='text-7xl md:text-8xl lg:text-[7rem] font-medium font-teko uppercase drop-shadow-2xl'
                                    data-text={firstWord}
                                    style={{
                                        // Removed transform to prevent clipping
                                        scale: 1 - scrollProgress * 0.2, // Added scale effect instead
                                        background: 'linear-gradient(to bottom, #ffffff 0%, #e0e0e0 45%, #b0b0b0 50%, #e0e0e0 55%, #ffffff 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        letterSpacing: '0.2em'
                                    }}
                                >
                                    <ScrambleText text={firstWord} />
                                </motion.h2>
                                <motion.h2
                                    className='text-8xl md:text-8xl lg:text-[11rem] font-bold text-center font-teko uppercase drop-shadow-2xl tracking-tighter mt-2 md:mt-4 w-full px-4'
                                    data-text={restOfTitle}
                                    style={{
                                        // Removed transform to prevent clipping
                                        scale: 1 + scrollProgress * 0.2, // Added scale effect instead
                                        background: 'linear-gradient(to bottom, #ffffff 10%, #d1d1d1 50%, #ffffff 90%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        lineHeight: 1
                                    }}
                                >
                                    <ScrambleText text={restOfTitle} />
                                </motion.h2>
                            </div>
                        </div>

                        <motion.section
                            className='flex flex-col w-full'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: showContent ? 1 : 0 }}
                            transition={{ duration: 0.7 }}
                        >
                            <div className="pt-20">
                                {children}
                            </div>
                        </motion.section>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ScrollExpandMedia;
