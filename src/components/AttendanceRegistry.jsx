import React, { useState, useEffect } from 'react';
import { 
    MdPeople, MdSchool, MdCheckCircle, MdCancel, MdSchedule, 
    MdSave, MdRefresh, MdClass, MdFilterList, MdErrorOutline 
} from 'react-icons/md';
import { attendanceAPI, classAPI } from '../utils/apiService';
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';

const AttendanceRegistry = () => {
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [students, setStudents] = useState([]);
    const [attendanceData, setAttendanceData] = useState({}); // { studentId: status }
    const [stats, setStats] = useState({ present: 0, absent: 0, late: 0, total: 0 });

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            setLoading(true);
            const res = await classAPI.getAll();
            if (res.data && res.data.classes) {
                setClasses(res.data.classes);
            }
        } catch (err) {
            toast.error('Failed to initialize classroom matrix');
        } finally {
            setLoading(false);
        }
    };

    const handleFetchStudents = async () => {
        if (!selectedClass) return toast.warning('Select targeted Class');
        
        try {
            setLoading(true);
            const params = { classId: selectedClass, sectionId: selectedSection };
            const [studentRes, existingRes] = await Promise.all([
                attendanceAPI.getStudents(params),
                attendanceAPI.getByDate({ ...params, date: selectedDate, type: 'student' })
            ]);

            if (studentRes.data && studentRes.data.students) {
                const studentList = studentRes.data.students;
                setStudents(studentList);
                
                // Initialize attendance data with existing records or default to 'present'
                const initialData = {};
                studentList.forEach(s => {
                    const existing = existingRes.data?.attendance?.find(a => a.studentId?._id === s._id);
                    initialData[s._id] = existing ? existing.status : 'present';
                });
                setAttendanceData(initialData);
                calculateStats(initialData, studentList.length);
            }
        } catch (err) {
            toast.error('Terminal synchronization failure');
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (data, total) => {
        const counts = Object.values(data).reduce((acc, status) => {
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, { present: 0, absent: 0, late: 0 });
        setStats({ ...counts, total });
    };

    const handleStatusChange = (studentId, status) => {
        const newData = { ...attendanceData, [studentId]: status };
        setAttendanceData(newData);
        calculateStats(newData, students.length);
    };

    const handleMarkAll = (status) => {
        const newData = {};
        students.forEach(s => newData[s._id] = status);
        setAttendanceData(newData);
        calculateStats(newData, students.length);
    };

    const handleSubmit = async () => {
        if (students.length === 0) return;
        
        try {
            setSubmitting(true);
            const records = Object.keys(attendanceData).map(id => ({
                studentId: id,
                status: attendanceData[id]
            }));

            const payload = {
                date: selectedDate,
                type: 'student',
                classId: selectedClass,
                sectionId: selectedSection,
                records: records
            };

            await attendanceAPI.mark(payload);
            toast.success('Attendance Saved Successfully');
        } catch (err) {
            toast.error('Failed to save attendance');
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusBtnCls = (current, target, activeColor) => {
        const base = "flex-1 py-3 px-4 rounded-xl font-black text-[9px] uppercase tracking-tighter transition-all flex items-center justify-center gap-2 border-2 ";
        if (current === target) {
            return base + `${activeColor} border-transparent shadow-lg scale-105 z-10`;
        }
        return base + "bg-white text-slate-400 border-slate-100 hover:border-slate-200 hover:text-slate-600";
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Control Panel */}
            <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full -mr-40 -mt-40 transition-all group-hover:scale-110 duration-1000" />
                
                <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic flex items-center gap-4">
                            <div className="w-2 h-10 bg-blue-500 rounded-full" />
                            Mark Attendance
                        </h1>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-3">Daily Student Attendance Registry</p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full lg:w-auto">
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-3">Select Date</label>
                            <input 
                                type="date" 
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-black text-xs outline-none focus:bg-white/10 transition-all"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-3">Select Class</label>
                            <select 
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-black text-xs outline-none focus:bg-white/10 transition-all appearance-none"
                            >
                                <option value="" className="bg-slate-900">Choose Class</option>
                                {classes.map(c => <option key={c._id} value={c._id} className="bg-slate-900">{c.className}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-3">Select Section</label>
                            <select 
                                value={selectedSection}
                                onChange={(e) => setSelectedSection(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-black text-xs outline-none focus:bg-white/10 transition-all appearance-none"
                                disabled={!selectedClass}
                            >
                                <option value="" className="bg-slate-900">All Sections</option>
                                {classes.find(c => c._id === selectedClass)?.sections?.map(s => (
                                    <option key={s._id} value={s._id} className="bg-slate-900">{s.sectionName}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button 
                                onClick={handleFetchStudents}
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-white text-white hover:text-black h-[58px] rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-3"
                            >
                                {loading ? <FaSpinner className="animate-spin" /> : <MdRefresh size={20} />}
                                Fetch Students
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {students.length > 0 ? (
                <div className="space-y-8">
                    {/* Stats HUD */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { label: 'Total Students', val: stats.total, color: 'text-slate-800', bg: 'bg-white', icon: MdPeople },
                            { label: 'Present', val: stats.present, color: 'text-emerald-500', bg: 'bg-emerald-50/50', icon: MdCheckCircle },
                            { label: 'Absent', val: stats.absent, color: 'text-rose-500', bg: 'bg-rose-50/50', icon: MdCancel },
                            { label: 'Late', val: stats.late, color: 'text-amber-500', bg: 'bg-amber-50/50', icon: MdSchedule }
                        ].map((s, i) => (
                            <div key={i} className={`${s.bg} p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between shadow-sm`}>
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                                    <p className={`text-3xl font-black ${s.color} tracking-tighter tabular-nums`}>{s.val}</p>
                                </div>
                                <div className={`${s.color} opacity-20`}>
                                    <s.icon size={44} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bulk Actions */}
                    <div className="flex gap-4">
                        <button onClick={() => handleMarkAll('present')} className="px-6 py-3 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all">Mark All Present</button>
                        <button onClick={() => handleMarkAll('absent')} className="px-6 py-3 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all">Mark All Absent</button>
                    </div>

                    {/* Student Matrix */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {students.map((student, idx) => (
                            <div key={student._id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col sm:flex-row items-center gap-8">
                                <div className="flex items-center gap-6 flex-1">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-2xl shadow-lg relative group-hover:scale-105 transition-transform">
                                        {student.firstName[0]}
                                        <div className="absolute -top-2 -left-2 w-6 h-6 bg-blue-600 rounded-lg text-[10px] flex items-center justify-center border-2 border-white">
                                            {idx + 1}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-slate-800 tracking-tight uppercase leading-tight group-hover:text-blue-600 transition-colors">
                                            {student.firstName} {student.lastName}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Roll: {student.rollNumber || 'N/A'}</span>
                                            <div className="w-1 h-1 bg-slate-200 rounded-full" />
                                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Student</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 w-full sm:w-auto p-1 bg-slate-50 rounded-[1.25rem] border border-slate-100">
                                    <button 
                                        onClick={() => handleStatusChange(student._id, 'present')}
                                        className={getStatusBtnCls(attendanceData[student._id], 'present', 'bg-emerald-500 text-white')}
                                    >
                                        Present
                                    </button>
                                    <button 
                                        onClick={() => handleStatusChange(student._id, 'absent')}
                                        className={getStatusBtnCls(attendanceData[student._id], 'absent', 'bg-rose-500 text-white')}
                                    >
                                        Absent
                                    </button>
                                    <button 
                                        onClick={() => handleStatusChange(student._id, 'late')}
                                        className={getStatusBtnCls(attendanceData[student._id], 'late', 'bg-amber-500 text-white')}
                                    >
                                        Late
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer Action */}
                    <div className="sticky bottom-8 left-0 right-0 flex justify-center pb-8 z-40 pointer-events-none">
                        <button 
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="pointer-events-auto px-16 py-6 bg-slate-900 hover:bg-black text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] transition-all shadow-2xl flex items-center gap-4 active:scale-95 border-4 border-white ring-8 ring-slate-900/5"
                        >
                            {submitting ? <FaSpinner className="animate-spin text-xl" /> : <MdSave size={24} />}
                            Submit Attendance
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-white py-40 rounded-[3.5rem] border border-slate-100 flex flex-col items-center justify-center text-center px-10">
                    <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mb-10 border border-slate-100">
                        <MdFilterList size={60} className="text-slate-200" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Select Class & Section</h2>
                    <p className="max-w-md text-[10px] font-black text-slate-400 uppercase tracking-widest leading-loose mt-4">
                        Please select class parameters and click fetch students to begin marking attendance.
                    </p>
                    <div className="mt-12 flex gap-4">
                        <div className="flex items-center gap-3 px-6 py-3 bg-blue-50 rounded-2xl">
                            <MdClass className="text-blue-600" />
                            <span className="text-[10px] font-black text-blue-800 uppercase tracking-widest italic">Choose Class</span>
                        </div>
                        <div className="flex items-center gap-3 px-6 py-3 bg-indigo-50 rounded-2xl">
                            <MdRefresh className="text-indigo-600" />
                            <span className="text-[10px] font-black text-indigo-800 uppercase tracking-widest italic">Fetch List</span>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AttendanceRegistry;
