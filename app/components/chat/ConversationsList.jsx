'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MessageCircle, Plus } from 'lucide-react';
import { chatAPI } from '@/lib/socket';
import { format, formatDistanceToNow } from 'date-fns';

export default function ConversationsList({ currentUser, onSelectConversation, selectedId }) {
  const [conversations, setConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showNewChat, setShowNewChat] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await chatAPI.getConversations();
      if (response.success) {
        setConversations(response.data.conversations);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = conversations.filter(conv => 
    conv.otherUser?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return format(date, 'HH:mm');
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return format(date, 'dd/MM/yy');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-400">Loading chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0B0C10]">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Messages</h2>
          <button 
            onClick={() => setShowNewChat(true)}
            className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 transition"
          >
            <Plus size={18} />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <MessageCircle size={48} className="text-gray-600 mb-4" />
            <p className="text-gray-400 text-sm">
              {searchQuery ? 'No conversations found' : 'No messages yet'}
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Start a conversation with a {currentUser.user_type === 'client' ? 'freelancer' : 'client'}
            </p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredConversations.map((conv) => {
              const isSelected = conv.id === selectedId;
              const hasUnread = conv.unreadCount > 0;

              return (
                <motion.button
                  key={conv.id}
                  onClick={() => onSelectConversation(conv)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`w-full p-3 rounded-lg text-left transition ${
                    isSelected
                      ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex gap-3">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      {conv.otherUser?.avatar_url ? (
                        <img
                          src={conv.otherUser.avatar_url}
                          alt={conv.otherUser.full_name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-lg font-bold">
                          {conv.otherUser?.full_name?.charAt(0) || '?'}
                        </div>
                      )}
                      {hasUnread && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center text-xs font-bold">
                          {conv.unreadCount}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2 mb-1">
                        <h3 className={`text-sm font-semibold truncate ${hasUnread ? 'text-white' : 'text-gray-300'}`}>
                          {conv.otherUser?.full_name || 'Unknown User'}
                        </h3>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          {conv.lastMessage && formatTime(conv.lastMessage.createdAt)}
                        </span>
                      </div>

                      {conv.lastMessage ? (
                        <p className={`text-sm truncate ${hasUnread ? 'text-gray-300 font-medium' : 'text-gray-500'}`}>
                          {conv.lastMessage.senderId === currentUser.id && 'You: '}
                          {conv.lastMessage.content}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500 italic">No messages yet</p>
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
