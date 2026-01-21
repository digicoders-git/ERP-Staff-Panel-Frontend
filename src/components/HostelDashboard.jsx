import React from 'react';
import { FaBuilding, FaBed, FaUsers, FaUnlock, FaUser, FaMoneyBillWave, FaHome } from 'react-icons/fa';

export default function HostelDashboard() {
  return (
    <div className="p-8">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Hostels */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Hostels</p>
              <p className="text-3xl font-bold">5</p>
            </div>
            <div className="text-4xl"><FaBuilding className="text-white" /></div>
          </div>
        </div>

        {/* Total Rooms */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Total Rooms</p>
              <p className="text-3xl font-bold">120</p>
            </div>
            <div className="text-4xl"><FaBed className="text-white" /></div>
          </div>
        </div>

        {/* Occupied Rooms */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Occupied</p>
              <p className="text-3xl font-bold">85</p>
            </div>
            <div className="text-4xl"><FaUsers className="text-white" /></div>
          </div>
        </div>

        {/* Available Rooms */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Available</p>
              <p className="text-3xl font-bold">35</p>
            </div>
            <div className="text-4xl"><FaUnlock className="text-white" /></div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white/50 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activities</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-white rounded-xl">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <FaUser className="text-blue-600" />
            </div>
            <div>
              <p className="font-semibold">New student admission</p>
              <p className="text-sm text-gray-500">Room 101 assigned to John Doe</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-white rounded-xl">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <FaMoneyBillWave className="text-green-600" />
            </div>
            <div>
              <p className="font-semibold">Payment received</p>
              <p className="text-sm text-gray-500">Hostel fee paid for Room 205</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}