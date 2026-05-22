import React, { useState, useEffect } from 'react';
import { MdPayment, MdPending, MdCheckCircle, MdPeople, MdDescription, MdSearch } from 'react-icons/md';
import { feeAPI } from '../utils/apiService';
import { FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Fees = () => {
  const [loading, setLoading] = useState(false);
  const [feeData, setFeeData] = useState([]);
  const [summary, setSummary] = useState({ todayCollection: 0, monthlyCollection: 0, statusWise: [] });
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 0 });
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFees();
  }, [pagination.page, searchTerm, filterStatus]);

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
      toast.error('Could not load fee records');
    } finally {
      setLoading(false);
    }
  };

  const statusWiseTotal = (status) => {
    const statusData = summary.statusWise.find(s => s._id === status);
    return statusData ? statusData.total : 0;
  };

  const statusWiseCount = (status) => {
    const statusData = summary.statusWise.find(s => s._id === status);
    return statusData ? statusData.count : 0;
  };

  const totalPendingCount = statusWiseCount('pending') + statusWiseCount('partial');

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
        <div className="relative z-10">
          <h2 className="text-4xl font-black mb-2 tracking-tight">Fee Records</h2>
          <p className="text-indigo-200 text-lg font-medium">View student fee payments and download receipts</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Card 1: Today's Collection */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
              <MdCheckCircle size={24} />
            </div>
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg uppercase tracking-widest">TODAY</span>
          </div>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Today's Collection</h3>
          <p className="text-3xl font-black text-slate-800 mt-1 tabular-nums">₹{summary.todayCollection.toLocaleString()}</p>
        </div>

        {/* Card 2: Monthly Collection */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <MdPayment size={24} />
            </div>
            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg uppercase tracking-widest">MONTHLY</span>
          </div>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">This Month's Collection</h3>
          <p className="text-3xl font-black text-slate-800 mt-1 tabular-nums">₹{summary.monthlyCollection.toLocaleString()}</p>
        </div>

        {/* Card 3: Pending Dues */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
              <MdPending size={24} />
            </div>
            <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-lg uppercase tracking-widest">DUES</span>
          </div>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Pending & Partial Dues</h3>
          <p className="text-3xl font-black text-slate-800 mt-1 tabular-nums">{totalPendingCount}</p>
          <p className="text-[10px] text-amber-500 font-bold mt-1">{statusWiseCount('pending')} Pending · {statusWiseCount('partial')} Partial</p>
        </div>

        {/* Card 4: Total Transactions */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-slate-50 rounded-xl text-slate-700">
              <MdPeople size={24} />
            </div>
            <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-1 rounded-lg uppercase tracking-widest">TOTAL</span>
          </div>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Transactions</h3>
          <p className="text-3xl font-black text-slate-800 mt-1 tabular-nums">{pagination.total}</p>
          <p className="text-[10px] text-emerald-500 font-bold mt-1">{statusWiseCount('paid')} Fully Paid</p>
        </div>
      </div>

      {/* Records Table */}
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
              placeholder="Search student..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPagination(prev => ({ ...prev, page: 1 }));
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
                <th className="px-8 py-6 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {feeData.map(fee => (
                <tr key={fee._id} className="hover:bg-indigo-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="text-sm font-bold text-slate-800">
                      {`${fee.student?.firstName || ''} ${fee.student?.lastName || ''}`.trim() || 'N/A'}
                    </div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">
                      {fee.student?.admissionNumber || '-'} • {fee.student?.class?.className || '-'}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-600 uppercase tracking-widest border border-slate-200">
                      {fee.feeType || 'General'}
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
                    <div className="flex justify-center">
                      <button
                        onClick={() => window.open(`${import.meta.env.VITE_API_BASE_URL}/api/staff-panel/fee-collection/receipt/${fee._id}?token=${localStorage.getItem('token')}`, '_blank')}
                        className="p-3 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm border border-slate-100"
                        title="Download Receipt"
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
                      <p className="text-[10px] font-black uppercase tracking-[0.3em]">No fee records found</p>
                    </div>
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

export default Fees;
