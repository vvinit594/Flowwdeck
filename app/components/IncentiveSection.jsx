'use client';

import { motion } from 'framer-motion';
import { Gift, Users, Sparkles, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function IncentiveSection() {
  const rewards = [
    { invites: '1 Client', tokens: '500 AI Credits', icon: '🎁' },
    { invites: '5 Clients', tokens: '3,000 AI Credits', icon: '🚀' },
    { invites: '10 Clients', tokens: '10,000 AI Credits', icon: '⭐' },
    { invites: '20+ Clients', tokens: 'Unlimited AI', icon: '👑' }
  ];

  return (
    <section className="py-32 px-6 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-yellow-500/50 mb-6"
          >
            <Gift className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-semibold">Referral Rewards</span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Grow with FlowDeck,{' '}
            <span className="bg-linear-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent animate-gradient">
              Earn AI Credits
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Invite clients, earn AI credits, and supercharge your freelance growth. The more you share, the more you earn.
          </p>
        </motion.div>

        {/* Main Feature Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="glass rounded-3xl p-8 md:p-12 border border-yellow-500/30 relative overflow-hidden">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-linear-to-br from-yellow-500/10 to-orange-500/10"></div>

            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              {/* Left side - Info */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 bg-linear-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold">AI Credits System</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Users className="w-4 h-4 text-yellow-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Invite Your Clients</h4>
                      <p className="text-sm text-gray-400">Share your unique referral link when onboarding new clients</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Gift className="w-4 h-4 text-yellow-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Earn AI Credits</h4>
                      <p className="text-sm text-gray-400">Get free AI credits for every client who signs up through your link</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <TrendingUp className="w-4 h-4 text-yellow-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Unlock Premium Features</h4>
                      <p className="text-sm text-gray-400">Use credits for AI writing, smart chat, and advanced automations</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side - Visual */}
              <div className="relative">
                <div className="glass rounded-2xl p-6 border border-yellow-500/30">
                  <div className="text-center mb-4">
                    <p className="text-sm text-gray-400 mb-2">Your AI Balance</p>
                    <h4 className="text-5xl font-bold bg-linear-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                      2,450
                    </h4>
                    <p className="text-sm text-gray-400">Credits Available</p>
                  </div>

                  <div className="h-3 bg-white/5 rounded-full overflow-hidden mb-4">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '65%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-linear-to-r from-yellow-500 to-orange-500"
                    />
                  </div>

                  <p className="text-xs text-center text-gray-400">
                    65% toward next reward tier 🎉
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Reward Tiers */}
        <div className="grid md:grid-cols-4 gap-6">
          {rewards.map((reward, index) => (
            <motion.div
              key={reward.invites}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.05 }}
              className="glass rounded-2xl p-6 border border-white/10 hover:border-yellow-500/50 transition text-center group"
            >
              <div className="text-4xl mb-3">{reward.icon}</div>
              <h4 className="font-bold text-lg mb-2">{reward.invites}</h4>
              <p className="text-sm text-yellow-400 font-semibold mb-2">{reward.tokens}</p>
              <p className="text-xs text-gray-400">Unlock reward</p>

              {/* Progress indicator */}
              <div className="mt-4 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-linear-to-r from-yellow-500 to-orange-500 group-hover:w-full transition-all duration-500" style={{ width: `${25 * (index + 1)}%` }}></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link href="/signup">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-linear-to-r from-yellow-500 to-orange-500 rounded-full font-semibold text-lg text-black glow-hover"
            >
              Start Earning Credits Today
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
