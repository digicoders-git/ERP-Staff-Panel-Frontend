import React from 'react';
import { FaBus, FaUserTie, FaMapMarkedAlt, FaBusAlt, FaMoneyBillWave, FaCog, FaUsers } from 'react-icons/fa';

export default function TransportDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-8 border border-white/60">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-2xl transform rotate-3">
              <FaBus className="text-4xl text-blue-600 transform -rotate-3" />
            </div>
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Transport Management
              </h1>
              <p className="text-gray-600 mt-2 text-lg">Complete ERP transport system with modern design</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Vehicles</p>
                <p className="text-3xl font-bold">12</p>
              </div>
              <div className="text-4xl opacity-80"><FaBus className="text-white" /></div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Active Drivers</p>
                <p className="text-3xl font-bold">8</p>
              </div>
              <div className="text-4xl opacity-80"><FaUserTie className="text-white" /></div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Total Routes</p>
                <p className="text-3xl font-bold">15</p>
              </div>
              <div className="text-4xl opacity-80"><FaMapMarkedAlt className="text-white" /></div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Students</p>
                <p className="text-3xl font-bold">245</p>
              </div>
              <div className="text-4xl opacity-80"><FaUsers className="text-white" /></div>
            </div>
          </div>
        </div>

        {/* Transport Modules */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
          <div className="px-8 py-6" style={{backgroundColor: 'rgb(26,37,57)'}}>
            <h3 className="text-2xl font-bold text-white">Transport Modules</h3>
            <p className="text-indigo-100 mt-1">Complete transport management system</p>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <div className="group bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 p-6 rounded-2xl border-2 border-blue-200 transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer">
                <div className="text-blue-600 text-4xl mb-4 group-hover:scale-110 transition-transform"><FaBus /></div>
                <h4 className="font-bold text-gray-800 text-lg mb-2">Vehicle Master</h4>
                <p className="text-sm text-gray-600">Manage all transport vehicles</p>
              </div>
              
              <div className="group bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 p-6 rounded-2xl border-2 border-green-200 transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer">
                <div className="text-green-600 text-4xl mb-4 group-hover:scale-110 transition-transform"><FaUserTie /></div>
                <h4 className="font-bold text-gray-800 text-lg mb-2">Driver Master</h4>
                <p className="text-sm text-gray-600">Manage driver information</p>
              </div>
              
              <div className="group bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 p-6 rounded-2xl border-2 border-purple-200 transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer">
                <div className="text-purple-600 text-4xl mb-4 group-hover:scale-110 transition-transform"><FaMapMarkedAlt /></div>
                <h4 className="font-bold text-gray-800 text-lg mb-2">Route Master</h4>
                <p className="text-sm text-gray-600">Setup transport routes</p>
              </div>
              
              <div className="group bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 p-6 rounded-2xl border-2 border-orange-200 transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer">
                <div className="text-orange-600 text-4xl mb-4 group-hover:scale-110 transition-transform"><FaBusAlt /></div>
                <h4 className="font-bold text-gray-800 text-lg mb-2">Route Stops</h4>
                <p className="text-sm text-gray-600">Manage route stops</p>
              </div>
              
              <div className="group bg-gradient-to-br from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 p-6 rounded-2xl border-2 border-indigo-200 transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer">
                <div className="text-indigo-600 text-4xl mb-4 group-hover:scale-110 transition-transform"><FaMoneyBillWave /></div>
                <h4 className="font-bold text-gray-800 text-lg mb-2">Route Charges</h4>
                <p className="text-sm text-gray-600">Setup transport charges</p>
              </div>
              
              <div className="group bg-gradient-to-br from-teal-50 to-teal-100 hover:from-teal-100 hover:to-teal-200 p-6 rounded-2xl border-2 border-teal-200 transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer">
                <div className="text-teal-600 text-4xl mb-4 group-hover:scale-110 transition-transform"><FaCog /></div>
                <h4 className="font-bold text-gray-800 text-lg mb-2">Assignment</h4>
                <p className="text-sm text-gray-600">Vehicle assignments</p>
              </div>
              
              <div className="group bg-gradient-to-br from-pink-50 to-pink-100 hover:from-pink-100 hover:to-pink-200 p-6 rounded-2xl border-2 border-pink-200 transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer">
                <div className="text-pink-600 text-4xl mb-4 group-hover:scale-110 transition-transform"><FaUsers /></div>
                <h4 className="font-bold text-gray-800 text-lg mb-2">Allocation</h4>
                <p className="text-sm text-gray-600">Student allocation</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}