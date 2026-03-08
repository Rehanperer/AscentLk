import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ChevronLeft, Users, User, Phone, CheckCircle2, ChevronRight, AlertCircle, Gamepad2, GraduationCap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ScrambleText from '../ScrambleText';
import SectionReveal from '../Effects/SectionReveal';
import ParallaxBackground from '../Effects/ParallaxBackground';
import { supabase } from '../../lib/supabase';

// Reusing some of the styling logic from existing components for consistency
const InputField = ({ label, name, value, onChange, placeholder, icon: Icon, type = "text", required = false, error = "" }: any) => (
    <div className="relative group mb-6">
        <label className="block text-[#ff4655] font-mono text-sm tracking-widest mb-2 flex justify-between">
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
                className={`w-full bg-[#0a1016]/80 border ${error ? 'border-red-500/50' : 'border-white/10'} text-white pl-12 pr-4 py-4 focus:outline-none focus:border-[#ff4655] transition-all font-inter backdrop-blur-sm rounded-sm`}
                required={required}
            />
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-transparent group-focus-within:border-[#ff4655] transition-colors pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-transparent group-focus-within:border-[#ff4655] transition-colors pointer-events-none" />
        </div>
    </div>
);

const RegistrationPage: React.FC = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        school: '',
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
        const { name, value } = e.target;
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
                setIsSuccess(true);
                window.scrollTo(0, 0);
            }
        };

        submitData();
    };

    const pageVariants = {
        initial: { opacity: 0, x: 20 },
        in: { opacity: 1, x: 0 },
        out: { opacity: 0, x: -20 }
    };

    return (
        <div className="min-h-screen bg-[#000000] relative overflow-hidden font-inter selection:bg-[#ff4655] selection:text-white pb-24">
            {/* Dynamic Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,70,85,0.1)_0%,rgba(0,0,0,0)_60%)]" />
                <div className="bg-grid absolute inset-0 opacity-10" />
                <ParallaxBackground text="REGISTER" velocity={-10} className="top-20 opacity-[0.03]" />
            </div>

            {/* Header/Nav */}
            <div className="relative z-20 pt-8 px-6 md:px-12 flex justify-between items-center max-w-6xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="group flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                >
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-mono tracking-widest text-sm uppercase">Return</span>
                </button>

                <div className="font-teko text-2xl tracking-widest">
                    ASCENT <span className="text-[#ff4655]">//</span> 2026
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-4xl mx-auto pt-12 px-6">
                <SectionReveal>
                    <div className="text-center mb-16">
                        <ScrambleText text="TOURNAMENT REGISTRATION" className="text-[#ff4655] font-bold tracking-widest text-xs md:text-sm mb-4 block" />
                        <h1 className="font-teko text-6xl md:text-8xl font-bold leading-none mb-4 uppercase">
                            Join The Gauntlet
                        </h1>
                        <p className="text-white/60 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
                            Register your school's best 5v5 Valorant team for the ultimate student-led esports tournament in Sri Lanka.
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {!isSuccess ? (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="bg-black/40 backdrop-blur-xl border border-white/10 p-8 md:p-12 relative overflow-hidden rounded-sm"
                            >
                                {/* Decorative Elements */}
                                <div className="absolute top-0 left-0 w-32 h-[1px] bg-gradient-to-r from-[#ff4655] to-transparent" />
                                <div className="absolute bottom-0 right-0 w-32 h-[1px] bg-gradient-to-l from-[#ff4655] to-transparent" />
                                <div className="absolute top-0 left-0 w-[1px] h-32 bg-gradient-to-b from-[#ff4655] to-transparent" />

                                {/* Progress Indicator */}
                                <div className="flex justify-between items-center mb-12 relative">
                                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -z-10 -translate-y-1/2" />
                                    <div
                                        className="absolute top-1/2 left-0 h-[1px] bg-[#ff4655] -z-10 -translate-y-1/2 transition-all duration-500"
                                        style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                                    />

                                    {[
                                        { step: 1, label: "Institution", icon: GraduationCap },
                                        { step: 2, label: "Roster", icon: Users },
                                        { step: 3, label: "Review", icon: Shield }
                                    ].map((s) => (
                                        <div key={s.step} className="flex flex-col items-center gap-2">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${currentStep >= s.step
                                                ? 'bg-[#000000] border-[#ff4655] text-[#ff4655] shadow-[0_0_15px_rgba(255,70,85,0.3)]'
                                                : 'bg-[#000000] border-white/20 text-white/40'
                                                }`}>
                                                <s.icon size={18} />
                                            </div>
                                            <span className={`text-[10px] font-mono tracking-widest uppercase ${currentStep >= s.step ? 'text-white' : 'text-white/40'
                                                }`}>
                                                {s.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <AnimatePresence mode="wait">
                                        {/* STEP 1: Institution Details */}
                                        {currentStep === 1 && (
                                            <motion.div
                                                key="step1"
                                                variants={pageVariants}
                                                initial="initial"
                                                animate="in"
                                                exit="out"
                                                transition={{ duration: 0.3 }}
                                            >
                                                <h2 className="font-teko text-3xl mb-8 tracking-wide border-b border-white/10 pb-4 text-white">INSTITUTION & CONTACTS</h2>

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

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mt-8">
                                                    <div className="md:col-span-2 border-b border-white/5 pb-2 mb-4">
                                                        <span className="font-mono text-xs tracking-widest text-[#ff4655]">IN-GAME LEADER (IGL)</span>
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
                                                        placeholder="+94 7X XXX XXXX"
                                                        required
                                                        error={errors.iglPhone}
                                                    />

                                                    <div className="md:col-span-2 border-b border-white/5 pb-2 mb-4 mt-4">
                                                        <span className="font-mono text-xs tracking-widest text-[#ff4655]">TEACHER IN CHARGE</span>
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
                                                        label="Teacher's Contact Number"
                                                        name="teacherPhone"
                                                        value={formData.teacherPhone}
                                                        onChange={handleInputChange}
                                                        icon={Phone}
                                                        placeholder="+94 7X XXX XXXX"
                                                        required
                                                        error={errors.teacherPhone}
                                                    />
                                                </div>
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
                                                transition={{ duration: 0.3 }}
                                            >
                                                <h2 className="font-teko text-3xl mb-8 tracking-wide border-b border-white/10 pb-4 text-white">MAIN ROSTER</h2>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                                    <div className="md:col-span-2 text-sm text-white/60 mb-4 bg-white/5 p-4 border-l-2 border-[#ff4655]">
                                                        Provide the Full Name and Riot ID for all participating players.
                                                    </div>

                                                    <InputField label="Player 1 (IGL) Full Name" name="player1Name" value={formData.player1Name} onChange={handleInputChange} icon={User} placeholder="Full Name" required error={errors.player1Name} />
                                                    <InputField label="Player 1 (IGL) Riot ID" name="player1RiotId" value={formData.player1RiotId} onChange={handleInputChange} icon={Gamepad2} placeholder="RiotID#Tag" required error={errors.player1RiotId} />

                                                    <div className="md:col-span-2 border-b border-white/5 pb-2 mb-2" />

                                                    <InputField label="Player 2 Full Name" name="player2Name" value={formData.player2Name} onChange={handleInputChange} icon={User} placeholder="Full Name" required error={errors.player2Name} />
                                                    <InputField label="Player 2 Riot ID" name="player2RiotId" value={formData.player2RiotId} onChange={handleInputChange} icon={Gamepad2} placeholder="RiotID#Tag" required error={errors.player2RiotId} />

                                                    <div className="md:col-span-2 border-b border-white/5 pb-2 mb-2" />

                                                    <InputField label="Player 3 Full Name" name="player3Name" value={formData.player3Name} onChange={handleInputChange} icon={User} placeholder="Full Name" required error={errors.player3Name} />
                                                    <InputField label="Player 3 Riot ID" name="player3RiotId" value={formData.player3RiotId} onChange={handleInputChange} icon={Gamepad2} placeholder="RiotID#Tag" required error={errors.player3RiotId} />

                                                    <div className="md:col-span-2 border-b border-white/5 pb-2 mb-2" />

                                                    <InputField label="Player 4 Full Name" name="player4Name" value={formData.player4Name} onChange={handleInputChange} icon={User} placeholder="Full Name" required error={errors.player4Name} />
                                                    <InputField label="Player 4 Riot ID" name="player4RiotId" value={formData.player4RiotId} onChange={handleInputChange} icon={Gamepad2} placeholder="RiotID#Tag" required error={errors.player4RiotId} />

                                                    <div className="md:col-span-2 border-b border-white/5 pb-2 mb-2" />

                                                    <InputField label="Player 5 Full Name" name="player5Name" value={formData.player5Name} onChange={handleInputChange} icon={User} placeholder="Full Name" required error={errors.player5Name} />
                                                    <InputField label="Player 5 Riot ID" name="player5RiotId" value={formData.player5RiotId} onChange={handleInputChange} icon={Gamepad2} placeholder="RiotID#Tag" required error={errors.player5RiotId} />
                                                </div>

                                                <h2 className="font-teko text-3xl mb-8 mt-12 tracking-wide border-b border-white/10 pb-4 text-white">SUBSTITUTES (OPTIONAL)</h2>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                                    <InputField label="Sub 1 Full Name" name="sub1Name" value={formData.sub1Name} onChange={handleInputChange} icon={User} placeholder="Full Name" error={errors.sub1Name} />
                                                    <InputField label="Sub 1 Riot ID" name="sub1RiotId" value={formData.sub1RiotId} onChange={handleInputChange} icon={Gamepad2} placeholder="RiotID#Tag" error={errors.sub1RiotId} />

                                                    <div className="md:col-span-2 border-b border-white/5 pb-2 mb-2" />

                                                    <InputField label="Sub 2 Full Name" name="sub2Name" value={formData.sub2Name} onChange={handleInputChange} icon={User} placeholder="Full Name" error={errors.sub2Name} />
                                                    <InputField label="Sub 2 Riot ID" name="sub2RiotId" value={formData.sub2RiotId} onChange={handleInputChange} icon={Gamepad2} placeholder="RiotID#Tag" error={errors.sub2RiotId} />
                                                </div>
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
                                                transition={{ duration: 0.3 }}
                                            >
                                                <h2 className="font-teko text-3xl mb-8 tracking-wide border-b border-white/10 pb-4 text-white">REVIEW & CONFIRM</h2>

                                                <div className="space-y-8 text-sm">
                                                    {/* Institution Summary */}
                                                    <div className="bg-white/5 border border-white/10 p-6 relative group hover:border-[#ff4655]/50 transition-colors">
                                                        <div className="absolute top-0 right-0 px-3 py-1 bg-[#ff4655] text-xs font-mono font-bold tracking-widest uppercase">Institution</div>
                                                        <div className="mb-4 pt-4">
                                                            <span className="text-white/40 font-mono tracking-widest text-xs uppercase block mb-1">School</span>
                                                            <span className="text-xl font-medium">{formData.school}</span>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <div>
                                                                <span className="text-white/40 font-mono tracking-widest text-xs uppercase block mb-1">IGL Contact</span>
                                                                <span className="block text-white">{formData.iglName}</span>
                                                                <span className="block text-white/80">{formData.iglPhone}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-white/40 font-mono tracking-widest text-xs uppercase block mb-1">Teacher Contact</span>
                                                                <span className="block text-white">{formData.teacherName}</span>
                                                                <span className="block text-white/80">{formData.teacherPhone}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Roster Summary */}
                                                    <div className="bg-white/5 border border-white/10 p-6 relative group hover:border-[#ff4655]/50 transition-colors">
                                                        <div className="absolute top-0 right-0 px-3 py-1 bg-[#ff4655] text-xs font-mono font-bold tracking-widest uppercase">Roster</div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pt-4">
                                                            <div className="flex border-b border-white/5 pb-2">
                                                                <span className="text-white/40 font-mono w-8">01</span>
                                                                <div className="flex-1">
                                                                    <div className="text-white">{formData.player1Name} <span className="text-[#ff4655] text-xs ml-2">(IGL)</span></div>
                                                                    <div className="text-white/60 text-xs font-mono mt-0.5">{formData.player1RiotId}</div>
                                                                </div>
                                                            </div>
                                                            <div className="flex border-b border-white/5 pb-2">
                                                                <span className="text-white/40 font-mono w-8">02</span>
                                                                <div className="flex-1">
                                                                    <div className="text-white">{formData.player2Name}</div>
                                                                    <div className="text-white/60 text-xs font-mono mt-0.5">{formData.player2RiotId}</div>
                                                                </div>
                                                            </div>
                                                            <div className="flex border-b border-white/5 pb-2">
                                                                <span className="text-white/40 font-mono w-8">03</span>
                                                                <div className="flex-1">
                                                                    <div className="text-white">{formData.player3Name}</div>
                                                                    <div className="text-white/60 text-xs font-mono mt-0.5">{formData.player3RiotId}</div>
                                                                </div>
                                                            </div>
                                                            <div className="flex border-b border-white/5 pb-2">
                                                                <span className="text-white/40 font-mono w-8">04</span>
                                                                <div className="flex-1">
                                                                    <div className="text-white">{formData.player4Name}</div>
                                                                    <div className="text-white/60 text-xs font-mono mt-0.5">{formData.player4RiotId}</div>
                                                                </div>
                                                            </div>
                                                            <div className="flex border-b border-white/5 pb-2">
                                                                <span className="text-white/40 font-mono w-8">05</span>
                                                                <div className="flex-1">
                                                                    <div className="text-white">{formData.player5Name}</div>
                                                                    <div className="text-white/60 text-xs font-mono mt-0.5">{formData.player5RiotId}</div>
                                                                </div>
                                                            </div>
                                                            {(formData.sub1Name || formData.sub1RiotId) && (
                                                                <div className="flex border-b border-white/5 pb-2 text-white/60">
                                                                    <span className="font-mono w-8">S1</span>
                                                                    <div className="flex-1">
                                                                        <div className="text-white">{formData.sub1Name}</div>
                                                                        <div className="text-white/60 text-xs font-mono mt-0.5">{formData.sub1RiotId}</div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {(formData.sub2Name || formData.sub2RiotId) && (
                                                                <div className="flex border-b border-white/5 pb-2 text-white/60">
                                                                    <span className="font-mono w-8">S2</span>
                                                                    <div className="flex-1">
                                                                        <div className="text-white">{formData.sub2Name}</div>
                                                                        <div className="text-white/60 text-xs font-mono mt-0.5">{formData.sub2RiotId}</div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start gap-4 p-4 bg-white/5 border border-white/10">
                                                        <AlertCircle className="w-5 h-5 text-[#ff4655] mt-0.5 shrink-0" />
                                                        <p className="text-xs text-white/60 leading-relaxed">
                                                            By submitting this form, you confirm that all provided information is accurate and that the institution's administration is aware of and approves participation in ASCENT 2026. Any discrepancies may result in disqualification.
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Navigation Buttons */}
                                    <div className="mt-12 flex justify-between items-center border-t border-white/10 pt-8">
                                        {currentStep > 1 ? (
                                            <button
                                                type="button"
                                                onClick={handlePrevStep}
                                                className="px-6 py-3 font-mono tracking-widest text-sm text-white/60 hover:text-white transition-colors border border-white/20 hover:border-white/4 rounded-sm flex items-center gap-2 group"
                                                disabled={isSubmitting}
                                            >
                                                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                                BACK
                                            </button>
                                        ) : (<div></div>)}

                                        {currentStep < 3 ? (
                                            <button
                                                type="button"
                                                onClick={handleNextStep}
                                                className="px-8 py-3 bg-white text-black font-teko text-xl tracking-widest hover:bg-[#ff4655] hover:text-white transition-colors flex items-center gap-2 group relative overflow-hidden rounded-sm"
                                            >
                                                <span className="relative z-10 flex items-center gap-2">NEXT <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></span>
                                            </button>
                                        ) : (
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="px-8 py-3 bg-[#ff4655] text-white font-teko text-xl tracking-widest hover:bg-white hover:text-black transition-all flex items-center gap-3 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed rounded-sm"
                                            >
                                                <span className="relative z-10 flex items-center gap-2">
                                                    {isSubmitting ? 'PROCESSING...' : 'CONFIRM REGISTRATION'}
                                                    {!isSubmitting && <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                                                </span>

                                                {/* Button Highlight Effect */}
                                                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 skew-x-12" />
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
                                className="bg-black/40 backdrop-blur-xl border border-[#ff4655]/30 p-12 text-center rounded-sm relative overflow-hidden"
                            >
                                {/* Background Glow */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#ff4655]/20 blur-[100px] rounded-full pointer-events-none" />

                                <div className="relative z-10">
                                    <div className="w-24 h-24 rounded-full border border-[rgba(255,70,85,0.5)] flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(255,70,85,0.2)]">
                                        <CheckCircle2 className="w-12 h-12 text-[#ff4655]" />
                                    </div>
                                    <h2 className="font-teko text-5xl mb-4 text-white uppercase">Registration Received</h2>
                                    <p className="text-white/60 mb-8 max-w-md mx-auto">
                                        Your institution's application for ASCENT 2026 has been successfully submitted. Our team will review your application and contact the Teacher in Charge shortly.
                                    </p>

                                    <div className="inline-block p-[1px] bg-gradient-to-r from-transparent via-[#ff4655] to-transparent">
                                        <div className="bg-black px-8 py-4">
                                            <span className="font-mono text-[#ff4655] tracking-widest text-sm uppercase">Application ID:</span>
                                            <span className="font-mono text-white tracking-widest ml-3">ASC-26-{Math.floor(Math.random() * 9000) + 1000}</span>
                                        </div>
                                    </div>

                                    <div className="mt-12">
                                        <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white font-mono text-sm tracking-widest transition-colors uppercase border-b border-transparent hover:border-white/50 pb-1">
                                            <ChevronLeft className="w-4 h-4" /> Return to HQ
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </SectionReveal>
            </div>
        </div>
    );
};

export default RegistrationPage;
