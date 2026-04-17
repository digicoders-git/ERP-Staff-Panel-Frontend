import React, { useState, useEffect } from 'react';
import { MdAdd, MdEventNote, MdCheckCircle, MdCancel, MdPending, MdCalendarToday, MdPerson, MdDescription, MdRefresh, MdClose } from 'react-icons/md';
import { FaSpinner, FaPaperPlane, FaHistory, FaUserShield, FaSearch, FaRegCalendarAlt } from 'react-icons/fa';
import { leaveAPI, teacherAPI } from '../utils/apiService';
import { BASE_URL } from '../utils/api';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const LeaveManagement = () => {
  const [activeTab, setActiveTab] = useState('manage');
  const [loading, setLoading] = useState(false);
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [teachersList, setTeachersList] = useState([]);
  
  const [newLeave, setNewLeave] = useState({
    staffId: '',
    staffName: '',
    leaveType: 'Casual Leave',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const leaveTypes = [
    'Sick Leave',
    'Annual Leave',
    'Maternity Leave',
    'Emergency Leave',
    'Casual Leave',
    'Half Day'
  ];

  useEffect(() => {
    fetchLeaves();
    fetchTeachers();
  }, []);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await leaveAPI.getAll();
      if (res.data && res.data.leaves) {
        setLeaveRequests(res.data.leaves);
      }
    } catch (err) {
      toast.error('Could not fetch leave records');
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

  const handleSubmitLeave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await leaveAPI.create(newLeave);
      toast.success('Leave application submitted successfully');
      setShowLeaveForm(false);
      setNewLeave({ staffId: '', staffName: '', leaveType: 'Casual Leave', startDate: '', endDate: '', reason: '' });
      fetchLeaves();
    } catch (err) {
       toast.error('Application submission failed');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    const action = status === 'approved' ? 'Approve' : 'Reject';
    const result = await Swal.fire({
      title: 'Confirm Action?',
      text: `Do you want to ${action.toLowerCase()} this leave request?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: status === 'approved' ? '#10b981' : '#ef4444',
      confirmButtonText: 'Yes, Confirm',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        await leaveAPI.updateStatus(id, status);
        toast.success(`Petition ${status}`);
        fetchLeaves();
      } catch (err) {
        toast.error('Update failed');
      } finally {
        setLoading(false);
      }
    }
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      case 'rejected': return 'bg-rose-50 text-rose-600 border border-rose-100';
      case 'pending': return 'bg-amber-50 text-amber-600 border border-amber-100';
      default: return 'bg-slate-50 text-slate-400 border border-slate-100';
    }
  };

  const filteredRequests = leaveRequests.filter(request => {
    const staff = request.staffName || request.staffId?.name || 'Unknown';
    const matchesSearch = staff.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.leaveType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || request.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const leaveStats = {
    total: leaveRequests.length,
    pending: leaveRequests.filter(r => r.status.toLowerCase() === 'pending').length,
    approved: leaveRequests.filter(r => r.status.toLowerCase() === 'approved').length,
    rejected: leaveRequests.filter(r => r.status.toLowerCase() === 'rejected').length
  };

  return (
    <div className="p-8 space-y-10 animate-in fade-in duration-500 min-h-screen bg-slate-50/30">
      {/* Premium Header Container */}
      <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col lg:flex-row justify-between items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-blue-600" />
        <div>
           <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              Staff Leave Records
           </h1>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Manage and Track faculty absence permissions</p>
        </div>
        
        <div className="flex gap-3">
           <button 
             onClick={() => setShowLeaveForm(true)}
             className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-slate-800 shadow-xl shadow-blue-200 active:scale-95 flex items-center gap-2"
           >
              <MdAdd size={16} /> New Application
           </button>
           <button onClick={fetchLeaves} className="p-4 bg-slate-100 text-slate-400 hover:text-slate-800 rounded-2xl transition-all active:rotate-180 duration-500">
              <MdRefresh size={22} />
           </button>
        </div>
      </div>

      {/* Modern Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Leaves', val: leaveStats.total, color: 'text-slate-600', icon: MdEventNote, bg: 'bg-slate-50' },
          { label: 'Pending', val: leaveStats.pending, color: 'text-amber-500', icon: MdPending, bg: 'bg-amber-50/50' },
          { label: 'Approved', val: leaveStats.approved, color: 'text-emerald-500', icon: MdCheckCircle, bg: 'bg-emerald-50/50' },
          { label: 'Rejected', val: leaveStats.rejected, color: 'text-rose-500', icon: MdCancel, bg: 'bg-rose-50/50' }
        ].map((s, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all flex items-center justify-between group overflow-hidden">
            <div className="z-10">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{s.label}</p>
              <p className={`text-3xl font-black ${s.color} tracking-tighter tabular-nums`}>{s.val}</p>
            </div>
            <div className={`${s.color} opacity-10 group-hover:opacity-20 transition-opacity absolute -right-2 -bottom-2`}>
               <s.icon size={100} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Interface Hub */}
      <div className="bg-white rounded-[3.5rem] shadow-sm border border-slate-100 overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50/10">
           <div>
              <h3 className="text-xl font-black text-slate-800 italic uppercase underline decoration-blue-200 decoration-8 underline-offset-4 tracking-tight">Application Registry</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3 italic">{filteredRequests.length} records in current view</p>
           </div>

           <div className="flex gap-4">
              <div className="relative group">
                 <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                 <input
                    placeholder="SEARCH TEACHER..."
                    className="pl-12 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none font-black text-[10px] tracking-widest uppercase focus:bg-white focus:border-blue-500/20 w-64 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                 />
              </div>
              <select
                 value={filterStatus}
                 onChange={(e) => setFilterStatus(e.target.value)}
                 className="px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none font-black text-[10px] tracking-widest uppercase cursor-pointer hover:bg-white focus:bg-white focus:border-blue-600 transition-all"
              >
                 <option value="all">ALL STATUS</option>
                 <option value="pending">PENDING</option>
                 <option value="approved">APPROVED</option>
                 <option value="rejected">REJECTED</option>
              </select>
           </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
               <tr className="text-left text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] bg-slate-50/50">
                  <th className="px-10 py-6">Staff Member</th>
                  <th className="px-10 py-6">Leave Detail</th>
                  <th className="px-10 py-6 text-center">Duration</th>
                  <th className="px-10 py-6">Dates (Start to End)</th>
                  <th className="px-10 py-6 text-center">Status</th>
                  <th className="px-10 py-6 text-right">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {loading ? (
                  <tr>
                     <td colSpan="6" className="py-20 text-center">
                        <FaSpinner className="animate-spin text-blue-600 mx-auto" size={40} />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">Syncing Leave Logs...</p>
                     </td>
                  </tr>
               ) : filteredRequests.map((req) => (
                  <tr key={req._id} className="hover:bg-slate-50/50 transition-colors group">
                     <td className="px-10 py-8">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-slate-800 text-white flex items-center justify-center font-black text-sm border border-slate-100 overflow-hidden shadow-sm">
                              {req.staffId?.profileImage ? (
                                 <img src={req.staffId.profileImage.startsWith('http') ? req.staffId.profileImage : `${BASE_URL}/${req.staffId.profileImage.replace(/\\/g, '/')}`} className="w-full h-full object-cover" />
                              ) : (req.staffName || 'T')[0]}
                           </div>
                           <div>
                              <p className="text-sm font-black text-slate-800 tracking-tight">{req.staffName || req.staffId?.name || 'Unknown Staff'}</p>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">Faculty ID: {req.staffId?._id?.slice(-8) || 'External'}</p>
                           </div>
                        </div>
                     </td>
                     <td className="px-10 py-8 max-w-xs">
                        <p className="text-xs font-black text-slate-600 uppercase tracking-widest">{req.leaveType}</p>
                        <p className="text-[10px] text-slate-400 mt-1.5 italic line-clamp-2 leading-relaxed">&quot;{req.reason}&quot;</p>
                     </td>
                     <td className="px-10 py-8 text-center text-xs font-black text-blue-600 tabular-nums italic">
                        {req.days} Days
                     </td>
                     <td className="px-10 py-8">
                        <div className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2">
                           <FaRegCalendarAlt className="text-slate-300" />
                           {new Date(req.startDate).toLocaleDateString('en-GB')}
                        </div>
                        <div className="text-[10px] font-black text-slate-300 uppercase mt-1 pl-5 italic">to {new Date(req.endDate).toLocaleDateString('en-GB')}</div>
                     </td>
                     <td className="px-10 py-8 text-center">
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${getStatusStyle(req.status)}`}>
                           {req.status}
                        </span>
                     </td>
                     <td className="px-10 py-8 text-right">
                        <div className="flex justify-end gap-2">
                           {req.status.toLowerCase() === 'pending' && (
                              <>
                                 <button onClick={() => handleStatusChange(req._id, 'approved')} className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"><MdCheckCircle size={18} /></button>
                                 <button onClick={() => handleStatusChange(req._id, 'rejected')} className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"><MdCancel size={18} /></button>
                              </>
                           )}
                           <button className="p-3 text-slate-300 hover:text-slate-600 transition-all"><MdDescription size={18} /></button>
                        </div>
                     </td>
                  </tr>
               ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leave Application Modal Hub */}
      {showLeaveForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-[4rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="bg-blue-600 p-12 text-white flex justify-between items-center relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-10 opacity-10"><FaPaperPlane size={150} /></div>
                 <div className="relative z-10">
                    <h2 className="text-3xl font-black italic tracking-tight uppercase underline decoration-white/20 decoration-8 underline-offset-8 decoration-4">New Leave Application</h2>
                    <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest mt-5 flex items-center gap-2 italic"><MdPending /> Leave Permission System v2.0</p>
                 </div>
                 <button onClick={() => setShowLeaveForm(false)} className="bg-white/10 hover:bg-white/20 p-5 rounded-3xl transition-all relative z-10">
                    <MdClose size={24} />
                 </button>
              </div>

              <form onSubmit={handleSubmitLeave} className="p-12 space-y-8">
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">For Whom? (Select Teacher)</label>
                       <select
                          required
                          value={newLeave.staffId}
                          onChange={(e) => {
                             const sel = teachersList.find(t => t._id === e.target.value);
                             setNewLeave({...newLeave, staffId: e.target.value, staffName: sel ? sel.name : ''});
                          }}
                          className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 outline-none font-black text-[10px] tracking-widest uppercase cursor-pointer transition-all"
                       >
                          <option value="">Select Teacher</option>
                          {teachersList.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                       </select>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Leave Type</label>
                       <select
                          required
                          value={newLeave.leaveType}
                          onChange={(e) => setNewLeave({ ...newLeave, leaveType: e.target.value })}
                          className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 outline-none font-black text-[10px] tracking-widest uppercase cursor-pointer transition-all"
                       >
                          <option value="">Select Leave Type</option>
                          {leaveTypes.map(type => <option key={type} value={type}>{type}</option>)}
                       </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">From (Start Date)</label>
                          <input
                             type="date"
                             required
                             value={newLeave.startDate}
                             onChange={(e) => setNewLeave({ ...newLeave, startDate: e.target.value })}
                             className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 outline-none font-bold text-slate-700 font-mono"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">To (End Date)</label>
                          <input
                             type="date"
                             required
                             value={newLeave.endDate}
                             onChange={(e) => setNewLeave({ ...newLeave, endDate: e.target.value })}
                             className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 outline-none font-bold text-slate-700 font-mono"
                          />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Reason for Leave</label>
                       <textarea
                          required
                          value={newLeave.reason}
                          onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                          className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 outline-none font-bold text-slate-700 min-h-[140px] resize-none"
                          placeholder="Enter reason (Medical, Urgent, etc.)"
                       ></textarea>
                    </div>
                 </div>

                 <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-6 rounded-[2.5rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-slate-800 transition-all shadow-xl shadow-blue-100 active:scale-95 disabled:opacity-50"
                 >
                    {loading ? <FaSpinner className="animate-spin mx-auto text-white" /> : 'Apply for Leave'}
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default LeaveManagement;