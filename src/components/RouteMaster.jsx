import React, { useState, useEffect } from 'react';
import { showSuccess, showError, showConfirm, showToast } from '../utils/sweetAlert';
import { FaMapMarkedAlt, FaPlus, FaEdit, FaClipboardList, FaMap, FaTable } from 'react-icons/fa';

export default function RouteMaster() {
  const [routes, setRoutes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'map'
  const [formData, setFormData] = useState({
    routeName: '',
    routeCode: '',
    startPoint: '',
    endPoint: '',
    totalDistance: '',
    status: 'Active'
  });

  useEffect(() => {
    const savedRoutes = localStorage.getItem('routes');
    if (savedRoutes) {
      setRoutes(JSON.parse(savedRoutes));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const routeData = {
      ...formData,
      id: editingRoute?.id || Date.now(),
      createdDate: editingRoute ? editingRoute.createdDate : new Date().toLocaleDateString()
    };
    
    let updatedRoutes;
    if (editingRoute) {
      updatedRoutes = routes.map(r => r.id === editingRoute.id ? routeData : r);
      await showSuccess('Updated!', 'Route information updated successfully');
    } else {
      updatedRoutes = [...routes, routeData];
      await showSuccess('Created!', 'New route added successfully');
    }
    
    setRoutes(updatedRoutes);
    localStorage.setItem('routes', JSON.stringify(updatedRoutes));
    setShowForm(false);
    setEditingRoute(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      routeName: '',
      routeCode: '',
      startPoint: '',
      endPoint: '',
      totalDistance: '',
      status: 'Active'
    });
  };

  const handleEdit = (route) => {
    console.log('Editing route:', route); // Debug log
    setEditingRoute(route);
    setFormData({
      routeName: route.routeName || '',
      routeCode: route.routeCode || '',
      startPoint: route.startPoint || '',
      endPoint: route.endPoint || '',
      totalDistance: route.totalDistance || '',
      status: route.status || 'Active'
    });
    setShowForm(true);
    // Scroll to form
    setTimeout(() => {
      const formElement = document.querySelector('[data-form-container]');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleDelete = async (id) => {
    const result = await showConfirm('Delete Route?', 'This will permanently delete the route record');
    if (result.isConfirmed) {
      const updatedRoutes = routes.filter(r => r.id !== id);
      setRoutes(updatedRoutes);
      localStorage.setItem('routes', JSON.stringify(updatedRoutes));
      showToast('success', 'Route deleted successfully');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-8 border border-white/60">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl">
              <FaMapMarkedAlt className="text-2xl text-blue-600" />
            </div>
            <div>
              <h2 className="text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Route Master</h2>
              <p className="text-gray-600 text-lg mt-1">Manage transport routes efficiently</p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingRoute(null);
              resetForm();
            }}
            className="bg-blue-500 text-white px-8 py-4 rounded-2xl hover:bg-blue-600 font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-2"
          >
            <FaPlus /> Add Route
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div data-form-container className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-8 border border-white/60">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <FaEdit className="text-xl text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{editingRoute ? 'Update Route' : 'Add New Route'}</h3>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Route Name *</label>
              <input
                type="text"
                value={formData.routeName}
                onChange={(e) => setFormData({...formData, routeName: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Route Code</label>
              <input
                type="text"
                value={formData.routeCode}
                onChange={(e) => setFormData({...formData, routeCode: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., RT001"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Start Point</label>
              <input
                type="text"
                value={formData.startPoint}
                onChange={(e) => setFormData({...formData, startPoint: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">End Point</label>
              <input
                type="text"
                value={formData.endPoint}
                onChange={(e) => setFormData({...formData, endPoint: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Total Distance (KM)</label>
              <input
                type="number"
                value={formData.totalDistance}
                onChange={(e) => setFormData({...formData, totalDistance: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-purple-500"
                min="0"
                step="0.1"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-purple-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            
            <div className="md:col-span-2 flex gap-4 mt-4">
              <button
                type="submit"
                className="bg-purple-500 text-white px-6 py-3 rounded-xl hover:bg-purple-600 font-bold"
              >
                {editingRoute ? 'Update' : 'Save'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 font-bold"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingRoute(null);
                  resetForm();
                }}
                className="bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 font-bold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Route List */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
        <div className="px-8 py-6" style={{backgroundColor: 'rgb(26,37,57)'}}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <FaClipboardList className="text-white text-lg" />
              </div>
              <h3 className="text-xl font-bold text-white">Route List ({routes.length})</h3>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-xl p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  viewMode === 'table' 
                    ? 'bg-white text-gray-800 shadow-lg' 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <FaTable /> Table View
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  viewMode === 'map' 
                    ? 'bg-white text-gray-800 shadow-lg' 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <FaMap /> Map View
              </button>
            </div>
          </div>
        </div>
        {viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-gray-800">Route Name</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-800">Route Code</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-800">Start Point</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-800">End Point</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-800">Distance</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-800">Status</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-800">Actions</th>
                </tr>
              </thead>
              <tbody>
                {routes.map((route, index) => (
                  <tr key={route.id} className={`border-b hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    <td className="px-4 py-3 font-bold">{route.routeName}</td>
                    <td className="px-4 py-3">{route.routeCode}</td>
                    <td className="px-4 py-3">{route.startPoint}</td>
                    <td className="px-4 py-3">{route.endPoint}</td>
                    <td className="px-4 py-3">{route.totalDistance} KM</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        route.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {route.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex flex-col gap-1 justify-center">
                      <button
                        onClick={() => handleEdit(route)}
                        className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 mr-2 text-sm "
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(route.id)}
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
        ) : (
          <div className="p-8">
            {routes.length === 0 ? (
              <div className="text-center py-12">
                <FaMapMarkedAlt className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium">No routes to display on map</p>
                <p className="text-gray-400">Add some routes to see them visualized</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {routes.map((route, index) => (
                  <div key={route.id} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                        <FaMapMarkedAlt className="text-white text-xl" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 text-lg">{route.routeName}</h4>
                        <p className="text-blue-600 font-medium">{route.routeCode}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 font-medium">Start:</span>
                        <span className="font-bold text-green-600">{route.startPoint}</span>
                      </div>
                      <div className="w-full h-1 bg-gradient-to-r from-green-400 to-red-400 rounded-full"></div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 font-medium">End:</span>
                        <span className="font-bold text-red-600">{route.endPoint}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-blue-200">
                        <span className="text-gray-600 font-medium">Distance:</span>
                        <span className="font-bold text-blue-600">{route.totalDistance} KM</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 font-medium">Status:</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          route.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {route.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4 pt-4 border-t border-blue-200">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleEdit(route);
                        }}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 font-medium transition-all flex items-center justify-center gap-2"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDelete(route.id);
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 font-medium transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}