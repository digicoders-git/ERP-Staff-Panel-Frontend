import React, { useState, useEffect } from 'react';
import { FaTimes, FaPrint, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002';

export default function MarksheetPreview({ studentResult, template, onClose }) {
    const [dynamicHtml, setDynamicHtml] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDynamicMarksheet = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                if (!studentResult?.student?._id) return;

                const examScheduleId = studentResult.marks?.[0]?.examSchedule?._id || studentResult.marks?.[0]?.examSchedule;

                const response = await axios.get(`${BASE_URL}/api/staff-panel/exam/marksheet/dynamic`, {
                    params: {
                        studentId: studentResult.student._id,
                        examScheduleId: examScheduleId
                    },
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                setDynamicHtml(response.data);
            } catch (error) {
                console.error('Failed to fetch dynamic marksheet:', error);
                setDynamicHtml('<div style="padding: 20px; color: red;">Error generating marksheet. Please check template tags.</div>');
            } finally {
                setLoading(false);
            }
        };

        fetchDynamicMarksheet();
    }, [studentResult]);

    const handlePrint = () => {
        const studentName = `${studentResult.student?.firstName || ''}_${studentResult.student?.lastName || ''}`.trim() || 'Student';
        const fileName = `Marksheet_${studentName.replace(/\s+/g, '_')}`;

        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>${fileName}</title>
                    </head>
                    <body>
                        ${dynamicHtml}
                    </body>
                </html>
            `);
            printWindow.document.close();

            printWindow.onload = () => {
                printWindow.print();
                setTimeout(() => printWindow.close(), 1000);
            };

            // Fallback
            setTimeout(() => {
                if (!printWindow.closed) {
                    printWindow.print();
                    printWindow.close();
                }
            }, 2000);
        }
    };

    if (!studentResult) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/98 backdrop-blur-3xl flex flex-col z-[1000] overflow-hidden animate-fadeIn">
            {/* Control Bar */}
            <div className="bg-slate-900 px-8 py-4 flex justify-between items-center border-b border-slate-800 print:hidden">
                <button onClick={onClose} className="flex items-center gap-2 text-slate-400 hover:text-white font-bold text-xs uppercase tracking-widest"><FaArrowLeft /> Back</button>
                <div className="flex gap-4">
                    <button
                        onClick={handlePrint}
                        disabled={loading}
                        className="px-10 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        <FaPrint /> Print Official Marksheet
                    </button>
                    <button onClick={onClose} className="p-3 bg-slate-800 text-slate-400 rounded-xl hover:text-white"><FaTimes size={18} /></button>
                </div>
            </div>

            {/* Marksheet Container */}
            <div className="flex-1 overflow-auto p-4 md:p-12 flex justify-center bg-slate-950">
                {loading ? (
                    <div className="flex flex-col items-center justify-center text-white gap-4">
                        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-slate-400 font-bold animate-pulse">GENERATING DYNAMIC MARKSHEET...</p>
                    </div>
                ) : (
                    <div
                        id="marksheet-render"
                        className="bg-white shadow-2xl print:shadow-none"
                        style={{ width: '210mm', minHeight: '297mm' }}
                        dangerouslySetInnerHTML={{ __html: dynamicHtml }}
                    />
                )}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page { size: A4; margin: 0; }
                    body { margin: 0; padding: 0; background: white !important; }
                    .print\\:hidden { display: none !important; }
                    body > *:not(#marksheet-render) { display: none !important; }
                    #marksheet-render { 
                        position: absolute; 
                        left: 0; 
                        top: 0; 
                        width: 210mm; 
                        height: 297mm; 
                        margin: 0; 
                        padding: 0;
                        box-shadow: none !important;
                    }
                    /* Ensure background colors and images print */
                    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                }
                .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            ` }} />
        </div>
    );
}
