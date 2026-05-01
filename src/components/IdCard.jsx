import React, { useState, useEffect, useRef } from 'react';
import {
    FaIdCard, FaSearch, FaSpinner, FaDownload, FaTimes, FaUsers, FaUserGraduate, FaChalkboardTeacher,
    FaUpload, FaMousePointer, FaTextHeight, FaSave, FaEye, FaCheck, FaBorderAll, FaChevronDown, FaPrint
} from 'react-icons/fa';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002';

const FIELDS_BY_ROLE = {
  student: [
    { id: 'student_photo', label: 'Photo', type: 'image', placeholder: 'https://placehold.co/120x150?text=PHOTO' },
    { id: 'student_name', label: 'Name', type: 'text', placeholder: '[ NAME ]' },
    { id: 'admission_no', label: 'Adm No', type: 'text', placeholder: '[ ADM NO ]' },
    { id: 'roll_no', label: 'Roll No', type: 'text', placeholder: '[ ROLL NO ]' },
    { id: 'class_section', label: 'Class/Sec', type: 'text', placeholder: '[ CLASS/SEC ]' },
    { id: 'dob', label: 'DOB', type: 'text', placeholder: '[ DD/MM/YYYY ]' },
    { id: 'blood_group', label: 'Blood Group', type: 'text', placeholder: '[ B+ ]' },
    { id: 'student_phone', label: 'Student Mobile', type: 'text', placeholder: '[ STUDENT MOBILE ]' },
    { id: 'guardian_contact', label: 'Guardian Phone', type: 'text', placeholder: '[ GUARDIAN PHONE ]' },
    { id: 'emergency_contact', label: 'Emergency Contact', type: 'text', placeholder: '[ EMERGENCY CONTACT ]' },
    { id: 'id_no', label: 'ID Number', type: 'text', placeholder: '[ ID NUMBER ]' },
    { id: 'email', label: 'Email', type: 'text', placeholder: '[ EMAIL ]' },
    { id: 'address', label: 'Address', type: 'text', placeholder: '[ ADDRESS ]' },
    { id: 'father_name', label: 'Father Name', type: 'text', placeholder: '[ FATHER NAME ]' },
    { id: 'mother_name', label: 'Mother Name', type: 'text', placeholder: '[ MOTHER NAME ]' },
    { id: 'school_name', label: 'School Name', type: 'text', placeholder: '[ SCHOOL NAME ]' },
    { id: 'school_logo', label: 'Logo', type: 'image', placeholder: 'https://placehold.co/50?text=LOGO' },
    { id: 'signature', label: 'Signature', type: 'image', placeholder: 'https://placehold.co/100x40?text=SIGNATURE' },
    { id: 'qr_code', label: 'QR Code', type: 'image', placeholder: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=STU-1046' }
  ],
  staff: [
    { id: 'staff_photo', label: 'Photo', type: 'image', placeholder: 'https://placehold.co/120x150?text=PHOTO' },
    { id: 'staff_name', label: 'Name', type: 'text', placeholder: '[ NAME ]' },
    { id: 'employee_id', label: 'Emp ID', type: 'text', placeholder: '[ EMP-ID ]' },
    { id: 'designation', label: 'Designation', type: 'text', placeholder: '[ DESIGNATION ]' },
    { id: 'department', label: 'Department', type: 'text', placeholder: '[ DEPARTMENT ]' },
    { id: 'staff_phone', label: 'Phone', type: 'text', placeholder: '[ PHONE ]' },
    { id: 'staff_email', label: 'Email', type: 'text', placeholder: '[ EMAIL ]' },
    { id: 'staff_address', label: 'Address', type: 'text', placeholder: '[ ADDRESS ]' },
    { id: 'blood_group', label: 'Blood Group', type: 'text', placeholder: '[ B+ ]' },
    { id: 'school_name', label: 'School Name', type: 'text', placeholder: '[ SCHOOL NAME ]' },
    { id: 'school_logo', label: 'Logo', type: 'image', placeholder: 'https://placehold.co/50?text=LOGO' },
    { id: 'signature', label: 'Signature', type: 'image', placeholder: 'https://placehold.co/100x40?text=SIGNATURE' },
    { id: 'qr_code', label: 'QR Code', type: 'image', placeholder: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=STAFF' }
  ],
  teacher: [
    { id: 'staff_photo', label: 'Photo', type: 'image', placeholder: 'https://placehold.co/120x150?text=PHOTO' },
    { id: 'staff_name', label: 'Name', type: 'text', placeholder: '[ NAME ]' },
    { id: 'employee_id', label: 'Teacher ID', type: 'text', placeholder: '[ TCH-ID ]' },
    { id: 'subject', label: 'Subject', type: 'text', placeholder: '[ SUBJECT ]' },
    { id: 'qualification', label: 'Qualification', type: 'text', placeholder: '[ QUALIFICATION ]' },
    { id: 'experience', label: 'Experience', type: 'text', placeholder: '[ EXPERIENCE ]' },
    { id: 'is_class_teacher', label: 'Class Teacher?', type: 'text', placeholder: '[ YES/NO ]' },
    { id: 'assigned_class', label: 'Assigned Class', type: 'text', placeholder: '[ CLASS ]' },
    { id: 'staff_phone', label: 'Phone', type: 'text', placeholder: '[ PHONE ]' },
    { id: 'staff_email', label: 'Email', type: 'text', placeholder: '[ EMAIL ]' },
    { id: 'blood_group', label: 'Blood Group', type: 'text', placeholder: '[ B+ ]' },
    { id: 'school_name', label: 'School Name', type: 'text', placeholder: '[ SCHOOL NAME ]' },
    { id: 'school_logo', label: 'Logo', type: 'image', placeholder: 'https://placehold.co/50?text=LOGO' },
    { id: 'signature', label: 'Signature', type: 'image', placeholder: 'https://placehold.co/100x40?text=SIGNATURE' },
    { id: 'qr_code', label: 'QR Code', type: 'image', placeholder: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TEACHER' }
  ],
  driver: [
    { id: 'staff_photo', label: 'Photo', type: 'image', placeholder: 'https://placehold.co/120x150?text=PHOTO' },
    { id: 'staff_name', label: 'Name', type: 'text', placeholder: '[ NAME ]' },
    { id: 'employee_id', label: 'Driver ID', type: 'text', placeholder: '[ DRV-ID ]' },
    { id: 'vehicle_no', label: 'Vehicle No', type: 'text', placeholder: '[ VEHICLE NO ]' },
    { id: 'route_name', label: 'Route', type: 'text', placeholder: '[ ROUTE ]' },
    { id: 'staff_phone', label: 'Phone', type: 'text', placeholder: '[ PHONE ]' },
    { id: 'license_no', label: 'License No', type: 'text', placeholder: '[ LICENSE NO ]' },
    { id: 'school_name', label: 'School Name', type: 'text', placeholder: '[ SCHOOL NAME ]' },
    { id: 'school_logo', label: 'Logo', type: 'image', placeholder: 'https://placehold.co/50?text=LOGO' },
    { id: 'qr_code', label: 'QR Code', type: 'image', placeholder: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=DRIVER' }
  ],
  warden: [
    { id: 'staff_photo', label: 'Photo', type: 'image', placeholder: 'https://placehold.co/120x150?text=PHOTO' },
    { id: 'staff_name', label: 'Name', type: 'text', placeholder: '[ NAME ]' },
    { id: 'employee_id', label: 'Warden ID', type: 'text', placeholder: '[ WRD-ID ]' },
    { id: 'hostel_name', label: 'Hostel', type: 'text', placeholder: '[ HOSTEL ]' },
    { id: 'staff_phone', label: 'Phone', type: 'text', placeholder: '[ PHONE ]' },
    { id: 'school_name', label: 'School Name', type: 'text', placeholder: '[ SCHOOL NAME ]' },
    { id: 'qr_code', label: 'QR Code', type: 'image', placeholder: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=WARDEN' }
  ]
};

// Map roles to their specific panel categories
const ROLE_PANEL_MAP = {
  student: 'parent',
  staff: 'staff',
  teacher: 'teacher',
  driver: 'transport',
  warden: 'warden',
  librarian: 'library',
  feeadmin: 'fee'
};

export default function IdCard() {
    const [viewMode, setViewMode] = useState('generate');
    const [selectedRole, setSelectedRole] = useState('student');
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [people, setPeople] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedSection, setSelectedSection] = useState("");
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [previewHtml, setPreviewHtml] = useState("");
    const [search, setSearch] = useState("");
    const [previewPerson, setPreviewPerson] = useState(null);

    // Designer State
    const [templateUrl, setTemplateUrl] = useState("");
    const [configFields, setConfigFields] = useState([]);
    const [selectedField, setSelectedField] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [design, setDesign] = useState({ cardWidth: 350, cardHeight: 550, backgroundColor: '#ffffff' });
    const [showGrid, setShowGrid] = useState(true);
    const [saving, setSaving] = useState(false);
    const mapperRef = useRef(null);

    useEffect(() => {
        if (selectedRole !== 'student') {
            fetchPeople();
        } else if (selectedClass && selectedSection) {
            fetchPeople();
        }
    }, [selectedRole, selectedClass, selectedSection]);

    useEffect(() => {
        fetchClasses();
        fetchIdCardDesign();
    }, [selectedRole]);

    useEffect(() => {
        const firstId = selectedIds[0];
        if (firstId) {
            setPreviewPerson(people.find(p => p._id === firstId));
        } else {
            setPreviewPerson(null);
        }
    }, [selectedIds, people]);

    const fetchIdCardDesign = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/client-settings`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const settings = res.data.settings;
            if (settings?.idCard?.[selectedRole]) {
                const roleData = settings.idCard[selectedRole];
                setTemplateUrl(roleData.template || '');
                if (roleData.design) setDesign(prev => ({ ...prev, ...roleData.design }));
                
                const availableFields = FIELDS_BY_ROLE[selectedRole] || [];
                const existing = roleData.fields || [];
                
                const merged = availableFields.map(af => {
                    const e = existing.find(f => f.id === af.id);
                    return {
                        ...af,
                        ...(e || {}),
                        label: af.label, // Force registry label
                        placeholder: af.placeholder,
                        visible: e ? e.visible : false,
                        x: e ? e.x : 20,
                        y: e ? e.y : 20,
                        fontSize: e ? e.fontSize : 14,
                        bold: e ? e.bold : false,
                        color: e ? e.color : '#000000',
                        width: e ? e.width : (af.type === 'image' ? 100 : 200),
                        height: e ? e.height : (af.type === 'image' ? 120 : 24)
                    };
                });
                setConfigFields(merged);
            } else {
                setTemplateUrl("");
                setConfigFields((FIELDS_BY_ROLE[selectedRole] || []).map(af => ({
                    ...af,
                    visible: false,
                    x: 20,
                    y: 20,
                    fontSize: 14,
                    bold: false,
                    color: '#000000',
                    width: af.type === 'image' ? 100 : 200,
                    height: af.type === 'image' ? 120 : 24
                })));
            }
        } catch (err) {
            console.error("Failed to load ID card design");
        }
    };

    const fetchClasses = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/staff-panel/class/get-all-classes`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setClasses(res.data.classes || []);
        } catch (err) { toast.error("Failed to load classes"); }
    };

    const fetchPeople = async () => {
        if (selectedRole === 'student' && (!selectedClass || !selectedSection)) {
            // Wait for class/section if student
            return;
        }
        setLoading(true);
        setPeople([]);
        setSelectedIds([]);
        try {
            let url = "";
            if (selectedRole === 'student') {
                url = `${BASE_URL}/api/staff-panel/student/get-students-by-section?classId=${selectedClass}&sectionId=${selectedSection}`;
            } else {
                url = `${BASE_URL}/api/staff-panel/staff-optimized/all?role=${selectedRole}&limit=1000`;
            }
            const res = await axios.get(url, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = res.data.students || res.data.data || res.data.staff || [];
            setPeople(data);
            if (data.length === 0) {
                toast.error("No records found");
            } else {
                toast.success(`${data.length} records fetched`);
            }
        } catch (err) { toast.error("Failed to fetch records"); }
        finally { setLoading(false); }
    };

    const handleClassChange = async (classId) => {
        setSelectedClass(classId);
        setSelectedSection("");
        setSections([]);
        if (!classId) return;
        try {
            const res = await axios.get(`${BASE_URL}/api/staff-panel/class/get-sections-by-class/${classId}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setSections(res.data.sections || []);
        } catch (err) { toast.error("Failed to load sections"); }
    };

    const handleGenerateAndPreview = async () => {
        if (selectedIds.length === 0) {
            toast.error("Select records first");
            return;
        }

        setGenerating(true);
        try {
            const res = await axios.post(`${BASE_URL}/api/staff-panel/id-card/generate`, {
                role: selectedRole,
                studentIds: selectedRole === 'student' ? selectedIds : [],
                staffIds: selectedRole !== 'student' ? selectedIds : []
            }, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });

            if (res.data.success) {
                setPreviewHtml(res.data.html);
                toast.success("ID Cards Generated!");
            } else { toast.error("Failed to generate cards"); }
        } catch (err) { toast.error("Error generating ID cards"); }
        finally { setGenerating(false); }
    };



    const downloadCards = async (action = 'print') => {
        if (!previewHtml) return;

        if (action === 'download') {
            try {
                Swal.fire({
                    title: 'Generating PDF...',
                    html: 'Please wait while we prepare your high-quality ID cards.',
                    allowOutsideClick: false,
                    didOpen: () => Swal.showLoading()
                });

                // Create a temporary container
                const container = document.createElement('div');
                container.style.position = 'fixed';
                container.style.left = '-9999px';
                container.style.top = '0';
                container.style.width = 'fit-content';
                container.innerHTML = previewHtml;
                document.body.appendChild(container);

                const firstPerson = previewPerson || (selectedIds.length > 0 ? people.find(p => p._id === selectedIds[0]) : null);
                const fileName = firstPerson ? `${firstPerson.firstName}_${firstPerson.lastName}_ID_Cards.pdf` : 'ID_Cards.pdf';

                const canvas = await html2canvas(container, {
                    useCORS: true,
                    scale: 2, // Higher quality
                    backgroundColor: null
                });

                document.body.removeChild(container);

                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({
                    orientation: design.cardWidth > design.cardHeight ? 'landscape' : 'portrait',
                    unit: 'px',
                    format: [canvas.width / 2, canvas.height / 2]
                });

                pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
                pdf.save(fileName);
                
                Swal.close();
                toast.success("PDF Downloaded!");
            } catch (error) {
                console.error("PDF Export Error:", error);
                Swal.fire('Error', 'Failed to generate PDF. Please try again.', 'error');
            }
            return;
        }

        const printWindow = window.open('', '', 'height=800,width=1000');
        printWindow.document.write(`
            <html>
                <head>
                    <title>${selectedRole.toUpperCase()} ID Cards</title>
                    <style>
                        body { margin: 0; padding: 20px; background: #fff; }
                        @media print { 
                            .no-print { display: none; } 
                            body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                        }
                        .id-card-wrapper { 
                            margin: 10px; 
                            display: inline-block; 
                            vertical-align: top; 
                            page-break-inside: avoid; 
                            -webkit-print-color-adjust: exact !important; 
                            print-color-adjust: exact !important; 
                        }
                    </style>
                </head>
                <body>
                    <div id="print-content">${previewHtml}</div>
                    <script>
                        window.onload = () => { window.print(); window.close(); };
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('template', file);
        formData.append('role', selectedRole);
        try {
            Swal.fire({ title: 'Uploading...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
            const res = await axios.post(`${BASE_URL}/api/client-settings/idcard/upload-template`, formData, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setTemplateUrl(res.data.templateUrl);
            Swal.fire('Uploaded!', `${selectedRole.toUpperCase()} template uploaded!`, 'success');
        } catch (err) { Swal.fire('Error', 'Upload failed', 'error'); }
    };

    const handleSaveLayout = async () => {
        setSaving(true);
        try {
            const fieldsToSave = configFields.map(({ placeholder, label, type, ...rest }) => rest);
            await axios.put(`${BASE_URL}/api/client-settings/idcard/config/update`, {
                role: selectedRole,
                template: templateUrl,
                fields: fieldsToSave,
                design: design
            }, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
            toast.success("Layout Saved!");
            fetchIdCardDesign();
        } catch (err) { toast.error("Failed to save layout"); }
        finally { setSaving(false); }
    };

    const handleMouseDown = (e, id) => {
        e.stopPropagation();
        setSelectedField(id);
        setIsDragging(true);
    };

    const handleMouseMove = (e) => {
        if (!isDragging || !selectedField || !mapperRef.current) return;
        const rect = mapperRef.current.getBoundingClientRect();
        let newX = e.clientX - rect.left;
        let newY = e.clientY - rect.top;
        newX = Math.max(0, Math.min(newX, design.cardWidth - 20));
        newY = Math.max(0, Math.min(newY, design.cardHeight - 10));
        setConfigFields(prev => prev.map(f => f.id === selectedField ? { ...f, x: Math.round(newX), y: Math.round(newY) } : f));
    };

    const handleMouseUp = () => setIsDragging(false);

    const getPreviewValue = (field) => {
        const p = previewPerson;
        
        const mapping = {
            student_photo: p?.profileImage || p?.studentPhoto || 'https://placehold.co/120x150?text=PHOTO',
            student_name: p?.name || `${p?.firstName} ${p?.lastName || ''}`.trim() || 'Student Name',
            admission_no: p?.admissionNumber || 'ADM-001',
            roll_no: p?.rollNumber || '01',
            class_section: p?.assignedClass?.className ? `${p.assignedClass.className} - ${p.assignedSection?.sectionName || ''}` : (p?.classId?.className || 'Class-X'),
            dob: p?.dob ? new Date(p.dob).toLocaleDateString() : '01/01/2010',
            blood_group: p?.bloodGroup || 'B+',
            student_phone: p?.mobileNumber || p?.mobile || '9876543210',
            guardian_contact: p?.guardianPhone || p?.fatherMobile || '9876543211',
            emergency_contact: p?.emergencyContact || '9876543212',
            id_no: p?.customId || p?.staffId || p?.admissionNumber || 'ID-001',
            email: p?.email || 'student@school.com',
            address: p?.address || 'School Address Area',
            father_name: p?.fatherName || 'Father Name',
            mother_name: p?.motherName || 'Mother Name',
            
            // Staff/Teacher specific
            staff_photo: p?.profileImage || 'https://placehold.co/120x150?text=PHOTO',
            staff_name: p?.name || (p?.firstName ? `${p.firstName} ${p.lastName || ''}`.trim() : 'Staff Name'),
            employee_id: p?.staffId || p?.customId || 'EMP-001',
            designation: p?.designation || 'Staff',
            department: p?.department || 'General',
            staff_phone: p?.mobile || p?.mobileNo || p?.phone || '9876543210',
            staff_email: p?.email || 'staff@school.com',
            staff_address: p?.address || 'Staff Address Area',
            subject: p?.subjects?.join(', ') || p?.subject || 'N/A',
            qualification: p?.qualification || 'N/A',
            experience: p?.experience ? `${p.experience} Years` : 'N/A',
            is_class_teacher: p?.isClassTeacher ? 'YES' : 'NO',
            assigned_class: p?.assignedClass?.className || 'N/A',
            vehicle_no: p?.vehicleNumber || p?.vehicle?.vehicleNumber || 'N/A',
            route_name: p?.route?.routeName || 'N/A',
            license_no: p?.licenseNumber || 'N/A',
            hostel_name: p?.hostel?.hostelName || 'N/A',

            school_name: p?.branch?.branchName || 'My School Name',
            school_logo: p?.branch?.logo || 'https://placehold.co/50?text=LOGO',
            signature: 'https://placehold.co/100x40?text=SIGNATURE',
            qr_code: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${p?._id || 'VERIFY'}`
        };

        return mapping[field.id] || field.placeholder;
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border shadow-sm">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                        <FaIdCard className="text-blue-600" /> ID Card System
                    </h2>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Generate & Configure Student/Staff ID Cards</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-xl border">
                    <button onClick={() => setViewMode('generate')} className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'generate' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Generate</button>
                    <button onClick={() => setViewMode('config')} className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'config' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Designer</button>
                </div>
            </div>

            {viewMode === 'generate' ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Filters */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-3">Selection Filters</h3>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Select Role</label>
                                    <select 
                                        value={selectedRole} 
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                        className="w-full bg-slate-50 border-slate-200 rounded-xl text-xs font-bold py-3 px-4 focus:ring-blue-500 transition-all"
                                    >
                                        <option value="student">Students</option>
                                        <option value="teacher">Teachers</option>
                                        <option value="driver">Drivers</option>
                                        <option value="staff">Other Staff</option>
                                        <option value="warden">Wardens</option>
                                        <option value="librarian">Librarians</option>
                                    </select>
                                </div>

                                {selectedRole === 'student' && (
                                    <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Class</label>
                                            <select value={selectedClass} onChange={(e) => handleClassChange(e.target.value)} className="w-full bg-slate-50 border-slate-200 rounded-lg text-xs font-bold focus:ring-blue-500">
                                                <option value="">Select Class</option>
                                                {classes.map(c => <option key={c._id} value={c._id}>{c.className}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Section</label>
                                            <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} className="w-full bg-slate-50 border-slate-200 rounded-lg text-xs font-bold focus:ring-blue-500">
                                                <option value="">Select Section</option>
                                                {sections.map(s => <option key={s._id} value={s._id}>{s.sectionName}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 space-y-3">
                                {selectedRole === 'student' && !people.length && (
                                    <button onClick={fetchPeople} disabled={loading} className="w-full py-3 bg-blue-50 text-blue-600 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-100 transition-all border border-blue-100 disabled:opacity-50">
                                        {loading ? <FaSpinner className="animate-spin" /> : <FaSearch />} Fetch Students
                                    </button>
                                )}

                                <button onClick={handleGenerateAndPreview} disabled={generating || selectedIds.length === 0} className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-slate-200 disabled:opacity-50">
                                    {generating ? <FaSpinner className="animate-spin" /> : <FaEye />} Generate {selectedIds.length > 0 ? `(${selectedIds.length})` : ''}
                                </button>
                            </div>
                        </div>

                        {/* List View */}
                        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col h-[400px]">
                            <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedRole.toUpperCase()} List</h3>
                                <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-[9px] font-black">{selectedIds.length} Selected</span>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                {loading ? (
                                    <div className="h-full flex items-center justify-center"><FaSpinner className="animate-spin text-slate-300 text-2xl" /></div>
                                ) : people.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-300">
                                        <FaUsers size={40} className="mb-2" />
                                        <p className="text-[10px] font-black uppercase tracking-widest">No Records Found</p>
                                    </div>
                                ) : people.map(person => (
                                    <div key={person._id} className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${selectedIds.includes(person._id) ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-200' : 'bg-white border-slate-100 hover:border-slate-300'}`} onClick={() => {
                                        setSelectedIds(prev => prev.includes(person._id) ? prev.filter(id => id !== person._id) : [...prev, person._id]);
                                    }}>
                                        <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                                            <img src={person.profileImage || person.studentPhoto || 'https://placehold.co/100'} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[11px] font-black text-slate-800 truncate">{person.name || `${person.firstName} ${person.lastName}`}</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase truncate">{person.admissionNumber || person.staffId || 'No ID'}</p>
                                        </div>
                                        {selectedIds.includes(person._id) && <FaCheck className="text-blue-600" size={10} />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Preview Area */}
                    <div className="lg:col-span-8 flex flex-col bg-white rounded-2xl border shadow-sm overflow-hidden">
                        <div className="p-4 border-b flex items-center justify-between bg-slate-50">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Preview</h3>
                            {previewHtml && (
                                <div className="relative group">
                                    <button className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200">
                                        <FaDownload /> Export Actions <FaChevronDown className="ml-2 group-hover:rotate-180 transition-transform" />
                                    </button>
                                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl border shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                                        <button onClick={() => downloadCards('print')} className="w-full px-4 py-3 text-left text-[10px] font-black text-slate-600 uppercase hover:bg-slate-50 flex items-center gap-3 border-b border-slate-50">
                                            <FaPrint className="text-blue-500" /> Print ID Cards
                                        </button>
                                        <button onClick={() => downloadCards('download')} className="w-full px-4 py-3 text-left text-[10px] font-black text-slate-600 uppercase hover:bg-slate-50 flex items-center gap-3">
                                            <FaDownload className="text-green-500" /> Save as PDF
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 bg-slate-200 p-8 overflow-y-auto flex flex-col items-center">
                            {previewHtml ? (
                                <div className="p-4 bg-white shadow-2xl rounded" dangerouslySetInnerHTML={{ __html: previewHtml }} />
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50 text-center">
                                    <FaIdCard size={80} className="mb-4" />
                                    <p className="text-sm font-black uppercase tracking-[0.2em]">Generate Preview to View ID Cards</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white border rounded-2xl shadow-xl flex flex-col h-[750px] overflow-hidden">
                    {/* Designer Header */}
                    <div className="flex border-b bg-slate-50 items-center px-6 py-3">
                        <div className="flex-1 flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] font-black text-slate-400 uppercase">Role:</span>
                                <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className="bg-transparent border-none text-[10px] font-black text-blue-600 uppercase focus:ring-0 cursor-pointer">
                                    <option value="student">Student</option>
                                    <option value="staff">Staff</option>
                                    <option value="teacher">Teacher</option>
                                    <option value="driver">Driver</option>
                                    <option value="warden">Warden</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <label className="px-4 py-2 bg-slate-800 text-white font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 rounded-lg cursor-pointer">
                                <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                                <FaUpload /> Change Background
                            </label>
                            <button onClick={handleSaveLayout} disabled={saving || !templateUrl} className="px-6 py-2 bg-green-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-green-700 transition-all flex items-center gap-2 rounded-lg shadow-lg shadow-green-200">
                                {saving ? <FaSpinner className="animate-spin" /> : <FaSave />} Save Layout
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 flex overflow-hidden">
                        {/* Field Sidebar */}
                        <div className="w-64 border-r bg-slate-50 flex flex-col">
                            <div className="p-4 border-b bg-white">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Data Attributes</h4>
                            </div>
                            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                                {configFields.map(field => (
                                    <button key={field.id} onClick={() => {
                                        const isVisible = !field.visible;
                                        setConfigFields(prev => prev.map(f => f.id === field.id ? { ...f, visible: isVisible } : f));
                                        if (isVisible) setSelectedField(field.id);
                                        else if (selectedField === field.id) setSelectedField(null);
                                    }} className={`w-full flex items-center justify-between p-3 rounded-xl border font-bold transition-all ${field.visible ? 'bg-blue-600 text-white border-blue-700 shadow-lg' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'}`}>
                                        <span className="truncate text-left flex-1">{field.label}</span>
                                        {field.visible && <FaCheck size={10} />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Designer Canvas */}
                        <div className="flex-1 bg-slate-200 flex items-center justify-center relative p-8">
                            <div ref={mapperRef} className="relative bg-white shadow-2xl overflow-hidden border-4 border-white rounded-sm" style={{ width: `${design.cardWidth}px`, height: `${design.cardHeight}px`, backgroundImage: `url('${templateUrl.startsWith('http') ? templateUrl : BASE_URL + '/' + templateUrl}')`, backgroundSize: '100% 100%' }}>
                                {!templateUrl && (
                                    <div className="absolute inset-0 bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
                                        <FaUpload className="text-slate-200 text-5xl mb-4" />
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Template Loaded</p>
                                    </div>
                                )}
                                {showGrid && templateUrl && <div className="absolute inset-0 pointer-events-none opacity-10" style={{ backgroundImage: 'radial-gradient(#000 0.5px, transparent 0.5px)', backgroundSize: '10px 10px' }} />}
                                {configFields.filter(f => f.visible).map(field => (
                                    <div key={field.id} onMouseDown={(e) => handleMouseDown(e, field.id)} className={`absolute cursor-move select-none ${selectedField === field.id ? 'ring-2 ring-blue-500 bg-blue-50/50 rounded z-10' : ''}`} style={{ top: field.y, left: field.x, color: field.color, fontSize: `${field.fontSize}px`, fontWeight: field.bold ? 'bold' : 'normal', width: field.type === 'image' ? field.width : 'auto', height: field.type === 'image' ? field.height : 'auto' }}>
                                        {field.type === 'image' ? (
                                            <div className="w-full h-full border-2 border-dashed border-slate-400 flex items-center justify-center bg-white/80 overflow-hidden">
                                                <img src={getPreviewValue(field)} className="w-full h-full object-contain pointer-events-none" alt="" />
                                            </div>
                                        ) : <span className="block break-words leading-tight" style={{ width: `${field.width}px` }}>{getPreviewValue(field)}</span>}
                                    </div>
                                ))}
                            </div>

                            {/* Toolbar */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-6 text-[10px] font-black uppercase tracking-widest">
                                <button onClick={() => setShowGrid(!showGrid)} className={`flex items-center gap-2 ${showGrid ? 'text-blue-400' : 'opacity-50'}`}><FaBorderAll /> Grid</button>
                                <span className="opacity-20">|</span>
                                <span>{design.cardWidth} x {design.cardHeight} px</span>
                            </div>

                            {/* Field Properties Panel */}
                            {selectedField && (
                                <div className="absolute top-6 right-6 w-64 bg-white rounded-2xl border shadow-2xl p-4 space-y-4">
                                    <div className="flex items-center justify-between border-b pb-2">
                                        <h4 className="text-[10px] font-black text-slate-800 uppercase">Field Styling</h4>
                                        <button onClick={() => setSelectedField(null)}><FaTimes className="text-slate-400" /></button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase">Font Size</label>
                                            <input type="number" value={configFields.find(f => f.id === selectedField)?.fontSize} onChange={(e) => setConfigFields(prev => prev.map(f => f.id === selectedField ? { ...f, fontSize: parseInt(e.target.value) } : f))} className="w-full p-2 bg-slate-50 border rounded-lg text-xs font-bold" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase">Color</label>
                                            <input type="color" value={configFields.find(f => f.id === selectedField)?.color} onChange={(e) => setConfigFields(prev => prev.map(f => f.id === selectedField ? { ...f, color: e.target.value } : f))} className="w-full h-8 p-0 border-none bg-transparent" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => setConfigFields(prev => prev.map(f => f.id === selectedField ? { ...f, bold: !f.bold } : f))} className={`flex-1 py-2 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all ${configFields.find(f => f.id === selectedField)?.bold ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400'}`}>Bold</button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase">Width</label>
                                            <input type="number" value={configFields.find(f => f.id === selectedField)?.width} onChange={(e) => setConfigFields(prev => prev.map(f => f.id === selectedField ? { ...f, width: parseInt(e.target.value) } : f))} className="w-full p-2 bg-slate-50 border rounded-lg text-xs font-bold" />
                                        </div>
                                        {configFields.find(f => f.id === selectedField)?.type === 'image' && (
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black text-slate-400 uppercase">Height</label>
                                                <input type="number" value={configFields.find(f => f.id === selectedField)?.height} onChange={(e) => setConfigFields(prev => prev.map(f => f.id === selectedField ? { ...f, height: parseInt(e.target.value) } : f))} className="w-full p-2 bg-slate-50 border rounded-lg text-xs font-bold" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
