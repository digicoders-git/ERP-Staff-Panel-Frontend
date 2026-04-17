import React, { useState, useEffect } from 'react';
import { MdMap, MdSearch, MdFormatListBulleted, MdGridView } from 'react-icons/md';
import { transportAPI } from '../utils/apiService';
import { toast } from 'react-toastify';
import { FaSpinner, FaRoute } from 'react-icons/fa';

export default function RouteMaster() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const res = await transportAPI.getRoutes();
      const mappedRoutes = (res.data.routes || []).map(r => ({
        ...r,
        status: r.status ? 'Active' : 'Inactive'
      }));
      setRoutes(mappedRoutes);
    } catch (err) {
      toast.error('Transit registry synchronization failure');
    } finally {
      setLoading(false);
    }
  };

  const filteredRoutes = routes.filter(r => 
    r.routeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.routeCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-800 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full -mr-40 -mt-40 blur-3xl opacity-50" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-xl">
              <MdMap size={40} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black mb-2 tracking-tight">Transit Registry</h1>
              <p className="text-indigo-200 font-medium text-lg">Detailed manifest of institutional transit channels, terminal nodes, and path metrics</p>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center z-[100]">
          <FaSpinner className="animate-spin text-indigo-600 text-5xl" />
        </div>
      )}

      {/* Registry Manifest Dual View */}
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-8 bg-slate-50/30">
          <div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Active Path Registry</h3>
            <p className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-widest">Transit Nodes Manifested: {routes.length} paths</p>
          </div>
          
          <div className="flex items-center gap-6 w-full md:w-auto">
            <div className="relative w-full md:w-80 group">
              <MdSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={24} />
              <input
                type="text"
                placeholder="Search Transit Identity..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 transition-all outline-none"
              />
            </div>
            <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
              <button 
                onClick={() => setViewMode('table')}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'table' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <MdFormatListBulleted size={22} />
              </button>
              <button 
                onClick={() => setViewMode('card')}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'card' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <MdGridView size={22} />
              </button>
            </div>
          </div>
        </div>

        {viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-center">
              <thead>
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50/50">
                  <th className="px-10 py-6 text-left">Transit Identity</th>
                  <th className="px-6 py-6 font-center">Identity Code</th>
                  <th className="px-6 py-6 font-center">Initiating terminal</th>
                  <th className="px-6 py-6 font-center">Destination node</th>
                  <th className="px-6 py-6 font-center">Mapped Path</th>
                  <th className="px-10 py-6 text-right font-bold">Protocol Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRoutes.length > 0 ? filteredRoutes.map((route) => (
                  <tr key={route._id} className="hover:bg-indigo-50/20 transition-all group">
                    <td className="px-10 py-8 text-left">
                      <div className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{route.routeName}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Operational Manifest</div>
                    </td>
                    <td className="px-6 py-8">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg text-xs font-black text-slate-600 border border-slate-200 uppercase tracking-widest">
                        {route.routeCode || 'Uncoded'}
                      </div>
                    </td>
                    <td className="px-6 py-8">
                       <span className="text-sm font-black text-emerald-600">{route.startPoint || '--'}</span>
                    </td>
                    <td className="px-6 py-8">
                       <span className="text-sm font-black text-rose-600">{route.endPoint || '--'}</span>
                    </td>
                    <td className="px-6 py-8">
                      <div className="flex flex-col items-center gap-1.5 font-black text-indigo-500">
                        <span className="text-sm">{route.totalDistance || '0'} KM</span>
                        <div className="w-12 h-1 bg-indigo-100 rounded-full overflow-hidden">
                           <div className="h-full bg-indigo-500" style={{ width: '40%' }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex justify-end">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border ${
                          route.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${route.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                          {route.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="px-10 py-32 text-center text-slate-300">
                       <MdMap size={80} className="mx-auto mb-6 opacity-20" />
                       <p className="text-[11px] font-black uppercase tracking-[0.2em]">Transit Inventory Purged</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {filteredRoutes.map((route) => (
               <div key={route._id} className="bg-slate-50/50 rounded-[2rem] p-8 border border-slate-100 hover:border-indigo-100 hover:bg-white hover:shadow-2xl transition-all group overflow-hidden relative">
                  <div className="absolute -right-6 -top-6 w-32 h-32 bg-indigo-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700" />
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                       <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                          <FaRoute size={24} />
                       </div>
                       <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          route.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'
                       }`}>
                          {route.status}
                       </span>
                    </div>
                    
                    <h4 className="text-xl font-black text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{route.routeName}</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">TRANSIT IDENTITY: {route.routeCode || '--'}</p>
                    
                    <div className="space-y-4 mb-8">
                       <div className="flex items-center gap-4">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <p className="text-sm font-bold text-slate-600 line-clamp-1">{route.startPoint || 'Initiating Terminal'}</p>
                       </div>
                       <div className="ml-0.5 w-[2px] h-6 bg-slate-100" />
                       <div className="flex items-center gap-4">
                          <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          <p className="text-sm font-bold text-slate-600 line-clamp-1">{route.endPoint || 'Destination Node'}</p>
                       </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                       <div className="flex flex-col">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Path</span>
                          <span className="text-lg font-black text-indigo-600 tabular-nums">{route.totalDistance || '0'} KM</span>
                       </div>
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