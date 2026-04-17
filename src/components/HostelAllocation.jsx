import React, { useState, useEffect } from 'react';
import { FaHome, FaSpinner } from 'react-icons/fa';
import { hostelAPI } from '../utils/apiService';
import { toast } from 'react-toastify';

export default function HostelAllocation() {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllocations();
  }, []);

  const fetchAllocations = async () => {
    try {
      setLoading(true);
      const res = await hostelAPI.getAllocations();
      setAllocations(res.data.allocations || []);
    } catch (err) {
      toast.error('Residential allocation registry synchronization failure');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="p-6">
      {/* Header */}
        {/* header */}
             <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 mb-8 border border-white/50">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <FaHome className="text-white text-2xl" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Hostel Management
                  </h1>
                  <p className="text-gray-600 mt-1">Manage hostel facilities and accommodations</p>
                </div>
              </div>
            </div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Hostel Allocation</h2>
          <p className="text-gray-600">View student hostel bed allocations</p>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <FaSpinner className="animate-spin text-green-600 text-4xl" />
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Accessing Allocation Registry...</p>
        </div>
      )}

      {/* Allocation List */}
      <div className="bg-white/50 rounded-2xl overflow-hidden">
        <div className="p-4 bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900">Hostel Allocations ({allocations.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Student ID</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Student Name</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Hostel</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Room</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Joining Date</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Monthly Rent</th>
              </tr>
            </thead>
            <tbody>
              {allocations.map((allocation, index) => (
                <tr key={allocation._id} className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                  <td className="px-4 py-3 font-bold">{allocation.studentId}</td>
                  <td className="px-4 py-3">{allocation.studentName}</td>
                  <td className="px-4 py-3">{allocation.hostel?.hostelName}</td>
                  <td className="px-4 py-3">{allocation.roomNo}</td>
                  <td className="px-4 py-3">{allocation.joiningDate?.split('T')[0]}</td>
                  <td className="px-4 py-3">₹{allocation.monthlyRent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}