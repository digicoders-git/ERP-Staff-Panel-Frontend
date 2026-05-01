import React, { useState, useEffect } from 'react';
import { 
  FaDownload, FaUpload, FaCheckCircle, FaExclamationTriangle, 
  FaArrowRight, FaTable, FaFileExcel, FaTrash, FaEye 
} from 'react-icons/fa';
import api from '../utils/api'; // Correct import for staff panel
import Swal from 'sweetalert2';

export default function BulkResultImport() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState([]);
    const [examTypes, setExamTypes] = useState([]);
    
    // In staff panel, branchId usually comes from the staff object
    const staff = JSON.parse(localStorage.getItem('staff') || '{}');
    const branchId = staff.branch?._id || staff.branch;

    const [selection, setSelection] = useState({
        branchId: branchId,
        classId: '',
        examTypeId: ''
    });

    const [previewData, setPreviewData] = useState(null);
    const [file, setFile] = useState(null);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [examTypeRes, classRes] = await Promise.all([
                api.get('/api/staff-panel/exam/exam-types'), // Staff endpoint
                api.get(`/api/staff-panel/class/all?branchId=${branchId}`) // Staff endpoint
            ]);
            
            // Handle structure difference in staff API
            setExamTypes(examTypeRes.data.data || []);
            setClasses(classRes.data.classes || []);
        } catch (err) {
            console.error('Fetch error:', err);
        }
    };

    const handleDownloadTemplate = async () => {
        if (!selection.classId || !selection.examTypeId) {
            Swal.fire('Required', 'Please select Class and Exam Type first', 'warning');
            return;
        }

        try {
            setLoading(true);
            const response = await api.get(`/api/staff-panel/result/template`, {
                params: selection,
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const className = classes.find(c => c._id === selection.classId)?.className || 'Class';
            const examName = examTypes.find(e => e._id === selection.examTypeId)?.examTypeName || 'Exam';
            link.setAttribute('download', `Result_Template_${className}_${examName}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            setStep(2);
        } catch (err) {
            Swal.fire('Error', 'Failed to download template', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const uploadedFile = e.target.files[0];
        if (!uploadedFile) return;
        setFile(uploadedFile);

        const formData = new FormData();
        formData.append('file', uploadedFile);
        formData.append('branchId', branchId);
        formData.append('classId', selection.classId);
        formData.append('examTypeId', selection.examTypeId);

        try {
            setLoading(true);
            const res = await api.post('/api/staff-panel/result/preview', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setPreviewData(res.data);
            setStep(3);
        } catch (err) {
            Swal.fire('Error', err.response?.data?.message || 'Failed to parse file', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleFinalize = async () => {
        if (previewData?.summary?.errorCount > 0) {
            const confirm = await Swal.fire({
                title: 'Warnings Found',
                text: 'Some students have errors. They will be skipped or saved with errors. Continue?',
                icon: 'warning',
                showCancelButton: true
            });
            if (!confirm.isConfirmed) return;
        }

        try {
            setLoading(true);
            await api.post('/api/staff-panel/result/finalize', {
                results: previewData.data,
                ...selection
            });
            Swal.fire('Success', 'Results have been finalized and locked!', 'success');
            setStep(4);
        } catch (err) {
            Swal.fire('Error', 'Failed to finalize results', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handlePublish = async () => {
        try {
            setLoading(true);
            await api.post('/api/staff-panel/result/publish', selection);
            Swal.fire('Published!', 'Results are now visible to students and parents.', 'success');
            setStep(1);
            setPreviewData(null);
            setFile(null);
        } catch (err) {
            Swal.fire('Error', 'Failed to publish results', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 p-4">
            {/* Header */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Bulk Result Import</h1>
                    <p className="text-slate-500 font-medium mt-1">Generate template, fill marks offline, and import in bulk.</p>
                </div>
                <div className="flex gap-2">
                    {[1, 2, 3, 4].map(s => (
                        <div 
                            key={s} 
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all
                            ${step === s ? 'bg-indigo-600 text-white scale-110 shadow-lg shadow-indigo-200' : 
                              step > s ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}
                        >
                            {step > s ? <FaCheckCircle size={14} /> : s}
                        </div>
                    ))}
                </div>
            </div>

            {/* Step 1: Configure & Download */}
            {step === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1 bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-6">
                        <h3 className="text-xl font-bold text-slate-800">1. Setup Import</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Select Class</label>
                                <select 
                                    value={selection.classId}
                                    onChange={(e) => setSelection({ ...selection, classId: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium"
                                >
                                    <option value="">-- Choose Class --</option>
                                    {classes.map(c => (
                                        <option key={c._id} value={c._id}>
                                            {c.className} {c.stream && c.stream.length > 0 ? `(${Array.isArray(c.stream) ? c.stream.join(', ') : c.stream})` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Select Exam</label>
                                <select 
                                    value={selection.examTypeId}
                                    onChange={(e) => setSelection({ ...selection, examTypeId: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium"
                                >
                                    <option value="">-- Choose Exam Type --</option>
                                    {examTypes.map(e => <option key={e._id} value={e._id}>{e.examTypeName}</option>)}
                                </select>
                            </div>
                        </div>

                        <button 
                            onClick={handleDownloadTemplate}
                            disabled={loading || !selection.classId || !selection.examTypeId}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-100"
                        >
                            {loading ? 'Processing...' : <><FaDownload /> Download Excel Template</>}
                        </button>
                    </div>

                    <div className="md:col-span-2 bg-indigo-50 rounded-3xl p-10 flex flex-col items-center justify-center text-center space-y-6">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg text-indigo-600">
                            <FaFileExcel size={40} />
                        </div>
                        <h2 className="text-2xl font-black text-indigo-900">Staff Mode: How it works?</h2>
                        <ul className="text-indigo-700 font-medium text-left space-y-4 max-w-md">
                            <li className="flex gap-4">
                                <span className="w-6 h-6 bg-indigo-200 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                                Select your class and exam.
                            </li>
                            <li className="flex gap-4">
                                <span className="w-6 h-6 bg-indigo-200 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                                Download & fill the Excel with student marks.
                            </li>
                            <li className="flex gap-4">
                                <span className="w-6 h-6 bg-indigo-200 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                                Upload & Preview. Finally, publish to Parents/Students.
                            </li>
                        </ul>
                    </div>
                </div>
            )}

            {/* Steps 2, 3, 4 remain similar but with staff panel styling and endpoints */}
            {/* [TRUNCATED for brevity, same logic as Admin version but pointing to /api/staff-panel/result] */}
            {/* I will write the full file below */}
            {step === 2 && (
                <div className="bg-white rounded-3xl p-12 shadow-sm border border-slate-100 text-center space-y-8">
                    <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaUpload size={30} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-800">Upload Filled Excel</h2>
                    <div className="max-w-md mx-auto">
                        <label className="flex flex-col items-center justify-center w-full h-48 border-4 border-dashed border-slate-200 rounded-3xl hover:border-indigo-400 hover:bg-indigo-50 transition-all cursor-pointer group">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <FaFileExcel className="text-slate-300 group-hover:text-indigo-400 mb-4" size={48} />
                                <p className="mb-2 text-sm text-slate-500 font-bold group-hover:text-indigo-600">Click to upload or drag and drop</p>
                            </div>
                            <input type="file" className="hidden" accept=".xlsx, .xls" onChange={handleFileUpload} />
                        </label>
                    </div>
                </div>
            )}

            {step === 3 && previewData && (
                <div className="space-y-6">
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex justify-between items-center">
                        <div className="flex gap-8">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Students</p>
                                <p className="text-2xl font-black text-slate-800">{previewData.summary.totalStudents}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Errors Found</p>
                                <p className={`text-2xl font-black ${previewData.summary.errorCount > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                    {previewData.summary.errorCount}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => setStep(2)} className="px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold">Re-upload</button>
                            <button onClick={handleFinalize} disabled={loading} className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100">
                                {loading ? 'Processing...' : 'Finalize Marks'}
                            </button>
                        </div>
                    </div>
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Student</th>
                                        {previewData.data[0]?.marks.map((m, i) => (
                                            <th key={i} className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">{m.subject}</th>
                                        ))}
                                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Total / %</th>
                                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {previewData.data.map((stu, idx) => (
                                        <tr key={idx} className={stu.hasError ? 'bg-rose-50/30' : ''}>
                                            <td className="px-6 py-4 font-bold text-slate-700">{stu.studentName}</td>
                                            {stu.marks.map((m, i) => (
                                                <td key={i} className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-black text-slate-800">{m.obtained}</span>
                                                        <span className="text-[10px] text-slate-400 font-bold">/ {m.max}</span>
                                                    </div>
                                                </td>
                                            ))}
                                            <td className="px-6 py-4 text-center">
                                                <p className="font-black text-indigo-600">{stu.obtainedMarks}</p>
                                                <p className="text-xs font-bold text-slate-400">{stu.percentage}%</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                {stu.hasError ? <span className="text-rose-500 font-bold text-xs">{stu.errorMessage}</span> : <span className="text-emerald-600 font-bold text-xs">Ready</span>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {step === 4 && (
                <div className="bg-emerald-50 rounded-3xl p-16 text-center space-y-8">
                    <div className="w-24 h-24 bg-white text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg"><FaCheckCircle size={48} /></div>
                    <h2 className="text-4xl font-black text-emerald-900">Marks Finalized!</h2>
                    <button onClick={handlePublish} className="px-12 py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-indigo-200">
                        Publish Result Now
                    </button>
                </div>
            )}
        </div>
    );
}
