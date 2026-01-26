import React, { useState } from 'react';
import { MdAdd, MdDelete, MdEdit, MdSave, MdCancel, MdQuiz } from 'react-icons/md';

const QuizManager = () => {
  const [quizData, setQuizData] = useState({
    title: '',
    subject: '',
    class: '',
    timeLimit: 30,
    questions: []
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    type: 'multiple-choice',
    options: ['', '', '', ''],
    correctAnswer: 0,
    points: 1
  });

  const [editingIndex, setEditingIndex] = useState(-1);

  const addQuestion = () => {
    if (currentQuestion.question.trim()) {
      const newQuestions = [...quizData.questions];
      if (editingIndex >= 0) {
        newQuestions[editingIndex] = { ...currentQuestion };
        setEditingIndex(-1);
      } else {
        newQuestions.push({ ...currentQuestion, id: Date.now() });
      }
      
      setQuizData({ ...quizData, questions: newQuestions });
      setCurrentQuestion({
        question: '',
        type: 'multiple-choice',
        options: ['', '', '', ''],
        correctAnswer: 0,
        points: 1
      });
    }
  };

  const editQuestion = (index) => {
    setCurrentQuestion(quizData.questions[index]);
    setEditingIndex(index);
  };

  const deleteQuestion = (index) => {
    const newQuestions = quizData.questions.filter((_, i) => i !== index);
    setQuizData({ ...quizData, questions: newQuestions });
  };

  const updateOption = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const saveQuiz = () => {
    if (quizData.title && quizData.questions.length > 0) {
      console.log('Saving quiz:', quizData);
      alert('Quiz saved successfully!');
      // Reset form
      setQuizData({
        title: '',
        subject: '',
        class: '',
        timeLimit: 30,
        questions: []
      });
    } else {
      alert('Please fill in all required fields and add at least one question.');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 mb-6 text-white">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <MdQuiz className="mr-3" />
            Quiz Manager
          </h1>
          <p className="text-green-100">Create and manage interactive quizzes</p>
        </div>

        {/* Quiz Basic Info */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Quiz Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Quiz Title"
              value={quizData.title}
              onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
            <select
              value={quizData.subject}
              onChange={(e) => setQuizData({ ...quizData, subject: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">Select Subject</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
              <option value="English">English</option>
            </select>
            <select
              value={quizData.class}
              onChange={(e) => setQuizData({ ...quizData, class: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">Select Class</option>
              <option value="9th">9th Grade</option>
              <option value="10th">10th Grade</option>
              <option value="11th">11th Grade</option>
              <option value="12th">12th Grade</option>
            </select>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Time Limit (minutes):</label>
              <input
                type="number"
                value={quizData.timeLimit}
                onChange={(e) => setQuizData({ ...quizData, timeLimit: parseInt(e.target.value) })}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 w-20"
                min="1"
              />
            </div>
          </div>
        </div>

        {/* Question Builder */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">
            {editingIndex >= 0 ? 'Edit Question' : 'Add Question'}
          </h2>
          
          <div className="space-y-4">
            <textarea
              placeholder="Enter your question here..."
              value={currentQuestion.question}
              onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500 h-24 resize-none"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={currentQuestion.type}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, type: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="multiple-choice">Multiple Choice</option>
                <option value="true-false">True/False</option>
              </select>
              
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">Points:</label>
                <input
                  type="number"
                  value={currentQuestion.points}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, points: parseInt(e.target.value) })}
                  className="px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 w-20"
                  min="1"
                />
              </div>
            </div>

            {/* Options */}
            {currentQuestion.type === 'multiple-choice' && (
              <div className="space-y-3">
                <h3 className="font-medium">Answer Options:</h3>
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={currentQuestion.correctAnswer === index}
                      onChange={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: index })}
                      className="text-green-600"
                    />
                    <input
                      type="text"
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                ))}
              </div>
            )}

            {currentQuestion.type === 'true-false' && (
              <div className="space-y-3">
                <h3 className="font-medium">Correct Answer:</h3>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="trueFalse"
                      checked={currentQuestion.correctAnswer === 0}
                      onChange={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: 0 })}
                      className="mr-2"
                    />
                    True
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="trueFalse"
                      checked={currentQuestion.correctAnswer === 1}
                      onChange={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: 1 })}
                      className="mr-2"
                    />
                    False
                  </label>
                </div>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={addQuestion}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
              >
                <MdAdd className="mr-2" />
                {editingIndex >= 0 ? 'Update Question' : 'Add Question'}
              </button>
              
              {editingIndex >= 0 && (
                <button
                  onClick={() => {
                    setEditingIndex(-1);
                    setCurrentQuestion({
                      question: '',
                      type: 'multiple-choice',
                      options: ['', '', '', ''],
                      correctAnswer: 0,
                      points: 1
                    });
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center"
                >
                  <MdCancel className="mr-2" />
                  Cancel Edit
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Questions List */}
        {quizData.questions.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Questions ({quizData.questions.length})</h2>
            <div className="space-y-4">
              {quizData.questions.map((question, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-lg">Q{index + 1}. {question.question}</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => editQuestion(index)}
                        className="text-blue-600 hover:bg-blue-50 p-2 rounded"
                      >
                        <MdEdit />
                      </button>
                      <button
                        onClick={() => deleteQuestion(index)}
                        className="text-red-600 hover:bg-red-50 p-2 rounded"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    Type: {question.type} | Points: {question.points}
                  </div>
                  
                  {question.type === 'multiple-choice' && (
                    <div className="space-y-1">
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} className={`text-sm ${optIndex === question.correctAnswer ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
                          {optIndex === question.correctAnswer ? '✓' : '○'} {option}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {question.type === 'true-false' && (
                    <div className="text-sm">
                      Correct Answer: <span className="text-green-600 font-medium">
                        {question.correctAnswer === 0 ? 'True' : 'False'}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Save Quiz */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold">Quiz Summary</h3>
              <p className="text-gray-600">
                {quizData.questions.length} questions • 
                Total Points: {quizData.questions.reduce((sum, q) => sum + q.points, 0)} • 
                Time Limit: {quizData.timeLimit} minutes
              </p>
            </div>
            <button
              onClick={saveQuiz}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center font-medium"
            >
              <MdSave className="mr-2" />
              Save Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizManager;