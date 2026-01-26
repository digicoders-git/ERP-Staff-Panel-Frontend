import React, { useState } from 'react';
import {
    MdAdd,
    MdDelete,
    MdEdit,
    MdSave,
    MdCancel,
    MdComputer,
    MdQuiz,
    MdDescription,
    MdTimer,
    MdCheckCircle,
    MdBarChart,
    MdArrowBack
} from 'react-icons/md';

const OnlineExam = () => {
    const [view, setView] = useState('list'); // 'list', 'create', 'results'
    const [examType, setExamType] = useState('MCQ'); // 'MCQ', 'Subjective'
    const [exams, setExams] = useState([
        {
            id: 1,
            title: 'Term 1 Mathematics',
            subject: 'Mathematics',
            class: '10th',
            type: 'MCQ',
            duration: '60',
            totalMarks: 50,
            status: 'Active',
            date: '2026-02-15'
        },
        {
            id: 2,
            title: 'English Literature Essay',
            subject: 'English',
            class: '12th',
            type: 'Subjective',
            duration: '90',
            totalMarks: 100,
            status: 'Draft',
            date: '2026-02-20'
        }
    ]);

    const [newExam, setNewExam] = useState({
        title: '',
        subject: '',
        class: '',
        duration: '',
        type: 'MCQ',
        questions: []
    });

    const [currentQuestion, setCurrentQuestion] = useState({
        text: '',
        type: 'MCQ',
        options: ['', '', '', ''],
        correctAnswer: 0,
        marks: 1
    });

    const [selectedExam, setSelectedExam] = useState(null);
    const [resultsData, setResultsData] = useState([
        { id: 1, studentName: 'Rahul Sharma', rollNo: '101', score: 45, total: 50, timeTaken: '45 mins', submittedAt: '2026-02-15 10:30 AM' },
        { id: 2, studentName: 'Priya Verma', rollNo: '102', score: 38, total: 50, timeTaken: '52 mins', submittedAt: '2026-02-15 11:15 AM' },
        { id: 3, studentName: 'Amit Patel', rollNo: '103', score: 48, total: 50, timeTaken: '38 mins', submittedAt: '2026-02-15 09:45 AM' }
    ]);

    const handleAddQuestion = () => {
        if (currentQuestion.text.trim()) {
            setNewExam({
                ...newExam,
                questions: [...newExam.questions, { ...currentQuestion, id: Date.now() }]
            });
            setCurrentQuestion({
                text: '',
                type: examType,
                options: ['', '', '', ''],
                correctAnswer: 0,
                marks: 1
            });
        }
    };

    const handleSaveExam = () => {
        if (newExam.title && newExam.questions.length > 0) {
            setExams([...exams, { ...newExam, id: exams.length + 1, status: 'Active', date: new Date().toISOString().split('T')[0], totalMarks: newExam.questions.reduce((acc, q) => acc + parseInt(q.marks), 0) }]);
            setView('list');
            setNewExam({ title: '', subject: '', class: '', duration: '', type: 'MCQ', questions: [] });
        }
    };

    const openResults = (exam) => {
        setSelectedExam(exam);
        setView('results');
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {view === 'list' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Online Exams</h2>
                            <p className="text-gray-600">Create and manage your digital assessments</p>
                        </div>
                        <button
                            onClick={() => setView('create')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-all shadow-md"
                        >
                            <MdAdd className="text-xl" />
                            <span>Create New Exam</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {exams.map((exam) => (
                            <div key={exam.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-2 rounded-lg ${exam.type === 'MCQ' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'}`}>
                                        {exam.type === 'MCQ' ? <MdQuiz size={24} /> : <MdDescription size={24} />}
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${exam.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {exam.status}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-1">{exam.title}</h3>
                                <p className="text-sm text-gray-500 mb-4">{exam.subject} • Class {exam.class}</p>

                                <div className="space-y-2 mb-6 text-sm text-gray-600">
                                    <div className="flex items-center space-x-2">
                                        <MdTimer />
                                        <span>{exam.duration} Minutes</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <MdCheckCircle />
                                        <span>{exam.totalMarks} Total Marks</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                                    <button
                                        onClick={() => openResults(exam)}
                                        className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center space-x-1"
                                    >
                                        <MdBarChart />
                                        <span>Results</span>
                                    </button>
                                    <div className="flex space-x-2">
                                        <button className="p-2 text-gray-400 hover:text-gray-600"><MdEdit /></button>
                                        <button className="p-2 text-gray-400 hover:text-red-600"><MdDelete /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {view === 'create' && (
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-5xl mx-auto">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setView('list')}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <MdArrowBack size={24} />
                            </button>
                            <div>
                                <h2 className="text-2xl font-bold">Configure New Exam</h2>
                                <p className="text-blue-100 text-sm opacity-90">Set up your exam details and questions</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Exam Title</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Final Semester Physics"
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        value={newExam.title}
                                        onChange={(e) => setNewExam({ ...newExam, title: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
                                        <input
                                            type="text"
                                            placeholder="Subject"
                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            value={newExam.subject}
                                            onChange={(e) => setNewExam({ ...newExam, subject: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Class</label>
                                        <input
                                            type="text"
                                            placeholder="Class"
                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            value={newExam.class}
                                            onChange={(e) => setNewExam({ ...newExam, class: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Duration (Min)</label>
                                        <input
                                            type="number"
                                            placeholder="60"
                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            value={newExam.duration}
                                            onChange={(e) => setNewExam({ ...newExam, duration: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Exam Type</label>
                                        <select
                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            value={examType}
                                            onChange={(e) => {
                                                setExamType(e.target.value);
                                                setCurrentQuestion({ ...currentQuestion, type: e.target.value });
                                                setNewExam({ ...newExam, type: e.target.value });
                                            }}
                                        >
                                            <option value="MCQ">MCQ (Auto-graded)</option>
                                            <option value="Subjective">Subjective (Manual Grading)</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                    <p className="text-xs text-blue-800 leading-relaxed font-medium">
                                        {examType === 'MCQ'
                                            ? "MCQ exams provide instant results to students upon submission. You must define correct answers for each question."
                                            : "Subjective exams allow students to write long-form answers. Teachers must manually grade these after submission."}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-8">
                            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                                <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">
                                    {newExam.questions.length + 1}
                                </span>
                                Add Question
                            </h3>

                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <div className="space-y-4">
                                    <div>
                                        <textarea
                                            placeholder="Enter question text here..."
                                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[100px] shadow-sm"
                                            value={currentQuestion.text}
                                            onChange={(e) => setCurrentQuestion({ ...currentQuestion, text: e.target.value })}
                                        ></textarea>
                                    </div>

                                    {examType === 'MCQ' ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {currentQuestion.options.map((option, idx) => (
                                                <div key={idx} className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                                                    <input
                                                        type="radio"
                                                        name="correctOpt"
                                                        checked={currentQuestion.correctAnswer === idx}
                                                        onChange={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: idx })}
                                                        className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder={`Option ${idx + 1}`}
                                                        className="w-full text-sm outline-none"
                                                        value={option}
                                                        onChange={(e) => {
                                                            const newOpts = [...currentQuestion.options];
                                                            newOpts[idx] = e.target.value;
                                                            setCurrentQuestion({ ...currentQuestion, options: newOpts });
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-white p-4 rounded-xl border border-dashed border-gray-300">
                                            <p className="text-gray-400 text-sm italic">Students will see a rich-text editor to provide their subjective response.</p>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center space-x-2">
                                            <label className="text-sm font-semibold text-gray-700">Marks:</label>
                                            <input
                                                type="number"
                                                className="w-16 px-2 py-1 border rounded"
                                                value={currentQuestion.marks}
                                                onChange={(e) => setCurrentQuestion({ ...currentQuestion, marks: e.target.value })}
                                            />
                                        </div>
                                        <button
                                            onClick={handleAddQuestion}
                                            className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-6 py-2 rounded-lg font-semibold transition-colors shadow-lg shadow-blue-200"
                                        >
                                            Save Question
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {newExam.questions.length > 0 && (
                                <div className="mt-10 space-y-4">
                                    <h4 className="font-bold text-gray-700">Question List ({newExam.questions.length})</h4>
                                    {newExam.questions.map((q, idx) => (
                                        <div key={idx} className="bg-white border-l-4 border-blue-500 p-4 rounded-lg shadow-sm flex justify-between items-center">
                                            <div>
                                                <p className="font-medium text-gray-800">{idx + 1}. {q.text}</p>
                                                <p className="text-xs text-gray-500 mt-1">{q.type} • {q.marks} Marks</p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const newer = newExam.questions.filter((_, i) => i !== idx);
                                                    setNewExam({ ...newExam, questions: newer });
                                                }}
                                                className="text-red-400 hover:text-red-600"
                                            >
                                                <MdDelete size={20} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="mt-12 flex justify-end space-x-4 border-t border-gray-100 pt-8">
                            <button
                                onClick={() => setView('list')}
                                className="px-6 py-2 text-gray-600 font-semibold hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Discard Draft
                            </button>
                            <button
                                onClick={handleSaveExam}
                                className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-lg font-bold transition-all shadow-lg shadow-green-200"
                            >
                                Publish Exam
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {view === 'results' && selectedExam && (
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-6xl mx-auto">
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => setView('list')}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <MdArrowBack size={24} />
                                </button>
                                <div>
                                    <h2 className="text-2xl font-bold">{selectedExam.title} - Results</h2>
                                    <p className="text-emerald-100 text-sm opacity-90">{selectedExam.subject} • Class {selectedExam.class}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs uppercase tracking-wider opacity-80">Average Score</p>
                                <p className="text-2xl font-bold">87%</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 text-left">
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Roll No</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Student Name</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Score</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Accuracy</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Time Taken</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Submitted At</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {resultsData.map((result) => (
                                        <tr key={result.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-gray-600">{result.rollNo}</td>
                                            <td className="px-6 py-4 text-sm font-semibold text-gray-800">{result.studentName}</td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-bold text-emerald-600">{result.score}</span>
                                                <span className="text-sm text-gray-400"> / {result.total}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="w-24 bg-gray-100 rounded-full h-2">
                                                    <div
                                                        className="bg-emerald-500 h-2 rounded-full"
                                                        style={{ width: `${(result.score / result.total) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{result.timeTaken}</td>
                                            <td className="px-6 py-4 text-sm text-gray-400">{result.submittedAt}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OnlineExam;
