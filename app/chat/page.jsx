'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Loader } from 'lucide-react';
import ConversationsList from '@/app/components/chat/ConversationsList';
import ChatInterface from '@/app/components/chat/ChatInterface';
import UserSearch from '@/app/components/chat/UserSearch';
import { connectSocket, disconnectSocket } from '@/lib/socket';
import { userAPI, isAuthenticated } from '@/lib/api';

export default function ChatPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    // Check authentication first
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    
    initializeChat();

    return () => {
      disconnectSocket();
    };
  }, []);

  const initializeChat = async () => {
    try {
      // Get current user
      const userResponse = await userAPI.getMe();
      if (userResponse.success) {
        setCurrentUser(userResponse.data);

        // Connect socket
        const socket = connectSocket();
        if (socket) {
          socket.on('connect', () => {
            console.log('✅ Socket connected');
            setSocketConnected(true);
          });

          socket.on('disconnect', () => {
            console.log('❌ Socket disconnected');
            setSocketConnected(false);
          });
        }
      }
    } catch (error) {
      console.error('Error initializing chat:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleNewConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0B0C10]">
        <div className="text-center">
          <Loader size={48} className="animate-spin text-purple-500 mx-auto" />
          <p className="mt-4 text-gray-400">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0B0C10]">
        <div className="text-center">
          <MessageCircle size={64} className="text-gray-600 mx-auto mb-4" />
          <p className="text-xl text-gray-400">Unable to load user data</p>
          <p className="text-sm text-gray-500 mt-2">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0B0C10] text-white overflow-hidden">
      {/* Left Sidebar - Conversations List */}
      <div className="w-80 border-r border-purple-500/20 flex-shrink-0">
        <ConversationsList
          currentUser={currentUser}
          onSelectConversation={handleSelectConversation}
          selectedId={selectedConversation?.id}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 relative">
        {selectedConversation ? (
          <ChatInterface
            conversationId={selectedConversation.id}
            currentUser={currentUser}
            otherUser={selectedConversation.otherUser}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-6">
                <MessageCircle size={64} className="text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Welcome to FlowDeck Chat</h2>
              <p className="text-gray-400 mb-6 max-w-md">
                Select a conversation from the left or start a new chat with a{' '}
                {currentUser.user_type === 'client' ? 'freelancer' : 'client'}
              </p>
              <button
                onClick={() => setShowUserSearch(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 transition font-medium"
              >
                Start New Conversation
              </button>

              {/* Connection Status */}
              <div className="mt-8 flex items-center justify-center gap-2">
                <div className={`w-2 h-2 rounded-full ${socketConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-xs text-gray-500">
                  {socketConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </div>

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
    </div>
  );
}
