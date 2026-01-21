import React, { useState, useEffect } from 'react';
import { showSuccess, showError, showConfirm, showToast } from '../utils/sweetAlert';
import { FaHome, FaUserAlt } from 'react-icons/fa';

export default function Warden() {
  const [wardens, setWardens] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingWarden, setEditingWarden] = useState(null);
  const [formData, setFormData] = useState({
    wardenName: '',
    mobileNumber: '',
    email: '',
    password: '',
    gender: 'Male',
    assignedHostels: [],
    shift: 'Day',
    status: 'Active',
    image: null,
    imagePreview: null
  });

  useEffect(() => {
    const savedWardens = localStorage.getItem('wardens');
    const savedHostels = localStorage.getItem('hostels');
    if (savedWardens) setWardens(JSON.parse(savedWardens));
    if (savedHostels) setHostels(JSON.parse(savedHostels));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const wardenData = {
      ...formData,
      id: editingWarden?.id || Date.now(),
      createdDate: editingWarden ? editingWarden.createdDate : new Date().toLocaleDateString()
    };
    
    let updatedWardens;
    if (editingWarden) {
      updatedWardens = wardens.map(w => w.id === editingWarden.id ? wardenData : w);
      await showSuccess('Updated!', 'Warden information updated successfully');
    } else {
      updatedWardens = [...wardens, wardenData];
      await showSuccess('Created!', 'New warden created successfully');
    }
    
    setWardens(updatedWardens);
    localStorage.setItem('wardens', JSON.stringify(updatedWardens));
    setShowForm(false);
    setEditingWarden(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      wardenName: '',
      mobileNumber: '',
      email: '',
      password: '',
      gender: 'Male',
      assignedHostels: [],
      shift: 'Day',
      status: 'Active',
      image: null,
      imagePreview: null
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          image: file,
          imagePreview: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = (warden) => {
    setEditingWarden(warden);
    setFormData(warden);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const result = await showConfirm('Delete Warden?', 'This will permanently delete the warden and all associated data');
    if (result.isConfirmed) {
      const updatedWardens = wardens.filter(w => w.id !== id);
      setWardens(updatedWardens);
      localStorage.setItem('wardens', JSON.stringify(updatedWardens));
      showToast('success', 'Warden deleted successfully');
    }
  };

  const handleHostelSelection = (hostelName) => {
    const updatedHostels = formData.assignedHostels.includes(hostelName)
      ? formData.assignedHostels.filter(h => h !== hostelName)
      : [...formData.assignedHostels, hostelName];
    setFormData({...formData, assignedHostels: updatedHostels});
  };

  return (
    <div className="p-6">
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
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Warden Create / Assign</h2>
          <p className="text-gray-600">Manage hostel wardens</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-700 font-bold transition-all duration-300"
        >
          Create Warden
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white/50 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-bold mb-4">{editingWarden ? 'Update Warden' : 'Create New Warden'}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Warden Image */}
            <div className="md:col-span-2 flex justify-center mb-4">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                  {formData.imagePreview ? (
                    <img src={formData.imagePreview} alt="Warden" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400 text-4xl"><FaUserAlt /></span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="wardenImage"
                />
                <label
                  htmlFor="wardenImage"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 cursor-pointer"
                >
                  Upload Photo
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Warden Name *</label>
              <input
                type="text"
                value={formData.wardenName}
                onChange={(e) => setFormData({...formData, wardenName: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Mobile Number *</label>
              <input
                type="tel"
                value={formData.mobileNumber}
                onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Password *</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-green-500"
                placeholder="Enter password"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-green-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Shift</label>
              <select
                value={formData.shift}
                onChange={(e) => setFormData({...formData, shift: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-green-500"
              >
                <option value="Day">Day</option>
                <option value="Night">Night</option>
                <option value="All">All</option>
              </select>
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
            
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Assigned Hostels (Multi Select)</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 border-2 border-gray-300 rounded-xl">
                {hostels.map(hostel => (
                  <label key={hostel.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.assignedHostels.includes(hostel.hostelName)}
                      onChange={() => handleHostelSelection(hostel.hostelName)}
                      className="rounded"
                    />
                    <span className="text-sm">{hostel.hostelName}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="md:col-span-2 flex gap-4 mt-4">
              <button
                type="submit"
                className="bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600 font-bold"
              >
                {editingWarden ? 'Update' : 'Save'}
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

      {/* Warden List */}
      <div className="bg-white/50 rounded-2xl overflow-hidden">
        <div className="p-4 bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900">Warden List ({wardens.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Name</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Mobile</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Gender</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Assigned Hostels</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Shift</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Status</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              {wardens.map((warden, index) => (
                <tr key={warden.id} className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                        {warden.imagePreview ? (
                          <img src={warden.imagePreview} alt={warden.wardenName} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-gray-400">👤</span>
                        )}
                      </div>
                      <span className="font-bold">{warden.wardenName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{warden.mobileNumber}</td>
                  <td className="px-4 py-3">{warden.gender}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {warden.assignedHostels.map((hostel, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {hostel}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">{warden.shift}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      warden.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {warden.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleEdit(warden)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 mr-2 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(warden.id)}
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