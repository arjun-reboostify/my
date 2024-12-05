import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import Side from './Sidebar';
import { noterFirestore, firebaseTimestamp } from '../../firebase/index';
import getCurrentUser from '../../firebase/utils/getCurrentUser';

interface CanvasData {
  id: string;
  imageData: string;
  canvasOptions: {
    color: string;
    lineWidth: number;
  };
  createdAt: any;
  updatedAt: any;
}

const INITIAL_CANVAS_OPTIONS = {
  color: '#FFFFFF',
  lineWidth: 2,
};

const BATCH_SIZE = 10;

const DrawingCanvas: React.FC = () => {
  const [canvasItems, setCanvasItems] = useState<CanvasData[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);
  const [isDrawingExpanded, setIsDrawingExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [canvasOptions, setCanvasOptions] = useState(INITIAL_CANVAS_OPTIONS);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tempCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<string | null>(null);

  // Canvas state management functions
  const saveCanvasState = useCallback(() => {
    if (!canvasRef.current || !tempCanvasRef.current) return;
    const tempCanvas = tempCanvasRef.current;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    tempCanvas.width = canvasRef.current.width;
    tempCanvas.height = canvasRef.current.height;
    tempCtx.drawImage(canvasRef.current, 0, 0);
  }, []);

  const restoreCanvasState = useCallback(() => {
    if (!canvasRef.current || !tempCanvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(tempCanvasRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
  }, []);

  const updateCanvasSize = useCallback(() => {
    if (!canvasRef.current || !canvasContainerRef.current) return;
    
    saveCanvasState();
    
    const container = canvasContainerRef.current;
    const canvas = canvasRef.current;
    
    if (isFullscreen) {
      const aspectRatio = window.innerWidth / window.innerHeight;
      if (aspectRatio > 1) {
        canvas.width = window.innerHeight * 5.0;
        canvas.height = window.innerHeight * 2.5;
      } else {
        canvas.width = window.innerWidth * 1;
        canvas.height = window.innerWidth * 0.5;
      }
    } else {
      canvas.width = container.clientWidth;
      canvas.height = container.clientWidth;
    }
    
    restoreCanvasState();
  }, [isFullscreen, saveCanvasState, restoreCanvasState]);

  // Canvas resize handling
  useEffect(() => {
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [updateCanvasSize]);

  // Fullscreen handling
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await canvasContainerRef.current?.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Firebase operations
  const loadCanvasItems = useCallback(async (isInitial = false) => {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        setError('No user found. Please log in first.');
        setIsLoading(false);
        return;
      }

      userRef.current = currentUser.uid;

      let query = noterFirestore
        .collection('users')
        .doc(currentUser.uid)
        .collection('canvasItems')
        .orderBy('createdAt', 'desc')
        .limit(BATCH_SIZE);

      if (!isInitial && lastDoc) {
        query = query.startAfter(lastDoc);
      }

      const snapshot = await query.get();
      
      if (snapshot.empty) {
        setHasMore(false);
        setIsLoading(false);
        return;
      }

      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as CanvasData[];

      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setCanvasItems(prev => isInitial ? items : [...prev, ...items]);
      setIsLoading(false);
    } catch (err) {
      setError('Error loading canvas items');
      setIsLoading(false);
    }
  }, [lastDoc]);

  useEffect(() => {
    loadCanvasItems(true);
  }, [loadCanvasItems]);

  const saveCanvasToFirebase = async (imageData: string) => {
    if (!userRef.current) {
      setError('No user found. Please log in first.');
      return;
    }

    try {
      const timestamp = firebaseTimestamp();
      const canvasData: Omit<CanvasData, 'id'> = {
        imageData,
        canvasOptions,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      if (editingId) {
        await noterFirestore
          .collection('users')
          .doc(userRef.current)
          .collection('canvasItems')
          .doc(editingId)
          .update({
            imageData,
            canvasOptions,
            updatedAt: timestamp,
          });
      } else {
        await noterFirestore
          .collection('users')
          .doc(userRef.current)
          .collection('canvasItems')
          .add(canvasData);
      }

      await loadCanvasItems(true);
      clearCanvas();
    } catch (err) {
      setError('Error saving canvas');
    }
  };

  const deleteCanvas = async (id: string) => {
    if (!userRef.current) return;

    try {
      await noterFirestore
        .collection('users')
        .doc(userRef.current)
        .collection('canvasItems')
        .doc(id)
        .delete();

      setCanvasItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError('Error deleting canvas');
    }
  };

  // Canvas operations
  const editCanvas = useCallback((canvas: CanvasData) => {
    setEditingId(canvas.id);
    setCanvasOptions(canvas.canvasOptions);
    
    const img = new Image();
    img.src = canvas.imageData;
    img.onload = () => {
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx && canvasRef.current) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
        saveCanvasState();
      }
    };
  }, [saveCanvasState]);

  const clearCanvas = useCallback(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      saveCanvasState();
    }
    setEditingId(null);
    setCanvasOptions(INITIAL_CANVAS_OPTIONS);
  }, [saveCanvasState]);

  const getScaledPosition = useCallback((clientX: number, clientY: number) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  }, []);

  const handleDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement, MouseEvent> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPos || !canvasRef.current) return;
    e.preventDefault();

    const { clientX, clientY } = e.type === 'touchmove'
      ? (e as React.TouchEvent<HTMLCanvasElement>).touches[0]
      : (e as React.MouseEvent<HTMLCanvasElement, MouseEvent>);

    const { x, y } = getScaledPosition(clientX, clientY);
    const { x: lastX, y: lastY } = lastPos;

    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = canvasOptions.color;
      ctx.lineWidth = canvasOptions.lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
      setLastPos({ x, y });
    }
  }, [isDrawing, lastPos, canvasOptions, getScaledPosition]);

  const handleDrawStart = useCallback((clientX: number, clientY: number) => {
    setIsDrawing(true);
    const pos = getScaledPosition(clientX, clientY);
    setLastPos(pos);
  }, [getScaledPosition]);

  const handleDrawEnd = useCallback(() => {
    setIsDrawing(false);
    setLastPos(null);
    saveCanvasState();
  }, [saveCanvasState]);

  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-yellow-900">
      <canvas ref={tempCanvasRef} className="hidden" />
      <Side />
      <div className="flex-1 p-4">
        <div 
          ref={canvasContainerRef}
          className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black flex items-center justify-center' : 'w-full aspect-square'}`}
        >
          <canvas
            ref={canvasRef}
            className="border border-gray-300 rounded-lg shadow-md bg-black touch-none"
            style={{ maxWidth: '100%', maxHeight: '100%' }}
            onMouseDown={(e) => handleDrawStart(e.clientX, e.clientY)}
            onMouseUp={handleDrawEnd}
            onMouseOut={handleDrawEnd}
            onMouseMove={handleDrawing}
            onTouchStart={(e) => {
              e.preventDefault();
              const touch = e.touches[0];
              handleDrawStart(touch.clientX, touch.clientY);
            }}
            onTouchMove={handleDrawing}
            onTouchEnd={(e) => {
              e.preventDefault();
              handleDrawEnd();
            }}
          />
          
          <div className={`absolute ${isFullscreen ? 'bottom-8' : 'bottom-4'} left-4 flex flex-wrap items-center gap-2 bg-gray-800 p-2 rounded-md shadow-md`}>
      

            <button
              onClick={() => setIsDrawingExpanded(!isDrawingExpanded)}
              className="bg-yellow-100 text-black rounded-md px-4 py-2"
            >
              {isDrawingExpanded ? 'Hide' : 'Menu'}
            </button>

            {isDrawingExpanded && (
              <>
                <input
                  type="color"
                  value={canvasOptions.color}
                  onChange={(e) => setCanvasOptions(prev => ({ ...prev, color: e.target.value }))}
                  className="w-8 h-8 border-none cursor-pointer"
                />
                <select
                  value={canvasOptions.lineWidth}
                  onChange={(e) => setCanvasOptions(prev => ({ ...prev, lineWidth: Number(e.target.value) }))}
                  className="border border-gray-300 rounded-md px-2 py-1 bg-gray-700 text-white"
                >
                  {[2, 4, 6, 8].map(size => (
                    <option key={size} value={size}>{size}px</option>
                  ))}
                </select>
                <button
                  onClick={clearCanvas}
                  className="bg-red-500 hover:bg-red-600 text-white rounded-md px-4 py-2"
                >
                  Clear
                </button>
                <button
                  onClick={() => {
                    const imageData = canvasRef.current?.toDataURL();
                    if (imageData) saveCanvasToFirebase(imageData);
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white rounded-md px-4 py-2"
                >
                  {editingId ? 'Update' : 'Save'}
                </button>
              </>
            )}
          </div>
        </div>
        {!isFullscreen && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {isLoading ? (
              <div className="col-span-full text-center text-white">Loading...</div>
            ) : (
              <>
                {canvasItems.map((item) => (
                  <div key={item.id} className="bg-gray-800 rounded-lg shadow-md p-4">
                    <img
                      src={item.imageData}
                      alt={`Canvas ${item.id}`}
                      className="w-full h-48 object-contain mb-4"
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">
                        {item.createdAt.toLocaleDateString()}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => editCanvas(item)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteCanvas(item.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {hasMore && (
                  <button
                    onClick={() => loadCanvasItems(false)}
                    className="col-span-full mt-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md px-4 py-2"
                  >
                    Load More
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DrawingCanvas;