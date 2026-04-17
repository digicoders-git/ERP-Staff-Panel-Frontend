import React, { useState, useEffect } from 'react';
import { 
  MdNotifications, MdEmail, MdSms, MdSettings, MdSend, 
  MdPerson, MdAccessTime, MdCheckCircle, MdWarning, 
  MdInfo, MdVerified, MdOutlineAnalytics, MdPowerSettingsNew,
  MdOutlineRule, MdEditNotifications, MdRefresh
} from 'react-icons/md';
import { notificationAPI } from '../utils/apiService';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const NotificationCenter = () => {
  const [activeTab, setActiveTab] = useState('notifications');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    absenceThreshold: 2,
    lateThreshold: 30,
    autoNotify: true,
    notifyParents: true,
    notifyAdmin: true
  });

  const [newNotification, setNewNotification] = useState({
    type: 'custom',
    title: '',
    message: '',
    recipients: '',
    method: 'email'
  });

  const [showNotificationForm, setShowNotificationForm] = useState(false);

  const notificationTypes = [
    { value: 'absence', label: 'Absence Alert', icon: MdWarning, color: 'text-rose-500', bg: 'bg-rose-50' },
    { value: 'late', label: 'Late Arrival', icon: MdAccessTime, color: 'text-amber-500', bg: 'bg-amber-50' },
    { value: 'leave', label: 'Leave Update', icon: MdInfo, color: 'text-sky-500', bg: 'bg-sky-50' },
    { value: 'custom', label: 'Custom Message', icon: MdNotifications, color: 'text-emerald-500', bg: 'bg-emerald-50' }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [historyRes, settingsRes] = await Promise.all([
        notificationAPI.getAll(),
        notificationAPI.getSettings()
      ]);
      setNotifications(historyRes.data);
      setSettings(settingsRes.data);
    } catch (err) {
      toast.error('Failed to sync with matrix registry');
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await notificationAPI.create(newNotification);
      setNotifications([res.data.notification, ...notifications]);
      setNewNotification({ type: 'custom', title: '', message: '', recipients: '', method: 'email' });
      setShowNotificationForm(false);
      toast.success('Dispatch executed successfully! 🚀');
    } catch (err) {
      toast.error('Dispatch failure - check gateway protocol');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsUpdate = async (key, value) => {
    const updatedSettings = { ...settings, [key]: value };
    setSettings(updatedSettings);
    try {
      await notificationAPI.updateSettings(updatedSettings);
      toast.success('Registry updated', { position: "bottom-center", autoClose: 1000 });
    } catch (err) {
      toast.error('Failed to sync settings');
    }
  };

  const getNotificationIcon = (type) => {
    const nt = notificationTypes.find(nt => nt.value === type);
    return nt || notificationTypes[3];
  };

  const stats = {
    totalSent: notifications.length,
    pending: 0,
    emailsSent: notifications.filter(n => n.method === 'email' || n.method === 'both').length,
    smsSent: notifications.filter(n => n.method === 'sms' || n.method === 'both').length
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Premium Dark Header */}
      <div className="bg-[#0f172a] rounded-[2rem] p-10 text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/20 transition-all duration-1000"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 mb-2">
               <span className="w-8 h-1 bg-emerald-500 rounded-full"></span>
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Logistics Hub</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black tracking-tight leading-none">Notification Center</h2>
            <p className="text-slate-400 text-lg font-medium max-w-xl italic">Coordinate institutional alerts, student communications, and automated reporting thresholds across the matrix.</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <button
               onClick={fetchData}
               className="p-4 bg-white/5 backdrop-blur-md rounded-2xl text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-white/5"
            >
               <MdRefresh size={24} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={() => setShowNotificationForm(true)}
              className="flex-1 md:flex-none px-10 py-4 bg-emerald-500 text-white rounded-[1.2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3"
            >
              <MdSend size={18} />
              New Dispatch
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Terminal */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Dispatches', val: stats.totalSent, icon: MdOutlineAnalytics, color: 'indigo' },
          { label: 'Waiting Queue', val: stats.pending, icon: MdAccessTime, color: 'amber' },
          { label: 'SMTP Release', val: stats.emailsSent, icon: MdEmail, color: 'emerald' },
          { label: 'Carrier Release', val: stats.smsSent, icon: MdSms, color: 'sky' }
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all duration-500 group">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-4 bg-${s.color}-50 text-${s.color}-600 rounded-2xl group-hover:scale-110 transition-transform`}>
                <s.icon size={26} />
              </div>
              <div className="h-1.5 w-8 bg-slate-100 rounded-full overflow-hidden">
                 <div className={`h-full bg-${s.color}-500 w-2/3`}></div>
              </div>
            </div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{s.label}</h3>
            <p className="text-3xl font-black text-slate-800 tabular-nums">{s.val}</p>
          </div>
        ))}
      </div>

      {/* Navigation Matrix */}
      <div className="flex flex-col md:flex-row gap-4 justify-between bg-slate-50/50 p-3 rounded-[2rem] border border-slate-100">
        <div className="flex gap-2">
          {[
            { id: 'notifications', label: 'Dispatch Registry', icon: MdOutlineRule },
            { id: 'settings', label: 'Threshold Terminal', icon: MdEditNotifications }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all ${
                activeTab === tab.id 
                  ? 'bg-white text-slate-900 shadow-xl shadow-slate-200/50 border border-slate-200' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="min-h-[400px]">
        {activeTab === 'notifications' ? (
          <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 group">
            <div className="p-10 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
              <div>
                 <h3 className="text-2xl font-black text-slate-800 tracking-tight">System Dispatch Stream</h3>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Live tracking of institutional dispatches</p>
              </div>
              <span className="flex items-center gap-2 bg-emerald-100 text-emerald-700 text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-widest border border-emerald-200 border-dashed animate-pulse">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                Gateway Active
              </span>
            </div>
            
            {loading ? (
              <div className="p-20 text-center space-y-4">
                 <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Accessing Registry...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-32 text-center text-slate-300">
                 <MdNotifications size={80} className="mx-auto mb-6 opacity-20" />
                 <p className="text-sm font-black uppercase tracking-[0.2em]">Zero activity in current protocol</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {notifications.map((n) => (
                  <div key={n._id} className="p-10 hover:bg-slate-50/80 transition-all duration-500 group/item relative">
                    <div className="flex items-start gap-8">
                      <div className={`p-5 rounded-3xl ${getNotificationIcon(n.type).bg} ${getNotificationIcon(n.type).color} shadow-sm group-hover/item:scale-110 transition-transform duration-500 border border-current/10`}>
                        {React.createElement(getNotificationIcon(n.type).icon, { size: 28 })}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-xl font-black text-slate-800 tracking-tight leading-none">{n.title}</h4>
                          <div className="flex items-center gap-3">
                            <span className="px-5 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-emerald-100 shadow-sm">
                              {n.status}
                            </span>
                            <div className="flex items-center gap-2 p-2 bg-slate-100 rounded-xl text-slate-400 group-hover/item:text-slate-600 transition-colors">
                              {n.method === 'email' && <MdEmail size={18} title="Institutional Email" />}
                              {n.method === 'sms' && <MdSms size={18} title="Carrier Gateway" />}
                              {n.method === 'both' && <div className="flex gap-1"><MdEmail size={16}/><MdSms size={16}/></div>}
                            </div>
                          </div>
                        </div>
                        <p className="text-slate-500 font-bold leading-relaxed text-lg mb-5">{n.message}</p>
                        <div className="flex flex-wrap items-center gap-x-10 gap-y-3 pt-4 border-t border-slate-50">
                          <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest italic overflow-hidden">
                            <MdPerson size={16} className="text-emerald-500/50" />
                            To: <span className="text-slate-700 truncate max-w-[200px]">{n.recipients}</span>
                          </div>
                          <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                            <MdAccessTime size={16} className="text-amber-500/50" />
                            {new Date(n.createdAt).toLocaleString()}
                          </div>
                          <div className="flex items-center gap-2 ml-auto">
                             <MdVerified className="text-emerald-500" size={16} />
                             <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Protocol Signed</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-right-8 duration-500">
            {/* Automatic Thresholds Card */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100 space-y-10 group">
              <div className="flex items-center gap-4 mb-2">
                 <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:rotate-12 transition-transform">
                    <MdPowerSettingsNew size={28} />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">Automation Terminal</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Autonomous dispatch rules & triggers</p>
                 </div>
              </div>

              <div className="space-y-6">
                {[
                  { id: 'autoNotify', label: 'Absence Automation', desc: 'Trigger alerts on threshold breach', icon: MdWarning },
                  { id: 'notifyParents', label: 'Parent Link Protocol', desc: 'Copy dispatches to guardians', icon: MdPerson },
                  { id: 'notifyAdmin', label: 'Admin Oversight', desc: 'Keep administration in the loop', icon: MdVerified }
                ].map(s => (
                  <div key={s.id} className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl border border-transparent hover:border-emerald-200 transition-all">
                    <div className="flex items-center gap-5">
                       <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm">
                          <s.icon size={20} />
                       </div>
                       <div>
                         <h4 className="font-black text-slate-700 uppercase text-[10px] tracking-widest mb-1">{s.label}</h4>
                         <p className="text-sm font-bold text-slate-400">{s.desc}</p>
                       </div>
                    </div>
                    <button
                      onClick={() => handleSettingsUpdate(s.id, !settings[s.id])}
                      className={`w-14 h-8 rounded-full transition-all relative ${settings[s.id] ? 'bg-emerald-500 shadow-lg shadow-emerald-200' : 'bg-slate-200'}`}
                    >
                      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${settings[s.id] ? 'left-7' : 'left-1 shadow-sm'}`}></div>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Metric Configuration Card */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100 space-y-10 group">
               <div className="flex items-center gap-4 mb-2">
                 <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl group-hover:-rotate-12 transition-transform">
                    <MdOutlineRule size={28} />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">Registry Thresholds</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Calibration of dispatch trigger points</p>
                 </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Absence Tolerance (Days)</label>
                    <span className="text-2xl font-black text-emerald-600 tabular-nums">{settings.absenceThreshold} d</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={settings.absenceThreshold}
                    onChange={(e) => handleSettingsUpdate('absenceThreshold', parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Alert release on {settings.absenceThreshold} consecutive absence events</p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Late Ingress Buffer (Mins)</label>
                    <span className="text-2xl font-black text-amber-600 tabular-nums">{settings.lateThreshold} m</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="120"
                    step="5"
                    value={settings.lateThreshold}
                    onChange={(e) => handleSettingsUpdate('lateThreshold', parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Grace period of {settings.lateThreshold} minutes before protocol breach</p>
                </div>

                <div className="pt-8 flex gap-4">
                   <div className="flex-1 p-5 bg-[#0f172a] rounded-2xl text-center shadow-xl">
                      <p className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-1">Status</p>
                      <p className="font-bold text-white text-xs">Registry Synchronized</p>
                   </div>
                   <div className="flex-1 p-5 bg-slate-50 rounded-2xl text-center border border-slate-100">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Protection</p>
                      <p className="font-bold text-slate-600 text-xs italic tracking-tight flex items-center justify-center gap-1">
                        <MdCheckCircle className="text-emerald-500" size={14}/> Active
                      </p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modern Dispatch Form Modal */}
      {showNotificationForm && (
        <div className="fixed inset-0 bg-[#0f172a]/80 backdrop-blur-md flex items-center justify-center z-[60] p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] p-12 max-w-2xl w-full shadow-[0_0_100px_rgba(16,185,129,0.1)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -mr-32 -mt-32 blur-[60px]" />
            
            <div className="flex justify-between items-center mb-10 relative z-10">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-[#0f172a] text-white rounded-[1.5rem] flex items-center justify-center shadow-2xl">
                   <MdSend size={32} />
                </div>
                <div>
                   <h3 className="text-3xl font-black text-slate-900 tracking-tighter leading-none mb-1">Release Dispatch</h3>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] italic">Instant protocol communications</p>
                </div>
              </div>
              <button 
                onClick={() => setShowNotificationForm(false)} 
                className="w-12 h-12 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl flex items-center justify-center transition-all border border-slate-100"
              >
                <MdRefresh className="rotate-45" size={24} />
              </button>
            </div>

            <form onSubmit={handleSendNotification} className="space-y-8 relative z-10">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-2">Matrix Category</label>
                  <select
                    value={newNotification.type}
                    onChange={(e) => setNewNotification({...newNotification, type: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-bold text-slate-800 outline-none transition-all appearance-none cursor-pointer"
                  >
                    {notificationTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-2">Registry Title</label>
                  <input
                    type="text"
                    value={newNotification.title}
                    onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-bold text-slate-800 outline-none transition-all"
                    placeholder="Subject Header"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-2">Manifest Payload</label>
                <textarea
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-bold text-slate-800 outline-none resize-none transition-all"
                  rows="4"
                  placeholder="Encryption detailed message data..."
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-2">Hotline / Target</label>
                  <input
                    type="text"
                    value={newNotification.recipients}
                    onChange={(e) => setNewNotification({...newNotification, recipients: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-bold text-slate-800 outline-none transition-all"
                    placeholder="SMTP or Carrier Num"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-2">Gate Protocol</label>
                  <select
                    value={newNotification.method}
                    onChange={(e) => setNewNotification({...newNotification, method: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-bold text-slate-800 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="email">Institutional Mail</option>
                    <option value="sms">Carrier Gateway</option>
                    <option value="both">Hybrid Stream</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setShowNotificationForm(false)}
                  className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-slate-200 transition-all border border-slate-200"
                >
                  Discard Dispatch
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-5 bg-[#0f172a] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-emerald-600 transition-all shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? "Transmitting..." : "Execute Release"}
                  {!loading && <MdVerified className="text-emerald-500" size={18} />}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;