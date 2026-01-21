import React, { useState, useEffect } from 'react';
import { showSuccess, showError, showConfirm, showToast } from '../utils/sweetAlert';
import { FaHome } from 'react-icons/fa';

export default function CreateHostel() {
  const [hostels, setHostels] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingHostel, setEditingHostel] = useState(null);
  const [formData, setFormData] = useState({
    hostelName: '',
    hostelCode: '',
    hostelType: 'Boys',
    address: '',
    totalFloors: '',
    contactNumber: '',
    status: 'Active'
  });

  useEffect(() => {
    const savedHostels = localStorage.getItem('hostels');
    if (savedHostels) {
      setHostels(JSON.parse(savedHostels));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hostelData = {
      ...formData,
      id: editingHostel?.id || Date.now(),
      createdDate: editingHostel ? editingHostel.createdDate : new Date().toLocaleDateString()
    };
    
    let updatedHostels;
    if (editingHostel) {
      updatedHostels = hostels.map(h => h.id === editingHostel.id ? hostelData : h);
      await showSuccess('Updated!', 'Hostel information updated successfully');
    } else {
      updatedHostels = [...hostels, hostelData];
      await showSuccess('Created!', 'New hostel created successfully');
    }
    
    setHostels(updatedHostels);
    localStorage.setItem('hostels', JSON.stringify(updatedHostels));
    setShowForm(false);
    setEditingHostel(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      hostelName: '',
      hostelCode: '',
      hostelType: 'Boys',
      address: '',
      totalFloors: '',
      contactNumber: '',
      status: 'Active'
    });
  };

  const handleEdit = (hostel) => {
    setEditingHostel(hostel);
    setFormData(hostel);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const result = await showConfirm('Delete Hostel?', 'This will permanently delete the hostel and all associated data');
    if (result.isConfirmed) {
      const updatedHostels = hostels.filter(h => h.id !== id);
      setHostels(updatedHostels);
      localStorage.setItem('hostels', JSON.stringify(updatedHostels));
      showToast('success', 'Hostel deleted successfully');
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
        {/* header */}
             <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 mb-8 border border-white/50">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <FaHome className="text-white text-2xl" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Hostel Management
                  </h1>
                  <p className="text-gray-600 mt-1">Manage hostel facilities and accommodations</p>
                </div>
              </div>
            </div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Hostel Create / List</h2>
          <p className="text-gray-600">Manage hostel information</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-700 font-bold transition-all duration-300"
        >
          Create Hostel
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white/50 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-bold mb-4">{editingHostel ? 'Update Hostel' : 'Create New Hostel'}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Hostel Name *</label>
              <input
                type="text"
                value={formData.hostelName}
                onChange={(e) => setFormData({...formData, hostelName: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Hostel Code</label>
              <input
                type="text"
                value={formData.hostelCode}
                onChange={(e) => setFormData({...formData, hostelCode: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Hostel Type</label>
              <select
                value={formData.hostelType}
                onChange={(e) => setFormData({...formData, hostelType: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-green-500"
              >
                <option value="Boys">Boys</option>
                <option value="Girls">Girls</option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Address</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-green-500"
                rows="2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Total Floors</label>
              <input
                type="number"
                value={formData.totalFloors}
                onChange={(e) => setFormData({...formData, totalFloors: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-green-500"
                min="1"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Contact Number</label>
              <input
                type="tel"
                value={formData.contactNumber}
                onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-green-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            
            <div className="md:col-span-2 flex gap-4 mt-4">
              <button
                type="submit"
                className="bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600 font-bold"
              >
                {editingHostel ? 'Update' : 'Save'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 font-bold"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 font-bold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Hostel List */}
      <div className="bg-white/50 rounded-2xl overflow-hidden">
        <div className="p-4 bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900">Hostel List ({hostels.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Hostel Name</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Code</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Type</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Floors</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Contact</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Status</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              {hostels.map((hostel, index) => (
                <tr key={hostel.id} className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                  <td className="px-4 py-3 font-bold">{hostel.hostelName}</td>
                  <td className="px-4 py-3">{hostel.hostelCode}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      hostel.hostelType === 'Boys' ? 'bg-blue-100 text-blue-800' : 
                      hostel.hostelType === 'Girls' ? 'bg-pink-100 text-pink-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {hostel.hostelType}
                    </span>
                  </td>
                  <td className="px-4 py-3">{hostel.totalFloors}</td>
                  <td className="px-4 py-3">{hostel.contactNumber}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      hostel.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {hostel.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleEdit(hostel)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 mr-2 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(hostel.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}