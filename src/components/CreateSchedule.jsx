import React, { useState } from 'react';
import { MdAdd, MdEdit, MdDelete, MdCalendarToday, MdAccessTime, MdClass, MdSubject } from 'react-icons/md';
import Swal from 'sweetalert2';

const CreateSchedule = () => {
  const [schedules, setSchedules] = useState([
    {
      id: 1,
      examTitle: 'Mid Term Examination',
      examType: 'Mid Term',
      class: '10th Grade',
      section: 'A',
      subject: 'Mathematics',
      date: '2024-02-15',
      day: 'Thursday',
      startTime: '09:00',
      endTime: '12:00',
      duration: '3 hours',
      room: 'Room 101',
      hall: 'Main Hall',
      invigilator: 'Mr. Smith',
      totalMarks: 100,
      passingMarks: 40,
      instructions: 'Bring calculator and geometry box'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [formData, setFormData] = useState({
    examTitle: '',
    examType: '',
    class: '',
    section: '',
    subject: '',
    date: '',
    startTime: '',
    endTime: '',
    room: '',
    hall: '',
    invigilator: '',
    totalMarks: 100,
    passingMarks: 40,
    instructions: ''
  });

  const examTypes = ['Unit Test', 'Mid Term', 'Final Exam', 'Pre-Board', 'Board Exam'];
  const subjects = ['Mathematics', 'Science', 'English', 'History', 'Geography', 'Physics', 'Chemistry', 'Biology'];
  const sections = ['A', 'B', 'C', 'D'];
  const rooms = ['Room 101', 'Room 102', 'Room 103', 'Room 104'];
  const halls = ['Main Hall', 'Science Lab', 'Computer Lab', 'Library Hall'];

  // Dynamic classes based on exam type
  const getClassesByExamType = (examType) => {
    if (examType === 'Board Exam' || examType === 'Pre-Board') {
      return ['10th Grade', '12th Grade'];
    }
    return ['9th Grade', '10th Grade', '11th Grade', '12th Grade'];
  };

  // Check if section field should be shown
  const shouldShowSection = (examType) => {
    return examType !== 'Board Exam' && examType !== 'Pre-Board';
  };

  const showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg text-white font-medium ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } shadow-lg transform transition-all duration-300`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  };

  const getDayFromDate = (dateString) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(dateString);
    return days[date.getDay()];
  };

  const calculateDuration = (start, end) => {
    const startTime = new Date(`2000-01-01T${start}`);
    const endTime = new Date(`2000-01-01T${end}`);
    const diffMs = endTime - startTime;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return diffMinutes > 0 ? `${diffHours}h ${diffMinutes}m` : `${diffHours}h`;
  };

  const handleExamTypeChange = (examType) => {
    setFormData({
      ...formData,
      examType,
      class: '', // Reset class when exam type changes
      section: (examType === 'Board Exam' || examType === 'Pre-Board') ? '' : formData.section // Clear section for board/pre-board exams
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const day = getDayFromDate(formData.date);
    const duration = calculateDuration(formData.startTime, formData.endTime);

    const scheduleData = {
      ...formData,
      day,
      duration,
      totalMarks: parseInt(formData.totalMarks),
      passingMarks: parseInt(formData.passingMarks)
    };

    if (editingSchedule) {
      setSchedules(schedules.map(schedule => 
        schedule.id === editingSchedule.id 
          ? { ...scheduleData, id: editingSchedule.id }
          : schedule
      ));
      setEditingSchedule(null);
      showToast('Exam schedule updated successfully!');
    } else {
      setSchedules([...schedules, {
        ...scheduleData,
        id: Date.now()
      }]);
      showToast('Exam schedule created successfully!');
    }

    setFormData({
      examTitle: '',
      examType: '',
      class: '',
      section: '',
      subject: '',
      date: '',
      startTime: '',
      endTime: '',
      room: '',
      hall: '',
      invigilator: '',
      totalMarks: 100,
      passingMarks: 40,
      instructions: ''
    });
    setShowForm(false);
  };

  const handleEdit = (schedule) => {
    setFormData(schedule);
    setEditingSchedule(schedule);
    setShowForm(true);
    // Scroll to form after state update
    setTimeout(() => {
      document.querySelector('.edit-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleDelete = (id) => {
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
        setSchedules(schedules.filter(schedule => schedule.id !== id));
        Swal.fire('Deleted!', 'Exam schedule has been deleted.', 'success');
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Exam Schedule Management</h3>
          <p className="text-gray-600">Create and manage detailed exam schedules</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setTimeout(() => {
              document.querySelector('.edit-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
        >
          <MdAdd />
          <span>Create Schedule</span>
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-gray-50 rounded-lg p-6 border edit-form">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            {editingSchedule ? 'Edit Exam Schedule' : 'Create New Exam Schedule'}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Exam Information */}
            <div className="bg-white p-4 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-3">Exam Information</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Exam Title</label>
                  <input
                    type="text"
                    value={formData.examTitle}
                    onChange={(e) => setFormData({...formData, examTitle: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Mid Term Examination"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
                  <select
                    value={formData.examType}
                    onChange={(e) => handleExamTypeChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Exam Type</option>
                    {examTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Class and Subject Information */}
            <div className="bg-white p-4 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-3">Class & Subject Details</h5>
              <div className={`grid grid-cols-1 gap-4 ${shouldShowSection(formData.examType) ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                  <select
                    value={formData.class}
                    onChange={(e) => setFormData({...formData, class: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={!formData.examType}
                  >
                    <option value="">Select Class</option>
                    {getClassesByExamType(formData.examType).map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                  {(formData.examType === 'Board Exam' || formData.examType === 'Pre-Board') && (
                    <p className="text-xs text-blue-600 mt-1">Only 10th & 12th available for {formData.examType}s</p>
                  )}
                </div>
                {shouldShowSection(formData.examType) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                    <select
                      value={formData.section}
                      onChange={(e) => setFormData({...formData, section: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Section</option>
                      {sections.map(section => (
                        <option key={section} value={section}>{section}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Date and Time Information */}
            <div className="bg-white p-4 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-3">Schedule Details</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {formData.date && (
                    <p className="text-xs text-gray-500 mt-1">Day: {getDayFromDate(formData.date)}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {formData.startTime && formData.endTime && (
                    <p className="text-xs text-gray-500 mt-1">Duration: {calculateDuration(formData.startTime, formData.endTime)}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Venue and Supervision */}
            <div className="bg-white p-4 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-3">Venue & Supervision</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
                  <select
                    value={formData.room}
                    onChange={(e) => setFormData({...formData, room: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Room</option>
                    {rooms.map(room => (
                      <option key={room} value={room}>{room}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hall/Lab</label>
                  <select
                    value={formData.hall}
                    onChange={(e) => setFormData({...formData, hall: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Hall</option>
                    {halls.map(hall => (
                      <option key={hall} value={hall}>{hall}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Invigilator</label>
                  <input
                    type="text"
                    value={formData.invigilator}
                    onChange={(e) => setFormData({...formData, invigilator: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Teacher name"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Marks and Instructions */}
            <div className="bg-white p-4 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-3">Marks & Instructions</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={formData.totalMarks}
                    onChange={(e) => setFormData({...formData, totalMarks: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Passing Marks</label>
                  <input
                    type="number"
                    value={formData.passingMarks}
                    onChange={(e) => setFormData({...formData, passingMarks: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    required
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
                <textarea
                  value={formData.instructions}
                  onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Any special instructions for students..."
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors duration-200"
              >
                {editingSchedule ? 'Update Schedule' : 'Create Schedule'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingSchedule(null);
                  setFormData({
                    examTitle: '',
                    examType: '',
                    class: '',
                    section: '',
                    subject: '',
                    date: '',
                    startTime: '',
                    endTime: '',
                    room: '',
                    hall: '',
                    invigilator: '',
                    totalMarks: 100,
                    passingMarks: 40,
                    instructions: ''
                  });
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Schedule List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="border border-gray-200 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam Title</th>
                <th className="border border-gray-200 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="border border-gray-200 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="border border-gray-200 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                <th className="border border-gray-200 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="border border-gray-200 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="border border-gray-200 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                <th className="border border-gray-200 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
                <th className="border border-gray-200 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Time</th>
                <th className="border border-gray-200 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="border border-gray-200 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                <th className="border border-gray-200 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hall</th>
                <th className="border border-gray-200 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invigilator</th>
                <th className="border border-gray-200 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Marks</th>
                <th className="border border-gray-200 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pass Marks</th>
                <th className="border border-gray-200 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {schedules.map((schedule) => (
                <tr key={schedule.id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-6 py-4 text-sm text-gray-900">{schedule.examTitle}</td>
                  <td className="border border-gray-200 px-6 py-4">
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                      {schedule.examType}
                    </span>
                  </td>
                  <td className="border border-gray-200 px-6 py-4 text-sm text-gray-900">{schedule.class}</td>
                  <td className="border border-gray-200 px-6 py-4 text-sm text-gray-900">
                    {schedule.section || '-'}
                  </td>
                  <td className="border border-gray-200 px-6 py-4 text-sm text-gray-900">{schedule.subject}</td>
                  <td className="border border-gray-200 px-6 py-4 text-sm text-gray-900">
                    {new Date(schedule.date).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-200 px-6 py-4 text-sm text-gray-600">{schedule.day}</td>
                  <td className="border border-gray-200 px-6 py-4 text-sm text-gray-900">{schedule.startTime}</td>
                  <td className="border border-gray-200 px-6 py-4 text-sm text-gray-900">{schedule.endTime}</td>
                  <td className="border border-gray-200 px-6 py-4 text-sm text-gray-600">{schedule.duration}</td>
                  <td className="border border-gray-200 px-6 py-4 text-sm text-gray-900">{schedule.room}</td>
                  <td className="border border-gray-200 px-6 py-4 text-sm text-gray-900">{schedule.hall}</td>
                  <td className="border border-gray-200 px-6 py-4 text-sm text-gray-900">{schedule.invigilator}</td>
                  <td className="border border-gray-200 px-6 py-4 text-sm text-gray-900">{schedule.totalMarks}</td>
                  <td className="border border-gray-200 px-6 py-4 text-sm text-gray-900">{schedule.passingMarks}</td>
                  <td className="border border-gray-200 px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(schedule)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Edit"
                      >
                        <MdEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(schedule.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete"
                      >
                        <MdDelete />
                      </button>
                    </div>
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

export default CreateSchedule;