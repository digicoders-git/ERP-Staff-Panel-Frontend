import React, { useState, useEffect } from 'react';
import { MdSearch, MdAdd, MdEdit, MdDelete, MdBook, MdCheckCircle, MdPeople, MdAccessTime, MdRefresh, MdLayers, MdBookmark, MdPersonSearch, MdTrendingUp, MdClose } from 'react-icons/md';
import { libraryAPI } from '../utils/apiService';
import { toast } from 'react-toastify';
import { FaSpinner, FaBookReader } from 'react-icons/fa';

const LibraryManagement = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('books');
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState([]);
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState(null);
  const userRole = localStorage.getItem('userRole');
  const isAdmin = ['branchAdmin', 'superAdmin', 'clientAdmin'].includes(userRole);
  const isLibrarian = userRole === 'libraryAdmin' || isAdmin;

  useEffect(() => {
    fetchLibraryData();
    fetchStats();
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const res = await libraryAPI.getDashboard();
      if (res.data && res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Stats sync failure');
    }
  };

  const fetchLibraryData = async () => {
    try {
      setLoading(true);
      let res;
      const params = { limit: 50 }; // Simplified fetch for integrated view
      
      if (activeTab === 'books') {
        res = await libraryAPI.getBooks(params);
        if (res.data && res.data.success) setBooks(res.data.data);
      } else if (activeTab === 'issued') {
        res = await libraryAPI.getIssuedBooks(params);
        if (res.data && res.data.success) setIssuedBooks(res.data.data);
      } else if (activeTab === 'members') {
        res = await libraryAPI.getMembers(params);
        if (res.data && res.data.success) setMembers(res.data.data);
      } else if (activeTab === 'requests') {
        res = await libraryAPI.getRequests(params);
        if (res.data && res.data.success) setRequests(res.data.data);
      }
    } catch (err) {
      toast.error(`Failed to load ${activeTab} data`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'available':
      case 'operational':
      case 'active': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'low stock': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'out of stock':
      case 'depleted':
      case 'overdue': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'issued': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-slate-50 text-slate-400 border-slate-100';
    }
  };

  const filteredCollection = () => {
      const term = searchTerm.toLowerCase();
      if (activeTab === 'books') return books.filter(b => b.title?.toLowerCase().includes(term) || b.author?.toLowerCase().includes(term));
      if (activeTab === 'members') return members.filter(m => m.name?.toLowerCase().includes(term) || m.memberId?.toLowerCase().includes(term));
      if (activeTab === 'issued') return issuedBooks.filter(l => l.book?.title?.toLowerCase().includes(term) || l.member?.name?.toLowerCase().includes(term));
      if (activeTab === 'requests') return requests.filter(r => r.book?.title?.toLowerCase().includes(term) || r.member?.name?.toLowerCase().includes(term));
      return [];
  };

  const handleReturn = async (id) => {
      try {
          setLoading(true);
          await libraryAPI.returnBook({ issueId: id });
          toast.success('Book returned successfully');
          fetchLibraryData();
      } catch (err) {
          toast.error('Failed to process return');
      } finally {
          setLoading(false);
      }
  };

  const handleRequestAction = async (id, action) => {
    try {
        setLoading(true);
        if (action === 'approve') await libraryAPI.approveRequest(id);
        else await libraryAPI.rejectRequest(id);
        toast.success(`Request ${action}d successfully`);
        fetchLibraryData();
    } catch (err) {
        toast.error('Failed to update request status');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="space-y-8 bg-slate-50/20 p-2 min-h-screen animate-fadeIn">
      {loading && (
        <div className="fixed inset-0 bg-white/60 flex items-center justify-center z-[70] backdrop-blur-[2px]">
           <FaSpinner className="animate-spin text-indigo-600 text-5xl" />
        </div>
      )}

      {/* Luxury Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 gap-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 opacity-50 group-hover:scale-110 transition-transform duration-700"></div>
        <div className="relative">
          <h1 className="text-4xl font-black text-slate-800 tracking-tighter uppercase italic underline decoration-indigo-600 underline-offset-8 decoration-4">School Library</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-3">Manage books, members and issue records</p>
        </div>
        <div className="flex gap-4 relative">
            <div className="relative">
                <input
                    type="text"
                    placeholder="SEARCH BOOKS..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl pl-12 pr-6 py-4 outline-none font-black text-[10px] tracking-widest uppercase transition-all shadow-inner"
                />
                <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            </div>
            <button onClick={fetchLibraryData} className="p-4 bg-slate-50 hover:bg-black hover:text-white rounded-2xl transition-all shadow-sm">
                <MdRefresh size={24} />
            </button>
        </div>
      </div>

      {/* Navigation Ribbon */}
      <div className="flex gap-4 bg-white/50 p-2 rounded-[2rem] border border-slate-100 backdrop-blur-md">
        {[
          { id: 'books', label: 'Book List', icon: MdBook },
          { id: 'issued', label: 'Issued Books', icon: MdAccessTime },
          { id: 'members', label: 'Library Members', icon: MdPeople },
          { id: 'requests', label: 'Book Requests', icon: MdBookmark }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all ${
              activeTab === tab.id 
                ? 'bg-slate-800 text-white shadow-xl shadow-slate-200' 
                : 'text-slate-400 hover:bg-white hover:text-slate-800'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Grid Content */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
        {activeTab === 'books' && (
          <div className="divide-y divide-slate-50">
            <div className="grid grid-cols-4 bg-slate-50/50 px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                <span>Book Title</span>
                <span className="text-center">Category</span>
                <span className="text-center">Availability</span>
                <span className="text-right">Status</span>
            </div>
            {filteredCollection().length > 0 ? filteredCollection().map((book, idx) => (
              <div key={idx} className="grid grid-cols-4 px-10 py-8 hover:bg-slate-50/30 transition-all group items-center italic">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-16 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:scale-105 shadow-sm">
                        <MdBook size={24} />
                    </div>
                    <div>
                        <div className="text-sm font-black text-slate-800 tracking-tight">{book.title}</div>
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 italic opacity-60">Author: {book.author}</div>
                    </div>
                </div>
                <div className="text-center">
                    <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-indigo-100">
                        {book.category || 'General Collection'}
                    </span>
                </div>
                <div className="text-center">
                    <div className="text-xs font-black text-slate-700">{book.availableCopies || 0} / {book.totalCopies || 0}</div>
                    <div className="w-24 mx-auto bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden border border-slate-50 shadow-inner">
                        <div 
                            className="bg-indigo-600 h-full rounded-full transition-all duration-1000" 
                            style={{ width: `${((book.availableCopies || 0) / (book.totalCopies || 1)) * 100}%` }}
                        />
                    </div>
                </div>
                <div className="flex items-center justify-end gap-4">
                    <span className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm ${getStatusStyle(book.availableCopies > 0 ? 'Available' : 'Out of Stock')}`}>
                        {book.availableCopies > 0 ? 'Available' : 'Out of Stock'}
                    </span>
                </div>
              </div>
            )) : (
                <div className="py-40 text-center opacity-10">
                    <MdLayers size={80} className="mx-auto mb-6" />
                    <p className="text-[10px] font-black uppercase tracking-[0.5em]">No Books Found</p>
                </div>
            )}
          </div>
        )}

        {activeTab === 'members' && (
             <div className="divide-y divide-slate-50">
                <div className="grid grid-cols-4 bg-slate-50/50 px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                    <span>Member Name</span>
                    <span className="text-center">Member Type</span>
                    <span className="text-center">Books Issued</span>
                    <span className="text-right">Status</span>
                </div>
                {filteredCollection().length > 0 ? filteredCollection().map((member, idx) => (
                <div key={idx} className="grid grid-cols-4 px-10 py-8 hover:bg-slate-50/30 transition-all group items-center italic">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center text-slate-800 font-black group-hover:bg-slate-800 group-hover:text-white transition-all shadow-sm">
                            {(member.name || 'M').charAt(0)}
                        </div>
                        <div>
                            <div className="text-sm font-black text-slate-800 tracking-tight">{member.name}</div>
                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 italic opacity-60">{member.memberId}</div>
                        </div>
                    </div>
                    <div className="text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        {member.type}
                    </div>
                    <div className="text-center text-xs font-black text-slate-800 bg-slate-50 py-2 rounded-xl border border-slate-100 mx-10">
                        {member.booksIssued || 0} Books
                    </div>
                    <div className="flex items-center justify-end gap-4">
                        <span className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm ${getStatusStyle(member.status)}`}>
                            {member.status}
                        </span>
                    </div>
                </div>
                )) : (
                    <div className="py-40 text-center opacity-10">
                        <MdPeople size={80} className="mx-auto mb-6" />
                        <p className="text-[10px] font-black uppercase tracking-[0.5em]">No Members Found</p>
                    </div>
                )}
             </div>
        )}

        {activeTab === 'issued' && (
             <div className="divide-y divide-slate-50">
                <div className="grid grid-cols-4 bg-slate-50/50 px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                    <span>Currently Issued</span>
                    <span className="text-center">Issued To</span>
                    <span className="text-center">Due Date Info</span>
                    <span className="text-right">Return Book</span>
                </div>
                {issuedBooks.length > 0 ? issuedBooks.map((loan, idx) => (
                <div key={idx} className="grid grid-cols-4 px-10 py-8 hover:bg-slate-50/30 transition-all group items-center italic">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                            <FaBookReader size={20} />
                        </div>
                        <div className="text-[11px] font-black text-slate-800 uppercase tracking-tighter max-w-[150px] truncate underline decoration-indigo-200 underline-offset-4">{loan.book?.title}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-[11px] font-black text-slate-700 uppercase italic underline decoration-slate-200">{loan.member?.name}</div>
                        <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-0.5">{loan.member?.memberId}</div>
                    </div>
                    <div className="text-center space-y-1">
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">DUE: {new Date(loan.dueDate).toLocaleDateString()}</div>
                        <div className="text-[8px] font-black text-rose-500 uppercase italic">REMAINING: {Math.ceil((new Date(loan.dueDate) - new Date()) / (1000 * 60 * 60 * 24))} DAYS</div>
                    </div>
                    <div className="flex items-center justify-end gap-4">
                        <span className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm ${getStatusStyle(loan.status)}`}>
                            {loan.status}
                        </span>
                        {isLibrarian && (
                            <button 
                                onClick={() => handleReturn(loan._id)}
                                className="p-3 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all border border-transparent hover:border-emerald-100 shadow-sm"
                            >
                                <MdCheckCircle size={22} />
                            </button>
                        )}
                    </div>
                </div>
                )) : (
                    <div className="py-40 text-center opacity-10">
                        <MdAccessTime size={80} className="mx-auto mb-6" />
                        <p className="text-[10px] font-black uppercase tracking-[0.5em]">No Books Issued</p>
                    </div>
                )}
             </div>
        )}

        {activeTab === 'requests' && (
             <div className="divide-y divide-slate-50">
                <div className="grid grid-cols-4 bg-slate-50/50 px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                    <span>Book Requested</span>
                    <span className="text-center">Requested By</span>
                    <span className="text-center">Request Date</span>
                    <span className="text-right">Action</span>
                </div>
                {requests.length > 0 ? requests.map((req, idx) => (
                <div key={idx} className="grid grid-cols-4 px-10 py-8 hover:bg-slate-50/30 transition-all group items-center italic">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                            <MdBookmark size={20} />
                        </div>
                        <div className="text-xs font-black text-slate-800 uppercase tracking-tighter max-w-[150px] truncate">{req.book?.title}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-[10px] font-black text-slate-700 uppercase">{req.member?.name}</div>
                        <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-0.5">{req.member?.memberId}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-tighter underline decoration-slate-100">{new Date(req.requestDate).toLocaleDateString()}</div>
                    </div>
                    <div className="flex items-center justify-end gap-1">
                        {isLibrarian ? (
                            <>
                                <button 
                                    onClick={() => handleRequestAction(req._id, 'approve')}
                                    className="p-3 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all shadow-sm border border-transparent hover:border-emerald-100"
                                >
                                    <MdCheckCircle size={22} />
                                </button>
                                <button 
                                    onClick={() => handleRequestAction(req._id, 'reject')}
                                    className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all shadow-sm border border-transparent hover:border-rose-100"
                                >
                                    <MdClose size={22} />
                                </button>
                            </>
                        ) : (
                            <span className="text-[9px] font-black text-slate-400 uppercase italic">Read Only</span>
                        )}
                    </div>
                </div>
                )) : (
                <div className="py-40 text-center opacity-10">
                        <MdBookmark size={80} className="mx-auto mb-6" />
                        <p className="text-[10px] font-black uppercase tracking-[0.5em]">No Pending Requests</p>
                    </div>
                )}
             </div>
        )}
      </div>

      {/* Analytics Matrix Pulse */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl">
                 <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <MdBook size={100} />
                 </div>
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">Total Collection</h3>
                 <p className="text-4xl font-black tracking-tighter italic">{stats?.books?.totalCopies || 0} Books</p>
                 <div className="mt-6 flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest italic group-hover:translate-x-2 transition-transform">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,1)]" /> Library Summary
                 </div>
            </div>
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm group hover:shadow-xl transition-all">
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">Registered Members</h3>
                 <p className="text-4xl font-black tracking-tighter text-slate-800 italic">{stats?.members || 0} Members</p>
                 <div className="mt-6 flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest italic group-hover:scale-105 transition-transform origin-left">
                    <MdTrendingUp size={16} /> +12% Growth
                 </div>
            </div>
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm group hover:shadow-xl transition-all">
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">Data Accuracy</h3>
                 <p className="text-4xl font-black tracking-tighter text-slate-800 italic">96.4% Correct</p>
                 <div className="mt-6">
                    <div className="w-full bg-slate-50 h-2.5 rounded-full overflow-hidden border border-slate-100 shadow-inner p-0.5">
                        <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 h-full w-[96.4%] rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                    </div>
                 </div>
            </div>
      </div>
    </div>
  );
};

export default LibraryManagement;
