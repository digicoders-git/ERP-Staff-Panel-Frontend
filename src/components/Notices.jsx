import React, { useState, useEffect } from 'react';
import { MdCampaign, MdAdd, MdEdit, MdDelete, MdVisibility, MdClose, MdSend, MdPeople, MdAttachFile, MdEvent } from 'react-icons/md';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { noticeAPI } from '../utils/apiService';
import { FaSpinner } from 'react-icons/fa';

const Notices = () => {
  const [showForm, setShowForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [editingNotice, setEditingNotice] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', priority: 'normal', type: 'general', targetAudience: ['student'] });
  const [editFormData, setEditFormData] = useState({ targetAudience: [] });
  const [loading, setLoading] = useState(false);
  const [noticeData, setNoticeData] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 0 });

  useEffect(() => {
    fetchNotices();
  }, [pagination.page]);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const res = await noticeAPI.getAll({ page: pagination.page, limit: 10 });
      if (res.data && res.data.notices) {
        setNoticeData(res.data.notices.map(n => ({
          id: n._id,
          title: n.title,
          content: n.content,
          priority: n.priority || 'normal',
          date: new Date(n.createdAt).toLocaleDateString(),
          status: n.status || 'active',
          createdBy: n.createdBy?.email || 'System',
          attachments: n.attachments || [],
          targetAudience: n.targetAudience || ['student']
        })));
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('Failed to fetch notices:', err);
      toast.error('Failed to load notices');
    } finally {
      setLoading(false);
    }
  };

  const resolveDocUrl = (url) => {
    if (!url) return '#';
    if (url.startsWith('http')) return url;
    const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002';
    let cleanPath = url.replace(/\\/g, '/');
    const uploadsIndex = cleanPath.toLowerCase().indexOf('uploads/');
    if (uploadsIndex !== -1) {
      cleanPath = cleanPath.slice(uploadsIndex);
    }
    return `${BASE_URL.replace(/\/$/, '')}/${cleanPath.startsWith('/') ? cleanPath.slice(1) : cleanPath}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('content', formData.content);
      submitData.append('priority', formData.priority);
      submitData.append('type', formData.type);
      submitData.append('targetAudience', JSON.stringify(formData.targetAudience));
      
      if (formData.attachment) {
        submitData.append('documents', formData.attachment);
      }

      await noticeAPI.create(submitData);
      setShowForm(false);
      setFormData({ title: '', content: '', priority: 'normal', type: 'general', targetAudience: ['student'] });
      fetchNotices();
      toast.success('Notice published successfully! 📢');
    } catch (err) {
      console.error('Failed to create notice:', err);
      toast.error(err.response?.data?.message || 'Failed to publish notice');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (notice) => {
    setSelectedNotice(notice);
    setShowViewModal(true);
  };

  const handleEdit = (notice) => {
    setEditingNotice(notice);
    setEditFormData({ ...notice });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      setLoading(true);
      await noticeAPI.update(editingNotice.id, {
        title: editFormData.title,
        content: editFormData.content,
        priority: editFormData.priority
      });
      setShowEditModal(false);
      fetchNotices();
      toast.success(`Notice "${editFormData.title}" updated successfully! ✏️`);
    } catch (err) {
      console.error('Failed to update notice:', err);
      toast.error(err.response?.data?.message || 'Failed to update notice');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (notice) => {
    Swal.fire({
      title: 'Delete Notice?',
      text: `Are you sure you want to delete "${notice.title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await noticeAPI.delete(notice.id);
          fetchNotices();
          toast.success('Notice deleted successfully! 🗑️');
        } catch (err) {
          toast.error(err.response?.data?.message || 'Failed to delete notice');
        }
      }
    });
  };

  const handleStatusToggle = (notice) => {
    // Backend toggle logic could be added here if needed
    toast.info('Status toggle needs backend support');
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-green-800';
  };

  return (
    <div className="space-y-6">
      {loading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <FaSpinner className="animate-spin text-blue-500 text-5xl" />
        </div>
      )}
      <div className="bg-blue-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold mb-2 tracking-tight">Notice Management</h2>
            <p className="text-blue-100">Create and manage school notices for students and staff</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-white text-blue-600 px-5 py-2.5 rounded-xl font-bold hover:bg-blue-50 flex items-center gap-2 transition-all active:scale-95 shadow-lg"
          >
            <MdAdd size={20} />
            Create Notice
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-50 animate-fadeIn">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
            Create New Notice
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Notice Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                  placeholder="E.g., Annual Sports Day 2024"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  rows="4"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                  placeholder="Enter detailed notice content here..."
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Priority Level</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                >
                  <option value="normal">Normal</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Attachment</label>
                <div className="relative group">
                  <MdAttachFile className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600" size={18} />
                  <input
                    type="file"
                    onChange={(e) => setFormData({...formData, attachment: e.target.files[0]})}
                    className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <MdPeople size={16} className="text-blue-500" />
                  Target Audience
                </label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { id: 'student', label: 'Students' },
                    { id: 'teacher', label: 'Teachers' },
                    { id: 'parent', label: 'Parents' },
                    { id: 'staff', label: 'Staff' },
                    { id: 'driver', label: 'Drivers' },
                    { id: 'fee_manager', label: 'Fee Managers' },
                    { id: 'admin', label: 'Admins' }
                  ].map((aud) => (
                    <label 
                      key={aud.id} 
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all cursor-pointer ${
                        formData.targetAudience.includes(aud.id) 
                          ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-sm' 
                          : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'
                      }`}
                    >
                      <input 
                        type="checkbox"
                        className="hidden"
                        checked={formData.targetAudience.includes(aud.id)}
                        onChange={(e) => {
                          const newAud = e.target.checked 
                            ? [...formData.targetAudience, aud.id]
                            : formData.targetAudience.filter(a => a !== aud.id);
                          setFormData({...formData, targetAudience: newAud});
                        }}
                      />
                      <span className="text-[10px] font-black uppercase tracking-widest">{aud.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center gap-2"
              >
                <MdSend />
                Publish Notice
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-slate-100 text-slate-600 px-8 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Notices', val: pagination.total, clr: 'border-blue-500' },
          { label: 'High Priority', val: noticeData.filter(n => n.priority === 'high').length, clr: 'border-red-500' },
          { label: 'Active', val: noticeData.length, clr: 'border-emerald-500' },
          { label: 'This Month', val: noticeData.length, clr: 'border-indigo-500' }
        ].map((stat, i) => (
          <div key={i} className={`bg-white rounded-2xl shadow-sm p-6 border-l-4 ${stat.clr}`}>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</h3>
            <p className="text-3xl font-black text-slate-800">{stat.val}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <h3 className="text-xl font-black text-slate-800 tracking-tight">Active Notices</h3>
          <div className="flex gap-2">
             <button 
              onClick={() => setPagination(prev => ({...prev, page: Math.max(1, prev.page - 1)}))}
              disabled={pagination.page === 1}
              className="p-2 bg-white border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-50"
             >Previous</button>
             <span className="flex items-center px-4 font-bold text-slate-600">Page {pagination.page} / {pagination.totalPages || 1}</span>
             <button 
              onClick={() => setPagination(prev => ({...prev, page: Math.min(prev.totalPages, prev.page + 1)}))}
              disabled={pagination.page >= pagination.totalPages}
              className="p-2 bg-white border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-50"
             >Next</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50/50">
                <th className="px-8 py-5">Notice Details</th>
                <th className="px-8 py-5">Priority</th>
                <th className="px-8 py-5">Date</th>
                <th className="px-8 py-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {noticeData.length > 0 ? noticeData.map(notice => (
                <tr key={notice.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div>
                      <p className="text-sm font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">{notice.title}</p>
                      <p className="text-xs text-slate-400 line-clamp-1">{notice.content}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getPriorityColor(notice.priority)} shadow-sm border border-transparent`}>
                      {notice.priority}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{notice.date}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleView(notice)}
                        className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all"
                        title="View Notice"
                      >
                        <MdVisibility size={18} />
                      </button>
                      <button 
                        onClick={() => handleEdit(notice)}
                        className="p-2.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-all"
                        title="Edit Notice"
                      >
                        <MdEdit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(notice)}
                        className="p-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all"
                        title="Delete Notice"
                      >
                        <MdDelete size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="text-center py-20">
                    <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">No notices found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Notice Modal */}
      {showViewModal && selectedNotice && (
        <div className="fixed inset-0 backdrop-blur-md bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-4xl w-full animate-modalIn overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-8 border-b border-slate-50 bg-slate-50/30 shrink-0">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200">
                  <MdCampaign size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight">Notice Detailed View</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Record ID: {selectedNotice.id.slice(-6)}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowViewModal(false)}
                className="p-3 text-slate-400 hover:text-slate-600 bg-white shadow-sm rounded-2xl border border-slate-100 transition-all hover:rotate-90"
              >
                <MdClose size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                {/* Main Content Column */}
                <div className="md:col-span-2 p-10 space-y-8 border-r border-slate-50">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Notice Title</label>
                    <h4 className="text-2xl font-black text-slate-800 leading-tight">{selectedNotice.title}</h4>
                  </div>
                  
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-3">Notice Content</label>
                    <div className="bg-slate-50/50 rounded-2xl p-8 border border-slate-100 min-h-[200px]">
                      <p className="text-slate-600 leading-relaxed font-medium whitespace-pre-line text-sm">{selectedNotice.content}</p>
                    </div>
                  </div>
                </div>

                {/* Sidebar Column */}
                <div className="bg-slate-50/30 p-10 space-y-8">
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Priority Level</label>
                      <span className={`inline-flex px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getPriorityColor(selectedNotice.priority)} shadow-sm`}>
                        {selectedNotice.priority}
                      </span>
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Timeline</label>
                      <div className="flex items-center gap-2 text-slate-800">
                        <div className="p-1.5 bg-white rounded-lg border border-slate-100">
                          <MdEvent size={14} className="text-blue-500" />
                        </div>
                        <p className="text-xs font-black uppercase tracking-widest">{selectedNotice.date}</p>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-3 flex items-center gap-2">
                        <MdPeople size={14} className="text-blue-500" />
                        Target Audience
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {selectedNotice.targetAudience.map(aud => (
                          <span key={aud} className="px-3 py-1 bg-white text-blue-700 rounded-lg text-[9px] font-black uppercase tracking-widest border border-blue-100 shadow-sm">
                            @{aud}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {selectedNotice.attachments && selectedNotice.attachments.length > 0 && (
                    <div className="pt-6 border-t border-slate-100">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-4 flex items-center gap-2">
                        <MdAttachFile size={14} className="text-indigo-500" />
                        Attachments
                      </label>
                      <div className="grid grid-cols-1 gap-3">
                        {selectedNotice.attachments.map((file, idx) => (
                          <a 
                            key={idx}
                            href={resolveDocUrl(file)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-500 transition-all group shadow-sm"
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all shrink-0">
                                <MdAttachFile size={16} />
                              </div>
                              <span className="text-[10px] font-bold text-slate-700 truncate">
                                {file.split('/').pop().split('-').slice(1).join('-') || 'Doc ' + (idx + 1)}
                              </span>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-6 border-t border-slate-100">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Created By</label>
                    <p className="text-[11px] font-bold text-slate-600 truncate">{selectedNotice.createdBy}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-8 border-t border-slate-50 flex justify-end gap-4 bg-white shrink-0">
              <button 
                onClick={() => setShowViewModal(false)}
                className="px-10 py-3 font-black text-xs uppercase tracking-[0.15em] bg-slate-900 text-white rounded-2x hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
              >
                Dismiss View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Notice Modal */}
      {showEditModal && editingNotice && (
        <div className="fixed inset-0 backdrop-blur-md bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full animate-modalIn overflow-hidden">
            <div className="flex justify-between items-center p-8 border-b border-slate-50 bg-slate-50/30">
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Edit Notice</h3>
              <button 
                onClick={() => setShowEditModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 bg-white shadow-sm rounded-xl transition-all"
              >
                <MdClose size={20} />
              </button>
            </div>
            
            <div className="p-10 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Title</label>
                <input
                  type="text"
                  value={editFormData.title || ''}
                  onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none font-bold text-slate-800"
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Content</label>
                <textarea
                  value={editFormData.content || ''}
                  onChange={(e) => setEditFormData({...editFormData, content: e.target.value})}
                  rows="5"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-slate-600 font-medium"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Priority</label>
                  <select
                    value={editFormData.priority || 'normal'}
                    onChange={(e) => setEditFormData({...editFormData, priority: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none font-bold"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="p-8 border-t border-slate-50 flex justify-end gap-3 bg-slate-50/30">
              <button 
                onClick={handleSaveEdit}
                className="px-10 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
              >
                Save Changes
              </button>
              <button 
                onClick={() => setShowEditModal(false)}
                className="px-10 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notices;