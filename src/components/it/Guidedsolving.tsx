import { useState, useEffect } from 'react';
import { useHref } from 'react-router-dom';
import Side from './Sidebar'

interface PlayerInfo {
  name: string;
  birthDate: string;
  age: {
    years: number;
    months: number;
  };
  lifeState: string;
}

interface Stat {
  name: string;
  progress: number;
  currentLevel: number;
  destinyLevel: number;
  tasks: Task[];
}

interface Task {
  id: string;
  description: string;
  completed: boolean;
  statId: string;
  repeatCount: number;  // New field to track repetitions
  timeCompleted?: Date; // New field to track completion time
}

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
}

interface Reward {
  id: string;
  name: string;
  cost: number;
  purchased: boolean;
  href:string
}

const GameOfLifeDashboard = () => {
  // State management
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo>(() => {
    const saved = localStorage.getItem('playerInfo');
    return saved ? JSON.parse(saved) : {
      name: 'Player',
      birthDate: '',
      age: { years: 0, months: 0 },
      lifeState: 'Beginner'
    };
  });

  const [stats, setStats] = useState<Stat[]>(() => {
    const saved = localStorage.getItem('stats');
    return saved ? JSON.parse(saved) : [
      { name: '💪 Strength', progress: 0, currentLevel: 1, destinyLevel: 10, tasks: [] },
      { name: '🧠 Intelligence', progress: 0, currentLevel: 1, destinyLevel: 10, tasks: [] },
      { name: '❤️ Health', progress: 0, currentLevel: 1, destinyLevel: 10, tasks: [] },
      { name: '⚡ Energy', progress: 0, currentLevel: 1, destinyLevel: 10, tasks: [] }
    ];
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('inventory');
    return saved ? JSON.parse(saved) : [];
  });

  const [rewards, setRewards] = useState<Reward[]>(() => {
    const saved = localStorage.getItem('rewards');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: '🎮 Gaming Time', cost: 100, purchased: false, href: '/gaming' },
      { id: '2', name: '📱 Phone Time', cost: 150, purchased: false, href: '/phone' },
      { id: '3', name: '🎬 Move Night', cost: 200, purchased: false, href: '/fuck' }
    ];
  });

  const [points, setPoints] = useState(() => {
    const saved = localStorage.getItem('points');
    return saved ? parseInt(saved) : 0;
  });

  const [playerLevel, setPlayerLevel] = useState(() => {
    const saved = localStorage.getItem('playerLevel');
    return saved ? parseInt(saved) : 1;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('playerInfo', JSON.stringify(playerInfo));
    localStorage.setItem('stats', JSON.stringify(stats));
    localStorage.setItem('inventory', JSON.stringify(inventory));
    localStorage.setItem('rewards', JSON.stringify(rewards));
    localStorage.setItem('points', points.toString());
    localStorage.setItem('playerLevel', playerLevel.toString());
  }, [playerInfo, stats, inventory, rewards, points, playerLevel]);

  // Calculate age from birthdate
  useEffect(() => {
    if (playerInfo.birthDate) {
      const birth = new Date(playerInfo.birthDate);
      const now = new Date();
      const years = now.getFullYear() - birth.getFullYear();
      const months = now.getMonth() - birth.getMonth();
      setPlayerInfo(prev => ({
        ...prev,
        age: { years, months: months < 0 ? months + 12 : months }
      }));
    }
  }, [playerInfo.birthDate]);

  // Calculate overall progress
  const calculateOverallProgress = () => {
    const totalProgress = stats.reduce((acc, stat) => acc + stat.progress, 0);
    return Math.round((totalProgress / (stats.length * 100)) * 100);
  };

  // Add new task
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const toggleTask = (taskId: string, statId: string) => {
    setStats(prevStats => {
      return prevStats.map(stat => {
        if (stat.name === statId) {
          const updatedTasks = stat.tasks.map(task => {
            if (task.id === taskId) {
              // If completing the task
              if (!task.completed) {
                const repeatBonus = task.repeatCount > 0 ? Math.floor(task.repeatCount / 3) : 0;
                setPoints(prev => prev + 10 + repeatBonus); // Base points + bonus for repetitions
                return {
                  ...task,
                  completed: true,
                  repeatCount: task.repeatCount + 1,
                  timeCompleted: new Date()
                };
              } else {
                // If unchecking, reset completion but keep repeat count
                return {
                  ...task,
                  completed: false,
                  timeCompleted: undefined
                };
              }
            }
            return task;
          });
          const completedCount = updatedTasks.filter(t => t.completed).length;
          const progress = Math.round((completedCount / updatedTasks.length) * 100) || 0;

          if (progress === 100 && stat.currentLevel < stat.destinyLevel) {
            setPoints(prev => prev + 50);
            return {
              ...stat,
              tasks: updatedTasks,
              progress,
              currentLevel: stat.currentLevel + 1
            };
          }

          return {
            ...stat,
            tasks: updatedTasks,
            progress
          };
        }
        return stat;
      });
    });
  };

  // Add new task with initial repeat count
  const addTask = (statId: string, description: string) => {
    setStats(prevStats => {
      return prevStats.map(stat => {
        if (stat.name === statId) {
          return {
            ...stat,
            tasks: [...stat.tasks, {
              id: Date.now().toString(),
              description,
              completed: false,
              statId,
              repeatCount: 0
            }]
          };
        }
        return stat;
      });
    });
  };
  const addInventoryItem = (name: string, quantity: number) => {
    setInventory(prev => [...prev, {
      id: Date.now().toString(),
      name,
      quantity
    }]);
    setIsEditing(false);
    setEditingItem(null);
  };

  // Add reward
  const addReward = (name: string, cost: number) => {
    setRewards(prev => [...prev, {
      id: Date.now().toString(),
      name,
      cost,
      purchased: false,
      href: `/${name.toLowerCase().replace(/[^a-z0-9]/, '-')}`
    }]);
    setIsEditing(false);
    setEditingItem(null);
  };

  // Update stat levels
  const updateStatLevel = (statName: string, currentLevel: number, destinyLevel: number) => {
    setStats(prev => prev.map(stat => {
      if (stat.name === statName) {
        return {
          ...stat,
          currentLevel,
          destinyLevel
        };
      }
      return stat;
    }));
  };

  // Level up check
  useEffect(() => {
    const overallProgress = calculateOverallProgress();
    if (overallProgress === 100) {
      setPlayerLevel(prev => prev + 1);
      setPoints(prev => prev + 100); // Bonus points for leveling up
      
      // Reset progress but keep tasks
      setStats(prev => prev.map(stat => ({
        ...stat,
        progress: 0,
        currentLevel: stat.currentLevel + 1
      })));
    }
  }, [stats]);

  // Export configuration
  const exportConfig = () => {
    const config = {
      playerInfo,
      stats,
      inventory,
      rewards,
      points,
      playerLevel
    };
    const blob = new Blob([JSON.stringify(config)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'game-of-life-config.json';
    a.click();
  };

  // Import configuration
  const importConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const config = JSON.parse(e.target?.result as string);
        setPlayerInfo(config.playerInfo);
        setStats(config.stats);
        setInventory(config.inventory);
        setRewards(config.rewards);
        setPoints(config.points);
        setPlayerLevel(config.playerLevel);
      };
      reader.readAsText(file);
    }
  };
 

  // Delete task
  const deleteTask = (taskId: string, statId: string) => {
    setStats(prevStats => {
      return prevStats.map(stat => {
        if (stat.name === statId) {
          const updatedTasks = stat.tasks.filter(task => task.id !== taskId);
          const completedCount = updatedTasks.filter(t => t.completed).length;
          const progress = updatedTasks.length ? 
            Math.round((completedCount / updatedTasks.length) * 100) : 0;
          
          return {
            ...stat,
            tasks: updatedTasks,
            progress
          };
        }
        return stat;
      });
    });
  };

  // Reset all data
  const resetGame = () => {
    const initialStats = [
      { name: '💪 Strength', progress: 0, currentLevel: 1, destinyLevel: 10, tasks: [] },
      { name: '🧠 Intelligence', progress: 0, currentLevel: 1, destinyLevel: 10, tasks: [] },
      { name: '❤️ Health', progress: 0, currentLevel: 1, destinyLevel: 10, tasks: [] },
      { name: '⚡ Energy', progress: 0, currentLevel: 1, destinyLevel: 10, tasks: [] }
    ];

    setPlayerInfo({
      name: 'Player',
      birthDate: '',
      age: { years: 0, months: 0 },
      lifeState: 'Beginner'
    });
    setStats(initialStats);
    setInventory([]);
    setRewards([
      { id: '1', name: '🎮 Gaming Time', cost: 100, purchased: false, href: '/gaming' },
      { id: '2', name: '📱 Phone Time', cost: 150, purchased: false, href: '/phone' },
      { id: '3', name: '🎬 Moght', cost: 200, purchased: false, href: '/fuck' }
    ]);
    setPoints(0);
    setPlayerLevel(1);
    setShowResetConfirm(false);
  };
   return (<><Side />
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-7xl mx-auto mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Game of Life Dashboard</h1>
        <button
          onClick={() => setShowResetConfirm(true)}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition-colors"
        >
          Reset Game
        </button>
      </div>

      <div className="max-w-7xl mx-auto grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Player Info Section */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Player Info</h2>
          <div className="space-y-2">
            <input
              type="text"
              value={playerInfo.name}
              onChange={(e) => setPlayerInfo(prev => ({ ...prev, name: e.target.value }))}
              className="bg-gray-700 p-2 rounded w-full"
              placeholder="Name"
            />
            <input
              type="date"
              value={playerInfo.birthDate}
              onChange={(e) => setPlayerInfo(prev => ({ ...prev, birthDate: e.target.value }))}
              className="bg-gray-700 p-2 rounded w-full"
            />
            <p>Age: {playerInfo.age.years}y {playerInfo.age.months}m</p>
            <p>Level: {playerLevel}</p>
            <p>Points: {points}</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Stats</h2>
          <div className="space-y-4">
            {stats.map(stat => (
              <div key={stat.name} className="space-y-2">
                <div className="flex justify-between">
                  <span>{stat.name}</span>
                  <span>Level {stat.currentLevel}/{stat.destinyLevel}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${stat.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks Section */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Tasks</h2>
          {stats.map(stat => (
            <div key={stat.name} className="mb-4">
              <h3 className="font-bold">{stat.name}</h3>
              <div className="space-y-2">
                {stat.tasks.map(task => (
                  <div key={task.id} className="flex items-center justify-between bg-gray-700 p-2 rounded">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id, stat.name)}
                        className="form-checkbox h-5 w-5"
                      />
                      <span className={task.completed ? 'line-through' : ''}>
                        {task.description}
                      </span>
                      {task.repeatCount > 0 && (
                        <span className="text-xs bg-blue-600 px-2 py-1 rounded-full">
                          ×{task.repeatCount}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => deleteTask(task.id, stat.name)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <input
                  type="text"
                  placeholder="Add current state --> desired state"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addTask(stat.name, (e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                  className="bg-gray-700 p-2 rounded w-full"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Progress Overview */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Overall Progress</h2>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{calculateOverallProgress()}%</div>
            <div className="w-full bg-gray-700 rounded-full h-4">
              <div
                className="bg-green-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${calculateOverallProgress()}%` }}
              />
            </div>
          </div>
        </div>

        {/* Inventory Section */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Inventory</h2>
          <div className="space-y-2">
            {inventory.map(item => (
              <div key={item.id} className="flex justify-between">
                <span>{item.name}</span>
                <span>x{item.quantity}</span>
              </div>
            ))}
            <button
              onClick={() => {
                setIsEditing(true);
                setEditingItem({ type: 'inventory' });
              }}
              className="bg-blue-600 px-4 py-2 rounded w-full"
            >
              Add Item
            </button>
          </div>
        </div>

        {/* Rewards Section */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Rewards</h2>
          <div className="space-y-2">
          {rewards.map(reward => (
  <div key={reward.id} className="flex justify-between items-center">
    <a href={reward.href} className="text-white hover:text-blue-300 transition-colors">
      {reward.name}
    </a>
    <button
      onClick={() => {
        if (points >= reward.cost && !reward.purchased) {
          setPoints(prev => prev - reward.cost);
          setRewards(prev =>
            prev.map(r =>
              r.id === reward.id ? { ...r, purchased: true } : r
            )
          );
        }
      }}
      disabled={reward.purchased || points < reward.cost}
      className={`px-4 py-2 rounded ${
        reward.purchased
          ? 'bg-gray-600'
          : points >= reward.cost
          ? 'bg-green-600'
          : 'bg-red-600'
      }`}
    >
      {reward.purchased ? 'Purchased' : `${reward.cost} pts`}
    </button>
  </div>
))}
          </div>
        </div>

        {/* Import/Export Section */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Config</h2>
          <div className="space-y-2">
            <button
              onClick={exportConfig}
              className="bg-blue-600 px-4 py-2 rounded w-full"
            >
              Export Config
            </button>
            <label className="block">
              <span className="sr-only">Import Config</span>
              <input
                type="file"
                accept=".json"
                onChange={importConfig}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-600 file:text-white
                  hover:file:bg-blue-700"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-96 shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Reset Game</h3>
            <p className="mb-4">Are you sure you want to reset all progress? This cannot be undone.</p>
            <div className="flex space-x-4">
              <button
                onClick={resetGame}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded w-1/2 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded w-1/2 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-96 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {editingItem?.type === 'inventory' ? 'Add Inventory Item' : 
                 editingItem?.type === 'reward' ? 'Add Reward' : 'Edit Item'}
              </h3>
              <button 
                onClick={() => {
                  setIsEditing(false);
                  setEditingItem(null);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {editingItem?.type === 'inventory' && (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Item name"
                  className="bg-gray-700 p-3 rounded w-full"
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  min="1"
                  className="bg-gray-700 p-3 rounded w-full"
                  onChange={(e) => setEditingItem({ ...editingItem, quantity: parseInt(e.target.value) })}
                />
                <button
                  onClick={() => addInventoryItem(editingItem.name, editingItem.quantity)}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded w-full"
                  disabled={!editingItem.name || !editingItem.quantity}
                >
                  Add Item
                </button>
              </div>
            )}

            {editingItem?.type === 'reward' && (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Reward name"
                  className="bg-gray-700 p-3 rounded w-full"
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Cost in points"
                  min="1"
                  className="bg-gray-700 p-3 rounded w-full"
                  onChange={(e) => setEditingItem({ ...editingItem, cost: parseInt(e.target.value) })}
                />
                <button
                  onClick={() => addReward(editingItem.name, editingItem.cost)}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded w-full"
                  disabled={!editingItem.name || !editingItem.cost}
                >
                  Add Reward
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Level Up Toast */}
      {playerLevel > 1 && (
        <div className="fixed bottom-4 right-4 bg-green-600 p-4 rounded-lg shadow-lg animate-bounce">
          Level Up! Now Level {playerLevel}
        </div>
      )}
    </div>
    </>
  );
};

export default GameOfLifeDashboard;