// services/TaskManager.js
export class TaskManager {
  static async getAllTasks() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['tasks'], (result) => {
        resolve(result.tasks || []);
      });
    });
  }

  static async addTask(task) {
    const tasks = await this.getAllTasks();
    const newTasks = [...tasks, task];
    
    return new Promise((resolve) => {
      chrome.storage.local.set({ tasks: newTasks }, () => {
        this.scheduleNotification(task);
        resolve(task);
      });
    });
  }

  static async updateTask(taskId, updates) {
    const tasks = await this.getAllTasks();
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }

    const updatedTasks = [...tasks];
    updatedTasks[taskIndex] = {
      ...updatedTasks[taskIndex],
      ...updates,
      lastModified: new Date().toISOString()
    };

    return new Promise((resolve) => {
      chrome.storage.local.set({ tasks: updatedTasks }, () => {
        this.scheduleNotification(updatedTasks[taskIndex]);
        resolve(updatedTasks[taskIndex]);
      });
    });
  }

  static async deleteTask(taskId) {
    const tasks = await this.getAllTasks();
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    
    return new Promise((resolve) => {
      chrome.storage.local.set({ tasks: updatedTasks }, () => {
        this.cancelNotification(taskId);
        resolve(taskId);
      });
    });
  }

  static scheduleNotification(task) {
    const scheduledTime = new Date(task.scheduledDate);
    const now = new Date();

    if (scheduledTime > now) {
      chrome.alarms.create(`task-${task.id}`, {
        when: scheduledTime.getTime()
      });
    }
  }

  static cancelNotification(taskId) {
    chrome.alarms.clear(`task-${taskId}`);
  }

  static async getTasksByDate(date) {
    const tasks = await this.getAllTasks();
    return tasks.filter(task => {
      const taskDate = new Date(task.scheduledDate).toDateString();
      return taskDate === date.toDateString();
    });
  }

  static async getHighPriorityTasks() {
    const tasks = await this.getAllTasks();
    return tasks.filter(task => task.priority === 'High');
  }

  static async getCurrentWorkload() {
    const tasks = await this.getAllTasks();
    const today = new Date().toDateString();
    
    const todayTasks = tasks.filter(task => {
      const taskDate = new Date(task.scheduledDate).toDateString();
      return taskDate === today;
    });

    const totalEstimatedTime = todayTasks.reduce(
      (sum, task) => sum + task.estimatedTime,
      0
    );

    return Math.min(totalEstimatedTime / 8, 1); 
  }
}