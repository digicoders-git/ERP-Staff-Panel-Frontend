import { useState } from "react";
import jsPDF from 'jspdf';
import domtoimage from 'dom-to-image';

export default function IdCardExactLayout() {
  const [data, setData] = useState({
    schoolName: "",
    schollNumber: "",
    addressBottom: "",
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
          <h2 className="text-lg sm:text-xl font-bold mb-4">ID Card Form</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input name="name" onChange={handleChange} placeholder="Student Name" className="input col-span-2" />
            <input name="father" onChange={handleChange} placeholder="Father's Name" className="input col-span-2" />
            <input name="className" onChange={handleChange} placeholder="Class" className="input" />
            <input name="dob" type="date" onChange={handleChange} placeholder="Date of Birth" className="input" />
            <input type="number" name="contact" onChange={handleChange} placeholder="Contact No" className="input col-span-2" />
            <input name="address" onChange={handleChange} placeholder="Address" className="input col-span-2" />

            <div className="col-span-2">
              <label className="text-sm font-medium mb-1 block">School Logo</label>
              <input type="file" name="logo" onChange={handleFile} className="w-full" />
            </div>

            <input name="schoolName" onChange={handleChange} placeholder="schoolName" className="input col-span-2" />
            <input type="number" name="schollNumber" onChange={handleChange} placeholder="schollNumber" className="input col-span-2" />
            <input name="addressBottom" onChange={handleChange} placeholder="addressBottom" className="input col-span-2" />



            <div className="col-span-2">
              <label className="text-sm font-medium mb-1 block">Student Photo</label>
              <input type="file" name="photo" onChange={handleFile} className="w-full" />
            </div>

            <div className="col-span-2">
              <label className="text-sm font-medium mb-1 block">Principal Signature</label>
              <input type="file" name="sign" onChange={handleFile} className="w-full" />
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
