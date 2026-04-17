import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaChevronLeft, FaChevronRight, FaSpinner, FaFileInvoiceDollar } from 'react-icons/fa';
import { MdClose, MdRefresh, MdAccountBalanceWallet, MdReceiptLong, MdPayments, MdCheckCircle, MdPendingActions } from 'react-icons/md';
import { salaryAPI, teacherAPI, transportAPI } from '../utils/apiService';
import { BASE_URL } from '../utils/api';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const SalaryManagement = () => {
    const [salaries, setSalaries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [staffType, setStaffType] = useState('teacher'); // 'teacher' | 'driver'
    const [teachersList, setTeachersList] = useState([]);
    const [driversList, setDriversList] = useState([]);
    const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
    const itemsPerPage = 8;

    const [formData, setFormData] = useState({
        employeeId: '', 
        employeeName: '',
        month: '',
        baseSalary: '',
        allowances: '',
        deductions: '',
        status: 'Pending',
        paymentDate: ''
    });

    useEffect(() => {
        fetchSalaries();
        if (staffType === 'teacher') fetchTeachers();
        else fetchDrivers();
    }, [currentPage, searchTerm, staffType]);

    const fetchSalaries = async () => {
        try {
            setLoading(true);
            const params = {
                page: currentPage,
                limit: itemsPerPage,
                search: searchTerm
            };
            
            const res = staffType === 'teacher' 
                ? await salaryAPI.getAll(params)
                : await transportAPI.getDriverSalaries(params);

            if (res.data && res.data.data) {
                const data = res.data.data;
                setSalaries(Array.isArray(data) ? data : []);
                const totalCount = res.data.total || data.length;
                setPagination({ 
                    total: totalCount, 
                    totalPages: Math.ceil(totalCount / itemsPerPage) || 1 
                });
            }
        } catch (err) {
            console.error('Fetch error:', err);
            toast.error('Failed to load salary records');
        } finally {
            setLoading(false);
        }
    };

    const fetchTeachers = async () => {
        try {
            const res = await teacherAPI.getAll({ limit: 100 });
            if (res.data && res.data.data && res.data.data.teachers) {
                setTeachersList(res.data.data.teachers);
            }
        } catch (err) {
            console.error('Teacher fetch error:', err);
        }
    };

    const fetchDrivers = async () => {
        try {
            const res = await transportAPI.getDrivers({ limit: 100 });
            if (res.data && res.data.data && res.data.data.drivers) {
                setDriversList(res.data.data.drivers);
            } else if (res.data && res.data.drivers) {
                // Fallback for old format just in case
                setDriversList(res.data.drivers);
            }
        } catch (err) {
            console.error('Driver fetch error:', err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'employeeId') {
            const selectedEmployee = staffType === 'teacher' 
                ? teachersList.find(t => t._id === value)
                : driversList.find(d => d._id === value);

            setFormData(prev => ({ 
                ...prev, 
                employeeId: value,
                employeeName: selectedEmployee ? (selectedEmployee.name || selectedEmployee.driverName) : '',
                baseSalary: selectedEmployee ? (selectedEmployee.salary || prev.baseSalary || 0) : prev.baseSalary
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const calculateNetSalary = () => {
        const base = parseFloat(formData.baseSalary) || 0;
        const allow = parseFloat(formData.allowances) || 0;
        const ded = parseFloat(formData.deductions) || 0;
        return base + allow - ded;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const netSalary = calculateNetSalary();
            let payload;
            if (staffType === 'teacher') {
                payload = { 
                    ...formData, 
                    teacher: formData.employeeId, 
                    teacherName: formData.employeeName,
                    netSalary 
                };
                if (editingId) await salaryAPI.update(editingId, payload);
                else await salaryAPI.create(payload);
            } else {
                payload = { 
                    ...formData, 
                    driverId: formData.employeeId, 
                    driverName: formData.employeeName,
                    netSalary 
                };
                // There's no separate driver update endpoint, upsertSalary acts as both
                await transportAPI.upsertDriverSalary(payload);
            }
            
            toast.success('Salary saved successfully');
            setShowForm(false);
            fetchSalaries();
            resetForm();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save salary record');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (salary) => {
        setFormData({
            employeeId: staffType === 'teacher' ? (salary.teacher?._id || salary.teacher || '') : (salary.driver?._id || salary.driver || ''),
            employeeName: staffType === 'teacher' ? salary.teacherName : salary.driverName,
            month: salary.month,
            baseSalary: salary.baseSalary,
            allowances: salary.allowances,
            deductions: salary.deductions,
            status: salary.status,
            paymentDate: salary.paymentDate ? new Date(salary.paymentDate).toISOString().split('T')[0] : ''
        });
        setEditingId(salary._id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Delete Salary?',
            text: 'This will remove the salary record permanently.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#2563eb',
            cancelButtonColor: '#94a3b8',
            confirmButtonText: 'Yes, Delete',
            background: '#ffffff',
            customClass: {
                title: 'text-sm font-black uppercase tracking-widest text-slate-800',
                content: 'text-xs font-bold text-slate-500',
                confirmButton: 'text-[10px] font-black uppercase tracking-widest px-8 py-3 rounded-xl',
                cancelButton: 'text-[10px] font-black uppercase tracking-widest px-8 py-3 rounded-xl'
            }
        });

        if (result.isConfirmed) {
            try {
                setLoading(true);
                if (staffType === 'teacher') {
                    await salaryAPI.delete(id);
                } else {
                    await transportAPI.deleteDriverSalary(id);
                }
                toast.success('Salary deleted');
                fetchSalaries();
            } catch (err) {
                toast.error('Failed to delete salary');
            } finally {
                setLoading(false);
            }
        }
    };

    const resetForm = () => {
        setFormData({ employeeId: '', employeeName: '', month: '', baseSalary: '', allowances: '', deductions: '', status: 'Pending', paymentDate: '' });
        setEditingId(null);
    };

    const totalPaid = salaries.filter(s => s.status === 'Paid').reduce((sum, s) => sum + (s.netSalary || 0), 0);
    const totalPending = salaries.filter(s => s.status === 'Pending').reduce((sum, s) => sum + (s.netSalary || 0), 0);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header section with Stats */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
                        <div className="w-2.5 h-10 bg-blue-600 rounded-full" />
                        Salary Management
                    </h1>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Manage Staff Payroll and Payments</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => { resetForm(); setShowForm(true); }}
                        className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl hover:bg-blue-700 font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-blue-200 active:scale-95"
                    >
                        <FaPlus /> Add New Salary
                    </button>
                    <button
                        onClick={fetchSalaries}
                        className="p-4 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-all active:rotate-180 duration-500"
                    >
                        <MdRefresh size={20} />
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full -mr-24 -mt-24 blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700" />
                    <div className="relative flex items-center gap-6">
                        <div className="w-16 h-16 bg-emerald-500/20 rounded-3xl flex items-center justify-center text-emerald-400">
                            <MdCheckCircle size={32} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Paid Amount</p>
                            <p className="text-4xl font-black tracking-tight text-white tabular-nums">₹{totalPaid.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full -mr-24 -mt-24 blur-3xl group-hover:bg-amber-500/10 transition-all duration-700" />
                    <div className="relative flex items-center gap-6">
                        <div className="w-16 h-16 bg-amber-500/10 rounded-3xl flex items-center justify-center text-amber-500">
                            <MdPendingActions size={32} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Pending Amount</p>
                            <p className="text-4xl font-black tracking-tight text-slate-800 tabular-nums">₹{totalPending.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                
                {/* Staff Type Selector */}
                <div className="flex bg-slate-50 p-2 rounded-2xl border border-slate-100 gap-2 shrink-0">
                    <button
                        onClick={() => { setStaffType('teacher'); setCurrentPage(1); }}
                        className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${staffType === 'teacher' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Teachers
                    </button>
                    <button
                        onClick={() => { setStaffType('driver'); setCurrentPage(1); }}
                        className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${staffType === 'driver' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Drivers
                    </button>
                </div>

                <div className="relative flex-1 group w-full">
                    <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search Salary Records (Teacher Name or Month)..."
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500/20 focus:bg-white outline-none text-xs font-bold transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Main Table Content */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden relative">
                {loading && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-4">
                            <FaSpinner className="animate-spin text-blue-600" size={40} />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">Loading Salary History...</p>
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{staffType === 'teacher' ? 'Teacher' : 'Driver'}</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Month</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Base Salary</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Deductions</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Net Salary</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {salaries.map((salary) => (
                                <tr key={salary._id} className="hover:bg-slate-50/30 transition-all group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xs overflow-hidden shadow-sm border border-slate-100">
                                                {(staffType === 'teacher' && salary.teacher?.profileImage) ? (
                                                    <img 
                                                        src={salary.teacher.profileImage.startsWith('http') 
                                                            ? salary.teacher.profileImage 
                                                            : `${BASE_URL.replace(/\/$/, '')}/${salary.teacher.profileImage.replace(/\\/g, '/').replace(/^\//, '')}`
                                                        } 
                                                        alt={salary.teacherName} 
                                                        className="w-full h-full object-cover" 
                                                    />
                                                ) : (staffType === 'driver' && salary.driver?.profileImage) ? (
                                                    <img 
                                                        src={salary.driver.profileImage}
                                                        alt={salary.driverName || salary.driver?.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    (staffType === 'teacher' ? (salary.teacherName || 'T') : (salary.driverName || salary.driver?.name || 'D'))[0]
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-slate-800 uppercase tracking-tight">
                                                    {staffType === 'teacher' ? (salary.teacherName || salary.teacher?.name) : (salary.driver?.name || salary.driverName)}
                                                </span>
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                                    {staffType === 'teacher' ? (salary.teacher?.email || 'OFFICIAL RECORD') : (salary.driver?.licenseNo || 'OFFICIAL RECORD')}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-xs font-black text-slate-500 uppercase tracking-widest tabular-nums">
                                        {salary.month}
                                    </td>
                                    <td className="px-8 py-6 text-sm font-black text-slate-800 tabular-nums">
                                        ₹{salary.baseSalary?.toLocaleString()}
                                    </td>
                                    <td className="px-8 py-6 text-xs font-black text-rose-500 tabular-nums">
                                        -₹{salary.deductions?.toLocaleString() || 0}
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-sm font-black text-blue-600 tabular-nums">
                                            ₹{salary.netSalary?.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                            salary.status === 'Paid'
                                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                                            : 'bg-amber-50 text-amber-600 border border-amber-100'
                                        }`}>
                                            {salary.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(salary)}
                                                className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                title="Edit Record"
                                            >
                                                <FaEdit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(salary._id)}
                                                className="p-3 text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                                title="Delete Record"
                                            >
                                                <FaTrash size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-8 py-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Showing {salaries.length} records
                    </p>
                    <div className="flex gap-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition-all"
                        >
                            <FaChevronLeft size={12} />
                        </button>
                        <button
                            disabled={currentPage >= pagination.totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition-all"
                        >
                            <FaChevronRight size={12} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Salary Modal Form */}
            {showForm && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl border border-white/20 animate-in fade-in zoom-in duration-300">
                        <div className="bg-slate-50/80 px-10 py-8 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-black text-slate-800 tracking-tight">
                                    {editingId ? 'Edit Salary Record' : 'Add New Salary'}
                                </h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{staffType === 'teacher' ? 'Teacher' : 'Driver'} Payroll Form</p>
                            </div>
                            <button onClick={() => { setShowForm(false); resetForm(); }} className="p-3 bg-white text-slate-400 hover:text-slate-800 rounded-2xl border border-slate-100 transition-all">
                                <MdClose size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-10 scrollbar-hide max-h-[75vh] overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select {staffType === 'teacher' ? 'Teacher' : 'Driver'}</label>
                                    <select
                                        required
                                        name="employeeId"
                                        value={formData.employeeId}
                                        onChange={handleInputChange}
                                        className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500/20 focus:bg-white outline-none text-xs font-bold transition-all"
                                    >
                                        <option value="">Choose {staffType === 'teacher' ? 'Teacher' : 'Driver'}</option>
                                        {staffType === 'teacher' ? teachersList.map(t => (
                                            <option key={t._id} value={t._id}>{t.name}</option>
                                        )) : driversList.map(d => (
                                            <option key={d._id} value={d._id}>{d.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Salary Month</label>
                                    <input
                                        required
                                        name="month"
                                        value={formData.month}
                                        onChange={handleInputChange}
                                        placeholder="EX: APRIL 2026"
                                        className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500/20 focus:bg-white outline-none text-xs font-bold transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Base Salary (₹)</label>
                                    <input
                                        required
                                        type="number"
                                        name="baseSalary"
                                        value={formData.baseSalary}
                                        onChange={handleInputChange}
                                        className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500/20 focus:bg-white outline-none text-xs font-bold transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Allowances (₹)</label>
                                    <input
                                        type="number"
                                        name="allowances"
                                        value={formData.allowances}
                                        onChange={handleInputChange}
                                        className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500/20 focus:bg-white outline-none text-xs font-bold transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Deductions (₹)</label>
                                    <input
                                        type="number"
                                        name="deductions"
                                        value={formData.deductions}
                                        onChange={handleInputChange}
                                        className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500/20 focus:bg-white outline-none text-xs font-bold transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Payment Status</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500/20 focus:bg-white outline-none text-xs font-bold transition-all uppercase tracking-widest"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Paid">Paid</option>
                                    </select>
                                </div>
                                {formData.status === 'Paid' && (
                                    <div className="space-y-2 col-span-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Payment Date</label>
                                        <input
                                            type="date"
                                            name="paymentDate"
                                            value={formData.paymentDate}
                                            onChange={handleInputChange}
                                            className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500/20 focus:bg-white outline-none text-xs font-bold transition-all"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-100 flex items-center justify-between">
                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Final Amount to Pay:</span>
                                <span className="text-2xl font-black text-blue-900 tabular-nums">₹{calculateNetSalary().toLocaleString()}</span>
                            </div>

                            <div className="mt-10 flex gap-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-blue-600 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-95 disabled:opacity-50"
                                >
                                    {loading ? <FaSpinner className="animate-spin mx-auto" /> : (editingId ? 'Update Record' : 'Add Salary')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-8 py-5 border-2 border-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-50 hover:text-slate-600 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SalaryManagement;
