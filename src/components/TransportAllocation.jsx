import React, { useState, useEffect } from 'react';
import { showSuccess, showError, showConfirm, showToast, showWarning } from '../utils/sweetAlert';
import { FaUsers, FaPlus, FaEdit, FaClipboardList } from 'react-icons/fa';

export default function TransportAllocation() {
  const [allocations, setAllocations] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [routeStops, setRouteStops] = useState([]);
  const [routeCharges, setRouteCharges] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAllocation, setEditingAllocation] = useState(null);
  const [formData, setFormData] = useState({
    studentStaffName: '',
    userType: 'Student',
    route: '',
    stop: '',
    vehicle: '',
    monthlyCharge: '',
    pickupDrop: 'Both',
    joiningDate: '',
    status: 'Active'
  });

  useEffect(() => {
    const savedAllocations = localStorage.getItem('transportAllocations');
    const savedRoutes = localStorage.getItem('routes');
    const savedStops = localStorage.getItem('routeStops');
    const savedCharges = localStorage.getItem('routeCharges');
    const savedAssignments = localStorage.getItem('transportAssignments');
    if (savedAllocations) setAllocations(JSON.parse(savedAllocations));
    if (savedRoutes) setRoutes(JSON.parse(savedRoutes));
    if (savedStops) setRouteStops(JSON.parse(savedStops));
    if (savedCharges) setRouteCharges(JSON.parse(savedCharges));
    if (savedAssignments) setAssignments(JSON.parse(savedAssignments));
  }, []);

  const getStopsForRoute = () => {
    return routeStops.filter(stop => stop.routeName === formData.route);
  };

  const getVehicleForRoute = () => {
    const assignment = assignments.find(a => a.route === formData.route && a.status === 'Active');
    return assignment ? assignment.vehicle : '';
  };

  const getChargeForRouteStop = () => {
    const charge = routeCharges.find(c => 
      c.routeName === formData.route && 
      (c.stopName === formData.stop || c.stopName === '') && 
      c.status === 'Active'
    );
    return charge ? charge.monthlyCharge : '';
  };

  useEffect(() => {
    if (formData.route) {
      const vehicle = getVehicleForRoute();
      setFormData(prev => ({ ...prev, vehicle }));
    }
  }, [formData.route, assignments]);

  useEffect(() => {
    if (formData.route && formData.stop) {
      const charge = getChargeForRouteStop();
      setFormData(prev => ({ ...prev, monthlyCharge: charge }));
    }
  }, [formData.route, formData.stop, routeCharges]);

  const handleAddAllocation = async () => {
    if (routes.length === 0) {
      await showWarning('Routes Required!', 'Please create routes and assignments first!');
      return;
    }
    setShowForm(true);
    setEditingAllocation(null);
    setFormData({
      studentStaffName: '',
      userType: 'Student',
      route: '',
      stop: '',
      vehicle: '',
      monthlyCharge: '',
      pickupDrop: 'Both',
      joiningDate: '',
      status: 'Active'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allocationData = {
      ...formData,
      id: editingAllocation?.id || Date.now(),
      createdDate: editingAllocation ? editingAllocation.createdDate : new Date().toLocaleDateString()
    };
    
    let updatedAllocations;
    if (editingAllocation) {
      updatedAllocations = allocations.map(a => a.id === editingAllocation.id ? allocationData : a);
      await showSuccess('Updated!', 'Transport allocation updated successfully');
    } else {
      updatedAllocations = [...allocations, allocationData];
      await showSuccess('Allocated!', 'Transport allocated successfully');
    }
    
    setAllocations(updatedAllocations);
    localStorage.setItem('transportAllocations', JSON.stringify(updatedAllocations));
    setShowForm(false);
    setEditingAllocation(null);
  };

  const handleEdit = (allocation) => {
    setEditingAllocation(allocation);
    setFormData(allocation);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const result = await showConfirm('Cancel Allocation?', 'This will cancel the transport allocation');
    if (result.isConfirmed) {
      const updatedAllocations = allocations.filter(a => a.id !== id);
      setAllocations(updatedAllocations);
      localStorage.setItem('transportAllocations', JSON.stringify(updatedAllocations));
      showToast('success', 'Allocation cancelled successfully');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-8 border border-white/60">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl">
              <FaUsers className="text-2xl text-blue-600" />
            </div>
            <div>
              <h2 className="text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Transport Allocation</h2>
              <p className="text-gray-600 text-lg mt-1">Allocate transport to students and staff</p>
            </div>
          </div>
          <button
            onClick={handleAddAllocation}
            className="bg-blue-500 text-white px-8 py-4 rounded-2xl hover:bg-blue-600 font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-2"
          >
            <FaPlus /> Allocate Transport
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
            <h3 className="text-2xl font-bold text-gray-800">{editingAllocation ? 'Update Allocation' : 'Allocate Transport'}</h3>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Student / Staff Name *</label>
              <input
                type="text"
                value={formData.studentStaffName}
                onChange={(e) => setFormData({...formData, studentStaffName: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">User Type</label>
              <select
                value={formData.userType}
                onChange={(e) => setFormData({...formData, userType: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-pink-500"
              >
                <option value="Student">Student</option>
                <option value="Staff">Staff</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Route *</label>
              <select
                value={formData.route}
                onChange={(e) => setFormData({...formData, route: e.target.value, stop: '', vehicle: '', monthlyCharge: ''})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-pink-500"
                required
              >
                <option value="">Select Route</option>
                {routes.filter(r => r.status === 'Active').map(route => (
                  <option key={route.id} value={route.routeName}>{route.routeName}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Stop *</label>
              <select
                value={formData.stop}
                onChange={(e) => setFormData({...formData, stop: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-pink-500"
                required
                disabled={!formData.route}
              >
                <option value="">Select Stop</option>
                {getStopsForRoute().map(stop => (
                  <option key={stop.id} value={stop.stopName}>{stop.stopName}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Vehicle (Auto from route)</label>
              <input
                type="text"
                value={formData.vehicle}
                className="w-full border-2 border-gray-200 p-3 rounded-xl bg-gray-100"
                disabled
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Monthly Charge (Auto)</label>
              <input
                type="text"
                value={formData.monthlyCharge ? `₹${formData.monthlyCharge}` : ''}
                className="w-full border-2 border-gray-200 p-3 rounded-xl bg-gray-100"
                disabled
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Pickup / Drop</label>
              <select
                value={formData.pickupDrop}
                onChange={(e) => setFormData({...formData, pickupDrop: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-pink-500"
              >
                <option value="Pickup Only">Pickup Only</option>
                <option value="Drop Only">Drop Only</option>
                <option value="Both">Both</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Joining Date *</label>
              <input
                type="date"
                value={formData.joiningDate}
                onChange={(e) => setFormData({...formData, joiningDate: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-pink-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            
            <div className="md:col-span-2 flex gap-4 mt-4">
              <button
                type="submit"
                className="bg-pink-500 text-white px-6 py-3 rounded-xl hover:bg-pink-600 font-bold"
              >
                {editingAllocation ? 'Update' : 'Allocate'}
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

      {/* Allocations List */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
        <div className="px-8 py-6" style={{backgroundColor: 'rgb(26,37,57)'}}>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <FaClipboardList className="text-white text-lg" />
            </div>
            <h3 className="text-xl font-bold text-white">Transport Allocations ({allocations.length})</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Name</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Type</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Route</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Stop</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Vehicle</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Charge</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Pickup/Drop</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Status</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allocations.map((allocation, index) => (
                <tr key={allocation.id} className={`border-b hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                  <td className="px-4 py-3 font-bold">{allocation.studentStaffName}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      allocation.userType === 'Student' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {allocation.userType}
                    </span>
                  </td>
                  <td className="px-4 py-3">{allocation.route}</td>
                  <td className="px-4 py-3">{allocation.stop}</td>
                  <td className="px-4 py-3">{allocation.vehicle}</td>
                  <td className="px-4 py-3 text-green-600 font-bold">₹{allocation.monthlyCharge}</td>
                  <td className="px-4 py-3">{allocation.pickupDrop}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      allocation.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {allocation.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleEdit(allocation)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 mr-2 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(allocation.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 text-sm"
                    >
                      Cancel
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