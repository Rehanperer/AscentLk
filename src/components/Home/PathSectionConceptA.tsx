import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView, animate } from 'framer-motion';
import ScrambleText from '../ScrambleText';

// ──────────────────────────────────────────────────────────────────────
// ANIMATED COUNTER — slot-machine count-up from 0 → value on scroll
// ──────────────────────────────────────────────────────────────────────
const AnimatedCounter: React.FC<{
    value: number;
    label: string;
    prefix?: string;
    suffix?: string;
    duration?: number;
}> = ({ value, label, prefix = '', suffix = '', duration = 2 }) => {
    const ref = useRef<HTMLSpanElement>(null);
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, margin: '-10%' });

    useEffect(() => {
        if (!isInView || !ref.current) return;

        const controls = animate(0, value, {
            duration,
            ease: [0.22, 1, 0.36, 1],
            onUpdate(currentValue) {
                if (ref.current) {
                    ref.current.textContent = Math.floor(currentValue).toLocaleString();
                }
            },
        });

        return () => controls.stop();
    }, [value, duration, isInView]);

    return (
        <div ref={containerRef} className="flex flex-col items-center justify-center text-center group px-4">
            <h3 className="font-teko text-[12vw] sm:text-[15vw] md:text-[11rem] leading-[0.85] font-bold text-white drop-shadow-[0_0_50px_rgba(255,70,85,1)] whitespace-nowrap transform-gpu">
                <span className="text-[8vw] sm:text-[10vw] md:text-[7rem] text-white">{prefix}</span>
                <span ref={ref}>0</span>
                <span className="text-[8vw] sm:text-[10vw] md:text-[7rem] text-[#ff4655]">{suffix}</span>
            </h3>
            <div
                className="font-mono text-sm md:text-2xl tracking-[0.3em] md:tracking-[0.5em] text-white uppercase mt-6 drop-shadow-[0_0_20px_rgba(255,70,85,0.8)]"
                style={{ opacity: isInView ? 1 : 0, transition: 'opacity 1s ease' }}
            >
                <ScrambleText text={label} duration={60} />
            </div>
        </div>
    );
};

// ──────────────────────────────────────────────────────────────────────
// PHASE DATA
// ──────────────────────────────────────────────────────────────────────
interface PhaseData {
    id: string;
    phaseNum: string;
    date: string;
    title: string;
    desc: string;
    imgSrc: string;
}

const phases: PhaseData[] = [
    {
        id: 'qualifiers',
        phaseNum: 'PHASE 01',
        date: 'Oct 2nd',
        title: 'QUALIFIERS',
        desc: 'Hundreds of units battle in a ruthless single-elimination bracket. Only the most disciplined tacticians survive the initial purge.',
        imgSrc: '/img/phase_01.png',
    },
    {
        id: 'playoffs',
        phaseNum: 'PHASE 02',
        date: 'Oct 9th',
        title: 'PLAYOFFS',
        desc: 'High-stakes, broadcasted best-of-threes. The pressure mounts as the nation watches every flash, every peek.',
        imgSrc: '/img/phase_02.png',
    },
    {
        id: 'redemption',
        phaseNum: 'PHASE 03',
        date: 'Nov 13th',
        title: 'REDEMPTION',
        desc: 'Second chance for fallen squads. Fight through the brutal lower bracket crucible to earn a final spot.',
        imgSrc: '/img/phase_03.png',
    },
    {
        id: 'finals',
        phaseNum: 'TERMINAL',
        date: 'Nov 14th',
        title: 'GRAND FINALS',
        desc: 'Live from the Lumina Ballroom. Two titans remain. Absolute immortality on the line.',
        imgSrc: '/img/phase_03.png',
    },
];

// ──────────────────────────────────────────────────────────────────────
// BRACKET NODE CARD — Each phase in the bracket
// ──────────────────────────────────────────────────────────────────────
const BracketNode: React.FC<{
    phase: PhaseData;
    index: number;
    scrollProgress: any;
    startRange: number;
    endRange: number;
}> = ({ phase, index, scrollProgress, startRange, endRange }) => {
    const nodeRef = useRef(null);
    const isInView = useInView(nodeRef, { once: false, margin: '-15%' });

    const activeProgress = useTransform(
        scrollProgress,
        [startRange - 0.08, startRange, endRange],
        [0, 1, 1]
    );
    const cardY = useTransform(scrollProgress, [startRange - 0.15, startRange], [60, 0]);
    const cardScale = useTransform(scrollProgress, [startRange - 0.1, startRange], [0.92, 1]);
    const glowIntensity = useTransform(activeProgress, [0, 1], [0, 1]);

    // Pulse animation shadow
    const borderGlow = useTransform(
        glowIntensity,
        (v: number) =>
            `0 0 ${20 * v}px rgba(255,70,85,${0.3 * v}), 0 0 ${60 * v}px rgba(255,70,85,${0.15 * v}), inset 0 0 ${30 * v}px rgba(255,70,85,${0.05 * v})`
    );

    const borderColor = useTransform(
        glowIntensity,
        (v: number) => `rgba(255,70,85,${0.15 + 0.6 * v})`
    );

    const isTerminal = phase.id === 'finals';

    return (
        <motion.div
            ref={nodeRef}
            className="relative transform-gpu"
            style={{
                y: cardY,
                scale: cardScale,
            }}
        >
            {/* Outer glow ring for active state */}
            <motion.div
                className="absolute -inset-[2px] rounded-sm pointer-events-none transform-gpu"
                style={{
                    boxShadow: borderGlow,
                    opacity: activeProgress,
                }}
            />

            {/* Main card */}
            <motion.div
                className={`relative overflow-hidden rounded-sm border transform-gpu ${
                    isTerminal
                        ? 'bg-gradient-to-br from-[#0d121f] via-[#10131e] to-[#1a0a0e]'
                        : 'bg-[#0a0d14]/90'
                }`}
                style={{
                    borderColor,
                    opacity: useTransform(activeProgress, [0, 0.3], [0.3, 1]),
                }}
            >
                {/* Scanline overlay */}
                <div className="absolute inset-0 bg-scanlines opacity-[0.04] pointer-events-none" />

                {/* Top accent bar */}
                <motion.div
                    className="h-[2px] w-full transform-gpu"
                    style={{
                        background: useTransform(
                            glowIntensity,
                            (v: number) =>
                                `linear-gradient(90deg, transparent, rgba(255,70,85,${0.4 + 0.6 * v}), transparent)`
                        ),
                        scaleX: activeProgress,
                    }}
                />

                {/* Image area */}
                <div className="relative w-full aspect-[16/9] overflow-hidden">
                    <motion.img
                        src={phase.imgSrc}
                        alt={`${phase.title} — ASCENT 2026`}
                        loading="lazy"
                        className="w-full h-full object-cover transform-gpu"
                        style={{
                            filter: useTransform(
                                activeProgress,
                                (v: number) => `grayscale(${1 - v}) brightness(${0.4 + 0.6 * v})`
                            ),
                            scale: useTransform(activeProgress, [0, 1], [1.08, 1]),
                        }}
                    />
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d14] via-[#0a0d14]/60 to-transparent" />

                    {/* Phase number overlay */}
                    <motion.div
                        className="absolute top-3 left-3 font-mono text-[9px] tracking-[0.5em] uppercase px-2 py-1 border border-white/10 bg-black/40 backdrop-blur-sm"
                        style={{ opacity: activeProgress }}
                    >
                        <span className="text-[#ff4655]">{phase.phaseNum}</span>
                        <span className="text-white/30 mx-2">|</span>
                        <span className="text-white/60">{phase.date}</span>
                    </motion.div>

                    {/* Terminal badge */}
                    {isTerminal && (
                        <motion.div
                            className="absolute top-3 right-3 font-mono text-[8px] tracking-[0.3em] uppercase px-2 py-1 bg-[#ff4655]/20 border border-[#ff4655]/40 text-[#ff4655]"
                            style={{ opacity: activeProgress }}
                            animate={isInView ? { opacity: [0.6, 1, 0.6] } : {}}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            ◆ FINAL OBJECTIVE
                        </motion.div>
                    )}
                </div>

                {/* Content area */}
                <motion.div
                    className="p-4 md:p-5"
                    style={{ opacity: activeProgress }}
                >
                    <h3
                        className={`font-teko font-bold uppercase leading-[0.9] mb-2 ${
                            isTerminal
                                ? 'text-3xl md:text-4xl text-[#ff4655] drop-shadow-[0_0_20px_rgba(255,70,85,0.5)]'
                                : 'text-2xl md:text-3xl text-white'
                        }`}
                    >
                        {phase.title}
                    </h3>
                    <p className="text-white/40 text-xs md:text-sm leading-relaxed tracking-wide font-medium">
                        {phase.desc}
                    </p>

                    {/* Status indicator */}
                    <div className="mt-4 flex items-center gap-3">
                        <motion.div
                            className="w-1.5 h-1.5 rounded-full bg-[#ff4655] transform-gpu"
                            style={{
                                boxShadow: useTransform(
                                    glowIntensity,
                                    (v: number) => `0 0 ${8 * v}px rgba(255,70,85,${0.8 * v})`
                                ),
                            }}
                            animate={isInView ? { opacity: [1, 0.3, 1] } : {}}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        />
                        <span className="font-mono text-[8px] text-white/30 tracking-[0.3em] uppercase">
                            {isTerminal ? 'PRIORITY: MAXIMUM' : `NODE_0${index + 1} // STANDING BY`}
                        </span>
                    </div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

// ──────────────────────────────────────────────────────────────────────
// ANIMATED DIAMOND — concentric rotating diamond shapes for arena floor
// ──────────────────────────────────────────────────────────────────────
const AnimatedDiamond: React.FC<{
    sizeClasses: string;
    baseColor: string;
    progress: any;
    glowMultiplier: number;
    thickness?: string;
    hasCoreGlow?: boolean;
    rotationOffset?: number;
}> = ({
    sizeClasses,
    baseColor,
    progress,
    glowMultiplier,
    thickness = '1px',
    hasCoreGlow = false,
    rotationOffset = 0,
}) => {
    const rotation = useTransform(progress, [0, 1], [45 + rotationOffset, 45 + rotationOffset + 15]);

    return (
        <motion.div
            className={`absolute ${sizeClasses} transform-gpu`}
            style={{ rotate: rotation }}
        >
            {/* Base border */}
            <motion.div
                className={`absolute inset-0 border ${hasCoreGlow ? 'bg-[#ff4655]/5' : ''}`}
                style={{
                    borderColor: baseColor,
                    ...(hasCoreGlow && {
                        boxShadow: useTransform(
                            progress,
                            (v: number) =>
                                `0 0 ${40 * v}px rgba(255,70,85,${0.4 * v}) inset, 0 0 ${40 * v}px rgba(255,70,85,${0.4 * v})`
                        ),
                    }),
                }}
            />

            {/* Animated glowing borders */}
            <motion.div
                className="absolute top-0 left-0 w-full bg-[#ff4655] origin-center z-10"
                style={{
                    height: thickness,
                    scaleX: progress,
                    opacity: progress,
                    boxShadow: useTransform(
                        progress,
                        (v: number) =>
                            `0 0 ${15 * glowMultiplier * v}px rgba(255,70,85,${0.8 * v})`
                    ),
                }}
            />
            <motion.div
                className="absolute top-0 right-0 h-full bg-[#ff4655] origin-center z-10"
                style={{
                    width: thickness,
                    scaleY: progress,
                    opacity: progress,
                    boxShadow: useTransform(
                        progress,
                        (v: number) =>
                            `0 0 ${15 * glowMultiplier * v}px rgba(255,70,85,${0.8 * v})`
                    ),
                }}
            />
            <motion.div
                className="absolute bottom-0 left-0 w-full bg-[#ff4655] origin-center z-10"
                style={{
                    height: thickness,
                    scaleX: progress,
                    opacity: progress,
                    boxShadow: useTransform(
                        progress,
                        (v: number) =>
                            `0 0 ${15 * glowMultiplier * v}px rgba(255,70,85,${0.8 * v})`
                    ),
                }}
            />
            <motion.div
                className="absolute top-0 left-0 h-full bg-[#ff4655] origin-center z-10"
                style={{
                    width: thickness,
                    scaleY: progress,
                    opacity: progress,
                    boxShadow: useTransform(
                        progress,
                        (v: number) =>
                            `0 0 ${15 * glowMultiplier * v}px rgba(255,70,85,${0.8 * v})`
                    ),
                }}
            />
        </motion.div>
    );
};

// ──────────────────────────────────────────────────────────────────────
// GLOWING CONNECTION LINE — SVG line tracing between bracket nodes
// ──────────────────────────────────────────────────────────────────────
const ConnectionLine: React.FC<{
    direction: 'vertical' | 'horizontal' | 'diagonal-left' | 'diagonal-right';
    progress: any;
    className?: string;
}> = ({ direction, progress, className = '' }) => {
    const isVertical = direction === 'vertical';
    const isHorizontal = direction === 'horizontal';

    return (
        <motion.div
            className={`absolute transform-gpu ${className}`}
            style={{
                ...(isVertical && {
                    width: '2px',
                    scaleY: progress,
                    background: 'linear-gradient(180deg, rgba(255,70,85,0.8), rgba(255,70,85,0.3))',
                    boxShadow: useTransform(
                        progress,
                        (v: number) =>
                            `0 0 ${12 * v}px rgba(255,70,85,${0.6 * v}), 0 0 ${30 * v}px rgba(255,70,85,${0.2 * v})`
                    ),
                    transformOrigin: 'top',
                }),
                ...(isHorizontal && {
                    height: '2px',
                    scaleX: progress,
                    background: 'linear-gradient(90deg, rgba(255,70,85,0.8), rgba(255,70,85,0.3))',
                    boxShadow: useTransform(
                        progress,
                        (v: number) =>
                            `0 0 ${12 * v}px rgba(255,70,85,${0.6 * v}), 0 0 ${30 * v}px rgba(255,70,85,${0.2 * v})`
                    ),
                    transformOrigin: 'left',
                }),
                ...(!isVertical &&
                    !isHorizontal && {
                        height: '2px',
                        scaleX: progress,
                        background: 'linear-gradient(90deg, rgba(255,70,85,0.6), rgba(255,70,85,0.2))',
                        boxShadow: useTransform(
                            progress,
                            (v: number) =>
                                `0 0 ${10 * v}px rgba(255,70,85,${0.5 * v})`
                        ),
                        transformOrigin: direction === 'diagonal-left' ? 'right center' : 'left center',
                    }),
                opacity: progress,
            }}
        />
    );
};

// ──────────────────────────────────────────────────────────────────────
// BRACKET CONNECTOR JUNCTION — glowing dot where lines meet
// ──────────────────────────────────────────────────────────────────────
const JunctionDot: React.FC<{ progress: any; className?: string }> = ({
    progress,
    className = '',
}) => (
    <div className={`absolute z-20 ${className}`}>
        <motion.div
            className="w-3 h-3 rounded-full border border-[#ff4655]/50 flex items-center justify-center transform-gpu"
            style={{
                scale: progress,
                boxShadow: useTransform(
                    progress,
                    (v: number) =>
                        `0 0 ${15 * v}px rgba(255,70,85,${0.6 * v})`
                ),
            }}
        >
            <motion.div
                className="w-1.5 h-1.5 rounded-full bg-[#ff4655] transform-gpu"
                style={{ opacity: progress }}
            />
        </motion.div>
    </div>
);

// ──────────────────────────────────────────────────────────────────────
// MAIN COMPONENT — PathSectionConceptA
// ──────────────────────────────────────────────────────────────────────
const PathSectionConceptA: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const bracketRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start center', 'end 80%'],
    });

    // ── Perspective parallax on scroll ──
    const perspectiveRotateX = useTransform(scrollYProgress, [0, 0.5, 1], [8, 3, 0]);
    const perspectiveRotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-2, 0, 1]);
    const perspectiveTranslateZ = useTransform(scrollYProgress, [0, 1], [0, 30]);

    // ── Connection line progress values ──
    // Qualifiers → junction
    const line1Progress = useTransform(scrollYProgress, [0.08, 0.2], [0, 1]);
    // Junction → Playoffs
    const line2aProgress = useTransform(scrollYProgress, [0.2, 0.32], [0, 1]);
    // Junction → Redemption
    const line2bProgress = useTransform(scrollYProgress, [0.2, 0.38], [0, 1]);
    // Playoffs → final junction
    const line3aProgress = useTransform(scrollYProgress, [0.35, 0.5], [0, 1]);
    // Redemption → final junction
    const line3bProgress = useTransform(scrollYProgress, [0.42, 0.55], [0, 1]);
    // Final junction → Grand Finals
    const line4Progress = useTransform(scrollYProgress, [0.55, 0.65], [0, 1]);
    // Grand Finals → Arena
    const lineArenaProgress = useTransform(scrollYProgress, [0.7, 0.8], [0, 1]);

    // ── Diamond arena glow ──
    const diamondGlowOpacity = useTransform(scrollYProgress, [0.82, 0.95], [0, 1]);

    // ── Ambient particle opacity ──
    const ambientGlow = useTransform(scrollYProgress, [0, 0.3], [0.02, 0.06]);

    return (
        <section
            id="path"
            className="relative pb-32 pt-24 bg-[#0d121f] overflow-hidden"
            ref={sectionRef}
        >
            {/* ── Atmospheric Overlays ── */}
            <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-[#08080a] to-transparent z-10 pointer-events-none" />
            <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-[#08080a] to-transparent z-10 pointer-events-none" />

            {/* Ambient void particles / nebula glow */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        'radial-gradient(ellipse 60% 40% at 50% 30%, rgba(255,70,85,0.04), transparent 70%), radial-gradient(ellipse 40% 60% at 30% 70%, rgba(80,60,200,0.03), transparent 60%), radial-gradient(ellipse 50% 50% at 70% 50%, rgba(255,70,85,0.02), transparent 60%)',
                    opacity: useTransform(ambientGlow, (v: number) => v * 10),
                }}
            />

            {/* Subtle grid pattern behind everything */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.015]"
                style={{
                    backgroundImage:
                        'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                }}
            />

            <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                {/* ═══════════════════════════════════════════
                    HEADER
                ═══════════════════════════════════════════ */}
                <div className="text-center mb-24 md:mb-32 relative">
                    {/* Ghost watermark */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-teko font-bold text-white/[0.02] leading-none pointer-events-none select-none">
                        GAUNTLET
                    </div>
                    <ScrambleText
                        text="PROTOCOL HIERARCHY"
                        className="text-[#ff4655] font-mono tracking-[0.5em] text-[10px] uppercase font-bold mb-4 block"
                    />
                    <h2 className="font-teko text-6xl md:text-8xl lg:text-9xl font-bold uppercase leading-none text-white">
                        THE ASCENT TO GLORY
                    </h2>
                    {/* Decorative underline */}
                    <div className="mt-6 mx-auto w-24 h-[1px] bg-gradient-to-r from-transparent via-[#ff4655]/50 to-transparent" />
                </div>

                {/* ═══════════════════════════════════════════
                    THE 2.5D ISOMETRIC BRACKET
                ═══════════════════════════════════════════ */}
                <div
                    className="relative w-full"
                    style={{ perspective: '1200px' }}
                >
                    <motion.div
                        ref={bracketRef}
                        className="relative w-full transform-gpu"
                        style={{
                            rotateX: perspectiveRotateX,
                            rotateY: perspectiveRotateY,
                            translateZ: perspectiveTranslateZ,
                            transformStyle: 'preserve-3d',
                        }}
                    >
                        {/* ─── DESKTOP BRACKET LAYOUT ─── */}
                        <div className="hidden md:block relative">
                            {/*
                                Layout (conceptual):
                                
                                         [Qualifiers]
                                              |
                                         (junction)
                                        /          \
                                [Playoffs]    [Redemption]
                                        \          /
                                         (junction)
                                              |
                                       [Grand Finals]
                            */}

                            {/* ROW 1: Qualifiers (centered) */}
                            <div className="flex justify-center mb-0 relative z-10">
                                <div className="w-[380px]">
                                    <BracketNode
                                        phase={phases[0]}
                                        index={0}
                                        scrollProgress={scrollYProgress}
                                        startRange={0.05}
                                        endRange={0.2}
                                    />
                                </div>
                            </div>

                            {/* LINE: Qualifiers → Junction 1 */}
                            <div className="flex justify-center relative" style={{ height: '60px' }}>
                                <ConnectionLine
                                    direction="vertical"
                                    progress={line1Progress}
                                    className="left-1/2 -translate-x-1/2 top-0 h-full"
                                />
                            </div>

                            {/* JUNCTION 1 */}
                            <div className="flex justify-center relative" style={{ height: '20px' }}>
                                <JunctionDot
                                    progress={line1Progress}
                                    className="left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
                                />
                            </div>

                            {/* DIAGONAL LINES: Junction 1 → Playoffs & Redemption */}
                            <div className="relative" style={{ height: '60px' }}>
                                {/* Left diagonal to Playoffs */}
                                <ConnectionLine
                                    direction="horizontal"
                                    progress={line2aProgress}
                                    className="top-1/2 left-1/2 -translate-y-1/2"
                                    /* spans from center to ~25% */
                                />
                                <motion.div
                                    className="absolute top-0 left-[25%] right-[50%] h-full transform-gpu"
                                    style={{ opacity: line2aProgress }}
                                >
                                    <svg
                                        className="w-full h-full"
                                        viewBox="0 0 100 100"
                                        preserveAspectRatio="none"
                                        fill="none"
                                    >
                                        <motion.line
                                            x1="100"
                                            y1="0"
                                            x2="0"
                                            y2="100"
                                            stroke="#ff4655"
                                            strokeWidth="2"
                                            style={{
                                                pathLength: line2aProgress,
                                                filter: useTransform(
                                                    line2aProgress,
                                                    (v: number) =>
                                                        `drop-shadow(0 0 ${6 * v}px rgba(255,70,85,0.6))`
                                                ),
                                            }}
                                        />
                                    </svg>
                                </motion.div>

                                {/* Right diagonal to Redemption */}
                                <motion.div
                                    className="absolute top-0 left-[50%] right-[25%] h-full transform-gpu"
                                    style={{ opacity: line2bProgress }}
                                >
                                    <svg
                                        className="w-full h-full"
                                        viewBox="0 0 100 100"
                                        preserveAspectRatio="none"
                                        fill="none"
                                    >
                                        <motion.line
                                            x1="0"
                                            y1="0"
                                            x2="100"
                                            y2="100"
                                            stroke="#ff4655"
                                            strokeWidth="2"
                                            style={{
                                                pathLength: line2bProgress,
                                                filter: useTransform(
                                                    line2bProgress,
                                                    (v: number) =>
                                                        `drop-shadow(0 0 ${6 * v}px rgba(255,70,85,0.6))`
                                                ),
                                            }}
                                        />
                                    </svg>
                                </motion.div>
                            </div>

                            {/* ROW 2: Playoffs & Redemption (side by side) */}
                            <div className="flex justify-between gap-8 px-4 lg:px-12 relative z-10">
                                <div className="w-[380px]">
                                    <BracketNode
                                        phase={phases[1]}
                                        index={1}
                                        scrollProgress={scrollYProgress}
                                        startRange={0.22}
                                        endRange={0.38}
                                    />
                                </div>
                                <div className="w-[380px]">
                                    <BracketNode
                                        phase={phases[2]}
                                        index={2}
                                        scrollProgress={scrollYProgress}
                                        startRange={0.28}
                                        endRange={0.45}
                                    />
                                </div>
                            </div>

                            {/* DIAGONAL LINES: Playoffs & Redemption → Junction 2 */}
                            <div className="relative" style={{ height: '60px' }}>
                                {/* Left diagonal from Playoffs */}
                                <motion.div
                                    className="absolute top-0 left-[25%] right-[50%] h-full transform-gpu"
                                    style={{ opacity: line3aProgress }}
                                >
                                    <svg
                                        className="w-full h-full"
                                        viewBox="0 0 100 100"
                                        preserveAspectRatio="none"
                                        fill="none"
                                    >
                                        <motion.line
                                            x1="0"
                                            y1="0"
                                            x2="100"
                                            y2="100"
                                            stroke="#ff4655"
                                            strokeWidth="2"
                                            style={{
                                                pathLength: line3aProgress,
                                                filter: useTransform(
                                                    line3aProgress,
                                                    (v: number) =>
                                                        `drop-shadow(0 0 ${6 * v}px rgba(255,70,85,0.6))`
                                                ),
                                            }}
                                        />
                                    </svg>
                                </motion.div>

                                {/* Right diagonal from Redemption */}
                                <motion.div
                                    className="absolute top-0 left-[50%] right-[25%] h-full transform-gpu"
                                    style={{ opacity: line3bProgress }}
                                >
                                    <svg
                                        className="w-full h-full"
                                        viewBox="0 0 100 100"
                                        preserveAspectRatio="none"
                                        fill="none"
                                    >
                                        <motion.line
                                            x1="100"
                                            y1="0"
                                            x2="0"
                                            y2="100"
                                            stroke="#ff4655"
                                            strokeWidth="2"
                                            style={{
                                                pathLength: line3bProgress,
                                                filter: useTransform(
                                                    line3bProgress,
                                                    (v: number) =>
                                                        `drop-shadow(0 0 ${6 * v}px rgba(255,70,85,0.6))`
                                                ),
                                            }}
                                        />
                                    </svg>
                                </motion.div>
                            </div>

                            {/* JUNCTION 2 */}
                            <div className="flex justify-center relative" style={{ height: '20px' }}>
                                <JunctionDot
                                    progress={line3aProgress}
                                    className="left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
                                />
                            </div>

                            {/* LINE: Junction 2 → Grand Finals */}
                            <div
                                className="flex justify-center relative"
                                style={{ height: '60px' }}
                            >
                                <ConnectionLine
                                    direction="vertical"
                                    progress={line4Progress}
                                    className="left-1/2 -translate-x-1/2 top-0 h-full"
                                />
                            </div>

                            {/* ROW 3: Grand Finals (centered, wider) */}
                            <div className="flex justify-center relative z-10">
                                <div className="w-[440px]">
                                    <BracketNode
                                        phase={phases[3]}
                                        index={3}
                                        scrollProgress={scrollYProgress}
                                        startRange={0.55}
                                        endRange={0.75}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ─── MOBILE BRACKET LAYOUT (vertical stack) ─── */}
                        <div className="md:hidden relative">
                            {phases.map((phase, i) => (
                                <div key={phase.id} className="relative">
                                    {/* Vertical connection line */}
                                    {i > 0 && (
                                        <div className="flex justify-center relative" style={{ height: '48px' }}>
                                            <ConnectionLine
                                                direction="vertical"
                                                progress={useTransform(
                                                    scrollYProgress,
                                                    [0.05 + i * 0.18, 0.05 + i * 0.18 + 0.1],
                                                    [0, 1]
                                                )}
                                                className="left-1/2 -translate-x-1/2 top-0 h-full"
                                            />
                                            <JunctionDot
                                                progress={useTransform(
                                                    scrollYProgress,
                                                    [0.05 + i * 0.18, 0.05 + i * 0.18 + 0.05],
                                                    [0, 1]
                                                )}
                                                className="left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
                                            />
                                        </div>
                                    )}
                                    <div className="w-full max-w-[400px] mx-auto">
                                        <BracketNode
                                            phase={phase}
                                            index={i}
                                            scrollProgress={scrollYProgress}
                                            startRange={0.05 + i * 0.18}
                                            endRange={0.18 + i * 0.18}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* ═══════════════════════════════════════════
                    CONNECTION TO ARENA
                ═══════════════════════════════════════════ */}
                <div className="relative w-full h-[6rem] md:h-[10rem] pointer-events-none z-0">
                    <div className="absolute top-0 bottom-0 left-1/2 w-[2px] bg-white/5 -translate-x-1/2">
                        <motion.div
                            className="absolute top-0 left-0 w-full h-full bg-[#ff4655] shadow-[0_0_15px_#ff4655] origin-top transform-gpu"
                            style={{ scaleY: lineArenaProgress }}
                        />
                    </div>
                </div>

                {/* ═══════════════════════════════════════════
                    THE ARENA FLOOR — Prize Pool
                    Concentric rotating diamonds + 300K counter
                ═══════════════════════════════════════════ */}
                <div className="mb-8 relative w-full min-h-[80vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden">
                    {/* Arena floor grid pattern */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        {/* Outer diamond */}
                        <AnimatedDiamond
                            sizeClasses="w-[85vw] h-[85vw] max-w-[700px] max-h-[700px]"
                            baseColor="rgba(255,255,255,0.03)"
                            progress={diamondGlowOpacity}
                            glowMultiplier={0.2}
                            thickness="1px"
                            rotationOffset={0}
                        />
                        {/* Mid diamond */}
                        <AnimatedDiamond
                            sizeClasses="w-[60vw] h-[60vw] max-w-[500px] max-h-[500px]"
                            baseColor="rgba(255,70,85,0.06)"
                            progress={diamondGlowOpacity}
                            glowMultiplier={0.5}
                            thickness="2px"
                            rotationOffset={-5}
                        />
                        {/* Inner diamond */}
                        <AnimatedDiamond
                            sizeClasses="w-[35vw] h-[35vw] max-w-[300px] max-h-[300px]"
                            baseColor="rgba(255,70,85,0.12)"
                            progress={diamondGlowOpacity}
                            glowMultiplier={1}
                            thickness="2px"
                            rotationOffset={10}
                        />
                        {/* Core diamond */}
                        <AnimatedDiamond
                            sizeClasses="w-[15vw] h-[15vw] max-w-[130px] max-h-[130px]"
                            baseColor="rgba(255,70,85,0.2)"
                            progress={diamondGlowOpacity}
                            glowMultiplier={2}
                            thickness="3px"
                            hasCoreGlow
                            rotationOffset={-8}
                        />

                        {/* Cross lines through center */}
                        <motion.div
                            className="absolute w-[90vw] max-w-[750px] h-[1px]"
                            style={{
                                background: useTransform(
                                    diamondGlowOpacity,
                                    (v: number) =>
                                        `linear-gradient(90deg, transparent, rgba(255,70,85,${0.04 + v * 0.4}), transparent)`
                                ),
                            }}
                        />
                        <motion.div
                            className="absolute h-[90vw] max-h-[750px] w-[1px]"
                            style={{
                                background: useTransform(
                                    diamondGlowOpacity,
                                    (v: number) =>
                                        `linear-gradient(180deg, transparent, rgba(255,70,85,${0.04 + v * 0.4}), transparent)`
                                ),
                            }}
                        />

                        {/* Diagonal cross lines */}
                        <motion.div
                            className="absolute w-[120vw] max-w-[900px] h-[1px] rotate-45"
                            style={{
                                background: useTransform(
                                    diamondGlowOpacity,
                                    (v: number) =>
                                        `linear-gradient(90deg, transparent, rgba(255,70,85,${0.03 + v * 0.3}), transparent)`
                                ),
                            }}
                        />
                        <motion.div
                            className="absolute w-[120vw] max-w-[900px] h-[1px] -rotate-45"
                            style={{
                                background: useTransform(
                                    diamondGlowOpacity,
                                    (v: number) =>
                                        `linear-gradient(90deg, transparent, rgba(255,70,85,${0.03 + v * 0.3}), transparent)`
                                ),
                            }}
                        />

                        {/* Corner markers on mid diamond */}
                        <div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 pointer-events-none"
                            style={{ transform: 'translate(-50%, -50%)' }}
                        >
                            <div className="absolute -top-[30vw] md:-top-[250px] left-1/2 -translate-x-1/2 w-3 h-3 border border-[#ff4655]/30 rotate-45" />
                            <div className="absolute -bottom-[30vw] md:-bottom-[250px] left-1/2 -translate-x-1/2 w-3 h-3 border border-[#ff4655]/30 rotate-45" />
                            <div className="absolute top-1/2 -translate-y-1/2 -left-[30vw] md:-left-[250px] w-3 h-3 border border-[#ff4655]/30 rotate-45" />
                            <div className="absolute top-1/2 -translate-y-1/2 -right-[30vw] md:-right-[250px] w-3 h-3 border border-[#ff4655]/30 rotate-45" />
                        </div>

                        {/* Radial glow from center — the "spike" energy */}
                        <motion.div
                            className="absolute w-[50vw] h-[50vw] max-w-[400px] max-h-[400px] rounded-full pointer-events-none transform-gpu"
                            style={{
                                background:
                                    'radial-gradient(circle at center, rgba(255,70,85,1) 0%, rgba(255,70,85,0.4) 40%, transparent 70%)',
                                opacity: useTransform(diamondGlowOpacity, (v: number) => v * 0.25),
                            }}
                        />

                        {/* Floor glow wash */}
                        <div
                            className="absolute inset-0"
                            style={{
                                background:
                                    'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(255,70,85,0.06) 0%, transparent 60%)',
                            }}
                        />
                    </div>

                    {/* Spike site labels */}
                    <div className="absolute top-[12%] left-1/2 -translate-x-1/2 font-mono text-[8px] md:text-[10px] tracking-[0.6em] text-[#ff4655]/20 uppercase">
                        Site_Alpha
                    </div>
                    <div className="absolute bottom-[12%] left-1/2 -translate-x-1/2 font-mono text-[8px] md:text-[10px] tracking-[0.6em] text-white/10 uppercase">
                        Payload_Active
                    </div>

                    {/* Corner tactical markers */}
                    <div className="absolute top-[8%] left-[8%] w-8 h-8 border-t border-l border-[#ff4655]/15" />
                    <div className="absolute top-[8%] right-[8%] w-8 h-8 border-t border-r border-[#ff4655]/15" />
                    <div className="absolute bottom-[8%] left-[8%] w-8 h-8 border-b border-l border-[#ff4655]/15" />
                    <div className="absolute bottom-[8%] right-[8%] w-8 h-8 border-b border-r border-[#ff4655]/15" />

                    {/* ── THE NUMBER (planted spike) ── */}
                    <div className="relative z-10">
                        {/* Dark scrim so text reads clearly over the diamond lines */}
                        <div
                            className="absolute inset-0 -inset-x-16 -inset-y-8 rounded-2xl pointer-events-none"
                            style={{
                                background:
                                    'radial-gradient(ellipse 70% 60% at 50% 45%, rgba(8,8,10,0.85) 0%, rgba(8,8,10,0.5) 50%, transparent 80%)',
                            }}
                        />
                        <AnimatedCounter
                            value={300000}
                            label="LKR Total Prize Pool"
                            suffix="+"
                            duration={3}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PathSectionConceptA;
