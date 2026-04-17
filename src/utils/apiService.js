import api from './api';

// Admission APIs
export const admissionAPI = {
  getAll: (params) => api.get('/api/staff-panel/admission/all', { params }),
  getById: (id) => api.get(`/api/staff-panel/admission/${id}`),
  create: (data) => api.post('/api/staff-panel/admission/add', data),
  update: (id, data) => api.put(`/api/staff-panel/admission/${id}`, data),
  delete: (id) => api.delete(`/api/staff-panel/admission/${id}`)
};

// Student APIs
export const studentAPI = {
  getAll: (params) => api.get('/api/staff-panel/student/applications', { params }), // Using applications as default "all"
  getById: (id) => api.get(`/api/staff-panel/student/profile/${id}`),
  getVerificationList: (params) => api.get('/api/staff-panel/student/verification-list', { params }),
  verify: (id, data) => api.put(`/api/staff-panel/student/verify/${id}`, data),
  getEnrollmentList: (params) => api.get('/api/staff-panel/student/enrollment-list', { params }),
  enroll: (id, data) => api.put(`/api/staff-panel/student/enroll/${id}`, data),
  update: (id, data) => api.put(`/api/staff-panel/student/profile/${id}`, data),
  delete: (id) => api.delete(`/api/staff-panel/student/${id}`)
};

// Class APIs
export const classAPI = {
  getAll: (params) => api.get('/api/staff-panel/class/all', { params }),
  getById: (id) => api.get(`/api/staff-panel/class/${id}`),
  getStatistics: (id) => api.get(`/api/staff-panel/class/${id}/statistics`)
};

// Fee Collection APIs
export const feeAPI = {
  getAll: (params) => api.get('/api/staff-panel/fee-collection/all', { params }),
  collect: (data) => api.post('/api/staff-panel/fee-collection/collect', data),
  getReceipt: (id) => api.get(`/api/staff-panel/fee-collection/receipt/${id}`),
  getPending: (params) => api.get('/api/staff-panel/fee-collection/pending', { params }),
  getStudentDetails: (studentId) => api.get(`/api/staff-panel/fee-collection/student/${studentId}`)
};

// Notice APIs
export const noticeAPI = {
  getAll: (params) => api.get('/api/staff-panel/notice/all', { params }),
  create: (data) => api.post('/api/staff-panel/notice/add', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => api.put(`/api/staff-panel/notice/${id}`, data),
  delete: (id) => api.delete(`/api/staff-panel/notice/${id}`)
};

// Document APIs
export const documentAPI = {
  getAll: (params) => api.get('/api/staff-panel/documents/all', { params }),
  upload: (data) => api.post('/api/staff-panel/documents/upload', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateStatus: (id, data) => api.put(`/api/staff-panel/documents/status/${id}`, data),
  delete: (id) => api.delete(`/api/staff-panel/documents/${id}`)
};

// Exam APIs
export const examAPI = {
  getSchedules: (params) => api.get('/api/staff-panel/exam-schedule/all', { params }),
  createSchedule: (data) => api.post('/api/staff-panel/exam-schedule/add', data),
  updateSchedule: (id, data) => api.put(`/api/staff-panel/exam-schedule/${id}`, data),
  deleteSchedule: (id) => api.delete(`/api/staff-panel/exam-schedule/${id}`),
  getMarks: (params) => api.get('/api/staff-panel/exam/marks', { params }),
  getMarksHistory: (params) => api.get('/api/staff-panel/exam/marks/history', { params }),
  updateMarks: (data) => api.post('/api/staff-panel/exam/marks/add', data),
  
  // Grading System
  getGrading: () => api.get('/api/staff-panel/exam/grading'),
  createGrading: (data) => api.post('/api/staff-panel/exam/grading', data),
  updateGrading: (id, data) => api.put(`/api/staff-panel/exam/grading/${id}`, data),
  deleteGrading: (id) => api.delete(`/api/staff-panel/exam/grading/${id}`),

  // Online Exam
  getOnlineExams: (params) => api.get('/api/staff-panel/exam/online-exam', { params }),
  getOnlineExamById: (id) => api.get(`/api/staff-panel/exam/online-exam/${id}`),
  createOnlineExam: (data) => api.post('/api/staff-panel/exam/online-exam', data),
  updateOnlineExam: (id, data) => api.put(`/api/staff-panel/exam/online-exam/${id}`, data),
  deleteOnlineExam: (id) => api.delete(`/api/staff-panel/exam/online-exam/${id}`)
};

// ID Card APIs
export const idCardAPI = {
  generate: (data) => api.post('/api/staff-panel/id-card/generate', data),
  download: (id) => api.get(`/api/staff-panel/id-card/${id}/download`, { responseType: 'blob' })
};

// Dashboard APIs
export const dashboardAPI = {
  getStats: () => api.get('/api/staff-panel/dashboard/stats'),
  getRecentActivities: () => api.get('/api/staff-panel/dashboard/activities')
};

// Hostel APIs
export const hostelAPI = {
  getAll: (params) => api.get('/api/staff-panel/hostel/hostels', { params }),
  create: (data) => api.post('/api/staff-panel/hostel/hostels', data),
  update: (id, data) => api.put(`/api/staff-panel/hostel/hostels/${id}`, data),
  delete: (id) => api.delete(`/api/staff-panel/hostel/hostels/${id}`),
  getRoomTypes: (params) => api.get('/api/staff-panel/hostel/room-types', { params }),
  getRooms: (params) => api.get('/api/staff-panel/hostel/rooms', { params }),
  getAllocations: (params) => api.get('/api/staff-panel/hostel/allocations', { params }),
  allocate: (data) => api.post('/api/staff-panel/hostel/allocations', data),
  getWardens: (params) => api.get('/api/staff-panel/hostel/wardens', { params })
};

// Transport APIs
export const transportAPI = {
  // Vehicles
  getVehicles: (params) => api.get('/api/staff-panel/transport/vehicles', { params }),
  createVehicle: (data) => api.post('/api/staff-panel/transport/vehicles', data),
  updateVehicle: (id, data) => api.put(`/api/staff-panel/transport/vehicles/${id}`, data),
  deleteVehicle: (id) => api.delete(`/api/staff-panel/transport/vehicles/${id}`),

  // Drivers
  getDrivers: (params) => api.get('/api/staff-panel/transport/drivers', { params }),
  createDriver: (data) => api.post('/api/staff-panel/transport/drivers', data),
  updateDriver: (id, data) => api.put(`/api/staff-panel/transport/drivers/${id}`, data),
  deleteDriver: (id) => api.delete(`/api/staff-panel/transport/drivers/${id}`),

  // Routes
  getRoutes: (params) => api.get('/api/staff-panel/transport/routes', { params }),
  createRoute: (data) => api.post('/api/staff-panel/transport/routes', data),
  updateRoute: (id, data) => api.put(`/api/staff-panel/transport/routes/${id}`, data),
  deleteRoute: (id) => api.delete(`/api/staff-panel/transport/routes/${id}`),

  // Route Stops
  getRouteStops: (params) => api.get('/api/staff-panel/transport/route-stops', { params }),
  createRouteStop: (data) => api.post('/api/staff-panel/transport/route-stops', data),
  updateRouteStop: (id, data) => api.put(`/api/staff-panel/transport/route-stops/${id}`, data),
  deleteRouteStop: (id) => api.delete(`/api/staff-panel/transport/route-stops/${id}`),

  // Route Charges
  getRouteCharges: (params) => api.get('/api/staff-panel/transport/route-charges', { params }),
  createRouteCharge: (data) => api.post('/api/staff-panel/transport/route-charges', data),
  updateRouteCharge: (id, data) => api.put(`/api/staff-panel/transport/route-charges/${id}`, data),
  deleteRouteCharge: (id) => api.delete(`/api/staff-panel/transport/route-charges/${id}`),

  // Assignments
  getAssignments: (params) => api.get('/api/staff-panel/transport/assignments', { params }),
  createAssignment: (data) => api.post('/api/staff-panel/transport/assignments', data),
  updateAssignment: (id, data) => api.put(`/api/staff-panel/transport/assignments/${id}`, data),
  deleteAssignment: (id) => api.delete(`/api/staff-panel/transport/assignments/${id}`),

  // Allocations
  getAllocations: (params) => api.get('/api/staff-panel/transport/allocations', { params }),
  createTransportAllocation: (data) => api.post('/api/staff-panel/transport/allocations', data),
  updateTransportAllocation: (id, data) => api.put(`/api/staff-panel/transport/allocations/${id}`, data),
  deleteTransportAllocation: (id) => api.delete(`/api/staff-panel/transport/allocations/${id}`),

  // Driver Salaries
  getDriverSalaries: (params) => api.get('/api/transport-panel/salary-docs/salary/all', { params }),
  upsertDriverSalary: (data) => api.post('/api/transport-panel/salary-docs/salary/save', data),
  deleteDriverSalary: (id) => api.delete(`/api/transport-panel/salary-docs/salary/${id}`)
};

// Teacher Management APIs
export const teacherAPI = {
  getAll: (params) => api.get('/api/staff-panel/teacher-management', { params }),
  getById: (id) => api.get(`/api/staff-panel/teacher-management/${id}`),
  create: (data) => api.post('/api/staff-panel/teacher-management', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => api.put(`/api/staff-panel/teacher-management/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/api/staff-panel/teacher-management/${id}`),
  
  // Teacher Attendance
  getAttendance: (params) => api.get('/api/staff-panel/teacher-attendance/all', { params }),
  getAttendanceById: (id) => api.get(`/api/staff-panel/teacher-attendance/${id}`),
  markAttendance: (data) => api.post('/api/staff-panel/teacher-attendance/mark', data),
  updateAttendance: (id, data) => api.put(`/api/staff-panel/teacher-attendance/${id}`, data),
  deleteAttendance: (id) => api.delete(`/api/staff-panel/teacher-attendance/${id}`),
  getAttendanceReport: () => api.get('/api/staff-panel/teacher-attendance/report'),
  getHistoryByName: (name) => api.get(`/api/staff-panel/teacher-attendance/teacher/${name}`)
};

// Salary Management APIs
export const salaryAPI = {
  getAll: (params) => api.get('/api/staff-panel/salary', { params }),
  getById: (id) => api.get(`/api/staff-panel/salary/${id}`),
  create: (data) => api.post('/api/staff-panel/salary', data),
  update: (id, data) => api.put(`/api/staff-panel/salary/${id}`, data),
  delete: (id) => api.delete(`/api/staff-panel/salary/${id}`),
  generate: (data) => api.post('/api/staff-panel/salary', data), 
  pay: (id, data) => api.put(`/api/staff-panel/salary/${id}`, data)
};

// Performance Evaluation APIs
export const performanceAPI = {
  getAll: (params) => api.get('/api/staff-panel/performance-evaluation', { params }),
  getReport: () => api.get('/api/staff-panel/performance-evaluation/report'),
  getById: (id) => api.get(`/api/staff-panel/performance-evaluation/${id}`),
  create: (data) => api.post('/api/staff-panel/performance-evaluation', data),
  update: (id, data) => api.put(`/api/staff-panel/performance-evaluation/${id}`, data),
  delete: (id) => api.delete(`/api/staff-panel/performance-evaluation/${id}`)
};

// E-Learning APIs
export const eLearningAPI = {
  getCourses: (params) => api.get('/api/staff-panel/e-learning', { params }),
  getQuizzes: (params) => api.get('/api/staff-panel/e-learning/quizzes', { params }),
  createQuiz: (data) => api.post('/api/staff-panel/e-learning/quizzes', data)
};

// Event APIs
export const eventAPI = {
  getAll: (params) => api.get('/api/event', { params }),
  create: (data) => api.post('/api/event', data),
  update: (id, data) => api.put(`/api/event/${id}`, data),
  delete: (id) => api.delete(`/api/event/${id}`)
};

// Alumni APIs
export const alumniAPI = {
  getAll: (params) => api.get('/api/alumni', { params }),
  create: (data) => api.post('/api/alumni', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => api.put(`/api/alumni/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/api/alumni/${id}`)
};

// Leave Management APIs
export const leaveAPI = {
  getAll: (params) => api.get('/api/leave/all', { params }),
  create: (data) => api.post('/api/leave/apply', data),
  update: (id, data) => api.put(`/api/leave/update/${id}`, data),
  updateStatus: (id, status) => api.patch(`/api/leave/${id}/status`, { status }),
  delete: (id) => api.delete(`/api/leave/${id}`)
};

// Attendance APIs (Generic/Student)
export const attendanceAPI = {
  getAll: (params) => api.get('/api/attendance/all', { params }),
  mark: (data) => api.post('/api/attendance/mark', data),
  getReport: (params) => api.get('/api/attendance/report', { params }),
  getStudents: (params) => api.get('/api/attendance/students', { params }),
  getByDate: (params) => api.get('/api/attendance/by-date', { params }),
  delete: (id) => api.delete(`/api/attendance/${id}`)
};


// Fee Reports APIs
export const feeReportAPI = {
  getAll: (params) => api.get('/api/fee-report', { params }),
  download: (params) => api.get('/api/fee-report/download', { params, responseType: 'blob' })
};

// Librarian APIs
export const librarianAPI = {
  getLibrarians: (params) => api.get('/api/staff-panel/librarian', { params }),
  createLibrarian: (data) => api.post('/api/staff-panel/librarian', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateLibrarian: (id, data) => api.put(`/api/staff-panel/librarian/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteLibrarian: (id) => api.delete(`/api/staff-panel/librarian/${id}`)
};

// Library Asset & Management APIs
export const libraryAPI = {
  // Stats & Dashboard
  getDashboard: () => api.get('/api/staff-panel/library/dashboard/stats'),
  getStats: () => api.get('/api/staff-panel/library/dashboard/stats'),
  getOverdue: () => api.get('/api/staff-panel/library/book-issues/overdue'),

  // Books
  getBooks: (params) => api.get('/api/staff-panel/library/books', { params }),
  addBook: (data) => api.post('/api/library-panel/book/add', data),
  updateBook: (id, data) => api.put(`/api/library-panel/book/${id}`, data),
  deleteBook: (id) => api.delete(`/api/library-panel/book/${id}`),
  getBookById: (id) => api.get(`/api/staff-panel/library/books/${id}`),

  // Members
  getMembers: (params) => api.get('/api/staff-panel/library/members', { params }),
  addMember: (data) => api.post('/api/library-panel/member/add', data),
  updateMember: (id, data) => api.put(`/api/library-panel/member/${id}`, data),
  deleteMember: (id) => api.delete(`/api/library-panel/member/${id}`),

  // Transactions (Issue/Return)
  getIssuedBooks: (params) => api.get('/api/staff-panel/library/book-issues', { params }),
  issueBook: (data) => api.post('/api/library-panel/book-issue/issue', data),
  returnBook: (data) => api.post('/api/library-panel/book-issue/return', data),
  extendDue: (id, data) => api.put(`/api/admin-panel/library/extend/${id}`, data),

  // Requests
  getRequests: (params) => api.get('/api/staff-panel/library/book-requests', { params }),
  approveRequest: (id) => api.put(`/api/library-panel/book-request/approve/${id}`),
  rejectRequest: (id) => api.delete(`/api/library-panel/book-request/${id}`),

  // Students
  getStudents: (params) => api.get('/api/staff-panel/library/students', { params }),

  // Library Cards
  getLibraryCards: (params) => api.get('/api/staff-panel/library/library-cards', { params }),

  // Reports
  getReports: (params) => api.get('/api/staff-panel/library/reports', { params }),
  getDueSoon: () => api.get('/api/staff-panel/library/book-issues/due-soon'),
  getMemberHistory: (memberId) => api.get(`/api/staff-panel/library/members/${memberId}/history`),
  getBookHistory: (bookId) => api.get(`/api/staff-panel/library/books/${bookId}/history`)
};

// Report APIs
export const reportAPI = {
  getAll: (params) => api.get('/api/staff-panel/report', { params }),
  generate: (type, params) => api.get(`/api/staff-panel/report/${type}`, { params }),
  download: (type, params) => api.get(`/api/staff-panel/report/${type}/download`, { 
    params, 
    responseType: 'blob' 
  })
};

// Timetable APIs
export const timetableAPI = {
  getAll: (params) => api.get('/api/staff-panel/timetable/all', { params }),
  getByDay: (day) => api.get(`/api/staff-panel/timetable/day/${day}`),
  add: (data) => api.post('/api/staff-panel/timetable/add', data),
  update: (id, data) => api.put(`/api/staff-panel/timetable/${id}`, data),
  delete: (id) => api.delete(`/api/staff-panel/timetable/${id}`)
};

// Notification APIs
export const notificationAPI = {
  getAll: () => api.get('/api/staff-panel/notification'),
  create: (data) => api.post('/api/staff-panel/notification', data),
  getSettings: () => api.get('/api/staff-panel/notification/settings'),
  updateSettings: (data) => api.put('/api/staff-panel/notification/settings', data)
};

// Parent Credentials APIs
export const parentCredentialsAPI = {
  create: (data) => api.post('/api/parent-student', data),
  getByStudent: (studentId) => api.get(`/api/parent-student/student/${studentId}`),
  update: (id, data) => api.put(`/api/parent-student/${id}`, data),
  delete: (id) => api.delete(`/api/parent-student/${id}`)
};

export default {
  admissionAPI,
  studentAPI,
  classAPI,
  feeAPI,
  noticeAPI,
  documentAPI,
  examAPI,
  idCardAPI,
  dashboardAPI,
  hostelAPI,
  transportAPI,
  teacherAPI,
  salaryAPI,
  performanceAPI,
  eLearningAPI,
  eventAPI,
  alumniAPI,
  leaveAPI,
  attendanceAPI,
  feeReportAPI,
  librarianAPI,
  libraryAPI,
  reportAPI,
  timetableAPI,
  notificationAPI
};
