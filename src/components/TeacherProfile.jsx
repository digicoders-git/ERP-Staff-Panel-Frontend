import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaSpinner, FaHistory, FaEdit } from 'react-icons/fa';
import { MdPhone, MdEmail, MdSchool, MdSubject, MdLocationOn, MdAssignment, MdAttachMoney, MdCardMembership, MdClose, MdRefresh } from 'react-icons/md';
import { teacherAPI } from '../utils/apiService';
import { BASE_URL } from '../utils/api';
import { toast } from 'react-toastify';

const TeacherProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [teacher, setTeacher] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await teacherAPI.getById(id);
            const teacherData = res.data.data;
            setTeacher(teacherData);

            // Fetch attendance history
            const historyRes = await teacherAPI.getHistoryByName(teacherData.name);
            setHistory(historyRes.data.data || []);
        } catch (err) {
            console.error('Fetch error:', err);
            toast.error('Failed to load teacher profile');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[70vh] flex flex-col items-center justify-center gap-6">
                <FaSpinner className="animate-spin text-blue-600" size={48} />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">Loading Teacher Profile...</p>
            </div>
        );
    }

    if (!teacher) return null;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header / Back Navigation */}
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => navigate('/teacher-management')}
                    className="p-4 bg-white text-slate-600 rounded-2xl hover:bg-slate-100 transition-all shadow-sm border border-slate-100 active:scale-95 group"
                >
                    <FaChevronLeft className="group-hover:-translate-x-1 transition-transform" />
                </button>
                <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Teacher Profile</h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Teacher ID: {teacher._id}</p>
                </div>
            </div>

            {/* Profile Overview Card */}
            <div className="bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full -mr-64 -mt-64 blur-3xl" />
                <div className="relative p-12 flex flex-col md:flex-row items-center gap-10 text-white">
                    {/* Profile Image / Initials */}
                    <div className="w-32 h-32 md:w-48 md:h-48 rounded-[3rem] bg-gradient-to-br from-blue-600 to-indigo-700 p-1.5 shadow-2xl relative group overflow-hidden">
                        <div className="w-full h-full rounded-[2.8rem] bg-slate-900 flex items-center justify-center overflow-hidden border-4 border-slate-900">
                            {teacher.profileImage ? (
                                <img 
                                    src={teacher.profileImage.startsWith('http') 
                                        ? teacher.profileImage 
                                        : `${BASE_URL.replace(/\/$/, '')}/${teacher.profileImage.replace(/\\/g, '/').replace(/^\//, '')}`
                                    } 
                                    alt={teacher.name} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                />
                            ) : (
                                <span className="text-5xl font-black text-white">{teacher.name?.[0]}</span>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-6">
                        <div className="space-y-2">
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                                <h1 className="text-5xl font-black tracking-tighter">{teacher.name}</h1>
                                <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border max-w-fit mx-auto md:mx-0 ${
                                    teacher.status 
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
                                    : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                }`}>
                                    {teacher.status ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <p className="text-blue-400 text-sm font-bold tracking-wide uppercase italic opacity-80">{teacher.qualification || 'Qualification not listed'}</p>
                        </div>
                        
                        <div className="flex flex-wrap justify-center md:justify-start gap-3">
                            <div className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                                <MdEmail className="text-blue-400 text-lg" />
                                <span className="text-xs font-bold opacity-80">{teacher.email}</span>
                            </div>
                            <div className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                                <MdPhone className="text-emerald-400 text-lg" />
                                <span className="text-xs font-bold opacity-80">{teacher.mobile}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Institutional & Academic Details */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Institutional Card */}
                        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all">
                                    <MdAssignment size={24} />
                                </div>
                                <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">School Details</h4>
                            </div>
                            <div className="space-y-5">
                                <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100 flex justify-between items-center">
                                    <span className="text-[10px] font-black text-slate-400 uppercase">Assigned Class</span>
                                    <span className="text-xs font-black text-slate-800 uppercase tracking-tight">{teacher.assignedClass?.className || 'N/A'}</span>
                                </div>
                                <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100 flex justify-between items-center">
                                    <span className="text-[10px] font-black text-slate-400 uppercase">Assigned Section</span>
                                    <span className="text-xs font-black text-slate-800 uppercase tracking-tight">{teacher.assignedSection?.sectionName || 'N/A'}</span>
                                </div>
                                <div className="p-5 bg-blue-50/30 rounded-2xl border border-blue-100 flex justify-between items-center">
                                    <span className="text-[10px] font-black text-blue-400 uppercase">Primary Branch</span>
                                    <span className="text-xs font-black text-blue-600 uppercase tracking-tight">{teacher.branch?.branchName || 'Main Branch'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Specialization Card */}
                        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all">
                                    <MdSubject size={24} />
                                </div>
                                <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Qualification & Subjects</h4>
                            </div>
                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-[9px] font-black text-slate-400 uppercase mb-4 tracking-widest opacity-60">Verified Skills</p>
                                <div className="flex flex-wrap gap-2">
                                    {teacher.subjects?.map((s, i) => (
                                        <span key={i} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-tight shadow-lg shadow-indigo-100">
                                            {s}
                                        </span>
                                    ))}
                                    {(!teacher.subjects || teacher.subjects.length === 0) && (
                                        <span className="text-xs font-bold text-slate-300 italic uppercase">No specialization logged</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Attendance Logs Table */}
                    <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden group">
                        <div className="px-10 py-8 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center">
                                    <FaHistory size={16} />
                                </div>
                                <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em]">Attendance History</h4>
                            </div>
                            <button 
                                onClick={fetchData} 
                                className="p-3 text-slate-400 hover:text-blue-600 hover:rotate-180 transition-all duration-500"
                            >
                                <MdRefresh size={20} />
                            </button>
                        </div>
                        <div className="overflow-x-auto max-h-[500px]">
                            <table className="w-full text-left">
                                <thead className="sticky top-0 bg-white shadow-sm z-10">
                                    <tr className="border-b border-slate-50">
                                        <th className="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                        <th className="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                        <th className="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Hours</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {history.length > 0 ? history.map((log) => (
                                        <tr key={log._id} className="hover:bg-slate-50 transition-colors group/row">
                                            <td className="px-10 py-5">
                                                <p className="text-xs font-black text-slate-700 tabular-nums">
                                                    {new Date(log.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">{log.checkIn || '--:--'} - {log.checkOut || '--:--'}</p>
                                            </td>
                                            <td className="px-10 py-5">
                                                <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                                                    log.status === 'Present' ? 'bg-emerald-50 text-emerald-600' :
                                                    log.status === 'Absent' ? 'bg-rose-50 text-rose-600' :
                                                    'bg-amber-50 text-amber-600'
                                                }`}>
                                                    {log.status}
                                                </span>
                                            </td>
                                            <td className="px-10 py-5 text-right">
                                                <span className="text-xs font-black text-slate-800 tabular-nums">{log.workingHours?.toFixed(1) || '0.0'}</span>
                                                <span className="text-[9px] font-black text-slate-400 uppercase ml-1">Hrs</span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="3" className="py-24 text-center">
                                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] animate-pulse italic"> No Records Found </p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column: Meta & Location */}
                <div className="space-y-8">
                    {/* Financial Dossier */}
                    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                            <MdAttachMoney className="text-emerald-500" /> Salary Details
                        </h4>
                        <div className="space-y-6">
                            <div className="p-8 bg-emerald-50/50 rounded-[2.5rem] border border-emerald-100 flex flex-col items-center">
                                <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-2 opacity-70">Monthly Salary</p>
                                <p className="text-4xl font-black text-emerald-900 tabular-nums">₹{teacher.salary?.toLocaleString()}</p>
                            </div>
                            <div className="p-8 bg-slate-900 rounded-[2.5rem] flex flex-col items-center text-white">
                                <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-2">Total Experience</p>
                                <p className="text-3xl font-black tabular-nums">{teacher.experience || '0'} <span className="text-sm font-bold opacity-60">Years</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Spatial Residue (Location) */}
                    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-full -mr-12 -mt-12 opacity-50" />
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <MdLocationOn className="text-rose-500" /> Address
                        </h4>
                        <p className="text-xs font-bold text-slate-600 leading-relaxed uppercase tracking-tight italic">
                            {teacher.address || 'ADDRESS NOT LISTED'}
                        </p>
                    </div>

                    {/* Metadata Signature */}
                    <div className="p-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-[3rem] text-white shadow-xl shadow-blue-200">
                        <h4 className="text-[9px] font-black uppercase tracking-[0.3em] mb-8 opacity-60">System Info</h4>
                        <div className="space-y-6">
                            <div>
                                <p className="text-[8px] font-black uppercase opacity-60 mb-1">Date Joined</p>
                                <p className="text-xs font-black tracking-tight">{new Date(teacher.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                            </div>
                            <div className="pt-6 border-t border-white/10">
                                <p className="text-[8px] font-black uppercase opacity-60 mb-1">System ID</p>
                                <p className="text-[10px] font-black truncate tabular-nums opacity-80">{teacher._id}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Actions Bar */}
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-xl px-10 py-5 rounded-full shadow-2xl border border-slate-200 flex items-center gap-8 z-50">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest hidden md:block italic">Teacher Records v2.4.0</p>
                <div className="w-px h-6 bg-slate-200 hidden md:block" />
                <button 
                    onClick={() => navigate('/teacher-management')}
                    className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-800 transition-colors"
                >
                    Back to List
                </button>
            </div>
        </div>
    );
};

export default TeacherProfile;
