import React, { useState, useMemo } from 'react';
import { MdPersonAdd, MdCheckCircle, MdPending, MdSearch, MdFilterList, MdVisibility, MdEdit, MdDelete } from 'react-icons/md';

const Admissions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const admissionData = [
    { id: 'ADM001', name: 'Rahul Sharma', class: '11th', stream: 'Science', status: 'confirmed', date: '2024-01-15', mobile: '9876543210', email: 'rahul@email.com' },
    { id: 'ADM002', name: 'Priya Singh', class: '10th', stream: '', status: 'pending', date: '2024-01-14', mobile: '9876543211', email: 'priya@email.com' },
    { id: 'ADM003', name: 'Sneha Patel', class: '11th', stream: 'Arts', status: 'confirmed', date: '2024-01-13', mobile: '9876543212', email: 'sneha@email.com' },
    { id: 'ADM004', name: 'Amit Kumar', class: '9th', stream: '', status: 'rejected', date: '2024-01-12', mobile: '9876543213', email: 'amit@email.com' },
    { id: 'ADM005', name: 'Kavya Reddy', class: '12th', stream: 'Commerce', status: 'confirmed', date: '2024-01-11', mobile: '9876543214', email: 'kavya@email.com' },
    { id: 'ADM006', name: 'Rohan Gupta', class: '8th', stream: '', status: 'pending', date: '2024-01-10', mobile: '9876543215', email: 'rohan@email.com' },
    { id: 'ADM007', name: 'Ananya Joshi', class: '11th', stream: 'Science', status: 'confirmed', date: '2024-01-09', mobile: '9876543216', email: 'ananya@email.com' },
    { id: 'ADM008', name: 'Vikram Singh', class: '10th', stream: '', status: 'pending', date: '2024-01-08', mobile: '9876543217', email: 'vikram@email.com' },
    { id: 'ADM009', name: 'Meera Nair', class: '12th', stream: 'Arts', status: 'confirmed', date: '2024-01-07', mobile: '9876543218', email: 'meera@email.com' },
    { id: 'ADM010', name: 'Arjun Mehta', class: '9th', stream: '', status: 'rejected', date: '2024-01-06', mobile: '9876543219', email: 'arjun@email.com' },
    { id: 'ADM011', name: 'Pooja Sharma', class: '11th', stream: 'Commerce', status: 'confirmed', date: '2024-01-05', mobile: '9876543220', email: 'pooja@email.com' },
    { id: 'ADM012', name: 'Karan Verma', class: '8th', stream: '', status: 'pending', date: '2024-01-04', mobile: '9876543221', email: 'karan@email.com' }
  ];

  const filteredData = useMemo(() => {
    return admissionData.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.mobile.includes(searchTerm);
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesClass = classFilter === 'all' || item.class === classFilter;
      return matchesSearch && matchesStatus && matchesClass;
    });
  }, [searchTerm, statusFilter, classFilter]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">Admission Management</h2>
        <p className="text-blue-100">Complete admission records with advanced filtering</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Applications</h3>
          <p className="text-3xl font-bold text-blue-600">{admissionData.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Confirmed</h3>
          <p className="text-3xl font-bold text-green-600">{admissionData.filter(item => item.status === 'confirmed').length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600">{admissionData.filter(item => item.status === 'pending').length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Rejected</h3>
          <p className="text-3xl font-bold text-red-600">{admissionData.filter(item => item.status === 'rejected').length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1">
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, ID, or mobile..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Classes</option>
              <option value="8th">8th</option>
              <option value="9th">9th</option>
              <option value="10th">10th</option>
              <option value="11th">11th</option>
              <option value="12th">12th</option>
            </select>
          </div>
        </div>
      </div>

      {/* Admission Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Admission Records ({filteredData.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">ID</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Name</th>
                <th className="hidden sm:table-cell px-3 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Class</th>
                <th className="hidden md:table-cell px-3 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Stream</th>
                <th className="hidden lg:table-cell px-3 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Mobile</th>
                <th className="hidden xl:table-cell px-3 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Email</th>
                <th className="hidden lg:table-cell px-3 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Date</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Status</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    <div className="sm:hidden text-xs text-gray-500">{item.class} {item.stream && `- ${item.stream}`}</div>
                  </td>
                  <td className="hidden sm:table-cell px-3 py-4 whitespace-nowrap text-sm text-gray-700">{item.class}</td>
                  <td className="hidden md:table-cell px-3 py-4 whitespace-nowrap text-sm text-gray-700">{item.stream || '-'}</td>
                  <td className="hidden lg:table-cell px-3 py-4 whitespace-nowrap text-sm text-gray-700">{item.mobile}</td>
                  <td className="hidden xl:table-cell px-3 py-4 whitespace-nowrap text-sm text-gray-700">{item.email}</td>
                  <td className="hidden lg:table-cell px-3 py-4 whitespace-nowrap text-sm text-gray-700">{item.date}</td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-1">
                      <button className="p-1 text-blue-600 hover:bg-blue-100 rounded" title="View">
                        <MdVisibility size={16} />
                      </button>
                      <button className="p-1 text-green-600 hover:bg-green-100 rounded" title="Edit">
                        <MdEdit size={16} />
                      </button>
                      <button className="p-1 text-red-600 hover:bg-red-100 rounded" title="Delete">
                        <MdDelete size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-1 border rounded-lg ${
                  currentPage === index + 1
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admissions;