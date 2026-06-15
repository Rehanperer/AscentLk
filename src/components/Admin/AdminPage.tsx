import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    Ticket,
    TrendingUp,
    Settings,
    Database,
    AlertCircle,
    Gamepad2,
    X,
    Search,
    Download,
    LayoutDashboard,
    Trash2,
    ShieldAlert,
    Clock,
    Activity,
    Eye,
    BarChart3,
    Globe,
    ArrowUpRight,
    Mail,
    Send,
    MessageSquare,
    ChevronRight
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import SeatPicker from '../Tickets/SeatPicker';

// ─── Types ──────────────────────────────────────────────────────────────────

interface AdminStats {
    totalRegistrations: number;
    seatsBooked: number;
    seatsHeld: number;
    totalRevenue: number;
    totalSeats: number;
}

interface PageView {
    id: string;
    path: string;
    referrer: string | null;
    user_agent: string | null;
    created_at: string;
}

interface CommsMessage {
    id: string;
    team_id: string;
    subject: string;
    content: string;
    sent_by: string;
    created_at: string;
}

// ─── Shared Cinematic Background ────────────────────────────────────────────

const CinematicBackground = () => (
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
    </div>
);

// ─── Pure SVG Bar Chart ─────────────────────────────────────────────────────

const BarChart = ({ data, height = 200 }: { data: { label: string; value: number }[]; height?: number }) => {
    // If all values are 0, maxVal would be 0, causing division by zero or invisible bars.
    // We enforce a minimum maxVal of 1.
    const maxVal = Math.max(...data.map(d => d.value), 1);
    
    // We use a responsive viewBox where width is 1000 to represent a reliable coordinate system for percentages
    const viewBoxWidth = 1000;
    const sliceWidth = viewBoxWidth / Math.max(data.length, 1);
    
    return (
        <svg viewBox={`0 0 ${viewBoxWidth} ${height + 30}`} className="w-full h-full">
            {/* Grid lines */}
            {[0.25, 0.5, 0.75, 1].map((frac) => (
                <line
                    key={frac}
                    x1="0" y1={height - (height * frac)}
                    x2={viewBoxWidth} y2={height - (height * frac)}
                    stroke="rgba(255,255,255,0.05)" strokeWidth="1"
                />
            ))}

            {data.map((d, i) => {
                // leave 20px headroom for the text label above the bar
                const barH = (d.value / maxVal) * (height - 20);
                const barW = Math.min(sliceWidth * 0.6, 60); // Max width 60px
                const xCenter = (i * sliceWidth) + (sliceWidth / 2);
                const x = xCenter - (barW / 2);
                const y = height - barH;
                
                return (
                    <g key={i}>
                        {/* Bar */}
                        <rect
                            x={x} y={y}
                            width={barW} height={barH}
                            rx="2"
                            fill="url(#barGradient)"
                            opacity="0.85"
                        />
                        {/* Value label */}
                        <text
                            x={xCenter} y={y - 8}
                            textAnchor="middle"
                            fill="rgba(255,255,255,0.5)"
                            fontSize="11"
                            fontFamily="monospace"
                        >
                            {d.value}
                        </text>
                        {/* Day label */}
                        <text
                            x={xCenter} y={height + 20}
                            textAnchor="middle"
                            fill="rgba(255,255,255,0.3)"
                            fontSize="11"
                            fontFamily="monospace"
                        >
                            {d.label}
                        </text>
                    </g>
                );
            })}

            {/* Gradient definition */}
            <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#64c8ff" />
                    <stop offset="100%" stopColor="#ff4655" />
                </linearGradient>
            </defs>
        </svg>
    );
};

// ─── Stat Card ──────────────────────────────────────────────────────────────

const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <div className="bg-[#0c0e1a] border border-white/10 p-5 md:p-6 rounded-sm relative overflow-hidden group hover:border-white/20 transition-colors">
        <div className="absolute top-0 left-0 w-full h-[1px] opacity-50" style={{ background: `linear-gradient(90deg, ${color}40, transparent)` }} />
        <Icon size={20} className="mb-3 opacity-70" style={{ color }} />
        <div className="font-mono text-[9px] md:text-[10px] text-white/30 mb-1 tracking-widest uppercase">{label}</div>
        <div className="font-teko text-3xl md:text-4xl leading-none text-white">{value}</div>
    </div>
);

// ─── Alert Item ─────────────────────────────────────────────────────────────

const AlertItem = ({ type, text }: { type: 'warning' | 'info' | 'success', text: string }) => {
    const colors = { warning: '#f59e0b', info: '#64c8ff', success: '#00ff88' };
    return (
        <div className="flex items-start gap-3 border-l-2 pl-3 py-2" style={{ borderColor: colors[type] }}>
            <div className="w-1.5 h-1.5 rounded-full mt-1 shrink-0" style={{ backgroundColor: colors[type] }} />
            <span className="font-mono text-[10px] text-white/60 leading-relaxed">{text}</span>
        </div>
    );
};

// ─── Main Admin Page ────────────────────────────────────────────────────────

const AdminPage: React.FC = () => {
    const [stats, setStats] = useState<AdminStats>({
        totalRegistrations: 0,
        seatsBooked: 0,
        seatsHeld: 0,
        totalRevenue: 0,
        totalSeats: 0
    });

    const [registrants, setRegistrants] = useState<any[]>([]);
    const [tournamentTeams, setTournamentTeams] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'overview' | 'registrations' | 'monitor' | 'tournament' | 'system' | 'traffic' | 'comms'>('overview');

    // Maintenance State
    const [maintenanceSettings, setMaintenanceSettings] = useState({
        enabled: false,
        until: new Date(Date.now() + 3600000).toISOString().slice(0, 16)
    });
    const [isSavingSettings, setIsSavingSettings] = useState(false);

    // Modal State
    const [selectedTeam, setSelectedTeam] = useState<any | null>(null);

    // Monitor State
    const [bookedSeats, setBookedSeats] = useState<string[]>([]);
    const [heldSeats, setHeldSeats] = useState<string[]>([]);
    const [monitorLevel, setMonitorLevel] = useState<'Ground' | 'Balcony' | 'Deck'>('Ground');

    // Traffic State
    const [pageViews, setPageViews] = useState<PageView[]>([]);
    const [trafficLoading, setTrafficLoading] = useState(false);

    // Communications State
    const [selectedCommTeam, setSelectedCommTeam] = useState<any | null>(null);
    const [commsMessages, setCommsMessages] = useState<CommsMessage[]>([]);
    const [messageSubject, setMessageSubject] = useState('');
    const [messageBody, setMessageBody] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [commsSearch, setCommsSearch] = useState('');
    const [isBroadcast, setIsBroadcast] = useState(false);
    const [sendProgress, setSendProgress] = useState({ current: 0, total: 0 });

    const fetchData = async () => {
        // Fetch Registrations
        const { data: regData } = await supabase.from('registrations').select('*').order('created_at', { ascending: false });
        if (regData) setRegistrants(regData);

        // Fetch Tournament Teams
        const { data: teamData } = await supabase.from('tournament_teams').select('*').order('created_at', { ascending: false });
        if (teamData) setTournamentTeams(teamData);

        // Fetch Seat Stats
        const { data: seatData } = await supabase.from('seats').select('id, status, price');
        if (seatData) {
            const booked = seatData.filter(s => s.status === 'booked');
            const held = seatData.filter(s => s.status === 'held');
            const revenue = booked.reduce((sum, s) => sum + (s.price || 750), 0);

            setBookedSeats(booked.map(s => s.id));
            setHeldSeats(held.map(s => s.id));

            setStats({
                totalRegistrations: regData?.length || 0,
                seatsBooked: booked.length,
                seatsHeld: held.length,
                totalRevenue: revenue,
                totalSeats: seatData.length
            });
        }
    };

    const fetchTrafficData = async () => {
        setTrafficLoading(true);
        try {
            const { data } = await supabase
                .from('page_views')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(1000);
            if (data) setPageViews(data);
        } catch (err) {
            console.warn('[Traffic] Failed to fetch:', err);
        } finally {
            setTrafficLoading(false);
        }
    };

    const fetchCommsMessages = async (teamId: string) => {
        const { data } = await supabase
            .from('comms_messages')
            .select('*')
            .eq('team_id', teamId)
            .order('created_at', { ascending: true });
        if (data) setCommsMessages(data);
    };

    useEffect(() => {
        const init = async () => {
            await fetchData();

            // Fetch Maintenance Settings
            const { data: maintData } = await supabase.from('settings').select('value').eq('key', 'maintenance').single();
            if (maintData?.value) {
                setMaintenanceSettings(maintData.value as any);
            }
        };

        init();

        // Subscribe to changes
        const seatChannel = supabase.channel('admin_seats_v2')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'seats' }, () => fetchData())
            .subscribe();

        const regChannel = supabase.channel('admin_regs_v2')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'registrations' }, () => fetchData())
            .subscribe();

        const teamChannel = supabase.channel('admin_teams_v2')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'tournament_teams' }, () => fetchData())
            .subscribe();

        return () => {
            supabase.removeChannel(seatChannel);
            supabase.removeChannel(regChannel);
            supabase.removeChannel(teamChannel);
        };
    }, []);

    // Fetch traffic data when tab is activated
    useEffect(() => {
        if (activeTab === 'traffic') {
            fetchTrafficData();
        }
    }, [activeTab]);

    // Fetch messages when a team is selected in comms
    useEffect(() => {
        if (selectedCommTeam) {
            fetchCommsMessages(selectedCommTeam.id);
            
            // Subscribe to new messages for this team
            const msgChannel = supabase.channel(`comms_${selectedCommTeam.id}`)
                .on('postgres_changes', { 
                    event: 'INSERT', 
                    schema: 'public', 
                    table: 'comms_messages', 
                    filter: `team_id=eq.${selectedCommTeam.id}` 
                }, (payload) => {
                    setCommsMessages(prev => [...prev, payload.new as CommsMessage]);
                })
                .subscribe();

            return () => {
                supabase.removeChannel(msgChannel);
            };
        } else {
            setCommsMessages([]);
        }
    }, [selectedCommTeam]);

    // ─── Traffic Analytics (computed) ────────────────────────────────────

    const trafficStats = useMemo(() => {
        const now = new Date();
        const todayStr = now.toISOString().slice(0, 10);
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const todayViews = pageViews.filter(pv => pv.created_at.slice(0, 10) === todayStr).length;
        const weekViews = pageViews.filter(pv => new Date(pv.created_at) >= weekAgo).length;
        const uniquePaths = new Set(pageViews.map(pv => pv.path)).size;

        return { todayViews, weekViews, totalViews: pageViews.length, uniquePaths };
    }, [pageViews]);

    const dailyChartData = useMemo(() => {
        const days: { label: string; value: number }[] = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().slice(0, 10);
            const label = d.toLocaleDateString('en-US', { weekday: 'short' });
            const count = pageViews.filter(pv => pv.created_at.slice(0, 10) === dateStr).length;
            days.push({ label, value: count });
        }
        return days;
    }, [pageViews]);

    const topPages = useMemo(() => {
        const counts: Record<string, number> = {};
        pageViews.forEach(pv => {
            counts[pv.path] = (counts[pv.path] || 0) + 1;
        });
        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([path, count]) => ({ path, count }));
    }, [pageViews]);

    // ─── Handlers ────────────────────────────────────────────────────────

    const handleDeleteRegistration = async (id: string, seatId: string) => {
        if (!window.confirm(`Are you sure you want to delete this registration? This will also free up seat ${seatId}.`)) return;

        try {
            const { error: regError, count } = await supabase
                .from('registrations')
                .delete({ count: 'exact' })
                .eq('id', id);

            if (regError) throw regError;

            if (count === 0) {
                alert('ACCESS DENIED: You do not have permission to delete this record (RLS Policy).');
                return;
            }

            if (seatId) {
                const { error: seatError } = await supabase
                    .from('seats')
                    .update({ status: 'available' })
                    .eq('id', seatId);

                if (seatError) console.error('Error freeing seat:', seatError);
            }

            await fetchData();
            alert('Registration deleted successfully.');
        } catch (error) {
            console.error('Error deleting registration:', error);
            alert('Failed to delete registration. See console for details.');
        }
    };

    const handleDeleteTeam = async (id: string, school: string) => {
        if (!window.confirm(`Are you sure you want to delete the team from ${school}?`)) return;

        try {
            const { error, count } = await supabase
                .from('tournament_teams')
                .delete({ count: 'exact' })
                .eq('id', id);

            if (error) throw error;

            if (count === 0) {
                alert('ACCESS DENIED: You do not have permission to delete this record (RLS Policy).');
                return;
            }

            await fetchData();
            alert('Team deleted successfully.');
        } catch (error) {
            console.error('Error deleting team:', error);
            alert('Failed to delete tournament team');
        }
    };

    const handleSaveMaintenance = async () => {
        setIsSavingSettings(true);
        try {
            const { error } = await supabase
                .from('settings')
                .upsert({
                    key: 'maintenance',
                    value: maintenanceSettings,
                    updated_at: new Date().toISOString()
                });

            if (error) {
                console.error('Supabase Error:', error);
                if (error.code === '42501') {
                    alert('ACCESS DENIED: Database RLS policies are blocking the update. Please run the provided SQL fix in your Supabase dashboard.');
                } else {
                    alert(`Failed to save settings: ${error.message}`);
                }
                return;
            }
            alert('Maintenance settings updated successfully.');
        } catch (error) {
            console.error('Save Error:', error);
            alert('Failed to save maintenance settings. See console for details.');
        } finally {
            setIsSavingSettings(false);
        }
    };

    const handleSendMessage = async () => {
        if (!isBroadcast && !selectedCommTeam) return;
        if (!messageSubject.trim() || !messageBody.trim()) return;
        
        const targets = isBroadcast ? tournamentTeams : [selectedCommTeam];
        if (targets.length === 0) return;

        if (isBroadcast && !window.confirm(`⚠️ WARNING: YOU ARE ABOUT TO SEND THIS MESSAGE TO ${targets.length} DEPLOYED TEAMS. THIS ACTION IS IRREVERSIBLE. INITIATE BULK TRANSMISSION?`)) {
            return;
        }

        setIsSending(true);
        setSendProgress({ current: 0, total: targets.length });

        try {
            for (let i = 0; i < targets.length; i++) {
                const team = targets[i];
                if (!team.email) continue;

                setSendProgress({ current: i + 1, total: targets.length });

                // 1. Send via Cloudflare Worker
                const emailRes = await fetch('https://ascent-forms-api.ascent2026s.workers.dev', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        formType: 'AD-HOC TRANSMISSION',
                        fullName: team.igl_name,
                        email: team.email,
                        school: team.school,
                        role: 'Admin Operation',
                        subject: messageSubject,
                        message: messageBody,
                        submittedAt: new Date().toISOString()
                    })
                });

                if (!emailRes.ok) {
                    console.error(`Failed to reach ${team.school}`);
                    if (!isBroadcast) throw new Error('Worker transmission failed');
                    // In broadcast, we keep going but log the error
                } else {
                    // 2. Log to Supabase for each successful send
                    await supabase
                        .from('comms_messages')
                        .insert([{
                            team_id: team.id,
                            subject: messageSubject,
                            content: messageBody,
                            sent_by: 'ASCENT_OPS'
                        }]);
                }

                // Small delay to prevent rate-limiting in broadcast mode
                if (isBroadcast && i < targets.length - 1) {
                    await new Promise(r => setTimeout(r, 100));
                }
            }

            // 3. Clear inputs
            setMessageSubject('');
            setMessageBody('');
            alert(isBroadcast ? `Broadcast to ${targets.length} units completed.` : 'Transmission sent and logged successfully.');
            if (isBroadcast) setIsBroadcast(false);
        } catch (error: any) {
            console.error('Comms Error:', error);
            alert(`Failed to send transmission: ${error.message}`);
        } finally {
            setIsSending(false);
            setSendProgress({ current: 0, total: 0 });
        }
    };

    // ─── Tab config ──────────────────────────────────────────────────────

    const tabs = [
        { id: 'overview', icon: LayoutDashboard, label: 'OVERVIEW' },
        { id: 'registrations', icon: Database, label: 'REGISTRATIONS' },
        { id: 'tournament', icon: Gamepad2, label: 'TOURNAMENT' },
        { id: 'monitor', icon: Ticket, label: 'VENUE' },
        { id: 'traffic', icon: Eye, label: 'TRAFFIC' },
        { id: 'comms', icon: Mail, label: 'COMMUNICATIONS' },
        { id: 'system', icon: Settings, label: 'SYSTEM' }
    ];

    // ─── Render ──────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen text-white p-3 md:p-6 font-inter relative">
            <CinematicBackground />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8 md:mb-10 pl-4 md:pl-6 border-l-2 border-[#64c8ff]">
                    <div>
                        <h1 className="font-teko text-3xl md:text-5xl leading-none tracking-wide">
                            OPERATIONS <span className="text-[#64c8ff]">//</span> CENTER
                        </h1>
                        <p className="font-mono text-[#ff4655] text-[10px] md:text-xs tracking-widest mt-2">ADMINISTRATIVE CONTROL UNIT V3.0</p>
                    </div>
                    <div className="flex flex-wrap gap-2 md:gap-3">
                        <button
                            onClick={() => {
                                window.location.href = '/admin/scanner';
                            }}
                            className="flex items-center gap-2 px-4 py-2 border border-[#64c8ff]/30 bg-[#64c8ff]/10 font-mono text-[10px] md:text-xs hover:bg-[#64c8ff]/20 transition-colors text-[#64c8ff] rounded-sm font-semibold tracking-wider"
                        >
                            LIVE SCANNER
                        </button>
                        <button
                            onClick={() => {
                                localStorage.removeItem('admin_session');
                                window.location.href = '/admin/login';
                            }}
                            className="flex items-center gap-2 px-4 py-2 border border-[#ff4655]/30 bg-[#ff4655]/10 font-mono text-[10px] md:text-xs hover:bg-[#ff4655]/20 transition-colors text-[#ff4655] rounded-sm"
                        >
                            SIGN OUT
                        </button>
                        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#64c8ff]/10 border border-[#64c8ff]/30 text-[#64c8ff] font-mono text-[10px] md:text-xs rounded-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#64c8ff] animate-pulse" />
                            REALTIME ACTIVE
                        </div>
                    </div>
                </header>

                {/* Sub-nav */}
                <nav className="flex gap-1 bg-[#0c0e1a] border border-white/10 p-1 mb-6 md:mb-8 overflow-x-auto w-full md:w-fit rounded-sm">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 md:gap-3 px-3 md:px-5 py-2.5 font-mono text-[10px] md:text-xs tracking-wider transition-all whitespace-nowrap rounded-sm ${
                                activeTab === tab.id
                                    ? 'bg-[#64c8ff] text-[#040814] font-bold'
                                    : 'text-white/40 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <tab.icon size={14} />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </nav>

                {/* ═══════════════════════ OVERVIEW TAB ═══════════════════════ */}

                {activeTab === 'overview' && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6 md:space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                            <StatCard icon={Users} label="TOTAL REGISTRATIONS" value={stats.totalRegistrations} color="#ff4655" />
                            <StatCard icon={Ticket} label="SEATS BOOKED" value={stats.seatsBooked} color="#00ff88" />
                            <StatCard icon={TrendingUp} label="ESTIMATED REVENUE" value={`RS. ${stats.totalRevenue.toLocaleString()}`} color="#64c8ff" />
                            <StatCard icon={AlertCircle} label="HELD IN CHECKOUT" value={stats.seatsHeld} color="#f59e0b" />
                        </div>

                        {/* Recent Activity Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
                            <div className="lg:col-span-2 bg-[#0c0e1a] border border-white/10 p-4 md:p-8 rounded-sm">
                                <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                                    <h2 className="font-teko text-2xl md:text-3xl tracking-wide">LIVE ENTRY FEED</h2>
                                    <div className="font-mono text-[10px] text-[#00ff88] flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
                                        LIVE
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {registrants.slice(0, 6).map((reg) => (
                                        <div key={reg.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-3 md:p-4 bg-[#040814]/60 border border-white/5 hover:border-[#64c8ff]/20 transition-colors gap-2 rounded-sm">
                                            <div className="flex items-center gap-3 md:gap-4">
                                                <div className="w-8 h-8 md:w-10 md:h-10 bg-[#ff4655]/10 border border-[#ff4655]/20 flex items-center justify-center font-teko text-lg md:text-xl text-[#ff4655] rounded-sm">
                                                    {reg.full_name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-teko text-base md:text-lg leading-none uppercase">{reg.full_name}</div>
                                                    <div className="font-mono text-[10px] text-white/30 truncate max-w-[150px] md:max-w-none">{reg.email}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/5 pt-2 md:pt-0 mt-1 md:mt-0">
                                                <div className="text-right">
                                                    <div className="font-mono text-[#64c8ff] text-[10px] md:text-xs">SEAT {reg.seat_id}</div>
                                                    <div className="font-mono text-white/20 text-[8px] md:text-[9px]">{new Date(reg.created_at).toLocaleTimeString()}</div>
                                                </div>
                                                <div className="bg-[#00ff88]/10 text-[#00ff88] px-2 py-1 font-mono text-[9px] border border-[#00ff88]/20 rounded-sm">
                                                    VERIFIED
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {registrants.length === 0 && (
                                        <div className="text-center py-12 text-white/20 font-mono text-xs">NO ENTRIES YET</div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-[#0c0e1a] border border-white/10 p-5 md:p-6 rounded-sm">
                                <h2 className="font-teko text-2xl md:text-3xl tracking-wide mb-5 border-b border-white/5 pb-4">SYSTEM ALERTS</h2>
                                <div className="space-y-3">
                                    <AlertItem type="warning" text="CRITICAL: Arena ground floor reaching 90% capacity." />
                                    <AlertItem type="info" text="NOTICE: Real-time sync engine operating at 24ms latency." />
                                    <AlertItem type="success" text="STABLE: Payment gateway handshake successful." />
                                    <AlertItem type="info" text={`STATS: ${stats.totalRegistrations} total units processed.`} />
                                </div>
                                <div className="mt-6 pt-5 border-t border-white/5 space-y-3">
                                    <div className="font-mono text-[10px] text-white/20 mb-1 tracking-widest uppercase">Quick Actions</div>
                                    <button
                                        onClick={() => {
                                            window.location.href = '/admin/scanner';
                                        }}
                                        className="w-full py-3 bg-[#64c8ff] text-black font-teko text-lg tracking-widest hover:bg-[#78d2ff] transition-colors rounded-sm font-bold flex items-center justify-center gap-2"
                                    >
                                        <Ticket size={16} />
                                        LAUNCH LIVE SCANNER
                                    </button>
                                    <button className="w-full py-3 bg-[#ff4655] text-white font-teko text-lg tracking-widest hover:bg-[#ff5a68] transition-colors rounded-sm">
                                        BROADCAST UPDATE
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ═══════════════════════ REGISTRATIONS TAB ══════════════════ */}

                {activeTab === 'registrations' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="bg-[#0c0e1a] border border-white/10 p-4 md:p-6 rounded-sm">
                        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search registrants..."
                                    className="bg-[#040814] border border-white/10 pl-10 pr-4 py-2.5 font-mono text-xs w-full sm:w-80 outline-none focus:border-[#64c8ff] transition-colors rounded-sm"
                                />
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 font-mono text-xs transition-colors border border-white/10 rounded-sm">
                                <Download size={14} /> EXPORT CSV
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead className="text-left font-mono text-[10px] md:text-xs text-white/30 tracking-wider uppercase">
                                    <tr className="border-b border-white/10">
                                        <th className="p-3 md:p-4 font-normal">NAME</th>
                                        <th className="p-3 md:p-4 font-normal">EMAIL</th>
                                        <th className="p-3 md:p-4 font-normal">SEAT</th>
                                        <th className="p-3 md:p-4 font-normal">SCHOOL</th>
                                        <th className="p-3 md:p-4 font-normal">TIMESTAMP</th>
                                        <th className="p-3 md:p-4 font-normal">STATUS</th>
                                        <th className="p-3 md:p-4 font-normal text-right">ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody className="font-mono text-xs text-white/70">
                                    {registrants.length > 0 ? registrants.map((reg, i) => (
                                        <tr key={i} className="hover:bg-white/[0.02] transition-colors border-b border-white/5">
                                            <td className="p-3 md:p-4 uppercase text-white/90">{reg.full_name}</td>
                                            <td className="p-3 md:p-4 text-[10px] text-white/50">{reg.email}</td>
                                            <td className="p-3 md:p-4 text-[#64c8ff]">{reg.seat_id}</td>
                                            <td className="p-3 md:p-4 uppercase">{reg.school}</td>
                                            <td className="p-3 md:p-4 text-white/40">{new Date(reg.created_at).toLocaleString()}</td>
                                            <td className="p-3 md:p-4">
                                                <span className="px-2 py-0.5 bg-[#00ff88]/10 text-[#00ff88] text-[9px] border border-[#00ff88]/20 rounded-sm">VERIFIED</span>
                                            </td>
                                            <td className="p-3 md:p-4 text-right">
                                                <button
                                                    onClick={() => handleDeleteRegistration(reg.id, reg.seat_id)}
                                                    className="p-2 text-white/20 hover:text-[#ff4655] transition-colors"
                                                    title="Delete Registration"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={7} className="p-12 text-center opacity-30 font-mono text-xs">NO REGISTRATIONS FOUND</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}

                {/* ═══════════════════════ TOURNAMENT TAB ═════════════════════ */}

                {activeTab === 'tournament' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="bg-[#0c0e1a] border border-white/10 p-4 md:p-8 rounded-sm">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                            <div>
                                <h2 className="font-teko text-2xl md:text-3xl tracking-wide">TOURNAMENT ROSTER</h2>
                                <p className="font-mono text-white/30 text-[10px]">{tournamentTeams.length} teams deployed</p>
                            </div>
                            <div className="relative w-full md:w-auto">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                                <input
                                    type="text"
                                    placeholder="Filter by institution..."
                                    className="w-full md:w-80 bg-[#040814] border border-white/10 py-2.5 pl-10 pr-4 font-mono text-xs focus:border-[#64c8ff] transition-colors outline-none rounded-sm"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto -mx-4 md:mx-0">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 font-mono text-[10px] text-white/30 uppercase tracking-widest text-left">
                                        <th className="px-4 py-4 font-normal">SCHOOL</th>
                                        <th className="px-4 py-4 font-normal">IGL</th>
                                        <th className="px-4 py-4 font-normal">ROSTER</th>
                                        <th className="px-4 py-4 font-normal">SUBMITTED</th>
                                        <th className="px-4 py-4 font-normal text-right">ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody className="font-inter">
                                    {tournamentTeams.map((team) => (
                                        <tr key={team.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-4 py-4">
                                                <div className="font-teko text-lg md:text-xl uppercase">{team.school}</div>
                                                <div className="font-mono text-[8px] text-white/20">UUID: {team.id.slice(0, 12)}...</div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="font-mono text-xs text-white/80">{team.igl_name}</div>
                                                <div className="font-mono text-[10px] text-[#64c8ff]">{team.igl_phone}</div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex gap-1">
                                                    {[1, 2, 3, 4, 5].map(n => (
                                                        <div key={n} className="w-2 h-2 rounded-full bg-[#00ff88] opacity-60"></div>
                                                    ))}
                                                    {(team.sub1_name || team.sub2_name) && <div className="w-2 h-2 rounded-full bg-[#64c8ff] opacity-60"></div>}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 font-mono text-[10px] text-white/40">{new Date(team.created_at).toLocaleDateString()}</td>
                                            <td className="px-4 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => setSelectedTeam(team)}
                                                        className="px-3 py-1.5 bg-white/5 border border-white/10 font-mono text-[10px] hover:bg-white/10 hover:border-[#64c8ff]/30 transition-colors rounded-sm tracking-wider"
                                                    >
                                                        VIEW
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteTeam(team.id, team.school);
                                                        }}
                                                        className="p-2 text-white/20 hover:text-[#ff4655] hover:bg-[#ff4655]/10 transition-all rounded-sm"
                                                        title="Delete Team"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {tournamentTeams.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="p-12 text-center opacity-30 font-mono text-xs">NO TEAMS REGISTERED</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}

                {/* ═══════════════════════ MONITOR TAB ════════════════════════ */}

                {activeTab === 'monitor' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="bg-[#0c0e1a] border border-white/10 p-4 md:p-8 rounded-sm">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
                            <div className="text-left">
                                <h2 className="font-teko text-3xl tracking-wide">LIVE VENUE MONITOR</h2>
                                <p className="font-mono text-white/30 text-xs">Real-time occupancy visualization</p>
                            </div>

                            <div className="flex gap-1 bg-[#040814] p-1 border border-white/10 rounded-sm">
                                {['Ground', 'Balcony', 'Deck'].map(lvl => (
                                    <button
                                        key={lvl}
                                        onClick={() => setMonitorLevel(lvl as any)}
                                        className={`px-4 py-1.5 font-mono text-xs tracking-wider transition-colors rounded-sm ${monitorLevel === lvl ? 'bg-[#64c8ff] text-[#040814] font-bold' : 'text-white/40 hover:text-white'}`}
                                    >
                                        {lvl.toUpperCase()}
                                    </button>
                                ))}
                            </div>

                            <div className="flex gap-6 font-mono text-[10px]">
                                <div className="flex items-center gap-2"><div className="w-2 h-2 bg-[#ff4655] rounded-full" /> AVAILABLE</div>
                                <div className="flex items-center gap-2"><div className="w-2 h-2 bg-[#f59e0b] rounded-full" /> HELD</div>
                                <div className="flex items-center gap-2"><div className="w-2 h-2 bg-[#1e293b] rounded-full" /> BOOKED</div>
                            </div>
                        </div>

                        <div className="max-w-4xl mx-auto bg-[#040814] border border-white/5 p-2 md:p-6 lg:p-12 mb-8 rounded-sm">
                            <SeatPicker
                                activeLevel={monitorLevel}
                                selectedSeats={[]}
                                bookedSeats={bookedSeats}
                                onSeatToggle={() => { }}
                            />
                        </div>

                        {/* Monitor Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
                            <div className="bg-[#040814] border border-white/10 p-5 flex items-center justify-between rounded-sm">
                                <div>
                                    <div className="text-white/30 font-mono text-[10px] uppercase mb-1 tracking-wider">AVAILABLE</div>
                                    <div className="font-teko text-3xl text-[#ff4655]">
                                        {stats.totalSeats - stats.seatsBooked - stats.seatsHeld}
                                    </div>
                                </div>
                                <div className="text-[#ff4655] font-mono text-[10px] text-right hidden sm:block">
                                    {Math.round(((stats.totalSeats - stats.seatsBooked - stats.seatsHeld) / (stats.totalSeats || 1)) * 100)}%
                                </div>
                            </div>

                            <div className="bg-[#040814] border border-white/10 p-5 flex items-center justify-between rounded-sm">
                                <div>
                                    <div className="text-white/30 font-mono text-[10px] uppercase mb-1 tracking-wider">BOOKED</div>
                                    <div className="font-teko text-3xl text-[#64c8ff]">{stats.seatsBooked}</div>
                                </div>
                                <div className="text-[#64c8ff] font-mono text-[10px] text-right hidden sm:block">
                                    {Math.round((stats.seatsBooked / (stats.totalSeats || 1)) * 100)}%
                                </div>
                            </div>

                            <div className="bg-[#040814] border border-white/10 p-5 flex items-center justify-between rounded-sm">
                                <div>
                                    <div className="text-white/30 font-mono text-[10px] uppercase mb-1 tracking-wider">HELD</div>
                                    <div className="font-teko text-3xl text-[#f59e0b]">{stats.seatsHeld}</div>
                                </div>
                                <div className="text-[#f59e0b] font-mono text-[10px] text-right hidden sm:block">
                                    {Math.round((stats.seatsHeld / (stats.totalSeats || 1)) * 100)}%
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ═══════════════════════ TRAFFIC TAB ════════════════════════ */}

                {activeTab === 'traffic' && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-5 md:space-y-6">
                        {/* Traffic Stats */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                            <StatCard icon={Eye} label="TODAY" value={trafficStats.todayViews} color="#64c8ff" />
                            <StatCard icon={BarChart3} label="THIS WEEK" value={trafficStats.weekViews} color="#00ff88" />
                            <StatCard icon={Globe} label="ALL TIME" value={trafficStats.totalViews} color="#ff4655" />
                            <StatCard icon={ArrowUpRight} label="UNIQUE PATHS" value={trafficStats.uniquePaths} color="#f59e0b" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
                            {/* Chart */}
                            <div className="lg:col-span-2 bg-[#0c0e1a] border border-white/10 p-5 md:p-8 rounded-sm">
                                <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                                    <h2 className="font-teko text-2xl md:text-3xl tracking-wide">DAILY VIEWS</h2>
                                    <span className="font-mono text-[10px] text-white/30 tracking-wider">LAST 7 DAYS</span>
                                </div>
                                <div className="h-[220px] flex items-end">
                                    <BarChart data={dailyChartData} height={180} />
                                </div>
                            </div>

                            {/* Top Pages */}
                            <div className="bg-[#0c0e1a] border border-white/10 p-5 md:p-6 rounded-sm">
                                <h2 className="font-teko text-2xl md:text-3xl tracking-wide mb-5 border-b border-white/5 pb-4">TOP PAGES</h2>
                                <div className="space-y-2">
                                    {topPages.length > 0 ? topPages.map((p, i) => (
                                        <div key={i} className="flex justify-between items-center py-2.5 px-3 bg-[#040814]/60 border border-white/5 rounded-sm hover:border-white/10 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <span className="font-mono text-[10px] text-white/20 w-5">{String(i + 1).padStart(2, '0')}</span>
                                                <span className="font-mono text-xs text-white/70 truncate max-w-[120px] md:max-w-[180px]">{p.path}</span>
                                            </div>
                                            <span className="font-mono text-xs text-[#64c8ff] tabular-nums">{p.count}</span>
                                        </div>
                                    )) : (
                                        <div className="py-8 text-center font-mono text-xs text-white/20">NO DATA YET</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Live Feed */}
                        <div className="bg-[#0c0e1a] border border-white/10 p-5 md:p-6 rounded-sm">
                            <div className="flex justify-between items-center mb-5 border-b border-white/5 pb-4">
                                <h2 className="font-teko text-2xl md:text-3xl tracking-wide">LIVE PAGE VIEWS</h2>
                                <button
                                    onClick={fetchTrafficData}
                                    disabled={trafficLoading}
                                    className="font-mono text-[10px] text-[#64c8ff] hover:text-white transition-colors tracking-wider disabled:opacity-50"
                                >
                                    {trafficLoading ? 'LOADING...' : 'REFRESH'}
                                </button>
                            </div>
                            <div className="space-y-1">
                                {pageViews.slice(0, 15).map((pv) => (
                                    <div key={pv.id} className="flex items-center justify-between py-2.5 px-3 hover:bg-white/[0.02] transition-colors border-b border-white/[0.03]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#64c8ff] shrink-0" />
                                            <span className="font-mono text-xs text-white/70">{pv.path}</span>
                                        </div>
                                        <span className="font-mono text-[10px] text-white/30 shrink-0 ml-4">
                                            {new Date(pv.created_at).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                ))}
                                {pageViews.length === 0 && (
                                    <div className="py-8 text-center font-mono text-xs text-white/20">
                                        {trafficLoading ? 'LOADING TRAFFIC DATA...' : 'NO PAGE VIEWS RECORDED YET. Make sure the page_views table exists in Supabase.'}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ═══════════════════════ COMMUNICATIONS TAB ════════════════════════ */}

                {activeTab === 'comms' && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[700px]">
                        {/* Sidebar: Teams List */}
                        <div className="lg:col-span-1 bg-[#0c0e1a] border border-white/10 rounded-sm flex flex-col overflow-hidden">
                            <div className="p-4 border-b border-white/10">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="font-teko text-xl tracking-wide">DEPLOYED_TEAMS</h2>
                                    <button 
                                        onClick={() => {
                                            setIsBroadcast(!isBroadcast);
                                            setSelectedCommTeam(null);
                                        }}
                                        className={`px-3 py-1 font-mono text-[10px] tracking-widest transition-all rounded-sm border ${isBroadcast ? 'bg-[#ff4655] border-[#ff4655] text-white' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}
                                    >
                                        {isBroadcast ? 'EXIT_BROADCAST' : 'BROADCAST_MODE'}
                                    </button>
                                </div>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                                    <input 
                                        type="text"
                                        placeholder="Search roster..."
                                        value={commsSearch}
                                        onChange={(e) => setCommsSearch(e.target.value)}
                                        className="w-full bg-[#040814] border border-white/10 py-1.5 pl-9 pr-3 font-mono text-[10px] outline-none focus:border-[#64c8ff] transition-colors rounded-sm"
                                    />
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                {tournamentTeams
                                    .filter(t => t.school.toLowerCase().includes(commsSearch.toLowerCase()) || t.igl_name.toLowerCase().includes(commsSearch.toLowerCase()))
                                    .map(team => (
                                    <button
                                        key={team.id}
                                        disabled={isBroadcast}
                                        onClick={() => setSelectedCommTeam(team)}
                                        className={`w-full text-left p-4 border-b border-white/5 transition-colors group flex items-center justify-between disabled:opacity-30 ${selectedCommTeam?.id === team.id ? 'bg-[#64c8ff]/10 border-l-2 border-l-[#64c8ff]' : 'hover:bg-white/[0.02]'}`}
                                    >
                                        <div>
                                            <div className={`font-teko text-lg leading-none uppercase ${selectedCommTeam?.id === team.id ? 'text-[#64c8ff]' : 'text-white/80'}`}>{team.school}</div>
                                            <div className="font-mono text-[9px] text-white/30 mt-1 uppercase">{team.igl_name}</div>
                                        </div>
                                        {!isBroadcast && <ChevronRight size={14} className={`transition-transform ${selectedCommTeam?.id === team.id ? 'text-[#64c8ff] translate-x-0' : 'text-white/10 group-hover:block hidden'}`} />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Main: Message History & Composer */}
                        <div className="lg:col-span-3 flex flex-col gap-6">
                            {(selectedCommTeam || isBroadcast) ? (
                                <>
                                    {/* History View (Only if not broadcast) */}
                                    {!isBroadcast ? (
                                        <div className="flex-1 bg-[#0c0e1a] border border-white/10 rounded-sm flex flex-col overflow-hidden">
                                            <div className="p-4 bg-[#040814]/50 border-b border-white/10 flex justify-between items-center">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-[#64c8ff]/10 border border-[#64c8ff]/20 flex items-center justify-center font-teko text-lg text-[#64c8ff]">
                                                        {selectedCommTeam.school.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-teko text-xl leading-none uppercase">{selectedCommTeam.school}</h3>
                                                        <p className="font-mono text-[10px] text-white/30 mt-0.5">{selectedCommTeam.email}</p>
                                                    </div>
                                                </div>
                                                <div className="font-mono text-[9px] text-[#00ff88] px-2 py-1 bg-[#00ff88]/5 border border-[#00ff88]/20 rounded-sm">
                                                    COMM_LINK_ENCRYPTED
                                                </div>
                                            </div>

                                            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
                                                {commsMessages.length > 0 ? commsMessages.map((msg) => (
                                                    <div key={msg.id} className="flex flex-col items-end">
                                                        <div className="max-w-[80%] bg-[#1a202c]/40 border border-[#64c8ff]/20 p-4 rounded-sm relative shadow-xl backdrop-blur-sm">
                                                            <div className="font-mono text-[9px] text-[#64c8ff] mb-2 uppercase tracking-widest border-b border-[#64c8ff]/10 pb-1">
                                                                {msg.subject || 'TRANSMISSION'}
                                                            </div>
                                                            <p className="font-mono text-xs text-white/80 whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                                            <div className="absolute -right-1.5 top-4 w-3 h-3 bg-[#1a202c]/40 border-r border-t border-[#64c8ff]/20 rotate-45" />
                                                        </div>
                                                        <span className="font-mono text-[8px] text-white/20 mt-2 uppercase">
                                                            SENT BY {msg.sent_by} // {new Date(msg.created_at).toLocaleString()}
                                                        </span>
                                                    </div>
                                                )) : (
                                                    <div className="h-full flex flex-col items-center justify-center opacity-20">
                                                        <MessageSquare size={48} className="mb-4" />
                                                        <p className="font-mono text-sm tracking-widest uppercase text-center">NO TRANSMISSION LOGS FOUND FOR THIS UNIT</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex-1 bg-[#ff4655]/5 border border-[#ff4655]/20 rounded-sm flex flex-col items-center justify-center p-8 text-center">
                                            <ShieldAlert size={64} className="text-[#ff4655] mb-6 animate-pulse" />
                                            <h3 className="font-teko text-4xl text-[#ff4655] tracking-widest uppercase">BROADCAST_MODE_ACTIVE</h3>
                                            <p className="font-mono text-xs text-white/50 mt-4 max-w-md leading-relaxed uppercase">
                                                You are currently drafting a global transmission that will be relayed to **{tournamentTeams.length} deployed units**. This action cannot be revoked once initiated.
                                            </p>
                                        </div>
                                    )}

                                    {/* Composer Area */}
                                    <div className={`p-4 rounded-sm border-t ${isBroadcast ? 'bg-[#ff4655]/10 border-[#ff4655]/30' : 'bg-[#040814]/80 border-white/10'}`}>
                                        <div className="space-y-3">
                                            <input 
                                                type="text"
                                                placeholder={isBroadcast ? "GLOBAL_TRANSMISSION_SUBJECT..." : "MESSAGE_SUBJECT..."}
                                                value={messageSubject}
                                                onChange={(e) => setMessageSubject(e.target.value)}
                                                className={`w-full bg-[#0c0e1a] border p-3 font-mono text-xs outline-none transition-colors rounded-sm ${isBroadcast ? 'border-[#ff4655]/30 focus:border-[#ff4655]' : 'border-white/10 focus:border-[#64c8ff]'}`}
                                            />
                                            <textarea 
                                                placeholder={isBroadcast ? "ENTER_GLOBAL_OPERATIONAL_CONTENT..." : "ENTER_OPERATIONAL_CONTENT..."}
                                                value={messageBody}
                                                onChange={(e) => setMessageBody(e.target.value)}
                                                rows={4}
                                                className={`w-full bg-[#0c0e1a] border p-3 font-mono text-xs outline-none transition-colors resize-none rounded-sm ${isBroadcast ? 'border-[#ff4655]/30 focus:border-[#ff4655]' : 'border-white/10 focus:border-[#64c8ff]'}`}
                                            />
                                            <div className="flex justify-between items-center">
                                                <p className="font-mono text-[9px] text-white/20 uppercase tracking-widest">
                                                    {isBroadcast ? '[WARNING]: BULK TRANSMISSION WILL BE LOGGED PER UNIT.' : 'WARNING: Transmissions are logged and irreversible.'}
                                                </p>
                                                <button 
                                                    onClick={handleSendMessage}
                                                    disabled={isSending || !messageBody.trim() || (isBroadcast && tournamentTeams.length === 0)}
                                                    className={`flex items-center gap-2 px-6 py-2.5 font-teko text-xl tracking-wider transition-all disabled:opacity-50 disabled:grayscale rounded-sm ${isBroadcast ? 'bg-[#ff4655] text-white hover:bg-white hover:text-[#ff4655]' : 'bg-[#64c8ff] text-[#040814] hover:bg-white'}`}
                                                >
                                                    {isSending ? (
                                                        <>
                                                            {isBroadcast ? `TRANSMITTING ${sendProgress.current}/${sendProgress.total}` : 'ENCRYPTING...'}
                                                        </>
                                                    ) : (
                                                        <>
                                                            {isBroadcast ? 'INITIATE_BROADCAST' : 'INITIATE_SEND'} <Send size={18} />
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 bg-[#0c0e1a] border border-white/10 rounded-sm flex flex-col items-center justify-center opacity-30">
                                    <Mail size={64} className="mb-6" />
                                    <h3 className="font-teko text-2xl tracking-widest uppercase">SELECT_TARGET_FOR_COMMUNICATION</h3>
                                    <p className="font-mono text-[10px] mt-2 tracking-widest uppercase">ENCRYPTED_COMMS_PROTOCOL_V4.0</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* ═══════════════════════ SYSTEM TAB ═════════════════════════ */}

                {activeTab === 'system' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="max-w-4xl mx-auto space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <StatCard icon={ShieldAlert} label="SECURITY STATUS" value="ENFORCED" color="#ff4655" />
                            <StatCard icon={Activity} label="ENGINE HEALTH" value="98.2%" color="#00ff88" />
                            <StatCard icon={Database} label="DATA LATENCY" value="24ms" color="#64c8ff" />
                        </div>

                        <div className="bg-[#0c0e1a] border border-white/10 p-6 md:p-8 rounded-sm">
                            <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-4">
                                <div className="p-3 bg-[#ff4655]/10 text-[#ff4655] border border-[#ff4655]/20 rounded-sm">
                                    <Settings size={24} />
                                </div>
                                <div>
                                    <h2 className="font-teko text-2xl md:text-3xl tracking-wide">MAINTENANCE MODULE</h2>
                                    <p className="font-mono text-white/30 text-[10px] tracking-widest uppercase">Global route interception</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Toggle Control */}
                                <div className="flex items-center justify-between bg-[#040814] p-5 border border-white/5 hover:border-white/10 transition-colors rounded-sm">
                                    <div>
                                        <div className="text-white font-teko text-xl md:text-2xl uppercase mb-1">MAINTENANCE MODE</div>
                                        <p className="text-white/40 font-mono text-[10px] md:text-xs max-w-md leading-relaxed">
                                            When enabled, all public traffic is redirected to the maintenance page. Admins are exempt.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setMaintenanceSettings(prev => ({ ...prev, enabled: !prev.enabled }))}
                                        className={`w-14 h-7 rounded-full border transition-all relative ${maintenanceSettings.enabled
                                            ? 'bg-[#ff4655] border-[#ff4655]'
                                            : 'bg-white/5 border-white/20'
                                        }`}
                                    >
                                        <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full transition-all ${maintenanceSettings.enabled ? 'left-7' : 'left-0.5'
                                        }`} />
                                    </button>
                                </div>

                                {/* Countdown Config */}
                                <div className="bg-[#040814] p-5 border border-white/5 space-y-4 rounded-sm">
                                    <div className="flex items-center gap-2 text-white/40 font-mono text-[10px] tracking-widest mb-2 uppercase">
                                        <Clock size={12} /> END TIME CONFIG
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-4">
                                        <input
                                            type="datetime-local"
                                            value={maintenanceSettings.until}
                                            onChange={(e) => setMaintenanceSettings(prev => ({ ...prev, until: e.target.value }))}
                                            className="flex-1 bg-[#0c0e1a] border border-white/10 p-3 text-white font-mono text-sm outline-none focus:border-[#64c8ff] transition-colors rounded-sm"
                                        />
                                        <button
                                            onClick={handleSaveMaintenance}
                                            disabled={isSavingSettings}
                                            className="px-8 py-3 bg-[#ff4655] text-white font-teko text-lg uppercase tracking-widest hover:bg-[#ff5a68] transition-all disabled:opacity-50 rounded-sm"
                                        >
                                            {isSavingSettings ? 'SYNCING...' : 'COMMIT CHANGES'}
                                        </button>
                                    </div>

                                    <div className="p-4 bg-[#ff4655]/5 border border-[#ff4655]/20 text-[#ff4655] font-mono text-[10px] uppercase leading-relaxed rounded-sm">
                                        [WARNING]: ENABLING MAINTENANCE MODE WILL IMMEDIATELY DISCONNECT ALL PUBLIC USERS.
                                    </div>
                                </div>

                                {/* Preview Card */}
                                <div className="border border-white/5 p-5 bg-[#040814] rounded-sm">
                                    <div className="text-white/30 font-mono text-[9px] mb-4 tracking-[0.3em] uppercase">SYSTEM PREVIEW</div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-2.5 h-2.5 rounded-full bg-[#64c8ff] animate-pulse" />
                                            <div className="font-teko text-xl text-white">REMAINING WINDOW</div>
                                        </div>
                                        <div className="font-mono text-[#ff4655] text-xl md:text-2xl tabular-nums">
                                            {(() => {
                                                const diff = +new Date(maintenanceSettings.until) - +new Date();
                                                if (diff <= 0) return "00:00:00";
                                                const h = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0');
                                                const m = Math.floor((diff / 1000 / 60) % 60).toString().padStart(2, '0');
                                                const s = Math.floor((diff / 1000) % 60).toString().padStart(2, '0');
                                                return `${h}:${m}:${s}`;
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* ═══════════════════════ TEAM DETAIL MODAL ══════════════════════ */}

            <AnimatePresence>
                {selectedTeam && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={() => setSelectedTeam(null)}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.3 }}
                            className="bg-[#0c0e1a] border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative p-5 md:p-8 shadow-2xl rounded-sm"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedTeam(null)}
                                className="absolute top-4 right-4 md:top-6 md:right-6 text-white/30 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="mb-8 border-b border-white/10 pb-4">
                                <h2 className="font-teko text-2xl md:text-4xl text-white uppercase">{selectedTeam.school}</h2>
                                <p className="font-mono text-xs text-[#64c8ff] tracking-widest mt-1">
                                    TEAM REGISTRATION DETAILS
                                </p>
                                <p className="font-mono text-[10px] text-white/30 mt-2">
                                    SUBMITTED: {new Date(selectedTeam.created_at).toLocaleString()}
                                </p>
                            </div>

                            <div className="space-y-8 font-mono text-sm">
                                {/* Contacts */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-[#040814] p-4 border-l-2 border-[#64c8ff] rounded-sm">
                                        <h4 className="text-white/40 text-[10px] mb-2 tracking-wider">IN-GAME LEADER</h4>
                                        <div className="text-white uppercase">{selectedTeam.igl_name}</div>
                                        <div className="text-[#64c8ff] text-xs mt-1">{selectedTeam.igl_phone}</div>
                                    </div>
                                    <div className="bg-[#040814] p-4 border-l-2 border-[#ff4655] rounded-sm">
                                        <h4 className="text-white/40 text-[10px] mb-2 tracking-wider">TEACHER IN CHARGE</h4>
                                        <div className="text-white uppercase">{selectedTeam.teacher_name}</div>
                                        <div className="text-[#ff4655] text-xs mt-1">{selectedTeam.teacher_phone}</div>
                                    </div>
                                </div>

                                {/* Main Roster */}
                                <div>
                                    <h3 className="font-teko text-xl md:text-2xl text-white mb-4 border-b border-white/5 pb-2">MAIN ROSTER</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {[1, 2, 3, 4, 5].map((num) => (
                                            <div key={`player${num}`} className="flex justify-between items-center bg-[#040814] p-3 border border-white/5 rounded-sm">
                                                <div>
                                                    <div className="text-white/40 text-[10px] mb-1">PLAYER {num} {num === 1 && <span className="text-[#64c8ff] ml-1">(IGL)</span>}</div>
                                                    <div className="text-white text-sm uppercase">{selectedTeam[`player${num}_name`]}</div>
                                                </div>
                                                <div className="text-right text-[#00ff88] text-[10px] bg-[#00ff88]/10 px-2 py-1 rounded-sm border border-[#00ff88]/20">
                                                    {selectedTeam[`player${num}_riot_id`]}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Substitutes */}
                                {(selectedTeam.sub1_name || selectedTeam.sub2_name) && (
                                    <div>
                                        <h3 className="font-teko text-xl md:text-2xl text-white mb-4 border-b border-white/5 pb-2 mt-4">SUBSTITUTES</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {[1, 2].map((num) => (
                                                selectedTeam[`sub${num}_name`] ? (
                                                    <div key={`sub${num}`} className="flex justify-between items-center bg-[#040814] p-3 border border-white/5 rounded-sm">
                                                        <div>
                                                            <div className="text-white/40 text-[10px] mb-1">SUBSTITUTE {num}</div>
                                                            <div className="text-white text-sm uppercase">{selectedTeam[`sub${num}_name`]}</div>
                                                        </div>
                                                        <div className="text-right text-white/50 text-[10px] bg-white/5 px-2 py-1 rounded-sm">
                                                            {selectedTeam[`sub${num}_riot_id`]}
                                                        </div>
                                                    </div>
                                                ) : null
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminPage;
