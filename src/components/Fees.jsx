import React, { useState, useEffect } from 'react';
import { MdPayment, MdPending, MdCheckCircle, MdPeople, MdDescription, MdSearch, MdFilterList } from 'react-icons/md';
import { feeAPI, studentAPI } from '../utils/apiService';
import { FaSpinner, FaExclamationCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Fees = () => {
  const [loading, setLoading] = useState(false);
  const [feeData, setFeeData] = useState([]);
  const [summary, setSummary] = useState({ todayCollection: 0, monthlyCollection: 0, statusWise: [] });
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 0 });
  const [showCollectModal, setShowCollectModal] = useState(false);
  const [collectForm, setCollectForm] = useState({
    studentId: '',
    feeType: 'Tuition Fee',
    amount: '',
    amountPaid: '',
    paymentMode: 'Cash',
    transactionId: '',
    remarks: ''
  });
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState(''); // Added search state
  const [verifiedStudent, setVerifiedStudent] = useState(null);
  const [formErrors, setFormErrors] = useState({}); // New state for validation
  const [searchResults, setSearchResults] = useState([]); // Autocomplete results
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchFees();
  }, [pagination.page, searchTerm, filterStatus]);

  // REAL-TIME AUTOCOMPLETE SEARCH
  useEffect(() => {
    const timer = setTimeout(async () => {
      const query = collectForm.studentId.trim();
      if (query.length >= 3 && !verifiedStudent) {
        try {
          setIsSearching(true);
          const res = await studentAPI.getEnrollmentList({ search: query, limit: 5 });
          setSearchResults(res.data.students || []);
        } catch (err) {
          console.error('Autocomplete failure', err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [collectForm.studentId, verifiedStudent]);

  const handleSelectStudent = async (student) => {
    try {
      setLoading(true);
      const res = await feeAPI.getStudentDetails(student._id);
      if (res.data) {
        setVerifiedStudent(res.data);
        setCollectForm(prev => ({
          ...prev,
          studentId: res.data.student.admissionNumber,
          amount: res.data.totalPending || 0
        }));
        setSearchResults([]);
        toast.success(`STUDENT IDENTIFIED: ${res.data.student.firstName} ${res.data.student.lastName}`);
      }
    } catch (err) {
      toast.error('Identification sync failure');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyStudent = async () => {
    const searchTerm = collectForm.studentId.trim();
    if (!searchTerm) {
      toast.warning('Please enter a Search Term (ID, Mobile, or Name)');
      return;
    }

    try {
      setLoading(true);
      let targetId = searchTerm;

      // DETECT SEARCH MODE: If not a MongoDB ObjectID, perform a lookup first
      const isObjectId = /^[0-9a-fA-H]{24}$/i.test(searchTerm);

      if (!isObjectId) {
        toast.info('Initiating multi-parameter registry search...', { autoClose: 1000 });
        const searchRes = await studentAPI.getEnrollmentList({ search: searchTerm, limit: 1 });
        const students = searchRes.data.students || searchRes.data;

        if (!students || students.length === 0) {
          throw new Error('No matching student found for this search term.');
        }

        targetId = students[0]._id;
      }

      // EXECUTE CORE FISCAL FETCH
      const res = await feeAPI.getStudentDetails(targetId);
      if (res.data) {
        setVerifiedStudent(res.data);
        setCollectForm(prev => ({
          ...prev,
          studentId: res.data.student.admissionNumber, // Keep human-readable ID
          amount: res.data.totalPending || 0
        }));
        toast.success(`STUDENT IDENTIFIED: ${res.data.student.firstName} ${res.data.student.lastName}`);
      }
    } catch (err) {
      console.error('Search/Verification failure:', err);
      toast.error(err.message || 'Identity Verification Failure: Student not found');
      setVerifiedStudent(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchFees = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: 10,
        search: searchTerm,
        status: filterStatus !== 'all' ? filterStatus : undefined
      };
      const res = await feeAPI.getAll(params);
      if (res.data) {
        setFeeData(res.data.fees || []);
        setSummary(res.data.summary);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('Failed to fetch fees:', err);
      toast.error('Institutional fiscal registry inaccessible');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!collectForm.studentId) errors.studentId = 'Student verification required';
    if (!collectForm.amountPaid || Number(collectForm.amountPaid) <= 0) {
      errors.amountPaid = 'Valid payment amount required';
    } else if (Number(collectForm.amountPaid) > Number(collectForm.amount)) {
      errors.amountPaid = `Maximum payable: ₹${collectForm.amount}`;
    }

    if (collectForm.paymentMode === 'Cheque') {
      if (!collectForm.chequeNumber) errors.chequeNumber = 'Cheque number required';
      if (!collectForm.bankName) errors.bankName = 'Bank name required';
    }

    if (['Common Service Point', 'Bank Transfer'].includes(collectForm.paymentMode) && !collectForm.transactionId) {
      errors.transactionId = 'Transaction reference required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCollectSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('VALIDATION ERROR: Please fix the errors in the protocol.');
      return;
    }

    try {
      setLoading(true);
      await feeAPI.collect({
        ...collectForm,
        studentId: verifiedStudent?.student._id || collectForm.studentId
      });
      toast.success('FISCAL MANIFEST UPDATED: Fee collection manifested successfully! 💰');
      setShowCollectModal(false);
      setVerifiedStudent(null);
      setCollectForm({
        studentId: '',
        feeType: 'Tuition Fee',
        amount: 0,
        amountPaid: 0,
        paymentMode: 'Cash',
        transactionId: '',
        chequeNumber: '',
        bankName: '',
        remarks: ''
      });
      fetchFees();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Collection protocol failure');
    } finally {
      setLoading(false);
    }
  };

  const statusWiseTotal = (status) => {
    const statusData = summary.statusWise.find(s => s._id === status);
    return statusData ? statusData.total : 0;
  };

  return (
    <div className="space-y-10">
      {loading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <FaSpinner className="animate-spin text-blue-500 text-5xl" />
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <MdPayment size={120} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-4xl font-black mb-2 tracking-tight">Fee Collection Center</h2>
            <p className="text-indigo-200 text-lg font-medium">Manage student fees, track payments, and generate receipts</p>
          </div>
          <button
            onClick={() => setShowCollectModal(true)}
            className="px-8 py-3 bg-white text-slate-900 rounded-xl font-black text-[12px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all shadow-xl shadow-slate-900/20 flex items-center gap-3"
          >
            <MdPayment size={18} />
            Collect Fee
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
              <MdCheckCircle size={24} />
            </div>
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg uppercase tracking-widest">LIVE</span>
          </div>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Today's Total</h3>
          <p className="text-3xl font-black text-slate-800 mt-1 tabular-nums">₹{summary.todayCollection.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <MdPayment size={24} />
            </div>
            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg uppercase tracking-widest">MONTHLY</span>
          </div>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">This Month</h3>
          <p className="text-3xl font-black text-slate-800 mt-1 tabular-nums">₹{summary.monthlyCollection.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
              <MdPending size={24} />
            </div>
            <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-lg uppercase tracking-widest">PARTIAL</span>
          </div>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Pending</h3>
          <p className="text-3xl font-black text-slate-800 mt-1 tabular-nums">₹{statusWiseTotal('partial').toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-slate-50 rounded-xl text-slate-700">
              <MdPeople size={24} />
            </div>
            <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-1 rounded-lg uppercase tracking-widest">RECORDS</span>
          </div>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Records</h3>
          <p className="text-3xl font-black text-slate-800 mt-1 tabular-nums">{pagination.total}</p>
        </div>
      </div>

      {/* Registry Table */}
      <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50/30">
          <div className="flex gap-4 w-full md:w-auto">
            {['all', 'paid', 'partial', 'pending'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-6 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all border ${filterStatus === status
                    ? 'bg-slate-900 text-white border-slate-900 shadow-lg'
                    : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50'
                  }`}
              >
                {status} List
              </button>
            ))}
          </div>

          <div className="relative group w-full md:w-72">
            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
            <input
              type="text"
              placeholder="SEARCH STUDENT..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on search
              }}
              onKeyUp={(e) => e.key === 'Enter' && fetchFees()}
              className="w-full pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl outline-none font-black text-[10px] tracking-widest focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50/50 transition-all shadow-sm"
            />
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
              disabled={pagination.page === 1}
              className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl disabled:opacity-30 hover:bg-slate-50 font-black text-[10px] uppercase tracking-widest transition-all shadow-sm"
            >Prev</button>
            <div className="flex items-center px-4 font-black text-slate-600 text-[10px] uppercase tracking-widest bg-slate-100/50 rounded-xl">
              Page {pagination.page} of {pagination.totalPages || 1}
            </div>
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
              disabled={pagination.page >= pagination.totalPages}
              className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl disabled:opacity-30 hover:bg-slate-50 font-black text-[10px] uppercase tracking-widest transition-all shadow-sm"
            >Next</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50/50">
                <th className="px-8 py-6">Student Name</th>
                <th className="px-8 py-6">Fee Type</th>
                <th className="px-8 py-6 text-right">Total Fee</th>
                <th className="px-8 py-6 text-right">Collected</th>
                <th className="px-8 py-6 text-right">Balance</th>
                <th className="px-8 py-6 text-center">Status</th>
                <th className="px-8 py-6">Date</th>
                <th className="px-8 py-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {feeData.map(fee => (
                <tr key={fee._id} className="hover:bg-indigo-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="text-sm font-bold text-slate-800">
                      {`${fee.student?.firstName || ''} ${fee.student?.lastName || ''}`.trim() || 'ANONYMOUS'}
                    </div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">
                      {fee.student?.admissionNumber || 'UNASSIGNED'} • {fee.student?.class?.className || 'GENERAL'}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-600 uppercase tracking-widest border border-slate-200">
                      {fee.feeType || 'CONSOLIDATED'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm font-black text-slate-700 text-right tabular-nums">₹{fee.amount.toLocaleString()}</td>
                  <td className="px-8 py-6 text-sm font-black text-emerald-600 text-right tabular-nums">₹{fee.amountPaid.toLocaleString()}</td>
                  <td className="px-8 py-6 text-sm font-black text-rose-500 text-right tabular-nums">₹{(fee.balance || (fee.amount - fee.amountPaid)).toLocaleString()}</td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm border ${fee.status === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                          fee.status === 'partial' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                            'bg-red-50 text-red-700 border-red-100'
                        }`}>
                        {fee.status === 'paid' ? <MdCheckCircle size={14} /> : <MdPending size={14} />}
                        {fee.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{fee.paymentDate ? new Date(fee.paymentDate).toLocaleDateString() : 'N/A'}</div>
                    <div className="text-[9px] font-bold text-slate-400 mt-1">{fee.paymentDate ? new Date(fee.paymentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => window.open(`${import.meta.env.VITE_API_BASE_URL}/api/staff-panel/fee-collection/receipt/${fee._id}?token=${localStorage.getItem('token')}`, '_blank')}
                        className="p-3 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm border border-slate-100"
                        title="Institutional Receipt"
                      >
                        <MdDescription size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {feeData.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-30">
                      <MdPayment size={64} className="text-slate-200" />
                      <p className="text-[10px] font-black uppercase tracking-[0.3em]">Institutional Fiscal Registry Empty</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Collect Fee Modal */}
      {showCollectModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-10 max-w-2xl w-full shadow-2xl border border-indigo-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50 rounded-full -mr-24 -mt-24 opacity-50" />

            <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
              <MdPayment className="text-indigo-600" size={32} /> Collect New Fee
            </h3>

            <form onSubmit={handleCollectSubmit} className="space-y-6 relative z-10">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Search Student (ID, Mobile, or Name)</label>
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        required
                        placeholder="NAME / ID / MOBILE..."
                        value={collectForm.studentId}
                        onChange={(e) => {
                          setCollectForm({ ...collectForm, studentId: e.target.value });
                          if (verifiedStudent) setVerifiedStudent(null);
                        }}
                        className={`w-full px-5 py-3 bg-slate-50 border ${formErrors.studentId ? 'border-red-500' : 'border-slate-100'} rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 transition-all`}
                      />

                      {/* AUTOCOMPLETE DROPDOWN */}
                      {searchResults.length > 0 && (
                        <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                          {searchResults.map((student) => (
                            <button
                              key={student._id}
                              type="button"
                              onClick={() => handleSelectStudent(student)}
                              className="w-full px-5 py-4 text-left hover:bg-indigo-50 border-b border-slate-50 last:border-0 flex items-center justify-between transition-colors group/item"
                            >
                              <div>
                                <div className="text-sm font-bold text-slate-800 group-hover/item:text-indigo-600 transition-colors">
                                  {student.firstName} {student.lastName}
                                </div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                  {student.class?.className} • {student.admissionNumber}
                                </div>
                              </div>
                              <MdCheckCircle className="text-slate-200 group-hover/item:text-emerald-500 transition-colors" size={20} />
                            </button>
                          ))}
                        </div>
                      )}

                      {isSearching && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          <FaSpinner className="animate-spin text-indigo-400" />
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleVerifyStudent}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                    >
                      Verify
                    </button>
                  </div>
                </div>

                {verifiedStudent && (
                  <div className="col-span-2 bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 flex justify-between items-center transition-all animate-in fade-in slide-in-from-top-2">
                    <div>
                      <div className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Authorized Identity</div>
                      <div className="text-sm font-bold text-slate-800">
                        {verifiedStudent.student.firstName} {verifiedStudent.student.lastName}
                      </div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        Class: {verifiedStudent.student.class?.className || 'N/A'} • Adm No: {verifiedStudent.student.admissionNumber}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Pending Balance</div>
                      <div className="text-xl font-black text-rose-600 tabular-nums">₹{verifiedStudent.totalPending.toLocaleString()}</div>
                    </div>
                  </div>
                )}
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Fiscal Category</label>
                  <select
                    value={collectForm.feeType}
                    onChange={(e) => setCollectForm({ ...collectForm, feeType: e.target.value })}
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 appearance-none"
                  >
                    {(!verifiedStudent?.assignedStructure || verifiedStudent.assignedStructure.length === 0) && (
                      <option value="Miscellaneous">INSTITUTIONAL MISCELLANEOUS</option>
                    )}
                    {Array.isArray(verifiedStudent?.assignedStructure) && verifiedStudent.assignedStructure.map((mapping, idx) => {
                      const name = mapping.fee?.feeName || 'Untitled Fee';
                      return <option key={idx} value={name}>{name.toUpperCase()}</option>;
                    })}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Target Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={collectForm.amount}
                    onChange={(e) => setCollectForm({ ...collectForm, amount: e.target.value })}
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Manifested Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={collectForm.amountPaid}
                    onChange={(e) => setCollectForm({ ...collectForm, amountPaid: e.target.value })}
                    className={`w-full px-5 py-3 bg-slate-50 border ${formErrors.amountPaid ? 'border-red-500' : 'border-slate-100'} rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800`}
                  />
                  {formErrors.amountPaid && <p className="text-red-500 text-[9px] mt-1 font-bold flex items-center gap-1"><FaExclamationCircle /> {formErrors.amountPaid}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Payment Protocol</label>
                  <select
                    value={collectForm.paymentMode}
                    onChange={(e) => setCollectForm({ ...collectForm, paymentMode: e.target.value })}
                    className={`w-full px-5 py-3 bg-slate-50 border ${formErrors.paymentMode ? 'border-red-500' : 'border-slate-100'} rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 appearance-none`}
                  >
                    <option value="Cash">Institutional Cash</option>
                    <option value="Common Service Point">CSP / UPI</option>
                    <option value="Cheque">Bank Cheque</option>
                    <option value="Bank Transfer">NEFT / RTGS</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Transaction Identity</label>
                  <input
                    type="text"
                    placeholder="Ref No / Txn ID"
                    value={collectForm.transactionId}
                    onChange={(e) => setCollectForm({ ...collectForm, transactionId: e.target.value })}
                    className={`w-full px-5 py-3 bg-slate-50 border ${formErrors.transactionId ? 'border-red-500' : 'border-slate-100'} rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800`}
                  />
                  {formErrors.transactionId && <p className="text-red-500 text-[9px] mt-1 font-bold flex items-center gap-1"><FaExclamationCircle /> {formErrors.transactionId}</p>}
                </div>
              </div>

              {collectForm.paymentMode === 'Cheque' && (
                <div className="grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Cheque Number</label>
                    <input
                      type="text"
                      value={collectForm.chequeNumber}
                      onChange={(e) => setCollectForm({ ...collectForm, chequeNumber: e.target.value })}
                      placeholder="XXXXXX"
                      className={`w-full px-5 py-3 bg-slate-50 border ${formErrors.chequeNumber ? 'border-red-500' : 'border-slate-100'} rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800`}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Bank Name</label>
                    <input
                      type="text"
                      value={collectForm.bankName}
                      onChange={(e) => setCollectForm({ ...collectForm, bankName: e.target.value })}
                      placeholder="Bank Name"
                      className={`w-full px-5 py-3 bg-slate-50 border ${formErrors.bankName ? 'border-red-500' : 'border-slate-100'} rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800`}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Manifest Remarks</label>
                <textarea
                  rows="2"
                  value={collectForm.remarks}
                  onChange={(e) => setCollectForm({ ...collectForm, remarks: e.target.value })}
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 resize-none"
                ></textarea>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCollectModal(false)}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-200 transition-all"
                >
                  Cancel Manifest
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 py-4 ${loading ? 'bg-slate-400' : 'bg-slate-900 hover:bg-indigo-600'} text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2`}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Manifesting...
                    </>
                  ) : (
                    'Execute Collection'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fees;
