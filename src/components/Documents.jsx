import React, { useState } from 'react';
import { MdDescription, MdDownload, MdVisibility, MdUpload, MdClose } from 'react-icons/md';
import { toast } from 'react-toastify';

const Documents = () => {
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const handleView = (doc) => {
    setSelectedDoc(doc);
    setShowViewModal(true);
  };

  const handleDownload = (doc) => {
    // Create a blob with sample content
    const content = `Document Details:

Student Name: ${doc.name}
Document ID: ${doc.id}
Document Type: ${doc.type}
Upload Date: ${doc.uploadDate}
Status: ${doc.status}

This is a sample document file for ${doc.name}'s ${doc.type}.`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    
    // Create download link
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.name}_${doc.type}_${doc.id}.txt`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    window.URL.revokeObjectURL(url);
    
    toast.success(`${doc.type} for ${doc.name} downloaded successfully!`);
    setTimeout(() => {
      toast.info('File saved to Downloads folder');
    }, 500);
  };
  const documentData = [
    { id: 'DOC001', name: 'Rahul Sharma', type: 'Marksheet', status: 'verified', uploadDate: '2024-01-15' },
    { id: 'DOC002', name: 'Priya Singh', type: 'ID Proof', status: 'pending', uploadDate: '2024-01-14' },
    { id: 'DOC003', name: 'Sneha Patel', type: 'Photo', status: 'verified', uploadDate: '2024-01-13' },
    { id: 'DOC004', name: 'Amit Kumar', type: 'Transfer Certificate', status: 'rejected', uploadDate: '2024-01-12' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-blue-600 rounded-xl p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">Document Management</h2>
        <p className="text-blue-100">Manage student documents and certificates</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Total Documents</h3>
          <p className="text-3xl font-bold text-blue-600">2,456</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Verified</h3>
          <p className="text-3xl font-bold text-blue-600">2,234</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Pending</h3>
          <p className="text-3xl font-bold text-blue-600">189</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Rejected</h3>
          <p className="text-3xl font-bold text-blue-600">33</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-blue-100">
          <h3 className="text-xl font-bold text-blue-900">Recent Documents</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Student Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Document Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Upload Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {documentData.map(doc => (
                <tr key={doc.id} className="hover:bg-blue-50">
                  <td className="px-6 py-4 text-sm font-medium text-blue-900">{doc.name}</td>
                  <td className="px-6 py-4 text-sm text-blue-700">{doc.type}</td>
                  <td className="px-6 py-4 text-sm text-blue-700">{doc.uploadDate}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      doc.status === 'verified' ? 'bg-blue-100 text-blue-800' : 
                      doc.status === 'pending' ? 'bg-white text-blue-600 border border-blue-200' :
                      'bg-blue-50 text-blue-700'
                    }`}>
                      {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleView(doc)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                        title="View Document"
                      >
                        <MdVisibility size={18} />
                      </button>
                      <button 
                        onClick={() => handleDownload(doc)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                        title="Download Document"
                      >
                        <MdDownload size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Document Modal */}
      {showViewModal && selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-blue-100">
              <h3 className="text-xl font-bold text-blue-900">Document Details</h3>
              <button 
                onClick={() => setShowViewModal(false)}
                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <MdClose size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">Student Name</label>
                  <p className="text-blue-900 font-semibold">{selectedDoc.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">Document ID</label>
                  <p className="text-blue-900 font-semibold">{selectedDoc.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">Document Type</label>
                  <p className="text-blue-900 font-semibold">{selectedDoc.type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">Upload Date</label>
                  <p className="text-blue-900 font-semibold">{selectedDoc.uploadDate}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">Status</label>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    selectedDoc.status === 'verified' ? 'bg-blue-100 text-blue-800' : 
                    selectedDoc.status === 'pending' ? 'bg-white text-blue-600 border border-blue-200' :
                    'bg-blue-50 text-blue-700'
                  }`}>
                    {selectedDoc.status.charAt(0).toUpperCase() + selectedDoc.status.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="border-t border-blue-100 pt-4">
                <label className="block text-sm font-medium text-blue-700 mb-2">Document Preview</label>
                <div className="bg-blue-50 rounded-lg p-8 text-center">
                  <MdDescription size={64} className="mx-auto text-blue-400 mb-4" />
                  <p className="text-blue-700 font-medium">{selectedDoc.type}</p>
                  <p className="text-blue-600 text-sm mt-2">Document preview not available</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 p-6 border-t border-blue-100">
              <button 
                onClick={() => handleDownload(selectedDoc)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <MdDownload size={18} />
                Download
              </button>
              <button 
                onClick={() => setShowViewModal(false)}
                className="px-6 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
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

export default Documents;