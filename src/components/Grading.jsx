import React, { useState, useEffect } from 'react';
import { MdAdd, MdEdit, MdDelete, MdSave, MdCancel, MdAutoGraph, MdFilterList, MdInfoOutline, MdGrade, MdCheckCircle } from 'react-icons/md';
import Swal from 'sweetalert2';
import { examAPI } from '../utils/apiService';
import { FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Grading = () => {
  const [loading, setLoading] = useState(false);
  const [gradingList, setGradingList] = useState([]);
  const [editingGradeId, setEditingGradeId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    gradeName: '',
    minPercentage: '',
    maxPercentage: '',
    gradePoint: '',
    description: ''
  });

  useEffect(() => {
    fetchGrading();
  }, []);

  const fetchGrading = async () => {
    try {
      setLoading(true);
      const res = await examAPI.getGrading();
      if (res.data && res.data.grading) {
        setGradingList(res.data.grading);
      }
    } catch (err) {
      toast.error('Assessment engine synchronization failure');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingGradeId) {
        await examAPI.updateGrading(editingGradeId, formData);
        toast.success('CRITERIA UPDATED: Assessment protocol synchronized.');
      } else {
        await examAPI.createGrading(formData);
        toast.success('NEW TIER ESTABLISHED: Scholastic standards extended.');
      }
      setShowAddForm(false);
      setEditingGradeId(null);
      resetForm();
      fetchGrading();
    } catch (err) {
      toast.error('Grading protocol anomaly detected');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (grade) => {
    setEditingGradeId(grade._id);
    setFormData({
      gradeName: grade.gradeName,
      minPercentage: grade.minPercentage,
      maxPercentage: grade.maxPercentage,
      gradePoint: grade.gradePoint,
      description: grade.description
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Decommission Tier?',
      text: "This action will recalibrate institutional scholastic calculations.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e293b',
      cancelButtonColor: '#f43f5e',
      confirmButtonText: 'PURGE CRITERIA'
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        await examAPI.deleteGrading(id);
        toast.success('TIER PURGED: Criteria manifest updated.');
        fetchGrading();
      } catch (err) {
        toast.error('Decommission protocol interrupted');
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      gradeName: '',
      minPercentage: 0,
      maxPercentage: 0,
      gradePoint: 0.0,
      description: ''
    });
  };

  const sortedGrading = [...gradingList].sort((a, b) => b.minPercentage - a.minPercentage);

  return (
    <div className="space-y-10">
      {loading && !showAddForm && (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-[100] backdrop-blur-[2px]">
          <FaSpinner className="animate-spin text-indigo-600 text-5xl" />
        </div>
      )}

      {/* Control Manifold */}
      <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-200/50 shadow-inner flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-6">
           <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center border border-slate-100 group">
              <MdAutoGraph size={36} className="text-indigo-600 group-hover:scale-110 transition-transform duration-500" />
           </div>
           <div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tighter italic">Assessment Protocol</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1.5 leading-none">Global Standards & GPA Manifest v4.2</p>
           </div>
        </div>
        
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full md:w-auto px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-black transition-all shadow-2xl shadow-slate-200 flex items-center justify-center gap-3 active:scale-95"
          >
            <MdAdd size={22} />
            Establish Tier
          </button>
        )}
      </div>

      {/* Criteria Manifold (Form) */}
      {showAddForm && (
        <div className="bg-white rounded-[3.5rem] p-12 shadow-2xl border border-indigo-50 animate-in fade-in slide-in-from-top-4 duration-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 opacity-40 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex justify-between items-center mb-10 pb-6 border-b border-slate-100">
            <div>
              <h4 className="text-2xl font-black text-slate-800 tracking-tighter italic">
                {editingGradeId ? 'Recalibrate Criteria' : 'Manifest New Performance Tier'}
              </h4>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2 leading-none italic opacity-60">Authorized Scholastic Entry Portal</p>
            </div>
            <button onClick={() => { setShowAddForm(false); setEditingGradeId(null); resetForm(); }} className="p-4 bg-slate-50 text-slate-400 hover:text-rose-600 rounded-2xl transition-all">
              <MdCancel size={24} />
            </button>
          </div>

          <form onSubmit={handleSave} className="relative z-10 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Tier Identifier</label>
                <input
                  type="text"
                  value={formData.gradeName}
                  onChange={(e) => setFormData({...formData, gradeName: e.target.value})}
                  className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent rounded-[1.8rem] focus:bg-white focus:border-indigo-600 transition-all outline-none font-black text-slate-800 uppercase text-center text-xl shadow-inner"
                  placeholder="A+"
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center block">Threshold (Min%)</label>
                <input
                  type="number"
                  value={formData.minPercentage}
                  onChange={(e) => setFormData({...formData, minPercentage: e.target.value})}
                  className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent rounded-[1.8rem] text-center font-black text-slate-800 text-xl outline-none focus:bg-white focus:border-indigo-600 shadow-inner"
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center block">Upper Bind (Max%)</label>
                <input
                  type="number"
                  value={formData.maxPercentage}
                  onChange={(e) => setFormData({...formData, maxPercentage: e.target.value})}
                  className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent rounded-[1.8rem] text-center font-black text-slate-800 text-xl outline-none focus:bg-white focus:border-indigo-600 shadow-inner"
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center block">GPA Constant</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.gradePoint}
                  onChange={(e) => setFormData({...formData, gradePoint: e.target.value})}
                  className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent rounded-[1.8rem] text-center font-black text-indigo-600 text-xl outline-none focus:bg-white focus:border-indigo-600 shadow-inner"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Qualitative Definition / Context</label>
               <textarea
                 rows="3"
                 value={formData.description}
                 onChange={(e) => setFormData({...formData, description: e.target.value})}
                 className="w-full px-8 py-6 bg-slate-50 border-2 border-transparent rounded-[2rem] outline-none focus:bg-white focus:border-indigo-600 font-bold text-slate-700 transition-all shadow-inner resize-none"
                 placeholder="Provide institutional clarification for this tier..."
               />
            </div>

            <div className="flex gap-4 pt-6">
               <button
                  type="button"
                  onClick={() => { setShowAddForm(false); setEditingGradeId(null); resetForm(); }}
                  className="flex-1 py-6 bg-slate-100 text-slate-500 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-slate-200 transition-all active:scale-95"
               >
                  Deauthorize Changes
               </button>
               <button
                  type="submit"
                  className="flex-[2] bg-slate-900 hover:bg-indigo-600 text-white py-6 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] transition-all shadow-2xl shadow-slate-200 active:scale-95"
               >
                  {editingGradeId ? 'Sync Criteria' : 'Manifest Assessment Tier'}
               </button>
            </div>
          </form>
        </div>
      )}

      {/* Grading Matrix (Table) */}
      <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden min-h-[400px] relative">
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
            <FaSpinner className="animate-spin text-indigo-600 text-4xl" />
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50/50 border-b border-slate-100">
                <th className="px-12 py-8">Performance Tier</th>
                <th className="px-12 py-8">Range Matrix</th>
                <th className="px-12 py-8 text-center">GPA Constant</th>
                <th className="px-12 py-8">Qualitative Context</th>
                <th className="px-12 py-8 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sortedGrading.map((grade) => (
                <tr key={grade._id} className="hover:bg-slate-50/30 transition-all group">
                  <td className="px-12 py-8">
                    <div className="flex items-center gap-4">
                       <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                          <span className="text-2xl font-black italic tracking-tighter">{grade.gradeName}</span>
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest italic leading-none">Status: Active</span>
                       </div>
                    </div>
                  </td>
                  <td className="px-12 py-8">
                    <div className="flex flex-col gap-1.5">
                       <div className="flex items-center gap-3">
                          <span className="text-sm font-black text-slate-800">{grade.minPercentage}%</span>
                          <div className="w-10 h-[2px] bg-indigo-500/20 rounded-full overflow-hidden">
                             <div className="h-full bg-indigo-500 w-full animate-pulse" />
                          </div>
                          <span className="text-sm font-black text-slate-800">{grade.maxPercentage}%</span>
                       </div>
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest opacity-60">Normalized Manifest Range</span>
                    </div>
                  </td>
                  <td className="px-12 py-8 text-center">
                    <div className="inline-block px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                       <span className="text-lg font-black tracking-tighter leading-none italic">
                         {grade.gradePoint.toFixed(1)}
                       </span>
                    </div>
                  </td>
                  <td className="px-12 py-8">
                    <p className="text-xs font-bold text-slate-500 max-w-sm leading-relaxed group-hover:text-slate-800 transition-colors">
                       {grade.description || 'No specialized criteria provided for this performance tier.'}
                    </p>
                  </td>
                  <td className="px-12 py-8">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                      <button onClick={() => handleEdit(grade)} className="p-4 bg-white text-indigo-600 rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-lg border border-slate-100 active:scale-90 shadow-indigo-100"><MdEdit size={20} /></button>
                      <button onClick={() => handleDelete(grade._id)} className="p-4 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all border border-rose-100 active:scale-90"><MdDelete size={20} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {sortedGrading.length === 0 && !loading && (
                <tr>
                   <td colSpan="5" className="py-40 text-center">
                      <div className="flex flex-col items-center gap-8 opacity-20">
                         <div className="w-24 h-24 bg-slate-100 rounded-[2rem] flex items-center justify-center">
                            <MdGrade size={56} className="text-slate-400" />
                         </div>
                         <p className="text-sm font-black uppercase tracking-[0.5em] text-slate-800">Criteria Void: Initialize Standards</p>
                      </div>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Protocol Disclosure */}
      <div className="bg-indigo-950 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl group-hover:scale-150 transition-transform duration-1000" />
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex items-center gap-8">
               <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10">
                  <MdInfoOutline size={32} className="text-indigo-300" />
               </div>
               <div>
                  <h4 className="text-2xl font-black italic tracking-tighter">Scholastic Normalization Protocol</h4>
                  <p className="text-indigo-200/60 font-medium mt-1">GPA and Tier indices are automatically applied to the Scholasic Registry upon manifest finalization.</p>
               </div>
            </div>
            <button className="px-8 py-4 bg-indigo-500 text-white rounded-2xl font-black text-[10px] uppercase tracking_widest hover:bg-indigo-400 transition-all shadow-xl shadow-indigo-500/20 active:scale-95">
               Audit Standards
            </button>
         </div>
      </div>
    </div>
  );
};

export default Grading;