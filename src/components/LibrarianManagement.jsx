import React, { useState, useEffect, useRef } from 'react';
import { 
  MdAdd, MdEdit, MdDelete, MdSearch, MdClose, MdVisibility, 
  MdVisibilityOff, MdRefresh, MdPeople, MdSupervisorAccount, 
  MdVerifiedUser, MdEmail, MdPhone, MdLocationOn, MdSchool, 
  MdAttachMoney, MdCalendarToday, MdTransgender, MdWork, MdCameraAlt,
  MdError, MdPrint, MdBadge
} from 'react-icons/md';
import { librarianAPI } from '../utils/apiService';
import { BASE_URL } from '../utils/api';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { FaSpinner } from 'react-icons/fa';

const LibrarianManagement = () => {
  const [librarians, setLibrarians] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedLibrarian, setSelectedLibrarian] = useState(null);
  const [editingLibrarian, setEditingLibrarian] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', 
    qualification: '', salary: '', address: '', gender: 'Male', 
    experience: '', dob: '', status: 'Active', profileImage: null
  });

  useEffect(() => {
    fetchLibrarians();
  }, []);

  const fetchLibrarians = async () => {
    try {
      setLoading(true);
      const res = await librarianAPI.getLibrarians();
      if (res.data && res.data.success) {
        setLibrarians(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load librarian data');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const filteredLibrarians = librarians.filter(lib =>
    lib.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lib.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lib.staffId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (librarian = null) => {
    setEditingLibrarian(librarian);
    setErrors({});
    if (librarian) {
      setFormData({
        name: librarian.name || '',
        email: librarian.email || '',
        phone: librarian.phone || '',
        password: '',
        qualification: librarian.qualification || '',
        salary: librarian.salary || '',
        address: librarian.address || '',
        gender: librarian.gender || 'Male',
        experience: librarian.experience || '',
        dob: librarian.dob ? new Date(librarian.dob).toISOString().split('T')[0] : '',
        status: librarian.status || 'Active',
        profileImage: null
      });
      setPreviewImage(getImageUrl(librarian.profileImage));
    } else {
      setFormData({
        name: '', email: '', phone: '', password: '', 
        qualification: '', salary: '', address: '', gender: 'Male', 
        experience: '', dob: '', status: 'Active', profileImage: null
      });
      setPreviewImage(null);
    }
    setShowModal(true);
  };

  const handleViewProfile = (librarian) => {
    setSelectedLibrarian(librarian);
    setShowProfileModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size should be less than 2MB');
        return;
      }
      setFormData({ ...formData, profileImage: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    else if (formData.name.length < 3) newErrors.name = 'Name must be 3+ chars';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) newErrors.email = 'Email ID is required';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email';

    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    else if (!phoneRegex.test(formData.phone)) newErrors.phone = 'Must be 10 digits';

    if (!editingLibrarian && !formData.password) newErrors.password = 'Required';
    else if (formData.password && formData.password.length < 6) newErrors.password = 'Min 6 chars';

    if (!formData.salary) newErrors.salary = 'Required';
    else if (parseFloat(formData.salary) <= 0) newErrors.salary = 'Must be positive';

    if (formData.dob) {
      if (new Date(formData.dob) > new Date()) newErrors.dob = 'Cannot be future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent multiple submissions
    if (!validateForm()) return;

    try {
      setLoading(true);
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) data.append(key, formData[key]);
      });

      if (editingLibrarian) {
        await librarianAPI.updateLibrarian(editingLibrarian._id, data);
        toast.success('Librarian details updated');
      } else {
        await librarianAPI.createLibrarian(data);
        toast.success('New librarian added');
      }
      setShowModal(false);
      fetchLibrarians();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const handleDeleteLibrarian = (id) => {
    Swal.fire({
      title: 'Remove Librarian?',
      text: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      confirmButtonText: 'Yes, Remove',
      customClass: { popup: 'rounded-3xl border-none p-10 font-bold' }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          await librarianAPI.deleteLibrarian(id);
          toast.success('Librarian removed');
          fetchLibrarians();
        } catch (err) {
          toast.error('Deletion failed');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  return (
    <div className="space-y-6 bg-slate-50 p-6 min-h-screen animate-fadeIn italic">
      {/* Full-screen loading overlay only for fetching, not for small actions */}
      {loading && !showModal && (
        <div className="fixed inset-0 bg-white/60 flex items-center justify-center z-[100] backdrop-blur-[2px]">
          <FaSpinner className="animate-spin text-indigo-600 text-5xl" />
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-8 rounded-3xl shadow-sm border border-slate-100 gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase underline decoration-indigo-600 underline-offset-4 decoration-4">
            Librarian Management
          </h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Staff Registry & Digital Profiles</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="SEARCH STAFF..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 bg-slate-50 border border-slate-200 focus:border-indigo-600 rounded-xl pl-12 pr-6 py-3.5 outline-none font-bold text-[11px] tracking-wider transition-all"
            />
            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-6 py-3.5 bg-indigo-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg active:scale-95"
          >
            <MdAdd size={20} /> Add Staff
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="px-8 py-6 text-left">Librarian Profile</th>
                <th className="px-8 py-6 text-center">Contact Info</th>
                <th className="px-8 py-6 text-center">Qualification</th>
                <th className="px-8 py-6 text-center">Salary (₹)</th>
                <th className="px-8 py-6 text-center">Status</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-[13px] font-bold text-slate-600">
              {filteredLibrarians.length > 0 ? filteredLibrarians.map((lib) => (
                <tr key={lib._id} className="hover:bg-indigo-50/20 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        {lib.profileImage ? (
                          <img src={getImageUrl(lib.profileImage)} alt={lib.name} className="w-12 h-12 rounded-xl object-cover border-2 border-slate-100 shadow-sm group-hover:scale-110 transition-transform" />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 font-black text-xl shadow-inner">
                            {lib.name.charAt(0)}
                          </div>
                        )}
                        <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${lib.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                      </div>
                      <div>
                        <div className="text-[14px] font-black text-slate-800 uppercase leading-none">{lib.name}</div>
                        <div className="text-[10px] text-slate-400 mt-1 uppercase">Staff ID: {lib.staffId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="inline-block text-left text-[11px] uppercase">
                      <div className="flex items-center gap-2 text-slate-600"><MdEmail className="text-indigo-600" size={14} /> {lib.email}</div>
                      <div className="flex items-center gap-2 text-slate-600 mt-1"><MdPhone className="text-indigo-600" size={14} /> {lib.phone}</div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center text-xs uppercase">{lib.qualification || 'N/A'}</td>
                  <td className="px-8 py-6 text-center font-black">₹{(lib.salary || 0).toLocaleString()}</td>
                  <td className="px-8 py-6 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      lib.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                    }`}>
                      {lib.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button onClick={() => handleViewProfile(lib)} className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-all border border-slate-100 shadow-sm" title="View Profile">
                        <MdVisibility size={18} />
                      </button>
                      <button onClick={() => handleOpenModal(lib)} className="p-2.5 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-indigo-100 shadow-sm" title="Edit">
                        <MdEdit size={18} />
                      </button>
                      <button onClick={() => handleDeleteLibrarian(lib._id)} className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-all border border-rose-100 shadow-sm" title="Remove">
                        <MdDelete size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="6" className="py-32 text-center text-slate-300 font-bold uppercase tracking-widest opacity-20"><MdPeople size={60} className="mx-auto mb-4" />No Records Found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-[110] backdrop-blur-sm p-4 animate-fadeIn italic">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col relative overflow-hidden animate-slideUp border border-slate-200">
            <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-2xl font-black text-slate-800 uppercase flex items-center gap-3">
                  <MdSupervisorAccount className="text-indigo-600" size={28} />
                  {editingLibrarian ? 'Update Librarian' : 'Add New Librarian'}
                </h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Personnel Authorization Form</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm border border-slate-100" disabled={loading}>
                <MdClose size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8 overflow-y-auto scrollbar-hide">
              <div className={`flex items-center gap-8 bg-slate-50/50 p-6 rounded-2xl border border-slate-200 group/upload cursor-pointer transition-opacity ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={() => !loading && fileInputRef.current.click()}>
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl bg-white shadow-md flex items-center justify-center overflow-hidden border-2 border-slate-100">
                    {previewImage ? <img src={previewImage} alt="Preview" className="w-full h-full object-cover" /> : <MdCameraAlt size={32} className="text-slate-200" />}
                  </div>
                  {!loading && (
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-indigo-600 text-white rounded-lg shadow-lg flex items-center justify-center border-2 border-white"><MdAdd size={16} /></div>
                  )}
                  <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" disabled={loading} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800 uppercase">Profile Identification Photo</h4>
                  <p className="text-[10px] text-slate-400 uppercase mt-1 italic">Click to upload identification photograph</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { label: 'Full Name', name: 'name', type: 'text' },
                  { label: 'Email ID', name: 'email', type: 'email' },
                  { label: 'Phone No.', name: 'phone', type: 'tel' },
                  { label: 'Login Password', name: 'password', type: showPassword ? 'text' : 'password', isPass: true },
                  { label: 'Qualification', name: 'qualification', type: 'text' },
                  { label: 'Salary (₹)', name: 'salary', type: 'number' },
                  { label: 'Work Experience', name: 'experience', type: 'text' },
                  { label: 'Birth Date', name: 'dob', type: 'date' },
                ].map((field) => (
                  <div key={field.name} className="space-y-2">
                    <label className={`text-[10px] font-black ${errors[field.name] ? 'text-rose-500' : 'text-slate-400'} uppercase tracking-widest ml-1 flex items-center gap-1`}>
                      {field.label} {errors[field.name] && <MdError />}
                    </label>
                    <div className="relative">
                      <input 
                        type={field.type} name={field.name} value={formData[field.name]} onChange={handleInputChange} 
                        className={`w-full bg-slate-50 border ${errors[field.name] ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-600'} rounded-xl px-5 py-3 outline-none font-bold text-xs shadow-inner transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading}
                      />
                      {field.isPass && (
                        <button type="button" onClick={() => !loading && setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-600" disabled={loading}>
                          {showPassword ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                        </button>
                      )}
                    </div>
                    {errors[field.name] && <p className="text-[9px] font-bold text-rose-500 uppercase tracking-widest ml-1 animate-pulse">{errors[field.name]}</p>}
                  </div>
                ))}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gender</label>
                  <select value={formData.gender} onChange={handleInputChange} name="gender" className={`w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 rounded-xl px-5 py-3.5 outline-none font-bold text-xs cursor-pointer appearance-none ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={loading}>
                    <option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Employment Status</label>
                  <select value={formData.status} onChange={handleInputChange} name="status" className={`w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 rounded-xl px-5 py-3.5 outline-none font-bold text-xs cursor-pointer appearance-none ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={loading}>
                    <option value="Active">Active</option><option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="md:col-span-2 lg:col-span-3 space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Residence/Address</label>
                   <input type="text" name="address" value={formData.address} onChange={handleInputChange} className={`w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 rounded-xl px-5 py-3.5 outline-none font-bold text-xs shadow-inner border-dashed ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} placeholder="Enter full address details..." disabled={loading} />
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 rounded-xl bg-slate-100 text-slate-400 font-bold text-[11px] uppercase tracking-widest hover:bg-slate-200 transition-all border border-slate-200 shadow-sm" disabled={loading}>
                    Cancel Protocol
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className={`flex-[2] py-4 rounded-xl font-bold text-[11px] uppercase tracking-widest shadow-lg tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
                    loading ? 'bg-slate-400 cursor-not-allowed text-white' : 'bg-indigo-600 text-white hover:bg-slate-900 active:scale-[0.98]'
                  }`}
                >
                  {loading && <FaSpinner className="animate-spin text-lg" />}
                  {loading ? 'Processing...' : (editingLibrarian ? 'Execute Update' : 'Initialize Record')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Profile Detail View Modal */}
      {showProfileModal && selectedLibrarian && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[120] backdrop-blur-md p-6 animate-fadeIn">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full relative overflow-hidden animate-slideUp border border-slate-100 flex flex-col">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 opacity-40"></div>
            
            <div className="p-10 flex flex-col items-center text-center relative z-10 border-b border-slate-50">
               <button onClick={() => setShowProfileModal(false)} className="absolute top-0 right-0 p-4 text-slate-400 hover:text-rose-500 transition-colors">
                  <MdClose size={32} />
               </button>
               
               <div className="relative mb-6 group">
                  <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-white shadow-xl ring-8 ring-indigo-50 group-hover:scale-105 transition-transform">
                    {selectedLibrarian.profileImage ? (
                      <img src={getImageUrl(selectedLibrarian.profileImage)} alt={selectedLibrarian.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-black text-4xl uppercase">{selectedLibrarian.name.charAt(0)}</div>
                    )}
                  </div>
                  <span className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border-2 border-white shadow-lg ${
                    selectedLibrarian.status === 'Active' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                  }`}>
                    {selectedLibrarian.status}
                  </span>
               </div>
               
               <h2 className="text-3xl font-black text-slate-800 uppercase italic tracking-tighter">{selectedLibrarian.name}</h2>
               <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest mt-2">
                  <MdBadge size={16} /> Librarian | Staff ID: {selectedLibrarian.staffId}
               </div>
            </div>

            <div className="p-10 grid grid-cols-2 gap-8 bg-slate-50/30">
               <div className="space-y-6">
                  <div>
                    <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2"><MdEmail className="text-indigo-400" /> Digital Contact</h4>
                    <p className="text-sm font-bold text-slate-700">{selectedLibrarian.email}</p>
                  </div>
                  <div>
                    <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2"><MdPhone className="text-indigo-400" /> Mobile Terminal</h4>
                    <p className="text-sm font-bold text-slate-700">{selectedLibrarian.phone}</p>
                  </div>
                  <div>
                    <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2"><MdLocationOn className="text-indigo-400" /> Registry Address</h4>
                    <p className="text-sm font-bold text-slate-700 leading-relaxed">{selectedLibrarian.address || 'Address Not Recorded'}</p>
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="flex justify-between items-start gap-4">
                     <div>
                        <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2"><MdSchool className="text-indigo-400" /> Credentials</h4>
                        <p className="text-sm font-bold text-slate-700 uppercase">{selectedLibrarian.qualification || 'N/A'}</p>
                     </div>
                     <div className="text-right">
                        <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2 justify-end"><MdAttachMoney className="text-indigo-400" /> Compensation</h4>
                        <p className="text-sm font-black text-indigo-600">₹{(selectedLibrarian.salary || 0).toLocaleString()}</p>
                     </div>
                  </div>
                  <div className="flex justify-between items-start gap-4">
                     <div>
                        <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2"><MdTransgender className="text-indigo-400" /> Gender</h4>
                        <p className="text-sm font-bold text-slate-700 uppercase">{selectedLibrarian.gender || 'Not Specified'}</p>
                     </div>
                     <div className="text-right">
                        <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2 justify-end"><MdCalendarToday className="text-indigo-400" /> Birth Registry</h4>
                        <p className="text-sm font-bold text-slate-700">{selectedLibrarian.dob ? new Date(selectedLibrarian.dob).toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: 'numeric'}) : 'N/A'}</p>
                     </div>
                  </div>
                  <div>
                    <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2"><MdWork className="text-indigo-400" /> Operational tenure</h4>
                    <p className="text-sm font-bold text-slate-700 uppercase italic underline decoration-indigo-200">{selectedLibrarian.experience || 'Entry Level'}</p>
                  </div>
               </div>
            </div>

            <div className="p-8 border-t border-slate-50 flex gap-4 bg-white">
                <button onClick={() => setShowProfileModal(false)} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95">
                    Close Identity File
                </button>
                <button onClick={() => { setShowProfileModal(false); handleOpenModal(selectedLibrarian); }} className="px-6 py-4 bg-indigo-50 text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-100 transition-all border border-indigo-100">
                    <MdEdit size={20} />
                </button>
                <button className="px-6 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all border border-slate-200" title="Print Personnel Certificate">
                    <MdPrint size={20} />
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibrarianManagement;
