import React from 'react';
import { ArrowLeft, X, Calendar, Edit3, Eye } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { OnboardingData } from './OnboardingPage';

interface DraftsPageProps {
  onBack: () => void;
  onEditPost: (postData: { id: number; title: string; image: string; caption: string; tags: string }) => void;
  userData?: OnboardingData | null;
  onTabSelect?: (tab: string) => void;
}

export const DraftsPage: React.FC<DraftsPageProps> = ({ onBack, onEditPost, userData, onTabSelect }) => {
  const draftPosts = [
    {
      id: 1,
      title: 'Ring Design Post',
      image: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
      caption: 'A touch of green, a statement of grace. 💚 This exquisite emerald-cut ring, framed in shimmering diamonds, is more than jewellery - it\'s a story of bold sophistication.',
      tags: '#FineJewelry #EmeraldElegance #StatementRing #LuxuryStyle',
      createdAt: '2 hours ago'
    },
    {
      id: 2,
      title: 'Necklace Design Post',
      image: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
      caption: 'Elegance meets sophistication in this stunning diamond necklace...',
      tags: '#DiamondNecklace #LuxuryJewelry #Elegance',
      createdAt: '1 day ago'
    },
    {
      id: 3,
      title: 'Earring Collection Post',
      image: 'https://images.pexels.com/photos/1454172/pexels-photo-1454172.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
      caption: 'Discover the perfect pair that complements your unique style...',
      tags: '#Earrings #JewelryCollection #Style',
      createdAt: '3 days ago'
    }
  ];

  const handleEditClick = (post: typeof draftPosts[0]) => {
    onEditPost(post);
  };

  const handlePreviewClick = (post: typeof draftPosts[0]) => {
    // For now, just show an alert. In a real app, this would open a preview modal
    alert(`Preview for: ${post.title}`);
  };

  const handleTabSelect = (tab: string) => {
    if (tab === 'scheduled') {
      onTabSelect?.(tab);
    } else if (tab === 'published') {
      onTabSelect?.(tab);
    } else if (tab === 'analytics') {
      onTabSelect?.(tab);
    } else if (tab === 'ring-design') {
      onBack();
    }
  };

  const handleNewChat = () => {
    onBack(); // Go back to dashboard for new chat
  };

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar with Navigation */}
      <Sidebar 
        selectedTab="drafts" 
        onTabSelect={handleTabSelect}
        userData={userData}
        onNewChat={handleNewChat}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors duration-200"
            >
              <ArrowLeft size={20} className="text-gray-400" />
            </button>
            <h1 className="text-xl font-semibold text-white">Drafts</h1>
          </div>
          
          <div className="text-gray-400 text-sm">
            {draftPosts.length} draft{draftPosts.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Drafts List */}
        <div className="flex-1 p-6">
          <div className="space-y-4">
            {draftPosts.map((post) => (
              <div key={post.id} className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:bg-gray-800/50 transition-colors duration-200">
                <div className="flex items-start space-x-4">
                  {/* Post Image */}
                  <div className="w-20 h-20 flex-shrink-0">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  
                  {/* Post Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-medium text-lg">{post.title}</h3>
                      <button className="p-1 hover:bg-gray-700 rounded transition-colors duration-200">
                        <X size={16} className="text-gray-400" />
                      </button>
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {post.caption}
                    </p>
                    
                    <div className="text-blue-400 text-xs mb-3">
                      {post.tags}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Calendar size={12} />
                        <span>Created {post.createdAt}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handlePreviewClick(post)}
                          className="flex items-center space-x-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded transition-colors duration-200"
                        >
                          <Eye size={12} />
                          <span>Preview</span>
                        </button>
                        
                        <button 
                          onClick={() => handleEditClick(post)}
                          className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors duration-200"
                        >
                          <Edit3 size={12} />
                          <span>Edit & Publish</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Empty State */}
          {draftPosts.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Edit3 size={24} className="text-gray-500" />
              </div>
              <h3 className="text-white font-medium mb-2">No drafts yet</h3>
              <p className="text-gray-400 text-sm">
                Your draft posts will appear here when you save them.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};