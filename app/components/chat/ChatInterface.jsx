'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Paperclip,
  Smile,
  Search,
  MoreVertical,
  CheckCheck,
  Check,
  Sparkles,
  Plus,
  Package,
  DollarSign,
  MessageSquare,
  X
} from 'lucide-react';
import { getSocket, chatAPI } from '@/lib/socket';
import { format } from 'date-fns';

export default function ChatInterface({ conversationId, currentUser, otherUser }) {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showContextPanel, setShowContextPanel] = useState(true);
  const messagesEndRef = useRef(null);
  const socket = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Initialize socket and load messages
  useEffect(() => {
    if (!conversationId) return;

    // Connect socket
    socket.current = getSocket();
    
    if (!socket.current) {
      console.error('Failed to connect socket');
      return;
    }

    // Join conversation
    socket.current.emit('join_conversation', conversationId);

    // Load messages
    loadMessages();

    // Listen for new messages
    socket.current.on('new_message', handleNewMessage);
    socket.current.on('user_typing', handleUserTyping);
    socket.current.on('user_stop_typing', handleStopTyping);
    socket.current.on('message_read', handleMessageRead);

    return () => {
      if (socket.current) {
        socket.current.off('new_message', handleNewMessage);
        socket.current.off('user_typing', handleUserTyping);
        socket.current.off('user_stop_typing', handleStopTyping);
        socket.current.off('message_read', handleMessageRead);
      }
    };
  }, [conversationId]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const response = await chatAPI.getMessages(conversationId);
      if (response.success) {
        setMessages(response.data.messages);
        scrollToBottom();
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewMessage = (message) => {
    setMessages(prev => [...prev, message]);
    scrollToBottom();
    
    // Mark as read if not sent by current user
    if (message.senderId !== currentUser.id) {
      socket.current?.emit('mark_read', { messageId: message.id });
    }
  };

  const handleUserTyping = ({ userId }) => {
    if (userId !== currentUser.id) {
      setIsTyping(true);
    }
  };

  const handleStopTyping = () => {
    setIsTyping(false);
  };

  const handleMessageRead = ({ messageId }) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, read_at: new Date() } : msg
    ));
  };

  const sendMessage = () => {
    if (!messageInput.trim() || !socket.current) return;

    const messageData = {
      conversationId,
      content: messageInput.trim(),
      messageType: 'text'
    };

    socket.current.emit('send_message', messageData);
    setMessageInput('');
    
    // Stop typing indicator
    socket.current.emit('stop_typing', { conversationId });
  };

  const handleInputChange = (e) => {
    setMessageInput(e.target.value);

    // Typing indicator
    if (socket.current) {
      socket.current.emit('typing', { conversationId });
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Stop typing after 2 seconds of no typing
      typingTimeoutRef.current = setTimeout(() => {
        socket.current.emit('stop_typing', { conversationId });
      }, 2000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const isMyMessage = (msg) => {
    const messageSenderId = msg.senderId || msg.sender_id;
    const currentUserId = currentUser?.id;
    
    if (!currentUserId || !messageSenderId) {
      return false;
    }
    
    // Convert both to strings for comparison to handle number vs string mismatch
    return String(messageSenderId) === String(currentUserId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-[#0B0C10]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!otherUser) {
    return (
      <div className="flex items-center justify-center h-full bg-[#0B0C10]">
        <div className="text-center">
          <p className="text-gray-400">Unable to load conversation</p>
          <p className="text-sm text-gray-500 mt-2">Please try again</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-[#0B0C10] text-white">
      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col transition-all ${showContextPanel ? 'mr-80' : ''}`}>
        {/* Top Header */}
        <div className="sticky top-0 z-10 bg-[#0B0C10]/80 backdrop-blur-xl border-b border-purple-500/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* User Avatar */}
              <div className="relative">
                {otherUser.avatar_url ? (
                  <img 
                    src={otherUser.avatar_url} 
                    alt={otherUser.full_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-lg font-bold">
                    {otherUser.full_name?.charAt(0) || '?'}
                  </div>
                )}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0B0C10]"></div>
              </div>

              {/* User Info */}
              <div>
                <h2 className="text-lg font-semibold">{otherUser.full_name}</h2>
                <p className="text-sm text-gray-400">
                  {otherUser.user_type === 'client' ? '👔 Client' : '💼 Freelancer'} • Online
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-white/5 rounded-lg transition">
                <Search size={20} className="text-gray-400" />
              </button>
              <button className="p-2 hover:bg-white/5 rounded-lg transition">
                <Paperclip size={20} className="text-gray-400" />
              </button>
              <button 
                onClick={() => setShowContextPanel(!showContextPanel)}
                className="p-2 hover:bg-white/5 rounded-lg transition"
              >
                <MoreVertical size={20} className="text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.map((msg, index) => {
            const isMine = isMyMessage(msg);
            const prevMsgSenderId = messages[index - 1]?.senderId || messages[index - 1]?.sender_id;
            const currentMsgSenderId = msg.senderId || msg.sender_id;
            const showAvatar = !isMine && (index === 0 || prevMsgSenderId !== currentMsgSenderId);

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-[70%] ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  {showAvatar && !isMine && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-xs flex-shrink-0">
                      {msg.senderName?.charAt(0) || '?'}
                    </div>
                  )}
                  {!showAvatar && !isMine && <div className="w-8" />}

                  {/* Message Bubble */}
                  <div
                    className={`rounded-2xl px-4 py-2 ${
                      isMine
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                        : 'bg-white/5 backdrop-blur-xl border border-white/10 text-gray-100'
                    }`}
                  >
                    {!isMine && showAvatar && (
                      <p className="text-xs text-gray-400 mb-1">{msg.senderName}</p>
                    )}
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className="text-xs opacity-60">
                        {(msg.createdAt || msg.created_at) && format(new Date(msg.createdAt || msg.created_at), 'HH:mm')}
                      </span>
                      {isMine && (
                        <span>
                          {msg.read_at ? (
                            <CheckCheck size={14} className="text-blue-400" />
                          ) : (
                            <Check size={14} className="opacity-60" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex items-center gap-2"
              >
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-sm text-gray-400">{otherUser.full_name} is typing...</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Bar */}
        <div className="sticky bottom-0 bg-[#0B0C10]/80 backdrop-blur-xl border-t border-purple-500/20 px-6 py-4">
          <div className="flex items-center gap-3">
            {/* AI Button */}
            <button className="p-2 hover:bg-purple-500/10 rounded-lg transition group">
              <Sparkles size={20} className="text-purple-400 group-hover:text-purple-300" />
            </button>

            {/* Emoji Button */}
            <button className="p-2 hover:bg-white/5 rounded-lg transition">
              <Smile size={20} className="text-gray-400" />
            </button>

            {/* Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={messageInput}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition"
              />
            </div>

            {/* Attachment Button */}
            <button className="p-2 hover:bg-white/5 rounded-lg transition">
              <Paperclip size={20} className="text-gray-400" />
            </button>

            {/* Send Button */}
            <button
              onClick={sendMessage}
              disabled={!messageInput.trim()}
              className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Right Context Panel */}
      <AnimatePresence>
        {showContextPanel && (
          <motion.div
            initial={{ x: 320 }}
            animate={{ x: 0 }}
            exit={{ x: 320 }}
            className="fixed right-0 top-0 bottom-0 w-80 bg-[#0B0C10]/95 backdrop-blur-xl border-l border-purple-500/20 overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              {/* Close Button */}
              <button
                onClick={() => setShowContextPanel(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded-lg transition"
              >
                <X size={20} />
              </button>

              {/* Participants */}
              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-3">PARTICIPANTS</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                      {otherUser.full_name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{otherUser.full_name}</p>
                      <p className="text-xs text-gray-400">{otherUser.user_type}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-3">QUICK ACTIONS</h3>
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition text-left">
                    <Plus size={16} className="text-purple-400" />
                    <span className="text-sm">Create Task from Chat</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition text-left">
                    <Package size={16} className="text-blue-400" />
                    <span className="text-sm">Add Deliverable</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition text-left">
                    <DollarSign size={16} className="text-green-400" />
                    <span className="text-sm">Create Invoice</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition text-left">
                    <Sparkles size={16} className="text-purple-400" />
                    <span className="text-sm">Summarize Conversation</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
