import React, { useState } from 'react';
import { MdPerson, MdEdit, MdSave, MdCancel } from 'react-icons/md';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@school.com',
    phone: '+91 9876543210',
    designation: 'Mathematics Teacher',
    department: 'Science Department',
    employeeId: 'EMP001',
    joinDate: '2020-06-15',
    address: '123 Main Street, City, State - 123456',
    qualification: 'M.Sc Mathematics, B.Ed',
    experience: '8 years'
  });

  const handleSave = () => {
    console.log('Profile updated:', profileData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Classes Assigned</h3>
          <p className="text-3xl font-bold text-blue-600">6</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Students</h3>
          <p className="text-3xl font-bold text-blue-600">180</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Years of Service</h3>
          <p className="text-3xl font-bold text-blue-600">4</p>
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
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4">
            J
          </div>
          <h3 className="text-xl font-bold text-blue-900 mb-2">{profileData.name}</h3>
          <p className="text-blue-600 mb-2">{profileData.designation}</p>
          <p className="text-sm text-blue-700">{profileData.department}</p>
          <div className="mt-4 pt-4 border-t border-blue-100">
            <p className="text-sm text-blue-600">Employee ID</p>
            <p className="font-semibold text-blue-900">{profileData.employeeId}</p>
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
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-blue-900 font-medium">{profileData.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-blue-900 font-medium">{profileData.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-blue-900 font-medium">{profileData.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">Designation</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.designation}
                  onChange={(e) => setProfileData({...profileData, designation: e.target.value})}
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-blue-900 font-medium">{profileData.designation}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">Department</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.department}
                  onChange={(e) => setProfileData({...profileData, department: e.target.value})}
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-blue-900 font-medium">{profileData.department}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">Join Date</label>
              <p className="text-blue-900 font-medium">{profileData.joinDate}</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-blue-700 mb-2">Address</label>
              {isEditing ? (
                <textarea
                  value={profileData.address}
                  onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                  rows="3"
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-blue-900 font-medium">{profileData.address}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">Qualification</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.qualification}
                  onChange={(e) => setProfileData({...profileData, qualification: e.target.value})}
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-blue-900 font-medium">{profileData.qualification}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">Experience</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.experience}
                  onChange={(e) => setProfileData({...profileData, experience: e.target.value})}
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-blue-900 font-medium">{profileData.experience}</p>
              )}
            </div>
          </div>
        </div>
      </div>

   
    </div>
  );
};

export default Profile;