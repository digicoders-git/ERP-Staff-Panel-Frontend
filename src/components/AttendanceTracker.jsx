import React, { useState, useEffect } from 'react';
import { MdAccessTime, MdCheckCircle, MdCancel, MdPerson, MdRefresh, MdSchedule, MdVerifiedUser } from 'react-icons/md';
import { teacherAPI } from '../utils/apiService';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { FaSpinner, FaHistory } from 'react-icons/fa';

const AttendanceTracker = () => {
    const [loading, setLoading] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [staffInfo, setStaffInfo] = useState(null);
    const [attendanceReport, setAttendanceReport] = useState({
        totalRecords: 0,
        presentCount: 0,
        absentCount: 0,
        lateCount: 0,
        leaveCount: 0,
        averageWorkingHours: 0
    });
    const [attendanceList, setAttendanceList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetchProfileAndData();
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const fetchProfileAndData = async () => {
        try {
            setLoading(true);
            const [profileRes, listRes, reportRes] = await Promise.all([
                api.get('/api/staff-panel/profile'),
                teacherAPI.getAttendance(),
                teacherAPI.getAttendanceReport()
            ]);

            if (profileRes.data && profileRes.data.staff) {
                setStaffInfo(profileRes.data.staff);
            }
            if (listRes.data && listRes.data.data) {
                setAttendanceList(listRes.data.data);
            }
            if (reportRes.data && reportRes.data.data) {
                setAttendanceReport(reportRes.data.data);
            }
        } catch (err) {
            toast.error('Identity synchronization failed');
        } finally {
            setLoading(false);
        }
    };

    const handleQuickMark = async (status) => {
        if (!staffInfo) return toast.error('Identity not verified');
        
        try {
            setLoading(true);
            const now = new Date();
            const payload = {
                teacherName: staffInfo.name,
                date: now.toISOString().split('T')[0],
                status: status,
                checkIn: status === 'Present' || status === 'Late' ? now.toLocaleTimeString('en-GB').slice(0, 5) : null,
                remarks: 'Personnel Terminal Autohook'
            };

            await teacherAPI.markAttendance(payload);
            toast.success(`Deployment status: ${status}`);
            fetchProfileAndData();
        } catch (err) {
            toast.error('Protocol transmission failure');
        } finally {
            setLoading(false);
        }
    };

    const statusMap = {
        'Present': 'bg-emerald-50 text-emerald-600 border-emerald-100',
        'Absent': 'bg-rose-50 text-rose-600 border-rose-100',
        'Late': 'bg-amber-50 text-amber-600 border-amber-100',
        'Leave': 'bg-blue-50 text-blue-600 border-blue-100',
    };

    const filteredAttendance = attendanceList.filter(record => {
        const matchesSearch = record.teacherName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-8 bg-slate-50/50 min-h-screen">
            {loading && (
                <div className="fixed inset-0 bg-white/60 flex items-center justify-center z-[70] backdrop-blur-[2px]">
                    <div className="flex flex-col items-center gap-4">
                        <FaSpinner className="animate-spin text-blue-600 text-5xl" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Synching Chronos Stream...</p>
                    </div>
                </div>
            )}

            {/* Premium Header: Identity & Clock */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50/50 rounded-full -mr-40 -mt-40 transition-transform group-hover:scale-110 duration-700" />
                    
                    <div className="relative flex flex-col md:flex-row justify-between gap-12">
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-16 h-16 rounded-3xl bg-slate-800 text-white flex items-center justify-center shadow-xl shadow-slate-200 group-hover:bg-blue-600 transition-colors">
                                    <MdAccessTime size={32} />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic underline decoration-blue-500 underline-offset-8 decoration-4">Temporal Terminal</h1>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3">High-command chronometric tracking</p>
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <div className="text-7xl font-black text-slate-800 tracking-tighter tabular-nums drop-shadow-sm transition-all group-hover:text-blue-600">
                                    {currentTime.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                                    <div className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">
                                        {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col justify-center gap-4">
                            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 mb-4">
                                <div className="flex items-center gap-3 mb-2 text-blue-600">
                                    <MdVerifiedUser size={20} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Operator Identity</span>
                                </div>
                                <div className="text-sm font-black text-slate-800 uppercase tracking-tight">{staffInfo?.name || 'SYNCING...'}</div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <button 
                                    onClick={() => handleQuickMark('Present')}
                                    className="w-full bg-blue-600 hover:bg-black text-white px-10 py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-3 active:scale-95"
                                >
                                    <MdCheckCircle size={18} /> Mark Log-In
                                </button>
                                <button 
                                    onClick={() => handleQuickMark('Late')}
                                    className="w-full bg-slate-100 hover:bg-amber-500 hover:text-white text-slate-500 px-10 py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all border border-slate-200 active:scale-95"
                                >
                                    Report Delays
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800 p-10 rounded-[3rem] shadow-2xl text-white relative overflow-hidden group">
                    <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-24 -mt-24" />
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-10 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Deployment Pulse
                    </h4>
                    <div className="grid grid-cols-2 gap-y-12">
                        <div>
                            <div className="text-4xl font-black text-emerald-400 tabular-nums">{attendanceReport.presentCount}</div>
                            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Active Units</div>
                        </div>
                        <div>
                            <div className="text-4xl font-black text-rose-400 tabular-nums">{attendanceReport.absentCount}</div>
                            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Inactive Units</div>
                        </div>
                        <div>
                            <div className="text-4xl font-black text-amber-400 tabular-nums">{attendanceReport.lateCount}</div>
                            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Delayed Arrival</div>
                        </div>
                        <div>
                            <div className="text-4xl font-black text-blue-400 tabular-nums">{attendanceReport.averageWorkingHours}h</div>
                            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Mission Efficiency</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Log Grid */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-10 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8 bg-slate-50/50">
                    <div>
                        <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                            <FaHistory className="text-blue-600" size={20} /> Deployment Registry
                        </h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2 italic">Institutional activity stream v4.0</p>
                    </div>

                    <div className="flex gap-4">
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="IDENTIFY PERSONNEL..."
                                className="pl-14 pr-6 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-blue-600 outline-none font-black text-[10px] tracking-widest w-72 transition-all group-hover:border-slate-200"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <MdPerson className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={20} />
                        </div>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-8 py-4 bg-white border-2 border-slate-100 rounded-2xl outline-none font-black text-[10px] tracking-widest uppercase cursor-pointer hover:border-slate-200 focus:border-blue-600 transition-all appearance-none"
                        >
                            <option value="all">ALL PROTOCOLS</option>
                            <option value="Present">PRESENT</option>
                            <option value="Absent">ABSENT</option>
                            <option value="Late">LATE</option>
                            <option value="Leave">LEAVE</option>
                        </select>
                        <button onClick={fetchProfileAndData} className="p-5 bg-white border-2 border-slate-100 hover:border-blue-600 text-slate-400 hover:text-blue-600 rounded-2xl transition-all shadow-sm">
                            <MdRefresh size={24} />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] bg-slate-50/30">
                                <th className="px-12 py-8">Faculty Identity</th>
                                <th className="px-12 py-8">Mission Status</th>
                                <th className="px-12 py-8">Point of Entry</th>
                                <th className="px-12 py-8">Point of Exit</th>
                                <th className="px-12 py-8 text-right">Deployment Chrono</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredAttendance.map((record) => (
                                <tr key={record._id} className="hover:bg-slate-50/50 transition-all group">
                                    <td className="px-12 py-8">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 rounded-[1.5rem] bg-gradient-to-br from-slate-700 to-slate-900 text-white flex items-center justify-center font-black text-xl shadow-lg group-hover:from-blue-600 group-hover:to-blue-800 transition-all duration-500">
                                                {record.teacherName.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-sm font-black text-slate-800 tracking-tight">{record.teacherName}</div>
                                                <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-1">Verified Institutional Unit</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-12 py-8">
                                        <span className={`px-5 py-2 rounded-xl border text-[9px] font-black uppercase tracking-widest ${statusMap[record.status] || 'bg-slate-50 text-slate-400'}`}>
                                            {record.status}
                                        </span>
                                    </td>
                                    <td className="px-12 py-8">
                                        <div className="text-sm font-black text-slate-700 italic tabular-nums">{record.checkIn || '00:00'}</div>
                                    </td>
                                    <td className="px-12 py-8">
                                        <div className="text-sm font-black text-slate-300 italic tabular-nums">{record.checkOut || '--:--'}</div>
                                    </td>
                                    <td className="px-12 py-8 text-right">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-4 py-1.5 rounded-full inline-block">
                                            {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredAttendance.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="5" className="py-32 text-center">
                                        <div className="flex flex-col items-center gap-6 opacity-20">
                                            <MdSchedule size={80} className="text-slate-400" />
                                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500">Log Synchronization Required: No Deployment Found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AttendanceTracker;