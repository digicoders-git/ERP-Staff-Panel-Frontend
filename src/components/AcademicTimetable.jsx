import React, { useState, useEffect } from 'react';
import {
  FaClock, FaCalendarAlt, FaChalkboardTeacher, FaMapMarkerAlt,
  FaUsers, FaEdit, FaTrash, FaPlus, FaSearch, FaSpinner, FaBookOpen
} from 'react-icons/fa';
import { MdRefresh, MdClose } from 'react-icons/md';
import { timetableAPI, classAPI, teacherAPI } from '../utils/apiService';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const AcademicTimetable = () => {
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const [formData, setFormData] = useState({
    day: 'Monday', className: '', subject: '',
    startTime: '', endTime: '', room: '',
    classId: '', sectionId: '', teacherId: '', teacherName: ''
  });

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
      // Store teachers with _id for matching
      setTeachers(fetchedTeachers);
    } catch { console.error('Failed to load teachers'); }
  };

  const fetchTimetables = async () => {
    try {
      setLoading(true);
      const res = await timetableAPI.getAll();
      setTimetables(res.data.timetables || []);
    } catch {
      toast.error('Failed to load timetable');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'classId') {
      const sel = classes.find(c => c._id === value);
      setSections(sel?.sections || []);
      setFormData(prev => ({ ...prev, sectionId: '', className: sel?.className || '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await timetableAPI.update(editingId, formData);
        toast.success('Timetable updated successfully');
      } else {
        await timetableAPI.add(formData);
        toast.success('Timetable entry added successfully');
      }
      setShowForm(false);
      fetchTimetables();
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      day: item.day, className: item.className, subject: item.subject,
      startTime: item.startTime, endTime: item.endTime, room: item.room,
      classId: item.classId?._id || item.classId || '',
      sectionId: item.sectionId?._id || item.sectionId || '',
      teacherId: item.teacherId?._id || item.teacherId || '',
      teacherName: item.teacherName || item.teacherId?.name || ''
    });
    if (item.classId) {
      const sel = classes.find(c => c._id === (item.classId?._id || item.classId));
      setSections(sel?.sections || []);
    }
    setEditingId(item._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Timetable Entry?',
      text: 'This entry will be permanently removed.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Delete'
    });
    if (result.isConfirmed) {
      setLoading(true);
      try {
        await timetableAPI.delete(id);
        toast.success('Entry deleted');
        fetchTimetables();
      } catch { toast.error('Failed to delete'); } finally { setLoading(false); }
    }
  };

  const resetForm = () => {
    setFormData({
      day: 'Monday', className: '', subject: '',
      startTime: '', endTime: '', room: '',
      classId: '', sectionId: '', teacherId: '', teacherName: ''
    });
    setEditingId(null);
  };

  const filtered = timetables.filter(item =>
    item.day === selectedDay &&
    (item.className?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.room?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const inputCls = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 font-medium text-slate-700 transition-all text-sm";
  const labelCls = "block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5";

  return (
    <div className="space-y-6 bg-slate-50/50 min-h-screen">

      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
            <div className="w-2 h-8 bg-indigo-600 rounded-full" />
            Academic Timetable
          </h1>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">Weekly class schedule management</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 font-bold text-sm transition-all shadow-lg shadow-indigo-200 active:scale-95"
          >
            <FaPlus size={14} /> Add Period
          </button>
          <button onClick={fetchTimetables} className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all">
            <MdRefresh size={20} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Selected Day', val: selectedDay, icon: <FaCalendarAlt />, color: 'indigo' },
          { label: 'Periods Today', val: filtered.length, icon: <FaClock />, color: 'blue' },
          { label: 'Total Entries', val: timetables.length, icon: <FaBookOpen />, color: 'emerald' },
          { label: 'Teachers Assigned', val: [...new Set(timetables.map(t => t.teacherName || t.teacherId?.name).filter(Boolean))].length, icon: <FaUsers />, color: 'purple' },
        ].map((s, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-${s.color}-50 flex items-center justify-center text-${s.color}-600 text-lg`}>
              {s.icon}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{s.label}</p>
              <p className="text-xl font-black text-slate-800">{s.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Day Tabs + Search */}
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
            placeholder="Search by class, subject or room..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 text-sm font-medium text-slate-700 transition-all"
          />
        </div>
      </div>

      {/* Timetable Table */}
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
                {['Time', 'Subject', 'Class & Section', 'Teacher', 'Room', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length > 0 ? (
                [...filtered].sort((a, b) => a.startTime.localeCompare(b.startTime)).map(item => (
                  <tr key={item._id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          <FaClock size={14} />
                        </div>
                        <span className="font-black text-slate-700 text-sm tabular-nums">
                          {item.startTime} — {item.endTime}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="font-black text-slate-800 text-sm uppercase">{item.subject}</p>
                      <p className="text-xs text-slate-400 font-semibold mt-0.5">Period</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold border border-blue-100">
                        {item.className}
                      </span>
                      {item.sectionId?.sectionName && (
                        <span className="ml-2 text-xs text-slate-400 font-semibold">Sec: {item.sectionId.sectionName}</span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-slate-600">
                        <FaChalkboardTeacher size={13} className="text-slate-400" />
                        <span className="text-sm font-semibold">
                          {item.teacherName || item.teacherId?.name || '—'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-slate-600">
                        <FaMapMarkerAlt size={12} className="text-slate-400" />
                        <span className="text-sm font-semibold">{item.room || 'TBD'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(item)} className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all border border-indigo-100">
                          <FaEdit size={14} />
                        </button>
                        <button onClick={() => handleDelete(item._id)} className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all border border-rose-100">
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : !loading && (
                <tr>
                  <td colSpan="6" className="py-20 text-center text-slate-400">
                    <FaBookOpen size={40} className="mx-auto mb-4 opacity-20" />
                    <p className="font-bold text-sm">No periods scheduled for {selectedDay}</p>
                    <p className="text-xs mt-1">Click "Add Period" to add a class schedule</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-8 py-5 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-black text-slate-800">
                  {editingId ? 'Edit Period' : 'Add New Period'}
                </h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Fill in the class schedule details</p>
              </div>
              <button
                onClick={() => { setShowForm(false); resetForm(); }}
                className="p-2 bg-slate-100 text-slate-500 hover:bg-rose-50 hover:text-rose-500 rounded-xl transition-all"
              >
                <MdClose size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Day</label>
                  <select name="day" value={formData.day} onChange={handleInputChange} className={inputCls}>
                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Subject</label>
                  <input type="text" name="subject" value={formData.subject} onChange={handleInputChange}
                    className={inputCls} placeholder="e.g., Mathematics" required />
                </div>
                <div>
                  <label className={labelCls}>Class</label>
                  <select name="classId" value={formData.classId} onChange={handleInputChange} className={inputCls} required>
                    <option value="">Select Class</option>
                    {classes.map(c => (
                      <option key={c._id} value={c._id}>
                        {c.className}{c.stream?.length > 0 ? ` (${c.stream.join(', ')})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Section</label>
                  <select name="sectionId" value={formData.sectionId} onChange={handleInputChange}
                    className={inputCls} disabled={!formData.classId} required>
                    <option value="">Select Section</option>
                    {sections.map(s => <option key={s._id} value={s._id}>{s.sectionName}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Teacher (Optional)</label>
                  <select
                    value={formData.teacherName || ''}
                    onChange={e => setFormData(prev => ({ ...prev, teacherName: e.target.value }))}
                    className={inputCls}
                  >
                    <option value="">Select Teacher</option>
                    {teachers.map(t => (
                      <option key={t._id} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Room</label>
                  <input type="text" name="room" value={formData.room} onChange={handleInputChange}
                    className={inputCls} placeholder="e.g., Room 101" required />
                </div>
                <div>
                  <label className={labelCls}>Start Time</label>
                  <input type="time" name="startTime" value={formData.startTime} onChange={handleInputChange}
                    className={inputCls} required />
                </div>
                <div>
                  <label className={labelCls}>End Time</label>
                  <input type="time" name="endTime" value={formData.endTime} onChange={handleInputChange}
                    className={inputCls} required />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowForm(false); resetForm(); }}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={loading}
                  className="flex-[2] py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50">
                  {loading ? 'Saving...' : editingId ? 'Update Period' : 'Add Period'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicTimetable;
