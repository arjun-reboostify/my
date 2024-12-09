import React, { useState } from 'react';
import { X } from 'lucide-react';
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
      id: '1',
      title: 'Category 1',
      pdfUrl: '',
      subTiles: [
        { 
          id: '1.1', 
          title: 'Document 1', 
          pdfUrl: A 
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

  // State to manage PDF overlay
  const [selectedPDF, setSelectedPDF] = useState<string | null>(null);

  // Recursive component to render tiles
  const TileGroup: React.FC<{ 
    tiles: PDFTile[], 
    level?: number 
  }> = ({ tiles, level = 0 }) => {
    return (
      <div className={`space-y-2 ${level > 0 ? 'pl-4' : ''}`}>
        {tiles.map((tile) => (
          <div key={tile.id} className="group">
            {/* Tile with conditional PDF opening */}
            <div 
              onClick={() => tile.pdfUrl && setSelectedPDF(tile.pdfUrl)}
              className={`
                p-3 rounded-lg 
                ${tile.pdfUrl 
                  ? 'cursor-pointer hover:bg-blue-100 hover:text-blue-600 transition' 
                  : 'font-semibold text-gray-700'}
                ${tile.subTiles ? 'bg-gray-50' : 'bg-white'}
                border border-gray-200 
                flex justify-between items-center
              `}
            >
              <span>{tile.title}</span>
              {tile.pdfUrl && (
                <span className="text-xs text-gray-500 group-hover:text-blue-500">
                  View PDF
                </span>
              )}
            </div>

            {/* Render nested tiles recursively */}
            {tile.subTiles && (
              <TileGroup tiles={tile.subTiles} level={level + 1} />
            )}
          </div>
        ))}
      </div>
    );
  };

  // PDF Overlay Component
  const PDFOverlay: React.FC = () => {
    if (!selectedPDF) return null;

    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
        onClick={() => setSelectedPDF(null)}
      >
        <div 
          className="bg-white rounded-lg w-11/12 max-w-4xl h-5/6 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button 
            onClick={() => setSelectedPDF(null)}
            className="absolute top-4 right-4 z-60 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>

          {/* PDF Viewer */}
          <div className="h-full w-full overflow-auto">
            <iframe 
              src={selectedPDF}
              className="w-full h-full"
              title="PDF Viewer"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">PDF Tile Viewer</h1>
      <TileGroup tiles={tiles} />
      <PDFOverlay />
    </div>
  );
};

export default PDFTileViewer;