import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdLogout, MdDashboard, MdBook, MdPeople, MdCheckCircle, MdWarning, MdMenu, MdClose, MdPerson } from 'react-icons/md';
import Swal from 'sweetalert2';

const LibrarianDashboard = () => {
  const navigate = useNavigate();
  const [librarian, setLibrarian] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const auth = localStorage.getItem('librarianAuth');
    if (!auth) {
      navigate('/librarian-login');
      return;
    }
    setLibrarian(JSON.parse(auth));
  }, [navigate]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: 'Logout?',
      text: 'Are you sure you want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, logout!'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('librarianAuth');
        navigate('/librarian-login');
      }
    });
  };

  const stats = [
    { title: 'Total Books', value: '2,547', icon: MdBook, color: 'bg-blue-600' },
    { title: 'Active Members', value: '1,234', icon: MdPeople, color: 'bg-green-600' },
    { title: 'Books Issued', value: '456', icon: MdCheckCircle, color: 'bg-purple-600' },
    { title: 'Overdue Books', value: '23', icon: MdWarning, color: 'bg-red-600' },
  ];

  const recentActivities = [
    { action: 'Book Issued', details: 'Harry Potter - John Doe', time: '2 hours ago' },
    { action: 'Book Returned', details: 'The Great Gatsby - Jane Smith', time: '4 hours ago' },
    { action: 'New Member', details: 'Alice Johnson registered', time: '6 hours ago' },
    { action: 'Fine Collected', details: '₹50 from Bob Wilson', time: '1 day ago' },
  ];

  if (!librarian) return null;

  return (
    <div className="h-screen flex overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 flex flex-col transition-all duration-300 shrink-0 z-30`}>
        {/* Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <MdBook className="text-white text-xl" />
              </div>
              <h1 className="text-lg font-black text-white">Librarian</h1>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-xl transition-all"
          >
            {sidebarOpen ? <MdClose size={22} /> : <MdMenu size={22} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 space-y-2 px-3">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: MdDashboard },
            { id: 'books', label: 'Books', icon: MdBook },
            { id: 'members', label: 'Members', icon: MdPeople },
            { id: 'transactions', label: 'Transactions', icon: MdCheckCircle },
            { id: 'profile', label: 'My Profile', icon: MdPerson },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title={!sidebarOpen ? item.label : ''}
            >
              <item.icon className="text-xl" />
              {sidebarOpen && <span className="ml-4 font-bold">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
            title={!sidebarOpen ? 'Logout' : ''}
          >
            <MdLogout className="text-xl" />
            {sidebarOpen && <span className="ml-4 font-bold">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <div>
            <h2 className="text-2xl font-black text-slate-800 capitalize">{activeTab}</h2>
            <p className="text-xs text-slate-500 mt-1">Librarian Panel v1.0</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm font-bold text-slate-800">{librarian.name}</p>
              <p className="text-xs text-slate-500">{librarian.staffId}</p>
            </div>
            <div className="text-right border-l border-slate-200 pl-6">
              <p className="text-xs text-slate-500">Server Time</p>
              <p className="text-lg font-black text-blue-600">{currentTime.toLocaleTimeString()}</p>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`${stat.color} p-3 rounded-xl text-white`}>
                          <Icon size={24} />
                        </div>
                        <span className="text-green-600 text-sm font-bold">+12%</span>
                      </div>
                      <p className="text-slate-600 text-sm font-bold mb-1">{stat.title}</p>
                      <p className="text-2xl font-black text-slate-800">{stat.value}</p>
                    </div>
                  );
                })}
              </div>

              {/* Recent Activities */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-xl font-black text-slate-800">Recent Activities</h2>
                </div>
                <div className="divide-y divide-slate-100">
                  {recentActivities.map((activity, idx) => (
                    <div key={idx} className="p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-800">{activity.action}</p>
                          <p className="text-sm text-slate-600">{activity.details}</p>
                        </div>
                        <span className="text-xs text-slate-500">{activity.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'books' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-2xl font-black text-slate-800 mb-4">Books Management</h2>
              <p className="text-slate-600">Books management feature coming soon...</p>
            </div>
          )}

          {activeTab === 'members' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-2xl font-black text-slate-800 mb-4">Members Management</h2>
              <p className="text-slate-600">Members management feature coming soon...</p>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-2xl font-black text-slate-800 mb-4">Book Transactions</h2>
              <p className="text-slate-600">Transactions feature coming soon...</p>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 max-w-2xl">
              <h2 className="text-2xl font-black text-slate-800 mb-6">My Profile</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <span className="font-bold text-slate-700">Name</span>
                  <span className="text-slate-600">{librarian.name}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <span className="font-bold text-slate-700">Email</span>
                  <span className="text-slate-600">{librarian.email}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <span className="font-bold text-slate-700">Staff ID</span>
                  <span className="text-slate-600">{librarian.staffId}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <span className="font-bold text-slate-700">Login Time</span>
                  <span className="text-slate-600">{new Date(librarian.loginTime).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default LibrarianDashboard;
