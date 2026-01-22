import React, { useState, useEffect } from 'react';
import { MdNotifications, MdEmail, MdSms, MdSettings, MdSend, MdPerson, MdAccessTime, MdCheckCircle, MdWarning, MdInfo } from 'react-icons/md';

const NotificationCenter = () => {
  const [activeTab, setActiveTab] = useState('notifications');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'absence',
      title: 'Staff Absence Alert',
      message: 'John Doe has been absent for 2 consecutive days',
      timestamp: '2024-01-15 09:30 AM',
      status: 'sent',
      recipient: 'admin@school.com',
      method: 'email'
    },
    {
      id: 2,
      type: 'late',
      title: 'Late Arrival Notification',
      message: 'Sarah Wilson arrived 30 minutes late today',
      timestamp: '2024-01-15 09:45 AM',
      status: 'pending',
      recipient: '+1234567890',
      method: 'sms'
    },
    {
      id: 3,
      type: 'leave',
      title: 'Leave Request Approved',
      message: 'Jane Smith\'s annual leave request has been approved',
      timestamp: '2024-01-14 02:15 PM',
      status: 'sent',
      recipient: 'jane.smith@school.com',
      method: 'email'
    }
  ]);

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
    { value: 'absence', label: 'Absence Alert', icon: MdWarning, color: 'text-red-600' },
    { value: 'late', label: 'Late Arrival', icon: MdAccessTime, color: 'text-yellow-600' },
    { value: 'leave', label: 'Leave Update', icon: MdInfo, color: 'text-blue-600' },
    { value: 'custom', label: 'Custom Message', icon: MdNotifications, color: 'text-purple-600' }
  ];

  const handleSendNotification = (e) => {
    e.preventDefault();
    const notification = {
      id: notifications.length + 1,
      ...newNotification,
      timestamp: new Date().toLocaleString(),
      status: 'sent'
    };
    
    setNotifications([notification, ...notifications]);
    setNewNotification({ type: 'custom', title: '', message: '', recipients: '', method: 'email' });
    setShowNotificationForm(false);
  };

  const handleSettingsUpdate = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const getNotificationIcon = (type) => {
    const notificationType = notificationTypes.find(nt => nt.value === type);
    return notificationType ? notificationType.icon : MdNotifications;
  };

  const getNotificationColor = (type) => {
    const notificationType = notificationTypes.find(nt => nt.value === type);
    return notificationType ? notificationType.color : 'text-gray-600';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'sent': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const stats = {
    totalSent: notifications.filter(n => n.status === 'sent').length,
    pending: notifications.filter(n => n.status === 'pending').length,
    emailsSent: notifications.filter(n => n.method === 'email' && n.status === 'sent').length,
    smsSent: notifications.filter(n => n.method === 'sms' && n.status === 'sent').length
  };

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Sent</p>
              <p className="text-2xl font-bold text-blue-900">{stats.totalSent}</p>
            </div>
            <MdCheckCircle className="text-3xl text-blue-600" />
          </div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
            </div>
            <MdAccessTime className="text-3xl text-yellow-600" />
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Emails Sent</p>
              <p className="text-2xl font-bold text-green-900">{stats.emailsSent}</p>
            </div>
            <MdEmail className="text-3xl text-green-600" />
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">SMS Sent</p>
              <p className="text-2xl font-bold text-purple-900">{stats.smsSent}</p>
            </div>
            <MdSms className="text-3xl text-purple-600" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-4">
        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
            activeTab === 'notifications' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Notifications
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
            activeTab === 'settings' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Settings
        </button>
        <button
          onClick={() => setShowNotificationForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <MdSend />
          <span>Send Notification</span>
        </button>
      </div>

      {/* Send Notification Form */}
      {showNotificationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Send Notification</h3>
            <form onSubmit={handleSendNotification} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={newNotification.type}
                  onChange={(e) => setNewNotification({...newNotification, type: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {notificationTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newNotification.title}
                  onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Notification title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Notification message"
                  required
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipients</label>
                <input
                  type="text"
                  value={newNotification.recipients}
                  onChange={(e) => setNewNotification({...newNotification, recipients: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Email addresses or phone numbers (comma separated)"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
                <select
                  value={newNotification.method}
                  onChange={(e) => setNewNotification({...newNotification, method: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="both">Both</option>
                </select>
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Send Notification
                </button>
                <button
                  type="button"
                  onClick={() => setShowNotificationForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Content based on active tab */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Notifications</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {notifications.map((notification) => {
              const IconComponent = getNotificationIcon(notification.type);
              return (
                <div key={notification.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 p-2 rounded-lg bg-gray-100`}>
                      <IconComponent className={`text-xl ${getNotificationColor(notification.type)}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(notification.status)}`}>
                            {notification.status}
                          </span>
                          <div className="flex items-center space-x-1 text-gray-500">
                            {notification.method === 'email' && <MdEmail className="text-sm" />}
                            {notification.method === 'sms' && <MdSms className="text-sm" />}
                          </div>
                        </div>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                      <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                        <span>To: {notification.recipient}</span>
                        <span>{notification.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Settings</h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                <p className="text-sm text-gray-600">Send notifications via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleSettingsUpdate('emailNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">SMS Notifications</h4>
                <p className="text-sm text-gray-600">Send notifications via SMS</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.smsNotifications}
                  onChange={(e) => handleSettingsUpdate('smsNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Auto Notifications</h4>
                <p className="text-sm text-gray-600">Automatically send notifications for attendance issues</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoNotify}
                  onChange={(e) => handleSettingsUpdate('autoNotify', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Absence Threshold (days)</label>
              <input
                type="number"
                value={settings.absenceThreshold}
                onChange={(e) => handleSettingsUpdate('absenceThreshold', parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max="10"
              />
              <p className="text-xs text-gray-600 mt-1">Send alert after this many consecutive absent days</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Late Threshold (minutes)</label>
              <input
                type="number"
                value={settings.lateThreshold}
                onChange={(e) => handleSettingsUpdate('lateThreshold', parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="5"
                max="120"
              />
              <p className="text-xs text-gray-600 mt-1">Send alert if staff arrives more than this many minutes late</p>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;