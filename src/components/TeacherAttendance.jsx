import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaChevronLeft, FaChevronRight, FaCalendarCheck, FaClock, FaUserClock, FaSpinner } from 'react-icons/fa';
import { MdClose, MdCheckCircle, MdCancel, MdRefresh, MdLogin, MdLogout } from 'react-icons/md';
import { teacherAPI } from '../utils/apiService';
import { BASE_URL } from '../utils/api';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const TeacherAttendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [teachersList, setTeachersList] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const itemsPerPage = 8;

  const [formData, setFormData] = useState({
    teacher: '', // ObjectId
    teacherName: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present',
    checkIn: '09:00',
    checkOut: '17:00',
    remarks: ''
  });

  useEffect(() => {
    fetchAttendance();
    fetchTeachers();
  }, [currentPage, searchTerm, filterStatus]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const res = await teacherAPI.getAttendance({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        status: filterStatus !== 'all' ? filterStatus : undefined
      });
      if (res.data && res.data.data) {
        setAttendanceRecords(res.data.data);
      }
    } catch (err) {
      toast.error('Error: Could not fetch attendance records');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await teacherAPI.getAll({ limit: 100 });
      if (res.data && res.data.data && res.data.data.teachers) {
        setTeachersList(res.data.data.teachers);
      }
    } catch (err) {
      console.error('Error fetching teachers:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'teacher') {
      const selectedTeacher = teachersList.find(t => t._id === value);
      setFormData(prev => ({ 
        ...prev, 
        teacher: value,
        teacherName: selectedTeacher ? selectedTeacher.name : ''
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const calculateWorkingHours = () => {
    if (formData.status === 'Absent' || !formData.checkIn || !formData.checkOut) return 0;
    const [inHour, inMin] = formData.checkIn.split(':').map(Number);
    const [outHour, outMin] = formData.checkOut.split(':').map(Number);
    const inTime = inHour + inMin / 60;
    const outTime = outHour + outMin / 60;
    return Math.max(0, outTime - inTime).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingId) {
        await teacherAPI.updateAttendance(editingId, formData);
        toast.success('Attendance register updated successfully');
      } else {
        await teacherAPI.markAttendance(formData);
        toast.success('Attendance entry recorded successfully');
      }
      setShowForm(false);
      fetchAttendance();
      resetForm();
    } catch (err) {
      toast.error('Attendance could not be saved');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    setFormData({
      teacher: record.teacher?._id || record.teacher || '',
      teacherName: record.teacherName,
      date: record.date ? new Date(record.date).toISOString().split('T')[0] : '',
      status: record.status,
      checkIn: record.checkIn || '09:00',
      checkOut: record.checkOut || '17:00',
      remarks: record.remarks || ''
    });
    setEditingId(record._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Entry?',
      text: 'Are you sure you want to remove this attendance entry?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        await teacherAPI.deleteAttendance(id);
        toast.success('Entry removed');
        fetchAttendance();
      } catch (err) {
        toast.error('Record could not be deleted');
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({ teacher: '', teacherName: '', date: new Date().toISOString().split('T')[0], status: 'Present', checkIn: '09:00', checkOut: '17:00', remarks: '' });
    setEditingId(null);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Present': return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      case 'Absent': return 'bg-rose-50 text-rose-600 border border-rose-100';
      case 'Late': return 'bg-amber-50 text-amber-600 border border-amber-100';
      case 'Leave': return 'bg-blue-50 text-blue-600 border border-blue-100';
      default: return 'bg-slate-50 text-slate-400 border border-slate-100';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Register */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
            <div className="w-2.5 h-10 bg-blue-600 rounded-full" />
            Attendance Register
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Daily Staff Presence & Entry Log</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl hover:bg-blue-700 font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-blue-200 active:scale-95"
          >
            <FaPlus /> Mark Attendance
          </button>
          <button
            onClick={fetchAttendance}
            className="p-4 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-all active:rotate-180 duration-500"
          >
            <MdRefresh size={20} />
          </button>
        </div>
      </div>

      {/* Filter and Search Hub */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search attendance (Name or Date)..."
            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500/20 focus:bg-white outline-none text-xs font-bold transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-8 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none font-black text-[10px] tracking-widest uppercase focus:bg-white focus:border-blue-600 transition-all cursor-pointer"
        >
          <option value="all">ALL RECORDS</option>
          <option value="Present">PRESENT</option>
          <option value="Absent">ABSENT</option>
          <option value="Late">LATE</option>
          <option value="Leave">LEAVE</option>
        </select>
      </div>

      {/* Attendance List Table */}
      <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
            <FaSpinner className="animate-spin text-blue-600" size={40} />
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Teacher Name</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Date</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Time log</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Total hours</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {attendanceRecords.map((record) => (
                <tr key={record._id} className="hover:bg-slate-50/30 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xs overflow-hidden shadow-sm border border-slate-100">
                        {record.teacher?.profileImage ? (
                          <img 
                            src={record.teacher.profileImage.startsWith('http') 
                              ? record.teacher.profileImage 
                              : `${BASE_URL.replace(/\/$/, '')}/${record.teacher.profileImage.replace(/\\/g, '/').replace(/^\//, '')}`
                            } 
                            alt="" 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          (record.teacherName || 'T')[0]
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-800 uppercase tracking-tight">{record.teacherName}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{record.teacher?.email || 'Teacher ID: ' + (record.teacher?._id?.slice(-6) || 'N/A')}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mt-2">
                    <FaCalendarCheck className="text-blue-200" />
                    {new Date(record.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${getStatusStyle(record.status)}`}>
                       {record.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600">
                        <MdLogin size={14} /> {record.checkIn || '-'}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-black text-rose-500">
                        <MdLogout size={14} /> {record.checkOut || '-'}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="text-sm font-black text-blue-600 tabular-nums italic">{record.workingHours || 0}h</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(record)} className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><FaEdit size={16} /></button>
                      <button onClick={() => handleDelete(record._id)} className="p-3 text-rose-600 hover:bg-rose-50 rounded-xl transition-all"><FaTrash size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attendance Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl border border-white/20 animate-in zoom-in-95 duration-300">
            <div className="bg-slate-50 px-10 py-10 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                  {editingId ? 'Edit Attendance' : 'Mark New Attendance'}
                </h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Manual Attendance Entry Port</p>
              </div>
              <button onClick={() => { setShowForm(false); resetForm(); }} className="p-4 bg-white text-slate-400 hover:text-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <MdClose size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Teacher Name</label>
                  <select
                    required
                    name="teacher"
                    value={formData.teacher}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500/20 focus:bg-white outline-none text-xs font-bold transition-all"
                  >
                    <option value="">Select Teacher</option>
                    {teachersList.map(t => (
                      <option key={t._id} value={t._id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Date</label>
                    <input
                      type="date"
                      required
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500/20 focus:bg-white outline-none text-xs font-bold transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Attendance Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500/20 focus:bg-white outline-none text-xs font-bold transition-all"
                    >
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                      <option value="Late">Late</option>
                      <option value="Leave">Leave</option>
                    </select>
                  </div>
                </div>

                {formData.status !== 'Absent' && (
                  <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <MdLogin className="text-emerald-500" /> Arrival Time (In-Time)
                      </label>
                      <input
                        type="time"
                        name="checkIn"
                        value={formData.checkIn}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500/20 focus:bg-white outline-none text-xs font-bold transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <MdLogout className="text-rose-500" /> Departure Time (Out-Time)
                      </label>
                      <input
                        type="time"
                        name="checkOut"
                        value={formData.checkOut}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500/20 focus:bg-white outline-none text-xs font-bold transition-all"
                      />
                    </div>
                  </div>
                )}

                <div className="p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-blue-600">
                    <FaUserClock size={20} />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest">Total Working Hours</p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase mt-0.5">Automated Calculation</p>
                    </div>
                  </div>
                  <p className="text-4xl font-black text-blue-900 italic tracking-tighter tabular-nums">{calculateWorkingHours()}h</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-6 rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-95 disabled:opacity-50"
                >
                  {loading ? <FaSpinner className="animate-spin mx-auto text-white" /> : (editingId ? 'Update Register' : 'Record Entry')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-8 py-5 border-2 border-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] rounded-3xl hover:bg-slate-50 hover:text-slate-600 transition-all"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherAttendance;
