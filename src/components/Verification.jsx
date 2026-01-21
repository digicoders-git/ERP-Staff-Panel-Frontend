import React, { useState } from 'react';
import { MdVerifiedUser, MdCancel, MdCheckCircle, MdVisibility } from 'react-icons/md';
import { toast } from 'react-toastify';

const Verification = () => {
  const [filter, setFilter] = useState('pending');
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [verificationData, setVerificationData] = useState([
    { id: 'VER001', name: 'Rahul Sharma', documents: ['Photo', 'Marksheet', 'ID Proof'], status: 'pending', submittedDate: '2024-01-15' },
    { id: 'VER002', name: 'Priya Singh', documents: ['Photo', 'Marksheet'], status: 'verified', submittedDate: '2024-01-14' },
    { id: 'VER003', name: 'Amit Kumar', documents: ['Photo', 'Marksheet', 'ID Proof'], status: 'rejected', submittedDate: '2024-01-13' }
  ]);

  const handleVerify = (id) => {
    setVerificationData(verificationData.map(item => 
      item.id === id ? { ...item, status: 'verified' } : item
    ));
    toast.success(`Document ${id} verified successfully! ✅`);
  };

  const handleReject = (id) => {
    setVerificationData(verificationData.map(item => 
      item.id === id ? { ...item, status: 'rejected' } : item
    ));
    toast.error(`Document ${id} rejected! ❌`);
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-600 rounded-xl p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">Document Verification</h2>
        <p className="text-blue-100">Verify student documents and eligibility</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex gap-4 mb-6">
          {['pending', 'verified', 'rejected'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === status ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {verificationData.filter(item => item.status === filter).map(item => (
            <div key={item.id} className="border border-blue-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-blue-900">{item.name}</h3>
                  <p className="text-sm text-blue-600">ID: {item.id}</p>
                  <p className="text-sm text-blue-600">Documents: {item.documents.join(', ')}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleView(item)}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                    title="View Documents"
                  >
                    <MdVisibility size={18} />
                  </button>
                  {item.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => handleVerify(item.id)}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                        title="Verify Documents"
                      >
                        <MdCheckCircle size={18} />
                      </button>
                      <button 
                        onClick={() => handleReject(item.id)}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                        title="Reject Documents"
                      >
                        <MdCancel size={18} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for viewing documents */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-blue-900 mb-4">Document Details</h3>
            <div className="space-y-3">
              <div><span className="font-medium">Student:</span> {selectedItem.name}</div>
              <div><span className="font-medium">ID:</span> {selectedItem.id}</div>
              <div><span className="font-medium">Documents:</span></div>
              <ul className="ml-4 list-disc">
                {selectedItem.documents.map((doc, index) => (
                  <li key={index} className="text-blue-700">{doc}</li>
                ))}
              </ul>
              <div><span className="font-medium">Status:</span> 
                <span className={`ml-2 px-2 py-1 rounded text-sm ${
                  selectedItem.status === 'verified' ? 'bg-green-100 text-green-800' : 
                  selectedItem.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {selectedItem.status.charAt(0).toUpperCase() + selectedItem.status.slice(1)}
                </span>
              </div>
              <div><span className="font-medium">Submitted:</span> {selectedItem.submittedDate}</div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Verification;