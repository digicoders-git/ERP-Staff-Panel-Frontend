import React, { useState } from 'react';
import { MdCampaign, MdAdd, MdEdit, MdDelete, MdVisibility, MdClose, MdSend } from 'react-icons/md';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const Notices = () => {
  const [showForm, setShowForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [editingNotice, setEditingNotice] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', priority: 'normal' });
  const [editFormData, setEditFormData] = useState({});

  const [noticeData, setNoticeData] = useState([
    { id: 'NOT001', title: 'Admission Process Update', content: 'New admission guidelines for 2024-25 academic year. All students must submit their documents by the specified deadline.', priority: 'high', date: '2024-01-15', status: 'active' },
    { id: 'NOT002', title: 'Fee Payment Reminder', content: 'Last date for fee payment is Jan 31, 2024. Late fees will be applicable after the due date.', priority: 'medium', date: '2024-01-14', status: 'active' },
    { id: 'NOT003', title: 'Document Verification Schedule', content: 'Document verification will be conducted from Jan 20-25, 2024. Students must bring original documents.', priority: 'normal', date: '2024-01-13', status: 'active' },
    { id: 'NOT004', title: 'Holiday Notice', content: 'School will remain closed on Jan 26, 2024 for Republic Day celebration.', priority: 'low', date: '2024-01-12', status: 'draft' }
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newNotice = {
      id: `NOT${String(noticeData.length + 1).padStart(3, '0')}`,
      title: formData.title,
      content: formData.content,
      priority: formData.priority,
      date: new Date().toISOString().split('T')[0],
      status: 'active'
    };
    
    setNoticeData([newNotice, ...noticeData]);
    setShowForm(false);
    setFormData({ title: '', content: '', priority: 'normal' });
    toast.success('Notice published successfully! 📢');
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

  const handleSaveEdit = () => {
    setNoticeData(noticeData.map(notice => 
      notice.id === editingNotice.id ? { ...editFormData } : notice
    ));
    setShowEditModal(false);
    toast.success(`Notice "${editFormData.title}" updated successfully! ✏️`);
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
    }).then((result) => {
      if (result.isConfirmed) {
        setNoticeData(noticeData.filter(n => n.id !== notice.id));
        toast.success('Notice deleted successfully! 🗑️');
      }
    });
  };

  const handleStatusToggle = (notice) => {
    const newStatus = notice.status === 'active' ? 'draft' : 'active';
    setNoticeData(noticeData.map(n => 
      n.id === notice.id ? { ...n, status: newStatus } : n
    ));
    toast.success(`Notice ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`);
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
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-600 rounded-xl p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold mb-2">Notice Management</h2>
            <p className="text-blue-100">Create and manage school notices</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 flex items-center gap-2"
          >
            <MdAdd size={20} />
            Create Notice
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-4">Create New Notice</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">Notice Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter notice title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                rows="4"
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter notice content"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">Attach Document/Image (Optional)</label>
              <input
                type="file"
                onChange={(e) => setFormData({...formData, attachment: e.target.files[0]})}
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
              />
              <p className="text-xs text-gray-500 mt-1">Supported formats: PDF, DOC, DOCX, JPG, PNG, GIF (Max 5MB)</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Publish Notice
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-white text-blue-600 border border-blue-200 px-6 py-2 rounded-lg hover:bg-blue-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Total Notices</h3>
          <p className="text-3xl font-bold text-blue-600">24</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Active</h3>
          <p className="text-3xl font-bold text-blue-600">18</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Draft</h3>
          <p className="text-3xl font-bold text-blue-600">4</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">This Month</h3>
          <p className="text-3xl font-bold text-blue-600">12</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-blue-100">
          <h3 className="text-xl font-bold text-blue-900">All Notices</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Title</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Priority</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {noticeData.map(notice => (
                <tr key={notice.id} className="hover:bg-blue-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-blue-900">{notice.title}</p>
                      <p className="text-sm text-blue-600">{notice.content.substring(0, 50)}...</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(notice.priority)}`}>
                      {notice.priority.charAt(0).toUpperCase() + notice.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-blue-700">{notice.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(notice.status)}`}>
                      {notice.status.charAt(0).toUpperCase() + notice.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleView(notice)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="View Notice"
                      >
                        <MdVisibility size={18} />
                      </button>
                      <button 
                        onClick={() => handleEdit(notice)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Edit Notice"
                      >
                        <MdEdit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(notice)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete Notice"
                      >
                        <MdDelete size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Notice Modal */}
      {showViewModal && selectedNotice && (
        <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-blue-100">
              <h3 className="text-xl font-bold text-blue-900">Notice Details</h3>
              <button 
                onClick={() => setShowViewModal(false)}
                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <MdClose size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">Title</label>
                <h4 className="text-lg font-bold text-blue-900">{selectedNotice.title}</h4>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">Priority</label>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedNotice.priority)}`}>
                    {selectedNotice.priority.charAt(0).toUpperCase() + selectedNotice.priority.slice(1)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">Status</label>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedNotice.status)}`}>
                    {selectedNotice.status.charAt(0).toUpperCase() + selectedNotice.status.slice(1)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">Date</label>
                  <p className="text-blue-900 font-semibold">{selectedNotice.date}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">Content</label>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-blue-900 leading-relaxed">{selectedNotice.content}</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 p-6 border-t border-blue-100">
              <button 
                onClick={() => handleStatusToggle(selectedNotice)}
                className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  selectedNotice.status === 'active' 
                    ? 'bg-gray-600 text-white hover:bg-gray-700' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                <MdSend size={18} />
                {selectedNotice.status === 'active' ? 'Deactivate' : 'Activate'}
              </button>
              <button 
                onClick={() => setShowViewModal(false)}
                className="px-6 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Notice Modal */}
      {showEditModal && editingNotice && (
        <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-blue-100">
              <h3 className="text-xl font-bold text-blue-900">Edit Notice</h3>
              <button 
                onClick={() => setShowEditModal(false)}
                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <MdClose size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">Notice Title</label>
                <input
                  type="text"
                  value={editFormData.title || ''}
                  onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter notice title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">Content</label>
                <textarea
                  value={editFormData.content || ''}
                  onChange={(e) => setEditFormData({...editFormData, content: e.target.value})}
                  rows="5"
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter notice content"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">Priority</label>
                  <select
                    value={editFormData.priority || 'normal'}
                    onChange={(e) => setEditFormData({...editFormData, priority: e.target.value})}
                    className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">Status</label>
                  <select
                    value={editFormData.status || 'active'}
                    onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                    className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 p-6 border-t border-blue-100">
              <button 
                onClick={handleSaveEdit}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
              <button 
                onClick={() => setShowEditModal(false)}
                className="px-6 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
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