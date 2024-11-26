import React, { useState, useRef, useEffect } from 'react';
import { Save, Edit3, Layout, ChevronLeft, ChevronRight, Plus, Eraser, Trash2, Maximize2, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Side from '../components/it/Sidebar'

interface Slide {
  id: string;
  content: string;
  canvasData?: string;
}

declare const Image: {
  new(): HTMLImageElement;
  prototype: HTMLImageElement;
};

const STORAGE_KEY = 'slidesDeckData';

interface ToolbarButtonProps {
  onClick: () => void;
  className: string;
  children: React.ReactNode;
  disabled?: boolean;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ onClick, className, children, disabled }) => (
  <motion.button
    whileHover={{ scale: disabled ? 1 : 1.05 }}
    whileTap={{ scale: disabled ? 1 : 0.95 }}
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${className}`}
  >
    {children}
  </motion.button>
);

const SlidesDeck: React.FC = () => {
  const [slides, setSlides] = useState<Slide[]>(() => {
    const savedSlides = localStorage.getItem(STORAGE_KEY);
    return savedSlides ? JSON.parse(savedSlides) : [{ id: '1', content: '<h1>Click to edit this slide...</h1>' }];
  });
  const [currentSlide, setCurrentSlide] = useState<number>(() => {
    const savedIndex = localStorage.getItem('currentSlideIndex');
    return savedIndex ? parseInt(savedIndex) : 0;
  });
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showCanvas, setShowCanvas] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<string>('#FF0000');
  const [lineWidth, setLineWidth] = useState<number>(2);
  const [isEraser, setIsEraser] = useState<boolean>(false);

  const [canvasPosition, setCanvasPosition] = useState<'corner' | 'full'>('corner');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slides));
    localStorage.setItem('currentSlideIndex', currentSlide.toString());
  }, [slides, currentSlide]);

    


  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.strokeStyle = isEraser ? '#000000' : selectedColor;
        ctx.lineWidth = lineWidth;
        contextRef.current = ctx;
  
        const canvasData = slides[currentSlide].canvasData;
        if (canvasData) {
          const img = new Image();
          img.onload = () => {
            if (ctx && canvas) {
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            }
          };
          img.src = canvasData;
        }
      }
    }
  }, [currentSlide, showCanvas, selectedColor, lineWidth, slides, isEraser]);

 

  

  const handleFormatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    handleContentChange();
  };

  const clearCanvas = () => {
    if (canvasRef.current && contextRef.current) {
      contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      
      const newSlides = [...slides];
      newSlides[currentSlide] = {
        ...newSlides[currentSlide],
        canvasData: canvasRef.current.toDataURL()
      };
      setSlides(newSlides);
    }
  };

  const centerContent = () => {
    if (editorRef.current) {
      const contentElements = editorRef.current.children;
      Array.from(contentElements).forEach(element => {
        if (element instanceof HTMLElement) {
          element.style.textAlign = 'center';
        }
      });
      handleContentChange();
    }
  };

  const getCanvasCoordinates = (event: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in event) 
      ? event.touches[0].clientX - rect.left 
      : (event as React.MouseEvent).clientX - rect.left;
    const y = ('touches' in event)
      ? event.touches[0].clientY - rect.top
      : (event as React.MouseEvent).clientY - rect.top;
    
    return { x, y };
  };

  const handleDrawStart = (event: React.TouchEvent | React.MouseEvent) => {
    event.preventDefault();
    setIsDrawing(true);
    
    if (!contextRef.current) return;
    
    const { x, y } = getCanvasCoordinates(event);
    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    
    if (isEraser) {
      contextRef.current.globalCompositeOperation = 'destination-out';
    } else {
      contextRef.current.globalCompositeOperation = 'source-over';
      contextRef.current.strokeStyle = selectedColor;
    }
  };

  const handleDrawMove = (event: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawing) return;
    event.preventDefault();
    
    if (!contextRef.current) return;
    
    const { x, y } = getCanvasCoordinates(event);
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const handleDrawEnd = () => {
    setIsDrawing(false);
    if (contextRef.current && canvasRef.current) {
      contextRef.current.closePath();
      
      const newSlides = [...slides];
      newSlides[currentSlide] = {
        ...newSlides[currentSlide],
        canvasData: canvasRef.current.toDataURL()
      };
      setSlides(newSlides);
    }
  };

  const handleAddSlide = () => {
    const newSlides = [...slides, { 
      id: Date.now().toString(),
      content: '<h1>Click to edit this slide...</h1>'
    }];
    setSlides(newSlides);
    setCurrentSlide(newSlides.length - 1);
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      const newSlides = [...slides];
      newSlides[currentSlide] = {
        ...newSlides[currentSlide],
        content: editorRef.current.innerHTML
      };
      setSlides(newSlides);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    centerContent();
  };

  const handleContentPaste = async (e: React.ClipboardEvent) => {
    e.preventDefault();
    const items = e.clipboardData?.items;
    
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              const result = event.target?.result;
              if (typeof result === 'string') {
                const imgElement = `
                  <div class="relative inline-block text-center" style="resize: both; overflow: hidden; min-width: 100px; min-height: 100px;">
                    <img 
                      src="${result}" 
                      class="max-w-full h-auto my-2"
                      style="width: 100%; height: 100%; object-fit: contain;"
                      alt="Pasted image" 
                    />
                  </div>`;
                document.execCommand('insertHTML', false, imgElement);
                handleContentChange();
              }
            };
            reader.readAsDataURL(file);
          }
        }
      }
    }
    
    const text = e.clipboardData.getData('text/plain');
    if (text) {
      document.execCommand('insertText', false, text);
    }
  };

  const handleResetStorage = () => {
    if (window.confirm('Are you sure? This will delete all slides and cannot be undone.')) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('currentSlideIndex');
      setSlides([{ id: '1', content: '<h1>Click to edit this slide...</h1>' }]);
      setCurrentSlide(0);
    }
  };

  return (<><Side />
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-screen flex flex-col bg-gray-900 text-white"
      ref={containerRef}
    >
      <motion.div 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="flex justify-between items-center p-4 bg-gray-800 border-b border-gray-700"
      >
        <div className="flex gap-3">
          <ToolbarButton
            onClick={handleResetStorage}
            className="bg-red-600 hover:bg-red-700"
          >
            Reset All
          </ToolbarButton>
          
          <ToolbarButton
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            {isEditing ? 'Save' : 'Edit'}
          </ToolbarButton>
          
          {isEditing && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-2 bg-gray-700 rounded-lg p-2"
            >
             
              <button
                onClick={() => handleFormatText('bold')}
                className="px-3 py-1 bg-gray-600 rounded hover:bg-gray-500 font-bold"
              >
                B
              </button>
              <button
                onClick={() => handleFormatText('italic')}
                className="px-3 py-1 bg-gray-600 rounded hover:bg-gray-500 italic"
              >
                I
              </button>
            </motion.div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <ToolbarButton
            onClick={() => setShowCanvas(!showCanvas)}
            className={showCanvas ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'}
          >
            <Layout className="w-4 h-4" />
            {showCanvas ? 'Hide Canvas' : 'Show Canvas'}
          </ToolbarButton>
          {showCanvas && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex flex-wrap items-center gap-2 bg-gray-700 rounded-lg p-2 max-w-full"
  >
    <button
      onClick={() => setIsEraser(!isEraser)}
      className={`p-2 rounded ${isEraser ? 'bg-blue-600' : 'bg-gray-600'} hover:bg-gray-500`}
      title="Toggle Eraser"
    >
      <Eraser className="w-4 h-4" />
    </button>
    <button
      onClick={clearCanvas}
      className="p-2 rounded bg-gray-600 hover:bg-gray-500"
      title="Clear Canvas"
    >
      <Trash2 className="w-4 h-4" />
    </button>
    <input
      type="color"
      value={selectedColor}
      onChange={(e) => setSelectedColor(e.target.value)}
      className="w-8 h-8 rounded cursor-pointer"
      disabled={isEraser}
    />
    <input
      type="range"
      min="1"
      max="10"
      value={lineWidth}
      onChange={(e) => setLineWidth(Number(e.target.value))}
      className="w-24"
    />
    <button
      onClick={() => setCanvasPosition(canvasPosition === 'corner' ? 'full' : 'corner')}
      className="p-2 rounded bg-gray-600 hover:bg-gray-500"
      title="Toggle Canvas Position"
    >
      <Layout className="w-4 h-4" />
    </button>
  </motion.div>
)}


         
        </div>
      </motion.div>

      <AnimatePresence>
        <motion.div 
          key={currentSlide}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="flex-1 relative overflow-hidden bg-gray-800 p-4"
        >
          <div 
            ref={editorRef}
            contentEditable={isEditing}
            
            onPaste={handleContentPaste}
            onInput={handleContentChange}
            className="w-full h-full p-8 bg-gray-900 rounded-lg overflow-y-auto transition-all duration-200"
            dangerouslySetInnerHTML={{ __html: slides[currentSlide].content }}
          />

          {showCanvas && (
            <motion.canvas
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              ref={canvasRef}
              className={`absolute ${
                canvasPosition === 'corner' 
                  ? 'bottom-4 right-4 w-64 h-48 border-2 border-gray-600' 
                  : 'inset-0 w-full h-full'
              } cursor-crosshair transition-all duration-300 ease-in-out`}
              onMouseDown={handleDrawStart}
              onMouseMove={handleDrawMove}
              onMouseUp={handleDrawEnd}
              onMouseLeave={handleDrawEnd}
              onTouchStart={handleDrawStart}
              onTouchMove={handleDrawMove}
              onTouchEnd={handleDrawEnd}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <motion.div 
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="flex justify-between items-center p-4 bg-gray-800 border-t border-gray-700"
      >
        <ToolbarButton
          onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
          disabled={currentSlide === 0}
          className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </ToolbarButton>

        <motion.div 
          className="flex items-center gap-4"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-gray-300">
            Slide {currentSlide + 1} of {slides.length}
          </span>
          <ToolbarButton
            onClick={handleAddSlide}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="w-4 h-4" />
            Add Slide
          </ToolbarButton>
        </motion.div>

        <ToolbarButton
          onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
          disabled={currentSlide === slides.length - 1}
          className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </ToolbarButton>
      </motion.div>
    </motion.div>
    </>
  );
};

export default SlidesDeck;