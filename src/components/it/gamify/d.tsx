import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  PlusIcon, 
  TrashIcon, 
  LinkIcon, 
  UnlinkIcon, 
  ZoomInIcon,
  ZoomOutIcon
} from 'lucide-react';

// Color palette for nodes
const COLOR_PALETTE: string[] = [
  '#1a1a1a', '#2c2c2c', '#404040', '#555555', 
  '#6a6a6a', '#7f7f7f', '#949494', '#a9a9a9'
];

interface FlowchartNode {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  children: string[];
  width: number;
  height: number;
  parentId?: string;
  linkedNodes: string[];
  metadata?: {
    createdAt: string;
    type: string;
    location?: {
      row: number;
      column: number;
    };
  };
}

// Constants for node positioning
const HORIZONTAL_SPACING = 300;
const VERTICAL_SPACING = 200;
const NODE_WIDTH = 250;
const NODE_HEIGHT = 150;
const MIN_SCALE = 0.5;
const MAX_SCALE = 2;


// Enhanced Flowchart Builder Component
const FlowchartBuilder: React.FC = () => {
  // State management with type safety
  const [nodes, setNodes] = useState<FlowchartNode[]>(() => {
    const savedNodes = localStorage.getItem('flowchartNodes');
    return savedNodes 
      ? JSON.parse(savedNodes) 
      : [{ 
          id: `node-${Date.now()}`, 
          x: 100, 
          y: 100, 
          text: 'Root Node', 
          color: '#1a1a1a',
          children: [],
          width: NODE_WIDTH,
          height: NODE_HEIGHT,
          linkedNodes: [],
          parentId: undefined,
          metadata: {
            createdAt: new Date().toISOString(),
            type: 'root',
            location: { row: 0, column: 0 }
          }
        }];
  });


  // Enhanced state for better touch and drag support
  const [dragState, setDragState] = useState<{
    type: 'canvas' | 'node' | 'none';
    nodeId?: string;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
  }>({
    type: 'none',
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0
  });

  const [scale, setScale] = useState<number>(1);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [newConnectionLine, setNewConnectionLine] = useState<{
    parentId: string;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  } | null>(null);

  const [linkingMode, setLinkingMode] = useState<{
    active: boolean;
    sourceNodeId: string | null;
  }>({ active: false, sourceNodeId: null });

  const canvasRef = useRef<HTMLDivElement>(null);

  // Enhanced touch and mouse handling
  const handleTouchOrMouseStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const clickedNode = nodes.find(node => {
      const nodeElement = document.getElementById(node.id);
      return nodeElement && nodeElement.contains(e.target as Node);
    });

    if (clickedNode) {
      setDragState({
        type: 'node',
        nodeId: clickedNode.id,
        startX: clientX,
        startY: clientY,
        currentX: clientX,
        currentY: clientY
      });
      setSelectedNodeId(clickedNode.id);
    } else {
      setDragState({
        type: 'canvas',
        startX: clientX,
        startY: clientY,
        currentX: clientX,
        currentY: clientY
      });
      setSelectedNodeId(null);
    }
  }, [nodes]);

  const handleTouchOrMouseMove = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    if (dragState.type === 'none') return;

    if (dragState.type === 'node') {
      const deltaX = (clientX - dragState.startX) / scale;
      const deltaY = (clientY - dragState.startY) / scale;

      setNodes(prev => 
        prev.map(node => 
          node.id === dragState.nodeId 
            ? { 
                ...node, 
                x: node.x + deltaX, 
                y: node.y + deltaY 
              }
            : node
        )
      );

      setDragState(prev => ({
        ...prev,
        startX: clientX,
        startY: clientY
      }));
    } else if (dragState.type === 'canvas') {
      const deltaX = (clientX - dragState.startX) / scale;
      const deltaY = (clientY - dragState.startY) / scale;

      setOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));

      setDragState(prev => ({
        ...prev,
        startX: clientX,
        startY: clientY
      }));
    }

    // Prevent default touch behavior
    if ('preventDefault' in e) {
      e.preventDefault();
    }
  }, [dragState, scale]);

  const handleTouchOrMouseEnd = useCallback(() => {
    setDragState({ 
      type: 'none', 
      startX: 0, 
      startY: 0, 
      currentX: 0, 
      currentY: 0 
    });
  }, []);

  // Zoom controls
  const handleZoom = useCallback((delta: number) => {
    setScale(prev => {
      const newScale = Math.min(Math.max(prev + delta, MIN_SCALE), MAX_SCALE);
      return newScale;
    });
  }, []);
 

 

  const findOptimalNodePosition = useCallback((parentNode: FlowchartNode): { x: number; y: number; location: { row: number; column: number } } => {
    const siblingNodes = nodes.filter(node => node.parentId === parentNode.id);
    
    // If no siblings, place to the right of the parent
    if (siblingNodes.length === 0) {
      return {
        x: parentNode.x + HORIZONTAL_SPACING,
        y: parentNode.y,
        location: {
          row: parentNode.metadata?.location?.row ?? 0,
          column: (parentNode.metadata?.location?.column ?? 0) + 1
        }
      };
    }

    // Find the maximum row and column of existing siblings
    const maxLocation = siblingNodes.reduce((max, node) => {
      const nodeRow = node.metadata?.location?.row ?? 0;
      const nodeColumn = node.metadata?.location?.column ?? 0;
      return {
        row: Math.max(max.row, nodeRow),
        column: Math.max(max.column, nodeColumn)
      };
    }, { row: 0, column: 0 });

    // Calculate new position based on the maximum location
    return {
      x: parentNode.x + HORIZONTAL_SPACING,
      y: parentNode.y + (maxLocation.row + 1) * VERTICAL_SPACING,
      location: {
        row: maxLocation.row + 1,
        column: maxLocation.column
      }
    };
  }, [nodes]);
  

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const clickedNode = nodes.find(node => {
      const nodeElement = document.getElementById(node.id);
      return nodeElement && nodeElement.contains(e.target as Node);
    });

    if (clickedNode) {
      setDragState({
        type: 'node',
        nodeId: clickedNode.id,
        startX: e.clientX,
        startY: e.clientY,
        currentX: e.clientX,
        currentY: e.clientY
      });
      setSelectedNodeId(clickedNode.id);
    } else {
      setDragState({
        type: 'canvas',
        startX: e.clientX,
        startY: e.clientY,
        currentX: e.clientX,
        currentY: e.clientY
      });
      setSelectedNodeId(null);
    }
  }, [nodes]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (dragState.type === 'none') return;

    if (dragState.type === 'node') {
      const deltaX = (e.clientX - dragState.startX) / scale;
      const deltaY = (e.clientY - dragState.startY) / scale;

      setNodes(prev => 
        prev.map(node => 
          node.id === dragState.nodeId 
            ? { 
                ...node, 
                x: node.x + deltaX, 
                y: node.y + deltaY 
              }
            : node
        )
      );

      setDragState(prev => ({
        ...prev,
        startX: e.clientX,
        startY: e.clientY
      }));
    } else if (dragState.type === 'canvas') {
      const deltaX = (e.clientX - dragState.startX) / scale;
      const deltaY = (e.clientY - dragState.startY) / scale;

      setOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));

      setDragState(prev => ({
        ...prev,
        startX: e.clientX,
        startY: e.clientY
      }));
    }
  }, [dragState, scale]);

  const handleMouseUp = useCallback(() => {
    setDragState({ 
      type: 'none', 
      startX: 0, 
      startY: 0, 
      currentX: 0, 
      currentY: 0 
    });
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
      clientX: touch.clientX,
      clientY: touch.clientY,
      bubbles: true,
      cancelable: true
    });
    
    if (canvasRef.current) {
      canvasRef.current.dispatchEvent(mouseEvent);
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: touch.clientX,
      clientY: touch.clientY,
      bubbles: true,
      cancelable: true
    });
    
    if (canvasRef.current) {
      canvasRef.current.dispatchEvent(mouseEvent);
    }
    
    // Prevent scrolling
    e.preventDefault();
  }, []);

  const handleTouchEnd = useCallback(() => {
    const mouseEvent = new MouseEvent('mouseup', {
      bubbles: true,
      cancelable: true
    });
    
    if (canvasRef.current) {
      canvasRef.current.dispatchEvent(mouseEvent);
    }
  }, []);

  const createConnectedNode = useCallback((parentNodeId: string) => {
    const parentNode = nodes.find(n => n.id === parentNodeId);
    if (!parentNode) return;

    const { x, y, location } = findOptimalNodePosition(parentNode);

    const newNode: FlowchartNode = {
      id: `node-${Date.now()}`,
      x,
      y,
      text: '',
      color: COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)],
      children: [],
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
      parentId: parentNodeId,
      linkedNodes: [],
      metadata: {
        createdAt: new Date().toISOString(),
        type: 'child',
        location: location
      }
    };
    // Create a temporary blue connection line
    const startX = parentNode.x + parentNode.width / 2;
    const startY = parentNode.y + parentNode.height / 2;
    const endX = x + newNode.width / 2;
    const endY = y + newNode.height / 2;

    setNewConnectionLine({
      parentId: parentNodeId,
      startX,
      startY,
      endX,
      endY
    });

    setNodes(prev => {
      const updatedNodes = prev.map(node => 
        node.id === parentNodeId 
          ? { ...node, children: [...node.children, newNode.id] }
          : node
      );
      return [...updatedNodes, newNode];
    });

    setSelectedNodeId(newNode.id);


   
  }, [nodes, findOptimalNodePosition]);

  const deleteNode = useCallback((nodeId: string) => {
    setNodes(prev => {
      // Recursively delete node and its children
      const nodesToDelete = new Set([nodeId]);
      const findChildrenToDelete = (id: string) => {
        prev.filter(n => n.parentId === id).forEach(child => {
          nodesToDelete.add(child.id);
          findChildrenToDelete(child.id);
        });
      };
      findChildrenToDelete(nodeId);

      // Remove deleted nodes and their references
      return prev
        .filter(n => !nodesToDelete.has(n.id))
        .map(node => ({
          ...node,
          children: node.children.filter(childId => !nodesToDelete.has(childId)),
          linkedNodes: node.linkedNodes.filter(linkedId => !nodesToDelete.has(linkedId))
        }));
    });
  }, []);

  const toggleNodeLinking = useCallback((nodeId: string) => {
    if (linkingMode.active) {
      if (linkingMode.sourceNodeId === nodeId) {
        // Cancel linking if tapping the same node
        setLinkingMode({ active: false, sourceNodeId: null });
      } else if (linkingMode.sourceNodeId) {
        // Create link between two nodes
        setNodes(prev => prev.map(node => {
          if (node.id === linkingMode.sourceNodeId) {
            return {
              ...node,
              linkedNodes: node.linkedNodes.includes(nodeId)
                ? node.linkedNodes.filter(id => id !== nodeId)
                : [...node.linkedNodes, nodeId]
            };
          }
          return node;
        }));
        
        // Reset linking mode
        setLinkingMode({ active: false, sourceNodeId: null });
      }
    } else {
      // Start linking mode
      setLinkingMode({ active: true, sourceNodeId: nodeId });
    }
  }, [linkingMode]);

  useEffect(() => {
    localStorage.setItem('flowchartNodes', JSON.stringify(nodes));
  }, [nodes]);

  const renderConnections = useMemo(() => {
    const standardConnections = nodes.flatMap(node => [
      // Hierarchical children connections
      ...node.children.map(childId => {
        const childNode = nodes.find(n => n.id === childId);
        if (!childNode) return null;

        const startX = node.x + node.width / 2;
        const startY = node.y + node.height / 2;
        const endX = childNode.x + childNode.width / 2;
        const endY = childNode.y + childNode.height / 2;

        return (
          <svg 
            key={`${node.id}-${childId}`}
            className="absolute inset-0 pointer-events-none"
          >
            <path
              d={`M${startX},${startY} L${endX},${endY}`}
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="3"
              strokeDasharray="5,5"
              className="opacity-50"
            />
          </svg>
        );
      }),
      
      // Linked nodes connections
      ...node.linkedNodes.map(linkedNodeId => {
        const linkedNode = nodes.find(n => n.id === linkedNodeId);
        if (!linkedNode) return null;

        const startX = node.x + node.width / 2;
        const startY = node.y + node.height / 2;
        const endX = linkedNode.x + linkedNode.width / 2;
        const endY = linkedNode.y + linkedNode.height / 2;

        return (
          <svg 
            key={`link-${node.id}-${linkedNodeId}`}
            className="absolute inset-0 pointer-events-none"
          >
            <path
              d={`M${startX},${startY} L${endX},${endY}`}
              fill="none"
              stroke="rgba(0,255,0,0.5)"
              strokeWidth="3"
              strokeDasharray="10,5"
              className="opacity-70"
            />
          </svg>
        );
      })
    ].filter(Boolean));

    // Add the new blue connection line if it exists
    if (newConnectionLine) {
      const { startX, startY, endX, endY } = newConnectionLine;
      standardConnections.push(
        <svg 
          key="new-connection"
          className="absolute inset-0 pointer-events-none"
        >
          <path
            d={`M${startX},${startY} L${endX},${endY}`}
            fill="none"
            stroke="rgba(0,120,255,0.7)"
            strokeWidth="4"
            strokeDasharray="5,5"
            className="animate-pulse"
          />
        </svg>
      );
    }

    return standardConnections;
  }, [nodes, newConnectionLine]);

  return (
    <div 
    ref={canvasRef}
    className="fixed inset-0 bg-black overflow-hidden touch-none select-none"
    onMouseDown={handleMouseDown}
    onMouseMove={handleMouseMove}
    onMouseUp={handleMouseUp}
    onMouseLeave={handleMouseUp}
    onTouchStart={handleTouchStart}
    onTouchMove={handleTouchMove}
    onTouchEnd={handleTouchEnd}
    // Prevent default touch behaviors
    onTouchCancel={handleTouchEnd}
  >
    <div className="absolute top-4 right-4 z-50 flex space-x-2">
        <button 
          className="bg-white/10 text-white p-2 rounded-full hover:bg-white/20"
          onClick={() => handleZoom(0.1)}
        >
          <ZoomInIcon size={20} />
        </button>
        <button 
          className="bg-white/10 text-white p-2 rounded-full hover:bg-white/20"
          onClick={() => handleZoom(-0.1)}
        >
          <ZoomOutIcon size={20} />
        </button>
      </div>
    <motion.div
      style={{
        transform: `scale(${scale}) translate(${offset.x}px, ${offset.y}px)`,
        transformOrigin: 'top left'
      }}
      className="absolute inset-0"
    >
      {renderConnections}

      {nodes.map(node => (
        <div
          id={node.id}
          key={node.id}
          className={`absolute transition-all duration-200 group ${
            selectedNodeId === node.id ? 'z-40' : 'z-10'
          }`}
          style={{
            left: node.x,
            top: node.y,
            width: node.width,
            height: node.height
          }}
        >
          <div 
            className={`
              border-2 rounded-lg p-4 relative h-full
              ${selectedNodeId === node.id 
                ? 'border-white ring-2 ring-white/30' 
                : 'border-transparent'}
              ${linkingMode.active && linkingMode.sourceNodeId === node.id
                ? 'ring-2 ring-green-500/50'
                : ''}
            `}
            style={{ 
              backgroundColor: node.color,
              transition: 'all 0.2s ease'
            }}
          >
            <textarea
              className="w-full h-full bg-transparent text-white resize-none focus:outline-none"
              value={node.text}
              onChange={(e) => {
                setNodes(prev => 
                  prev.map(n => 
                    n.id === node.id 
                      ? { ...n, text: e.target.value } 
                      : n
                  )
                );
              }}
            />

            <div className="absolute bottom-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              
              {/* Connect Node */}
              <button 
                className="text-white hover:bg-white/20 rounded p-1"
                onClick={() => createConnectedNode(node.id)}
              >
                <PlusIcon size={16} />
              </button>

              {/* Link Node */}
              <button 
                className={`text-white rounded p-1 ${
                  linkingMode.active && linkingMode.sourceNodeId === node.id
                    ? 'bg-green-500/50'
                    : 'hover:bg-white/20'
                }`}
                onClick={() => toggleNodeLinking(node.id)}
              >
                {linkingMode.active && linkingMode.sourceNodeId === node.id 
                  ? <UnlinkIcon size={16} /> 
                  : <LinkIcon size={16} />}
              </button>

              {/* Delete Node (only if not root) */}
              {node.parentId && (
                <button 
                  className="text-white hover:bg-red-500/50 rounded p-1"
                  onClick={() => deleteNode(node.id)}
                >
                  <TrashIcon size={16} />
                </button>
              )}
            </div>
            <div className="RELATIVE top-2 left-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
  {/* Move Up Button */}
  <button 
    className="text-white hover:bg-white/20 rounded p-1"
    onClick={() => {
      setNodes(prev => 
        prev.map(n => 
          n.id === node.id 
            ? { ...n, y: n.y - 50 } 
            : n
        )
      );
    }}
  >
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <line x1="12" y1="19" x2="12" y2="5"></line>
      <polyline points="5 12 12 5 19 12"></polyline>
    </svg>
  </button>

  {/* Move Down Button */}
  <button 
    className="text-white hover:bg-white/20 rounded p-1"
    onClick={() => {
      setNodes(prev => 
        prev.map(n => 
          n.id === node.id 
            ? { ...n, y: n.y + 50 } 
            : n
        )
      );
    }}
  >
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <polyline points="19 12 12 19 5 12"></polyline>
    </svg>
  </button>

  {/* Move Left Button */}
  <button 
    className="text-white hover:bg-white/20 rounded p-1"
    onClick={() => {
      setNodes(prev => 
        prev.map(n => 
          n.id === node.id 
            ? { ...n, x: n.x - 50 } 
            : n
        )
      );
    }}
  >
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 5 5 12 12 19"></polyline>
    </svg>
  </button>

  {/* Move Right Button */}
  <button 
    className="text-white hover:bg-white/20 rounded p-1"
    onClick={() => {
      setNodes(prev => 
        prev.map(n => 
          n.id === node.id 
            ? { ...n, x: n.x + 50 } 
            : n
        )
      );
    }}
  >
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 19 19 12 12 5"></polyline>
    </svg>
  </button>
</div>
          </div>
        </div>
      ))}
    </motion.div>
  </div>
);
};

export default FlowchartBuilder;