import React, { useState, useEffect } from 'react';
import { MdHome, MdAdd, MdEdit, MdDelete, MdPhone, MdLocationOn, MdHistory, MdFilterList, MdSearch } from 'react-icons/md';
import { hostelAPI } from '../utils/apiService';
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';
import Swal from 'sweetalert2';

export default function CreateHostel() {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    hostelName: '',
    hostelCode: '',
    type: 'Boys',
    contactNo: '',
    totalFloor: '',
    status: true
  });

  useEffect(() => {
    fetchHostels();
  }, []);

  const fetchHostels = async () => {
    try {
      setLoading(true);
      const res = await hostelAPI.getAll();
      setHostels(res.data.hostels || []);
    } catch (err) {
      toast.error('Institutional hostel registry synchronization failure');
    } finally {
      setLoading(false);
    }
  };



  const filteredHostels = hostels.filter(h => 
    h.hostelName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.hostelCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full -mr-40 -mt-40 blur-3xl opacity-50" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-xl">
              <MdHome size={40} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black mb-2 tracking-tight">Dormitory Registry</h1>
              <p className="text-indigo-200 font-medium text-lg">Manifest institutional residential facilities and infrastructure registry</p>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center z-[100]">
          <FaSpinner className="animate-spin text-indigo-600 text-5xl" />
        </div>
      )}



      {/* Registry Table */}
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-8 bg-slate-50/30">
          <div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Institutional Registry</h3>
            <p className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-widest">Active Dormitory Inventory: {hostels.length}</p>
          </div>
          
          <div className="relative w-full md:w-96 group">
            <MdSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={24} />
            <input
              type="text"
              placeholder="Search Manifest Registry..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 transition-all outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50/50">
                <th className="px-10 py-6">Identity Manifest</th>
                <th className="px-10 py-6 text-center">Protocol Code</th>
                <th className="px-10 py-6 text-center">Classification</th>
                <th className="px-10 py-6 text-center">Structural Floors</th>
                <th className="px-10 py-6 text-center">Operational Contact</th>
                <th className="px-10 py-6 text-center">Registry Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredHostels.length > 0 ? filteredHostels.map((hostel) => (
                <tr key={hostel._id} className="hover:bg-indigo-50/30 transition-all group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                        <MdHome size={22} />
                      </div>
                      <div className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{hostel.hostelName}</div>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-600 uppercase tracking-widest border border-slate-200">
                      {hostel.hostelCode}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 justify-center w-fit mx-auto ${
                      hostel.type === 'Boys' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                      hostel.type === 'Girls' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                      'bg-indigo-50 text-indigo-700 border-indigo-100'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${hostel.type === 'Boys' ? 'bg-blue-500' : hostel.type === 'Girls' ? 'bg-rose-500' : 'bg-indigo-500'}`} />
                      {hostel.type}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-center text-sm font-black text-slate-700 tabular-nums">
                    {hostel.totalFloor} Floors
                  </td>
                  <td className="px-10 py-8 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    {hostel.contactNo}
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex justify-center">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm border ${
                        hostel.status ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${hostel.status ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                        {hostel.status ? 'Active Manifest' : 'Revoked Protocol'}
                      </span>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="px-10 py-32 text-center text-slate-300">
                    <div className="flex flex-col items-center gap-6">
                      <MdHome size={80} className="text-slate-100" />
                      <div>
                        <p className="text-sm font-black uppercase tracking-[0.3em] mb-2">Institutional Registry Empty</p>
                        <p className="text-[10px] font-bold text-slate-400">MANIFEST NEW DORMITORY RECORD TO CO-ORDINATE RESIDENTIAL MATRIX</p>
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