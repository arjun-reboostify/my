import React, { useState, useEffect } from 'react';
import { X, ChevronRight, Check, Moon, Sun, ChevronsUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import A from './file/datastructures-and-algorithms.pdf'
import Cpp from './file/cpp.pdf'
import Java from './file/java.pdf'
import Js from './file/javascript.pdf'
import Go from './file/golang.pdf'
import Python from './file/python.pdf'
import Rust from './file/rust.pdf'

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
      subTiles: [
        { 
          id: '1.1', 
          title: 'C++', 
          pdfUrl: Cpp 
        },
        { 
          id: '1.1', 
          title: 'Java', 
          pdfUrl: Java 
        },
        { 
          id: '1.1', 
          title: 'Rust', 
          pdfUrl: Rust
        },
        { 
          id: '1.1', 
          title: 'C++', 
          pdfUrl: Cpp 
        },
        { 
          id: '1.1', 
          title: 'C++', 
          pdfUrl: Cpp 
        },
      ]
    },
    {
      id: '1',
      title: 'Category 1',
      pdfUrl: 'A',
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
      pdfUrl: A,
      subTiles: [
        { 
          id: '2.1', 
          title: 'Document 3', 
          pdfUrl: '/sample3.pdf' 
        }
      ]
    }
  ]);

  // Load state from local storage on initial render
  const [selectedPDF, setSelectedPDF] = useState<string | null>(() => {
    const savedPDF = localStorage.getItem('selectedPDF');
    return savedPDF ? JSON.parse(savedPDF) : null;
  });

  const [expandedTiles, setExpandedTiles] = useState<string[]>(() => {
    const savedExpandedTiles = localStorage.getItem('expandedTiles');
    return savedExpandedTiles ? JSON.parse(savedExpandedTiles) : [];
  });
  
  const [completedTiles, setCompletedTiles] = useState<string[]>(() => {
    const saved = localStorage.getItem('completedTiles');
    return saved ? JSON.parse(saved) : [];
  });

  const [pdfTheme, setPDFTheme] = useState<'light' | 'dark'>('light');

  // Save states to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('completedTiles', JSON.stringify(completedTiles));
  }, [completedTiles]);

  useEffect(() => {
    localStorage.setItem('selectedPDF', JSON.stringify(selectedPDF));
  }, [selectedPDF]);

  useEffect(() => {
    localStorage.setItem('expandedTiles', JSON.stringify(expandedTiles));
  }, [expandedTiles]);

  // Enhanced tile click handler
  const handleTileClick = (tile: PDFTile) => {
    // If tile has a PDF, select/deselect PDF
    if (tile.pdfUrl) {
      // If the same PDF is already selected, deselect it and collapse subtiles
      if (selectedPDF === tile.pdfUrl) {
        setSelectedPDF(null);
        if (tile.subTiles) {
          setExpandedTiles(prev => prev.filter(id => id !== tile.id));
        }
      } else {
        // Select the PDF and expand subtiles if they exist
        setSelectedPDF(tile.pdfUrl);
        if (tile.subTiles) {
          setExpandedTiles(prev => 
            prev.includes(tile.id) 
              ? prev 
              : [...prev, tile.id]
          );
        }
      }
    } else if (tile.subTiles) {
      // If no PDF but has subtiles, toggle subtile expansion
      toggleTile(tile.id);
    }
  };

  // Toggle tile expansion
  const toggleTile = (tileId: string) => {
    setExpandedTiles(prev => 
      prev.includes(tileId) 
        ? prev.filter(id => id !== tileId)
        : [...prev, tileId]
    );
  };

  // New method to collapse all nested subtiles
  const collapseAllTiles = () => {
    setExpandedTiles([]);
  };

  // Toggle tile completion
  const toggleTileCompletion = (
    e: React.MouseEvent, 
    tileId: string
  ) => {
    e.stopPropagation(); 
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

  // Recursive component to render tiles
  const TileGroup: React.FC<{ 
    tiles: PDFTile[], 
    level?: number 
  }> = ({ tiles, level = 0 }) => {
    return (
      <div className={`space-y-2 ${level > 0 ? 'pl-4' : ''}`}>
        {tiles.map((tile) => (
          <div key={tile.id} className="group">
            <div 
              className={`
                p-3 rounded-lg 
                flex justify-between items-center
                bg-neutral-800 text-neutral-200
                border border-neutral-700
                hover:bg-neutral-700 transition
                cursor-pointer
              `}
              onClick={() => handleTileClick(tile)}
            >
              <div className="flex items-center">
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
                
                <span 
                  className={`
                    flex-grow
                    ${completedTiles.includes(tile.id) ? 'line-through text-neutral-500' : ''}
                  `}
                >
                  {tile.title}
                </span>

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

          <button 
            onClick={() => setSelectedPDF(null)}
            className="absolute top-4 right-16 z-60 p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition"
          >
            <X className="w-6 h-6 text-neutral-300" />
          </button>

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
        }
        .pdf-dark-mode iframe {
          background: white;
        }
      `}</style>
    );
  };

  return (
    <div>
      {renderGlobalStyles()}
      <div className="container mx-auto p-4 bg-black min-h-screen text-white">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-neutral-200">PDF Tile Viewer</h1>
          <button 
            onClick={collapseAllTiles}
            className="
              flex items-center 
              px-4 py-2 
              bg-neutral-800 
              text-neutral-300 
              rounded-lg 
              hover:bg-neutral-700 
              transition
            "
          >
            <ChevronsUp className="w-5 h-5 mr-2" />
            Collapse All
          </button>
        </div>
        <TileGroup tiles={tiles} />
        <PDFOverlay />
      </div>
    </div>
  );
};

export default PDFTileViewer;