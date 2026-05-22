import React, { useState, useEffect, useMemo } from 'react';
import { MdPeople, MdCalendarToday, MdAssignment, MdFileDownload, MdSearch, MdRefresh, MdLogin, MdLogout } from 'react-icons/md';
import { FaUserClock, FaHistory, FaCheckCircle, FaTimesCircle, FaClock, FaSpinner } from 'react-icons/fa';
import Highcharts from '../utils/highchartsConfig';
import HighchartsReact from 'highcharts-react-official';
import { teacherAPI, leaveAPI } from '../utils/apiService';
import { BASE_URL } from '../utils/api';
import { toast } from 'react-toastify';

const StaffAttendance = () => {
  const [activeTab, setActiveTab] = useState('attendance-summary');
  const [attendanceData, setAttendanceData] = useState([]);
  const [leaveData, setLeaveData] = useState([]);
  const [stats, setStats] = useState({
    totalStaff: 0,
    presentToday: 0,
    pendingLeaves: 0,
    averageHours: 0
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, [activeTab, searchTerm]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch Attendance Report
      const reportRes = await teacherAPI.getAttendanceReport();
      if (reportRes.data && reportRes.data.data) {
        const d = reportRes.data.data;
        setStats({
          totalStaff: d.totalRecords || 0,
          presentToday: d.presentCount || 0,
          pendingLeaves: d.leaveCount || 0,
          averageHours: d.averageWorkingHours || 0
        });
      }

      // Fetch All Attendance Records for Detailed Report
      const recordsRes = await teacherAPI.getAttendance({ limit: 100 });
      if (recordsRes.data && recordsRes.data.data) {
        setAttendanceData(recordsRes.data.data);
      }

      // Fetch Leaves if active tab is leave
      if (activeTab === 'leave-management') {
        const leaveRes = await leaveAPI.getAll();
        if (leaveRes.data && leaveRes.data.leaves) {
          setLeaveData(leaveRes.data.leaves);
        }
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Chart options for attendance report
  const chartOptions = useMemo(() => ({
    chart: {
      type: 'column',
      height: 380,
      backgroundColor: 'transparent',
      borderRadius: 20
    },
    title: {
      text: null
    },
    xAxis: {
      categories: attendanceData.slice(0, 7).map(item => item.teacherName),
      labels: {
        style: { color: '#64748b', fontSize: '10px', fontWeight: 'bold' }
      },
      lineColor: '#f1f5f9'
    },
    yAxis: {
      title: { text: 'Time Logged (Hours)', style: { color: '#94a3b8', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' } },
      labels: { style: { color: '#94a3b8' } },
      gridLineColor: '#f8fafc'
    },
    tooltip: {
      backgroundColor: '#1e293b',
      padding: 12,
      style: { color: '#ffffff' },
      borderRadius: 12,
      shared: true
    },
    plotOptions: {
      column: {
        borderRadius: 8,
        borderWidth: 0,
        pointWidth: 30
      }
    },
    series: [
      {
        name: 'Logged Hours',
        data: attendanceData.slice(0, 7).map(item => parseFloat(item.workingHours || 0)),
        color: '#2563eb'
      }
    ],
    credits: { enabled: false }
  }), [attendanceData]);

  const leaveChartOptions = useMemo(() => ({
    chart: { type: 'pie', height: 350, backgroundColor: 'transparent' },
    title: { text: null },
    plotOptions: {
      pie: {
        innerSize: '60%',
        depth: 45,
        dataLabels: { enabled: false },
        showInLegend: true,
        borderWidth: 0
      }
    },
    series: [{
      name: 'Total Applications',
      data: [
        { name: 'Approved', y: leaveData.filter(l => l.status === 'approved').length, color: '#10b981' },
        { name: 'Pending', y: leaveData.filter(l => l.status === 'pending').length, color: '#f59e0b' },
        { name: 'Rejected', y: leaveData.filter(l => l.status === 'rejected').length, color: '#ef4444' }
      ]
    }],
    credits: { enabled: false }
  }), [leaveData]);

  const exportToCSV = (data, filename) => {
    if (!data.length) return;
    const csvContent = "data:text/csv;charset=utf-8," + 
      Object.keys(data[0]).join(",") + "\n" +
      data.map(row => Object.values(row).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 space-y-10 animate-in fade-in duration-700">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
        <div className="z-10">
          <div className="flex items-center gap-4">
            <div className="w-2.5 h-10 bg-blue-600 rounded-full" />
            <h1 className="text-4xl font-black text-slate-800 tracking-tight uppercase italic">{activeTab === 'attendance-summary' ? 'Attendance Summary' : 'Leave Requests Hub'}</h1>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3 ml-6 italic">Verified staff presence & absence logs</p>
        </div>
        
        <div className="flex gap-3 z-10">
            <div className="bg-slate-50 p-1.5 rounded-2xl flex border border-slate-100 shadow-sm">
                <button 
                  onClick={() => setActiveTab('attendance-summary')}
                  className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'attendance-summary' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    Presence Report
                </button>
                <button 
                  onClick={() => setActiveTab('leave-management')}
                  className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'leave-management' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    Leave Hub
                </button>
            </div>
            <button
                onClick={fetchData}
                className="p-4 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-all hover:rotate-180 duration-500 shadow-sm"
            >
                <MdRefresh size={22} />
            </button>
        </div>
      </div>

      {/* Macro Stats Register */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Teachers', val: stats.totalStaff, icon: MdPeople, color: 'text-blue-600', bg: 'bg-blue-50/40' },
          { label: 'Present Today', val: stats.presentToday, icon: MdCalendarToday, color: 'text-emerald-600', bg: 'bg-emerald-50/40' },
          { label: 'Pending Leaves', val: stats.pendingLeaves, icon: MdAssignment, color: 'text-amber-500', bg: 'bg-amber-50/40' },
          { label: 'Avg Working Hours', val: `${stats.averageHours}h`, icon: FaUserClock, color: 'text-indigo-600', bg: 'bg-indigo-50/40' }
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative">
            <div className={`absolute top-0 right-0 p-8 ${s.color} opacity-5 group-hover:opacity-10 transition-opacity`}>
              <s.icon size={80} />
            </div>
            <div className="relative z-10">
              <div className={`w-14 h-14 ${s.bg} ${s.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                <s.icon size={28} />
              </div>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">#{s.label}</p>
              <p className={`text-4xl font-black ${s.color} tracking-tighter tabular-nums underline decoration-4 decoration-transparent group-hover:decoration-current transition-all duration-700`}>{s.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart Module */}
        <div className="bg-white rounded-[3.5rem] p-12 shadow-sm border border-slate-100">
           <div className="flex justify-between items-center mb-10">
              <div>
                 <h3 className="text-xl font-black text-slate-800 uppercase italic tracking-tight underline decoration-blue-200 decoration-8 underline-offset-4">Performance Insights</h3>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 italic">Faculty engagement metrics</p>
              </div>
              <button 
                onClick={() => exportToCSV(activeTab === 'attendance-summary' ? attendanceData : leaveData, 'report.csv')}
                className="p-4 bg-slate-50 text-slate-400 hover:bg-slate-800 hover:text-white rounded-2xl transition-all shadow-sm flex items-center gap-2"
              >
                 <MdFileDownload size={20} /> <span className="text-[8px] font-black uppercase tracking-widest">Download Data</span>
              </button>
           </div>
           <HighchartsReact highcharts={Highcharts} options={activeTab === 'attendance-summary' ? chartOptions : leaveChartOptions} />
        </div>

        {/* List Module */}
        <div className="bg-slate-800 rounded-[3.5rem] p-12 shadow-2xl text-white relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-emerald-500 to-amber-500" />
           <div className="flex justify-between items-center mb-10">
              <div>
                 <h3 className="text-xl font-black uppercase italic tracking-tight">Real-Time Records</h3>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 italic">Latest {activeTab === 'attendance-summary' ? 'Presence' : 'Leave'} events</p>
              </div>
              <div className="relative group">
                 <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                 <input 
                   placeholder="SEARCH..." 
                   className="bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 shadow-sm focus:bg-white/10 focus:border-blue-500 outline-none text-[10px] font-black w-40 transition-all uppercase tracking-widest"
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                 />
              </div>
           </div>

           <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {(activeTab === 'attendance-summary' ? attendanceData : leaveData).slice(0, 10).map((record, i) => (
                <div key={i} className="bg-white/5 border border-white/5 p-6 rounded-[2rem] hover:bg-white/10 transition-all flex items-center justify-between group">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-700 flex items-center justify-center font-black text-lg border border-white/10 overflow-hidden">
                        {(record.teacherName || record.staffName || 'U')[0]}
                      </div>
                      <div>
                         <p className="font-black text-xs uppercase tracking-tight">{record.teacherName || record.staffName || 'Unknown Staff'}</p>
                         <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">
                            {activeTab === 'attendance-summary' 
                              ? `${new Date(record.date).toLocaleDateString()} • In: ${record.checkIn}` 
                              : `${record.leaveType} • ${record.status}`}
                         </p>
                      </div>
                   </div>
                   <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      record.status === 'Present' || record.status === 'approved' 
                      ? 'bg-emerald-500/10 text-emerald-400' 
                      : record.status === 'Absent' || record.status === 'rejected'
                      ? 'bg-rose-500/10 text-rose-400'
                      : 'bg-amber-500/10 text-amber-400'
                   }`}>
                      {record.status}
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default StaffAttendance;