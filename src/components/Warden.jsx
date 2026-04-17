import React, { useState, useEffect } from 'react';
import { FaHome, FaUserAlt, FaSpinner } from 'react-icons/fa';
import { hostelAPI } from '../utils/apiService';
import { BASE_URL } from '../utils/api';
import { toast } from 'react-toastify';

export default function Warden() {
  const [wardens, setWardens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWardenData();
  }, []);

  const fetchWardenData = async () => {
    try {
      setLoading(true);
      const res = await hostelAPI.getWardens();
      setWardens(res.data.wardens || []);
    } catch (err) {
      toast.error('Residential warden registry synchronization failure');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="p-6">
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
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Warden Registry</h2>
          <p className="text-gray-600">View hostel wardens and assignments</p>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <FaSpinner className="animate-spin text-green-600 text-4xl" />
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Accessing Warden Registry...</p>
        </div>
      )}



      {/* Warden List */}
      <div className="bg-white/50 rounded-2xl overflow-hidden">
        <div className="p-4 bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900">Warden List ({wardens.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Name</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Mobile</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Gender</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Assigned Hostels</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Shift</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Status</th>
              </tr>
            </thead>
            <tbody>
              {wardens.map((warden, index) => (
                <tr key={warden._id} className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                        {warden.profileImage ? (
                          <img 
                            src={warden.profileImage.startsWith('http') ? warden.profileImage : `${BASE_URL}/${warden.profileImage.replace(/\\/g, '/')}`} 
                            alt={warden.wardenName} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <span className="text-gray-400">👤</span>
                        )}
                      </div>
                      <span className="font-bold">{warden.wardenName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{warden.mobileNumber}</td>
                  <td className="px-4 py-3">{warden.gender}</td>
                  <td className="px-4 py-3">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      {warden.assignedHostel?.hostelName || 'Unassigned'}
                    </span>
                  </td>
                  <td className="px-4 py-3">{warden.shift}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                      warden.status?.toLowerCase() === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {warden.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}