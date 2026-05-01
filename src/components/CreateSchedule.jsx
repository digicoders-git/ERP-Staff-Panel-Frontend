import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaCalendarAlt, FaClock, FaDoorOpen, FaUserTie, FaSave, FaPrint, FaEnvelope } from 'react-icons/fa';
import { MdClose, MdDelete } from 'react-icons/md';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { examAPI, classAPI, teacherAPI } from '../utils/apiService';
import ExamTimetablePrint from './ExamTimetablePrint';
import Swal from 'sweetalert2';

const CreateSchedule = () => {
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [schedules, setSchedules] = useState([]);
    const [classesList, setClassesList] = useState([]);
    const [sectionsList, setSectionsList] = useState([]);
    const [teachersList, setTeachersList] = useState([]);
    const [examTypesList, setExamTypesList] = useState([]);
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [filteredSchedules, setFilteredSchedules] = useState([]);

    const [commonData, setCommonData] = useState({
        examTypeId: '',
        examType: '',
        classId: '',
        sectionId: '',
        roomHall: '',
        invigilatorName: '',
        totalMarks: 100,
        passingMarks: 33
    });

    const [subjects, setSubjects] = useState([
        { subject: '', examDate: '', startTime: '', endTime: '' }
    ]);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const staff = JSON.parse(localStorage.getItem('staff') || '{}');
            const branchId = staff.branch?._id || staff.branch;

            const [classesRes, schedRes, teachersRes, examTypesRes] = await Promise.all([
                classAPI.getAll(),
                examAPI.getSchedules(),
                teacherAPI.getAll(),
                api.get(`/api/staff-panel/exam/exam-types?branchId=${branchId}`)
            ]);
            
            if (classesRes.data?.classes) setClassesList(classesRes.data.classes);
            if (schedRes.data?.examSchedules) setSchedules(schedRes.data.examSchedules);
            if (teachersRes.data) {
                const teachers = teachersRes.data.data?.teachers || teachersRes.data.teachers || [];
                setTeachersList(teachers);
            }
            if (examTypesRes.data?.data) {
                setExamTypesList(examTypesRes.data.data);
            }
        } catch (err) {
            console.error('Error fetching data:', err);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const fetchSections = async (classId) => {
        try {
            const res = await classAPI.getById(classId);
            const sections = res.data?.class?.sections || res.data?.sections || [];
            setSectionsList(sections);
        } catch {
            setSectionsList([]);
        }
    };

    const handleClassChange = (classId) => {
        setCommonData({ ...commonData, classId, sectionId: '' });
        if (classId) fetchSections(classId);
        else setSectionsList([]);
    };

    const handleExamTypeChange = (examTypeId) => {
        const selectedExamType = examTypesList.find(et => et._id === examTypeId);
        if (selectedExamType) {
            setCommonData(prev => ({
                ...prev,
                examTypeId,
                examType: selectedExamType.examTypeName,
                totalMarks: selectedExamType.totalMarks || 100,
                passingMarks: Math.ceil((selectedExamType.totalMarks || 100) * (selectedExamType.passingPercentage || 33) / 100)
            }));
        }
    };

    const handleGenerateTimetable = () => {
        setFilteredSchedules(schedules);
        setShowPrintModal(true);
    };

    const handleBulkNotify = async () => {
        const result = await Swal.fire({
            title: 'Send Notification?',
            text: 'Send this exam schedule to all students and parents?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Send'
        });
        if (result.isConfirmed) {
            toast.success('Notifications sent to students and parents!');
        }
    };

    const addSubjectRow = () => {
        setSubjects([...subjects, { subject: '', examDate: '', startTime: '', endTime: '' }]);
    };

    const removeSubjectRow = (index) => {
        if (subjects.length > 1) {
            setSubjects(subjects.filter((_, i) => i !== index));
        }
    };

    const handleSubjectChange = (index, field, value) => {
        const newSubjects = [...subjects];
        newSubjects[index][field] = value;
        setSubjects(newSubjects);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            
            const payload = {
                ...commonData,
                subjects: subjects
            };

            await api.post('/api/staff-panel/exam-schedule/bulk', payload);
            toast.success('Bulk schedule created successfully');
            
            setShowForm(false);
            setSubjects([{ subject: '', examDate: '', startTime: '', endTime: '' }]);
            fetchInitialData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save bulk schedule');
        } finally {
            setLoading(false);
        }
    };

    const inputCls = "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 font-medium text-slate-700 transition-all text-xs";
    const labelCls = "block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1";

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div>
                    <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Bulk Exam Scheduler</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Authorized Schedule Protocol</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleGenerateTimetable}
                        className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl active:scale-95"
                    >
                        <FaPrint size={14} /> Official Date-Sheet
                    </button>
                    <button
                        onClick={handleBulkNotify}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl active:scale-95"
                    >
                        <FaEnvelope size={14} /> Send to Parents
                    </button>
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl active:scale-95"
                    >
                        <FaPlus size={14} /> Create Bulk Timetable
                    </button>
                </div>
            </div>

            {/* List Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest">
                            <tr>
                                <th className="px-6 py-4">Exam Type</th>
                                <th className="px-6 py-4">Class</th>
                                <th className="px-6 py-4">Subject</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Time</th>
                                <th className="px-6 py-4">Room</th>
                                <th className="px-6 py-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {schedules.map((s, i) => (
                                <tr key={i} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-black text-indigo-600 text-xs">{s.examType}</td>
                                    <td className="px-6 py-4 font-bold text-slate-700 text-xs">{s.class?.className}</td>
                                    <td className="px-6 py-4 font-bold text-slate-800 text-xs">{s.subject}</td>
                                    <td className="px-6 py-4 text-xs font-medium text-slate-500">{s.examDate?.split('T')[0]}</td>
                                    <td className="px-6 py-4 text-xs font-medium text-slate-500">{s.startTime} - {s.endTime}</td>
                                    <td className="px-6 py-4 text-xs font-medium text-slate-500">{s.roomHall}</td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => api.delete(`/api/staff-panel/exam-schedule/${s._id}`).then(fetchInitialData)} className="text-red-400 hover:text-red-600"><FaTrash /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Bulk Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-6xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
                        <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
                            <h3 className="text-xl font-black uppercase tracking-tight">Create Timetable (Bulk Mode)</h3>
                            <button onClick={() => setShowForm(false)} className="p-2 hover:bg-white/20 rounded-lg"><MdClose size={24} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto">
                            {/* Common Data */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                <div className="space-y-1">
                                    <label className={labelCls}>Exam Type</label>
                                    <select className={inputCls} value={commonData.examTypeId} onChange={e => handleExamTypeChange(e.target.value)} required>
                                        <option value="">Select Exam</option>
                                        {examTypesList.map(et => <option key={et._id} value={et._id}>{et.examTypeName}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className={labelCls}>Class</label>
                                    <select className={inputCls} value={commonData.classId} onChange={e => handleClassChange(e.target.value)} required>
                                        <option value="">Select Class</option>
                                        {classesList.map(c => <option key={c._id} value={c._id}>{c.className}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className={labelCls}>Section</label>
                                    <select className={inputCls} value={commonData.sectionId} onChange={e => setCommonData({...commonData, sectionId: e.target.value})} required>
                                        <option value="">Select Section</option>
                                        {sectionsList.map(s => <option key={s._id} value={s._id}>{s.sectionName}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className={labelCls}>Common Room</label>
                                    <input type="text" className={inputCls} value={commonData.roomHall} onChange={e => setCommonData({...commonData, roomHall: e.target.value})} placeholder="Room No" />
                                </div>
                            </div>

                            {/* Subjects Table */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-4">
                                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Timetable Slots</h4>
                                    <button type="button" onClick={addSubjectRow} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                        <FaPlus /> Add More Subject
                                    </button>
                                </div>

                                <div className="border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b">
                                            <tr>
                                                <th className="px-6 py-4">Subject Name</th>
                                                <th className="px-6 py-4">Exam Date</th>
                                                <th className="px-6 py-4">Start Time</th>
                                                <th className="px-6 py-4">End Time</th>
                                                <th className="px-6 py-4 w-10 text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {subjects.map((sub, i) => (
                                                <tr key={i}>
                                                    <td className="p-2"><input type="text" className={inputCls} value={sub.subject} onChange={e => handleSubjectChange(i, 'subject', e.target.value)} placeholder="e.g. Science" required /></td>
                                                    <td className="p-2"><input type="date" className={inputCls} value={sub.examDate} onChange={e => handleSubjectChange(i, 'examDate', e.target.value)} required /></td>
                                                    <td className="p-2"><input type="time" className={inputCls} value={sub.startTime} onChange={e => handleSubjectChange(i, 'startTime', e.target.value)} required /></td>
                                                    <td className="p-2"><input type="time" className={inputCls} value={sub.endTime} onChange={e => handleSubjectChange(i, 'endTime', e.target.value)} required /></td>
                                                    <td className="p-2 text-center">
                                                        <button type="button" onClick={() => removeSubjectRow(i)} className="p-2 text-slate-300 hover:text-red-500"><MdDelete size={20} /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-6 border-t">
                                <button type="button" onClick={() => setShowForm(false)} className="px-8 py-3 text-slate-400 font-black text-[10px] uppercase">Cancel</button>
                                <button type="submit" disabled={loading} className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-100 disabled:opacity-50">
                                    {loading ? 'Creating...' : 'Initialize All Schedules'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Timetable Print Modal */}
            {showPrintModal && (
                <ExamTimetablePrint 
                    schedules={filteredSchedules}
                    examType={commonData.examType}
                    onClose={() => setShowPrintModal(false)}
                />
            )}
        </div>
    );
};

export default CreateSchedule;
