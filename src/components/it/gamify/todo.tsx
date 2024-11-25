import React, { useState, useEffect, useRef } from 'react';
import { Trash2, PlusCircle, Check, Upload, Download } from 'lucide-react';
import A from './b.mp3'
interface Task {
  id: string;
  text: string;
  completed: boolean;
}

const TodoApp: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('todoTasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [newTask, setNewTask] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim()) {
      const newTaskObj: Task = {
        id: Date.now().toString(),
        text: newTask,
        completed: false
      };
      setTasks([...tasks, newTaskObj]);
      setNewTask('');
    }
  };

  const toggleTask = (id: string) => {
    playSound();
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const resetTasks = () => {
    setTasks(tasks.map(task => ({ ...task, completed: false })));
  };

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  const exportTasks = () => {
    const jsonString = JSON.stringify(tasks, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'habits.json';
    link.click();
  };

  const importTasks = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedTasks = JSON.parse(e.target?.result as string);
          setTasks(importedTasks);
        } catch (error) {
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  const completedTasksCount = tasks.filter(task => task.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-blue-900 text-white flex justify-center items-center p-4">
      <audio 
        ref={audioRef} 
        src={A}
        preload="auto"
      />
      <div className="w-full max-w-md bg-gray-900/80 rounded-xl shadow-2xl overflow-hidden backdrop-blur-sm">
        <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center font-bold flex justify-between items-center">
          <span>Habits</span>
          <div className="flex items-center space-x-2 text-sm">
            <Check size={18} className="text-green-400" />
            <span>{completedTasksCount}</span>
          </div>
        </div>
        
        <div className="p-4 flex space-x-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
            placeholder="Add a new task"
            className="flex-grow p-2 border border-purple-700 bg-black/50 rounded text-white placeholder-purple-300"
          />
          <button 
            onClick={addTask}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded hover:from-blue-600 hover:to-purple-700"
          >
            <PlusCircle size={24} />
          </button>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {tasks.map((task, index) => (
            <div 
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`
                p-4 border-b border-gray-800 transition-all duration-300 
                flex justify-between items-center
                ${task.completed 
                  ? 'line-through text-gray-500 bg-gradient-to-r from-green-800/50 to-blue-800/50' 
                  : `hover:bg-gradient-to-r hover:from-blue-800/30 hover:to-purple-800/30 
                     ${index % 2 === 0 ? 'bg-gray-800/30' : 'bg-gray-700/30'}`}
                select-none cursor-pointer
              `}
            >
              <span>{task.text}</span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  removeTask(task.id);
                }}
                className="text-red-400 hover:text-red-600"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="p-4 flex justify-between items-center">
          <div className="flex space-x-2">
            <input 
              type="file" 
              accept=".json" 
              onChange={importTasks} 
              className="hidden" 
              id="import-tasks"
            />
            <label 
              htmlFor="import-tasks" 
              className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-4 py-2 rounded 
              flex items-center space-x-2 hover:from-green-600 hover:to-teal-700 cursor-pointer"
            >
              <Upload size={18} />
              <span>Import</span>
            </label>
            <button 
              onClick={exportTasks}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded 
              flex items-center space-x-2 hover:from-blue-600 hover:to-indigo-700"
            >
              <Download size={18} />
              <span>Export</span>
            </button>
          </div>
          <button 
            onClick={resetTasks}
            className="
              bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded 
              flex items-center space-x-2 hover:from-red-600 hover:to-pink-700
            "
          >
            <Trash2 size={18} />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoApp;