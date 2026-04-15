import * as React from "react";
import { useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAudio } from '../hooks/useAudio';

// Register ScrollTrigger safely for React
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Simple class merger utility since project lacks /lib/utils
function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

// -------------------------------------------------------------------------
// 1. THEME-ADAPTIVE INLINE STYLES
// -------------------------------------------------------------------------
const STYLES = `
.cinematic-footer-wrapper {
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  
  --pill-bg-1: rgba(255, 255, 255, 0.03);
  --pill-bg-2: rgba(255, 255, 255, 0.01);
  --pill-shadow: rgba(0, 0, 0, 0.5);
  --pill-highlight: rgba(255, 255, 255, 0.05);
  --pill-inset-shadow: rgba(0, 0, 0, 0.8);
  --pill-border: rgba(255, 255, 255, 0.08);
  
  --pill-bg-1-hover: rgba(255, 70, 85, 0.1);
  --pill-bg-2-hover: rgba(255, 70, 85, 0.05);
  --pill-border-hover: rgba(255, 70, 85, 0.4);
  --pill-shadow-hover: rgba(255, 70, 85, 0.1);
  --pill-highlight-hover: rgba(255, 255, 255, 0.1);
}

@keyframes footer-breathe {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.4; }
  100% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.6; }
}

@keyframes footer-scroll-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@keyframes footer-heartbeat {
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 5px rgba(255, 70, 85, 0.3)); }
  15%, 45% { transform: scale(1.1); filter: drop-shadow(0 0 10px rgba(255, 70, 85, 0.5)); }
  30% { transform: scale(1); }
}

.animate-footer-breathe {
  animation: footer-breathe 8s ease-in-out infinite alternate;
}

.footer-scroll-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

.animate-footer-scroll-marquee {
  animation: footer-scroll-marquee 30s linear infinite;
}

.animate-footer-heartbeat {
  animation: footer-heartbeat 2s cubic-bezier(0.25, 1, 0.5, 1) infinite;
}

.footer-bg-grid {
  background-size: 60px 60px;
  background-image: 
    linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
}

.footer-aurora {
  background: radial-gradient(
    circle at 50% 50%, 
    rgba(255, 70, 85, 0.1) 0%, 
    rgba(13, 18, 31, 15%) 40%, 
    transparent 70%
  );
}

.footer-glass-pill {
  background: linear-gradient(145deg, var(--pill-bg-1) 0%, var(--pill-bg-2) 100%);
  box-shadow: 
      0 10px 30px -10px var(--pill-shadow), 
      inset 0 1px 1px var(--pill-highlight), 
      inset 0 -1px 2px var(--pill-inset-shadow);
  border: 1px solid var(--pill-border);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.footer-glass-pill:hover {
  background: linear-gradient(145deg, var(--pill-bg-1-hover) 0%, var(--pill-bg-2-hover) 100%);
  border-color: var(--pill-border-hover);
  box-shadow: 
      0 20px 40px -10px var(--pill-shadow-hover), 
      inset 0 1px 1px var(--pill-highlight-hover);
  color: white;
}

.footer-giant-bg-text {
  font-size: 26vw;
  line-height: 0.75;
  font-weight: 900;
  letter-spacing: -0.05em;
  color: transparent;
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.03);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, transparent 60%);
  -webkit-background-clip: text;
  background-clip: text;
}

@media (max-width: 768px) {
    .footer-giant-bg-text {
        font-size: 20vw;
    }
}

.footer-text-glow {
  background: linear-gradient(180deg, white 0%, rgba(255, 255, 255, 0.4) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0px 0px 20px rgba(255, 255, 255, 0.15));
}
`;

// -------------------------------------------------------------------------
// 2. MAGNETIC BUTTON PRIMITIVE
// -------------------------------------------------------------------------
export type MagneticButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & 
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    as?: React.ElementType;
    [key: string]: any;
  };

const MagneticButton = React.forwardRef<HTMLElement, MagneticButtonProps>(
  ({ className, children, as: Component = "button", ...props }, forwardedRef) => {
    const localRef = useRef<HTMLElement>(null);

    useEffect(() => {
      if (typeof window === "undefined") return;
      const element = localRef.current;
      if (!element) return;

      const ctx = gsap.context(() => {
        const handleMouseMove = (e: MouseEvent) => {
          const rect = element.getBoundingClientRect();
          const h = rect.width / 2;
          const w = rect.height / 2;
          const x = e.clientX - rect.left - h;
          const y = e.clientY - rect.top - w;

          gsap.to(element, {
            x: x * 0.35,
            y: y * 0.35,
            rotationX: -y * 0.1,
            rotationY: x * 0.1,
            scale: 1.05,
            ease: "power2.out",
            duration: 0.4,
          });
        };

        const handleMouseLeave = () => {
          gsap.to(element, {
            x: 0,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            ease: "elastic.out(1, 0.3)",
            duration: 1.2,
          });
        };

        element.addEventListener("mousemove", handleMouseMove as any);
        element.addEventListener("mouseleave", handleMouseLeave);

        return () => {
          element.removeEventListener("mousemove", handleMouseMove as any);
          element.removeEventListener("mouseleave", handleMouseLeave);
        };
      }, element);

      return () => ctx.revert();
    },[]);

    return (
      <Component
        ref={(node: HTMLElement) => {
          (localRef as any).current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) (forwardedRef as any).current = node;
        }}
        className={cn("cursor-pointer", className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
MagneticButton.displayName = "MagneticButton";

// -------------------------------------------------------------------------
// 3. MAIN COMPONENT
// -------------------------------------------------------------------------
const MarqueeItem = () => (
  <div className="flex items-center space-x-12 px-6">
    <span>Ready to Ascend</span> <span className="text-[#ff4655] drop-shadow-[0_0_8px_rgba(255,70,85,0.5)]">✦</span>
    <span>Uplink Established</span> <span className="text-white/40">✦</span>
    <span>Strategic Operations</span> <span className="text-[#ff4655] drop-shadow-[0_0_8px_rgba(255,70,85,0.5)]">✦</span>
    <span>Sec_Lvl_4_Clearance</span> <span className="text-white/40">✦</span>
    <span>Ascent_Network_Live</span> <span className="text-[#ff4655] drop-shadow-[0_0_8px_rgba(255,70,85,0.5)]">✦</span>
  </div>
);

const Footer: React.FC = () => {
  const { playHover, playClick } = useAudio();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const giantTextRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!wrapperRef.current) return;

    const ctx = gsap.context(() => {
      // Background Parallax
      gsap.fromTo(
        giantTextRef.current,
        { y: "15vh", scale: 0.8, opacity: 0 },
        {
          y: "0vh",
          scale: 1,
          opacity: 1,
          ease: "power1.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 90%",
            end: "bottom bottom",
            scrub: 1.5,
          },
        }
      );

      // Contents Reveal
      gsap.fromTo(
        [headingRef.current, linksRef.current],
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 50%",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );
    }, wrapperRef);

    return () => ctx.revert();
  },[]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      
      <div
        ref={wrapperRef}
        className="relative h-[80vh] md:h-screen w-full mt-20"
        style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
      >
        <footer className="fixed bottom-0 left-0 flex h-[80vh] md:h-screen w-full flex-col justify-between overflow-hidden bg-[#0d121f] text-white cinematic-footer-wrapper">
          
          {/* Ambient Light & Grid Background */}
          <div className="footer-aurora absolute left-1/2 top-1/2 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 animate-footer-breathe rounded-[50%] blur-[80px] pointer-events-none z-0" />
          <div className="footer-bg-grid absolute inset-0 z-0 pointer-events-none" />

          {/* Giant background text */}
          <div
            ref={giantTextRef}
            className="footer-giant-bg-text absolute -bottom-[5vh] left-1/2 -translate-x-1/2 whitespace-nowrap z-0 pointer-events-none select-none uppercase"
          >
            Ascent
          </div>

          {/* 1. Diagonal Sleek Marquee */}
          <div className="absolute top-12 left-0 w-full overflow-hidden border-y border-white/10 bg-[#0d121f]/80 backdrop-blur-md py-4 z-10 -rotate-2 scale-110 shadow-2xl">
            <div className="flex w-max animate-footer-scroll-marquee text-[11px] md:text-sm font-bold tracking-[0.3em] text-white/50 uppercase">
              <MarqueeItem />
              <MarqueeItem />
              <MarqueeItem />
              <MarqueeItem />
            </div>
          </div>

          {/* 2. Main Center Content */}
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 mt-20 w-full max-w-5xl mx-auto">
            <h2
              ref={headingRef}
              className="text-5xl md:text-8xl font-bold footer-text-glow tracking-tighter mb-12 text-center uppercase font-teko"
            >
              Ready to <span className="text-[#ff4655]">Ascend?</span>
            </h2>

            {/* Interactive Magnetic Pills */}
            <div ref={linksRef} className="flex flex-col items-center gap-6 w-full">
              <div className="flex flex-wrap justify-center gap-3 md:gap-4 w-full">
                <MagneticButton as="a" href="https://www.instagram.com/ascent_2026/" target="_blank" onMouseEnter={playHover} onClick={playClick} className="footer-glass-pill px-8 md:px-10 py-4 md:py-5 rounded-full text-white font-bold text-xs md:text-base flex items-center gap-3 group uppercase tracking-widest font-teko">
                  Instagram
                </MagneticButton>
                
                <MagneticButton as="button" onMouseEnter={playHover} onClick={playClick} className="footer-glass-pill px-8 md:px-10 py-4 md:py-5 rounded-full text-white font-bold text-xs md:text-base flex items-center gap-3 group uppercase tracking-widest font-teko">
                  Support
                </MagneticButton>
              </div>

              {/* Secondary Links */}
              <div className="flex flex-wrap justify-center gap-2 md:gap-4 w-full mt-2">
                <MagneticButton as={Link} to="/privacy-policy" onMouseEnter={playHover} onClick={playClick} className="footer-glass-pill px-6 py-3 rounded-full text-white/40 font-medium text-[10px] md:text-xs hover:text-white uppercase tracking-widest">
                  Privacy Policy
                </MagneticButton>
                <MagneticButton as={Link} to="/terms-of-service" onMouseEnter={playHover} onClick={playClick} className="footer-glass-pill px-6 py-3 rounded-full text-white/40 font-medium text-[10px] md:text-xs hover:text-white uppercase tracking-widest">
                  Terms of Service
                </MagneticButton>
                <MagneticButton as={Link} to="/refund-policy" onMouseEnter={playHover} onClick={playClick} className="footer-glass-pill px-6 py-3 rounded-full text-white/40 font-medium text-[10px] md:text-xs hover:text-white uppercase tracking-widest">
                  Refund Policy
                </MagneticButton>
              </div>
            </div>
          </div>

          {/* 3. Bottom Bar */}
          <div className="relative z-20 w-full pb-8 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="text-white/30 text-[9px] md:text-[10px] font-bold tracking-[0.2em] uppercase order-2 md:order-1 font-mono">
              © 2026 ASCENT ESPORTS. ALL RIGHTS RESERVED.
            </div>

            <div className="footer-glass-pill px-6 py-3 rounded-full flex items-center gap-2 order-1 md:order-2 cursor-default border-white/10">
              <span className="text-white/40 text-[9px] md:text-[10px] font-bold uppercase tracking-widest">Crafted by</span>
              <a 
                href="https://www.linkedin.com/in/rehan-perera-09a9752b6/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white font-bold text-[10px] md:text-xs tracking-widest hover:text-[#ff4655] transition-colors"
              >
                REHAN PERERA
              </a>
            </div>

            <MagneticButton
              as="button"
              onClick={() => { playClick(); scrollToTop(); }}
              onMouseEnter={playHover}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full footer-glass-pill flex items-center justify-center text-white/40 hover:text-white group order-3"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5 transform group-hover:-translate-y-1.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
              </svg>
            </MagneticButton>

          </div>
        </footer>
      </div>
    </>
  );
}

export default Footer;

