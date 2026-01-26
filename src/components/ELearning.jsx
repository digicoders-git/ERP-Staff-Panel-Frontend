import React, { useState } from 'react';
import { MdPlayCircle, MdQuiz, MdLibraryBooks, MdAdd, MdEdit, MdDelete, MdVisibility } from 'react-icons/md';

const ELearning = () => {
  const [activeTab, setActiveTab] = useState('videos');
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState('');

  const [videos] = useState([
    { id: 1, title: 'Mathematics - Algebra Basics', duration: '45 min', views: 234, subject: 'Mathematics', class: '10th' },
    { id: 2, title: 'Physics - Newton\'s Laws', duration: '38 min', views: 189, subject: 'Physics', class: '11th' },
    { id: 3, title: 'Chemistry - Periodic Table', duration: '52 min', views: 156, subject: 'Chemistry', class: '9th' }
  ]);

  const [quizzes] = useState([
    { id: 1, title: 'Algebra Quiz', questions: 15, attempts: 89, subject: 'Mathematics', class: '10th' },
    { id: 2, title: 'Physics Laws Quiz', questions: 20, attempts: 67, subject: 'Physics', class: '11th' },
    { id: 3, title: 'Chemical Elements Quiz', questions: 12, attempts: 45, subject: 'Chemistry', class: '9th' }
  ]);

  const [resources] = useState([
    { id: 1, title: 'Mathematics Formula Sheet', type: 'PDF', downloads: 234, subject: 'Mathematics', class: '10th' },
    { id: 2, title: 'Physics Lab Manual', type: 'PDF', downloads: 189, subject: 'Physics', class: '11th' },
    { id: 3, title: 'Chemistry Notes', type: 'DOC', downloads: 156, subject: 'Chemistry', class: '9th' }
  ]);

  const handleAddContent = (type) => {
    setModalType(type);
    setShowAddModal(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 mb-6 text-white">
        <h1 className="text-3xl font-bold mb-2">E-Learning Management</h1>
        <p className="text-blue-100">Manage video classes, quizzes, and learning resources</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg mb-6">
        <div className="flex border-b">
          {[
            { id: 'videos', label: 'Video Classes', icon: MdPlayCircle },
            { id: 'quizzes', label: 'Quizzes', icon: MdQuiz },
            { id: 'resources', label: 'Resources', icon: MdLibraryBooks }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-4 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <tab.icon className="mr-2 text-xl" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Video Classes Tab */}
          {activeTab === 'videos' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Video Classes</h2>
                <button
                  onClick={() => handleAddContent('video')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <MdAdd className="mr-2" />
                  Add Video
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                  <div key={video.id} className="bg-white border rounded-xl p-4 hover:shadow-lg transition-shadow">
                    <div className="bg-gray-200 rounded-lg h-32 mb-4 flex items-center justify-center">
                      <MdPlayCircle className="text-6xl text-blue-600" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{video.title}</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Duration: {video.duration}</p>
                      <p>Views: {video.views}</p>
                      <p>Subject: {video.subject}</p>
                      <p>Class: {video.class}</p>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                      <button className="text-blue-600 hover:bg-blue-50 p-2 rounded">
                        <MdVisibility />
                      </button>
                      <button className="text-green-600 hover:bg-green-50 p-2 rounded">
                        <MdEdit />
                      </button>
                      <button className="text-red-600 hover:bg-red-50 p-2 rounded">
                        <MdDelete />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quizzes Tab */}
          {activeTab === 'quizzes' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Quizzes</h2>
                <button
                  onClick={() => handleAddContent('quiz')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
                >
                  <MdAdd className="mr-2" />
                  Create Quiz
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.map((quiz) => (
                  <div key={quiz.id} className="bg-white border rounded-xl p-4 hover:shadow-lg transition-shadow">
                    <div className="bg-green-100 rounded-lg h-32 mb-4 flex items-center justify-center">
                      <MdQuiz className="text-6xl text-green-600" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{quiz.title}</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Questions: {quiz.questions}</p>
                      <p>Attempts: {quiz.attempts}</p>
                      <p>Subject: {quiz.subject}</p>
                      <p>Class: {quiz.class}</p>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                      <button className="text-blue-600 hover:bg-blue-50 p-2 rounded">
                        <MdVisibility />
                      </button>
                      <button className="text-green-600 hover:bg-green-50 p-2 rounded">
                        <MdEdit />
                      </button>
                      <button className="text-red-600 hover:bg-red-50 p-2 rounded">
                        <MdDelete />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === 'resources' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Learning Resources</h2>
                <button
                  onClick={() => handleAddContent('resource')}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center"
                >
                  <MdAdd className="mr-2" />
                  Add Resource
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((resource) => (
                  <div key={resource.id} className="bg-white border rounded-xl p-4 hover:shadow-lg transition-shadow">
                    <div className="bg-purple-100 rounded-lg h-32 mb-4 flex items-center justify-center">
                      <MdLibraryBooks className="text-6xl text-purple-600" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{resource.title}</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Type: {resource.type}</p>
                      <p>Downloads: {resource.downloads}</p>
                      <p>Subject: {resource.subject}</p>
                      <p>Class: {resource.class}</p>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                      <button className="text-blue-600 hover:bg-blue-50 p-2 rounded">
                        <MdVisibility />
                      </button>
                      <button className="text-green-600 hover:bg-green-50 p-2 rounded">
                        <MdEdit />
                      </button>
                      <button className="text-red-600 hover:bg-red-50 p-2 rounded">
                        <MdDelete />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Content Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              Add New {modalType === 'video' ? 'Video' : modalType === 'quiz' ? 'Quiz' : 'Resource'}
            </h3>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
              <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500">
                <option value="">Select Subject</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="English">English</option>
              </select>
              <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500">
                <option value="">Select Class</option>
                <option value="9th">9th Grade</option>
                <option value="10th">10th Grade</option>
                <option value="11th">11th Grade</option>
                <option value="12th">12th Grade</option>
              </select>
              {modalType === 'video' && (
                <input
                  type="file"
                  accept="video/*"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                />
              )}
              {modalType === 'resource' && (
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                />
              )}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add {modalType === 'video' ? 'Video' : modalType === 'quiz' ? 'Quiz' : 'Resource'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ELearning;