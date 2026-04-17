import React, { useState, useEffect } from 'react';
import {
  MdConnectWithoutContact,
  MdSearch,
  MdFilterList,
  MdEmail,
  MdWork,
  MdPeople,
  MdLocationOn,
  MdPhone,
  MdArrowBack,
  MdAdd,
  MdVisibility,
  MdDelete,
  MdEdit,
  MdClose,
  MdVerified,
  MdGrade
} from 'react-icons/md';
import { FaSpinner, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { alumniAPI } from '../utils/apiService';

const AlumniManagement = () => {
  const [view, setView] = useState('directory');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlum, setSelectedAlum] = useState(null);
  const [filterBatch, setFilterBatch] = useState('All');
  const [filterDept, setFilterDept] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alumni, setAlumni] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 0 });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '', batch: '', department: '', currentRole: '', location: '',
    email: '', phone: '', achievements: '', bio: '', mentorship: false
  });
  const [availableBatches, setAvailableBatches] = useState([]);
  const [availableDepts, setAvailableDepts] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchAlumni();
  }, [pagination.page, filterBatch, filterDept, searchTerm]);

  const fetchAlumni = async () => {
    try {
      setLoading(true);
      const res = await alumniAPI.getAll({ 
        page: pagination.page, 
        limit: pagination.limit,
        batch: filterBatch !== 'All' ? filterBatch : undefined,
        department: filterDept !== 'All' ? filterDept : undefined,
        search: searchTerm
      });
      
      if (res.data) {
        setAlumni(res.data.alumni || []);
        if (res.data.pagination) setPagination(res.data.pagination);
        if (res.data.batches) setAvailableBatches(res.data.batches);
        if (res.data.departments) setAvailableDepts(res.data.departments);
      }
    } catch (err) {
      console.error('Failed to fetch alumni:', err);
      toast.error('Failed to load alumni network');
    } finally {
      setLoading(false);
    }
  };

  const allAlumni = alumni;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if (selectedFile) data.append('image', selectedFile);

      await alumniAPI.create(data);
      toast.success('Alumni added successfully! 🎓');
      setShowAddModal(false);
      setFormData({ name: '', batch: '', department: '', currentRole: '', location: '', email: '', phone: '', achievements: '', bio: '', mentorship: false });
      setSelectedFile(null);
      setImagePreview(null);
      fetchAlumni();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add alumni');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (alum) => {
    setEditingAlum(alum);
    setFormData({ ...alum });
    setImagePreview(alum.profileImage || null);
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = new FormData();
      // Handle the case where some fields might be null/missing
      Object.keys(formData).forEach(key => {
        if (key !== 'profileImage' && key !== 'image') {
          data.append(key, formData[key] || '');
        }
      });
      if (selectedFile) data.append('image', selectedFile);

      await alumniAPI.update(editingAlum._id || editingAlum.id, data);
      toast.success('Alumni updated successfully! ✏️');
      setShowEditModal(false);
      setSelectedFile(null);
      setImagePreview(null);
      fetchAlumni();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update alumni');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5002';
    return `${backendUrl}/${path.replace(/\\/g, '/')}`;
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#10B981',
      cancelButtonColor: '#F43F5E',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        await alumniAPI.delete(id);
        toast.success('Alumni record deleted 🗑️');
        fetchAlumni();
      } catch (err) {
        toast.error('Failed to delete record');
      } finally {
        setLoading(false);
      }
    }
  };

  const [editingAlum, setEditingAlum] = useState(null);

  const batches = ['All', ...availableBatches];
  const departments = ['All', ...availableDepts];

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen space-y-6">
      {loading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <FaSpinner className="animate-spin text-blue-500 text-5xl" />
        </div>
      )}
      {/* Premium Header Section - Compact */}
      <div className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] rounded-[1.5rem] p-6 text-white shadow-xl relative overflow-hidden border border-white/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-emerald-500/10 rounded-2xl backdrop-blur-xl border border-emerald-500/20">
              <MdConnectWithoutContact size={32} className="text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight leading-tight">
                Alumni Network
              </h1>
              <p className="text-slate-400 text-sm font-medium">Connecting the past, present, and future</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-white text-[#0f172a] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-lg flex items-center gap-2"
            >
              <MdAdd size={20} />
              Add Alumni
            </button>
            <div className="hidden lg:flex gap-3">
              <div className="bg-white/5 backdrop-blur-md rounded-2xl px-5 py-3 border border-white/10 min-w-[130px]">
                <p className="text-emerald-400 text-[10px] font-black uppercase tracking-wider mb-0.5">Network</p>
                <h3 className="text-2xl font-black">{pagination.total}+</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-6">
        {view === 'directory' && (
          <>
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-xl group">
                <MdSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors text-xl" />
                <input
                  type="text"
                  placeholder="Search by name, year, or stream..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-4 py-4 bg-white border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none shadow-sm transition-all"
                />
              </div>
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`flex items-center space-x-3 px-8 py-4 rounded-[1.5rem] font-black tracking-wide transition-all ${isFilterOpen ? 'bg-slate-900 text-white shadow-xl' : 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-500 hover:text-emerald-600 shadow-sm'}`}
                >
                  <MdFilterList size={24} />
                  <span>SMART FILTERS {(filterBatch !== 'All' || filterDept !== 'All') && '•'}</span>
                </button>

                {isFilterOpen && (
                  <div className="absolute right-0 mt-4 w-80 bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-8 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Filter by Batch</label>
                        <select
                          value={filterBatch}
                          onChange={(e) => setFilterBatch(e.target.value)}
                          className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700 appearance-none cursor-pointer"
                        >
                          {batches.map(batch => (
                            <option key={batch} value={batch}>{batch}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Filter by Stream</label>
                        <select
                          value={filterDept}
                          onChange={(e) => setFilterDept(e.target.value)}
                          className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700 appearance-none cursor-pointer"
                        >
                          {departments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </select>
                      </div>

                      <button
                        onClick={() => {
                          setFilterBatch('All');
                          setFilterDept('All');
                        }}
                        className="w-full py-4 text-xs font-black text-rose-500 hover:bg-rose-50 rounded-2xl transition-all uppercase tracking-widest"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Alumni Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {allAlumni.length > 0 ? (
                allAlumni.map((alum) => (
                  <div key={alum._id || alum.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group relative">
                    {alum.mentorship && (
                      <div className="absolute -top-2 -right-2 bg-emerald-500 text-white p-2 rounded-xl shadow-lg shadow-emerald-200 z-10" title="Available for Mentorship">
                        <MdVerified size={16} />
                      </div>
                    )}
                    <div className="flex items-start space-x-5">
                      <div className="relative shrink-0">
                        <img
                          src={getImageUrl(alum.profileImage) || `https://ui-avatars.com/api/?name=${encodeURIComponent(alum.name)}&background=random`}
                          alt={alum.name}
                          className="w-20 h-20 rounded-xl object-cover group-hover:scale-105 transition-transform duration-300 border border-slate-100"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <div className="truncate">
                            <h3 className="text-lg font-bold text-slate-900 leading-tight truncate">{alum.name}</h3>
                            <p className="text-emerald-600 font-bold text-[10px] uppercase tracking-wider">Class of {alum.batch} • {alum.department}</p>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(alum)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><MdEdit size={16} /></button>
                            <button onClick={() => handleDelete(alum._id || alum.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><MdDelete size={16} /></button>
                          </div>
                        </div>

                        <div className="mt-3 space-y-1.5">
                          <div className="flex items-center text-xs text-slate-500 font-medium truncate">
                            <MdWork className="mr-2 text-slate-300 group-hover:text-emerald-400 shrink-0" />
                            <span className="truncate">{alum.currentRole || 'Professional'}</span>
                          </div>
                          <div className="flex items-center text-xs text-slate-500 truncate">
                            <MdLocationOn className="mr-2 text-slate-300 group-hover:text-emerald-400 shrink-0" />
                            <span className="truncate">{alum.location || 'Location Not Set'}</span>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-50">
                          <button
                            onClick={() => {
                              setSelectedAlum(alum);
                              setView('profile');
                            }}
                            className="text-[10px] font-black text-slate-400 hover:text-emerald-600 transition-colors uppercase tracking-widest flex items-center gap-1"
                          >
                            <MdVisibility size={14} /> Full Profile
                          </button>
                          <a
                            href={`mailto:${alum.email}`}
                            className="text-[10px] font-black text-white bg-[#0f172a] hover:bg-emerald-600 px-4 py-2 rounded-xl transition-all shadow-md uppercase tracking-widest flex items-center gap-2"
                          >
                            <MdEmail size={12} /> Connect
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border border-dashed border-slate-200">
                   <MdPeople className="mx-auto text-slate-100 mb-4" size={80} />
                   <h3 className="text-xl font-black text-slate-400">No Alumni Records Found</h3>
                   <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Add new members to grow the network</p>
                </div>
              )}
            </div>

            {/* Professional Pagination Footer */}
            <div className="mt-8 flex items-center justify-between bg-white px-8 py-5 rounded-[2rem] shadow-sm border border-slate-100">
                <div className="flex items-center gap-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                    Showing <span className="text-slate-800">{(pagination.page - 1) * pagination.limit + 1}</span> to <span className="text-slate-800">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of <span className="text-slate-800">{pagination.total}</span> network members
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setPagination(prev => ({...prev, page: Math.max(1, prev.page - 1)}))}
                    disabled={pagination.page === 1}
                    className="p-3 rounded-2xl border border-slate-100 disabled:opacity-30 hover:bg-slate-50 transition-all text-slate-600"
                  >
                    <FaChevronLeft size={14} />
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {[...Array(pagination.totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setPagination(prev => ({...prev, page: i + 1}))}
                        className={`w-10 h-10 rounded-2xl font-bold text-xs transition-all ${
                          pagination.page === i + 1 
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' 
                            : 'text-slate-400 hover:bg-slate-50 outline-none border border-transparent'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button 
                    onClick={() => setPagination(prev => ({...prev, page: Math.min(pagination.totalPages, prev.page + 1)}))}
                    disabled={pagination.page >= pagination.totalPages}
                    className="p-3 rounded-2xl border border-slate-100 disabled:opacity-30 hover:bg-slate-50 transition-all text-slate-600"
                  >
                    <FaChevronRight size={14} />
                  </button>
                </div>
            </div>
          </>
        )}

        {view === 'profile' && selectedAlum && (
          <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Premium Profile Header */}
            <div className="h-64 bg-[#0f172a] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-transparent to-blue-500/10"></div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
              
              <button
                onClick={() => setView('directory')}
                className="absolute top-8 left-8 flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-2xl text-white hover:bg-white/20 transition-all border border-white/10 font-bold text-xs uppercase tracking-widest z-20"
              >
                <MdArrowBack size={18} />
                Back to Network
              </button>

              <div className="absolute -bottom-16 left-12 z-10 flex flex-col md:flex-row items-center md:items-end gap-8">
                <div className="relative group">
                   <div className="absolute -inset-1 bg-gradient-to-tr from-emerald-500 to-blue-500 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                   <img
                    src={getImageUrl(selectedAlum.profileImage) || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedAlum.name)}&background=0D8ABC&color=fff&size=200&bold=true`}
                    className="relative w-40 h-40 rounded-[2rem] border-4 border-white shadow-2xl object-cover shrink-0"
                    alt={selectedAlum.name}
                  />
                  {selectedAlum.mentorship && (
                    <div className="absolute -top-3 -right-3 bg-emerald-500 text-white p-2.5 rounded-2xl shadow-xl shadow-emerald-200 border-4 border-white">
                      <MdVerified size={20} />
                    </div>
                  )}
                </div>
                <div className="pb-4 text-center md:text-left translate-y-4 md:translate-y-0">
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">{selectedAlum.name}</h2>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <span className="px-4 py-1.5 bg-emerald-500 text-white text-[10px] font-black rounded-xl uppercase tracking-widest shadow-lg shadow-emerald-100 italic">
                      Class of {selectedAlum.batch}
                    </span>
                    <span className="px-4 py-1.5 bg-slate-100 text-slate-600 text-[10px] font-black rounded-xl uppercase tracking-widest border border-slate-200">
                      {selectedAlum.department}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-12 pt-24 pb-12">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Column: Sidebar Details */}
                <div className="space-y-8">
                  <div className="bg-slate-50/50 rounded-3xl p-8 border border-slate-100 space-y-6">
                    <div>
                      <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center">
                        <MdWork size={14} className="mr-2 text-emerald-500" />
                        Professional Role
                      </h5>
                      <p className="text-lg font-bold text-slate-700 leading-tight">
                        {selectedAlum.currentRole || 'Alumni Member'}
                      </p>
                    </div>

                    <div className="h-px bg-slate-100"></div>

                    <div>
                      <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center">
                        <MdLocationOn size={14} className="mr-2 text-emerald-500" />
                        Location
                      </h5>
                      <p className="text-slate-600 font-bold uppercase text-xs tracking-wide">
                        {selectedAlum.location || 'Location Not Specified'}
                      </p>
                    </div>

                    <div className="h-px bg-slate-100"></div>

                    <div>
                      <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center">
                        <MdEmail size={14} className="mr-2 text-emerald-500" />
                        Direct Contact
                      </h5>
                      <div className="space-y-3">
                        <a href={`mailto:${selectedAlum.email}`} className="block text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors truncate">
                          {selectedAlum.email}
                        </a>
                        <p className="text-sm font-bold text-slate-400">
                          {selectedAlum.phone || 'Phone hidden for privacy'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <a
                      href={`mailto:${selectedAlum.email}`}
                      className="w-full py-5 bg-[#0f172a] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-center hover:bg-emerald-600 shadow-xl transition-all flex items-center justify-center gap-3 group"
                    >
                      <MdEmail size={18} className="group-hover:scale-110 transition-transform" />
                      Send Private Message
                    </a>
                    {selectedAlum.mentorship && (
                      <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                         <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1 italic">Mentor Status</p>
                         <p className="text-xs font-bold text-emerald-700">Available to help junior students & fellow alumni</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Main Content */}
                <div className="lg:col-span-2 space-y-10">
                  <section>
                    <div className="flex items-center gap-4 mb-6">
                       <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600">
                          <MdGrade size={24} />
                       </div>
                       <div>
                          <h4 className="text-lg font-black text-slate-900 tracking-tight leading-none mb-1">Success Story & Achievements</h4>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Notable milestones and biography</p>
                       </div>
                    </div>
                    
                    <div className="space-y-6">
                      {selectedAlum.achievements ? (
                        <div className="bg-emerald-500/5 p-6 rounded-2xl border-l-4 border-emerald-500">
                           <p className="text-slate-700 font-bold leading-relaxed">
                             {selectedAlum.achievements}
                           </p>
                        </div>
                      ) : null}
                      
                      <div className="prose prose-slate max-w-none">
                        <p className="text-slate-600 leading-relaxed text-lg italic bg-slate-50/50 p-8 rounded-3xl border-2 border-dashed border-slate-100">
                          {selectedAlum.bio || "No biography provided. This alumni member is part of our growing professional network."}
                        </p>
                      </div>
                    </div>
                  </section>

                  <section className="pt-6 border-t border-slate-100">
                     <p className="text-center text-xs font-bold text-slate-300 uppercase tracking-[0.3em]">
                        Proud Alumni of Our Institution • Supporting Education
                     </p>
                  </section>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Alumni Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 backdrop-blur-md bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full animate-modalIn overflow-hidden">
            <div className="flex justify-between items-center p-8 border-b border-slate-50 bg-slate-50/30">
              <h3 className="text-xl font-black text-slate-800 tracking-tight">
                {showAddModal ? "Add Alumni to Network" : "Update Alumni Profile"}
              </h3>
              <button 
                onClick={() => { setShowAddModal(false); setShowEditModal(false); }}
                className="p-2 text-slate-400 hover:text-slate-600 bg-white shadow-sm rounded-xl transition-all"
              >
                <MdClose size={20} />
              </button>
            </div>
            
            <form onSubmit={showAddModal ? handleSubmit : handleUpdate} className="p-10 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 relative overflow-hidden group hover:border-emerald-400/50 transition-colors">
                   {imagePreview ? (
                     <div className="relative w-32 h-32 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
                        <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                        <button 
                          type="button"
                          onClick={() => { setSelectedFile(null); setImagePreview(null); }}
                          className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity backdrop-blur-sm"
                        >
                          <MdClose size={24} />
                          <span className="text-[8px] font-black uppercase mt-1 tracking-widest">Remove</span>
                        </button>
                     </div>
                   ) : (
                     <div className="text-center py-4">
                        <div className="mx-auto w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-emerald-500 mb-3 group-hover:scale-110 transition-transform">
                           <MdAdd size={32} />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Upload Profile Picture</p>
                        <p className="text-[8px] font-bold text-slate-300 mt-1 uppercase">JPG, PNG up to 5MB</p>
                     </div>
                   )}
                   <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                   />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Member Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold"
                    placeholder="E.g., Rahul Singh"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Batch Year</label>
                  <input
                    type="text"
                    required
                    value={formData.batch}
                    onChange={(e) => setFormData({...formData, batch: e.target.value})}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold"
                    placeholder="E.g., 2024"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Stream/Dept</label>
                  <input
                    type="text"
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold"
                    placeholder="E.g., Science (PCM)"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Current role / Professional Title</label>
                  <input
                    type="text"
                    value={formData.currentRole}
                    onChange={(e) => setFormData({...formData, currentRole: e.target.value})}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold"
                    placeholder="E.g., Software Engineer at Google"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Mobile Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold"
                    placeholder="E.g., +91 9988776655"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Location / City</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold"
                    placeholder="E.g., New Delhi, India"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Mentorship Status</label>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, mentorship: !formData.mentorship})}
                    className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm ${formData.mentorship ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                  >
                    {formData.mentorship ? "Enabled - Ready to Mentor" : "Disabled"}
                  </button>
                </div>
              </div>

              <div className="flex gap-4 pt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-4 bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50"
                >
                  {loading ? "Processing..." : showAddModal ? "Confirm & Add Member" : "Update Profile"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setShowEditModal(false); }}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-200 transition-all outline-none"
                >
                  Discard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlumniManagement;