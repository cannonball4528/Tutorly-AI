import React from 'react';
import { ArrowLeft, X, Calendar, Clock, Instagram, Facebook, Twitter } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { OnboardingData } from './OnboardingPage';

interface ScheduledPageProps {
  onBack: () => void;
  userData?: OnboardingData | null;
  onTabSelect?: (tab: string) => void;
}

export const ScheduledPage: React.FC<ScheduledPageProps> = ({ onBack, userData, onTabSelect }) => {
  const scheduledPosts = [
    {
      id: 1,
      title: 'Earring Collection Post',
      image: 'https://images.pexels.com/photos/1454172/pexels-photo-1454172.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
      platforms: [
        {
          name: 'Instagram',
          icon: Instagram,
          color: 'text-pink-400',
          bgColor: 'bg-pink-500/10',
          scheduledDate: '11/10/2025',
          scheduledTime: '14:30'
        },
        {
          name: 'Facebook',
          icon: Facebook,
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/10',
          scheduledDate: '11/10/2025',
          scheduledTime: '14:30'
        }
      ]
    },
    {
      id: 2,
      title: 'Ring Design Post',
      image: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
      platforms: [
        {
          name: 'Instagram',
          icon: Instagram,
          color: 'text-pink-400',
          bgColor: 'bg-pink-500/10',
          scheduledDate: '11/10/2025',
          scheduledTime: '14:30'
        },
        {
          name: 'X (Twitter)',
          icon: Twitter,
          color: 'text-gray-400',
          bgColor: 'bg-gray-500/10',
          scheduledDate: '11/10/2025',
          scheduledTime: '14:30'
        }
      ]
    }
  ];

  const handleCancelSchedule = (postId: number, platformName: string) => {
    console.log(`Cancelling schedule for post ${postId} on ${platformName}`);
    // In a real app, this would remove the scheduled post
  };

  const handleTabSelect = (tab: string) => {
    if (tab === 'drafts') {
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
        selectedTab="scheduled" 
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
            <h1 className="text-xl font-semibold text-white">Scheduled</h1>
          </div>
          
          <div className="text-gray-400 text-sm">
            {scheduledPosts.length} scheduled post{scheduledPosts.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Scheduled Posts List */}
        <div className="flex-1 p-6">
          <div className="space-y-6">
            {scheduledPosts.map((post) => (
              <div key={post.id} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                {/* Post Header */}
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-16 h-16 flex-shrink-0">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-white font-medium text-lg mb-2">{post.title}</h3>
                  </div>
                </div>

                {/* Platform Schedules */}
                <div className="space-y-3">
                  {post.platforms.map((platform, index) => {
                    const Icon = platform.icon;
                    
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${platform.bgColor}`}>
                            <Icon size={16} className={platform.color} />
                          </div>
                          <span className="text-white font-medium text-sm">{platform.name}</span>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-gray-300 text-sm">
                            Scheduled on {platform.scheduledDate} {platform.scheduledTime}
                          </div>
                          
                          <button
                            onClick={() => handleCancelSchedule(post.id, platform.name)}
                            className="p-1 hover:bg-gray-700 rounded transition-colors duration-200"
                          >
                            <X size={16} className="text-gray-400 hover:text-red-400" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          
          {/* Empty State */}
          {scheduledPosts.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Calendar size={24} className="text-gray-500" />
              </div>
              <h3 className="text-white font-medium mb-2">No scheduled posts</h3>
              <p className="text-gray-400 text-sm">
                Posts you schedule will appear here before they go live.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};