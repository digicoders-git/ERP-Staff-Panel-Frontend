import { useState } from "react";
import jsPDF from 'jspdf';
import domtoimage from 'dom-to-image';
import { admissionAPI } from '../utils/apiService';
import { BASE_URL } from '../utils/api';
import { toast } from 'react-toastify';
import { MdSearch, MdPerson, MdCheckCircle } from 'react-icons/md';
import { FaSpinner } from 'react-icons/fa';

export default function IdCardExactLayout() {
  const [searchId, setSearchId] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [data, setData] = useState({
    schoolName: "INSTITUTIONAL ACADEMY",
    schollNumber: "CBSE-83492",
    addressBottom: "Campus Hub, City Center, Sector 4",
    name: "",
    father: "",
    className: "",
    dob: "",
    address: "",
    contact: "",
    logo: null,
    photo: null,
    sign: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchId(value);
    
    if (value.length > 2) {
      try {
        setSearchLoading(true);
        const res = await admissionAPI.getAll({ search: value, limit: 5 });
        const students = res.data.students || res.data;
        setSearchResults(Array.isArray(students) ? students : []);
        setShowDropdown(true);
      } catch (err) {
        console.error("Search protocol failure:", err);
      } finally {
        setSearchLoading(false);
      }
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  const selectStudent = (student) => {
    // Robust URL Resolution Protocol with Path Extraction
    let studentPhoto = null;
    if (student.profileImage) {
      if (student.profileImage.startsWith('http')) {
        studentPhoto = student.profileImage;
      } else {
        // Handle absolute local paths by extracting everything from 'uploads' onwards
        let cleanPath = student.profileImage.replace(/\\/g, '/');
        const uploadsIndex = cleanPath.toLowerCase().indexOf('uploads/');
        if (uploadsIndex !== -1) {
          cleanPath = cleanPath.slice(uploadsIndex);
        }
        studentPhoto = `${BASE_URL}/${cleanPath.startsWith('/') ? cleanPath.slice(1) : cleanPath}`;
      }
    }

    setData({
      ...data,
      name: `${student.firstName} ${student.lastName}`.trim(),
      father: student.guardianInfo?.fatherName || "",
      className: `${student.class?.className || ''} ${student.stream ? `(${student.stream})` : ''}`.trim(),
      dob: student.dob ? student.dob.split('T')[0] : "",
      address: student.permanentAddress?.address || student.permanentAddress?.city || "",
      contact: student.phone || student.mobile || "",
      photo: studentPhoto
    });
    
    setShowDropdown(false);
    setSearchId(`${student.admissionNumber} - ${student.firstName} ${student.lastName}`);
    toast.success("IDENTITY MANIFEST SYNCHRONIZED! 🎯");
  };

  const handleSearch = async () => {
    if (!searchId) {
      toast.warning("PLEASE ENTER STUDENT ID SCANNER CODE");
      return;
    }
    // For the direct button click, we use the already fetched results if any, 
    // or perform a fresh search if no results or multiple results exist.
    if (searchResults.length === 1) {
      selectStudent(searchResults[0]);
    } else {
      // Fallback search
      try {
        setSearchLoading(true);
        const res = await admissionAPI.getAll({ search: searchId, limit: 1 });
        const students = res.data.students || res.data;
        if (students && students.length > 0) {
          selectStudent(students[0]);
        } else {
          toast.error("IDENTITY NOT FOUND IN INSTITUTIONAL MATRIX");
        }
      } catch (err) {
        toast.error("REGISTRY ACCESS DENIED");
      } finally {
        setSearchLoading(false);
      }
    }
  };

  const handleFile = (e) => {
    const { name, files } = e.target;
    setData({ ...data, [name]: URL.createObjectURL(files[0]) });
  };

  const handlePrint = () => window.print();

  const handleDownloadPDF = async () => {
    const element = document.querySelector('.print-card');
    
    try {
      // Convert DOM element to image
      const dataUrl = await domtoimage.toPng(element, {
        quality: 1,
        bgcolor: '#ffffff',
        width: element.offsetWidth * 2,
        height: element.offsetHeight * 2,
        style: {
          transform: 'scale(2)',
          transformOrigin: 'top left'
        }
      });
      
      // Create PDF with ID card dimensions
      const pdf = new jsPDF({
        orientation: element.offsetWidth > element.offsetHeight ? 'landscape' : 'portrait',
        unit: 'px',
        format: [element.offsetWidth, element.offsetHeight]
      });
      
      // Add image to PDF
      pdf.addImage(dataUrl, 'PNG', 0, 0, element.offsetWidth, element.offsetHeight);
      
      // Save PDF
      pdf.save(`${data.name || 'student'}_id_card.pdf`);
      
    } catch (error) {
      console.error('PDF generation failed:', error);
      // Fallback to print dialog
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="grid md:grid-cols-2 gap-6">

        {/* FORM */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow order-2 lg:order-1">
          <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
            <MdPerson className="text-blue-600" /> ID Card Control Panel
          </h2>
          
          {/* SEARCH MANIFOLD */}
          <div className="mb-8 p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <label className="block text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">Institutional Identity Search</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  value={searchId}
                  onChange={handleSearchChange}
                  onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                  placeholder="SEARCH BY ID, NAME, OR MOBILE..." 
                  className="w-full pl-10 pr-4 py-3 bg-white border-2 border-transparent rounded-xl focus:border-blue-500 outline-none text-xs font-bold tracking-widest transition-all"
                />
                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                
                {/* SEARCH RESULTS DROPDOWN */}
                {showDropdown && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 z-[100] max-h-60 overflow-y-auto divide-y divide-slate-50">
                    {searchResults.map((student) => (
                      <div 
                        key={student._id}
                        onClick={() => selectStudent(student)}
                        className="p-4 hover:bg-blue-50 cursor-pointer transition-colors flex items-center gap-4 group"
                      >
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-white group-hover:border-blue-200">
                          {student.profileImage ? (
                            <img 
                              src={student.profileImage.startsWith('http') 
                                ? student.profileImage 
                                : (() => {
                                    let cp = student.profileImage.replace(/\\/g, '/');
                                    const ui = cp.toLowerCase().indexOf('uploads/');
                                    if (ui !== -1) cp = cp.slice(ui);
                                    return `${BASE_URL}/${cp.startsWith('/') ? cp.slice(1) : cp}`;
                                  })()} 
                              className="w-full h-full object-cover" 
                              alt="Result"
                            />
                          ) : (
                            <MdPerson className="text-slate-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{student.firstName} {student.lastName}</p>
                          <p className="text-[8px] font-bold text-blue-600 flex gap-2">
                            <span>{student.admissionNumber}</span>
                            <span className="text-slate-300">|</span>
                            <span>{student.phone}</span>
                            <span className="text-slate-300">|</span>
                            <span>{student.class?.className || 'N/A'}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button 
                onClick={handleSearch}
                disabled={searchLoading}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center gap-2 disabled:opacity-50"
              >
                {searchLoading ? <FaSpinner className="animate-spin" /> : <MdCheckCircle />}
                <span className="text-[10px] font-black uppercase tracking-widest">SYNCHRONIZE</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Student Nomenclature</label>
              <input name="name" value={data.name} onChange={handleChange} placeholder="FULL NAME" className="input w-full" />
            </div>
            <div className="col-span-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Guardian Protocol (Father)</label>
              <input name="father" value={data.father} onChange={handleChange} placeholder="FATHER'S NAME" className="input w-full" />
            </div>
            <div>
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Academic Matrix (Class)</label>
              <input name="className" value={data.className} onChange={handleChange} placeholder="CLASS / STREAM" className="input w-full" />
            </div>
            <div>
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Chronological Origin (DOB)</label>
              <input name="dob" value={data.dob} type="date" onChange={handleChange} className="input w-full" />
            </div>
            <div className="col-span-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Hotline (Contact)</label>
              <input name="contact" value={data.contact} onChange={handleChange} placeholder="CONTACT NO" className="input w-full" />
            </div>
            <div className="col-span-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Spatial Residue (Address)</label>
              <input name="address" value={data.address} onChange={handleChange} placeholder="ADDRESS / CITY" className="input w-full" />
            </div>

            <div className="col-span-2 pt-4 border-t border-slate-100 mt-2">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Institutional Configuration</h4>
            </div>

            <div className="col-span-2">
              <label className="text-sm font-medium mb-1 block">School Logo</label>
              <input type="file" name="logo" onChange={handleFile} className="w-full text-xs" />
            </div>

            <div className="col-span-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">School Name</label>
              <input name="schoolName" value={data.schoolName} onChange={handleChange} placeholder="SCHOOL NAME" className="input w-full" />
            </div>
            <div>
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Registry Code</label>
              <input name="schollNumber" value={data.schollNumber} onChange={handleChange} placeholder="SCHOLL NUMBER" className="input w-full" />
            </div>
            <div className="col-span-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Footer Legend</label>
              <input name="addressBottom" value={data.addressBottom} onChange={handleChange} placeholder="FOOTER ADDRESS" className="input w-full" />
            </div>

            <div className="col-span-1 pt-4">
              <label className="text-sm font-medium mb-1 block">Student Photo</label>
              <input type="file" name="photo" onChange={handleFile} className="w-full text-xs" />
            </div>

            <div className="col-span-1 pt-4">
              <label className="text-sm font-medium mb-1 block">Principal Sign</label>
              <input type="file" name="sign" onChange={handleFile} className="w-full text-xs" />
            </div>
          </div>
        </div>
        {/* ID CARD */}
        <div className="flex justify-center items-start order-1 lg:order-2">
          <div className="w-full max-w-[280px] sm:max-w-[360px] aspect-[2/3] bg-white border shadow print-card relative mx-auto">

            {/* HEADER */}
            <div className="bg-blue-600 w-full h-5">

              <h1 className="text-sm text-white float-right mr-3 tracking-wide">{data.schollNumber}</h1>

            </div>

            <div className="text-blue-500 p-3 mt-2 h-[50px] flex items-center">
              <div className="w-12 h-12 flex-shrink-0">
                {data.logo && <img src={data.logo} className="h-12 w-12 rounded-full bg-white object-cover" />}
              </div>
              <div className="flex-1 text-center">
                <h1 className="text-xl font-extrabold tracking-wide">{data.schoolName}</h1>
              </div>
            </div>


            {/* PHOTO SECTION */}
            <div className="relative h-56 isolate overflow- ">

              {/* Blue polygon background (LOW LAYER) */}
              <div className="absolute inset-0 bg-blue-700 clip-diagonal z-0">

                {/* <div className="absolute bottom-0 w-full h-6 bg-red-400 clip-line2 z-10"></div> */}
              </div>
              <div className="absolute bottom-3 sm:bottom-6 -right-1 rotate-[-9deg] w-[50%] sm:w-[101.9%] h-0.5 sm:h-2 bg-yellow-400 z-10"></div>

              

              {/* Yellow attached diagonal line */}

              {/* CONTENT (ABOVE POLYGON) */}
              <div className="relative z-20 flex flex-col justify-center h-full">

                <div className="text-white text-center py-2 font-bold">
                  STUDENT ID CARD
                </div>

                {/* PHOTO FRAME – ALWAYS ABOVE LINE */}
                <div className="w-32 h-40 mx-auto border-2 border-yellow-400 rounded-lg bg-white relative z-30 -mb-8">
                  {data.photo && (
                    <img
                      src={data.photo}
                      className="w-full h-full object-cover rounded-md"
                      alt="student"
                    />
                  )}
                </div>

              </div>
            </div>



            {/* DETAILS */}
            <div className="px-6 mt-4 text-sm space-y-1">
              <p className="flex gap-3">Name : <span className="text-md"> {data.name}</span></p>
              <p className="flex gap-3">Father's Name : <span className="text-md"> {data.father}</span></p>
              <p className="flex gap-3">Class : <span className="text-md"> {data.className}</span></p>
              <p className="flex gap-3">Date of Birth : <span className="text-md"> {data.dob}</span></p>
              <p className="flex gap-3">Address : <span className="text-md"> {data.address}</span></p>
              <p className="flex gap-3">Contact No. : <span className="text-md">{data.contact}</span></p>
            </div>

            {/* SIGN */}
            <div className="absolute bottom-10 right-6 text-center">
              {data.sign && <img src={data.sign} className="h-8 mx-auto" />}
              <p className="text-xs font-bold">Principal</p>
            </div>

            {/* FOOTER */}
            <div className="absolute bottom-[7px] left-0 w-full h-8 bg-yellow-400 "></div>

            <div className="absolute bottom-0 w-full bg-blue-700 h-[32px] text-white text-center p-2 text-xs font-semibold">
              {data.addressBottom}
            </div>
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex justify-center gap-4 mt-6">
        <button onClick={handleDownloadPDF} className="px-6 py-2 cursor-pointer bg-green-600 text-white rounded-xl shadow hover:bg-green-700">Download PDF</button>
        <button onClick={handlePrint} className="px-6 py-2 bg-blue-600 cursor-pointer text-white rounded-xl shadow hover:bg-blue-700">Print ID Card</button>
      </div>

      <style>{`
        .input {
          border: 1px solid #ddd;
          padding: 8px;
          border-radius: 6px;
        }
        @media print {
          body * { visibility: hidden; }
          .print-card, .print-card * { visibility: visible; }
        }
      `}</style>
    </div>
  );
}
