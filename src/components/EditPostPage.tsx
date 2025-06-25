import React, { useState } from 'react';
import { ArrowLeft, X, Instagram, Facebook, Twitter, Check, Heart, MessageCircle, Share, Bookmark, MoreHorizontal, ThumbsUp, Send, Calendar, Clock, ChevronDown } from 'lucide-react';

interface EditPostPageProps {
  onBack: () => void;
  postData: {
    id: number;
    title: string;
    image: string;
    caption: string;
    tags: string;
  };
}

export const EditPostPage: React.FC<EditPostPageProps> = ({ onBack, postData }) => {
  const [caption, setCaption] = useState(postData.caption);
  const [tags, setTags] = useState(postData.tags);
  const [showPlatformSelection, setShowPlatformSelection] = useState(false);
  const [showScheduling, setShowScheduling] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [platformSettings, setPlatformSettings] = useState({
    instagram: { caption, tags },
    facebook: { caption, tags },
    twitter: { caption, tags }
  });
  const [scheduleSettings, setScheduleSettings] = useState({
    instagram: { date: '', time: '21:00', timezone: 'UTC+8' },
    facebook: { date: '', time: '21:00', timezone: 'UTC+8' },
    twitter: { date: '', time: '21:00', timezone: 'UTC+8' }
  });

  const platforms = [
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      color: 'from-pink-500 to-purple-600',
      bgColor: 'bg-pink-500/10',
      borderColor: 'border-pink-500/30',
      optimalTimes: ['21:00', '22:00', '19:00']
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      optimalTimes: ['21:00', '22:00', '20:00']
    },
    {
      id: 'twitter',
      name: 'X (Twitter)',
      icon: Twitter,
      color: 'from-gray-700 to-black',
      bgColor: 'bg-gray-500/10',
      borderColor: 'border-gray-500/30',
      optimalTimes: ['21:00', '22:00', '18:00']
    }
  ];

  const handleDone = () => {
    setShowPlatformSelection(true);
  };

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const updatePlatformContent = (platformId: string, field: 'caption' | 'tags', value: string) => {
    setPlatformSettings(prev => ({
      ...prev,
      [platformId]: {
        ...prev[platformId as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const updateScheduleSettings = (platformId: string, field: 'date' | 'time' | 'timezone', value: string) => {
    setScheduleSettings(prev => ({
      ...prev,
      [platformId]: {
        ...prev[platformId as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleSchedule = () => {
    if (selectedPlatforms.length > 0) {
      setShowScheduling(true);
    }
  };

  const handlePublish = () => {
    console.log('Publishing to platforms:', selectedPlatforms);
    console.log('Platform settings:', platformSettings);
    console.log('Schedule settings:', scheduleSettings);
    
    // Show success message and go back to drafts
    alert('Post published successfully!');
    onBack();
  };

  const handleSaveDraft = () => {
    console.log('Saving draft with updated content:', {
      id: postData.id,
      caption,
      tags,
      platformSettings,
      selectedPlatforms
    });
    
    // Show success message and go back to drafts
    alert('Draft saved successfully!');
    onBack();
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const setOptimalTime = (platformId: string, timeIndex: number) => {
    const platform = platforms.find(p => p.id === platformId);
    if (!platform) return;
    
    let date;
    switch (timeIndex) {
      case 0:
        date = getTodayDate();
        break;
      case 1:
        date = getTomorrowDate();
        break;
      case 2:
        const dayAfter = new Date();
        dayAfter.setDate(dayAfter.getDate() + 2);
        date = dayAfter.toISOString().split('T')[0];
        break;
      default:
        date = getTodayDate();
    }
    
    updateScheduleSettings(platformId, 'date', date);
    updateScheduleSettings(platformId, 'time', platform.optimalTimes[timeIndex]);
  };

  return (
    <div className="h-screen bg-black flex flex-col">
      {/* Fixed Header */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-800 bg-black">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft size={20} className="text-gray-400" />
          </button>
          <h1 className="text-lg font-medium text-white">
            {showScheduling ? 'Schedule your post' : showPlatformSelection ? 'Choose Platforms' : `Edit: ${postData.title}`}
          </h1>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex min-h-0">
        {/* Sidebar */}
        <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col flex-shrink-0">
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
            
            <div className="bg-gray-800/50 rounded-lg p-3">
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
          </div>

          {/* Navigation */}
          <div className="flex-1 p-4">
            <nav className="space-y-1">
              <div className="text-gray-400 text-sm font-medium mb-2">AI Social Media Post History</div>
              <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-gray-300 hover:bg-gray-800/50">
                <span>Ring Design</span>
              </button>
              
              <div className="text-gray-400 text-sm font-medium mb-2 mt-6">Social Media Posts</div>
              <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium bg-blue-600/20 text-blue-400 border border-blue-600/30">
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

        {/* Content Area */}
        {showScheduling ? (
          /* Scheduling Mode */
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-6 space-y-6">
              {/* Post Summary */}
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-white font-medium mb-4">Schedule your post</h3>
                <div className="flex space-x-4">
                  <img
                    src={postData.image}
                    alt="Post preview"
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-gray-300 text-sm mb-2">
                      <span className="font-medium">Platforms:</span> {selectedPlatforms.map(id => platforms.find(p => p.id === id)?.name).join(', ')}
                    </div>
                    <div className="text-gray-300 text-sm line-clamp-2">
                      {caption}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Schedule Options */}
              <div className="bg-gray-900 rounded-lg p-6">
                <h4 className="text-white font-medium mb-4">Quick schedule options</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <button
                    onClick={handlePublish}
                    className="p-4 bg-green-600 hover:bg-green-700 rounded-lg text-white text-center transition-colors duration-200"
                  >
                    <div className="font-medium">Publish Now</div>
                    <div className="text-sm opacity-80">Go live immediately</div>
                  </button>
                  
                  <button
                    onClick={() => {
                      selectedPlatforms.forEach(platformId => {
                        updateScheduleSettings(platformId, 'date', getTodayDate());
                        updateScheduleSettings(platformId, 'time', '21:00');
                      });
                    }}
                    className="p-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-center transition-colors duration-200"
                  >
                    <div className="font-medium">Today at 9 PM</div>
                    <div className="text-sm opacity-80">Optimal time</div>
                  </button>
                  
                  <button
                    onClick={() => {
                      selectedPlatforms.forEach(platformId => {
                        updateScheduleSettings(platformId, 'date', getTomorrowDate());
                        updateScheduleSettings(platformId, 'time', '22:00');
                      });
                    }}
                    className="p-4 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-center transition-colors duration-200"
                  >
                    <div className="font-medium">Tomorrow at 10 PM</div>
                    <div className="text-sm opacity-80">Peak engagement</div>
                  </button>
                </div>
              </div>

              {/* Custom Scheduling per Platform */}
              <div className="bg-gray-900 rounded-lg p-6">
                <h4 className="text-white font-medium mb-4">Custom schedule for each platform</h4>
                
                <div className="space-y-6">
                  {selectedPlatforms.map((platformId) => {
                    const platform = platforms.find(p => p.id === platformId);
                    if (!platform) return null;
                    
                    const Icon = platform.icon;
                    const schedule = scheduleSettings[platformId as keyof typeof scheduleSettings];
                    
                    return (
                      <div key={platformId} className="bg-gray-800 rounded-lg p-4">
                        {/* Platform Header */}
                        <div className="flex items-center space-x-3 mb-4">
                          <div className={`p-2 rounded-lg ${platform.bgColor} ${platform.borderColor} border`}>
                            <Icon size={18} className="text-white" />
                          </div>
                          <span className="text-white font-medium">{platform.name}</span>
                        </div>

                        {/* Date & Time Controls */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">
                              📅 Date
                            </label>
                            <input
                              type="date"
                              value={schedule.date}
                              onChange={(e) => updateScheduleSettings(platformId, 'date', e.target.value)}
                              min={getTodayDate()}
                              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">
                              🕐 Time
                            </label>
                            <input
                              type="time"
                              value={schedule.time}
                              onChange={(e) => updateScheduleSettings(platformId, 'time', e.target.value)}
                              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        {/* Recommended Times */}
                        <div>
                          <div className="text-gray-400 text-sm font-medium mb-3">
                            Recommended times for {platform.name}
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { label: 'Today 9PM', time: '21:00', index: 0 },
                              { label: 'Tomorrow 10PM', time: '22:00', index: 1 },
                              { label: 'Day After 7PM', time: '19:00', index: 2 }
                            ].map((option) => (
                              <button
                                key={option.index}
                                onClick={() => setOptimalTime(platformId, option.index)}
                                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-center transition-colors duration-200"
                              >
                                <div className="text-gray-300 text-xs font-medium">{option.label}</div>
                                <div className="text-gray-400 text-xs">{option.time}</div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pb-6">
                <button
                  onClick={() => setShowScheduling(false)}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                >
                  Back
                </button>
                <button
                  onClick={handlePublish}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-200"
                >
                  Schedule Post
                </button>
              </div>
            </div>
          </div>
        ) : !showPlatformSelection ? (
          /* Edit Mode */
          <div className="flex-1 flex min-h-0">
            {/* Left - Post Preview */}
            <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
              <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md">
                {/* Post Image */}
                <div className="mb-4">
                  <img
                    src={postData.image}
                    alt="Post preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>

                {/* Post Info */}
                <div className="space-y-3">
                  <div>
                    <div className="text-gray-400 text-xs font-medium mb-1">Title:</div>
                    <div className="text-gray-200 text-sm font-medium">{postData.title}</div>
                  </div>
                  
                  <div>
                    <div className="text-gray-400 text-xs font-medium mb-1">Caption:</div>
                    <div className="text-gray-200 text-sm">
                      {caption || 'No caption'}
                    </div>
                  </div>

                  {tags && (
                    <div>
                      <div className="text-gray-400 text-xs font-medium mb-1">Tags:</div>
                      <div className="text-blue-400 text-sm">
                        {tags}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right - Edit Panel */}
            <div className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col">
              {/* Edit Header */}
              <div className="p-4 border-b border-gray-800 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <h2 className="text-white font-medium">Edit Post Content</h2>
                  <button
                    onClick={onBack}
                    className="p-1 hover:bg-gray-700 rounded transition-colors duration-200"
                  >
                    <X size={16} className="text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Edit Form */}
              <div className="flex-1 p-4 space-y-6 overflow-y-auto">
                {/* Caption Section */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Caption
                  </label>
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Enter your caption..."
                    className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                  />
                </div>

                {/* Tags Section */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Tags
                  </label>
                  <textarea
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="#hashtag1 #hashtag2 #hashtag3"
                    className="w-full h-20 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-blue-400 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 border-t border-gray-800 space-y-3 flex-shrink-0">
                <button
                  onClick={handleDone}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium rounded-lg transition-all duration-200"
                >
                  Choose Platforms
                </button>
                <button
                  onClick={handleSaveDraft}
                  className="w-full px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                >
                  Save Draft
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Platform Selection Mode */
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-5xl mx-auto p-6 space-y-6">
              {/* Platform Selection */}
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-white font-medium mb-4">Choose platforms to publish on:</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {platforms.map((platform) => {
                    const Icon = platform.icon;
                    const isSelected = selectedPlatforms.includes(platform.id);
                    
                    return (
                      <button
                        key={platform.id}
                        onClick={() => togglePlatform(platform.id)}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                          isSelected
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <div className={`p-2 rounded-lg ${platform.bgColor} ${platform.borderColor} border`}>
                            <Icon size={20} className="text-white" />
                          </div>
                          <span className="text-white font-medium">{platform.name}</span>
                          {isSelected && (
                            <div className="ml-auto">
                              <Check size={16} className="text-blue-400" />
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-gray-400 text-left">
                          {isSelected ? 'Selected for publishing' : 'Click to select'}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Content Customization for Selected Platforms */}
                {selectedPlatforms.length > 0 && (
                  <div className="border-t border-gray-700 pt-6">
                    <h4 className="text-white font-medium mb-4">Customize content for each platform:</h4>
                    
                    <div className="space-y-4 max-h-80 overflow-y-auto">
                      {selectedPlatforms.map((platformId) => {
                        const platform = platforms.find(p => p.id === platformId);
                        if (!platform) return null;
                        
                        const settings = platformSettings[platformId as keyof typeof platformSettings];
                        
                        return (
                          <div key={platformId} className="bg-gray-800 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-3">
                              <platform.icon size={16} className="text-white" />
                              <span className="text-white font-medium">{platform.name}</span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-gray-300 text-xs font-medium mb-2">Caption</label>
                                <textarea
                                  value={settings.caption}
                                  onChange={(e) => updatePlatformContent(platformId, 'caption', e.target.value)}
                                  className="w-full h-20 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-gray-300 text-xs font-medium mb-2">Tags</label>
                                <textarea
                                  value={settings.tags}
                                  onChange={(e) => updatePlatformContent(platformId, 'tags', e.target.value)}
                                  className="w-full h-20 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-blue-400 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pb-6">
                <button 
                  onClick={() => setShowPlatformSelection(false)}
                  className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                >
                  Back to Edit
                </button>
                {selectedPlatforms.length > 0 && (
                  <button 
                    onClick={handleSchedule}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-200"
                  >
                    Continue to Schedule
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};