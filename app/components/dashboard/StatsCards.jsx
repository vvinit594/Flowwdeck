'use client';

import { motion } from 'framer-motion';

export default function StatsCards() {
  const stats = [
    {
      title: 'Active Projects',
      value: '5',
      progress: 70
    },
    {
      title: 'Upcoming Deadlines',
      value: '3',
      progress: 45
    },
    {
      title: 'Pending Approvals',
      value: '2',
      progress: 30
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => {
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[#1a1a35] rounded-xl p-5 border border-white/5"
          >
            <h3 className="text-gray-400 text-sm mb-3">{stat.title}</h3>
            <p className="text-4xl font-bold text-white mb-4">{stat.value}</p>
            
            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stat.progress}%` }}
                transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                className="h-full bg-indigo-600 rounded-full"
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
