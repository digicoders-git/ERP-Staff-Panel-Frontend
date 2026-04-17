import React, { useState, useEffect } from 'react';
import { MdSearch, MdPeople, MdCheckCircle, MdWarning, MdAdd, MdEdit, MdDelete, MdChevronLeft, MdChevronRight, MdFilterList, MdClose, MdContactPhone, MdEmail } from 'react-icons/md';
import { libraryAPI } from '../utils/apiService';
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';

const LibraryMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const userRole = localStorage.getItem('userRole');
  const isAdmin = ['branchAdmin', 'superAdmin', 'clientAdmin'].includes(userRole);
  const isLibrarian = userRole === 'libraryAdmin' || isAdmin;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    memberId: '',
    type: 'Student',
    status: 'Active',
    joiningDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchMembers();
  }, [page, filterType]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        search: searchTerm,
        type: filterType === 'All' ? undefined : filterType
      };
      const res = await libraryAPI.getMembers(params);
      if (res.data && res.data.success) {
        setMembers(res.data.data?.members || []);
        setPagination({
          total: res.data.data?.totalMembers || 0,
          pages: res.data.data?.totalPages || 1
        });
      }
    } catch (err) {
      console.error('Members fetch error:', err);
      toast.error('Failed to sync with personnel record');
      setMembers([]);
      setPagination({ total: 0, pages: 1 });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      setPage(1);
      fetchMembers();
    }
  };

  const handleOpenModal = (member = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name || '',
        email: member.email || '',
        phone: member.phone || '',
        memberId: member.memberId || '',
        type: member.type || 'Student',
        status: member.status || 'Active',
        joiningDate: member.joiningDate ? new Date(member.joiningDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      });
    } else {
      setEditingMember(null);
      setFormData({
        name: '', email: '', phone: '', memberId: '', type: 'Student', status: 'Active',
        joiningDate: new Date().toISOString().split('T')[0]
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingMember) {
        await libraryAPI.updateMember(editingMember._id, formData);
        toast.success('Member details updated successfully');
      } else {
        await libraryAPI.addMember(formData);
        toast.success('New member registered successfully');
      }
      setIsModalOpen(false);
      fetchMembers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Protocol failure');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Remove this member from library? This cannot be undone.')) {
      try {
        setLoading(true);
        await libraryAPI.deleteMember(id);
        toast.success('Member removed successfully');
        fetchMembers();
      } catch (err) {
        toast.error('Failed to remove member');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-10 bg-slate-50/20 p-2 min-h-screen animate-fadeIn">
      {loading && (
        <div className="fixed inset-0 bg-white/60 flex items-center justify-center z-[75] backdrop-blur-[2px]">
           <FaSpinner className="animate-spin text-emerald-600 text-5xl" />
        </div>
      )}

      {/* Luxury Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 gap-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full -mr-32 -mt-32 opacity-50 group-hover:scale-110 transition-transform duration-700"></div>
        <div className="relative">
          <h1 className="text-4xl font-black text-slate-800 tracking-tighter uppercase italic underline decoration-emerald-600 underline-offset-8 decoration-4">Library Members</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-3">Manage students and staff members in the library</p>
        </div>
        {isLibrarian && (
          <div className="flex gap-4 relative">
              <button 
                  onClick={() => handleOpenModal()}
                  className="flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:shadow-xl hover:shadow-emerald-100 transition-all active:scale-95"
              >
                  <MdAdd size={20} /> Add New Member
              </button>
          </div>
        )}
      </div>

      {/* Advanced Filter Control */}
      <div className="flex flex-col lg:flex-row gap-6 bg-white/50 p-6 rounded-[2.5rem] border border-slate-100 backdrop-blur-md">
        <div className="relative flex-1">
          <MdSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
          <input
            type="text"
            placeholder="SEARCH MEMBER (PRESS ENTER)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full bg-white border-2 border-transparent focus:border-emerald-600 rounded-[1.5rem] pl-16 pr-8 py-5 outline-none font-black text-[10px] tracking-widest uppercase transition-all shadow-sm"
          />
        </div>
        <div className="flex gap-4">
            <div className="relative min-w-[200px]">
                <MdFilterList className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full bg-white border-2 border-transparent focus:border-emerald-600 rounded-[1.5rem] pl-16 pr-8 py-5 outline-none font-black text-[10px] tracking-widest uppercase transition-all shadow-sm appearance-none cursor-pointer"
                >
                    <option value="All">ALL MEMBERS</option>
                    <option value="Student">STUDENTS</option>
                    <option value="Teacher">TEACHERS</option>
                    <option value="Staff">OFFICE STAFF</option>
                </select>
            </div>
        </div>
      </div>

      {/* Personnel Matrix Table */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                <th className="px-10 py-8 text-left">Member Name</th>
                <th className="px-10 py-8 text-center">Contact Details</th>
                <th className="px-10 py-8 text-center">Member Type</th>
                <th className="px-10 py-8 text-center">Status</th>
                <th className="px-10 py-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {members.length > 0 ? members.map(member => (
                <tr key={member._id} className="hover:bg-slate-50/30 transition-all group italic">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-800 font-black group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-inner">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-base font-black text-slate-800 tracking-tighter group-hover:text-emerald-600 transition-colors uppercase italic">{member.name}</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5 opacity-60">ID: {member.memberId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <div className="space-y-1.5 inline-block text-left">
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-tighter">
                            <MdEmail size={14} className="text-emerald-500" /> {member.email}
                        </div>
                        <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase italic opacity-70">
                            <MdContactPhone size={14} className="text-emerald-500" /> {member.phone}
                        </div>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-slate-200">
                        {member.type} MEMBER
                    </span>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <span className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                      member.status === 'Active' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-rose-50 text-rose-600 border-rose-100'
                    }`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    {isLibrarian ? (
                      <div className="flex items-center justify-end gap-3">
                          <button 
                              onClick={() => handleOpenModal(member)}
                              className="p-3 bg-white text-slate-400 hover:text-emerald-600 hover:bg-slate-50 border border-slate-100 rounded-xl transition-all shadow-sm"
                          >
                              <MdEdit size={20} />
                          </button>
                          <button 
                              onClick={() => handleDelete(member._id)}
                              className="p-3 bg-white text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-100 rounded-xl transition-all shadow-sm"
                          >
                              <MdDelete size={20} />
                          </button>
                      </div>
                    ) : (
                      <span className="text-[9px] font-black text-slate-400 uppercase italic opacity-60">Read Only</span>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                    <td colSpan="5" className="py-40 text-center opacity-10">
                        <MdPeople size={80} className="mx-auto mb-6" />
                        <p className="text-[10px] font-black uppercase tracking-[0.5em]">No Members Found</p>
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Dynamic Pagination */}
        <div className="px-10 py-8 bg-slate-50/50 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                Showing units {(page - 1) * 10 + 1} to {Math.min(page * 10, pagination.total)} of {pagination.total} total
            </p>
            <div className="flex gap-4">
                <button 
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-black hover:text-white transition-all disabled:opacity-20 shadow-sm"
                >
                    <MdChevronLeft size={24} />
                </button>
                <div className="px-6 flex items-center bg-white border border-slate-200 rounded-xl font-black text-[11px] shadow-sm italic">
                    {page} / {pagination.pages}
                </div>
                <button 
                    disabled={page === pagination.pages}
                    onClick={() => setPage(page + 1)}
                    className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-black hover:text-white transition-all disabled:opacity-20 shadow-sm"
                >
                    <MdChevronRight size={24} />
                </button>
            </div>
        </div>
      </div>

      {/* Personnel Authorization Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-slate-900/40 animate-fadeIn">
            <div className="bg-white rounded-[3.5rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-[0_20px_70px_rgba(0,0,0,0.3)] border border-white/20 relative animate-slideUp">
                <div className="p-12">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic">{editingMember ? 'Edit Member' : 'Add New Member'}</h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Update member details in the library records</p>
                        </div>
                        <button 
                            onClick={() => setIsModalOpen(false)}
                            className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-black hover:text-white transition-all"
                        >
                            <MdClose size={28} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                { label: 'Full Name', field: 'name', type: 'text', placeholder: 'Enter full name...' },
                                { label: 'Member ID', field: 'memberId', type: 'text', placeholder: 'Unique ID number...' },
                                { label: 'Email Address', field: 'email', type: 'email', placeholder: 'example@email.com' },
                                { label: 'Mobile Number', field: 'phone', type: 'text', placeholder: '+91 XXXXX XXXXX' }
                            ].map(input => (
                                <div key={input.field} className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-4">{input.label}</label>
                                    <input
                                        required
                                        type={input.type}
                                        value={formData[input.field]}
                                        onChange={(e) => setFormData({...formData, [input.field]: e.target.value})}
                                        className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-600 rounded-2xl px-6 py-4 outline-none font-bold text-sm transition-all"
                                        placeholder={input.placeholder}
                                    />
                                </div>
                            ))}

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-4">Member Category</label>
                                <select
                                    required
                                    value={formData.type}
                                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                                    className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-600 rounded-2xl px-6 py-4 outline-none font-bold text-sm transition-all appearance-none italic"
                                >
                                    <option value="Student">STUDENTS</option>
                                    <option value="Teacher">TEACHERS</option>
                                    <option value="Staff">OFFICE STAFF</option>
                                </select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-4">Account Status</label>
                                <select
                                    required
                                    value={formData.status}
                                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                                    className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-600 rounded-2xl px-6 py-4 outline-none font-bold text-sm transition-all appearance-none italic"
                                >
                                    <option value="Active">ACTIVE</option>
                                    <option value="Inactive">INACTIVE</option>
                                </select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-4">Member Since</label>
                                <input
                                    required
                                    type="date"
                                    value={formData.joiningDate}
                                    onChange={(e) => setFormData({...formData, joiningDate: e.target.value})}
                                    className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-600 rounded-2xl px-6 py-4 outline-none font-bold text-sm transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex gap-6 mt-12 pb-12">
                            <button 
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 py-5 rounded-2xl border-2 border-slate-100 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                className="flex-[2] py-5 rounded-2xl bg-slate-800 text-white font-black text-[10px] uppercase tracking-[0.3em] hover:bg-black shadow-xl transition-all shadow-slate-200 active:scale-[0.98]"
                            >
                                {editingMember ? 'Save Changes' : 'Add Member'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default LibraryMembers;
