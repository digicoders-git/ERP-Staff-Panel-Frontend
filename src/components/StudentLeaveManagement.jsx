import React, { useState, useEffect } from 'react';
import { MdPerson, MdCalendarToday, MdNoteAdd, MdHistory, MdFilterList, MdCheckCircle, MdCancel, MdRefresh, MdPeople } from 'react-icons/md';
import { attendanceAPI, classAPI, studentAPI } from '../utils/apiService';
import { toast } from 'react-toastify';
import { FaSpinner, FaPaperPlane } from 'react-icons/fa';
import Swal from 'sweetalert2';

const StudentLeaveManagement = () => {
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [classes, setClasses] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [leaveList, setLeaveList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [newLeave, setNewLeave] = useState({
        studentId: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        reason: ''
    });

    useEffect(() => {
        fetchClasses();
        fetchRecentLeaves();
    }, []);

    const fetchClasses = async () => {
        try {
            const res = await classAPI.getAll();
            if (res.data && res.data.classes) setClasses(res.data.classes);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchStudents = async (cid, sid) => {
        if (!cid) return;
        try {
            setLoading(true);
            const res = await attendanceAPI.getStudents({ classId: cid, sectionId: sid });
            if (res.data && res.data.students) setStudents(res.data.students);
        } catch (err) {
            toast.error('Failed to load students');
        } finally {
            setLoading(false);
        }
    };

    const fetchRecentLeaves = async () => {
        try {
            setLoading(true);
            const res = await attendanceAPI.getAll({ type: 'student', status: 'leave', limit: 20 });
            if (res.data && res.data.attendance) setLeaveList(res.data.attendance);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleClassChange = (cid) => {
        setSelectedClass(cid);
        setSelectedSection('');
        setStudents([]);
        fetchStudents(cid, '');
    };

    const handleSectionChange = (sid) => {
        setSelectedSection(sid);
        fetchStudents(selectedClass, sid);
    };

    const handleApplyLeave = async (e) => {
        e.preventDefault();
        if (!newLeave.studentId) return toast.error('Please select a student');

        try {
            setSubmitting(true);
            
            // In a real system, we'd mark the date range. 
            // For now, we utilize the bulk mark API to record the leave for the selected dates.
            const start = new Date(newLeave.startDate);
            const end = new Date(newLeave.endDate);
            const cur = new Date(start);
            
            while (cur <= end) {
                const dateStr = cur.toISOString().split('T')[0];
                await attendanceAPI.mark({
                    date: dateStr,
                    type: 'student',
                    classId: selectedClass,
                    sectionId: selectedSection,
                    records: [{ studentId: newLeave.studentId, status: 'leave', remark: newLeave.reason }]
                });
                cur.setDate(cur.getDate() + 1);
            }

            toast.success('Leave recorded successfully');
            setNewLeave({ studentId: '', startDate: new Date().toISOString().split('T')[0], endDate: new Date().toISOString().split('T')[0], reason: '' });
            fetchRecentLeaves();
        } catch (err) {
            toast.error('Failed to record leave');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteLeave = async (id) => {
        const result = await Swal.fire({
            title: 'Delete Leave Record?',
            text: 'This will remove the leave entry from the attendance logs.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Yes, Delete'
        });

        if (result.isConfirmed) {
            try {
                setLoading(true);
                // In attendance API, we don't have a direct delete by ID necessarily, 
                // but we could set it back to absent/present or use a delete route if it exists.
                // For simplicity, let's assume we can delete by ID if the API supports it.
                await attendanceAPI.delete(id); 
                toast.success('Record removed');
                fetchRecentLeaves();
            } catch (err) {
                toast.error('Cannot remove record');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Simple Header */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-1.5 h-10 bg-blue-600 rounded-full" />
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Student Leave Management</h1>
                            <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-medium">Record and track student leave applications</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Apply Leave Form */}
                <div className="xl:col-span-1 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <MdNoteAdd className="text-blue-600" size={20} /> Record New Leave
                    </h3>
                    
                    <form onSubmit={handleApplyLeave} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Class</label>
                                <select 
                                    value={selectedClass} 
                                    onChange={(e) => handleClassChange(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-semibold text-sm outline-none focus:bg-white focus:border-blue-600 transition-all"
                                    required
                                >
                                    <option value="">Choose Class</option>
                                    {classes.map(c => <option key={c._id} value={c._id}>{c.className}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Section</label>
                                <select 
                                    value={selectedSection} 
                                    onChange={(e) => handleSectionChange(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-semibold text-sm outline-none focus:bg-white focus:border-blue-600 transition-all"
                                    disabled={!selectedClass}
                                >
                                    <option value="">All Sections</option>
                                    {classes.find(c => c._id === selectedClass)?.sections?.map(s => (
                                        <option key={s._id} value={s._id}>{s.sectionName}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Select Student</label>
                            <select 
                                value={newLeave.studentId}
                                onChange={(e) => setNewLeave({...newLeave, studentId: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-semibold text-sm outline-none focus:bg-white focus:border-blue-600 transition-all"
                                required
                                disabled={students.length === 0}
                            >
                                <option value="">Choose Student</option>
                                {students.map(s => <option key={s._id} value={s._id}>{s.firstName} {s.lastName} (Roll: {s.rollNumber})</option>)}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Start Date</label>
                                <input 
                                    type="date" 
                                    value={newLeave.startDate}
                                    onChange={(e) => setNewLeave({...newLeave, startDate: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-semibold text-sm outline-none focus:bg-white focus:border-blue-600 transition-all"
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">End Date</label>
                                <input 
                                    type="date" 
                                    value={newLeave.endDate}
                                    onChange={(e) => setNewLeave({...newLeave, endDate: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-semibold text-sm outline-none focus:bg-white focus:border-blue-600 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Reason</label>
                            <textarea 
                                value={newLeave.reason}
                                onChange={(e) => setNewLeave({...newLeave, reason: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-semibold text-sm outline-none focus:bg-white focus:border-blue-600 transition-all min-h-[80px]"
                                placeholder="Write reason here..."
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={submitting}
                            className="w-full bg-blue-600 hover:bg-slate-800 text-white h-[50px] rounded-xl font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2 mt-4"
                        >
                            {submitting ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
                            Save Leave Record
                        </button>
                    </form>
                </div>

                {/* Recent Leave History */}
                <div className="xl:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <MdHistory className="text-slate-400" size={20} /> Recent Leave Logs
                            </h3>
                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mt-1">Absence tracking history</p>
                        </div>
                        <button onClick={fetchRecentLeaves} className="p-2 bg-slate-50 hover:bg-slate-200 rounded-lg transition-all text-slate-600"><MdRefresh size={20} /></button>
                    </div>


                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                                    <th className="px-6 py-5">Student</th>
                                    <th className="px-6 py-5">Class</th>
                                    <th className="px-6 py-5">Date</th>
                                    <th className="px-6 py-5">Reason</th>
                                    <th className="px-6 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {leaveList.map((item) => (
                                    <tr key={item._id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm uppercase">
                                                    {(item.studentId?.firstName || 'S')[0]}
                                                </div>
                                                <div className="text-xs font-black text-slate-800 uppercase tracking-tight">
                                                    {item.studentId?.firstName} {item.studentId?.lastName}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest italic">{item.classId?.className}</span>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-2 text-slate-500 font-bold text-[10px] tabular-nums">
                                                <MdCalendarToday size={14} className="text-slate-300" />
                                                {new Date(item.date).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 font-medium text-[10px] text-slate-400 italic">
                                            <p className="max-w-[200px] truncate">{item.remark || 'No reason provided'}</p>
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <button 
                                                onClick={() => handleDeleteLeave(item._id)}
                                                className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                            >
                                                <MdCancel size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {leaveList.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="py-20 text-center text-slate-300 font-black text-[10px] uppercase tracking-widest">No Recent Leaves Recorded</td>
                                    </tr>
                                )}
                                
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentLeaveManagement;
