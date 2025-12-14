'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minimize2, Maximize2 } from 'lucide-react';
import ConversationsList from '@/app/components/chat/ConversationsList';
import ChatInterface from '@/app/components/chat/ChatInterface';
import UserSearch from '@/app/components/chat/UserSearch';

export default function ChatModal({ isOpen, onClose, currentUser }) {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleNewConversation = (conversation) => {
    setSelectedConversation(conversation);
    setShowUserSearch(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ 
            scale: isMinimized ? 0.3 : 1, 
            y: isMinimized ? 300 : 0 
          }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className={`bg-[#0B0C10] border border-purple-500/30 rounded-2xl overflow-hidden shadow-2xl transition-all ${
            isMinimized ? 'w-80 h-20' : 'w-full max-w-6xl h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-purple-500/20 bg-[#0B0C10]">
            <h2 className="text-lg font-bold text-white">
              {isMinimized ? 'Chat' : 'FlowDeck Messages'}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-2 hover:bg-white/5 rounded-lg transition"
              >
                {isMinimized ? (
                  <Maximize2 size={18} className="text-gray-400" />
                ) : (
                  <Minimize2 size={18} className="text-gray-400" />
                )}
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-lg transition"
              >
                <X size={18} className="text-gray-400" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <div className="flex h-[calc(100%-60px)]">
              {/* Left Sidebar - Conversations */}
              <div className="w-80 border-r border-purple-500/20">
                <ConversationsList
                  currentUser={currentUser}
                  onSelectConversation={handleSelectConversation}
                  selectedId={selectedConversation?.id}
                />
              </div>

              {/* Main Chat Area */}
              <div className="flex-1">
                {selectedConversation ? (
                  <ChatInterface
                    conversationId={selectedConversation.id}
                    currentUser={currentUser}
                    otherUser={selectedConversation.otherUser}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center px-6">
                    <div className="text-6xl mb-4">💬</div>
                    <h3 className="text-xl font-bold mb-2">Select a chat or start a new one</h3>
                    <p className="text-gray-400 mb-6">
                      Choose a conversation from the left or click below to start chatting
                    </p>
                    <button
                      onClick={() => setShowUserSearch(true)}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 transition font-medium"
                    >
                      New Message
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>

        {/* User Search Modal */}
        <AnimatePresence>
          {showUserSearch && (
            <UserSearch
              currentUser={currentUser}
              onSelectUser={handleNewConversation}
              onClose={() => setShowUserSearch(false)}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
