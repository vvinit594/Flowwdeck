'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, MessageCircle, Loader } from 'lucide-react';
import { chatAPI } from '@/lib/socket';

export default function UserSearch({ currentUser, onSelectUser, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    const delaySearch = setTimeout(() => {
      performSearch();
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  const performSearch = async () => {
    try {
      setLoading(true);
      setHasSearched(true);
      const response = await chatAPI.searchUsers(searchQuery);
      if (response.success) {
        setSearchResults(response.data.users);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = async (user) => {
    try {
      // Create or get conversation
      const response = await chatAPI.createConversation(user.id);
      if (response.success) {
        // Pass conversation with otherUser data
        const conversationData = {
          ...response.data.conversation,
          otherUser: response.data.otherUser || user
        };
        onSelectUser(conversationData);
        onClose();
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const targetUserType = currentUser.user_type === 'client' ? 'freelancer' : 'client';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center pt-20"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: -20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: -20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-[#0B0C10] border border-purple-500/30 rounded-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">New Message</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-lg transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search for a ${targetUserType}...`}
              autoFocus
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition"
            />
          </div>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader size={24} className="animate-spin text-purple-500" />
            </div>
          ) : searchResults.length > 0 ? (
            <div className="p-2">
              {searchResults.map((user) => (
                <motion.button
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full p-4 hover:bg-white/5 rounded-lg transition text-left"
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.full_name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-lg font-bold">
                        {user.full_name?.charAt(0) || '?'}
                      </div>
                    )}

                    {/* User Info */}
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-white">{user.full_name}</h3>
                      <p className="text-xs text-gray-400">
                        {user.user_type === 'client' ? '👔 Client' : '💼 Freelancer'}
                        {user.company_name && ` • ${user.company_name}`}
                        {user.job_title && ` • ${user.job_title}`}
                      </p>
                    </div>

                    {/* Message Icon */}
                    <MessageCircle size={18} className="text-purple-400" />
                  </div>
                </motion.button>
              ))}
            </div>
          ) : hasSearched ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-6">
              <Search size={48} className="text-gray-600 mb-4" />
              <p className="text-gray-400 text-sm">No {targetUserType}s found</p>
              <p className="text-gray-500 text-xs mt-2">
                Try searching with a different name or email
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center px-6">
              <MessageCircle size={48} className="text-gray-600 mb-4" />
              <p className="text-gray-400 text-sm">
                Search for a {targetUserType} to start chatting
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Enter at least 2 characters to search
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
