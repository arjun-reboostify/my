import React, { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Move, ZoomIn, ZoomOut, Save, Edit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Unique ID generator
const generateId = () => Math.random().toString(36).substr(2, 9);

// Interface for Node structure
interface FlowNode {
  id: string;
  x: number;
  y: number;
  text: string;
  connections: string[];
  isEditing: boolean;
}

const FlowchartBuilder: React.FC = () => {
  // Load initial state from localStorage or start with a default node
  const [nodes, setNodes] = useState<FlowNode[]>(() => {
    const savedNodes = localStorage.getItem('flowchartNodes');
    return savedNodes 
      ? JSON.parse(savedNodes) 
      : [{ 
          id: generateId(), 
          x: window.innerWidth / 2 - 100, 
          y: window.innerHeight / 2 - 50, 
          text: 'Start', 
          connections: [],
          isEditing: false
        }];
  });

  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const canvasRef = useRef<HTMLDivElement>(null);
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Save nodes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('flowchartNodes', JSON.stringify(nodes));
  }, [nodes]);

  // Automatically focus and select text when entering edit mode
  useEffect(() => {
    const editingNode = nodes.find(node => node.isEditing);
    if (editingNode) {
      const input = inputRefs.current[editingNode.id];
      if (input) {
        input.focus();
        input.select();
      }
    }
  }, [nodes]);

  // Responsive canvas sizing
  useEffect(() => {
    const handleResize = () => {
      // Adjust node positions if they're outside the viewport
      setNodes(prevNodes => prevNodes.map(node => ({
        ...node,
        x: Math.max(0, Math.min(node.x, window.innerWidth - 200)),
        y: Math.max(0, Math.min(node.y, window.innerHeight - 100))
      })));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Add new node
  const addNode = (parentNodeId: string, position: { x: number; y: number }) => {
    const newNode: FlowNode = {
      id: generateId(),
      x: position.x,
      y: position.y,
      text: 'New Node',
      connections: [parentNodeId],
      isEditing: true
    };

    // Update the parent node's connections
    setNodes(prevNodes => {
      const updatedNodes = prevNodes.map(node => 
        node.id === parentNodeId 
          ? { ...node, connections: [...node.connections, newNode.id] }
          : node
      );
      return [...updatedNodes, newNode];
    });
  };

  // Delete node and its connections
  const deleteNode = (nodeId: string) => {
    setNodes(prevNodes => {
      // Remove the node
      const filteredNodes = prevNodes.filter(node => node.id !== nodeId);
      
      // Remove connections to the deleted node
      return filteredNodes.map(node => ({
        ...node,
        connections: node.connections.filter(connId => connId !== nodeId)
      }));
    });
  };

  // Calculate connection line
  const calculateConnectionLine = (from: FlowNode, to: FlowNode) => {
    return `M${from.x + 100} ${from.y + 50} L${to.x + 100} ${to.y + 50}`;
  };

  // Node drag handling
  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    setSelectedNode(nodeId);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && selectedNode) {
      setNodes(prevNodes => prevNodes.map(node => 
        node.id === selectedNode
          ? { 
              ...node, 
              x: node.x + e.movementX / zoom, 
              y: node.y + e.movementY / zoom 
            }
          : node
      ));
    } else if (isPanning && canvasRef.current) {
      const dx = e.clientX - panStart.x;
      const dy = e.clientY - panStart.y;
      
      setNodes(prevNodes => prevNodes.map(node => ({
        ...node,
        x: node.x + dx / zoom,
        y: node.y + dy / zoom
      })));

      setPanStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsPanning(false);
  };

  // Text editing handlers
  const handleTextChange = (nodeId: string, newText: string) => {
    setNodes(prevNodes => 
      prevNodes.map(node => 
        node.id === nodeId 
          ? { ...node, text: newText }
          : node
      )
    );
  };

  const startEditing = (nodeId: string) => {
    setNodes(prevNodes => 
      prevNodes.map(node => ({
        ...node,
        isEditing: node.id === nodeId
      }))
    );
  };

  const stopEditing = () => {
    setNodes(prevNodes => 
      prevNodes.map(node => ({
        ...node,
        isEditing: false
      }))
    );
  };

  // Zoom handling
  const handleWheel = (e: React.WheelEvent) => {
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prevZoom => {
      const newZoom = prevZoom * zoomFactor;
      // Limit zoom range
      return Math.max(0.5, Math.min(newZoom, 2));
    });
  };

  // Save current flowchart state
  const saveFlowchart = () => {
    localStorage.setItem('flowchartNodes', JSON.stringify(nodes));
    alert('Flowchart saved successfully!');
  };

  // Clear all nodes
  const clearFlowchart = () => {
    setNodes([{ 
      id: generateId(), 
      x: window.innerWidth / 2 - 100, 
      y: window.innerHeight / 2 - 50, 
      text: 'Start', 
      connections: [],
      isEditing: false
    }]);
  };

  // Node positioning helpers
  const getNodePlusPositions = (node: FlowNode) => [
    { x: node.x + 50, y: node.y - 50 },    // Top
    { x: node.x + 150, y: node.y - 50 },   // Top-Right
    { x: node.x + 150, y: node.y + 50 },   // Right
    { x: node.x + 150, y: node.y + 150 },  // Bottom-Right
    { x: node.x + 50, y: node.y + 150 },   // Bottom
    { x: node.x - 50, y: node.y + 150 },   // Bottom-Left
    { x: node.x - 50, y: node.y + 50 },    // Left
    { x: node.x - 50, y: node.y - 50 }     // Top-Left
  ];

  return (
    <motion.div 
      className="relative w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden"
      ref={canvasRef}
      onMouseDown={(e) => {
        if (e.button === 1 || e.button === 0) {
          setIsPanning(true);
          setPanStart({ x: e.clientX, y: e.clientY });
        }
        setSelectedNode(null);
        stopEditing(); // Stop editing when clicking outside
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Toolbar */}
      <motion.div 
        className="absolute top-4 left-4 z-50 flex space-x-2"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
      >
        <motion.button 
          onClick={() => setZoom(prev => Math.min(prev * 1.1, 2))}
          className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
          title="Zoom In"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ZoomIn className="text-gray-700" />
        </motion.button>
        <motion.button 
          onClick={() => setZoom(prev => Math.max(prev * 0.9, 0.5))}
          className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
          title="Zoom Out"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ZoomOut className="text-gray-700" />
        </motion.button>
        <motion.button 
          onClick={saveFlowchart}
          className="bg-blue-500 text-white p-2 rounded-full shadow-md hover:bg-blue-600"
          title="Save Flowchart"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Save />
        </motion.button>
        <motion.button 
          onClick={clearFlowchart}
          className="bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600"
          title="Clear Flowchart"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Trash2 />
        </motion.button>
      </motion.div>

      {/* SVG for connections */}
      <svg 
        className="absolute top-0 left-0 w-full h-full pointer-events-none" 
        style={{ transform: `scale(${zoom})` }}
      >
        {nodes.flatMap(node => 
          node.connections.map(connectionId => {
            const connectedNode = nodes.find(n => n.id === connectionId);
            return connectedNode ? (
              <path
                key={`${node.id}-${connectionId}`}
                d={calculateConnectionLine(node, connectedNode)}
                fill="none"
                stroke="rgba(59, 130, 246, 0.7)"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            ) : null;
          })
        )}
      </svg>

      {/* Nodes */}
      <AnimatePresence>
        {nodes.map(node => (
          <motion.div 
            key={node.id}
            className={`absolute group transition-all duration-300 ${
              selectedNode === node.id ? 'z-40' : 'z-10'
            }`}
            style={{
              left: node.x,
              top: node.y,
              transform: `scale(${zoom})`,
              transformOrigin: 'top left'
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <motion.div 
              className={`
                relative w-60 bg-white rounded-lg shadow-xl 
                border-2 transition-all duration-300
                ${selectedNode === node.id 
                  ? 'border-blue-500 scale-105' 
                  : 'border-gray-200 hover:border-blue-300'}
              `}
              onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
              whileHover={{ 
                boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)' 
              }}
            >
              {/* Node Header */}
              <div className="flex items-center justify-between p-2 border-b">
                <Move className="text-gray-400 cursor-move" />
                <div className="flex space-x-2">
                  <motion.button 
                    onClick={() => startEditing(node.id)}
                    className="text-blue-500 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Edit Node"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Edit size={18} />
                  </motion.button>
                  <motion.button 
                    onClick={() => deleteNode(node.id)}
                    className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete Node"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 size={18} />
                  </motion.button>
                </div>
              </div>

              {/* Node Content */}
              {node.isEditing ? (
                <input
                  ref={(el) => inputRefs.current[node.id] = el}
                  type="text"
                  value={node.text}
                  onChange={(e) => handleTextChange(node.id, e.target.value)}
                  onBlur={() => stopEditing()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === 'Escape') {
                      stopEditing();
                    }
                  }}
                  className="w-full p-2 text-center outline-none bg-transparent border-b"
                  placeholder="Enter node text"
                />
              ) : (
                <div 
                  className="w-full p-2 text-center cursor-text"
                  onClick={() => startEditing(node.id)}
                >
                  {node.text || 'Empty Node'}
                </div>
              )}

              {/* Plus Icons for Adding Nodes */}
              {getNodePlusPositions(node).map((pos, index) => (
                <motion.button
                  key={index}
                  className={`
                    absolute w-8 h-8 bg-green-500 rounded-full 
                    flex items-center justify-center text-white 
                    hover:bg-green-600 opacity-0 group-hover:opacity-100 
                    transition-all duration-300
                  `}
                  style={{
                    left: pos.x - node.x - 16,
                    top: pos.y - node.y - 16
                  }}
                  onClick={() => addNode(node.id, pos)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Plus size={20} />
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default FlowchartBuilder;