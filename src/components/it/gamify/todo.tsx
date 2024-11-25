import React, { useState, useEffect, useRef } from 'react';
import { Trash2, PlusCircle, Check } from 'lucide-react';

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

  const completedTasksCount = tasks.filter(task => task.completed).length;

  return (
    <div className="min-h-screen bg-black text-white flex justify-center items-center p-4">
      <div className="w-full max-w-md bg-gray-900 rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 bg-gray-800 text-white text-center font-bold flex justify-between items-center">
          <span>Habits</span>
          <div className="flex items-center space-x-2 text-sm">
            <Check size={18} className="text-green-500" />
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
            className="flex-grow p-2 border border-gray-700 bg-black rounded text-white"
          />
          <button 
            onClick={addTask}
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            <PlusCircle size={24} />
          </button>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {tasks.map((task) => (
            <div 
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`
                p-4 border-b border-gray-800 cursor-pointer transition-all duration-300 
                flex justify-between items-center
                ${task.completed ? 'line-through text-gray-500 bg-gray-800' : 'hover:bg-gray-800'}
              `}
            >
              <span>{task.text}</span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  removeTask(task.id);
                }}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="p-4 flex justify-center">
          <button 
            onClick={resetTasks}
            className="
              bg-red-600 text-white px-4 py-2 rounded 
              flex items-center space-x-2 hover:bg-red-700
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