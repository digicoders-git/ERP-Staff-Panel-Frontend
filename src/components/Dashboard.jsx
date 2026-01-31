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
              onClick={() => {
                setActiveMenu(item.id);
                navigate(item.path);
              }}
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
              onClick={() => handleDropdownClick('hostel', setHostelDropdownOpen, hostelDropdownOpen)}
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

            <div className={`bg-slate-800/50 transition-all duration-300 ease-in-out ${hostelDropdownOpen && sidebarOpen ? 'h-auto opacity-100' : 'h-0 opacity-0 overflow-hidden'}`} data-dropdown="hostel">
              {hostelItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveMenu(item.id);
                    navigate(item.path);
                  }}
                  className={`w-full flex items-center px-12 py-2 text-left hover:bg-slate-700/50 transition duration-200 cursor-pointer ${activeMenu === item.id ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-400' : 'text-slate-400 hover:text-white'
                    }`}
                >
                  <span className="text-lg mr-3"><item.icon /></span>
                  <span className="font-medium text-sm">{item.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Transport Dropdown */}
          <div>
            <button
              onClick={() => handleDropdownClick('transport', setTransportDropdownOpen, transportDropdownOpen)}
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

            <div className={`bg-slate-800/50 transition-all duration-300 ease-in-out ${transportDropdownOpen && sidebarOpen ? 'h-auto opacity-100' : 'h-0 opacity-0 overflow-hidden'}`} data-dropdown="transport">
              {transportItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveMenu(item.id);
                    navigate(item.path);
                  }}
                  className={`w-full flex items-center px-12 py-2 text-left hover:bg-slate-700/50 transition duration-200 cursor-pointer ${activeMenu === item.id ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-400' : 'text-slate-400 hover:text-white'
                    }`}
                >
                  <span className="text-lg mr-3"><item.icon /></span>
                  <span className="font-medium text-sm">{item.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Exam Management Dropdown */}
          <div>
            <button
              onClick={() => handleDropdownClick('exam', setExamDropdownOpen, examDropdownOpen)}
              className={`w-full flex items-center justify-between px-6 py-3 text-left hover:bg-slate-700/50 transition duration-200 cursor-pointer ${examItems.some(item => item.id === activeMenu) ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-r-4 border-blue-400 text-blue-400' : 'text-slate-300 hover:text-white'
                }`}
              title={!sidebarOpen ? 'Exam Management' : ''}
            >
              <div className="flex items-center">
                <span className="text-xl mr-3"><MdSchedule /></span>
                {sidebarOpen && <span className="font-medium">Exam Management</span>}
              </div>
              {sidebarOpen && (
                <span className="text-lg">
                  {examDropdownOpen ? <MdExpandLess /> : <MdExpandMore />}
                </span>
              )}
            </button>

            <div className={`bg-slate-800/50 transition-all duration-300 ease-in-out ${examDropdownOpen && sidebarOpen ? 'h-auto opacity-100' : 'h-0 opacity-0 overflow-hidden'}`} data-dropdown="exam">
              {examItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveMenu(item.id);
                    navigate(item.path);
                  }}
                  className={`w-full flex items-center px-12 py-2 text-left hover:bg-slate-700/50 transition duration-200 cursor-pointer ${activeMenu === item.id ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-400' : 'text-slate-400 hover:text-white'
                    }`}
                >
                  <span className="text-lg mr-3"><item.icon /></span>
                  <span className="font-medium text-sm">{item.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Staff Attendance Dropdown */}
          <div>
            <button
              onClick={() => handleDropdownClick('staff-attendance', setStaffAttendanceDropdownOpen, staffAttendanceDropdownOpen)}
              className={`w-full flex items-center justify-between px-6 py-3 text-left hover:bg-slate-700/50 transition duration-200 cursor-pointer ${staffAttendanceItems.some(item => item.id === activeMenu) ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-r-4 border-blue-400 text-blue-400' : 'text-slate-300 hover:text-white'
                }`}
              title={!sidebarOpen ? 'Staff Attendance' : ''}
            >
              <div className="flex items-center">
                <span className="text-xl mr-3"><MdAccessAlarm /></span>
                {sidebarOpen && <span className="font-medium">Staff Attendance</span>}
              </div>
              {sidebarOpen && (
                <span className="text-lg">
                  {staffAttendanceDropdownOpen ? <MdExpandLess /> : <MdExpandMore />}
                </span>
              )}
            </button>

            <div className={`bg-slate-800/50 transition-all duration-300 ease-in-out ${staffAttendanceDropdownOpen && sidebarOpen ? 'h-auto opacity-100' : 'h-0 opacity-0 overflow-hidden'}`} data-dropdown="staff-attendance">
              {staffAttendanceItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveMenu(item.id);
                    navigate(item.path);
                  }}
                  className={`w-full flex items-center px-12 py-2 text-left hover:bg-slate-700/50 transition duration-200 cursor-pointer ${activeMenu === item.id ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-400' : 'text-slate-400 hover:text-white'
                    }`}
                >
                  <span className="text-lg mr-3"><item.icon /></span>
                  <span className="font-medium text-sm">{item.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Fee Reports Dropdown */}
          <div>
            <button
              onClick={() => handleDropdownClick('fee-reports', setFeeReportsDropdownOpen, feeReportsDropdownOpen)}
              className={`w-full flex items-center justify-between px-6 py-3 text-left hover:bg-slate-700/50 transition duration-200 cursor-pointer ${feeReportsItems.some(item => item.id === activeMenu) ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-r-4 border-blue-400 text-blue-400' : 'text-slate-300 hover:text-white'
                }`}
              title={!sidebarOpen ? 'Fee Reports' : ''}
            >
              <div className="flex items-center">
                <span className="text-xl mr-3"><MdBarChart /></span>
                {sidebarOpen && <span className="font-medium">Fee Reports</span>}
              </div>
              {sidebarOpen && (
                <span className="text-lg">
                  {feeReportsDropdownOpen ? <MdExpandLess /> : <MdExpandMore />}
                </span>
              )}
            </button>

            <div className={`bg-slate-800/50 transition-all duration-300 ease-in-out ${feeReportsDropdownOpen && sidebarOpen ? 'h-auto opacity-100' : 'h-0 opacity-0 overflow-hidden'}`} data-dropdown="fee-reports">
              {feeReportsItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveMenu(item.id);
                    navigate(item.path);
                  }}
                  className={`w-full flex items-center px-12 py-2 text-left hover:bg-slate-700/50 transition duration-200 cursor-pointer ${activeMenu === item.id ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-400' : 'text-slate-400 hover:text-white'
                    }`}
                >
                  <span className="text-lg mr-3"><item.icon /></span>
                  <span className="font-medium text-sm">{item.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* E-Learning Dropdown */}
          <div>
            <button
              onClick={() => handleDropdownClick('e-learning', setELearningDropdownOpen, eLearningDropdownOpen)}
              className={`w-full flex items-center justify-between px-6 py-3 text-left hover:bg-slate-700/50 transition duration-200 cursor-pointer ${eLearningItems.some(item => item.id === activeMenu) ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-r-4 border-blue-400 text-blue-400' : 'text-slate-300 hover:text-white'
                }`}
              title={!sidebarOpen ? 'E-Learning' : ''}
            >
              <div className="flex items-center">
                <span className="text-xl mr-3"><MdPlayCircle /></span>
                {sidebarOpen && <span className="font-medium">E-Learning</span>}
              </div>
              {sidebarOpen && (
                <span className="text-lg">
                  {eLearningDropdownOpen ? <MdExpandLess /> : <MdExpandMore />}
                </span>
              )}
            </button>

            <div className={`bg-slate-800/50 transition-all duration-300 ease-in-out ${eLearningDropdownOpen && sidebarOpen ? 'h-auto opacity-100' : 'h-0 opacity-0 overflow-hidden'}`} data-dropdown="e-learning">
              {eLearningItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveMenu(item.id);
                    navigate(item.path);
                  }}
                  className={`w-full flex items-center px-12 py-2 text-left hover:bg-slate-700/50 transition duration-200 cursor-pointer ${activeMenu === item.id ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-400' : 'text-slate-400 hover:text-white'
                    }`}
                >
                  <span className="text-lg mr-3"><item.icon /></span>
                  <span className="font-medium text-sm">{item.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Event Calendar Dropdown */}
          <div>
            <button
              onClick={() => handleDropdownClick('event', setEventDropdownOpen, eventDropdownOpen)}
              className={`w-full flex items-center justify-between px-6 py-3 text-left hover:bg-slate-700/50 transition duration-200 cursor-pointer ${eventItems.some(item => item.id === activeMenu) ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-r-4 border-blue-400 text-blue-400' : 'text-slate-300 hover:text-white'
                }`}
              title={!sidebarOpen ? 'Events' : ''}
            >
              <div className="flex items-center">
                <span className="text-xl mr-3"><MdEvent /></span>
                {sidebarOpen && <span className="font-medium">Event Calendar</span>}
              </div>
              {sidebarOpen && (
                <span className="text-lg">
                  {eventDropdownOpen ? <MdExpandLess /> : <MdExpandMore />}
                </span>
              )}
            </button>

            <div className={`bg-slate-800/50 transition-all duration-300 ease-in-out ${eventDropdownOpen && sidebarOpen ? 'h-auto opacity-100' : 'h-0 opacity-0 overflow-hidden'}`} data-dropdown="event">
              {eventItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveMenu(item.id);
                    navigate(item.path);
                  }}
                  className={`w-full flex items-center px-12 py-2 text-left hover:bg-slate-700/50 transition duration-200 cursor-pointer ${activeMenu === item.id ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-400' : 'text-slate-400 hover:text-white'
                    }`}
                >
                  <span className="text-lg mr-3"><item.icon /></span>
                  <span className="font-medium text-sm">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>
        {/* Logout Button */}
        <div className="p-6 border-t border-slate-700">
          <button
            onClick={() => {
              setActiveMenu('change-password');
              navigate('/change-password');
            }}
            className={`w-full flex items-center px-4 py-3 mb-3 rounded-lg transition duration-200 cursor-pointer ${activeMenu === 'change-password' ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-400' : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`}
            title={!sidebarOpen ? 'Change Password' : ''}
          >
            <span className="text-xl mr-3"><MdLock /></span>
            {sidebarOpen && <span className="font-medium">Change Password</span>}
          </button>
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
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Dashboard Content with top margin for fixed navbar */}
        <main className="flex-1 pt-24 overflow-y-auto">
          <div className="p-4 sm:p-6" style={{ width: sidebarOpen ? 'calc(100vw - 256px)' : 'calc(100vw - 64px)' }}>
            <Routes>
              <Route path="/dashboard" element={
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
              } />
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

              {/* Hostel Routes */}
              <Route path="/hostel-dashboard" element={<HostelDashboard />} />
              <Route path="/create-hostel" element={<CreateHostel />} />
              <Route path="/room-type-charge" element={<RoomTypeCharges />} />
              <Route path="/room-management" element={<RoomManagement />} />
              <Route path="/hostel-allocation" element={<HostelAllocation />} />
              <Route path="/warden-management" element={<Warden />} />
              <Route path="/hostel-report" element={<HostelReport />} />

              {/* Transport Routes */}
              <Route path="/transport-dashboard" element={<TransportDashboard />} />
              <Route path="/vehical-master" element={<VehicleMaster />} />
              <Route path="/driver-master" element={<DriverMaster />} />
              <Route path="/route-master" element={<RouteMaster />} />
              <Route path="/route-stop" element={<RouteStop />} />
              <Route path="/route-charge" element={<RouteCharge />} />
              <Route path="/transport-allocation" element={<TransportAllocation />} />

              {/* Exam Routes */}
              <Route path="/exam-schedule" element={<CreateSchedule />} />
              <Route path="/manage-marks" element={<ManageMarks />} />
              <Route path="/grading-system" element={<Grading />} />
              <Route path="/online-exam" element={<OnlineExam />} />

              {/* Staff Attendance Routes */}
              <Route path="/attendance-process" element={<AttendanceTracker />} />
              <Route path="/attendance-report" element={<AttendanceReports />} />
              <Route path="/leave-management" element={<LeaveManagement />} />

              {/* Fee Reports Routes */}
              <Route path="/fee-reports" element={<FeeReports />} />

              {/* E-Learning Routes */}
              <Route path="/e-learning" element={<ELearning />} />
              <Route path="/quiz-manager" element={<QuizManager />} />
              <Route path="/student-profile/:id" element={<StudentProfile />} />
            </Routes>

          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;