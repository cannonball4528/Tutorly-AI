import React, { useState } from 'react';
import { ArrowLeft, Download, Share2, RotateCcw, Sparkles, MessageSquare, Hash, Eye, CheckCircle, Plus } from 'lucide-react';
import { OnboardingData } from './OnboardingPage';

interface ConversationPageProps {
  userData: OnboardingData | null;
  onBack: () => void;
  originalPrompt: string;
  uploadedImageUrl?: string;
  generatedImageUrl: string;
}

export const ConversationPage: React.FC<ConversationPageProps> = ({ 
  userData, 
  onBack, 
  originalPrompt,
  uploadedImageUrl,
  generatedImageUrl 
}) => {
  const [showCaptionPrompt, setShowCaptionPrompt] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [generatedCaption, setGeneratedCaption] = useState<string | null>(null);
  const [selectedCaption, setSelectedCaption] = useState<string | null>(null);
  const [showTagsPrompt, setShowTagsPrompt] = useState(false);
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);
  const [generatedTags, setGeneratedTags] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showDraftConfirmation, setShowDraftConfirmation] = useState(false);

  const handleGenerateCaption = (generateCaption: boolean) => {
    setShowCaptionPrompt(false);
    if (generateCaption) {
      console.log('Generating caption...');
      // Simulate caption generation
      setTimeout(() => {
        setGeneratedCaption("A touch of green, a statement of grace. 💚 This exquisite emerald-cut ring, framed in shimmering diamonds, is more than jewellery - it's a story of bold sophistication.");
      }, 1500);
    } else {
      setShowTagsPrompt(true);
    }
  };

  const handleCaptionSelection = (useCaption: boolean) => {
    if (useCaption && generatedCaption) {
      setSelectedCaption(generatedCaption);
    }
    setGeneratedCaption(null);
    setShowTagsPrompt(true);
  };

  const handleRegenerateCaption = () => {
    console.log('Regenerating caption...');
    // Simulate caption regeneration
    setTimeout(() => {
      setGeneratedCaption("Emerald dreams come to life ✨ This stunning piece captures the essence of timeless elegance with its brilliant cut and diamond accents. A true masterpiece for the discerning collector.");
    }, 1500);
  };

  const handleGenerateTags = (generateTags: boolean) => {
    setShowTagsPrompt(false);
    if (generateTags) {
      setIsGeneratingTags(true);
      console.log('Generating tags...');
      // Simulate tags generation
      setTimeout(() => {
        setGeneratedTags("#FineJewelry #EmeraldElegance #StatementRing #LuxuryStyle");
        setIsGeneratingTags(false);
      }, 1500);
    } else {
      setShowPreview(true);
    }
  };

  const handleRegenerateTags = () => {
    setIsGeneratingTags(true);
    console.log('Regenerating tags...');
    // Simulate tags regeneration
    setTimeout(() => {
      setGeneratedTags("#EmeraldRing #LuxuryJewelry #HandcraftedElegance #PreciousStones #JewelryDesign #TimelessBeauty");
      setIsGeneratingTags(false);
    }, 1500);
  };

  const handleTagsSelection = (useTags: boolean) => {
    if (useTags && generatedTags) {
      setSelectedTags(generatedTags);
    }
    setGeneratedTags(null);
    setShowPreview(true);
  };

  const handleSaveToDrafts = () => {
    setShowPreview(false);
    setShowDraftConfirmation(true);
  };

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setIsRegenerating(false);
    }, 3000);
  };

  const handleNewChat = () => {
    onBack(); // Go back to dashboard for new chat
  };

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8">
              <img 
                src="/3000-avatar.png" 
                alt="Morpheus Labs" 
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <span className="text-white font-semibold text-lg">Morpheus Labs AI</span>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-300 text-sm font-medium">
                Digital Marketing Agent
              </span>
            </div>
            <p className="text-gray-500 text-xs mt-1">
              Marketing • Active
            </p>
          </div>

          {/* New Chat Button */}
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-lg"
          >
            <Plus size={16} />
            <span>New Chat</span>
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4">
          <nav className="space-y-1">
            <div className="text-gray-400 text-sm font-medium mb-2">AI Social Media Post History</div>
            <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium bg-blue-600/20 text-blue-400 border border-blue-600/30">
              <span>Ring Design</span>
            </button>
            
            <div className="text-gray-400 text-sm font-medium mb-2 mt-6">Social Media Posts</div>
            <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-gray-300 hover:bg-gray-800/50">
              <span>Drafts</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-gray-300 hover:bg-gray-800/50">
              <span>Scheduled</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-gray-300 hover:bg-gray-800/50">
              <span>Published</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-gray-300 hover:bg-gray-800/50">
              <span>Analytics</span>
            </button>
          </nav>
        </div>

        {/* Invite Members */}
        <div className="p-4 border-t border-gray-800">
          <button className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-gray-300 hover:bg-gray-800/50 transition-all duration-200">
            <span>Invite members</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft size={20} className="text-gray-400" />
          </button>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleRegenerate}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors duration-200"
            >
              <RotateCcw size={20} className="text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors duration-200">
              <Download size={20} className="text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors duration-200">
              <Share2 size={20} className="text-gray-400" />
            </button>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">?</span>
            </div>
          </div>
        </div>

        {/* Conversation Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* User Message (Right Side) */}
          <div className="flex justify-end">
            <div className="max-w-2xl">
              <div className="flex items-start space-x-3">
                <div className="flex-1">
                  {/* User's uploaded image */}
                  {uploadedImageUrl && (
                    <div className="mb-3">
                      <img
                        src={uploadedImageUrl}
                        alt="User uploaded image"
                        className="w-64 h-48 object-cover rounded-lg border border-gray-700"
                      />
                    </div>
                  )}
                  
                  {/* User's text message */}
                  <div className="bg-blue-600 text-white rounded-2xl rounded-tr-md px-4 py-3">
                    <p className="text-sm">{originalPrompt}</p>
                  </div>
                </div>
                
                {/* User Avatar */}
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-medium">U</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Response (Left Side) */}
          <div className="flex justify-start">
            <div className="max-w-2xl">
              <div className="flex items-start space-x-3">
                {/* AI Avatar */}
                <div className="w-8 h-8 flex-shrink-0">
                  <img 
                    src="/3000-avatar.png" 
                    alt="Morpheus Labs AI" 
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  {/* AI Generated Image */}
                  <div className="relative mb-4">
                    <img
                      src={generatedImageUrl}
                      alt="AI Generated jewelry visualization"
                      className="w-80 h-96 object-cover rounded-lg border border-gray-700"
                    />
                    
                    {/* Regeneration Loading indicator */}
                    {isRegenerating && (
                      <div className="absolute top-4 left-4">
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  
                  {/* AI Response Text */}
                  <div className="bg-gray-800 text-gray-200 rounded-2xl rounded-tl-md px-4 py-3 mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Sparkles size={16} className="text-blue-400" />
                      <span className="text-sm font-medium text-blue-400">Generated Image</span>
                    </div>
                    <p className="text-sm">
                      I've generated a beautiful jewelry visualization showing the ring being worn by a model in soft lighting. 
                      The image captures the elegance and craftsmanship of the piece, perfect for social media marketing.
                    </p>
                  </div>

                  {/* Caption Generation Prompt */}
                  {showCaptionPrompt && (
                    <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-4 mb-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <MessageSquare size={18} className="text-blue-400" />
                        <span className="text-blue-400 font-medium">Caption Generation</span>
                      </div>
                      <p className="text-gray-200 mb-4">
                        Would you like me to generate a social media caption for this post?
                      </p>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleGenerateCaption(true)}
                          className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-lg"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => handleGenerateCaption(false)}
                          className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                        >
                          No
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Generated Caption */}
                  {generatedCaption && (
                    <div className="bg-gray-800 text-gray-200 rounded-2xl rounded-tl-md px-4 py-3 mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <MessageSquare size={16} className="text-green-400" />
                        <span className="text-sm font-medium text-green-400">Generated Caption</span>
                      </div>
                      <div className="text-sm whitespace-pre-line mb-3">
                        {generatedCaption}
                      </div>
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => handleCaptionSelection(true)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors duration-200"
                        >
                          Use this caption
                        </button>
                        <button 
                          onClick={handleRegenerateCaption}
                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors duration-200"
                        >
                          Regenerate caption
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Tags Generation Prompt */}
                  {showTagsPrompt && (
                    <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-4 mb-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <Hash size={18} className="text-purple-400" />
                        <span className="text-purple-400 font-medium">Tag Generation</span>
                      </div>
                      <p className="text-gray-200 mb-4">
                        Would you like to generate tags for your post?
                      </p>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleGenerateTags(true)}
                          className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-lg"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => handleGenerateTags(false)}
                          className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                        >
                          No
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Tags Generation Loading */}
                  {isGeneratingTags && (
                    <div className="bg-gray-800 text-gray-200 rounded-2xl rounded-tl-md px-4 py-3 mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Hash size={16} className="text-purple-400 animate-pulse" />
                        <span className="text-sm font-medium text-purple-400">Generating Tags...</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm text-gray-400">Creating relevant hashtags for your post...</span>
                      </div>
                    </div>
                  )}

                  {/* Generated Tags */}
                  {generatedTags && !isGeneratingTags && !showPreview && (
                    <div className="bg-gray-800 text-gray-200 rounded-2xl rounded-tl-md px-4 py-3 mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Hash size={16} className="text-purple-400" />
                        <span className="text-sm font-medium text-purple-400">Generated Tags</span>
                      </div>
                      <div className="text-sm text-blue-400 mb-3">
                        {generatedTags}
                      </div>
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => handleTagsSelection(true)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors duration-200"
                        >
                          Use these tags
                        </button>
                        <button 
                          onClick={handleRegenerateTags}
                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors duration-200"
                        >
                          Regenerate tags
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Preview Post */}
                  {showPreview && (
                    <div className="bg-gray-800 text-gray-200 rounded-2xl rounded-tl-md px-4 py-3 mb-4">
                      <div className="flex items-center space-x-2 mb-4">
                        <Eye size={16} className="text-blue-400" />
                        <span className="text-sm font-medium text-blue-400">Preview Post:</span>
                      </div>
                      
                      {/* Preview Image */}
                      <div className="mb-4">
                        <img
                          src={generatedImageUrl}
                          alt="Preview post"
                          className="w-full max-w-sm h-64 object-cover rounded-lg border border-gray-600"
                        />
                      </div>
                      
                      {/* Preview Caption - Only show if selected */}
                      {selectedCaption && (
                        <div className="text-sm mb-3">
                          {selectedCaption}
                        </div>
                      )}
                      
                      {/* Preview Tags - Only show if selected */}
                      {selectedTags && (
                        <div className="text-sm text-blue-400 mb-4">
                          {selectedTags}
                        </div>
                      )}
                      
                      <button
                        onClick={handleSaveToDrafts}
                        className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-lg"
                      >
                        Save to Drafts
                      </button>
                    </div>
                  )}

                  {/* Draft Confirmation */}
                  {showDraftConfirmation && (
                    <div className="bg-gray-800 text-gray-200 rounded-2xl rounded-tl-md px-4 py-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle size={16} className="text-green-400" />
                        <span className="text-sm font-medium text-green-400">Done!</span>
                      </div>
                      <p className="text-sm">
                        This post is now in your Drafts folder. Feel free to make changes before going live.
                      </p>
                      <div className="mt-3 pt-3 border-t border-gray-700">
                        <div className="flex items-center space-x-2 text-xs text-gray-400">
                          <MessageSquare size={12} />
                          <span>Message Digital Marketing Agent</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};