import React, { useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PathSectionConceptA = lazy(() => import('../components/Home/PathSectionConceptA'));
const PathSectionConceptC = lazy(() => import('../components/Home/PathSectionConceptC'));

const ConceptSelectorPage: React.FC = () => {
    const [activeConcept, setActiveConcept] = useState<'A' | 'C'>('A');

    return (
        <div className="min-h-screen bg-[#08080a] relative">
            {/* Fixed Concept Selector HUD */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-1 bg-[#0d121f]/80 backdrop-blur-xl border border-white/10 rounded-sm p-1 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
                {/* Concept A Button */}
                <button
                    onClick={() => setActiveConcept('A')}
                    className={`relative px-5 py-2.5 font-mono text-[10px] md:text-xs tracking-[0.3em] uppercase transition-all duration-300 rounded-sm ${
                        activeConcept === 'A'
                            ? 'text-white bg-[#ff4655]'
                            : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                    }`}
                >
                    {activeConcept === 'A' && (
                        <motion.div
                            layoutId="concept-indicator"
                            className="absolute inset-0 bg-[#ff4655] rounded-sm"
                            transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                        />
                    )}
                    <span className="relative z-10">Concept A</span>
                    <span className="relative z-10 block text-[7px] md:text-[8px] tracking-[0.15em] opacity-70 mt-0.5">
                        Isometric Bracket
                    </span>
                </button>

                {/* Divider */}
                <div className="w-[1px] h-8 bg-white/10 mx-1" />

                {/* Concept C Button */}
                <button
                    onClick={() => setActiveConcept('C')}
                    className={`relative px-5 py-2.5 font-mono text-[10px] md:text-xs tracking-[0.3em] uppercase transition-all duration-300 rounded-sm ${
                        activeConcept === 'C'
                            ? 'text-white bg-[#ff4655]'
                            : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                    }`}
                >
                    {activeConcept === 'C' && (
                        <motion.div
                            layoutId="concept-indicator"
                            className="absolute inset-0 bg-[#ff4655] rounded-sm"
                            transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                        />
                    )}
                    <span className="relative z-10">Concept C</span>
                    <span className="relative z-10 block text-[7px] md:text-[8px] tracking-[0.15em] opacity-70 mt-0.5">
                        Tactical Minimap
                    </span>
                </button>
            </div>

            {/* Active Concept */}
            <Suspense
                fallback={
                    <div className="min-h-screen flex items-center justify-center bg-[#08080a]">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-8 h-8 border-2 border-[#ff4655] border-t-transparent rounded-full animate-spin" />
                            <p className="font-mono text-xs text-white/40 tracking-[0.4em] uppercase">
                                Loading Concept {activeConcept}
                            </p>
                        </div>
                    </div>
                }
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeConcept}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        {activeConcept === 'A' ? <PathSectionConceptA /> : <PathSectionConceptC />}
                    </motion.div>
                </AnimatePresence>
            </Suspense>
        </div>
    );
};

export default ConceptSelectorPage;
