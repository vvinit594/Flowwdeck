'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Mail, Sparkles, Twitter, Linkedin, Github } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function FinalCTA() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the email to your backend
    console.log('Email submitted:', email);
    setSubmitted(true);
    setTimeout(() => {
      // Redirect to signup page after showing success message
      router.push('/signup');
    }, 1500);
  };

  return (
    <section className="py-32 px-6 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Main CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-12 md:p-16 border border-indigo-500/30 text-center relative overflow-hidden"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-linear-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10"></div>

          <div className="relative z-10">
            {/* Badge */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-indigo-500/50 mb-6"
            >
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span className="text-sm font-semibold">Limited Early Access</span>
            </motion.div>

            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              Ready to Transform Your{' '}
              <span className="bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
                Freelance Business?
              </span>
            </motion.h2>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto"
            >
              Join 10,000+ freelancers who've ditched tool chaos for one powerful AI workspace
            </motion.p>

            {/* Email Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              onSubmit={handleSubmit}
              className="max-w-md mx-auto mb-8"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-full focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="px-8 py-4 bg-linear-to-r from-indigo-600 to-purple-600 rounded-full font-semibold flex items-center justify-center gap-2 glow whitespace-nowrap"
                >
                  {submitted ? (
                    '✓ Subscribed!'
                  ) : (
                    <>
                      Get Early Access
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </div>
            </motion.form>

            {/* Features list */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-6 text-sm text-gray-400 mb-12"
            >
              <span className="flex items-center gap-2">
                ✓ Free for 14 days
              </span>
              <span className="flex items-center gap-2">
                ✓ No credit card required
              </span>
              <span className="flex items-center gap-2">
                ✓ Cancel anytime
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-20 pt-12 border-t border-white/10"
        >
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold bg-linear-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent mb-4">
                FlowDeck
              </h3>
              <p className="text-gray-400 mb-6 max-w-sm">
                The modern AI-powered workspace that helps freelancers manage clients, projects, and payments — all in one place.
              </p>
              <div className="flex gap-4">
                {[
                  { icon: Twitter, href: '#' },
                  { icon: Linkedin, href: '#' },
                  { icon: Github, href: '#' }
                ].map((social, i) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={i}
                      href={social.href}
                      whileHover={{ scale: 1.1, y: -2 }}
                      className="w-10 h-10 glass rounded-full flex items-center justify-center border border-white/10 hover:border-indigo-500/50 transition"
                    >
                      <Icon className="w-5 h-5" />
                    </motion.a>
                  );
                })}
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-indigo-400 transition">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-indigo-400 transition">How It Works</a></li>
                <li><a href="#pricing" className="hover:text-indigo-400 transition">Pricing</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition">Roadmap</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-indigo-400 transition">About</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition">Blog</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition">Careers</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition">Contact</a></li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>© 2025 FlowDeck. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-indigo-400 transition">Privacy Policy</a>
              <a href="#" className="hover:text-indigo-400 transition">Terms of Service</a>
              <a href="#" className="hover:text-indigo-400 transition">Cookie Policy</a>
            </div>
          </div>
        </motion.footer>
      </div>
    </section>
  );
}
