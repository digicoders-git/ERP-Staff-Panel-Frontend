import React, { useState, useEffect } from 'react';
import { MdHome, MdAdd, MdEdit, MdDelete, MdHotel, MdLayers, MdMeetingRoom, MdSearch, MdInfo, MdClose } from 'react-icons/md';
import { hostelAPI } from '../utils/apiService';
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';
import Swal from 'sweetalert2';

export default function RoomManagement() {
  const [rooms, setRooms] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    hostel: '',
    floorNo: '',
    roomNo: '',
    roomType: '',
    capacity: 0,
    monthlyRent: 0,
    status: 'available'
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [roomsRes, hostelsRes, typesRes] = await Promise.all([
        hostelAPI.getRooms(),
        hostelAPI.getAll(),
        hostelAPI.getRoomTypes()
      ]);
      setRooms(roomsRes.data.rooms || []);
      setHostels(hostelsRes.data.hostels || []);
      setRoomTypes(typesRes.data.roomTypes || []);
    } catch (err) {
      toast.error('Residential records synchronization failure');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formData.roomType && roomTypes.length > 0) {
      const selectedRoomType = roomTypes.find(rt => rt._id === formData.roomType);
      if (selectedRoomType) {
        setFormData(prev => ({
          ...prev,
          capacity: selectedRoomType.capacity,
          monthlyRent: selectedRoomType.monthlyRent
        }));
      }
    }
  }, [formData.roomType, roomTypes]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'floorNo' || name === 'capacity' || name === 'monthlyRent' ? (value === '' ? '' : Number(value)) : value
    }));
  };

  const resetForm = () => {
    setFormData({
      hostel: hostels[0]?._id || '',
      floorNo: '',
      roomNo: '',
      roomType: roomTypes[0]?._id || '',
      capacity: 0,
      monthlyRent: 0,
      status: 'available'
    });
    setEditingId(null);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEditModal = (room) => {
    setFormData({
      hostel: room.hostel?._id || '',
      floorNo: room.floorNo || '',
      roomNo: room.roomNo || '',
      roomType: room.roomType?._id || '',
      capacity: room.capacity || 0,
      monthlyRent: room.monthlyRent || 0,
      status: room.status || 'available'
    });
    setEditingId(room._id);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.hostel) {
      toast.error('Please select a hostel');
      return;
    }
    if (!formData.roomType) {
      toast.error('Please select a room type');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...formData,
        floorNo: Number(formData.floorNo)
      };

      if (editingId) {
        await hostelAPI.updateRoom(editingId, payload);
        toast.success('Room record updated successfully!');
      } else {
        await hostelAPI.createRoom(payload);
        toast.success('New room created successfully!');
      }
      setShowModal(false);
      resetForm();
      fetchInitialData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Room inventory transaction failure');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Remove Room Record?',
      text: 'This operation will permanently delete this room record from the inventory.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          await hostelAPI.deleteRoom(id);
          toast.success('Room record removed successfully');
          fetchInitialData();
        } catch (error) {
          toast.error(error.response?.data?.message || 'Failed to remove room record');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const filteredRooms = rooms.filter(r => 
    r.roomNo?.toString().includes(searchTerm) ||
    r.hostel?.hostelName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-800 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full -mr-40 -mt-40 blur-3xl opacity-50" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-xl">
              <MdHotel size={40} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black mb-2 tracking-tight">Room Inventory</h1>
              <p className="text-indigo-200 font-medium text-lg">Coordinate dormitory room allocations, floor mapping, and vacancy status</p>
            </div>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="px-8 py-4 bg-white text-indigo-900 hover:bg-indigo-50 font-black rounded-2xl shadow-lg transition duration-200 flex items-center gap-2"
          >
            <MdAdd size={24} />
            <span>Add New Room</span>
          </button>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center z-[100]">
          <FaSpinner className="animate-spin text-indigo-600 text-5xl" />
        </div>
      )}

      {/* Records Table */}
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-8 bg-slate-50/30">
          <div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Residential Records</h3>
            <p className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-widest">Active Inventory: {rooms.length} Units</p>
          </div>
          
          <div className="relative w-full md:w-96 group">
            <MdSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={24} />
            <input
              type="text"
              placeholder="Search Room Record..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 transition-all outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50/50">
                <th className="px-10 py-6 text-left">Dormitory Unit</th>
                <th className="px-6 py-6 font-center">Structural Floor</th>
                <th className="px-6 py-6 font-center">Identity No</th>
                <th className="px-6 py-6 font-center">Classification</th>
                <th className="px-6 py-6 font-center">Occupancy Capacity</th>
                <th className="px-6 py-6 font-center">Fiscal Rent</th>
                <th className="px-6 py-6 font-center">Protocol Status</th>
                <th className="px-6 py-6 font-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRooms.length > 0 ? filteredRooms.map((room) => (
                <tr key={room._id} className="hover:bg-indigo-50/20 transition-all group">
                  <td className="px-10 py-8 text-left">
                    <div className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{room.hostel?.hostelName || 'Unmapped'}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">School Dormitory</div>
                  </td>
                  <td className="px-6 py-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg text-xs font-black text-slate-600 border border-slate-200">
                      <MdLayers size={14} className="text-slate-400" />
                      L-{room.floorNo}
                    </div>
                  </td>
                  <td className="px-6 py-8">
                    <div className="text-sm font-black text-slate-800">{room.roomNo}</div>
                  </td>
                  <td className="px-6 py-8">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{room.roomType?.roomTypeName || 'General'}</span>
                      <span className="text-[9px] text-slate-400 font-bold">Res. Category</span>
                    </div>
                  </td>
                  <td className="px-6 py-8">
                    <div className="flex flex-col items-center gap-1">
                      <div className="text-sm font-black text-slate-800 tabular-nums">{room.capacity} Beds</div>
                    </div>
                  </td>
                  <td className="px-6 py-8">
                    <span className="text-sm font-black text-emerald-600 tabular-nums">₹{room.monthlyRent?.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-8">
                    <div className="flex justify-center">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border ${
                        room.status === 'available' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        room.status === 'occupied' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                        'bg-amber-50 text-amber-700 border-amber-100'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          room.status === 'available' ? 'bg-emerald-500 animate-pulse' :
                          room.status === 'occupied' ? 'bg-rose-500' : 'bg-amber-500'
                        }`} />
                        {room.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-8">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleOpenEditModal(room)}
                        className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                        title="Edit Room"
                      >
                        <MdEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(room._id)}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        title="Delete Room"
                      >
                        <MdDelete size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="8" className="px-10 py-32 text-center">
                    <div className="flex flex-col items-center gap-6 opacity-30">
                      <MdHotel size={80} className="text-slate-200" />
                      <div>
                        <p className="text-sm font-black uppercase tracking-[0.3em] mb-2 text-slate-400">Inventory Empty</p>
                        <p className="text-[10px] font-bold text-slate-300 tracking-widest">MANIFEST NEW ROOM RECORD TO INITIALIZE RESIDENTIAL MATRIX</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100">
            <div className="bg-gradient-to-r from-slate-900 to-indigo-900 p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">{editingId ? 'Edit Room Record' : 'Add New Room'}</h3>
                <p className="text-xs text-indigo-200 mt-1">Provide room configuration parameters</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white transition-colors">
                <MdClose size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Hostel / Dormitory</label>
                  <select
                    name="hostel"
                    value={formData.hostel}
                    onChange={handleInputChange}
                    required
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 transition outline-none text-sm"
                  >
                    <option value="">Select Hostel</option>
                    {hostels.map(h => (
                      <option key={h._id} value={h._id}>{h.hostelName}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Floor Number</label>
                    <input
                      type="number"
                      name="floorNo"
                      value={formData.floorNo}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 transition outline-none text-sm"
                      placeholder="e.g., 2"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Room Number</label>
                    <input
                      type="text"
                      name="roomNo"
                      value={formData.roomNo}
                      onChange={handleInputChange}
                      required
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 transition outline-none text-sm"
                      placeholder="e.g., 205"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Room Type Category</label>
                  <select
                    name="roomType"
                    value={formData.roomType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 transition outline-none text-sm"
                  >
                    <option value="">Select Room Type</option>
                    {roomTypes.map(rt => (
                      <option key={rt._id} value={rt._id}>{rt.roomTypeName}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Capacity (Beds)</label>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      required
                      min="1"
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 transition outline-none text-sm bg-slate-100"
                      placeholder="Auto-populated"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Monthly Rent (₹)</label>
                    <input
                      type="number"
                      name="monthlyRent"
                      value={formData.monthlyRent}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 transition outline-none text-sm bg-slate-100"
                      placeholder="Auto-populated"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Room Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 transition outline-none text-sm"
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3.5 bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold rounded-xl transition text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3.5 bg-gradient-to-r from-slate-900 to-indigo-900 text-white hover:opacity-95 font-bold rounded-xl transition text-sm shadow-md"
                >
                  {editingId ? 'Update Room' : 'Save Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}