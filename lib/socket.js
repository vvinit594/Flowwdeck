import { io } from 'socket.io-client';
import { getAuthToken } from './api';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

let socket = null;

export const connectSocket = () => {
  if (socket?.connected) {
    return socket;
  }

  const token = getAuthToken();
  
  if (!token) {
    console.error('No auth token found');
    return null;
  }

  socket = io(SOCKET_URL, {
    auth: {
      token
    },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5
  });

  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('👋 Socket disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('❌ Socket connection error:', error.message);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => {
  if (!socket) {
    return connectSocket();
  }
  return socket;
};

// Chat API functions
export const chatAPI = {
  // Get all conversations
  getConversations: async () => {
    const response = await fetch(`${SOCKET_URL}/api/chat/conversations`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  },

  // Get or create conversation
  createConversation: async (otherUserId) => {
    const response = await fetch(`${SOCKET_URL}/api/chat/conversations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ otherUserId })
    });
    return response.json();
  },

  // Get messages for a conversation
  getMessages: async (conversationId, before = null) => {
    const url = new URL(`${SOCKET_URL}/api/chat/conversations/${conversationId}/messages`);
    if (before) {
      url.searchParams.append('before', before);
    }
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  },

  // Search users
  searchUsers: async (query) => {
    const url = new URL(`${SOCKET_URL}/api/chat/search`);
    url.searchParams.append('search', query);
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  }
};

export default { connectSocket, disconnectSocket, getSocket, chatAPI };
