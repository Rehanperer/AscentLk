import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Cpu, ShieldCheck, RefreshCw, Volume2, VolumeX, AlertTriangle, ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import SEO from '../SEO';

// Programmatic Web Audio Synthesizer for premium sound feel without assets
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
    }

    startCharge() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;

        try {
            // Main low hum oscillator
            this.humOsc = this.ctx.createOscillator();
            this.humOsc.type = 'triangle';
            this.humOsc.frequency.setValueAtTime(55, this.ctx.currentTime); // A1 note (very low hum)

            this.humGain = this.ctx.createGain();
            this.humGain.gain.setValueAtTime(0, this.ctx.currentTime);
            this.humGain.gain.linearRampToValueAtTime(0.4, this.ctx.currentTime + 0.15);

            // Secondary crackling sawtooth oscillator
            this.noiseOsc = this.ctx.createOscillator();
            this.noiseOsc.type = 'sawtooth';
            this.noiseOsc.frequency.setValueAtTime(240, this.ctx.currentTime);

            this.noiseGain = this.ctx.createGain();
            this.noiseGain.gain.setValueAtTime(0, this.ctx.currentTime);

            // Highpass filter for crackle to avoid muddiness
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(450, this.ctx.currentTime);
            filter.Q.setValueAtTime(2.0, this.ctx.currentTime);

            // Lowpass filter for hum to keep it warm and heavy
            const lowpass = this.ctx.createBiquadFilter();
            lowpass.type = 'lowpass';
            lowpass.frequency.setValueAtTime(150, this.ctx.currentTime);

            // Connections
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
            
            // Hum freq climbs from 55Hz (A1) to 130.8Hz (C3)
            if (this.humOsc) {
                const humFreq = 55 + progress * 75.8;
                this.humOsc.frequency.setTargetAtTime(humFreq, now, 0.05);
            }
            
            // Hum gain intensifies
            if (this.humGain) {
                const humVol = 0.4 + progress * 0.4;
                this.humGain.gain.setTargetAtTime(humVol, now, 0.05);
            }

            // Sawtooth crackle sweeps from 240Hz to 600Hz, and its gain goes from 0 to 0.12
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

            // Stop nodes after fade out
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

            // Sci-fi high-pitch confirmation bell
            const osc = this.ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, now); // C5
            osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.35); // Sweep to C6

            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.4, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(now + 0.65);
        } catch (e) {}
    }

    playExplosion() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;

        try {
            const now = this.ctx.currentTime;

            // Deep impact sub drop
            const subOsc = this.ctx.createOscillator();
            subOsc.type = 'sine';
            subOsc.frequency.setValueAtTime(110, now); // A2
            subOsc.frequency.linearRampToValueAtTime(25, now + 0.8); // Drop down to super deep 25Hz

            const subGain = this.ctx.createGain();
            subGain.gain.setValueAtTime(0.9, now);
            subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

            subOsc.connect(subGain);
            subGain.connect(this.ctx.destination);
            subOsc.start();
            subOsc.stop(now + 1.25);

            // Explosive crackle white-noise filter sweep
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

// Pulse Ring gap sizes — viewBox 500×500 displayed at 320×320 CSS px
// Scale factor ≈ 0.64, so gaps are physically large enough for camera detection
const GAP_PX: Record<string, number> = { N: 8, M: 20, W: 36 };
const RING_STROKE = 4;
const RING_R0 = 48; // innermost ring radius (clears the 40px-radius blob center)
const RING_COLOR = '#00FFFF'; // neon cyan

// Label map for the text code fallback
const GAP_LABEL: Record<string, string> = { N: 'N', M: 'M', W: 'W' };

const RadianiteTicket: React.FC = () => {
    const { id: ticketId } = useParams<{ id: string }>();
    const [ticket, setTicket] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [isMuted, setIsMuted] = useState(false);

    // Charge State: 'idle' | 'charging' | 'charged' | 'scanned'
    const [chargeState, setChargeState] = useState<'idle' | 'charging' | 'charged' | 'scanned'>('idle');
    const [chargeProgress, setChargeProgress] = useState(0);
    const [colorSequence, setColorSequence] = useState<string[]>([]);
    const [expiresIn, setExpiresIn] = useState<number>(0);

    // Gyroscope Offset
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    const synthRef = useRef<SoundSynthesizer>(new SoundSynthesizer());
    const chargeIntervalRef = useRef<number | null>(null);
    const countdownIntervalRef = useRef<number | null>(null);

    // Sync Mute to Synth
    useEffect(() => {
        synthRef.current.isMuted = isMuted;
    }, [isMuted]);

    // 1. Fetch Ticket details initially and check status
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
                    // Resume active color sequence if it hasn't expired yet
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

        // 2. Subscribe to realtime update to wait for scanning
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
                    // Trigger Explosion!
                    synthRef.current.playExplosion();
                    
                    // Strong Haptic explosion pattern: 400ms vibrate, 100ms pause, 200ms vibrate
                    if ('vibrate' in navigator) {
                        navigator.vibrate([400, 100, 200, 50, 100]);
                    }
                    
                    setChargeState('scanned');
                    setTicket((prev: any) => ({ ...prev, ticket_status: 'scanned' }));
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
            if (chargeIntervalRef.current) clearInterval(chargeIntervalRef.current);
            if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        };
    }, [ticketId]);

    // 3. Handle Gyroscope parallax tilt
    useEffect(() => {
        const handleOrientation = (e: DeviceOrientationEvent) => {
            if (chargeState === 'scanned') return;
            const x = e.gamma ? Math.max(-25, Math.min(25, e.gamma)) : 0;
            const y = e.beta ? Math.max(-25, Math.min(25, e.beta - 45)) : 0; // Bias tilt towards typical viewing angle (45 deg)
            setTilt({ x, y });
        };

        // Request DeviceOrientation permission on iOS 13+
        const requestPermission = async () => {
            if (
                typeof window !== 'undefined' &&
                'DeviceOrientationEvent' in window &&
                (DeviceOrientationEvent as any).requestPermission
            ) {
                try {
                    const status = await (DeviceOrientationEvent as any).requestPermission();
                    if (status === 'granted') {
                        window.addEventListener('deviceorientation', handleOrientation);
                    }
                } catch (e) {
                    console.log('Gyroscope access declined or unsupported.');
                }
            } else {
                window.addEventListener('deviceorientation', handleOrientation);
            }
        };

        requestPermission();

        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
        };
    }, [chargeState]);

    // 4. Handle Countdown Timer for active color sequence
    useEffect(() => {
        if (chargeState !== 'charged') return;

        countdownIntervalRef.current = window.setInterval(() => {
            setExpiresIn(prev => {
                if (prev <= 1) {
                    // Sequence expired, reset to idle
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

    // 5. Charging Interaction Logic (Hold & Release)
    const handleStartCharge = () => {
        if (chargeState === 'charged' || chargeState === 'scanned') return;

        synthRef.current.startCharge();
        setChargeState('charging');

        const chargeDuration = 2200; // 2.2 seconds to charge
        const intervalStep = 30; // update every 30ms
        const progressIncrement = (intervalStep / chargeDuration) * 100;

        let curProgress = chargeProgress;
        
        chargeIntervalRef.current = window.setInterval(async () => {
            curProgress += progressIncrement;
            
            if (curProgress >= 100) {
                // Charge complete!
                setChargeProgress(100);
                setChargeState('charged');
                if (chargeIntervalRef.current) clearInterval(chargeIntervalRef.current);
                synthRef.current.stopCharge();
                
                // Trigger lock success sounds and haptics
                synthRef.current.playSuccess();
                if ('vibrate' in navigator) {
                    navigator.vibrate([150, 50, 150]);
                }

                // Call Supabase RPC to generate sequence
                try {
                    const { data, error } = await supabase.rpc('charge_ticket', { ticket_id: ticketId });
                    if (error) throw error;
                    if (data) {
                        setColorSequence(data);
                        setExpiresIn(30);
                    } else {
                        // Ticket was already scanned
                        setChargeState('scanned');
                    }
                } catch (e) {
                    console.error('Failed to generate color barcode', e);
                    setChargeState('idle');
                    setChargeProgress(0);
                }
                return;
            }

            setChargeProgress(curProgress);
            synthRef.current.updateProgress(curProgress / 100);

            // Pulsing haptic feedback that gets stronger/tighter as progress builds
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

        // Drain progress back to 0
        setChargeState('idle');
        const drainDuration = 400; // 0.4s to drain
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

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0f14] text-white flex flex-col items-center justify-center p-6 border-4 border-[#ff4655]/30">
                <div className="w-12 h-12 border-2 border-t-[#ff4655] border-white/10 rounded-full animate-spin mb-4" />
                <div className="font-mono text-sm tracking-wider animate-pulse text-[#ff4655]">DECRYPTING RADIANITE PROTOCOL...</div>
            </div>
        );
    }

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
        <div className="min-h-screen bg-[#0a0f14] text-white overflow-hidden flex flex-col justify-between p-6 select-none relative font-sans">
            <SEO 
                title={`Secure Radianite Ticket | ASCENT 2026`} 
                description="Your highly secure digital ticket for ASCENT 2026. Hold to charge the Radianite core to present color barcode."
                path={`/ticket/${ticketId}`}
            />

            {/* Hidden SVG Gooey Filter definition */}
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

            {/* Glowing Cyberpunk Parallax Background */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-grid opacity-[0.03]" />
                <motion.div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] bg-[#ff4655]/5 opacity-60"
                    animate={{
                        x: tilt.x * 2 - 250,
                        y: tilt.y * 2 - 250,
                    }}
                    transition={{ type: 'spring', damping: 30, stiffness: 60 }}
                />
            </div>

            {/* Top HUD Row */}
            <header className="relative z-10 flex justify-between items-center border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                    <Ticket className="text-[#ff4655] animate-pulse" size={20} />
                    <span className="font-mono text-[10px] tracking-[0.2em] text-white/60 uppercase">
                        ASCENT // TICKET MANIFEST
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setIsMuted(prev => !prev)}
                        className="p-2 border border-white/10 rounded hover:bg-white/5 transition duration-150"
                        title={isMuted ? "Unmute sounds" : "Mute sounds"}
                    >
                        {isMuted ? <VolumeX size={14} className="text-white/40" /> : <Volume2 size={14} className="text-[#00ff88]" />}
                    </button>
                    <span className="font-mono text-[10px] bg-white/5 border border-white/10 px-2 py-1 text-white/80 rounded">
                        ID: {ticketId?.slice(0, 8)}...
                    </span>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="relative z-10 flex-grow flex flex-col items-center justify-center py-8">
                <AnimatePresence mode="wait">
                    {/* SCANNED / SUCCESS STATE */}
                    {chargeState === 'scanned' && (
                        <motion.div 
                            key="scanned"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', damping: 15 }}
                            className="w-full max-w-sm flex flex-col items-center relative"
                        >
                            {/* Explosion Shockwave Overlay Flash */}
                            <motion.div 
                                className="fixed inset-0 bg-white pointer-events-none z-50"
                                initial={{ opacity: 1 }}
                                animate={{ opacity: 0 }}
                                transition={{ duration: 1.5, ease: 'easeOut' }}
                            />

                            {/* Cinematic Gravity Particle Explosion */}
                            <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center">
                                {[...Array(45)].map((_, i) => {
                                    const angle = Math.random() * Math.PI * 2;
                                    const velocity = 70 + Math.random() * 260;
                                    const targetX = Math.cos(angle) * velocity;
                                    const targetY = Math.sin(angle) * velocity;
                                    const colors = ['#FF00FF', '#00FFFF', '#FFFF00', '#00FF00', '#FF8C00', '#8A2BE2'];
                                    const randColor = colors[Math.floor(Math.random() * colors.length)];
                                    return (
                                        <motion.div
                                            key={i}
                                            className="absolute rounded-full blur-[0.5px]"
                                            style={{
                                                width: `${4 + Math.random() * 7}px`,
                                                height: `${4 + Math.random() * 7}px`,
                                                backgroundColor: randColor,
                                                boxShadow: `0 0 10px ${randColor}, 0 0 20px ${randColor}`
                                            }}
                                            initial={{ x: 0, y: 0, scale: 1.6, opacity: 1 }}
                                            animate={{
                                                x: targetX,
                                                y: targetY + 120, // gravity drop
                                                scale: 0,
                                                opacity: 0
                                            }}
                                            transition={{
                                                duration: 0.9 + Math.random() * 0.7,
                                                ease: 'easeOut'
                                            }}
                                        />
                                    );
                                })}
                            </div>
                            
                            {/* Holographic Verification Badge */}
                            <div className="relative mb-6">
                                <motion.div 
                                    className="absolute inset-0 bg-[#00ff88]/20 rounded-full blur-[20px]" 
                                    animate={{ scale: [1, 1.3, 1] }} 
                                    transition={{ repeat: Infinity, duration: 2 }}
                                />
                                <div className="relative border-2 border-[#00ff88] bg-[#00ff88]/10 text-[#00ff88] p-5 rounded-full shadow-[0_0_25px_rgba(0,255,136,0.3)]">
                                    <ShieldCheck size={44} className="animate-pulse" />
                                </div>
                            </div>

                            <h2 className="font-teko text-5xl text-center uppercase tracking-wider text-[#00ff88] mb-1">
                                AGENT VERIFIED
                            </h2>
                            <p className="font-mono text-center text-xs text-white/50 tracking-widest uppercase mb-6">
                                SECURE GATE ACCESS APPROVED
                            </p>

                            {/* Ticket Details Box */}
                            <div className="w-full border border-white/15 bg-white/[0.02] p-5 rounded backdrop-blur-md relative overflow-hidden">
                                <div className="absolute top-0 right-0 font-mono text-[9px] text-[#00ff88] bg-[#00ff88]/10 border-l border-b border-white/15 px-2 py-0.5">
                                    COMMS SECURE
                                </div>
                                <div className="space-y-4 font-mono text-xs">
                                    <div className="border-b border-white/5 pb-2">
                                        <span className="text-white/40 block text-[9px] tracking-wider uppercase mb-0.5">AGENT NAME</span>
                                        <span className="text-white font-bold text-sm tracking-wide">{ticket?.full_name?.toUpperCase() || 'AGENT'}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-white/40 block text-[9px] tracking-wider uppercase mb-0.5">SEAT / SECTION</span>
                                            <span className="text-[#ff4655] font-bold text-sm">{ticket?.seat_id ? ticket.seat_id.toUpperCase() : 'GENERAL'}</span>
                                        </div>
                                        <div>
                                            <span className="text-white/40 block text-[9px] tracking-wider uppercase mb-0.5">GATE ENTRY</span>
                                            <span className="text-white font-bold text-sm">NORTH ARCHWAY</span>
                                        </div>
                                    </div>
                                    <div className="border-t border-white/5 pt-2 flex justify-between items-center text-[10px] text-white/40">
                                        <span>ASCENT INDEPENDENT SEATING</span>
                                        <span>2026.06.15</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* DYNAMIC COLOR PAYLOAD STATE */}
                    {chargeState === 'charged' && (
                        <motion.div 
                            key="charged"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-sm flex flex-col items-center relative"
                        >
                            <div className="font-mono text-[10px] tracking-widest text-[#ff4655] mb-4 font-bold animate-pulse flex items-center gap-1.5">
                                <span className="w-2 h-2 bg-[#ff4655] rounded-full animate-ping" />
                                ⚡ WARNING: RADIANITE CORE UNSTABLE // DECODING ON
                            </div>

                            {/* Pulse Ring Containment Field */}
                            <div className="relative w-80 h-80 flex items-center justify-center mb-6">
                                
                                {/* Vertical scanning laser sweeping behind the rings */}
                                <motion.div 
                                    className="absolute inset-x-2 h-0.5 bg-[#00ff88]/30 shadow-[0_0_10px_#00ff88] z-0 pointer-events-none"
                                    animate={{ y: [-150, 150] }}
                                    transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                                />

                                {/* Containment brackets */}
                                <div className="absolute inset-0 border border-white/5 rounded-lg pointer-events-none" />
                                <div className="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-[#ff4655]/50" />
                                <div className="absolute -top-1 -right-1 w-3 h-3 border-t border-r border-[#ff4655]/50" />
                                <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b border-l border-[#ff4655]/50" />
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-[#ff4655]/50" />

                                {/* Sci-fi scanning chamber guidelines */}
                                <div className="absolute inset-2 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:100%_10px] opacity-20 pointer-events-none" />

                                {/* Central Venom Blob (lightweight for mobile) */}
                                <div
                                    className="absolute w-20 h-20 flex items-center justify-center z-20"
                                    style={{
                                        transform: `perspective(500px) rotateY(${tilt.x / 1.5}deg) rotateX(${-tilt.y / 1.5}deg)`,
                                        transition: 'transform 0.15s ease-out'
                                    }}
                                >
                                    {/* Central nucleus blob */}
                                    <motion.div
                                        className="absolute w-16 h-16 rounded-full"
                                        style={{
                                            background: 'radial-gradient(circle at 35% 35%, #1a2a3a, #0a0f14)',
                                            boxShadow: `inset 0 0 15px rgba(0,255,255,0.15), 0 0 20px rgba(0,255,255,0.08)`,
                                        }}
                                        animate={{
                                            scaleX: [1, 1.12, 0.92, 1],
                                            scaleY: [1, 0.9, 1.1, 1],
                                            borderRadius: ['50%', '42% 58% 55% 45%', '55% 45% 42% 58%', '50%']
                                        }}
                                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                                    />
                                    {/* Satellite droplet 1 */}
                                    <motion.div
                                        className="absolute w-4 h-4 rounded-full bg-[#0d1a24]"
                                        style={{ boxShadow: 'inset 0 0 6px rgba(0,255,255,0.2)' }}
                                        animate={{
                                            x: [-18, 18, -18],
                                            y: [-14, 10, -14],
                                        }}
                                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                    />
                                    {/* Satellite droplet 2 */}
                                    <motion.div
                                        className="absolute w-3 h-3 rounded-full bg-[#0d1a24]"
                                        style={{ boxShadow: 'inset 0 0 5px rgba(0,255,255,0.15)' }}
                                        animate={{
                                            x: [16, -20, 16],
                                            y: [10, -16, 10],
                                        }}
                                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                                    />
                                </div>

                                {/* Concentric Pulse Rings (SVG overlay) */}
                                <motion.svg
                                    className="absolute z-10 pointer-events-none"
                                    width="320"
                                    height="320"
                                    viewBox="0 0 500 500"
                                    style={{ filter: 'drop-shadow(0 0 6px rgba(0,255,255,0.6))' }}
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
                                        // First ring at r0
                                        rings.push(
                                            <circle
                                                key={0}
                                                cx="250"
                                                cy="250"
                                                r={r}
                                                fill="none"
                                                stroke={RING_COLOR}
                                                strokeWidth={RING_STROKE}
                                                opacity={0.95}
                                                filter="url(#ring-glow-ticket)"
                                            />
                                        );
                                        // 7 more rings, each spaced by the gap value
                                        for (let i = 0; i < 7; i++) {
                                            const gap = colorSequence[i];
                                            const gapSize = GAP_PX[gap] || GAP_PX['M'];
                                            r += gapSize + RING_STROKE;
                                            rings.push(
                                                <circle
                                                    key={i + 1}
                                                    cx="250"
                                                    cy="250"
                                                    r={r}
                                                    fill="none"
                                                    stroke={RING_COLOR}
                                                    strokeWidth={RING_STROKE}
                                                    opacity={0.9 - i * 0.04}
                                                    filter="url(#ring-glow-ticket)"
                                                />
                                            );
                                        }
                                        return rings;
                                    })()}
                                </motion.svg>
                            </div>

                            {/* Ring status details */}
                            <div className="w-[300px] flex justify-between px-1 font-mono text-[9px] text-white/40 mb-3">
                                <span>[ PULSE RING ACTIVE ]</span>
                                <span className="text-[#00ff88] animate-pulse font-bold">STABILITY: SECURE</span>
                                <span>[ GATE_SYS ]</span>
                            </div>

                            {/* Text Code Fallback — displays the sequence as typed characters */}
                            <div className="w-[300px] bg-black/60 border border-white/10 rounded px-3 py-2 mb-5 flex flex-col items-center gap-1">
                                <span className="font-mono text-[8px] text-white/30 tracking-widest uppercase">MANUAL VERIFICATION CODE</span>
                                <div className="flex items-center gap-1 font-mono text-base font-bold tracking-[0.25em]">
                                    {colorSequence.map((gap, idx) => (
                                        <span 
                                            key={idx} 
                                            className="transition-colors duration-300"
                                            style={{ 
                                                color: gap === 'N' ? '#00FFFF' : gap === 'M' ? '#FFFF00' : '#FF8C00',
                                                textShadow: `0 0 8px ${gap === 'N' ? 'rgba(0,255,255,0.5)' : gap === 'M' ? 'rgba(255,255,0,0.5)' : 'rgba(255,140,0,0.5)'}`
                                            }}
                                        >
                                            {gap}
                                        </span>
                                    ))}
                                </div>
                                <span className="font-mono text-[7px] text-white/20">READ THIS CODE TO GATE STAFF IF CAMERA FAILS</span>
                            </div>

                            {/* Decryption status bar */}
                            <div className="w-full max-w-[280px] bg-white/5 border border-white/10 p-4 rounded flex flex-col gap-2 font-mono">
                                <div className="flex justify-between items-center text-[10px]">
                                    <span className="text-white/40">DECRYPTION TIME REMAINING</span>
                                    <span className="text-[#00ff88] font-bold">{expiresIn}s</span>
                                </div>
                                <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
                                    <motion.div 
                                        className="h-full bg-gradient-to-r from-[#00ff88] to-[#00ffff]"
                                        initial={{ width: '100%' }}
                                        animate={{ width: `${(expiresIn / 30) * 100}%` }}
                                        transition={{ duration: 1, ease: 'linear' }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* IDLE / CHARGING STATE */}
                    {(chargeState === 'idle' || chargeState === 'charging') && (
                        <motion.div 
                            key="idle-charging"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center w-full"
                        >
                            {/* Charging ring visuals */}
                            <div className="relative w-68 h-68 flex items-center justify-center mb-8 select-none">
                                
                                {/* Orbit Ring 1 (Slow clockwise) */}
                                <motion.div 
                                    className="absolute inset-0 border border-dashed border-white/5 rounded-full"
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 35, ease: 'linear' }}
                                />

                                {/* Orbit Ring 2 (Fast counter-clockwise) */}
                                <motion.div 
                                    className="absolute inset-4 border border-white/5 rounded-full"
                                    animate={{ rotate: -360 }}
                                    transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
                                />

                                {/* Core Gyroscope Tilt Ring */}
                                <motion.div 
                                    className="absolute inset-8 border border-[#ff4655]/20 rounded-full"
                                    style={{
                                        transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
                                    }}
                                />

                                {/* Converging Particles (Inward spiral during charging) */}
                                {chargeState === 'charging' && (
                                    <div className="absolute inset-0 pointer-events-none">
                                        {[...Array(10)].map((_, i) => {
                                            const angle = (i * Math.PI * 2) / 10;
                                            const radius = 110;
                                            const startX = Math.cos(angle) * radius;
                                            const startY = Math.sin(angle) * radius;
                                            return (
                                                <motion.div
                                                    key={i}
                                                    className="absolute w-1.5 h-1.5 bg-[#ff4655] rounded-full blur-[0.5px]"
                                                    style={{
                                                        left: '50%',
                                                        top: '50%',
                                                        marginLeft: startX - 3,
                                                        marginTop: startY - 3
                                                    }}
                                                    animate={{
                                                        x: [-startX, -startX * 0.1],
                                                        y: [-startY, -startY * 0.1],
                                                        scale: [1, 0.2],
                                                        opacity: [0, 1, 0]
                                                    }}
                                                    transition={{
                                                        duration: 1.2,
                                                        repeat: Infinity,
                                                        delay: i * 0.08,
                                                        ease: 'easeIn'
                                                    }}
                                                />
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Glowing Radianite Core Pulsing Center */}
                                <div 
                                    className="absolute w-52 h-52 flex items-center justify-center pointer-events-none"
                                    style={{
                                        background: chargeState === 'charging' 
                                            ? `radial-gradient(circle, rgba(255,70,85,${0.14 + (chargeProgress / 160)}) 0%, rgba(10,15,20,0) 70%)`
                                            : `radial-gradient(circle, rgba(255,255,255,0.03) 0%, rgba(10,15,20,0) 70%)`
                                    }}
                                >
                                    {/* Liquid Gooey Morphing Dormant/Charging Core */}
                                    <div 
                                        className="w-44 h-44 flex items-center justify-center relative pointer-events-none"
                                        style={{ filter: 'url(#gooey-radianite)' }}
                                    >
                                        {/* Central nucleus */}
                                        <motion.div 
                                            className="w-24 h-24 rounded-full bg-[#0d141b] border border-white/10 flex items-center justify-center relative"
                                            animate={chargeState === 'charging' ? {
                                                scale: [1, 1.08 + (chargeProgress / 380), 0.95, 1.1 + (chargeProgress / 280), 1],
                                                borderColor: ['rgba(255,255,255,0.1)', 'rgba(255,70,85,0.7)', 'rgba(255,255,255,0.1)'],
                                                x: [(Math.random() - 0.5) * (chargeProgress / 10), (Math.random() - 0.5) * (chargeProgress / 10)],
                                                y: [(Math.random() - 0.5) * (chargeProgress / 10), (Math.random() - 0.5) * (chargeProgress / 10)]
                                            } : {
                                                scale: [1, 1.04, 0.96, 1.04, 1]
                                            }}
                                            transition={chargeState === 'charging' ? { 
                                                scale: { repeat: Infinity, duration: 0.22, ease: 'easeInOut' },
                                                borderColor: { repeat: Infinity, duration: 0.22 },
                                                x: { repeat: Infinity, duration: 0.07 },
                                                y: { repeat: Infinity, duration: 0.07 }
                                            } : {
                                                repeat: Infinity,
                                                duration: 3,
                                                ease: 'easeInOut'
                                            }}
                                            style={{
                                                boxShadow: chargeState === 'charging'
                                                    ? `inset 0 0 20px rgba(255,70,85,${0.3 + chargeProgress / 150}), 0 0 35px rgba(255,70,85,${0.15 + chargeProgress / 180})`
                                                    : 'inset 0 0 10px rgba(255,255,255,0.05)',
                                                transform: `translate(${tilt.x * 0.4}px, ${tilt.y * 0.4}px)`
                                            }}
                                        >
                                            {/* Core Icon inside nucleus */}
                                            <Cpu 
                                                className={`relative z-10 transition duration-300 ${
                                                    chargeState === 'charging' ? 'text-[#ff4655] rotate-[45deg] scale-110' : 'text-white/30'
                                                }`} 
                                                size={32} 
                                            />
                                        </motion.div>

                                        {/* Satellite droplet 1 (Gooey-connected) */}
                                        <motion.div
                                            className="absolute w-7 h-7 rounded-full bg-[#ff4655]/80"
                                            animate={{
                                                x: chargeState === 'charging' ? [-45, 45, -45] : [-22, 22, -22],
                                                y: chargeState === 'charging' ? [-30, -50, -30] : [-8, 8, -8],
                                                scale: chargeState === 'charging' ? [0.8, 1.35, 0.8] : [0.9, 1.1, 0.9]
                                            }}
                                            transition={{
                                                duration: chargeState === 'charging' ? 1.4 : 4.5,
                                                repeat: Infinity,
                                                ease: 'easeInOut'
                                            }}
                                        />

                                        {/* Satellite droplet 2 (Gooey-connected) */}
                                        <motion.div
                                            className="absolute w-5 h-5 rounded-full bg-[#ff4655]/65"
                                            animate={{
                                                x: chargeState === 'charging' ? [50, -50, 50] : [24, -24, 24],
                                                y: chargeState === 'charging' ? [30, -15, 30] : [10, -10, 10],
                                                scale: chargeState === 'charging' ? [1.25, 0.7, 1.25] : [1.05, 0.95, 1.05]
                                            }}
                                            transition={{
                                                duration: chargeState === 'charging' ? 1.7 : 5,
                                                repeat: Infinity,
                                                ease: 'easeInOut'
                                            }}
                                        />

                                        {/* Extra satellite droplets active only during charging */}
                                        {chargeState === 'charging' && (
                                            <>
                                                <motion.div
                                                    className="absolute w-4 h-4 rounded-full bg-[#ff4655]/75"
                                                    animate={{
                                                        x: [-15, 15, -15],
                                                        y: [45, -45, 45],
                                                    }}
                                                    transition={{
                                                        duration: 1.1,
                                                        repeat: Infinity,
                                                        ease: 'easeInOut'
                                                    }}
                                                />
                                                <motion.div
                                                    className="absolute w-6 h-6 rounded-full bg-[#ff4655]/55"
                                                    animate={{
                                                        x: [-55, 55, -55],
                                                        y: [10, 35, 10],
                                                    }}
                                                    transition={{
                                                        duration: 1.9,
                                                        repeat: Infinity,
                                                        ease: 'easeInOut'
                                                    }}
                                                />
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Circular progress ring path */}
                                <svg className="absolute w-52 h-52 -rotate-90 pointer-events-none z-10">
                                    <circle 
                                        cx="104" 
                                        cy="104" 
                                        r="98" 
                                        fill="transparent" 
                                        stroke="rgba(255,255,255,0.03)" 
                                        strokeWidth="2"
                                    />
                                    <motion.circle 
                                        cx="104" 
                                        cy="104" 
                                        r="98" 
                                        fill="transparent" 
                                        stroke="#ff4655" 
                                        strokeWidth="3.5"
                                        strokeDasharray="615"
                                        strokeDashoffset={615 - (615 * chargeProgress) / 100}
                                        strokeLinecap="round"
                                        style={{
                                            filter: chargeState === 'charging' ? 'drop-shadow(0 0 8px #ff4655)' : 'none'
                                        }}
                                    />
                                </svg>
                            </div>

                            {/* Charge Button */}
                            <button
                                onPointerDown={handleStartCharge}
                                onPointerUp={handleStopCharge}
                                onPointerLeave={handleStopCharge}
                                onPointerCancel={handleStopCharge}
                                className="w-68 py-4.5 rounded border-2 border-[#ff4655]/50 bg-black/40 text-[#ff4655] font-teko text-2xl uppercase tracking-[0.15em] font-bold transition duration-150 hover:bg-[#ff4655]/10 active:scale-95 shadow-[0_0_20px_rgba(255,70,85,0.15)] flex flex-col items-center select-none touch-none"
                            >
                                <span>{chargeState === 'charging' ? 'HOLDING...' : 'HOLD TO ACTIVATE'}</span>
                                <span className="font-mono text-[9px] tracking-wider normal-case opacity-60 mt-0.5">
                                    {chargeState === 'charging' ? `${Math.round(chargeProgress)}% Charged` : 'REQUIRES SUSTAINED CONTACT'}
                                </span>
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Bottom HUD Details */}
            <footer className="relative z-10 border-t border-white/10 pt-4 flex flex-col items-center">
                <div className="w-full flex justify-between items-center text-[10px] font-mono text-white/40 mb-2">
                    <span>SECTOR: CINNAMON LIFE COLOMBO</span>
                    <span>PROTO: PULSE_RING_STABLE</span>
                </div>
                <div className="font-mono text-[9px] text-white/20 text-center leading-relaxed max-w-xs">
                    This ticket uses dynamic pulse ring patterns that expire automatically to prevent unauthorized replication or screenshots.
                </div>
            </footer>
        </div>
    );
};

export default RadianiteTicket;
