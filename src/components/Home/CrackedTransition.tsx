import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * CrackedTransition — Full-width cinematic fracture with thick, viscous
 * blood-like liquid oozing from the crack line on scroll.
 */

const STYLES = `
@keyframes ember-float {
  0% { transform: translateY(0) scale(1); opacity: 0.8; }
  50% { opacity: 1; }
  100% { transform: translateY(-40px) scale(0); opacity: 0; }
}

@keyframes crack-pulse {
  0%, 100% { opacity: 0.5; filter: drop-shadow(0 0 6px rgba(255,70,85,0.4)); }
  50% { opacity: 1; filter: drop-shadow(0 0 14px rgba(255,70,85,0.8)) drop-shadow(0 0 30px rgba(255,70,85,0.3)); }
}

@keyframes energy-flow {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

@keyframes blood-pool-pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

.crack-energy-line {
  animation: crack-pulse 2.5s ease-in-out infinite;
}

.energy-flow-bg {
  background-size: 200% 100%;
  animation: energy-flow 3s linear infinite;
}

.ember {
  animation: ember-float 2s ease-out infinite;
}

.blood-pool {
  animation: blood-pool-pulse 3s ease-in-out infinite;
}
`;

/**
 * Viscous blood drip — SVG teardrop shape with:
 * - Wide attachment pool at top (clings to crack)
 * - Organic stretchy body (not a straight line)
 * - Heavy bulging pendant at bottom
 * - Subtle wobble via curve control points
 */
const BloodDrip: React.FC<{
  leftPercent: number;
  maxHeight: number;
  poolWidth: number;
  bodyWidth: number;
  delayFactor: number;
  wobble?: number;
  scrollProgress: any;
}> = ({ leftPercent, maxHeight, poolWidth, bodyWidth, delayFactor, wobble = 0, scrollProgress }) => {
  const scaleY = useTransform(
    scrollProgress,
    [0.12 + delayFactor * 0.12, 0.45 + delayFactor * 0.1],
    [0, 1]
  );
  const opacity = useTransform(
    scrollProgress,
    [0.12 + delayFactor * 0.08, 0.35, 0.85],
    [0, 1, 0.4]
  );

  // Pendant (bottom bulge) radius
  const pendant = bodyWidth * 1.8;

  // SVG path for viscous drip shape
  const halfPool = poolWidth / 2;
  const halfBody = bodyWidth / 2;
  const w = wobble;

  // The drip: pool at top → narrow neck → organic body → swelling pendant
  const dripPath = `
    M ${-halfPool} 0
    Q ${-halfPool} 8, ${-halfBody - 1} 14
    C ${-halfBody - 1 + w} ${maxHeight * 0.25}, ${-halfBody + w} ${maxHeight * 0.4}, ${-halfBody - 0.5 + w} ${maxHeight * 0.55}
    C ${-halfBody + w} ${maxHeight * 0.7}, ${-pendant} ${maxHeight * 0.82}, ${-pendant} ${maxHeight * 0.88}
    Q ${-pendant} ${maxHeight * 0.95}, 0 ${maxHeight}
    Q ${pendant} ${maxHeight * 0.95}, ${pendant} ${maxHeight * 0.88}
    C ${pendant} ${maxHeight * 0.82}, ${halfBody - w} ${maxHeight * 0.7}, ${halfBody + 0.5 - w} ${maxHeight * 0.55}
    C ${halfBody - w} ${maxHeight * 0.4}, ${halfBody + 1 - w} ${maxHeight * 0.25}, ${halfBody + 1} 14
    Q ${halfPool} 8, ${halfPool} 0
    Z
  `;

  const svgWidth = Math.max(poolWidth, pendant * 2) + 10;

  return (
    <motion.div
      className="absolute origin-top"
      style={{
        left: `${leftPercent}%`,
        top: '0px',
        width: `${svgWidth}px`,
        height: `${maxHeight + 10}px`,
        marginLeft: `${-svgWidth / 2}px`,
        scaleY,
        opacity,
        willChange: 'transform, opacity',
      }}
    >
      <svg
        viewBox={`${-svgWidth / 2} -4 ${svgWidth} ${maxHeight + 14}`}
        width={svgWidth}
        height={maxHeight + 10}
        fill="none"
      >
        <defs>
          {/* Blood gradient: darker/opaque at top, rich red pendant */}
          <linearGradient id={`bg-${leftPercent}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(140,15,25,0.95)" />
            <stop offset="30%" stopColor="rgba(200,30,40,0.9)" />
            <stop offset="60%" stopColor="rgba(255,50,60,0.85)" />
            <stop offset="85%" stopColor="rgba(255,70,85,0.9)" />
            <stop offset="100%" stopColor="rgba(200,25,35,0.95)" />
          </linearGradient>
          {/* Highlight/sheen */}
          <linearGradient id={`sh-${leftPercent}`} x1="0.3" y1="0" x2="0.7" y2="1">
            <stop offset="0%" stopColor="rgba(255,150,130,0.3)" />
            <stop offset="50%" stopColor="rgba(255,100,90,0.1)" />
            <stop offset="100%" stopColor="rgba(255,150,130,0.2)" />
          </linearGradient>
        </defs>

        {/* Main drip body */}
        <path
          d={dripPath}
          fill={`url(#bg-${leftPercent})`}
          filter="drop-shadow(0 4px 8px rgba(255,30,40,0.4))"
        />
        {/* Wet sheen highlight */}
        <path
          d={dripPath}
          fill={`url(#sh-${leftPercent})`}
          style={{ mixBlendMode: 'screen' }}
        />

        {/* Surface tension at the top — a small pool/meniscus */}
        <ellipse
          cx="0"
          cy="2"
          rx={halfPool + 3}
          ry="4"
          fill="rgba(160,20,30,0.7)"
          filter="blur(1.5px)"
        />
      </svg>
    </motion.div>
  );
};

/* Floating ember particle */
const Ember: React.FC<{ left: string; bottom: string; delay: string; size: number }> = ({
  left, bottom, delay, size,
}) => (
  <div
    className="absolute rounded-full ember pointer-events-none"
    style={{
      left, bottom, animationDelay: delay,
      width: `${size}px`, height: `${size}px`,
      background: 'radial-gradient(circle, rgba(255,70,85,1), rgba(255,120,80,0.6))',
      boxShadow: `0 0 ${size * 2}px rgba(255,70,85,0.6)`,
    }}
  />
);

const CrackedTransition: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 80%', 'end 20%'],
  });

  const masterOpacity = useTransform(scrollYProgress, [0, 0.1, 0.8, 1], [0, 1, 1, 0.4]);
  const crackSpread = useTransform(scrollYProgress, [0, 0.25], [0.6, 1]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.2, 0.6, 1], [0, 0.8, 0.5, 0.1]);
  const emberOpacity = useTransform(scrollYProgress, [0.1, 0.3, 0.7], [0, 1, 0]);
  const poolOpacity = useTransform(scrollYProgress, [0.05, 0.2, 0.7], [0, 0.8, 0.3]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div
        ref={containerRef}
        className="relative w-full overflow-visible z-20 pointer-events-none select-none"
        style={{ height: '0px', marginTop: '-2px' }}
      >
        <motion.div
          className="absolute left-0 right-0"
          style={{ top: '0px', opacity: masterOpacity, willChange: 'opacity' }}
        >
          {/* ═══ DEEP RED UNDERGLOW ═══ */}
          <motion.div
            className="absolute left-[5%] right-[5%] -top-10 h-20"
            style={{
              opacity: glowOpacity,
              background: 'radial-gradient(ellipse at center, rgba(255,50,60,0.4) 0%, rgba(180,20,30,0.2) 40%, transparent 75%)',
              filter: 'blur(25px)',
              willChange: 'opacity',
            }}
          />

          {/* ═══ BLOOD POOLING along the crack line ═══ */}
          <motion.div
            className="absolute left-[15%] right-[15%] -top-[3px] h-[6px] rounded-full blood-pool"
            style={{
              opacity: poolOpacity,
              background: 'radial-gradient(ellipse at center, rgba(180,20,30,0.8) 0%, rgba(140,15,25,0.4) 50%, transparent 85%)',
              filter: 'blur(1px)',
              willChange: 'opacity',
            }}
          />
          {/* Inner bright line */}
          <motion.div
            className="absolute left-[25%] right-[25%] -top-[1px] h-[2px]"
            style={{
              opacity: poolOpacity,
              background: 'radial-gradient(ellipse at center, rgba(255,100,80,0.6) 0%, rgba(200,40,50,0.3) 60%, transparent 90%)',
            }}
          />

          {/* ═══ ENERGY FLOW LINE ═══ */}
          <div
            className="absolute left-[5%] right-[5%] h-[2px] -top-[1px] energy-flow-bg"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,70,85,0.1) 10%, rgba(255,70,85,0.8) 30%, rgba(255,200,100,1) 50%, rgba(255,70,85,0.8) 70%, rgba(255,70,85,0.1) 90%, transparent 100%)',
              backgroundSize: '200% 100%',
              boxShadow: '0 0 8px rgba(255,70,85,0.5), 0 0 20px rgba(255,70,85,0.2)',
            }}
          />

          {/* ═══ SVG CRACK NETWORK ═══ */}
          <motion.svg
            viewBox="0 0 1920 200"
            className="absolute left-0 right-0 w-full crack-energy-line"
            style={{
              top: '-100px',
              height: '200px',
              scaleX: crackSpread,
              willChange: 'transform',
            }}
            preserveAspectRatio="xMidYMid slice"
            fill="none"
          >
            {/* Center impact */}
            <circle cx="960" cy="100" r="8" fill="rgba(255,70,85,0.4)" />
            <circle cx="960" cy="100" r="4" fill="rgba(255,150,100,0.6)" />
            <circle cx="960" cy="100" r="16" stroke="rgba(255,70,85,0.15)" strokeWidth="1" fill="none" />

            {/* Primary cracks */}
            <path d="M960 100 L940 98 L915 102 L888 97 L860 103 L830 96 L800 101 L768 95 L735 100 L700 94 L665 99 L628 93 L590 98 L550 92 L510 97 L468 91 L425 96 L380 90 L332 95 L280 89 L225 94 L170 88 L110 93 L50 87 L0 92"
              stroke="rgba(255,70,85,0.7)" strokeWidth="2" strokeLinecap="round" />
            <path d="M960 100 L980 103 L1005 97 L1032 102 L1060 96 L1090 101 L1120 95 L1152 100 L1185 94 L1220 99 L1258 93 L1298 98 L1340 92 L1385 97 L1432 91 L1480 96 L1530 90 L1585 95 L1640 89 L1700 94 L1760 88 L1825 93 L1890 87 L1920 92"
              stroke="rgba(255,70,85,0.7)" strokeWidth="2" strokeLinecap="round" />

            {/* Secondary branches */}
            <path d="M888 97 L870 80 L848 72 L822 58 L795 48" stroke="rgba(255,70,85,0.45)" strokeWidth="1.2" />
            <path d="M735 100 L718 82 L698 70 L672 55" stroke="rgba(255,70,85,0.35)" strokeWidth="1" />
            <path d="M550 92 L535 75 L515 62 L490 50" stroke="rgba(255,70,85,0.25)" strokeWidth="0.8" />
            <path d="M380 90 L362 72 L340 60" stroke="rgba(255,70,85,0.2)" strokeWidth="0.6" />
            <path d="M830 96 L812 115 L790 128 L765 142" stroke="rgba(255,70,85,0.45)" strokeWidth="1.2" />
            <path d="M665 99 L648 118 L625 132 L600 148" stroke="rgba(255,70,85,0.35)" strokeWidth="1" />
            <path d="M468 91 L452 112 L432 128" stroke="rgba(255,70,85,0.25)" strokeWidth="0.8" />
            <path d="M1060 96 L1078 78 L1098 68 L1122 54 L1148 44" stroke="rgba(255,70,85,0.45)" strokeWidth="1.2" />
            <path d="M1220 99 L1238 80 L1258 68 L1282 52" stroke="rgba(255,70,85,0.35)" strokeWidth="1" />
            <path d="M1385 97 L1402 78 L1422 65 L1445 52" stroke="rgba(255,70,85,0.25)" strokeWidth="0.8" />
            <path d="M1585 95 L1602 76 L1625 62" stroke="rgba(255,70,85,0.2)" strokeWidth="0.6" />
            <path d="M1120 95 L1138 115 L1158 130 L1182 145" stroke="rgba(255,70,85,0.45)" strokeWidth="1.2" />
            <path d="M1298 98 L1316 118 L1338 134 L1362 150" stroke="rgba(255,70,85,0.35)" strokeWidth="1" />
            <path d="M1480 96 L1498 115 L1520 130" stroke="rgba(255,70,85,0.25)" strokeWidth="0.8" />

            {/* Hairlines */}
            <path d="M870 80 L858 68 L840 58" stroke="rgba(255,70,85,0.2)" strokeWidth="0.5" />
            <path d="M812 115 L798 128 L780 138" stroke="rgba(255,70,85,0.2)" strokeWidth="0.5" />
            <path d="M1078 78 L1092 65 L1110 55" stroke="rgba(255,70,85,0.2)" strokeWidth="0.5" />
            <path d="M1138 115 L1152 130 L1170 142" stroke="rgba(255,70,85,0.2)" strokeWidth="0.5" />
            <path d="M940 98 L932 88 L920 82" stroke="rgba(255,70,85,0.3)" strokeWidth="0.6" />
            <path d="M940 98 L935 108 L925 118" stroke="rgba(255,70,85,0.3)" strokeWidth="0.6" />
            <path d="M980 103 L990 92 L1002 85" stroke="rgba(255,70,85,0.3)" strokeWidth="0.6" />
            <path d="M980 103 L988 114 L998 124" stroke="rgba(255,70,85,0.3)" strokeWidth="0.6" />

            {/* Junction dots */}
            <circle cx="888" cy="97" r="2.5" fill="rgba(255,70,85,0.5)" />
            <circle cx="735" cy="100" r="2" fill="rgba(255,70,85,0.4)" />
            <circle cx="550" cy="92" r="1.5" fill="rgba(255,70,85,0.3)" />
            <circle cx="1060" cy="96" r="2.5" fill="rgba(255,70,85,0.5)" />
            <circle cx="1220" cy="99" r="2" fill="rgba(255,70,85,0.4)" />
            <circle cx="1385" cy="97" r="1.5" fill="rgba(255,70,85,0.3)" />
          </motion.svg>

          {/* ═══ VISCOUS BLOOD DRIPS ═══ */}
          {/* Main central drips */}
          <BloodDrip leftPercent={50}   maxHeight={180} poolWidth={18} bodyWidth={8} delayFactor={0}    wobble={2}  scrollProgress={scrollYProgress} />
          <BloodDrip leftPercent={46}   maxHeight={140} poolWidth={14} bodyWidth={6} delayFactor={0.08} wobble={-1.5} scrollProgress={scrollYProgress} />
          <BloodDrip leftPercent={54}   maxHeight={155} poolWidth={15} bodyWidth={6.5} delayFactor={0.05} wobble={1.5}  scrollProgress={scrollYProgress} />
          
          {/* Mid-range drips */}
          <BloodDrip leftPercent={38} maxHeight={100} poolWidth={10} bodyWidth={4.5} delayFactor={0.22} wobble={-2}  scrollProgress={scrollYProgress} />
          <BloodDrip leftPercent={42}   maxHeight={120} poolWidth={12} bodyWidth={5}   delayFactor={0.18} wobble={1.5} scrollProgress={scrollYProgress} />
          <BloodDrip leftPercent={59} maxHeight={115} poolWidth={11} bodyWidth={5}   delayFactor={0.16} wobble={-1}  scrollProgress={scrollYProgress} />
          <BloodDrip leftPercent={64} maxHeight={90}  poolWidth={10} bodyWidth={4}   delayFactor={0.25} wobble={2}   scrollProgress={scrollYProgress} />

          {/* Outer drips */}
          <BloodDrip leftPercent={28}  maxHeight={70}  poolWidth={8}  bodyWidth={3.5} delayFactor={0.32} wobble={-1.5} scrollProgress={scrollYProgress} />
          <BloodDrip leftPercent={33}  maxHeight={85}  poolWidth={9}  bodyWidth={4}   delayFactor={0.28} wobble={1}    scrollProgress={scrollYProgress} />
          <BloodDrip leftPercent={70}  maxHeight={75}  poolWidth={8}  bodyWidth={3.5} delayFactor={0.3}  wobble={-1}   scrollProgress={scrollYProgress} />
          <BloodDrip leftPercent={76} maxHeight={60}  poolWidth={7}  bodyWidth={3}   delayFactor={0.35} wobble={1.5}  scrollProgress={scrollYProgress} />

          {/* Far edge sparse drips */}
          <BloodDrip leftPercent={18}  maxHeight={45}  poolWidth={6}  bodyWidth={2.5} delayFactor={0.42} wobble={-1} scrollProgress={scrollYProgress} />
          <BloodDrip leftPercent={23}  maxHeight={55}  poolWidth={7}  bodyWidth={3}   delayFactor={0.38} wobble={0.5}  scrollProgress={scrollYProgress} />
          <BloodDrip leftPercent={82}  maxHeight={50}  poolWidth={6}  bodyWidth={2.5} delayFactor={0.4}  wobble={-0.5} scrollProgress={scrollYProgress} />
          <BloodDrip leftPercent={88}  maxHeight={35}  poolWidth={5}  bodyWidth={2}   delayFactor={0.45} wobble={1}    scrollProgress={scrollYProgress} />

          {/* ═══ FLOATING EMBERS ═══ */}
          <motion.div className="absolute left-0 right-0 -top-6 h-14" style={{ opacity: emberOpacity }}>
            <Ember left="48%" bottom="0" delay="0s" size={3} />
            <Ember left="50.5%" bottom="4px" delay="0.4s" size={2.5} />
            <Ember left="46%" bottom="2px" delay="0.8s" size={2} />
            <Ember left="53%" bottom="6px" delay="1.2s" size={2.5} />
            <Ember left="44%" bottom="0" delay="1.6s" size={2} />
            <Ember left="56%" bottom="2px" delay="0.6s" size={3} />
            <Ember left="40%" bottom="4px" delay="1.0s" size={1.5} />
            <Ember left="60%" bottom="0" delay="1.4s" size={2} />
            <Ember left="52%" bottom="8px" delay="0.2s" size={2} />
            <Ember left="47.5%" bottom="6px" delay="1.8s" size={1.5} />
          </motion.div>

          {/* ═══ EDGE BLENDING ═══ */}
          <div className="absolute left-0 right-0 h-20 pointer-events-none"
            style={{ top: '-80px', background: 'linear-gradient(to bottom, transparent, rgba(13,18,31,0.8))' }}
          />
          <div className="absolute left-0 right-0 h-24 pointer-events-none"
            style={{ top: '0px', background: 'linear-gradient(to bottom, rgba(13,18,31,0.6), transparent)' }}
          />
        </motion.div>
      </div>
    </>
  );
};

export default CrackedTransition;
