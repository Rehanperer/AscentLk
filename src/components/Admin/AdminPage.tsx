import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Ticket,
    TrendingUp,
    Settings,
    Search,
    Download,
    LayoutDashboard,
    Database,
    AlertCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import SeatPicker from '../Tickets/SeatPicker';

interface AdminStats {
    totalRegistrations: number;
    seatsBooked: number;
    seatsHeld: number;
    totalRevenue: number;
}

const AdminPage: React.FC = () => {
    const [stats, setStats] = useState<AdminStats>({
        totalRegistrations: 0,
        seatsBooked: 0,
        seatsHeld: 0,
        totalRevenue: 0
    });

    const [registrants, setRegistrants] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'overview' | 'registrations' | 'monitor'>('overview');

    // Monitor State
    const [bookedSeats, setBookedSeats] = useState<string[]>([]);
    const [heldSeats, setHeldSeats] = useState<string[]>([]);
    const [monitorLevel, setMonitorLevel] = useState<'Ground' | 'Balcony' | 'Deck'>('Ground');

    useEffect(() => {
        const fetchData = async () => {
            // Fetch Registrations
            const { data: regData } = await supabase.from('registrations').select('*').order('created_at', { ascending: false });
            if (regData) setRegistrants(regData);

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
                    totalRevenue: revenue
                });
            }
        };

        fetchData();

        // Subscribe to changes
        const seatChannel = supabase.channel('admin_seats_v2')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'seats' }, () => fetchData())
            .subscribe();

        const regChannel = supabase.channel('admin_regs_v2')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'registrations' }, () => fetchData())
            .subscribe();

        return () => {
            supabase.removeChannel(seatChannel);
            supabase.removeChannel(regChannel);
        };
    }, []);

    return (
        <div className="min-h-screen bg-[#000000] text-white p-6 font-inter">
            {/* Background Grid */}
            <div className="fixed inset-0 pointer-events-none opacity-5"
                style={{
                    backgroundImage: 'linear-gradient(#ff4655 1px, transparent 1px), linear-gradient(90deg, #ff4655 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <header className="flex justify-between items-end mb-12 border-l-4 border-[#ff4655] pl-6">
                    <div>
                        <h1 className="font-teko text-5xl leading-none">OPERATIONS_CENTER</h1>
                        <p className="font-mono text-[#ff4655] text-sm tracking-widest mt-2">// ADMINISTRATIVE_CONTROL_UNIT_V3.0</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => {
                                localStorage.removeItem('admin_session');
                                window.location.href = '/admin/login';
                            }}
                            className="flex items-center gap-2 px-4 py-2 border border-[#ff4655]/30 bg-[#ff4655]/10 font-mono text-xs hover:bg-[#ff4655]/20 transition-colors text-[#ff4655]"
                        >
                            SIGN_OUT
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 border border-white/10 bg-white/5 font-mono text-xs hover:bg-white/10 transition-colors">
                            <Settings size={14} /> SYSTEM_CONFIG
                        </button>
                        <div className="px-4 py-2 bg-[#ff4655] text-white font-mono text-xs font-bold animate-pulse">
                            REALTIME_ACTIVE
                        </div>
                    </div>
                </header>

                {/* Sub-nav */}
                <nav className="flex gap-1 bg-white/5 p-1 mb-8 w-fit">
                    {[
                        { id: 'overview', icon: LayoutDashboard, label: 'OVERVIEW' },
                        { id: 'registrations', icon: Database, label: 'REGISTRATIONS' },
                        { id: 'monitor', icon: Ticket, label: 'VENUE_MONITOR' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-3 px-6 py-2 font-teko text-xl transition-all ${activeTab === tab.id ? 'bg-[#ff4655] text-white' : 'text-white/50 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </nav>

                {activeTab === 'overview' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Summary Cards */}
                        <StatCard icon={Users} label="TOTAL_REGISTRATIONS" value={stats.totalRegistrations} color="#ff4655" />
                        <StatCard icon={Ticket} label="SEATS_OCCUPIED" value={stats.seatsBooked} color="#00ff88" />
                        <StatCard icon={TrendingUp} label="HELD_TRANSACTIONS" value={stats.seatsHeld} color="#f59e0b" />
                        <StatCard icon={AlertCircle} label="REVENUE_GENERATED" value={`LKR ${stats.totalRevenue.toLocaleString()}`} color="#3b82f6" />

                        {/* Large Activity Card */}
                        <div className="md:col-span-2 lg:col-span-3 bg-white/5 border border-white/10 p-8 clip-path-angled relative overflow-hidden">
                            <h3 className="font-teko text-2xl mb-6">REGISTRATION_TRENDS</h3>
                            <div className="h-64 flex items-end justify-between gap-2 border-b border-white/10 pb-4">
                                {/* Placeholder Graph */}
                                {[40, 70, 45, 90, 65, 80, 50, 85, 95, 60, 75, 55].map((h, i) => (
                                    <div key={i} className="w-full bg-[#ff4655]/20 hover:bg-[#ff4655] transition-all relative group" style={{ height: `${h}%` }}>
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#ff4655] text-white text-[10px] px-1 hidden group-hover:block">{h}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-4 font-mono text-[10px] text-white/30">
                                <span>08:00</span><span>12:00</span><span>16:00</span><span>20:00</span><span>00:00</span>
                            </div>
                        </div>

                        {/* Side Alerts */}
                        <div className="bg-white/5 border border-white/10 p-6">
                            <h3 className="font-teko text-2xl mb-4">SYSTEM_ALERTS</h3>
                            <div className="space-y-4">
                                <AlertItem type="warning" text="DB_CONNECTION_LIMIT_REACHED" />
                                <AlertItem type="info" text="REALTIME_SYNC_OPTIMIZED" />
                                <AlertItem type="success" text="BACKUP_COMPLETED_SUCCESSFULLY" />
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'registrations' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/5 border border-white/10 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                                <input
                                    type="text"
                                    placeholder="SEARCH_REGISTRANTS..."
                                    className="bg-white/5 border border-white/10 pl-10 pr-4 py-2 font-mono text-xs w-80 outline-none focus:border-[#ff4655]"
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
                                            <td className="p-4">
                                                <span className="px-2 py-0.5 bg-[#00ff88]/20 text-[#00ff88] text-[10px]">VERIFIED</span>
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

                {activeTab === 'monitor' && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/5 border border-white/10 p-8">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
                            <div className="text-left">
                                <h2 className="font-teko text-3xl">LIVE_VENUE_MONITOR</h2>
                                <p className="font-mono text-white/30 text-xs">// REAL-TIME_OCCUPANCY_VISUALIZATION</p>
                            </div>

                            <div className="flex gap-2 bg-white/5 p-1 border border-white/10">
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

                        <div className="max-w-4xl mx-auto bg-black/40 border border-white/5 p-6 md:p-12">
                            <SeatPicker
                                activeLevel={monitorLevel}
                                selectedSeats={[]}
                                heldSeats={heldSeats}
                                bookedSeats={bookedSeats}
                                onSeatToggle={() => { }} // Read-only mode
                            />
                        </div>
                    </motion.div>
                )}
            </div>

            <style>{`
                .clip-path-angled {
                    clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px));
                }
            `}</style>
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <div className="bg-white/5 border border-white/10 p-6 clip-path-angled relative overflow-hidden group">
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
