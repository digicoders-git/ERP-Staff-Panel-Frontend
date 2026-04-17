import React, { useState, useEffect, useMemo } from 'react';
import { MdBarChart, MdDateRange, MdDownload, MdPerson, MdFilterList, MdRefresh, MdCheckCircle, MdCancel, MdSchedule, MdClass } from 'react-icons/md';
import Highcharts from '../utils/highchartsConfig';
import HighchartsReact from 'highcharts-react-official';
import { attendanceAPI, classAPI } from '../utils/apiService';
import { toast } from 'react-toastify';
import { FaSpinner, FaChartLine } from 'react-icons/fa';

const AttendanceReports = () => {
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [fromDate, setFromDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportData, setReportData] = useState({
    summary: { present: 0, absent: 0, late: 0, leave: 0 },
    timeline: [],
    details: [],
    classSummary: []
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchClasses();
    fetchReports();
  }, []);

  const fetchClasses = async () => {
    try {
        const res = await classAPI.getAll();
        if (res.data && res.data.classes) setClasses(res.data.classes);
    } catch (err) {
        console.error(err);
    }
  };

  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = {
        type: 'student',
        startDate: fromDate,
        endDate: toDate,
        classId: selectedClass || undefined,
        sectionId: selectedSection || undefined
      };
      
      const res = await attendanceAPI.getReport(params);
      if (res.data) {
        setReportData(res.data);
      }
    } catch (err) {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const filteredDetails = reportData.details?.filter(item => 
    item.studentId?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.studentId?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.studentId?.admissionNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const distributionOptions = useMemo(() => ({
    chart: { type: 'pie', backgroundColor: 'transparent' },
    title: { text: null },
    tooltip: { pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>' },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: { enabled: true, format: '<b>{point.name}</b>: {point.y}', style: { fontWeight: '800' } },
        borderWidth: 0,
        innerSize: '60%'
      }
    },
    series: [{
      name: 'Status',
      colorByPoint: true,
      data: [
        { name: 'Present', y: reportData.summary.present, color: '#10b981' },
        { name: 'Absent', y: reportData.summary.absent, color: '#ef4444' },
        { name: 'Late', y: reportData.summary.late, color: '#f59e0b' },
        { name: 'Leave', y: reportData.summary.leave, color: '#6366f1' }
      ]
    }],
    credits: { enabled: false }
  }), [reportData.summary]);

  const timelineOptions = useMemo(() => ({
    chart: { type: 'spline', backgroundColor: 'transparent' },
    title: { text: null },
    xAxis: { categories: reportData.timeline?.map(d => d.date) || [] },
    yAxis: { title: { text: 'Attendance' }, min: 0 },
    series: [
      { name: 'Present', data: reportData.timeline?.map(d => d.present) || [], color: '#10b981' },
      { name: 'Absent', data: reportData.timeline?.map(d => d.absent) || [], color: '#ef4444' }
    ],
    credits: { enabled: false }
  }), [reportData.timeline]);

  const getStatusBadge = (status) => {
    const styles = {
        present: 'bg-emerald-50 text-emerald-600',
        absent: 'bg-rose-50 text-rose-600',
        late: 'bg-amber-50 text-amber-600',
        leave: 'bg-indigo-50 text-indigo-600'
    };
    return <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${styles[status.toLowerCase()] || 'bg-slate-50 text-slate-500'}`}>{status}</span>;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
        {/* Simple Header */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
                <div className="w-1.5 h-10 bg-blue-600 rounded-full" />
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Student Attendance Record</h1>
                    <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-medium">Daily attendance tracking and history</p>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full lg:w-auto">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Start Date</label>
                    <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-semibold text-sm" />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">End Date</label>
                    <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-semibold text-sm" />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Class</label>
                    <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-semibold text-sm">
                        <option value="">All Classes</option>
                        {classes.map(c => <option key={c._id} value={c._id}>{c.className}</option>)}
                    </select>
                </div>
                <div className="flex items-end">
                    <button onClick={fetchReports} className="w-full bg-blue-600 text-white h-[45px] rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-slate-800 transition-all">
                        {loading ? <FaSpinner className="animate-spin" /> : 'Fetch Logs'}
                    </button>
                </div>
            </div>
        </div>


        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
                { label: 'Present', val: reportData.summary.present, color: 'text-emerald-500', bg: 'bg-white', icon: MdCheckCircle },
                { label: 'Absent', val: reportData.summary.absent, color: 'text-rose-500', bg: 'bg-white', icon: MdCancel },
                { label: 'Late', val: reportData.summary.late, color: 'text-amber-500', bg: 'bg-white', icon: MdSchedule },
                { label: 'On Leave', val: reportData.summary.leave, color: 'text-indigo-500', bg: 'bg-white', icon: MdDateRange }
            ].map((s, i) => (
                <div key={i} className={`${s.bg} p-6 rounded-3xl border border-slate-100 flex items-center justify-between shadow-sm`}>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{s.label}</p>
                        <p className={`text-3xl font-black ${s.color} tracking-tighter tabular-nums`}>{s.val}</p>
                    </div>
                    <div className={`${s.color} opacity-20`}><s.icon size={40} /></div>
                </div>
            ))}
        </div>

        {/* Class Statistics Grid */}
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 ml-1">
                <MdClass className="text-blue-600" /> Class Wise Summary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {reportData.classSummary?.map((cls) => (
                    <div key={cls._id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-start mb-3">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{cls.className}</span>
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[9px] font-bold">{Math.round((cls.presentCount / (cls.totalStudents || 1)) * 100)}%</span>
                        </div>
                        <div className="flex items-end justify-between">
                            <p className="text-xl font-black text-slate-800 tabular-nums">
                                {cls.presentCount} <span className="text-slate-300 text-xs font-medium">/ {cls.totalStudents}</span>
                            </p>
                            <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider mb-1">Present Today</p>
                        </div>
                    </div>
                ))}
                {(!reportData.classSummary || reportData.classSummary.length === 0) && (
                    <div className="col-span-full py-10 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 text-center text-slate-400 font-bold text-[10px] uppercase tracking-widest italic">
                        No Class Data Found
                    </div>
                )}
            </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Status Distribution Chart */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
                    <MdBarChart className="text-blue-600" size={20} /> Status Distribution
                </h3>
                <div className="min-h-[300px]">
                    {reportData.summary.present + reportData.summary.absent + reportData.summary.late + reportData.summary.leave > 0 ? (
                        <HighchartsReact highcharts={Highcharts} options={distributionOptions} />
                    ) : (
                        <div className="h-[300px] flex flex-col items-center justify-center text-slate-300 gap-3">
                            <MdBarChart size={48} className="opacity-20" />
                            <p className="text-xs font-bold uppercase tracking-widest">No Data Available</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Timeline Trend Chart */}
            <div className="xl:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
                    <FaChartLine className="text-indigo-600" size={18} /> Timeline Trend
                </h3>
                <div className="min-h-[300px]">
                    {reportData.timeline && reportData.timeline.length > 0 ? (
                        <HighchartsReact highcharts={Highcharts} options={timelineOptions} />
                    ) : (
                        <div className="h-[300px] flex flex-col items-center justify-center text-slate-300 gap-3">
                            <FaChartLine size={40} className="opacity-20" />
                            <p className="text-xs font-bold uppercase tracking-widest">Awaiting Timeline Data</p>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Detailed Attendance Logs */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-10">
            <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Detailed Attendance Logs</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{filteredDetails.length} records found in search</p>
                </div>
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Search student name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 outline-none font-semibold text-xs tracking-wider w-64 transition-all"
                    />
                    <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50">
                            <th className="px-8 py-5">Student Name</th>
                            <th className="px-8 py-5">Class/Section</th>
                            <th className="px-8 py-5">Date</th>
                            <th className="px-8 py-5">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredDetails.map((log) => (
                            <tr key={log._id} className="hover:bg-slate-100/30 transition-colors">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-[10px] font-black uppercase italic">
                                            {(log.studentId?.firstName || 'S')[0]}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-800">{log.studentId?.firstName} {log.studentId?.lastName}</p>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Roll: {log.studentId?.rollNumber}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-slate-700">{log.classId?.className}</span>
                                        <span className="text-[9px] font-bold text-slate-400 italic">Section: {log.sectionId?.sectionName || 'N/A'}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <span className="text-xs font-medium text-slate-500 tabular-nums">{new Date(log.date).toLocaleDateString()}</span>
                                </td>
                                <td className="px-8 py-5">
                                    {getStatusBadge(log.status)}
                                </td>
                            </tr>
                        ))}
                        {filteredDetails.length === 0 && (
                            <tr>
                                <td colSpan="4" className="py-16 text-center text-slate-300 font-bold text-[10px] uppercase tracking-widest italic">No Records Found matching search</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default AttendanceReports;