import React, { useEffect, useState } from 'react';
import { FaTimes, FaPrint, FaSchool, FaFilePdf } from 'react-icons/fa';
import api from '../utils/api';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ExamTimetablePrint = ({ schedules, examType, onClose }) => {
    const [branding, setBranding] = useState(null);

    useEffect(() => {
        fetchBranding();
    }, []);

    const fetchBranding = async () => {
        try {
            const res = await api.get('/api/staff-panel/exam/branding');
            if (res.data?.success) {
                setBranding(res.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch branding:', err);
        }
    };

    // Grouping logic
    const uniqueDates = [...new Set(schedules.map(s => s.examDate?.split('T')[0]))].sort();
    const uniqueClasses = Array.from(new Set(schedules.map(s => s.class?._id || s.class))).map(cid => {
        return schedules.find(s => (s.class?._id || s.class) === cid)?.class;
    });

    const getScheduleForDateAndClass = (date, classId) => {
        return schedules.find(s => s.examDate?.split('T')[0] === date && (s.class?._id || s.class) === classId);
    };

    const getFormattedFileName = () => {
        const classNames = uniqueClasses.map(c => c?.className).join('_').replace(/\s+/g, '_');
        const examName = (examType || 'Examination').replace(/\s+/g, '_');
        return `${classNames}-${examName}-TimeTable`;
    };

    const handlePrint = () => {
        const originalTitle = document.title;
        document.title = getFormattedFileName();
        window.print();
        setTimeout(() => {
            document.title = originalTitle;
        }, 1000);
    };

    const handleDownloadPDF = async () => {
        const element = document.getElementById('date-sheet-content');
        if (!element) return;
        try {
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${getFormattedFileName()}.pdf`);
        } catch (error) {
            console.error('PDF generation error:', error);
            alert('PDF Error: Please use the Print option.');
        }
    };

    const getLogoUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002'}/${path.replace(/\\/g, '/')}`;
    };

    return (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md flex items-center justify-center z-[2000] p-4 md:p-6 overflow-hidden">
            <div className="bg-white w-full max-w-6xl h-full max-h-[90vh] rounded-[2.5rem] shadow-2xl flex flex-col relative overflow-hidden print:m-0 print:shadow-none print:rounded-none">
                
                {/* Fixed Header Controls */}
                <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-center bg-white shrink-0 print:hidden z-20">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{backgroundColor: '#4f46e5'}}>
                            <FaSchool size={20} color="white" />
                        </div>
                        <div>
                            <h2 className="font-black uppercase tracking-tight text-sm" style={{color: '#0f172a'}}>Official Timetable Preview</h2>
                            <p className="text-[10px] font-bold uppercase tracking-widest italic" style={{color: '#64748b'}}>Clean White Design Active</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleDownloadPDF} className="px-5 md:px-6 py-3 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2 active:scale-95 transition-all" style={{ backgroundColor: '#e11d48' }}>
                            <FaFilePdf /> Download PDF
                        </button>
                        <button onClick={handlePrint} className="px-5 md:px-8 py-3 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2 active:scale-95 transition-all" style={{backgroundColor: '#4f46e5'}}>
                            <FaPrint /> Print Official Copy
                        </button>
                        <button onClick={onClose} className="p-3 rounded-xl transition-all" style={{ backgroundColor: '#f1f5f9', color: '#94a3b8' }}>
                            <FaTimes size={20} />
                        </button>
                    </div>
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50 print:bg-white print:overflow-visible print:p-0">
                    <div id="date-sheet-content" className="bg-white p-6 md:p-12 mx-auto w-full max-w-[8.5in] shadow-lg print:shadow-none print:p-8" style={{ color: '#000000', fontFamily: "'Times New Roman', serif" }}>
                        
                        {/* School Header */}
                        <div className="text-center mb-8 space-y-2">
                            {(branding?.logo) && (
                                <div className="flex justify-center mb-4">
                                    <img src={getLogoUrl(branding.logo)} alt="Logo" className="h-20 w-auto object-contain" />
                                </div>
                            )}
                            <h1 className="text-3xl font-bold uppercase" style={{color: '#000000'}}>{branding?.schoolName || "ELITE INTERNATIONAL SCHOOL"}</h1>
                            <p className="text-sm font-bold" style={{color: '#000000'}}>{branding?.address || "School Address Details"}</p>
                            <div className="mt-6 mb-6">
                                <h2 className="text-xl font-bold border-b-2 border-black inline-block px-4 pb-1 uppercase">
                                    Time Table for {examType || 'Examination'}
                                </h2>
                            </div>
                        </div>

                        {/* PURE SIMPLE TABLE - NO BACKGROUND COLORS */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-center border-collapse" style={{ border: '2.5px solid #000000' }}>
                                <thead>
                                    <tr>
                                        <th rowSpan={2} className="p-4 font-bold uppercase text-sm" style={{ border: '2.5px solid #000000', backgroundColor: '#ffffff', color: '#000000', width: '120px' }}>DAY</th>
                                        <th rowSpan={2} className="p-4 font-bold uppercase text-sm" style={{ border: '2.5px solid #000000', backgroundColor: '#ffffff', color: '#000000', width: '150px' }}>DATE</th>
                                        {/* SIMPLE WHITE HEADER FOR CLASS */}
                                        {uniqueClasses.map(cls => (
                                            <th key={cls?._id} colSpan={3} className="p-3 font-bold uppercase tracking-widest text-lg" style={{ border: '2.5px solid #000000', backgroundColor: '#ffffff' }}>
                                                {cls?.className?.toUpperCase()} {cls?.stream ? `(${cls.stream})` : ''}
                                            </th>
                                        ))}
                                    </tr>
                                    <tr>
                                        {uniqueClasses.map(cls => (
                                            <React.Fragment key={`sub-${cls?._id}`}>
                                                <th className="p-2 font-bold uppercase text-xs" style={{ border: '2px solid #000000', backgroundColor: '#ffffff' }}>SUBJECT</th>
                                                <th className="p-2 font-bold uppercase text-xs" style={{ border: '2px solid #000000', backgroundColor: '#ffffff' }}>MARKS</th>
                                                <th className="p-2 font-bold uppercase text-xs" style={{ border: '2px solid #000000', backgroundColor: '#ffffff' }}>TIME</th>
                                            </React.Fragment>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {uniqueDates.map(date => (
                                        <tr key={date}>
                                            <td className="p-4 font-bold uppercase text-xs" style={{ border: '2px solid #000000' }}>
                                                {new Date(date).toLocaleDateString('en-US', { weekday: 'long' })}
                                            </td>
                                            <td className="p-4 font-bold text-sm" style={{ border: '2px solid #000000' }}>
                                                {new Date(date).toLocaleDateString('en-GB')}
                                            </td>
                                            
                                            {uniqueClasses.map(cls => {
                                                const entry = getScheduleForDateAndClass(date, cls?._id);
                                                return (
                                                    <React.Fragment key={`cell-${date}-${cls?._id}`}>
                                                        <td className="p-4 font-bold text-sm" style={{ border: '2px solid #000000' }}>
                                                            {entry?.subject || '—'}
                                                        </td>
                                                        <td className="p-4 font-bold text-sm" style={{ border: '2px solid #000000' }}>
                                                            {entry?.totalMarks || '—'}
                                                        </td>
                                                        <td className="p-4 font-bold text-[11px]" style={{ border: '2px solid #000000' }}>
                                                            {entry ? `${entry.startTime} - ${entry.endTime}` : '—'}
                                                        </td>
                                                    </React.Fragment>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer Notes */}
                        <div className="mt-12">
                            <p className="font-bold mb-2 underline underline-offset-4">Instructions :</p>
                            <ol className="list-decimal pl-6 text-sm font-bold space-y-1">
                                <li>All students must report 15 minutes before the exam time.</li>
                                <li>Identity card is mandatory for appearing in the exam.</li>
                                <li>Mobile phones and gadgets are strictly prohibited.</li>
                                <li>Result will be declared within 15 days of the last exam.</li>
                            </ol>

                            {/* Principal Signature Area */}
                            <div className="flex justify-end mt-16">
                                <div className="text-center w-64 border-t-2 border-black pt-2">
                                    <p className="text-sm font-bold uppercase">Principal Signature</p>
                                    <p className="text-[10px] italic">School Seal & Stamp</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    body * { visibility: hidden; }
                    #date-sheet-content, #date-sheet-content * { visibility: visible; }
                    #date-sheet-content { 
                        position: absolute; 
                        left: 0; top: 0; width: 100%;
                        background: white !important;
                        padding: 0 !important;
                        box-shadow: none !important;
                    }
                    table { border-collapse: collapse !important; width: 100% !important; }
                    th, td { border: 2.5px solid black !important; color: black !important; }
                }
            ` }} />
        </div>
    );
};

export default ExamTimetablePrint;
