import React from 'react';
import { ArrowLeft, Instagram, Facebook, Twitter, Eye, Heart, MessageCircle, Share, BarChart3, ExternalLink } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { OnboardingData } from './OnboardingPage';

interface PublishedPageProps {
  onBack: () => void;
  userData?: OnboardingData | null;
  onTabSelect?: (tab: string) => void;
}

export const PublishedPage: React.FC<PublishedPageProps> = ({ onBack, userData, onTabSelect }) => {
  const publishedPosts = [
    {
      id: 1,
      title: 'Ring Design Post',
      image: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
      publishedDate: '2 hours ago',
      platforms: [
        {
          name: 'Instagram',
          icon: Instagram,
          color: 'text-pink-400',
          bgColor: 'bg-pink-500/10',
          borderColor: 'border-pink-500/30',
          publishedAt: '2 hours ago',
          metrics: {
            views: 1234,
            likes: 89,
            comments: 12,
            shares: 5
          },
          url: 'https://instagram.com/p/example'
        },
        {
          name: 'Facebook',
          icon: Facebook,
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/30',
          publishedAt: '2 hours ago',
          metrics: {
            views: 856,
            likes: 42,
            comments: 8,
            shares: 15
          },
          url: 'https://facebook.com/post/example'
        }
      ]
    },
    {
      id: 2,
      title: 'Necklace Collection Post',
      image: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
      publishedDate: '1 day ago',
      platforms: [
        {
          name: 'Instagram',
          icon: Instagram,
          color: 'text-pink-400',
          bgColor: 'bg-pink-500/10',
          borderColor: 'border-pink-500/30',
          publishedAt: '1 day ago',
          metrics: {
            views: 2156,
            likes: 156,
            comments: 23,
            shares: 8
          },
          url: 'https://instagram.com/p/example2'
        },
        {
          name: 'X (Twitter)',
          icon: Twitter,
          color: 'text-gray-400',
          bgColor: 'bg-gray-500/10',
          borderColor: 'border-gray-500/30',
          publishedAt: '1 day ago',
          metrics: {
            views: 1432,
            likes: 67,
            comments: 15,
            shares: 22
          },
          url: 'https://twitter.com/post/example'
        }
      ]
    },
    {
      id: 3,
      title: 'Earring Design Showcase',
      image: 'https://images.pexels.com/photos/1454172/pexels-photo-1454172.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
      publishedDate: '3 days ago',
      platforms: [
        {
          name: 'Instagram',
          icon: Instagram,
          color: 'text-pink-400',
          bgColor: 'bg-pink-500/10',
          borderColor: 'border-pink-500/30',
          publishedAt: '3 days ago',
          metrics: {
            views: 3421,
            likes: 234,
            comments: 45,
            shares: 12
          },
          url: 'https://instagram.com/p/example3'
        },
        {
          name: 'Facebook',
          icon: Facebook,
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/30',
          publishedAt: '3 days ago',
          metrics: {
            views: 2876,
            likes: 178,
            comments: 32,
            shares: 28
          },
          url: 'https://facebook.com/post/example3'
        },
        {
          name: 'X (Twitter)',
          icon: Twitter,
          color: 'text-gray-400',
          bgColor: 'bg-gray-500/10',
          borderColor: 'border-gray-500/30',
          publishedAt: '3 days ago',
          metrics: {
            views: 1987,
            likes: 89,
            comments: 18,
            shares: 34
          },
          url: 'https://twitter.com/post/example3'
        }
      ]
    }
  ];

  const handleViewPost = (url: string) => {
    window.open(url, '_blank');
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const getTotalMetrics = (platforms: any[]) => {
    return platforms.reduce((total, platform) => ({
      views: total.views + platform.metrics.views,
      likes: total.likes + platform.metrics.likes,
      comments: total.comments + platform.metrics.comments,
      shares: total.shares + platform.metrics.shares
    }), { views: 0, likes: 0, comments: 0, shares: 0 });
  };

  const handleTabSelect = (tab: string) => {
    if (tab === 'drafts') {
      onTabSelect?.(tab);
    } else if (tab === 'scheduled') {
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
        selectedTab="published" 
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
            <h1 className="text-xl font-semibold text-white">Published</h1>
          </div>
          
          <div className="text-gray-400 text-sm">
            {publishedPosts.length} published post{publishedPosts.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Published Posts List */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            {publishedPosts.map((post) => {
              const totalMetrics = getTotalMetrics(post.platforms);
              
              return (
                <div key={post.id} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                  {/* Post Header */}
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="w-20 h-20 flex-shrink-0">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-medium text-lg">{post.title}</h3>
                        <span className="text-gray-400 text-sm">Published {post.publishedDate}</span>
                      </div>
                      
                      {/* Overall Metrics Summary */}
                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <Eye size={14} className="text-blue-400" />
                            <span className="text-blue-400 text-xs font-medium">Views</span>
                          </div>
                          <div className="text-white font-semibold">{formatNumber(totalMetrics.views)}</div>
                        </div>
                        
                        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <Heart size={14} className="text-red-400" />
                            <span className="text-red-400 text-xs font-medium">Likes</span>
                          </div>
                          <div className="text-white font-semibold">{formatNumber(totalMetrics.likes)}</div>
                        </div>
                        
                        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <MessageCircle size={14} className="text-green-400" />
                            <span className="text-green-400 text-xs font-medium">Comments</span>
                          </div>
                          <div className="text-white font-semibold">{formatNumber(totalMetrics.comments)}</div>
                        </div>
                        
                        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <Share size={14} className="text-purple-400" />
                            <span className="text-purple-400 text-xs font-medium">Shares</span>
                          </div>
                          <div className="text-white font-semibold">{formatNumber(totalMetrics.shares)}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Platform-specific Performance */}
                  <div className="space-y-3">
                    <h4 className="text-gray-300 font-medium text-sm mb-3">Platform Performance:</h4>
                    
                    {post.platforms.map((platform, index) => {
                      const Icon = platform.icon;
                      
                      return (
                        <div key={index} className={`p-4 rounded-lg border ${platform.borderColor} ${platform.bgColor}`}>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg ${platform.bgColor}`}>
                                <Icon size={18} className={platform.color} />
                              </div>
                              <div>
                                <span className="text-white font-medium">{platform.name}</span>
                                <div className="text-gray-400 text-xs">Published {platform.publishedAt}</div>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => handleViewPost(platform.url)}
                              className="flex items-center space-x-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded transition-colors duration-200"
                            >
                              <ExternalLink size={12} />
                              <span>View Post</span>
                            </button>
                          </div>
                          
                          {/* Platform Metrics */}
                          <div className="grid grid-cols-4 gap-3">
                            <div className="text-center">
                              <div className="flex items-center justify-center space-x-1 mb-1">
                                <Eye size={12} className="text-blue-400" />
                                <span className="text-blue-400 text-xs">Views</span>
                              </div>
                              <div className="text-white text-sm font-medium">{formatNumber(platform.metrics.views)}</div>
                            </div>
                            
                            <div className="text-center">
                              <div className="flex items-center justify-center space-x-1 mb-1">
                                <Heart size={12} className="text-red-400" />
                                <span className="text-red-400 text-xs">Likes</span>
                              </div>
                              <div className="text-white text-sm font-medium">{formatNumber(platform.metrics.likes)}</div>
                            </div>
                            
                            <div className="text-center">
                              <div className="flex items-center justify-center space-x-1 mb-1">
                                <MessageCircle size={12} className="text-green-400" />
                                <span className="text-green-400 text-xs">Comments</span>
                              </div>
                              <div className="text-white text-sm font-medium">{formatNumber(platform.metrics.comments)}</div>
                            </div>
                            
                            <div className="text-center">
                              <div className="flex items-center justify-center space-x-1 mb-1">
                                <Share size={12} className="text-purple-400" />
                                <span className="text-purple-400 text-xs">Shares</span>
                              </div>
                              <div className="text-white text-sm font-medium">{formatNumber(platform.metrics.shares)}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Empty State */}
          {publishedPosts.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <BarChart3 size={24} className="text-gray-500" />
              </div>
              <h3 className="text-white font-medium mb-2">No published posts yet</h3>
              <p className="text-gray-400 text-sm">
                Your published posts and their performance metrics will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};