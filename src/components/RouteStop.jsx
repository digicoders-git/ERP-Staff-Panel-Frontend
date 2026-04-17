import React, { useState, useEffect } from 'react';
import { MdLocationOn, MdSearch, MdFormatListNumbered, MdTimeline, MdAccessTime } from 'react-icons/md';
import { transportAPI } from '../utils/apiService';
import { toast } from 'react-toastify';
import { FaSpinner, FaRoute } from 'react-icons/fa';

export default function RouteStops() {
  const [routeStops, setRouteStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const res = await transportAPI.getRouteStops();
      const mappedStops = (res.data.stops || []).map(s => ({
        ...s,
        routeName: s.route?.routeName || s.routeName,
        status: s.status ? 'Active' : 'Inactive'
      }));
      setRouteStops(mappedStops);
    } catch (err) {
      toast.error('Logistics registry synchronization failure');
    } finally {
      setLoading(false);
    }
  };

  const filteredStops = routeStops.filter(s => 
    s.routeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.stopName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full -mr-40 -mt-40 blur-3xl opacity-50" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-xl">
              <MdLocationOn size={40} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black mb-2 tracking-tight">Node Manifest</h1>
              <p className="text-blue-200 font-medium text-lg">Detailed sequence of path nodes, transit intervals, and arrival-departure protocols</p>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center z-[100]">
          <FaSpinner className="animate-spin text-blue-600 text-5xl" />
        </div>
      )}

      {/* Registry Manifest Dual View */}
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-8 bg-slate-50/30">
          <div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Node Matrix Registry</h3>
            <p className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-widest">Active nodes Manifested: {routeStops.length} nodes</p>
          </div>
          
          <div className="flex items-center gap-6 w-full md:w-auto">
            <div className="relative w-full md:w-80 group">
              <MdSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={24} />
              <input
                type="text"
                placeholder="Search Node Identity..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-800 transition-all outline-none"
              />
            </div>
            <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
              <button 
                onClick={() => setViewMode('table')}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'table' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <MdFormatListNumbered size={22} />
              </button>
              <button 
                onClick={() => setViewMode('card')}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'card' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <MdTimeline size={22} />
              </button>
            </div>
          </div>
        </div>

        {viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-center">
              <thead>
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50/50">
                  <th className="px-10 py-6 text-left">Transit Channel</th>
                  <th className="px-6 py-6">Node identity</th>
                  <th className="px-6 py-6">Path Index</th>
                  <th className="px-6 py-6">Transit Intervals</th>
                  <th className="px-10 py-6 text-right font-bold">Protocol Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStops.length > 0 ? filteredStops.map((stop) => (
                  <tr key={stop._id} className="hover:bg-blue-50/20 transition-all group">
                    <td className="px-10 py-8 text-left">
                      <div className="text-sm font-black text-slate-800 group-hover:text-blue-600 transition-colors">{stop.routeName}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Operational Channel</div>
                    </td>
                    <td className="px-6 py-8">
                       <span className="text-sm font-black text-slate-700">{stop.stopName}</span>
                    </td>
                    <td className="px-6 py-8">
                       <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mx-auto text-xs font-black text-slate-500 border border-slate-200 uppercase tracking-widest">
                        #{stop.stopOrder}
                      </div>
                    </td>
                    <td className="px-6 py-8">
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-2 text-emerald-600 text-[11px] font-black">
                           <MdAccessTime size={14} /> ↑ {stop.pickupTime || '--:--'}
                        </div>
                        <div className="flex items-center gap-2 text-rose-500 text-[11px] font-black">
                           <MdAccessTime size={14} /> ↓ {stop.dropTime || '--:--'}
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex justify-end">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border ${
                          stop.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${stop.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                          {stop.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-10 py-32 text-center text-slate-300">
                       <MdLocationOn size={80} className="mx-auto mb-6 opacity-20" />
                       <p className="text-[11px] font-black uppercase tracking-[0.2em]">Node Registry Purged</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 space-y-10">
             {Object.entries(
                filteredStops.reduce((acc, stop) => {
                  if (!acc[stop.routeName]) acc[stop.routeName] = [];
                  acc[stop.routeName].push(stop);
                  return acc;
                }, {})
             ).map(([routeName, stops]) => (
                <div key={routeName} className="bg-slate-50/50 rounded-[3rem] p-10 border border-slate-100 overflow-hidden relative group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-blue-500/10 transition-colors duration-700" />
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-10">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                          <FaRoute size={24} />
                        </div>
                        <div>
                          <h4 className="text-2xl font-black text-slate-800 tracking-tight">{routeName}</h4>
                          <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mt-1">{stops.length} ACTIVE PATH NODES</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-6">
                      {stops.sort((a,b) => a.stopOrder - b.stopOrder).map((stop, idx, arr) => (
                        <div key={stop._id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm min-w-[280px] flex-1 hover:shadow-xl hover:border-blue-100 transition-all relative">
                          <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-black text-xs">
                              #{stop.stopOrder}
                            </div>
                          </div>
                          
                          <h5 className="text-lg font-black text-slate-800 mb-4">{stop.stopName}</h5>
                          
                          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                             <div className="space-y-1">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pickup</p>
                                <p className="text-[12px] font-black text-emerald-600">{stop.pickupTime || '--:--'}</p>
                             </div>
                             <div className="space-y-1 text-right">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Drop</p>
                                <p className="text-[12px] font-black text-rose-500">{stop.dropTime || '--:--'}</p>
                             </div>
                          </div>

                          {idx < arr.length - 1 && (
                            <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-20">
                               <div className="w-8 border-t-2 border-dashed border-slate-200" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
}