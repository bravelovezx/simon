import React from 'react';
import { motion } from 'framer-motion';
import { FaCoffee, FaPlane, FaBriefcase, FaBed } from 'react-icons/fa';

const SceneSelector = ({ isOpen, onClose, onSelect }) => {
  const scenes = [
    { id: 'coffee', title: '咖啡馆闲聊', icon: FaCoffee },
    { id: 'airport', title: '机场值机', icon: FaPlane },
    { id: 'job', title: '求职场景', icon: FaBriefcase },
    { id: 'hotel', title: '酒店入住', icon: FaBed },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl p-6 w-full max-w-lg"
      >
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">选择场景</h3>
          <p className="text-sm text-gray-500 mt-1">请选择您想要进行的对话场景</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {scenes.map((scene) => (
            <button
              key={scene.id}
              onClick={() => {
                onSelect(scene.id);
                onClose();
              }}
              className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <scene.icon className="text-3xl text-blue-600 mb-3" />
              <span className="text-gray-900 font-medium">{scene.title}</span>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          取消
        </button>
      </motion.div>
    </div>
  );
};

export default SceneSelector;