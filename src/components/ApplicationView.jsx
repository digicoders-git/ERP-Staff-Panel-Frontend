import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { studentAPI, admissionAPI } from '../utils/apiService';
import { 
  MdArrowBack, MdPerson, MdEmail, MdPhone, MdLocationOn, 
  MdSchool, MdAssignmentInd, MdCheckCircle, MdCancel, MdEdit 
} from 'react-icons/md';
import { FaFingerprint, FaFileAlt, FaMapMarkerAlt, FaVenusMars, FaBirthdayCake } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { FaSpinner } from 'react-icons/fa';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002';

const ApplicationView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentData();
  }, [id]);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const response = await admissionAPI.getById(id);
      const studentData = response.data.student || response.data;
      setStudent(studentData);
      
      // Auto-replace Mongo ID in URL with admissionNumber if applicable
      if (studentData.admissionNumber && id !== studentData.admissionNumber) {
        navigate(`/application-view/${studentData.admissionNumber}`, { replace: true });
      }
    } catch (error) {
      console.error('Failed to fetch student data:', error);
      toast.error('Failed to load application details');
      navigate('/applications');
    } finally {
      setLoading(false);
    }
  };

  const handleAdmissionAction = async (action) => {
    try {
      if (action === 'approve') {
        await studentAPI.verify(student._id, { status: 'verified', remarks: 'Application Approved' });
        toast.success('Application approved successfully! ✅');
      } else if (action === 'confirm') {
        await admissionAPI.update(student._id, { admissionStatus: 'confirmed' });
        toast.success('Admission confirmed successfully! 🎓');
      } else if (action === 'reject') {
        await studentAPI.verify(student._id, { status: 'rejected', remarks: 'Application Rejected' });
        toast.error('Application rejected ❌');
      }
      fetchStudentData();
    } catch (err) {
      console.error('Status update failure:', err);
      toast.error('Failed to update status');
    }
  };

  const handleEdit = () => {
    navigate(`/edit-admission/${student.admissionNumber || student._id}`);
  };

  const formatUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${BASE_URL}/${path.replace(/\\/g, '/')}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <FaSpinner className="animate-spin text-blue-500 text-5xl" />
      </div>
    );
  }

  if (!student) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Header Area */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => navigate('/applications')}
          className="flex items-center text-blue-600 hover:text-blue-800 font-bold transition-colors"
        >
          <MdArrowBack className="mr-2 text-xl" /> Back to Applications
        </button>
        <div className="flex gap-3">
          <span className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest ${
            student.admissionStatus === 'confirmed' ? 'bg-emerald-600 text-white shadow-sm' :
            student.applicationStatus === 'approved' ? 'bg-emerald-100 text-emerald-800' : 
            student.applicationStatus === 'pending' ? 'bg-orange-100 text-orange-800' :
            'bg-rose-100 text-rose-800'
          }`}>
            {student.admissionStatus === 'confirmed' ? 'Confirmed' : student.applicationStatus}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-800 p-8 text-white flex items-center gap-8 relative overflow-hidden">
          <div className="w-32 h-32 rounded-full bg-white/20 p-2 shrink-0 backdrop-blur-sm z-10">
            {student.profileImage ? (
              <img 
                src={formatUrl(student.profileImage)} 
                alt="Profile" 
                className="w-full h-full object-cover rounded-full bg-white"
              />
            ) : (
              <div className="w-full h-full bg-slate-200 rounded-full flex items-center justify-center text-slate-400">
                <MdPerson size={64} />
              </div>
            )}
          </div>
          <div className="z-10">
            <h1 className="text-3xl font-black mb-2">{`${student.firstName || ''} ${student.lastName || ''}`.trim()}</h1>
            <div className="flex flex-wrap gap-4 text-indigo-100 text-sm font-medium">
              <span className="flex items-center gap-1"><MdEmail /> {student.email}</span>
              <span className="flex items-center gap-1"><MdPhone /> {student.phone}</span>
              <span className="flex items-center gap-1">
                <span className="bg-indigo-700/50 px-2 py-1 rounded text-xs">App ID: {student.admissionNumber || `#${student._id.slice(-6).toUpperCase()}`}</span>
              </span>
            </div>
          </div>
          <div className="absolute -right-20 -top-20 opacity-10">
            <MdAssignmentInd size={300} />
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Section: Personal Info */}
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2 border-b pb-2">
                <MdPerson className="text-blue-500" /> Personal Information
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Date of Birth</span>
                    <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <FaBirthdayCake className="text-slate-400" />
                      {student.dob ? new Date(student.dob).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Gender</span>
                    <span className="text-sm font-bold text-slate-700 flex items-center gap-2 capitalize">
                      <FaVenusMars className="text-slate-400" />
                      {student.gender || 'N/A'}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Category</span>
                    <span className="text-sm font-bold text-slate-700 capitalize">{student.category || 'N/A'}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Religion</span>
                    <span className="text-sm font-bold text-slate-700 capitalize">{student.religion || 'N/A'}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Blood Group</span>
                    <span className="text-sm font-bold text-slate-700">{student.bloodGroup || 'N/A'}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Aadhaar Number</span>
                    <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <FaFingerprint className="text-slate-400" />
                      {student.aadhaarNumber || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Academic Info */}
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2 border-b pb-2">
                <MdSchool className="text-emerald-500" /> Academic Details
              </h3>
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl flex gap-6">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Applied For Class</span>
                    <span className="text-lg font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-lg">
                      {student.class?.className || (typeof student.class === 'string' ? student.class : 'N/A')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Section</span>
                    <span className="text-lg font-black text-slate-700 bg-slate-200 px-3 py-1 rounded-lg">
                      {student.section?.sectionName || student.section?.name || (typeof student.section === 'string' ? student.section : 'N/A')}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl mt-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-2">Previous Education</span>
                  {student.hasPreviousEducation === 'yes' ? (
                    <div className="space-y-2">
                      <div className="text-sm font-bold text-slate-700">{student.previousEducation?.previousSchoolName}</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="text-slate-500">Marks: <span className="font-bold text-slate-700">{student.previousEducation?.previousPercentage} ({student.previousEducation?.previousMarksType})</span></div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm font-medium text-slate-500 italic">No previous education details provided.</div>
                  )}
                </div>
              </div>
            </div>

            {/* Section: Parent Info */}
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2 border-b pb-2">
                <MdAssignmentInd className="text-orange-500" /> Guardian Information
              </h3>
              <div className="space-y-4">
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Father's Name</span>
                  <span className="text-sm font-bold text-slate-700">{student.fatherName || student.guardianInfo?.fatherName || 'N/A'}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Mother's Name</span>
                  <span className="text-sm font-bold text-slate-700">{student.motherName || student.guardianInfo?.motherName || 'N/A'}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Guardian Phone</span>
                    <span className="text-sm font-bold text-slate-700">{student.guardianPhone || student.guardianInfo?.guardianPhone || 'N/A'}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-rose-100 bg-rose-50">
                    <span className="text-[10px] font-bold text-rose-500 uppercase block mb-1">Emergency Contact</span>
                    <span className="text-sm font-black text-rose-700">{student.emergencyContact || student.guardianInfo?.emergencyPhone || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Address */}
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2 border-b pb-2">
                <FaMapMarkerAlt className="text-purple-500" /> Address Details
              </h3>
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-2">Permanent Address</span>
                  <div className="text-sm font-medium text-slate-700">
                    {student.permanentAddress?.address || 'N/A'}<br/>
                    {student.permanentAddress?.city ? `${student.permanentAddress.city}, ` : ''}
                    {student.permanentAddress?.state ? `${student.permanentAddress.state} - ` : ''}
                    <span className="font-bold">{student.permanentAddress?.pincode || ''}</span>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-2">Current Address</span>
                  <div className="text-sm font-medium text-slate-700">
                    {student.currentAddress?.address || 'N/A'}<br/>
                    {student.currentAddress?.city ? `${student.currentAddress.city}, ` : ''}
                    {student.currentAddress?.state ? `${student.currentAddress.state} - ` : ''}
                    <span className="font-bold">{student.currentAddress?.pincode || ''}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Documents */}
            <div className="md:col-span-2">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2 border-b pb-2">
                <FaFileAlt className="text-indigo-500" /> Uploaded Documents
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Aadhaar Card', url: student.documents?.aadharCard },
                  { label: 'Birth Certificate', url: student.documents?.birthCertificate },
                  { label: 'Caste Certificate', url: student.casteCertificate },
                  { label: 'Medical Certificate', url: student.medicalCertificate },
                  { label: 'Marksheet', url: student.documents?.marksheet || student.previousEducation?.marksheet },
                  { label: 'Transfer Certificate', url: student.documents?.transferCertificate || student.previousEducation?.transferCertificate },
                  { label: 'Character Certificate', url: student.documents?.characterCertificate || student.previousEducation?.characterCertificate },
                  { label: 'Migration Certificate', url: student.previousEducation?.migrationCertificate },
                ].map((doc, idx) => {
                  if (!doc.url) return null;
                  return (
                    <a 
                      key={idx} 
                      href={formatUrl(doc.url)} 
                      target="_blank" 
                      rel="noreferrer"
                      className="bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors group"
                    >
                      <FaFileAlt className="text-3xl text-indigo-300 group-hover:text-indigo-500 transition-colors" />
                      <span className="text-xs font-bold text-indigo-900 text-center">{doc.label}</span>
                      <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">View PDF</span>
                    </a>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-slate-50 border-t border-slate-200 p-6 flex flex-wrap justify-between items-center gap-4">
          <button 
            onClick={handleEdit}
            className="px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-blue-50 transition-colors flex items-center gap-2"
          >
            <MdEdit size={18} /> Edit Application
          </button>
          
          <div className="flex gap-4">
            {student.applicationStatus !== 'rejected' && (
              <>
                {student.applicationStatus === 'pending' && (
                  <button 
                    onClick={() => handleAdmissionAction('approve')}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-lg shadow-emerald-200"
                  >
                    <MdCheckCircle size={18} /> Approve
                  </button>
                )}

                {student.applicationStatus === 'approved' && student.admissionStatus !== 'confirmed' && (
                  <button 
                    onClick={() => handleAdmissionAction('confirm')}
                    className="px-6 py-3 bg-purple-600 text-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-purple-700 transition-colors flex items-center gap-2 shadow-lg shadow-purple-200"
                  >
                    <MdCheckCircle className="rotate-90" size={18} /> Confirm Admission
                  </button>
                )}

                {(student.applicationStatus === 'pending' || student.applicationStatus === 'approved') && (
                  <button 
                    onClick={() => handleAdmissionAction('reject')}
                    className="px-6 py-3 bg-red-500 text-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-red-600 transition-colors flex items-center gap-2 shadow-lg shadow-red-200"
                  >
                    <MdCancel size={18} /> Reject
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationView;
