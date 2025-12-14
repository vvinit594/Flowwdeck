'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Laptop Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/laptop-bg.jpg"
          alt="Laptop background"
          fill
          className="object-contain opacity-80"
          priority
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/30 via-[#0a0a0a]/20 to-[#0a0a0a]/50"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl md:text-6xl font-bold mb-6 leading-tight mt-20"
        >
          Tired of juggling{' '}
          <span className="bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
            10 tools?
          </span>
          <br />
          FlowDeck replaces them all.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto"
        >
          Flowbock brings all your freelance tools — tasks, chats, deadlines, and AI — into one powerful workspace.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/signup">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group px-8 py-4 bg-linear-to-r from-indigo-600 to-purple-600 rounded-full font-semibold text-lg flex items-center gap-2 glow"
            >
              Get Early Access
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </motion.button>
          </Link>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 glass rounded-full font-semibold text-lg flex items-center gap-2 border border-white/10"
          >
            <Play className="w-5 h-5" />
            Watch Demo
          </motion.button>
        </motion.div>

        {/* 3D Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 relative"
        >
          <div className="relative mx-auto max-w-5xl">
            {/* Glow effect behind mockup */}
            <div className="absolute inset-0 bg-linear-to-r from-indigo-500/50 to-purple-500/50 blur-3xl opacity-50"></div>
            
            {/* Dashboard mockup placeholder */}
            <div className="relative glass rounded-2xl p-8 border border-white/10 shadow-2xl">
              <div className="aspect-video bg-linear-to-br from-indigo-900/50 to-purple-900/50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-linear-to-r from-indigo-500 to-purple-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <Sparkles className="w-10 h-10" />
                  </div>
                  <p className="text-gray-400">Dashboard Preview Coming Soon</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
