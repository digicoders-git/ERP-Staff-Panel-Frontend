import React, { useState, useEffect } from 'react';
import { showSuccess, showError, showConfirm, showToast, showWarning } from '../utils/sweetAlert';
import { FaCog, FaPlus, FaEdit, FaClipboardList } from 'react-icons/fa';

export default function TransportAssignment() {
  const [assignments, setAssignments] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [formData, setFormData] = useState({
    vehicle: '',
    driver: '',
    route: '',
    shift: 'Morning',
    fromDate: '',
    toDate: '',
    status: 'Active'
  });

  useEffect(() => {
    const savedAssignments = localStorage.getItem('transportAssignments');
    const savedVehicles = localStorage.getItem('vehicles');
    const savedDrivers = localStorage.getItem('drivers');
    const savedRoutes = localStorage.getItem('routes');
    if (savedAssignments) setAssignments(JSON.parse(savedAssignments));
    if (savedVehicles) setVehicles(JSON.parse(savedVehicles));
    if (savedDrivers) setDrivers(JSON.parse(savedDrivers));
    if (savedRoutes) setRoutes(JSON.parse(savedRoutes));
  }, []);

  const handleAddAssignment = async () => {
    if (vehicles.length === 0 || drivers.length === 0 || routes.length === 0) {
      await showWarning('Prerequisites Missing!', 'Please create vehicles, drivers, and routes first!');
      return;
    }
    setShowForm(true);
    setEditingAssignment(null);
    setFormData({
      vehicle: '',
      driver: '',
      route: '',
      shift: 'Morning',
      fromDate: '',
      toDate: '',
      status: 'Active'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const assignmentData = {
      ...formData,
      id: editingAssignment?.id || Date.now(),
      createdDate: editingAssignment ? editingAssignment.createdDate : new Date().toLocaleDateString()
    };
    
    let updatedAssignments;
    if (editingAssignment) {
      updatedAssignments = assignments.map(a => a.id === editingAssignment.id ? assignmentData : a);
      await showSuccess('Updated!', 'Transport assignment updated successfully');
    } else {
      updatedAssignments = [...assignments, assignmentData];
      await showSuccess('Created!', 'New transport assignment created successfully');
    }
    
    setAssignments(updatedAssignments);
    localStorage.setItem('transportAssignments', JSON.stringify(updatedAssignments));
    setShowForm(false);
    setEditingAssignment(null);
  };

  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
    setFormData(assignment);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const result = await showConfirm('Delete Assignment?', 'This will permanently delete the transport assignment');
    if (result.isConfirmed) {
      const updatedAssignments = assignments.filter(a => a.id !== id);
      setAssignments(updatedAssignments);
      localStorage.setItem('transportAssignments', JSON.stringify(updatedAssignments));
      showToast('success', 'Assignment deleted successfully');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-8 border border-white/60">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl">
              <FaCog className="text-2xl text-blue-600" />
            </div>
            <div>
              <h2 className="text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Transport Assignment</h2>
              <p className="text-gray-600 text-lg mt-1">Assign vehicles, drivers, and routes</p>
            </div>
          </div>
          <button
            onClick={handleAddAssignment}
            className="bg-blue-500 text-white px-8 py-4 rounded-2xl hover:bg-blue-600 font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-2"
          >
            <FaPlus /> Create Assignment
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-8 border border-white/60">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <FaEdit className="text-xl text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{editingAssignment ? 'Update Assignment' : 'Create New Assignment'}</h3>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Vehicle (Active only) *</label>
              <select
                value={formData.vehicle}
                onChange={(e) => setFormData({...formData, vehicle: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-teal-500"
                required
              >
                <option value="">Select Vehicle</option>
                {vehicles.filter(v => v.status === 'Active').map(vehicle => (
                  <option key={vehicle.id} value={vehicle.vehicleNumber}>
                    {vehicle.vehicleNumber} - {vehicle.vehicleType}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Driver *</label>
              <select
                value={formData.driver}
                onChange={(e) => setFormData({...formData, driver: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-teal-500"
                required
              >
                <option value="">Select Driver</option>
                {drivers.filter(d => d.status === 'Active').map(driver => (
                  <option key={driver.id} value={driver.driverName}>
                    {driver.driverName} - {driver.licenseNumber}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Route *</label>
              <select
                value={formData.route}
                onChange={(e) => setFormData({...formData, route: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-teal-500"
                required
              >
                <option value="">Select Route</option>
                {routes.filter(r => r.status === 'Active').map(route => (
                  <option key={route.id} value={route.routeName}>
                    {route.routeName} - {route.routeCode}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Shift</label>
              <select
                value={formData.shift}
                onChange={(e) => setFormData({...formData, shift: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-teal-500"
              >
                <option value="Morning">Morning</option>
                <option value="Evening">Evening</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">From Date *</label>
              <input
                type="date"
                value={formData.fromDate}
                onChange={(e) => setFormData({...formData, fromDate: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">To Date (Optional)</label>
              <input
                type="date"
                value={formData.toDate}
                onChange={(e) => setFormData({...formData, toDate: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-teal-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-teal-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            
            <div className="md:col-span-2 flex gap-4 mt-4">
              <button
                type="submit"
                className="bg-teal-500 text-white px-6 py-3 rounded-xl hover:bg-teal-600 font-bold"
              >
                {editingAssignment ? 'Update' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 font-bold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Assignments List */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
        <div className="px-8 py-6" style={{backgroundColor: 'rgb(26,37,57)'}}>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <FaClipboardList className="text-white text-lg" />
            </div>
            <h3 className="text-xl font-bold text-white">Transport Assignments ({assignments.length})</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Vehicle</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Driver</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Route</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Shift</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">From Date</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">To Date</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Status</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment, index) => (
                <tr key={assignment.id} className={`border-b hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                  <td className="px-4 py-3 font-bold">{assignment.vehicle}</td>
                  <td className="px-4 py-3">{assignment.driver}</td>
                  <td className="px-4 py-3">{assignment.route}</td>
                  <td className="px-4 py-3">{assignment.shift}</td>
                  <td className="px-4 py-3">{assignment.fromDate}</td>
                  <td className="px-4 py-3">{assignment.toDate || 'Ongoing'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      assignment.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {assignment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleEdit(assignment)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 mr-2 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(assignment.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}