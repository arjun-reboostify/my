import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  ArrowUp, 
  ArrowDown, 
  Calendar, 
  Tag, 
  AlignLeft,
  Sun,
  Moon,
  X,
  Expand,
  Search
} from 'lucide-react';

// Blog Interface with more robust typing
interface Blog {
  id: number;
  title: string;
  category: string;
  content: string;
  fullContent?: string;
  date: Date;
  readTime: number;
  author: string;
  tags?: string[];
}

// Sort Configuration Type
interface SortConfig {
  key: keyof Blog;
  direction: 'ascending' | 'descending';
}

// Blog Tiles Component
const BlogTiles: React.FC = () => {
  // Sample Blog Data with more comprehensive information
  const [blogs] = useState<Blog[]>([
    {
      id: 1,
      title: "git problems",
      category: "git",
      content: "if you are stuck with fatal error of pushing in git through terminal",
      fullContent: `
      to go back to previous or undo commit use this command


       git reset --hard HEAD~1

       
       it will go back 1 commit
      `,
      date: new Date("2024-01-15"),
      readTime: 5,
      author: "Jane Doe",
      tags: ["React", "Hooks", "Frontend"]
    },
    {
        id: 1,
        title: "Mastering React Hooks",
        category: "Technoy",
        content: "Deep dive into the world of React hooks and modern development techniques...",
        fullContent: `
          React Hooks revolutionized the way we write React components by allowing functional components to have state and lifecycle methods. 
          fwfwfwfwf
          Key Hooks like useState, useEffect, and useContext provide powerful ways to manage component logic:
  
          1. useState: Allows functional components to have state
          2. useEffect: Handles side effects and lifecycle methods
          3. useContext: Enables easier state management across components
  
          Custom hooks take this further by letting you extract component logic into reusable functions, making your code more modular and easier to maintain.
          mdkmwldklwmkdwklmdwmd;wmd;kw;kd
          dkwmd;lwmd;lmwkmdkenduhwuifh
          wfjwf
          wfbjwf
          wfwf
          wfwf
          wfClaude 3.5 Sonnet
Our most intelligent model to date
200K context window
50% discount with the Batches API*
$3 / MTok
Input
$3.75 / MTok
Prompt caching write
$0.30 / MTok
Prompt caching read
$15 / MTok
Output
Claude 3.5 Haiku
Fastest, most cost-effective model
200K context window
50% discount with the Batches API*
$1 / MTok
Input
$1.25 / MTok
Prompt caching write
$0.10 / MTok
Prompt caching read
$5 / MTok
Output
Claude 3 Opus
Powerful model for complex tasks
200K context window
50% discount with the Batches API*
$15 / MTok
Input
$18.75 / MTok
Prompt caching write
$1.50 / MTok
Prompt caching read
$75 / MTok
Output
*Learn more about the Message Batches API

Start building
Explore legacy models
Claude 3 Haiku
Fastest, most cost-effective model
200K context window
50% discount with the Batches API*
$0.25 / MTok
Input
$0.30 / MTok
Prompt caching write
$0.03 / MTok
Prompt caching read
$1.25 / MTok
Output
Claude 3 Sonnet
Balance of speed, cost, and performance
200K context window
$3 / MTok

Input

$15 / MTok

Output

*Learn more about the Message Batches API

Learn morewcw
w
c
w

w
w

w
w
w

w

w
w

w
w

w
w
w

        `,
        date: new Date("2024-01-15"),
        readTime: 5,
        author: "Jane Doe",
        tags: ["React", "Hooks", "Frontend"]
      },
    // ... other blog entries (as before)
  ]);

  // State Hooks
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'date',
    direction: 'descending'
  });
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Memoized Categories
  const categories = useMemo(() => 
    ['All', ...Array.from(new Set(blogs.map(blog => blog.category)))], 
    [blogs]
  );

  // Enhanced Sorting and Filtering Function
  const processBlogs = useCallback(() => {
    let processedBlogs = [...blogs];

    // Search Filter
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      processedBlogs = processedBlogs.filter(blog => 
        blog.title.toLowerCase().includes(lowercaseQuery) ||
        blog.content.toLowerCase().includes(lowercaseQuery) ||
        blog.category.toLowerCase().includes(lowercaseQuery) ||
        blog.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      );
    }

    // Category Filter
    if (selectedCategory !== 'All') {
      processedBlogs = processedBlogs.filter(blog => 
        blog.category === selectedCategory
      );
    }

    // Sorting
    return processedBlogs.sort((a, b) => {
      const valueA = a[sortConfig.key];
      const valueB = b[sortConfig.key];

      // Robust comparison
      if (valueA == null) return sortConfig.direction === 'ascending' ? -1 : 1;
      if (valueB == null) return sortConfig.direction === 'ascending' ? 1 : -1;

      if (valueA instanceof Date && valueB instanceof Date) {
        return sortConfig.direction === 'ascending'
          ? valueA.getTime() - valueB.getTime()
          : valueB.getTime() - valueA.getTime();
      }

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortConfig.direction === 'ascending'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return sortConfig.direction === 'ascending'
          ? valueA - valueB
          : valueB - valueA;
      }

      return 0;
    });
  }, [blogs, searchQuery, selectedCategory, sortConfig]);

  // Processed Blogs
  const processedBlogs = useMemo(processBlogs, [processBlogs]);

  // Event Handlers
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const openFullBlog = (blog: Blog) => setSelectedBlog(blog);
  const closeFullBlog = () => setSelectedBlog(null);

  const handleSort = (key: keyof Blog) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'descending' 
        ? 'ascending' 
        : 'descending'
    }));
  };

  // Render Methods
  const renderBlogTile = (blog: Blog) => (
    <motion.div
      key={blog.id}
      layoutId={`blog-${blog.id}`}
      className={`
        rounded-xl shadow-lg overflow-hidden cursor-pointer
        transform transition-all duration-300
        ${isDarkMode 
          ? 'bg-gray-800 text-gray-100 border-gray-700' 
          : 'bg-white text-gray-900 border-gray-100'
        }
      `}
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.3 } 
      }}
      onClick={() => openFullBlog(blog)}
    >
      {/* Blog Tile Content */}
      <div className="p-6">
        <h3 className={`
          text-xl font-bold mb-2
          ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}
        `}>
          {blog.title}
        </h3>
        <p className={`
          text-sm mb-4
          ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}
        `}>
          {blog.content.substring(0, 100)}...
        </p>
        <div className="flex justify-between items-center">
          <span className={`
            px-2 py-1 rounded text-xs
            ${isDarkMode 
              ? 'bg-gray-700 text-gray-300' 
              : 'bg-gray-200 text-gray-700'
            }
          `}>
            {blog.category}
          </span>
          <span className="text-sm">
            {blog.readTime} min read
          </span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className={`
      min-h-screen p-6
      ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}
      transition-colors duration-300
    `}>
      {/* Header with Search, Category, and Dark Mode */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        {/* Search Input */}
        <div className="relative w-full md:w-1/3">
          <input 
            type="text"
            placeholder="Search blogs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`
              w-full p-2 pl-10 rounded-lg
              ${isDarkMode 
                ? 'bg-gray-800 text-gray-100 border-gray-700' 
                : 'bg-gray-100 text-gray-900 border-gray-300'
              }
            `}
          />
          <Search 
            className={`
              absolute left-3 top-3
              ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}
            `} 
            size={20} 
          />
        </div>

        {/* Category Filter */}
        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className={`
            p-2 rounded-lg
            ${isDarkMode 
              ? 'bg-gray-800 text-gray-100 border-gray-700' 
              : 'bg-gray-100 text-gray-900 border-gray-300'
            }
          `}
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        {/* Dark Mode Toggle */}
        <button 
          onClick={toggleDarkMode}
          className={`
            p-2 rounded-full transition-all duration-300
            ${isDarkMode 
              ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }
          `}
        >
          {isDarkMode ? <Sun /> : <Moon />}
        </button>
      </div>

      {/* Blogs Grid */}
      <AnimatePresence>
        {processedBlogs.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              hidden: { opacity: 0 },
              visible: { 
                opacity: 1,
                transition: {
                  delayChildren: 0.3,
                  staggerChildren: 0.2
                }
              }
            }}
          >
            {processedBlogs.map(renderBlogTile)}
          </motion.div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No blogs found matching your search or category.
          </div>
        )}
      </AnimatePresence>

      {/* Blog Modal */}
      {selectedBlog && (
        <motion.div
          className={`
            fixed inset-0 z-50 flex items-center justify-center 
            p-4 overflow-y-auto
            ${isDarkMode ? 'bg-black bg-opacity-80' : 'bg-white bg-opacity-90'}
          `}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Modal Content */}
          <motion.div 
            layoutId={`blog-${selectedBlog.id}`}
            className={`
              w-full max-w-4xl max-h-[90vh] overflow-y-auto 
              rounded-2xl p-8 shadow-2xl
              ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}
            `}
          >
            {/* Blog Details */}
            <div>
              <h2 className="text-3xl font-bold mb-4">{selectedBlog.title}</h2>
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <span className="mr-4 text-sm text-gray-500">
                    {selectedBlog.date.toLocaleDateString()}
                  </span>
                  <span className="text-sm text-gray-500">
                    By {selectedBlog.author}
                  </span>
                </div>
                <button onClick={closeFullBlog} className="text-red-500">
                  <X />
                </button>
              </div>

              {/* Blog Content */}
              <div className="prose dark:prose-invert">
                {selectedBlog.fullContent?.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default BlogTiles;