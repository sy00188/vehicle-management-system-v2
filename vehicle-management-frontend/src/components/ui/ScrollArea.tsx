import React from 'react';

interface ScrollAreaProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const ScrollArea: React.FC<ScrollAreaProps> = ({
  children,
  className = '',
  style,
}) => {
  return (
    <div
      className={`
        relative overflow-auto
        scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100
        hover:scrollbar-thumb-gray-400
        ${className}
      `}
      style={style}
    >
      {children}
    </div>
  );
};

export default ScrollArea;
export type { ScrollAreaProps };