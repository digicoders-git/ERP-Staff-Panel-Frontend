import React, { useState } from 'react';
import { MdSearch, MdSave, MdEdit, MdVisibility } from 'react-icons/md';

const ManageMarks = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [students, setStudents] = useState([
    {
      id: 1,
      rollNo: '001',
      name: 'John Doe',
      marks: {
        'Mid Term': { Mathematics: 85, Science: 78, English: 92 },
        'Final Exam': { Mathematics: 88, Science: 82, English: 90 }
      }
    },
    {
      id: 2,
      rollNo: '002',
      name: 'Jane Smith',
      marks: {
        'Mid Term': { Mathematics: 92, Science: 85, English: 88 },
        'Final Exam': { Mathematics: 90, Science: 87, English: 85 }
      }
    },
    {
      id: 3,
      rollNo: '003',
      name: 'Mike Johnson',
      marks: {
        'Mid Term': { Mathematics: 78, Science: 80, English: 75 },
        'Final Exam': { Mathematics: 82, Science: 78, English: 80 }
      }
    }
  ]);

  const [editingMarks, setEditingMarks] = useState({});
  const [showResults, setShowResults] = useState(false);

  const classes = ['9th Grade', '10th Grade', '11th Grade', '12th Grade'];
  const subjects = ['Mathematics', 'Science', 'English', 'History', 'Geography'];
  const exams = ['Mid Term', 'Final Exam', 'Unit Test 1', 'Unit Test 2'];

  const handleSearch = () => {
    if (selectedClass && selectedSubject && selectedExam) {
      setShowResults(true);
      // Initialize editing marks
      const initialMarks = {};
      students.forEach(student => {
        const currentMark = student.marks[selectedExam]?.[selectedSubject] || '';
        initialMarks[student.id] = currentMark;
      });
      setEditingMarks(initialMarks);
    }
  };

  const handleMarkChange = (studentId, mark) => {
    setEditingMarks({
      ...editingMarks,
      [studentId]: mark
    });
  };

  const handleSaveMarks = () => {
    setStudents(students.map(student => ({
      ...student,
      marks: {
        ...student.marks,
        [selectedExam]: {
          ...student.marks[selectedExam],
          [selectedSubject]: editingMarks[student.id] || 0
        }
      }
    })));
    alert('Marks saved successfully!');
  };

  const getGrade = (marks) => {
    if (marks >= 90) return { grade: 'A+', color: 'text-green-600' };
    if (marks >= 80) return { grade: 'A', color: 'text-green-500' };
    if (marks >= 70) return { grade: 'B+', color: 'text-blue-600' };
    if (marks >= 60) return { grade: 'B', color: 'text-blue-500' };
    if (marks >= 50) return { grade: 'C', color: 'text-yellow-600' };
    if (marks >= 40) return { grade: 'D', color: 'text-orange-600' };
    return { grade: 'F', color: 'text-red-600' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-gray-900">Manage Marks</h3>
        <p className="text-gray-600">Enter and manage student examination marks</p>
      </div>

      {/* Search Filters */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Select Exam Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Class</option>
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Subject</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Exam</label>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Exam</option>
              {exams.map(exam => (
                <option key={exam} value={exam}>{exam}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSearch}
              disabled={!selectedClass || !selectedSubject || !selectedExam}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md flex items-center justify-center space-x-2 transition-colors duration-200"
            >
              <MdSearch />
              <span>Search</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Table */}
      {showResults && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">
                {selectedExam} - {selectedSubject} ({selectedClass})
              </h4>
              <p className="text-sm text-gray-600">Enter marks out of 100</p>
            </div>
            <button
              onClick={handleSaveMarks}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors duration-200"
            >
              <MdSave />
              <span>Save All Marks</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks (out of 100)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => {
                  const currentMark = editingMarks[student.id] || '';
                  const gradeInfo = currentMark ? getGrade(parseInt(currentMark)) : { grade: '-', color: 'text-gray-400' };
                  
                  return (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {student.rollNo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={currentMark}
                          onChange={(e) => handleMarkChange(student.id, e.target.value)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-semibold ${gradeInfo.color}`}>
                          {gradeInfo.grade}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          currentMark >= 40 
                            ? 'bg-green-100 text-green-800' 
                            : currentMark && currentMark < 40
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {currentMark >= 40 ? 'Pass' : currentMark && currentMark < 40 ? 'Fail' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Statistics */}
      {showResults && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-blue-600">
              {students.filter(s => editingMarks[s.id] && editingMarks[s.id] >= 40).length}
            </div>
            <div className="text-sm text-gray-600">Students Passed</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-red-600">
              {students.filter(s => editingMarks[s.id] && editingMarks[s.id] < 40).length}
            </div>
            <div className="text-sm text-gray-600">Students Failed</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-green-600">
              {Object.values(editingMarks).filter(mark => mark).length > 0 
                ? Math.round(Object.values(editingMarks).filter(mark => mark).reduce((a, b) => parseInt(a) + parseInt(b), 0) / Object.values(editingMarks).filter(mark => mark).length)
                : 0}
            </div>
            <div className="text-sm text-gray-600">Class Average</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-purple-600">
              {Math.max(...Object.values(editingMarks).filter(mark => mark).map(mark => parseInt(mark))) || 0}
            </div>
            <div className="text-sm text-gray-600">Highest Score</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMarks;