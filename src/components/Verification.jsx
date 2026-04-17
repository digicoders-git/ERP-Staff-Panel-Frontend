import React, { useState, useEffect } from 'react';
import { MdVerifiedUser, MdCancel, MdCheckCircle, MdVisibility } from 'react-icons/md';
import { toast } from 'react-toastify';
import { studentAPI } from '../utils/apiService';
import { FaSpinner } from 'react-icons/fa';

const Verification = () => {
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
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
      toast.error('Identity validation registry inaccessible');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id) => {
    try {
      await studentAPI.verify(id, { status: 'verified', remarks: 'Documents cleared via institutional terminal' });
      toast.success(`Identity manifest ${id} verified! ✅`);
      fetchVerificationList();
    } catch (err) {
      toast.error('Verification synchronization failed');
    }
  };

  const handleReject = async (id) => {
    try {
      await studentAPI.verify(id, { status: 'rejected', remarks: 'Identity manifest rejected due to artifact inconsistency' });
      toast.error(`Identity manifest ${id} rejected! ❌`);
      fetchVerificationList();
    } catch (err) {
      toast.error('Protocol denial failed');
    }
  };

  const resolveDocUrl = (url) => {
    if (!url) return '#';
    if (url.startsWith('http')) return url;
    const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002';
    let cleanPath = url.replace(/\\/g, '/');
    const uploadsIndex = cleanPath.toLowerCase().indexOf('uploads/');
    if (uploadsIndex !== -1) cleanPath = cleanPath.slice(uploadsIndex);
    return `${BASE_URL.replace(/\/$/, '')}/${cleanPath.startsWith('/') ? cleanPath.slice(1) : cleanPath}`;
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setShowModal(true);
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
          <h2 className="text-4xl font-black mb-2 tracking-tight">Verification Terminal</h2>
          <p className="text-emerald-200 text-lg font-medium">Verify identity manifests and audit digital artifacts for institutional clearance</p>
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
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Audits</h3>
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
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">CLEARED</span>
          </div>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Verified Identities</h3>
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
                {status} Manifests
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
              <FaSpinner className="animate-spin text-blue-600" size={30} />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accessing Institutional Vault...</p>
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
                        <p className="text-[10px] font-bold text-blue-600 tracking-widest">{item.admissionNumber || 'ID ALLOCATION PENDING'}</p>
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
                        title="Analyze Artifacts"
                      >
                        <MdVisibility size={20} />
                      </button>
                      {(item.verificationStatus || 'pending') === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleVerify(item._id)}
                            className="flex-1 sm:flex-none p-2 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-emerald-600 hover:border-emerald-200 transition-all"
                            title="Verify Identity Manifest"
                          >
                            <MdCheckCircle size={20} />
                          </button>
                          <button 
                            onClick={() => handleReject(item._id)}
                            className="flex-1 sm:flex-none p-2 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-red-500 hover:border-red-200 transition-all"
                            title="Deny Validation"
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
                  <p className="text-xs font-black uppercase tracking-[0.3em]">Institutional clearance registry empty</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal for viewing documents */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-blue-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50" />
            
            <h3 className="text-xl font-black text-blue-900 mb-6 flex items-center gap-2">
              <MdVisibility className="text-blue-600" /> Artifact Inspection
            </h3>

            <div className="space-y-4 relative z-10">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Student Nomenclature</span>
                <span className="text-sm font-bold text-slate-800">{selectedItem.name || `${selectedItem.firstName} ${selectedItem.lastName}`}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Institutional ID</span>
                <span className="text-xs font-bold text-blue-600 tracking-widest">{selectedItem.admissionNumber || 'PENDING ALLOCATION'}</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-3 underline decoration-blue-200">Deposited Artifacts</span>
                <ul className="space-y-3">
                  {Object.keys(selectedItem.documents || {}).filter(k => selectedItem.documents[k]).map((docKey, index) => {
                    const docUrl = selectedItem.documents[docKey];
                    return (
                      <li key={index} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl group hover:border-blue-300 transition-all">
                        <div className="flex items-center gap-3">
                          <MdCheckCircle className="text-emerald-500" size={16} />
                          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none">
                            {docKey.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        </div>
                        <button 
                          onClick={() => window.open(resolveDocUrl(docUrl), '_blank')}
                          className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                        >
                          Audit File
                        </button>
                      </li>
                    );
                  })}
                  {Object.keys(selectedItem.documents || {}).filter(k => selectedItem.documents[k]).length === 0 && (
                    <li className="text-[10px] font-bold text-slate-400 uppercase italic py-4 text-center">No digital artifacts detected</li>
                  )}
                </ul>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Validation Status</span>
                <span className={`inline-block mt-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  (selectedItem.verificationStatus || 'pending') === 'verified' ? 'bg-emerald-100 text-emerald-800' : 
                  (selectedItem.verificationStatus || 'pending') === 'pending' ? 'bg-orange-100 text-orange-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {selectedItem.verificationStatus || 'pending'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full mt-8 py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              Close Inspection
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Verification;