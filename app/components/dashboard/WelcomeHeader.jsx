'use client';

import { motion } from 'framer-motion';

export default function WelcomeHeader({ userName }) {
  const currentHour = new Date().getHours();
  let greeting = 'Good Morning';
  
  if (currentHour >= 12 && currentHour < 18) {
    greeting = 'Good Afternoon';
  } else if (currentHour >= 18) {
    greeting = 'Good Evening';
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <h1 className="text-4xl font-bold mb-6 text-white">
        {greeting}, {userName} 👋
      </h1>

      {/* AI Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[#1a1a35] rounded-xl p-5 border border-white/5"
      >
        <h3 className="text-gray-300 text-sm mb-4">Here's what you should focus on today:</h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-white font-medium mb-2">Design logo for Acme Corp</p>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '65%' }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                />
              </div>
            </div>
            <span className="text-sm text-gray-400 ml-4">2: Day</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
