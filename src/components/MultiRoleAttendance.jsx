import React, { useState, useEffect } from 'react';
import { 
    FaChalkboardTeacher, FaBus, FaUserShield, FaBook, FaMoneyBillWave,
    FaSearch, FaCalendarAlt, FaSave, FaUsers
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import api from '../utils/api';

const MultiRoleAttendance = () => {
    const [roles, setRoles] = useState([
        { id: 'teacher', name: 'Teacher', icon: FaChalkboardTeacher },
        { id: 'feeadmin', name: 'Fee Admin', icon: FaMoneyBillWave },
        { id: 'driver', name: 'Driver', icon: FaBus },
        { id: 'warden', name: 'Warden', icon: FaUserShield },
        { id: 'librarian', name: 'Librarian', icon: FaBook },
    ]);
    const [selectedRole, setSelectedRole] = useState('teacher');
    const [staffList, setStaffList] = useState([]);
    const [attendance, setAttendance] = useState({}); 
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeMode, setActiveMode] = useState('manual');

    useEffect(() => {
        fetchStaff();
        fetchActiveMode();
    }, [selectedRole, date]);

    const fetchActiveMode = async () => {
        try {
            const { data } = await api.get('/api/staff-panel/attendance-config/settings');
            if (data.success) {
                setActiveMode(data.data.staffMode || 'manual');
            }
        } catch (error) {
            console.error('Failed to fetch mode', error);
        }
    };

    const fetchStaff = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/api/staff-panel/attendance-staff/list?role=${selectedRole}&date=${date}`);
            if (data.success) {
                setStaffList(data.data);
                const initial = {};
                data.data.forEach(s => initial[s._id] = s.status || 'Present');
                setAttendance(initial);
            }
        } catch (error) {
            toast.error('Failed to load staff list');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (staffId, status) => {
        setAttendance(prev => ({ ...prev, [staffId]: status }));
    };

    const markAll = (status) => {
        const updated = {};
        staffList.forEach(s => updated[s._id] = status);
        setAttendance(updated);
    };

    const handleSubmit = async () => {
        try {
            const attendanceData = Object.keys(attendance).map(id => ({
                staffId: id,
                role: selectedRole,
                status: attendance[id]
            }));

            const { data } = await api.post('/api/staff-panel/attendance-staff/mark', {
                attendanceData,
                date
            });

            if (data.success) {
                Swal.fire('Success', 'Attendance marked successfully', 'success');
            }
        } catch (error) {
            toast.error('Failed to save attendance');
        }
    };

    const filteredStaff = staffList.filter(s => 
        (s.name?.toLowerCase().includes(searchTerm.toLowerCase())) || 
        (s.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b pb-6 gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-2xl font-bold text-gray-800">Staff Attendance Records</h1>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 border ${
                                activeMode === 'manual' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                activeMode === 'biometric' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                activeMode === 'hybrid' ? 'bg-green-50 text-green-600 border-green-100' :
                                'bg-orange-50 text-orange-600 border-orange-100'
                            }`}>
                                <div className={`w-1 h-1 rounded-full animate-pulse ${
                                    activeMode === 'manual' ? 'bg-blue-600' :
                                    activeMode === 'biometric' ? 'bg-purple-600' :
                                    activeMode === 'hybrid' ? 'bg-green-600' :
                                    'bg-orange-600'
                                }`}></div>
                                {activeMode.charAt(0).toUpperCase() + activeMode.slice(1)} Mode Live
                            </span>
                        </div>
                        <p className="text-gray-500 text-sm">Mark and manage daily attendance for school personnel</p>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
                        <FaCalendarAlt className="text-gray-400" />
                        <input 
                            type="date" 
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="bg-transparent border-none outline-none font-semibold text-gray-700"
                        />
                    </div>
                </div>

                {/* Role Tabs */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {roles.map(role => (
                        <button
                            key={role.id}
                            onClick={() => setSelectedRole(role.id)}
                            className={`flex items-center gap-2 px-5 py-3 rounded-lg transition-all font-medium ${
                                selectedRole === role.id 
                                ? 'bg-blue-600 text-white shadow-md' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            <role.icon />
                            {role.name}
                        </button>
                    ))}
                </div>

                {/* Search and Bulk Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            placeholder="Search by name or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => markAll('Present')} className="flex-1 bg-green-50 text-green-700 border border-green-200 py-2 rounded-lg font-bold text-xs uppercase hover:bg-green-100 transition-all">All Present</button>
                        <button onClick={() => markAll('Absent')} className="flex-1 bg-red-50 text-red-700 border border-red-200 py-2 rounded-lg font-bold text-xs uppercase hover:bg-red-100 transition-all">All Absent</button>
                    </div>
                    <button 
                        onClick={handleSubmit}
                        className="flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 px-6 rounded-lg font-bold hover:bg-blue-700 transition-all"
                    >
                        <FaSave /> SAVE RECORDS
                    </button>
                </div>

                {/* Staff List Table */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Staff Information</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Mode</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">ID</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">Mark Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredStaff.length > 0 ? filteredStaff.map((staff) => (
                                <tr key={staff._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs uppercase">
                                                {staff.name.charAt(0)}
                                            </div>
                                            <span className="font-semibold text-gray-700">{staff.name}</span>
                                        </div>
                                    </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-[10px] font-bold uppercase tracking-wider">
                                        {staff.source || 'Manual'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-500">#{staff.employeeId}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-2">
                                            {['Present', 'Absent', 'Late'].map((status) => (
                                                <button
                                                    key={status}
                                                    onClick={() => handleStatusChange(staff._id, status)}
                                                    className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
                                                        attendance[staff._id]?.toLowerCase() === status.toLowerCase()
                                                        ? status === 'Present' ? 'bg-green-600 border-green-600 text-white' :
                                                          status === 'Absent' ? 'bg-red-600 border-red-600 text-white' :
                                                          'bg-yellow-500 border-yellow-500 text-white'
                                                        : 'bg-white text-gray-400 border-gray-200 hover:border-gray-400'
                                                    }`}
                                                >
                                                    {status}
                                                </button>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="3" className="px-6 py-12 text-center text-gray-400">
                                        <FaUsers className="text-3xl mx-auto mb-2 opacity-20" />
                                        No staff members found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MultiRoleAttendance;
