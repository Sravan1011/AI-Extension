import React, { useState, useEffect } from 'react';
import Calendar from './components/Calendar';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import VoiceAssistant from './components/VoiceAssistant';
import Notification from './components/Notification';
import { TaskManager } from './services/TaskManager';
import { PriorityPredictor } from './services/PriorityPredictor';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [view, setView] = useState('calendar');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const loadTasks = async () => {
    try {
      const loadedTasks = await TaskManager.getAllTasks();
      setTasks(loadedTasks);
    } catch (error) {
      showNotification('Error loading tasks: ' + error.message, 'error');
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      const priorityResult = await PriorityPredictor.predictPriority(taskData);
      const newTask = {
        ...taskData,
        id: Date.now(),
        priority: priorityResult.priority,
        confidence: priorityResult.confidence,
        createdAt: new Date().toISOString()
      };

      await TaskManager.addTask(newTask);
      await loadTasks();
      showNotification('Task added successfully');
    } catch (error) {
      showNotification('Error adding task: ' + error.message, 'error');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await TaskManager.deleteTask(taskId);
      await loadTasks();
      showNotification('Task deleted successfully');
    } catch (error) {
      showNotification('Error deleting task: ' + error.message, 'error');
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      await TaskManager.updateTask(taskId, updates);
      await loadTasks();
      showNotification('Task updated successfully');
    } catch (error) {
      showNotification('Error updating task: ' + error.message, 'error');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold tracking-tight">AI Task Scheduler</h1>
            <button
              onClick={() => setIsVoiceActive(!isVoiceActive)}
              className="p-2 rounded-full bg-white text-primary hover:bg-gray-100 transition-colors duration-200 shadow-md"
            >
              <span className="text-xl">{isVoiceActive ? '🎤' : '🎙️'}</span>
            </button>
          </div>

          {/* View Toggle */}
          <div className="flex mt-4 space-x-2">
            <button
              onClick={() => setView('calendar')}
              className={`btn ${
                view === 'calendar'
                  ? 'bg-white text-primary'
                  : 'text-white hover:bg-primary-dark'
              }`}
            >
              📅 Calendar
            </button>
            <button
              onClick={() => setView('list')}
              className={`btn ${
                view === 'list'
                  ? 'bg-white text-primary'
                  : 'text-white hover:bg-primary-dark'
              }`}
            >
              📝 Task List
            </button>
          </div>
        </div>
      </header>

      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 container mx-auto">
        <div className="card">
          {view === 'calendar' ? (
            <Calendar
              tasks={tasks}
              onTaskClick={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
            />
          ) : (
            <TaskList
              tasks={tasks}
              onDelete={handleDeleteTask}
              onUpdate={handleUpdateTask}
            />
          )}
        </div>
      </main>

      {/* Task Form */}
      <div className="border-t border-gray-200 bg-white shadow-lg">
        <div className="container mx-auto p-4">
          <TaskForm onSubmit={handleAddTask} />
        </div>
      </div>

      {/* Voice Assistant */}
      {isVoiceActive && (
        <div className="fixed bottom-20 right-4 z-50">
          <VoiceAssistant
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
            onUpdateTask={handleUpdateTask}
          />
        </div>
      )}
    </div>
  );
};

export default App;