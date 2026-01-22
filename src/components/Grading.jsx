import React, { useState } from 'react';
import { MdAdd, MdEdit, MdDelete, MdSave, MdCancel } from 'react-icons/md';
import Swal from 'sweetalert2';

const Grading = () => {
  const [gradingSchemes, setGradingSchemes] = useState([
    {
      id: 1,
      name: 'Standard Grading',
      isDefault: true,
      grades: [
        { grade: 'A+', minMarks: 90, maxMarks: 100, gpa: 4.0, description: 'Outstanding' },
        { grade: 'A', minMarks: 80, maxMarks: 89, gpa: 3.7, description: 'Excellent' },
        { grade: 'B+', minMarks: 70, maxMarks: 79, gpa: 3.3, description: 'Very Good' },
        { grade: 'B', minMarks: 60, maxMarks: 69, gpa: 3.0, description: 'Good' },
        { grade: 'C+', minMarks: 50, maxMarks: 59, gpa: 2.3, description: 'Satisfactory' },
        { grade: 'C', minMarks: 40, maxMarks: 49, gpa: 2.0, description: 'Pass' },
        { grade: 'F', minMarks: 0, maxMarks: 39, gpa: 0.0, description: 'Fail' }
      ]
    }
  ]);

  const [selectedScheme, setSelectedScheme] = useState(gradingSchemes[0]);
  const [showAddScheme, setShowAddScheme] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);
  const [newScheme, setNewScheme] = useState({ name: '', grades: [] });

  const handleAddGrade = () => {
    const newGrade = {
      grade: '',
      minMarks: 0,
      maxMarks: 0,
      gpa: 0.0,
      description: ''
    };
    setSelectedScheme({
      ...selectedScheme,
      grades: [...selectedScheme.grades, newGrade]
    });
    setEditingGrade(selectedScheme.grades.length);
  };

  const handleEditGrade = (index) => {
    setEditingGrade(index);
  };

  const handleSaveGrade = (index, gradeData) => {
    const updatedGrades = [...selectedScheme.grades];
    updatedGrades[index] = gradeData;
    setSelectedScheme({
      ...selectedScheme,
      grades: updatedGrades
    });
    setEditingGrade(null);
  };

  const handleDeleteGrade = (index) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedGrades = selectedScheme.grades.filter((_, i) => i !== index);
        setSelectedScheme({
          ...selectedScheme,
          grades: updatedGrades
        });
        Swal.fire('Deleted!', 'Grade has been deleted.', 'success');
      }
    });
  };

  const handleSaveScheme = () => {
    setGradingSchemes(gradingSchemes.map(scheme => 
      scheme.id === selectedScheme.id ? selectedScheme : scheme
    ));
    Swal.fire('Success!', 'Grading scheme saved successfully!', 'success');
  };

  const GradeRow = ({ grade, index, isEditing }) => {
    const [editData, setEditData] = useState(grade);

    if (isEditing) {
      return (
        <tr className="bg-blue-50">
          <td className="px-6 py-4">
            <input
              type="text"
              value={editData.grade}
              onChange={(e) => setEditData({...editData, grade: e.target.value})}
              className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Grade"
            />
          </td>
          <td className="px-6 py-4">
            <input
              type="number"
              value={editData.minMarks}
              onChange={(e) => setEditData({...editData, minMarks: parseInt(e.target.value)})}
              className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              max="100"
            />
          </td>
          <td className="px-6 py-4">
            <input
              type="number"
              value={editData.maxMarks}
              onChange={(e) => setEditData({...editData, maxMarks: parseInt(e.target.value)})}
              className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              max="100"
            />
          </td>
          <td className="px-6 py-4">
            <input
              type="number"
              step="0.1"
              value={editData.gpa}
              onChange={(e) => setEditData({...editData, gpa: parseFloat(e.target.value)})}
              className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              max="4"
            />
          </td>
          <td className="px-6 py-4">
            <input
              type="text"
              value={editData.description}
              onChange={(e) => setEditData({...editData, description: e.target.value})}
              className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Description"
            />
          </td>
          <td className="px-6 py-4">
            <div className="flex space-x-2">
              <button
                onClick={() => handleSaveGrade(index, editData)}
                className="text-green-600 hover:text-green-800 p-1"
              >
                <MdSave />
              </button>
              <button
                onClick={() => setEditingGrade(null)}
                className="text-gray-600 hover:text-gray-800 p-1"
              >
                <MdCancel />
              </button>
            </div>
          </td>
        </tr>
      );
    }

    return (
      <tr className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="inline-flex px-2 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
            {grade.grade}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{grade.minMarks}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{grade.maxMarks}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{grade.gpa}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{grade.description}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <div className="flex space-x-2">
            <button
              onClick={() => handleEditGrade(index)}
              className="text-blue-600 hover:text-blue-900 p-1"
            >
              <MdEdit />
            </button>
            <button
              onClick={() => handleDeleteGrade(index)}
              className="text-red-600 hover:text-red-900 p-1"
            >
              <MdDelete />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Grading System</h3>
          <p className="text-gray-600">Configure grading schemes and criteria</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleSaveScheme}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
          >
            <MdSave />
            <span>Save Changes</span>
          </button>
          <button
            onClick={() => setShowAddScheme(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
          >
            <MdAdd />
            <span>New Scheme</span>
          </button>
        </div>
      </div>

      {/* Scheme Selector */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900">Current Grading Scheme</h4>
          {selectedScheme.isDefault && (
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
              Default
            </span>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedScheme.id}
            onChange={(e) => setSelectedScheme(gradingSchemes.find(s => s.id === parseInt(e.target.value)))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {gradingSchemes.map(scheme => (
              <option key={scheme.id} value={scheme.id}>{scheme.name}</option>
            ))}
          </select>
          <span className="text-sm text-gray-600">
            {selectedScheme.grades.length} grade levels configured
          </span>
        </div>
      </div>

      {/* Grading Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h4 className="text-lg font-semibold text-gray-900">Grade Configuration</h4>
          <button
            onClick={handleAddGrade}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
          >
            <MdAdd />
            <span>Add Grade</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Marks</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Marks</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GPA</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {selectedScheme.grades.map((grade, index) => (
                <GradeRow
                  key={index}
                  grade={grade}
                  index={index}
                  isEditing={editingGrade === index}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grade Distribution Chart */}
      {/* <div className="bg-white rounded-lg shadow p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Grade Distribution Preview</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {selectedScheme.grades.map((grade, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">{grade.grade}</div>
              <div className="text-sm text-gray-600 mb-1">{grade.minMarks}-{grade.maxMarks}%</div>
              <div className="text-xs text-gray-500">GPA: {grade.gpa}</div>
            </div>
          ))}
        </div>
      </div> */}

      {/* Grading Guidelines */}
      {/* <div className="bg-white rounded-lg shadow p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Grading Guidelines</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Grade Calculation Rules</h5>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Grades are calculated based on percentage marks</li>
              <li>• GPA is calculated on a 4.0 scale</li>
              <li>• Minimum passing grade is typically 40%</li>
              <li>• Grade boundaries should not overlap</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Best Practices</h5>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Ensure grade ranges cover 0-100%</li>
              <li>• Use consistent grade naming conventions</li>
              <li>• Review and update schemes annually</li>
              <li>• Consider subject-specific requirements</li>
            </ul>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Grading;