import React, { useState, useEffect, useCallback } from 'react';
import {
  FaSearch, FaSpinner, FaUserGraduate, FaSave, FaChartBar
} from 'react-icons/fa';
import { MdRefresh } from 'react-icons/md';
import { toast } from 'react-toastify';
import { examAPI, classAPI } from '../utils/apiService';

const ManageMarks = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [classesList, setClassesList] = useState([]);
  const [schedulesList, setSchedulesList] = useState([]);

  const [selectedClass, setSelectedClass] = useState('');
  const [selectedExam, setSelectedExam] = useState('');

  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});
  const [showTable, setShowTable] = useState(false);
  const [scheduleObj, setScheduleObj] = useState(null);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const [classRes, schedRes] = await Promise.all([
          classAPI.getAll(),
          examAPI.getSchedules({ limit: 200 })
        ]);
        if (classRes.data?.classes) setClassesList(classRes.data.classes);
        if (schedRes.data?.examSchedules) setSchedulesList(schedRes.data.examSchedules);
      } catch {
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const filteredExams = schedulesList.filter(s => {
    if (!selectedClass) return false;
    const cid = s.class?._id || s.class?.toString() || s.class;
    return cid === selectedClass;
  });

  const getGrade = (pct) => {
    if (pct >= 90) return { grade: 'A+', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
    if (pct >= 80) return { grade: 'A',  cls: 'bg-emerald-50 text-emerald-600 border-emerald-200' };
    if (pct >= 70) return { grade: 'B+', cls: 'bg-blue-100 text-blue-700 border-blue-200' };
    if (pct >= 60) return { grade: 'B',  cls: 'bg-blue-50 text-blue-600 border-blue-200' };
    if (pct >= 50) return { grade: 'C',  cls: 'bg-amber-50 text-amber-600 border-amber-200' };
    if (pct >= 33) return { grade: 'D',  cls: 'bg-orange-50 text-orange-600 border-orange-200' };
    return              { grade: 'F',  cls: 'bg-rose-50 text-rose-600 border-rose-200' };
  };

  const handleLoadStudents = useCallback(async () => {
    if (!selectedClass || !selectedExam) {
      toast.warning('Please select Class and Exam');
      return;
    }
    const sched = schedulesList.find(s => s._id === selectedExam);
    setScheduleObj(sched);
    setLoading(true);
    try {
      const sectionId = sched?.section?._id || sched?.section?.toString() || sched?.section;
      const res = await examAPI.getMarks({
        examScheduleId: selectedExam,
        classId: selectedClass,
        ...(sectionId ? { section: sectionId } : {})
      });
      const list = res.data?.students || [];
      setStudents(list);

      // Pre-fill marks saved in DB for this exam
      const saved = {};
      list.forEach(stu => {
        // marks is an array of mark objects: { examSchedule, marksObtained, subject, ... }
        const existingMark = (stu.marks || []).find(m => {
          const mExamId = m.examSchedule?._id
            ? m.examSchedule._id.toString()
            : m.examSchedule?.toString?.() ?? m.examSchedule;
          return mExamId === selectedExam;
        });
        saved[stu._id] = existingMark != null ? String(existingMark.marksObtained) : '';
      });
      setMarks(saved);
      setShowTable(true);
      if (list.length === 0) toast.warn('No students found for this class/exam');
      else toast.success(`${list.length} student(s) loaded`);
    } catch {
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  }, [selectedClass, selectedExam, schedulesList]);

  const handleMarkChange = (studentId, value) => {
    const tm = scheduleObj?.totalMarks || 100;
    if (value !== '' && Number(value) > tm) return;
    setMarks(prev => ({ ...prev, [studentId]: value }));
  };

  const handleSave = async () => {
    const entries = Object.entries(marks).filter(([, v]) => v !== '');
    if (!entries.length) { toast.warning('No marks entered'); return; }
    setSaving(true);
    try {
      await Promise.all(entries.map(([studentId, marksObtained]) =>
        examAPI.updateMarks({
          examScheduleId: selectedExam,
          studentId,
          subject: scheduleObj?.subject || '',
          marksObtained: Number(marksObtained),
          totalMarks: scheduleObj?.totalMarks || 100,
          remarks: 'Entered via Staff Panel'
        })
      ));
      toast.success(`Marks saved for ${entries.length} student(s)`);
      await handleLoadStudents();
    } catch {
      toast.error('Failed to save marks');
    } finally {
      setSaving(false);
    }
  };

  const tm = scheduleObj?.totalMarks || 100;
  const pm = scheduleObj?.passingMarks || 40;
  const entered = Object.values(marks).filter(v => v !== '').map(Number);
  const passCount = entered.filter(m => m >= pm).length;
  const avg = entered.length > 0 ? Math.round(entered.reduce((a, b) => a + b, 0) / entered.length) : 0;
  const topScore = entered.length > 0 ? Math.max(...entered) : 0;

  return (
    <div className="space-y-6 bg-slate-50/50 min-h-screen">
      {(loading || saving) && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[300]">
          <div className="bg-white rounded-2xl px-8 py-6 shadow-2xl flex items-center gap-3">
            <FaSpinner className="animate-spin text-indigo-600 text-2xl" />
            <span className="font-bold text-slate-700 text-sm">
              {saving ? 'Saving marks...' : 'Loading students...'}
            </span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
            <div className="w-2 h-8 bg-indigo-600 rounded-full" />
            Manage Marks
          </h1>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">Enter and save student marks by exam</p>
        </div>
        {showTable && (
          <button onClick={handleLoadStudents} className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all">
            <MdRefresh size={20} />
          </button>
        )}
      </div>

      {/* Filter Panel */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Select Class</label>
            <select
              value={selectedClass}
              onChange={e => { setSelectedClass(e.target.value); setSelectedExam(''); setShowTable(false); }}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all text-sm"
            >
              <option value="">-- Select Class --</option>
              {classesList.map(cls => (
                <option key={cls._id} value={cls._id}>
                  {cls.className}{cls.stream?.length > 0 ? ` (${cls.stream.join(', ')})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Select Exam</label>
            <select
              value={selectedExam}
              onChange={e => { setSelectedExam(e.target.value); setShowTable(false); }}
              disabled={!selectedClass}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all text-sm disabled:opacity-40"
            >
              <option value="">-- Select Exam --</option>
              {filteredExams.map(s => (
                <option key={s._id} value={s._id}>
                  {s.examTitle} — {s.subject} ({s.examType})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleLoadStudents}
              disabled={!selectedClass || !selectedExam || loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-200 active:scale-95"
            >
              <FaSearch size={14} /> Load Students
            </button>
          </div>
        </div>
      </div>

      {showTable && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Students', val: students.length, color: 'indigo' },
              { label: 'Marks Entered', val: entered.length, color: 'blue' },
              { label: 'Students Passing', val: passCount, color: 'emerald' },
              { label: 'Class Average', val: `${avg} / ${tm}`, color: 'purple' },
            ].map((s, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">{s.label}</p>
                <p className={`text-2xl font-black text-${s.color}-600`}>{s.val}</p>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50">
              <div>
                <h3 className="font-black text-slate-800 text-base uppercase tracking-tight">
                  {scheduleObj?.examTitle} — {scheduleObj?.subject}
                </h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">
                  Total Marks: {tm} &nbsp;|&nbsp; Passing Marks: {pm} &nbsp;|&nbsp;
                  Top Score: <span className="text-indigo-600 font-bold">{topScore}</span>
                </p>
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-200 disabled:opacity-50 active:scale-95"
              >
                <FaSave size={14} /> Save All Marks
              </button>
            </div>

            {students.length === 0 ? (
              <div className="py-20 text-center text-slate-400">
                <FaUserGraduate size={40} className="mx-auto mb-4 opacity-20" />
                <p className="font-bold text-sm">No students found</p>
                <p className="text-xs mt-1">Make sure students are enrolled in this class</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      {['#', 'Admission No.', 'Student Name', 'Roll No.', 'Marks (out of ' + tm + ')', 'Grade', 'Result'].map(h => (
                        <th key={h} className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {students.map((stu, idx) => {
                      const val = marks[stu._id] ?? '';
                      const num = val !== '' ? Number(val) : null;
                      const pct = num !== null ? (num / tm) * 100 : null;
                      const passed = num !== null && num >= pm;
                      const gradeInfo = pct !== null ? getGrade(pct) : null;

                      return (
                        <tr key={stu._id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-6 py-4 text-sm font-bold text-slate-400">{idx + 1}</td>
                          <td className="px-6 py-4">
                            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                              {stu.admissionNumber || '—'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                                <FaUserGraduate className="text-indigo-400" size={14} />
                              </div>
                              <div>
                                <p className="font-black text-slate-800 text-sm uppercase">
                                  {stu.firstName} {stu.lastName}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-slate-500">
                            {stu.rollNumber || '—'}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min="0"
                                max={tm}
                                value={val}
                                onChange={e => handleMarkChange(stu._id, e.target.value)}
                                placeholder="0"
                                className="w-20 text-center px-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl font-black text-slate-800 text-base focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all"
                              />
                              <span className="text-xs text-slate-400 font-semibold">/ {tm}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {gradeInfo ? (
                              <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl font-black text-sm border ${gradeInfo.cls}`}>
                                {gradeInfo.grade}
                              </span>
                            ) : (
                              <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl font-bold text-sm bg-slate-100 text-slate-400 border border-slate-200">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {num !== null ? (
                              <span className={`px-3 py-1.5 text-xs font-bold rounded-lg border ${passed ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'}`}>
                                {passed ? '✓ Pass' : '✗ Fail'}
                              </span>
                            ) : (
                              <span className="px-3 py-1.5 text-xs font-bold rounded-lg border bg-slate-50 text-slate-400 border-slate-200">
                                Pending
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {!showTable && !loading && (
        <div className="py-24 flex flex-col items-center justify-center text-slate-300">
          <FaChartBar size={48} className="mb-4 opacity-40" />
          <p className="font-bold text-base text-slate-400">Select a class and exam to load the gradebook</p>
          <p className="text-sm text-slate-300 mt-1">Use the filters above and click "Load Students"</p>
        </div>
      )}
    </div>
  );
};

export default ManageMarks;
