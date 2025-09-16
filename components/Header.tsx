
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm p-4 text-center sticky top-0 z-10">
      <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
        <span className="text-indigo-400">Nano Banana</span> Image Editor
      </h1>
      <p className="text-gray-400 mt-1">AI-Powered Image Transformation</p>
    </header>
  );
};
