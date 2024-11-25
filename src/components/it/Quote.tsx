import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, Bot, User, Moon, Sun, Loader } from 'lucide-react';
import Side from './Sidebar'

// Types
type ContentItem = {
  title: string;
  paragraph: string;
};

type Message = {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
};

const EnhancedAIChat = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentTypingText, setCurrentTypingText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sample content - replace with your actual content
  const content: ContentItem[] = [
    {
      title: "What is artificial intelligence machine learning",
      paragraph: "Artificial Intelligence (AI) and Machine Learning represent cutting-edge technologies that enable computers to simulate human intelligence. These systems can analyze data, learn from patterns, and make intelligent decisions, revolutionizing various industries from healthcare to finance."
    },
    {
      title: "How does neural network deep learning work",
      paragraph: "Neural networks and deep learning systems are sophisticated architectures inspired by the human brain. They process information through interconnected layers of artificial neurons, enabling them to recognize patterns, make predictions, and solve complex problems through training on vast amounts of data."
    },
    {
      title: "Chat GPT and language models explanation",
      paragraph: "Large Language Models like ChatGPT are advanced AI systems trained on massive amounts of text data. They can understand context, generate human-like responses, and assist with various tasks from writing to coding, representing a significant breakthrough in natural language processing."
    }
  ];

  // Enhanced fuzzy matching function
  const findBestMatch = (input: string): string => {
    const inputWords = input.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").split(/\s+/);
    let bestMatch = { score: 0, paragraph: '' };

    content.forEach(item => {
      const titleWords = item.title.toLowerCase().split(/\s+/);
      let matchScore = 0;

      inputWords.forEach(inputWord => {
        titleWords.forEach(titleWord => {
          // Exact match
          if (inputWord === titleWord) {
            matchScore += 2;
          }
          // Partial match (substring)
          else if (titleWord.includes(inputWord) || inputWord.includes(titleWord)) {
            matchScore += 1;
          }
          // Levenshtein distance for similar words
          else if (levenshteinDistance(inputWord, titleWord) <= 2) {
            matchScore += 0.5;
          }
        });
      });

      if (matchScore > bestMatch.score) {
        bestMatch = { score: matchScore, paragraph: item.paragraph };
      }
    });

    return bestMatch.score > 0 
      ? bestMatch.paragraph 
      : "I understand you're trying to communicate with me, but I'm not quite sure what you're asking about. Could you try rephrasing your question?";
  };

  // Levenshtein distance calculation for fuzzy matching
  const levenshteinDistance = (str1: string, str2: string): number => {
    const track = Array(str2.length + 1).fill(null).map(() =>
      Array(str1.length + 1).fill(null));
    for (let i = 0; i <= str1.length; i += 1) {
      track[0][i] = i;
    }
    for (let j = 0; j <= str2.length; j += 1) {
      track[j][0] = j;
    }
    for (let j = 1; j <= str2.length; j += 1) {
      for (let i = 1; i <= str1.length; i += 1) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        track[j][i] = Math.min(
          track[j][i - 1] + 1,
          track[j - 1][i] + 1,
          track[j - 1][i - 1] + indicator
        );
      }
    }
    return track[str2.length][str1.length];
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = inputText;
    setInputText('');

    // Add thinking delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const response = findBestMatch(userInput);
    await typeResponse(response);
  };
  const WELCOME_MESSAGE = "Hello! I'm an AI assistant trained to help you understand AI and technology concepts. Feel free to ask me anything about artificial intelligence, machine learning, or technology.";
  const typeResponse = async (text: string) => {
    setIsTyping(true);
    let currentText = '';
    const words = text.split(' ');
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      currentText += (i > 0 ? ' ' : '') + word;
      setCurrentTypingText(currentText);
      // Random delay between words (30-80ms)
      await new Promise(resolve => setTimeout(resolve, Math.random() * 50 + 30));
    }
    
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text: text,
      isBot: true,
      timestamp: new Date()
    }]);
    setCurrentTypingText('');
    setIsTyping(false);
  };
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentTypingText]);

  useEffect(() => {
    const sendWelcomeMessage = async () => {
      await new Promise(resolve => setTimeout(resolve, 500)); // Small initial delay
      await typeResponse(WELCOME_MESSAGE);
    };

    sendWelcomeMessage();
  }, []); // 

  return (<><Side />
    <div className={`flex flex-col h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <div className="flex items-center gap-3">
          <Bot className={`w-8 h-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            AI Assistant
          </h1>
        </div>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-600'} 
            hover:bg-opacity-80 transition-all duration-300`}
        >
          {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>
      </div>

      {/* Messages */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} animate-fadeIn`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-[1.02] 
                ${message.isBot 
                  ? `${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`
                  : 'bg-blue-500 text-white'
                }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {message.isBot ? (
                  <Bot className="w-5 h-5" />
                ) : (
                  <User className="w-5 h-5" />
                )}
                <span className="text-sm font-medium">
                  {message.isBot ? 'AI Assistant' : 'You'}
                </span>
                <span className="text-xs opacity-50">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <p className="leading-relaxed">{message.text}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start animate-fadeIn">
            <div className={`max-w-[80%] p-4 rounded-2xl shadow-lg 
              ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
              <div className="flex items-center gap-2 mb-2">
                <Bot className="w-5 h-5" />
                <span className="text-sm font-medium">AI Assistant</span>
                <Loader className="w-4 h-4 animate-spin" />
              </div>
              <p className="leading-relaxed">
                {currentTypingText}
                <span className="animate-pulse ml-1">▋</span>
              </p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <div className="flex gap-3 max-w-4xl mx-auto">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type anything..."
            className={`flex-1 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all
              ${isDarkMode 
                ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600' 
                : 'bg-gray-100 text-gray-900 placeholder-gray-500 border-gray-300'
              } border`}
          />
          <button
            type="submit"
            className={`p-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 
              transition-colors duration-300 flex items-center gap-2 ${
                !inputText.trim() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            disabled={!inputText.trim()}
          >
            <Send className="w-5 h-5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </form>
    </div>
    </>
  );

};


export default EnhancedAIChat;

// Add these to your global CSS or Tailwind config
const style = {
  '.animate-fadeIn': {
    '@keyframes fadeIn': {
      '0%': { opacity: '0', transform: 'translateY(10px)' },
      '100%': { opacity: '1', transform: 'translateY(0)' }
    },
    animation: 'fadeIn 0.3s ease-out forwards'
  }
};