import React, { useState, useEffect } from 'react';
import { MdAssignmentInd, MdSearch } from 'react-icons/md';
import { transportAPI } from '../utils/apiService';
import { toast } from 'react-toastify';
import { FaSpinner, FaBus } from 'react-icons/fa';
import { MdPerson, MdMap } from 'react-icons/md';

export default function TransportAssignment() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const res = await transportAPI.getAssignments();
      const mappedAssignments = (res.data.assignments || []).map(a => ({
        ...a,
        vehicleNumber: (typeof a.vehicle === 'object' ? a.vehicle?.vehicleNo : a.vehicle) || 'N/A',
        driverName: (typeof a.driver === 'object' ? a.driver?.name : a.driver) || 'N/A',
        routeName: (typeof a.route === 'object' ? a.route?.routeName : a.route) || 'N/A',
        status: a.status ? 'Active' : 'Inactive'
      }));
      setAssignments(mappedAssignments);
    } catch (err) {
      toast.error('Resource mapping synchronization failure');
    } finally {
      setLoading(false);
    }
  };

  const filteredAssignments = assignments.filter(a => 
    a.vehicleNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.driverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.routeName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-slate-900 via-violet-900 to-slate-800 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/10 rounded-full -mr-40 -mt-40 blur-3xl opacity-50" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-xl">
              <MdAssignmentInd size={40} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black mb-2 tracking-tight">Resource Matrix</h1>
              <p className="text-violet-200 font-medium text-lg">Integrated manifest of Vehicle-Driver-Route assignments and operational mapping</p>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center z-[100]">
          <FaSpinner className="animate-spin text-violet-600 text-5xl" />
        </div>
      )}

      {/* Resource Registry Table */}
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-8 bg-slate-50/30">
          <div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Resource Assignment Registry</h3>
            <p className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-widest">Active assignments: {assignments.length} Mappings</p>
          </div>
          
          <div className="relative w-full md:w-96 group">
            <MdSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={24} />
            <input
              type="text"
              placeholder="Search Resource identity..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-violet-500 font-bold text-slate-800 transition-all outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50/50">
                <th className="px-10 py-6 text-left">Fleet Node</th>
                <th className="px-6 py-6 text-left">Personnel Node</th>
                <th className="px-6 py-6 text-left">Transit node</th>
                <th className="px-10 py-6 text-right font-bold">Protocol Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAssignments.length > 0 ? filteredAssignments.map((assignment) => (
                <tr key={assignment._id} className="hover:bg-violet-50/20 transition-all group">
                  <td className="px-10 py-8 text-left">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-violet-100 group-hover:text-violet-600 transition-colors">
                        <FaBus />
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-800 group-hover:text-violet-600 transition-colors">{assignment.vehicleNumber}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Fleet Identity</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-8 text-left">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                        <MdPerson size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-800">{assignment.driverName}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Operator Manifest</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-8 text-left">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                        <MdMap size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-800">{assignment.routeName}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Transit path</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex justify-end">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border ${
                        assignment.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${assignment.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                        {assignment.status}
                      </span>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="px-10 py-32 text-center text-slate-300">
                     <MdAssignmentInd size={80} className="mx-auto mb-6 opacity-20" />
                     <p className="text-[11px] font-black uppercase tracking-[0.2em]">Resource Registry Purged</p>
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