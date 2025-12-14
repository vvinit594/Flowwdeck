'use client';

import { motion } from 'framer-motion';
import { Brain, MessageSquare, CheckSquare, Wallet, Gift, Zap, FileText, Clock } from 'lucide-react';
import Link from 'next/link';

export default function FeaturesGrid() {
  const features = [
    {
      icon: Brain,
      title: 'AI Assistant Everywhere',
      description: 'Write proposals, emails, and content with AI. Get smart suggestions in real-time.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: MessageSquare,
      title: 'Smart Chat',
      description: 'Real-time messaging with clients. Organized by project, searchable, and AI-powered.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: CheckSquare,
      title: 'Task Boards',
      description: 'Kanban boards, deadlines, and progress tracking. Keep clients in the loop automatically.',
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Wallet,
      title: 'Payment Tracking',
      description: 'Create invoices, track payments, and get paid faster. Stripe integration built-in.',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Gift,
      title: 'Earn AI Tokens',
      description: 'Invite clients and earn free AI credits. More invites = more AI power for free.',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      icon: FileText,
      title: 'Auto Portfolio',
      description: 'Completed projects auto-generate portfolio pages. Share your work effortlessly.',
      gradient: 'from-red-500 to-pink-500'
    },
    {
      icon: Zap,
      title: 'Instant Deliverables',
      description: 'Share files, get feedback, and manage revisions in one organized space.',
      gradient: 'from-violet-500 to-purple-500'
    },
    {
      icon: Clock,
      title: 'Time Tracking',
      description: 'Automatic time logs and productivity insights. Know where your time goes.',
      gradient: 'from-teal-500 to-cyan-500'
    }
  ];

  return (
    <section id="features" className="py-32 px-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Powerful Freelance{' '}
            <span className="bg-linear-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Tools
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to manage clients and projects professionally
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="glass rounded-2xl p-6 border border-white/10 hover:border-indigo-500/50 transition group relative overflow-hidden"
              >
                {/* Glow Effect on Hover */}
                <div className={`absolute inset-0 bg-linear-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition duration-500`}></div>

                {/* Icon */}
                <div className={`w-14 h-14 mb-4 rounded-xl bg-linear-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold mb-3 group-hover:text-indigo-400 transition">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>

                {/* Decorative corner */}
                <div className={`absolute top-0 right-0 w-20 h-20 bg-linear-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 blur-2xl transition duration-500`}></div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 glass rounded-3xl p-8 md:p-12 border border-indigo-500/30 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-linear-to-r from-indigo-500/10 to-purple-500/10"></div>
          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              And much more coming soon...
            </h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              We're constantly adding new features based on freelancer feedback. Join early to shape the future of FlowDeck.
            </p>
            <Link href="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-linear-to-r from-indigo-600 to-purple-600 rounded-full font-semibold text-lg glow"
              >
                Request a Feature
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
