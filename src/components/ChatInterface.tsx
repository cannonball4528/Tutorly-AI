import React, { useState, useRef } from 'react';
import { Paperclip, X, Image, Sparkles } from 'lucide-react';
import { OnboardingData } from './OnboardingPage';

interface ChatInterfaceProps {
  userData: OnboardingData | null;
  onGenerate?: (prompt: string, imageFile?: File) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ userData, onGenerate }) => {
  const [message, setMessage] = useState('');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !uploadedImage) return;
    
    setIsGenerating(true);
    
    // Call the generation handler
    onGenerate?.(message, uploadedImage || undefined);
    
    // Reset form
    setMessage('');
    setUploadedImage(null);
    setImagePreview(null);
    
    // Reset generating state after a delay (this would normally be handled by the parent)
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setUploadedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-3">
        {/* Generation Loading State */}
        {isGenerating && (
          <div className="mb-3 p-4 bg-blue-600/10 border border-blue-600/30 rounded-lg">
            <div className="flex items-center space-x-3">
              <Sparkles size={20} className="text-blue-400 animate-pulse" />
              <div>
                <p className="text-blue-400 font-medium">Generating your jewelry visualization...</p>
                <p className="text-blue-300/70 text-sm">This may take a few moments</p>
              </div>
            </div>
          </div>
        )}

        {/* Image Preview */}
        {imagePreview && !isGenerating && (
          <div className="mb-3 flex items-center space-x-3 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
            <div className="relative">
              <img 
                src={imagePreview} 
                alt="Upload preview" 
                className="w-16 h-16 object-cover rounded-lg"
              />
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors duration-200"
              >
                <X size={12} className="text-white" />
              </button>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <Image size={16} className="text-blue-400" />
                <span className="text-gray-300 text-sm font-medium">
                  {uploadedImage?.name}
                </span>
              </div>
              <p className="text-gray-500 text-xs mt-1">
                Ready for image-to-image generation
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-center space-x-3">
            {/* Upload Button */}
            <button
              type="button"
              onClick={handleFileUpload}
              disabled={isGenerating}
              className={`flex-shrink-0 p-2.5 rounded-lg border transition-all duration-200 ${
                uploadedImage 
                  ? 'bg-blue-600 border-blue-500 text-white' 
                  : 'bg-gray-800 hover:bg-gray-700 border-gray-700 text-gray-400'
              } ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Paperclip size={18} />
            </button>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Message Input Container */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={isGenerating ? "Generating..." : "Message Digital Marketing Agent"}
                disabled={isGenerating}
                className={`w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 pr-20 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-600 focus:border-gray-600 transition-all duration-200 ${
                  isGenerating ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && !isGenerating) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              
              {/* Generate Button */}
              <button
                type="submit"
                disabled={(!message.trim() && !uploadedImage) || isGenerating}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${
                  (message.trim() || uploadedImage) && !isGenerating
                    ? 'bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white shadow-sm'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Sparkles size={14} className={isGenerating ? 'animate-pulse' : ''} />
                <span>{isGenerating ? 'Generating...' : 'Generate'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};