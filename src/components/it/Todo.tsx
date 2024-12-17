import React, { useState, useEffect, useMemo } from 'react';
import { noterFirestore, firebaseTimestamp } from '../../firebase/index';
import getCurrentUser from '../../firebase/utils/getCurrentUser';

import Side from './Sidebar'
import { AlertCircle, Calendar, Clock, Filter, Search, Settings, Tag, Timer, Trash2 } from 'lucide-react';
import {
    Alert,
    AlertDescription,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    Badge
  } from './component';
  interface Todo {
    id: string;
    text: string;
    completed: boolean;
    inProgress: boolean;
    createdAt: any;
    emoji?: string;
    category?: string;
    priority: 'low' | 'medium' | 'high';
    dueDate?: string;
    tags: string[];
    notes?: string;
    timer?: {
      duration: number;
      running: boolean;
      timeLeft: number;
      lastUpdated: number;
      completedIntervals: number;
    };
  }

  const motivationalQuotes = [
    "Progress is progress, no matter how small! 💪",
    "One step at a time! 👣",
    "You've got this! ⭐",
    "Making it happen! 🚀",
    "Keep pushing forward! 🎯",
    "Every minute counts! ⏰",
  ];

interface Category {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

interface TodoStats {
  total: number;
  completed: number;
  overdue: number;
  highPriority: number;
  inProgress: number;  // Added this property
}


const TodoApp = () => {
  const [inProgressQuote, setInProgressQuote] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEmoji, setSelectedEmoji] = useState('📝');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [newDueDate, setNewDueDate] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [showCompleted, setShowCompleted] = useState(true);
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'createdAt'>('createdAt');
  const [newTags, setNewTags] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  const categories: Category[] = [
    { id: '1', name: 'Work', emoji: '💼', color: 'bg-blue-600' },
    { id: '2', name: 'Personal', emoji: '🏠', color: 'bg-green-600' },
    { id: '3', name: 'Shopping', emoji: '🛒', color: 'bg-yellow-600' },
    { id: '4', name: 'Health', emoji: '🏥', color: 'bg-red-600' },
    { id: '5', name: 'Study', emoji: '📚', color: 'bg-purple-600' },
  ];

  const emojis = ['📝', '⭐', '🎯', '🎨', '💪', '🎵', '🎮', '📚', '🏃', '🍳'];
  
  const priorityColors = {
    low: 'bg-green-600',
    medium: 'bg-yellow-600',
    high: 'bg-red-600'
  };

  // Stats calculation
  const stats = useMemo((): TodoStats => {
    return {
      total: todos.length,
      completed: todos.filter(todo => todo.completed).length,
      overdue: todos.filter(todo => 
        todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed
      ).length,
      highPriority: todos.filter(todo => todo.priority === 'high' && !todo.completed).length,
      inProgress: todos.filter(todo => todo.inProgress).length  // Added this calculation
    };
  }, [todos]);

  // Filtered and sorted todos
  const filteredTodos = useMemo(() => {
    return todos
      .filter(todo => {
        const matchesCategory = selectedCategory === 'all' || todo.category === selectedCategory;
        const matchesPriority = selectedPriority === 'all' || todo.priority === selectedPriority;
        const matchesSearch = todo.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
          todo.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCompleted = showCompleted || !todo.completed;
        return matchesCategory && matchesPriority && matchesSearch && matchesCompleted;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'dueDate':
            return (a.dueDate || '') > (b.dueDate || '') ? 1 : -1;
          case 'priority':
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
          default:
            return b.createdAt - a.createdAt;
        }
      });
  }, [todos, selectedCategory, selectedPriority, searchQuery, showCompleted, sortBy]);

  // Clock update effect
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // Notification effect
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);
  useEffect(() => {
    if (inProgressQuote) {
      const timer = setTimeout(() => {
        setInProgressQuote("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [inProgressQuote]);

  // Firebase listener effect with timer state recovery
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      setError('No user found. Please log in first.');
      setIsLoading(false);
      return;
    }

    const unsubscribe = noterFirestore
      .collection('users')
      .doc(currentUser.uid)
      .collection('todos')
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        (snapshot) => {
          const todoData = snapshot.docs.map(doc => {
            const data = doc.data();
            const todo = {
              id: doc.id,
              ...data,
            } as Todo;

            if (todo.timer?.running && todo.timer.lastUpdated) {
              const elapsedSeconds = Math.floor(
                (Date.now() - todo.timer.lastUpdated) / 1000
              );
              todo.timer.timeLeft = Math.max(0, todo.timer.timeLeft - elapsedSeconds);

              if (todo.timer.timeLeft > 0) {
                doc.ref.update({
                  'timer.timeLeft': todo.timer.timeLeft,
                  'timer.lastUpdated': Date.now()
                });
              } else {
                doc.ref.update({
                  'timer.running': false,
                  'timer.timeLeft': 0,
                  'timer.completedIntervals': (todo.timer.completedIntervals || 0) + 1
                });
                
                // Show notification when timer completes
                if (Notification.permission === 'granted') {
                  new Notification('Timer Complete!', {
                    body: `Timer for "${todo.text}" has finished!`
                  });
                }
                
                todo.timer.running = false;
                todo.timer.timeLeft = 0;
                todo.timer.completedIntervals = (todo.timer.completedIntervals || 0) + 1;
              }
            }
            return todo;
          });
          setTodos(todoData);
          setIsLoading(false);
        },
        (error) => {
          console.error('Firestore listener error:', error);
          setError('Error loading todos: ' + error.message);
          setIsLoading(false);
        }
      );

    return () => unsubscribe();
  }, []);

  // Timer update effect with batch updates
  useEffect(() => {
    const timerInterval = setInterval(async () => {
      const currentUser = getCurrentUser();
      if (!currentUser) return;

      const updates = todos.reduce((acc: { [key: string]: any }, todo) => {
        if (todo.timer?.running && todo.timer.timeLeft > 0) {
          const newTimeLeft = Math.max(0, todo.timer.timeLeft - 1);
          acc[todo.id] = {
            'timer.timeLeft': newTimeLeft,
            'timer.lastUpdated': Date.now(),
            'timer.running': newTimeLeft > 0
          };
        }
        return acc;
      }, {});

      if (Object.keys(updates).length > 0) {
        const batch = noterFirestore.batch();
        
        Object.entries(updates).forEach(([todoId, update]) => {
          const todoRef = noterFirestore
            .collection('users')
            .doc(currentUser.uid)
            .collection('todos')
            .doc(todoId);
          batch.update(todoRef, update);
        });

        try {
          await batch.commit();
        } catch (error) {
          console.error('Error updating timers:', error);
        }
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [todos]);

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    const currentUser = getCurrentUser();
    if (!currentUser) {
      setError('Please log in to add tasks');
      return;
    }

    setIsLoading(true);
    try {
      const todoRef = noterFirestore
        .collection('users')
        .doc(currentUser.uid)
        .collection('todos');

      await todoRef.add({
        text: newTodo.trim(),
        completed: false,
        createdAt: firebaseTimestamp(),
        emoji: selectedEmoji,
        category: selectedCategory,
        priority: selectedPriority === 'all' ? 'medium' : selectedPriority,
        dueDate: newDueDate,
        tags: newTags,
        notes: notes,
        timer: {
          duration: 0,
          running: false,
          timeLeft: 0,
          lastUpdated: Date.now(),
          completedIntervals: 0
        }
      });

      setNewTodo('');
      setNewDueDate('');
      setNewTags([]);
      setNotes('');
      setNotification('task added successfully!');
    } catch (error) {
      console.error('Error adding the task:', error);
      setError('Failed to add tasks: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };
  const [isOpen, setIsOpen] = useState(false);
  const toggleTodo = async (todoId: string, completed: boolean, isCheckbox = false) => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    try {
      if (isCheckbox) {
        await noterFirestore
          .collection('users')
          .doc(currentUser.uid)
          .collection('todos')
          .doc(todoId)
          .update({
            completed: !completed,
            inProgress: false
          });
        
        setNotification(`task marked as ${!completed ? 'completed' : 'incomplete'}!`);
      } else {
        const todo = todos.find(t => t.id === todoId);
        if (todo?.completed) return; // Don't allow in-progress state for completed todos
        
        const newInProgress = !todo?.inProgress;
        await noterFirestore
          .collection('users')
          .doc(currentUser.uid)
          .collection('todos')
          .doc(todoId)
          .update({
            inProgress: newInProgress
          });
        
        if (newInProgress) {
          setInProgressQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
        }
      }
    } catch (error) {
      console.error('Error updating tasks:', error);
      setError('Failed to update tasks: ' + (error as Error).message);
    }
  };

  const deleteTodo = async (todoId: string) => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    try {
      await noterFirestore
        .collection('users')
        .doc(currentUser.uid)
        .collection('todos')
        .doc(todoId)
        .delete();
      
      setNotification('task deleted successfully!');
    } catch (error) {
      console.error('Error deleting tasks:', error);
      setError('Failed to delete tasks: ' + (error as Error).message);
    }
  };

  const startTimer = async (todoId: string, duration: number) => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    if (Notification.permission === 'default') {
      await Notification.requestPermission();
    }

    try {
      await noterFirestore
        .collection('users')
        .doc(currentUser.uid)
        .collection('todos')
        .doc(todoId)
        .update({
          timer: {
            duration,
            running: true,
            timeLeft: duration * 60,
            lastUpdated: Date.now(),
            completedIntervals: todos.find(t => t.id === todoId)?.timer?.completedIntervals || 0
          }
        });
      
      setNotification(`Timer started for ${duration} minutes!`);
    } catch (error) {
      console.error('Error starting timer:', error);
      setError('Failed to start timer: ' + (error as Error).message);
    }
  };

  const stopTimer = async (todoId: string) => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    try {
      const todoRef = noterFirestore
        .collection('users')
        .doc(currentUser.uid)
        .collection('todos')
        .doc(todoId);

      const todoDoc = await todoRef.get();
      const todoData = todoDoc.data();

      await todoRef.update({
        timer: {
          ...todoData?.timer,
          running: false,
          lastUpdated: Date.now()
        }
      });
      
      setNotification('Timer stopped!');
    } catch (error) {
      console.error('Error stopping timer:', error);
      setError('Failed to stop timer: ' + (error as Error).message);
    }
  };

  const updateTodo = async (todoId: string, updates: Partial<Todo>) => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    try {
      await noterFirestore
        .collection('users')
        .doc(currentUser.uid)
        .collection('todos')
        .doc(todoId)
        .update(updates);
      
      setNotification('task updated successfully!');
    } catch (error) {
      console.error('Error updating tasks:', error);
      setError('Failed to update tasks: ' + (error as Error).message);
    }
  };



  return (<>

     <Side />
     
       <div className="min-h-screen bg-gray-500">
    <div className="bg-black max-w-4xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
    {/* Header */}
    <div className="flex flex-col sm:flex-row items-center justify-between bg-black p-4 sm:p-6 rounded-lg shadow-lg"> <img
                src="/logo.png"
                                className="h-10 w-10"
              />
      <div className="text-center sm:text-left mb-4 sm:mb-0">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-green-600 
                bg-clip-text text-transparent">
       Plannerify
              </h1>
        <p className="text-gray-400">Manage your task efficiently</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-lg sm:text-xl font-mono text-white">{currentTime.toLocaleTimeString()}</div>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-2 hover:bg-gray-800 rounded-full"
        >
          <Settings className="text-white w-5 h-5" />
        </button>
      </div>
    </div>
    {/* todo checkbox part section which i have placed above the stats one */}
    <div className="space-y-3 sm:space-y-4" >
      
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading tasks...</p>
          </div>
        ) : filteredTodos.length === 0 ? (
          <div className="text-center py-8 bg-black rounded-lg">
            <p className="text-gray-400">no tasks present , time to add some in your life</p>
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className={`bg-black rounded-lg shadow-lg transition-all ${
                todo.completed ? 'opacity-75' : ''
              } ${todo.inProgress ? 'ring-2 ring-green-500' : ''}`}
            >
              <div 
                className="p-3 sm:p-4 cursor-pointer"
                onClick={(e) => {
                  
                  if (
                    !(e.target as HTMLElement).closest('button') &&
                    !(e.target as HTMLElement).closest('input[type="checkbox"]')
                  ) {
                    toggleTodo(todo.id, todo.completed);
                  }
                }}
              >
                <div className="flex items-center gap-2 sm:gap-4">
                <input
  type="checkbox"
  checked={todo.completed}
  onChange={() => toggleTodo(todo.id, todo.completed, true)}
  id={`checkbox-${todo.id}`}
  className="hidden peer"
/>

<label
  htmlFor={`checkbox-${todo.id}`}
  className="w-10 h-10  border-4 border-gray-500 cursor-pointer peer-checked:bg-green-500 peer-checked:border-green-500"
></label>


                  <span className="text-xl">{todo.emoji}</span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-white text-base sm:text-lg ${
                          todo.completed ? 'line-through text-gray-500' : ''
                        }`}
                      >
                        {todo.text}
                      </span>
                      <Badge className={priorityColors[todo.priority]}>
                        {todo.priority}
                      </Badge>
                      {todo.inProgress && (
                        <Badge className="bg-green-600 animate-pulse">
                          In Progress
                        </Badge>
                      )}
                    </div>

                    {todo.dueDate && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>Due: {new Date(todo.dueDate).toLocaleString()}</span>
                      </div>
                    )}

                    {todo.tags && todo.tags.length > 0 && (
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {todo.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!todo.completed && (
                      <div className="flex items-center gap-2">
                        {!todo.timer?.running ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => startTimer(todo.id, 25)}
                                className="px-2 sm:px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
                              >
                                <Timer className="w-4 h-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>Start 25-minute timer</TooltipContent>
                          </Tooltip>
                        ) : (
                          <>
                            <span className="font-mono text-white text-sm">
                              {Math.floor(todo.timer.timeLeft / 60)}:
                              {(todo.timer.timeLeft % 60)
                                .toString()
                                .padStart(2, '0')}
                            </span>
                            <button
                              onClick={() => stopTimer(todo.id)}
                              className="px-2 sm:px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                              <Clock className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    )}

                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="p-2 hover:bg-gray-800 rounded-lg text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {todo.notes && (
                  <div className="mt-2 pl-12 text-gray-400 text-sm">
                    {todo.notes}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Tasks', value: stats.total, color: 'bg-blue-600' },
          { label: 'Completed', value: stats.completed, color: 'bg-green-600' },
          { label: 'In Progress', value: stats.inProgress, color: 'bg-purple-600' },
          { label: 'Overdue', value: stats.overdue, color: 'bg-red-600' },
          { label: 'High Priority', value: stats.highPriority, color: 'bg-yellow-600' }
        ].map(stat => (
          <div key={stat.label} className={`${stat.color} p-4 rounded-lg shadow-lg`}>
            <div className="text-xl md:text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-white/80 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-out">
          {notification}
        </div>
      )}

      {/* Filters */}
      <div className="bg-black p-3 sm:p-4 rounded-lg shadow-lg space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <div className="flex gap-2 sm:gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-3 sm:px-4 py-2 bg-gray-800 text-white rounded-lg text-sm sm:text-base"
            >
              <option value="createdAt">Sort by Date</option>
              <option value="dueDate">Sort by Due Date</option>
              <option value="priority">Sort by Priority</option>
            </select>
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className={`px-3 sm:px-4 py-2 rounded-lg ${
                showCompleted ? 'bg-green-600' : 'bg-gray-800'
              } text-white text-sm sm:text-base whitespace-nowrap`}
            >
              {showCompleted ? 'Hide Done' : 'Show Done'}
            </button>
          </div>
        </div>

        <div className="flex gap-2 sm:gap-4 flex-wrap">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(
                selectedCategory === category.id ? 'all' : category.id
              )}
              className={`px-3 sm:px-4 py-2 rounded-lg ${
                selectedCategory === category.id ? category.color : 'bg-gray-800'
              } text-white text-sm sm:text-base`}
            >
              {category.emoji} {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Add Todo Form */}
      <form onSubmit={addTodo} className="bg-black p-4 md:p-6 rounded-lg shadow-lg space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg"
          >
            <option value="all">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.emoji} {category.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="✍️ Add a new task..."
            className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-green-500"
          />

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value as Todo['priority'])}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="datetime-local"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg"
            />
          </div>

          <div className="flex-1">
            <input
              type="text"
              placeholder="Add tags (comma separated)"
              value={newTags.join(', ')}
              onChange={(e) => setNewTags(e.target.value.split(',').map(tag => tag.trim()))}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg"
            />
          </div>
        </div>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes..."
          className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg resize-none h-24"
        />

        <div className="flex gap-2 flex-wrap">
          {emojis.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => setSelectedEmoji(emoji)}
              className={`text-2xl p-2 rounded-lg ${
                selectedEmoji === emoji ? 'bg-green-600' : 'bg-gray-800'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`${
            isLoading ? 'bg-gray-700' : 'bg-green-600 hover:bg-green-700'
          } text-white px-6 py-2 rounded-lg transition-colors w-full`}
        >
          {isLoading ? 'Adding...' : '➕ Add Tasks'}
        </button>
      </form>

      {/* Todo List */}
     

      {/* Motivational Quote Overlay */}
      {inProgressQuote && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce">
          {inProgressQuote}
        </div>
      )}

      

      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          {/* Add settings content here */}
        </DialogContent>
      </Dialog>
    </div>
    </div>
   
    </>
  );
};

export default TodoApp;