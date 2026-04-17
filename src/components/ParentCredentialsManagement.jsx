import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { FaUser, FaPlus, FaEdit, FaTrash, FaUsers } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import { parentCredentialsAPI, studentAPI } from '../utils/apiService';

const ParentCredentialsManagement = ({ studentId, studentName, onClose }) => {
  const [parentCredentials, setParentCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingParent, setEditingParent] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchStudentData();
    fetchParentCredentials();
  }, [studentId]);

  const fetchStudentData = async () => {
    try {
      const { data } = await studentAPI.getById(studentId);
      const student = data.student || data;
      setStudentData(student);
    } catch (err) {
      console.error('Failed to load student data:', err);
    }
  };

  const fetchParentCredentials = async () => {
    try {
      setLoading(true);
      const response = await parentCredentialsAPI.getByStudent(studentId);
      const credentials = response.data?.data || response.data || [];
      setParentCredentials(Array.isArray(credentials) ? credentials : []);
    } catch (err) {
      console.error('Failed to load parent credentials:', err);
      setParentCredentials([]);
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.firstName.trim()) errs.firstName = 'Parent name is required';
    if (!formData.mobile.trim()) errs.mobile = 'Mobile number is required';
    else if (!/^\d{10}$/.test(formData.mobile)) errs.mobile = '10-digit mobile required';
    if (!editingParent) {
      if (!formData.password) errs.password = 'Password is required';
      else if (formData.password.length < 6) errs.password = 'Password must be at least 6 characters';
      if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setSubmitting(true);
    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        mobile: formData.mobile,
        role: 'parent',
        studentId: studentId
      };

      if (!editingParent) {
        payload.password = formData.password;
      } else if (formData.password) {
        payload.password = formData.password;
      }

      if (editingParent) {
        await parentCredentialsAPI.update(editingParent._id, payload);
        Swal.fire({ icon: 'success', title: 'Parent Updated!', timer: 1500, showConfirmButton: false });
      } else {
        await parentCredentialsAPI.create(payload);
        Swal.fire({ icon: 'success', title: 'Parent Credentials Added!', timer: 1500, showConfirmButton: false });
      }
      fetchParentCredentials();
      resetForm();
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Operation failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingParent(null);
    setFormData({ firstName: '', lastName: '', mobile: '', password: '', confirmPassword: '' });
    setErrors({});
  };

  const handleEdit = (parent) => {
    setEditingParent(parent);
    setFormData({
      firstName: parent.firstName || '',
      lastName: parent.lastName || '',
      mobile: parent.mobile || '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
    setShowForm(true);
  };

  const handleDelete = (parent) => {
    Swal.fire({ title: 'Delete Parent Credentials?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444' })
      .then(async (res) => {
        if (res.isConfirmed) {
          try {
            await parentCredentialsAPI.delete(parent._id);
            setParentCredentials(parentCredentials.filter(x => x._id !== parent._id));
            Swal.fire({ icon: 'success', title: 'Deleted', timer: 1200, showConfirmButton: false });
          } catch (err) {
            Swal.fire('Error', err.response?.data?.message || 'Delete failed', 'error');
          }
        }
      });
  };

  const addFatherCredentials = () => {
    if (studentData?.guardianInfo?.fatherName) {
      setFormData({
        firstName: studentData.guardianInfo.fatherName,
        lastName: '',
        mobile: studentData.guardianInfo.fatherMobile || '',
        password: '',
        confirmPassword: ''
      });
    }
    setShowForm(true);
    setEditingParent(null);
    setErrors({});
  };

  const addMotherCredentials = () => {
    if (studentData?.guardianInfo?.motherName) {
      setFormData({
        firstName: studentData.guardianInfo.motherName,
        lastName: '',
        mobile: studentData.guardianInfo.motherMobile || '',
        password: '',
        confirmPassword: ''
      });
    }
    setShowForm(true);
    setEditingParent(null);
    setErrors({});
  };

  const inp = (field) => `w-full border-2 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 transition bg-white text-sm ${errors[field] ? 'border-red-400' : 'border-gray-300'}`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-blue-600 p-6 flex items-center justify-between border-b">
          <div className="flex items-center gap-3">
            <FaUsers className="text-white text-2xl" />
            <div>
              <h2 className="text-xl font-bold text-white">Parent Credentials</h2>
              <p className="text-blue-100 text-sm">{studentName}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-blue-700 p-2 rounded-lg transition">
            <MdClose size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick Add Buttons */}
          {!showForm && (
            <div className="grid grid-cols-2 gap-3">
              {studentData?.guardianInfo?.fatherName && (
                <button 
                  onClick={addFatherCredentials}
                  className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition flex items-center justify-center gap-2 font-semibold text-sm"
                >
                  <FaPlus /> Add Father
                </button>
              )}
              {studentData?.guardianInfo?.motherName && (
                <button 
                  onClick={addMotherCredentials}
                  className="bg-pink-600 text-white px-4 py-2 rounded-xl hover:bg-pink-700 transition flex items-center justify-center gap-2 font-semibold text-sm"
                >
                  <FaPlus /> Add Mother
                </button>
              )}
            </div>
          )}

          {/* Form */}
          {showForm && (
            <div className="bg-gray-50 rounded-xl p-6 border-2 border-blue-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">{editingParent ? 'Edit Parent' : 'Add Parent Credentials'}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Parent Name *</label>
                    <input 
                      type="text" 
                      placeholder="Auto-filled from student data" 
                      value={formData.firstName} 
                      onChange={(e) => { setFormData({ ...formData, firstName: e.target.value }); setErrors({ ...errors, firstName: '' }); }} 
                      className={inp('firstName')} 
                    />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Last Name</label>
                    <input 
                      type="text" 
                      placeholder="Optional" 
                      value={formData.lastName} 
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} 
                      className={inp('lastName')} 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number *</label>
                  <input 
                    type="tel" 
                    placeholder="10-digit number" 
                    value={formData.mobile} 
                    onChange={(e) => { setFormData({ ...formData, mobile: e.target.value }); setErrors({ ...errors, mobile: '' }); }} 
                    className={inp('mobile')} 
                  />
                  {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
                </div>

                {!editingParent && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Password *</label>
                      <input 
                        type="password" 
                        placeholder="Min 6 characters" 
                        value={formData.password} 
                        onChange={(e) => { setFormData({ ...formData, password: e.target.value }); setErrors({ ...errors, password: '' }); }} 
                        className={inp('password')} 
                      />
                      {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm Password *</label>
                      <input 
                        type="password" 
                        placeholder="Confirm password" 
                        value={formData.confirmPassword} 
                        onChange={(e) => { setFormData({ ...formData, confirmPassword: e.target.value }); setErrors({ ...errors, confirmPassword: '' }); }} 
                        className={inp('confirmPassword')} 
                      />
                      {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                    </div>
                  </>
                )}

                {editingParent && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">New Password (Leave empty to keep current)</label>
                    <input 
                      type="password" 
                      placeholder="New password" 
                      value={formData.password} 
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                      className={inp('password')} 
                    />
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button type="submit" disabled={submitting} className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 font-semibold transition disabled:opacity-60">
                    {submitting ? 'Saving...' : editingParent ? 'Update' : 'Add'}
                  </button>
                  <button type="button" onClick={resetForm} className="bg-gray-300 text-gray-700 px-6 py-2 rounded-xl hover:bg-gray-400 font-semibold transition">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* List */}
          {loading ? (
            <div className="text-center py-8"><p className="text-gray-500">Loading...</p></div>
          ) : parentCredentials.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FaUser className="mx-auto text-4xl mb-2 opacity-30" />
              <p>No parent credentials added yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {parentCredentials.map((parent) => (
                <div key={parent._id} className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-blue-300 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{parent.firstName} {parent.lastName}</h4>
                      <div className="text-sm text-gray-600 mt-1 space-y-1">
                        <p>📱 {parent.mobile}</p>
                        <p className="text-xs text-gray-500">Role: {parent.role}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(parent)} className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition" title="Edit">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(parent)} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition" title="Delete">
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentCredentialsManagement;
