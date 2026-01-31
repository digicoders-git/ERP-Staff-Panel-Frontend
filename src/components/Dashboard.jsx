import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom';
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
import ChangePassword from './ChangePassword';
import StaffAttendance from './StaffAttendance';
import AttendanceTracker from './AttendanceTracker';
import AttendanceReports from './AttendanceReports';
import LeaveManagement from './LeaveManagement';
import FeeReports from './FeeReports';
import DriverMaster from './DriverMaster';
import VehicleMaster from './VehicalMaster';
import RouteMaster from './RouteMaster';
import RouteStop from './RouteStop';
import RouteCharge from './RouteCharge';
import IdCard from './IdCard';
import HostelDashboard from './HostelDashboard';
import HostelReport from './HostelReport';
import HostelAllocation from './HostelAllocation';
import RoomManagement from './RoomManagement';
import CreateHostel from './CreateHostel';
import RoomTypeCharges from './RoomTypeCharge';
import Warden from './Warden';
import TransportAllocation from './TransportAllocation';
import ExamManagement from './ExamManagement';
import CreateSchedule from './CreateSchedule';
import ManageMarks from './ManageMarks';
import Grading from './Grading';
import OnlineExam from './OnlineExam';
import AlumniManagement from './AlumniManagement';
import ELearning from './ELearning';
import QuizManager from './QuizManager';
import EventCalendar from './EventCalendar';
import AddEvent from './AddEvent';
import CompletedEvents from './CompletedEvents';
import StudentProfile from './StudentProfile';


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
  MdOutlineCurrencyRupee,
  MdAccessTime,
  MdLock,
  MdAccessAlarm,
  MdConnectWithoutContact,
  MdPlayCircle,
  MdQuiz,
  MdEvent,
  MdGrade,
  MdComputer,
  MdAdd
} from 'react-icons/md';

import { GiStopSign } from "react-icons/gi";
import { FaRegIdCard } from 'react-icons/fa';

const Dashboard = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState(() => {
    const path = location.pathname.replace('/', '') || 'dashboard';
    return localStorage.getItem('activeMenu') || path;
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [hostelDropdownOpen, setHostelDropdownOpen] = useState(false);
  const [transportDropdownOpen, setTransportDropdownOpen] = useState(false);
  const [examDropdownOpen, setExamDropdownOpen] = useState(false);
  const [staffAttendanceDropdownOpen, setStaffAttendanceDropdownOpen] = useState(false);
  const [feeReportsDropdownOpen, setFeeReportsDropdownOpen] = useState(false);
  const [eLearningDropdownOpen, setELearningDropdownOpen] = useState(false);
  const [eventDropdownOpen, setEventDropdownOpen] = useState(false);


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const path = location.pathname.replace('/', '') || 'dashboard';
    setActiveMenu(path);
  }, [location.pathname]);

  useEffect(() => {
    localStorage.setItem('activeMenu', activeMenu);
  }, [activeMenu]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const handleDropdownClick = (dropdownType, setDropdownState, currentState) => {
    setDropdownState(!currentState);
    if (!currentState) {
      setTimeout(() => {
        const element = document.querySelector(`[data-dropdown="${dropdownType}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
    }
  };

  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: MdDashboard, path: '/dashboard' },
    { id: 'new-admission', name: 'New Admission', icon: MdAppRegistration, path: '/new-admission' },
    { id: 'admissions', name: 'Admissions', icon: MdPersonAdd, path: '/admissions' },
    { id: 'id-card', name: 'Id Card', icon: FaRegIdCard, path: '/id-card' },
    { id: 'classes', name: 'Class Information', icon: MdClass, path: '/classes' },
    { id: 'fees', name: 'Fee Collection', icon: MdPayment, path: '/fees' },
    { id: 'documents', name: 'Documents', icon: MdDescription, path: '/documents' },
    { id: 'notices', name: 'Notices', icon: MdCampaign, path: '/notices' },
    { id: 'alumni-management', name: 'Alumni Management', icon: MdConnectWithoutContact, path: '/alumni-management' },
    { id: 'profile', name: 'Profile', icon: MdPerson, path: '/profile' }
  ];

  const hostelItems = [
    { id: 'hostel-dashboard', name: 'Dashboard', icon: MdDashboard, path: '/hostel-dashboard' },
    { id: 'create-hostel', name: 'Create Hostel', icon: MdHome, path: '/create-hostel' },
    { id: 'room-type-charge', name: 'Room Type & Charge', icon: MdOutlineCurrencyRupee, path: '/room-type-charge' },
    { id: 'room-management', name: 'Room Management', icon: MdBed, path: '/room-management' },
    { id: 'hostel-allocation', name: 'Hostel Allocation', icon: MdAssignmentInd, path: '/hostel-allocation' },
    { id: 'warden-management', name: 'Warden Manage', icon: MdSupervisorAccount, path: '/warden-management' },
    { id: 'hostel-report', name: 'Hostel Report', icon: MdBarChart, path: '/hostel-report' }
  ];

  const transportItems = [
    { id: 'transport-dashboard', name: 'Dashboard', icon: MdDashboard, path: '/transport-dashboard' },
    { id: 'vehical-master', name: 'Vehical master', icon: MdDirectionsBus, path: '/vehical-master' },
    { id: 'driver-master', name: 'Driver Master', icon: MdPerson, path: '/driver-master' },
    { id: 'route-master', name: 'Route Master', icon: MdOutlineAltRoute, path: '/route-master' },
    { id: 'route-stop', name: 'Route Stops', icon: GiStopSign, path: '/route-stop' },
    { id: 'route-charge', name: 'Route Charge', icon: MdOutlineCurrencyRupee, path: '/route-charge' },
    { id: 'transport-allocation', name: 'Transport Allocation', icon: MdAssignmentInd, path: '/transport-allocation' }
  ];

  const examItems = [
    { id: 'exam-schedule', name: 'Create Schedule', icon: MdSchedule, path: '/exam-schedule' },
    { id: 'manage-marks', name: 'Manage Marks', icon: MdAssignment, path: '/manage-marks' },
    { id: 'grading-system', name: 'Grading System', icon: MdGrade, path: '/grading-system' },
    { id: 'online-exam', name: 'Online Exam', icon: MdComputer, path: '/online-exam' }
  ];

  const staffAttendanceItems = [
    { id: 'attendance-process', name: 'Attendance Process', icon: MdAccessTime, path: '/attendance-process' },
    { id: 'attendance-report', name: 'Attendance Report', icon: MdBarChart, path: '/attendance-report' },
    { id: 'leave-management', name: 'Leave Management', icon: MdAssignment, path: '/leave-management' }
  ];

  const feeReportsItems = [
    { id: 'fee-reports', name: 'Fee Reports', icon: MdBarChart, path: '/fee-reports' }
  ];

  const eLearningItems = [
    { id: 'e-learning', name: 'E-Learning Dashboard', icon: MdPlayCircle, path: '/e-learning' },
    { id: 'quiz-manager', name: 'Quiz Manager', icon: MdQuiz, path: '/quiz-manager' }
  ];

  const eventItems = [
    { id: 'upcoming-events', name: 'Upcoming Events', icon: MdEvent, path: '/upcoming-events' },
    { id: 'add-event', name: 'Schedule New', icon: MdAdd, path: '/add-event' },
    { id: 'event-history', name: 'Event History', icon: MdCheckCircle, path: '/event-history' }
  ];



  const stats = [
    { title: 'New Admissions', count: '156', icon: MdAppRegistration, color: 'bg-blue-500' },
    { title: 'Total Admissions', count: '1,234', icon: MdPersonAdd, color: 'bg-purple-500' },
    { title: 'Fee Collections', count: '₹8.5L', icon: MdPayment, color: 'bg-emerald-500' }
  ];

  return (
    <div className="h-screen flex overflow-hidden bg-slate-50 font-sans">
      {/* Sidebar - Fixed Height, Scrollable Internal */}
      <aside
        className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 flex flex-col transition-all duration-300 ease-in-out shrink-0 z-30 shadow-2xl shadow-slate-900/50`}
      >
        {/* Sidebar Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800 shrink-0">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                <MdSchool className="text-white text-xl" />
              </div>
              <h1 className="text-lg font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent truncate tracking-tight">
                Staff Portal
              </h1>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-xl transition-all cursor-pointer shadow-sm active:scale-95"
          >
            {sidebarOpen ? <MdClose size={22} /> : <MdMenu size={22} />}
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide py-6 space-y-8">
          {/* Section: General */}
          <div>
            {sidebarOpen && <p className="px-7 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 opacity-70">Main Menu</p>}
            <div className="space-y-1 px-3">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveMenu(item.id);
                    navigate(item.path);
                  }}
                  className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer relative group ${activeMenu === item.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  title={!sidebarOpen ? item.name : ''}
                >
                  <span className={`text-xl ${activeMenu === item.id ? 'text-white' : 'group-hover:text-blue-400 transition-colors'}`}>
                    <item.icon />
                  </span>
                  {sidebarOpen && <span className="ml-4 text-sm font-bold tracking-tight">{item.name}</span>}
                  {!sidebarOpen && activeMenu === item.id && (
                    <div className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-1.5 h-6 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Section: Academic Modules */}
          <div>
            {sidebarOpen && <p className="px-7 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 opacity-70">Academic Modules</p>}
            <div className="space-y-1 px-3">
              {/* Dropdown Groups */}
              {[
                { id: 'hostel', name: 'Hostel', icon: MdBed, items: hostelItems, state: hostelDropdownOpen, setState: setHostelDropdownOpen, type: 'hostel' },
                { id: 'transport', name: 'Transport', icon: MdDirectionsBus, items: transportItems, state: transportDropdownOpen, setState: setTransportDropdownOpen, type: 'transport' },
                { id: 'exam', name: 'Exams', icon: MdSchedule, items: examItems, state: examDropdownOpen, setState: setExamDropdownOpen, type: 'exam' },
                { id: 'attendance', name: 'Attendance', icon: MdAccessAlarm, items: staffAttendanceItems, state: staffAttendanceDropdownOpen, setState: setStaffAttendanceDropdownOpen, type: 'staff-attendance' },
                { id: 'fees-reports', name: 'Fee Reports', icon: MdBarChart, items: feeReportsItems, state: feeReportsDropdownOpen, setState: setFeeReportsDropdownOpen, type: 'fee-reports' },
                { id: 'learning', name: 'E-Learning', icon: MdPlayCircle, items: eLearningItems, state: eLearningDropdownOpen, setState: setELearningDropdownOpen, type: 'e-learning' },
                { id: 'events', name: 'Events', icon: MdEvent, items: eventItems, state: eventDropdownOpen, setState: setEventDropdownOpen, type: 'event' }
              ].map((group) => (
                <div key={group.id} className="space-y-1">
                  <button
                    onClick={() => handleDropdownClick(group.type, group.setState, group.state)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer relative group ${group.items.some(it => it.id === activeMenu)
                      ? 'text-blue-400 bg-blue-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                      }`}
                  >
                    <div className="flex items-center">
                      <span className="text-xl group-hover:text-blue-400 transition-colors"><group.icon /></span>
                      {sidebarOpen && <span className="ml-4 text-sm font-bold tracking-tight">{group.name}</span>}
                    </div>
                    {sidebarOpen && (
                      <MdExpandMore
                        size={18}
                        className={`transition-transform duration-300 ${group.state ? 'rotate-180' : ''} opacity-50`}
                      />
                    )}
                  </button>

                  {/* Submenu */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${group.state && sidebarOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                    data-dropdown={group.type}
                  >
                    <div className="pl-12 pr-2 py-1 space-y-1 border-l border-slate-800 ml-6 my-1">
                      {group.items.map((subItem) => (
                        <button
                          key={subItem.id}
                          onClick={() => {
                            setActiveMenu(subItem.id);
                            navigate(subItem.path);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeMenu === subItem.id
                            ? 'text-blue-400 bg-blue-500/5'
                            : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'
                            }`}
                        >
                          {subItem.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 shrink-0 space-y-1">
          <button
            onClick={() => {
              setActiveMenu('change-password');
              navigate('/change-password');
            }}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer ${activeMenu === 'change-password' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
          >
            <MdLock size={20} />
            {sidebarOpen && <span className="ml-4 text-sm font-bold tracking-tight">Settings</span>}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 cursor-pointer"
          >
            <MdLogout size={20} />
            {sidebarOpen && <span className="ml-4 text-sm font-bold tracking-tight">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header - Fixed at Top */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-20">
          <div>
            <h2 className="text-xl font-black text-slate-800 capitalize tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-600 rounded-full" />
              {activeMenu.replace(/-/g, ' ')}
            </h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Staff Management Panel v2.0</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end border-r border-slate-100 pr-6 gap-0.5">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Server Time</p>
              <p className="text-lg font-black text-blue-600 tabular-nums">
                {currentTime.toLocaleTimeString('en-US', {
                  hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
                })}
              </p>
            </div>

            <div
              onClick={() => navigate('/profile')}
              className="group flex items-center gap-4 cursor-pointer hover:bg-slate-50 p-2 rounded-2xl transition-all active:scale-95 border border-transparent hover:border-slate-200 shadow-sm hover:shadow-md"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-800 group-hover:text-blue-600 transition-colors">Staff_Name</p>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">System Administrator</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg ring-4 ring-white shadow-blue-200 transition-transform group-hover:rotate-6">
                S
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Body - Scrollable */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50 scroll-smooth">
          <div className="max-w-[1600px] mx-auto p-6 md:p-10">
            <Routes>
              <Route path="/dashboard" element={
                <div className="space-y-10 animate-fadeIn">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {stats.map((stat, idx) => (
                      <div key={idx} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group overflow-hidden relative">
                        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-150 transition-transform duration-700">
                          <stat.icon size={120} />
                        </div>
                        <div className="flex items-center gap-6 relative z-10">
                          <div className={`${stat.color} p-4 rounded-2xl text-white shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                            <stat.icon size={26} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.title}</p>
                            <p className="text-3xl font-black text-slate-800 tabular-nums">{stat.count}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Dashboard Insights */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                      <div className="flex items-center justify-between mb-10">
                        <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                          <div className="w-2 h-6 bg-blue-600 rounded-full" />
                          Activity Stream
                        </h3>
                        <button className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50 px-5 py-2.5 rounded-full transition-all">
                          View History
                        </button>
                      </div>
                      <div className="space-y-8">
                        {[
                          { act: 'Admission Application Received', time: '30m ago', icon: MdAppRegistration, clr: 'bg-blue-50 text-blue-600' },
                          { act: 'KYC Documents Verified', time: '1h ago', icon: MdVerifiedUser, clr: 'bg-green-50 text-green-600' },
                          { act: 'Tuition Fee Payment Confirmed', time: '2h ago', icon: MdPayment, clr: 'bg-amber-50 text-amber-600' },
                          { act: 'Bulk Pupil Enrollment 10A', time: '3h ago', icon: MdPeople, clr: 'bg-purple-50 text-purple-600' }
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-5 group">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.clr} group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-sm`}>
                              <item.icon size={22} />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-bold text-slate-800 tracking-tight">{item.act}</p>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 opacity-60 italic">{item.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                      <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-3 mb-10">
                        <div className="w-2 h-6 bg-indigo-600 rounded-full" />
                        Admission Funnel
                      </h3>
                      <div className="space-y-5">
                        {[
                          { stage: 'Prospects', info: '156 Inbound Today', val: 'New', clr: 'bg-blue-600' },
                          { stage: 'Verification', info: '89 Files Pending', val: 'Queue', clr: 'bg-amber-500' },
                          { stage: 'Interviews', info: '45 Sessions Booked', val: 'Active', clr: 'bg-emerald-600' },
                          { stage: 'Onboarding', info: '23 Final Checks', val: 'Done', clr: 'bg-indigo-600' }
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-xl hover:border-transparent transition-all duration-500 cursor-default">
                            <div className="flex items-center gap-5">
                              <div className={`w-1.5 h-10 rounded-full ${item.clr}`} />
                              <div>
                                <p className="font-bold text-slate-800 tracking-tight">{item.stage}</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.info}</p>
                              </div>
                            </div>
                            <div className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] ${item.clr} text-white shadow-lg`}>
                              {item.val}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              } />

              {/* Route Definitions */}
              <Route path="/new-admission" element={<Registration />} />
              <Route path="/admissions" element={<Admissions />} />
              <Route path="/id-card" element={<IdCard />} />
              <Route path="/classes" element={<Classes />} />
              <Route path="/fees" element={<Fees />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/notices" element={<Notices />} />
              <Route path="/upcoming-events" element={<EventCalendar />} />
              <Route path="/add-event" element={<AddEvent />} />
              <Route path="/event-history" element={<CompletedEvents />} />
              <Route path="/alumni-management" element={<AlumniManagement />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/change-password" element={<ChangePassword />} />
              <Route path="/student-profile/:id" element={<StudentProfile />} />

              {/* Modules Grouped Routes */}
              <Route path="/hostel-dashboard" element={<HostelDashboard />} />
              <Route path="/create-hostel" element={<CreateHostel />} />
              <Route path="/room-type-charge" element={<RoomTypeCharges />} />
              <Route path="/room-management" element={<RoomManagement />} />
              <Route path="/hostel-allocation" element={<HostelAllocation />} />
              <Route path="/warden-management" element={<Warden />} />
              <Route path="/hostel-report" element={<HostelReport />} />

              <Route path="/transport-dashboard" element={<TransportDashboard />} />
              <Route path="/vehical-master" element={<VehicleMaster />} />
              <Route path="/driver-master" element={<DriverMaster />} />
              <Route path="/route-master" element={<RouteMaster />} />
              <Route path="/route-stop" element={<RouteStop />} />
              <Route path="/route-charge" element={<RouteCharge />} />
              <Route path="/transport-allocation" element={<TransportAllocation />} />

              <Route path="/exam-schedule" element={<CreateSchedule />} />
              <Route path="/manage-marks" element={<ManageMarks />} />
              <Route path="/grading-system" element={<Grading />} />
              <Route path="/online-exam" element={<OnlineExam />} />

              <Route path="/attendance-process" element={<AttendanceTracker />} />
              <Route path="/attendance-report" element={<AttendanceReports />} />
              <Route path="/leave-management" element={<LeaveManagement />} />

              <Route path="/fee-reports" element={<FeeReports />} />

              <Route path="/e-learning" element={<ELearning />} />
              <Route path="/quiz-manager" element={<QuizManager />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;