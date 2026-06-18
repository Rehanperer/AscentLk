import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Cpu, ShieldCheck, RefreshCw, Volume2, VolumeX, AlertTriangle, ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import SEO from '../SEO';
import CinematicOrb from './CinematicOrb';

// ─── Programmatic Web Audio Synthesizer ─────────────────────────────────────
class SoundSynthesizer {
    private ctx: AudioContext | null = null;
    private humOsc: OscillatorNode | null = null;
    private humGain: GainNode | null = null;
    private noiseOsc: OscillatorNode | null = null;
    private noiseGain: GainNode | null = null;
    public isMuted: boolean = false;

    init() {
        if (this.isMuted) return;
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        try {
            // Play a brief silent buffer to fully unlock audio on mobile browsers (iOS/Safari)
            const buffer = this.ctx.createBuffer(1, 1, 22050);
            const source = this.ctx.createBufferSource();
            source.buffer = buffer;
            source.connect(this.ctx.destination);
            source.start(0);
        } catch (e) {
            // ignore
        }
    }

    startCharge() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;

        try {
            this.humOsc = this.ctx.createOscillator();
            this.humOsc.type = 'triangle';
            this.humOsc.frequency.setValueAtTime(55, this.ctx.currentTime);

            this.humGain = this.ctx.createGain();
            this.humGain.gain.setValueAtTime(0, this.ctx.currentTime);
            this.humGain.gain.linearRampToValueAtTime(0.4, this.ctx.currentTime + 0.15);

            this.noiseOsc = this.ctx.createOscillator();
            this.noiseOsc.type = 'sawtooth';
            this.noiseOsc.frequency.setValueAtTime(240, this.ctx.currentTime);

            this.noiseGain = this.ctx.createGain();
            this.noiseGain.gain.setValueAtTime(0, this.ctx.currentTime);

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(450, this.ctx.currentTime);
            filter.Q.setValueAtTime(2.0, this.ctx.currentTime);

            const lowpass = this.ctx.createBiquadFilter();
            lowpass.type = 'lowpass';
            lowpass.frequency.setValueAtTime(150, this.ctx.currentTime);

            this.humOsc.connect(this.humGain);
            this.humGain.connect(lowpass);
            lowpass.connect(this.ctx.destination);

            this.noiseOsc.connect(this.noiseGain);
            this.noiseGain.connect(filter);
            filter.connect(this.ctx.destination);

            this.humOsc.start();
            this.noiseOsc.start();
        } catch (e) {
            console.error('Failed to start synth audio context', e);
        }
    }

    updateProgress(progress: number) {
        if (this.isMuted || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            if (this.humOsc) {
                const humFreq = 55 + progress * 75.8;
                this.humOsc.frequency.setTargetAtTime(humFreq, now, 0.05);
            }
            if (this.humGain) {
                const humVol = 0.4 + progress * 0.4;
                this.humGain.gain.setTargetAtTime(humVol, now, 0.05);
            }
            if (this.noiseOsc) {
                const noiseFreq = 240 + progress * 360;
                this.noiseOsc.frequency.setTargetAtTime(noiseFreq, now, 0.05);
            }
            if (this.noiseGain) {
                const noiseVol = progress * 0.12;
                this.noiseGain.gain.setTargetAtTime(noiseVol, now, 0.05);
            }
        } catch (e) {
            // Ignore scheduling errors
        }
    }

    stopCharge() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const fadeTime = 0.12;
        
        try {
            if (this.humGain) {
                this.humGain.gain.cancelScheduledValues(now);
                this.humGain.gain.linearRampToValueAtTime(0, now + fadeTime);
            }
            if (this.noiseGain) {
                this.noiseGain.gain.cancelScheduledValues(now);
                this.noiseGain.gain.linearRampToValueAtTime(0, now + fadeTime);
            }

            const hOsc = this.humOsc;
            const nOsc = this.noiseOsc;
            setTimeout(() => {
                try {
                    if (hOsc) { hOsc.stop(); hOsc.disconnect(); }
                    if (nOsc) { nOsc.stop(); nOsc.disconnect(); }
                } catch (e) {}
            }, fadeTime * 1000 + 30);
        } catch (e) {}

        this.humOsc = null;
        this.noiseOsc = null;
    }

    playSuccess() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;

        try {
            const now = this.ctx.currentTime;
            const dest = this.ctx.destination;

            // ── Create a subtle reverb tail via IIR convolver ──
            const reverbGain = this.ctx.createGain();
            reverbGain.gain.setValueAtTime(0.18, now);
            reverbGain.connect(dest);

            // Build a short synthetic impulse response (0.6s reverb)
            const irLen = Math.floor(this.ctx.sampleRate * 0.6);
            const irBuf = this.ctx.createBuffer(2, irLen, this.ctx.sampleRate);
            for (let ch = 0; ch < 2; ch++) {
                const data = irBuf.getChannelData(ch);
                for (let i = 0; i < irLen; i++) {
                    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / irLen, 3.5);
                }
            }
            const convolver = this.ctx.createConvolver();
            convolver.buffer = irBuf;
            convolver.connect(reverbGain);

            // ── Helper: create a bell-like tone with harmonics ──
            const playTone = (freq: number, startAt: number, vol: number, dur: number) => {
                // Fundamental (sine)
                const osc1 = this.ctx!.createOscillator();
                osc1.type = 'sine';
                osc1.frequency.setValueAtTime(freq, startAt);

                // 3rd harmonic for bell shimmer
                const osc2 = this.ctx!.createOscillator();
                osc2.type = 'sine';
                osc2.frequency.setValueAtTime(freq * 3, startAt);

                // 5th harmonic (very subtle)
                const osc3 = this.ctx!.createOscillator();
                osc3.type = 'sine';
                osc3.frequency.setValueAtTime(freq * 5, startAt);

                // Gain envelopes – quick attack, smooth exponential decay
                const g1 = this.ctx!.createGain();
                g1.gain.setValueAtTime(0, startAt);
                g1.gain.linearRampToValueAtTime(vol, startAt + 0.008);          // 8ms attack
                g1.gain.setTargetAtTime(0, startAt + 0.06, dur * 0.28);        // smooth decay

                const g2 = this.ctx!.createGain();
                g2.gain.setValueAtTime(0, startAt);
                g2.gain.linearRampToValueAtTime(vol * 0.12, startAt + 0.005);  // quieter harmonic
                g2.gain.setTargetAtTime(0, startAt + 0.04, dur * 0.18);        // faster decay

                const g3 = this.ctx!.createGain();
                g3.gain.setValueAtTime(0, startAt);
                g3.gain.linearRampToValueAtTime(vol * 0.04, startAt + 0.005);
                g3.gain.setTargetAtTime(0, startAt + 0.03, dur * 0.12);

                // Highpass to keep it clean
                const hp = this.ctx!.createBiquadFilter();
                hp.type = 'highpass';
                hp.frequency.setValueAtTime(400, startAt);
                hp.Q.setValueAtTime(0.5, startAt);

                // Route: oscs → gains → hp → destination + reverb
                osc1.connect(g1); g1.connect(hp);
                osc2.connect(g2); g2.connect(hp);
                osc3.connect(g3); g3.connect(hp);
                hp.connect(dest);
                hp.connect(convolver);

                const stopAt = startAt + dur + 0.3;
                osc1.start(startAt); osc1.stop(stopAt);
                osc2.start(startAt); osc2.stop(stopAt);
                osc3.start(startAt); osc3.stop(stopAt);
            };

            // ── Two-tone ascending chime (Apple Pay style) ──
            // Tone 1: E6 (1318.5 Hz) — first ding
            playTone(1318.5, now, 0.30, 0.22);
            // Tone 2: G#6 (1661.2 Hz) — second ding, major third up
            playTone(1661.2, now + 0.11, 0.34, 0.28);
        } catch (e) {}
    }

    playExplosion() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;

        try {
            const now = this.ctx.currentTime;

            const subOsc = this.ctx.createOscillator();
            subOsc.type = 'sine';
            subOsc.frequency.setValueAtTime(110, now);
            subOsc.frequency.linearRampToValueAtTime(25, now + 0.8);

            const subGain = this.ctx.createGain();
            subGain.gain.setValueAtTime(0.9, now);
            subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

            subOsc.connect(subGain);
            subGain.connect(this.ctx.destination);
            subOsc.start();
            subOsc.stop(now + 1.25);

            const whiteNoiseOsc = this.ctx.createOscillator();
            whiteNoiseOsc.type = 'sawtooth';
            whiteNoiseOsc.frequency.setValueAtTime(180, now);
            
            const noiseFilter = this.ctx.createBiquadFilter();
            noiseFilter.type = 'lowpass';
            noiseFilter.frequency.setValueAtTime(400, now);
            noiseFilter.frequency.exponentialRampToValueAtTime(30, now + 0.7);

            const noiseGainNode = this.ctx.createGain();
            noiseGainNode.gain.setValueAtTime(0.6, now);
            noiseGainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

            whiteNoiseOsc.connect(noiseFilter);
            noiseFilter.connect(noiseGainNode);
            noiseGainNode.connect(this.ctx.destination);

            whiteNoiseOsc.start();
            whiteNoiseOsc.stop(now + 0.75);
        } catch (e) {}
    }
}

// ─── Pulse Ring Constants ───────────────────────────────────────────────────
const GAP_PX: Record<string, number> = { N: 7, M: 15, W: 24 };
const RING_STROKE = 3;
const RING_R0 = 50;
const RING_COLOR = '#00FFFF';
const GAP_LABEL: Record<string, string> = { N: 'N', M: 'M', W: 'W' };

// ─── Inline Keyframe Styles (injected once) ────────────────────────────────
const KEYFRAME_STYLES = `
@keyframes rt-scanline {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}
@keyframes rt-orbit-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes rt-orbit-spin-reverse {
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
}
@keyframes rt-particle-drift {
  0% { transform: translate(0, 0) scale(1); opacity: 0; }
  15% { opacity: 0.8; }
  100% { transform: translate(var(--dx), var(--dy)) scale(0); opacity: 0; }
}
@keyframes rt-fan-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes rt-temp-flicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
@keyframes rt-glow-pulse {
  0%, 100% { box-shadow: 0 0 15px rgba(0,255,255,0.15), inset 0 0 15px rgba(0,255,255,0.05); }
  50% { box-shadow: 0 0 30px rgba(0,255,255,0.3), inset 0 0 20px rgba(0,255,255,0.1); }
}
@keyframes rt-core-morph {
  0% { border-radius: 50%; transform: scale(1) rotate(0deg); }
  25% { border-radius: 42% 58% 55% 45%; transform: scale(1.08) rotate(3deg); }
  50% { border-radius: 55% 45% 42% 58%; transform: scale(0.94) rotate(-2deg); }
  75% { border-radius: 48% 52% 50% 50%; transform: scale(1.05) rotate(1deg); }
  100% { border-radius: 50%; transform: scale(1) rotate(0deg); }
}
@keyframes rt-shockwave {
  0% { transform: scale(0.3); opacity: 1; border-width: 4px; }
  100% { transform: scale(3.5); opacity: 0; border-width: 0.5px; }
}
@keyframes rt-data-scroll {
  0% { transform: translateY(0); }
  100% { transform: translateY(-50%); }
}
@keyframes rt-hex-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes rt-badge-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(0,255,136,0.3), 0 0 60px rgba(0,255,136,0.1); }
  50% { box-shadow: 0 0 40px rgba(0,255,136,0.5), 0 0 80px rgba(0,255,136,0.2); }
}
@keyframes rt-verified-line {
  0% { width: 0; opacity: 0; }
  50% { width: 100%; opacity: 1; }
  100% { width: 100%; opacity: 0.4; }
}
@keyframes rt-chromatic-glitch {
  0%, 100% { filter: none; opacity: 1; }
  10%, 14% { filter: drop-shadow(2px 0 0 rgba(0,255,255,0.6)) drop-shadow(-2px 0 0 rgba(255,70,85,0.6)); }
  12% { transform: scale(1.02) skewX(1deg); }
  15% { filter: none; }
  40%, 44% { filter: contrast(1.3) brightness(1.2); }
  42% { transform: scale(0.99) skewX(-1deg); }
  45% { filter: none; }
}
@keyframes rt-lens-flare {
  0% { transform: rotate(0deg) scale(0.8); opacity: 0.3; }
  50% { transform: rotate(180deg) scale(1.2); opacity: 0.6; }
  100% { transform: rotate(360deg) scale(0.8); opacity: 0.3; }
}
@keyframes rt-intro-scanline {
  0% { top: -10%; opacity: 0; }
  5% { opacity: 1; }
  95% { opacity: 1; }
  100% { top: 110%; opacity: 0; }
}
@keyframes rt-intro-text-glitch {
  0%, 100% { transform: translate(0); filter: none; }
  20% { transform: translate(-2px, 1px); filter: drop-shadow(2px 0 #ff4655) drop-shadow(-2px 0 #00FFFF); }
  40% { transform: translate(1px, -1px); filter: none; }
  60% { transform: translate(-1px, 2px); filter: drop-shadow(1px 0 #ff4655) drop-shadow(-1px 0 #00FFFF); }
  80% { transform: translate(2px, -2px); filter: none; }
}
@keyframes rt-fluid-flow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.rt-fluid-text {
  background: linear-gradient(
    90deg,
    #ff4655 0%,
    #080d12 25%,
    #0088ff 50%,
    #080d12 75%,
    #ff4655 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: rt-fluid-flow 4s linear infinite;
  filter: drop-shadow(0 0 10px rgba(255, 70, 85, 0.4)) drop-shadow(0 0 20px rgba(0, 136, 255, 0.2));
}
`;

// ─── Deterministic HSL color generator based on ticket UUID ──────────────────
const getUniqueTicketColors = (id?: string) => {
    if (!id) {
        return {
            color1: '#00FFFF',
            color2: '#00ff88',
            glow: 'rgba(0,255,255,0.4)',
            glowSecondary: 'rgba(0,255,136,0.3)',
            hue1: 180,
            hue2: 150
        };
    }
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue1 = Math.abs(hash % 360);
    const hue2 = (hue1 + 137) % 360;

    return {
        color1: `hsl(${hue1}, 95%, 60%)`,
        color2: `hsl(${hue2}, 90%, 50%)`,
        glow: `hsla(${hue1}, 95%, 60%, 0.45)`,
        glowSecondary: `hsla(${hue2}, 90%, 50%, 0.3)`,
        hue1,
        hue2
    };
};

// Scrambler effect component for decrypting agent designation in premium HUD style
const ScrambledDesignation: React.FC<{ text: string }> = ({ text }) => {
    const [display, setDisplay] = useState('');
    useEffect(() => {
        let iterations = 0;
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%&*';
        const interval = setInterval(() => {
            setDisplay(
                text.split('').map((char, index) => {
                    if (index < iterations) return char;
                    if (char === ' ') return ' ';
                    return chars[Math.floor(Math.random() * chars.length)];
                }).join('')
            );
            iterations += 1/3;
            if (iterations >= text.length) clearInterval(interval);
        }, 30);
        return () => clearInterval(interval);
    }, [text]);
    return <span>{display}</span>;
};

// ─── Component ──────────────────────────────────────────────────────────────
const RadianiteTicket: React.FC = () => {
    const { id: ticketId } = useParams<{ id: string }>();
    const colors = getUniqueTicketColors(ticketId);
    const [ticket, setTicket] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [isMuted, setIsMuted] = useState(false);

        const [chargeState, setChargeState] = useState<'idle' | 'charging' | 'charged' | 'scanned'>('idle');
    const [chargeProgress, setChargeProgress] = useState(0);
    // Intro animation phases: 'flying' -> 'settling' -> 'reveal' -> 'done'
    const [introPhase, setIntroPhase] = useState<'flying' | 'settling' | 'reveal' | 'done'>('flying');
    const [colorSequence, setColorSequence] = useState<string[]>([]);
    const [expiresIn, setExpiresIn] = useState<number>(0);
    const [coreTemp, setCoreTemp] = useState(45.2);

    const idleOrbRef = useRef<HTMLDivElement>(null);
    const [orbTargetRect, setOrbTargetRect] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

    const synthRef = useRef<SoundSynthesizer>(new SoundSynthesizer());
    const chargeIntervalRef = useRef<number | null>(null);
    const countdownIntervalRef = useRef<number | null>(null);
    const tempIntervalRef = useRef<number | null>(null);

    // Sync Mute to Synth
    useEffect(() => {
        synthRef.current.isMuted = isMuted;
    }, [isMuted]);

    // Measure the idle orb container's position on screen
    useEffect(() => {
        const measure = () => {
            if (idleOrbRef.current) {
                const rect = idleOrbRef.current.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0) {
                    setOrbTargetRect({
                        x: rect.left + rect.width / 2,
                        y: rect.top + rect.height / 2,
                        width: rect.width,
                        height: rect.height,
                    });
                }
            }
        };

        measure();

        // Staggered layout checks
        const t1 = setTimeout(measure, 100);
        const t2 = setTimeout(measure, 400);
        const t3 = setTimeout(measure, 800);

        window.addEventListener('resize', measure);
        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
            window.removeEventListener('resize', measure);
        };
    }, []);

    // Fluctuating temperature gauge
    useEffect(() => {
        tempIntervalRef.current = window.setInterval(() => {
            setCoreTemp(45.0 + Math.random() * 3.5);
        }, 1800);
        return () => {
            if (tempIntervalRef.current) clearInterval(tempIntervalRef.current);
        };
    }, []);

    // Inject keyframe styles once
    useEffect(() => {
        const id = 'rt-keyframes';
        if (!document.getElementById(id)) {
            const style = document.createElement('style');
            style.id = id;
            style.textContent = KEYFRAME_STYLES;
            document.head.appendChild(style);
        }
    }, []);

    // Intro phase timeline (runs once on mount)
    useEffect(() => {
        const t1 = window.setTimeout(() => setIntroPhase('settling'), 2500);
        const t2 = window.setTimeout(() => setIntroPhase('reveal'), 3800);
        const t3 = window.setTimeout(() => setIntroPhase('done'), 8600);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // iOS Web Audio autoplay unlock on first touch/interaction
    useEffect(() => {
        const unlock = () => {
            synthRef.current.init();
            document.removeEventListener('touchstart', unlock);
            document.removeEventListener('click', unlock);
        };
        document.addEventListener('touchstart', unlock, { passive: true });
        document.addEventListener('click', unlock);
        return () => {
            document.removeEventListener('touchstart', unlock);
            document.removeEventListener('click', unlock);
        };
    }, []);

    // ─── Fetch Ticket & Realtime ────────────────────────────────────────
    useEffect(() => {
        if (!ticketId) return;

        const loadTicket = async () => {
            try {
                const { data, error } = await supabase.rpc('get_ticket', { ticket_id: ticketId });
                if (error) throw error;
                if (!data || data.length === 0) {
                    setErrorMsg('MANIFEST ERROR: TICKET CORRUPTED OR UNRECOGNIZED.');
                    setLoading(false);
                    return;
                }

                const ticketData = data[0];
                setTicket(ticketData);

                if (ticketData.ticket_status === 'scanned') {
                    setChargeState('scanned');
                } else if (ticketData.active_color_sequence && new Date(ticketData.sequence_expires_at) > new Date()) {
                    setColorSequence(ticketData.active_color_sequence);
                    setChargeState('charged');
                    const msLeft = new Date(ticketData.sequence_expires_at).getTime() - Date.now();
                    setExpiresIn(Math.max(0, Math.ceil(msLeft / 1000)));
                }

                setLoading(false);
            } catch (err: any) {
                console.error(err);
                setErrorMsg('DECRYPTION FAILURE: CANNOT CONNECT TO THE GRID.');
                setLoading(false);
            }
        };

        loadTicket();

        const channel = supabase
            .channel(`ticket_scan_${ticketId}`)
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'registrations',
                filter: `id=eq.${ticketId}`
            }, (payload: any) => {
                const updated = payload.new;
                if (updated.ticket_status === 'scanned') {
                    setChargeState('scanned');
                    setTicket((prev: any) => ({ ...prev, ticket_status: 'scanned' }));

                    // Rising audio overload hum for 1.2s, then play explosion sound
                    synthRef.current.startCharge();
                    let elapsed = 0;
                    if (chargeIntervalRef.current) clearInterval(chargeIntervalRef.current);
                    chargeIntervalRef.current = window.setInterval(() => {
                        elapsed += 100;
                        if (elapsed >= 1200) {
                            if (chargeIntervalRef.current) clearInterval(chargeIntervalRef.current);
                            synthRef.current.stopCharge();
                            synthRef.current.playExplosion();
                        } else {
                            synthRef.current.updateProgress(elapsed / 1200);
                        }
                    }, 100);

                    if ('vibrate' in navigator) {
                        navigator.vibrate([80, 50, 120, 50, 160, 50, 240, 50, 600]);
                    }
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
            if (chargeIntervalRef.current) clearInterval(chargeIntervalRef.current);
            if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        };
    }, [ticketId]);

    // ─── Countdown Timer ────────────────────────────────────────────────
    useEffect(() => {
        if (chargeState !== 'charged') return;

        countdownIntervalRef.current = window.setInterval(() => {
            setExpiresIn(prev => {
                if (prev <= 1) {
                    setChargeState('idle');
                    setChargeProgress(0);
                    setColorSequence([]);
                    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        };
    }, [chargeState]);

    // ─── Charging Logic ─────────────────────────────────────────────────
    const handleStartCharge = () => {
        if (chargeState === 'charged' || chargeState === 'scanned') return;

        synthRef.current.startCharge();
        setChargeState('charging');

        const chargeDuration = 2200;
        const intervalStep = 30;
        const progressIncrement = (intervalStep / chargeDuration) * 100;

        let curProgress = chargeProgress;
        
        chargeIntervalRef.current = window.setInterval(async () => {
            curProgress += progressIncrement;
            
            if (curProgress >= 100) {
                setChargeProgress(100);
                setChargeState('charged');
                if (chargeIntervalRef.current) clearInterval(chargeIntervalRef.current);
                synthRef.current.stopCharge();
                
                synthRef.current.playSuccess();
                if ('vibrate' in navigator) {
                    navigator.vibrate([150, 50, 150]);
                }

                try {
                    const { data, error } = await supabase.rpc('charge_ticket', { ticket_id: ticketId });
                    if (error) throw error;
                    if (data) {
                        setColorSequence(data);
                        setExpiresIn(180);
                    } else {
                        setChargeState('scanned');
                    }
                } catch (e) {
                    console.error('Failed to generate pulse ring sequence', e);
                    setChargeState('idle');
                    setChargeProgress(0);
                }
                return;
            }

            setChargeProgress(curProgress);
            synthRef.current.updateProgress(curProgress / 100);

            if ('vibrate' in navigator) {
                if (curProgress > 80 && Math.random() > 0.4) {
                    navigator.vibrate(60);
                } else if (curProgress > 50 && Math.random() > 0.7) {
                    navigator.vibrate(40);
                } else if (curProgress > 20 && Math.random() > 0.88) {
                    navigator.vibrate(20);
                }
            }
        }, intervalStep);
    };

    const handleStopCharge = () => {
        if (chargeState !== 'charging') return;
        
        if (chargeIntervalRef.current) clearInterval(chargeIntervalRef.current);
        synthRef.current.stopCharge();

        setChargeState('idle');
        const drainDuration = 400;
        const intervalStep = 30;
        const progressDecrement = (intervalStep / drainDuration) * 100;

        chargeIntervalRef.current = window.setInterval(() => {
            setChargeProgress(prev => {
                const next = prev - progressDecrement;
                if (next <= 0) {
                    if (chargeIntervalRef.current) clearInterval(chargeIntervalRef.current);
                    return 0;
                }
                return next;
            });
        }, intervalStep);
    };

    // ─── Shared Sub-Components ──────────────────────────────────────────

    // Corner brackets for HUD panels
    const CornerBrackets = ({ color = 'rgba(0,255,255,0.3)' }: { color?: string }) => (
        <>
            <div className="absolute -top-px -left-px w-3 h-3 border-t border-l pointer-events-none" style={{ borderColor: color }} />
            <div className="absolute -top-px -right-px w-3 h-3 border-t border-r pointer-events-none" style={{ borderColor: color }} />
            <div className="absolute -bottom-px -left-px w-3 h-3 border-b border-l pointer-events-none" style={{ borderColor: color }} />
            <div className="absolute -bottom-px -right-px w-3 h-3 border-b border-r pointer-events-none" style={{ borderColor: color }} />
        </>
    );

    // Rotating cooling fan SVG
    const CoolingFan = ({ size = 24 }: { size?: number }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ animation: 'rt-fan-spin 2s linear infinite', willChange: 'transform' }}>
            <circle cx="12" cy="12" r="2.5" stroke="rgba(0,255,255,0.6)" strokeWidth="1" />
            {[0, 60, 120, 180, 240, 300].map(angle => (
                <path
                    key={angle}
                    d={`M12,12 Q${12 + 7 * Math.cos((angle + 30) * Math.PI / 180)},${12 + 7 * Math.sin((angle + 30) * Math.PI / 180)} ${12 + 9 * Math.cos(angle * Math.PI / 180)},${12 + 9 * Math.sin(angle * Math.PI / 180)}`}
                    stroke="rgba(0,255,255,0.4)"
                    strokeWidth="1.5"
                    fill="rgba(0,255,255,0.08)"
                />
            ))}
            <circle cx="12" cy="12" r="10.5" stroke="rgba(0,255,255,0.15)" strokeWidth="0.5" />
        </svg>
    );

    // Floating energy particles (CSS-only for performance)
    const EnergyParticles = ({ count = 12 }: { count?: number }) => (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(count)].map((_, i) => {
                const angle = (i / count) * Math.PI * 2;
                const dx = Math.cos(angle) * (80 + Math.random() * 60);
                const dy = Math.sin(angle) * (80 + Math.random() * 60);
                return (
                    <div
                        key={i}
                        className="absolute left-1/2 top-1/2 rounded-full"
                        style={{
                            width: `${2 + Math.random() * 3}px`,
                            height: `${2 + Math.random() * 3}px`,
                            backgroundColor: i % 3 === 0 ? '#00FFFF' : i % 3 === 1 ? '#00ff88' : '#ff4655',
                            boxShadow: `0 0 6px ${i % 3 === 0 ? '#00FFFF' : i % 3 === 1 ? '#00ff88' : '#ff4655'}`,
                            '--dx': `${dx}px`,
                            '--dy': `${dy}px`,
                            animation: `rt-particle-drift ${2.5 + Math.random() * 2}s ease-out infinite`,
                            animationDelay: `${i * 0.3}s`,
                            willChange: 'transform, opacity',
                        } as React.CSSProperties}
                    />
                );
            })}
        </div>
    );

    // Orb flight path — erratic waypoints as percentages
    const flyingKeyframes = [
        { x: '15%', y: '20%', scale: 0.6, rotate: 0 },
        { x: '75%', y: '15%', scale: 0.9, rotate: 120 },
        { x: '85%', y: '70%', scale: 0.5, rotate: 240 },
        { x: '25%', y: '80%', scale: 1.1, rotate: 360 },
        { x: '60%', y: '30%', scale: 0.7, rotate: 480 },
        { x: '40%', y: '60%', scale: 0.8, rotate: 600 },
        { x: '50%', y: '45%', scale: 1.0, rotate: 720 },
    ];

    const isIntroSettling = introPhase === 'settling' || introPhase === 'reveal';
    const isIntroRevealed = introPhase === 'reveal';

    const introOverlayJSX = introPhase !== 'done' ? (
        <motion.div
            key="intro-overlay"
            className="fixed inset-0 z-[100] flex items-center justify-center"
            style={{ background: '#0a0f14' }}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
        >
            {/* Ambient deep background */}
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'radial-gradient(ellipse at 50% 50%, rgba(0,255,255,0.03) 0%, transparent 60%)',
                    }}
                />
                {/* Grid overlay */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: '40px 40px',
                    }}
                />
            </div>

            {/* Scanning laser during flight */}
            {!isIntroRevealed && (
                <div
                    className="absolute left-0 right-0 h-[2px] pointer-events-none z-20"
                    style={{
                        background: 'linear-gradient(90deg, transparent, rgba(0,255,255,0.6), rgba(0,255,255,0.8), rgba(0,255,255,0.6), transparent)',
                        boxShadow: '0 0 20px rgba(0,255,255,0.4), 0 0 60px rgba(0,255,255,0.2)',
                        animation: 'rt-intro-scanline 1.5s linear infinite',
                        willChange: 'top',
                    }}
                />
            )}

            {/* Orb trail particles during flight */}
            {!isIntroSettling && (
                <div className="absolute inset-0 pointer-events-none z-10">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 rounded-full bg-[#00FFFF]"
                            style={{
                                boxShadow: '0 0 6px #00FFFF',
                                left: `${20 + Math.random() * 60}%`,
                                top: `${20 + Math.random() * 60}%`,
                            }}
                            animate={{
                                opacity: [0, 0.8, 0],
                                scale: [0, 1.5, 0],
                            }}
                            transition={{
                                duration: 0.8 + Math.random() * 0.6,
                                repeat: Infinity,
                                delay: i * 0.12,
                                ease: 'easeOut',
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Flying Orb */}
            <motion.div
                className="absolute z-30"
                style={{ width: 280, height: 280 }}
                initial={{
                    left: flyingKeyframes[0].x,
                    top: flyingKeyframes[0].y,
                    x: '-50%',
                    y: '-50%',
                    scale: flyingKeyframes[0].scale * 0.5,
                    rotate: 0,
                }}
                animate={
                    isIntroSettling
                        ? {
                            left: orbTargetRect ? orbTargetRect.x : '50%',
                            top: orbTargetRect ? orbTargetRect.y : '45%',
                            x: '-50%',
                            y: '-50%',
                            scale: orbTargetRect ? (orbTargetRect.width / 280) : 1.0,
                            rotate: 720,
                        }
                        : {
                            left: flyingKeyframes.map(k => k.x),
                            top: flyingKeyframes.map(k => k.y),
                            scale: flyingKeyframes.map(k => k.scale * 0.5),
                            rotate: flyingKeyframes.map(k => k.rotate),
                        }
                }
                transition={
                    isIntroSettling
                        ? {
                            duration: 1.3,
                            ease: [0.16, 1, 0.3, 1],
                        }
                        : {
                            duration: 2.5,
                            ease: 'easeInOut',
                            times: [0, 0.15, 0.3, 0.45, 0.6, 0.8, 1],
                        }
                }
            >
                {/* Glow trail behind the orb */}
                <motion.div
                    className="absolute inset-[-30px] rounded-full pointer-events-none"
                    style={{
                        background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
                        filter: 'blur(20px)',
                    }}
                    animate={{
                        opacity: isIntroSettling ? [0.8, 0.4] : [0.3, 0.8, 0.3],
                        scale: isIntroSettling ? [1.5, 1] : [1, 1.5, 1],
                    }}
                    transition={{ duration: isIntroSettling ? 1.2 : 1.5, repeat: isIntroSettling ? 0 : Infinity }}
                />
                <CinematicOrb state="idle" chargeProgress={0} size={280} />
            </motion.div>

            {/* Glassmorphism blur overlay */}
            <motion.div
                className="absolute inset-0 z-40 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: isIntroRevealed ? 1 : 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{
                    backdropFilter: 'blur(30px) saturate(1.4)',
                    WebkitBackdropFilter: 'blur(30px) saturate(1.4)',
                    background: 'rgba(10,15,20,0.65)',
                }}
            />

            {/* Title reveal text — on top of the blur */}
            <AnimatePresence>
                {isIntroRevealed && (
                    <motion.div
                        key="cinematic-title"
                        className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center justify-center w-full max-w-md px-6 z-50 pointer-events-none"
                        style={{
                            top: orbTargetRect ? orbTargetRect.y + orbTargetRect.height / 2 + 24 : 'calc(45% + 164px)',
                        }}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{
                            opacity: [0, 1, 1, 0],
                            y: [15, 0, 0, -10],
                        }}
                        transition={{
                            times: [0, 0.1, 0.85, 1],
                            duration: 4.2,
                            ease: 'easeInOut',
                        }}
                    >
                        <div className="relative w-full flex items-center justify-center">
                            {/* Outline Layer: Fades in */}
                            <motion.h1
                                className="text-5xl sm:text-6xl tracking-[0.12em] font-bold uppercase leading-none text-center font-teko text-transparent"
                                style={{
                                    WebkitTextStroke: '1.5px rgba(0, 255, 255, 0.75)',
                                    textShadow: '0 0 8px rgba(0, 255, 255, 0.15)',
                                }}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                            >
                                YOUR TICKET FOR ASCENT
                            </motion.h1>

                            {/* Organic Filled Layer: "Infected" spread outward */}
                            <motion.h1
                                className="absolute inset-0 text-5xl sm:text-6xl tracking-[0.12em] font-bold uppercase leading-none text-center font-teko rt-fluid-text"
                                initial={{ 
                                    clipPath: 'circle(0% at 50% 50%)',
                                    filter: 'drop-shadow(0 0 2px rgba(0, 255, 136, 0))',
                                }}
                                animate={{ 
                                    clipPath: [
                                        'circle(0% at 50% 50%)',
                                        'circle(35% at 42% 58%)',   // organic skew/drift center-left
                                        'circle(70% at 58% 42%)',   // organic drift center-right
                                        'circle(120% at 50% 50%)'
                                    ],
                                    filter: [
                                        'drop-shadow(0 0 2px rgba(0, 255, 136, 0))',
                                        'drop-shadow(0 0 8px rgba(0, 255, 136, 0.5))',
                                        'drop-shadow(0 0 15px rgba(0, 255, 255, 0.8))'
                                    ]
                                }}
                                transition={{
                                    clipPath: {
                                        duration: 1.6,
                                        delay: 0.5,
                                        ease: 'easeInOut',
                                        times: [0, 0.35, 0.7, 1],
                                    },
                                    filter: {
                                        duration: 1.6,
                                        delay: 0.5,
                                        ease: 'easeInOut',
                                    }
                                }}
                            >
                                YOUR TICKET FOR ASCENT
                            </motion.h1>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    ) : null;

    // ─── Loading State ──────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0f14] text-white flex flex-col items-center justify-center p-6 border-4 border-[#ff4655]/30">
                <div className="w-12 h-12 border-2 border-t-[#ff4655] border-white/10 rounded-full animate-spin mb-4" />
                <div className="font-mono text-sm tracking-wider animate-pulse text-[#ff4655]">DECRYPTING RADIANITE PROTOCOL...</div>
            </div>
        );
    }

    // ─── Error State ────────────────────────────────────────────────────
    if (errorMsg) {
        return (
            <div className="min-h-screen bg-[#0a0f14] text-white flex flex-col items-center justify-center p-6 text-center">
                <div className="border border-red-500/20 bg-red-950/20 p-6 rounded-lg max-w-sm">
                    <AlertTriangle className="text-red-500 w-12 h-12 mx-auto mb-4 animate-bounce" />
                    <h2 className="font-teko text-3xl uppercase tracking-wider text-red-500 mb-2">ACCESS TERMINATED</h2>
                    <p className="font-mono text-xs text-white/60 mb-6 leading-relaxed">{errorMsg}</p>
                    <Link to="/" className="inline-flex items-center gap-2 font-mono text-xs px-4 py-2 border border-white/20 hover:border-white text-white/80 hover:text-white transition duration-200">
                        <ArrowLeft size={14} /> RETURN TO MAIN GRID
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen bg-[#0a0f14] text-white flex flex-col justify-between select-none relative font-sans overflow-x-hidden ${introPhase !== 'done' ? 'overflow-hidden max-h-screen' : 'overflow-y-auto'}`}>
            {/* ═══ Cinematic Intro Overlay ═══ */}
            <AnimatePresence>
                {introOverlayJSX}
            </AnimatePresence>
            <SEO 
                title={`Secure Radianite Ticket | ASCENT 2026`} 
                description="Your highly secure digital ticket for ASCENT 2026. Hold to charge the Radianite core to present pulse ring pattern."
                path={`/ticket/${ticketId}`}
            />

            {/* Hidden SVG Gooey Filter */}
            <svg className="absolute w-0 h-0" width="0" height="0">
                <defs>
                    <filter id="gooey-radianite" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur" />
                        <feColorMatrix 
                            in="blur" 
                            mode="matrix" 
                            values="1 0 0 0 0  
                                    0 1 0 0 0  
                                    0 0 1 0 0  
                                    0 0 0 24 -10" 
                            result="goo" 
                        />
                        <feBlend in="SourceGraphic" in2="goo" />
                    </filter>
                </defs>
            </svg>

            {/* ═══ Full-Screen Scanline Sweep ═══ */}
            <div 
                className="fixed inset-0 pointer-events-none z-[2] overflow-hidden"
            >
                <div 
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        height: '120px',
                        background: 'linear-gradient(180deg, transparent 0%, rgba(0,255,255,0.03) 40%, rgba(0,255,255,0.06) 50%, rgba(0,255,255,0.03) 60%, transparent 100%)',
                        animation: 'rt-scanline 4s linear infinite',
                        willChange: 'transform',
                    }}
                />
            </div>

            {/* ═══ Ambient Glow Background ═══ */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-grid opacity-[0.03]" />
                {/* Ambient glow */}
                <div 
                    className="absolute top-1/2 left-1/2 w-[500px] h-[500px] rounded-full blur-[120px] opacity-60"
                    style={{
                        background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
                        transform: 'translate(-50%, -50%)',
                    }}
                />
                {/* Secondary ambient */}
                <div 
                    className="absolute top-1/3 left-1/3 w-[300px] h-[300px] rounded-full blur-[100px] opacity-40"
                    style={{
                        background: `radial-gradient(circle, ${colors.glowSecondary} 0%, transparent 70%)`,
                        transform: 'translate(-50%, -50%)',
                    }}
                />
            </div>

            {/* ═══ Content Container ═══ */}
            <div className="relative z-10 flex flex-col justify-between min-h-screen p-5">
                {/* ═══ Top HUD Row ═══ */}
                <motion.header 
                    className="flex justify-between items-center border-b border-white/10 pb-3 mb-2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={introPhase === 'done' && chargeState !== 'scanned' ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                >
                    <div className="flex items-center gap-2">
                        <Ticket className="text-[#ff4655] animate-pulse" size={18} />
                        <span className="font-mono text-[9px] tracking-[0.2em] text-white/60 uppercase">
                            ASCENT // RADIANITE MANIFEST
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setIsMuted(prev => !prev)}
                            className="p-1.5 border border-white/10 rounded hover:bg-white/5 transition duration-150"
                            title={isMuted ? "Unmute sounds" : "Mute sounds"}
                        >
                            {isMuted ? <VolumeX size={12} className="text-white/40" /> : <Volume2 size={12} className="text-[#00ff88]" />}
                        </button>
                        <span className="font-mono text-[9px] bg-white/5 border border-white/10 px-2 py-0.5 text-white/80 rounded">
                            {ticketId?.slice(0, 8)}
                        </span>
                    </div>
                </motion.header>

                {/* ═══ HUD Status Bar ═══ */}
                <motion.div 
                    className="flex items-center justify-between px-1 mb-3"
                    initial={{ opacity: 0 }}
                    animate={introPhase === 'done' && chargeState !== 'scanned' ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                >
                    <div className="flex items-center gap-2">
                        <CoolingFan size={18} />
                        <span className="font-mono text-[9px] text-[#00FFFF]/70" style={{ animation: 'rt-temp-flicker 2s ease-in-out infinite' }}>
                            CORE: {coreTemp.toFixed(1)}°C
                        </span>
                    </div>
                    <div className="font-mono text-[8px] text-white/30 tracking-widest">
                        {chargeState === 'scanned' ? '█ VERIFIED' : chargeState === 'charged' ? '█ ARMED' : chargeState === 'charging' ? '▓ CHARGING' : '░ STANDBY'}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${chargeState === 'scanned' ? 'bg-[#00ff88]' : chargeState === 'charged' ? 'bg-[#00FFFF] animate-pulse' : 'bg-white/20'}`} />
                        <span className="font-mono text-[8px] text-white/40">SYS OK</span>
                    </div>
                </motion.div>

                {/* ═══ Main Content ═══ */}
                <main className="flex-grow flex flex-col items-center justify-center">
                    <AnimatePresence mode="wait">

                        {/* ════════════════════════════════════════════════
                            SCANNED / AGENT VERIFIED STATE
                            ════════════════════════════════════════════════ */}
                        {chargeState === 'scanned' && (
                            <motion.div 
                                key="scanned"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: 'spring', damping: 15 }}
                                className="w-full max-w-sm flex flex-col items-center relative"
                            >
                                {/* ── Chromatic Screen Glitch Overlay ── */}
                                <div 
                                    className="fixed inset-0 pointer-events-none z-45"
                                    style={{
                                        animation: 'rt-chromatic-glitch 2s ease-in-out infinite',
                                    }}
                                />

                                {/* ── Cinematic Orb & Badge Container ── */}
                                <div className="relative w-full max-w-[288px] aspect-square flex items-center justify-center mb-6 select-none mt-4">
                                    {/* The exploding orb: size expanded to 600px to prevent box-clipping */}
                                    <div className="absolute w-[600px] h-[600px] pointer-events-none z-10 flex items-center justify-center">
                                        <CinematicOrb state="scanned" chargeProgress={100} size={600} />
                                    </div>

                                    {/* The verified badge: Fades in after the blast */}
                                    <motion.div
                                        className="relative z-20"
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 1.8, duration: 0.8, type: 'spring', damping: 15 }}
                                    >
                                        {/* Rotating lens flare behind badge */}
                                        <div 
                                            className="absolute inset-[-50px] bg-gradient-to-r from-transparent via-[#00ff88]/30 to-transparent rounded-full blur-[40px] pointer-events-none"
                                            style={{ animation: 'rt-lens-flare 5s linear infinite' }}
                                        />

                                        {/* Rotating hex border */}
                                        <div 
                                            className="absolute inset-[-12px] opacity-30"
                                            style={{ animation: 'rt-hex-rotate 8s linear infinite', willChange: 'transform' }}
                                        >
                                            <svg viewBox="0 0 100 100" className="w-full h-full">
                                                <polygon 
                                                    points="50,2 93,25 93,75 50,98 7,75 7,25" 
                                                    fill="none" 
                                                    stroke="#00ff88" 
                                                    strokeWidth="1"
                                                    strokeDasharray="8 4"
                                                />
                                            </svg>
                                        </div>
                                        {/* Counter-rotating hex */}
                                        <div 
                                            className="absolute inset-[-20px] opacity-15"
                                            style={{ animation: 'rt-hex-rotate 12s linear infinite', animationDirection: 'reverse', willChange: 'transform' }}
                                        >
                                            <svg viewBox="0 0 100 100" className="w-full h-full">
                                                <polygon 
                                                    points="50,5 90,27 90,73 50,95 10,73 10,27" 
                                                    fill="none" 
                                                    stroke="#00FFFF" 
                                                    strokeWidth="0.8"
                                                />
                                            </svg>
                                        </div>
                                        {/* Main badge */}
                                        <div 
                                            className="relative border-2 border-[#00ff88] bg-[#00ff88]/10 text-[#00ff88] p-6 rounded-full"
                                            style={{ animation: 'rt-badge-glow 2s ease-in-out infinite' }}
                                        >
                                            <ShieldCheck size={48} />
                                        </div>
                                    </motion.div>
                                </div>

                                {/* ── Verified Details: Fades in after detonation ── */}
                                <motion.div
                                    className="w-full flex flex-col items-center"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 2.0, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    {/* ── Agent Verified Title ── */}
                                    <h2 className="font-teko text-5xl text-center uppercase tracking-wider text-[#00ff88] mb-0.5"
                                        style={{ textShadow: '0 0 20px rgba(0,255,136,0.4), 0 0 40px rgba(0,255,136,0.15)' }}>
                                        AGENT VERIFIED
                                    </h2>
                                    
                                    {/* Animated underline */}
                                    <div className="w-48 h-px bg-gradient-to-r from-transparent via-[#00ff88] to-transparent mb-1"
                                        style={{ animation: 'rt-verified-line 2s ease-out forwards' }} />
                                    
                                    <p className="font-mono text-center text-[10px] text-[#00ff88]/60 tracking-[0.3em] uppercase mb-6">
                                        SECURE GATE ACCESS APPROVED
                                    </p>

                                    {/* ── Apple Glassmorphic Ticket Details Card ── */}
                                    <div className="w-full border border-white/10 bg-white/[0.03] rounded-xl relative overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]"
                                        style={{ 
                                            backdropFilter: 'blur(20px)',
                                            WebkitBackdropFilter: 'blur(20px)',
                                        }}>
                                        <CornerBrackets color="rgba(0,255,136,0.4)" />

                                        {/* Inner scanline */}
                                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                            <div style={{
                                                position: 'absolute', left: 0, right: 0, height: '40px',
                                                background: 'linear-gradient(180deg, transparent, rgba(0,255,136,0.04), transparent)',
                                                animation: 'rt-scanline 3s linear infinite',
                                            }} />
                                        </div>

                                        {/* Top status strip */}
                                        <div className="flex justify-between items-center px-4 py-1.5 border-b border-white/5 bg-[#00ff88]/5">
                                            <span className="font-mono text-[8px] text-[#00ff88]/60 tracking-widest">CLASSIFIED // AGENT FILE</span>
                                            <span className="font-mono text-[8px] text-[#00ff88] animate-pulse">● COMMS SECURE</span>
                                        </div>

                                        <div className="p-5 space-y-4 font-mono text-xs relative">
                                            <div className="border-b border-white/5 pb-3">
                                                <span className="text-white/30 block text-[8px] tracking-[0.2em] uppercase mb-1">AGENT DESIGNATION</span>
                                                <span className="text-white font-bold text-base tracking-wide" style={{ textShadow: '0 0 10px rgba(255,255,255,0.1)' }}>
                                                    <ScrambledDesignation text={ticket?.full_name?.toUpperCase() || 'AGENT'} />
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <span className="text-white/30 block text-[8px] tracking-[0.2em] uppercase mb-1">SEAT / SECTION</span>
                                                    <span className="text-[#00FFFF] font-bold text-sm">
                                                        <ScrambledDesignation text={ticket?.seat_id ? ticket.seat_id.toUpperCase() : 'GENERAL'} />
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-white/30 block text-[8px] tracking-[0.2em] uppercase mb-1">GATE ENTRY</span>
                                                    <span className="text-white font-bold text-sm">NORTH ARCHWAY</span>
                                                </div>
                                            </div>
                                            <div className="border-t border-white/5 pt-3 flex justify-between items-center text-[9px] text-white/30">
                                                <span>ASCENT INDEPENDENT SEATING</span>
                                                <span>2026.06.15</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}

                        {/* ════════════════════════════════════════════════
                            CHARGED — PULSE RING DISPLAY STATE
                            ════════════════════════════════════════════════ */}
                        {chargeState === 'charged' && (
                            <motion.div 
                                key="charged"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="w-full max-w-sm flex flex-col items-center relative"
                            >
                                {/* Warning header */}
                                <div className="font-mono text-[9px] tracking-widest text-[#ff4655] mb-4 font-bold animate-pulse flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-[#ff4655] rounded-full animate-ping" />
                                    ⚡ RADIANITE CORE UNSTABLE // PRESENT TO SCANNER
                                </div>

                                {/* ── Apple Glassmorphic Quantum Reactor Containment ── */}
                                <div className="relative w-full max-w-[320px] aspect-square flex items-center justify-center mb-4 border border-white/10 bg-white/[0.03] rounded-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.35)]"
                                    style={{ 
                                        backdropFilter: 'blur(20px)',
                                        WebkitBackdropFilter: 'blur(20px)',
                                    }}>
                                    
                                    <CornerBrackets color="rgba(255,255,255,0.15)" />

                                    {/* Grid overlay */}
                                    <div className="absolute inset-2 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:100%_8px] opacity-25 pointer-events-none" />

                                    {/* Scanning laser sweep */}
                                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                        <div style={{
                                            position: 'absolute', left: '5%', right: '5%', height: '2px',
                                            background: 'linear-gradient(90deg, transparent 0%, #00ff88 30%, #00FFFF 50%, #00ff88 70%, transparent 100%)',
                                            boxShadow: '0 0 12px rgba(0,255,136,0.4)',
                                            animation: 'rt-scanline 2.5s ease-in-out infinite',
                                            willChange: 'transform',
                                        }} />
                                    </div>

                                    {/* Energy particles */}
                                    <EnergyParticles count={10} />

                                    {/* ── Cinematic Deforming Orb ── */}
                                    <div
                                        className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
                                    >
                                        <CinematicOrb 
                                            state={(chargeState as string) === 'scanned' ? 'charged' : (chargeState as any)} 
                                            chargeProgress={chargeProgress} 
                                            size={280} 
                                        />
                                    </div>

                                    {/* ── Concentric Pulse Rings (SVG) ── */}
                                    <motion.svg
                                        className="absolute z-20 pointer-events-none w-full h-full"
                                        viewBox="0 0 500 500"
                                        style={{ filter: `drop-shadow(0 0 8px ${colors.glow})` }}
                                        animate={{ scale: [0.98, 1.02, 0.98] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                    >
                                        <defs>
                                            <filter id="ring-glow-ticket" x="-50%" y="-50%" width="200%" height="200%">
                                                <feGaussianBlur stdDeviation="2" result="blur" />
                                                <feMerge>
                                                    <feMergeNode in="blur" />
                                                    <feMergeNode in="SourceGraphic" />
                                                </feMerge>
                                            </filter>
                                        </defs>

                                        {(() => {
                                            const rings: React.ReactElement[] = [];
                                            let r = RING_R0;
                                            rings.push(
                                                <circle key={0} cx="250" cy="250" r={r}
                                                    fill="none" stroke={RING_COLOR} strokeWidth={RING_STROKE}
                                                    opacity={0.95} filter="url(#ring-glow-ticket)" />
                                            );
                                            for (let i = 0; i < 7; i++) {
                                                const gap = colorSequence[i];
                                                const gapSize = GAP_PX[gap] || GAP_PX['M'];
                                                r += gapSize + RING_STROKE;
                                                rings.push(
                                                    <circle key={i + 1} cx="250" cy="250" r={r}
                                                        fill="none" stroke={RING_COLOR} strokeWidth={RING_STROKE}
                                                        opacity={0.9 - i * 0.04} filter="url(#ring-glow-ticket)" />
                                                );
                                            }
                                            return rings;
                                        })()}
                                    </motion.svg>
                                </div>

                                {/* ── HUD Status Row ── */}
                                <div className="w-full max-w-[310px] flex justify-between items-center px-1 font-mono text-[8px] text-white/35 mb-3">
                                    <span className="flex items-center gap-1">
                                        <CoolingFan size={14} />
                                        <span style={{ animation: 'rt-temp-flicker 1.5s ease-in-out infinite' }}>{coreTemp.toFixed(1)}°C</span>
                                    </span>
                                    <span className="text-[#00ff88] animate-pulse font-bold text-[9px]">PULSE RING ACTIVE</span>
                                    <span>GATE_SYS ●</span>
                                </div>

                                {/* ── Manual Verification Code ── */}
                                <div className="w-full max-w-[310px] bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5 mb-4 flex flex-col items-center gap-1.5 relative overflow-hidden shadow-[0_4px_16px_0_rgba(0,0,0,0.2)]"
                                    style={{ 
                                        backdropFilter: 'blur(16px)',
                                        WebkitBackdropFilter: 'blur(16px)',
                                    }}>
                                    <CornerBrackets color="rgba(255,255,255,0.15)" />
                                    <span className="font-mono text-[7px] text-white/25 tracking-[0.2em] uppercase">MANUAL VERIFICATION CODE</span>
                                    <div className="flex items-center gap-1 font-mono text-base font-bold tracking-[0.25em]">
                                        {colorSequence.map((gap, idx) => (
                                            <span 
                                                key={idx} 
                                                style={{ 
                                                    color: gap === 'N' ? '#00FFFF' : gap === 'M' ? '#FFFF00' : '#FF8C00',
                                                    textShadow: `0 0 8px ${gap === 'N' ? 'rgba(0,255,255,0.5)' : gap === 'M' ? 'rgba(255,255,0,0.5)' : 'rgba(255,140,0,0.5)'}`
                                                }}
                                            >
                                                {gap}
                                            </span>
                                        ))}
                                    </div>
                                    <span className="font-mono text-[7px] text-white/15">READ THIS CODE TO GATE STAFF IF CAMERA FAILS</span>
                                </div>

                                {/* ── Countdown Timer ── */}
                                <div className="w-full max-w-[310px] bg-white/[0.03] border border-white/10 p-3 rounded-xl flex flex-col gap-2 font-mono relative overflow-hidden shadow-[0_4px_16px_0_rgba(0,0,0,0.2)]"
                                    style={{ 
                                        backdropFilter: 'blur(16px)',
                                        WebkitBackdropFilter: 'blur(16px)',
                                    }}>
                                    <CornerBrackets color="rgba(255,255,255,0.15)" />
                                    <div className="flex justify-between items-center text-[9px]">
                                        <span className="text-white/40">DECRYPTION TIME</span>
                                        <span className="text-[#00ff88] font-bold tabular-nums">{Math.floor(expiresIn / 60)}:{String(expiresIn % 60).padStart(2, '0')}</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
                                        <motion.div 
                                            className="h-full rounded-full"
                                            style={{ background: 'linear-gradient(90deg, #00ff88, #00FFFF, #00ff88)' }}
                                            initial={{ width: '100%' }}
                                            animate={{ width: `${(expiresIn / 180) * 100}%` }}
                                            transition={{ duration: 1, ease: 'linear' }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* ════════════════════════════════════════════════
                            IDLE / CHARGING STATE
                            ════════════════════════════════════════════════ */}
                        {(chargeState === 'idle' || chargeState === 'charging') && (
                            <motion.div 
                                key="idle-charging"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center w-full"
                            >
                                {/* ── Cinematic Orb (Idle/Charging) ── */}
                                <div 
                                    ref={idleOrbRef}
                                    className="relative w-full max-w-[288px] aspect-square flex items-center justify-center mb-6 select-none"
                                >
                                    <div className="absolute inset-0 pointer-events-none z-10">
                                        <CinematicOrb 
                                            state={(chargeState as string) === 'scanned' ? 'idle' : (chargeState as any)} 
                                            chargeProgress={chargeProgress} 
                                            size={280} 
                                        />
                                    </div>

                                    {/* Circular progress ring overlay */}
                                    <motion.svg 
                                        className="absolute w-56 h-56 -rotate-90 pointer-events-none z-20"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={introPhase === 'done' ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                                    >
                                        <circle cx="112" cy="112" r="106" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="2" />
                                        <motion.circle 
                                            cx="112" cy="112" r="106" fill="transparent" 
                                            stroke={colors.color1} strokeWidth="3.5"
                                            strokeDasharray="666"
                                            strokeDashoffset={666 - (666 * chargeProgress) / 100}
                                            strokeLinecap="round"
                                            style={{
                                                filter: chargeState === 'charging' ? `drop-shadow(0 0 8px ${colors.glow})` : 'none'
                                            }}
                                        />
                                    </motion.svg>
                                </div>

                                {/* ── Charge Button ── */}
                                <motion.button
                                    onPointerDown={handleStartCharge}
                                    onPointerUp={handleStopCharge}
                                    onPointerLeave={handleStopCharge}
                                    onPointerCancel={handleStopCharge}
                                    className="w-full max-w-[288px] py-4 rounded-xl border bg-white/[0.03] font-teko text-2xl uppercase tracking-[0.15em] font-bold transition duration-150 hover:bg-white/[0.08] active:scale-[0.97] flex flex-col items-center select-none touch-none relative overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]"
                                    style={{
                                        backdropFilter: 'blur(16px)',
                                        WebkitBackdropFilter: 'blur(16px)',
                                        color: chargeState === 'charging' ? colors.color1 : 'rgba(255, 255, 255, 0.85)',
                                        borderColor: chargeState === 'charging' ? colors.color1 : 'rgba(255,255,255,0.1)',
                                        boxShadow: chargeState === 'charging' 
                                            ? `0 0 25px ${colors.glow}, inset 0 0 15px ${colors.glowSecondary}`
                                            : '0 8px 32px 0 rgba(0,0,0,0.3)',
                                        WebkitTouchCallout: 'none',
                                    }}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={introPhase === 'done' ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                                >
                                    <CornerBrackets color={chargeState === 'charging' ? colors.color1 : 'rgba(255,255,255,0.15)'} />
                                    <span>{chargeState === 'charging' ? 'HOLDING...' : 'HOLD TO ACTIVATE'}</span>
                                    <span className="font-mono text-[9px] tracking-wider normal-case opacity-60 mt-0.5">
                                        {chargeState === 'charging' ? `${Math.round(chargeProgress)}% CHARGED` : 'REQUIRES SUSTAINED CONTACT'}
                                    </span>
                                </motion.button>

                                {/* ── Ticket Info Card ── */}
                                <motion.div 
                                    className="w-full max-w-[288px] mt-5 bg-white/[0.03] border border-white/10 rounded-xl p-4 font-mono text-[10px] relative overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]"
                                    style={{ 
                                        backdropFilter: 'blur(16px)',
                                        WebkitBackdropFilter: 'blur(16px)',
                                    }}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={introPhase === 'done' ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
                                >
                                    <CornerBrackets color="rgba(255,255,255,0.1)" />
                                    <div className="flex justify-between mb-2 text-white/30">
                                        <span>AGENT: <span className="text-white/70">{ticket?.full_name?.toUpperCase().slice(0, 16) || 'N/A'}</span></span>
                                        <span className="text-[#00FFFF]/60">{ticket?.seat_id?.toUpperCase() || 'GEN'}</span>
                                    </div>
                                    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                    <div className="flex justify-between mt-2 text-white/20 text-[8px]">
                                        <span>CINNAMON LIFE COLOMBO</span>
                                        <span>15 JUN 2026</span>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>

                {/* ═══ Bottom HUD Footer ═══ */}
                <motion.footer 
                    className="border-t border-white/8 pt-3 flex flex-col items-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={introPhase === 'done' && chargeState !== 'scanned' ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                >
                    <div className="w-full flex justify-between items-center text-[9px] font-mono text-white/30 mb-1.5">
                        <span>SECTOR: CINNAMON LIFE</span>
                        <span className="flex items-center gap-1">
                            <div className="w-1 h-1 rounded-full bg-[#00ff88] animate-pulse" />
                            PROTO: PULSE_RING_v3
                        </span>
                    </div>
                    <div className="font-mono text-[8px] text-white/15 text-center leading-relaxed max-w-xs">
                        Dynamic pulse ring patterns expire automatically. Screenshot protection active.
                    </div>
                </motion.footer>
            </div>
        </div>
    );
};

export default RadianiteTicket;
