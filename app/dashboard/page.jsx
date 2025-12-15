'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Sidebar from '../components/dashboard/Sidebar';
import TopNavbar from '../components/dashboard/TopNavbar';
import WelcomeHeader from '../components/dashboard/WelcomeHeader';
import StatsCards from '../components/dashboard/StatsCards';
import ProjectsList from '../components/dashboard/ProjectsList';
import ChatsPanel from '../components/dashboard/ChatsPanel';
import AIAssistant from '../components/dashboard/AIAssistant';
import ChatModal from '../components/chat/ChatModal';
import { userAPI, isAuthenticated } from '@/lib/api';
import { connectSocket, disconnectSocket } from '@/lib/socket';
import { MessageCircle } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isChatCollapsed, setIsChatCollapsed] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [user, setUser] = useState({
    name: 'User',
    role: 'Freelancer',
    avatar: '👨‍💻',
    status: 'Online'
  });
  const [loading, setLoading] = useState(true);

  // Check authentication and fetch user data
  useEffect(() => {
    const loadUserData = async () => {
      // Check if user is authenticated
      if (!isAuthenticated()) {
        router.push('/login');
        return;
      }

      try {
        const response = await userAPI.getMe();
        if (response.success && response.data) {
          const userData = response.data;
          const profile = userData.profile;

          // Check if profile is completed
          if (!profile || !profile.completedAt) {
            router.push('/profile-setup');
            return;
          }

          // Set user data for display
          setUser({
            id: userData.id,
            name: profile.displayName || profile.fullName || userData.email.split('@')[0],
            role: profile.professionalTitle || 'Freelancer',
            avatar: profile.avatarUrl || '👨‍💻',
            status: 'Online',
            email: userData.email,
            user_type: userData.user_type || userData.userType || 'freelancer'
          });
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
        // If error, redirect to login
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [router]);

  // Auto-close chat sidebar after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsChatCollapsed(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Initialize socket connection
  useEffect(() => {
    if (user.email) {
      connectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [user.email]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f23] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-12 w-12 text-indigo-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white">
      {/* Sidebar */}
      <Sidebar onToggle={setIsCollapsed} onChatClick={() => setShowChatModal(true)} />

      {/* Main Content */}
      <div 
        className="transition-all duration-300 ease-in-out min-h-screen"
        style={{ 
          marginLeft: isCollapsed ? '80px' : '256px',
          marginRight: isChatCollapsed ? '80px' : '384px'
        }}
      >
        {/* Top Navbar */}
        <TopNavbar user={user} />

        {/* Main Workspace */}
        <main className="p-8">
          {/* Welcome Header */}
          <WelcomeHeader userName={user.name} />

          {/* Stats Cards */}
          <StatsCards />

          {/* Projects Section */}
          <ProjectsList />
        </main>
      </div>

      {/* Chats Panel - Auto-closes after 3 seconds, user can reopen */}
      <ChatsPanel isOpen={!isChatCollapsed} onToggle={setIsChatCollapsed} />

      {/* AI Assistant Widget */}
      <AIAssistant />

      {/* Chat Modal */}
      <ChatModal 
        isOpen={showChatModal} 
        onClose={() => setShowChatModal(false)}
        currentUser={user}
      />
    </div>
  );
}
