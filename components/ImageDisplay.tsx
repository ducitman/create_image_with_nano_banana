
import React from 'react';
import { Spinner } from './Spinner';

interface ImageDisplayProps {
  title: string;
  imageUrl: string | null;
  isLoading?: boolean;
}

const ImageIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);


export const ImageDisplay: React.FC<ImageDisplayProps> = ({ title, imageUrl, isLoading = false }) => {
  return (
    <div className="flex flex-col space-y-3">
      <h3 className="text-lg font-medium text-center text-gray-300">{title}</h3>
      <div className="w-full h-80 bg-gray-700/50 rounded-lg flex justify-center items-center p-2 relative overflow-hidden shadow-inner">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-800/80 flex flex-col justify-center items-center z-10">
            <Spinner />
            <p className="mt-4 text-gray-300">Generating your image...</p>
          </div>
        )}
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="max-h-full max-w-full object-contain rounded-md" />
        ) : !isLoading && (
            <div className="text-center text-gray-500 flex flex-col items-center">
                <ImageIcon />
                <p className="mt-2">Your {title.toLowerCase()} will appear here.</p>
            </div>
        )}
      </div>
    </div>
  );
};
