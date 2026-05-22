import React, { useState, useEffect } from 'react';
import { FaBus, FaUserTie, FaMapMarkedAlt, FaBusAlt, FaMoneyBillWave, FaCog, FaUsers, FaSpinner, FaRoute, FaShieldAlt, FaHistory } from 'react-icons/fa';
import { MdDirectionsBus, MdPerson, MdMap, MdPlace, MdPayments, MdSettings, MdGroups, MdTimeline } from 'react-icons/md';
import api from '../utils/api';
import { toast } from 'react-toastify';

export default function TransportDashboard() {
  const [stats, setStats] = useState({
    totalVehicles: 0,
    activeDrivers: 0,
    totalRoutes: 0,
    totalAllocations: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/staff-panel/transport/dashboard');
      setStats({
        totalVehicles: data.stats.totalVehicles || 0,
        activeDrivers: data.stats.activeDrivers || 0,
        totalRoutes: data.stats.totalRoutes || 0,
        totalAllocations: data.stats.totalAllocations || 0
      });
    } catch (err) {
      console.error('Transport stats error:', err);
      toast.error('Logistics analytics synchronization failure');
    } finally {
      setLoading(false);
    }
  };

  const modules = [
    { title: 'Vehicle Master', desc: 'Sync fleet inventory', icon: MdDirectionsBus, color: 'blue', link: '/transport/vehicles' },
    { title: 'Driver Master', desc: 'Manage operational staff', icon: MdPerson, color: 'emerald', link: '/transport/drivers' },
    { title: 'Route Master', desc: 'Optimize transit paths', icon: MdMap, color: 'purple', link: '/transport/routes' },
    { title: 'Route Stops', desc: 'Record transit nodes', icon: MdPlace, color: 'orange', link: '/transport/route-stops' },
    { title: 'Route Charges', desc: 'Fiscal transit setup', icon: MdPayments, color: 'indigo', link: '/transport/route-charges' },
    { title: 'Assignment', desc: 'Vehicle-Driver mapping', icon: MdSettings, color: 'teal', link: '/transport/assignments' },
    { title: 'Allocation', desc: 'Student residency mapping', icon: MdGroups, color: 'rose', link: '/transport/allocations' }
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <FaSpinner className="animate-spin text-blue-600 text-5xl" />
        <p className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-400">Synchronizing Logistics Matrix...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl">
              <FaBus className="text-blue-400 text-3xl" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight mb-2">Transport Matrix</h1>
              <p className="text-blue-200/80 text-lg font-medium">Detailed record of fleet logistics, transit routes, and student allocation metrics</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={() => fetchStats()} className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/20 transition-all">
              Reload Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Fleet Inventory', value: stats.totalVehicles, icon: FaBus, color: 'from-blue-600 to-blue-700', bg: 'bg-blue-50', suffix: 'Vehicles' },
          { label: 'Active Personnel', value: stats.activeDrivers, icon: FaUserTie, color: 'from-emerald-600 to-teal-700', bg: 'bg-emerald-50', suffix: 'Drivers' },
          { label: 'Transit Routes', value: stats.totalRoutes, icon: FaMapMarkedAlt, color: 'from-purple-600 to-indigo-700', bg: 'bg-purple-50', suffix: 'Routes' },
          { label: 'Student Matrix', value: stats.totalAllocations, icon: FaUsers, color: 'from-orange-500 to-rose-600', bg: 'bg-orange-50', suffix: 'Enroll' }
        ].map((card, idx) => (
          <div key={idx} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
            <div className={`absolute top-0 right-0 w-24 h-24 ${card.bg} rounded-full -mr-12 -mt-12 opacity-50 group-hover:scale-150 transition-transform duration-500`} />
            <div className="relative z-10">
              <div className={`w-14 h-14 bg-gradient-to-br ${card.color} rounded-2xl flex items-center justify-center text-white shadow-xl mb-6 group-hover:rotate-6 transition-transform`}>
                <card.icon size={26} />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{card.label}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-black text-slate-800 tabular-nums">{card.value}</p>
                <p className="text-xs font-bold text-slate-400 uppercase">{card.suffix}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Logistics Modules Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                <div className="w-2 h-8 bg-blue-500 rounded-full" /> Logistics Matrix Navigator
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {modules.map((mod, idx) => (
                <div key={idx} className="group p-6 bg-slate-50/50 hover:bg-white rounded-[2rem] border border-transparent hover:border-blue-100 hover:shadow-xl transition-all flex items-center gap-6 cursor-pointer">
                  <div className={`w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-${mod.color}-500 group-hover:bg-blue-600 group-hover:text-white transition-all`}>
                    <mod.icon size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-slate-800 text-sm">{mod.title}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{mod.desc}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <FaRoute size={12} className="text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white flex items-center justify-between shadow-2xl shadow-blue-200 overflow-hidden relative">
             <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
             <div className="relative z-10 flex items-center gap-6">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                  <FaShieldAlt size={28} />
                </div>
                <div>
                  <h4 className="text-2xl font-black tracking-tight">Fleet Security & Compliance</h4>
                  <p className="text-blue-100/80 font-medium">Verify insurance records and vehicle fitness certification audits</p>
                </div>
             </div>
             <button className="relative z-10 px-8 py-4 bg-white text-blue-700 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-50 transition-all">
                Audit Compliance
             </button>
          </div>
        </div>

        {/* Operational Insight Stream */}
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm self-start">
          <h3 className="text-xl font-black text-slate-800 tracking-tight mb-8 flex items-center gap-3">
             <MdTimeline className="text-blue-500" size={24} /> Logistics Stream
          </h3>
          <div className="space-y-8 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
            {[
              { type: 'Assignment', detail: 'Bus-08 Manifested to RT-12', time: '14:20 PM', icon: FaCog },
              { type: 'Maintenance', detail: 'Bus-02 Protocol initiated', time: '12:15 PM', icon: FaBus },
              { type: 'Allocation', detail: '12 New students mapped to RT-05', time: '09:45 AM', icon: FaUsers },
              { type: 'Fleet Audit', detail: 'Compliance records updated', time: 'Yesterday', icon: FaShieldAlt }
            ].map((item, i) => (
              <div key={i} className="relative pl-12 group">
                <div className="absolute left-0 top-0 w-8 h-8 bg-white border-2 border-slate-100 rounded-full flex items-center justify-center z-10 group-hover:border-blue-500 group-hover:text-blue-500 transition-colors">
                  <item.icon size={12} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{item.type}</p>
                  <p className="font-bold text-slate-800 leading-tight">{item.detail}</p>
                  <div className="flex items-center gap-2 mt-2 opacity-60">
                    <FaHistory size={10} className="text-slate-400" />
                    <span className="text-[9px] font-black uppercase tracking-tighter">{item.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-10 py-5 bg-slate-50 border border-slate-100 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-50 hover:text-blue-500 hover:border-blue-100 transition-all">
             View Full Operational Log
          </button>
        </div>
      </div>
    </div>
  );
}