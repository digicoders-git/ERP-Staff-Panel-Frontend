import React, { useState } from 'react';
import CreateSchedule from './CreateSchedule';
import ManageMarks from './ManageMarks';
import MarksHistory from './MarksHistory';
import Grading from './Grading';
import OnlineExam from './OnlineExam';
import { MdSchedule, MdGrade, MdAssignment, MdComputer, MdAccountBalance, MdHistory } from 'react-icons/md';

const ExamManagement = () => {
  const [activeTab, setActiveTab] = useState('schedule');

  const tabs = [
    { id: 'schedule', name: 'Exam Schedule', icon: MdSchedule, component: CreateSchedule, desc: 'Schedule & Calendar' },
    { id: 'marks', name: 'Manage Marks', icon: MdAssignment, component: ManageMarks, desc: 'Enter Student Marks' },
    { id: 'history', name: 'Marks History', icon: MdHistory, component: MarksHistory, desc: 'All Allocated Marks' },
    // { id: 'grading', name: 'Grading System', icon: MdGrade, component: Grading, desc: 'GPA & Standards' },
    { id: 'online-exam', name: 'Online Exam', icon: MdComputer, component: OnlineExam, desc: 'CBT Assessments' },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Premium Institutional Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden border border-white/5">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-indigo-500/10 rounded-full -mr-64 -mt-64 blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full -ml-40 -mb-40 blur-[80px]" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <div className="flex items-center gap-8">
            <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-[2rem] flex items-center justify-center border border-white/20 shadow-2xl transition-transform hover:scale-105 duration-500">
               <MdAccountBalance size={48} className="text-indigo-400" />
            </div>
            <div>
              <h1 className="text-5xl font-black mb-3 tracking-tighter bg-gradient-to-r from-white via-indigo-200 to-slate-400 bg-clip-text text-transparent">
                Scholastic Command
              </h1>
              <div className="flex items-center gap-4 text-indigo-300/80 font-bold text-lg">
                <span>Examination Registry</span>
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                <span className="opacity-60">Academic Performance Manifold</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="px-6 py-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 text-center min-w-[120px]">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300 mb-1">Active Terms</p>
              <p className="text-2xl font-black tracking-tight">Q2-2024</p>
            </div>
            <div className="px-6 py-4 bg-indigo-500/20 backdrop-blur-md rounded-2xl border border-indigo-500/30 text-center min-w-[120px]">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200 mb-1">Pass Ratio</p>
              <p className="text-2xl font-black tracking-tight text-indigo-200 text-center italic">92.4%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabbed Navigation Interface */}
      <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden min-h-[70vh]">
        <div className="border-b border-slate-50 bg-slate-50/30">
          <nav className="flex p-4 gap-2 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[200px] p-6 rounded-[2rem] flex items-center gap-4 transition-all duration-300 relative group overflow-hidden ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white shadow-2xl'
                    : 'bg-transparent text-slate-400 hover:bg-white hover:shadow-xl hover:text-slate-600'
                }`}
              >
                <div className={`p-4 rounded-2xl transition-all duration-500 ${
                  activeTab === tab.id ? 'bg-indigo-600 text-white rotate-6' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600'
                }`}>
                  <tab.icon size={24} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-black tracking-tight">{tab.name}</p>
                  <p className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 opacity-60`}>{tab.desc}</p>
                </div>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-blue-500" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Dynamic Context Canvas */}
        <div className="p-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          {ActiveComponent && <ActiveComponent />}
        </div>
      </div>
    </div>
  );
};

export default ExamManagement;
