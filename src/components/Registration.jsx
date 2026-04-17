import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // High-fidelity modal protocol
import { MdPerson, MdEmail, MdPhone, MdLocationOn, MdSchool, MdCalendarToday, MdUpload, MdAttachFile, MdCheckCircle, MdMap, MdVisibility } from 'react-icons/md';
import { toast } from 'react-toastify';
import { classAPI, admissionAPI } from '../utils/apiService';
import { FaSpinner, FaHistory, FaFileAlt, FaGlobe, FaCertificate, FaMapMarkerAlt } from 'react-icons/fa';

const Registration = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [currentStreams, setCurrentStreams] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [existingDocs, setExistingDocs] = useState({});

  // Helper to preview uploaded files in a new tab
  const handleFilePreview = (file) => {
    if (!file) return;
    const fileUrl = URL.createObjectURL(file);
    window.open(fileUrl, '_blank');
  };
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    category: '',
    permanentAddress: '',
    permanentCity: '',
    permanentState: '',
    permanentPincode: '',
    sameAsPermament: false,
    currentAddress: '',
    currentCity: '',
    currentState: '',
    currentPincode: '',
    course: '', // Store Class Name here initially for UI
    actualClassId: '', // Store true Class ID here
    stream: '', 
    section: '',
    hasPreviousEducation: '',
    // Detailed Previous Academic Fields
    prevCourseName: '',
    prevSchoolName: '',
    prevSchoolAddress: '',
    prevMarksType: 'percentage', // percentage or cgpa
    prevMarksValue: '',
    fileMarksheet: null,
    fileTC: null,
    fileCharacterCert: null,
    fileMigrationCert: null,
    
    fatherName: '',
    motherName: '',
    guardianPhone: '',
    emergencyContact: '',
    medicalCertificate: null,
    fileCasteCertificate: null,
    studentPhoto: null,
    aadharCard: null,
    birthCertificate: null
  });

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const pinRegex = /^\d{6}$/;

    switch (name) {
      case 'firstName':
      case 'lastName':
      case 'fatherName':
      case 'motherName':
        if (!value || value.trim().length < 2) error = 'Minimum 2 characters required';
        break;
      case 'email':
        if (!value) error = 'Email is required';
        else if (!emailRegex.test(value)) error = 'Invalid email format';
        break;
      case 'phone':
      case 'guardianPhone':
      case 'emergencyContact':
        if (!value) error = 'Phone is required';
        else if (!phoneRegex.test(value.replace(/\D/g, ''))) error = 'Exactly 10 digits required';
        break;
      case 'permanentPincode':
      case 'currentPincode':
        if (!value) error = 'Pincode is required';
        else if (!pinRegex.test(value)) error = 'Exactly 6 digits required';
        break;
      case 'dob':
        if (!value) error = 'DOB is required';
        else {
          const selectedDate = new Date(value);
          if (selectedDate > new Date()) error = 'Date cannot be in the future';
        }
        break;
      case 'course':
      case 'section':
      case 'gender':
      case 'category':
      case 'hasPreviousEducation':
        if (!value) error = 'Selection required';
        break;
      case 'studentPhoto':
      case 'aadharCard':
      case 'birthCertificate':
        if (!value) error = 'File upload required';
        break;
      default:
        break;
    }

    setErrors(prev => ({ ...prev, [name]: error }));
    return error;
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      fetchStudentData(id);
    }
  }, [id]);

  const fetchStudentData = async (studentId) => {
    try {
      setLoading(true);
      const res = await admissionAPI.getById(studentId);
      const student = res.data.student || res.data;
      
      if (student) {
        // Find existing class name from ID
        const className = student.class?.className || student.class || '';
        
        setFormData({
          firstName: student.firstName || '',
          lastName: student.lastName || '',
          email: student.email || '',
          phone: student.phone || '',
          dob: student.dob ? new Date(student.dob).toISOString().split('T')[0] : '',
          gender: student.gender || '',
          category: student.category || '',
          permanentAddress: student.permanentAddress?.address || '',
          permanentCity: student.permanentAddress?.city || '',
          permanentState: student.permanentAddress?.state || '',
          permanentPincode: student.permanentAddress?.pincode || '',
          sameAsPermament: false,
          currentAddress: student.currentAddress?.address || '',
          currentCity: student.currentAddress?.city || '',
          currentState: student.currentAddress?.state || '',
          currentPincode: student.currentAddress?.pincode || '',
          course: className,
          actualClassId: student.class?._id || student.class || '',
          stream: student.stream || '',
          section: student.section?._id || student.section || '',
          hasPreviousEducation: student.hasPreviousEducation || 'no',
          prevCourseName: student.previousEducation?.previousCourseName || '',
          prevSchoolName: student.previousEducation?.previousSchoolName || '',
          prevSchoolAddress: student.previousEducation?.previousSchoolAddress || '',
          prevMarksType: student.previousEducation?.previousMarksType || 'percentage',
          prevMarksValue: student.previousEducation?.previousPercentage || '',
          fileMarksheet: null,
          fileTC: null,
          fileCharacterCert: null,
          fileMigrationCert: null,
          fatherName: student.fatherName || student.guardianInfo?.fatherName || '',
          motherName: student.motherName || student.guardianInfo?.motherName || '',
          guardianPhone: student.guardianInfo?.guardianPhone || '',
          emergencyContact: student.guardianInfo?.emergencyPhone || '',
          medicalCertificate: null,
          fileCasteCertificate: null,
          studentPhoto: null,
          aadharCard: null,
          birthCertificate: null
        });
        
        setExistingDocs({
          studentPhoto: student.profileImage,
          medicalCertificate: student.medicalCertificate,
          casteCertificate: student.casteCertificate,
          marksheet: student.documents?.marksheet || student.previousEducation?.marksheet,
          characterCertificate: student.documents?.characterCertificate || student.previousEducation?.characterCertificate,
          transferCertificate: student.documents?.transferCertificate || student.previousEducation?.transferCertificate,
          aadharCard: student.documents?.aadharCard,
          birthCertificate: student.documents?.birthCertificate
        });
      }
    } catch (err) {
      console.error('Failed to fetch student data:', err);
      toast.error('Identity Manifest Retrieval Failure');
    } finally {
      setLoading(false);
    }
  };

  // Sync Logic: Fetch details when course (Class Name) is selected
  useEffect(() => {
    if (formData.hasPreviousEducation && formData.course) {
      // Find all Class IDs matching this name
      const matchingClasses = classes.filter(cls => cls.className === formData.course);
      if (matchingClasses.length > 0) {
        fetchClassDetails(matchingClasses);
      }
    } else {
      setSections([]);
      setCurrentStreams([]);
    }
  }, [formData.course, formData.hasPreviousEducation, classes]);

  const fetchClassDetails = async (matchingClasses) => {
    try {
      setLoading(true);
      
      // Aggregate data from all matching classes
      let allSections = [];
      let allStreams = new Set();

      for (const cls of matchingClasses) {
        const res = await classAPI.getById(cls._id);
        if (res.data.sections) {
          // Store actual class ID with section for mapping back later
          const sectionsWithClass = res.data.sections.map(s => ({ ...s, parentClassId: cls._id }));
          allSections = [...allSections, ...sectionsWithClass];
        }
        if (res.data.class && res.data.class.stream) {
          res.data.class.stream.forEach(s => allStreams.add(s));
        }
      }

      setSections(allSections);
      setCurrentStreams(Array.from(allStreams));
      
    } catch (err) {
      console.error('Failed to aggregate class details:', err);
      toast.error('Registry sync failure for selected matrix');
      setSections([]);
      setCurrentStreams([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const res = await classAPI.getAll();
      const data = res.data.classes || res.data.data?.classes || (Array.isArray(res.data) ? res.data : []);
      setClasses(data);
    } catch (err) {
      console.error('Failed to fetch classes:', err);
      toast.error('Could not sync institutional registry');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (name === 'sameAsPermament') {
      if (checked) {
        setFormData({
          ...formData,
          [name]: checked,
          currentAddress: formData.permanentAddress,
          currentCity: formData.permanentCity,
          currentState: formData.permanentState,
          currentPincode: formData.permanentPincode
        });
      } else {
        setFormData({
          ...formData,
          [name]: checked,
          currentAddress: '',
          currentCity: '',
          currentState: '',
          currentPincode: ''
        });
      }
    } else if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files[0]
      });
    } else {
      if (name === 'hasPreviousEducation') {
        setFormData({
          ...formData,
          [name]: value,
          course: '',
          stream: '',
          section: ''
        });
      } else if (name === 'course') {
        setFormData({
          ...formData,
          [name]: value,
          stream: '',
          section: ''
        });
      } else if (name === 'section') {
         // CRITICAL: When section is selected, find its true Class ID
         const selectedSection = sections.find(s => s._id === value);
         setFormData({
           ...formData,
           section: value,
           // Temporarily storing class name in course, but we will replace with ID on submit 
           // OR we can keep it as is if selection carries parentClassId
           actualClassId: selectedSection ? selectedSection.parentClassId : ''
         });
      } else {
        const newData = { ...formData, [name]: type === 'checkbox' ? checked : value };
        
        // If "Same as Permanent" is ON and we're editing a Permanent field, sync to Current
        if (formData.sameAsPermament) {
          if (name === 'permanentAddress') newData.currentAddress = value;
          if (name === 'permanentCity') newData.currentCity = value;
          if (name === 'permanentState') newData.currentState = value;
          if (name === 'permanentPincode') newData.currentPincode = value;
        }
        
        setFormData(newData);
        validateField(name, type === 'checkbox' ? (checked ? 'true' : 'false') : value);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Institutional Validation Protocol
      const requiredFields = {
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email Address',
        phone: 'Phone Number',
        gender: 'Gender',
        dob: 'Date of Birth',
        studentPhoto: 'Student Portrait',
        aadharCard: 'Aadhar Card',
        birthCertificate: 'Birth Certificate'
      };

      if (formData.hasPreviousEducation === 'no') {
        requiredFields.course = 'Institutional Class';
        requiredFields.section = 'Academic Section';
        
        // Mandate Stream if current class has streams defined
        if (currentStreams.length > 0) {
            requiredFields.stream = 'Academic Stream';
        }
      }

      // In Edit Mode, if documents already exist, they are not mandatory to upload again
      if (isEditMode) {
        if (existingDocs.studentPhoto) delete requiredFields.studentPhoto;
        if (existingDocs.aadharCard) delete requiredFields.aadharCard;
        if (existingDocs.birthCertificate) delete requiredFields.birthCertificate;
      }

      const missingEntry = Object.entries(requiredFields).find(([key, label]) => !formData[key]);
      
      // Perform comprehensive validation run
      const newErrors = {};
      let hasErrors = false;
      
      Object.keys(requiredFields).forEach(key => {
        const error = validateField(key, formData[key]);
        if (error) {
          newErrors[key] = error;
          hasErrors = true;
        }
      });

      if (hasErrors || missingEntry) {
        setErrors(newErrors);
        toast.error(`MANIFEST ERROR: Please correct ${missingEntry ? missingEntry[1] : 'validation errors'}! 🚧`);
        setLoading(false);
        return;
      }
      
      const data = new FormData();
      
      // Append all text fields and basic state
      Object.keys(formData).forEach(key => {
        // Robust File Appending Manifest
        const fileFields = ['medicalCertificate', 'studentPhoto', 'aadharCard', 'birthCertificate'];
        
        // Exclude internal helper fields from direct appending
        if (key === 'actualClassId' || key === 'sameAsPermament') return;

        if (key.startsWith('file') || fileFields.includes(key)) {
           if (formData[key]) data.append(key, formData[key]);
        } else if (typeof formData[key] === 'boolean') {
           data.append(key, formData[key] ? 'true' : 'false');
        } else if (key === 'course') {
           // USE THE ACTUAL CLASS ID RESOLVED FROM SECTION
           // Fallback to empty string if not resolved to avoid "undefined" strings
           data.append(key, formData.actualClassId || '');
        } else {
           data.append(key, formData[key]);
        }
      });

      const response = isEditMode 
        ? await admissionAPI.update(id, data)
        : await admissionAPI.create(data);
      
      if (response.status === 201 || response.status === 200 || response.data.success) {
        const student = response.data.student || (isEditMode ? { admissionNumber: formData.admissionNumber } : {});
        const studentId = student.admissionNumber || id || 'ASSIGNED';
        
        Swal.fire({
          title: isEditMode ? 'Manifest Updated!' : 'Admission Protocol Complete!',
          html: isEditMode 
            ? `Student Identity record has been synchronized with latest data.<br/><b>Institutional ID: <span style="color: #10b981">${studentId}</span></b>`
            : `Student Identity Manifest Synchronized.<br/><b>Institutional ID: <span style="color: #10b981">${studentId}</span></b>`,
          icon: 'success',
          confirmButtonColor: '#0ea5e9',
          confirmButtonText: 'Acknowledged'
        });

        toast.success(isEditMode ? `MANIFEST UPDATED: ${studentId}` : `MANIFEST SYNCED: ${studentId}`);
        // Reset form or redirect
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (isEditMode) {
            setTimeout(() => navigate('/admissions'), 2000);
        } else {
            setTimeout(() => window.location.reload(), 2000); // Reload to see new ID in list
        }
      }
    } catch (err) {
      console.error('Admission deployment failure:', err);
      const errorMsg = err.response?.data?.message || 'CRITICAL: Registry Sync Interrupted';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {loading && (
        <div className="fixed inset-0 bg-slate-900/10 backdrop-blur-[2px] flex items-center justify-center z-[100]">
           <FaSpinner className="animate-spin text-blue-600 text-5xl" />
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black mb-3 tracking-tighter uppercase italic">Institutional Enrollment</h2>
            <p className="text-blue-200 text-sm font-black uppercase tracking-[0.2em]">Deployment Phase: Advanced Registration Protocol</p>
          </div>
          <MdSchool size={80} className="text-white/10 hidden md:block" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10 pb-20">
        {/* Personal Manifest */}
        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 p-10 group hover:border-blue-100 transition-all duration-500">
          <h3 className="text-xs font-black text-slate-400 mb-8 flex items-center uppercase tracking-[0.4em]">
            <MdPerson className="mr-3 text-blue-600 group-hover:scale-125 transition-transform" size={20} />
            Identity Manifest
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-2">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Primary Nomenclature <span className="text-rose-500">*</span></label>
              <input 
                type="text" 
                name="firstName" 
                value={formData.firstName} 
                onChange={handleInputChange} 
                className={`w-full px-8 py-4 bg-slate-50 border-2 rounded-2xl focus:bg-white outline-none font-black text-[10px] tracking-widest transition-all ${errors.firstName ? 'border-rose-500 bg-rose-50/10' : 'border-transparent focus:border-blue-600'}`} 
                placeholder="ENTER FIRST NAME..." 
              />
              {errors.firstName && <p className="text-[8px] font-black text-rose-500 ml-4 uppercase">{errors.firstName}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Secondary Nomenclature <span className="text-rose-500">*</span></label>
              <input 
                type="text" 
                name="lastName" 
                value={formData.lastName} 
                onChange={handleInputChange} 
                className={`w-full px-8 py-4 bg-slate-50 border-2 rounded-2xl focus:bg-white outline-none font-black text-[10px] tracking-widest transition-all ${errors.lastName ? 'border-rose-500 bg-rose-50/10' : 'border-transparent focus:border-blue-600'}`} 
                placeholder="ENTER LAST NAME..." 
              />
              {errors.lastName && <p className="text-[8px] font-black text-rose-500 ml-4 uppercase">{errors.lastName}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Email Address <span className="text-rose-500">*</span></label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleInputChange} 
                className={`w-full px-8 py-4 bg-slate-50 border-2 rounded-2xl focus:bg-white outline-none font-black text-[10px] tracking-widest transition-all ${errors.email ? 'border-rose-500 bg-rose-50/10' : 'border-transparent focus:border-blue-600'}`} 
                placeholder="EMAIL@DOMAIN.COM" 
              />
              {errors.email && <p className="text-[8px] font-black text-rose-500 ml-4 uppercase">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Mobile Hotlink <span className="text-rose-500">*</span></label>
              <input 
                type="tel" 
                name="phone" 
                value={formData.phone} 
                onChange={handleInputChange} 
                className={`w-full px-8 py-4 bg-slate-50 border-2 rounded-2xl focus:bg-white outline-none font-black text-[10px] tracking-widest transition-all font-mono ${errors.phone ? 'border-rose-500 bg-rose-50/10' : 'border-transparent focus:border-blue-600'}`} 
                placeholder="+91 XXXXX XXXXX" 
              />
              {errors.phone && <p className="text-[8px] font-black text-rose-500 ml-4 uppercase">{errors.phone}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Chronological Origin (DOB) <span className="text-rose-500">*</span></label>
              <input 
                type="date" 
                name="dob" 
                value={formData.dob} 
                onChange={handleInputChange} 
                className={`w-full px-8 py-4 bg-slate-50 border-2 rounded-2xl focus:bg-white outline-none font-black text-[10px] tracking-widest transition-all ${errors.dob ? 'border-rose-500 bg-rose-50/10' : 'border-transparent focus:border-blue-600'}`} 
              />
              {errors.dob && <p className="text-[8px] font-black text-rose-500 ml-4 uppercase">{errors.dob}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Biological Classification</label>
              <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full px-8 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 outline-none font-black text-[10px] tracking-widest transition-all cursor-pointer">
                <option value="">SELECT GENDER</option>
                <option value="male">MALE</option>
                <option value="female">FEMALE</option>
                <option value="other">OTHER</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Social Category <span className="text-rose-500">*</span></label>
              <select 
                name="category" 
                value={formData.category} 
                onChange={handleInputChange} 
                className={`w-full px-8 py-4 bg-slate-50 border-2 rounded-2xl focus:bg-white outline-none font-black text-[10px] tracking-widest transition-all cursor-pointer ${errors.category ? 'border-rose-500 bg-rose-50/10' : 'border-transparent focus:border-blue-600'}`}
              >
                <option value="">SELECT CATEGORY</option>
                <option value="general">GENERAL</option>
                <option value="obc">OBC</option>
                <option value="sc">SC</option>
                <option value="st">ST</option>
                <option value="ews">EWS</option>
              </select>
              {errors.category && <p className="text-[8px] font-black text-rose-500 ml-4 uppercase">{errors.category}</p>}
            </div>
            {formData.category && formData.category !== 'general' && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300 md:col-span-2">
                <label className="text-[10px] font-black text-rose-500 uppercase tracking-widest ml-4">Authorized Caste Certificate (PDF)</label>
                <div className="relative group/file">
                  <input
                    type="file"
                    name="fileCasteCertificate"
                    onChange={handleInputChange}
                    accept=".pdf"
                    className="w-full px-8 py-4 bg-rose-50/30 border-2 border-dashed border-rose-200 rounded-3xl focus:bg-white focus:border-rose-600 outline-none font-black text-[10px] tracking-widest text-slate-400 file:hidden cursor-pointer hover:border-rose-400 transition-all"
                    required
                  />
                  <div 
                    onClick={() => {
                      if (formData.fileCasteCertificate) handleFilePreview(formData.fileCasteCertificate);
                      else if (existingDocs.casteCertificate) window.open(existingDocs.casteCertificate, '_blank');
                    }}
                    className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-auto flex items-center space-x-3 cursor-pointer group/preview"
                  >
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter truncate max-w-[150px] group-hover/preview:text-rose-600 transition-colors">
                      {formData.fileCasteCertificate ? formData.fileCasteCertificate.name : (existingDocs.casteCertificate ? 'VIEW EXISTING CERTIFICATE' : 'UPLOAD CASTE CERTIFICATE...')}
                    </span>
                    {(formData.fileCasteCertificate || existingDocs.casteCertificate) ? <MdVisibility className="text-emerald-500" size={24} /> : <FaCertificate className="text-rose-400" size={20} />}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mandatory Vital Documentation (Universal Manifest) */}
        <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
            <h3 className="text-xs font-black text-blue-400 mb-10 flex items-center uppercase tracking-[0.4em]">
                <MdAttachFile className="mr-3 group-hover:rotate-45 transition-transform" size={24} />
                Institutional Identity & Vital Manifest
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Student Portrait */}
                <div className="lg:col-span-1">
                    <div 
                      onClick={() => handleFilePreview(formData.studentPhoto)}
                      className="relative group/photo aspect-square bg-white/5 border-2 border-dashed border-white/20 rounded-[2.5rem] flex flex-col items-center justify-center p-8 hover:border-blue-500 hover:bg-white/10 transition-all cursor-pointer overflow-hidden isolate"
                    >
                        <input type="file" name="studentPhoto" onChange={handleInputChange} accept="image/png, image/jpeg, image/jpg" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30" required />
                        {formData.studentPhoto ? (
                             <img src={URL.createObjectURL(formData.studentPhoto)} className="absolute inset-0 w-full h-full object-cover opacity-60 scale-110 group-hover/photo:scale-100 transition-transform duration-700" alt="Preview" />
                        ) : existingDocs.studentPhoto ? (
                             <img src={existingDocs.studentPhoto} className="absolute inset-0 w-full h-full object-cover opacity-60 scale-110 group-hover/photo:scale-100 transition-transform duration-700" alt="Existing" />
                        ) : (
                             <MdPerson size={64} className={`text-white/20 transition-colors mb-4 ${errors.studentPhoto ? 'text-rose-500' : 'group-hover/photo:text-blue-500'}`} />
                        )}
                        <div className="relative z-10 text-center">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-1">Student Portrait <span className="text-rose-500">*</span></p>
                            <p className={`text-[8px] font-bold uppercase tracking-widest ${errors.studentPhoto ? 'text-rose-500' : 'text-slate-400'}`}>
                              {errors.studentPhoto || (formData.studentPhoto || existingDocs.studentPhoto ? 'IMAGE READY (CLICK TO VIEW)' : 'CLICK TO CAPTURE')}
                            </p>
                        </div>
                        {(formData.studentPhoto || existingDocs.studentPhoto) && <MdVisibility className="absolute top-6 right-6 text-emerald-500 z-40" size={24} />}
                    </div>
                </div>

                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Birth Certificate */}
                    <div className="relative group/birth">
                        <input type="file" name="birthCertificate" onChange={handleInputChange} accept=".pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" required />
                        <div 
                          onClick={() => {
                            if (formData.birthCertificate) handleFilePreview(formData.birthCertificate);
                            else if (existingDocs.birthCertificate) window.open(existingDocs.birthCertificate, '_blank');
                          }}
                          className={`h-full p-8 bg-white/5 border rounded-[2rem] transition-all flex flex-col items-center justify-center text-center space-y-3 cursor-pointer ${errors.birthCertificate ? 'border-rose-500 bg-rose-500/5' : 'border-white/10 group-hover/birth:bg-white/10 group-hover/birth:border-blue-500'}`}
                        >
                            <FaCertificate size={32} className={`transition-colors ${errors.birthCertificate ? 'text-rose-500' : 'text-white/20 group-hover/birth:text-blue-500'}`} />
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest leading-tight">Birth Certificate (PDF) <span className="text-rose-500">*</span></p>
                                <p className={`text-[7px] font-bold uppercase mt-1 italic tracking-widest truncate max-w-[150px] mx-auto ${errors.birthCertificate ? 'text-rose-400' : 'text-slate-400'}`}>
                                    {errors.birthCertificate || (formData.birthCertificate ? formData.birthCertificate.name : (existingDocs.birthCertificate ? 'VIEW EXISTING DOCUMENT' : 'PDF MANDATORY'))}
                                </p>
                            </div>
                            {(formData.birthCertificate || existingDocs.birthCertificate) && <MdVisibility className="absolute top-4 right-4 text-emerald-500" size={18} />}
                        </div>
                    </div>

                    {/* Aadhar Card */}
                    <div className="relative group/aadhar">
                        <input type="file" name="aadharCard" onChange={handleInputChange} accept=".pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" required />
                        <div 
                          onClick={() => {
                            if (formData.aadharCard) handleFilePreview(formData.aadharCard);
                            else if (existingDocs.aadharCard) window.open(existingDocs.aadharCard, '_blank');
                          }}
                          className={`h-full p-8 bg-white/5 border rounded-[2rem] transition-all flex flex-col items-center justify-center text-center space-y-3 cursor-pointer ${errors.aadharCard ? 'border-rose-500 bg-rose-500/5' : 'border-white/10 group-hover/aadhar:bg-white/10 group-hover/aadhar:border-blue-500'}`}
                        >
                            <FaFileAlt size={32} className={`transition-colors ${errors.aadharCard ? 'text-rose-500' : 'text-white/20 group-hover/aadhar:text-blue-500'}`} />
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest leading-tight">Aadhar Card (PDF ONLY) <span className="text-rose-500">*</span></p>
                                <p className={`text-[7px] font-bold uppercase mt-1 italic tracking-widest truncate max-w-[150px] mx-auto ${errors.aadharCard ? 'text-rose-400' : 'text-slate-400'}`}>
                                    {errors.aadharCard || (formData.aadharCard ? formData.aadharCard.name : (existingDocs.aadharCard ? 'VIEW EXISTING DOCUMENT' : 'PDF MANDATORY'))}
                                </p>
                            </div>
                            {(formData.aadharCard || existingDocs.aadharCard) && <MdVisibility className="absolute top-4 right-4 text-emerald-500" size={18} />}
                        </div>
                    </div>

                    {/* Medical Certificate */}
                    <div className="relative group/med">
                        <input type="file" name="medicalCertificate" onChange={handleInputChange} accept=".pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                        <div 
                          onClick={() => handleFilePreview(formData.medicalCertificate)}
                          className="h-full p-8 bg-white/5 border border-white/10 rounded-[2rem] group-hover/med:bg-white/10 group-hover/med:border-blue-500 transition-all flex flex-col items-center justify-center text-center space-y-3 cursor-pointer"
                        >
                            <MdCheckCircle size={32} className="text-white/20 group-hover/med:text-blue-500 transition-colors" />
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest leading-tight">Medical Fitness (PDF)</p>
                                <p className="text-[7px] text-slate-400 font-bold uppercase mt-1 italic tracking-widest truncate max-w-[150px] mx-auto">
                                    {formData.medicalCertificate ? formData.medicalCertificate.name : 'OPTIONAL PDF'}
                                </p>
                            </div>
                            {formData.medicalCertificate && <MdVisibility className="absolute top-4 right-4 text-emerald-500" size={18} />}
                        </div>
                    </div>

                    {/* Caste Certificate */}
                    <div className="relative group/caste">
                        <input type="file" name="fileCasteCertificate" onChange={handleInputChange} accept=".pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                        <div 
                          onClick={() => handleFilePreview(formData.fileCasteCertificate)}
                          className="h-full p-8 bg-white/5 border border-white/10 rounded-[2rem] group-hover/caste:bg-white/10 group-hover/caste:border-blue-500 transition-all flex flex-col items-center justify-center text-center space-y-3 cursor-pointer"
                        >
                            <FaCertificate size={32} className="text-white/20 group-hover/caste:text-blue-500 transition-colors" />
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest leading-tight">Caste Credential (PDF)</p>
                                <p className="text-[7px] text-slate-400 font-bold uppercase mt-1 italic tracking-widest truncate max-w-[150px] mx-auto">
                                    {formData.fileCasteCertificate ? formData.fileCasteCertificate.name : 'PDF IF APPLICABLE'}
                                </p>
                            </div>
                            {formData.fileCasteCertificate && <MdVisibility className="absolute top-4 right-4 text-emerald-500" size={18} />}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Academic Sector (Institutional Matrix) */}
        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 p-10 group hover:border-emerald-100 transition-all duration-500">
          <h3 className="text-xs font-black text-slate-400 mb-8 flex items-center uppercase tracking-[0.4em]">
            <MdSchool className="mr-3 text-emerald-600 group-hover:scale-125 transition-transform" size={20} />
            Institutional Matrix
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="md:col-span-2 lg:col-span-3 space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 text-emerald-600 font-bold">Educational Origin Protocol</label>
              <select
                name="hasPreviousEducation"
                value={formData.hasPreviousEducation}
                onChange={handleInputChange}
                className="w-full px-8 py-5 bg-emerald-50/30 border-2 border-transparent rounded-[2rem] focus:bg-white focus:border-emerald-500 outline-none font-black text-[11px] tracking-widest uppercase cursor-pointer transition-all shadow-sm"
                required
              >
                <option value="">SELECT ENROLLMENT TYPE</option>
                <option value="yes">AUTHORIZED PREVIOUS RECORD (EXPERIENCED)</option>
                <option value="no">NO PREVIOUS RECORD (FRESHER)</option>
              </select>
            </div>

            {/* Institutional Matrix - Mandatory for ALL Students */}
            {formData.hasPreviousEducation && (
              <>
                <div className="md:col-span-2 lg:col-span-1 space-y-2 animate-in fade-in slide-in-from-top-4 duration-500">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Institutional Class <span className="text-rose-500">*</span></label>
                  <select 
                    name="course" 
                    value={formData.course} 
                    onChange={handleInputChange} 
                    className={`w-full px-8 py-4 bg-slate-50 border-2 rounded-2xl focus:bg-white outline-none font-black text-[10px] tracking-widest uppercase cursor-pointer transition-all ${errors.course ? 'border-rose-500 bg-rose-50/10' : 'border-transparent focus:border-blue-600'}`}
                  >
                    <option value="">SELECT CLASS</option>
                    {[...new Set(classes.map(cls => cls.className))].sort().map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                  {errors.course && <p className="text-[8px] font-black text-rose-500 ml-4 uppercase">{errors.course}</p>}
                </div>
                {currentStreams.length > 0 && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-500">
                    <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-4">Specialized Stream</label>
                    <select name="stream" value={formData.stream} onChange={handleInputChange} className="w-full px-8 py-4 bg-emerald-50/50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-600 outline-none font-black text-[10px] tracking-widest uppercase cursor-pointer" disabled={!formData.course}>
                      <option value="">SELECT STREAM</option>
                      {currentStreams.map((domain, index) => ( <option key={index} value={domain}>{domain}</option> ))}
                    </select>
                  </div>
                )}
                <div className={`space-y-2 animate-in fade-in slide-in-from-top-4 duration-500 ${currentStreams.length === 0 ? 'md:col-span-1' : ''}`}>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Academic Section <span className="text-rose-500">*</span></label>
                  <select 
                    name="section" 
                    value={formData.section} 
                    onChange={handleInputChange} 
                    className={`w-full px-8 py-4 bg-slate-50 border-2 rounded-2xl focus:bg-white outline-none font-black text-[10px] tracking-widest uppercase cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed ${errors.section ? 'border-rose-500 bg-rose-50/10' : 'border-transparent focus:border-blue-600'}`} 
                    disabled={!formData.course}
                  >
                    <option value="">{!formData.course ? 'SELECT CLASS FIRST' : (sections.length === 0 ? 'NO SECTIONS FOUND' : 'SELECT SECTION')}</option>
                    {sections.map(sec => ( <option key={sec._id} value={sec._id}>{sec.sectionName}</option> ))}
                  </select>
                  {errors.section && <p className="text-[8px] font-black text-rose-500 ml-4 uppercase">{errors.section}</p>}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Expanded Previous Academic Detailed Information */}
        {formData.hasPreviousEducation === 'yes' && (
          <div className="space-y-8 animate-in zoom-in-95 duration-700">
            {/* School Details */}
            <div className="bg-white rounded-[3rem] shadow-sm border border-emerald-100 p-10">
              <h3 className="text-xs font-black text-emerald-400 mb-8 flex items-center uppercase tracking-[0.4em]">
                <FaHistory className="mr-3" size={20} />
                Historical Inception Points
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Previous Course/Standard Name</label>
                  <input type="text" name="prevCourseName" value={formData.prevCourseName} onChange={handleInputChange} className="w-full px-8 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-600 outline-none font-black text-[10px] tracking-widest uppercase" placeholder="E.G., 10TH BOARD, SECONDARY EDUCATION..." required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Institutional Nomenclature (School Name)</label>
                  <input type="text" name="prevSchoolName" value={formData.prevSchoolName} onChange={handleInputChange} className="w-full px-8 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-600 outline-none font-black text-[10px] tracking-widest uppercase" placeholder="PREVIOUS SCHOOL..." required />
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
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Achieved Yield (Value)</label>
                  <input type="number" name="prevMarksValue" value={formData.prevMarksValue} onChange={handleInputChange} className="w-full px-8 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-600 outline-none font-black text-sm tracking-widest font-mono" placeholder="00.00" min="0" max={formData.prevMarksType === 'percentage' ? 100 : 10} step="0.01" required />
                </div>
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
                        <input type="file" name="fileMarksheet" onChange={handleInputChange} accept=".pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" required />
                        <div 
                          onClick={() => handleFilePreview(formData.fileMarksheet)}
                          className="p-6 bg-white/5 border border-white/10 rounded-3xl group-hover:bg-white/10 group-hover:border-emerald-500/50 transition-all text-center cursor-pointer"
                        >
                            <FaFileAlt size={30} className={`mx-auto mb-4 ${formData.fileMarksheet ? 'text-emerald-500' : 'text-slate-500'}`} />
                            <p className="text-[9px] font-black uppercase tracking-widest mb-1">Marksheet/Result (PDF)</p>
                            <p className="text-[8px] text-slate-500 truncate">{formData.fileMarksheet ? formData.fileMarksheet.name : 'PDF REQUIRED'}</p>
                            {formData.fileMarksheet && <MdVisibility className="absolute top-4 right-4 text-emerald-500" size={18} />}
                        </div>
                    </div>
                    <div className="relative group">
                        <input type="file" name="fileTC" onChange={handleInputChange} accept=".pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" required />
                        <div 
                          onClick={() => handleFilePreview(formData.fileTC)}
                          className="p-6 bg-white/5 border border-white/10 rounded-3xl group-hover:bg-white/10 group-hover:border-emerald-500/50 transition-all text-center cursor-pointer"
                        >
                            <FaGlobe size={30} className={`mx-auto mb-4 ${formData.fileTC ? 'text-emerald-500' : 'text-slate-500'}`} />
                            <p className="text-[9px] font-black uppercase tracking-widest mb-1">Transfer Certificate (PDF)</p>
                            <p className="text-[8px] text-slate-500 truncate">{formData.fileTC ? formData.fileTC.name : 'PDF REQUIRED'}</p>
                            {formData.fileTC && <MdVisibility className="absolute top-4 right-4 text-emerald-500" size={18} />}
                        </div>
                    </div>
                    <div className="relative group">
                        <input type="file" name="fileCharacterCert" onChange={handleInputChange} accept=".pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" required />
                        <div 
                          onClick={() => handleFilePreview(formData.fileCharacterCert)}
                          className="p-6 bg-white/5 border border-white/10 rounded-3xl group-hover:bg-white/10 group-hover:border-emerald-500/50 transition-all text-center cursor-pointer"
                        >
                            <MdPerson size={30} className={`mx-auto mb-4 ${formData.fileCharacterCert ? 'text-emerald-500' : 'text-slate-500'}`} />
                            <p className="text-[9px] font-black uppercase tracking-widest mb-1">Character Cert. (PDF)</p>
                            <p className="text-[8px] text-slate-500 truncate">{formData.fileCharacterCert ? formData.fileCharacterCert.name : 'PDF REQUIRED'}</p>
                            {formData.fileCharacterCert && <MdVisibility className="absolute top-4 right-4 text-emerald-500" size={18} />}
                        </div>
                    </div>
                    <div className="relative group">
                        <input type="file" name="fileMigrationCert" onChange={handleInputChange} accept=".pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                        <div 
                          onClick={() => handleFilePreview(formData.fileMigrationCert)}
                          className="p-6 bg-white/5 border border-white/10 rounded-3xl group-hover:bg-white/10 group-hover:border-emerald-500/50 transition-all text-center cursor-pointer"
                        >
                            <FaFileAlt size={30} className={`mx-auto mb-4 ${formData.fileMigrationCert ? 'text-emerald-500' : 'text-slate-500'}`} />
                            <p className="text-[9px] font-black uppercase tracking-widest mb-1 font-bold">Migration Cert. (PDF)</p>
                            <p className="text-[8px] text-slate-400 italic mb-1 uppercase tracking-tighter">(OPTIONAL)</p>
                            <p className="text-[8px] text-slate-500 truncate">{formData.fileMigrationCert ? formData.fileMigrationCert.name : 'PDF OPTIONAL'}</p>
                            {formData.fileMigrationCert && <MdVisibility className="absolute top-4 right-4 text-emerald-500" size={18} />}
                        </div>
                    </div>
                </div>
            </div>
          </div>
        )}

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