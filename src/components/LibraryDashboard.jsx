import React, { useState, useEffect } from 'react';
import { MdBook, MdPeople, MdCheckCircle, MdWarning, MdTrendingUp, MdAccessTime, MdMonetizationOn, MdRefresh } from 'react-icons/md';
import { libraryAPI } from '../utils/apiService';
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';

const LibraryDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    fetchDashboardData();
    return () => clearInterval(timer);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Use staff-panel library dashboard endpoint
      const res = await libraryAPI.getDashboard();
      
      if (res.data?.success && res.data?.data) {
        const stats = res.data.data;
        const dashboardStats = {
          books: { 
            total: stats.totalBooks || 0, 
            totalCopies: stats.availableBooks || 0 
          },
          members: stats.totalMembers || 0,
          students: stats.totalStudents || 0,
          issues: { 
            issued: stats.issuedBooks || 0, 
            returned: 0, 
            overdue: stats.overdueBooks || 0, 
            totalFine: stats.fineCollected || 0 
          },
          recentIssues: stats.recentIssues || []
        };
        setDashboardData(dashboardStats);
      } else {
        // Set empty data if no response
        setDashboardData({
          books: { total: 0, totalCopies: 0 },
          members: 0,
          students: 0,
          issues: { issued: 0, returned: 0, overdue: 0, totalFine: 0 },
          recentIssues: []
        });
      }
    } catch (err) {
      console.error('Library dashboard error:', err);
      toast.error('Failed to fetch library dashboard data');
      // Set empty data instead of showing error
      setDashboardData({
        books: { total: 0, totalCopies: 0 },
        members: 0,
        students: 0,
        issues: { issued: 0, returned: 0, overdue: 0, totalFine: 0 },
        recentIssues: []
      });
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { 
      title: 'Total Books', 
      value: dashboardData?.books?.totalCopies || 0, 
      icon: MdBook, 
      color: 'bg-indigo-600', 
      detail: `${dashboardData?.books?.total || 0} different titles` 
    },
    { 
      title: 'Registered Members', 
      value: dashboardData?.members || 0, 
      icon: MdPeople, 
      color: 'bg-emerald-600', 
      detail: `${dashboardData?.students || 0} members enrolled` 
    },
    { 
      title: 'Books Issued', 
      value: dashboardData?.issues?.issued || 0, 
      icon: MdCheckCircle, 
      color: 'bg-blue-600', 
      detail: `${dashboardData?.issues?.returned || 0} books returned` 
    },
    { 
      title: 'Overdue Returns', 
      value: dashboardData?.issues?.overdue || 0, 
      icon: MdWarning, 
      color: 'bg-rose-600', 
      detail: 'Books to be returned' 
    },
  ];

  return (
    <div className="space-y-10 bg-slate-50/20 p-2 min-h-screen animate-fadeIn">
      {loading && (
        <div className="fixed inset-0 bg-white/60 flex items-center justify-center z-[70] backdrop-blur-[2px]">
           <FaSpinner className="animate-spin text-indigo-600 text-5xl" />
        </div>
      )}

      {/* Luxury Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 gap-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 opacity-50 group-hover:scale-110 transition-transform duration-700"></div>
        <div className="relative">
          <h1 className="text-4xl font-black text-slate-800 tracking-tighter uppercase italic underline decoration-indigo-600 underline-offset-8 decoration-4">School Library</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-3">Library Overview & Book Tracking</p>
        </div>
        <div className="flex items-center gap-4 relative">
             <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Local Time</p>
                <p className="text-lg font-black text-indigo-600 tabular-nums">{currentTime.toLocaleTimeString()}</p>
             </div>
             <button onClick={fetchDashboardData} className="p-4 bg-slate-50 hover:bg-black hover:text-white rounded-2xl transition-all shadow-sm">
                <MdRefresh size={24} />
            </button>
        </div>
      </div>

      {/* Modern Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group overflow-hidden relative">
            <div className={`absolute -right-4 -bottom-4 opacity-5 group-hover:scale-150 transition-transform duration-700 text-slate-800`}>
                <stat.icon size={120} />
            </div>
            <div className="flex items-center gap-6 relative z-10">
              <div className={`${stat.color} p-4 rounded-2xl text-white shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                <stat.icon size={26} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.title}</p>
                <p className="text-3xl font-black text-slate-800 tabular-nums italic tracking-tighter">{stat.value}</p>
              </div>
            </div>
            <div className="mt-8 flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest border-t border-slate-50 pt-4">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300" /> {stat.detail}
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Pulse */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Deployments */}
        <div className="lg:col-span-2 bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden min-h-[500px]">
          <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-800 tracking-tighter uppercase italic flex items-center gap-4">
              <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
              Recently Issued Books
            </h2>
            <MdAccessTime size={24} className="text-slate-300" />
          </div>
          <div className="divide-y divide-slate-50">
            {dashboardData?.recentIssues?.length > 0 ? dashboardData.recentIssues.map((issue, idx) => (
              <div key={idx} className="px-10 py-6 hover:bg-slate-50/50 transition-all group items-center flex justify-between">
                <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        <MdBook size={24} />
                    </div>
                    <div>
                        <div className="text-sm font-black text-slate-800 tracking-tight">{issue.book?.title}</div>
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">{issue.member?.name} • {issue.member?.memberId}</div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-[10px] font-black text-slate-800 uppercase tracking-tighter">
                        {new Date(issue.issueDate).toLocaleDateString()}
                    </div>
                    <div className={`text-[8px] font-black uppercase tracking-widest mt-1 ${issue.status === 'overdue' ? 'text-rose-500' : 'text-emerald-500'}`}>
                        {issue.status}
                    </div>
                </div>
              </div>
            )) : (
              <div className="py-20 text-center opacity-10">
                <MdRefresh size={60} className="mx-auto mb-4" />
                <p className="text-[10px] font-black uppercase tracking-[0.5em]">No recently issued books</p>
              </div>
            )}
          </div>
        </div>

        {/* Efficiency Matrix */}
        <div className="bg-slate-800 rounded-[3rem] p-10 text-white relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity">
                <MdTrendingUp size={150} />
             </div>
             <h3 className="text-xl font-black tracking-tighter uppercase italic mb-10 flex items-center gap-3">
                <div className="w-2 h-6 bg-indigo-500 rounded-full" />
                Library Performance
             </h3>
             <div className="space-y-10">
                <div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-slate-400">
                        <span>Book Inventory</span>
                        <span>98%</span>
                    </div>
                    <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full w-[98%] rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                    </div>
                </div>
                <div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-slate-400">
                        <span>Member Activity</span>
                        <span>85%</span>
                    </div>
                    <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full w-[85%] rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                    </div>
                </div>
                <div>
                     <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-slate-400">
                        <span>Timely Returns</span>
                        <span>92%</span>
                    </div>
                    <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full w-[92%] rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
                    </div>
                </div>
             </div>
             
             <div className="mt-16 pt-10 border-t border-slate-700/50">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                        <MdMonetizationOn size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fine Revenue</p>
                        <p className="text-2xl font-black tracking-tighter italic text-white">₹{dashboardData?.issues?.totalFine || 0}</p>
                    </div>
                </div>
             </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryDashboard;
