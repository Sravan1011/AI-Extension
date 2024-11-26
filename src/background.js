// Initialize storage when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ tasks: [] }, () => {
    console.log('Storage initialized');
  });
});

// Create a notification
function createNotification(task) {
  chrome.notifications.create('', {
    type: 'basic',
    iconUrl: 'icons/icon48.png',
    title: 'Task Due',
    message: task.title,
    priority: task.priority === 'High' ? 2 : 1
  });
}

// Handle task creation
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'CREATE_TASK') {
    const task = request.task;
    
    // If task has a due date, create an alarm
    if (task.scheduledDate) {
      const scheduledTime = new Date(task.scheduledDate).getTime();
      chrome.alarms.create(`task-${task.id}`, {
        when: scheduledTime
      });
    }
    
    sendResponse({ success: true });
  }
  return true;
});

// Handle alarms
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name.startsWith('task-')) {
    const taskId = alarm.name.split('-')[1];
    
    // Get task details from storage
    chrome.storage.local.get(['tasks'], (result) => {
      const tasks = result.tasks || [];
      const task = tasks.find(t => t.id.toString() === taskId);
      
      if (task) {
        createNotification(task);
      }
    });
  }
});