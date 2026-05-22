import React, { useState, useEffect } from 'react';
import { MdDirectionsBus, MdSearch } from 'react-icons/md';
import { transportAPI } from '../utils/apiService';
import { toast } from 'react-toastify';
import { FaSpinner, FaChair, FaGasPump, FaFileContract } from 'react-icons/fa';

export default function VehicleMaster() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const res = await transportAPI.getVehicles();
      const mappedVehicles = (res.data.vehicles || []).map(v => ({
        ...v,
        vehicleNumber: v.vehicleNo,
        rcNumber: v.rcNo,
        seatingCapacity: v.vehicleCapacity,
        status: v.status ? 'Active' : 'Maintenance'
      }));
      setVehicles(mappedVehicles);
    } catch (err) {
      toast.error('Fleet records synchronization failure');
    } finally {
      setLoading(false);
    }
  };

  const filteredVehicles = vehicles.filter(v => 
    v.vehicleNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.vehicleType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full -mr-40 -mt-40 blur-3xl opacity-50" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-xl">
              <MdDirectionsBus size={40} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black mb-2 tracking-tight">Fleet Command</h1>
              <p className="text-blue-200 font-medium text-lg">Manage school vehicle inventory, compliance status, and operational readiness</p>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center z-[100]">
          <FaSpinner className="animate-spin text-blue-600 text-5xl" />
        </div>
      )}

      {/* Fleet Records Table */}
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-8 bg-slate-50/30">
          <div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Fleet Records Record</h3>
            <p className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-widest">Active Fleet: {vehicles.length} Units</p>
          </div>
          
          <div className="relative w-full md:w-96 group">
            <MdSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={24} />
            <input
              type="text"
              placeholder="Search Fleet Record..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-800 transition-all outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50/50">
                <th className="px-10 py-6 text-left">Fleet Identity</th>
                <th className="px-6 py-6 font-bold">Classification</th>
                <th className="px-6 py-6 font-bold">Load Matrix</th>
                <th className="px-6 py-6 font-bold">Propulsion</th>
                <th className="px-6 py-6 font-bold">Compliance</th>
                <th className="px-10 py-6 text-right font-bold">Protocol Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVehicles.length > 0 ? filteredVehicles.map((vehicle) => (
                <tr key={vehicle._id} className="hover:bg-blue-50/20 transition-all group">
                  <td className="px-10 py-8 text-left">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                        <MdDirectionsBus size={22} />
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-800 group-hover:text-blue-600 transition-colors">{vehicle.vehicleNumber}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Records Ref: {vehicle.rcNumber || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-8 text-center text-blue-500">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-lg text-xs font-black uppercase tracking-widest border border-blue-100">
                      {vehicle.vehicleType}
                    </div>
                  </td>
                  <td className="px-6 py-8">
                    <div className="flex flex-col items-center gap-1">
                      <div className="text-sm font-black text-slate-800 flex items-center gap-1.5 justify-center">
                        <FaChair className="text-slate-300" size={14} /> {vehicle.seatingCapacity}
                      </div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Load Limit</span>
                    </div>
                  </td>
                  <td className="px-6 py-8">
                    <div className="flex flex-col items-center gap-1">
                      <div className="text-[11px] font-black text-slate-700 flex items-center gap-1.5 justify-center uppercase tracking-wider">
                        <FaGasPump className="text-emerald-500" size={12} /> {vehicle.fuelType}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-8">
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="flex items-center gap-2">
                        <FaFileContract className="text-slate-300" size={12} />
                        <span className="text-[10px] font-bold text-slate-600">Ins: {vehicle.insuranceExpiryDate ? new Date(vehicle.insuranceExpiryDate).toLocaleDateString() : 'N/A'}</span>
                      </div>
                      <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: '70%' }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex justify-end">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border ${
                        vehicle.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        vehicle.status === 'Maintenance' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                        'bg-rose-50 text-rose-700 border-rose-100'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          vehicle.status === 'Active' ? 'bg-emerald-500 animate-pulse' :
                          vehicle.status === 'Maintenance' ? 'bg-amber-500' : 'bg-rose-500'
                        }`} />
                        {vehicle.status}
                      </span>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-10 py-32 text-center">
                    <div className="flex flex-col items-center gap-6 opacity-30">
                      <MdDirectionsBus size={80} className="text-slate-200" />
                      <div>
                        <p className="text-sm font-black uppercase tracking-[0.3em] mb-2 text-slate-400">Inventory Empty</p>
                        <p className="text-[10px] font-bold text-slate-300 tracking-widest">NO FLEET UNITS DETECTED IN REGISTRY</p>
                      </div>
                    </div>
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