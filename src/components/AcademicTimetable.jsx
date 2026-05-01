import React, { useState, useEffect } from 'react';
import {
  FaClock, FaCalendarAlt, FaChalkboardTeacher, FaPlus, FaSearch, FaSpinner, FaSave, FaTrash
} from 'react-icons/fa';
import { MdRefresh, MdClose } from 'react-icons/md';
import { classAPI, teacherAPI } from '../utils/apiService';
import api from '../utils/api';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const AcademicTimetable = () => {
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [showBulkMode, setShowBulkMode] = useState(false);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [teachers, setTeachers] = useState([]);

  // Periods options
  const periodOptions = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', 'Lunch', 'Extra'];

  // Bulk Mode State
  const [bulkHeader, setBulkHeader] = useState({ classId: '', sectionId: '', day: 'Monday' });
  const [bulkRows, setBulkRows] = useState([
    { subject: '', teacherId: '', teacherName: '', startTime: '', endTime: '', period: '1st' }
  ]);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    fetchTimetables();
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const classesRes = await classAPI.getAll();
      if (classesRes.data?.classes) setClasses(classesRes.data.classes);
    } catch { console.error('Failed to load classes'); }

    try {
      const teachersRes = await teacherAPI.getAll();
      const fetchedTeachers = teachersRes.data?.data?.teachers || teachersRes.data?.teachers || [];
      setTeachers(fetchedTeachers);
    } catch { console.error('Failed to load teachers'); }
  };

  const fetchTimetables = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/staff-panel/timetable/all');
      setTimetables(res.data.timetables || []);
    } catch {
      toast.error('Failed to load timetable');
    } finally {
      setLoading(false);
    }
  };

  const addBulkRow = () => {
    const nextPeriodIndex = bulkRows.length < periodOptions.length ? bulkRows.length : 0;
    setBulkRows([...bulkRows, { 
        subject: '', 
        teacherId: '', 
        teacherName: '', 
        startTime: '', 
        endTime: '', 
        period: periodOptions[nextPeriodIndex] || 'Extra' 
    }]);
  };

  const removeBulkRow = (index) => {
    if (bulkRows.length > 1) {
      setBulkRows(bulkRows.filter((_, i) => i !== index));
    }
  };

  const handleBulkRowChange = (index, field, value) => {
    const updated = [...bulkRows];
    updated[index][field] = value;
    if (field === 'teacherId') {
      const teacher = teachers.find(t => t._id === value);
      updated[index].teacherName = teacher?.name || '';
    }
    setBulkRows(updated);
  };

  const handleBulkSubmit = async () => {
    if (!bulkHeader.classId || !bulkHeader.sectionId) {
      return toast.error('Please select Class and Section');
    }

    const validRows = bulkRows.filter(r => r.subject && r.startTime && r.endTime);
    if (validRows.length === 0) {
      return toast.error('Please fill at least one complete period');
    }

    setLoading(true);
    try {
      const schedule = validRows.map(r => ({ 
        ...r, 
        day: bulkHeader.day,
        room: r.period
      }));
      await api.post('/api/staff-panel/timetable/bulk', {
        classId: bulkHeader.classId,
        sectionId: bulkHeader.sectionId,
        schedule
      });
      toast.success('Academic Schedule updated successfully');
      setShowBulkMode(false);
      fetchTimetables();
      setBulkRows([{ subject: '', teacherId: '', teacherName: '', startTime: '', endTime: '', period: '1st' }]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Bulk update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Entry?',
      text: 'This period will be removed.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, Delete'
    });
    if (result.isConfirmed) {
      setLoading(true);
      try {
        await api.delete(`/api/staff-panel/timetable/${id}`);
        toast.success('Entry deleted');
        fetchTimetables();
      } catch { toast.error('Failed to delete'); } finally { setLoading(false); }
    }
  };

  const filtered = timetables.filter(item =>
    item.day === selectedDay &&
    (item.classId?.className?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subject?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatClassName = (cls) => {
    if (!cls) return '—';
    const stream = cls.stream && cls.stream.length > 0 ? ` (${cls.stream[0]})` : '';
    return `${cls.className}${stream}`;
  };

  const inputCls = "w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 font-medium text-slate-700 transition-all text-xs";
  
  return (
    <div className="space-y-6 bg-slate-50/50 min-h-screen">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
            <div className="w-2 h-8 bg-indigo-600 rounded-full" />
            Class Schedule
          </h1>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">Day-wise period management</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowBulkMode(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 font-bold text-sm transition-all shadow-lg shadow-indigo-200 active:scale-95"
          >
            <FaPlus size={14} /> Bulk Add Periods
          </button>
          <button onClick={fetchTimetables} className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all">
            <MdRefresh size={20} />
          </button>
        </div>
      </div>

      {!showBulkMode ? (
        <>
          {/* View Mode Tabs */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4">
            <div className="flex flex-wrap gap-2">
              {days.map(day => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${
                    selectedDay === day
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                      : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
              <input
                type="text"
                placeholder="Search class or subject..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 text-sm font-medium text-slate-700 transition-all"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative min-h-[300px]">
            {loading && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center">
                <FaSpinner className="animate-spin text-indigo-600 text-3xl" />
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {['Period', 'Time', 'Subject', 'Class & Section', 'Teacher', 'Actions'].map(h => (
                      <th key={h} className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.length > 0 ? (
                    [...filtered].sort((a, b) => a.startTime.localeCompare(b.startTime)).map(item => (
                      <tr key={item._id} className="hover:bg-slate-50/70 transition-colors group">
                        <td className="px-6 py-5">
                            <span className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">
                                {item.room || '—'}
                            </span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="font-black text-slate-700 text-sm tabular-nums">
                            {item.startTime} — {item.endTime}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <p className="font-black text-slate-800 text-sm uppercase">{item.subject}</p>
                        </td>
                        <td className="px-6 py-5">
                          <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-[11px] font-black border border-blue-100">
                            {formatClassName(item.classId)} ({item.sectionId?.sectionName || 'A'})
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-sm font-semibold">{item.teacherName || '—'}</span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <button onClick={() => handleDelete(item._id)} className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all border border-rose-100">
                            <FaTrash size={14} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="6" className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No schedule for {selectedDay}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Bulk Mode UI */
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden animate-fadeIn">
          <div className="bg-slate-900 p-8 flex justify-between items-center text-white">
            <div>
              <h2 className="text-2xl font-black flex items-center gap-3">
                <FaCalendarAlt className="text-indigo-400" />
                Bulk Period Entry
              </h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Assign weekly subjects by periods</p>
            </div>
            <button onClick={() => setShowBulkMode(false)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all">
              <MdClose size={24} />
            </button>
          </div>

          <div className="p-8 space-y-8">
            {/* Header Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-inner">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Day</label>
                <select className={inputCls} value={bulkHeader.day} onChange={e => setBulkHeader({...bulkHeader, day: e.target.value})}>
                  {days.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Class</label>
                <select className={inputCls} value={bulkHeader.classId} onChange={e => {
                    const sel = classes.find(c => c._id === e.target.value);
                    setSections(sel?.sections || []);
                    setBulkHeader({...bulkHeader, classId: e.target.value, sectionId: ''});
                  }}>
                  <option value="">Select Class</option>
                  {classes.map(c => (
                    <option key={c._id} value={c._id}>
                        {c.className} {c.stream && c.stream.length > 0 ? `(${c.stream[0]})` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Section</label>
                <select className={inputCls} value={bulkHeader.sectionId} onChange={e => setBulkHeader({...bulkHeader, sectionId: e.target.value})} disabled={!bulkHeader.classId}>
                  <option value="">Select Section</option>
                  {sections.map(s => <option key={s._id} value={s._id}>{s.sectionName}</option>)}
                </select>
              </div>
            </div>

            {/* Grid Entry */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-black text-slate-800 uppercase text-xs tracking-[0.1em]">Class Periods</h3>
                <button onClick={addBulkRow} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-xs hover:bg-indigo-200 cursor-pointer transition-all">
                  <FaPlus size={10} className="inline mr-2" /> Add Next Row
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b-2 border-slate-100">
                      <th className="py-4 px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest w-24">Period</th>
                      <th className="py-4 px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject</th>
                      <th className="py-4 px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Teacher</th>
                      <th className="py-4 px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest w-32">Start Time</th>
                      <th className="py-4 px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest w-32">End Time</th>
                      <th className="py-4 px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest w-16">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {bulkRows.map((row, index) => (
                      <tr key={index}>
                        <td className="py-4 px-2">
                          <select 
                            className={inputCls} 
                            value={row.period}
                            onChange={e => handleBulkRowChange(index, 'period', e.target.value)}
                          >
                            {periodOptions.map(p => <option key={p} value={p}>{p}</option>)}
                          </select>
                        </td>
                        <td className="py-4 px-2">
                          <input type="text" className={inputCls} placeholder="e.g. English" value={row.subject} onChange={e => handleBulkRowChange(index, 'subject', e.target.value)} />
                        </td>
                        <td className="py-4 px-2">
                          <select className={inputCls} value={row.teacherId} onChange={e => handleBulkRowChange(index, 'teacherId', e.target.value)}>
                            <option value="">Choose Teacher</option>
                            {teachers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                          </select>
                        </td>
                        <td className="py-4 px-2">
                          <input type="time" className={inputCls} value={row.startTime} onChange={e => handleBulkRowChange(index, 'startTime', e.target.value)} />
                        </td>
                        <td className="py-4 px-2">
                          <input type="time" className={inputCls} value={row.endTime} onChange={e => handleBulkRowChange(index, 'endTime', e.target.value)} />
                        </td>
                        <td className="py-4 px-2">
                          <button onClick={() => removeBulkRow(index)} className="p-2 text-slate-300 hover:text-red-500 transition-all">
                            <FaTrash size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-end gap-4 pt-8 border-t border-slate-100">
              <button onClick={() => setShowBulkMode(false)} className="px-8 py-3 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition-all">Cancel</button>
              <button onClick={handleBulkSubmit} disabled={loading} className="px-12 py-3 bg-indigo-600 text-white rounded-2xl font-black shadow-xl hover:bg-indigo-700 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50">
                {loading ? <FaSpinner className="animate-spin" /> : <FaSave />} Save Academic Timetable
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicTimetable;
