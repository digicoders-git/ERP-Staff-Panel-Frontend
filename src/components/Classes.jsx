import React from 'react';
import { MdClass, MdPeople, MdSchool } from 'react-icons/md';

const Classes = () => {
  const classData = [
    { id: 'CLS001', name: 'Class 9-A', students: 35, capacity: 40, teacher: 'Mrs. Sharma', subject: 'General' },
    { id: 'CLS002', name: 'Class 10-B', students: 38, capacity: 40, teacher: 'Mr. Kumar', subject: 'General' },
    { id: 'CLS003', name: 'Class 11-Science', students: 32, capacity: 35, teacher: 'Dr. Patel', subject: 'Science' },
    { id: 'CLS004', name: 'Class 12-Commerce', students: 28, capacity: 30, teacher: 'Ms. Singh', subject: 'Commerce' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-blue-600 rounded-xl p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">Class Information</h2>
        <p className="text-blue-100">Manage class assignments and capacity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Total Classes</h3>
          <p className="text-3xl font-bold text-blue-600">24</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Total Students</h3>
          <p className="text-3xl font-bold text-blue-600">1,189</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Available Seats</h3>
          <p className="text-3xl font-bold text-blue-600">156</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Teachers</h3>
          <p className="text-3xl font-bold text-blue-600">45</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-blue-900 mb-6">Class Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {classData.map(cls => (
            <div key={cls.id} className="border border-blue-200 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-blue-900">{cls.name}</h4>
                  <p className="text-sm text-blue-600">{cls.subject}</p>
                </div>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {cls.students}/{cls.capacity}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm text-blue-700">
                  <MdPeople className="mr-2" />
                  Students: {cls.students}
                </div>
                <div className="flex items-center text-sm text-blue-700">
                  <MdSchool className="mr-2" />
                  Teacher: {cls.teacher}
                </div>
              </div>

              <div className="mt-4">
                <div className="w-full bg-blue-100 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(cls.students / cls.capacity) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  {Math.round((cls.students / cls.capacity) * 100)}% Capacity
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Classes;