import React from 'react';

interface IFrameProps {
  src: string;
  width?: string;
  height?: string;
  title?: string;
  className?: string;
}

const IFrame: React.FC<IFrameProps> = ({
  src, 
  width = '100%', 
  height = '450px', 
  title = 'Embedded Content',
  className = ''
}) => {
  return (
    <iframe 
      src={src}
      width={width}
      height={height}
      title={title}
      className={`border-none ${className}`}
      allowFullScreen
    />
  );
};

export default IFrame;