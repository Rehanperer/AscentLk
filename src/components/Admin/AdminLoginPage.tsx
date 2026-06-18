import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, ShieldAlert, ArrowLeft, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAudio } from '../../hooks/useAudio';
interface AdminLoginPageProps {
    onLogin: (username: string, secret: string) => Promise<void>;
}

const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLogin }) => {
    const { playClick, playHover, playSuccess } = useAudio();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await onLogin(username, password);
            playSuccess();
            navigate('/admin');
        } catch (err: any) {
            console.error('[Admin Login] Error:', err);
            const errMsg = err.message || 'ACCESS_DENIED: AUTH_ERROR';
            setError(errMsg.toUpperCase());
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen text-white flex items-center justify-center p-4 md:p-6 font-inter relative overflow-hidden">
            {/* Cinematic Background — matching registration & admin */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
                style={{ background: `
                    radial-gradient(ellipse 80% 50% at 15% 10%, rgba(100,200,255,0.10) 0%, transparent 60%),
                    radial-gradient(ellipse 60% 40% at 85% 85%, rgba(255,70,85,0.08) 0%, transparent 50%),
                    radial-gradient(ellipse 50% 50% at 50% 0%, rgba(100,200,255,0.05) 0%, transparent 50%),
                    radial-gradient(ellipse 70% 50% at 20% 100%, rgba(100,200,255,0.05) 0%, transparent 50%),
                    radial-gradient(ellipse 60% 60% at 80% 10%, rgba(255,70,85,0.05) 0%, transparent 50%),
                    linear-gradient(180deg, #040814 0%, #08080f 100%)
                `}}
            >
                {/* Geometric Corner Overlays */}
                <svg className="absolute top-4 left-4 w-10 h-10 md:w-14 md:h-14 text-[#64c8ff]/15" viewBox="0 0 100 100">
                    <path d="M0,0 L40,0 L40,2 L2,2 L2,40 L0,40 Z" fill="currentColor" />
                    <circle cx="6" cy="6" r="2" fill="currentColor" />
                </svg>
                <svg className="absolute bottom-4 right-4 w-10 h-10 md:w-14 md:h-14 text-[#ff4655]/15 rotate-180" viewBox="0 0 100 100">
                    <path d="M0,0 L40,0 L40,2 L2,2 L2,40 L0,40 Z" fill="currentColor" />
                    <circle cx="6" cy="6" r="2" fill="currentColor" />
                </svg>
                <svg className="absolute top-4 right-4 w-10 h-10 md:w-14 md:h-14 text-white/5 rotate-90" viewBox="0 0 100 100">
                    <path d="M0,0 L40,0 L40,2 L2,2 L2,40 L0,40 Z" fill="currentColor" />
                </svg>
                <svg className="absolute bottom-4 left-4 w-10 h-10 md:w-14 md:h-14 text-white/5 -rotate-90" viewBox="0 0 100 100">
                    <path d="M0,0 L40,0 L40,2 L2,2 L2,40 L0,40 Z" fill="currentColor" />
                </svg>
            </div>

            <Link to="/" className="absolute top-5 left-5 md:top-8 md:left-8 flex items-center gap-2 text-white/40 hover:text-white transition-colors font-mono text-[10px] md:text-xs tracking-widest z-20">
                <ArrowLeft size={14} /> RETURN
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-[#0c0e1a] border border-white/10 p-6 md:p-8 rounded-sm shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative">
                    {/* Accent line at top */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-[#64c8ff]/50 to-transparent" />
                    
                    {/* Corner brackets */}
                    <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-white/20 pointer-events-none" />
                    <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-white/20 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-white/20 pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-white/20 pointer-events-none" />

                    {/* Header */}
                    <header className="mb-10 text-center">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-[#ff4655]/10 border border-[#ff4655]/30 rounded-full mb-6 relative">
                            <Lock size={22} className="text-[#ff4655]" />
                            <div className="absolute inset-0 border border-[#ff4655]/20 rounded-full scale-125" />
                        </div>
                        <h1 className="font-teko text-3xl md:text-4xl leading-none uppercase tracking-wide">
                            OPERATIONS <span className="text-[#64c8ff]">//</span> AUTH
                        </h1>
                        <p className="font-mono text-[#ff4655] text-[9px] md:text-[10px] tracking-[0.3em] mt-2">RESTRICTED ACCESS PORTAL</p>
                    </header>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative">
                                <label className="block font-mono text-[10px] text-white/40 mb-2 tracking-widest uppercase">Operator ID</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        onMouseEnter={() => playHover()}
                                        required
                                        className="w-full bg-[#040814] border border-white/10 p-4 pl-12 font-mono text-xs text-white focus:border-[#64c8ff] outline-none transition-colors placeholder:text-white/20 rounded-sm"
                                        placeholder="IDENT_REQUIRED..."
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <label className="block font-mono text-[10px] text-white/40 mb-2 tracking-widest uppercase">Secret Key</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onMouseEnter={() => playHover()}
                                        required
                                        className="w-full bg-[#040814] border border-white/10 p-4 pl-12 font-mono text-xs text-white focus:border-[#64c8ff] outline-none transition-colors placeholder:text-white/20 rounded-sm"
                                        placeholder="ENC_KEY_REQUIRED..."
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-3 bg-[#ff4655]/10 border-l-2 border-[#ff4655] p-3 rounded-sm"
                            >
                                <ShieldAlert size={16} className="text-[#ff4655]" />
                                <span className="font-mono text-[10px] text-[#ff4655] font-bold">{error}</span>
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            onMouseEnter={() => playHover()}
                            onClick={() => playClick()}
                            className="w-full bg-[#ff4655] hover:bg-[#ff5a68] py-4 font-teko text-xl tracking-widest transition-colors rounded-sm flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    VERIFYING...
                                </>
                            ) : (
                                'INITIATE SESSION'
                            )}
                        </button>
                    </form>

                    <footer className="mt-8 text-center">
                        <p className="font-mono text-[9px] text-white/15 tracking-widest leading-loose">
                            AUTH TOKEN EXPIRES IN 24H<br />
                            SYSTEM LOG ACTIVE // IP RECORDED
                        </p>
                    </footer>
                </div>
            </motion.div>

            <style>{`
                input:-webkit-autofill,
                input:-webkit-autofill:hover, 
                input:-webkit-autofill:focus {
                    -webkit-text-fill-color: white;
                    -webkit-box-shadow: 0 0 0px 1000px #040814 inset;
                    transition: background-color 5000s ease-in-out 0s;
                }
            `}</style>
        </div>
    );
};

export default AdminLoginPage;
