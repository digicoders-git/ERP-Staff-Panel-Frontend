import React, { useState } from 'react';
import { MdPlayArrow, MdPause, MdVolumeUp, MdFullscreen, MdSpeed, MdSubtitles } from 'react-icons/md';

const VideoPlayer = ({ video, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(2700); // 45 minutes in seconds
  const [volume, setVolume] = useState(1);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">{video.title}</h2>
        <button
          onClick={onClose}
          className="text-white hover:bg-gray-700 p-2 rounded"
        >
          ✕
        </button>
      </div>

      {/* Video Container */}
      <div className="flex-1 bg-black flex items-center justify-center">
        <div className="w-full max-w-6xl aspect-video bg-gray-800 rounded-lg relative">
          {/* Placeholder for video */}
          <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg flex items-center justify-center">
            <div className="text-center text-white">
              <MdPlayArrow className="text-8xl mx-auto mb-4 opacity-50" />
              <p className="text-xl">Video Player</p>
              <p className="text-sm opacity-75">Click play to start</p>
            </div>
          </div>

          {/* Video Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="bg-gray-600 h-2 rounded-full">
                <div 
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="hover:bg-gray-700 p-2 rounded"
                >
                  {isPlaying ? <MdPause className="text-2xl" /> : <MdPlayArrow className="text-2xl" />}
                </button>
                
                <div className="flex items-center space-x-2">
                  <MdVolumeUp />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    className="w-20"
                  />
                </div>

                <span className="text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <MdSpeed />
                  <select
                    value={playbackSpeed}
                    onChange={(e) => setPlaybackSpeed(e.target.value)}
                    className="bg-gray-700 text-white rounded px-2 py-1 text-sm"
                  >
                    <option value="0.5">0.5x</option>
                    <option value="0.75">0.75x</option>
                    <option value="1">1x</option>
                    <option value="1.25">1.25x</option>
                    <option value="1.5">1.5x</option>
                    <option value="2">2x</option>
                  </select>
                </div>

                <button className="hover:bg-gray-700 p-2 rounded">
                  <MdSubtitles />
                </button>

                <button className="hover:bg-gray-700 p-2 rounded">
                  <MdFullscreen />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Info Sidebar */}
      <div className="bg-gray-900 text-white p-4 max-h-48 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="font-bold mb-2">Video Details</h3>
            <p className="text-sm text-gray-300">Subject: {video.subject}</p>
            <p className="text-sm text-gray-300">Class: {video.class}</p>
            <p className="text-sm text-gray-300">Duration: {video.duration}</p>
            <p className="text-sm text-gray-300">Views: {video.views}</p>
          </div>
          
          <div>
            <h3 className="font-bold mb-2">Description</h3>
            <p className="text-sm text-gray-300">
              This video covers the fundamental concepts of algebra including variables, 
              equations, and basic problem-solving techniques.
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-2">Related Videos</h3>
            <div className="space-y-2">
              <div className="text-sm text-blue-400 hover:text-blue-300 cursor-pointer">
                → Algebra Advanced Concepts
              </div>
              <div className="text-sm text-blue-400 hover:text-blue-300 cursor-pointer">
                → Quadratic Equations
              </div>
              <div className="text-sm text-blue-400 hover:text-blue-300 cursor-pointer">
                → Linear Equations
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;