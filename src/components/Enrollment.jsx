import React, { useState, useEffect } from 'react';
import { MdPeople, MdClass, MdSchool } from 'react-icons/md';
import { studentAPI, dashboardAPI, classAPI } from '../utils/apiService';
import { FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Enrollment = () => {
  const [loading, setLoading] = useState(true);
  const [enrollmentList, setEnrollmentList] = useState([]);
  const [stats, setStats] = useState({
    totalEnrolled: 0,
    activeClasses: 0,
    pendingEnrollment: 0
  });
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [enrollData, setEnrollData] = useState({
    admissionNumber: '',
    rollNumber: '',
    classId: '',
    sectionId: ''
  });

  useEffect(() => {
    fetchEnrollmentData();
  }, []);

  const fetchEnrollmentData = async () => {
    try {
      setLoading(true);
      const [listRes, statsRes, classRes] = await Promise.all([
        studentAPI.getEnrollmentList(),
        dashboardAPI.getStats(),
        classAPI.getAll()
      ]);
      
      const students = listRes.data.students || listRes.data;
      setEnrollmentList(Array.isArray(students) ? students : []);
      setClasses(classRes.data?.classes || []);
      
      if (statsRes.data) {
        setStats({
          totalEnrolled: statsRes.data.stats.totalStudents || 0,
          activeClasses: classRes.data?.classes?.length || 0,
          pendingEnrollment: statsRes.data.stats.newAdmissions || 0
        });
      }
    } catch (err) {
      console.error('Enrollment fetch failure:', err);
      toast.error('Institutional enrollment registry inaccessible');
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollClick = (student) => {
    setSelectedStudent(student);
    const initialClassId = student.class?._id || '';
    setEnrollData({
      admissionNumber: student.admissionNumber || `STU-${Math.floor(Math.random() * 9000) + 1000}`,
      rollNumber: student.rollNumber || '',
      classId: initialClassId,
      sectionId: student.section?._id || ''
    });

    // Initialize sections for pre-selected class
    if (initialClassId) {
      const selectedClass = classes.find(c => c._id === initialClassId);
      setSections(selectedClass?.sections || []);
    } else {
      setSections([]);
    }

    setShowEnrollModal(true);
  };

  // Update sections when class selection changes in modal
  const handleClassChange = (classId) => {
    const selectedClass = classes.find(c => c._id === classId);
    setEnrollData({ ...enrollData, classId: classId, sectionId: '' }); // Clear section on class change
    setSections(selectedClass?.sections || []);
  };

  const handleEnrollSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await studentAPI.enroll(selectedStudent._id, {
        admissionNumber: enrollData.admissionNumber,
        rollNumber: enrollData.rollNumber,
        class: enrollData.classId,
        section: enrollData.sectionId
      });
      toast.success('ENROLLMENT SUCCESSFUL: Student manifested in academic matrix! 🎯');
      setShowEnrollModal(false);
      fetchEnrollmentData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Enrollment protocol failure');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      {loading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <FaSpinner className="animate-spin text-blue-500 text-5xl" />
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <MdPeople size={120} />
        </div>
        <div className="relative z-10">
          <h2 className="text-4xl font-black mb-2 tracking-tight">Enrollment Terminal</h2>
          <p className="text-blue-200 text-lg font-medium">Finalize student enrollment and assign academic units within the institutional matrix</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <MdPeople size={24} />
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">REGISTRY</span>
          </div>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Headcount</h3>
          <p className="text-3xl font-black text-slate-800 mt-1">{stats.totalEnrolled.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
              <MdClass size={24} />
            </div>
            <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-lg">MATRICES</span>
          </div>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Academic Units</h3>
          <p className="text-3xl font-black text-slate-800 mt-1">{stats.activeClasses}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 rounded-xl text-orange-600">
              <FaSpinner size={24} className="animate-spin-slow" />
            </div>
            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg">PENDING</span>
          </div>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Awaiting Finalize</h3>
          <p className="text-3xl font-black text-slate-800 mt-1">{stats.pendingEnrollment}</p>
        </div>
      </div>

      {/* Enrollment Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="text-xl font-black text-slate-800">Enrollment Registry</h3>
          <span className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">Operational Manifest</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Enrollment ID</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Nomenclature</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Academic Matrix</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status Hub</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions Terminal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {enrollmentList.length > 0 ? enrollmentList.map(student => (
                <tr key={student._id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4 text-xs font-black text-blue-900 tabular-nums">
                    {student.rollNumber || student.admissionNumber || student._id.slice(-6).toUpperCase()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-800">{`${student.firstName || ''} ${student.lastName || ''}`.trim() || student.name || 'UNNAMED'}</div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{student.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-slate-100 rounded text-[9px] font-black text-slate-600 border border-slate-200">{student.class?.className || 'UNASSIGNED'}</span>
                      <span className="px-2 py-1 bg-blue-50 rounded text-[9px] font-black text-blue-600 border border-blue-100">{student.section?.sectionName || 'GENERAL'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      student.applicationStatus === 'enrolled' ? 'bg-emerald-50 text-emerald-700' : 
                      student.applicationStatus === 'rejected' ? 'bg-rose-50 text-rose-700' :
                      'bg-orange-50 text-orange-700'
                    }`}>
                      {student.applicationStatus || 'pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                      {student.applicationStatus !== 'enrolled' && student.applicationStatus !== 'rejected' && (
                        <button 
                          onClick={() => handleEnrollClick(student)}
                          className="px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-slate-200 flex items-center gap-2"
                        >
                          <MdSchool size={16} />
                          Finalize
                        </button>
                      )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-24 text-center opacity-30 flex flex-col items-center gap-4">
                    <MdPeople size={64} className="text-slate-200" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">Institutional clearance registry empty</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Finalize Enrollment Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-10 max-w-xl w-full shadow-2xl border border-blue-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50 rounded-full -mr-24 -mt-24 opacity-50" />
            
            <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
              <MdSchool className="text-blue-600" size={32} /> Finalize Enrollment
            </h3>

            <form onSubmit={handleEnrollSubmit} className="space-y-6 relative z-10">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Institutional ID / Admission No</label>
                  <input
                    type="text"
                    required
                    value={enrollData.admissionNumber}
                    onChange={(e) => setEnrollData({...enrollData, admissionNumber: e.target.value})}
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Roll Number Portfolio</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., 101"
                    value={enrollData.rollNumber}
                    onChange={(e) => setEnrollData({...enrollData, rollNumber: e.target.value})}
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Academic Matrix (Class)</label>
                  <select
                    required
                    value={enrollData.classId}
                    onChange={(e) => handleClassChange(e.target.value)}
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-800 appearance-none"
                  >
                    <option value="">Select Class</option>
                    {classes.map(c => <option key={c._id} value={c._id}>{c.className}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Academic Unit (Section)</label>
                  <select
                    required
                    value={enrollData.sectionId}
                    onChange={(e) => setEnrollData({...enrollData, sectionId: e.target.value})}
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-800 appearance-none"
                  >
                    <option value="">Select Section</option>
                    {sections.map(s => <option key={s._id} value={s._id}>{s.sectionName}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEnrollModal(false)}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-200 transition-all"
                >
                  Cancel Manifest
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-slate-200"
                >
                  Finalize Enrollment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Enrollment;