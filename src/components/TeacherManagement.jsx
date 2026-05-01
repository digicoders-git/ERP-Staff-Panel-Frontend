import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaChevronLeft, FaChevronRight, FaSpinner, FaUserTie } from 'react-icons/fa';
import { MdClose, MdRefresh, MdPhone, MdEmail, MdSubject, MdSchool, MdAttachMoney, MdVisibility } from 'react-icons/md';
import { teacherAPI } from '../utils/apiService';
import { BASE_URL } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const TeacherManagement = () => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
    const itemsPerPage = 8;
    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        subject: '', // Will be converted to array
        qualification: '',
        salary: '',
        experience: '',
        address: '',
        status: true
    });

    useEffect(() => {
        fetchTeachers();
    }, [currentPage, searchTerm]);

    const fetchTeachers = async () => {
        try {
            setLoading(true);
            const params = {
                page: currentPage,
                limit: itemsPerPage,
                search: searchTerm
            };
            const res = await teacherAPI.getAll(params);
            
            const responseData = res.data.data;
            const facultyData = responseData?.teachers || [];
            const pagin = responseData?.pagination || { 
                total: facultyData.length, 
                totalPages: Math.ceil(facultyData.length / itemsPerPage) || 1 
            };
            
            setTeachers(facultyData);
            setPagination(pagin);
        } catch (err) {
            console.error('Faculty fetch error:', err);
            toast.error('Failed to load teacher list');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            
            // Use FormData for multipart uploads
            const data = new FormData();
            data.append('name', formData.name);
            data.append('email', formData.email);
            data.append('mobile', formData.mobile);
            data.append('subjects', JSON.stringify(formData.subject.split(',').map(s => s.trim()).filter(s => s)));
            data.append('qualification', formData.qualification);
            data.append('salary', formData.salary || 0);
            data.append('experience', formData.experience);
            data.append('address', formData.address);
            data.append('status', formData.status);
            
            if (imageFile) {
                data.append('profileImage', imageFile);
            }

            if (editingId) {
                await teacherAPI.update(editingId, data);
                toast.success('Faculty identity manifest updated');
            } else {
                await teacherAPI.create(data);
                toast.success('New faculty identity registered');
            }
            
            setShowForm(false);
            fetchTeachers();
            resetForm();
        } catch (err) {
            console.error('Faculty mutation error:', err);
            toast.error(err.response?.data?.message || 'Transaction interrupted');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (teacher) => {
        setFormData({
            name: teacher.name,
            email: teacher.email,
            mobile: teacher.mobile || teacher.phone || '',
            subject: Array.isArray(teacher.subjects) ? teacher.subjects.join(', ') : (teacher.subject || ''),
            qualification: teacher.qualification || '',
            salary: teacher.salary || '',
            experience: teacher.experience || '',
            address: teacher.address || '',
            status: teacher.status !== undefined ? teacher.status : true
        });
        setEditingId(teacher._id);
        setImagePreview(teacher.profileImage ? (teacher.profileImage.startsWith('http') ? teacher.profileImage : `${BASE_URL.replace(/\/$/, '')}/${teacher.profileImage.replace(/\\/g, '/').replace(/^\//, '')}`) : null);
        setImageFile(null);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Terminate Identity?',
            text: 'This will permanently remove the faculty manifest from the institutional registry.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#2563eb',
            cancelButtonColor: '#94a3b8',
            confirmButtonText: 'Yes, Terminate',
            background: '#ffffff',
            customClass: {
                title: 'text-sm font-black uppercase tracking-widest text-slate-800',
                content: 'text-xs font-bold text-slate-500',
                confirmButton: 'text-[10px] font-black uppercase tracking-widest px-8 py-3 rounded-xl',
                cancelButton: 'text-[10px] font-black uppercase tracking-widest px-8 py-3 rounded-xl'
            }
        });

        if (result.isConfirmed) {
            try {
                setLoading(true);
                await teacherAPI.delete(id);
                toast.success('Record purged successfully');
                fetchTeachers();
            } catch (err) {
                toast.error('Termination failed');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleAddNew = () => {
        resetForm();
        setEditingId(null);
        setImagePreview(null);
        setImageFile(null);
        setShowForm(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            mobile: '',
            subject: '',
            qualification: '',
            salary: '',
            experience: '',
            address: '',
            status: true
        });
        setEditingId(null);
        setImageFile(null);
        setImagePreview(null);
    };

    const getClassName = (classObj) => {
        if (!classObj) return 'N/A';
        if (typeof classObj === 'string') return classObj;
        return classObj.className || 'N/A';
    };

    const getSectionName = (sectionObj) => {
        if (!sectionObj) return 'N/A';
        if (typeof sectionObj === 'string') return sectionObj;
        return sectionObj.sectionName || 'N/A';
    };

    return (
        <div className="space-y-8 bg-slate-50/50 min-h-screen">
            {/* Header section with Stats */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
                        <div className="w-2.5 h-10 bg-blue-600 rounded-full" />
                        Teacher List
                    </h1>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">All Registered School Teachers</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={fetchTeachers}
                        className="p-4 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-all active:rotate-180 duration-500"
                    >
                        <MdRefresh size={20} />
                    </button>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 group w-full">
                    <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search Teachers (Name, Email, or Subjects)..."
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500/20 focus:bg-white outline-none text-xs font-bold transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 px-6 py-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Total Teachers:</span>
                    <span className="text-sm font-black text-blue-900 tabular-nums">{pagination.total}</span>
                </div>
            </div>

            {/* Main Table Content */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden relative">
                {loading && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-4">
                            <FaSpinner className="animate-spin text-blue-600" size={40} />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">Loading Teachers...</p>
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Photo</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Teacher Name</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Class & Section</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Subjects</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Qualification</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Salary</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {teachers.length > 0 ? teachers.map((teacher) => (
                                <tr key={teacher._id} className="hover:bg-slate-50/30 transition-all group">
                                    <td className="px-8 py-6">
                                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xs overflow-hidden shadow-sm border border-slate-100">
                                            {teacher.profileImage ? (
                                                <img 
                                                    src={teacher.profileImage.startsWith('http') 
                                                        ? teacher.profileImage 
                                                        : `${BASE_URL.replace(/\/$/, '')}/${teacher.profileImage.replace(/\\/g, '/').replace(/^\//, '')}`
                                                    } 
                                                    alt={teacher.name} 
                                                    className="w-full h-full object-cover" 
                                                />
                                            ) : (
                                                teacher.name[0]
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-slate-800 uppercase tracking-tight">{teacher.name}</span>
                                            <span className="text-[9px] font-bold text-slate-400 lowercase">{teacher.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-1">
                                            <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-tight">
                                                {getClassName(teacher.assignedClass)}
                                            </span>
                                            <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-tight">
                                                {getSectionName(teacher.assignedSection)}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-wrap gap-1.5">
                                            {(Array.isArray(teacher.subjects) ? teacher.subjects : (teacher.subject?.split(',') || [])).map((s, i) => (
                                                <span key={i} className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-wider border border-blue-100/50">
                                                    {s.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1">
                                            <p className="text-[10px] font-black text-slate-700 uppercase tracking-wide">{teacher.qualification || 'N/A'}</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{teacher.experience || '0'} Years Pro</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-sm font-black text-emerald-600 tabular-nums">
                                            ₹{teacher.salary?.toLocaleString() || '0'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                            teacher.status 
                                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                                            : 'bg-rose-50 text-rose-600 border border-rose-100'
                                        }`}>
                                            {teacher.status ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => navigate(`/teacher-profile/${teacher._id}`)}
                                                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                                            >
                                                <MdVisibility size={14} />
                                                View Profile
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : !loading && (
                                <tr>
                                    <td colSpan="6" className="px-8 py-32 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-20">
                                            <FaUserTie size={60} className="text-slate-400" />
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em]">No Teachers Found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-8 py-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Showing Page {currentPage} of {pagination.totalPages}
                    </p>
                    <div className="flex gap-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition-all"
                        >
                            <FaChevronLeft size={12} />
                        </button>
                        <button
                            disabled={currentPage === pagination.totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition-all"
                        >
                            <FaChevronRight size={12} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Form Modal Removed as Staff is View-Only */}
        </div>
    );
};

export default TeacherManagement;
