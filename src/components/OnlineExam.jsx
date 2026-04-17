import React, { useState, useEffect } from 'react';
import {
    MdAdd, MdDelete, MdEdit, MdArrowBack, MdTimer, MdAutoGraph,
    MdClass, MdComputer, MdCheckCircle, MdBarChart, MdHistory,
    MdSearch, MdRefresh, MdBook, MdEvent
} from 'react-icons/md';
import { FaSpinner, FaQuestionCircle, FaTrophy, FaCalendarAlt } from 'react-icons/fa';
import { examAPI, classAPI } from '../utils/apiService';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const OnlineExam = () => {
    const [view, setView] = useState('list'); // 'list', 'create', 'results'
    const [viewMode, setViewMode] = useState('table'); // 'card', 'table' - default table
    const [loading, setLoading] = useState(false);
    const [exams, setExams] = useState([]);
    const [classesList, setClassesList] = useState([]);
    const [sectionsList, setSectionsList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [newExam, setNewExam] = useState({
        title: '',
        description: '',
        class: '',
        section: '',
        subject: '',
        duration: '',
        totalMarks: '',
        passingMarks: '',
        startDate: '',
        endDate: '',
        questions: [],
        status: 'draft'
    });

    const [currentQuestion, setCurrentQuestion] = useState({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        marks: ''
    });

    const [selectedExam, setSelectedExam] = useState(null);

    useEffect(() => {
        if (view === 'list') {
            fetchExams();
        } else if (view === 'create') {
            fetchClasses();
        }
    }, [view]);

    const fetchExams = async () => {
        try {
            setLoading(true);
            const res = await examAPI.getOnlineExams();
            if (res.data && res.data.exams) {
                setExams(res.data.exams);
            }
        } catch (err) {
            toast.error('Failed to load exams');
        } finally {
            setLoading(false);
        }
    };

    const fetchClasses = async () => {
        try {
            const res = await classAPI.getAll();
            if (res.data && res.data.classes) {
                setClassesList(res.data.classes);
            }
        } catch (err) {
            toast.error('Failed to load classes');
        }
    };

    const handleClassChange = async (classId) => {
        setNewExam({ ...newExam, class: classId, section: '' });
        if (!classId) return;
        try {
            const res = await classAPI.getSections(classId);
            if (res.data && res.data.sections) {
                setSectionsList(res.data.sections);
            }
        } catch (err) {
            toast.error('Failed to load sections');
        }
    };

    const handleAddQuestion = () => {
        if (!currentQuestion.question.trim()) {
            toast.warning('Enter question text');
            return;
        }
        if (currentQuestion.options.some(opt => !opt.trim())) {
            toast.warning('All 4 options are required');
            return;
        }

        setNewExam({
            ...newExam,
            questions: [...newExam.questions, { ...currentQuestion }],
            totalMarks: newExam.totalMarks + Number(currentQuestion.marks)
        });

        setCurrentQuestion({
            question: '',
            options: ['', '', '', ''],
            correctAnswer: 0,
            marks: ''
        });
        toast.success('Question added');
    };

    const handleRemoveQuestion = (index) => {
        const q = newExam.questions[index];
        const updated = newExam.questions.filter((_, i) => i !== index);
        setNewExam({
            ...newExam,
            questions: updated,
            totalMarks: newExam.totalMarks - Number(q.marks)
        });
    };

    const handleSaveExam = async (statusOverride) => {
        if (!newExam.title || !newExam.class || !newExam.subject || !newExam.startDate || !newExam.endDate) {
            toast.warning('Please fill all required fields');
            return;
        }
        if (newExam.questions.length === 0) {
            toast.warning('Add at least one question');
            return;
        }

        try {
            setLoading(true);
            const payload = { ...newExam, status: statusOverride || 'draft' };
            await examAPI.createOnlineExam(payload);
            toast.success(`Exam ${statusOverride === 'published' ? 'published' : 'saved'} successfully`);
            setView('list');
            resetForm();
        } catch (err) {
            toast.error('Failed to save exam');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteExam = async (id) => {
        const result = await Swal.fire({
            title: 'Delete Online Exam?',
            text: 'Are you sure? This cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Yes, Delete'
        });

        if (result.isConfirmed) {
            try {
                setLoading(true);
                await examAPI.deleteOnlineExam(id);
                toast.success('Exam removed');
                fetchExams();
            } catch (err) {
                toast.error('Deletion failed');
            } finally {
                setLoading(false);
            }
        }
    };

    const resetForm = () => {
        setNewExam({
            title: '',
            description: '',
            class: '',
            section: '',
            subject: '',
            duration: '',
            totalMarks: '',
            passingMarks: '',
            startDate: '',
            endDate: '',
            questions: [],
            status: 'draft'
        });
    };

    const filtered = exams.filter(e =>
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const inputCls = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 text-sm font-medium transition-all text-slate-700";
    const labelCls = "block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1";

    return (
        <div className="min-h-screen bg-slate-50/30 p-2 md:p-6 space-y-8">
            {loading && (
                <div className="fixed inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-[300]">
                    <div className="bg-white p-6 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-100">
                        <FaSpinner className="animate-spin text-indigo-600 text-2xl" />
                        <span className="font-bold text-slate-700">Loading assessments...</span>
                    </div>
                </div>
            )}

            {view === 'list' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                    {/* Header */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3 tracking-tighter">
                                <div className="w-2 h-8 bg-indigo-600 rounded-full" />
                                Online Exams
                                <span className="bg-indigo-50 text-indigo-600 text-xs px-3 py-1 rounded-full border border-indigo-100 ml-2">Digital</span>
                            </h1>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1.5">Manage computer based tests and results</p>
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                            <div className="flex bg-slate-100 rounded-2xl p-1">
                                <button
                                    onClick={() => setViewMode('card')}
                                    className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${viewMode === 'card' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
                                >
                                    <MdClass size={18} />
                                </button>
                                <button
                                    onClick={() => setViewMode('table')}
                                    className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${viewMode === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
                                >
                                    <MdBarChart size={18} />
                                </button>
                            </div>
                            <button
                                onClick={() => setView('create')}
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-indigo-100 active:scale-95"
                            >
                                <MdAdd size={20} /> Create New Exam
                            </button>
                            <button onClick={fetchExams} className="p-4 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-all">
                                <MdRefresh size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'All Exams', val: exams.length, color: 'indigo', icon: <MdComputer /> },
                            { label: 'Published', val: exams.filter(e => e.status === 'published').length, color: 'emerald', icon: <MdCheckCircle /> },
                            { label: 'Drafts', val: exams.filter(e => e.status === 'draft').length, color: 'amber', icon: <MdBook /> },
                            { label: 'Participated', val: '—', color: 'blue', icon: <FaTrophy /> },
                        ].map((s, i) => (
                            <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl bg-${s.color}-50 flex items-center justify-center text-${s.color}-500 text-xl shadow-inner border border-${s.color}-100/30`}>
                                    {s.icon}
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                                    <p className={`text-2xl font-black text-${s.color}-600`}>{s.val}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
                        <div className="relative">
                            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                            <input
                                type="text"
                                placeholder="Search by exam name or subject..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-indigo-500/10 text-sm font-semibold text-slate-700"
                            />
                        </div>
                    </div>

                    {/* Card/Table View */}
                    {viewMode === 'card' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filtered.map((exam) => (
                                <div key={exam._id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all group flex flex-col">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="space-y-1">
                                            <h3 className="text-xl font-black text-slate-800 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors uppercase">{exam.title}</h3>
                                            <div className="flex items-center gap-2">
                                                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-lg border border-indigo-100 uppercase">{exam.subject}</span>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">• Grade {exam.class?.className}</span>
                                            </div>
                                        </div>
                                        <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${exam.status === 'published' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                                            }`}>
                                            {exam.status}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3 mb-8">
                                        <div className="p-3 bg-slate-50 rounded-2xl text-center border border-slate-100">
                                            <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Duration</p>
                                            <p className="text-sm font-black text-slate-700">{exam.duration}m</p>
                                        </div>
                                        <div className="p-3 bg-slate-50 rounded-2xl text-center border border-slate-100">
                                            <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Marks</p>
                                            <p className="text-sm font-black text-slate-700">{exam.totalMarks}</p>
                                        </div>
                                        <div className="p-3 bg-slate-50 rounded-2xl text-center border border-slate-100">
                                            <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Pass %</p>
                                            <p className="text-sm font-black text-slate-700">{Math.round((exam.passingMarks / exam.totalMarks) * 100)}%</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-8 px-1">
                                        <MdEvent size={16} className="text-slate-300" />
                                        <span>{new Date(exam.startDate).toLocaleDateString()}</span>
                                        <span className="opacity-30">|</span>
                                        <span>{new Date(exam.endDate).toLocaleDateString()}</span>
                                    </div>

                                    <div className="mt-auto flex justify-between items-center pt-6 border-t border-slate-50">
                                        <button
                                            onClick={() => handleDeleteExam(exam._id)}
                                            className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all border border-rose-100 active:scale-90"
                                        >
                                            <MdDelete size={20} />
                                        </button>
                                        <button
                                            onClick={() => { setSelectedExam(exam); setView('results'); }}
                                            className="px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-black font-black text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center gap-2"
                                        >
                                            <MdBarChart size={18} /> View Results
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {filtered.length === 0 && !loading && (
                                <div className="col-span-full py-32 bg-white rounded-[3rem] border border-slate-100 flex flex-col items-center justify-center opacity-60">
                                    <MdComputer size={60} className="text-slate-200 mb-4" />
                                    <p className="font-black text-sm uppercase tracking-widest text-slate-400">No Online Exams Found</p>
                                    <button onClick={() => setView('create')} className="mt-4 text-indigo-600 font-bold text-xs uppercase tracking-widest hover:underline">Click here to create one</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-100">
                                            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-left">Exam Title</th>
                                            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-left">Subject</th>
                                            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-left">Class</th>
                                            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Duration</th>
                                            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Marks</th>
                                            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Questions</th>
                                            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-left">Schedule</th>
                                            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {filtered.map((exam) => (
                                            <tr key={exam._id} className="hover:bg-slate-50/70 transition-colors group">
                                                <td className="px-6 py-5">
                                                    <div>
                                                        <p className="font-black text-slate-800 text-sm uppercase">{exam.title}</p>
                                                        <p className="text-xs text-slate-400 font-semibold mt-0.5">ID: {exam._id.slice(-6)}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold border border-indigo-100">
                                                        {exam.subject}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className="text-sm font-semibold text-slate-700">{exam.class?.className || 'N/A'}</span>
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <MdTimer className="text-slate-400" size={16} />
                                                        <span className="font-bold text-slate-700">{exam.duration}m</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <div className="text-sm font-black text-slate-800">{exam.totalMarks}</div>
                                                    <div className="text-xs text-slate-400 font-semibold">Pass: {exam.passingMarks}</div>
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold">
                                                        {exam.questions?.length || 0}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="text-xs font-semibold text-slate-600">
                                                        <div className="flex items-center gap-1">
                                                            <FaCalendarAlt size={10} className="text-slate-400" />
                                                            {new Date(exam.startDate).toLocaleDateString()}
                                                        </div>
                                                        <div className="text-slate-400 mt-0.5">to {new Date(exam.endDate).toLocaleDateString()}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${exam.status === 'published' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : exam.status === 'completed' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                                                        {exam.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => { setSelectedExam(exam); setView('results'); }}
                                                            className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all border border-indigo-100"
                                                            title="View Results"
                                                        >
                                                            <MdBarChart size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteExam(exam._id)}
                                                            className="p-2 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all border border-rose-100"
                                                            title="Delete"
                                                        >
                                                            <MdDelete size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {filtered.length === 0 && !loading && (
                                            <tr>
                                                <td colSpan="9" className="py-20 text-center">
                                                    <MdComputer size={40} className="mx-auto mb-4 opacity-20" />
                                                    <p className="font-bold text-sm text-slate-400">No online exams found</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {view === 'create' && (
                <div className="max-w-5xl mx-auto animate-in slide-in-from-right-8 duration-500">
                    <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
                        {/* Simple Header */}
                        <div className="bg-slate-900 px-8 py-6 text-white flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setView('list')}
                                    className="p-2.5 bg-white/10 hover:bg-white text-white hover:text-slate-900 rounded-xl transition-all"
                                >
                                    <MdArrowBack size={20} />
                                </button>
                                <div>
                                    <h2 className="text-xl font-black tracking-tight uppercase">Create Exam</h2>
                                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">Setup your digital assessment parameters</p>
                                </div>
                            </div>
                            <div className="flex gap-3 w-full sm:w-auto">
                                <button onClick={() => handleSaveExam('draft')} className="flex-1 sm:flex-none px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl font-bold text-[10px] uppercase tracking-widest border border-white/10 transition-all">Save Draft</button>
                                <button onClick={() => handleSaveExam('published')} className="flex-1 sm:flex-none px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95">Publish Exam</button>
                            </div>
                        </div>

                        <div className="p-8 space-y-10">
                            {/* Basic Details Section */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                                    <div className="w-1.5 h-4 bg-indigo-500 rounded-full" />
                                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Exam Information</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                                    <div className="md:col-span-2 space-y-1.5">
                                        <label className={labelCls}>Exam Title</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Science Monthly Mini-test"
                                            className={inputCls}
                                            value={newExam.title}
                                            onChange={(e) => setNewExam({ ...newExam, title: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className={labelCls}>Subject</label>
                                        <input
                                            type="text"
                                            className={inputCls}
                                            value={newExam.subject}
                                            onChange={(e) => setNewExam({ ...newExam, subject: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className={labelCls}>Class</label>
                                        <select className={inputCls} value={newExam.class} onChange={(e) => handleClassChange(e.target.value)}>
                                            <option value="">Select Class</option>
                                            {classesList.map(c => <option key={c._id} value={c._id}>{c.className}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                                    <div className="space-y-1.5">
                                        <label className={labelCls}>Duration (Minutes)</label>
                                        <input type="number" placeholder="60" className={inputCls} value={newExam.duration} onChange={(e) => setNewExam({ ...newExam, duration: e.target.value })} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className={labelCls}>Passing Marks</label>
                                        <input type="number" placeholder="40" className={inputCls} value={newExam.passingMarks} onChange={(e) => setNewExam({ ...newExam, passingMarks: e.target.value })} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className={labelCls}>Starts On</label>
                                        <input type="datetime-local" className={inputCls} value={newExam.startDate} onChange={(e) => setNewExam({ ...newExam, startDate: e.target.value })} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className={labelCls}>Ends On</label>
                                        <input type="datetime-local" className={inputCls} value={newExam.endDate} onChange={(e) => setNewExam({ ...newExam, endDate: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Questions Builder Section */}
                        <div className="pt-6 space-y-6">
                            <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                                <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                                    Add Question #{newExam.questions.length + 1}
                                </h3>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60">
                                <div className="space-y-6">
                                    <div className="space-y-1.5">
                                        <label className={labelCls}>Question Text</label>
                                        <textarea
                                            placeholder="Write your question here..."
                                            className={`${inputCls} h-24 resize-none bg-white`}
                                            value={currentQuestion.question}
                                            onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                                        ></textarea>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {currentQuestion.options.map((opt, idx) => (
                                            <div key={idx} className="flex items-center gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: idx })}
                                                    className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center font-black text-xs transition-all ${currentQuestion.correctAnswer === idx
                                                            ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-100 scale-110'
                                                            : 'bg-white border-slate-200 text-slate-400 hover:border-indigo-300'
                                                        }`}
                                                >
                                                    {currentQuestion.correctAnswer === idx ? <MdCheckCircle size={16} /> : String.fromCharCode(65 + idx)}
                                                </button>
                                                <input
                                                    type="text"
                                                    placeholder={`Option ${String.fromCharCode(65 + idx)} text`}
                                                    className={`${inputCls} bg-white flex-1 translate-y-0`}
                                                    value={opt}
                                                    onChange={(e) => {
                                                        const n = [...currentQuestion.options];
                                                        n[idx] = e.target.value;
                                                        setCurrentQuestion({ ...currentQuestion, options: n });
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200/50">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Question Weight (Marks):</span>
                                            <input type="number" className="w-14 p-2 bg-white border border-slate-200 rounded-lg text-center font-bold text-indigo-600 text-sm" value={currentQuestion.marks} onChange={(e) => setCurrentQuestion({ ...currentQuestion, marks: e.target.value })} />
                                        </div>
                                        <button
                                            onClick={handleAddQuestion}
                                            className="w-full sm:w-auto px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-black font-bold text-[10px] uppercase tracking-[0.2em] transition-all shadow-md active:scale-95"
                                        >
                                            Add Question to list
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Questions List Stack */}
                            {newExam.questions.length > 0 && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between px-1">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Questions List ({newExam.questions.length})</h4>
                                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Total: {newExam.totalMarks} Marks</span>
                                    </div>
                                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                        {newExam.questions.map((q, idx) => (
                                            <div key={idx} className="bg-white p-4 rounded-xl border border-slate-100 flex justify-between items-center group transition-all hover:border-slate-300">
                                                <div className="flex gap-4 items-center">
                                                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center font-black text-slate-400 text-[10px] group-hover:bg-indigo-600 group-hover:text-white transition-all">#{idx + 1}</div>
                                                    <div>
                                                        <p className="font-bold text-slate-800 text-xs line-clamp-1">{q.question}</p>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <span className="text-[9px] font-bold text-emerald-600 uppercase">Correct: {String.fromCharCode(65 + q.correctAnswer)}</span>
                                                            <span className="text-[9px] font-bold text-slate-300">•</span>
                                                            <span className="text-[9px] font-black text-indigo-500 uppercase">{q.marks} Marks</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button onClick={() => handleRemoveQuestion(idx)} className="p-2 text-slate-300 hover:text-rose-500 transition-all">
                                                    <MdDelete size={18} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {view === 'results' && selectedExam && (
                <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
                    <div className="bg-white rounded-[3.5rem] shadow-2xl border border-slate-100 overflow-hidden">
                        <div className="bg-slate-900 p-12 text-white relative">
                            <div className="flex items-center gap-8 relative z-10">
                                <button
                                    onClick={() => setView('list')}
                                    className="p-4 bg-white/10 hover:bg-white text-white hover:text-indigo-600 rounded-2xl transition-all"
                                >
                                    <MdArrowBack size={24} />
                                </button>
                                <div>
                                    <h2 className="text-3xl font-black tracking-tighter uppercase italic">{selectedExam.title}</h2>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1.5">{selectedExam.subject} • Results Analytics</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-10">
                            {/* Exam Details Summary */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Total Questions</p>
                                    <p className="text-2xl font-black text-slate-800">{selectedExam.questions?.length || 0}</p>
                                </div>
                                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Total Marks</p>
                                    <p className="text-2xl font-black text-slate-800">{selectedExam.totalMarks}</p>
                                </div>
                                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Passing Marks</p>
                                    <p className="text-2xl font-black text-slate-800">{selectedExam.passingMarks}</p>
                                </div>
                                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Duration</p>
                                    <p className="text-2xl font-black text-slate-800">{selectedExam.duration}m</p>
                                </div>
                            </div>

                            {/* Questions List */}
                            <div className="bg-slate-50 rounded-[2.5rem] border border-slate-100 p-8">
                                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-6 flex items-center gap-3">
                                    <FaQuestionCircle className="text-indigo-600" />
                                    Exam Questions
                                </h3>
                                <div className="space-y-6">
                                    {selectedExam.questions?.map((q, idx) => (
                                        <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200">
                                            <div className="flex items-start gap-4">
                                                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                                                    {idx + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-bold text-slate-800 text-sm mb-4">{q.question}</p>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        {q.options?.map((opt, optIdx) => (
                                                            <div
                                                                key={optIdx}
                                                                className={`p-3 rounded-xl border-2 flex items-center gap-3 ${
                                                                    q.correctAnswer === optIdx
                                                                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                                                                        : 'bg-slate-50 border-slate-200 text-slate-600'
                                                                }`}
                                                            >
                                                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${
                                                                    q.correctAnswer === optIdx ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                                                                }`}>
                                                                    {String.fromCharCode(65 + optIdx)}
                                                                </div>
                                                                <span className="text-sm font-semibold">{opt}</span>
                                                                {q.correctAnswer === optIdx && (
                                                                    <MdCheckCircle className="ml-auto text-emerald-500" size={20} />
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="mt-3 flex items-center gap-4">
                                                        <span className="text-xs font-bold text-slate-400 uppercase">Marks: {q.marks}</span>
                                                        <span className="text-xs font-bold text-emerald-600 uppercase">Correct Answer: {String.fromCharCode(65 + q.correctAnswer)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Student Results Table */}
                            <div className="mt-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 overflow-hidden">
                                <div className="p-6 border-b border-slate-200 bg-white">
                                    <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight flex items-center gap-3">
                                        <MdBarChart className="text-indigo-600" />
                                        Student Submissions
                                    </h3>
                                </div>
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-white border-b border-slate-200">
                                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Name</th>
                                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Marks Obtained</th>
                                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Completion Time</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        <tr>
                                            <td colSpan="4" className="py-24 text-center">
                                                <div className="flex flex-col items-center gap-4 opacity-30">
                                                    <MdHistory size={60} className="text-slate-300" />
                                                    <p className="font-black text-sm uppercase tracking-widest text-slate-500 italic">No Student Submissions Yet</p>
                                                    <p className="text-xs text-slate-400 font-semibold">Students will appear here once they complete the exam</p>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OnlineExam;
