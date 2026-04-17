import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaFileAlt, FaUserGraduate, FaCalendarAlt } from 'react-icons/fa';
import { MdHistory, MdFilterList } from 'react-icons/md';
import { toast } from 'react-toastify';
import { examAPI, classAPI } from '../utils/apiService';

const MarksHistory = () => {
    const [loading, setLoading] = useState(false);
    const [marksHistory, setMarksHistory] = useState([]);
    const [classesList, setClassesList] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [marksRes, classRes] = await Promise.all([
                examAPI.getMarksHistory({ limit: 1000 }),
                classAPI.getAll()
            ]);
            
            const marks = marksRes.data?.marks || [];
            console.log('Fetched marks:', marks);
            setMarksHistory(marks);
            if (classRes.data?.classes) setClassesList(classRes.data.classes);
        } catch (err) {
            console.error('Marks fetch error:', err);
            toast.error('Failed to load marks history');
        } finally {
            setLoading(false);
        }
    };

    const getGradeInfo = (pct) => {
        if (pct >= 90) return { grade: 'A+', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' };
        if (pct >= 80) return { grade: 'A', color: 'text-emerald-500 bg-emerald-50 border-emerald-50' };
        if (pct >= 70) return { grade: 'B+', color: 'text-blue-600 bg-blue-50 border-blue-100' };
        if (pct >= 60) return { grade: 'B', color: 'text-blue-500 bg-blue-50 border-blue-50' };
        if (pct >= 50) return { grade: 'C', color: 'text-amber-600 bg-amber-50 border-amber-100' };
        if (pct >= 33) return { grade: 'D', color: 'text-orange-600 bg-orange-50 border-orange-100' };
        return { grade: 'F', color: 'text-rose-600 bg-rose-50 border-rose-100' };
    };

    const filteredHistory = marksHistory.filter(m => {
        const studentName = `${m.student?.firstName} ${m.student?.lastName}`.toLowerCase();
        const matchesSearch = studentName.includes(searchTerm.toLowerCase());
        const classId = m.student?.class?._id || m.student?.class;
        const matchesGrade = !selectedGrade || classId === selectedGrade;
        return matchesSearch && matchesGrade;
    });

    const inputCls = "px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 text-sm font-medium transition-all text-slate-700 shadow-sm";

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Filter Navigation */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                        <MdHistory size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Marks Archive</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Historical Performance Registry</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                        <input
                            type="text"
                            placeholder="Find student..."
                            className={`${inputCls} pl-10 w-full md:w-64`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3 flex-1 md:flex-none">
                        <MdFilterList size={20} className="text-slate-300" />
                        <select
                            className={`${inputCls} flex-1 md:w-48`}
                            value={selectedGrade}
                            onChange={(e) => setSelectedGrade(e.target.value)}
                        >
                            <option value="">All Grades</option>
                            {classesList.map(c => <option key={c._id} value={c._id}>Grade {c.className}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Main Registry Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                {['Student Identity', 'Assessment Source', 'Subject', 'Score Metric', 'Tier', 'Decision'].map(h => (
                                    <th key={h} className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredHistory.map((m) => {
                                const sched = m.examSchedule || {};
                                const totalMarks = sched.totalMarks || m.totalMarks || 100;
                                const pct = (m.marksObtained / totalMarks) * 100;
                                const grade = getGradeInfo(pct);
                                const passed = m.marksObtained >= (sched.passingMarks || m.grade === 'Pass' || 33);

                                return (
                                    <tr key={m._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center font-black text-indigo-400 text-xs">
                                                    {m.student?.firstName?.[0]}{m.student?.lastName?.[0]}
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-800 text-sm uppercase">{m.student?.firstName} {m.student?.lastName}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Roll: {m.student?.rollNumber || '—'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="space-y-1">
                                                <p className="text-xs font-black text-slate-600 uppercase">{sched.examName || m.examName || 'General Exam'}</p>
                                                <p className="text-[9px] font-bold text-indigo-500 uppercase flex items-center gap-1">
                                                    <FaCalendarAlt size={8} /> {sched.date?.split('T')[0] || m.createdAt?.split('T')[0] || '—'}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-tight italic">
                                                {sched.subject || m.subject || '—'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col">
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-lg font-black text-slate-800">{m.marksObtained}</span>
                                                    <span className="text-[10px] font-bold text-slate-300">/ {totalMarks}</span>
                                                </div>
                                                <div className="w-20 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                                                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min(pct, 100)}%` }} />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase border ${grade.color}`}>
                                                {grade.grade}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-[2rem] text-[10px] font-black uppercase tracking-widest ${
                                                passed ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                                            }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${passed ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`} />
                                                {passed ? 'Qualified' : 'Deficient'}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredHistory.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="py-24 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-20">
                                            <FaFileAlt size={64} />
                                            <p className="font-black text-sm uppercase tracking-widest">No Historical Data Records</p>
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

export default MarksHistory;
