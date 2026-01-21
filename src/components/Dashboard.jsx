import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Registration from './Registration';
import Applications from './Applications';
import Verification from './Verification';
import Admissions from './Admissions';
import TransportDashboard from './TransportDashboard';
import Enrollment from './Enrollment';
import Classes from './Classes';
import Fees from './Fees';
import Documents from './Documents';
import Reports from './Reports';
import Notices from './Notices';
import Profile from './Profile';
import DriverMaster from './DriverMaster';
import VehicleMaster from './VehicalMaster';
import RouteMaster from './RouteMaster';
import RouteStop from './RouteStop';
import RouteCharge from './RouteCharge';
import IdCard from './IdCard';

import {
  MdDashboard,
  MdPeople,
  MdSchool,
  MdCheckCircle,
  MdAssignment,
  MdBarChart,
  MdSchedule,
  MdCampaign,
  MdTrendingUp,
  MdPerson,
  MdLogout,
  MdMenu,
  MdClose,
  MdPersonAdd,
  MdDescription,
  MdPayment,
  MdAppRegistration,
  MdVerifiedUser,
  MdClass,
  MdHome,
  MdBed,
  MdAttachMoney,
  MdAssignmentInd,
  MdExpandMore,
  MdSupervisorAccount,
  MdExpandLess,
  MdDirectionsBus,
  MdOutlineAltRoute,
  MdOutlineCurrencyRupee
} from 'react-icons/md';

import { GiStopSign } from "react-icons/gi";
import HostelDashboard from './HostelDashboard';
import HostelReport from './HostelReport';
import HostelAllocation from './HostelAllocation';
import RoomManagement from './RoomManagement';
import CreateHostel from './CreateHostel';
import RoomTypeCharges from './RoomTypeCharge';
import Warden from './Warden';
import { FaRegIdCard } from 'react-icons/fa';
import TransportAllocation from './TransportAllocation';


const Dashboard = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState(() => {
    return localStorage.getItem('activeMenu') || 'dashboard';
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [hostelDropdownOpen, setHostelDropdownOpen] = useState(false);
  const [transportDropdownOpen, setTransportDropdownOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('activeMenu', activeMenu);
  }, [activeMenu]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: MdDashboard },
    { id: 'New Addmission', name: 'New Admission', icon: MdAppRegistration },
    { id: 'admissions', name: 'Admissions', icon: MdPersonAdd },
    { id: 'id-card', name: 'Id Card', icon: FaRegIdCard },
    { id: 'classes', name: 'Class Information', icon: MdClass },
    { id: 'fees', name: 'Fee Collection', icon: MdPayment },
    { id: 'documents', name: 'Documents', icon: MdDescription },
    { id: 'notices', name: 'Notices', icon: MdCampaign },
    { id: 'profile', name: 'Profile', icon: MdPerson }
  ];

  const hostelItems = [
    { id: 'hostel-dashboard', name: 'Dashboard', icon: MdDashboard },
    { id: 'create-hostel', name: 'Create Hostel', icon: MdHome },
    { id: 'room-type-charge', name: 'Room Type & Charge', icon: MdOutlineCurrencyRupee },
    { id: 'room-management', name: 'Room Management', icon: MdBed },
    { id: 'hostel-allocation', name: 'Hostel Allocation', icon: MdAssignmentInd },
    { id: 'warden-management', name: 'Warden Manage', icon: MdSupervisorAccount },
    { id: 'hostel-report', name: 'Hostel Report', icon: MdBarChart }
  ];

  const transportItems = [
    { id: 'transport-dashboard', name: 'Dashboard', icon: MdDashboard },
    { id: 'vehical-master', name: 'Vehical master', icon: MdDirectionsBus },
    { id: 'driver-master', name: 'Driver Master', icon: MdPerson },
    { id: 'route-master', name: 'Route Master', icon: MdOutlineAltRoute },
    { id: 'route-stop', name: 'Route Stops', icon: GiStopSign },
    { id: 'route-charge', name: 'Route Charge', icon: MdOutlineCurrencyRupee },
    { id: 'transport-allocation', name: 'Transport Allocation', icon: MdAssignmentInd },
    // { id: 'transport-report', name: 'Transport Report', icon: MdBarChart }
  ];

  const stats = [
    { title: 'New Admissions', count: '156', icon: MdAppRegistration, color: 'bg-blue-500' },
    // { title: 'Pending Applications', count: '89', icon: MdDescription, color: 'bg-yellow-500' },
    // { title: 'Verified Students', count: '234', icon: MdVerifiedUser, color: 'bg-green-500' },
    { title: 'Total Admissions', count: '1,234', icon: MdPersonAdd, color: 'bg-purple-500' },
    // { title: 'Enrolled Students', count: '1,189', icon: MdPeople, color: 'bg-indigo-500' },
    { title: 'Fee Collections', count: '₹8.5L', icon: MdPayment, color: 'bg-emerald-500' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Fixed Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl flex flex-col fixed h-full z-10 transition-all duration-300`}>
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          {sidebarOpen && (
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Staff Portal
            </h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-300 hover:text-white transition-colors duration-200 cursor-pointer"
          >
            {sidebarOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
          </button>
        </div>
        <nav className="mt-6 flex-1 overflow-y-auto scrollbar-hide">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-slate-700/50 transition duration-200 cursor-pointer ${activeMenu === item.id ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-r-4 border-blue-400 text-blue-400' : 'text-slate-300 hover:text-white'
                }`}
              title={!sidebarOpen ? item.name : ''}
            >
              <span className="text-xl mr-3"><item.icon /></span>
              {sidebarOpen && <span className="font-medium">{item.name}</span>}
            </button>
          ))}

          {/* Hostel Dropdown */}
          <div>
            <button
              onClick={() => setHostelDropdownOpen(!hostelDropdownOpen)}
              className={`w-full flex items-center justify-between px-6 py-3 text-left hover:bg-slate-700/50 transition duration-200 cursor-pointer ${hostelItems.some(item => item.id === activeMenu) ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-r-4 border-blue-400 text-blue-400' : 'text-slate-300 hover:text-white'
                }`}
              title={!sidebarOpen ? 'Hostel' : ''}
            >
              <div className="flex items-center">
                <span className="text-xl mr-3"><MdBed /></span>
                {sidebarOpen && <span className="font-medium">Hostel</span>}
              </div>
              {sidebarOpen && (
                <span className="text-lg">
                  {hostelDropdownOpen ? <MdExpandLess /> : <MdExpandMore />}
                </span>
              )}
            </button>

            {hostelDropdownOpen && sidebarOpen && (
              <div className="bg-slate-800/50">
                {hostelItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveMenu(item.id)}
                    className={`w-full flex items-center px-12 py-2 text-left hover:bg-slate-700/50 transition duration-200 cursor-pointer ${activeMenu === item.id ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-400' : 'text-slate-400 hover:text-white'
                      }`}
                  >
                    <span className="text-lg mr-3"><item.icon /></span>
                    <span className="font-medium text-sm">{item.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Transport Dropdown */}
          <div>
            <button
              onClick={() => setTransportDropdownOpen(!transportDropdownOpen)}
              className={`w-full flex items-center justify-between px-6 py-3 text-left hover:bg-slate-700/50 transition duration-200 cursor-pointer ${transportItems.some(item => item.id === activeMenu) ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-r-4 border-blue-400 text-blue-400' : 'text-slate-300 hover:text-white'
                }`}
              title={!sidebarOpen ? 'Transport' : ''}
            >
              <div className="flex items-center">
                <span className="text-xl mr-3"><MdDirectionsBus /></span>
                {sidebarOpen && <span className="font-medium">Transport</span>}
              </div>
              {sidebarOpen && (
                <span className="text-lg">
                  {transportDropdownOpen ? <MdExpandLess /> : <MdExpandMore />}
                </span>
              )}
            </button>

            {transportDropdownOpen && sidebarOpen && (
              <div className="bg-slate-800/50">
                {transportItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveMenu(item.id)}
                    className={`w-full flex items-center px-12 py-2 text-left hover:bg-slate-700/50 transition duration-200 cursor-pointer ${activeMenu === item.id ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-400' : 'text-slate-400 hover:text-white'
                      }`}
                  >
                    <span className="text-lg mr-3"><item.icon /></span>
                    <span className="font-medium text-sm">{item.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>
        {/* Logout Button */}
        <div className="p-6 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-lg transition duration-200 cursor-pointer"
            title={!sidebarOpen ? 'Logout' : ''}
          >
            <span className="text-xl mr-3"><MdLogout /></span>
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content with dynamic margin for sidebar */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        {/* Fixed Navbar */}
        <nav className={`bg-white shadow-md border-b fixed top-[-12px] right-0 z-20 transition-all duration-300 ${sidebarOpen ? 'left-64' : 'left-16'}`}>
          <div className="px-6 py-4 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 capitalize">{activeMenu}</h2>
              <p className="text-sm text-gray-600">Welcome back to your dashboard</p>
            </div>
            <div className="flex items-center space-x-6">
              {/* Live Date & Time */}
              <div className="text-right">
                <p className="text-lg font-bold text-blue-600">
                  {currentTime.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {currentTime.toLocaleDateString('en-US', {
                    weekday: 'long',

                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              {/* User Profile */}
              <div className="flex items-center space-x-3 bg-white rounded-lg shadow-lg px-4 py-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                  S
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Staff_Name</p>
                  {/* <p className="text-xs text-gray-500">Mathematics Teacher</p>   */}

                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Dashboard Content with top margin for fixed navbar */}
        <main className="flex-1 pt-24 overflow-y-auto">
          <div className="max-w-7xl  p-6 mx-auto">
            {activeMenu === 'dashboard' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300">
                      <div className="flex items-center">
                        <div className={`${stat.color} rounded-lg p-3 text-white text-2xl mr-4`}>
                          <stat.icon />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                          <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent Activity & Schedule */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      {[
                        { activity: 'New admission application submitted', time: '30 minutes ago', icon: MdAppRegistration },
                        { activity: 'Application verified and approved', time: '1 hour ago', icon: MdVerifiedUser },
                        { activity: 'Fee payment received', time: '2 hours ago', icon: MdPayment },
                        { activity: 'Student enrolled in Class 10A', time: '3 hours ago', icon: MdPeople }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-xl mr-3 text-blue-600"><item.icon /></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{item.activity}</p>
                            <p className="text-xs text-gray-500">{item.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Admission Process Status</h3>
                    <div className="space-y-4">
                      {[
                        { process: 'New Admission Phase', status: 'Active', count: '156 New', color: 'bg-blue-100 text-blue-800' },
                        { process: 'Document Verification', status: 'In Progress', count: '89 Pending', color: 'bg-yellow-100 text-yellow-800' },
                        { process: 'Interview Schedule', status: 'Scheduled', count: '45 Today', color: 'bg-green-100 text-green-800' },
                        { process: 'Final Admission', status: 'Ongoing', count: '23 Confirmed', color: 'bg-purple-100 text-purple-800' }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-l-4 border-blue-500">
                          <div>
                            <p className="font-medium text-gray-900">{item.process}</p>
                            <p className="text-sm text-gray-600">{item.count}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${item.color}`}>
                            {item.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Registration Content */}
            {activeMenu === 'New Addmission' && <Registration />}

            {/* Applications Content */}
            {activeMenu === 'applications' && <Applications />}

            {/* Verification Content */}
            {activeMenu === 'verification' && <Verification />}

            {/* Admissions Content */}
            {activeMenu === 'admissions' && <Admissions />}

            {/* Enrollment Content */}
            {activeMenu === 'enrollment' && <Enrollment />}

            {/* Classes Content */}
            {activeMenu === 'classes' && <Classes />}

            {/* Documents Content */}
            {activeMenu === 'documents' && <Documents />}

            {/* Fees Content */}
            {activeMenu === 'fees' && <Fees />}

            {/* ID Card Content */}
            {activeMenu === 'id-card' && <IdCard />}

            {/* Reports Content */}
            {activeMenu === 'reports' && <Reports />}

            {/* Notices Content */}
            {activeMenu === 'notices' && <Notices />}

            {/* Profile Content */}
            {activeMenu === 'profile' && <Profile />}

            {/* Hostel Content */}
            {activeMenu === 'hostel-dashboard' && <HostelDashboard />}
            {activeMenu === 'create-hostel' && <CreateHostel />}
            {activeMenu === 'room-type-charge' && <RoomTypeCharges />}
            {activeMenu === 'room-management' && <RoomManagement />}
            {activeMenu === 'hostel-allocation' && <HostelAllocation />}
            {activeMenu === 'warden-management' && <Warden />}
            {activeMenu === 'hostel-report' && <HostelReport />}

            {/* transport content */}
            {activeMenu === 'transport-dashboard' && <TransportDashboard />}
            {activeMenu === 'vehical-master' && <VehicleMaster />}
            {activeMenu === 'driver-master' && <DriverMaster />}
            {activeMenu === 'route-master' && <RouteMaster />}
            {activeMenu === 'route-stop' && <RouteStop />}
            {activeMenu === 'route-charge' && <RouteCharge />}
            {activeMenu === 'transport-allocation' && <TransportAllocation />}

            {/* Other Menu Content */}
            {!['dashboard', 'registration', 'applications', 'verification', 'admissions', 'enrollment', 'classes', 'fees', 'documents', 'reports', 'notices', 'profile', 'hostel-dashboard', 'create-hostel', 'room-type-charge', 'room-management', 'hostel-allocation', 'warden-management', 'hostel-report', 'transport-dashboard', 'vehical-master', 'driver-master', 'route-master', 'route-stop', 'route-charge', 'transport-allocation', 'transport-report', 'id-card'].includes(activeMenu) && (
              <div>



              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;