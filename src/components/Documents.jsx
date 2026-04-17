import React, { useState, useEffect } from 'react';
import { MdDescription, MdDownload, MdVisibility, MdUpload, MdClose, MdCheckCircle, MdCancel, MdSearch, MdFilterList, MdEvent } from 'react-icons/md';
import { toast } from 'react-toastify';
import { documentAPI } from '../utils/apiService';
import { FaSpinner } from 'react-icons/fa';

const Documents = () => {
  const [loading, setLoading] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [stats, setStats] = useState({ total: 0, verified: 0, pending: 0, rejected: 0 });

  // Filter & Pagination States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchDocuments();
  }, [currentPage, statusFilter, dateFilter, startDate, endDate]);

  // Debounced Search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchDocuments();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        status: statusFilter,
        search: searchTerm,
        dateFilter: dateFilter
      };

      if (dateFilter === 'custom' && startDate && endDate) {
        params.startDate = startDate;
        params.endDate = endDate;
      }

      const res = await documentAPI.getAll(params);
      if (res.data && res.data.success) {
        setDocuments(res.data.data);
        setStats(res.data.stats);
        if (res.data.pagination) {
          setTotalPages(res.data.pagination.totalPages);
        }
      }
    } catch (err) {
      console.error('Failed to fetch documents:', err);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      setLoading(true);
      const res = await documentAPI.updateStatus(id, { status });
      if (res.data && res.data.success) {
        toast.success(`Document ${status} successfully`);
        fetchDocuments(); // Refresh
        if (selectedDoc && selectedDoc._id === id) {
          setShowViewModal(false);
        }
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      toast.error('Failed to update document status');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (doc) => {
    setSelectedDoc(doc);
    setShowViewModal(true);
  };

  const resolveDocUrl = (url) => {
    if (!url) return '#';
    if (url.startsWith('http')) return url;

    // Institutional Anti-Path-Collision Logic
    const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002';
    
    // Extract everything from 'uploads' onwards to handle absolute local paths
    let cleanPath = url.replace(/\\/g, '/');
    const uploadsIndex = cleanPath.toLowerCase().indexOf('uploads/');
    if (uploadsIndex !== -1) {
      cleanPath = cleanPath.slice(uploadsIndex);
    }
    
    return `${BASE_URL.replace(/\/$/, '')}/${cleanPath.startsWith('/') ? cleanPath.slice(1) : cleanPath}`;
  };

  const handleDownload = (doc) => {
    if (!doc.fileUrl) {
      toast.error('Identity artifact link not found');
      return;
    }
    
    const finalUrl = resolveDocUrl(doc.fileUrl);
    window.open(finalUrl, '_blank');
    toast.info('Accessing institutional artifact...');
  };

  return (
    <div className="space-y-6">
      {loading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <FaSpinner className="animate-spin text-blue-500 text-5xl" />
        </div>
      )}
      <div className="bg-blue-600 rounded-xl p-6 text-white shadow-lg">
        <h2 className="text-3xl font-bold mb-2">Document Management</h2>
        <p className="text-blue-100">Verify and manage student documents and certificates</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Documents</h3>
          <p className="text-3xl font-black text-slate-800">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-emerald-500">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Verified</h3>
          <p className="text-3xl font-black text-emerald-600">{stats.verified}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-amber-500">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pending</h3>
          <p className="text-3xl font-black text-amber-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-rose-500">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rejected</h3>
          <p className="text-3xl font-black text-rose-600">{stats.rejected}</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Recent Documents</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Live Institutional Registry</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            {/* Search Bar */}
            <div className="relative group">
              <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
              <input 
                type="text"
                placeholder="Search Student Name/ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-6 py-3 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl text-xs font-bold text-slate-800 w-full md:w-64 outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Date Range Selector */}
            <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-2xl border border-slate-100">
               <button 
                onClick={() => setDateFilter('all')}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${dateFilter === 'all' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
               >All</button>
               <button 
                onClick={() => setDateFilter('today')}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${dateFilter === 'today' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
               >Today</button>
               <button 
                onClick={() => setDateFilter('thisMonth')}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${dateFilter === 'thisMonth' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
               >Month</button>
               <button 
                onClick={() => setDateFilter('custom')}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${dateFilter === 'custom' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
               >Custom</button>
            </div>

            {/* Custom Range Inputs */}
            {dateFilter === 'custom' && (
              <div className="flex items-center gap-2 animate-in slide-in-from-right-4 duration-300">
                <div className="relative">
                  <MdEvent className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input 
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold text-slate-800 outline-none focus:border-blue-600"
                  />
                </div>
                <span className="text-slate-300">to</span>
                <div className="relative">
                  <MdEvent className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input 
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold text-slate-800 outline-none focus:border-blue-600"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50/50">
                <th className="px-8 py-5">Student Name</th>
                <th className="px-8 py-5">Document Type</th>
                <th className="px-8 py-5">Upload Date</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {documents.map(doc => (
                <tr key={doc._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6 text-sm font-bold text-slate-800">
                    <div className="flex flex-col">
                      <span>{doc.studentName}</span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">{doc.studentId}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-xs font-bold text-slate-500 uppercase tracking-widest">{doc.type}</td>
                  <td className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit ${
                      doc.status === 'verified' ? 'bg-emerald-50 text-emerald-700' : 
                      doc.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                      'bg-rose-50 text-rose-700'
                    }`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleView(doc)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                        title="View Document"
                      >
                        <MdVisibility size={18} />
                      </button>
                      <button 
                        onClick={() => handleDownload(doc)}
                        className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-all"
                        title="Download Document"
                      >
                        <MdDownload size={18} />
                      </button>
                      {doc.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleStatusUpdate(doc._id, 'verified')}
                            className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-all"
                            title="Verify"
                          >
                            <MdCheckCircle size={18} />
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(doc._id, 'rejected')}
                            className="p-2 text-rose-600 hover:bg-rose-100 rounded-lg transition-all"
                            title="Reject"
                          >
                            <MdCancel size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {documents.length === 0 && (
             <div className="py-20 text-center">
                <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs underline underline-offset-8">No documents found</p>
             </div>
          )}
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 disabled:opacity-50 hover:border-slate-800 transition-all shadow-sm"
              >Prev</button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-xl text-[10px] font-black transition-all ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white border border-slate-200 text-slate-400 hover:border-slate-800'}`}
                >
                  {i + 1}
                </button>
              ))}

              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 disabled:opacity-50 hover:border-slate-800 transition-all shadow-sm"
              >Next</button>
            </div>
          </div>
        )}
      </div>

      {/* View Document Modal */}
      {showViewModal && selectedDoc && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full mx-auto max-h-[90vh] overflow-hidden flex flex-col border border-white/20 scale-100 animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center p-8 border-b border-slate-50 bg-slate-50/50">
              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Document Review</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Verification Console</p>
              </div>
              <button 
                onClick={() => setShowViewModal(false)}
                className="p-3 text-slate-400 hover:text-slate-600 hover:bg-white border-2 border-transparent hover:border-slate-100 rounded-2xl transition-all"
              >
                <MdClose size={24} />
              </button>
            </div>
            
            <div className="p-8 space-y-8 overflow-y-auto">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Student Name</label>
                  <p className="text-sm font-bold text-slate-800">{selectedDoc.studentName}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Admission ID</label>
                  <p className="text-sm font-bold text-slate-800">{selectedDoc.studentId || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Document Type</label>
                  <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest">{selectedDoc.type}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Upload Date</label>
                  <p className="text-sm font-bold text-slate-800">
                     {selectedDoc.createdAt ? new Date(selectedDoc.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Current Status</label>
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit ${
                      selectedDoc.status === 'verified' ? 'bg-emerald-50 text-emerald-700' : 
                      selectedDoc.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                      'bg-rose-50 text-rose-700'
                    }`}>
                      {selectedDoc.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-slate-50 pt-8">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block">Document Preview</label>
                <div className="bg-slate-50 rounded-[2rem] p-12 text-center border-2 border-dashed border-slate-200 group transition-all hover:border-blue-200">
                  <MdDescription size={64} className="mx-auto text-slate-300 mb-4 group-hover:text-blue-400 transition-colors" />
                  <p className="text-slate-800 font-black tracking-tight">{selectedDoc.fileName || selectedDoc.type}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2 italic">File size: {selectedDoc.fileSize || 'N/A'}</p>
                  
                  <div className="mt-8">
                     <button 
                        onClick={() => window.open(resolveDocUrl(selectedDoc.fileUrl), '_blank')}
                        className="px-8 py-3 bg-white border-2 border-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-slate-800 hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm"
                     >Open Full Document</button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between gap-4 p-8 border-t border-slate-50 bg-slate-50/30">
               <div className="flex gap-3">
                  {selectedDoc.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => handleStatusUpdate(selectedDoc._id, 'verified')}
                        className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center gap-2"
                      >
                        <MdCheckCircle size={18} />
                        Verify
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(selectedDoc._id, 'rejected')}
                        className="px-8 py-4 bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-rose-700 transition-all shadow-lg shadow-rose-200 flex items-center gap-2"
                      >
                        <MdCancel size={18} />
                        Reject
                      </button>
                    </>
                  )}
               </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => handleDownload(selectedDoc)}
                  className="px-8 py-4 border-2 border-slate-100 bg-white text-slate-800 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:border-slate-800 transition-all shadow-sm flex items-center gap-2"
                >
                  <MdDownload size={18} />
                  Download
                </button>
                <button 
                  onClick={() => setShowViewModal(false)}
                  className="px-8 py-4 border-2 border-transparent text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] hover:text-slate-800 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;