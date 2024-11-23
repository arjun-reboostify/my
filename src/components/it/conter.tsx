import React, { useState, useEffect, useMemo } from 'react';
import { noterFirestore, firebaseTimestamp } from '../../firebase/index';
import getCurrentUser from '../../firebase/utils/getCurrentUser';
import { Plus, Minus, ArrowUpDown, Trash2, Save, Trophy, Edit2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Alert,
  AlertDescription,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Badge
} from './component';
import Side from './Sidebar'

interface Counter {
  id: string;
  name: string;
  count: number;
  category: string;
  createdAt: any;
  lastUpdated: any;
  color: string;
  record: number;
  goal?: number;
  notes?: string;
}

interface Category {
  id: string;
  name: string;
  emoji: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
}

const CounterApp = () => {
  const [counters, setCounters] = useState<Counter[]>([]);
  const [newCounterName, setNewCounterName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [sortBy, setSortBy] = useState<'count' | 'name' | 'lastUpdated'>('lastUpdated');
  const [showReward, setShowReward] = useState<{show: boolean; counterId: string}>({ show: false, counterId: '' });
  const [editingRecord, setEditingRecord] = useState<{id: string; value: number} | null>(null);

  const categories: Category[] = [
    { id: '1', name: 'Work', emoji: '💼', color: 'bg-blue-600', gradientFrom: 'from-blue-600', gradientTo: 'to-blue-400' },
    { id: '2', name: 'Personal', emoji: '🏠', color: 'bg-green-600', gradientFrom: 'from-green-600', gradientTo: 'to-green-400' },
    { id: '3', name: 'Shopping', emoji: '🛒', color: 'bg-yellow-600', gradientFrom: 'from-yellow-600', gradientTo: 'to-yellow-400' },
    { id: '4', name: 'Health', emoji: '🏥', color: 'bg-red-600', gradientFrom: 'from-red-600', gradientTo: 'to-red-400' },
    { id: '5', name: 'Study', emoji: '📚', color: 'bg-purple-600', gradientFrom: 'from-purple-600', gradientTo: 'to-purple-400' },
  ];

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
      .collection('counters')
      .orderBy('lastUpdated', 'desc')
      .onSnapshot(
        (snapshot) => {
          const counterData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            record: doc.data().record || 0
          } as Counter));
          setCounters(counterData);
          setIsLoading(false);
        },
        (error) => {
          console.error('Firebase error:', error);
          setError('Error loading counters: ' + error.message);
          setIsLoading(false);
        }
      );

    return () => unsubscribe();
  }, []);

  const filteredCounters = useMemo(() => {
    return counters
      .filter(counter => 
        selectedCategory === 'all' || counter.category === selectedCategory
      )
      .sort((a, b) => {
        const modifier = sortOrder === 'asc' ? 1 : -1;
        switch (sortBy) {
          case 'count':
            return (a.count - b.count) * modifier;
          case 'name':
            return a.name.localeCompare(b.name) * modifier;
          case 'lastUpdated':
            return (a.lastUpdated - b.lastUpdated) * modifier;
          default:
            return 0;
        }
      });
  }, [counters, selectedCategory, sortOrder, sortBy]);

  const addCounter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCounterName.trim()) return;

    const currentUser = getCurrentUser();
    if (!currentUser) {
      setError('Please log in to add counters');
      return;
    }

    try {
      const timestamp = firebaseTimestamp();
      const category = selectedCategory === 'all' ? '1' : selectedCategory;
      const categoryData = categories.find(cat => cat.id === category);
      
      await noterFirestore
        .collection('users')
        .doc(currentUser.uid)
        .collection('counters')
        .add({
          name: newCounterName.trim(),
          count: 0,
          record: 0,
          category,
          createdAt: timestamp,
          lastUpdated: timestamp,
          color: categoryData?.color || 'bg-blue-600'
        });

      setNewCounterName('');
      setNotification('Counter added successfully!');
    } catch (error) {
      console.error('Error adding counter:', error);
      setError('Failed to add counter: ' + (error as Error).message);
    }
  };

  const updateCounter = async (counterId: string, increment: number) => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    try {
      const counterRef = noterFirestore
        .collection('users')
        .doc(currentUser.uid)
        .collection('counters')
        .doc(counterId);

      const counter = counters.find(c => c.id === counterId);
      if (counter && (counter.count + increment >= 0)) {
        const newCount = counter.count + increment;
        const updates: any = {
          count: newCount,
          lastUpdated: firebaseTimestamp()
        };

        if (newCount > counter.record) {
          updates.record = newCount;
          setShowReward({ show: true, counterId });
          setTimeout(() => setShowReward({ show: false, counterId: '' }), 3000);
        }

        await counterRef.update(updates);
      }
    } catch (error) {
      console.error('Error updating counter:', error);
      setError('Failed to update counter: ' + (error as Error).message);
    }
  };

  const updateRecord = async (counterId: string, newRecord: number) => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    try {
      await noterFirestore
        .collection('users')
        .doc(currentUser.uid)
        .collection('counters')
        .doc(counterId)
        .update({
          record: newRecord
        });
      setEditingRecord(null);
      setNotification('Record updated successfully!');
    } catch (error) {
      console.error('Error updating record:', error);
      setError('Failed to update record: ' + (error as Error).message);
    }
  };

  const deleteCounter = async (counterId: string) => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    try {
      await noterFirestore
        .collection('users')
        .doc(currentUser.uid)
        .collection('counters')
        .doc(counterId)
        .delete();
      
      setNotification('Counter deleted successfully!');
    } catch (error) {
      console.error('Error deleting counter:', error);
      setError('Failed to delete counter: ' + (error as Error).message);
    }
  };

  return (<><Side />
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-lg shadow-lg"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white">Task Counter</h1>
          <p className="text-gray-400">Track your task repetitions and break records!</p>
        </motion.div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Counter Form */}
        <motion.form
          onSubmit={addCounter}
          className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-lg shadow-lg space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={newCounterName}
              onChange={(e) => setNewCounterName(e.target.value)}
              placeholder="New counter name..."
              className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.emoji} {category.name}
                </option>
              ))}
            </select>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-lg hover:from-blue-700 hover:to-blue-500 transition-all"
            >
              Add Counter
            </motion.button>
          </div>
        </motion.form>

        {/* Filters and Sort */}
        <motion.div
          className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 rounded-lg shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedCategory(
                    selectedCategory === category.id ? 'all' : category.id
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-lg bg-gradient-to-r ${
                    selectedCategory === category.id
                      ? `${category.gradientFrom} ${category.gradientTo}`
                      : 'from-gray-800 to-gray-700'
                  } text-white transition-all`}
                >
                  {category.emoji} {category.name}
                </motion.button>
              ))}
            </div>
            
            <div className="flex gap-2 ml-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              >
                <option value="count">Sort by Count</option>
                <option value="name">Sort by Name</option>
                <option value="lastUpdated">Sort by Last Updated</option>
              </select>
              <motion.button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all"
              >
                <ArrowUpDown className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Counters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredCounters.map((counter) => {
              const category = categories.find(cat => cat.id === counter.category);
              return (
                <motion.div
                  key={counter.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`bg-gradient-to-r ${category?.gradientFrom} ${category?.gradientTo} p-1 rounded-lg shadow-lg`}
                >
                  <div className="bg-gray-900 p-6 rounded-lg h-full">
                    <div className="flex items-center justify-between w-full mb-4">
                      <h3 className="text-xl font-bold text-white">{counter.name}</h3>
                      <Badge className={counter.color}>
                        {category?.name}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-center gap-6 w-full my-4">
                      <motion.button
                        onClick={() => updateCounter(counter.id, -1)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-4xl w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-all shadow-lg"
                      >
                        <Minus className="w-8 h-8" />
                      </motion.button>
                      
                      <motion.div
                        key={counter.count}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-6xl font-bold text-white min-w-[120px] text-center"
                      >
                        {counter.count}
                      </motion.div>
                      
                      <motion.button
                        onClick={() => updateCounter(counter.id, 1)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-4xl w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 transition-all shadow-lg"
                      >
                        <Plus className="w-8 h-8" />
                      </motion.button>
                    </div>

                    {/* Record Display and Edit */}
                    <div className="flex items-center justify-between mt-4 px-2 py-1 bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        {editingRecord?.id === counter.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={editingRecord.value}
                              onChange={(e) => setEditingRecord({
                                ...editingRecord,
                                value: parseInt(e.target.value) || 0
                              })}
                              className="w-20 px-2 py-1 bg-gray-700 text-white rounded"
                            />
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateRecord(counter.id, editingRecord.value)}
                              className="p-1 text-green-500 hover:bg-gray-700 rounded"
                            >
                              <Save className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setEditingRecord(null)}
                              className="p-1 text-red-500 hover:bg-gray-700 rounded"
                            >
                              <X className="w-4 h-4" />
                            </motion.button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-yellow-500 font-bold">Record: {counter.record}</span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setEditingRecord({ id: counter.id, value: counter.record })}
                              className="p-1 text-gray-400 hover:bg-gray-700 rounded"
                            >
                              <Edit2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        )}
                      </div>
                      <motion.button
                        onClick={() => deleteCounter(counter.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-red-500 hover:bg-gray-700 rounded-lg"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Loading State */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8"
            >
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-400 mt-4">Loading counters...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        <AnimatePresence>
          {!isLoading && filteredCounters.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="text-center py-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg"
            >
              <p className="text-gray-400">No counters found. Create one to get started!</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Record Achievement Modal */}
        <AnimatePresence>
          {showReward.show && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
            >
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-8 rounded-lg shadow-xl text-center max-w-md mx-4">
                <img
                  src="/api/placeholder/400/300"
                  alt="Achievement unlocked"
                  className="w-full h-auto rounded-lg mb-4"
                />
                <h2 className="text-2xl font-bold text-yellow-500 mb-2">New Record!</h2>
                <p className="text-white">Congratulations! You've set a new personal record!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-4 right-4 bg-gradient-to-r from-green-600 to-green-400 text-white px-6 py-3 rounded-lg shadow-lg"
            >
              {notification}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
    </>
  );
};

export default CounterApp;