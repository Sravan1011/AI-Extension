import React, { useState } from 'react';
import { format } from 'date-fns';

const TaskList = ({ tasks, onDelete, onUpdate }) => {
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');

  const filteredTasks = tasks
    .filter((task) => {
      if (filter === 'high') return task.priority === 'High';
      if (filter === 'normal') return task.priority === 'Normal';
      return true;
    })
    .sort((a, b) => {
      // Sort by date first
      const dateCompare = new Date(a.scheduledDate) - new Date(b.scheduledDate);
      if (dateCompare !== 0) return dateCompare;

      // Then by priority
      if (a.priority === 'High' && b.priority !== 'High') return -1;
      if (a.priority !== 'High' && b.priority === 'High') return 1;

      // Finally by confidence
      return b.confidence - a.confidence;
    });

  const handleUpdateTask = (taskId, updates) => {
    onUpdate(taskId, updates);
    setEditingTask(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Tasks ({filteredTasks.length})</h2>
        <div className="flex space-x-2">
          {['all', 'high', 'normal'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type === 'all' ? 'All Tasks' : type === 'high' ? 'High Priority' : 'Normal Priority'}
            </button>
          ))}
        </div>
      </div>

      {/* Task Cards */}
      <div className="grid gap-6">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className={`p-6 rounded-lg shadow-lg transition transform hover:scale-105 ${
              task.priority === 'High'
                ? 'bg-red-50 border-l-4 border-red-400'
                : 'bg-white border-l-4 border-green-400'
            }`}
          >
            {editingTask === task.id ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={task.title}
                  onChange={(e) => handleUpdateTask(task.id, { title: e.target.value })}
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <textarea
                  value={task.description}
                  onChange={(e) => handleUpdateTask(task.id, { description: e.target.value })}
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  rows="3"
                />
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setEditingTask(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUpdateTask(task.id, task)}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                    <span
                      className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${
                        task.priority === 'High'
                          ? 'bg-red-200 text-red-800'
                          : 'bg-green-200 text-green-800'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-600">{task.description}</p>
                  <div className="mt-4 text-sm text-gray-500 space-y-1">
                    <div>
                      <span className="font-medium text-gray-700">Due:</span>{' '}
                      {format(new Date(task.scheduledDate), 'PPP')}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Time:</span> {task.estimatedTime}h
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Preferred:</span>{' '}
                      {task.preferredTime}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Confidence:</span>{' '}
                      {Math.round(task.confidence * 100)}%
                    </div>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setEditingTask(task.id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(task.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* No Tasks */}
      {filteredTasks.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No tasks found.</p>
          <p className="text-sm">Try changing the filter or adding new tasks.</p>
        </div>
      )}
    </div>
  );
};

export default TaskList;
