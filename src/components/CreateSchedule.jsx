import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaCalendarAlt, FaClock, FaDoorOpen, FaUserTie } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import { toast } from 'react-toastify';
import { examAPI, classAPI, teacherAPI } from '../utils/apiService';

const CreateSchedule = () => {
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [schedules, setSchedules] = useState([]);
    const [classesList, setClassesList] = useState([]);
    const [sectionsList, setSectionsList] = useState([]);
    const [teachersList, setTeachersList] = useState([]);

    const [formData, setFormData] = useState({
        examTitle: '',
        examType: '',
        classId: '',
        sectionId: '',
        subject: '',
        examDate: '',
        startTime: '',
        endTime: '',
        roomHall: '',
        invigilatorName: '',
        totalMarks: '',
        passingMarks: '',
        specialInstructions: ''
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [classesRes, schedRes, teachersRes] = await Promise.all([
                classAPI.getAll(),
                examAPI.getSchedules(),
                teacherAPI.getAll()
            ]);
            if (classesRes.data?.classes) setClassesList(classesRes.data.classes);
            if (schedRes.data?.examSchedules) setSchedules(schedRes.data.examSchedules);
            if (teachersRes.data) {
                const teachers = teachersRes.data.data?.teachers || teachersRes.data.teachers || [];
                setTeachersList(teachers);
            }
        } catch (err) {
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
        setFormData({ ...formData, classId, sectionId: '' });
        if (classId) fetchSections(classId);
        else setSectionsList([]);
    };

    const resetForm = () => setFormData({
        examTitle: '', examType: '', classId: '', sectionId: '',
        subject: '', examDate: '', startTime: '', endTime: '',
        roomHall: '', invigilatorName: '', totalMarks: '', passingMarks: '',
        specialInstructions: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (editingSchedule) {
                await examAPI.updateSchedule(editingSchedule._id, formData);
                toast.success('Schedule updated');
            } else {
                await examAPI.createSchedule(formData);
                toast.success('Schedule created');
            }
            setShowForm(false);
            resetForm();
            setEditingSchedule(null);
            fetchInitialData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save schedule');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (schedule) => {
        setEditingSchedule(schedule);
        const cid = schedule.class?._id || schedule.class;
        setFormData({
            examTitle: schedule.examTitle,
            examType: schedule.examType,
            classId: cid,
            sectionId: schedule.section?._id || schedule.section,
            subject: schedule.subject,
            examDate: schedule.examDate?.split('T')[0],
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            roomHall: schedule.roomHall,
            invigilatorName: schedule.invigilatorName,
            totalMarks: schedule.totalMarks,
            passingMarks: schedule.passingMarks,
            specialInstructions: schedule.specialInstructions
        });
        if (cid) fetchSections(cid);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await examAPI.deleteSchedule(id);
            toast.success('Deleted successfully');
            fetchInitialData();
        } catch {
            toast.error('Delete failed');
        }
    };

    const getDayName = (date) => {
        if (!date) return '—';
        return new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
    };

    const inputCls = "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 font-medium text-slate-700 transition-all text-sm";
    const labelCls = "block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1";

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div>
                    <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Examination Timetable</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Authorized Schedule Protocol</p>
                </div>
                <button
                    onClick={() => { resetForm(); setEditingSchedule(null); setShowForm(true); }}
                    className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl active:scale-95"
                >
                    <FaPlus size={14} /> Add New Slot
                </button>
            </div>

            {/* Table Area */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900">
                                {['#', 'Date & Day', 'Subject', 'Grade', 'Duration', 'Invigilator', 'Room', 'Actions'].map(h => (
                                    <th key={h} className="px-6 py-4 text-[10px] font-black text-indigo-200 uppercase tracking-widest border-r border-white/5 last:border-r-0">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {schedules.map((s, idx) => (
                                <tr key={s._id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 text-xs font-black text-slate-400 italic">{(idx + 1).toString().padStart(2, '0')}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-slate-800 uppercase">{s.examDate?.split('T')[0]}</span>
                                            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-tighter">{getDayName(s.examDate)}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-black uppercase tracking-tight">{s.subject}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-slate-600 italic">Grade {s.class?.className || 'N/A'}</span>
                                            <span className="text-[10px] font-medium text-slate-400 leading-none">{s.section?.sectionName || 'All'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <FaClock size={12} className="opacity-30" />
                                            <span className="text-xs font-bold">{s.startTime} — {s.endTime}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">{s.invigilatorName || '—'}</td>
                                    <td className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">{s.roomHall || '—'}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleEdit(s)} className="p-2.5 bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-indigo-400 rounded-xl transition-all border border-slate-100"><FaEdit size={14} /></button>
                                            <button onClick={() => handleDelete(s._id)} className="p-2.5 bg-rose-50 text-rose-300 hover:bg-rose-500 hover:text-white rounded-xl transition-all border border-rose-100"><FaTrash size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="bg-slate-900 p-8 text-white flex justify-between items-center shrink-0">
                            <div>
                                <h3 className="text-2xl font-black uppercase tracking-tight">{editingSchedule ? 'Edit Slot' : 'New Schedule Slot'}</h3>
                                <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mt-1">Registry Entry Protocol</p>
                            </div>
                            <button onClick={() => setShowForm(false)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"><MdClose size={24} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="md:col-span-2 space-y-2">
                                    <label className={labelCls}>Exam Title</label>
                                    <input type="text" className={inputCls} value={formData.examTitle} onChange={e => setFormData({...formData, examTitle: e.target.value})} placeholder="e.g. Mid-Term Assessment" required />
                                </div>
                                <div className="space-y-2">
                                    <label className={labelCls}>Subject</label>
                                    <input type="text" className={inputCls} value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} placeholder="Mathematics" required />
                                </div>
                                <div className="space-y-2">
                                    <label className={labelCls}>Grade / Class</label>
                                    <select className={inputCls} value={formData.classId} onChange={e => handleClassChange(e.target.value)} required>
                                        <option value="">Select Class</option>
                                        {classesList.map(c => <option key={c._id} value={c._id}>{c.className}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className={labelCls}>Section</label>
                                    <select className={inputCls} value={formData.sectionId} onChange={e => setFormData({...formData, sectionId: e.target.value})}>
                                        <option value="">Select Section</option>
                                        {sectionsList.map(s => <option key={s._id} value={s._id}>{s.sectionName}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className={labelCls}>Exam Date</label>
                                    <input type="date" className={inputCls} value={formData.examDate} onChange={e => setFormData({...formData, examDate: e.target.value})} required />
                                </div>
                                <div className="space-y-2">
                                    <label className={labelCls}>Start Time</label>
                                    <input type="time" className={inputCls} value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} required />
                                </div>
                                <div className="space-y-2">
                                    <label className={labelCls}>End Time</label>
                                    <input type="time" className={inputCls} value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} required />
                                </div>
                                <div className="space-y-2">
                                    <label className={labelCls}>Room / Hall</label>
                                    <input type="text" className={inputCls} value={formData.roomHall} onChange={e => setFormData({...formData, roomHall: e.target.value})} placeholder="Hall A-1" required />
                                </div>
                                <div className="space-y-2">
                                    <label className={labelCls}>Invigilator</label>
                                    <select className={inputCls} value={formData.invigilatorName} onChange={e => setFormData({...formData, invigilatorName: e.target.value})} required>
                                        <option value="">Select Staff</option>
                                        {teachersList.map(t => <option key={t._id} value={t.name}>{t.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className={labelCls}>Total Marks</label>
                                    <input type="number" className={inputCls} value={formData.totalMarks} onChange={e => setFormData({...formData, totalMarks: e.target.value})} required />
                                </div>
                                <div className="space-y-2">
                                    <label className={labelCls}>Passing Marks</label>
                                    <input type="number" className={inputCls} value={formData.passingMarks} onChange={e => setFormData({...formData, passingMarks: e.target.value})} required />
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end gap-4">
                                <button type="button" onClick={() => setShowForm(false)} className="px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">Cancel</button>
                                <button type="submit" className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-indigo-200 active:scale-95 transition-all">
                                    {editingSchedule ? 'Commit Changes' : 'Initialize Slot'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateSchedule;
