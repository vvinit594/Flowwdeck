'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, CalendarDays, LogOut, Settings, User as UserIcon } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';

export default function TopNavbar({ user }) {
  const router = useRouter();
  const [notifications, setNotifications] = useState(3);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout API fails, redirect to home
      router.push('/');
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-40 bg-[#0f0f23]/80 backdrop-blur-xl border-b border-white/5 px-8 py-4"
    >
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search projects, clients, or tasks..."
              className="w-full pl-12 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-indigo-500/50 transition text-sm text-gray-300 placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 ml-8">
          {/* Notification */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2.5 bg-white/5 rounded-lg hover:bg-white/10 transition"
          >
            <Bell className="w-5 h-5 text-gray-400" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 text-white text-[10px] rounded-full flex items-center justify-center font-semibold">
                {notifications}
              </span>
            )}
          </motion.button>

          {/* Calendar */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 bg-white/5 rounded-lg hover:bg-white/10 transition"
          >
            <CalendarDays className="w-5 h-5 text-gray-400" />
          </motion.button>

          {/* User Profile with Dropdown */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 pl-2 pr-4 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition border border-white/10"
            >
              <div className="relative">
                <div className="w-9 h-9 bg-linear-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-lg">
                  {user?.avatar || '👤'}
                </div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#0f0f23]"></div>
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-white">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-400">{user?.role || 'Freelancer'}</p>
              </div>
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-56 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50"
                >
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-sm font-semibold text-white">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{user?.email || ''}</p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        router.push('/profile-setup');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition text-left"
                    >
                      <UserIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-300">Edit Profile</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        // Add settings page route later
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
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showProfileMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowProfileMenu(false)}
        />
      )}
    </motion.nav>
  );
}
