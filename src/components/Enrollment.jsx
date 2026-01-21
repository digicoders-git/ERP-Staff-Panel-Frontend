import React from 'react';
import { MdPeople, MdClass, MdSchool } from 'react-icons/md';

const Enrollment = () => {
  const enrollmentData = [
    { id: 'ENR001', name: 'Rahul Sharma', rollNo: 'R001', class: 'Class 11-A', section: 'Science', status: 'enrolled' },
    { id: 'ENR002', name: 'Priya Singh', rollNo: 'R002', class: 'Class 10-B', section: 'General', status: 'enrolled' },
    { id: 'ENR003', name: 'Sneha Patel', rollNo: 'R003', class: 'Class 11-C', section: 'Arts', status: 'pending' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-blue-600 rounded-xl p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">Student Enrollment</h2>
        <p className="text-blue-100">Manage student enrollment and roll numbers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Total Enrolled</h3>
          <p className="text-3xl font-bold text-blue-600">1,189</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Active Classes</h3>
          <p className="text-3xl font-bold text-blue-600">24</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Pending Enrollment</h3>
          <p className="text-3xl font-bold text-blue-600">12</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-blue-100">
          <h3 className="text-xl font-bold text-blue-900">Enrolled Students</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Roll No</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Student Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Class</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Section</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {enrollmentData.map(student => (
                <tr key={student.id} className="hover:bg-blue-50">
                  <td className="px-6 py-4 text-sm font-medium text-blue-900">{student.rollNo}</td>
                  <td className="px-6 py-4 text-sm text-blue-700">{student.name}</td>
                  <td className="px-6 py-4 text-sm text-blue-700">{student.class}</td>
                  <td className="px-6 py-4 text-sm text-blue-700">{student.section}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      student.status === 'enrolled' ? 'bg-blue-100 text-blue-800' : 'bg-white text-blue-600 border border-blue-200'
                    }`}>
                      {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Enrollment;