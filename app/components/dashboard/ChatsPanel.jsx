'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ChevronRight, ChevronLeft } from 'lucide-react';

export default function ChatsPanel({ isOpen, onToggle }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Reset collapsed state when panel reopens
  useEffect(() => {
    if (isOpen) {
      setIsCollapsed(false);
    }
  }, [isOpen]);

  const handleToggle = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  const chats = [
    {
      id: 1,
      name: 'Sarah',
      avatar: '👩',
      lastMessage: 'Great! I finished the design',
      time: '2m',
      unread: true,
      online: true
    },
    {
      id: 2,
      name: 'Michael',
      avatar: '👨',
      lastMessage: 'Let me check the requirements',
      time: '15m',
      unread: false,
      online: true
    },
    {
      id: 3,
      name: 'Emma',
      avatar: '👩‍💼',
      lastMessage: 'Thanks for the update',
      time: '1h',
      unread: false,
      online: false
    }
  ];

  if (!isOpen) {
    return (
      <motion.button
        initial={{ x: 100 }}
        animate={{ x: 0 }}
        whileHover={{ scale: 1.1, backgroundColor: 'rgba(99, 102, 241, 0.2)' }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onToggle && onToggle(false)}
        className="fixed right-4 top-24 z-50 p-3 bg-indigo-600/80 backdrop-blur-md rounded-full shadow-lg border border-white/10 hover:shadow-indigo-500/50 transition-all"
        title="Open chats"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ x: 400 }}
      animate={{ 
        x: 0,
        width: isCollapsed ? '80px' : '384px'
      }}
      transition={{
        x: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
        width: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
      }}
      className="fixed right-0 top-0 h-screen bg-[#0a0a1f] border-l border-white/5 p-6 overflow-y-auto overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <motion.button
          onClick={handleToggle}
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-lg transition-colors"
          title={isCollapsed ? 'Expand chats' : 'Collapse chats'}
        >
          {isCollapsed ? (
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-400" />
          )}
        </motion.button>

        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <>
              <motion.h2
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="text-xl font-bold"
              >
                Chats
              </motion.h2>
              <motion.button
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center"
              >
                <Plus className="w-4 h-4" />
              </motion.button>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Chat List */}
      <div className="space-y-2">
        {chats.map((chat, index) => (
          <motion.div
            key={chat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition relative group ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-lg">
                {chat.avatar}
              </div>
              {chat.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0a0a1f]"></div>
              )}
            </div>

            {/* Chat Info */}
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <>
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 min-w-0"
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <h3 className="font-medium text-sm text-white">{chat.name}</h3>
                      <span className="text-xs text-gray-500">{chat.time}</span>
                    </div>
                    <p className="text-xs text-gray-400 truncate">{chat.lastMessage}</p>
                  </motion.div>

                  {/* Unread Badge */}
                  {chat.unread && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="w-2 h-2 bg-indigo-500 rounded-full shrink-0"
                    />
                  )}
                </>
              )}
            </AnimatePresence>

            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileHover={{ opacity: 1, scale: 1 }}
                className="absolute right-full mr-4 px-3 py-2 bg-[#1a1a35] rounded-lg border border-white/10 text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50 shadow-xl"
              >
                <div className="font-medium">{chat.name}</div>
                <div className="text-xs text-gray-400">{chat.lastMessage}</div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
