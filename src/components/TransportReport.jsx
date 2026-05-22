import React, { useState, useEffect } from 'react';
import { FaBus, FaUserTie, FaMapMarkedAlt, FaUsers, FaChartBar, FaRoute, FaShieldAlt, FaSpinner, FaHistory } from 'react-icons/fa';
import { MdDirectionsBus, MdPerson, MdMap, MdPlace, MdPayments, MdManageAccounts, MdTimeline, MdSearch } from 'react-icons/md';
import { transportAPI } from '../utils/apiService';
import { toast } from 'react-toastify';

export default function TransportReport() {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [selectedReport, setSelectedReport] = useState('summary');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const [vRes, dRes, rRes, asRes, alRes] = await Promise.all([
        transportAPI.getVehicles(),
        transportAPI.getDrivers(),
        transportAPI.getRoutes(),
        transportAPI.getAssignments(),
        transportAPI.getAllocations()
      ]);

      const mappedVehicles = (vRes.data.vehicles || []).map(v => ({
        ...v,
        vehicleNumber: v.vehicleNo,
        rcNumber: v.rcNo,
        seatingCapacity: v.vehicleCapacity,
        status: v.status ? 'Active' : 'Maintenance'
      }));

      const driversData = dRes.data?.data?.drivers || dRes.data?.drivers || [];
      const mappedDrivers = driversData.map(d => ({
        ...d,
        driverName: d.name,
        mobileNumber: d.mobileNo,
        licenseNumber: d.licenseNo,
        status: d.status ? 'Active' : 'Inactive'
      }));

      const mappedRoutes = (rRes.data.routes || []).map(r => ({
        ...r,
        status: r.status ? 'Active' : 'Inactive'
      }));

      const mappedAssignments = (asRes.data.assignments || []).map(a => ({
        ...a,
        vehicleNumber: (typeof a.vehicle === 'object' ? a.vehicle?.vehicleNo : a.vehicle) || 'N/A',
        driverName: (typeof a.driver === 'object' ? a.driver?.name : a.driver) || 'N/A',
        routeName: (typeof a.route === 'object' ? a.route?.routeName : a.route) || 'N/A',
        status: a.status ? 'Active' : 'Inactive'
      }));

      const mappedAllocations = (alRes.data.allocations || []).map(a => ({
        ...a,
        studentName: a.studentStaffName || a.userName || a.studentName || 'N/A',
        routeName: a.routeName || a.route || 'Unassigned',
        stopName: a.stopName || a.stop || a.routeStop || 'N/A',
        vehicleNumber: a.vehicleNumber || a.vehicle || 'N/A',
        monthlyCharge: a.monthlyCharge || a.monthlyCharges || 0,
        status: (a.status === true || a.status === 'Active') ? 'Active' : 'Inactive'
      }));

      setVehicles(mappedVehicles);
      setDrivers(mappedDrivers);
      setRoutes(mappedRoutes);
      setAssignments(mappedAssignments);
      setAllocations(mappedAllocations);
    } catch (err) {
      toast.error('Logistics metric aggregation failure');
    } finally {
      setLoading(false);
    }
  };

  // Summary Metrics
  const getSummary = () => {
    return {
      totalVehicles: vehicles.length,
      activeDrivers: drivers.length,
      totalRoutes: routes.length,
      totalAllocations: allocations.length,
      occupancy: allocations.length > 0 ? (allocations.length / (vehicles.length * 40) * 100).toFixed(1) : 0 // Assumption 40 seats/bus
    };
  };

  const renderReport = () => {
    switch (selectedReport) {
      case 'summary':
        const summary = getSummary();
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden group">
               <FaBus className="absolute -right-4 -bottom-4 text-white/10 text-8xl group-hover:scale-110 transition-transform" />
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-80">Fleet Magnitude</h3>
               <p className="text-4xl font-black mb-1">{summary.totalVehicles}</p>
               <p className="text-xs font-bold opacity-60 uppercase">Operational Units</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden group">
               <FaUserTie className="absolute -right-4 -bottom-4 text-white/10 text-8xl group-hover:scale-110 transition-transform" />
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-80">Personnel Matrix</h3>
               <p className="text-4xl font-black mb-1">{summary.activeDrivers}</p>
               <p className="text-xs font-bold opacity-60 uppercase">Active Operators</p>
            </div>
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden group">
               <FaMapMarkedAlt className="absolute -right-4 -bottom-4 text-white/10 text-8xl group-hover:scale-110 transition-transform" />
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-80">Transit Channels</h3>
               <p className="text-4xl font-black mb-1">{summary.totalRoutes}</p>
               <p className="text-xs font-bold opacity-60 uppercase">Optimized Paths</p>
            </div>
            <div className="bg-gradient-to-br from-rose-600 to-pink-700 p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden group">
               <FaUsers className="absolute -right-4 -bottom-4 text-white/10 text-8xl group-hover:scale-110 transition-transform" />
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-80">Privilege Loading</h3>
               <p className="text-4xl font-black mb-1">{summary.totalAllocations}</p>
               <p className="text-xs font-bold opacity-60 uppercase">Student Enrolled (Est. {summary.occupancy}% Cap)</p>
            </div>
          </div>
        );

      case 'vehicles':
        return (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-center">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="px-10 py-6 text-left">Fleet Identity</th>
                    <th className="px-6 py-6">Model/Type</th>
                    <th className="px-6 py-6">Operator Node</th>
                    <th className="px-6 py-6">Protocol Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {vehicles.map((v) => {
                    const assignment = assignments.find(a => a.vehicleNumber === v.vehicleNumber);
                    return (
                      <tr key={v._id} className="hover:bg-blue-50/20 transition-all group">
                        <td className="px-10 py-8 text-left">
                           <div className="text-sm font-black text-slate-800">{v.vehicleNumber}</div>
                           <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">RC: {v.rcNo || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-8">
                           <div className="text-sm font-bold text-slate-600 uppercase tracking-tighter">{v.fuelType || 'N/A'} Propulsion</div>
                           <div className="text-[10px] text-slate-400 font-black uppercase">{v.vehicleType}</div>
                        </td>
                        <td className="px-6 py-8">
                           <div className="font-bold text-slate-800">{assignment ? assignment.driverName : 'Unassigned'}</div>
                           <div className="text-[10px] text-slate-400 uppercase">Personnel Mapping</div>
                        </td>
                        <td className="px-6 py-8">
                           <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                             v.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'
                           }`}>
                             {v.status}
                           </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'routes':
        return (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-center">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="px-10 py-6 text-left">Transit Channel</th>
                    <th className="px-6 py-6">Code Identity</th>
                    <th className="px-6 py-6">Student Load</th>
                    <th className="px-6 py-6 text-right font-bold">Protocol</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {routes.map((r) => {
                    const routeAllocations = allocations.filter(a => a.routeName === r.routeName).length;
                    return (
                      <tr key={r._id} className="hover:bg-purple-50/20 transition-all group">
                        <td className="px-10 py-8 text-left">
                           <div className="text-sm font-black text-slate-800 group-hover:text-purple-600 transition-colors">{r.routeName}</div>
                           <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Operational Path</div>
                        </td>
                        <td className="px-6 py-8 font-mono font-bold text-slate-500 uppercase">{r.routeCode || 'N/A'}</td>
                        <td className="px-6 py-8 font-black text-slate-800">{routeAllocations} Enrollments</td>
                        <td className="px-10 py-8 text-right">
                           <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                             r.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'
                           }`}>
                             {r.status}
                           </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'students':
        const filtered = allocations.filter(a => 
           (a.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
            a.routeName?.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        return (
          <div className="space-y-6">
            <div className="relative w-full md:w-96 group">
               <MdSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors" size={24} />
               <input
                 type="text"
                 placeholder="Filter student record..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-16 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-rose-500 font-bold text-slate-800 transition-all outline-none"
               />
            </div>
            <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-center">
                  <thead>
                    <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <th className="px-10 py-6 text-left">Recipient Identity</th>
                      <th className="px-6 py-6 font-bold">Transit path</th>
                      <th className="px-6 py-6 font-bold">Fleet Node</th>
                      <th className="px-10 py-6 text-right font-bold">Fiscal Quantum</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map((a) => (
                      <tr key={a._id} className="hover:bg-rose-50/20 transition-all group">
                        <td className="px-10 py-8 text-left">
                           <div className="text-sm font-black text-slate-800 group-hover:text-rose-600 transition-colors">{a.studentName}</div>
                           <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{a.userType || 'Student'} Records</div>
                        </td>
                        <td className="px-6 py-8">
                           <div className="text-sm font-bold text-slate-600 font-black">{a.routeName}</div>
                           <div className="text-[10px] text-slate-400 uppercase font-bold mt-1">Stop: {a.stopName}</div>
                        </td>
                        <td className="px-6 py-8 font-black text-slate-500">{a.vehicleNumber}</td>
                        <td className="px-10 py-8 text-right font-black text-emerald-600">₹{parseInt(a.monthlyCharge || 0).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full -mr-48 -mt-48 blur-3xl opacity-50" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl transform hover:rotate-6 transition-transform">
              <FaChartBar className="text-blue-400 text-3xl" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight mb-2 uppercase tracking-tighter">Logistics Intelligence</h1>
              <p className="text-blue-200/80 text-lg font-medium">Aggregated record report of school transit operations and personnel mapping</p>
            </div>
          </div>
          <button 
            onClick={() => fetchReportData()}
            className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/20 transition-all flex items-center gap-3"
          >
            <MdTimeline size={18} />
            Sync Metrics
          </button>
        </div>
      </div>

      {/* Report Categories */}
      <div className="flex flex-wrap gap-4">
        {[
          { id: 'summary', label: 'Overall Summary', icon: FaChartBar, color: 'blue' },
          { id: 'vehicles', label: 'Fleet Record', icon: FaBus, color: 'emerald' },
          { id: 'routes', label: 'Transit Channels', icon: FaRoute, color: 'purple' },
          { id: 'students', label: 'Student Loading', icon: FaUsers, color: 'rose' }
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedReport(cat.id)}
            className={`px-8 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-3 border shadow-sm ${
              selectedReport === cat.id 
                ? `bg-slate-900 text-white border-slate-900 shadow-xl scale-105` 
                : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300 hover:text-slate-600'
            }`}
          >
            <cat.icon size={16} />
            {cat.label}
          </button>
        ))}
      </div>

      {/* Report View Panel */}
      <div className="animate-fadeIn">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6 bg-white/50 rounded-[2.5rem] border border-dashed border-slate-200">
             <FaSpinner className="animate-spin text-blue-600 text-5xl" />
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Synthesizing Logistics Analytics Records...</p>
          </div>
        ) : renderReport()}
      </div>
    </div>
  );
}
