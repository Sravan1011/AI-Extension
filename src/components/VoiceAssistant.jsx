import React, { useState, useEffect, useRef } from 'react';

const VoiceAssistant = ({ onAddTask, onDeleteTask, onUpdateTask }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new webkitSpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        setTranscript(transcript);
        processCommand(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const processCommand = (command) => {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('add task')) {
      const taskInfo = extractTaskInfo(command);
      if (taskInfo) {
        onAddTask(taskInfo);
        speak(`Adding task: ${taskInfo.title}`);
      }
    } else if (lowerCommand.includes('delete task')) {
      const taskId = extractTaskId(command);
      if (taskId) {
        onDeleteTask(taskId);
        speak('Task deleted');
      }
    } else if (lowerCommand.includes('list tasks')) {
      speak('Opening task list view');
      // Trigger view change to list
    }
  };

  const extractTaskInfo = (command) => {
    const titleMatch = command.match(/add task (.*?)(?= with|$)/i);
    const descMatch = command.match(/with description (.*?)(?= for|$)/i);
    const importanceMatch = command.match(/importance (.*?)(?= and|$)/i);
    const timeMatch = command.match(/for (.*?) hours/i);
    
    if (titleMatch) {
      return {
        title: titleMatch[1],
        description: descMatch ? descMatch[1] : '',
        importance: importanceMatch ? mapImportance(importanceMatch[1]) : 'Medium',
        estimatedTime: timeMatch ? parseFloat(timeMatch[1]) : 1,
        preferredTime: 'Morning',
        scheduledDate: new Date().toISOString().split('T')[0],
        workload: 0.5
      };
    }
    return null;
  };

  const mapImportance = (spoken) => {
    const importance = spoken.toLowerCase();
    if (importance.includes('critical')) return 'Critical';
    if (importance.includes('high')) return 'High';
    return 'Medium';
  };

  const extractTaskId = (command) => {
    const match = command.match(/delete task (\d+)/i);
    return match ? parseInt(match[1]) : null;
  };

  const speak = (message) => {
    const speech = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(speech);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
    setIsListening(!isListening);
  };

  return (
    <div className="fixed bottom-24 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <span className="font-medium text-lg text-gray-700">Voice Assistant</span>
          <button
            onClick={toggleListening}
            className={`p-2 rounded-full focus:outline-none focus:ring-2 ${
              isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
            } text-white transition duration-150`}
          >
            {isListening ? '🛑 Stop' : '🎤 Start'}
          </button>
        </div>

        {isListening && (
          <div className="mt-2">
            <div className="text-sm text-gray-600 mb-2">
              Listening... Try saying:
            </div>
            <ul className="text-xs text-gray-500 list-disc list-inside">
              <li>"Add task [title] with description [desc]"</li>
              <li>"Add task [title] with importance [level]"</li>
              <li>"Delete task [number]"</li>
              <li>"List tasks"</li>
            </ul>
            {transcript && (
              <div className="mt-3 p-3 bg-gray-100 rounded-lg shadow-inner text-sm text-gray-800">
                {transcript}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceAssistant;
