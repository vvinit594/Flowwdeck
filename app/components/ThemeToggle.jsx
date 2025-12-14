'use client';

import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="relative w-14 h-7 bg-white/10 dark:bg-white/10 rounded-full p-1 transition-colors duration-300 border border-white/20"
      aria-label="Toggle theme"
    >
      {/* Track */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          backgroundColor: theme === 'dark' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(251, 191, 36, 0.2)'
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Slider */}
      <motion.div
        className="relative w-5 h-5 bg-white rounded-full shadow-lg flex items-center justify-center"
        animate={{
          x: theme === 'dark' ? 0 : 28
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {theme === 'dark' ? (
          <Moon className="w-3 h-3 text-indigo-600" />
        ) : (
          <Sun className="w-3 h-3 text-amber-500" />
        )}
      </motion.div>
    </motion.button>
  );
}
