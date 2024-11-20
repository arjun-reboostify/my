import React, { useState, useEffect, useMemo } from 'react';
import { 
  noterFirestore, 
  firebaseTimestamp 
} from '../../firebase/index';
import Side from './Sidebar'
import getCurrentUser from '../../firebase/utils/getCurrentUser';
import { 
  Copy, 
  Link, 
  Trash2, 
  Edit, 
  Save, 
  X, 
  Filter,
  SortAsc,
  SortDesc,
  Tag,
  Search,
  Star
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from './component';
import { motion, AnimatePresence } from 'framer-motion';

interface StoredURL {
  id: string;
  fullUrl: string;
  prefix: string;
  domain: string;
  suffix: string;
  createdAt: any;
  notes?: string;
  category?: string;
  isFavorite?: boolean;
}

interface Snippet {
  id: string;
  title: string;
  content: string;
  language: string;
  createdAt: any;
  category?: string;
  isFavorite?: boolean;
}

const URLSnippetStorer: React.FC = () => {
  // URL State
  const [urls, setUrls] = useState<StoredURL[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [newUrlPrefix, setNewUrlPrefix] = useState('https://');
  const [newUrlSuffix, setNewUrlSuffix] = useState('.com');
  const [newUrlNotes, setNewUrlNotes] = useState('');
  const [newUrlCategory, setNewUrlCategory] = useState('General');
  
  // Snippet State
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [newSnippet, setNewSnippet] = useState('');
  const [newSnippetTitle, setNewSnippetTitle] = useState('');
  const [newSnippetLanguage, setNewSnippetLanguage] = useState('javascript');
  const [newSnippetCategory, setNewSnippetCategory] = useState('General');

  // Filtering and Sorting States
  const [urlSearchTerm, setUrlSearchTerm] = useState('');
  const [snippetSearchTerm, setSnippetSearchTerm] = useState('');
  const [urlSortBy, setUrlSortBy] = useState<'createdAt' | 'domain'>('createdAt');
  const [snippetSortBy, setSnippetSortBy] = useState<'createdAt' | 'title'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Predefined Lists
  const prefixes = ['https://', 'http://', 'www.'];
  const suffixes = ['.com', '.in', '.org', '.net', '.edu', '.ai'];
  const urlCategories = ['General', 'Work', 'Personal', 'Learning', 'Resources'];
  const snippetLanguages = ['llm prompts', 'javascript', 'python', 'typescript', 'html', 'css', 'sql'];
  const snippetCategories = ['General', 'Utility', 'Component', 'Algorithm', 'Reference'];

  // Firebase Realtime Sync Effect
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const urlsUnsubscribe = noterFirestore
      .collection('users')
      .doc(currentUser.uid)
      .collection('urls')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const urlData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as StoredURL));
        setUrls(urlData);
      });

    const snippetsUnsubscribe = noterFirestore
      .collection('users')
      .doc(currentUser.uid)
      .collection('snippets')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const snippetData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Snippet));
        setSnippets(snippetData);
      });

    return () => {
      urlsUnsubscribe();
      snippetsUnsubscribe();
    };
  }, []);

  // Filtered and Sorted URLs
  const filteredUrls = useMemo(() => {
    return urls
      .filter(url => 
        url.fullUrl.toLowerCase().includes(urlSearchTerm.toLowerCase()) ||
        (url.notes && url.notes.toLowerCase().includes(urlSearchTerm.toLowerCase()))
      )
      .sort((a, b) => {
        const modifier = sortOrder === 'desc' ? -1 : 1;
        const valueA = urlSortBy === 'domain' ? a.domain : a.createdAt;
        const valueB = urlSortBy === 'domain' ? b.domain : b.createdAt;
        return modifier * (valueA > valueB ? 1 : -1);
      });
  }, [urls, urlSearchTerm, urlSortBy, sortOrder]);

  // Filtered and Sorted Snippets
  const filteredSnippets = useMemo(() => {
    return snippets
      .filter(snippet => 
        snippet.title.toLowerCase().includes(snippetSearchTerm.toLowerCase()) ||
        snippet.content.toLowerCase().includes(snippetSearchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const modifier = sortOrder === 'desc' ? -1 : 1;
        const valueA = snippetSortBy === 'title' ? a.title : a.createdAt;
        const valueB = snippetSortBy === 'title' ? b.title : b.createdAt;
        return modifier * (valueA > valueB ? 1 : -1);
      });
  }, [snippets, snippetSearchTerm, snippetSortBy, sortOrder]);

  // Add URL Handler
  const addUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const fullUrl = `${newUrlPrefix}${newUrl}${newUrlSuffix}`;

    try {
      await noterFirestore
        .collection('users')
        .doc(currentUser.uid)
        .collection('urls')
        .add({
          fullUrl,
          prefix: newUrlPrefix,
          domain: newUrl,
          suffix: newUrlSuffix,
          notes: newUrlNotes,
          category: newUrlCategory,
          createdAt: firebaseTimestamp(),
          isFavorite: false
        });

      // Reset form
      setNewUrl('');
      setNewUrlNotes('');
      setNewUrlCategory('General');
    } catch (error) {
      console.error('Error adding URL:', error);
    }
  };

  // Add Snippet Handler
  const addSnippet = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    try {
      await noterFirestore
        .collection('users')
        .doc(currentUser.uid)
        .collection('snippets')
        .add({
          title: newSnippetTitle,
          content: newSnippet,
          language: newSnippetLanguage,
          category: newSnippetCategory,
          createdAt: firebaseTimestamp(),
          isFavorite: false
        });

      // Reset form
      setNewSnippet('');
      setNewSnippetTitle('');
      setNewSnippetCategory('General');
    } catch (error) {
      console.error('Error adding snippet:', error);
    }
  };

  // Toggle Favorite
  const toggleFavorite = async (type: 'url' | 'snippet', id: string, current: boolean) => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    try {
      await noterFirestore
        .collection('users')
        .doc(currentUser.uid)
        .collection(type === 'url' ? 'urls' : 'snippets')
        .doc(id)
        .update({ isFavorite: !current });
    } catch (error) {
      console.error(`Error toggling ${type} favorite:`, error);
    }
  };

  // Delete Handlers
  const deleteUrl = async (urlId: string) => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    try {
      await noterFirestore
        .collection('users')
        .doc(currentUser.uid)
        .collection('urls')
        .doc(urlId)
        .delete();
    } catch (error) {
      console.error('Error deleting URL:', error);
    }
  };

  const deleteSnippet = async (snippetId: string) => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    try {
      await noterFirestore
        .collection('users')
        .doc(currentUser.uid)
        .collection('snippets')
        .doc(snippetId)
        .delete();
    } catch (error) {
      console.error('Error deleting snippet:', error);
    }
  };

  // Clipboard Copy
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (<div className='bg-black'>
    <Side />
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-black min-h-screen p-4 sm:p-6"
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* URL Storer Section */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-900 p-4 sm:p-6 rounded-lg shadow-lg"
        >
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <Link className="mr-2" /> URL Storer
          </h2>
          
          {/* URL Input Form */}
          <form onSubmit={addUrl} className="space-y-4">
            <div className="flex gap-0">
              <select 
                value={newUrlPrefix}
                onChange={(e) => setNewUrlPrefix(e.target.value)}
                className="bg-gray-800 text-white rounded-lg px-2"
              >
                {prefixes.map(prefix => (
                  <option key={prefix} value={prefix}>{prefix}</option>
                ))}
              </select>
              
              <input 
                type="text" 
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="Enter domain"
                className="flex-1 bg-gray-800 text-white rounded-lg px-1 py-2"
                required 
              />
              
              <select 
                value={newUrlSuffix}
                onChange={(e) => setNewUrlSuffix(e.target.value)}
                className="bg-gray-800 text-white rounded-lg px-2"
              >
                {suffixes.map(suffix => (
                  <option key={suffix} value={suffix}>{suffix}</option>
                ))}
              </select>
            </div>
            
            <div className="flex gap-2">
              <input 
                type="text"
                value={newUrlNotes}
                onChange={(e) => setNewUrlNotes(e.target.value)}
                placeholder="Optional notes"
                className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2"
              />
              
              <select 
                value={newUrlCategory}
                onChange={(e) => setNewUrlCategory(e.target.value)}
                className="bg-gray-800 text-white rounded-lg px-4 py-2"
              >
                {urlCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Add URL
            </button>
          </form>

          {/* URL Search and Sort Controls */}
          <div className="flex gap-2 mt-4">
            <div className="relative flex-1">
              <input 
                type="text"
                placeholder="Search URLs..."
                value={urlSearchTerm}
                onChange={(e) => setUrlSearchTerm(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 pl-10"
              />
              <Search className="absolute left-3 top-3 text-gray-400" />
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={() => setUrlSortBy(urlSortBy === 'createdAt' ? 'domain' : 'createdAt')}
                  className="bg-gray-800 text-white rounded-lg px-4 py-2"
                >
                  <Filter className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Toggle Sort By</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                  className="bg-gray-800 text-white rounded-lg px-4 py-2"
                >
                  {sortOrder === 'desc' ? <SortDesc className="w-5 h-5" /> : <SortAsc className="w-5 h-5" />}
                </button>
              </TooltipTrigger>
              <TooltipContent>Toggle Sort Order</TooltipContent>
            </Tooltip>
          </div>

          {/* URL List with Animation */}
          <AnimatePresence>
            {filteredUrls.map(url => (
              <motion.div 
                key={url.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-800 p-3 rounded-lg flex items-center justify-between mt-2"
              >
                <div>
                  <div className="flex items-center">
                    <a 
                      href={url.fullUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-400 hover:underline mr-2"
                    >
                      {url.fullUrl}
                    </a>
                    <span className="text-xs bg-blue-500 text-white rounded px-2">
                      {url.category}
                    </span>
                  </div>
                  {url.notes && <p className="text-gray-400 text-sm">{url.notes}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        onClick={() => toggleFavorite('url', url.id, !!url.isFavorite)}
                        className={`${url.isFavorite ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-600`}
                      >
                        <Star className="w-4 h-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {url.isFavorite ? 'Remove Favorite' : 'Add Favorite'}
                    </TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        onClick={() => copyToClipboard(url.fullUrl)}
                        className="text-gray-400 hover:text-white"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Copy URL</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        onClick={() => deleteUrl(url.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Delete URL</TooltipContent>
                  </Tooltip>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Snippet Storer Section */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-900 p-4 sm:p-6 rounded-lg shadow-lg"
        >
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <Save className="mr-2" /> Snippet Storer
          </h2>
          
          {/* Snippet Input Form */}
          <form onSubmit={addSnippet} className="space-y-4">
            <div className="flex gap-2">
              <input 
                type="text"
                value={newSnippetTitle}
                onChange={(e) => setNewSnippetTitle(e.target.value)}
                placeholder="Snippet Title"
                className="flex-1 bg-gray-800 text-white rounded-lg px-1 py-2"
                required
              />
              
              <select 
                value={newSnippetLanguage}
                onChange={(e) => setNewSnippetLanguage(e.target.value)}
                className="bg-gray-800 text-white rounded-lg px-4 py-2"
              >
                {snippetLanguages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
            
            <div className="flex gap-2">
              <textarea 
                value={newSnippet}
                onChange={(e) => setNewSnippet(e.target.value)}
                placeholder="Enter your code snippet..."
                className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 h-40"
                required
              />
              
              <select 
                value={newSnippetCategory}
                onChange={(e) => setNewSnippetCategory(e.target.value)}
                className="bg-gray-800 text-white rounded-lg px-4 py-2"
              >
                {snippetCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Add Snippet
            </button>
          </form>

          {/* Snippet Search and Sort Controls */}
          <div className="flex gap-2 mt-4">
            <div className="relative flex-1">
              <input 
                type="text"
                placeholder="Search Snippets..."
                value={snippetSearchTerm}
                onChange={(e) => setSnippetSearchTerm(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 pl-10"
              />
              <Search className="absolute left-3 top-3 text-gray-400" />
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={() => setSnippetSortBy(snippetSortBy === 'createdAt' ? 'title' : 'createdAt')}
                  className="bg-gray-800 text-white rounded-lg px-4 py-2"
                >
                  <Filter className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Toggle Sort By</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                  className="bg-gray-800 text-white rounded-lg px-4 py-2"
                >
                  {sortOrder === 'desc' ? <SortDesc className="w-5 h-5" /> : <SortAsc className="w-5 h-5" />}
                </button>
              </TooltipTrigger>
              <TooltipContent>Toggle Sort Order</TooltipContent>
            </Tooltip>
          </div>

          {/* Snippet List with Animation */}
          <AnimatePresence>
            {filteredSnippets.map(snippet => (
              <motion.div 
                key={snippet.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-800 p-3 rounded-lg mt-2"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <h3 className="text-white font-bold mr-2">{snippet.title}</h3>
                    <span className="text-xs bg-green-500 text-white rounded px-2">
                      {snippet.language}
                    </span>
                    <span className="text-xs bg-blue-500 text-white rounded px-2 ml-1">
                      {snippet.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button 
                          onClick={() => toggleFavorite('snippet', snippet.id, !!snippet.isFavorite)}
                          className={`${snippet.isFavorite ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-600`}
                        >
                          <Star className="w-4 h-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {snippet.isFavorite ? 'Remove Favorite' : 'Add Favorite'}
                      </TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button 
                          onClick={() => copyToClipboard(snippet.content)}
                          className="text-gray-400 hover:text-white"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Copy Snippet</TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button 
                          onClick={() => deleteSnippet(snippet.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Delete Snippet</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
                <pre className="bg-gray-700 p-2 rounded text-white text-sm overflow-x-auto">
                  {snippet.content}
                </pre>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
    </div>
  );
};

export default URLSnippetStorer;