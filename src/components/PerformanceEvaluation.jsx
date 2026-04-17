import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaChevronLeft, FaChevronRight, FaStar, FaSpinner, FaUserCheck } from 'react-icons/fa';
import { MdClose, MdRefresh, MdTrendingUp, MdStars, MdFactCheck, MdHistoryEdu, MdPersonSearch } from 'react-icons/md';
import { performanceAPI, teacherAPI } from '../utils/apiService';
import { BASE_URL } from '../utils/api';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const PerformanceEvaluation = () => {
    const [evaluations, setEvaluations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [teachersList, setTeachersList] = useState([]);
    const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
    const [performanceReport, setPerformanceReport] = useState({
        totalEvaluations: 0,
        averageRating: 0,
        highPerformers: 0
    });
    const itemsPerPage = 8;

    const [formData, setFormData] = useState({
        teacher: '', // ObjectId
        teacherName: '',
        evaluationPeriod: '',
        teachingQuality: 5,
        studentEngagement: 5,
        punctuality: 5,
        professionalism: 5,
        feedback: '',
        evaluatedBy: ''
    });

    useEffect(() => {
        fetchEvaluations();
        fetchTeachers();
    }, [currentPage, searchTerm]);

    const fetchEvaluations = async () => {
        try {
            setLoading(true);
            const res = await performanceAPI.getAll({
                page: currentPage,
                limit: itemsPerPage,
                search: searchTerm
            });
            if (res.data && res.data.data) {
                const data = res.data.data;
                setEvaluations(Array.isArray(data) ? data : []);
                
                // Set pagination based on response or data length
                const totalCount = res.data.total || (Array.isArray(data) ? data.length : 0);
                setPagination({
                    total: totalCount,
                    totalPages: Math.ceil(totalCount / itemsPerPage) || 1
                });
            }
            
            const reportRes = await performanceAPI.getReport();
            if (reportRes.data && reportRes.data.data) {
                setPerformanceReport(reportRes.data.data);
            }
        } catch (err) {
            console.error('Fetch error:', err);
            toast.error('Failed to load performance reviews');
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
            console.error('Teacher list error:', err);
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

    const calculateOverallRating = () => {
        const ratings = [
            parseFloat(formData.teachingQuality) || 0,
            parseFloat(formData.studentEngagement) || 0,
            parseFloat(formData.punctuality) || 0,
            parseFloat(formData.professionalism) || 0
        ];
        const sum = ratings.reduce((a, b) => a + b, 0);
        return (sum / 4).toFixed(1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const overallRating = calculateOverallRating();
            const payload = { ...formData, overallRating };

            if (editingId) {
                await performanceAPI.update(editingId, payload);
                toast.success('Performance review updated');
            } else {
                await performanceAPI.create(payload);
                toast.success('Performance review added');
            }
            setShowForm(false);
            fetchEvaluations();
            resetForm();
        } catch (err) {
            toast.error('Failed to save performance review');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (evaluation) => {
        setFormData({
            teacher: evaluation.teacher?._id || evaluation.teacher || '',
            teacherName: evaluation.teacherName,
            evaluationPeriod: evaluation.evaluationPeriod,
            teachingQuality: evaluation.teachingQuality,
            studentEngagement: evaluation.studentEngagement,
            punctuality: evaluation.punctuality,
            professionalism: evaluation.professionalism,
            feedback: evaluation.feedback,
            evaluatedBy: evaluation.evaluatedBy
        });
        setEditingId(evaluation._id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Delete Review?',
            text: 'This will permanently remove the teacher performance record.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#2563eb',
            cancelButtonColor: '#94a3b8',
            confirmButtonText: 'Yes, Delete',
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
                await performanceAPI.delete(id);
                toast.success('Review deleted');
                fetchEvaluations();
            } catch (err) {
                toast.error('Failed to delete review');
            } finally {
                setLoading(false);
            }
        }
    };

    const resetForm = () => {
        setFormData({ teacher: '', teacherName: '', evaluationPeriod: '', teachingQuality: 5, studentEngagement: 5, punctuality: 5, professionalism: 5, feedback: '', evaluatedBy: '' });
        setEditingId(null);
    };

    const StarRatingInput = ({ label, name, value }) => (
        <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
            <div className="flex gap-2 bg-slate-50 p-3 rounded-2xl border-2 border-transparent focus-within:border-blue-500/20 transition-all">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, [name]: star }))}
                        className={`text-2xl transition-all active:scale-90 ${star <= value ? 'text-amber-400' : 'text-slate-200 hover:text-slate-300'}`}
                    >
                        <FaStar />
                    </button>
                ))}
                <span className="ml-auto text-xs font-black text-slate-400 mr-2">{value}/5</span>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
                        <div className="w-2.5 h-10 bg-blue-600 rounded-full" />
                        Teacher Performance
                    </h1>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Evaluate and track faculty excellence</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => { resetForm(); setShowForm(true); }}
                        className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl hover:bg-blue-700 font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-blue-200 active:scale-95"
                    >
                        <FaPlus /> Add New Review
                    </button>
                    <button
                        onClick={fetchEvaluations}
                        className="p-4 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-all active:rotate-180 duration-500"
                    >
                        <MdRefresh size={20} />
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full -mr-24 -mt-24 blur-3xl" />
                    <div className="relative flex items-center gap-6">
                        <div className="w-16 h-16 bg-blue-500/20 rounded-3xl flex items-center justify-center text-blue-400">
                            <MdTrendingUp size={32} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Reviews</p>
                            <p className="text-4xl font-black tracking-tight text-white tabular-nums">{performanceReport.totalEvaluations}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="relative flex items-center gap-6">
                        <div className="w-16 h-16 bg-amber-500/10 rounded-3xl flex items-center justify-center text-amber-500">
                            <MdStars size={32} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Average Rating</p>
                            <div className="flex items-center gap-2">
                                <p className="text-4xl font-black tracking-tight text-slate-800 tabular-nums">{performanceReport.averageRating}</p>
                                <FaStar className="text-amber-400 mb-1" size={24} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="relative flex items-center gap-6">
                        <div className="w-16 h-16 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-emerald-500">
                            <MdFactCheck size={32} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Top Performers</p>
                            <p className="text-4xl font-black tracking-tight text-slate-800 tabular-nums">{performanceReport.highPerformers}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                <div className="relative flex-1 group w-full">
                    <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search Reviews (Teacher Name or Session)..."
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500/20 focus:bg-white outline-none text-xs font-bold transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Content Table */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden relative">
                {loading && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
                        <FaSpinner className="animate-spin text-blue-600" size={40} />
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Teacher</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Session</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Score Card</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Rating</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {evaluations.map((evaluation) => (
                                <tr key={evaluation._id} className="hover:bg-slate-50/30 transition-all group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xs overflow-hidden shadow-sm border border-slate-100">
                                                {evaluation.teacher?.profileImage ? (
                                                    <img 
                                                        src={evaluation.teacher.profileImage.startsWith('http') 
                                                            ? evaluation.teacher.profileImage 
                                                            : `${BASE_URL.replace(/\/$/, '')}/${evaluation.teacher.profileImage.replace(/\\/g, '/').replace(/^\//, '')}`
                                                        } 
                                                        alt="" 
                                                        className="w-full h-full object-cover" 
                                                    />
                                                ) : (
                                                    (evaluation.teacherName || 'T')[0]
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-slate-800 uppercase tracking-tight">{evaluation.teacherName}</span>
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{evaluation.teacher?.email || 'Faculty Record'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-xs font-black text-slate-500 uppercase tracking-widest">
                                        {evaluation.evaluationPeriod}
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="flex justify-center gap-1.5">
                                            {[...Array(5)].map((_, i) => (
                                                <div 
                                                    key={i} 
                                                    className={`w-1.5 h-6 rounded-full transition-all duration-500 ${
                                                        i < Math.round(evaluation.overallRating) 
                                                        ? (evaluation.overallRating >= 4 ? 'bg-emerald-500 shadow-sm shadow-emerald-100' : 'bg-blue-500') 
                                                        : 'bg-slate-100'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className={`text-2xl font-black italic tracking-tighter tabular-nums ${
                                            evaluation.overallRating >= 4.5 ? 'text-emerald-500' : 
                                            evaluation.overallRating >= 3.5 ? 'text-blue-500' : 'text-amber-500'
                                        }`}>
                                            {evaluation.overallRating}
                                            <span className="text-[10px] not-italic ml-0.5 opacity-40">/5</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleEdit(evaluation)} className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><FaEdit size={16} /></button>
                                            <button onClick={() => handleDelete(evaluation._id)} className="p-3 text-rose-600 hover:bg-rose-50 rounded-xl transition-all"><FaTrash size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-8 py-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                        Viewing {evaluations.length} performance reviews
                    </p>
                    <div className="flex gap-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-30 transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2 px-6"
                        >
                            <FaChevronLeft size={10} /> Prev
                        </button>
                        <button
                            disabled={currentPage >= (pagination.totalPages || 1)}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-30 transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2 px-6"
                        >
                            Next <FaChevronRight size={10} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Evaluation Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl border border-white/20 animate-in fade-in zoom-in duration-300 my-8">
                        <div className="bg-slate-50 px-10 py-10 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                                    {editingId ? 'Update Performance Review' : 'Add Teacher Review'}
                                </h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Official Faculty Assessment</p>
                            </div>
                            <button onClick={() => { setShowForm(false); resetForm(); }} className="p-4 bg-white text-slate-400 hover:text-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all">
                                <MdClose size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-10 space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Teacher</label>
                                    <select
                                        required
                                        name="teacher"
                                        value={formData.teacher}
                                        onChange={handleInputChange}
                                        className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500/20 focus:bg-white outline-none text-xs font-bold transition-all"
                                    >
                                        <option value="">Choose Teacher</option>
                                        {teachersList.map(t => (
                                            <option key={t._id} value={t._id}>{t.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Review Session/Period</label>
                                    <input
                                        required
                                        name="evaluationPeriod"
                                        value={formData.evaluationPeriod}
                                        onChange={handleInputChange}
                                        placeholder="EX: APRIL - JUNE 2026"
                                        className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500/20 focus:bg-white outline-none text-xs font-bold transition-all"
                                    />
                                </div>

                                {/* Rating Inputs */}
                                <StarRatingInput label="Teaching Quality (Study Skill)" name="teachingQuality" value={formData.teachingQuality} />
                                <StarRatingInput label="interaction with Students" name="studentEngagement" value={formData.studentEngagement} />
                                <StarRatingInput label="Attendance & Punctuality" name="punctuality" value={formData.punctuality} />
                                <StarRatingInput label="Behavior & Professionalism" name="professionalism" value={formData.professionalism} />

                                <div className="space-y-2 col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Reviewed By (HOD/Principal)</label>
                                    <div className="relative">
                                        <FaUserCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-500" />
                                        <input
                                            required
                                            name="evaluatedBy"
                                            value={formData.evaluatedBy}
                                            onChange={handleInputChange}
                                            placeholder="Enter Evaluator Name"
                                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500/20 focus:bg-white outline-none text-xs font-bold transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Detailed Remarks/Feedback</label>
                                    <textarea
                                        name="feedback"
                                        value={formData.feedback}
                                        onChange={handleInputChange}
                                        rows="3"
                                        placeholder="Add any specific observations or tips for improvement..."
                                        className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-[2.5rem] focus:border-blue-500/20 focus:bg-white outline-none text-xs font-bold transition-all resize-none"
                                    />
                                </div>
                            </div>

                            <div className="p-10 bg-blue-50 rounded-[3rem] border border-blue-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                        <MdStars size={32} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Calculated Performance</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">Weighted Average Rating</p>
                                    </div>
                                </div>
                                <p className="text-4xl font-black text-blue-900 italic tracking-tighter tabular-nums">{calculateOverallRating()}<span className="text-sm opacity-30 not-italic ml-1">/5</span></p>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-blue-600 text-white py-6 rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-95 disabled:opacity-50"
                                >
                                    {loading ? <FaSpinner className="animate-spin mx-auto" /> : (editingId ? 'Save Review' : 'Add Review')}
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

export default PerformanceEvaluation;
