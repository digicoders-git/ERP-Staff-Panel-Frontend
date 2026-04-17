import React, { useState, useEffect } from 'react';
import { MdManageAccounts, MdSearch } from 'react-icons/md';
import { transportAPI } from '../utils/apiService';
import { toast } from 'react-toastify';
import { FaSpinner, FaUserGraduate, FaUserTie } from 'react-icons/fa';
import { MdTimeline, MdLocationSearching } from 'react-icons/md';

export default function TransportAllocation() {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const res = await transportAPI.getAllocations();
      setAllocations(res.data.transportAllocations || res.data.allocations || []);
    } catch (err) {
      toast.error('Personnel logistics registry synchronization failure');
    } finally {
      setLoading(false);
    }
  };

  const filteredAllocations = allocations.filter(a => 
    a.studentStaffName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.studentId?.toString().includes(searchTerm.toLowerCase()) ||
    a.routeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.route?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-900 to-slate-800 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full -mr-40 -mt-40 blur-3xl opacity-50" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-xl">
              <MdManageAccounts size={40} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black mb-2 tracking-tight">Privilege Registry</h1>
              <p className="text-emerald-200 font-medium text-lg">Integrated manifest of student service allocations, transit privileges, and fiscal mapping</p>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center z-[100]">
          <FaSpinner className="animate-spin text-emerald-600 text-5xl" />
        </div>
      )}

      {/* Allocation Registry Table */}
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-8 bg-slate-50/30">
          <div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Privilege Manifest Registry</h3>
            <p className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-widest">Active unit Privileges: {allocations.length} Allocations</p>
          </div>
          
          <div className="relative w-full md:w-96 group">
            <MdSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={24} />
            <input
              type="text"
              placeholder="Search Privilege identity..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 font-bold text-slate-800 transition-all outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50/50">
                <th className="px-10 py-6 text-left">Recipient node</th>
                <th className="px-6 py-6 text-left">Transit Node</th>
                <th className="px-6 py-6">Fiscal Node</th>
                <th className="px-10 py-6 text-right font-bold">Protocol Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAllocations.length > 0 ? filteredAllocations.map((allocation) => (
                <tr key={allocation._id} className="hover:bg-rose-50/20 transition-all group">
                  <td className="px-10 py-8 text-left">
                    <div className="flex items-center gap-4">
                       <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${
                         allocation.userType === 'Student' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                       }`}>
                         {allocation.userType === 'Student' ? <FaUserGraduate size={20}/> : <FaUserTie size={20}/>}
                       </div>
                       <div>
                         <div className="text-sm font-black text-slate-800 group-hover:text-rose-600 transition-colors">{allocation.studentStaffName}</div>
                         <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{allocation.userType} Profile</div>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-8 text-left">
                    <div className="flex flex-col gap-1.5 ">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-600 border border-slate-200 uppercase tracking-widest group-hover:border-rose-200 group-hover:bg-rose-50">
                        <MdTimeline className="text-slate-400 group-hover:text-rose-50" /> {allocation.routeName || allocation.route}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-1">
                        <MdLocationSearching size={12}/> NODE: {allocation.stopName || allocation.stop}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-8">
                     <div className="flex flex-col items-center gap-1">
                        <span className="text-sm font-black text-slate-700">{allocation.vehicleNumber || (typeof allocation.vehicle === 'string' ? allocation.vehicle : 'N/A')}</span>
                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-tighter">{allocation.pickupDrop}</p>
                        <div className="text-emerald-600 font-black mt-1">₹{parseInt(allocation.monthlyCharge || 0).toLocaleString()}</div>
                     </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex justify-end">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border ${
                        allocation.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        'bg-rose-50 text-rose-700 border-rose-100'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${allocation.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                        {allocation.status}
                      </span>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="px-10 py-32 text-center text-slate-300">
                    <MdManageAccounts size={80} className="mx-auto mb-6 opacity-20" />
                    <p className="text-[11px] font-black uppercase tracking-[0.2em]">Service Registry Purged</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}