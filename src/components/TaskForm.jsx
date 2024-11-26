import React, { useState } from "react";

const TaskForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    importance: "Medium",
    estimatedTime: 1,
    preferredTime: "Morning",
    scheduledDate: new Date().toISOString().split("T")[0],
    workload: 0.5,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
    setFormData({
      title: "",
      description: "",
      importance: "Medium",
      estimatedTime: 1,
      preferredTime: "Morning",
      scheduledDate: new Date().toISOString().split("T")[0],
      workload: 0.5,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 bg-white shadow-md rounded-lg max-w-lg mx-auto border border-gray-200"
    >
      <h2 className="text-xl font-semibold text-gray-800 text-center">
        Add a New Task
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter task title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Importance
          </label>
          <select
            value={formData.importance}
            onChange={(e) =>
              setFormData({ ...formData, importance: e.target.value })
            }
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows="3"
          placeholder="Provide a short task description"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Estimated Time (hours)
          </label>
          <input
            type="number"
            min="0.5"
            step="0.5"
            value={formData.estimatedTime}
            onChange={(e) =>
              setFormData({
                ...formData,
                estimatedTime: Number(e.target.value),
              })
            }
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Preferred Time
          </label>
          <select
            value={formData.preferredTime}
            onChange={(e) =>
              setFormData({ ...formData, preferredTime: e.target.value })
            }
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Evening">Evening</option>
            <option value="Night">Night</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Scheduled Date
          </label>
          <input
            type="date"
            value={formData.scheduledDate}
            onChange={(e) =>
              setFormData({ ...formData, scheduledDate: e.target.value })
            }
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Current Workload:{" "}
          <span className="font-semibold">
            {Math.round(formData.workload * 100)}%
          </span>
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={formData.workload}
          onChange={(e) =>
            setFormData({ ...formData, workload: Number(e.target.value) })
          }
          className="mt-1 block w-full accent-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full py-3 px-5 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
      >
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;
