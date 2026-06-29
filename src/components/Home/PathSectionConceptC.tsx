import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useInView, animate } from 'framer-motion';
import ScrambleText from '../ScrambleText';

// ─── Animated Counter ────────────────────────────────────────────────
const AnimatedCounter: React.FC<{
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  duration?: number;
}> = ({ value, label, prefix = '', suffix = '', duration = 2 }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, value, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setDisplayValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [isInView, value, duration]);

  return (
    <div className="flex flex-col items-center gap-1">
      <span ref={ref} className="font-teko text-5xl md:text-7xl text-white tracking-tight">
        {prefix}
        {displayValue.toLocaleString()}
        {suffix}
      </span>
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#ff4655]">
        {label}
      </span>
    </div>
  );
};

// ─── Waypoint Data ───────────────────────────────────────────────────
interface Waypoint {
  id: string;
  callout: string;
  phase: string;
  title: string;
  date: string;
  description: string;
  image: string;
  /** Position on the grid as percentage [x, y] */
  pos: [number, number];
}

const WAYPOINTS: Waypoint[] = [
  {
    id: 'a-main',
    callout: 'A MAIN',
    phase: 'PHASE 01',
    title: 'QUALIFIERS',
    date: 'OCT 2',
    description: 'Hundreds of units battle in a ruthless single-elimination bracket.',
    image: '/img/phase_01.png',
    pos: [15, 25],
  },
  {
    id: 'mid',
    callout: 'MID',
    phase: 'PHASE 02',
    title: 'PLAYOFFS',
    date: 'OCT 9',
    description: 'High-stakes, broadcasted best-of-threes.',
    image: '/img/phase_02.png',
    pos: [42, 50],
  },
  {
    id: 'b-link',
    callout: 'B LINK',
    phase: 'PHASE 03',
    title: 'REDEMPTION',
    date: 'NOV 13',
    description: 'Second chance for fallen squads, lower bracket.',
    image: '/img/phase_03.png',
    pos: [68, 35],
  },
  {
    id: 'site-a',
    callout: 'SITE A',
    phase: 'TERMINAL',
    title: 'GRAND FINALS',
    date: 'NOV 14',
    description: 'Live from the Lumina Ballroom.',
    image: '',
    pos: [88, 65],
  },
];

// ─── SVG Path Builder ────────────────────────────────────────────────
/** Build a smooth cubic bezier SVG path string through waypoints */
function buildPath(
  waypoints: Waypoint[],
  containerWidth: number,
  containerHeight: number,
): string {
  const points = waypoints.map((wp) => ({
    x: (wp.pos[0] / 100) * containerWidth,
    y: (wp.pos[1] / 100) * containerHeight,
  }));

  if (points.length < 2) return '';

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cpx1 = p0.x + (p1.x - p0.x) * 0.5;
    const cpy1 = p0.y;
    const cpx2 = p0.x + (p1.x - p0.x) * 0.5;
    const cpy2 = p1.y;
    d += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${p1.x} ${p1.y}`;
  }
  return d;
}

// ─── Waypoint Node Component ────────────────────────────────────────
const WaypointNode: React.FC<{
  wp: Waypoint;
  index: number;
  progress: any; // MotionValue
}> = ({ wp, index }) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(nodeRef, { once: true, margin: '-80px' });
  const [hovered, setHovered] = useState(false);
  const isTerminal = wp.id === 'site-a';

  return (
    <motion.div
      ref={nodeRef}
      className="absolute z-20"
      style={{
        left: `${wp.pos[0]}%`,
        top: `${wp.pos[1]}%`,
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay: 0.15 * index, duration: 0.5, type: 'spring', stiffness: 200 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Callout label */}
      <div
        className="absolute font-mono text-[10px] tracking-[0.25em] text-white/40 whitespace-nowrap pointer-events-none select-none"
        style={{ top: '-28px', left: '50%', transform: 'translateX(-50%)' }}
      >
        {wp.callout}
      </div>

      {/* Outer ping ring */}
      <span
        className={`absolute inset-0 rounded-full ${
          isTerminal ? 'bg-[#ff4655]/20' : 'bg-[#ff4655]/10'
        }`}
        style={{
          width: isTerminal ? 56 : 40,
          height: isTerminal ? 56 : 40,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          animation: isTerminal
            ? 'pulseRing 2s ease-out infinite'
            : 'pulseRing 3s ease-out infinite',
        }}
      />

      {/* Glow node */}
      <div
        className="relative rounded-full border transform-gpu"
        style={{
          width: isTerminal ? 28 : 20,
          height: isTerminal ? 28 : 20,
          borderColor: '#ff4655',
          background: isTerminal
            ? 'radial-gradient(circle, #ff4655 0%, #ff465580 60%, transparent 100%)'
            : 'radial-gradient(circle, #ff465590 0%, #ff465540 60%, transparent 100%)',
          boxShadow: `0 0 ${isTerminal ? 30 : 16}px #ff465580, 0 0 ${isTerminal ? 60 : 30}px #ff465530`,
        }}
      />

      {/* Hover / detail card */}
      <motion.div
        className="absolute top-full left-1/2 mt-4 pointer-events-none select-none"
        style={{ transform: 'translateX(-50%)' }}
        initial={false}
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
        transition={{ duration: 0.2 }}
      >
        <div
          className="relative bg-[#0d121f]/95 border border-white/10 backdrop-blur-sm rounded-sm px-5 py-4 min-w-[220px]"
          style={{ boxShadow: '0 4px 30px rgba(0,0,0,0.6)' }}
        >
          {/* Phase label */}
          <div className="font-mono text-[10px] tracking-[0.3em] text-[#ff4655] mb-1">
            {wp.phase}
          </div>
          <div className="font-teko text-2xl text-white leading-none mb-1">{wp.title}</div>
          <div className="font-mono text-[10px] text-white/40 tracking-wider mb-2">{wp.date}</div>
          <div className="font-mono text-[11px] text-white/50 leading-relaxed">
            {wp.description}
          </div>

          {/* Image thumbnail */}
          {wp.image && (
            <img
              src={wp.image}
              alt={wp.title}
              loading="lazy"
              className="mt-3 w-full h-24 object-cover rounded-sm opacity-70"
            />
          )}

          {/* Notch */}
          <div
            className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-[#0d121f]/95 border-l border-t border-white/10"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Spike Plant Overlay ─────────────────────────────────────────────
const SpikePlant: React.FC<{ active: boolean }> = ({ active }) => {
  const [blinkOn, setBlinkOn] = useState(true);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => setBlinkOn((b) => !b), 600);
    return () => clearInterval(interval);
  }, [active]);

  return (
    <motion.div
      className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Concentric pulse rings */}
      {active && (
        <>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="absolute rounded-full border border-[#ff4655]/30"
              style={{
                width: 120 + i * 100,
                height: 120 + i * 100,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                animation: `concentricPulse 2.5s ease-out ${i * 0.4}s infinite`,
              }}
            />
          ))}
        </>
      )}

      {/* Content */}
      <motion.div
        className="relative flex flex-col items-center gap-3 transform-gpu"
        initial={{ scale: 0.8 }}
        animate={active ? { scale: 1 } : {}}
        transition={{ delay: 0.3, type: 'spring', stiffness: 120 }}
      >
        <div className="font-mono text-[11px] tracking-[0.4em] text-[#ff4655] font-bold">
          SPIKE PLANTED
        </div>
        <AnimatedCounter
          value={300000}
          label="TOTAL PRIZE POOL"
          prefix=""
          suffix=" LKR"
          duration={2.5}
        />
        <div
          className="font-mono text-[10px] tracking-[0.35em] mt-1"
          style={{
            color: blinkOn ? '#ff4655' : 'transparent',
            transition: 'color 0.15s',
          }}
        >
          ▸ DETONATION IMMINENT ◂
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Corner HUD ──────────────────────────────────────────────────────
const CornerHUD: React.FC = () => (
  <>
    {/* Top-left: grid coords */}
    <div className="absolute top-4 left-4 z-40 font-mono text-[9px] text-white/15 tracking-widest select-none pointer-events-none">
      <div>X: 0.00</div>
      <div>Y: 0.00</div>
      <div className="mt-1 text-white/10">GRID 64×64</div>
    </div>

    {/* Top-right: round info */}
    <div className="absolute top-4 right-4 z-40 font-mono text-[9px] text-white/15 tracking-widest text-right select-none pointer-events-none">
      <div>ROUND 1 OF 1</div>
      <div className="text-[#ff4655]/40">ATTACK</div>
    </div>

    {/* Bottom-left: bracket */}
    <div className="absolute bottom-4 left-4 z-40 select-none pointer-events-none">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M2 22 L2 2 L22 2" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      </svg>
    </div>

    {/* Bottom-right: bracket */}
    <div className="absolute bottom-4 right-4 z-40 select-none pointer-events-none">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M22 2 L22 22 L2 22" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      </svg>
    </div>
  </>
);

// ─── Main Component ──────────────────────────────────────────────────
const PathSectionConceptC: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [pathD, setPathD] = useState('');
  const [pathLength, setPathLength] = useState(0);

  // Scroll progress across the entire section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Map the scroll to 0–1 for the path drawing
  const pathProgress = useTransform(scrollYProgress, [0.1, 0.7], [0, 1]);
  const dashOffset = useTransform(pathProgress, (p: number) => pathLength * (1 - p));

  // Marker position along the path
  const [markerPos, setMarkerPos] = useState<{ x: number; y: number; angle: number }>({
    x: 0,
    y: 0,
    angle: 0,
  });

  // Spike plant triggers at ~90% path progress
  const [spikePlanted, setSpikePlanted] = useState(false);

  // Heartbeat glow intensity
  const heartbeatOpacity = useTransform(scrollYProgress, [0.65, 0.85], [0, 0.12]);

  // Build SVG path on mount + resize
  useEffect(() => {
    const updatePath = () => {
      if (!mapRef.current) return;
      const rect = mapRef.current.getBoundingClientRect();
      const d = buildPath(WAYPOINTS, rect.width, rect.height);
      setPathD(d);
    };
    updatePath();
    window.addEventListener('resize', updatePath);
    return () => window.removeEventListener('resize', updatePath);
  }, []);

  // Measure path length once the path `d` is set
  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, [pathD]);

  // Move marker along path
  useEffect(() => {
    if (!pathRef.current || pathLength === 0) return;
    const unsubscribe = pathProgress.on('change', (p: number) => {
      if (!pathRef.current) return;
      const clamped = Math.max(0, Math.min(1, p));
      const point = pathRef.current.getPointAtLength(clamped * pathLength);

      // Calculate angle for marker rotation
      const delta = 0.01;
      const ahead = pathRef.current.getPointAtLength(
        Math.min(pathLength, (clamped + delta) * pathLength),
      );
      const angle = (Math.atan2(ahead.y - point.y, ahead.x - point.x) * 180) / Math.PI;

      setMarkerPos({ x: point.x, y: point.y, angle });
      setSpikePlanted(clamped > 0.88);
    });
    return () => unsubscribe();
  }, [pathProgress, pathLength]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[200vh] w-full overflow-hidden"
      style={{ background: '#08080a' }}
    >
      {/* ── Injected keyframes ─────────────────────────────────── */}
      <style>{`
        @keyframes pulseRing {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
          100% { transform: translate(-50%, -50%) scale(2.4); opacity: 0; }
        }
        @keyframes concentricPulse {
          0% { transform: translate(-50%, -50%) scale(0.6); opacity: 0.5; }
          100% { transform: translate(-50%, -50%) scale(1.6); opacity: 0; }
        }
        @keyframes heartbeat {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
      `}</style>

      {/* ── Sticky viewport ────────────────────────────────────── */}
      <div className="sticky top-0 h-screen w-full flex flex-col">
        {/* ── Header ───────────────────────────────────────────── */}
        <div className="relative z-30 pt-16 md:pt-20 pb-6 text-center">
          <ScrambleText
            text="PROTOCOL HIERARCHY"
            className="font-mono text-[10px] md:text-xs tracking-[0.4em] text-[#ff4655]/70 mb-3 block"
            duration={1.2}
          />
          <h2 className="font-teko text-5xl md:text-7xl lg:text-8xl text-white uppercase leading-[0.9] tracking-tight">
            The Ascent
            <br />
            <span className="text-[#ff4655]">To Glory</span>
          </h2>
        </div>

        {/* ── Minimap container ─────────────────────────────────── */}
        <div
          ref={mapRef}
          className="relative flex-1 mx-4 md:mx-12 lg:mx-20 mb-8 rounded-sm overflow-hidden"
          style={{
            /* Tactical grid via CSS background-image */
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                rgba(255,255,255,0.03) 0px,
                rgba(255,255,255,0.03) 1px,
                transparent 1px,
                transparent 60px
              ),
              repeating-linear-gradient(
                90deg,
                rgba(255,255,255,0.03) 0px,
                rgba(255,255,255,0.03) 1px,
                transparent 1px,
                transparent 60px
              ),
              radial-gradient(
                ellipse at 50% 50%,
                rgba(13,18,31,0.0) 0%,
                rgba(8,8,10,0.85) 70%
              )
            `,
            backgroundColor: '#0d121f',
          }}
        >
          {/* Corner HUD */}
          <CornerHUD />

          {/* Red heartbeat glow overlay */}
          <motion.div
            className="absolute inset-0 z-10 pointer-events-none rounded-sm transform-gpu"
            style={{
              background: 'radial-gradient(ellipse at 75% 60%, #ff465520, transparent 60%)',
              opacity: heartbeatOpacity,
              animation: spikePlanted ? 'heartbeat 1.5s ease-in-out infinite' : 'none',
            }}
          />

          {/* ── SVG Layer ─────────────────────────────────────── */}
          <svg
            className="absolute inset-0 w-full h-full z-10 pointer-events-none"
            preserveAspectRatio="none"
          >
            <defs>
              <filter id="pathGlow">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Glow underlay */}
            {pathD && (
              <motion.path
                d={pathD}
                fill="none"
                stroke="#ff4655"
                strokeWidth={6}
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#pathGlow)"
                strokeDasharray={pathLength}
                strokeDashoffset={dashOffset}
                className="transform-gpu"
                style={{ opacity: 0.3 }}
              />
            )}

            {/* Main path */}
            {pathD && (
              <motion.path
                ref={pathRef}
                d={pathD}
                fill="none"
                stroke="#ff4655"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={pathLength}
                strokeDashoffset={dashOffset}
                className="transform-gpu"
              />
            )}

            {/* Diamond marker */}
            {pathLength > 0 && (
              <g
                style={{
                  transform: `translate(${markerPos.x}px, ${markerPos.y}px) rotate(${markerPos.angle}deg)`,
                  transition: 'transform 0.05s linear',
                }}
              >
                <polygon
                  points="0,-7 5,0 0,7 -5,0"
                  fill="#ff4655"
                  stroke="#fff"
                  strokeWidth="1"
                  style={{
                    filter: 'drop-shadow(0 0 6px #ff4655)',
                  }}
                />
              </g>
            )}
          </svg>

          {/* ── Waypoint Nodes ─────────────────────────────────── */}
          {WAYPOINTS.map((wp, i) => (
            <WaypointNode key={wp.id} wp={wp} index={i} progress={pathProgress} />
          ))}

          {/* ── Spike Plant Overlay ────────────────────────────── */}
          <SpikePlant active={spikePlanted} />
        </div>
      </div>
    </section>
  );
};

export default PathSectionConceptC;
