import React, { useState, useEffect } from 'react';
import { MdClass, MdPeople, MdSchool } from 'react-icons/md';
import { classAPI } from '../utils/apiService';
import { FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Classes = () => {
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [stats, setStats] = useState({ totalClasses: 0, totalStudents: 0, availableSeats: 0, teachers: 0 });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const res = await classAPI.getAll();
      if (res.data && res.data.classes) {
        const classList = res.data.classes;
        setClasses(classList);
        
        // Calculate stats
        const totalClasses = classList.length;
        const totalStudents = classList.reduce((acc, curr) => acc + (curr.studentCount || 0), 0);
        const totalCapacity = classList.reduce((acc, curr) => acc + (curr.capacity || 0), 0);
        const teachersCount = new Set(classList.flatMap(c => c.teachers?.map(t => t._id) || [])).size;

        setStats({
          totalClasses,
          totalStudents,
          availableSeats: Math.max(0, totalCapacity - totalStudents),
          teachers: teachersCount
        });
      }
    } catch (err) {
      console.error('Failed to fetch classes:', err);
      toast.error('Failed to load class information');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {loading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <FaSpinner className="animate-spin text-blue-500 text-5xl" />
        </div>
      )}
      <div className="bg-blue-600 rounded-xl p-6 text-white shadow-lg">
        <h2 className="text-3xl font-bold mb-2 tracking-tight">Class Information</h2>
        <p className="text-blue-100 font-medium tracking-wide">Manage class assignments, capacity, and academic staff</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 hover:shadow-md transition-shadow">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Classes</h3>
          <p className="text-3xl font-black text-slate-800">{stats.totalClasses}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 hover:shadow-md transition-shadow">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Students</h3>
          <p className="text-3xl font-black text-blue-600">{stats.totalStudents}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 hover:shadow-md transition-shadow">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Available Seats</h3>
          <p className="text-3xl font-black text-emerald-600">{stats.availableSeats}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 hover:shadow-md transition-shadow">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Staff Teachers</h3>
          <p className="text-3xl font-black text-indigo-600">{stats.teachers}</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
        <h3 className="text-xl font-black text-slate-800 mb-8 tracking-tight flex items-center gap-3">
          <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
          Class Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {classes.length > 0 ? classes.map(cls => (
            <div key={cls._id} className="group border border-slate-100 rounded-[2rem] p-8 hover:shadow-xl hover:border-transparent transition-all duration-500 bg-white hover:-translate-y-1">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="text-lg font-black text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors uppercase">{cls.className}</h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 opacity-70 italic">Academic Unit</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="bg-slate-50 text-slate-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-100 group-hover:bg-blue-50 group-hover:text-blue-700 group-hover:border-transparent transition-all">
                    {cls.studentCount || 0}/{cls.capacity || 40}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center text-xs font-bold text-slate-600 tracking-wide">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mr-3">
                    <MdPeople size={16} />
                  </div>
                  Students: {cls.studentCount || 0}
                </div>
                <div className="flex items-center text-xs font-bold text-slate-600 tracking-wide">
                   <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mr-3">
                    <MdSchool size={16} />
                  </div>
                  Teacher: {cls.teachers?.[0]?.name || 'Not Assigned'}
                </div>
              </div>

              <div className="mt-8">
                <div className="flex justify-between items-end mb-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Capacity Utilization
                  </p>
                  <p className="text-[10px] font-black text-blue-600">
                    {Math.round(((cls.studentCount || 0) / (cls.capacity || 40)) * 100)}%
                  </p>
                </div>
                <div className="w-full bg-slate-50 rounded-full h-2 border border-slate-100 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full group-hover:shadow-[0_0_8px_rgba(37,99,235,0.4)] transition-all duration-700 ease-out" 
                    style={{ width: `${Math.min(100, Math.round(((cls.studentCount || 0) / (cls.capacity || 40)) * 100))}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center">
               <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs underline underline-offset-8">No classes configured</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Classes;