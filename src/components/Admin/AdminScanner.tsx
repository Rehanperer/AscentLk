import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, ShieldCheck, ShieldAlert, Users, ArrowLeft, RefreshCw, Volume2, VolumeX, Eye } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import SEO from '../SEO';
import ScannerWorker from './scanner.worker?worker';

// Programmatic Web Audio synth for the scanner feedbacks
class ScannerAudio {
    private ctx: AudioContext | null = null;
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

    playLock() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            // Short tech blip
            const osc = this.ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, now); // A5

            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(now + 0.1);
        } catch (e) {}
    }

    playSuccess() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            // Clean ascending dual chimes
            const osc1 = this.ctx.createOscillator();
            const osc2 = this.ctx.createOscillator();
            osc1.type = 'triangle';
            osc2.type = 'sine';

            osc1.frequency.setValueAtTime(523.25, now); // C5
            osc1.frequency.setValueAtTime(659.25, now + 0.1); // E5

            osc2.frequency.setValueAtTime(783.99, now); // G5
            osc2.frequency.setValueAtTime(1046.50, now + 0.1); // C6

            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(this.ctx.destination);

            osc1.start();
            osc2.start();
            osc1.stop(now + 0.4);
            osc2.stop(now + 0.4);
        } catch (e) {}
    }

    playError() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            // Glitchy descending synth growl
            const osc = this.ctx.createOscillator();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(180, now);
            osc.frequency.linearRampToValueAtTime(60, now + 0.25);

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(250, now);

            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.35, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(now + 0.35);
        } catch (e) {}
    }
}

// Pulse Ring gap classification labels
const GAP_LABELS: Record<string, string> = { N: 'NAR', M: 'MED', W: 'WDE' };
const GAP_COLORS: Record<string, string> = { N: '#00FFFF', M: '#FFFF00', W: '#FF8C00' };

interface AdmittedTicket {
    id: string;
    full_name: string;
    seat_id: string | null;
    timestamp: string;
}

const AdminScanner: React.FC = () => {
    const webcamRef = useRef<Webcam>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const synthRef = useRef<ScannerAudio>(new ScannerAudio());

    const [isMuted, setIsMuted] = useState(false);
    const [cameraReady, setCameraReady] = useState(false);
    
    // UI Scanning statuses: 'searching' | 'processing' | 'success' | 'invalid'
    const [scanStatus, setScanStatus] = useState<'searching' | 'processing' | 'success' | 'invalid'>('searching');
    const [verifiedTicket, setVerifiedTicket] = useState<any>(null);
    const [invalidReason, setInvalidReason] = useState('');
    
    // Live sequence variables
    const [detectedSequence, setDetectedSequence] = useState<string[]>(['?', '?', '?', '?', '?', '?', '?']);
    const [recentAdmits, setRecentAdmits] = useState<AdmittedTicket[]>([]);

    // Rolling history for sequence lock (needs 5 identical frames to validate)
    const rollingHistory = useRef<string[][]>([]);
    const processingSequence = useRef<boolean>(false);

    // Sync Mute
    useEffect(() => {
        synthRef.current.isMuted = isMuted;
    }, [isMuted]);

    // Load recent admits from localStorage if available
    useEffect(() => {
        const cached = localStorage.getItem('ascent_recent_admits');
        if (cached) {
            try {
                setRecentAdmits(JSON.parse(cached));
            } catch (e) {}
        }
    }, []);

    // Web Worker Setup
    const workerRef = useRef<Worker | null>(null);
    const workerBusy = useRef(false);

    useEffect(() => {
        workerRef.current = new ScannerWorker();
        workerRef.current.onmessage = (e) => {
            workerBusy.current = false;
            handleWorkerMessage(e.data);
        };
        return () => {
            workerRef.current?.terminate();
        };
    }, []);

    // Frame Analyzer loop
    useEffect(() => {
        let active = true;
        const scanInterval = setInterval(() => {
            if (!active || scanStatus !== 'searching' || !cameraReady || processingSequence.current) return;
            if (workerBusy.current) return; // Don't queue frames while worker is processing
            analyzeFrame();
        }, 60); // ~16 FPS — enough for fast detection without overwhelming the worker

        return () => {
            active = false;
            clearInterval(scanInterval);
        };
    }, [scanStatus, cameraReady]);

    const analyzeFrame = () => {
        const webcam = webcamRef.current;
        const canvas = canvasRef.current;
        if (!webcam || !canvas || !workerRef.current) return;

        const video = webcam.video;
        if (!video || video.readyState !== video.HAVE_ENOUGH_DATA) return;

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        const w = video.videoWidth;
        const h = video.videoHeight;
        if (canvas.width !== w || canvas.height !== h) {
            canvas.width = w;
            canvas.height = h;
        }

        ctx.drawImage(video, 0, 0, w, h);

        // Extract pixel data and transfer the underlying ArrayBuffer to the worker
        // This is the ONLY reliable way to pass pixel data to a Web Worker.
        const imageData = ctx.getImageData(0, 0, w, h);
        const buffer = imageData.data.buffer.slice(0); // Copy the buffer
        workerBusy.current = true;
        workerRef.current.postMessage({ buffer, width: w, height: h }, [buffer]);
    };

    const handleWorkerMessage = (data: any) => {
        if (scanStatus !== 'searching' || processingSequence.current) return;

        const { success, center, decoded, checksumFail, lowConfidence } = data;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const w = canvas.width;
        const h = canvas.height;
        const cx = center?.cx ?? Math.round(w / 2);
        const cy = center?.cy ?? Math.round(h / 2);

        // === DRAW HUD OVERLAY ===

        // Draw crosshair lines through detected center
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx, 0); ctx.lineTo(cx, h);
        ctx.moveTo(0, cy); ctx.lineTo(w, cy);
        ctx.stroke();

        // Draw scanning axes
        const scanLen = Math.min(w, h) / 2 - 10;
        const axes = [
            { dx: 1, dy: 0 }, { dx: -1, dy: 0 }, { dx: 0, dy: 1 }, { dx: 0, dy: -1 },
            { dx: 0.707, dy: 0.707 }, { dx: -0.707, dy: 0.707 }, 
            { dx: 0.707, dy: -0.707 }, { dx: -0.707, dy: -0.707 }
        ];

        ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        for (const axis of axes) {
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + axis.dx * scanLen, cy + axis.dy * scanLen);
            ctx.stroke();
        }

        // Draw center target
        ctx.strokeStyle = success ? '#00ff88' : '#ff4655';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, 8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = success ? '#00ff88' : '#ff4655';
        ctx.beginPath();
        ctx.arc(cx, cy, 3, 0, Math.PI * 2);
        ctx.fill();

        // Corner brackets
        const bracketSize = Math.min(w, h) * 0.35;
        const bx = cx - bracketSize;
        const by = cy - bracketSize;
        const bw = bracketSize * 2;
        const bh = bracketSize * 2;
        
        ctx.strokeStyle = 'rgba(255, 70, 85, 0.35)';
        ctx.lineWidth = 1;
        ctx.strokeRect(bx, by, bw, bh);

        ctx.strokeStyle = '#ff4655';
        ctx.lineWidth = 4;
        const cornerLen = 16;
        ctx.beginPath(); ctx.moveTo(bx + cornerLen, by); ctx.lineTo(bx, by); ctx.lineTo(bx, by + cornerLen); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(bx + bw - cornerLen, by); ctx.lineTo(bx + bw, by); ctx.lineTo(bx + bw, by + cornerLen); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(bx + cornerLen, by + bh); ctx.lineTo(bx, by + bh); ctx.lineTo(bx, by + bh - cornerLen); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(bx + bw - cornerLen, by + bh); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw, by + bh - cornerLen); ctx.stroke();

        // Status text
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'left';
        if (checksumFail) {
            ctx.fillStyle = '#ff4655';
            ctx.fillText('CHECKSUM FAIL', 10, h - 10);
        } else if (lowConfidence) {
            ctx.fillStyle = '#FFFF00';
            ctx.fillText('LOW CONFIDENCE', 10, h - 10);
        } else if (success) {
            ctx.fillStyle = '#00ff88';
            ctx.fillText('LOCKED', 10, h - 10);
        } else {
            ctx.fillStyle = '#00FFFF';
            ctx.fillText('SCANNING...', 10, h - 10);
        }

        if (checksumFail || lowConfidence || !success || !decoded) {
            setDetectedSequence(['?', '?', '?', '?', '?', '?', '?']);
            rollingHistory.current = [];
            return;
        }

        setDetectedSequence(decoded);

        // Draw decoded sequence on canvas
        ctx.fillStyle = '#00FFFF';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(decoded.join(' '), cx, by - 8);

        // Rolling history for lock (3 identical frames)
        rollingHistory.current.push(decoded);
        if (rollingHistory.current.length > 3) {
            rollingHistory.current.shift();
        }

        if (rollingHistory.current.length === 3) {
            const first = rollingHistory.current[0];
            const allMatch = rollingHistory.current.every(seq =>
                seq.every((val, idx) => val === first[idx])
            );

            if (allMatch) {
                triggerVerification(first);
            }
        }
    };

    // --- END WORKER LOGIC ---

    const triggerVerification = async (sequence: string[]) => {
        processingSequence.current = true;
        setScanStatus('processing');
        synthRef.current.playLock();

        console.log('[SCANNER] === VERIFICATION TRIGGERED ===');
        console.log('[SCANNER] Decoded sequence:', JSON.stringify(sequence));
        console.log('[SCANNER] Sequence length:', sequence.length);

        try {
            // Call Supabase RPC validation
            console.log('[SCANNER] Calling supabase.rpc(validate_ticket, { scanned_sequence:', sequence, '})');
            const { data, error } = await supabase.rpc('validate_ticket', { scanned_sequence: sequence });
            
            console.log('[SCANNER] Supabase response - data:', JSON.stringify(data));
            console.log('[SCANNER] Supabase response - error:', JSON.stringify(error));

            if (error) throw error;

            if (data && data.length > 0) {
                // Success!
                console.log('[SCANNER] ✅ MATCH FOUND:', data[0].full_name);
                const matchedTicket = data[0];
                setVerifiedTicket(matchedTicket);
                setScanStatus('success');
                synthRef.current.playSuccess();

                // Save to local admissions history
                const admit: AdmittedTicket = {
                    id: matchedTicket.id,
                    full_name: matchedTicket.full_name,
                    seat_id: matchedTicket.seat_id,
                    timestamp: new Date().toLocaleTimeString()
                };

                setRecentAdmits(prev => {
                    const next = [admit, ...prev.slice(0, 19)]; // keep last 20
                    localStorage.setItem('ascent_recent_admits', JSON.stringify(next));
                    return next;
                });

                // Hard vibration for success
                if ('vibrate' in navigator) {
                    navigator.vibrate(200);
                }

                // Reset back to scan mode after 4 seconds
                setTimeout(() => {
                    resetScanner();
                }, 4000);
            } else {
                // Invalid or Expired Sequence
                console.log('[SCANNER] ❌ NO MATCH - sequence not found or expired');
                setScanStatus('invalid');
                setInvalidReason('PAYLOAD MISMATCH: DYNAMIC SEQUENCE EXPIRED OR TICKET BOOKING REJECTED.');
                synthRef.current.playError();
                
                if ('vibrate' in navigator) {
                    navigator.vibrate([100, 50, 100]);
                }

                setTimeout(() => {
                    resetScanner();
                }, 3500);
            }
        } catch (err) {
            console.error('[SCANNER] ❌ NETWORK/RPC ERROR:', err);
            setScanStatus('invalid');
            setInvalidReason('NETWORK FAULT: CANNOT RETRIEVE REGISTRATION SECURE KEYS.');
            synthRef.current.playError();
            setTimeout(() => {
                resetScanner();
            }, 3500);
        }
    };

    const resetScanner = () => {
        rollingHistory.current = [];
        processingSequence.current = false;
        setScanStatus('searching');
        setVerifiedTicket(null);
        setInvalidReason('');
        setDetectedSequence(['?', '?', '?', '?', '?', '?', '?']);
    };

    // Manual input fallback code
    const handleManualOverride = (sequence: string[]) => {
        if (scanStatus !== 'searching') return;
        triggerVerification(sequence);
    };

    // Clean manual list input helper
    const [manualColors, setManualColors] = useState<string[]>([]);


    return (
        <div className="min-h-screen bg-[#070b0e] text-white flex flex-col justify-between p-6 select-none relative font-sans">
            <SEO 
                title="Radianite Scanner | Admin Panel" 
                description="Secure Radianite ticket sequence decoder scanner app for event gate staff."
                path="/admin/scanner"
            />

            {/* Glowing lines */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-grid opacity-[0.02]" />
            </div>

            {/* HUD Header */}
            <header className="relative z-10 flex justify-between items-center border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                    <Link to="/admin" className="p-2 border border-white/10 rounded hover:bg-white/5 transition duration-150 mr-2">
                        <ArrowLeft size={16} />
                    </Link>
                    <div>
                        <span className="font-mono text-[10px] tracking-[0.2em] text-[#ff4655] uppercase block">
                            ASCENT GATE CONTROLLER
                        </span>
                        <h1 className="font-teko text-2xl uppercase tracking-wider text-white">
                            RADIANITE SECURE SCANNER
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setIsMuted(prev => !prev)}
                        className="p-2 border border-white/10 rounded hover:bg-white/5 transition duration-150"
                        title={isMuted ? "Unmute scanner sounds" : "Mute scanner sounds"}
                    >
                        {isMuted ? <VolumeX size={14} className="text-white/40" /> : <Volume2 size={14} className="text-[#00ff88]" />}
                    </button>
                    <span className="font-mono text-[10px] bg-red-950/20 border border-red-500/20 px-3 py-1.5 text-red-500 rounded uppercase animate-pulse">
                        LIVE GATE ACTIVE
                    </span>
                </div>
            </header>

            {/* Main Interactive Grid */}
            <main className="relative z-10 flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6 py-6">
                
                {/* Left Side: Camera scan feed (7 cols) */}
                <div className="lg:col-span-7 flex flex-col items-center justify-center border border-white/10 bg-white/[0.01] p-4 rounded relative overflow-hidden min-h-[350px]">
                    <AnimatePresence mode="wait">
                        {/* 1. VERIFIED STATE DISPLAY */}
                        {scanStatus === 'success' && verifiedTicket && (
                            <motion.div 
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="absolute inset-0 bg-[#00ff88]/10 flex flex-col items-center justify-center p-6 text-center z-25 backdrop-blur-sm"
                            >
                                <div className="border-2 border-[#00ff88] bg-[#00ff88]/20 text-[#00ff88] p-4 rounded-full shadow-[0_0_30px_rgba(0,255,136,0.3)] mb-4">
                                    <ShieldCheck size={48} className="animate-bounce" />
                                </div>
                                <h2 className="font-teko text-5xl uppercase tracking-wider text-[#00ff88] mb-1">
                                    AGENT VERIFIED
                                </h2>
                                <p className="font-mono text-xs text-white/70 tracking-widest uppercase mb-6">
                                    ACCESS COMPATIBLE // REMOVE SECURITY GATE
                                </p>

                                <div className="w-full max-w-sm bg-black/60 border border-[#00ff88]/30 rounded p-5 font-mono text-xs text-left space-y-3">
                                    <div>
                                        <span className="text-white/40 block text-[9px]">FULL REGISTRATION NAME</span>
                                        <span className="text-[#00ff88] font-bold text-sm tracking-wide">{verifiedTicket.full_name.toUpperCase()}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-white/40 block text-[9px]">SEAT LOCK</span>
                                            <span className="text-white font-bold">{verifiedTicket.seat_id ? verifiedTicket.seat_id.toUpperCase() : 'GENERAL'}</span>
                                        </div>
                                        <div>
                                            <span className="text-white/40 block text-[9px]">INSTITUTION</span>
                                            <span className="text-white">{verifiedTicket.school ? verifiedTicket.school.toUpperCase() : 'INDEPENDENT'}</span>
                                        </div>
                                    </div>
                                    <div className="border-t border-white/10 pt-2 text-[9px] text-white/30 flex justify-between">
                                        <span>STATUS: SCANNED & INVALIDATED</span>
                                        <span>{new Date().toLocaleTimeString()}</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* 2. INVALID STATE DISPLAY */}
                        {scanStatus === 'invalid' && (
                            <motion.div 
                                key="invalid"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="absolute inset-0 bg-red-950/40 flex flex-col items-center justify-center p-6 text-center z-25 backdrop-blur-sm"
                            >
                                <div className="border-2 border-[#ff4655] bg-[#ff4655]/20 text-[#ff4655] p-4 rounded-full shadow-[0_0_30px_rgba(255,70,85,0.3)] mb-4">
                                    <ShieldAlert size={48} className="animate-pulse" />
                                </div>
                                <h2 className="font-teko text-5xl uppercase tracking-wider text-[#ff4655] mb-2">
                                    ACCESS DENIED
                                </h2>
                                <p className="font-mono text-xs text-red-400 font-bold mb-6 tracking-wide max-w-sm">
                                    {invalidReason}
                                </p>
                                <button 
                                    onClick={resetScanner}
                                    className="px-5 py-2.5 border border-white/20 hover:border-white font-mono text-xs uppercase transition duration-150 active:scale-95"
                                >
                                    REFRESH GRID PROTOCOL
                                </button>
                            </motion.div>
                        )}

                        {/* 3. SEARCHING STATE: Live canvas feed with video overlays */}
                        {scanStatus === 'searching' && (
                            <motion.div key="searching" className="w-full h-full flex flex-col items-center justify-center relative">
                                <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    videoConstraints={{
                                        facingMode: 'environment', // Rear camera
                                        width: 1280,
                                        height: 720,
                                        aspectRatio: 1.777777778
                                    }}
                                    onUserMedia={() => setCameraReady(true)}
                                    className="absolute opacity-0 pointer-events-none w-1 h-1"
                                />

                                <canvas 
                                    ref={canvasRef} 
                                    className="w-full h-full object-contain rounded bg-black"
                                />

                                <div className="absolute bottom-4 inset-x-0 text-center font-mono text-[9px] text-[#ff4655] font-bold tracking-widest uppercase pointer-events-none z-10 animate-pulse">
                                    CENTER PULSE RINGS IN CROSSHAIR
                                </div>
                            </motion.div>
                        )}

                        {/* 4. PROCESSING CODE */}
                        {scanStatus === 'processing' && (
                            <motion.div 
                                key="processing"
                                className="absolute inset-0 bg-[#070b0e] flex flex-col items-center justify-center p-6 text-center z-25"
                            >
                                <RefreshCw className="animate-spin text-[#ff4655] w-12 h-12 mb-4" />
                                <h2 className="font-teko text-3xl uppercase tracking-wider text-white mb-1">
                                    VALIDATING PROTOCOL...
                                </h2>
                                <p className="font-mono text-xs text-white/50 tracking-wider">
                                    DECODING PULSE RING PATTERN
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Canvas is now drawn directly in searching state */}
                </div>

                {/* Right Side: Scanning stats and overrides (5 cols) */}
                <div className="lg:col-span-5 flex flex-col justify-between gap-6">
                    
                    {/* Live Payload readout */}
                    <div className="border border-white/10 bg-white/[0.01] p-5 rounded font-mono">
                        <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-4">
                            <span className="text-[10px] text-white/40 uppercase tracking-wider">
                                live radial decoder
                            </span>
                            <span className="text-[9px] text-[#00ff88] flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-ping" />
                                DECODER ONLINE
                            </span>
                        </div>

                        {/* Gap indicator cells */}
                        <div className="grid grid-cols-7 gap-1.5 h-16 mb-4">
                            {detectedSequence.map((gapLabel, idx) => {
                                const isDetected = gapLabel === 'N' || gapLabel === 'M' || gapLabel === 'W';
                                const bgColor = isDetected ? (GAP_COLORS[gapLabel] || '#ffffff') : 'transparent';
                                return (
                                    <div 
                                        key={idx} 
                                        className={`h-full rounded border flex flex-col items-center justify-center text-[8px] font-bold transition duration-150 ${
                                            isDetected ? 'border-white/30' : 'bg-white/5 border-white/10'
                                        }`}
                                        style={isDetected ? { backgroundColor: bgColor + '20', borderColor: bgColor + '60' } : {}}
                                    >
                                        <span 
                                            className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]" 
                                            style={isDetected ? { color: bgColor } : { color: 'rgba(255,255,255,0.3)' }}
                                        >
                                            {isDetected ? (GAP_LABELS[gapLabel] || gapLabel) : '?'}
                                        </span>
                                        <span className="text-[7px] text-white/20 mt-0.5">G{idx + 1}</span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="text-[10px] text-white/50 leading-relaxed mb-1">
                            A stable pattern of 7 gap ratios (N/M/W) across 8 concentric rings is required for verification.
                        </div>
                    </div>

                    {/* Manual entry override (Accessibility fallback UX) */}
                    <div className="border border-white/10 bg-white/[0.01] p-5 rounded font-mono">
                        <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-3">
                            <span className="text-[10px] text-white/40 uppercase tracking-wider">
                                MANUAL OVERRIDE (KEYPAD)
                            </span>
                            {manualColors.length > 0 && (
                                <button 
                                    onClick={() => setManualColors([])}
                                    className="text-[9px] text-[#ff4655] hover:underline"
                                >
                                    RESET KEYPAD
                                </button>
                            )}
                        </div>

                        <div className="text-[10px] text-white/60 mb-3">
                            If camera detection fails, enter 7 gap types (N/M/W) in order:
                        </div>

                        {/* N/M/W Button grid */}
                        <div className="grid grid-cols-3 gap-2 mb-4">
                            {(['N', 'M', 'W'] as const).map(gap => (
                                <button
                                    key={gap}
                                    onClick={() => {
                                        if (manualColors.length < 7) {
                                            const next = [...manualColors, gap];
                                            setManualColors(next);
                                            if (next.length === 7) {
                                                handleManualOverride(next);
                                                setManualColors([]);
                                            }
                                        }
                                    }}
                                    className="h-12 rounded border border-white/10 text-xs uppercase font-bold hover:bg-white/5 active:scale-95 transition flex items-center justify-center gap-2"
                                >
                                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: GAP_COLORS[gap] }} />
                                    <span style={{ color: GAP_COLORS[gap] }}>{GAP_LABELS[gap]}</span>
                                    <span className="text-white/30 text-[9px]">({gap})</span>
                                </button>
                            ))}
                        </div>

                        {/* Input queue display */}
                        <div className="flex justify-between items-center text-[10px] bg-black/40 border border-white/10 p-2.5 rounded">
                            <span className="text-white/40">INPUT QUEUE:</span>
                            <div className="flex gap-1.5">
                                {[0, 1, 2, 3, 4, 5, 6].map(idx => {
                                    const name = manualColors[idx];
                                    const color = name ? GAP_COLORS[name] : null;
                                    return (
                                        <div 
                                            key={idx} 
                                            className="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center bg-white/5 text-[7px] font-bold"
                                            style={color ? { backgroundColor: color + '30', borderColor: color, color: color } : {}}
                                        >
                                            {name || ''}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Recent Admissions list */}
                    <div className="border border-white/10 bg-white/[0.01] p-5 rounded flex-grow font-mono overflow-hidden flex flex-col">
                        <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-3">
                            <span className="text-[10px] text-white/40 uppercase tracking-wider flex items-center gap-1">
                                <Users size={12} /> GATE SESSION TRAFFIC ({recentAdmits.length})
                            </span>
                        </div>

                        <div className="flex-grow overflow-y-auto space-y-2 max-h-[160px] pr-1.5 text-xs text-white/70">
                            {recentAdmits.length === 0 ? (
                                <div className="text-[10px] text-white/30 italic text-center py-4">
                                    No admissions registered in current session.
                                </div>
                            ) : (
                                recentAdmits.map(admit => (
                                    <div 
                                        key={admit.id} 
                                        className="flex justify-between items-center p-2 border border-white/5 bg-black/20 rounded hover:bg-white/[0.02] transition"
                                    >
                                        <div>
                                            <div className="font-bold text-white tracking-wide">{admit.full_name.toUpperCase()}</div>
                                            <div className="text-[9px] text-[#ff4655] font-semibold">SEAT: {admit.seat_id ? admit.seat_id.toUpperCase() : 'GENERAL'}</div>
                                        </div>
                                        <span className="text-[9px] text-white/30 font-bold">{admit.timestamp}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>

            </main>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/10 pt-4 flex justify-between items-center text-[9px] font-mono text-white/30">
                <span>RADIANITE gate scanning system v2.0</span>
                <span>SECURE ENCRYPTED COMMS</span>
            </footer>
        </div>
    );
};

export default AdminScanner;
