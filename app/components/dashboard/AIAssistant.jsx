'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { useState } from 'react';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl z-50"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
      </motion.button>

      {/* AI Assistant Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-28 right-8 w-96 bg-[#1a1a35] rounded-xl border border-white/5 overflow-hidden shadow-2xl z-50"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">AI Assistant</h3>
                  <p className="text-xs text-gray-400">Powered by FlowDeck AI</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 h-80 overflow-y-auto">
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h4 className="font-semibold text-white mb-2">How can I help you?</h4>
                <p className="text-sm text-gray-400 mb-6">
                  Ask me anything about your projects
                </p>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <h5 className="text-xs font-semibold text-gray-400 uppercase mb-3">Quick Actions</h5>
                {[
                  'Summarize today\'s tasks',
                  'Draft client email',
                  'Generate project report'
                ].map((action, i) => (
                  <button
                    key={i}
                    className="w-full text-left px-4 py-3 bg-white/5 rounded-lg hover:bg-white/10 border border-white/5 transition text-sm text-white"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/5">
              <button className="w-full py-2.5 bg-indigo-600 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 transition">
                <Sparkles className="w-4 h-4" />
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
