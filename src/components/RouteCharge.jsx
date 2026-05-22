import React, { useState, useEffect } from 'react';
import { MdPayments, MdSearch, MdTimeline, MdLocationSearching, MdCurrencyExchange, MdOutlinePayment } from 'react-icons/md';
import { transportAPI } from '../utils/apiService';
import { toast } from 'react-toastify';
import { FaSpinner, FaRupeeSign } from 'react-icons/fa';

export default function RouteCharges() {
  const [routeCharges, setRouteCharges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const res = await transportAPI.getRouteCharges();
      const mappedCharges = (res.data.charges || []).map(c => ({
        ...c,
        routeName: c.route?.routeName || c.routeName,
        status: c.status ? 'Active' : 'Inactive'
      }));
      setRouteCharges(mappedCharges);
    } catch (err) {
      toast.error('Fiscal records synchronization failure');
    } finally {
      setLoading(false);
    }
  };

  const filteredCharges = routeCharges.filter(c => 
    c.routeName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-900 to-slate-800 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full -mr-40 -mt-40 blur-3xl opacity-50" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-xl">
              <MdCurrencyExchange size={40} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black mb-2 tracking-tight">Tariff Records</h1>
              <p className="text-rose-200 font-medium text-lg">Detailed record of transit fiscal models, path-based tariffs, and operational charges</p>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center z-[100]">
          <FaSpinner className="animate-spin text-rose-600 text-5xl" />
        </div>
      )}

      {/* Fiscal Records Table */}
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-8 bg-slate-50/30">
          <div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Tariff Record Records</h3>
            <p className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-widest">Active path tariffs: {routeCharges.length} profiles</p>
          </div>
          
          <div className="relative w-full md:w-96 group">
            <MdSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors" size={24} />
            <input
              type="text"
              placeholder="Search Transit Identity..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-rose-500 font-bold text-slate-800 transition-all outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50/50">
                <th className="px-10 py-6 text-left">Transit identity</th>
                <th className="px-6 py-6">Fiscal Model</th>
                <th className="px-6 py-6">Standard Quantum</th>
                <th className="px-10 py-6 text-right font-bold">Protocol Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCharges.length > 0 ? filteredCharges.map((charge) => (
                <tr key={charge._id} className="hover:bg-rose-50/20 transition-all group">
                  <td className="px-10 py-8 text-left">
                    <div className="text-sm font-black text-slate-800 group-hover:text-rose-600 transition-colors">{charge.routeName}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Operational Channel</div>
                  </td>
                  <td className="px-6 py-8">
                     <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 rounded-lg text-xs font-black text-rose-700 border border-rose-100 uppercase tracking-widest">
                        <MdOutlinePayment size={14} /> Path-Based Tariff
                     </div>
                  </td>
                  <td className="px-6 py-8">
                    <div className="flex flex-col items-center gap-1">
                      <div className="text-lg font-black text-slate-800 flex items-center justify-center">
                        <FaRupeeSign className="text-slate-300 mr-1" size={14} /> {charge.monthlyCharge || '0'}
                      </div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Quantum / Period</span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex justify-end">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border ${
                        charge.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${charge.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                        {charge.status}
                      </span>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="px-10 py-32 text-center text-slate-300">
                     <MdCurrencyExchange size={80} className="mx-auto mb-6 opacity-20" />
                     <p className="text-[11px] font-black uppercase tracking-[0.2em]">Fiscal Records Purged</p>
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