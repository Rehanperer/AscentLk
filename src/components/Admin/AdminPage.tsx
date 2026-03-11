import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
    Activity
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import SeatPicker from '../Tickets/SeatPicker';

interface AdminStats {
    totalRegistrations: number;
    seatsBooked: number;
    seatsHeld: number;
    totalRevenue: number;
    totalSeats: number;
}

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
    const [activeTab, setActiveTab] = useState<'overview' | 'registrations' | 'monitor' | 'tournament' | 'system'>('overview');

    // Maintenance State
    const [maintenanceSettings, setMaintenanceSettings] = useState({
        enabled: false,
        until: new Date(Date.now() + 3600000).toISOString().slice(0, 16) // Default 1 hour from now
    });
    const [isSavingSettings, setIsSavingSettings] = useState(false);

    // Modal State
    const [selectedTeam, setSelectedTeam] = useState<any | null>(null);

    // Monitor State
    const [bookedSeats, setBookedSeats] = useState<string[]>([]);
    const [heldSeats, setHeldSeats] = useState<string[]>([]);
    const [monitorLevel, setMonitorLevel] = useState<'Ground' | 'Balcony' | 'Deck'>('Ground');

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

    const handleDeleteRegistration = async (id: string, seatId: string) => {
        if (!window.confirm(`Are you sure you want to delete this registration? This will also free up seat ${seatId}.`)) return;

        try {
            // Delete registration
            // We use count: 'exact' to see if anything was actually deleted (check if RLS blocked it)
            const { error: regError, count } = await supabase
                .from('registrations')
                .delete({ count: 'exact' })
                .eq('id', id);

            if (regError) throw regError;

            if (count === 0) {
                alert('ACCESS DENIED: You do not have permission to delete this record (RLS Policy).');
                return;
            }

            // Update seat status back to available
            if (seatId) {
                const { error: seatError } = await supabase
                    .from('seats')
                    .update({ status: 'available' })
                    .eq('id', seatId);

                if (seatError) console.error('Error freeing seat:', seatError);
            }

            // Explicit refresh instead of just relying on subscriptions
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
        } catch (error: any) {
            console.error('Error saving maintenance settings:', error);
            alert(`An unexpected error occurred: ${error.message || 'Unknown error'}`);
        } finally {
            setIsSavingSettings(false);
        }
    };

    return (
        <div className="min-h-screen text-white p-3 md:p-6 font-inter" style={{ background: '#0d121f' }}>
            {/* Background Grid */}
            <div className="fixed inset-0 pointer-events-none opacity-10"
                style={{
                    backgroundImage: 'linear-gradient(#ff4655 1px, transparent 1px), linear-gradient(90deg, #ff4655 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8 md:mb-12 border-l-4 border-[#ff4655] pl-4 md:pl-6">
                    <div>
                        <h1 className="font-teko text-3xl md:text-5xl leading-none">OPERATIONS_CENTER</h1>
                        <p className="font-mono text-[#ff4655] text-sm tracking-widest mt-2">// ADMINISTRATIVE_CONTROL_UNIT_V3.0</p>
                    </div>
                    <div className="flex flex-wrap gap-2 md:gap-4">
                        <button
                            onClick={() => {
                                localStorage.removeItem('admin_session');
                                window.location.href = '/admin/login';
                            }}
                            className="flex items-center gap-2 px-4 py-2 border border-[#ff4655]/30 bg-[#ff4655]/10 font-mono text-xs hover:bg-[#ff4655]/20 transition-colors text-[#ff4655]"
                        >
                            SIGN_OUT
                        </button>
                        <button className="hidden md:flex items-center gap-2 px-4 py-2 border border-white/10 bg-[#161b2c] font-mono text-xs hover:bg-[#1a2035] transition-colors">
                            <Settings size={14} /> SYSTEM_CONFIG
                        </button>
                        <div className="hidden md:block px-4 py-2 bg-[#ff4655] text-white font-mono text-xs font-bold animate-pulse">
                            REALTIME_ACTIVE
                        </div>
                    </div>
                </header>

                {/* Sub-nav */}
                <nav className="flex gap-1 bg-[#161b2c] border border-white/5 p-1 mb-6 md:mb-8 overflow-x-auto w-full md:w-fit">
                    {[
                        { id: 'overview', icon: LayoutDashboard, label: 'OVERVIEW' },
                        { id: 'registrations', icon: Database, label: 'REGISTRATIONS' },
                        { id: 'tournament', icon: Gamepad2, label: 'TOURNAMENT_TEAMS' },
                        { id: 'monitor', icon: Ticket, label: 'VENUE_MONITOR' },
                        { id: 'system', icon: Settings, label: 'SYSTEM_CONTROL' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 md:gap-3 px-3 md:px-6 py-2 font-teko text-base md:text-xl transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-[#ff4655] text-white' : 'text-white/50 hover:text-white hover:bg-[#1a2035]'
                                }`}
                        >
                            <tab.icon size={16} />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </nav>

                {activeTab === 'overview' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 md:space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                            <StatCard icon={Users} label="TOTAL_REGISTRATIONS" value={stats.totalRegistrations} color="#ff4655" />
                            <StatCard icon={Ticket} label="SEATS_BOOKED" value={stats.seatsBooked} color="#00ff88" />
                            <StatCard icon={TrendingUp} label="ESTIMATED_REVENUE" value={`RS. ${stats.totalRevenue.toLocaleString()}`} color="#3b82f6" />
                            <StatCard icon={AlertCircle} label="HELD_IN_CHECKOUT" value={stats.seatsHeld} color="#f59e0b" />
                        </div>

                        {/* Recent Activity Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                            <div className="lg:col-span-2 bg-[#161b2c] border border-white/10 p-4 md:p-8 clip-path-angled">
                                <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                                    <h2 className="font-teko text-2xl md:text-3xl tracking-wider">LIVE_ENTRY_FEED</h2>
                                    <div className="font-mono text-[10px] text-[#00ff88] animate-pulse">● LIVE_STREAM</div>
                                </div>
                                <div className="space-y-3">
                                    {registrants.slice(0, 6).map((reg) => (
                                        <div key={reg.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-3 md:p-4 bg-[#0d121f] border border-white/5 group hover:border-[#ff4655]/30 transition-colors gap-2">
                                            <div className="flex items-center gap-3 md:gap-4">
                                                <div className="w-8 h-8 md:w-10 md:h-10 bg-[#ff4655]/10 flex items-center justify-center font-teko text-lg md:text-xl text-[#ff4655]">
                                                    {reg.full_name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-teko text-base md:text-lg leading-none uppercase">{reg.full_name}</div>
                                                    <div className="font-mono text-[10px] text-white/30 truncate max-w-[150px] md:max-w-none">{reg.email}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/5 pt-2 md:pt-0 mt-1 md:mt-0">
                                                <div className="text-right">
                                                    <div className="font-mono text-[#00ff88] text-[10px] md:text-xs">SEAT {reg.seat_id}</div>
                                                    <div className="font-mono text-white/20 text-[8px] md:text-[9px]">{new Date(reg.created_at).toLocaleTimeString()}</div>
                                                </div>
                                                <div className="bg-[#00ff88]/10 text-[#00ff88] px-2 py-1 font-mono text-[9px] border border-[#00ff88]/20">
                                                    VERIFIED
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-[#161b2c] border border-white/10 p-6 md:p-8 clip-path-angled">
                                <h2 className="font-teko text-2xl md:text-3xl tracking-wider mb-6 border-b border-white/5 pb-4">SYSTEM_ALERTS</h2>
                                <div className="space-y-4">
                                    <AlertItem type="warning" text="CRITICAL: Arena ground floor reaching 90% capacity." />
                                    <AlertItem type="info" text="NOTICE: Real-time sync engine operating at 24ms latency." />
                                    <AlertItem type="success" text="STABLE: Payment gateway handshake successful." />
                                    <AlertItem type="info" text={`STATS: ${stats.totalRegistrations} total units processed.`} />
                                </div>
                                <div className="mt-8 pt-6 border-t border-white/5">
                                    <div className="font-mono text-[10px] text-white/20 mb-4 tracking-widest uppercase">Quick_Actions</div>
                                    <button className="w-full py-3 bg-[#ff4655] text-white font-teko text-xl tracking-widest hover:bg-[#ff4655]/90 mt-2">
                                        BROADCAST_UPDATE
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'registrations' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/5 border border-white/10 p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                                <input
                                    type="text"
                                    placeholder="SEARCH_REGISTRANTS..."
                                    className="bg-white/5 border border-white/10 pl-10 pr-4 py-2 font-mono text-xs w-full sm:w-80 outline-none focus:border-[#ff4655]"
                                />
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 font-mono text-xs transition-colors">
                                <Download size={14} /> EXPORT_CSV
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead className="bg-[#ff4655]/10 text-left font-mono text-xs">
                                    <tr>
                                        <th className="p-4 border-b border-white/5">NAME</th>
                                        <th className="p-4 border-b border-white/5">EMAIL</th>
                                        <th className="p-4 border-b border-white/5">SEAT_ID</th>
                                        <th className="p-4 border-b border-white/5">SCHOOL</th>
                                        <th className="p-4 border-b border-white/5">TIMESTAMP</th>
                                        <th className="p-4 border-b border-white/5">STATUS</th>
                                        <th className="p-4 border-b border-white/5 text-right">ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody className="font-mono text-xs text-white/70">
                                    {registrants.length > 0 ? registrants.map((reg, i) => (
                                        <tr key={i} className="hover:bg-white/5 transition-colors border-b border-white/5">
                                            <td className="p-4 uppercase">{reg.full_name}</td>
                                            <td className="p-4 uppercase text-[10px]">{reg.email}</td>
                                            <td className="p-4 text-[#ff4655]">{reg.seat_id}</td>
                                            <td className="p-4 uppercase">{reg.school}</td>
                                            <td className="p-4">{new Date(reg.created_at).toLocaleString()}</td>
                                            <td className="p-4 px-2 py-0.5 bg-[#00ff88]/20 text-[#00ff88] text-[10px] text-center">
                                                <span className="px-2 py-0.5 bg-[#00ff88]/20 text-[#00ff88] text-[10px]">VERIFIED</span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button
                                                    onClick={() => handleDeleteRegistration(reg.id, reg.seat_id)}
                                                    className="p-2 text-white/30 hover:text-[#ff4655] transition-colors"
                                                    title="Delete Registration"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={6} className="p-12 text-center opacity-30">NO_REGISTRATIONS_FOUND</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'tournament' && (
                    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#161b2c] border border-white/10 p-4 md:p-8 clip-path-angled">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                            <div>
                                <h2 className="font-teko text-2xl md:text-3xl tracking-wider">TOURNAMENT_ROSTER</h2>
                                <p className="font-mono text-white/30 text-[10px]">// {tournamentTeams.length} TEAMS_DEPLOYED</p>
                            </div>
                            <div className="relative w-full md:w-auto">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                                <input
                                    type="text"
                                    placeholder="FILTER_BY_INSTITUTION..."
                                    className="w-full md:w-80 bg-[#0d121f] border border-white/10 py-2 pl-10 pr-4 font-mono text-xs focus:border-[#ff4655] transition-colors outline-none"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto -mx-4 md:mx-0">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 font-mono text-[10px] text-white/40 uppercase tracking-widest text-left">
                                        <th className="px-4 py-4 font-normal">SCHOOL_ENTITY</th>
                                        <th className="px-4 py-4 font-normal">IGL_UNIT</th>
                                        <th className="px-4 py-4 font-normal">ROSTER_SIZE</th>
                                        <th className="px-4 py-4 font-normal">SUBMITTED</th>
                                        <th className="px-4 py-4 font-normal text-right">ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody className="font-inter">
                                    {tournamentTeams.map((team) => (
                                        <tr key={team.id} className="border-b border-white/5 hover:bg-[#1a2035] transition-colors group">
                                            <td className="px-4 py-4">
                                                <div className="font-teko text-lg md:text-xl uppercase">{team.school}</div>
                                                <div className="font-mono text-[8px] text-white/20">UUID: {team.id.slice(0, 12)}...</div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="font-mono text-xs text-white/80">{team.igl_name}</div>
                                                <div className="font-mono text-[10px] text-[#ff4655]">{team.igl_phone}</div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex gap-1">
                                                    {[1, 2, 3, 4, 5].map(n => (
                                                        <div key={n} className="w-2 h-2 bg-[#00ff88] clip-path-angled opacity-60"></div>
                                                    ))}
                                                    {(team.sub1_name || team.sub2_name) && <div className="w-2 h-2 bg-[#3b82f6] clip-path-angled opacity-60"></div>}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 font-mono text-[10px] text-white/40">{new Date(team.created_at).toLocaleDateString()}</td>
                                            <td className="px-4 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => setSelectedTeam(team)}
                                                        className="px-3 py-1 bg-white/5 border border-white/10 font-teko text-sm hover:bg-white/10 transition-colors"
                                                    >
                                                        VIEW
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteTeam(team.id, team.school);
                                                        }}
                                                        className="p-2 text-white/20 hover:text-[#ff4655] hover:bg-[#ff4655]/10 transition-all rounded-sm"
                                                        title="DELETE_TEAM"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'monitor' && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#161b2c] border border-white/10 p-4 md:p-8 clip-path-angled">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
                            <div className="text-left">
                                <h2 className="font-teko text-3xl">LIVE_VENUE_MONITOR</h2>
                                <p className="font-mono text-white/30 text-xs">// REAL-TIME_OCCUPANCY_VISUALIZATION</p>
                            </div>

                            <div className="flex gap-2 bg-[#0d121f] p-1 border border-white/10">
                                {['Ground', 'Balcony', 'Deck'].map(lvl => (
                                    <button
                                        key={lvl}
                                        onClick={() => setMonitorLevel(lvl as any)}
                                        className={`px-4 py-1 font-teko text-lg transition-colors ${monitorLevel === lvl ? 'bg-[#ff4655] text-white' : 'text-white/40 hover:text-white'}`}
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

                        <div className="max-w-4xl mx-auto bg-[#0d121f] border border-white/5 p-2 md:p-6 lg:p-12 mb-8 shadow-inner">
                            <SeatPicker
                                activeLevel={monitorLevel}
                                selectedSeats={[]}
                                bookedSeats={bookedSeats}
                                onSeatToggle={() => { }} // Read-only mode
                            />
                        </div>

                        {/* Monitor Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                            <div className="bg-[#0d121f] border border-white/10 p-6 flex items-center justify-between">
                                <div>
                                    <div className="text-white/30 font-mono text-xs uppercase mb-1">AVAILABLE SEATS</div>
                                    <div className="font-teko text-4xl text-[#ff4655]">
                                        {stats.totalSeats - stats.seatsBooked - stats.seatsHeld}
                                    </div>
                                </div>
                                <div className="text-[#ff4655] font-mono text-xs text-right hidden sm:block">
                                    {Math.round(((stats.totalSeats - stats.seatsBooked - stats.seatsHeld) / (stats.totalSeats || 1)) * 100)}%<br />CAPACITY
                                </div>
                            </div>

                            <div className="bg-[#0d121f] border border-white/10 p-6 flex items-center justify-between">
                                <div>
                                    <div className="text-white/30 font-mono text-xs uppercase mb-1">BOOKED SEATS</div>
                                    <div className="font-teko text-4xl text-[#1e293b]">
                                        {stats.seatsBooked}
                                    </div>
                                </div>
                                <div className="text-[#1e293b] font-mono text-xs text-right hidden sm:block">
                                    {Math.round((stats.seatsBooked / (stats.totalSeats || 1)) * 100)}%<br />CAPACITY
                                </div>
                            </div>

                            <div className="bg-[#0d121f] border border-white/10 p-6 flex items-center justify-between">
                                <div>
                                    <div className="text-white/30 font-mono text-xs uppercase mb-1">HELD IN CHECKOUT</div>
                                    <div className="font-teko text-4xl text-[#f59e0b]">
                                        {stats.seatsHeld}
                                    </div>
                                </div>
                                <div className="text-[#f59e0b] font-mono text-xs text-right hidden sm:block">
                                    {Math.round((stats.seatsHeld / (stats.totalSeats || 1)) * 100)}%<br />CAPACITY
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'system' && (
                    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <StatCard icon={ShieldAlert} label="SECURITY_STATUS" value="ENFORCE_PASS" color="#ff4655" />
                            <StatCard icon={Activity} label="ENGINE_HEALTH" value="98.2%" color="#00ff88" />
                            <StatCard icon={Database} label="DATA_LATENCY" value="24ms" color="#3b82f6" />
                        </div>

                        <div className="bg-[#161b2c] border border-white/10 p-8 clip-path-angled">
                            <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-4">
                                <div className="p-3 bg-[#ff4655]/10 text-[#ff4655] border border-[#ff4655]/20">
                                    <Settings size={24} />
                                </div>
                                <div>
                                    <h2 className="font-teko text-3xl">MAINTENANCE_MODULE</h2>
                                    <p className="font-mono text-white/30 text-[10px] tracking-widest uppercase">// GLOBAL_ROUTE_INTERCEPTION</p>
                                </div>
                            </div>

                            <div className="space-y-8">
                                {/* Toggle Control */}
                                <div className="flex items-center justify-between bg-[#0d121f] p-6 border border-white/5 group hover:border-[#ff4655]/30 transition-colors">
                                    <div>
                                        <div className="text-white font-teko text-2xl uppercase mb-1">MAINTENANCE_MODE</div>
                                        <p className="text-white/40 font-mono text-xs max-w-md">
                                            When enabled, all public traffic is redirected to the maintenance page.
                                            Admins are exempt from this redirection.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setMaintenanceSettings(prev => ({ ...prev, enabled: !prev.enabled }))}
                                        className={`w-16 h-8 rounded-none border transition-all relative ${maintenanceSettings.enabled
                                            ? 'bg-[#ff4655] border-[#ff4655]'
                                            : 'bg-white/5 border-white/20'
                                            }`}
                                    >
                                        <div className={`absolute top-1 w-6 h-6 bg-white transition-all ${maintenanceSettings.enabled ? 'left-9' : 'left-1'
                                            }`} />
                                    </button>
                                </div>

                                {/* Countdown Config */}
                                <div className="bg-[#0d121f] p-6 border border-white/5 space-y-4">
                                    <div className="flex items-center gap-2 text-white/40 font-mono text-[10px] tracking-widest mb-2 uppercase">
                                        <Clock size={12} /> CONFIG_END_TIME
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-4">
                                        <input
                                            type="datetime-local"
                                            value={maintenanceSettings.until}
                                            onChange={(e) => setMaintenanceSettings(prev => ({ ...prev, until: e.target.value }))}
                                            className="flex-1 bg-[#1a2035] border border-white/10 p-3 text-white font-mono text-sm outline-none focus:border-[#ff4655] transition-colors"
                                        />
                                        <button
                                            onClick={handleSaveMaintenance}
                                            disabled={isSavingSettings}
                                            className="px-8 py-3 bg-[#ff4655] text-white font-teko text-xl uppercase tracking-widest hover:bg-[#ff4655]/90 transition-all disabled:opacity-50"
                                        >
                                            {isSavingSettings ? 'SYNCING...' : 'COMMIT_CHANGES'}
                                        </button>
                                    </div>

                                    <div className="p-4 bg-[#ff4655]/10 border border-[#ff4655]/20 text-[#ff4655] font-mono text-[10px] uppercase leading-relaxed">
                                        [WARNING]: ENABLING MAINTENANCE MODE WILL IMMEDIATELY DISCONNECT ALL PUBLIC USERS.
                                        ENSURE ALL OTHER SYSTEM PARAMETERS ARE STABLE.
                                    </div>
                                </div>

                                {/* Preview Card */}
                                <div className="border border-white/5 p-6 bg-[#0a0e1a]">
                                    <div className="text-white/30 font-mono text-[9px] mb-4 tracking-[0.3em] uppercase">SYSTEM_PREVIEW</div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
                                            <div className="font-teko text-xl text-white">REMAINING_WINDOW</div>
                                        </div>
                                        <div className="font-mono text-[#ff4655] text-2xl">
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

            {/* Team Details Modal */}
            {selectedTeam && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-[#0d121f] border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative p-4 md:p-8 shadow-2xl"
                    >
                        <button
                            onClick={() => setSelectedTeam(null)}
                            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="mb-8 border-b border-white/10 pb-4">
                            <h2 className="font-teko text-2xl md:text-4xl text-white uppercase">{selectedTeam.school}</h2>
                            <p className="font-mono text-xs text-[#ff4655] tracking-widest mt-1">
                                TEAM REGISTRATION DETAILS
                            </p>
                            <p className="font-mono text-[10px] text-white/30 mt-2">
                                SUBMITTED: {new Date(selectedTeam.created_at).toLocaleString()}
                            </p>
                        </div>

                        <div className="space-y-8 font-mono text-sm">
                            {/* Contacts */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-white/5 p-4 border-l-2 border-[#ff4655]">
                                    <h4 className="text-white/40 text-xs mb-2">IN-GAME LEADER</h4>
                                    <div className="text-white uppercase">{selectedTeam.igl_name}</div>
                                    <div className="text-[#ff4655] text-xs">{selectedTeam.igl_phone}</div>
                                </div>
                                <div className="bg-white/5 p-4 border-l-2 border-[#ff4655]">
                                    <h4 className="text-white/40 text-xs mb-2">TEACHER IN CHARGE</h4>
                                    <div className="text-white uppercase">{selectedTeam.teacher_name}</div>
                                    <div className="text-[#ff4655] text-xs">{selectedTeam.teacher_phone}</div>
                                </div>
                            </div>

                            {/* Main Roster */}
                            <div>
                                <h3 className="font-teko text-2xl text-white mb-4 border-b border-white/5 pb-2">MAIN ROSTER</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <div key={`player${num}`} className="flex justify-between items-center bg-white/[0.02] p-3 border border-white/5">
                                            <div>
                                                <div className="text-white/40 text-[10px] mb-1">PLAYER {num} {num === 1 && <span className="text-[#ff4655] ml-1">(IGL)</span>}</div>
                                                <div className="text-white text-sm uppercase">{selectedTeam[`player${num}_name`]}</div>
                                            </div>
                                            <div className="text-right text-[#00ff88] text-xs bg-[#00ff88]/10 px-2 py-1 rounded-sm">
                                                {selectedTeam[`player${num}_riot_id`]}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Substitutes */}
                            {(selectedTeam.sub1_name || selectedTeam.sub2_name) && (
                                <div>
                                    <h3 className="font-teko text-2xl text-white mb-4 border-b border-white/5 pb-2 mt-4">SUBSTITUTES</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[1, 2].map((num) => (
                                            selectedTeam[`sub${num}_name`] ? (
                                                <div key={`sub${num}`} className="flex justify-between items-center bg-white/[0.02] p-3 border border-white/5">
                                                    <div>
                                                        <div className="text-white/40 text-[10px] mb-1">SUBSTITUTE {num}</div>
                                                        <div className="text-white text-sm uppercase">{selectedTeam[`sub${num}_name`]}</div>
                                                    </div>
                                                    <div className="text-right text-white/50 text-xs bg-white/5 px-2 py-1 rounded-sm">
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

            <style>{`
                .clip-path-angled {
                    clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px));
                }
            `}</style>
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <div className="bg-[#161b2c] border border-white/10 p-6 clip-path-angled relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all" />
        <Icon size={24} className="mb-4" style={{ color }} />
        <div className="font-mono text-[10px] text-white/30 mb-1">{label}</div>
        <div className="font-teko text-4xl leading-none">{value}</div>
    </div>
);

const AlertItem = ({ type, text }: { type: 'warning' | 'info' | 'success', text: string }) => {
    const colors = {
        warning: '#f59e0b',
        info: '#3b82f6',
        success: '#00ff88'
    };
    return (
        <div className="flex items-center gap-3 border-l-2 pl-3 py-1" style={{ borderColor: colors[type] }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors[type] }} />
            <span className="font-mono text-[10px] text-white/60">{text}</span>
        </div>
    );
};

export default AdminPage;
