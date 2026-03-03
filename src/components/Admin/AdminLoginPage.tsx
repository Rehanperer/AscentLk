import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, ShieldAlert, ArrowLeft, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAudio } from '../../hooks/useAudio';

const ADMIN_USERNAME = 'AscentAdmin';
const ADMIN_PASSWORD = 'ASCENT_7F9E23'; // Randomly generated for this session

const AdminLoginPage: React.FC = () => {
    const { playClick, playHover, playSuccess } = useAudio();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Simulate network delay for HUD feel
        setTimeout(() => {
            if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
                playSuccess();
                localStorage.setItem('admin_session', 'active_' + Date.now());
                navigate('/admin');
            } else {
                setError('ACCESS_DENIED: INVALID_CREDENTIALS');
                setIsLoading(false);
            }
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#000000] text-white flex items-center justify-center p-6 font-inter relative overflow-hidden">
            {/* Background Grid */}
            <div className="fixed inset-0 pointer-events-none opacity-5"
                style={{
                    backgroundImage: 'linear-gradient(#ff4655 1px, transparent 1px), linear-gradient(90deg, #ff4655 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Decorative Brackets */}
            <div className="absolute top-10 left-10 w-20 h-20 border-t-2 border-l-2 border-[#ff4655]/30" />
            <div className="absolute bottom-10 right-10 w-20 h-20 border-b-2 border-r-2 border-[#ff4655]/30" />

            <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-white/50 hover:text-white transition-colors font-mono text-xs tracking-widest">
                <ArrowLeft size={14} /> // RETURN_TO_SURFACE
            </Link>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-white/5 border border-white/10 p-8 clip-path-angled shadow-2xl backdrop-blur-sm">
                    {/* Header */}
                    <header className="mb-10 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#ff4655]/10 border border-[#ff4655]/30 rounded-full mb-6 relative">
                            <Lock size={24} className="text-[#ff4655]" />
                            <motion.div
                                className="absolute inset-0 border-2 border-[#ff4655] rounded-full"
                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </div>
                        <h1 className="font-teko text-5xl leading-none uppercase tracking-tighter">OPERATIONS_AUTH</h1>
                        <p className="font-mono text-[#ff4655] text-[10px] tracking-[0.3em] mt-2">// RESTRICTED_ACCESS_PORTAL_V3.1</p>
                    </header>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative">
                                <label className="block font-mono text-[10px] text-white/40 mb-2 tracking-widest uppercase">Operator_ID</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        onMouseEnter={() => playHover()}
                                        required
                                        className="w-full bg-white/5 border border-white/10 p-4 pl-12 font-mono text-xs text-white focus:border-[#ff4655] outline-none transition-all placeholder:text-white/10"
                                        placeholder="IDENT_REQUIRED..."
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <label className="block font-mono text-[10px] text-white/40 mb-2 tracking-widest uppercase">Secret_Key</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onMouseEnter={() => playHover()}
                                        required
                                        className="w-full bg-white/5 border border-white/10 p-4 pl-12 font-mono text-xs text-white focus:border-[#ff4655] outline-none transition-all placeholder:text-white/10"
                                        placeholder="ENC_KEY_REQUIRED..."
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-3 bg-[#ff4655]/10 border-l-2 border-[#ff4655] p-3"
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
                            className="w-full bg-[#ff4655] hover:bg-white hover:text-black py-4 font-teko text-2xl tracking-widest transition-all clip-path-angled flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    VERIFYING...
                                </>
                            ) : (
                                'INITIATE_SESSION'
                            )}
                        </button>
                    </form>

                    <footer className="mt-8 text-center">
                        <p className="font-mono text-[9px] text-white/20 tracking-widest leading-loose">
                            AUTH_TOKEN_EXPIRES_IN_24H <br />
                            SYSTEM_LOG_ACTIVE // IP_RECORDED
                        </p>
                    </footer>
                </div>
            </motion.div>

            <style>{`
                .clip-path-angled {
                    clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px));
                }
                input:-webkit-autofill,
                input:-webkit-autofill:hover, 
                input:-webkit-autofill:focus {
                    -webkit-text-fill-color: white;
                    -webkit-box-shadow: 0 0 0px 1000px #0a0a0a inset;
                    transition: background-color 5000s ease-in-out 0s;
                }
            `}</style>
        </div>
    );
};

export default AdminLoginPage;
