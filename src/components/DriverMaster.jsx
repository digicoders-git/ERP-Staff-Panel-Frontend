import React, { useState, useEffect } from 'react';
import { MdPerson, MdSearch } from 'react-icons/md';
import { transportAPI } from '../utils/apiService';
import { toast } from 'react-toastify';
import { FaSpinner, FaIdCard, FaPhone } from 'react-icons/fa';

export default function DriverMaster() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const res = await transportAPI.getDrivers();
      const driversData = res.data?.data?.drivers || res.data?.drivers || [];
      const mappedDrivers = driversData.map(d => ({
        ...d,
        driverName: d.name,
        mobileNumber: d.mobileNo,
        licenseNumber: d.licenseNo,
        status: d.status ? 'Active' : 'Inactive'
      }));
      setDrivers(mappedDrivers);
    } catch (err) {
      toast.error('Personnel records synchronization failure');
    } finally {
      setLoading(false);
    }
  };

  const filteredDrivers = drivers.filter(d => 
    d.driverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.licenseNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-900 to-slate-800 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full -mr-40 -mt-40 blur-3xl opacity-50" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-xl">
              <MdPerson size={40} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black mb-2 tracking-tight">Personnel Records</h1>
              <p className="text-emerald-200 font-medium text-lg">Detailed records of school drivers, qualification metrics, and operational status</p>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center z-[100]">
          <FaSpinner className="animate-spin text-emerald-600 text-5xl" />
        </div>
      )}

      {/* Personnel Records Table */}
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-8 bg-slate-50/30">
          <div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Operator Records Record</h3>
            <p className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-widest">Active Operators: {drivers.length} Personnel</p>
          </div>
          
          <div className="relative w-full md:w-96 group">
            <MdSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={24} />
            <input
              type="text"
              placeholder="Search Operator Identity..."
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
                <th className="px-10 py-6 text-left">Operator Identity</th>
                <th className="px-6 py-6 text-left">Credential Matrix</th>
                <th className="px-6 py-6">Telemetry</th>
                <th className="px-6 py-6 font-bold text-center">Protocol Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDrivers.length > 0 ? filteredDrivers.map((driver) => (
                <tr key={driver._id} className="hover:bg-emerald-50/20 transition-all group">
                  <td className="px-10 py-8 text-left">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                        <MdPerson size={22} />
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-800 group-hover:text-emerald-600 transition-colors">{driver.driverName}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Mobile: {driver.mobileNumber || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-8 text-left">
                    <div className="flex flex-col gap-1.5 ">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-lg text-[10px] font-black text-emerald-700 border border-emerald-100 uppercase tracking-widest ">
                        <FaIdCard className="text-emerald-400" /> {driver.licenseNumber}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Expires: {driver.licenseExpiryDate ? new Date(driver.licenseExpiryDate).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-8">
                     <span className="text-sm font-black text-slate-700 tabular-nums">{driver.experience || 0} Years</span>
                     <p className="text-[9px] text-slate-400 font-black uppercase tracking-tighter">Operational Tenure</p>
                  </td>
                  <td className="px-6 py-8">
                    <div className="flex justify-center">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border ${
                        driver.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        'bg-rose-50 text-rose-700 border-rose-100'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${driver.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                        {driver.status}
                      </span>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="px-10 py-32 text-center text-slate-300">
                     <MdPerson size={80} className="mx-auto mb-6 opacity-20" />
                     <p className="text-[11px] font-black uppercase tracking-[0.2em]">Personnel Records Purged</p>
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