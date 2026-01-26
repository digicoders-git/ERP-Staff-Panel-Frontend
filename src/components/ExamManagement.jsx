import React, { useState } from 'react';
import CreateSchedule from './CreateSchedule';
import ManageMarks from './ManageMarks';
import Grading from './Grading';
import OnlineExam from './OnlineExam';
import { MdSchedule, MdGrade, MdAssignment, MdComputer } from 'react-icons/md';

const ExamManagement = () => {
  const [activeTab, setActiveTab] = useState('schedule');

  const tabs = [
    { id: 'schedule', name: 'Create Schedule', icon: MdSchedule, component: CreateSchedule },
    { id: 'marks', name: 'Manage Marks', icon: MdAssignment, component: ManageMarks },
    { id: 'grading', name: 'Grading System', icon: MdGrade, component: Grading },
    { id: 'online-exam', name: 'Online Exam', icon: MdComputer, component: OnlineExam }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Exam Management System</h2>
        <p className="text-gray-600">Manage exam schedules, marks, and grading system</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors duration-200 ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <tab.icon className="text-lg" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {ActiveComponent && <ActiveComponent />}
        </div>
      </div>
    </div>
  );
};

export default ExamManagement;