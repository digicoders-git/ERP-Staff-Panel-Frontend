import React, { useEffect, useState } from 'react';
import { FaPrint, FaTimes, FaSpinner } from 'react-icons/fa';
import api from '../utils/api';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002';

const MarksheetPrintModal = ({ student, examSchedule, marksData, onClose }) => {
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMappedTemplate = async () => {
      try {
        const staff = JSON.parse(localStorage.getItem('staff') || '{}');
        const branchId = staff.branch?._id || staff.branch;
        const examTypeId = examSchedule?.examTypeId?._id || examSchedule?.examTypeId;
        const classId = student?.class?._id || student?.class;

        if (examTypeId && classId && branchId) {
          // Use the new mapping API
          const res = await api.get(`/api/template-mapping/find?branchId=${branchId}&examTypeId=${examTypeId}&classId=${classId}`);
          if (res.data?.data?.template) {
            const temp = res.data.data.template;
            const fullPath = temp.filePath.startsWith('http') ? temp.filePath : `${BASE_URL}/${temp.filePath}`;
            setTemplate(fullPath);
          }
        }
      } catch (err) {
        console.error('Error fetching mapped template:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMappedTemplate();
  }, [examSchedule, student]);

  const marks = Number(marksData?.total || 0);
  const tm = examSchedule?.totalMarks || 100;
  const pct = tm > 0 ? ((marks / tm) * 100).toFixed(2) : 0;

  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=800,width=1000');
    
    // Grade calculation
    let grade = 'F';
    if (pct >= 90) grade = 'A+';
    else if (pct >= 80) grade = 'A';
    else if (pct >= 70) grade = 'B+';
    else if (pct >= 60) grade = 'B';
    else if (pct >= 50) grade = 'C';
    else if (pct >= 33) grade = 'D';

    printWindow.document.write(`
      <html>
        <head>
          <title>Marksheet - ${student?.firstName} ${student?.lastName}</title>
          <style>
            body { margin: 0; padding: 20px; background: white; font-family: 'Segoe UI', Arial, sans-serif; }
            .marksheet-container { position: relative; width: 100%; max-width: 900px; margin: 0 auto; border: 1px solid #eee; }
            .template-bg { position: relative; width: 100%; }
            .template-bg img { width: 100%; height: auto; display: block; opacity: 0.3; }
            .content-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; padding: 40px; box-sizing: border-box; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 10px; }
            .student-info { display: grid; grid-template-cols: 1fr 1fr; gap: 15px; margin-bottom: 30px; }
            .student-info p { margin: 5px 0; font-size: 14px; }
            .marks-table { width: 100%; border-collapse: collapse; font-size: 13px; margin: 20px 0; }
            .marks-table th, .marks-table td { border: 1px solid #333; padding: 12px 8px; text-align: center; }
            .marks-table th { background: #f8f9fa; font-weight: bold; text-transform: uppercase; }
            .marks-table td:first-child { text-align: left; font-weight: bold; }
            .footer { margin-top: 50px; display: flex; justify-content: space-between; padding: 0 40px; }
            .sig-box { text-align: center; }
            .sig-line { border-top: 1px solid #333; width: 180px; margin-bottom: 10px; }
            .summary { margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px; display: flex; justify-content: space-around; font-weight: bold; }
            @media print { .template-bg img { opacity: 1; } }
          </style>
        </head>
        <body>
          <div class="marksheet-container">
            <div class="template-bg">
              ${template ? `<img src="${template}" />` : '<div style="height: 1000px; background: #fff;"></div>'}
              <div class="content-overlay">
                <div class="header">
                  <h1 style="margin: 0; font-size: 28px;">ACADEMIC TRANSCRIPT</h1>
                  <p style="margin: 5px 0; color: #666;">${examSchedule?.examTitle || 'EXAMINATION'}</p>
                </div>

                <div class="student-info">
                  <div>
                    <p><strong>NAME:</strong> ${student?.firstName?.toUpperCase()} ${student?.lastName?.toUpperCase()}</p>
                    <p><strong>ROLL NO:</strong> ${student?.rollNumber || '—'}</p>
                    <p><strong>ADMISSION NO:</strong> ${student?.admissionNumber || '—'}</p>
                  </div>
                  <div>
                    <p><strong>CLASS:</strong> ${student?.class?.className?.toUpperCase() || '—'}</p>
                    <p><strong>SECTION:</strong> ${student?.section?.sectionName?.toUpperCase() || '—'}</p>
                    <p><strong>DATE:</strong> ${new Date().toLocaleDateString()}</p>
                  </div>
                </div>

                <table class="marks-table">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      ${examSchedule?.examTypeId?.marksType === 'theory+practical' ? '<th>Theory</th><th>Practical</th>' : ''}
                      <th>Total Obtained</th>
                      <th>Max Marks</th>
                      <th>Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>${examSchedule?.subject || '—'}</td>
                      ${examSchedule?.examTypeId?.marksType === 'theory+practical' ? `<td>${marksData.theory}</td><td>${marksData.practical}</td>` : ''}
                      <td style="font-size: 16px;">${marks}</td>
                      <td>${tm}</td>
                      <td style="color: ${marks >= (examSchedule?.passingMarks || 40) ? '#059669' : '#dc2626'}">
                        <strong>${marks >= (examSchedule?.passingMarks || 40) ? 'PASSED' : 'FAILED'}</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div class="summary">
                  <div>PERCENTAGE: ${pct}%</div>
                  <div>GRADE: ${grade}</div>
                  <div>FINAL STATUS: ${marks >= (examSchedule?.passingMarks || 40) ? 'PASSED' : 'FAILED'}</div>
                </div>

                <div class="footer">
                  <div class="sig-box">
                    <div class="sig-line"></div>
                    <p>Class Teacher</p>
                  </div>
                  <div class="sig-box">
                    <div class="sig-line"></div>
                    <p>Principal</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <script>
            window.onload = () => {
              window.print();
              setTimeout(() => window.close(), 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[2rem] shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Marksheet Preview</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{student?.firstName} {student?.lastName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl transition-all text-slate-400 hover:text-slate-600">
            <FaTimes size={20} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <FaSpinner className="animate-spin text-indigo-600 text-4xl" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">Retrieving Mapped Template...</p>
            </div>
          ) : (
            <div className="space-y-6">
               {template ? (
                 <div className="border-2 border-slate-100 rounded-2xl overflow-hidden shadow-inner bg-slate-50 relative">
                    <img src={template} alt="Template" className="w-full opacity-40" />
                    <div className="absolute inset-0 p-8">
                        <div className="flex justify-between border-b-2 border-slate-900 pb-4 mb-6">
                            <span className="font-black text-lg uppercase">{examSchedule?.examTitle}</span>
                            <span className="font-bold text-slate-500 uppercase tracking-widest text-xs">Academic Report</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-xs font-bold uppercase mb-8">
                            <p className="text-slate-400">Name: <span className="text-slate-900">{student?.firstName} {student?.lastName}</span></p>
                            <p className="text-slate-400">Roll: <span className="text-slate-900">{student?.rollNumber}</span></p>
                            <p className="text-slate-400">Subject: <span className="text-slate-900">{examSchedule?.subject}</span></p>
                            <p className="text-slate-400">Class: <span className="text-slate-900">{student?.class?.className}</span></p>
                        </div>

                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <table className="w-full text-center">
                                <thead className="bg-slate-900 text-white text-[10px] uppercase tracking-widest">
                                    <tr>
                                        <th className="py-3 px-2">Type</th>
                                        <th className="py-3 px-2">Obtained</th>
                                        <th className="py-3 px-2">Max</th>
                                    </tr>
                                </thead>
                                <tbody className="text-xs font-black">
                                    {examSchedule?.examTypeId?.marksType === 'theory+practical' ? (
                                        <>
                                            <tr className="border-b">
                                                <td className="py-3 text-slate-400">Theory</td>
                                                <td className="py-3">{marksData.theory}</td>
                                                <td className="py-3">{examSchedule.examTypeId.theoryMarks}</td>
                                            </tr>
                                            <tr className="border-b">
                                                <td className="py-3 text-slate-400">Practical</td>
                                                <td className="py-3">{marksData.practical}</td>
                                                <td className="py-3">{examSchedule.examTypeId.practicalMarks}</td>
                                            </tr>
                                        </>
                                    ) : null}
                                    <tr className="bg-indigo-50">
                                        <td className="py-3 uppercase text-indigo-600">Grand Total</td>
                                        <td className="py-3 text-lg text-indigo-600">{marks}</td>
                                        <td className="py-3 text-slate-400">{tm}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                 </div>
               ) : (
                <div className="bg-amber-50 border-2 border-dashed border-amber-200 rounded-3xl p-12 text-center">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaTimes className="text-amber-600" size={24} />
                  </div>
                  <h3 className="text-lg font-black text-amber-900 uppercase tracking-tight">No Mapped Template</h3>
                  <p className="text-xs font-medium text-amber-700 mt-2 max-w-sm mx-auto">
                    Admin has not mapped a specific marksheet template for this Exam Type and Class.
                    Please contact Admin to set up Template Mapping.
                  </p>
                </div>
               )}
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-4 justify-end">
          <button onClick={onClose} className="px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-white transition-all">Cancel</button>
          {template && (
            <button
              onClick={handlePrint}
              className="px-10 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-200 hover:scale-105 transition-all flex items-center gap-2"
            >
              <FaPrint /> Generate Print
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarksheetPrintModal;
