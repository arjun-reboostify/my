import React, { useState, useEffect } from 'react';
import { X, ChevronRight, Check, Moon, Sun, Contrast } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import A from './file/datastructures-and-algorithms.pdf'

// Types for our tile structure
interface PDFTile {
  id: string;
  title: string;
  pdfUrl: string;
  subTiles?: PDFTile[];
}

const PDFTileViewer: React.FC = () => {
  // Sample data structure with nested tiles
  const [tiles, setTiles] = useState<PDFTile[]>([
    {
      id: '0',
      title: 'Data Structures And Algorithms',
      pdfUrl: A,
    },
    {
      id: '1',
      title: 'Category 1',
      pdfUrl: '',
      subTiles: [
        { 
          id: '1.1', 
          title: 'Document 1', 
          pdfUrl: '/sample1.pdf' 
        },
        { 
          id: '1.2', 
          title: 'Document 2', 
          pdfUrl: '/sample2.pdf',
          subTiles: [
            { 
              id: '1.2.1', 
              title: 'Nested Document 1', 
              pdfUrl: '/nested1.pdf' 
            }
          ]
        }
      ]
    },
    {
      id: '2',
      title: 'Category 2',
      pdfUrl: '',
      subTiles: [
        { 
          id: '2.1', 
          title: 'Document 3', 
          pdfUrl: '/sample3.pdf' 
        }
      ]
    }
  ]);

  // State to manage PDF overlay and expanded tiles
  const [selectedPDF, setSelectedPDF] = useState<string | null>(null);
  const [expandedTiles, setExpandedTiles] = useState<string[]>([]);
  
  // State to manage completed tiles and PDF theme
  const [completedTiles, setCompletedTiles] = useState<string[]>(() => {
    // Initialize from local storage
    const saved = localStorage.getItem('completedTiles');
    return saved ? JSON.parse(saved) : [];
  });

  // PDF Theme State with Saturation
  const [pdfTheme, setPDFTheme] = useState<'light' | 'dark'>(() => {
    // Check local storage for theme preference
    const savedTheme = localStorage.getItem('pdfTheme');
    return savedTheme === 'dark' ? 'dark' : 'light';
  });

  // Saturation State
  const [saturation, setSaturation] = useState<number>(() => {
    // Initialize from local storage or default to 85
    const savedSaturation = localStorage.getItem('pdfSaturation');
    return savedSaturation ? parseInt(savedSaturation) : 85;
  });

  // Save completed tiles to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('completedTiles', JSON.stringify(completedTiles));
  }, [completedTiles]);

  // Save PDF theme to local storage
  useEffect(() => {
    localStorage.setItem('pdfTheme', pdfTheme);
  }, [pdfTheme]);

  // Save saturation to local storage
  useEffect(() => {
    localStorage.setItem('pdfSaturation', saturation.toString());
  }, [saturation]);

  // Toggle tile expansion
  const toggleTile = (tileId: string) => {
    setExpandedTiles(prev => 
      prev.includes(tileId) 
        ? prev.filter(id => id !== tileId)
        : [...prev, tileId]
    );
  };

  // Toggle tile completion
  const toggleTileCompletion = (
    e: React.MouseEvent, 
    tileId: string
  ) => {
    e.stopPropagation(); // Prevent tile from opening PDF
    setCompletedTiles(prev => 
      prev.includes(tileId)
        ? prev.filter(id => id !== tileId)
        : [...prev, tileId]
    );
  };

  // Toggle PDF Theme
  const togglePDFTheme = () => {
    setPDFTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Toggle Saturation
  const toggleSaturation = () => {
    // Cycle through predefined saturation levels
    const saturationLevels = [0, 50, 85, 100];
    const currentIndex = saturationLevels.indexOf(saturation);
    const nextIndex = (currentIndex + 1) % saturationLevels.length;
    setSaturation(saturationLevels[nextIndex]);
  };

  // Recursive component to render tiles
  const TileGroup: React.FC<{ 
    tiles: PDFTile[], 
    level?: number 
  }> = ({ tiles, level = 0 }) => {
    return (
      <div className={`space-y-2 ${level > 0 ? 'pl-4' : ''}`}>
        {tiles.map((tile) => (
          <div key={tile.id} className="group">
            {/* Entire tile clickable */}
            <div 
              className={`
                p-3 rounded-lg 
                flex justify-between items-center
                bg-neutral-800 text-neutral-200
                border border-neutral-700
                hover:bg-neutral-700 transition
                ${tile.subTiles ? 'cursor-pointer' : 'cursor-pointer'}
              `}
              onClick={() => {
                // Open PDF or toggle subtiles
                if (tile.pdfUrl) {
                  setSelectedPDF(tile.pdfUrl);
                } else if (tile.subTiles) {
                  toggleTile(tile.id);
                }
              }}
            >
              <div className="flex items-center">
                {/* Expansion arrow for tiles with subtiles */}
                {tile.subTiles && (
                  <motion.div
                    animate={{ 
                      rotate: expandedTiles.includes(tile.id) ? 90 : 0 
                    }}
                    className="mr-2"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </motion.div>
                )}
                
                {/* Tile title */}
                <span 
                  className={`
                    flex-grow
                    ${completedTiles.includes(tile.id) ? 'line-through text-neutral-500' : ''}
                  `}
                >
                  {tile.title}
                </span>

                {/* Completion Checkbox */}
                <div 
                  onClick={(e) => toggleTileCompletion(e, tile.id)}
                  className={`
                    ml-2 w-5 h-5 border rounded flex items-center justify-center
                    ${completedTiles.includes(tile.id) 
                      ? 'bg-green-500 border-green-500' 
                      : 'border-neutral-600 hover:border-neutral-400'}
                  `}
                >
                  {completedTiles.includes(tile.id) && (
                    <Check className="w-4 h-4 text-white" />
                  )}
                </div>
              </div>
            </div>

            {/* Animated subtile expansion */}
            <AnimatePresence>
              {tile.subTiles && expandedTiles.includes(tile.id) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <TileGroup tiles={tile.subTiles} level={level + 1} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    );
  };

  // PDF Overlay Component
  const PDFOverlay: React.FC = () => {
    if (!selectedPDF) return null;

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center"
        onClick={() => setSelectedPDF(null)}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-neutral-900 rounded-lg w-11/12 max-w-4xl h-5/6 relative overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Theme Toggle Button - Top Left */}
          <button 
            onClick={togglePDFTheme}
            className="absolute top-4 left-4 z-60 p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition"
          >
            {pdfTheme === 'light' ? (
              <Moon className="w-6 h-6 text-neutral-300" />
            ) : (
              <Sun className="w-6 h-6 text-neutral-300" />
            )}
          </button>

          {/* Saturation Toggle Button - Top Right */}
          <button 
            onClick={toggleSaturation}
            className="absolute top-4 right-4 z-60 p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition"
          >
            <Contrast className="w-6 h-6 text-neutral-300" />
          </button>

          {/* Close Button - Top Right Corner (replacing browser default) */}
          <button 
            onClick={() => setSelectedPDF(null)}
            className="absolute top-4 right-16 z-60 p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition"
          >
            <X className="w-6 h-6 text-neutral-300" />
          </button>

          {/* PDF Viewer */}
          <div className={`
            h-full w-full overflow-auto bg-neutral-800
            ${pdfTheme === 'dark' ? 'pdf-dark-mode' : ''}
          `}>
            <iframe 
              src={selectedPDF}
              className="w-full h-full"
              title="PDF Viewer"
            />
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // Create a method to dynamically add global styles
  const renderGlobalStyles = () => {
    return (
      <style>{`
        .pdf-dark-mode {
          filter: invert(${pdfTheme === 'dark' ? '0.85' : '0'}) 
                  hue-rotate(180deg) 
                  saturate(${saturation}%);
        }
        .pdf-dark-mode iframe {
          background: white;
        }
      `}</style>
    );
  };

  return (
    <div>
      {/* Render global styles */}
      {renderGlobalStyles()}

      <div className="container mx-auto p-4 bg-black min-h-screen text-white">
        <h1 className="text-2xl font-bold mb-6 text-neutral-200">PDF Tile Viewer</h1>
        <TileGroup tiles={tiles} />
        <PDFOverlay />
      </div>
    </div>
  );
};

export default PDFTileViewer;