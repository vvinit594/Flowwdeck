'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Briefcase, Trello, MessageSquare, Package, DollarSign, FolderOpen, BarChart3, Plug, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from '../ThemeToggle';

export default function Sidebar({ onToggle, onChatClick }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggle = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Briefcase, label: 'Workplace', path: '/dashboard/workplace' },
    { icon: Trello, label: 'Kanban', path: '/dashboard/kanban' },
    { icon: MessageSquare, label: 'Smart Chat', path: '/dashboard/smart-chat' },
    { icon: Package, label: 'Deliverable Zone', path: '/dashboard/deliverables' },
    { icon: DollarSign, label: 'Payment & Invoicing', path: '/dashboard/payments' },
    { icon: FolderOpen, label: 'Portfolio Builder', path: '/dashboard/portfolio' },
    { icon: BarChart3, label: 'Analytics', path: '/dashboard/analytics' },
    { icon: Plug, label: 'Integration', path: '/dashboard/integration' }
  ];

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ 
        x: 0,
        width: isCollapsed ? '80px' : '256px'
      }}
      transition={{
        x: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
        width: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
      }}
      className="fixed left-0 top-0 h-screen bg-[#0a0a1f] dark:bg-[#0a0a1f] light:bg-white border-r border-white/5 dark:border-white/5 light:border-gray-200 p-6 flex flex-col z-50 overflow-hidden transition-colors duration-300"
    >
      {/* Logo & Toggle Button */}
      <div className="mb-12 flex items-center justify-between">
        <Link href="/dashboard">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <h1 className="text-2xl font-bold bg-linear-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent whitespace-nowrap">
                  FlowDeck
                </h1>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
        
        <motion.button
          onClick={handleToggle}
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-lg transition-colors ml-auto"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-400 light:text-gray-600" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-400 dark:text-gray-400 light:text-gray-600" />
          )}
        </motion.button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 space-y-1">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          const isSmartChat = item.label === 'Smart Chat';

          const content = (
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ x: isCollapsed ? 0 : 4 }}
                transition={{ 
                  opacity: { delay: index * 0.05 },
                  x: { duration: 0.2 }
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition cursor-pointer relative group ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-400'
                    : 'text-gray-400 dark:text-gray-400 light:text-gray-600 hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-gray-100 hover:text-white dark:hover:text-white light:hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm font-medium whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    className="absolute left-full ml-4 px-3 py-2 bg-[#1a1a35] dark:bg-[#1a1a35] light:bg-white rounded-lg border border-white/10 dark:border-white/10 light:border-gray-200 text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50 shadow-xl light:text-gray-900"
                  >
                    {item.label}
                  </motion.div>
                )}
              </motion.div>
          );

          return isSmartChat ? (
            <div key={item.path} onClick={onChatClick}>
              {content}
            </div>
          ) : (
            <Link key={item.path} href={item.path}>
              {content}
            </Link>
          );
        })}
      </nav>

      {/* Theme Toggle */}
      <div className="mt-auto flex justify-center">
        <ThemeToggle />
      </div>
    </motion.aside>
  );
}
