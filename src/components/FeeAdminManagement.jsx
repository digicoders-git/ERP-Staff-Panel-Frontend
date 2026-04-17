import React, { useState, useEffect } from 'react';
import { FaUserTie, FaPlus, FaEdit, FaTrash, FaSpinner, FaEnvelope, FaPhone, FaIdCard } from 'react-icons/fa';
import { MdClose, MdCheckCircle } from 'react-icons/md';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import api from '../utils/api';

const FeeAdminManagement = () => {
  const [loading, setLoading] = useState(false);
  const [feeAdmins, setFeeAdmins] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    employeeId: '',
    status: 'active'
  });

  useEffect(() => {
    fetchFeeAdmins();
  }, []);

  const fetchFeeAdmins = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/staff-panel/fee-admin');
      setFeeAdmins(res.data.feeAdmins || []);
    } catch (err) {
      toast.error('Failed to load fee admins');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/api/staff-panel/fee-admin/${editingId}`, formData);
        toast.success('Fee Admin updated successfully');
      } else {
        await api.post('/api/staff-panel/fee-admin', formData);
        toast.success('Fee Admin created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchFeeAdmins();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (admin) => {
    setFormData({
      name: admin.name,
      email: admin.email,
      mobile: admin.mobile,
      password: '',
      employeeId: admin.employeeId,
      status: admin.status
    });
    setEditingId(admin._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Fee Admin?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Delete'
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        await api.delete(`/api/staff-panel/fee-admin/${id}`);
        toast.success('Fee Admin deleted');
        fetchFeeAdmins();
      } catch (err) {
        toast.error('Failed to delete');
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      mobile: '',
      password: '',
      employeeId: '',
      status: 'active'
    });
    setEditingId(null);
  };

  const inputCls = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 font-medium text-slate-700 transition-all text-sm";
  const labelCls = "block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <div className="w-2 h-8 bg-indigo-600 rounded-full" />
            Fee Admin Management
          </h1>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">
            Manage fee collection administrators
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 font-bold text-sm transition-all shadow-lg shadow-indigo-200"
        >
          <FaPlus size={14} /> Add Fee Admin
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <FaUserTie size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Total Admins</p>
              <p className="text-2xl font-black text-slate-800">{feeAdmins.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <MdCheckCircle size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Active</p>
              <p className="text-2xl font-black text-slate-800">
                {feeAdmins.filter(a => a.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
              <MdClose size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Inactive</p>
              <p className="text-2xl font-black text-slate-800">
                {feeAdmins.filter(a => a.status === 'inactive').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center">
            <FaSpinner className="animate-spin text-indigo-600 text-3xl" />
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Name', 'Employee ID', 'Contact', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-left">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {feeAdmins.map(admin => (
                <tr key={admin._id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-black">
                        {admin.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-slate-800 text-sm">{admin.name}</p>
                        <p className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                          <FaEnvelope size={10} /> {admin.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-2 w-fit">
                      <FaIdCard size={12} /> {admin.employeeId}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                      <FaPhone size={12} /> {admin.mobile}
                    </p>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      admin.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : 'bg-rose-50 text-rose-700 border border-rose-100'
                    }`}>
                      {admin.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(admin)}
                        className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(admin._id)}
                        className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {feeAdmins.length === 0 && !loading && (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <FaUserTie size={40} className="mx-auto mb-4 opacity-20" />
                    <p className="font-bold text-sm text-slate-400">No fee admins found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-8 py-5 border-b border-slate-100">
              <h3 className="text-xl font-black text-slate-800">
                {editingId ? 'Edit Fee Admin' : 'Add New Fee Admin'}
              </h3>
              <button
                onClick={() => { setShowModal(false); resetForm(); }}
                className="p-2 bg-slate-100 text-slate-500 hover:bg-rose-50 hover:text-rose-500 rounded-xl transition-all"
              >
                <MdClose size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={inputCls}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className={labelCls}>Employee ID</label>
                  <input
                    type="text"
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    className={inputCls}
                    placeholder="EMP001"
                    required
                  />
                </div>
                <div>
                  <label className={labelCls}>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={inputCls}
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div>
                  <label className={labelCls}>Mobile</label>
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className={inputCls}
                    placeholder="9876543210"
                    required
                  />
                </div>
                <div>
                  <label className={labelCls}>Password {editingId && '(Leave blank to keep current)'}</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={inputCls}
                    placeholder="••••••••"
                    required={!editingId}
                  />
                </div>
                <div>
                  <label className={labelCls}>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className={inputCls}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-[2] py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingId ? 'Update Admin' : 'Create Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeAdminManagement;
