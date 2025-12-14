'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  MessageSquare, 
  User, 
  LayoutDashboard, 
  FolderKanban, 
  CreditCard, 
  Settings,
  TrendingUp,
  Clock,
  CheckCircle,
  Users,
  Sparkles,
  LogOut
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { userAPI, isAuthenticated, authAPI } from '@/lib/api';
import { connectSocket, disconnectSocket } from '@/lib/socket';
import ChatModal from '@/app/components/chat/ChatModal';

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const router = useRouter();

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!isAuthenticated()) {
          router.push('/login');
          return;
        }

        const response = await userAPI.getMe();
        
        if (response.success && response.data) {
          const user = response.data;
          
          // Check if user is a client
          if (user.role !== 'client' && user.userType !== 'client') {
            router.push('/dashboard');
            return;
          }

          // Check if profile exists
          if (!user.hasProfile || !user.profile) {
            // Redirect to client onboarding
            router.push('/client-onboarding');
            return;
          }

          // Ensure user object has all necessary fields
          setUserData({
            ...user,
            id: user.id,
            user_type: user.user_type || user.userType || user.role
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  // Initialize socket connection
  useEffect(() => {
    if (userData) {
      connectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [userData]);

  // Mock data
  const stats = {
    activeProjects: 3,
    pendingApprovals: 2,
    paymentsDue: 2,
    freelancersWorking: 3
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  const clientName = userData.profile?.fullName || 'Client';
  const clientInitials = clientName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/');
    }
  };

  const projects = [
    { name: 'Acre Construccio', freelancer: 'Alex Morgan', deadline: 'Dec 15', progress: 75, status: 'In Progress' },
    { name: 'Executon Project', freelancer: 'John Smith', deadline: 'Dec 20', progress: 50, status: 'Review' },
    { name: 'Desjac Task', freelancer: 'Sarah Lee', deadline: 'Dec 10', progress: 39, status: 'In Progress' }
  ];

  const freelancerProgress = [
    { name: 'Alex Morgan', progress: 85 },
    { name: 'Emma Davis', progress: 70 },
    { name: 'John Smith', progress: 65 },
    { name: 'Sarah Lee', progress: 55 }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#0f0f0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="text-xl font-bold bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              FlowDeck
            </Link>

            {/* Navigation Tabs */}
            <div className="hidden md:flex items-center space-x-1">
              {['Dashboard', 'Projects', 'Deliverables', 'Payments', 'Analytics'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.toLowerCase()
                      ? 'bg-indigo-500/20 text-indigo-300'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-3">
              <button className="relative p-2 hover:bg-white/5 rounded-lg transition">
                <Bell size={18} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full"></span>
              </button>
              <button 
                onClick={() => setShowChatModal(true)}
                className="relative p-2 hover:bg-white/5 rounded-lg transition group"
                title="Messages"
              >
                <MessageSquare size={18} className="group-hover:text-purple-400 transition" />
                <span className="absolute top-0 right-0 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center text-[10px] font-bold">2</span>
              </button>
              
              {/* User Profile with Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-1.5 pl-2 pr-3 hover:bg-white/5 rounded-lg transition border border-white/10"
                >
                  {userData.profile?.avatarUrl ? (
                    <img 
                      src={userData.profile.avatarUrl} 
                      alt={clientName}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold">
                      {clientInitials}
                    </div>
                  )}
                  <div className="text-left hidden md:block">
                    <p className="text-xs font-semibold text-white leading-tight">{clientName}</p>
                    <p className="text-[10px] text-gray-400">Client</p>
                  </div>
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {showProfileMenu && (
                    <>
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-56 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50"
                      >
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-white/10">
                          <p className="text-sm font-semibold text-white">{clientName}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{userData.email || ''}</p>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          <button
                            onClick={() => {
                              setShowProfileMenu(false);
                              router.push('/client-onboarding');
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition text-left"
                          >
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-300">Edit Profile</span>
                          </button>
                          
                          <button
                            onClick={() => {
                              setShowProfileMenu(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition text-left"
                          >
                            <Settings className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-300">Settings</span>
                          </button>
                        </div>

                        {/* Logout */}
                        <div className="border-t border-white/10 py-2">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-500/10 transition text-left group"
                          >
                            <LogOut className="w-4 h-4 text-red-400 group-hover:text-red-300" />
                            <span className="text-sm text-red-400 group-hover:text-red-300">Logout</span>
                          </button>
                        </div>
                      </motion.div>

                      {/* Click outside to close dropdown */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowProfileMenu(false)}
                      />
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside 
        className="fixed left-0 top-16 bottom-0 z-30 bg-[#0f0f0f]/50 backdrop-blur-xl border-r border-white/5 transition-all duration-300"
        style={{ width: sidebarExpanded ? '200px' : '64px' }}
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
      >
        <div className="p-3 space-y-2">
          {[
            { icon: LayoutDashboard, label: 'Overview', active: true },
            { icon: FolderKanban, label: 'Projects', active: false },
            { icon: CreditCard, label: 'Payments', active: false },
            { icon: Bell, label: 'Notifications', active: false },
            { icon: Settings, label: 'Settings', active: false }
          ].map((item, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05, x: 4 }}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all ${
                item.active 
                  ? 'bg-linear-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30' 
                  : 'hover:bg-white/5'
              }`}
            >
              <item.icon size={20} className={item.active ? 'text-indigo-400' : 'text-gray-400'} />
              {sidebarExpanded && (
                <span className={`text-sm font-medium whitespace-nowrap ${item.active ? 'text-white' : 'text-gray-400'}`}>
                  {item.label}
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="pt-20 pl-16 pr-6 pb-6 md:pl-20">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome back, {clientName} 👋
            </h1>
            <p className="text-gray-400 text-sm">Here's what's happening with your projects today</p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-linear-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-xl border border-white/10 rounded-2xl p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                  <FolderKanban size={20} className="text-indigo-400" />
                </div>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-1">{stats.activeProjects}</h3>
              <p className="text-xs text-gray-400">Total Active Projects</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-linear-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-white/10 rounded-2xl p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <CheckCircle size={20} className="text-purple-400" />
                </div>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-1">{stats.pendingApprovals}</h3>
              <p className="text-xs text-gray-400">Pending Approvals</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-linear-to-br from-pink-500/10 to-orange-500/10 backdrop-blur-xl border border-white/10 rounded-2xl p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
                  <CreditCard size={20} className="text-pink-400" />
                </div>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-1">{stats.paymentsDue}</h3>
              <p className="text-xs text-gray-400">Payments Due</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-linear-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border border-white/10 rounded-2xl p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Users size={20} className="text-blue-400" />
                </div>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-1">{stats.freelancersWorking}</h3>
              <p className="text-xs text-gray-400">Freelancers Working</p>
            </motion.div>
          </div>

          {/* Analytics Section */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Project Progress Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-[#0f0f0f]/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold mb-6">Project Progress</h3>
              <div className="space-y-5">
                {freelancerProgress.map((freelancer, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300">{freelancer.name.split(' ')[0]}</span>
                      <span className="text-xs text-gray-500">{freelancer.progress}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${freelancer.progress}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                        className="h-full bg-linear-to-r from-indigo-500 to-purple-500 rounded-full relative"
                        style={{
                          boxShadow: '0 0 10px rgba(99, 102, 241, 0.5)'
                        }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{freelancer.name.split(' ')[1]}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Payment Spend Chart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-[#0f0f0f]/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold mb-6">Payment Spend Over Time</h3>
              <div className="relative h-48 flex items-end justify-between space-x-2">
                {/* Simple line chart representation */}
                <svg className="w-full h-full" viewBox="0 0 400 160">
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Area fill */}
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 0.8 }}
                    d="M 0 140 Q 50 120 100 100 T 200 80 T 300 60 T 400 40 L 400 160 L 0 160 Z"
                    fill="url(#areaGradient)"
                  />
                  {/* Line */}
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 0.8 }}
                    d="M 0 140 Q 50 120 100 100 T 200 80 T 300 60 T 400 40"
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="3"
                    filter="drop-shadow(0 0 8px rgba(99, 102, 241, 0.5))"
                  />
                </svg>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-4">
                <span>0.5</span>
                <span>16</span>
                <span>90</span>
                <span>90</span>
                <span>100</span>
              </div>
            </motion.div>
          </div>

          {/* AI Summary Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-linear-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-5 mb-8"
          >
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0">
                <Sparkles size={16} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-indigo-300 mb-1">This week:</h4>
                <p className="text-sm text-gray-300">
                  2 projects completed, ₹25,000 paid, 1 deliverable pending.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Active Projects Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h2 className="text-xl font-bold mb-4">Active Projects</h2>
            <div className="space-y-4">
              {projects.map((project, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  whileHover={{ scale: 1.01, x: 4 }}
                  className="group bg-[#0f0f0f]/50 backdrop-blur-xl border border-white/10 hover:border-indigo-500/30 rounded-xl p-5 transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{project.name}</h3>
                      <p className="text-sm text-gray-400">{project.freelancer}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Deadline</p>
                        <p className="text-sm font-medium">{project.deadline}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        project.status === 'In Progress' 
                          ? 'bg-indigo-500/20 text-indigo-300' 
                          : 'bg-purple-500/20 text-purple-300'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500">Progress</span>
                        <span className="text-xs text-gray-400">{project.progress}%</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-linear-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
                          style={{ 
                            width: `${project.progress}%`,
                            boxShadow: '0 0 10px rgba(99, 102, 241, 0.5)'
                          }}
                        />
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-linear-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-lg text-sm font-medium hover:border-indigo-500/50 transition-all"
                    >
                      View Project
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      {/* Chat Modal */}
      <ChatModal 
        isOpen={showChatModal} 
        onClose={() => setShowChatModal(false)}
        currentUser={userData}
      />
    </div>
  );
}
