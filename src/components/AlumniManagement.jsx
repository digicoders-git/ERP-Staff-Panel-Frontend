import React, { useState } from 'react';
import {
  MdConnectWithoutContact,
  MdSearch,
  MdFilterList,
  MdEmail,
  MdWork,
  MdPeople,
  MdLocationOn,
  MdPhone,
  MdArrowBack
} from 'react-icons/md';

const AlumniManagement = () => {
  const [view, setView] = useState('directory'); // 'directory', 'profile'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlum, setSelectedAlum] = useState(null);
  const [filterBatch, setFilterBatch] = useState('All');
  const [filterDept, setFilterDept] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const alumni = [
    {
      id: 1,
      name: 'Aditya Gupta',
      batch: '2018',
      department: 'PCM (Science)',
      currentRole: 'Software Development Engineer at Google',
      location: 'Mountain View, CA',
      email: 'aditya.g@example.com',
      phone: '+1-650-123-4567',
      image: 'https://ui-avatars.com/api/?name=Aditya+Gupta&background=0D8ABC&color=fff&rounded=true',
      achievements: 'School Topper in 12th Boards with 98.5%',
      mentorship: true,
      bio: "Aditya was the captain of the school's robotics club and led our team to win the National Robotics Championship in 2018."
    },
    {
      id: 2,
      name: 'Sneha Rao',
      batch: '2019',
      department: 'Commerce',
      currentRole: 'Chartered Accountant',
      location: 'New Delhi, India',
      email: 'sneha.r@example.com',
      phone: '+91-98765-43210',
      image: 'https://ui-avatars.com/api/?name=Sneha+Rao&background=F472B6&color=fff&rounded=true',
      achievements: 'National level Debate Champion representing our school',
      mentorship: true,
      bio: "Sneha led the school's commerce society and won multiple inter-school debate competitions during her time here."
    },
    {
      id: 3,
      name: 'Vikram Singh',
      batch: '2017',
      department: 'Humanities',
      currentRole: 'High Court Advocate',
      location: 'Lucknow, India',
      email: 'mp04042007@gmail.com',
      phone: '+91-98765-43211',
      image: 'https://ui-avatars.com/api/?name=Vikram+Singh&background=10B981&color=fff&rounded=true',
      achievements: 'Established the first Digital Library in our school',
      mentorship: false,
      bio: "Vikram was known for his social work initiatives and community service projects during his school years."
    },
    {
      id: 4,
      name: 'Ishaan Malhotra',
      batch: '2020',
      department: 'PCB (Medical)',
      currentRole: 'Medical Professional',
      location: 'New Delhi, India',
      email: 'ishaan.m@example.com',
      phone: '+91-98765-43212',
      image: 'https://ui-avatars.com/api/?name=Ishaan+Malhotra&background=6366F1&color=fff&rounded=true',
      achievements: 'Awarded "Student of the Year" in 2020',
      mentorship: true,
      bio: "Ishaan was the topper of the medical stream and actively participated in school health awareness campaigns."
    },
    {
      id: 5,
      name: 'Zoya Khan',
      batch: '2016',
      department: 'Humanities',
      currentRole: 'Award-winning Journalist at BBC News',
      location: 'London, UK',
      email: 'zoya.k@example.com',
      phone: '+44-20-7946-0123',
      image: 'https://ui-avatars.com/api/?name=Zoya+Khan&background=F59E0B&color=fff&rounded=true',
      achievements: 'Best Investigative Journalist 2025',
      mentorship: true,
      bio: "Zoya was the editor-in-chief of the school magazine 'The Clarion' for two consecutive years and won several journalism awards."
    },
    {
      id: 6,
      name: 'Rohan Mehta',
      batch: '2015',
      department: 'PCM (Science)',
      currentRole: 'Founder & CEO at SolarTech Solutions',
      location: 'Bangalore, India',
      email: 'rohan.m@example.com',
      phone: '+91-98765-43215',
      image: 'https://ui-avatars.com/api/?name=Rohan+Mehta&background=8B5CF6&color=fff&rounded=true',
      achievements: 'Forbes 30 Under 30 (Energy Sector)',
      mentorship: true,
      bio: "Rohan's renewable energy project won the state science fair in 2014 and inspired him to become an entrepreneur."
    }
  ];

  const filteredAlumni = alumni.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.batch.includes(searchTerm) ||
      a.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBatch = filterBatch === 'All' || a.batch === filterBatch;
    const matchesDept = filterDept === 'All' || a.department === filterDept;

    return matchesSearch && matchesBatch && matchesDept;
  });

  const batches = ['All', ...new Set(alumni.map(a => a.batch))].sort().reverse();
  const departments = ['All', ...new Set(alumni.map(a => a.department))];

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen space-y-6">
      {/* Premium Header Section - Compact */}
      <div className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] rounded-[1.5rem] p-6 text-white shadow-xl relative overflow-hidden border border-white/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-emerald-500/10 rounded-2xl backdrop-blur-xl border border-emerald-500/20">
              <MdConnectWithoutContact size={32} className="text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight leading-tight">
                Alumni Network
              </h1>
              <p className="text-slate-400 text-sm font-medium">Connecting the past, present, and future</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl px-5 py-3 border border-white/10 min-w-[130px]">
              <p className="text-emerald-400 text-[10px] font-black uppercase tracking-wider mb-0.5">Network</p>
              <h3 className="text-2xl font-black">8,500+</h3>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl px-5 py-3 border border-white/10 min-w-[130px]">
              <p className="text-blue-400 text-[10px] font-black uppercase tracking-wider mb-0.5">Reach</p>
              <div className="flex items-baseline space-x-1">
                <h3 className="text-2xl font-black">50+</h3>
                <span className="text-[10px] text-slate-500 font-bold uppercase">Countries</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-6">
        {view === 'directory' && (
          <>
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-xl group">
                <MdSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors text-xl" />
                <input
                  type="text"
                  placeholder="Search by name, year, or stream..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-4 py-4 bg-white border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none shadow-sm transition-all"
                />
              </div>
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`flex items-center space-x-3 px-8 py-4 rounded-[1.5rem] font-black tracking-wide transition-all ${isFilterOpen ? 'bg-slate-900 text-white shadow-xl' : 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-500 hover:text-emerald-600 shadow-sm'}`}
                >
                  <MdFilterList size={24} />
                  <span>SMART FILTERS {(filterBatch !== 'All' || filterDept !== 'All') && '•'}</span>
                </button>

                {isFilterOpen && (
                  <div className="absolute right-0 mt-4 w-80 bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-8 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Filter by Batch</label>
                        <select
                          value={filterBatch}
                          onChange={(e) => setFilterBatch(e.target.value)}
                          className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700 appearance-none cursor-pointer"
                        >
                          {batches.map(batch => (
                            <option key={batch} value={batch}>{batch}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Filter by Stream</label>
                        <select
                          value={filterDept}
                          onChange={(e) => setFilterDept(e.target.value)}
                          className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700 appearance-none cursor-pointer"
                        >
                          {departments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </select>
                      </div>

                      <button
                        onClick={() => {
                          setFilterBatch('All');
                          setFilterDept('All');
                        }}
                        className="w-full py-4 text-xs font-black text-rose-500 hover:bg-rose-50 rounded-2xl transition-all uppercase tracking-widest"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Alumni Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {filteredAlumni.map((alum) => (
                <div key={alum.id} className=" rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group">
                  <div className="flex items-start space-x-5">
                    <div className="relative shrink-0">
                      <img
                        src={alum.image}
                        alt={alum.name}
                        className="w-20 h-20 rounded-xl object-cover  group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div className="truncate">
                          <h3 className="text-lg font-bold text-slate-900 leading-tight truncate">{alum.name}</h3>
                          <p className="text-emerald-600 font-bold text-xs">Class of {alum.batch} • {alum.department}</p>
                        </div>
                        <a
                          href={`mailto:${alum.email}`}
                          className="p-1.5 text-slate-300 hover:text-emerald-500 transition-colors shrink-0"
                        >
                          <MdEmail size={20} />
                        </a>
                      </div>

                      <div className="mt-3 space-y-1.5">
                        <div className="flex items-center text-xs text-slate-500 font-medium truncate">
                          <MdWork className="mr-2 text-slate-300 group-hover:text-emerald-400 shrink-0" />
                          <span className="truncate">{alum.currentRole}</span>
                        </div>
                        <div className="flex items-center text-xs text-slate-500 truncate">
                          <MdLocationOn className="mr-2 text-slate-300 group-hover:text-emerald-400 shrink-0" />
                          <span className="truncate">{alum.location}</span>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-50">
                        <button
                          onClick={() => {
                            setSelectedAlum(alum);
                            setView('profile');
                          }}
                          className="text-xs font-black text-slate-500 hover:text-emerald-600 transition-colors uppercase tracking-wider"
                        >
                          Details
                        </button>
                        <a
                          href={`mailto:${alum.email}`}
                          className="text-[10px] font-black text-white bg-emerald-500 hover:bg-emerald-600 px-4 py-1.5 rounded-lg transition-all shadow-lg shadow-emerald-100 uppercase tracking-widest"
                        >
                          Connect
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {view === 'profile' && selectedAlum && (
          <div className="bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-100 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Compact Profile Header */}
            <div className="h-40 bg-[#1e293b] relative p-8 flex items-end">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent"></div>
              <button
                onClick={() => setView('directory')}
                className="absolute top-5 left-5 p-2 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-white/20 transition-all border border-white/5"
              >
                <MdArrowBack size={20} />
              </button>

              <div className="relative z-10 w-full flex flex-col md:flex-row items-center md:items-end gap-5 translate-y-10">
                <img
                  src={selectedAlum.image}
                  className="w-28 h-28 rounded-2xl border-4 border-white shadow-xl object-cover shrink-0"
                  alt=""
                />
                <div className="pb-2 text-center md:text-left">
                  <h2 className="text-3xl font-black text-slate-800 drop-shadow-sm">{selectedAlum.name}</h2>
                  <p className="text-emerald-600 text-lg font-bold tracking-tight">{selectedAlum.currentRole}</p>
                </div>
              </div>
            </div>

            <div className="px-8 pt-16 pb-10">
              <div className="grid grid-cols-1 gap-8">
                <div className="space-y-8">
                  <section>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center">
                      <span className="w-6 h-0.5 bg-emerald-500 mr-3"></span>
                      Biography
                    </h4>
                    <p className="text-slate-600 leading-relaxed text-lg bg-slate-50 p-6 rounded-2xl border-2 border-dashed border-slate-100">
                      {selectedAlum.achievements}. {selectedAlum.bio}
                    </p>
                  </section>

                  <section className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-3 hover:border-emerald-100 transition-colors">
                      <h5 className="font-black text-slate-400 uppercase text-[10px] tracking-wider">Education Journey</h5>
                      <div className="flex items-center space-x-3">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl font-black text-xs">Batch {selectedAlum.batch}</div>
                        <p className="font-bold text-slate-700">{selectedAlum.department} Stream</p>
                      </div>
                    </div>
                    <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-3 hover:border-emerald-100 transition-colors">
                      <h5 className="font-black text-slate-400 uppercase text-[10px] tracking-wider">Contact Detail</h5>
                      <div className="space-y-1 text-sm font-medium text-slate-600">
                        <p className="flex items-center"><MdEmail size={14} className="mr-2 text-slate-300" /> {selectedAlum.email}</p>
                        <p className="flex items-center"><MdLocationOn size={14} className="mr-2 text-slate-300" /> {selectedAlum.location}</p>
                      </div>
                    </div>
                  </section>

                  <div className="flex gap-4">
                    <a
                      href={`mailto:${selectedAlum.email}`}
                      className="flex-1 py-4 bg-emerald-500 text-white rounded-xl font-black text-xs uppercase tracking-widest text-center hover:bg-emerald-600 shadow-lg shadow-emerald-100 transition-all"
                    >
                      Connect via Email
                    </a>
                    <a
                      href={`tel:${selectedAlum.phone}`}
                      className="px-6 py-4 bg-slate-100 text-slate-600 rounded-xl font-black text-xs uppercase tracking-widest text-center hover:bg-slate-200 transition-all"
                    >
                      Call
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlumniManagement;