'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { LayoutDashboard, Users, TrendingUp } from 'lucide-react';

export default function VisualDemo() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section ref={containerRef} className="py-32 px-6 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            See FlowDeck in Action
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            A workspace designed for modern freelancers. Beautiful, powerful, and ridiculously simple.
          </p>
        </motion.div>

        {/* Parallax Demo Mockup */}
        <motion.div
          style={{ y, opacity }}
          className="relative max-w-6xl mx-auto"
        >
          {/* Main Dashboard Card */}
          <div className="glass rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden">
            {/* Glow effects */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              {/* Header Bar */}
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-purple-500 rounded-xl"></div>
                  <div>
                    <h3 className="font-semibold">Client Dashboard</h3>
                    <p className="text-sm text-gray-400">Workspace Overview</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="grid md:grid-cols-3 gap-4">
                {/* Stat Card 1 */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="bg-linear-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl p-6 border border-indigo-500/30"
                >
                  <LayoutDashboard className="w-8 h-8 text-indigo-400 mb-3" />
                  <h4 className="text-2xl font-bold mb-1">12</h4>
                  <p className="text-sm text-gray-400">Active Projects</p>
                </motion.div>

                {/* Stat Card 2 */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="bg-linear-to-br from-green-500/20 to-emerald-500/20 rounded-2xl p-6 border border-green-500/30"
                >
                  <Users className="w-8 h-8 text-green-400 mb-3" />
                  <h4 className="text-2xl font-bold mb-1">24</h4>
                  <p className="text-sm text-gray-400">Happy Clients</p>
                </motion.div>

                {/* Stat Card 3 */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="bg-linear-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl p-6 border border-yellow-500/30"
                >
                  <TrendingUp className="w-8 h-8 text-yellow-400 mb-3" />
                  <h4 className="text-2xl font-bold mb-1">$45k</h4>
                  <p className="text-sm text-gray-400">Revenue This Month</p>
                </motion.div>
              </div>

              {/* Task List Preview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="mt-6"
              >
                <h4 className="font-semibold mb-4">Recent Tasks</h4>
                <div className="space-y-3">
                  {[
                    { title: 'Design landing page', status: 'In Progress', color: 'indigo' },
                    { title: 'Client meeting notes', status: 'Completed', color: 'green' },
                    { title: 'Invoice #1234', status: 'Pending', color: 'yellow' }
                  ].map((task, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      className="flex items-center justify-between bg-white/5 rounded-xl p-4 border border-white/10"
                    >
                      <span className="text-sm">{task.title}</span>
                      <span className={`text-xs px-3 py-1 rounded-full bg-${task.color}-500/20 text-${task.color}-400 border border-${task.color}-500/30`}>
                        {task.status}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Floating Elements */}
          <motion.div
            initial={{ opacity: 0, y: 20, x: -20 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="absolute -left-12 top-1/4 hidden lg:block glass rounded-2xl p-4 border border-white/10 max-w-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-purple-500 rounded-full"></div>
              <div>
                <p className="text-sm font-semibold">AI Generated</p>
                <p className="text-xs text-gray-400">Proposal ready ✨</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20, x: 20 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.9 }}
            className="absolute -right-12 bottom-1/4 hidden lg:block glass rounded-2xl p-4 border border-white/10 max-w-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                💰
              </div>
              <div>
                <p className="text-sm font-semibold">Payment Received</p>
                <p className="text-xs text-gray-400">+$2,500</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
