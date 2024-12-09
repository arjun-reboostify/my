import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronRight, Pen, Eraser, Layers, HandPlatter } from 'lucide-react';
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
  
  // Annotation states
  const [isAnnotationMode, setIsAnnotationMode] = useState(false);
  const [drawingTool, setDrawingTool] = useState<'pen' | 'eraser'>('pen');
  const [penColor, setPenColor] = useState('#ffffff');
  const [penSize, setPenSize] = useState(3);

  // Refs for canvas drawing
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPositionRef = useRef<{x: number, y: number} | null>(null);

  // Toggle tile expansion
  const toggleTile = (tileId: string) => {
    setExpandedTiles(prev => 
      prev.includes(tileId) 
        ? prev.filter(id => id !== tileId)
        : [...prev, tileId]
    );
  };

  // Canvas drawing setup
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const handleMouseDown = (e: MouseEvent) => {
      if (!isAnnotationMode) return;
      isDrawingRef.current = true;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      lastPositionRef.current = { x, y };
      
      if (drawingTool === 'eraser') {
        context.globalCompositeOperation = 'destination-out';
      } else {
        context.globalCompositeOperation = 'source-over';
      }
      
      context.strokeStyle = penColor;
      context.lineWidth = penSize;
      context.lineCap = 'round';
      context.beginPath();
      context.moveTo(x, y);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDrawingRef.current || !isAnnotationMode) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      context?.lineTo(x, y);
      context?.stroke();
      
      lastPositionRef.current = { x, y };
    };

    const handleMouseUp = () => {
      isDrawingRef.current = false;
      lastPositionRef.current = null;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseout', handleMouseUp);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseout', handleMouseUp);
    };
  }, [isAnnotationMode, drawingTool, penColor, penSize]);

  // Reset canvas
  const resetCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
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
            {/* Entire tile clickable for PDF */}
            <div 
              onClick={() => tile.pdfUrl && setSelectedPDF(tile.pdfUrl)}
              className={`
                p-3 rounded-lg 
                flex justify-between items-center
                bg-neutral-800 text-neutral-200
                border border-neutral-700
                hover:bg-neutral-700 transition
                ${tile.pdfUrl ? 'cursor-pointer' : ''}
                ${tile.subTiles ? 'flex-grow' : ''}
              `}
            >
              <div className="flex items-center w-full">
                {/* Expansion arrow for tiles with subtiles */}
                {tile.subTiles && (
                  <motion.div
                    animate={{ 
                      rotate: expandedTiles.includes(tile.id) ? 90 : 0 
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      tile.subTiles && toggleTile(tile.id);
                    }}
                    className="mr-2 cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </motion.div>
                )}
                
                {/* Tile title */}
                <span 
                  className={`
                    flex-grow
                    ${tile.pdfUrl ? 'cursor-pointer hover:text-blue-400' : ''}
                  `}
                >
                  {tile.title}
                </span>
              </div>

              {tile.pdfUrl && (
                <span className="text-xs text-neutral-500 hover:text-blue-500">
                  View PDF
                </span>
              )}
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
          className="bg-neutral-900 rounded-lg w-11/12 max-w-4xl h-5/6 relative overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close and Annotation Toolbar */}
          <div className="absolute top-4 right-4 z-60 flex space-x-2">
            {/* Annotation Mode Toggle */}
            <button 
              onClick={() => setIsAnnotationMode(!isAnnotationMode)}
              className={`
                p-2 rounded-full transition 
                ${isAnnotationMode 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'}
              `}
            >
              <Layers className="w-6 h-6" />
            </button>

            {/* Close Button */}
            <button 
              onClick={() => setSelectedPDF(null)}
              className="p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition"
            >
              <X className="w-6 h-6 text-neutral-300" />
            </button>
          </div>

          {/* Annotation Tools - Only show when annotation mode is on */}
          {isAnnotationMode && (
            <div className="absolute top-4 left-4 z-60 flex space-x-2 bg-neutral-800 rounded-full p-1">
              {/* Pen Tool */}
              <button 
                onClick={() => setDrawingTool('pen')}
                className={`
                  p-2 rounded-full transition 
                  ${drawingTool === 'pen' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-neutral-300 hover:bg-neutral-700'}
                `}
              >
                <Pen className="w-5 h-5" />
              </button>

              {/* Eraser Tool */}
              <button 
                onClick={() => setDrawingTool('eraser')}
                className={`
                  p-2 rounded-full transition 
                  ${drawingTool === 'eraser' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-neutral-300 hover:bg-neutral-700'}
                `}
              >
                <Eraser className="w-5 h-5" />
              </button>

              {/* Color Picker */}
              <div className="relative">
                <input 
                  type="color" 
                  value={penColor}
                  onChange={(e) => setPenColor(e.target.value)}
                  className="absolute opacity-0 w-full h-full cursor-pointer"
                />
                <button 
                  className="p-2 rounded-full transition text-neutral-300 hover:bg-neutral-700"
                >
                  <HandPlatter className="w-5 h-5" style={{ color: penColor }} />
                </button>
              </div>

              {/* Pen Size Selector */}
              <select 
                value={penSize}
                onChange={(e) => setPenSize(Number(e.target.value))}
                className="bg-neutral-700 text-white rounded px-2 py-1"
              >
                {[1, 3, 5, 7, 10].map(size => (
                  <option key={size} value={size}>
                    {size}px
                  </option>
                ))}
              </select>

              {/* Reset Canvas Button */}
              <button 
                onClick={resetCanvas}
                className="p-2 rounded-full transition text-neutral-300 hover:bg-neutral-700"
              >
                Reset
              </button>
            </div>
          )}

          {/* PDF and Annotation Container */}
          <div className="relative w-full h-full">
            {/* PDF Viewer */}
            <iframe 
              src={selectedPDF}
              className="w-full h-full"
              title="PDF Viewer"
            />

            {/* Annotation Canvas - Overlay on top of PDF */}
            {isAnnotationMode && (
              <canvas 
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full pointer-events-auto z-40"
                width={window.innerWidth * 0.9}
                height={window.innerHeight * 0.8}
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="container mx-auto p-4 bg-black min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6 text-neutral-200">PDF Tile Viewer</h1>
      <TileGroup tiles={tiles} />
      <PDFOverlay />
    </div>
  );
};

export default PDFTileViewer;