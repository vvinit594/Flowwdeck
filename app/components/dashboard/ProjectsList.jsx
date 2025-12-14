'use client';

import { motion } from 'framer-motion';
import { Eye, MoreVertical } from 'lucide-react';
import { useState } from 'react';

export default function ProjectsList() {
  const projects = [
    {
      id: 1,
      title: 'Website Redesign',
      client: 'Acme Corp',
      deadline: 'Aug 30',
      status: 'In Progress',
      statusColor: 'indigo'
    },
    {
      id: 2,
      title: 'Mobile App',
      client: 'Beta Inc.',
      deadline: 'Sep 10',
      status: 'Completed',
      statusColor: 'green'
    },
    {
      id: 3,
      title: 'Email Newsletter',
      client: 'Gamma LLC',
      deadline: 'Oct 01',
      status: 'Pending',
      statusColor: 'yellow'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-[#1a1a35] rounded-xl border border-white/5"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/5">
        <h2 className="text-xl font-bold">Projects</h2>
      </div>

      {/* Projects List */}
      <div className="divide-y divide-white/5">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="flex items-center justify-between p-5 hover:bg-white/5 transition cursor-pointer"
          >
            {/* Left Section */}
            <div className="flex-1">
              <h3 className="font-semibold text-white mb-1">{project.title}</h3>
              <p className="text-sm text-gray-400">{project.client}</p>
            </div>

            {/* Deadline */}
            <div className="text-sm text-gray-400 mr-6">
              {project.deadline}
            </div>

            {/* Status Badge */}
            <div className={`px-3 py-1.5 rounded-lg text-xs font-medium mr-4 ${
              project.statusColor === 'indigo' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
              project.statusColor === 'green' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
              'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
            }`}>
              {project.status}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-white/5 rounded-lg transition">
                <Eye className="w-4 h-4 text-gray-400" />
              </button>
              <button className="p-2 hover:bg-white/5 rounded-lg transition">
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
