import React, { useState } from 'react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: 'Home', path: '/', emoji: '🏠' },
    { label: 'Music', path: '/Song', emoji: '🎶' },
    { label: 'Solver', path: '/G', emoji: '⭐' },
    { label: 'Chat', path: '/Chat', emoji: '⭐' },
    { label: 'Url', path: '/Url', emoji: '⭐' },
    { label: 'Todo', path: '/todo', emoji: '📝' }
  ];

  return (
    <>
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 p-2 text-2xl text-white bg-black rounded-md shadow-md hover:bg-gray-900 transition-colors duration-200"
        aria-label="Open menu"
      >
        ☰
      </button>

      {/* Background Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full w-64 bg-black shadow-lg z-50 text-white
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Close button */}
          <div className="p-4 flex justify-end">
            <button 
              onClick={() => setIsOpen(false)}
              className="text-2xl text-white hover:text-white"
              aria-label="Close menu"
            >
              ✖️
            </button>
          </div>

          {/* Menu items */}
          <nav className="flex-1">
            <ul className="px-2 py-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <a
                    href={item.path}
                    className="flex items-center gap-3 px-4 py-3 text-white 
                             hover:bg-gray-100 rounded-md mb-1 transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-xl">{item.emoji}</span>
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <span>Made with</span> 
              <span className="text-base">❤️ </span>
              <span>by ARJUN</span> 
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;