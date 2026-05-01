import React, { useState, useEffect } from 'react';
import { FaSearch, FaPrint, FaEye, FaFileDownload, FaFilter } from 'react-icons/fa';
import api from '../utils/api';
import Swal from 'sweetalert2';
import MarksheetPreview from './MarksheetPreview';

export default function ViewResults() {
    const [classes, setClasses] = useState([]);
    const [examTypes, setExamTypes] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [mappedTemplate, setMappedTemplate] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    
    const staff = JSON.parse(localStorage.getItem('staff') || '{}');
    const branchId = staff.branch?._id || staff.branch;

    const [filters, setFilters] = useState({
        classId: '',
        examTypeId: ''
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [examTypeRes, classRes] = await Promise.all([
                api.get('/api/staff-panel/exam/exam-types'),
                api.get(`/api/staff-panel/class/all?branchId=${branchId}`)
            ]);
            setExamTypes(examTypeRes.data.data || []);
            setClasses(classRes.data.classes || []);
        } catch (err) {
            console.error('Fetch error:', err);
        }
    };

    const handleSearch = async () => {
        if (!filters.classId || !filters.examTypeId) {
            Swal.fire('Required', 'Please select both Class and Exam Type', 'info');
            return;
        }

        try {
            setLoading(true);
            const res = await api.get(`/api/staff-panel/exam/marks/history`, {
                params: {
                    classId: filters.classId,
                    examTypeId: filters.examTypeId,
                    branchId: branchId
                }
            });
            const marksData = res.data.marks || res.data.data || [];
            
            // Grouping marks by student
            const grouped = marksData.reduce((acc, curr) => {
                const sid = curr.student._id;
                if (!acc[sid]) {
                    acc[sid] = {
                        student: curr.student,
                        marks: [],
                        totalObtained: 0,
                        totalMax: 0
                    };
                }
                acc[sid].marks.push(curr);
                acc[sid].totalObtained += curr.marksObtained;
                acc[sid].totalMax += curr.totalMarks;
                return acc;
            }, {});

            setStudents(Object.values(grouped));
            if (res.data.template) {
                setMappedTemplate(res.data.template);
            }
        } catch (err) {
            Swal.fire('Error', 'Failed to fetch results', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handlePrintMarksheet = (studentResult) => {
        setSelectedStudent(studentResult);
        // Template is already set in handleSearch via setMappedTemplate
        setShowPreview(true);
    };

    const handleExport = async () => {
        if (!filters.classId || !filters.examTypeId) {
            Swal.fire('Required', 'Please select both Class and Exam Type to export', 'info');
            return;
        }

        try {
            Swal.fire({
                title: 'Preparing Excel...',
                text: 'Please wait while we generate the report',
                allowOutsideClick: false,
                didOpen: () => { Swal.showLoading(); }
            });

            const response = await api.get('/api/staff-panel/result/export', {
                params: {
                    classId: filters.classId,
                    examTypeId: filters.examTypeId,
                    branchId: branchId
                },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Results_Class_${filters.classId}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            Swal.close();
        } catch (err) {
            console.error('Export error:', err);
            Swal.fire('Error', 'Failed to download Excel report', 'error');
        }
    };

    return (
        <div className="space-y-6 p-4">
            {/* Header */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">View Class Results</h1>
                    <p className="text-slate-500 font-medium mt-1">Review finalized results and generate marksheets.</p>
                </div>
                
                <div className="flex flex-wrap gap-4 items-end">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Class</label>
                        <select 
                            value={filters.classId}
                            onChange={(e) => setFilters({ ...filters, classId: e.target.value })}
                            className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700"
                        >
                            <option value="">-- Select Class --</option>
                            {classes.map(c => (
                                <option key={c._id} value={c._id}>
                                    {c.className} {c.stream && c.stream.length > 0 ? `(${Array.isArray(c.stream) ? c.stream.join(', ') : c.stream})` : ''}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Exam Type</label>
                        <select 
                            value={filters.examTypeId}
                            onChange={(e) => setFilters({ ...filters, examTypeId: e.target.value })}
                            className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700"
                        >
                            <option value="">-- Select Exam --</option>
                            {examTypes.map(e => <option key={e._id} value={e._id}>{e.examTypeName}</option>)}
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={handleSearch}
                            className="p-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
                        >
                            <FaSearch /> Search
                        </button>
                        <button 
                            onClick={handleExport}
                            className="p-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center gap-2"
                            title="Export Class Results to Excel"
                        >
                            <FaFileDownload /> Export
                        </button>
                    </div>
                </div>
            </div>

            {/* Results Table */}
            {students.length > 0 ? (
                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Adm. No</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Name</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Grand Total</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Percentage</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {students.map((stu, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-5 font-black text-slate-400 text-xs">{stu.student.admissionNumber}</td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold">
                                                {stu.student.firstName[0]}
                                            </div>
                                            <p className="font-bold text-slate-800">{stu.student.firstName} {stu.student.lastName}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl font-black">
                                            {stu.totalObtained} / {stu.totalMax}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <p className="text-xl font-black text-slate-800">{((stu.totalObtained / stu.totalMax) * 100).toFixed(1)}%</p>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => handlePrintMarksheet(stu)}
                                                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-2"
                                            >
                                                <FaPrint size={14} /> Marksheet
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : !loading && (
                <div className="bg-white rounded-[2rem] p-20 text-center border-4 border-dashed border-slate-100">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                        <FaFilter size={30} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-300">Select Filters to View Results</h3>
                </div>
            )}

            {/* Marksheet Preview Modal */}
            {showPreview && (
                <MarksheetPreview 
                    studentResult={selectedStudent}
                    template={mappedTemplate}
                    onClose={() => setShowPreview(false)}
                />
            )}
        </div>
    );
}
