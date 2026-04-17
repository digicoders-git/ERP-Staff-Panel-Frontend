import React, { useState, useEffect } from 'react';
import { MdPerson, MdEdit, MdSave, MdCancel } from 'react-icons/md';
import { FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api, { BASE_URL } from '../utils/api';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [staff, setStaff] = useState(null);
  const [stats, setStats] = useState(null);
  const [formData, setFormData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/api/staff-panel/profile');
      if (res.data) {
        setAdmin(res.data.admin);
        setStaff(res.data.staff);
        setStats(res.data.stats);
        setFormData({
          name: res.data.staff?.name || '',
          mobile: res.data.staff?.mobile || '',
          designation: res.data.staff?.designation || '',
          department: res.data.staff?.department || '',
          gender: res.data.staff?.gender || '',
          qualification: res.data.staff?.qualification || '',
          experience: res.data.staff?.experience || '',
          address: res.data.staff?.address || ''
        });
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if (selectedFile) data.append('profileImage', selectedFile);

      const res = await api.put('/api/staff-panel/profile/update', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.staff) {
        setStaff(res.data.staff);
        if (res.data.admin) setAdmin(res.data.admin);
        setIsEditing(false);
        setSelectedFile(null);
        setPreviewUrl(null);
        toast.success('Profile updated successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    setFormData({
      name: staff?.name || '',
      mobile: staff?.mobile || '',
      designation: staff?.designation || '',
      department: staff?.department || '',
      gender: staff?.gender || '',
      qualification: staff?.qualification || '',
      experience: staff?.experience || '',
      address: staff?.address || ''
    });
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <FaSpinner className="animate-spin text-blue-500 text-4xl" />
    </div>
  );

  return (
    <div className="space-y-6">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Branch Classes</h3>
          <p className="text-3xl font-bold text-blue-600">{stats?.classesAssigned || 0}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Active Students</h3>
          <p className="text-3xl font-bold text-blue-600">{stats?.students || 0}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Service Years</h3>
          <p className="text-3xl font-bold text-blue-600">{stats?.yearsOfService || 0}</p>
        </div>
      </div>

      <div className="bg-blue-600 rounded-xl p-6 text-white">
        
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold mb-2">Staff Profile</h2>
            <p className="text-blue-100">Manage your profile information</p>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 flex items-center gap-2"
                >
                  <MdSave size={20} />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-400 flex items-center gap-2"
                >
                  <MdCancel size={20} />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 flex items-center gap-2"
              >
                <MdEdit size={20} />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 cursor-pointer overflow-hidden"
            onClick={() => document.getElementById('profileInput').click()}
          >
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            ) : staff?.profileImage ? (
              <img src={staff.profileImage.startsWith('http') ? staff.profileImage : `${BASE_URL}/${staff.profileImage}`} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              staff?.name?.[0]?.toUpperCase() || 'S'
            )}
          </div>
          <input
            id="profileInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <h3 className="text-xl font-bold text-blue-900 mb-2">{staff?.name || 'Staff'}</h3>
          <p className="text-blue-600 mb-2">{staff?.designation || '—'}</p>
          <p className="text-sm text-blue-700">{staff?.department || '—'}</p>
          <div className="mt-4 pt-4 border-t border-blue-100">
            <p className="text-sm text-blue-600">Employee ID</p>
            <p className="font-semibold text-blue-900">{staff?.staffId || '—'}</p>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-6">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-blue-900 font-medium">{staff?.name || '—'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">Email</label>
              <p className="text-blue-900 font-medium">{admin?.email || '—'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-blue-900 font-medium">{staff?.mobile || '—'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">Designation</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => setFormData({...formData, designation: e.target.value})}
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-blue-900 font-medium">{staff?.designation || '—'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">Department</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-blue-900 font-medium">{staff?.department || '—'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">Gender</label>
              {isEditing ? (
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <p className="text-blue-900 font-medium">{staff?.gender || '—'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">Join Date</label>
              <p className="text-blue-900 font-medium">{staff?.createdAt ? new Date(staff.createdAt).toLocaleDateString() : '—'}</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-blue-700 mb-2">Address</label>
              {isEditing ? (
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  rows="3"
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-blue-900 font-medium">{staff?.address || '—'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">Qualification</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.qualification}
                  onChange={(e) => setFormData({...formData, qualification: e.target.value})}
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-blue-900 font-medium">{staff?.qualification || '—'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">Experience</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.experience}
                  onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-blue-900 font-medium">{staff?.experience || '—'}</p>
              )}
            </div>
          </div>
        </div>
      </div>

   
    </div>
  );
};

export default Profile;