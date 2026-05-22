import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MdPerson, MdEmail, MdPhone, MdLocationOn, MdSchool, MdUpload,
  MdVisibility, MdCalendarToday, MdWc, MdLanguage, MdGroups,
  MdMap, MdAssignmentInd, MdCloudUpload, MdArrowBack
} from 'react-icons/md';
import { FaFingerprint, FaCertificate, FaFileAlt, FaGlobe, FaMapMarkerAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002';

const Registration = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Helper to preview uploaded files in a new tab
  const handleFilePreview = (file) => {
    if (!file) return;
    if (typeof file === 'string') {
      window.open(file, '_blank');
    } else {
      const fileUrl = URL.createObjectURL(file);
      window.open(fileUrl, '_blank');
    }
  };

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    gender: 'male',
    category: 'general',
    religion: 'Hindu',
    bloodGroup: '',
    aadhaarNumber: '',
    class: '',
    section: '',
    admissionDate: new Date().toISOString().split('T')[0],

    // Address Hub
    permanentAddress: '',
    permanentCity: '',
    permanentState: '',
    permanentPincode: '',
    currentAddress: '',
    currentCity: '',
    currentState: '',
    currentPincode: '',
    sameAsPermament: false,

    // Guardian Record
    fatherName: '',
    motherName: '',
    guardianPhone: '',
    emergencyContact: '',

    // Historical Inception (Previous School)
    hasPreviousEducation: 'no',
    prevSchoolName: '',
    prevClass: '',
    prevSchoolAddress: '',
    prevMarksType: 'percentage',
    prevMarksValue: '',

    // Bio-Metric & Documents
    studentPhoto: null,
    fileMarksheet: null,
    fileTC: null,
    fileCharacterCert: null,
    fileMigrationCert: null,
    aadharCard: null,
    birthCertificate: null,
    fileCasteCertificate: null,
    medicalCertificate: null
  });

  const [existingDocs, setExistingDocs] = useState({
    studentPhoto: '',
    medicalCertificate: '',
    casteCertificate: '',
    marksheet: '',
    characterCertificate: '',
    transferCertificate: '',
    aadharCard: '',
    birthCertificate: '',
    migrationCertificate: ''
  });

  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [appNumber, setAppNumber] = useState('');

  useEffect(() => {
    fetchClasses();
    if (isEditMode) {
      fetchStudentData();
    }
  }, [id]);

  const fetchClasses = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/staff-panel/class/all`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data && response.data.classes) {
        setClasses(response.data.classes);
      } else if (Array.isArray(response.data)) {
        setClasses(response.data);
      }
    } catch (error) {
      toast.error('Failed to materialize class list');
    }
  };

  useEffect(() => {
    if (formData.class) {
      setSections([]); // Clear previous sections while loading
      fetchSections(formData.class);
    } else {
      setSections([]);
    }
  }, [formData.class]);

  const fetchSections = async (classId) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/staff-panel/class/${classId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data && response.data.sections) {
        setSections(response.data.sections);
      } else if (Array.isArray(response.data)) {
        setSections(response.data);
      }
    } catch (error) {
      toast.error('Section synchronization failed');
    }
  };

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/staff-panel/admission/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const student = response.data.student || response.data;
      setAppNumber(student.admissionNumber || student._id);

      // Auto-replace Mongo ID in URL with admissionNumber if applicable
      if (student.admissionNumber && id !== student.admissionNumber) {
        navigate(`/edit-admission/${student.admissionNumber}`, { replace: true });
      }

      setFormData(prev => ({
        ...prev,
        firstName: student.firstName || '',
        lastName: student.lastName || '',
        email: student.email || '',
        phone: student.phone || '',
        dob: student.dob ? student.dob.split('T')[0] : '',
        gender: student.gender || 'male',
        category: student.category || 'general',
        religion: student.religion || 'Hindu',
        bloodGroup: student.bloodGroup || '',
        aadhaarNumber: student.aadhaarNumber || '',
        class: student.class?._id || student.class || '',
        section: student.section?._id || student.section || '',
        admissionDate: student.admissionDate ? student.admissionDate.split('T')[0] : (student.createdAt ? student.createdAt.split('T')[0] : ''),

        permanentAddress: student.permanentAddress?.address || '',
        permanentCity: student.permanentAddress?.city || '',
        permanentState: student.permanentAddress?.state || '',
        permanentPincode: student.permanentAddress?.pincode || '',

        currentAddress: student.currentAddress?.address || '',
        currentCity: student.currentAddress?.city || '',
        currentState: student.currentAddress?.state || '',
        currentPincode: student.currentAddress?.pincode || '',
        sameAsPermament: false,

        fatherName: student.fatherName || student.guardianInfo?.fatherName || '',
        motherName: student.motherName || student.guardianInfo?.motherName || '',
        guardianPhone: student.guardianPhone || student.guardianInfo?.guardianPhone || '',
        emergencyContact: student.emergencyContact || student.guardianInfo?.emergencyPhone || '',

        hasPreviousEducation: student.hasPreviousEducation || 'no',
        prevSchoolName: student.previousEducation?.previousSchoolName || '',
        prevSchoolAddress: student.previousEducation?.previousSchoolAddress || '',
        prevMarksType: student.previousEducation?.previousMarksType || 'percentage',
        prevMarksValue: student.previousEducation?.previousPercentage || '',
      }));

      const formatUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `${BASE_URL}/${path.replace(/\\/g, '/')}`;
      };

      setExistingDocs({
        studentPhoto: formatUrl(student.profileImage),
        medicalCertificate: formatUrl(student.medicalCertificate),
        casteCertificate: formatUrl(student.casteCertificate),
        marksheet: formatUrl(student.documents?.marksheet || student.previousEducation?.marksheet),
        characterCertificate: formatUrl(student.documents?.characterCertificate || student.previousEducation?.characterCertificate),
        transferCertificate: formatUrl(student.documents?.transferCertificate || student.previousEducation?.transferCertificate),
        migrationCertificate: formatUrl(student.documents?.migrationCertificate || student.previousEducation?.migrationCertificate),
        aadharCard: formatUrl(student.documents?.aadharCard),
        birthCertificate: formatUrl(student.documents?.birthCertificate)
      });
    } catch (error) {
      toast.error('Student data retrieval failed');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else if (type === 'checkbox') {
      if (name === 'sameAsPermament') {
        setFormData({
          ...formData,
          sameAsPermament: checked,
          currentAddress: checked ? formData.permanentAddress : '',
          currentCity: checked ? formData.permanentCity : '',
          currentState: checked ? formData.permanentState : '',
          currentPincode: checked ? formData.permanentPincode : ''
        });
      } else {
        setFormData({ ...formData, [name]: checked });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.firstName) tempErrors.firstName = "First name is required";
    if (!formData.phone || !/^\d{10}$/.test(formData.phone)) tempErrors.phone = "Invalid phone number (10 digits required)";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = "Invalid email address";
    if (!formData.aadhaarNumber || !/^\d{12}$/.test(formData.aadhaarNumber)) tempErrors.aadhaarNumber = "Invalid Aadhaar number (12 digits required)";

    setErrors(tempErrors);
    
    const errorKeys = Object.keys(tempErrors);
    if (errorKeys.length > 0) {
      toast.error(tempErrors[errorKeys[0]]);
      
      const errorElement = document.querySelector(`[name="${errorKeys[0]}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        errorElement.focus();
      }
      
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    const data = new FormData();
    
    // Whitelist of allowed text fields
    const allowedTextFields = [
      'firstName', 'lastName', 'email', 'phone', 'dob', 'gender', 'category', 'religion', 
      'bloodGroup', 'aadhaarNumber', 'class', 'section', 'admissionDate', 
      'permanentAddress', 'permanentCity', 'permanentState', 'permanentPincode',
      'currentAddress', 'currentCity', 'currentState', 'currentPincode', 'sameAsPermament',
      'fatherName', 'motherName', 'guardianPhone', 'emergencyContact', 
      'hasPreviousEducation', 'prevSchoolName', 'prevSchoolAddress', 'prevMarksType', 'prevMarksValue'
    ];

    // Whitelist of allowed file fields (matching backend multer names)
    const allowedFileFields = [
      'studentPhoto', 'medicalCertificate', 'fileCasteCertificate', 
      'fileMarksheet', 'fileCharacterCert', 'fileTC', 'fileMigrationCert', 
      'aadharCard', 'birthCertificate'
    ];

    Object.keys(formData).forEach(key => {
      const value = formData[key];
      if (value !== null && value !== undefined && value !== '') {
        if (allowedFileFields.includes(key)) {
          if (value instanceof File) {
            data.append(key, value);
          }
        } else if (allowedTextFields.includes(key)) {
          if (key === 'class') {
            data.append('course', value);
          } else {
            data.append(key, value);
          }
        }
      }
    });

    try {
      setLoading(true);
      const url = isEditMode
        ? `${BASE_URL}/api/staff-panel/admission/${id}`
        : `${BASE_URL}/api/staff-panel/admission/add`;

      await axios({
        method: isEditMode ? 'PUT' : 'POST',
        url,
        data,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      toast.success(isEditMode ? 'Admission details updated successfully' : 'Admission application submitted successfully');
      navigate(-1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit form');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-xs">Synchronizing Identity Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 animate-fadeIn">
      <div className="max-w-7xl mx-auto mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate(-1)} className="p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-gray-500 hover:text-blue-600 cursor-pointer">
            <MdArrowBack size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{isEditMode ? 'Edit Admission' : 'New Admission'}</h1>
            {isEditMode && appNumber && (
              <span className="inline-block mt-1 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-md">
                App ID: {appNumber}
              </span>
            )}
            <p className="text-sm text-gray-500 mt-1">Fill in the student details below to complete the registration.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto space-y-8">
        
        {/* Personal Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center border-b pb-4">
            <MdPerson className="mr-2 text-blue-500" size={24} />
            Personal Information
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">First Name <span className="text-red-500">*</span></label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all ${errors.firstName ? 'border-red-500' : 'border-gray-200'}`} placeholder="Enter first name" required />
                {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Last Name <span className="text-red-500">*</span></label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Enter last name" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Email Address <span className="text-red-500">*</span></label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all ${errors.email ? 'border-red-500' : 'border-gray-200'}`} placeholder="student@example.com" required />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Phone Number <span className="text-red-500">*</span></label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all ${errors.phone ? 'border-red-500' : 'border-gray-200'}`} placeholder="10-digit mobile number" required />
                {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Date of Birth <span className="text-red-500">*</span></label>
                <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Photo Upload */}
            <div className="lg:col-span-1 flex flex-col items-center justify-center space-y-4">
              <label className="text-sm font-semibold text-gray-700 w-full text-center">Student Photo</label>
              <div className="w-40 h-40 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 relative group cursor-pointer hover:border-blue-500 transition-colors">
                <input type="file" name="studentPhoto" onChange={handleInputChange} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                {formData.studentPhoto instanceof File ? (
                  <img src={URL.createObjectURL(formData.studentPhoto)} alt="Preview" className="w-full h-full object-cover" />
                ) : existingDocs.studentPhoto ? (
                  <img src={existingDocs.studentPhoto} alt="Existing" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-4">
                    <MdCloudUpload className="mx-auto text-gray-400 group-hover:text-blue-500 mb-2" size={32} />
                    <span className="text-xs text-gray-500">Upload Photo<br/>(Max 2MB)</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Previous Education */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-between border-b pb-4 mb-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
              <MdSchool className="mr-2 text-blue-500" size={24} />
              Previous Education
            </h3>
            <div className="flex items-center space-x-4">
              <label className="text-sm text-gray-700 font-medium">Has Previous Education?</label>
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button type="button" onClick={() => setFormData({ ...formData, hasPreviousEducation: 'yes' })} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer ${formData.hasPreviousEducation === 'yes' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Yes</button>
                <button type="button" onClick={() => setFormData({ ...formData, hasPreviousEducation: 'no' })} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer ${formData.hasPreviousEducation === 'no' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>No</button>
              </div>
            </div>
          </div>

          {formData.hasPreviousEducation === 'yes' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Previous School Name <span className="text-red-500">*</span></label>
                  <input type="text" name="prevSchoolName" value={formData.prevSchoolName} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Enter school name" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Previous School Address <span className="text-red-500">*</span></label>
                  <input type="text" name="prevSchoolAddress" value={formData.prevSchoolAddress} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="City, State" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Marks Type <span className="text-red-500">*</span></label>
                  <select name="prevMarksType" value={formData.prevMarksType} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer" required>
                    <option value="percentage">Percentage (%)</option>
                    <option value="cgpa">CGPA (1-10)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
                <div className="relative group border border-gray-200 rounded-xl p-4 text-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-50">
                  <input type="file" name="fileMarksheet" onChange={handleInputChange} accept=".pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                  <p className="text-sm font-bold text-gray-700">Marksheet</p>
                  <p className="text-xs text-gray-500 mt-1 truncate">{formData.fileMarksheet ? formData.fileMarksheet.name : (existingDocs.marksheet ? 'Uploaded' : 'Upload')}</p>
                </div>
                <div className="relative group border border-gray-200 rounded-xl p-4 text-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-50">
                  <input type="file" name="fileTC" onChange={handleInputChange} accept=".pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                  <p className="text-sm font-bold text-gray-700">Transfer Certificate</p>
                  <p className="text-xs text-gray-500 mt-1 truncate">{formData.fileTC ? formData.fileTC.name : (existingDocs.transferCertificate ? 'Uploaded' : 'Upload')}</p>
                </div>
                <div className="relative group border border-gray-200 rounded-xl p-4 text-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-50">
                  <input type="file" name="fileCharacterCert" onChange={handleInputChange} accept=".pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                  <p className="text-sm font-bold text-gray-700">Character Certificate</p>
                  <p className="text-xs text-gray-500 mt-1 truncate">{formData.fileCharacterCert ? formData.fileCharacterCert.name : (existingDocs.characterCertificate ? 'Uploaded' : 'Upload')}</p>
                </div>
                <div className="relative group border border-gray-200 rounded-xl p-4 text-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-50">
                  <input type="file" name="fileMigrationCert" onChange={handleInputChange} accept=".pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                  <p className="text-sm font-bold text-gray-700">Migration Certificate</p>
                  <p className="text-xs text-gray-500 mt-1 truncate">{formData.fileMigrationCert ? formData.fileMigrationCert.name : (existingDocs.migrationCertificate ? 'Uploaded' : 'Upload')}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Documents & Verification */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center border-b pb-4">
            <FaFingerprint className="mr-2 text-blue-500" size={22} />
            Documents & Verification
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Caste Cert */}
            {formData.category && formData.category.toLowerCase() !== 'general' && (
              <div className="relative group border border-gray-200 rounded-xl p-6 text-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-50 hover:bg-blue-50/30">
                <input type="file" name="fileCasteCertificate" onChange={handleInputChange} accept=".pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                <FaCertificate size={28} className={`mx-auto mb-3 ${formData.fileCasteCertificate || existingDocs.casteCertificate ? 'text-green-500' : 'text-gray-400'}`} />
                <p className="text-sm font-bold text-gray-700">Caste Certificate</p>
                <p className="text-xs text-gray-500 mt-1 truncate">{formData.fileCasteCertificate ? formData.fileCasteCertificate.name : (existingDocs.casteCertificate ? 'Document Uploaded' : 'Click to Upload')}</p>
                {(formData.fileCasteCertificate || existingDocs.casteCertificate) && (
                  <div onClick={() => handleFilePreview(formData.fileCasteCertificate || existingDocs.casteCertificate)} className="absolute top-2 right-2 p-1.5 bg-green-100 text-green-600 rounded-md hover:bg-green-200 z-30">
                    <MdVisibility size={16} />
                  </div>
                )}
              </div>
            )}

            {/* Medical Cert */}
            <div className="relative group border border-gray-200 rounded-xl p-6 text-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-50 hover:bg-blue-50/30">
              <input type="file" name="medicalCertificate" onChange={handleInputChange} accept=".pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
              <MdUpload size={28} className={`mx-auto mb-3 ${formData.medicalCertificate || existingDocs.medicalCertificate ? 'text-green-500' : 'text-gray-400'}`} />
              <p className="text-sm font-bold text-gray-700">Medical Certificate</p>
              <p className="text-xs text-gray-500 mt-1 truncate">{formData.medicalCertificate ? formData.medicalCertificate.name : (existingDocs.medicalCertificate ? 'Document Uploaded' : 'Click to Upload')}</p>
              {(formData.medicalCertificate || existingDocs.medicalCertificate) && (
                <div onClick={() => handleFilePreview(formData.medicalCertificate || existingDocs.medicalCertificate)} className="absolute top-2 right-2 p-1.5 bg-green-100 text-green-600 rounded-md hover:bg-green-200 z-30">
                  <MdVisibility size={16} />
                </div>
              )}
            </div>

            {/* Aadhar Card */}
            <div className="relative group border border-gray-200 rounded-xl p-6 text-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-50 hover:bg-blue-50/30">
              <input type="file" name="aadharCard" onChange={handleInputChange} accept=".pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
              <MdAssignmentInd size={28} className={`mx-auto mb-3 ${formData.aadharCard || existingDocs.aadharCard ? 'text-green-500' : 'text-gray-400'}`} />
              <p className="text-sm font-bold text-gray-700">Aadhaar Card</p>
              <p className="text-xs text-gray-500 mt-1 truncate">{formData.aadharCard ? formData.aadharCard.name : (existingDocs.aadharCard ? 'Document Uploaded' : 'Click to Upload')}</p>
              {(formData.aadharCard || existingDocs.aadharCard) && (
                <div onClick={() => handleFilePreview(formData.aadharCard || existingDocs.aadharCard)} className="absolute top-2 right-2 p-1.5 bg-green-100 text-green-600 rounded-md hover:bg-green-200 z-30">
                  <MdVisibility size={16} />
                </div>
              )}
            </div>

            {/* Birth Cert */}
            <div className="relative group border border-gray-200 rounded-xl p-6 text-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-50 hover:bg-blue-50/30">
              <input type="file" name="birthCertificate" onChange={handleInputChange} accept=".pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
              <MdCalendarToday size={28} className={`mx-auto mb-3 ${formData.birthCertificate || existingDocs.birthCertificate ? 'text-green-500' : 'text-gray-400'}`} />
              <p className="text-sm font-bold text-gray-700">Birth Certificate</p>
              <p className="text-xs text-gray-500 mt-1 truncate">{formData.birthCertificate ? formData.birthCertificate.name : (existingDocs.birthCertificate ? 'Document Uploaded' : 'Click to Upload')}</p>
              {(formData.birthCertificate || existingDocs.birthCertificate) && (
                <div onClick={() => handleFilePreview(formData.birthCertificate || existingDocs.birthCertificate)} className="absolute top-2 right-2 p-1.5 bg-green-100 text-green-600 rounded-md hover:bg-green-200 z-30">
                  <MdVisibility size={16} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Parent / Guardian Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center border-b pb-4">
            <MdGroups className="mr-2 text-blue-500" size={24} />
            Parent/Guardian Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Father's Name <span className="text-red-500">*</span></label>
              <input type="text" name="fatherName" value={formData.fatherName} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Enter father's name" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Mother's Name <span className="text-red-500">*</span></label>
              <input type="text" name="motherName" value={formData.motherName} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Enter mother's name" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Guardian's Phone <span className="text-red-500">*</span></label>
              <input type="tel" name="guardianPhone" value={formData.guardianPhone} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="10-digit mobile number" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Emergency Contact <span className="text-red-500">*</span></label>
              <input type="tel" name="emergencyContact" value={formData.emergencyContact} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="10-digit mobile number" required />
            </div>
          </div>
        </div>

        {/* Academic Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center border-b pb-4">
            <MdSchool className="mr-2 text-blue-500" size={24} />
            Academic Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Aadhaar Number <span className="text-red-500">*</span></label>
              <input type="text" name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleInputChange} className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all ${errors.aadhaarNumber ? 'border-red-500' : 'border-gray-200'}`} placeholder="12-digit Aadhaar Number" required />
              {errors.aadhaarNumber && <p className="text-xs text-red-500">{errors.aadhaarNumber}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Class <span className="text-red-500">*</span></label>
              <select name="class" value={formData.class} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer" required>
                <option value="">Select Class</option>
                {classes.map(c => <option key={c._id} value={c._id}>{c.className}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Section <span className="text-red-500">*</span></label>
              <select name="section" value={formData.section} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer" required disabled={!formData.class}>
                <option value="">Select Section</option>
                {sections.map(s => <option key={s._id} value={s._id}>{s.sectionName}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Admission Date <span className="text-red-500">*</span></label>
              <input type="date" name="admissionDate" value={formData.admissionDate} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Category</label>
              <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer">
                <option value="general">General</option>
                <option value="obc">OBC</option>
                <option value="sc">SC</option>
                <option value="st">ST</option>
                <option value="ews">EWS</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Religion</label>
              <select name="religion" value={formData.religion} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer">
                <option value="Hindu">Hindu</option>
                <option value="Muslim">Muslim</option>
                <option value="Sikh">Sikh</option>
                <option value="Christian">Christian</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Blood Group</label>
              <input type="text" name="bloodGroup" value={formData.bloodGroup} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="e.g., O+" />
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-between border-b pb-4 mb-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
              <MdLocationOn className="mr-2 text-blue-500" size={24} />
              Address Information
            </h3>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" name="sameAsPermament" checked={formData.sameAsPermament} onChange={handleInputChange} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
              <span className="text-sm font-medium text-gray-700">Same as Permanent Address</span>
            </label>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="text-md font-semibold text-gray-700 bg-gray-50 px-4 py-2 rounded-lg inline-block">Permanent Address</h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Street Address <span className="text-red-500">*</span></label>
                  <textarea name="permanentAddress" value={formData.permanentAddress} onChange={handleInputChange} rows="2" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none" placeholder="Enter full address" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">City <span className="text-red-500">*</span></label>
                    <input type="text" name="permanentCity" value={formData.permanentCity} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="City" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">State <span className="text-red-500">*</span></label>
                    <input type="text" name="permanentState" value={formData.permanentState} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="State" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Pincode / ZIP <span className="text-red-500">*</span></label>
                  <input type="text" name="permanentPincode" value={formData.permanentPincode} onChange={handleInputChange} className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all ${errors.permanentPincode ? 'border-red-500' : 'border-gray-200'}`} placeholder="Pincode" required />
                </div>
              </div>
            </div>

            <div className={`space-y-6 ${formData.sameAsPermament ? 'opacity-50 pointer-events-none' : ''}`}>
              <h4 className="text-md font-semibold text-gray-700 bg-gray-50 px-4 py-2 rounded-lg inline-block">Current Address</h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Street Address <span className="text-red-500">*</span></label>
                  <textarea name="currentAddress" value={formData.currentAddress} onChange={handleInputChange} rows="2" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none" placeholder="Enter full address" required={!formData.sameAsPermament} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">City <span className="text-red-500">*</span></label>
                    <input type="text" name="currentCity" value={formData.currentCity} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="City" required={!formData.sameAsPermament} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">State <span className="text-red-500">*</span></label>
                    <input type="text" name="currentState" value={formData.currentState} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="State" required={!formData.sameAsPermament} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Pincode / ZIP <span className="text-red-500">*</span></label>
                  <input type="text" name="currentPincode" value={formData.currentPincode} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Pincode" required={!formData.sameAsPermament} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4 pb-12">
          <button type="submit" disabled={loading} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Processing...' : (isEditMode ? 'Update Admission Details' : 'Submit Admission Application')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Registration;
