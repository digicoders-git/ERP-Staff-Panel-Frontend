import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { admissionAPI } from '../utils/apiService';
import { BASE_URL } from '../utils/api';
import { toast } from 'react-toastify';
import {
    MdPerson,
    MdEmail,
    MdPhone,
    MdLocationOn,
    MdSchool,
    MdDateRange,
    MdArrowBack,
    MdCheckCircle,
    MdPending,
    MdError,
    MdContactPage,
    MdFamilyRestroom,
    MdCake,
    MdLocalHospital,
    MdMap
} from 'react-icons/md';
import { FaSpinner, FaHistory, FaMapMarkerAlt } from 'react-icons/fa';

const StudentProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                setLoading(true);
                const res = await admissionAPI.getById(id);
                const s = res.data.student || res.data;
                
                if (s) {
                    setStudent({
                      id: s.admissionNumber || s._id,
                      firstName: s.firstName,
                      lastName: s.lastName,
                      name: `${s.firstName || s.name || ''} ${s.lastName || ''}`.trim(),
                      class: s.class?.className || s.className || '-',
                      stream: s.stream || '-',
                      section: s.section?.sectionName || s.sectionName || '-',
                      status: s.admissionStatus || s.status || 'pending',
                      date: s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '-',
                      mobile: s.phone || s.mobile || '-',
                      email: s.email || '-',
                      guardianInfo: s.guardianInfo || {},
                      permanentAddress: s.permanentAddress || {},
                      currentAddress: s.currentAddress || {},
                      previousEducation: s.previousEducation || {},
                      hasPreviousEducation: s.hasPreviousEducation,
                      dob: s.dob ? new Date(s.dob).toLocaleDateString() : '-',
                      category: s.category || 'GENERAL',
                      medicalCertificate: s.medicalCertificate,
                      casteCertificate: s.casteCertificate,
                      studentPhoto: s.profileImage
                    });
                    console.log('Student ID:', id, 'Record Synchronized:', s);
                }
            } catch (err) {
                console.error('Failed to fetch student profile:', err);
                toast.error('School Records Error: Failed to fetch record');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchStudent();
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600 font-medium">Synchronizing School Record...</p>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <p className="text-red-500 font-bold">CRITICAL: Record Not Found</p>
                <button onClick={() => navigate('/admissions')} className="mt-4 text-blue-600 hover:underline">Return to Records</button>
            </div>
        );
    }

    const getStatusStyles = (status) => {
        switch (status) {
            case 'confirmed': return { bg: 'bg-green-100', text: 'text-green-700', icon: <MdCheckCircle className="text-green-600" /> };
            case 'pending': return { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <MdPending className="text-yellow-600" /> };
            case 'rejected': return { bg: 'bg-red-100', text: 'text-red-700', icon: <MdError className="text-red-600" /> };
            default: return { bg: 'bg-gray-100', text: 'text-gray-700', icon: <MdPerson className="text-gray-600" /> };
        }
    };

    const statusStyle = getStatusStyles(student.status);

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn">
            {/* Header / Navigation */}
            <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <button
                    onClick={() => navigate('/admissions')}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
                >
                    <MdArrowBack size={24} />
                    Back to Admissions
                </button>
                <div className="flex items-center gap-3">
                    <span className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                        {statusStyle.icon}
                        {student.status.toUpperCase()}
                    </span>
                </div>
            </div>

            {/* Profile Overview Card */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl overflow-hidden shadow-xl text-white">
                <div className="p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="relative">
                        <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center text-white text-5xl font-bold shadow-2xl border-4 border-white/10 overflow-hidden">
                            {student.studentPhoto ? (
                                <img 
                                    src={student.studentPhoto.startsWith('http') ? student.studentPhoto : `${BASE_URL}/${student.studentPhoto.replace(/\\\\/g, '/')}`} 
                                    alt={student.name} 
                                    className="w-full h-full object-cover"
                                    onLoad={() => console.log('Image loaded successfully:', student.studentPhoto)}
                                    onError={(e) => {
                                        console.error('Image load failed for URL:', e.target.src);
                                        e.target.onerror = null;
                                        e.target.style.display = 'none';
                                    }}
                                />
                            ) : (
                                student.name.charAt(0)
                            )}
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-slate-900"></div>
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-2">
                        <div className="flex flex-col md:flex-row md:items-center gap-3">
                            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{student.name}</h1>
                            <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-sm font-medium border border-white/10 w-fit mx-auto md:mx-0">
                                ID: {student.id}
                            </span>
                        </div>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                            <div className="flex items-center gap-2 text-blue-200">
                                <MdSchool size={20} />
                                <span className="font-medium">Class {student.class} {student.stream && `(${student.stream})`}</span>
                            </div>
                            <div className="flex items-center gap-2 text-purple-200">
                                <MdDateRange size={20} />
                                <span className="font-medium">App. Date: {student.date}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg active:scale-95">
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Essential Info */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Identity Documents */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                        <h3 className="text-xs font-black text-slate-400 mb-8 flex items-center uppercase tracking-[0.3em]">
                            <FaSpinner className="mr-3 text-blue-500" />
                            Identity Documents
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Medical Clearance</span>
                                {student.medicalCertificate ? (
                                    <MdCheckCircle className="text-emerald-500" size={20} />
                                ) : (
                                    <MdError className="text-rose-500" size={20} />
                                )}
                            </div>
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Caste Protocol</span>
                                {student.category.toLowerCase() === 'general' ? (
                                    <span className="text-[8px] font-bold text-slate-400 italic">NOT REQUIRED</span>
                                ) : student.casteCertificate ? (
                                    <MdCheckCircle className="text-emerald-500" size={20} />
                                ) : (
                                    <MdError className="text-rose-500" size={20} />
                                )}
                            </div>
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">School Category</span>
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-[10px] font-black uppercase tracking-tighter">{student.category}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                        <h3 className="text-xs font-black text-slate-400 mb-8 flex items-center uppercase tracking-[0.3em]">
                            <MdContactPage className="text-blue-500 mr-3" />
                            Primary Hotline
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                                    <MdPhone size={20} />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Student Phone</p>
                                    <p className="text-slate-800 font-black text-sm">{student.mobile}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                                    <MdEmail size={20} />
                                </div>
                                <div className="break-all">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Communication Matrix</p>
                                    <p className="text-slate-800 font-bold text-xs">{student.email}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-pink-50 rounded-2xl text-pink-600">
                                    <MdCake size={20} />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Date of Birth</p>
                                    <p className="text-slate-800 font-black text-sm">{student.dob}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Detailed Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Guardian Record */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                        <h3 className="text-xs font-black text-slate-400 mb-10 flex items-center uppercase tracking-[0.3em]">
                            <MdFamilyRestroom className="text-amber-500 mr-3" size={24} />
                            Guardian Record
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Father's Name</p>
                                <p className="text-slate-800 font-black text-lg">{student.guardianInfo.fatherName || '-'}</p>
                            </div>
                            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Mother's Name</p>
                                <p className="text-slate-800 font-black text-lg">{student.guardianInfo.motherName || '-'}</p>
                            </div>
                            <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100/50">
                                <p className="text-[9px] font-black text-amber-600/60 uppercase tracking-widest mb-3">Primary Guardian Hotline</p>
                                <p className="text-amber-900 font-black text-lg">{student.guardianInfo.guardianPhone || '-'}</p>
                            </div>
                            <div className="p-6 bg-rose-50 rounded-3xl border border-rose-100/50">
                                <p className="text-[9px] font-black text-rose-600/60 uppercase tracking-widest mb-3">Emergency Response Contact</p>
                                <p className="text-rose-900 font-black text-lg">{student.guardianInfo.emergencyPhone || '-'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Spatial Addresses */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                        <h3 className="text-xs font-black text-slate-400 mb-10 flex items-center uppercase tracking-[0.3em]">
                            <MdLocationOn className="text-rose-500 mr-3" size={24} />
                            Spatial Residue (Addresses)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="flex items-center space-x-2 text-rose-600 mb-2">
                                    <MdMap size={16} />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Permanent Station</span>
                                </div>
                                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-slate-700 font-bold text-xs uppercase mb-1">{student.permanentAddress.address || '-'}</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        {student.permanentAddress.city}, {student.permanentAddress.state} - {student.permanentAddress.pincode}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-2 text-blue-600 mb-2">
                                    <FaMapMarkerAlt size={14} />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Current Deployment</span>
                                </div>
                                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-slate-700 font-bold text-xs uppercase mb-1">{student.currentAddress.address || '-'}</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        {student.currentAddress.city}, {student.currentAddress.state} - {student.currentAddress.pincode}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* School Origins (Previous Academic) */}
                    {student.hasPreviousEducation === 'yes' && (
                        <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
                             <h3 className="text-xs font-black text-emerald-400 mb-10 flex items-center uppercase tracking-[0.4em]">
                                <FaHistory className="mr-3" size={20} />
                                Historical Inception (Previous Education)
                             </h3>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                 <div>
                                     <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Previous Course/Protocol</p>
                                     <p className="text-xl font-black text-emerald-500">{student.previousEducation.previousCourseName || '-'}</p>
                                 </div>
                                 <div className="md:col-span-1">
                                     <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Metric protocol Yield</p>
                                     <p className="text-xl font-black text-white">{student.previousEducation.previousPercentage}% <span className="text-[10px] text-slate-400 font-bold italic">({student.previousEducation.previousMarksType})</span></p>
                                 </div>
                                 <div className="md:col-span-2">
                                     <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">School Name (School)</p>
                                     <p className="text-lg font-bold text-slate-200 mb-1">{student.previousEducation.previousSchoolName || '-'}</p>
                                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{student.previousEducation.previousSchoolAddress || '-'}</p>
                                 </div>
                                 <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/10">
                                     <div className="text-center">
                                         <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">Marksheet</p>
                                         <div className="flex justify-center">{student.previousEducation.marksheet ? <MdCheckCircle className="text-emerald-500" size={20} /> : <MdError className="text-white/20" size={20} />}</div>
                                     </div>
                                     <div className="text-center">
                                         <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">TC Document</p>
                                         <div className="flex justify-center">{student.previousEducation.transferCertificate ? <MdCheckCircle className="text-emerald-500" size={20} /> : <MdError className="text-white/20" size={20} />}</div>
                                     </div>
                                     <div className="text-center">
                                         <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">Character Cert.</p>
                                         <div className="flex justify-center">{student.previousEducation.characterCertificate ? <MdCheckCircle className="text-emerald-500" size={20} /> : <MdError className="text-white/20" size={20} />}</div>
                                     </div>
                                     <div className="text-center">
                                         <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">Migration Cert.</p>
                                         <div className="flex justify-center">{student.previousEducation.migrationCertificate ? <MdCheckCircle className="text-emerald-500" size={20} /> : <MdError className="text-white/20" size={20} />}</div>
                                     </div>
                                 </div>
                             </div>
                        </div>
                    )}

                    {/* Administrative Status Footprint */}
                    <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 border-dashed">
                         <div className="flex items-center justify-between">
                             <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm">
                                     <MdDateRange size={24} />
                                 </div>
                                 <div>
                                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Entry Lifecycle Origin</p>
                                     <p className="text-slate-800 font-black text-sm">{student.date}</p>
                                 </div>
                             </div>
                             <div className="text-right">
                                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Record Integrity</p>
                                 <span className="px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-tighter">VERIFIED MANIFEST</span>
                             </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;
