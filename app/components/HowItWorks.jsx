'use client';

import { motion } from 'framer-motion';
import { Briefcase, LayoutGrid, MessageCircle, Sparkles, CreditCard } from 'lucide-react';
import Link from 'next/link';

export default function HowItWorks() {
  const steps = [
    {
      icon: Briefcase,
      title: 'Get a Project',
      description: 'Create workspace for each client',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: LayoutGrid,
      title: 'Plan',
      description: 'Define invoices & deadlines',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: MessageCircle,
      title: 'Collaborate',
      description: 'Send files/messages, share updates',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Sparkles,
      title: 'Use AI',
      description: 'Automate corrections & write content',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: CreditCard,
      title: 'Deliver & Get Paid',
      description: 'Invoice & track payments',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <section id="how-it-works" className="py-32 px-6 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(99,102,241,0.1),transparent_50%)]"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            How FlowDeck Works
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            A simple 5-step workflow that replaces your entire freelance toolkit
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-indigo-500/50 to-transparent transform -translate-y-1/2"></div>

          <div className="grid md:grid-cols-5 gap-8 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="relative"
                >
                  {/* Step Card */}
                  <div className="glass rounded-2xl p-6 border border-white/10 hover:border-indigo-500/50 transition group">
                    {/* Icon */}
                    <div className={`w-16 h-16 mb-4 rounded-xl bg-linear-to-br ${step.color} flex items-center justify-center mx-auto group-hover:scale-110 transition`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Step Number */}
                    <div className="text-center mb-3">
                      <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/20 px-3 py-1 rounded-full">
                        Step {index + 1}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-center mb-2">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-400 text-center">
                      {step.description}
                    </p>
                  </div>

                  {/* Connector Arrow (mobile only) */}
                  {index < steps.length - 1 && (
                    <div className="md:hidden flex justify-center my-4">
                      <div className="w-px h-8 bg-linear-to-b from-indigo-500 to-transparent"></div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-gray-400 mb-6">
            All powered by AI to make your freelance life 10x easier
          </p>
          <Link href="/signup">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-linear-to-r from-indigo-600 to-purple-600 rounded-full font-semibold text-lg glow-hover"
            >
              Start Your Free Trial
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
