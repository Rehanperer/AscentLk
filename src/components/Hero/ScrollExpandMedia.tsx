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
}: ScrollExpandMediaProps) => {
    const [scrollProgress, setScrollProgress] = useState<number>(0);
    const [showContent, setShowContent] = useState<boolean>(false);
    const [mediaFullyExpanded, setMediaFullyExpanded] = useState<boolean>(false);
    const [touchStartY, setTouchStartY] = useState<number>(0);
    const [isMobileState, setIsMobileState] = useState<boolean>(false);

    const sectionRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setScrollProgress(0);
        setShowContent(false);
        setMediaFullyExpanded(false);
    }, [mediaType]);

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
                    // Prevent default only if we are taking over the scroll
                    // Note: Preventing default in async RAF handles is tricky, usually needs sync handler.
                    // But for performance, we let native scroll happen unless we are in the 'locked' state.
                    // Here we are emulating scroll jacking which is bad for perf usually.
                    // We will keep it but throttle state updates.

                    const scrollDelta = e.deltaY * 0.0009;
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

            // We still need to prevent default synchronously if we want to stop page scroll
            if (!mediaFullyExpanded || (mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= 5)) {
                e.preventDefault();
            }
        };

        const handleTouchStart = (e: TouchEvent) => {
            setTouchStartY(e.touches[0].clientY);
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!touchStartY) return;

            // Allow default touch actions like pinch-zoom if more than 1 touch
            if (e.touches.length > 1) return;

            // Sync prevent default to stop native scrolling while expanding
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

                    // Don't update touchStartY in RAF loop for delta calculation logic stability relative to move
                    // Actually, for continuous delta, we either update start or keep aggregating. 
                    // Let's keep existing logic but just throttle the state update.
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
                                {/* Only the grid pattern, no solid background color to let global particles show through */}
                                <div className="absolute inset-0 bg-grid opacity-60" />
                                <div className="absolute inset-0 bg-radial-glow opacity-40" />
                                <div className="absolute inset-0 bg-gradient-to-b from-[#0f1923]/60 via-transparent to-[#0f1923]/60" />
                            </div>
                        )}
                    </motion.div>

                    <div className='container mx-auto flex flex-col items-center justify-start relative z-10'>
                        <div className='flex flex-col items-center justify-center w-full h-[100dvh] relative'>
                            <div
                                className='absolute z-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-none rounded-3xl overflow-hidden'
                                style={{
                                    width: `${mediaWidth}px`,
                                    height: `${mediaHeight}px`,
                                    maxWidth: isMobileState ? '100vw' : '95vw',
                                    maxHeight: isMobileState ? '100dvh' : '85vh',
                                    boxShadow: '0px 0px 50px rgba(0, 0, 0, 0.4)',
                                    borderRadius: isMobileState ? `${(1 - scrollProgress) * 32}px` : '4px',
                                    transition: 'width 0.8s cubic-bezier(0.22, 1, 0.36, 1), height 0.8s cubic-bezier(0.22, 1, 0.36, 1), border-radius 0.5s ease'
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
                                            <div
                                                className='absolute inset-0 z-10'
                                                style={{ pointerEvents: 'none' }}
                                            ></div>

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
                                                className='w-full h-full object-contain rounded-3xl bg-black/20'
                                                controls={false}
                                                disablePictureInPicture
                                                disableRemotePlayback
                                            />
                                            <div
                                                className='absolute inset-0 z-10'
                                                style={{ pointerEvents: 'none' }}
                                            ></div>

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
                            </div>

                            {/* Powered By & Scroll Hint (Fading with scroll) */}
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
                                className={`flex items-center justify-center text-center gap-4 w-full relative z-10 transition-none flex-col ${textBlend ? 'mix-blend-difference' : 'mix-blend-normal'
                                    }`}
                            >
                                <motion.h2
                                    className='text-8xl md:text-8xl lg:text-9xl font-bold text-white font-teko uppercase drop-shadow-2xl glitch'
                                    data-text={firstWord}
                                    style={{ transform: `translateX(-${textTranslateX}vw)` }}
                                >
                                    <ScrambleText text={firstWord} />
                                </motion.h2>
                                <motion.h2
                                    className='text-8xl md:text-8xl lg:text-[10rem] font-bold text-center text-white font-teko uppercase drop-shadow-2xl glitch tracking-tighter'
                                    data-text={restOfTitle}
                                    style={{ transform: `translateX(${textTranslateX}vw)` }}
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
