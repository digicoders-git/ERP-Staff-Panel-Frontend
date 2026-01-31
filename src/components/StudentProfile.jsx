import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
    MdLocalHospital
} from 'react-icons/md';

const StudentProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);

    // Mock data - In a real app, you'd fetch this from an API
    const admissionsData = [
        { id: 'ADM001', name: 'Rahul Sharma', class: '11th', stream: 'Science', status: 'confirmed', date: '2024-01-15', mobile: '9876543210', email: 'rahul@email.com', fatherName: 'Suresh Sharma', address: '123 Main St, New Delhi, Delhi - 110001', dob: '2007-05-15', medicalCertificate: 'uploaded' },
        { id: 'ADM002', name: 'Priya Singh', class: '10th', stream: '', status: 'pending', date: '2024-01-14', mobile: '9876543211', email: 'priya@email.com', fatherName: 'Rajesh Singh', address: '456 Park Ave, Mumbai, Maharashtra - 400001', dob: '2008-03-20', medicalCertificate: 'pending' },
        { id: 'ADM003', name: 'Sneha Patel', class: '11th', stream: 'Arts', status: 'confirmed', date: '2024-01-13', mobile: '9876543212', email: 'sneha@email.com', fatherName: 'Amit Patel', address: '789 Oak St, Ahmedabad, Gujarat - 380001', dob: '2007-08-10', medicalCertificate: 'uploaded' },
        { id: 'ADM004', name: 'Amit Kumar', class: '9th', stream: '', status: 'rejected', date: '2024-01-12', mobile: '9876543213', email: 'amit@email.com', fatherName: 'Vinod Kumar', address: '321 Elm St, Lucknow, Uttar Pradesh - 226001', dob: '2009-01-25', medicalCertificate: 'pending' },
        { id: 'ADM005', name: 'Kavya Reddy', class: '12th', stream: 'Commerce', status: 'confirmed', date: '2024-01-11', mobile: '9876543214', email: 'kavya@email.com', fatherName: 'Ravi Reddy', address: '654 Pine St, Hyderabad, Telangana - 500001', dob: '2006-11-30', medicalCertificate: 'uploaded' }
    ];

    useEffect(() => {
        const foundStudent = admissionsData.find(s => s.id === id);
        if (foundStudent) {
            setStudent(foundStudent);
        }
    }, [id]);

    if (!student) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600 font-medium">Loading student profile...</p>
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
                        <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center text-white text-5xl font-bold shadow-2xl border-4 border-white/10">
                            {student.name.charAt(0)}
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
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b pb-3">
                            <MdContactPage className="text-blue-500" />
                            Contact Details
                        </h3>
                        <div className="space-y-5">
                            <div className="flex items-start gap-4">
                                <div className="p-2.5 bg-blue-50 rounded-lg text-blue-600 mt-1">
                                    <MdPhone size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Phone Number</p>
                                    <p className="text-slate-700 font-semibold">{student.mobile}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-2.5 bg-indigo-50 rounded-lg text-indigo-600 mt-1">
                                    <MdEmail size={20} />
                                </div>
                                <div className="break-all">
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Email Address</p>
                                    <p className="text-slate-700 font-semibold">{student.email}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-2.5 bg-purple-50 rounded-lg text-purple-600 mt-1">
                                    <MdLocationOn size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Residential Address</p>
                                    <p className="text-slate-700 font-semibold leading-relaxed">{student.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 shadow-xl text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <MdLocalHospital size={100} />
                        </div>
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            Medical Status
                        </h3>
                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm">Certificate Status</p>
                                <p className="text-2xl font-black mt-1 capitalize">{student.medicalCertificate}</p>
                            </div>
                            <div className={`p-3 rounded-2xl ${student.medicalCertificate === 'uploaded' ? 'bg-white/20' : 'bg-red-500/40'}`}>
                                {student.medicalCertificate === 'uploaded' ? <MdCheckCircle size={32} /> : <MdError size={32} />}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Detailed Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2 border-b pb-4">
                            <MdFamilyRestroom className="text-blue-500" size={24} />
                            Personal & Family Background
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Father's Full Name</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold">
                                        <MdPerson size={20} />
                                    </div>
                                    <p className="text-slate-800 font-bold text-lg">{student.fatherName}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Date of Birth</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-pink-50 rounded-full flex items-center justify-center text-pink-500 font-bold">
                                        <MdCake size={20} />
                                    </div>
                                    <p className="text-slate-800 font-bold text-lg">{student.dob}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Academic Year</p>
                                <p className="text-slate-800 font-bold text-lg">2024 - 2025</p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Nationality</p>
                                <p className="text-slate-800 font-bold text-lg">Indian</p>
                            </div>
                        </div>

                        <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <h4 className="font-bold text-slate-700 mb-4 uppercase text-xs tracking-widest">Administrative Notes</h4>
                            <p className="text-slate-500 text-sm italic leading-relaxed">
                                Student application is currently under review for the academic session 2024-25.
                                All original documents must be presented at the time of final verification.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;
