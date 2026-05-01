import React, { useState, useEffect } from 'react';
import { MdPerson, MdCalendarToday, MdNoteAdd, MdHistory, MdFilterList, MdCheckCircle, MdCancel, MdRefresh, MdPeople, MdDescription, MdPending, MdClose } from 'react-icons/md';
import { attendanceAPI, classAPI, studentAPI, leaveAPI } from '../utils/apiService';
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
        leaveType: 'Medical',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        reason: ''
    });

    const leaveTypes = ['Medical', 'Family Event', 'Marriage', 'Urgent Work', 'Others', 'Sick Leave', 'Casual Leave'];

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
            const res = await leaveAPI.getAll();
            if (res.data && res.data.leaves) {
                // Filter for leaves that have a studentId (student leaves)
                const studentLeaves = res.data.leaves.filter(l => l.studentId);
                setLeaveList(studentLeaves);
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to load leave applications');
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
            const student = students.find(s => s._id === newLeave.studentId);
            
            await leaveAPI.create({
                ...newLeave,
                studentName: student ? `${student.firstName} ${student.lastName}` : '',
                status: 'approved' // Staff recorded leaves are pre-approved
            });

            toast.success('Leave recorded successfully');
            setNewLeave({ studentId: '', leaveType: 'Medical', startDate: new Date().toISOString().split('T')[0], endDate: new Date().toISOString().split('T')[0], reason: '' });
            fetchRecentLeaves();
        } catch (err) {
            toast.error('Failed to record leave');
        } finally {
            setSubmitting(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        const action = status === 'approved' ? 'Approve' : 'Reject';
        const result = await Swal.fire({
            title: `${action} Leave?`,
            text: `Are you sure you want to ${status} this leave request?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: status === 'approved' ? '#10b981' : '#ef4444',
            confirmButtonText: `Yes, ${action}`
        });

        if (result.isConfirmed) {
            try {
                setLoading(true);
                await leaveAPI.updateStatus(id, status);
                toast.success(`Leave ${status} successfully`);
                fetchRecentLeaves();
            } catch (err) {
                toast.error('Failed to update status');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleDeleteLeave = async (id) => {
        const result = await Swal.fire({
            title: 'Delete Application?',
            text: 'This will permanently remove the leave application.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Yes, Delete'
        });

        if (result.isConfirmed) {
            try {
                setLoading(true);
                await leaveAPI.delete(id); 
                toast.success('Application deleted');
                fetchRecentLeaves();
            } catch (err) {
                toast.error('Failed to delete application');
            } finally {
                setLoading(false);
            }
        }
    };

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'rejected': return 'bg-rose-100 text-rose-700 border-rose-200';
            default: return 'bg-slate-100 text-slate-500 border-slate-200';
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
                            <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-medium">Approve and track student absence requests</p>
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

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Leave Type</label>
                            <select 
                                value={newLeave.leaveType}
                                onChange={(e) => setNewLeave({...newLeave, leaveType: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-semibold text-sm outline-none focus:bg-white focus:border-blue-600 transition-all"
                                required
                            >
                                {leaveTypes.map(t => <option key={t} value={t}>{t}</option>)}
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
                                <MdHistory className="text-slate-400" size={20} /> Leave Applications
                            </h3>
                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mt-1">Pending and recent requests</p>
                        </div>
                        <button onClick={fetchRecentLeaves} className="p-2 bg-slate-50 hover:bg-slate-200 rounded-lg transition-all text-slate-600"><MdRefresh size={20} /></button>
                    </div>


                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                                    <th className="px-6 py-5">Student</th>
                                    <th className="px-6 py-5">Leave Type</th>
                                    <th className="px-6 py-5 text-center">Dates</th>
                                    <th className="px-6 py-5">Status</th>
                                    <th className="px-6 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {leaveList.map((item) => (
                                    <tr key={item._id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm uppercase">
                                                    {(item.studentName || item.studentId?.firstName || 'S')[0]}
                                                </div>
                                                <div>
                                                    <div className="text-xs font-black text-slate-800 uppercase tracking-tight">
                                                        {item.studentName || `${item.studentId?.firstName} ${item.studentId?.lastName}`}
                                                    </div>
                                                    <div className="text-[8px] font-bold text-slate-400 uppercase">Roll: {item.studentId?.rollNumber || 'N/A'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="text-[10px] font-black text-slate-600 uppercase">{item.leaveType}</div>
                                            <div className="text-[9px] text-slate-400 italic truncate max-w-[100px]">{item.reason}</div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex flex-col items-center gap-1 text-slate-500 font-bold text-[9px] tabular-nums">
                                                <span>{new Date(item.startDate).toLocaleDateString()}</span>
                                                <span className="text-slate-300">to</span>
                                                <span>{new Date(item.endDate).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(item.status)}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                {item.status === 'pending' && (
                                                    <>
                                                        <button 
                                                            onClick={() => handleStatusUpdate(item._id, 'approved')}
                                                            className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all"
                                                            title="Approve"
                                                        >
                                                            <MdCheckCircle size={18} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleStatusUpdate(item._id, 'rejected')}
                                                            className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition-all"
                                                            title="Reject"
                                                        >
                                                            <MdCancel size={18} />
                                                        </button>
                                                    </>
                                                )}
                                                <button 
                                                    onClick={() => handleDeleteLeave(item._id)}
                                                    className="p-2 text-slate-300 hover:text-slate-600 transition-all"
                                                    title="Delete"
                                                >
                                                    <MdClose size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {leaveList.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="py-20 text-center text-slate-300 font-black text-[10px] uppercase tracking-widest">No Student Leaves Found</td>
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
