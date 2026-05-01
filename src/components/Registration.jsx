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

    // Guardian Manifest
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
    if (!formData.firstName) tempErrors.firstName = "Materialize First Name";
    if (!formData.phone || !/^\d{10}$/.test(formData.phone)) tempErrors.phone = "Invalid Comm Link (10 digits)";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = "Invalid Digital ID (Email)";
    if (!formData.aadhaarNumber || !/^\d{12}$/.test(formData.aadhaarNumber)) tempErrors.aadhaarNumber = "Aadhaar Identity Protocol Mismatch";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Encryption Failed: Validation Mismatch');
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
          data.append(key, value);
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

      toast.success(isEditMode ? 'Student Identity Optimized' : 'Student Materialized Successfully');
      navigate(-1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Matrix Operation Failed');
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
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 lg:p-12 animate-fadeIn">
      <div className="max-w-7xl mx-auto mb-10 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <button onClick={() => navigate(-1)} className="p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all text-slate-400 hover:text-rose-500">
            <MdArrowBack size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">{isEditMode ? 'Optimize' : 'Initiate'} Student Identity</h1>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.4em] mt-1">Core Institutional Registration Protocol</p>
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <div className="px-6 py-3 bg-white rounded-2xl shadow-sm flex items-center space-x-3 border-r-4 border-rose-500">
            <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Neural Link Active</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto space-y-12">
        {/* Core Biological Data */}
        <div className="bg-white rounded-[3.5rem] shadow-sm border border-slate-100 p-12 group hover:border-rose-100 transition-all duration-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-rose-100/50 transition-all" />

          <h3 className="text-xs font-black text-slate-400 mb-10 flex items-center uppercase tracking-[0.4em] relative z-10">
            <MdPerson className="mr-3 text-rose-500 group-hover:scale-125 transition-transform" size={20} />
            Biological Identity Matrix
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
            {/* Left: Bio Info */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="FIRST NOMENCLATURE..." className={`w-full px-8 py-4 bg-slate-50 border-2 rounded-2xl focus:bg-white outline-none font-black text-[10px] tracking-widest transition-all ${errors.firstName ? 'border-rose-500' : 'border-transparent focus:border-rose-400'}`} required />
                {errors.firstName && <p className="text-[8px] font-black text-rose-500 ml-4 uppercase">{errors.firstName}</p>}
              </div>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="LAST NOMENCLATURE..." className="w-full px-8 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-rose-400 outline-none font-black text-[10px] tracking-widest uppercase" required />

              <div className="space-y-1">
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="DIGITAL ID (EMAIL)..." className={`w-full px-8 py-4 bg-slate-50 border-2 rounded-2xl focus:bg-white outline-none font-black text-[10px] tracking-widest transition-all ${errors.email ? 'border-rose-500' : 'border-transparent focus:border-rose-400'}`} required />
                {errors.email && <p className="text-[8px] font-black text-rose-500 ml-4 uppercase">{errors.email}</p>}
              </div>
              <div className="space-y-1">
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="COMM LINK (PHONE)..." className={`w-full px-8 py-4 bg-slate-50 border-2 rounded-2xl focus:bg-white outline-none font-black text-[10px] tracking-widest transition-all ${errors.phone ? 'border-rose-500' : 'border-transparent focus:border-rose-400'}`} required />
                {errors.phone && <p className="text-[8px] font-black text-rose-500 ml-4 uppercase">{errors.phone}</p>}
              </div>

              <div className="space-y-1 relative">
                <MdCalendarToday className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} className="w-full pl-16 pr-8 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-rose-400 outline-none font-black text-[10px] tracking-widest" required />
              </div>

              <div className="space-y-1 relative">
                <MdWc className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full pl-16 pr-8 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-rose-400 outline-none font-black text-[10px] tracking-widest uppercase cursor-pointer">
                  <option value="male">MALE / BIOLOGICAL XY</option>
                  <option value="female">FEMALE / BIOLOGICAL XX</option>
                  <option value="other">NON-BINARY / OTHER</option>
                </select>
              </div>
            </div>

            {/* Right: Bio-Metric (Photo) */}
            <div className="flex flex-col items-center justify-center space-y-6 bg-slate-50 rounded-[2.5rem] p-10 border-2 border-dashed border-slate-200 group/upload hover:border-rose-300 transition-all cursor-pointer relative overflow-hidden">
              <input type="file" name="studentPhoto" onChange={handleInputChange} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
              <div className="w-40 h-40 rounded-full bg-white shadow-xl flex items-center justify-center overflow-hidden border-4 border-white ring-4 ring-slate-100 group-hover/upload:ring-rose-100 transition-all">
                {formData.studentPhoto instanceof File ? (
                  <img src={URL.createObjectURL(formData.studentPhoto)} alt="Preview" className="w-full h-full object-cover" />
                ) : existingDocs.studentPhoto ? (
                  <img src={existingDocs.studentPhoto} alt="Existing" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center">
                    <MdCloudUpload className="mx-auto text-slate-300 group-hover/upload:text-rose-400 transition-colors" size={48} />
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mt-2">Bio-Metric Image</span>
                  </div>
                )}
              </div>
              <div className="text-center">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Neural Recognition Profile</p>
                <p className="text-[8px] text-slate-400 uppercase mt-1">PNG, JPG or WEBP (MAX 2MB)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Institutional Coordinates */}
        <div className="bg-white rounded-[3.5rem] shadow-sm border border-slate-100 p-12 group hover:border-emerald-100 transition-all duration-500">
          <h3 className="text-xs font-black text-slate-400 mb-10 flex items-center uppercase tracking-[0.4em]">
            <MdSchool className="mr-3 text-emerald-500 group-hover:scale-125 transition-transform" size={20} />
            Institutional Deployment Vector
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1 space-y-1">
              <input type="text" name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleInputChange} placeholder="AADHAAR IDENTITY PROTOCOL..." className={`w-full px-8 py-4 bg-slate-50 border-2 rounded-2xl focus:bg-white outline-none font-black text-[10px] tracking-widest transition-all ${errors.aadhaarNumber ? 'border-rose-500' : 'border-transparent focus:border-emerald-400'}`} required />
              {errors.aadhaarNumber && <p className="text-[8px] font-black text-rose-500 ml-4 uppercase">{errors.aadhaarNumber}</p>}
            </div>
            <select name="class" value={formData.class} onChange={handleInputChange} className="px-8 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-400 outline-none font-black text-[10px] tracking-widest uppercase cursor-pointer" required>
              <option value="">SELECT ACADEMIC TIER</option>
              {classes.map(c => <option key={c._id} value={c._id}>{c.className}</option>)}
            </select>
            <select name="section" value={formData.section} onChange={handleInputChange} className="px-8 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-400 outline-none font-black text-[10px] tracking-widest uppercase cursor-pointer" required disabled={!formData.class}>
              <option value="">SELECT DEPLOYMENT ZONE (SECTION)</option>
              {sections.map(s => <option key={s._id} value={s._id}>{s.sectionName}</option>)}
            </select>
            <div className="relative">
              <MdCalendarToday className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="date" name="admissionDate" value={formData.admissionDate} onChange={handleInputChange} className="w-full pl-16 pr-8 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-400 outline-none font-black text-[10px] tracking-widest" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <select name="category" value={formData.category} onChange={handleInputChange} className="px-8 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-400 outline-none font-black text-[10px] tracking-widest uppercase cursor-pointer">
              <option value="general">GENERAL PROTOCOL</option>
              <option value="obc">OBC PROTOCOL</option>
              <option value="sc">SC PROTOCOL</option>
              <option value="st">ST PROTOCOL</option>
              <option value="ews">EWS PROTOCOL</option>
            </select>
            <select name="religion" value={formData.religion} onChange={handleInputChange} className="px-8 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-400 outline-none font-black text-[10px] tracking-widest uppercase cursor-pointer">
              <option value="Hindu">HINDUISM</option>
              <option value="Muslim">ISLAM</option>
              <option value="Sikh">SIKHISM</option>
              <option value="Christian">CHRISTIANITY</option>
              <option value="Other">OTHER BELIEF SYSTEMS</option>
            </select>
            <input type="text" name="bloodGroup" value={formData.bloodGroup} onChange={handleInputChange} placeholder="BLOOD GROUP PROTOCOL (e.g., A+)..." className="px-8 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-400 outline-none font-black text-[10px] tracking-widest uppercase" />
          </div>
        </div>

        {/* Legal & Medical Verification Protocol */}
        <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-500/10 rounded-full blur-[100px] -ml-48 -mb-48" />
          <h3 className="text-xs font-black text-rose-400 mb-10 flex items-center uppercase tracking-[0.4em] relative z-10">
            <FaFingerprint className="mr-3" size={24} />
            Identity & Bio-Validation Portal
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {/* Caste Cert */}
            <div className="relative group/file">
              <input type="file" name="fileCasteCertificate" onChange={handleInputChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
              <div className="px-8 py-10 bg-white/5 border border-white/10 rounded-[2.5rem] group-hover/file:bg-white/10 group-hover/file:border-rose-500 transition-all text-center">
                <FaCertificate size={32} className={`mx-auto mb-4 ${formData.fileCasteCertificate || existingDocs.casteCertificate ? 'text-rose-500' : 'text-slate-500'}`} />
                <p className="text-[10px] font-black uppercase tracking-widest">Caste Protocol</p>
                <p className="text-[8px] text-slate-500 mt-2 truncate">{formData.fileCasteCertificate ? formData.fileCasteCertificate.name : (existingDocs.casteCertificate ? 'PROTOCOL VERIFIED' : 'UPLOAD PDF/JPG')}</p>
              </div>
              {(formData.fileCasteCertificate || existingDocs.casteCertificate) && (
                <div
                  onClick={() => handleFilePreview(formData.fileCasteCertificate || existingDocs.casteCertificate)}
                  className="absolute top-4 right-4 p-2 bg-rose-500 rounded-xl cursor-pointer hover:scale-110 transition-all"
                >
                  <MdVisibility size={14} />
                </div>
              )}
            </div>

            {/* Medical Cert */}
            <div className="relative group/file">
              <input type="file" name="medicalCertificate" onChange={handleInputChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
              <div className="px-8 py-10 bg-white/5 border border-white/10 rounded-[2.5rem] group-hover/file:bg-white/10 group-hover/file:border-blue-500 transition-all text-center">
                <FaFingerprint size={32} className={`mx-auto mb-4 ${formData.medicalCertificate || existingDocs.medicalCertificate ? 'text-blue-500' : 'text-slate-500'}`} />
                <p className="text-[10px] font-black uppercase tracking-widest">Medical Clearance</p>
                <p className="text-[8px] text-slate-500 mt-2 truncate">{formData.medicalCertificate ? formData.medicalCertificate.name : (existingDocs.medicalCertificate ? 'CLEARANCE VERIFIED' : 'UPLOAD PDF/JPG')}</p>
              </div>
              {(formData.medicalCertificate || existingDocs.medicalCertificate) && (
                <div
                  onClick={() => handleFilePreview(formData.medicalCertificate || existingDocs.medicalCertificate)}
                  className="absolute top-4 right-4 p-2 bg-blue-500 rounded-xl cursor-pointer hover:scale-110 transition-all"
                >
                  <MdVisibility size={14} />
                </div>
              )}
            </div>

            {/* Aadhar Card */}
            <div className="relative group/file">
              <input type="file" name="aadharCard" onChange={handleInputChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
              <div className="px-8 py-10 bg-white/5 border border-white/10 rounded-[2.5rem] group-hover/file:bg-white/10 group-hover/file:border-emerald-500 transition-all text-center">
                <MdAssignmentInd size={32} className={`mx-auto mb-4 ${formData.aadharCard || existingDocs.aadharCard ? 'text-emerald-500' : 'text-slate-500'}`} />
                <p className="text-[10px] font-black uppercase tracking-widest">Aadhar Protocol</p>
                <p className="text-[8px] text-slate-500 mt-2 truncate">{formData.aadharCard ? formData.aadharCard.name : (existingDocs.aadharCard ? 'IDENTITY VERIFIED' : 'UPLOAD PDF/JPG')}</p>
              </div>
              {(formData.aadharCard || existingDocs.aadharCard) && (
                <div
                  onClick={() => handleFilePreview(formData.aadharCard || existingDocs.aadharCard)}
                  className="absolute top-4 right-4 p-2 bg-emerald-500 rounded-xl cursor-pointer hover:scale-110 transition-all"
                >
                  <MdVisibility size={14} />
                </div>
              )}
            </div>

            {/* Birth Cert */}
            <div className="relative group/file">
              <input type="file" name="birthCertificate" onChange={handleInputChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
              <div className="px-8 py-10 bg-white/5 border border-white/10 rounded-[2.5rem] group-hover/file:bg-white/10 group-hover/file:border-amber-500 transition-all text-center">
                <MdCalendarToday size={32} className={`mx-auto mb-4 ${formData.birthCertificate || existingDocs.birthCertificate ? 'text-amber-500' : 'text-slate-500'}`} />
                <p className="text-[10px] font-black uppercase tracking-widest">Birth Manifest</p>
                <p className="text-[8px] text-slate-500 mt-2 truncate">{formData.birthCertificate ? formData.birthCertificate.name : (existingDocs.birthCertificate ? 'MANIFEST VERIFIED' : 'UPLOAD PDF/JPG')}</p>
              </div>
              {(formData.birthCertificate || existingDocs.birthCertificate) && (
                <div
                  onClick={() => handleFilePreview(formData.birthCertificate || existingDocs.birthCertificate)}
                  className="absolute top-4 right-4 p-2 bg-amber-500 rounded-xl cursor-pointer hover:scale-110 transition-all"
                >
                  <MdVisibility size={14} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Historical Inception (Previous Education) */}
        <div className="bg-white rounded-[3.5rem] shadow-sm border border-slate-100 p-12 group hover:border-blue-100 transition-all duration-500">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xs font-black text-slate-400 flex items-center uppercase tracking-[0.4em]">
              <MdLanguage className="mr-3 text-blue-500 group-hover:scale-125 transition-transform" size={20} />
              Historical Inception (Previous Education)
            </h3>
            <div className="flex bg-slate-50 p-2 rounded-2xl">
              <button type="button" onClick={() => setFormData({ ...formData, hasPreviousEducation: 'yes' })} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.hasPreviousEducation === 'yes' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400'}`}>Yes</button>
              <button type="button" onClick={() => setFormData({ ...formData, hasPreviousEducation: 'no' })} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.hasPreviousEducation === 'no' ? 'bg-slate-200 text-slate-600' : 'text-slate-400'}`}>No</button>
            </div>
          </div>

          {formData.hasPreviousEducation === 'yes' && (
            <div className="space-y-10 animate-slideDown">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Institute Nomenclature</label>
                  <input type="text" name="prevSchoolName" value={formData.prevSchoolName} onChange={handleInputChange} className="w-full px-8 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 outline-none font-black text-[10px] tracking-widest uppercase" placeholder="ENTER SCHOOL/COLLEGE NAME..." required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Institutional Spatial Residue (Address)</label>
                  <input type="text" name="prevSchoolAddress" value={formData.prevSchoolAddress} onChange={handleInputChange} className="w-full px-8 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-600 outline-none font-black text-[10px] tracking-widest uppercase" placeholder="CITY, STATE, DISTRICT..." required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Metric Protocol</label>
                  <select name="prevMarksType" value={formData.prevMarksType} onChange={handleInputChange} className="w-full px-8 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-600 outline-none font-black text-[10px] tracking-widest uppercase cursor-pointer" required>
                    <option value="percentage">PERCENTAGE (%)</option>
                    <option value="cgpa">CGPA (SCALE 1-10)</option>
                  </select>
                </div>
              </div>

              {/* Document Verification Portal */}
              <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
                <h3 className="text-xs font-black text-emerald-400 mb-10 flex items-center uppercase tracking-[0.4em]">
                  <MdUpload className="mr-3" size={24} />
                  Document Verification Hub
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="relative group">
                    <input type="file" name="fileMarksheet" onChange={handleInputChange} accept=".pdf,.jpg,.jpeg,.png" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                    <div
                      onClick={() => {
                        if (formData.fileMarksheet) handleFilePreview(formData.fileMarksheet);
                        else if (existingDocs.marksheet) window.open(existingDocs.marksheet, '_blank');
                      }}
                      className="p-6 bg-white/5 border border-white/10 rounded-3xl group-hover:bg-white/10 group-hover:border-emerald-500/50 transition-all text-center cursor-pointer"
                    >
                      <FaFileAlt size={30} className={`mx-auto mb-4 ${formData.fileMarksheet || existingDocs.marksheet ? 'text-emerald-500' : 'text-slate-500'}`} />
                      <p className="text-[9px] font-black uppercase tracking-widest mb-1">Marksheet/Result (PDF)</p>
                      <p className="text-[8px] text-slate-500 truncate">{formData.fileMarksheet ? formData.fileMarksheet.name : (existingDocs.marksheet ? 'VIEW EXISTING DOCUMENT' : 'UPLOAD DOCUMENT')}</p>
                      {(formData.fileMarksheet || existingDocs.marksheet) && <MdVisibility className="absolute top-4 right-4 text-emerald-500" size={18} />}
                    </div>
                  </div>
                  <div className="relative group">
                    <input type="file" name="fileTC" onChange={handleInputChange} accept=".pdf,.jpg,.jpeg,.png" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                    <div
                      onClick={() => {
                        if (formData.fileTC) handleFilePreview(formData.fileTC);
                        else if (existingDocs.transferCertificate) window.open(existingDocs.transferCertificate, '_blank');
                      }}
                      className="p-6 bg-white/5 border border-white/10 rounded-3xl group-hover:bg-white/10 group-hover:border-emerald-500/50 transition-all text-center cursor-pointer"
                    >
                      <FaGlobe size={30} className={`mx-auto mb-4 ${formData.fileTC || existingDocs.transferCertificate ? 'text-emerald-500' : 'text-slate-500'}`} />
                      <p className="text-[9px] font-black uppercase tracking-widest mb-1">Transfer Certificate (PDF)</p>
                      <p className="text-[8px] text-slate-500 truncate">{formData.fileTC ? formData.fileTC.name : (existingDocs.transferCertificate ? 'VIEW EXISTING DOCUMENT' : 'PDF REQUIRED')}</p>
                      {(formData.fileTC || existingDocs.transferCertificate) && <MdVisibility className="absolute top-4 right-4 text-emerald-500" size={18} />}
                    </div>
                  </div>
                  <div className="relative group">
                    <input type="file" name="fileCharacterCert" onChange={handleInputChange} accept=".pdf,.jpg,.jpeg,.png" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                    <div
                      onClick={() => {
                        if (formData.fileCharacterCert) handleFilePreview(formData.fileCharacterCert);
                        else if (existingDocs.characterCertificate) window.open(existingDocs.characterCertificate, '_blank');
                      }}
                      className="p-6 bg-white/5 border border-white/10 rounded-3xl group-hover:bg-white/10 group-hover:border-emerald-500/50 transition-all text-center cursor-pointer"
                    >
                      <MdPerson size={30} className={`mx-auto mb-4 ${formData.fileCharacterCert || existingDocs.characterCertificate ? 'text-emerald-500' : 'text-slate-500'}`} />
                      <p className="text-[9px] font-black uppercase tracking-widest mb-1">Character Cert. (PDF)</p>
                      <p className="text-[8px] text-slate-500 truncate">{formData.fileCharacterCert ? formData.fileCharacterCert.name : (existingDocs.characterCertificate ? 'VIEW EXISTING DOCUMENT' : 'PDF REQUIRED')}</p>
                      {(formData.fileCharacterCert || existingDocs.characterCertificate) && <MdVisibility className="absolute top-4 right-4 text-emerald-500" size={18} />}
                    </div>
                  </div>
                  <div className="relative group">
                    <input type="file" name="fileMigrationCert" onChange={handleInputChange} accept=".pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                    <div
                      onClick={() => {
                        if (formData.fileMigrationCert) handleFilePreview(formData.fileMigrationCert);
                        else if (existingDocs.migrationCertificate) window.open(existingDocs.migrationCertificate, '_blank');
                      }}
                      className="p-6 bg-white/5 border border-white/10 rounded-3xl group-hover:bg-white/10 group-hover:border-emerald-500/50 transition-all text-center cursor-pointer"
                    >
                      <FaFileAlt size={30} className={`mx-auto mb-4 ${formData.fileMigrationCert || existingDocs.migrationCertificate ? 'text-emerald-500' : 'text-slate-500'}`} />
                      <p className="text-[9px] font-black uppercase tracking-widest mb-1 font-bold">Migration Cert. (PDF)</p>
                      <p className="text-[8px] text-slate-400 italic mb-1 uppercase tracking-tighter">(OPTIONAL)</p>
                      <p className="text-[8px] text-slate-500 truncate">{formData.fileMigrationCert ? formData.fileMigrationCert.name : (existingDocs.migrationCertificate ? 'VIEW EXISTING DOCUMENT' : 'PDF OPTIONAL')}</p>
                      {(formData.fileMigrationCert || existingDocs.migrationCertificate) && <MdVisibility className="absolute top-4 right-4 text-emerald-500" size={18} />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Spatial Residue (Address Hub) */}
        <div className="space-y-8">
          <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 p-10 group hover:border-rose-100 transition-all duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <h3 className="text-xs font-black text-slate-400 flex items-center uppercase tracking-[0.4em]">
                <MdLocationOn className="mr-3 text-rose-500 group-hover:scale-125 transition-transform" size={20} />
                Spatial Residue (Address Hub)
              </h3>
              <label className="flex items-center space-x-3 cursor-pointer group/sync">
                <input type="checkbox" name="sameAsPermament" checked={formData.sameAsPermament} onChange={handleInputChange} className="w-5 h-5 rounded-lg border-2 border-slate-200 text-rose-500 focus:ring-rose-500 transition-all cursor-pointer" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover/sync:text-rose-500 transition-colors">Same as Permanent Address</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Permanent Address */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2 text-rose-600 mb-2">
                  <MdMap size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Permanent Station</span>
                </div>
                <div className="space-y-4">
                  <textarea name="permanentAddress" value={formData.permanentAddress} onChange={handleInputChange} rows="3" className="w-full px-8 py-6 bg-slate-50 border-2 border-transparent rounded-3xl focus:bg-white focus:border-rose-400 outline-none font-bold text-slate-600 text-sm" placeholder="FULL RESIDENTIAL ADDRESS..." required />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" name="permanentCity" value={formData.permanentCity} onChange={handleInputChange} placeholder="CITY..." className="px-6 py-4 bg-slate-50 rounded-2xl outline-none font-black text-[10px] tracking-widest focus:bg-white focus:ring-2 focus:ring-rose-100 transition-all font-mono" required />
                    <input type="text" name="permanentState" value={formData.permanentState} onChange={handleInputChange} placeholder="STATE..." className="px-6 py-4 bg-slate-50 rounded-2xl outline-none font-black text-[10px] tracking-widest focus:bg-white focus:ring-2 focus:ring-rose-100 transition-all font-mono" required />
                  </div>
                  <div className="space-y-1">
                    <input
                      type="text"
                      name="permanentPincode"
                      value={formData.permanentPincode}
                      onChange={handleInputChange}
                      placeholder="PINCODE / ZIP..."
                      className={`w-full px-8 py-4 bg-slate-50 rounded-2xl outline-none font-black text-[10px] tracking-widest transition-all ${errors.permanentPincode ? 'border-2 border-rose-500' : 'focus:bg-white focus:ring-2 focus:ring-rose-100'}`}
                      required
                    />
                    {errors.permanentPincode && <p className="text-[8px] font-black text-rose-500 ml-4 uppercase">{errors.permanentPincode}</p>}
                  </div>
                </div>
              </div>

              {/* Current Address */}
              <div className={`space-y-6 transition-all duration-500 ${formData.sameAsPermament ? 'opacity-50 pointer-events-none grayscale-[0.5]' : ''}`}>
                <div className="flex items-center space-x-2 text-rose-600 mb-2">
                  <FaMapMarkerAlt size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Current Deployment</span>
                </div>
                <div className="space-y-4">
                  <textarea name="currentAddress" value={formData.currentAddress} onChange={handleInputChange} rows="3" className="w-full px-8 py-6 bg-slate-50 border-2 border-transparent rounded-3xl focus:bg-white focus:border-rose-400 outline-none font-bold text-slate-600 text-sm" placeholder="FULL CURRENT ADDRESS..." required={!formData.sameAsPermament} />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" name="currentCity" value={formData.currentCity} onChange={handleInputChange} placeholder="CITY..." className="px-6 py-4 bg-slate-50 rounded-2xl outline-none font-black text-[10px] tracking-widest focus:bg-white focus:ring-2 focus:ring-rose-100 transition-all" required={!formData.sameAsPermament} />
                    <input type="text" name="currentState" value={formData.currentState} onChange={handleInputChange} placeholder="STATE..." className="px-6 py-4 bg-slate-50 rounded-2xl outline-none font-black text-[10px] tracking-widest focus:bg-white focus:ring-2 focus:ring-rose-100 transition-all" required={!formData.sameAsPermament} />
                  </div>
                  <input type="text" name="currentPincode" value={formData.currentPincode} onChange={handleInputChange} placeholder="PINCODE / ZIP..." className="w-full px-8 py-4 bg-slate-50 rounded-2xl outline-none font-black text-[10px] tracking-widest focus:bg-white focus:ring-2 focus:ring-rose-100 transition-all" required={!formData.sameAsPermament} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Guardian Protocol */}
        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 p-10 group hover:border-amber-100 transition-all duration-500">
          <h3 className="text-xs font-black text-slate-400 mb-8 flex items-center uppercase tracking-[0.4em]">
            <MdPerson className="mr-3 text-amber-500 group-hover:scale-125 transition-transform" size={20} />
            Guardian Manifest
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-1">
              <input type="text" name="fatherName" value={formData.fatherName} onChange={handleInputChange} placeholder="FATHER'S NOMENCLATURE..." className={`w-full px-8 py-4 bg-slate-50 border-2 rounded-2xl focus:bg-white outline-none font-black text-[10px] tracking-widest transition-all ${errors.fatherName ? 'border-rose-500' : 'border-transparent focus:border-amber-400'}`} required />
              {errors.fatherName && <p className="text-[8px] font-black text-rose-500 ml-4 uppercase">{errors.fatherName}</p>}
            </div>
            <div className="space-y-1">
              <input type="text" name="motherName" value={formData.motherName} onChange={handleInputChange} placeholder="MOTHER'S NOMENCLATURE..." className={`w-full px-8 py-4 bg-slate-50 border-2 rounded-2xl focus:bg-white outline-none font-black text-[10px] tracking-widest transition-all ${errors.motherName ? 'border-rose-500' : 'border-transparent focus:border-amber-400'}`} required />
              {errors.motherName && <p className="text-[8px] font-black text-rose-500 ml-4 uppercase">{errors.motherName}</p>}
            </div>
            <div className="space-y-1">
              <input type="tel" name="guardianPhone" value={formData.guardianPhone} onChange={handleInputChange} placeholder="GUARDIAN PRIMARY HOTLINE..." className={`w-full px-8 py-4 bg-slate-50 border-2 rounded-2xl focus:bg-white outline-none font-black text-[10px] tracking-widest transition-all ${errors.guardianPhone ? 'border-rose-500' : 'border-transparent focus:border-amber-400'}`} required />
              {errors.guardianPhone && <p className="text-[8px] font-black text-rose-500 ml-4 uppercase">{errors.guardianPhone}</p>}
            </div>
            <div className="space-y-1">
              <input type="tel" name="emergencyContact" value={formData.emergencyContact} onChange={handleInputChange} placeholder="EMERGENCY BACKUP CONTACT..." className={`w-full px-8 py-4 bg-slate-50 border-2 rounded-2xl focus:bg-white outline-none font-black text-[10px] tracking-widest transition-all ${errors.emergencyContact ? 'border-rose-500' : 'border-transparent focus:border-amber-400'}`} required />
              {errors.emergencyContact && <p className="text-[8px] font-black text-rose-500 ml-4 uppercase">{errors.emergencyContact}</p>}
            </div>
          </div>
        </div>

        {/* Submission Authority */}
        <div className="flex justify-center pt-10">
          <button type="submit" className="group relative bg-black text-white px-20 py-8 rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.4em] hover:bg-blue-600 transition-all duration-500 shadow-2xl shadow-slate-200 overflow-hidden">
            <span className="relative z-10">Authorize Institutional Admission</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Registration;
