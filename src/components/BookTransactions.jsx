import React, { useState, useEffect } from 'react';
import { MdSearch, MdCheckCircle, MdWarning, MdBook, MdPeople, MdAdd, MdClose, MdRestore, MdChevronLeft, MdChevronRight, MdRefresh } from 'react-icons/md';
import { libraryAPI } from '../utils/apiService';
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';

const BookTransactions = () => {
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const userRole = localStorage.getItem('userRole');
  const isAdmin = ['branchAdmin', 'superAdmin', 'clientAdmin'].includes(userRole);
  const isLibrarian = userRole === 'libraryAdmin' || isAdmin;

  // Issue Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    book: '', // book ID
    member: '', // member ID
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    issueMethod: 'Manual',
    finePerDay: 5
  });

  useEffect(() => {
    fetchIssuedBooks();
  }, [page]);

  const fetchIssuedBooks = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 10, search: searchTerm };
      const res = await libraryAPI.getIssuedBooks(params);
      if (res.data && res.data.success) {
        setIssuedBooks(res.data.data?.issues || []);
        setPagination({
          total: res.data.data?.totalIssues || 0,
          pages: res.data.data?.totalPages || 1
        });
      }
    } catch (err) {
      console.error('Issue records fetch error:', err);
      toast.error('Failed to load issue records');
      setIssuedBooks([]);
      setPagination({ total: 0, pages: 1 });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      setPage(1);
      fetchIssuedBooks();
    }
  };

  const handleIssueBook = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await libraryAPI.issueBook(formData);
      toast.success('Book issued successfully');
      setIsModalOpen(false);
      fetchIssuedBooks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to issue book');
    } finally {
      setLoading(false);
    }
  };

  const handleReturnBook = async (id) => {
    if (window.confirm('Mark this book as returned?')) {
      try {
        setLoading(true);
        await libraryAPI.returnBook({ issueId: id });
        toast.success('Book returned to library');
        fetchIssuedBooks();
      } catch (err) {
        toast.error('Failed to return book');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-10 bg-slate-50/20 p-2 min-h-screen animate-fadeIn">
      {loading && (
        <div className="fixed inset-0 bg-white/60 flex items-center justify-center z-[75] backdrop-blur-[2px]">
           <FaSpinner className="animate-spin text-indigo-600 text-5xl" />
        </div>
      )}

      {/* Luxury Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 gap-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 opacity-50 group-hover:scale-110 transition-transform duration-700"></div>
        <div className="relative">
          <h1 className="text-4xl font-black text-slate-800 tracking-tighter uppercase italic underline decoration-indigo-600 underline-offset-8 decoration-4">Book Issue Records</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-3">Manage issued and returned books</p>
        </div>
        {isLibrarian && (
          <div className="flex gap-4 relative">
              <button 
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:shadow-xl hover:shadow-indigo-100 transition-all active:scale-95"
              >
                  <MdAdd size={20} /> Issue Book
              </button>
          </div>
        )}
      </div>

      {/* Advanced Filter Control */}
      <div className="flex flex-col lg:flex-row gap-6 bg-white/50 p-6 rounded-[2.5rem] border border-slate-100 backdrop-blur-md">
        <div className="relative flex-1">
          <MdSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
          <input
            type="text"
            placeholder="SEARCH RECORDS (PRESS ENTER)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full bg-white border-2 border-transparent focus:border-indigo-600 rounded-[1.5rem] pl-16 pr-8 py-5 outline-none font-black text-[10px] tracking-widest uppercase transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Log Matrix Table */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                <th className="px-10 py-8 text-left">Book Details</th>
                <th className="px-10 py-8 text-left">Issued To</th>
                <th className="px-10 py-8 text-center">Dates & Deadlines</th>
                <th className="px-10 py-8 text-center">Fines (₹)</th>
                <th className="px-10 py-8 text-center">Status</th>
                <th className="px-10 py-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {issuedBooks.length > 0 ? issuedBooks.map(log => (
                <tr key={log._id} className="hover:bg-slate-50/30 transition-all group italic">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                        <MdBook size={24} />
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-800 tracking-tighter group-hover:text-indigo-600 uppercase transition-colors">{log.book?.title}</div>
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">ISBN: {log.book?.ISBN}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center font-black text-[10px] text-slate-500 border border-slate-100">
                            {log.member?.name.charAt(0)}
                        </div>
                        <div>
                            <div className="text-[12px] font-black text-slate-800 tracking-tight italic uppercase">{log.member?.name}</div>
                            <div className="text-[9px] font-black text-slate-400 tracking-widest uppercase opacity-60">ID: {log.member?.memberId}</div>
                        </div>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <div className="space-y-1 inline-block text-left">
                        <div className="text-[10px] font-black text-slate-600 uppercase italic">Issued: {new Date(log.issueDate).toLocaleDateString()}</div>
                        <div className="text-[9px] font-bold text-slate-500 uppercase italic">Due: {new Date(log.dueDate).toLocaleDateString()}</div>
                        {log.returnDate && (
                            <div className="text-[9px] font-black text-emerald-600 uppercase italic underline decoration-emerald-200 underline-offset-2">Returned: {new Date(log.returnDate).toLocaleDateString()}</div>
                        )}
                    </div>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <div className={`text-sm font-black italic ${log.fine > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                        ₹{log.fine || 0}
                    </div>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                      log.status === 'issued' 
                        ? 'bg-blue-50 text-blue-600 border-blue-100' 
                        : log.status === 'overdue'
                        ? 'bg-rose-50 text-rose-600 border-rose-100 animate-pulse'
                        : 'bg-slate-50 text-slate-500 border-slate-100'
                    }`}>
                      {log.status === 'issued' ? 'Issued' : log.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    {isLibrarian && log.status !== 'returned' ? (
                      <button 
                          onClick={() => handleReturnBook(log._id)}
                          className="flex items-center gap-2 ml-auto px-6 py-3 bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all shadow-sm"
                      >
                          <MdRestore size={18} /> Return Book
                      </button>
                    ) : (
                      <span className="text-[9px] font-black text-slate-400 uppercase italic opacity-60">
                        {log.status === 'returned' ? 'Transaction Complete' : 'Read Only Access'}
                      </span>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                    <td colSpan="5" className="py-40 text-center opacity-10">
                        <MdRefresh size={80} className="mx-auto mb-6" />
                        <p className="text-[10px] font-black uppercase tracking-[0.5em]">No active issues found</p>
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Dynamic Pagination */}
        <div className="px-10 py-8 bg-slate-50/50 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                Showing logs {(page - 1) * 10 + 1} to {Math.min(page * 10, pagination.total)} of {pagination.total} total
            </p>
            <div className="flex gap-4">
                <button 
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-black hover:text-white transition-all disabled:opacity-20 shadow-sm"
                >
                    <MdChevronLeft size={24} />
                </button>
                <div className="px-6 flex items-center bg-white border border-slate-200 rounded-xl font-black text-[11px] shadow-sm italic">
                    {page} / {pagination.pages}
                </div>
                <button 
                    disabled={page === pagination.pages}
                    onClick={() => setPage(page + 1)}
                    className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-black hover:text-white transition-all disabled:opacity-20 shadow-sm"
                >
                    <MdChevronRight size={24} />
                </button>
            </div>
        </div>
      </div>

      {/* Issuance Protocol Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-slate-900/40 animate-fadeIn">
            <div className="bg-white rounded-[3.5rem] w-full max-w-2xl shadow-[0_20px_70px_rgba(0,0,0,0.3)] border border-white/20 relative animate-slideUp">
                <div className="p-12">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic">Issue Book</h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Record a new book issuance</p>
                        </div>
                        <button 
                            onClick={() => setIsModalOpen(false)}
                            className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-black hover:text-white transition-all"
                        >
                            <MdClose size={28} />
                        </button>
                    </div>

                    <form onSubmit={handleIssueBook} className="space-y-10">
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-4">Select Book (ID)</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.book}
                                    onChange={(e) => setFormData({...formData, book: e.target.value})}
                                    className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl px-6 py-4 outline-none font-bold text-sm transition-all"
                                    placeholder="Enter book unique identifier..."
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-4">Select Member (ID)</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.member}
                                    onChange={(e) => setFormData({...formData, member: e.target.value})}
                                    className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl px-6 py-4 outline-none font-bold text-sm transition-all"
                                    placeholder="Enter member unique identifier..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-4">Return Deadline (Due Date)</label>
                                    <input
                                        required
                                        type="date"
                                        value={formData.dueDate}
                                        onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                                        className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl px-6 py-4 outline-none font-bold text-sm transition-all"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-4">Fine Delay (₹/Day)</label>
                                    <input
                                        required
                                        type="number"
                                        value={formData.finePerDay}
                                        onChange={(e) => setFormData({...formData, finePerDay: e.target.value})}
                                        className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl px-6 py-4 outline-none font-bold text-sm transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-6 pt-6">
                            <button 
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 py-5 rounded-2xl border-2 border-slate-100 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all font-italic"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                className="flex-[2] py-5 rounded-2xl bg-slate-800 text-white font-black text-[10px] uppercase tracking-[0.3em] hover:bg-black shadow-xl transition-all shadow-slate-200 active:scale-[0.98]"
                            >
                                Issue Book
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default BookTransactions;
