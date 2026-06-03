import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ChevronLeft, Users, User, Phone, CheckCircle2, ChevronRight, AlertCircle, Gamepad2, GraduationCap, Mail, BookOpen } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ScrambleText from '../ScrambleText';
import { supabase } from '../../lib/supabase';
import SEO from '../SEO';

const InputField = ({ label, name, value, onChange, placeholder, icon: Icon, type = "text", required = false, error = "" }: any) => (
    <div className="relative group mb-6">
        <label className="block text-[#ff4655] font-mono text-xs md:text-sm tracking-widest mb-2 flex justify-between">
            <span>{label} {required && <span className="text-white/50">*</span>}</span>
            {error && <span className="text-red-500 text-xs lowercase">{error}</span>}
        </label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-[#ff4655] transition-colors">
                {Icon && <Icon size={18} />}
            </div>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full bg-white/[0.04] border ${error ? 'border-red-500/50' : 'border-white/10'} text-white pl-12 pr-4 py-4 focus:outline-none focus:border-[#ff4655] focus:bg-white/[0.07] transition-colors duration-200 font-inter rounded-sm`}
                required={required}
            />
            {/* Animated Corner Brackets */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-transparent group-focus-within:border-[#ff4655] transition-colors duration-300 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-transparent group-focus-within:border-[#ff4655] transition-colors duration-300 pointer-events-none" />

        </div>
    </div>
);

const RegistrationPage: React.FC = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        school: '',
        email: '',
        player1Name: '',
        player1RiotId: '',
        player2Name: '',
        player2RiotId: '',
        player3Name: '',
        player3RiotId: '',
        player4Name: '',
        player4RiotId: '',
        player5Name: '',
        player5RiotId: '',
        sub1Name: '',
        sub1RiotId: '',
        sub2Name: '',
        sub2RiotId: '',
        iglName: '',
        iglPhone: '',
        teacherName: '',
        teacherPhone: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let { name, value } = e.target;

        // Force numeric only for phone fields
        if (name === 'iglPhone' || name === 'teacherPhone') {
            value = value.replace(/\D/g, '');
        }

        // Force alphabetic only for name and school fields
        const isNameField = name.includes('Name') || name === 'school';
        if (isNameField) {
            value = value.replace(/[^a-zA-Z\s]/g, '');
        }

        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when typing
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateStep1 = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.school.trim()) newErrors.school = 'Required field';
        if (!formData.email.trim()) {
            newErrors.email = 'Required field';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email address';
        }
        if (!formData.iglName.trim()) newErrors.iglName = 'Required field';
        if (!formData.iglPhone.trim()) newErrors.iglPhone = 'Required field';
        if (!formData.teacherName.trim()) newErrors.teacherName = 'Required field';
        if (!formData.teacherPhone.trim()) newErrors.teacherPhone = 'Required field';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors: Record<string, string> = {};

        for (let i = 1; i <= 5; i++) {
            const nameKey = `player${i}Name` as keyof typeof formData;
            const riotKey = `player${i}RiotId` as keyof typeof formData;
            if (!formData[nameKey].trim()) newErrors[nameKey] = 'Required field';
            if (!formData[riotKey].trim()) {
                newErrors[riotKey] = 'Required field';
            }
        }

        for (let i = 1; i <= 2; i++) {
            const nameKey = `sub${i}Name` as keyof typeof formData;
            const riotKey = `sub${i}RiotId` as keyof typeof formData;
            const hasName = formData[nameKey].trim() !== '';
            const hasRiot = formData[riotKey].trim() !== '';
            if (hasName || hasRiot) {
                if (!hasName) newErrors[nameKey] = 'Required if Riot ID provided';
                if (!hasRiot) newErrors[riotKey] = 'Required if Name provided';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNextStep = () => {
        if (currentStep === 1) {
            if (validateStep1()) {
                setCurrentStep(2);
                window.scrollTo(0, 0);
            }
        } else if (currentStep === 2) {
            if (validateStep2()) {
                setCurrentStep(3);
                window.scrollTo(0, 0);
            }
        }
    };

    const handlePrevStep = () => {
        setCurrentStep(prev => prev - 1);
        window.scrollTo(0, 0);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Final validation just in case
        if (!validateStep1() || !validateStep2()) return;

        setIsSubmitting(true);

        const submitData = async () => {
            const { error } = await supabase.from('tournament_teams').insert([
                {
                    school: formData.school,
                    email: formData.email,
                    player1_name: formData.player1Name,
                    player1_riot_id: formData.player1RiotId,
                    player2_name: formData.player2Name,
                    player2_riot_id: formData.player2RiotId,
                    player3_name: formData.player3Name,
                    player3_riot_id: formData.player3RiotId,
                    player4_name: formData.player4Name,
                    player4_riot_id: formData.player4RiotId,
                    player5_name: formData.player5Name,
                    player5_riot_id: formData.player5RiotId,
                    sub1_name: formData.sub1Name || null,
                    sub1_riot_id: formData.sub1RiotId || null,
                    sub2_name: formData.sub2Name || null,
                    sub2_riot_id: formData.sub2RiotId || null,
                    igl_name: formData.iglName,
                    igl_phone: formData.iglPhone,
                    teacher_name: formData.teacherName,
                    teacher_phone: formData.teacherPhone,
                }
            ]);

            setIsSubmitting(false);

            if (error) {
                console.error('Error submitting registration:', error);
                alert('There was an error saving your registration. Please try again.');
            } else {
                // Construct detailed summary for Worker notification
                const rosterSummary = `
                    Main Roster:
                    1. ${formData.player1Name} (${formData.player1RiotId}) [IGL]
                    2. ${formData.player2Name} (${formData.player2RiotId})
                    3. ${formData.player3Name} (${formData.player3RiotId})
                    4. ${formData.player4Name} (${formData.player4RiotId})
                    5. ${formData.player5Name} (${formData.player5RiotId})
                    ${formData.sub1Name ? `Subs: ${formData.sub1Name} (${formData.sub1RiotId})` : ''}
                    ${formData.sub2Name ? `, ${formData.sub2Name} (${formData.sub2RiotId})` : ''}
                `.trim();

                const emailData = {
                    formType: 'TOURNAMENT REGISTRATION',
                    fullName: formData.iglName,
                    email: formData.email,
                    school: formData.school,
                    role: 'In-Game Leader',
                    message: `Teacher Contact: ${formData.teacherName} (${formData.teacherPhone})\n\n${rosterSummary}`,
                    submittedAt: new Date().toISOString()
                };

                // Trigger Cloudflare Worker Email Notification
                fetch('https://ascent-forms-api.ascent2026s.workers.dev', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(emailData)
                }).catch(err => console.error("Email Worker Error:", err));

                setIsSuccess(true);
                window.scrollTo(0, 0);
            }
        };

        submitData();
    };

    const pageVariants: any = {
        initial: { opacity: 0 },
        in: { opacity: 1, transition: { staggerChildren: 0.1 } },
        out: { opacity: 0, transition: { staggerChildren: 0.05 } }
    };

    const itemVariants: any = {
        initial: { opacity: 0, y: 12 },
        in: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
        out: { opacity: 0, y: -8, transition: { duration: 0.2 } }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="min-h-screen relative overflow-hidden font-inter selection:bg-[#ff4655] selection:text-white pb-24 bg-[#08080a]"
        >
            <SEO 
                title="Register Your Team | ASCENT 2026" 
                description="Register your 5v5 Valorant team for the ASCENT 2026 esports tournament. Join the gauntlet now." 
                path="/register"
            />
            {/* Cinematic Background — all pure CSS, zero JS animation */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
                 style={{ background: `
                    radial-gradient(ellipse 80% 50% at 15% 10%, rgba(100,200,255,0.12) 0%, transparent 60%),
                    radial-gradient(ellipse 60% 40% at 85% 85%, rgba(255,70,85,0.10) 0%, transparent 50%),
                    radial-gradient(ellipse 50% 50% at 50% 0%, rgba(100,200,255,0.06) 0%, transparent 50%),
                    radial-gradient(ellipse 70% 50% at 20% 100%, rgba(100,200,255,0.06) 0%, transparent 50%),
                    radial-gradient(ellipse 60% 60% at 80% 10%, rgba(255,70,85,0.06) 0%, transparent 50%),
                    linear-gradient(180deg, #040814 0%, #08080f 100%)
                 `}}
            >
                {/* Geometric Corner Overlays — lightweight SVG, no blur */}
                <svg className="absolute top-4 left-4 w-12 h-12 md:w-16 md:h-16 text-[#64c8ff]/15" viewBox="0 0 100 100">
                    <path d="M0,0 L40,0 L40,2 L2,2 L2,40 L0,40 Z" fill="currentColor" />
                    <circle cx="6" cy="6" r="2" fill="currentColor" />
                </svg>
                <svg className="absolute bottom-4 right-4 w-12 h-12 md:w-16 md:h-16 text-[#ff4655]/15 rotate-180" viewBox="0 0 100 100">
                    <path d="M0,0 L40,0 L40,2 L2,2 L2,40 L0,40 Z" fill="currentColor" />
                    <circle cx="6" cy="6" r="2" fill="currentColor" />
                </svg>
                <svg className="absolute top-4 right-4 w-12 h-12 md:w-16 md:h-16 text-white/5 rotate-90" viewBox="0 0 100 100">
                    <path d="M0,0 L40,0 L40,2 L2,2 L2,40 L0,40 Z" fill="currentColor" />
                </svg>
                <svg className="absolute bottom-4 left-4 w-12 h-12 md:w-16 md:h-16 text-white/5 -rotate-90" viewBox="0 0 100 100">
                    <path d="M0,0 L40,0 L40,2 L2,2 L2,40 L0,40 Z" fill="currentColor" />
                </svg>
            </div>

            {/* Header/Nav */}
            <header className="relative z-20 pt-8 px-6 md:px-12 flex flex-col md:flex-row justify-between items-start md:items-center max-w-6xl mx-auto gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="group flex items-center gap-2 text-white/50 hover:text-white transition-colors"
                >
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-mono tracking-widest text-sm uppercase">Return</span>
                </button>

                <div className="flex flex-col items-start md:items-end">
                    <div className="font-teko text-3xl tracking-widest leading-none">
                        ASCENT <span className="text-[#ff4655]">//</span> 2026
                    </div>
                    <div className="font-mono text-[9px] tracking-[0.4em] text-[#ff4655] uppercase mt-1">
                        Classified Protocol
                    </div>
                </div>
            </header>
            
            <div className="relative z-20 max-w-6xl mx-auto px-6 md:px-12 mt-4">
                <div className="w-full h-px bg-gradient-to-r from-white/20 via-white/5 to-transparent" />
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-4xl mx-auto pt-8 md:pt-12 px-4 md:px-6">
                <motion.div 
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-center mb-10 md:mb-16"
                >
                    <ScrambleText text="TOURNAMENT REGISTRATION" className="text-[#ff4655] font-mono font-bold tracking-widest text-[10px] md:text-xs mb-4 block" />
                    <h1 className="font-teko text-5xl md:text-8xl font-bold leading-none mb-4 uppercase drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                        Join The Gauntlet
                    </h1>
                    <p className="text-white/50 max-w-xl mx-auto text-sm md:text-base leading-relaxed font-light mb-8">
                        Register your school's best 5v5 Valorant team for the ultimate student-led esports tournament in Sri Lanka.
                    </p>
                    <Link 
                        to="/rulebook" 
                        target="_blank"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-[#ff4655]/10 hover:bg-[#ff4655]/20 border border-[#ff4655]/30 text-[#ff4655] font-teko text-xl tracking-widest uppercase transition-all rounded-sm shadow-[0_0_15px_rgba(255,70,85,0.15)] hover:shadow-[0_0_25px_rgba(255,70,85,0.3)]"
                    >
                        <BookOpen size={20} />
                        Read Official Rulebook
                    </Link>
                </motion.div>

                <AnimatePresence mode="wait">
                    {!isSuccess ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.4 }}
                            className="bg-[#0c0e1a]/90 border border-white/10 p-5 md:p-10 lg:p-12 relative rounded-sm shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
                        >
                            {/* Glassmorphism Tactical Accents */}
                            <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-white/30 pointer-events-none" />
                            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/30 pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-white/30 pointer-events-none" />
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-white/30 pointer-events-none" />
                            
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-[#ff4655]/50 to-transparent" />

                            {/* Tactical Progress Stepper */}
                            <div className="flex justify-between items-start mb-10 md:mb-16 relative px-2 md:px-8 max-w-xl mx-auto">
                                <div className="absolute top-5 md:top-6 left-[15%] w-[70%] h-[1px] bg-white/10 -z-10" />
                                <motion.div
                                    className="absolute top-5 md:top-6 left-[15%] h-[2px] bg-gradient-to-r from-[#64c8ff] to-[#ff4655] -z-10 shadow-[0_0_10px_rgba(100,200,255,0.5)] origin-left"
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: (currentStep - 1) / 2 }}
                                    transition={{ duration: 0.6, ease: "easeInOut" }}
                                    style={{ width: '70%' }}
                                />

                                {[
                                    { step: 1, label: "Institution", icon: GraduationCap },
                                    { step: 2, label: "Roster", icon: Users },
                                    { step: 3, label: "Review", icon: Shield }
                                ].map((s) => {
                                    const isActive = currentStep >= s.step;
                                    const isCurrent = currentStep === s.step;
                                    return (
                                        <div key={s.step} className="flex flex-col items-center gap-3 relative w-16 md:w-20 shrink-0">
                                            {/* Hexagon Outline */}
                                            <div className={`relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center transition-all duration-500 bg-[#040814] rounded-md ${
                                                isActive ? 'text-[#ff4655]' : 'text-white/20'
                                            }`}>
                                                {/* Hexagon shape using borders */}
                                                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-md">
                                                    <polygon 
                                                        points="50 3, 93 25, 93 75, 50 97, 7 75, 7 25" 
                                                        fill={isActive ? 'rgba(100,200,255,0.05)' : 'rgba(255,255,255,0.02)'}
                                                        stroke={isActive ? (isCurrent ? '#64c8ff' : '#ff4655') : 'rgba(255,255,255,0.1)'} 
                                                        strokeWidth="2"
                                                        className="transition-colors duration-500"
                                                    />
                                                </svg>
                                                <s.icon size={16} className={`relative z-10 transition-colors duration-300 ${isActive ? (isCurrent ? 'text-[#64c8ff]' : 'text-[#ff4655]') : 'text-white/40'}`} />
                                                
                                                {/* Pulse ring for current step */}
                                                {isCurrent && (
                                                    <motion.div 
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: [0.5, 0], scale: [1, 1.3] }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                        className="absolute inset-0 pointer-events-none"
                                                    >
                                                        <svg viewBox="0 0 100 100" className="w-full h-full text-[#64c8ff]">
                                                            <polygon points="50 3, 93 25, 93 75, 50 97, 7 75, 7 25" fill="none" stroke="currentColor" strokeWidth="2" />
                                                        </svg>
                                                    </motion.div>
                                                )}
                                            </div>
                                            <span className={`text-[9px] md:text-[10px] font-mono tracking-[0.2em] uppercase transition-colors duration-300 text-center ${
                                                isActive ? 'text-white font-bold' : 'text-white/30'
                                            }`}>
                                                {s.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            <form onSubmit={handleSubmit} className="relative">
                                <AnimatePresence mode="wait">
                                    {/* STEP 1: Institution Details */}
                                    {currentStep === 1 && (
                                        <motion.div
                                            key="step1"
                                            variants={pageVariants}
                                            initial="initial"
                                            animate="in"
                                            exit="out"
                                            className="space-y-4"
                                        >
                                            <motion.h2 variants={itemVariants} className="font-teko text-2xl md:text-3xl mb-6 md:mb-8 tracking-wide text-white flex items-center gap-3 border-b border-white/5 pb-4">
                                                <span className="w-1.5 h-5 bg-[#64c8ff] block"></span>
                                                INSTITUTION & CONTACTS
                                            </motion.h2>

                                            <motion.div variants={itemVariants}>
                                                <InputField
                                                    label="School / Institution Name"
                                                    name="school"
                                                    value={formData.school}
                                                    onChange={handleInputChange}
                                                    icon={GraduationCap}
                                                    placeholder="e.g. Royal College"
                                                    required
                                                    error={errors.school}
                                                />
                                            </motion.div>

                                            <motion.div variants={itemVariants}>
                                                <InputField
                                                    label="School/IGL Contact Email"
                                                    name="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    icon={Mail}
                                                    placeholder="igl@school.edu"
                                                    required
                                                    error={errors.email}
                                                />
                                            </motion.div>

                                            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mt-8">
                                                <div className="md:col-span-2 border-b border-[rgba(255,255,255,0.05)] pb-2 mb-4">
                                                    <span className="font-mono text-[10px] md:text-xs tracking-widest text-[#64c8ff]">IN-GAME LEADER (IGL)</span>
                                                </div>

                                                <InputField
                                                    label="IGL Full Name"
                                                    name="iglName"
                                                    value={formData.iglName}
                                                    onChange={handleInputChange}
                                                    icon={User}
                                                    placeholder="John Doe"
                                                    required
                                                    error={errors.iglName}
                                                />
                                                <InputField
                                                    label="IGL Contact Number"
                                                    name="iglPhone"
                                                    value={formData.iglPhone}
                                                    onChange={handleInputChange}
                                                    icon={Phone}
                                                    type="tel"
                                                    placeholder="07XXXXXXXX"
                                                    required
                                                    error={errors.iglPhone}
                                                />

                                                <div className="md:col-span-2 border-b border-[rgba(255,255,255,0.05)] pb-2 mb-4 mt-6">
                                                    <span className="font-mono text-[10px] md:text-xs tracking-widest text-[#64c8ff]">TEACHER IN CHARGE</span>
                                                </div>

                                                <InputField
                                                    label="Teacher's Full Name"
                                                    name="teacherName"
                                                    value={formData.teacherName}
                                                    onChange={handleInputChange}
                                                    icon={User}
                                                    placeholder="Jane Doe"
                                                    required
                                                    error={errors.teacherName}
                                                />
                                                <InputField
                                                    label="Teacher Contact Number"
                                                    name="teacherPhone"
                                                    value={formData.teacherPhone}
                                                    onChange={handleInputChange}
                                                    icon={Phone}
                                                    type="tel"
                                                    placeholder="07XXXXXXXX"
                                                    required
                                                    error={errors.teacherPhone}
                                                />
                                            </motion.div>
                                        </motion.div>
                                    )}

                                    {/* STEP 2: Player Roster */}
                                    {currentStep === 2 && (
                                        <motion.div
                                            key="step2"
                                            variants={pageVariants}
                                            initial="initial"
                                            animate="in"
                                            exit="out"
                                            className="space-y-4"
                                        >
                                            <motion.h2 variants={itemVariants} className="font-teko text-2xl md:text-3xl mb-6 tracking-wide text-white flex items-center gap-3 border-b border-white/5 pb-4">
                                                <span className="w-1.5 h-5 bg-[#64c8ff] block"></span>
                                                MAIN ROSTER
                                            </motion.h2>

                                            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                                                <div className="md:col-span-2 text-xs md:text-sm text-white/60 mb-6 bg-white/[0.02] border border-white/10 p-4 rounded-sm border-l-2 border-l-[#64c8ff] flex items-start gap-3">
                                                    <AlertCircle size={16} className="text-[#64c8ff] shrink-0 mt-0.5" />
                                                    <p>Provide the Full Name and Riot ID for all participating players. These details will be strictly verified.</p>
                                                </div>

                                                <InputField label="Player 1 (IGL) Name" name="player1Name" value={formData.player1Name} onChange={handleInputChange} icon={User} placeholder="Full Name" required error={errors.player1Name} />
                                                <InputField label="Player 1 (IGL) Riot ID" name="player1RiotId" value={formData.player1RiotId} onChange={handleInputChange} icon={Gamepad2} placeholder="RiotID#Tag" required error={errors.player1RiotId} />

                                                <div className="md:col-span-2 w-full h-[1px] bg-white/5 mb-4 mt-2" />

                                                <InputField label="Player 2 Name" name="player2Name" value={formData.player2Name} onChange={handleInputChange} icon={User} placeholder="Full Name" required error={errors.player2Name} />
                                                <InputField label="Player 2 Riot ID" name="player2RiotId" value={formData.player2RiotId} onChange={handleInputChange} icon={Gamepad2} placeholder="RiotID#Tag" required error={errors.player2RiotId} />

                                                <div className="md:col-span-2 w-full h-[1px] bg-white/5 mb-4 mt-2" />

                                                <InputField label="Player 3 Name" name="player3Name" value={formData.player3Name} onChange={handleInputChange} icon={User} placeholder="Full Name" required error={errors.player3Name} />
                                                <InputField label="Player 3 Riot ID" name="player3RiotId" value={formData.player3RiotId} onChange={handleInputChange} icon={Gamepad2} placeholder="RiotID#Tag" required error={errors.player3RiotId} />

                                                <div className="md:col-span-2 w-full h-[1px] bg-white/5 mb-4 mt-2" />

                                                <InputField label="Player 4 Name" name="player4Name" value={formData.player4Name} onChange={handleInputChange} icon={User} placeholder="Full Name" required error={errors.player4Name} />
                                                <InputField label="Player 4 Riot ID" name="player4RiotId" value={formData.player4RiotId} onChange={handleInputChange} icon={Gamepad2} placeholder="RiotID#Tag" required error={errors.player4RiotId} />

                                                <div className="md:col-span-2 w-full h-[1px] bg-white/5 mb-4 mt-2" />

                                                <InputField label="Player 5 Name" name="player5Name" value={formData.player5Name} onChange={handleInputChange} icon={User} placeholder="Full Name" required error={errors.player5Name} />
                                                <InputField label="Player 5 Riot ID" name="player5RiotId" value={formData.player5RiotId} onChange={handleInputChange} icon={Gamepad2} placeholder="RiotID#Tag" required error={errors.player5RiotId} />
                                            </motion.div>

                                            <motion.h2 variants={itemVariants} className="font-teko text-2xl md:text-3xl mb-6 mt-12 tracking-wide text-white flex items-center gap-3 border-b border-white/5 pb-4">
                                                <span className="w-1.5 h-5 bg-white/30 block"></span>
                                                SUBSTITUTES <span className="text-white/30 text-xl font-sans tracking-normal ml-2">(OPTIONAL)</span>
                                            </motion.h2>
                                            
                                            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                                                <InputField label="Sub 1 Name" name="sub1Name" value={formData.sub1Name} onChange={handleInputChange} icon={User} placeholder="Full Name" error={errors.sub1Name} />
                                                <InputField label="Sub 1 Riot ID" name="sub1RiotId" value={formData.sub1RiotId} onChange={handleInputChange} icon={Gamepad2} placeholder="RiotID#Tag" error={errors.sub1RiotId} />

                                                <div className="md:col-span-2 w-full h-[1px] bg-white/5 mb-4 mt-2" />

                                                <InputField label="Sub 2 Name" name="sub2Name" value={formData.sub2Name} onChange={handleInputChange} icon={User} placeholder="Full Name" error={errors.sub2Name} />
                                                <InputField label="Sub 2 Riot ID" name="sub2RiotId" value={formData.sub2RiotId} onChange={handleInputChange} icon={Gamepad2} placeholder="RiotID#Tag" error={errors.sub2RiotId} />
                                            </motion.div>
                                        </motion.div>
                                    )}

                                    {/* STEP 3: Review */}
                                    {currentStep === 3 && (
                                        <motion.div
                                            key="step3"
                                            variants={pageVariants}
                                            initial="initial"
                                            animate="in"
                                            exit="out"
                                            className="space-y-6"
                                        >
                                            <motion.h2 variants={itemVariants} className="font-teko text-2xl md:text-3xl mb-6 tracking-wide text-white flex items-center gap-3 border-b border-white/5 pb-4">
                                                <span className="w-1.5 h-5 bg-[#ff4655] block"></span>
                                                REVIEW & CONFIRM
                                            </motion.h2>

                                            <div className="space-y-6 text-sm">
                                                {/* Institution Summary */}
                                                <motion.div variants={itemVariants} className="bg-white/[0.02] border border-white/10 p-5 md:p-8 relative group hover:border-[#64c8ff]/30 transition-all rounded-sm">
                                                    <div className="absolute top-0 right-0 px-3 py-1 bg-[#64c8ff]/10 border-b border-l border-[#64c8ff]/30 text-[#64c8ff] text-[10px] font-mono font-bold tracking-[0.2em] uppercase rounded-bl-sm">Institution</div>
                                                    
                                                    <div className="mb-6 pt-2 border-b border-white/5 pb-4">
                                                        <span className="text-white/40 font-mono tracking-widest text-[10px] uppercase block mb-1">School</span>
                                                        <span className="text-lg md:text-xl font-medium text-white">{formData.school}</span>
                                                        <span className="block text-white/50 text-sm mt-1">{formData.email}</span>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div>
                                                            <span className="text-[#64c8ff] font-mono tracking-widest text-[10px] uppercase block mb-1.5">IGL Contact</span>
                                                            <span className="block text-white mb-0.5">{formData.iglName}</span>
                                                            <span className="block text-white/60 font-mono text-xs">{formData.iglPhone}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-[#64c8ff] font-mono tracking-widest text-[10px] uppercase block mb-1.5">Teacher Contact</span>
                                                            <span className="block text-white mb-0.5">{formData.teacherName}</span>
                                                            <span className="block text-white/60 font-mono text-xs">{formData.teacherPhone}</span>
                                                        </div>
                                                    </div>
                                                </motion.div>

                                                {/* Roster Summary */}
                                                <motion.div variants={itemVariants} className="bg-white/[0.02] border border-white/10 p-5 md:p-8 relative group hover:border-[#ff4655]/30 transition-all rounded-sm">
                                                    <div className="absolute top-0 right-0 px-3 py-1 bg-[#ff4655]/10 border-b border-l border-[#ff4655]/30 text-[#ff4655] text-[10px] font-mono font-bold tracking-[0.2em] uppercase rounded-bl-sm">Roster</div>
                                                    
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 pt-4">
                                                        {[
                                                            { id: '01', name: formData.player1Name, riot: formData.player1RiotId, isIgl: true },
                                                            { id: '02', name: formData.player2Name, riot: formData.player2RiotId },
                                                            { id: '03', name: formData.player3Name, riot: formData.player3RiotId },
                                                            { id: '04', name: formData.player4Name, riot: formData.player4RiotId },
                                                            { id: '05', name: formData.player5Name, riot: formData.player5RiotId },
                                                        ].map((p, i) => (
                                                            <div key={i} className="flex border-b border-white/5 pb-3">
                                                                <span className="text-white/20 font-mono w-8 text-xs">{p.id}</span>
                                                                <div className="flex-1">
                                                                    <div className="text-white/90 text-sm">
                                                                        {p.name} 
                                                                        {p.isIgl && <span className="text-[#64c8ff] text-[10px] ml-2 tracking-widest font-mono">[IGL]</span>}
                                                                    </div>
                                                                    <div className="text-white/40 text-xs font-mono mt-1">{p.riot}</div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        
                                                        {formData.sub1Name && (
                                                            <div className="flex border-b border-white/5 pb-3 text-white/60">
                                                                <span className="text-white/30 font-mono w-8 text-xs">S1</span>
                                                                <div className="flex-1">
                                                                    <div className="text-white/70 text-sm">{formData.sub1Name}</div>
                                                                    <div className="text-white/40 text-xs font-mono mt-1">{formData.sub1RiotId}</div>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {formData.sub2Name && (
                                                            <div className="flex border-b border-white/5 pb-3 text-white/60">
                                                                <span className="text-white/30 font-mono w-8 text-xs">S2</span>
                                                                <div className="flex-1">
                                                                    <div className="text-white/70 text-sm">{formData.sub2Name}</div>
                                                                    <div className="text-white/40 text-xs font-mono mt-1">{formData.sub2RiotId}</div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>

                                                <motion.div variants={itemVariants} className="flex items-start gap-4 p-5 bg-[#ff4655]/5 border border-[#ff4655]/20 hover:border-[#ff4655]/50 transition-colors group cursor-pointer rounded-sm" onClick={() => setIsVerified(!isVerified)}>
                                                    <div className={`mt-0.5 w-5 h-5 border-2 shrink-0 flex items-center justify-center transition-all ${isVerified ? 'bg-[#ff4655] border-[#ff4655] shadow-[0_0_10px_rgba(255,70,85,0.4)]' : 'border-white/20 group-hover:border-[#ff4655]/50'}`}>
                                                        {isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                                    </div>
                                                    <p className="text-[11px] md:text-xs text-white/70 leading-relaxed select-none font-mono">
                                                        I CONFIRM THAT ALL PROVIDED INFORMATION IS ACCURATE AND THAT THE INSTITUTION'S ADMINISTRATION IS AWARE OF AND APPROVES PARTICIPATION IN ASCENT 2026. I UNDERSTAND THAT ANY DISCREPANCIES MAY RESULT IN DISQUALIFICATION.
                                                    </p>
                                                </motion.div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Navigation Buttons */}
                                <div className="mt-8 md:mt-12 flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-4 border-t border-white/10 pt-6 md:pt-8 w-full">
                                    {currentStep > 1 ? (
                                        <button
                                            type="button"
                                            onClick={handlePrevStep}
                                            className="px-6 py-3.5 font-mono tracking-[0.2em] text-xs text-white/60 hover:text-white transition-colors bg-white/5 hover:bg-white/10 border border-white/10 rounded-sm flex items-center justify-center gap-2 group w-full sm:w-auto"
                                            disabled={isSubmitting}
                                        >
                                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                            GO BACK
                                        </button>
                                    ) : (<div></div>)}

                                    {currentStep < 3 ? (
                                        <button
                                            type="button"
                                            onClick={handleNextStep}
                                            className="px-8 py-3 bg-white text-[#08080a] font-teko text-xl tracking-[0.1em] hover:bg-white/90 transition-all flex items-center justify-center gap-2 group relative overflow-hidden rounded-sm w-full sm:w-auto shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                                        >
                                            <span className="relative z-10 flex items-center gap-2 font-bold">NEXT STEP <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></span>
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={isSubmitting || !isVerified}
                                            className="px-8 py-3 bg-[#ff4655] text-white font-teko text-xl tracking-[0.1em] hover:bg-[#ff5a68] transition-all flex items-center justify-center gap-3 relative overflow-hidden group disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed rounded-sm w-full sm:w-auto shadow-[0_0_20px_rgba(255,70,85,0.3)] hover:shadow-[0_0_30px_rgba(255,70,85,0.5)]"
                                        >
                                            <span className="relative z-10 flex items-center gap-2 font-bold">
                                                {isSubmitting ? 'ENCRYPTING...' : 'CONFIRM'}
                                                {!isSubmitting && <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                                            </span>

                                            {/* Shimmer Effect */}
                                            <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] group-hover:animate-[shimmer_1.5s_infinite]" />
                                        </button>
                                    )}
                                </div>
                            </form>
                        </motion.div>
                    ) : (
                        /* Success State */
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-[#0c0e1a]/90 border border-[#ff4655]/30 p-8 md:p-16 text-center rounded-sm relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center min-h-[50vh]"
                        >
                            {/* Static success glow — no infinite animation */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-[#ff4655]/20 pointer-events-none" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-[#ff4655]/10 pointer-events-none" />

                            <div className="relative z-10">
                                <div className="w-24 h-24 rounded-full border border-[rgba(255,70,85,0.5)] flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(255,70,85,0.2)] bg-[#08080a]">
                                    <CheckCircle2 className="w-12 h-12 text-[#ff4655]" />
                                </div>
                                <h2 className="font-teko text-4xl md:text-5xl mb-4 text-white uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">Registration Successful</h2>
                                <p className="text-white/60 mb-10 max-w-md mx-auto text-sm">
                                    Your institution's application for ASCENT 2026 has been successfully encrypted and submitted. Our team will verify the details and contact the Teacher in Charge shortly.
                                </p>

                                <div className="inline-block p-px bg-gradient-to-r from-transparent via-[#ff4655]/50 to-transparent mb-12">
                                    <div className="bg-[#08080a] px-6 py-3 md:px-8 md:py-4 flex flex-col md:flex-row items-center gap-2 md:gap-4 rounded-sm border border-white/5">
                                        <span className="font-mono text-[#ff4655] tracking-widest text-[10px] md:text-xs uppercase">Clearance ID:</span>
                                        <span className="font-mono text-white tracking-[0.2em] md:tracking-widest text-sm md:text-base font-bold shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                                            ASC-26-{Math.floor(Math.random() * 9000) + 1000}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white font-mono text-[10px] md:text-sm tracking-widest transition-all uppercase border-b border-white/20 hover:border-[#ff4655] hover:text-[#ff4655] pb-1 group">
                                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Return to Hub
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default RegistrationPage;
