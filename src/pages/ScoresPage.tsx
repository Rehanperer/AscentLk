import React, { useState, useEffect } from 'react';
import { BRACKET_DATA } from '../data/bracket_data';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Crosshair, Target, Activity, Swords, Shield, Clock, Map as MapIcon, Users, ChevronRight, ChevronLeft, Zap, Skull, TrendingUp, Flame, LayoutGrid, Calendar, List } from 'lucide-react';
import ModernNavbar from '../components/Home/ModernNavbar';
import Footer from '../components/Footer';
import CustomCursor from '../components/CustomCursor';

// Extended Mock Data with multiple games and deeper stats
const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

type EventDetails = {
    title: string;
    subtitle: string;
    isHighlight?: boolean;
    highlightColor?: string;
    textColor?: string;
};

type MonthData = {
    monthIndex: number;
    daysInMonth: number;
    startDayOffset: number;
    events: Record<number, EventDetails>;
};

const SCHEDULE_DATA: Record<'October' | 'November', MonthData> = {
    'October': {
        monthIndex: 9,
        daysInMonth: 31,
        startDayOffset: 4,
        events: {
            2: { title: 'DAY 1', subtitle: '2 games' },
            3: { title: 'DAY 2', subtitle: '2 games' },
            4: { title: 'DAY 3', subtitle: '2 games' },
            5: { title: 'DAY 4', subtitle: '2 games' },
            9: { title: 'DAY 5', subtitle: '2 Upper Bracket' },
            10: { title: 'DAY 6', subtitle: '2 Upper Bracket' },
            16: { title: 'DAY 7', subtitle: '2 Lower Bracket' },
            17: { title: 'DAY 8', subtitle: '2 Lower Bracket' },
            23: { title: 'DAY 9', subtitle: '2 Winners Bracket' },
            24: { title: 'DAY 10', subtitle: '2 Losers Bracket' },
            30: { title: 'DAY 11', subtitle: 'Losers Bracket' },
            31: { title: 'DAY 12', subtitle: 'Winners Bracket' },
        }
    },
    'November': {
        monthIndex: 10,
        daysInMonth: 30,
        startDayOffset: 0,
        events: {
            13: { title: 'DAY 13', subtitle: 'REDEMPTION', isHighlight: true, highlightColor: 'from-[#2e2a36] to-[#1e1c24]', textColor: 'text-white' },
            14: { title: 'DAY 14', subtitle: 'GRAND FINALS', isHighlight: true, highlightColor: 'from-[#8e2e59] to-[#4a1c50]', textColor: 'text-white' },
        }
    }
};

type CalendarCell = 
    | { type: 'empty'; id: string }
    | { type: 'day'; day: number; event?: EventDetails; id: string };

type TeamStanding = {
    id: string;
    name: string;
    played: number;
    wins: number;
    losses: number;
    roundsWon: number;
    roundsLost: number;
    points: number;
    color: string;
};

type GroupData = {
    name: string;
    teams: TeamStanding[];
};

const SEEDINGS_DATA = [
    {
        "id": "t1",
        "name": "TEAM PHOENIX",
        "color": "#ff4655"
    },
    {
        "id": "t2",
        "name": "NINJAS",
        "color": "#00ffcc"
    },
    {
        "id": "t3",
        "name": "SHADOWS",
        "color": "#aa00ff"
    },
    {
        "id": "t4",
        "name": "RENEGADES",
        "color": "#ff9900"
    },
    {
        "id": "t5",
        "name": "TEAM TITANS",
        "color": "#ff9900"
    },
    {
        "id": "t6",
        "name": "VIPERS",
        "color": "#00cc44"
    },
    {
        "id": "t7",
        "name": "SPECTERS",
        "color": "#00aaff"
    },
    {
        "id": "t8",
        "name": "ROGUES",
        "color": "#cc0044"
    },
    {
        "id": "t9",
        "name": "TEAM DRAGON",
        "color": "#00ffcc"
    },
    {
        "id": "t10",
        "name": "GHOSTS",
        "color": "#ffffff"
    },
    {
        "id": "t11",
        "name": "PHANTOMS",
        "color": "#aa55ff"
    },
    {
        "id": "t12",
        "name": "MERCENARIES",
        "color": "#ff3333"
    },
    {
        "id": "t13",
        "name": "PRO TEAM",
        "color": "#ff4655"
    },
    {
        "id": "t14",
        "name": "STRIKERS",
        "color": "#ffcc00"
    },
    {
        "id": "t15",
        "name": "SENTINELS",
        "color": "#4444ff"
    },
    {
        "id": "t16",
        "name": "VANGUARD",
        "color": "#888888"
    }
];

const MATCHES = [
    {
        id: "m1",
        status: "FINISHED",
        map: "ASCENT",
        mode: "GRAND FINALS",
        duration: "45:21",
        date: "2026-06-25",
        bgImage: "radial-gradient(circle at 20% 30%, rgba(255, 70, 85, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(0, 255, 204, 0.1) 0%, transparent 50%)",
        teamA: {
            name: "TEAM PHOENIX",
            score: 13,
            color: "#ff4655",
            totalDamage: 18450,
            firstBloods: 11,
            plants: 8,
            headshotPercent: 32,
            players: [
                { name: "NeonStriker", agent: "Jett", acs: 310, k: 24, d: 12, a: 4, kd: "2.00", econ: 65, fb: 4, plants: 1, defuses: 0, hs: 38 },
                { name: "ShadowWalk", agent: "Omen", acs: 245, k: 18, d: 15, a: 12, kd: "1.20", econ: 45, fb: 1, plants: 4, defuses: 1, hs: 29 },
                { name: "IronWall", agent: "Cypher", acs: 210, k: 15, d: 14, a: 6, kd: "1.07", econ: 50, fb: 0, plants: 1, defuses: 3, hs: 34 },
                { name: "FlashBang", agent: "Kayo", acs: 190, k: 12, d: 16, a: 14, kd: "0.75", econ: 35, fb: 2, plants: 0, defuses: 0, hs: 25 },
                { name: "HealMe", agent: "Sage", acs: 150, k: 9, d: 15, a: 8, kd: "0.60", econ: 30, fb: 0, plants: 6, defuses: 1, hs: 21 },
            ]
        },
        teamB: {
            name: "TEAM DRAGON",
            score: 11,
            color: "#00ffcc",
            totalDamage: 17200,
            firstBloods: 13,
            plants: 6,
            headshotPercent: 28,
            players: [
                { name: "AeroDynamics", agent: "Raze", acs: 280, k: 21, d: 17, a: 5, kd: "1.23", econ: 55, fb: 3, plants: 2, defuses: 0, hs: 24 },
                { name: "Visionary", agent: "Sova", acs: 230, k: 16, d: 14, a: 10, kd: "1.14", econ: 48, fb: 1, plants: 1, defuses: 1, hs: 31 },
                { name: "Anchor", agent: "Killjoy", acs: 220, k: 15, d: 14, a: 4, kd: "1.07", econ: 52, fb: 1, plants: 0, defuses: 4, hs: 27 },
                { name: "SmokeScreen", agent: "Brimstone", acs: 180, k: 11, d: 16, a: 11, kd: "0.68", econ: 40, fb: 0, plants: 8, defuses: 0, hs: 25 },
                { name: "Stunner", agent: "Breach", acs: 160, k: 9, d: 17, a: 9, kd: "0.52", econ: 35, fb: 2, plants: 0, defuses: 0, hs: 18 },
            ]
        },
        rounds: [
            "A", "B", "B", "A", "A", "A", "A", "B", "A", "A", "B", "B", // Half 1
            "B", "A", "A", "B", "B", "B", "B", "A", "A", "A", "B", "A"  // Half 2
        ]
    },
    {
        id: "m2",
        status: "FINISHED",
        map: "BIND",
        mode: "SEMI FINALS",
        duration: "38:10",
        date: "2026-06-24",
        bgImage: "radial-gradient(circle at 80% 20%, rgba(220, 160, 50, 0.15) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(150, 50, 250, 0.1) 0%, transparent 50%)",
        teamA: {
            name: "TEAM PHOENIX",
            score: 13,
            color: "#ff4655",
            totalDamage: 16500,
            firstBloods: 14,
            plants: 7,
            headshotPercent: 35,
            players: [
                { name: "NeonStriker", agent: "Raze", acs: 295, k: 22, d: 10, a: 6, kd: "2.20", econ: 70, fb: 5, plants: 2, defuses: 0, hs: 40 },
                { name: "ShadowWalk", agent: "Brimstone", acs: 220, k: 16, d: 12, a: 15, kd: "1.33", econ: 50, fb: 2, plants: 4, defuses: 1, hs: 28 },
                { name: "IronWall", agent: "Cypher", acs: 195, k: 14, d: 11, a: 5, kd: "1.27", econ: 55, fb: 1, plants: 0, defuses: 3, hs: 35 },
                { name: "FlashBang", agent: "Skye", acs: 185, k: 12, d: 14, a: 11, kd: "0.85", econ: 40, fb: 1, plants: 1, defuses: 0, hs: 30 },
                { name: "HealMe", agent: "Viper", acs: 165, k: 10, d: 12, a: 8, kd: "0.83", econ: 45, fb: 0, plants: 3, defuses: 2, hs: 25 },
            ]
        },
        teamB: {
            name: "TEAM TITANS",
            score: 6,
            color: "#ff9900",
            totalDamage: 12000,
            firstBloods: 5,
            plants: 3,
            headshotPercent: 22,
            players: [
                { name: "Juggernaut", agent: "Reyna", acs: 250, k: 18, d: 15, a: 3, kd: "1.20", econ: 48, fb: 2, plants: 0, defuses: 0, hs: 32 },
                { name: "Specter", agent: "Omen", acs: 190, k: 12, d: 14, a: 6, kd: "0.85", econ: 42, fb: 1, plants: 2, defuses: 0, hs: 25 },
                { name: "Fortress", agent: "Killjoy", acs: 175, k: 10, d: 15, a: 4, kd: "0.66", econ: 38, fb: 1, plants: 1, defuses: 1, hs: 20 },
                { name: "Seeker", agent: "Fade", acs: 150, k: 8, d: 16, a: 8, kd: "0.50", econ: 35, fb: 0, plants: 0, defuses: 0, hs: 18 },
                { name: "Breacher", agent: "Breach", acs: 120, k: 6, d: 15, a: 5, kd: "0.40", econ: 30, fb: 0, plants: 0, defuses: 0, hs: 15 },
            ]
        },
        rounds: ["A", "A", "A", "B", "A", "A", "A", "A", "B", "A", "B", "A", "B", "B", "A", "B", "A", "A", "A"]
    },
    {
        id: "m3",
        status: "LIVE",
        map: "SPLIT",
        mode: "SHOWMATCH",
        duration: "22:05",
        date: "LIVE NOW",
        bgImage: "radial-gradient(circle at 50% 50%, rgba(255, 70, 85, 0.1) 0%, transparent 60%), radial-gradient(circle at 10% 10%, rgba(0, 150, 255, 0.1) 0%, transparent 40%)",
        teamA: {
            name: "CONTENT CREATORS",
            score: 7,
            color: "#eec758", // Gold
            totalDamage: 9500,
            firstBloods: 6,
            plants: 3,
            headshotPercent: 20,
            players: [
                { name: "StreamGod", agent: "Reyna", acs: 340, k: 18, d: 9, a: 2, kd: "2.00", econ: 80, fb: 5, plants: 0, defuses: 0, hs: 45 },
                { name: "VloggerX", agent: "Jett", acs: 210, k: 12, d: 11, a: 3, kd: "1.09", econ: 45, fb: 1, plants: 1, defuses: 0, hs: 20 },
                { name: "FunnyGuy", agent: "Omen", acs: 180, k: 9, d: 10, a: 6, kd: "0.90", econ: 40, fb: 0, plants: 2, defuses: 1, hs: 15 },
                { name: "ProGamer", agent: "Killjoy", acs: 150, k: 7, d: 8, a: 4, kd: "0.87", econ: 35, fb: 0, plants: 0, defuses: 2, hs: 18 },
                { name: "HypeMan", agent: "Breach", acs: 110, k: 4, d: 12, a: 8, kd: "0.33", econ: 25, fb: 0, plants: 0, defuses: 0, hs: 10 },
            ]
        },
        teamB: {
            name: "PRO TEAM",
            score: 5,
            color: "#ff4655",
            totalDamage: 8800,
            firstBloods: 6,
            plants: 4,
            headshotPercent: 38,
            players: [
                { name: "AimBot", agent: "Chamber", acs: 290, k: 14, d: 10, a: 2, kd: "1.40", econ: 60, fb: 3, plants: 0, defuses: 0, hs: 55 },
                { name: "Tactics", agent: "Viper", acs: 220, k: 11, d: 9, a: 6, kd: "1.22", econ: 50, fb: 1, plants: 2, defuses: 0, hs: 40 },
                { name: "ClutchKing", agent: "Fade", acs: 190, k: 9, d: 11, a: 5, kd: "0.81", econ: 45, fb: 1, plants: 1, defuses: 1, hs: 35 },
                { name: "SupportMain", agent: "Kayo", acs: 160, k: 8, d: 10, a: 8, kd: "0.80", econ: 40, fb: 1, plants: 0, defuses: 0, hs: 30 },
                { name: "Flex", agent: "Astra", acs: 140, k: 6, d: 10, a: 4, kd: "0.60", econ: 35, fb: 0, plants: 1, defuses: 0, hs: 25 },
            ]
        },
        rounds: ["A", "A", "B", "B", "A", "B", "A", "A", "B", "A", "B", "A"]
    }
];

const BRACKET_MATCHES: any[] = BRACKET_DATA.bracket;

const ScoresPage: React.FC = () => {
    const [mounted, setMounted] = useState(false);
    const [activeTab, setActiveTab] = useState<string>('BRACKET');
    const [bracketView, setBracketView] = useState<'UPPER' | 'LOWER' | 'GRAND_FINAL'>('UPPER');
    const [currentMonth, setCurrentMonth] = useState<'October' | 'November'>('October');
    const [scheduleView, setScheduleView] = useState<'calendar' | 'list'>('calendar');

    useEffect(() => {
        setMounted(true);
        window.scrollTo(0, 0);
    }, []);

    const activeMatch = MATCHES.find(m => m.id === activeTab);

    // Subcomponents
    const renderMatchNode = (match: any) => {
        const isGF = match.round === 'GRAND FINAL';
        if (isGF) return null; // Handled separately now

        let dropText = null;
        if (match.dropMatchId) {
            const dropMatch = BRACKET_MATCHES.find(m => m.id === match.dropMatchId);
            if (dropMatch) {
                dropText = `↳ Loser to ${dropMatch.round}`;
            }
        }
        
        // High-tech stylized clip path (more aggressive slant)
        const clipStyle = { clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)' };
        
        return (
            <div 
                style={clipStyle}
                className="relative flex flex-col bg-[#0a0a0c]/80 backdrop-blur-xl z-10 transition-all duration-300 group w-[260px] border border-white/10 hover:border-[#ff4655]/50 hover:shadow-[0_0_30px_rgba(255,70,85,0.2)] shadow-[0_0_30px_rgba(0,0,0,0.8)] overflow-hidden">
                
                {/* Diagonal Glass Sheen */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent pointer-events-none z-0" />

                {/* Animated Scanning Line (Hover Effect) */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-[#ff4655] opacity-0 group-hover:opacity-100 group-hover:animate-scan z-20 pointer-events-none shadow-[0_0_10px_#ff4655]" />
                
                {/* Subtle Glitch/Grid Background on Hover */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9Im5vbmUiLz48cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJyZ2JhKDI1NSw3MCw4NSwwLjIpIi8+PC9zdmc+')] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0" />

                {/* Header */}
                <div className="px-4 py-1.5 flex justify-between items-center border-b border-white/5 relative z-10 bg-black/60">
                    <span className="font-mono tracking-widest uppercase text-[#ff4655] text-[9px] font-bold">{match.round}</span>
                    <span className="font-mono tracking-widest text-white/30 text-[9px]">{match.date}</span>
                </div>
                
                {/* Teams */}
                <div className="flex flex-col relative z-10">
                    <div className={`flex justify-between items-center px-4 py-3 border-b border-white/5 transition-colors ${
                        match.team1.winner ? 'bg-gradient-to-r from-[#ff4655]/10 to-transparent' : ''
                    }`}>
                        <div className="flex items-center gap-3">
                            <div className={`rounded-sm transition-all duration-300 w-1.5 h-5 ${match.team1.winner ? 'shadow-[0_0_10px_rgba(255,255,255,0.8)]' : ''}`} style={{ backgroundColor: match.team1.color || '#fff' }} />
                            <span className={`font-teko tracking-wide leading-none pt-1 text-2xl ${match.team1.winner ? 'text-white font-bold drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]' : 'text-white/60'}`}>{match.team1.name}</span>
                        </div>
                        <span className={`font-mono text-lg ${match.team1.winner ? 'text-[#ff4655] font-bold drop-shadow-[0_0_5px_rgba(255,70,85,0.8)]' : 'text-white/40'}`}>{match.team1.score ?? '-'}</span>
                    </div>
                    
                    <div className={`flex justify-between items-center px-4 py-3 transition-colors ${
                        match.team2.winner ? 'bg-gradient-to-r from-[#ff4655]/10 to-transparent' : ''
                    }`}>
                        <div className="flex items-center gap-3">
                            <div className={`rounded-sm transition-all duration-300 w-1.5 h-5 ${match.team2.winner ? 'shadow-[0_0_10px_rgba(255,255,255,0.8)]' : ''}`} style={{ backgroundColor: match.team2.color || '#fff' }} />
                            <span className={`font-teko tracking-wide leading-none pt-1 text-2xl ${match.team2.winner ? 'text-white font-bold drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]' : 'text-white/60'}`}>{match.team2.name}</span>
                        </div>
                        <span className={`font-mono text-lg ${match.team2.winner ? 'text-[#ff4655] font-bold drop-shadow-[0_0_5px_rgba(255,70,85,0.8)]' : 'text-white/40'}`}>{match.team2.score ?? '-'}</span>
                    </div>
                </div>

                {/* Drops to Lower Bracket Badge */}
                {dropText && bracketView === 'UPPER' && (
                    <div className="absolute bottom-0 right-0 bg-[#ff4655]/10 border border-[#ff4655]/30 px-3 py-1 text-[#ff4655] text-[8px] font-mono tracking-widest rounded-tl-lg backdrop-blur-md shadow-[0_0_10px_rgba(255,70,85,0.2)]">
                        {dropText}
                    </div>
                )}
            </div>
        );
    };

    const renderGrandFinal = () => {
        const gfMatch = BRACKET_MATCHES.find(m => m.round === 'GRAND FINAL');
        if (!gfMatch) return null;

        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full min-h-[700px] relative flex flex-col md:flex-row overflow-hidden bg-[#0a0a0c]"
            >
                {/* Clean Dark Blue Background */}
                <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#ff4655]/10 via-[#0a0a0c] to-black" />

                {/* Team 1 Side (Left/Top) */}
                <div className="flex-1 relative flex items-center justify-center p-12 overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#ff4655]/20 to-transparent z-0 transition-opacity duration-500 group-hover:opacity-100 opacity-50" />
                    
                    <div className="relative z-10 flex flex-col items-center md:items-end text-center md:text-right w-full md:pr-32 pb-24 md:pb-0">
                        <span className="font-mono text-[#ff4655] tracking-[0.2em] text-sm mb-2 opacity-80">FINALIST 01</span>
                        <h2 className="font-teko text-6xl md:text-9xl text-white font-bold leading-none uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">{gfMatch.team1.name}</h2>
                        {gfMatch.team1.score !== null && (
                            <div className="mt-4 font-mono text-5xl text-white/50">{gfMatch.team1.score}</div>
                        )}
                    </div>
                </div>

                {/* Team 2 Side (Right/Bottom) */}
                <div className="flex-1 relative flex items-center justify-center p-12 overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-bl from-[#3b82f6]/20 to-transparent z-0 transition-opacity duration-500 group-hover:opacity-100 opacity-50" />
                    
                    <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left w-full md:pl-32 pt-24 md:pt-0">
                        <span className="font-mono text-[#3b82f6] tracking-[0.2em] text-sm mb-2 opacity-80">FINALIST 02</span>
                        <h2 className="font-teko text-6xl md:text-9xl text-white font-bold leading-none uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">{gfMatch.team2.name}</h2>
                        {gfMatch.team2.score !== null && (
                            <div className="mt-4 font-mono text-5xl text-white/50">{gfMatch.team2.score}</div>
                        )}
                    </div>
                </div>

                {/* The Divide (Lightning Strike & VS) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none z-20 flex justify-center items-center">
                    {/* SVG Lightning Split */}
                    <svg className="absolute w-full h-full opacity-60" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M50,0 L45,40 L55,45 L48,100 L55,100 L62,45 L52,40 L57,0 Z" fill="#ff4655" filter="drop-shadow(0 0 10px #ff4655)" />
                    </svg>

                    {/* VS Emblem */}
                    <div className="relative w-32 h-32 md:w-48 md:h-48 bg-[#111111] border border-[#ff4655]/50 flex justify-center items-center shadow-[0_0_50px_rgba(255,70,85,0.4)]" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                        <span className="font-teko text-6xl md:text-8xl font-bold text-white tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] italic">VS</span>
                    </div>
                </div>
            </motion.div>
        );
    };

    const renderBracket = () => {
        // Filter matches based on view
        const displayMatches = BRACKET_MATCHES.filter(match => {
            if (bracketView === 'UPPER') {
                return match.y < 2000 && match.round !== 'GRAND FINAL'; // Exclude GF from Upper
            } else if (bracketView === 'LOWER') {
                return match.y >= 2000 && match.round !== 'GRAND FINAL';
            } else {
                return match.round === 'GRAND FINAL';
            }
        });

        // Remap X and Y so Lower Bracket renders nicely centered
        const mappedMatches = displayMatches.map(match => {
            if (bracketView === 'UPPER') {
                return { ...match };
            } else if (bracketView === 'LOWER') {
                return {
                    ...match,
                    x: match.x,
                    y: match.y - 2900
                };
            } else {
                return { ...match };
            }
        });

        return (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full pb-12 pt-4 relative overflow-hidden bg-[#0a0a0c]"
            >
                {/* Sub-navigation for Upper/Lower/Grand Final Bracket */}
                <div className="flex justify-center mb-8 relative z-20 px-4">
                    <div className="flex bg-[#111111]/80 backdrop-blur-xl border border-white/10 p-1.5 shadow-[0_0_30px_rgba(0,0,0,0.8)] overflow-x-auto scrollbar-hide max-w-full" style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}>
                        <button 
                            onClick={() => setBracketView('UPPER')}
                            className={`whitespace-nowrap px-4 md:px-10 py-2 md:py-3 font-teko text-lg md:text-3xl tracking-widest transition-all ${
                                bracketView === 'UPPER' ? 'bg-[#ff4655] text-white shadow-[0_0_15px_rgba(255,70,85,0.6)]' : 'text-white/40 hover:text-white'
                            }`}
                        >
                            UPPER BRACKET
                        </button>
                        <button 
                            onClick={() => setBracketView('LOWER')}
                            className={`whitespace-nowrap px-4 md:px-10 py-2 md:py-3 font-teko text-lg md:text-3xl tracking-widest transition-all ${
                                bracketView === 'LOWER' ? 'bg-[#ff4655] text-white shadow-[0_0_15px_rgba(255,70,85,0.6)]' : 'text-white/40 hover:text-white'
                            }`}
                        >
                            LOWER BRACKET
                        </button>
                        <button 
                            onClick={() => setBracketView('GRAND_FINAL')}
                            className={`whitespace-nowrap px-4 md:px-10 py-2 md:py-3 font-teko text-lg md:text-3xl tracking-widest transition-all ${
                                bracketView === 'GRAND_FINAL' ? 'bg-[#ff4655] text-white shadow-[0_0_15px_rgba(255,70,85,0.6)]' : 'text-white/40 hover:text-white'
                            }`}
                        >
                            GRAND FINAL
                        </button>
                    </div>
                </div>

                {bracketView === 'GRAND_FINAL' ? (
                    renderGrandFinal()
                ) : (
                    <div className="w-full overflow-x-auto scrollbar-hide touch-pan-x cursor-grab active:cursor-grabbing pb-12 relative z-10">
                        {/* Dark Cinematic Background */}
                        <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#ff4655]/5 via-[#0a0a0c] to-black" />
                        
                        <div className={`relative ${bracketView === 'LOWER' ? 'w-[2600px]' : 'w-[1800px]'} h-[1800px] mx-auto p-8`}>
                            
                            {/* Diagonal Connecting Lines */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                                <defs>
                                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="rgba(255,70,85,0.2)" />
                                        <stop offset="100%" stopColor="rgba(255,70,85,0.8)" />
                                    </linearGradient>
                                    <filter id="glow">
                                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                                        <feMerge>
                                            <feMergeNode in="coloredBlur"/>
                                            <feMergeNode in="SourceGraphic"/>
                                        </feMerge>
                                    </filter>
                                </defs>
                                {mappedMatches.map(match => {
                                    const lines = [];
                                    const nodeHeight = 88; // Approx height of new node
                                    const midY = nodeHeight / 2;
                                    
                                    const startX = match.x + 260 + 32;
                                    const startY = match.y + midY + 32;
                                    
                                    if (match.nextMatchId) {
                                        const nextM = mappedMatches.find(m => m.id === match.nextMatchId);
                                        if (nextM) {
                                            const endX = nextM.x + 32;
                                            const endY = nextM.y + midY + 32;
                                            
                                            // Sleek diagonal lines (\___ or ___/)
                                            const midX = startX + 40;
                                            const preEndX = endX - 40;
                                            const pathData = `M ${startX} ${startY} L ${midX} ${startY} L ${preEndX} ${endY} L ${endX} ${endY}`;
                                            const isFinished = match.team1.winner || match.team2.winner;
                                            
                                            lines.push(
                                                <path 
                                                    key={`next-${match.id}`}
                                                    d={pathData} 
                                                    stroke={isFinished ? "url(#lineGrad)" : "rgba(255,255,255,0.1)"} 
                                                    fill="none" 
                                                    strokeWidth={isFinished ? "2" : "1"} 
                                                    strokeLinecap="square"
                                                    strokeLinejoin="miter"
                                                    filter={isFinished ? "url(#glow)" : ""}
                                                />
                                            );
                                        }
                                    }
                                    return lines;
                                })}
                            </svg>

                            {/* Nodes */}
                            {mappedMatches.map(match => (
                                <div 
                                    key={match.id} 
                                    className="absolute"
                                    style={{ left: match.x + 32, top: match.y + 32 }}
                                >
                                    {renderMatchNode(match)}
                                </div>
                            ))}

                        </div>
                    </div>
                )}

                {bracketView !== 'GRAND_FINAL' && (
                    <div className="lg:hidden w-full flex justify-center text-[#ff4655]/60 font-mono text-[10px] tracking-widest items-center gap-4 py-4 mx-auto mt-4 animate-pulse">
                        <ChevronRight className="w-4 h-4 rotate-180" />
                        SWIPE TO PAN
                        <ChevronRight className="w-4 h-4" />
                    </div>
                )}
            </motion.div>
        );
    };

    const renderSchedule = () => {
        // Group matches by date
        const groupedMatches = BRACKET_MATCHES.reduce((acc, match) => {
            if (!acc[match.date]) acc[match.date] = [];
            acc[match.date].push(match);
            return acc;
        }, {} as Record<string, typeof BRACKET_MATCHES>);

        // Sort dates chronologically (assuming they are in format 'OCT 12' or similar)
        // For simplicity, we just use the order from the json.
        const sortedDates = Object.keys(groupedMatches);

        return (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full relative z-10 space-y-12 pb-12"
            >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
                    <div>
                        <h2 className="font-bold text-4xl md:text-5xl tracking-tight text-white mb-2">
                            MATCH SCHEDULE
                        </h2>
                        <div className="inline-block bg-white/10 text-white font-bold text-xs px-4 py-1 rounded-full mt-1 tracking-widest border border-white/10">
                            ALL TIMES LOCAL
                        </div>
                    </div>
                </div>

                <div className="space-y-12">
                    {sortedDates.map((date, idx) => (
                        <div key={date} className="relative">
                            <div className="sticky top-20 z-20 flex items-center gap-4 mb-6 backdrop-blur-md py-4 bg-black/40 -mx-4 px-4 border-y border-white/5">
                                <h3 className="font-teko text-3xl text-[#ff4655] tracking-widest drop-shadow-[0_0_8px_rgba(255,70,85,0.5)]">{date}</h3>
                                <div className="h-[1px] flex-1 bg-gradient-to-r from-[#ff4655]/50 to-transparent" />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {groupedMatches[date].map((match: any) => (
                                    <div key={match.id} className="bg-white/[0.02] border border-white/5 hover:border-[#ff4655]/30 transition-all duration-300 rounded-xl overflow-hidden backdrop-blur-sm group">
                                        <div className="px-5 py-3 border-b border-white/5 bg-black/20 flex justify-between items-center">
                                            <span className="text-white/40 font-mono text-[10px] tracking-widest uppercase">{match.round}</span>
                                            {match.team1.winner || match.team2.winner ? (
                                                <span className="text-[#ff4655]/80 font-mono text-[10px] tracking-widest border border-[#ff4655]/20 px-2 py-0.5 rounded-sm">COMPLETED</span>
                                            ) : (
                                                <span className="text-white/60 font-mono text-[10px] tracking-widest border border-white/10 px-2 py-0.5 rounded-sm">UPCOMING</span>
                                            )}
                                        </div>
                                        <div className="p-5 space-y-4">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-1.5 h-6 rounded-sm shadow-lg" style={{ backgroundColor: match.team1.color }} />
                                                    <span className={`font-teko text-2xl tracking-wide pt-1 ${match.team1.winner ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'text-white/70'}`}>{match.team1.name}</span>
                                                </div>
                                                <span className={`font-mono text-xl font-bold ${match.team1.winner ? 'text-[#ff4655]' : 'text-white/50'}`}>{match.team1.score ?? '-'}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-1.5 h-6 rounded-sm shadow-lg" style={{ backgroundColor: match.team2.color }} />
                                                    <span className={`font-teko text-2xl tracking-wide pt-1 ${match.team2.winner ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'text-white/70'}`}>{match.team2.name}</span>
                                                </div>
                                                <span className={`font-mono text-xl font-bold ${match.team2.winner ? 'text-[#ff4655]' : 'text-white/50'}`}>{match.team2.score ?? '-'}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        );
    };

    const renderStandings = () => {
        return (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full relative z-10 space-y-8 pb-12"
            >
                <div className="flex flex-col md:flex-row justify-between items-start md:flex-end mb-4 gap-6">
                    <div>
                        <h2 className="font-bold text-4xl md:text-5xl tracking-tight text-white mb-2">
                            GLOBAL RANKINGS
                        </h2>
                        <div className="inline-block bg-[#ff4655] text-white font-bold text-xs px-4 py-1 rounded-full mt-1 tracking-widest">
                            TOP 16 SEEDING
                        </div>
                    </div>
                </div>

                <div className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden backdrop-blur-md">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead>
                                <tr className="text-white/40 font-mono text-[10px] uppercase tracking-wider border-b border-white/5 bg-black/40">
                                    <th className="px-6 py-4 font-medium">Rank</th>
                                    <th className="px-6 py-4 font-medium">Team</th>
                                    <th className="px-6 py-4 font-medium text-right text-[#ff4655]">Seed Points</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {SEEDINGS_DATA.map((team, index) => (
                                    <tr key={team.id} className="transition-colors hover:bg-white/5">
                                        <td className="px-6 py-4 font-mono text-white/50">
                                            #{index + 1}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-3 h-3 rounded-sm shadow-lg" style={{ backgroundColor: team.color }} />
                                                <span className="font-bold text-white tracking-wide text-lg font-teko">
                                                    {team.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono font-bold text-[#ff4655]">
                                            {100 - index * 5} 
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>
        );
    };

const renderRoundTimeline = () => {
        if (!activeMatch) return null;
        return (
            <div className="w-full bg-[#0c0e1a]/80 border border-white/5 p-6 rounded-md mb-8">
                <h4 className="font-teko text-2xl text-white/80 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#ff4655]" />
                    Round Timeline
                </h4>
                <div className="flex w-full gap-1 items-end h-16">
                    {activeMatch.rounds.map((winner, idx) => {
                        const isA = winner === "A";
                        const color = isA ? activeMatch.teamA.color : activeMatch.teamB.color;
                        return (
                            <motion.div 
                                key={idx}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "100%", opacity: 1 }}
                                transition={{ delay: idx * 0.05, duration: 0.3 }}
                                className="flex-1 rounded-t-sm relative group cursor-pointer"
                                style={{ backgroundColor: `${color}80` }}
                            >
                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black border border-white/10 px-2 py-1 text-xs font-mono text-white rounded pointer-events-none z-10 whitespace-nowrap">
                                    Round {idx + 1}: {isA ? activeMatch.teamA.name : activeMatch.teamB.name}
                                </div>
                                <div className="absolute bottom-0 left-0 w-full h-1" style={{ backgroundColor: color }} />
                            </motion.div>
                        );
                    })}
                </div>
                <div className="flex justify-between mt-2 font-mono text-[10px] text-white/40">
                    <span>R1</span>
                    <span>HALF</span>
                    <span>R{activeMatch.rounds.length}</span>
                </div>
            </div>
        );
    };

    const renderTeamStatsComparison = () => {
        if (!activeMatch) return null;
        const stats = [
            { label: "TOTAL DAMAGE", valA: activeMatch.teamA.totalDamage, valB: activeMatch.teamB.totalDamage },
            { label: "FIRST BLOODS", valA: activeMatch.teamA.firstBloods, valB: activeMatch.teamB.firstBloods },
            { label: "PLANTS", valA: activeMatch.teamA.plants, valB: activeMatch.teamB.plants },
            { label: "HEADSHOT %", valA: activeMatch.teamA.headshotPercent + '%', valB: activeMatch.teamB.headshotPercent + '%' },
        ];

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                {stats.map((stat, idx) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + (idx * 0.1) }}
                        key={idx} 
                        className="bg-[#0c0e1a]/60 border border-white/5 p-4 rounded-sm relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        <h5 className="font-mono text-[10px] text-white/40 tracking-[0.2em] uppercase mb-3 text-center">{stat.label}</h5>
                        <div className="flex justify-between items-center font-teko text-3xl">
                            <span style={{ color: activeMatch.teamA.color }}>{stat.valA}</span>
                            <div className="w-[1px] h-6 bg-white/10" />
                            <span style={{ color: activeMatch.teamB.color }}>{stat.valB}</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        );
    };

    const renderTeamTable = (team: typeof MATCHES[0]['teamA'], isWinner: boolean) => (
        <div className="w-full relative overflow-hidden mb-12 bg-[#0c0e1a]/40 border border-white/10 backdrop-blur-xl rounded-lg group">
            <div 
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 blur-[80px] opacity-20 pointer-events-none transition-opacity group-hover:opacity-40"
                style={{ backgroundColor: team.color }}
            />
            
            <div className="w-full h-full p-4 md:p-8 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 pb-6 border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <div 
                            className="w-16 h-16 flex items-center justify-center rounded-xl rotate-3"
                            style={{ backgroundColor: `${team.color}15`, border: `1px solid ${team.color}40`, boxShadow: `0 0 30px ${team.color}20` }}
                        >
                            {isWinner ? <Trophy className="w-8 h-8" style={{ color: team.color }} /> : <Shield className="w-8 h-8" style={{ color: team.color }} />}
                        </div>
                        <div>
                            <h3 className="font-teko text-4xl md:text-5xl tracking-wide m-0 leading-none" style={{ color: team.color, textShadow: `0 0 20px ${team.color}60` }}>
                                {team.name}
                            </h3>
                            <p className="font-mono text-[11px] text-white/50 tracking-[0.3em] uppercase mt-1">
                                {isWinner ? 'VICTORY' : 'DEFEAT'} // {team.score} ROUNDS
                            </p>
                        </div>
                    </div>
                    
                    <div className="font-teko text-7xl md:text-8xl font-bold tracking-tighter drop-shadow-2xl" style={{ color: team.color }}>
                        {team.score}
                    </div>
                </div>

                {/* Desktop Table */}
                <div className="hidden lg:block overflow-x-auto w-full">
                    <table className="w-full text-left font-mono text-sm border-collapse">
                        <thead>
                            <tr className="text-white/30 border-b border-white/5 uppercase tracking-[0.15em] text-[10px]">
                                <th className="pb-4 pl-4 font-semibold">Player</th>
                                <th className="pb-4 font-semibold">Agent</th>
                                <th className="pb-4 text-center font-semibold">ACS</th>
                                <th className="pb-4 text-center font-semibold">K</th>
                                <th className="pb-4 text-center font-semibold">D</th>
                                <th className="pb-4 text-center font-semibold">A</th>
                                <th className="pb-4 text-center font-semibold">HS%</th>
                                <th className="pb-4 text-center font-semibold">K/D</th>
                                <th className="pb-4 text-center font-semibold hidden xl:table-cell">ECON</th>
                                <th className="pb-4 text-center font-semibold hidden xl:table-cell">FB</th>
                            </tr>
                        </thead>
                        <tbody>
                            {team.players.map((player, idx) => (
                                <motion.tr 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 * idx }}
                                    key={idx} 
                                    className="border-b border-white/5 hover:bg-white-[0.02] transition-colors relative"
                                >
                                    <td className="py-5 pl-4 font-bold text-white tracking-wider flex items-center gap-3">
                                        {idx === 0 && <Flame className="w-4 h-4 text-[#ff4655] animate-pulse" />}
                                        <span className="text-base">{player.name}</span>
                                    </td>
                                    <td className="py-5 text-white/60">{player.agent}</td>
                                    <td className="py-5 text-center text-white font-bold text-lg">{player.acs}</td>
                                    <td className="py-5 text-center text-emerald-400 font-medium">{player.k}</td>
                                    <td className="py-5 text-center text-rose-400 font-medium">{player.d}</td>
                                    <td className="py-5 text-center text-white/70">{player.a}</td>
                                    <td className="py-5 text-center text-white/70">{player.hs}%</td>
                                    <td className="py-5 text-center text-white/90">{player.kd}</td>
                                    <td className="py-5 text-center text-white/40 hidden xl:table-cell">{player.econ}</td>
                                    <td className="py-5 text-center text-white/40 hidden xl:table-cell">{player.fb}</td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
                    {team.players.map((player, idx) => (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 * idx }}
                            key={idx} 
                            className="bg-black/20 border border-white/5 p-5 rounded-lg flex flex-col gap-4 shadow-xl relative overflow-hidden"
                        >
                            {idx === 0 && (
                                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#ff4655] to-transparent opacity-20 pointer-events-none" />
                            )}
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="font-mono text-[10px] text-white/40 tracking-widest uppercase block mb-1">{player.agent}</span>
                                    <span className="font-mono text-lg font-bold text-white tracking-wide flex items-center gap-2">
                                        {idx === 0 && <Flame className="w-4 h-4 text-[#ff4655]" />}
                                        {player.name}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="font-mono text-[9px] text-white/40 tracking-[0.2em] uppercase block">ACS</span>
                                    <span className="font-teko text-3xl leading-none text-white">{player.acs}</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-5 gap-1 text-center font-mono mt-2">
                                <div className="flex flex-col bg-white/5 py-2 rounded-md">
                                    <span className="text-[9px] text-white/30 mb-1">K</span>
                                    <span className="text-emerald-400 font-bold">{player.k}</span>
                                </div>
                                <div className="flex flex-col bg-white/5 py-2 rounded-md">
                                    <span className="text-[9px] text-white/30 mb-1">D</span>
                                    <span className="text-rose-400 font-bold">{player.d}</span>
                                </div>
                                <div className="flex flex-col bg-white/5 py-2 rounded-md">
                                    <span className="text-[9px] text-white/30 mb-1">A</span>
                                    <span className="text-white/70 font-bold">{player.a}</span>
                                </div>
                                <div className="flex flex-col bg-white/5 py-2 rounded-md">
                                    <span className="text-[9px] text-white/30 mb-1">HS%</span>
                                    <span className="text-white/80 font-bold">{player.hs}</span>
                                </div>
                                <div className="flex flex-col bg-white/5 py-2 rounded-md">
                                    <span className="text-[9px] text-white/30 mb-1">K/D</span>
                                    <span className="text-white font-bold">{player.kd}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="relative min-h-screen bg-[#08090f] text-white overflow-hidden transition-colors duration-1000">
            {/* Global Atmospheric Background for Scores Page */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#ff4655]/5 via-[#08090f] to-[#050508] pointer-events-none z-0" />
            <div className="absolute inset-0 bg-[url('/img/grid.svg')] opacity-[0.03] pointer-events-none z-0" style={{ backgroundSize: '30px' }} />
            
            {/* Ambient animated glowing orbs */}
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#ff4655]/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse z-0" style={{ animationDuration: '4s' }} />
            <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse z-0" style={{ animationDuration: '6s' }} />

            <CustomCursor />
            <ModernNavbar />

            {/* Dynamic Animated Background */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={activeMatch ? activeMatch.id : 'bracket-bg'}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="absolute inset-0"
                        style={{ background: activeMatch ? activeMatch.bgImage : "transparent" }}
                    />
                </AnimatePresence>
                {activeMatch && <div className="absolute inset-0 bg-[#050508] opacity-80 mix-blend-multiply" />}
                <div className="absolute inset-0 bg-[url('/img/grid.svg')] opacity-[0.04] mix-blend-overlay" />
            </div>

            <main className="relative z-10 pt-32 pb-24 px-4 md:px-8 max-w-[1400px] mx-auto min-h-screen flex flex-col">
                
                {/* Header & Tabs */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={mounted ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-8 md:mb-12"
                >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                        <div>
                            <h1 className="font-teko text-6xl md:text-8xl font-bold uppercase leading-[0.85] tracking-tighter text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                                MATCH CENTER
                            </h1>
                            <p className="font-mono text-xs md:text-sm text-white/50 tracking-[0.3em] uppercase mt-4">
                                LIVE TOURNAMENT BRACKET & STATS
                            </p>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="flex gap-2 bg-[#0c0e1a]/80 p-1.5 rounded-lg border border-white/10 backdrop-blur-md overflow-x-auto max-w-full scrollbar-hide">
                            <button
                                onClick={() => setActiveTab('SCHEDULE')}
                                className={`relative shrink-0 px-6 py-3 font-mono text-xs tracking-widest uppercase transition-all duration-300 rounded-md whitespace-nowrap overflow-hidden
                                    ${activeTab === 'SCHEDULE' ? 'text-white' : 'text-white/40 hover:text-white/80 hover:bg-white/5'}
                                `}
                            >
                                {activeTab === 'SCHEDULE' && (
                                    <motion.div 
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-[#ff4655]/20 border border-[#ff4655]/50 rounded-md"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    SCHEDULE
                                </span>
                            </button>

                            <button
                                onClick={() => setActiveTab('STANDINGS')}
                                className={`relative shrink-0 px-6 py-3 font-mono text-xs tracking-widest uppercase transition-all duration-300 rounded-md whitespace-nowrap overflow-hidden
                                    ${activeTab === 'STANDINGS' ? 'text-white' : 'text-white/40 hover:text-white/80 hover:bg-white/5'}
                                `}
                            >
                                {activeTab === 'STANDINGS' && (
                                    <motion.div 
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-[#ff4655]/20 border border-[#ff4655]/50 rounded-md"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    STANDINGS
                                </span>
                            </button>

                            <button
                                onClick={() => setActiveTab('BRACKET')}
                                className={`relative shrink-0 px-6 py-3 font-mono text-xs tracking-widest uppercase transition-all duration-300 rounded-md whitespace-nowrap overflow-hidden
                                    ${activeTab === 'BRACKET' ? 'text-white' : 'text-white/40 hover:text-white/80 hover:bg-white/5'}
                                `}
                            >
                                {activeTab === 'BRACKET' && (
                                    <motion.div 
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-[#ff4655]/20 border border-[#ff4655]/50 rounded-md"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center gap-2">
                                    <LayoutGrid className="w-4 h-4" />
                                    KNOCKOUT
                                </span>
                            </button>

                            {MATCHES.map(match => (
                                <button
                                    key={match.id}
                                    onClick={() => setActiveTab(match.id)}
                                    className={`relative shrink-0 px-6 py-3 font-mono text-xs tracking-widest uppercase transition-all duration-300 rounded-md whitespace-nowrap overflow-hidden
                                        ${activeTab === match.id ? 'text-white' : 'text-white/40 hover:text-white/80 hover:bg-white/5'}
                                    `}
                                >
                                    {activeTab === match.id && (
                                        <motion.div 
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-[#ff4655]/20 border border-[#ff4655]/50 rounded-md"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative z-10 flex items-center gap-2">
                                        {match.status === "LIVE" && <span className="w-1.5 h-1.5 bg-[#ff4655] rounded-full animate-pulse" />}
                                        {match.map}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Active Match Metadata Banner (only shown for specific matches) */}
                    <AnimatePresence mode="wait">
                        {activeMatch && (
                            <motion.div 
                                key={`meta-${activeMatch.id}`}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex flex-wrap gap-4 md:gap-8 font-mono text-[10px] md:text-xs text-white/70 uppercase tracking-widest bg-white/[0.03] border border-white/5 p-4 rounded-md backdrop-blur-sm"
                            >
                                <div className="flex items-center gap-2">
                                    <MapIcon className="w-4 h-4 text-[#ff4655]" />
                                    <span className="font-bold text-white">{activeMatch.map}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Crosshair className="w-4 h-4 text-[#ff4655]" />
                                    <span>{activeMatch.mode}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-[#ff4655]" />
                                    <span>{activeMatch.duration}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-[#ff4655]" />
                                    <span>{activeMatch.date}</span>
                                </div>
                                <div className="flex items-center gap-2 ml-auto">
                                    <span className={`px-2 py-1 rounded text-[9px] font-bold ${activeMatch.status === 'LIVE' ? 'bg-[#ff4655] text-white animate-pulse' : 'bg-white/10 text-white/60'}`}>
                                        {activeMatch.status}
                                    </span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Main Content Area */}
                <AnimatePresence mode="wait">
                    {activeTab === 'SCHEDULE' ? (
                        renderSchedule()
                    ) : activeTab === 'STANDINGS' ? (
                        renderStandings()
                    ) : activeTab === 'BRACKET' ? (
                        renderBracket()
                    ) : activeMatch ? (
                        <motion.div
                            key={activeMatch.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="w-full flex flex-col gap-2"
                        >
                            <div className="w-full mb-4">
                                {renderRoundTimeline()}
                                {renderTeamStatsComparison()}
                            </div>

                            {renderTeamTable(activeMatch.teamA, activeMatch.teamA.score > activeMatch.teamB.score)}
                            
                            <div className="flex items-center justify-center -my-8 md:-my-12 relative z-20 pointer-events-none">
                                <div className="bg-[#050508] p-4 rounded-full border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] relative">
                                    <div className="absolute inset-1 border border-white/5 rounded-full" />
                                    <span className="font-teko text-3xl md:text-4xl tracking-widest text-white/50 block mt-1">VS</span>
                                </div>
                            </div>

                            {renderTeamTable(activeMatch.teamB, activeMatch.teamB.score > activeMatch.teamA.score)}
                        </motion.div>
                    ) : null}
                </AnimatePresence>

            </main>

            <Footer />
        </div>
    );
};

export default ScoresPage;
