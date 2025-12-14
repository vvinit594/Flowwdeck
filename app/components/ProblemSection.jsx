'use client';

import { motion } from 'framer-motion';
import { X, ArrowRight, Check } from 'lucide-react';

export default function ProblemSection() {
  const chaosTools = [
    'Trello', 'Slack', 'Gmail', 'PayPal', 'Google Drive',
    'Zoom', 'Notion', 'Calendar', 'Invoicing', 'Time Tracking'
  ];

  return (
    <section className="py-32 px-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Stop the Tool{' '}
            <span className="bg-linear-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              Chaos
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Freelancers waste hours switching between apps. FlowDeck brings everything into one place.
          </p>
        </motion.div>

        {/* Comparison Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Before - Chaos */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-8 border border-red-500/30 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/20 rounded-full blur-3xl"></div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                <X className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold">Before FlowDeck</h3>
            </div>

            <p className="text-gray-400 mb-6">Juggling 10+ different tools daily</p>

            <div className="grid grid-cols-2 gap-3">
              {chaosTools.map((tool, index) => (
                <motion.div
                  key={tool}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-center"
                >
                  {tool}
                </motion.div>
              ))}
            </div>

            <div className="mt-6 text-red-400 text-sm">
              ⚠️ Lost time • Scattered data • Expensive subscriptions
            </div>
          </motion.div>

          {/* After - FlowDeck */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-8 border border-indigo-500/30 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                <Check className="w-6 h-6 text-indigo-500" />
              </div>
              <h3 className="text-2xl font-bold">With FlowDeck</h3>
            </div>

            <p className="text-gray-400 mb-6">Everything in one powerful workspace</p>

            <div className="space-y-3">
              {[
                'Task Management & Boards',
                'Real-time Chat & Collaboration',
                'AI Assistant & Content Writer',
                'File Sharing & Storage',
                'Invoicing & Payments',
                'Time Tracking & Reports',
                'Client Portal & Updates',
                'Calendar & Deadlines'
              ].map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-3"
                >
                  <Check className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 text-indigo-400 text-sm flex items-center gap-2">
              <ArrowRight className="w-4 h-4" />
              One login • One price • Unlimited power
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
