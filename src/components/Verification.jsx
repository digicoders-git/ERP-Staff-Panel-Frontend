import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdVerifiedUser, MdCancel, MdCheckCircle, MdVisibility } from 'react-icons/md';
import { toast } from 'react-toastify';
import { studentAPI } from '../utils/apiService';
import { FaSpinner } from 'react-icons/fa';

const Verification = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [verificationList, setVerificationList] = useState([]);

  useEffect(() => {
    fetchVerificationList();
  }, [filter]);

  const fetchVerificationList = async () => {
    try {
      setLoading(true);
      const res = await studentAPI.getVerificationList({ 
        status: filter === 'all' ? '' : filter 
      });
      const students = res.data.students || res.data;
      setVerificationList(Array.isArray(students) ? students : []);
    } catch (err) {
      console.error('Verification fetch failure:', err);
      toast.error('Could not load verification list');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id) => {
    try {
      await studentAPI.verify(id, { status: 'verified', remarks: 'Documents verified successfully' });
      toast.success(`Student ${id} verified! ✅`);
      fetchVerificationList();
    } catch (err) {
      toast.error('Verification synchronization failed');
    }
  };

  const handleReject = async (id) => {
    try {
      await studentAPI.verify(id, { status: 'rejected', remarks: 'Documents rejected due to incorrect information' });
      toast.error(`Student ${id} rejected! ❌`);
      fetchVerificationList();
    } catch (err) {
      toast.error('Rejection failed');
    }
  };

  const handleView = (item) => {
    navigate(`/application-view/${item.admissionNumber || item._id}`);
  };

  return (
    <div className="space-y-10">
      {loading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <FaSpinner className="animate-spin text-blue-500 text-5xl" />
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <MdVerifiedUser size={120} />
        </div>
        <div className="relative z-10">
          <h2 className="text-4xl font-black mb-2 tracking-tight">Document Verification</h2>
          <p className="text-emerald-200 text-lg font-medium">Verify student documents and approve admissions</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <MdVerifiedUser size={24} />
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">REGISTRY</span>
          </div>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Students</h3>
          <p className="text-3xl font-black text-slate-800 mt-1">{verificationList.length}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 rounded-xl text-orange-600">
              <FaSpinner size={24} className="animate-spin-slow" />
            </div>
            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg">PENDING</span>
          </div>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Awaiting Clearance</h3>
          <p className="text-3xl font-black text-slate-800 mt-1">{verificationList.filter(v => (v.verificationStatus || 'pending') === 'pending').length}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
              <MdCheckCircle size={24} />
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">VERIFIED</span>
          </div>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Verified Students</h3>
          <p className="text-3xl font-black text-slate-800 mt-1">{verificationList.filter(v => v.verificationStatus === 'verified').length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          <div className="flex-1 flex gap-3">
            {['all', 'pending', 'verified', 'rejected'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all border ${
                  filter === status 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200' 
                    : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50'
                }`}
              >
                {status} Students
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
              <FaSpinner className="animate-spin text-blue-600" size={30} />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Documents...</p>
            </div>
          ) : (
            <>
              {verificationList.length > 0 ? verificationList.filter(item => filter === 'all' || (item.verificationStatus || 'pending') === filter).map(item => (
                <div key={item._id} className="group border border-slate-100 rounded-2xl p-5 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-1.5 h-full bg-slate-100 group-hover:bg-blue-500 transition-colors" />
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl border border-slate-100 flex items-center justify-center text-blue-600 shadow-sm font-black text-xs">
                        #{item._id.slice(-4).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-black text-slate-800 text-sm uppercase tracking-tight">{item.name || `${item.firstName} ${item.lastName}`}</h3>
                        <p className="text-[10px] font-bold text-blue-600 tracking-widest">{item.admissionNumber || 'ID PENDING'}</p>
                        <div className="flex gap-2 mt-2">
                          {Object.keys(item.documents || {}).filter(k => item.documents[k]).map((doc, idx) => (
                            <span key={idx} className="bg-white border border-slate-200 px-2 py-0.5 rounded-md text-[8px] font-black text-slate-400 uppercase tracking-widest">
                              {doc.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                      <button 
                        onClick={() => handleView(item)}
                        className="flex-1 sm:flex-none p-2 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-blue-600 hover:border-blue-200 transition-all"
                        title="View Documents"
                      >
                        <MdVisibility size={20} />
                      </button>
                      {(item.verificationStatus || 'pending') === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleVerify(item._id)}
                            className="flex-1 sm:flex-none p-2 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-emerald-600 hover:border-emerald-200 transition-all"
                            title="Verify Documents"
                          >
                            <MdCheckCircle size={20} />
                          </button>
                          <button 
                            onClick={() => handleReject(item._id)}
                            className="flex-1 sm:flex-none p-2 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-red-500 hover:border-red-200 transition-all"
                            title="Reject Documents"
                          >
                            <MdCancel size={20} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="py-20 text-center opacity-30 flex flex-col items-center gap-4">
                  <MdVerifiedUser size={60} />
                  <p className="text-xs font-black uppercase tracking-[0.3em]">No students found</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

    </div>
  );
};

export default Verification;