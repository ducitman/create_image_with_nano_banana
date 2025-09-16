
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ImageDisplay } from './components/ImageDisplay';
import { Spinner } from './components/Spinner';
import { editImage } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';

// Define a type for the uploaded image state
interface UploadedImage {
  file: File;
  base64: string;
}

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<UploadedImage | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback(async (file: File) => {
    setError(null);
    setEditedImage(null);
    try {
      const base64 = await fileToBase64(file);
      setOriginalImage({ file, base64 });
    } catch (err) {
      setError('Failed to read the image file. Please try another one.');
      setOriginalImage(null);
    }
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!originalImage || !prompt) {
      setError('Please upload an image and provide an editing prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setEditedImage(null);

    try {
      const result = await editImage(
        originalImage.base64,
        originalImage.file.type,
        prompt
      );
      if (result.image) {
        setEditedImage(result.image);
      } else {
        setError(result.text || 'The model did not return an image. Please try a different prompt.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Generation failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, prompt]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-5xl bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ImageUploader onImageUpload={handleImageUpload} imagePreview={originalImage?.base64 || null} />
            
            <div className="flex flex-col space-y-4 justify-center">
              <h2 className="text-xl font-semibold text-indigo-400">2. Describe Your Edit</h2>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., 'add a futuristic city in the background', 'make it look like a watercolor painting', 'change the dog to a cat'"
                className="w-full h-36 p-4 bg-gray-700 border-2 border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 resize-none"
              />
              <button
                onClick={handleGenerate}
                disabled={isLoading || !originalImage || !prompt}
                className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center shadow-lg"
              >
                {isLoading ? <Spinner /> : 'Generate Image'}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative text-center" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <ImageDisplay title="Original Image" imageUrl={originalImage?.base64 || null} />
            <ImageDisplay title="Edited Image" imageUrl={editedImage} isLoading={isLoading} />
          </div>

        </div>
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm">
        <p>Powered by Google's Gemini API</p>
      </footer>
    </div>
  );
};

export default App;
