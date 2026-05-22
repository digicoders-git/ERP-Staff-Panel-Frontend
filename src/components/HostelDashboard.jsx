import React, { useState, useEffect } from 'react';
import { FaBuilding, FaBed, FaUsers, FaUnlock, FaUser, FaMoneyBillWave, FaHome, FaSpinner } from 'react-icons/fa';
import { hostelAPI } from '../utils/apiService';
import { toast } from 'react-toastify';

export default function HostelDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalHostels: 0,
    totalRooms: 0,
    occupiedRooms: 0,
    availableRooms: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [hostelsRes, roomsRes, allocationsRes] = await Promise.all([
        hostelAPI.getAll(),
        hostelAPI.getRooms(),
        hostelAPI.getAllocations()
      ]);

      const hostels = hostelsRes.data.hostels || [];
      const rooms = roomsRes.data.rooms || [];
      const allocations = allocationsRes.data.allocations || [];

      setStats({
        totalHostels: hostels.length,
        totalRooms: rooms.length,
        occupiedRooms: allocations.filter(a => a.allocationStatus === 'allocated').length,
        availableRooms: rooms.filter(r => r.status === 'available').length || (rooms.length - allocations.filter(a => a.allocationStatus === 'allocated').length)
      });

      // Mocking recent activities from allocations as the backend doesn't have a dedicated activity endpoint for hostel yet
      setRecentActivities(allocations.slice(0, 5).map(a => ({
        id: a._id,
        title: 'Room Allocation Manifested',
        desc: `Room ${a.roomNo} assigned to student records ID: ${a.studentId}`,
        icon: FaUser,
        color: 'blue'
      })));

    } catch (err) {
      console.error('Hostel Fetch Failure:', err);
      toast.error('School hostel records inaccessible');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <FaSpinner className="animate-spin text-indigo-600 text-5xl" />
        <p className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-400">Synchronizing Resident Matrix...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl">
              <FaHome className="text-indigo-400 text-3xl" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight mb-2">Hostel Matrix</h1>
              <p className="text-indigo-200/80 text-lg font-medium">Coordinate residential facilities, room allocations, and vacancy records</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/20 transition-all">
              Export Records
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Hostels', value: stats.totalHostels, icon: FaBuilding, color: 'from-blue-600 to-indigo-700', bg: 'bg-blue-50' },
          { label: 'Inventory Rooms', value: stats.totalRooms, icon: FaBed, color: 'from-emerald-600 to-teal-700', bg: 'bg-emerald-50' },
          { label: 'Occupied Matrix', value: stats.occupiedRooms, icon: FaUsers, color: 'from-rose-600 to-pink-700', bg: 'bg-rose-50' },
          { label: 'Vacancy Record', value: stats.availableRooms, icon: FaUnlock, color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50' }
        ].map((card, idx) => (
          <div key={idx} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
            <div className={`absolute top-0 right-0 w-24 h-24 ${card.bg} rounded-full -mr-12 -mt-12 opacity-50 group-hover:scale-150 transition-transform duration-500`} />
            <div className="relative z-10">
              <div className={`w-14 h-14 bg-gradient-to-br ${card.color} rounded-2xl flex items-center justify-center text-white shadow-xl mb-6 group-hover:rotate-6 transition-transform`}>
                <card.icon size={26} />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{card.label}</p>
              <p className="text-4xl font-black text-slate-800 tabular-nums">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Activities Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <div className="w-2 h-8 bg-indigo-500 rounded-full" /> Residential Activity Stream
            </h3>
            <button className="text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:underline">View All Feeds</button>
          </div>
          
          <div className="space-y-6">
            {recentActivities.length > 0 ? recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-6 p-6 bg-slate-50/50 rounded-3xl border border-transparent hover:border-indigo-100 hover:bg-white hover:shadow-lg transition-all group">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-white shadow-sm border border-slate-100 text-indigo-500 group-hover:scale-110 transition-transform`}>
                  <activity.icon size={22} />
                </div>
                <div className="flex-1">
                  <p className="font-black text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{activity.title}</p>
                  <p className="text-slate-500 text-xs font-bold mt-1 uppercase tracking-wider">{activity.desc}</p>
                </div>
                <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Just Now</div>
              </div>
            )) : (
              <div className="py-20 text-center flex flex-col items-center gap-4 opacity-30">
                <FaUsers size={48} className="text-slate-200" />
                <p className="text-xs font-black uppercase tracking-[0.2em]">Activity Record Stream Idle</p>
              </div>
            )}
          </div>
        </div>


      </div>
    </div>
  );
}