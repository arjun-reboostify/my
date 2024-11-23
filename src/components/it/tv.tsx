import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import Side from './Sidebar'

interface VideoSlide {
  id: string;
  title: string;
  embedUrl: string;
  description: string;
  duration: string;
  views: string;
}

interface Section {
  id: string;
  title: string;
  videos: VideoSlide[];
}

const EnhancedYouTubeSections = () => {
  // Sample sections data - replace with your actual content
  const sections: Section[] = [
    {
      id: "trending",
      title: "Trending Now 🔥",
      videos: [
        {
          id: "1",
          title: "Amazing Space Documentary",
          embedUrl: "https://www.youtube.com/embed/8i2zqx4rVWc",
          description: "Explore the wonders of our universe in stunning 4K resolution.",
          duration: "10:30",
          views: "1.2M"
        },
        {
          id: "2",
          title: "Tech Review 2024",
          embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          description: "The latest gadgets and innovations reviewed.",
          duration: "15:45",
          views: "890K"
        },
        // Add more videos...
      ]
    },
    {
      id: "music",
      title: "Music Videos 🎵",
      videos: [
        {
          id: "3",
          title: "Latest Hit Song",
          embedUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
          description: "Official music video for the trending song of 2024.",
          duration: "4:15",
          views: "2.3M"
        },
        // Add more videos...
      ]
    },
    {
      id: "gaming",
      title: "Gaming Highlights 🎮",
      videos: [
        {
          id: "4",
          title: "Epic Gaming Moments",
          embedUrl: "https://www.youtube.com/embed/8i2zqx4rVWc",
          description: "The most incredible gaming moments of the week.",
          duration: "8:20",
          views: "500K"
        },
        // Add more videos...
      ]
    }
  ];

  const [activeSection, setActiveSection] = useState<string>(sections[0].id);
  const [currentIndices, setCurrentIndices] = useState<Record<string, number>>(
    sections.reduce((acc, section) => ({ ...acc, [section.id]: 0 }), {})
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);

  const nextSlide = (sectionId: string) => {
    setCurrentIndices(prev => ({
      ...prev,
      [sectionId]: (prev[sectionId] + 1) % sections.find(s => s.id === sectionId)!.videos.length
    }));
  };

  const prevSlide = (sectionId: string) => {
    setCurrentIndices(prev => ({
      ...prev,
      [sectionId]: prev[sectionId] === 0 
        ? sections.find(s => s.id === sectionId)!.videos.length - 1 
        : prev[sectionId] - 1
    }));
  };

  return (
    <><Side />
    <div className="min-h-screen bg-gray-900 text-white py-8 px-4">
      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-6 py-3 rounded-full transition-all ${
                activeSection === section.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
              }`}
            >
              {section.title}
            </button>
          ))}
        </div>
      </div>

      {/* Sections */}
      {sections.map((section) => (
        <div
          key={section.id}
          className={`max-w-7xl mx-auto mb-16 transition-opacity duration-300 ${
            activeSection === section.id ? 'opacity-100' : 'opacity-0 hidden'
          }`}
        >
          <h2 className="text-3xl font-bold mb-6">{section.title}</h2>
          
          {/* Main Video Player */}
          <div className="relative rounded-xl overflow-hidden shadow-2xl mb-8">
            <div className="relative w-full pb-[56.25%] bg-black">
              <iframe
                src={`${section.videos[currentIndices[section.id]].embedUrl}?autoplay=${isPlaying ? '1' : '0'}`}
                title={section.videos[currentIndices[section.id]].title}
                className="absolute top-0 left-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              
              {/* Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <h3 className="text-2xl font-bold mb-2">
                  {section.videos[currentIndices[section.id]].title}
                </h3>
                <p className="text-gray-300 mb-4">
                  {section.videos[currentIndices[section.id]].description}
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full transition-colors"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isPlaying ? 'Pause' : 'Play'}
                  </button>
                  <span className="text-gray-400">
                    {section.videos[currentIndices[section.id]].views} views
                  </span>
                  <span className="text-gray-400">
                    {section.videos[currentIndices[section.id]].duration}
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={() => prevSlide(section.id)}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 p-3 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => nextSlide(section.id)}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 p-3 rounded-full transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Thumbnail Navigation */}
          <div className="relative group">
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {section.videos.map((video, index) => (
                <div
                  key={video.id}
                  onClick={() => {
                    setCurrentIndices(prev => ({ ...prev, [section.id]: index }));
                    setIsPlaying(true);
                  }}
                  onMouseEnter={() => setHoveredVideo(video.id)}
                  onMouseLeave={() => setHoveredVideo(null)}
                  className={`flex-none cursor-pointer transition-all ${
                    currentIndices[section.id] === index ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <div className="relative w-64 pb-[56.25%] bg-black rounded-lg overflow-hidden">
                    <iframe
                      src={`${video.embedUrl}?autoplay=0`}
                      title={video.title}
                      className="absolute top-0 left-0 w-full h-full pointer-events-none"
                      loading="lazy"
                    />
                    {/* Hover Overlay */}
                    <div
                      className={`absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors
                        ${currentIndices[section.id] === index ? 'bg-black/10' : ''}
                        ${hoveredVideo === video.id ? 'bg-black/30' : ''}
                      `}
                    >
                      {hoveredVideo === video.id && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Play className="w-12 h-12 text-white" />
                        </div>
                      )}
                    </div>
                    {/* Duration Badge */}
                    <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-sm">
                      {video.duration}
                    </div>
                  </div>
                  <div className="mt-2">
                    <h4 className="font-medium truncate">{video.title}</h4>
                    <p className="text-sm text-gray-400">{video.views} views</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
    </>
  );
};

export default EnhancedYouTubeSections;