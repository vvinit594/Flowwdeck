'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, Briefcase } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();

  const handleUserTypeSelection = (type, action) => {
    // Store user type in session/localStorage if needed
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('userType', type);
    }
    
    // Close modals and navigate
    setShowSignupModal(false);
    setShowLoginModal(false);
    
    // Navigate to respective page
    if (action === 'signup') {
      router.push('/signup');
    } else {
      router.push('/login');
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold bg-linear-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent"
            >
              FlowDeck
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="hover:text-indigo-400 transition">Features</a>
              <a href="#how-it-works" className="hover:text-indigo-400 transition">How It Works</a>
              <a href="#pricing" className="hover:text-indigo-400 transition">Pricing</a>
              <motion.button
                onClick={() => setShowLoginModal(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 glass border border-white/10 rounded-full font-semibold hover:border-indigo-500/50 transition"
              >
                Login
              </motion.button>
              <motion.button
                onClick={() => setShowSignupModal(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-linear-to-r from-indigo-600 to-purple-600 rounded-full font-semibold glow-hover transition"
              >
                Signup
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden mt-4 space-y-4"
            >
              <a href="#features" className="block hover:text-indigo-400 transition">Features</a>
              <a href="#how-it-works" className="block hover:text-indigo-400 transition">How It Works</a>
              <a href="#pricing" className="block hover:text-indigo-400 transition">Pricing</a>
              <button 
                onClick={() => setShowLoginModal(true)}
                className="w-full px-6 py-2 glass border border-white/10 rounded-full font-semibold hover:border-indigo-500/50 transition"
              >
                Login
              </button>
              <button 
                onClick={() => setShowSignupModal(true)}
                className="w-full px-6 py-2 bg-linear-to-r from-indigo-600 to-purple-600 rounded-full font-semibold"
              >
                Signup
              </button>
            </motion.div>
          )}
        </div>
      </motion.nav>

      {/* Signup Modal */}
      <AnimatePresence>
        {showSignupModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999 }}
            className="bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowSignupModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 max-w-sm w-full my-auto"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-1">
                  Join FlowDeck
                </h2>
                <p className="text-sm text-gray-400">Choose your account type</p>
              </div>

              <div className="space-y-3">
                {/* Freelancer Option */}
                <motion.button
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleUserTypeSelection('freelancer', 'signup')}
                  className="w-full group relative"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-indigo-500/20 to-purple-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all" />
                  <div className="relative flex items-center gap-3 p-4 bg-white/3 backdrop-blur-sm border border-white/10 rounded-xl hover:border-indigo-500/50 transition-all">
                    <div className="w-10 h-10 rounded-lg bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="text-base font-bold text-white">Freelancer</h3>
                      <p className="text-xs text-gray-400">Manage projects and deliver work</p>
                    </div>
                    <motion.div
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-indigo-400 text-lg"
                    >
                      →
                    </motion.div>
                  </div>
                </motion.button>

                {/* Client Option */}
                <motion.button
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleUserTypeSelection('client', 'signup')}
                  className="w-full group relative"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all" />
                  <div className="relative flex items-center gap-3 p-4 bg-white/3 backdrop-blur-sm border border-white/10 rounded-xl hover:border-purple-500/50 transition-all">
                    <div className="w-10 h-10 rounded-lg bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                      <Briefcase className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="text-base font-bold text-white">Client</h3>
                      <p className="text-xs text-gray-400">Post projects and hire talent</p>
                    </div>
                    <motion.div
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-purple-400 text-lg"
                    >
                      →
                    </motion.div>
                  </div>
                </motion.button>
              </div>

              <button
                onClick={() => setShowSignupModal(false)}
                className="mt-4 w-full px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999 }}
            className="bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowLoginModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 max-w-sm w-full my-auto"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-1">
                  Welcome Back
                </h2>
                <p className="text-sm text-gray-400">Login to your account</p>
              </div>

              <div className="space-y-3">
                {/* Freelancer Login */}
                <motion.button
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleUserTypeSelection('freelancer', 'login')}
                  className="w-full group relative"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-indigo-500/20 to-purple-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all" />
                  <div className="relative flex items-center gap-3 p-4 bg-white/3 backdrop-blur-sm border border-white/10 rounded-xl hover:border-indigo-500/50 transition-all">
                    <div className="w-10 h-10 rounded-lg bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="text-base font-bold text-white">Freelancer</h3>
                      <p className="text-xs text-gray-400">Access your workspace</p>
                    </div>
                    <motion.div
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-indigo-400 text-lg"
                    >
                      →
                    </motion.div>
                  </div>
                </motion.button>

                {/* Client Login */}
                <motion.button
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleUserTypeSelection('client', 'login')}
                  className="w-full group relative"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all" />
                  <div className="relative flex items-center gap-3 p-4 bg-white/3 backdrop-blur-sm border border-white/10 rounded-xl hover:border-purple-500/50 transition-all">
                    <div className="w-10 h-10 rounded-lg bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                      <Briefcase className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="text-base font-bold text-white">Client</h3>
                      <p className="text-xs text-gray-400">Manage your projects</p>
                    </div>
                    <motion.div
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-purple-400 text-lg"
                    >
                      →
                    </motion.div>
                  </div>
                </motion.button>
              </div>

              <button
                onClick={() => setShowLoginModal(false)}
                className="mt-4 w-full px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
