import React, { useState, useEffect } from 'react';
import { showSuccess, showError, showConfirm, showToast, showWarning } from '../utils/sweetAlert';
import { FaMoneyBillWave, FaPlus, FaEdit, FaClipboardList } from 'react-icons/fa';

export default function RouteCharges() {
  const [routeCharges, setRouteCharges] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [routeStops, setRouteStops] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCharge, setEditingCharge] = useState(null);
  const [formData, setFormData] = useState({
    routeName: '',
    stopName: '',
    monthlyCharge: '',
    tripType: 'Two Way',
    effectiveFromDate: '',
    status: 'Active'
  });

  useEffect(() => {
    const savedCharges = localStorage.getItem('routeCharges');
    const savedRoutes = localStorage.getItem('routes');
    const savedStops = localStorage.getItem('routeStops');
    if (savedCharges) setRouteCharges(JSON.parse(savedCharges));
    if (savedRoutes) setRoutes(JSON.parse(savedRoutes));
    if (savedStops) setRouteStops(JSON.parse(savedStops));
  }, []);

  const getStopsForRoute = () => {
    return routeStops.filter(stop => stop.routeName === formData.routeName);
  };

  const handleAddCharge = async () => {
    if (routes.length === 0) {
      await showWarning('Routes Required!', 'Please create routes first in Route Master!');
      return;
    }
    setShowForm(true);
    setEditingCharge(null);
    setFormData({
      routeName: '',
      stopName: '',
      monthlyCharge: '',
      tripType: 'Two Way',
      effectiveFromDate: '',
      status: 'Active'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const chargeData = {
      ...formData,
      id: editingCharge?.id || Date.now(),
      createdDate: editingCharge ? editingCharge.createdDate : new Date().toLocaleDateString()
    };
    
    let updatedCharges;
    if (editingCharge) {
      updatedCharges = routeCharges.map(c => c.id === editingCharge.id ? chargeData : c);
      await showSuccess('Updated!', 'Route charge updated successfully');
    } else {
      updatedCharges = [...routeCharges, chargeData];
      await showSuccess('Created!', 'New route charge added successfully');
    }
    
    setRouteCharges(updatedCharges);
    localStorage.setItem('routeCharges', JSON.stringify(updatedCharges));
    setShowForm(false);
    setEditingCharge(null);
  };

  const handleEdit = (charge) => {
    setEditingCharge(charge);
    setFormData(charge);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const result = await showConfirm('Delete Route Charge?', 'This will permanently delete the route charge');
    if (result.isConfirmed) {
      const updatedCharges = routeCharges.filter(c => c.id !== id);
      setRouteCharges(updatedCharges);
      localStorage.setItem('routeCharges', JSON.stringify(updatedCharges));
      showToast('success', 'Route charge deleted successfully');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-8 border border-white/60">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl">
              <FaMoneyBillWave className="text-2xl text-blue-600" />
            </div>
            <div>
              <h2 className="text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Route Charge Setup</h2>
              <p className="text-gray-600 text-lg mt-1">Setup charges for routes and stops</p>
            </div>
          </div>
          <button
            onClick={handleAddCharge}
            className="bg-blue-500 text-white px-8 py-4 rounded-2xl hover:bg-blue-600 font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-2"
          >
            <FaPlus /> Add Route Charge
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
            <h3 className="text-2xl font-bold text-gray-800">{editingCharge ? 'Update Route Charge' : 'Add New Route Charge'}</h3>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Route Name *</label>
              <select
                value={formData.routeName}
                onChange={(e) => setFormData({...formData, routeName: e.target.value, stopName: ''})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select Route</option>
                {routes.filter(r => r.status === 'Active').map(route => (
                  <option key={route.id} value={route.routeName}>{route.routeName}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Stop Name (Optional)</label>
              <select
                value={formData.stopName}
                onChange={(e) => setFormData({...formData, stopName: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500"
                disabled={!formData.routeName}
              >
                <option value="">All Stops</option>
                {getStopsForRoute().map(stop => (
                  <option key={stop.id} value={stop.stopName}>{stop.stopName}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Monthly Charge *</label>
              <input
                type="number"
                value={formData.monthlyCharge}
                onChange={(e) => setFormData({...formData, monthlyCharge: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500"
                min="0"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Trip Type</label>
              <select
                value={formData.tripType}
                onChange={(e) => setFormData({...formData, tripType: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500"
              >
                <option value="One Way">One Way</option>
                <option value="Two Way">Two Way</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Effective From Date</label>
              <input
                type="date"
                value={formData.effectiveFromDate}
                onChange={(e) => setFormData({...formData, effectiveFromDate: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            
            <div className="md:col-span-2 flex gap-4 mt-4">
              <button
                type="submit"
                className="bg-indigo-500 text-white px-6 py-3 rounded-xl hover:bg-indigo-600 font-bold"
              >
                {editingCharge ? 'Update' : 'Save'}
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

      {/* Route Charges List */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
        <div className="px-8 py-6" style={{backgroundColor: 'rgb(26,37,57)'}}>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <FaClipboardList className="text-white text-lg" />
            </div>
            <h3 className="text-xl font-bold text-white">Route Charges List ({routeCharges.length})</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Route Name</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Stop Name</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Monthly Charge</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Trip Type</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Effective Date</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Status</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              {routeCharges.map((charge, index) => (
                <tr key={charge.id} className={`border-b hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                  <td className="px-4 py-3 font-bold">{charge.routeName}</td>
                  <td className="px-4 py-3">{charge.stopName || 'All Stops'}</td>
                  <td className="px-4 py-3 text-green-600 font-bold">₹{parseInt(charge.monthlyCharge || 0).toLocaleString()}</td>
                  <td className="px-4 py-3">{charge.tripType}</td>
                  <td className="px-4 py-3">{charge.effectiveFromDate}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      charge.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {charge.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleEdit(charge)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 mr-2 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(charge.id)}
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