import React, { useEffect, useState } from 'react';

const ZoomOutScrollBackground: React.FC = () => {
  const [bgSize, setBgSize] = useState<number>(150); // Start background size at 150%

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Calculate the new background size and clamp it to a minimum of 100%
      const newSize = Math.max(100, 150 - scrollY * 0.2);
      setBgSize(newSize);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll); // Cleanup
  }, []);

  return (
    <div
      className="h-[200vh] bg-center transition-all duration-75"
      style={{
        backgroundImage: "url('/logo.png')",
        backgroundSize: `${bgSize}%`,
        backgroundAttachment: 'fixed', // Fixed background for better visual effect
      }}
    >
      <div className="h-screen flex items-center justify-center">
        <h1 className="text-5xl text-white font-bold shadow-lg">Scroll Down!</h1>
      </div>
    </div>
  );
};

export default ZoomOutScrollBackground;
