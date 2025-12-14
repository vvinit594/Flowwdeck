'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Web Designer',
      avatar: '👩‍💻',
      rating: 5,
      text: 'FlowDeck saved me 10+ hours a week. No more switching between Trello, Slack, and Gmail. Everything is in one place and the AI writer is incredible!',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Marcus Williams',
      role: 'Content Writer',
      avatar: '✍️',
      rating: 5,
      text: 'The AI assistant helped me write proposals 5x faster. I\'ve closed more clients since using FlowDeck. The referral credits are a game-changer!',
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Developer',
      avatar: '👩‍💼',
      rating: 5,
      text: 'Clean interface, powerful features. Client communication is seamless and invoicing is automatic. Best freelance tool I\'ve used in 5 years.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      name: 'David Park',
      role: 'Video Editor',
      avatar: '🎬',
      rating: 5,
      text: 'Clients love the project portal. They can see progress in real-time. Payments are faster and I can focus on creative work instead of admin tasks.',
      color: 'from-orange-500 to-red-500'
    },
    {
      name: 'Lisa Thompson',
      role: 'Marketing Consultant',
      avatar: '📊',
      rating: 5,
      text: 'The task boards and AI features make me look incredibly professional. I\'ve doubled my rates since clients see how organized I am now.',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      name: 'Ahmed Hassan',
      role: 'UI/UX Designer',
      avatar: '🎨',
      rating: 5,
      text: 'Portfolio auto-generation is brilliant! Every completed project becomes a case study. FlowDeck has transformed how I showcase my work.',
      color: 'from-yellow-500 to-orange-500'
    }
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
            Loved by{' '}
            <span className="bg-linear-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Freelancers
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Join thousands of freelancers who've transformed their workflow with FlowDeck
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="glass rounded-2xl p-6 border border-white/10 hover:border-indigo-500/50 transition relative overflow-hidden group"
            >
              {/* Gradient glow on hover */}
              <div className={`absolute inset-0 bg-linear-to-br ${testimonial.color} opacity-0 group-hover:opacity-5 transition duration-500`}></div>

              <div className="relative z-10">
                {/* Quote icon */}
                <div className="mb-4">
                  <Quote className="w-8 h-8 text-indigo-500/50" />
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>

                {/* Testimonial text */}
                <p className="text-gray-300 mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full bg-linear-to-br ${testimonial.color} flex items-center justify-center text-2xl`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>

              {/* Decorative corner gradient */}
              <div className={`absolute top-0 right-0 w-24 h-24 bg-linear-to-br ${testimonial.color} opacity-0 group-hover:opacity-10 blur-2xl transition duration-500`}></div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { value: '10,000+', label: 'Freelancers' },
            { value: '50,000+', label: 'Projects Managed' },
            { value: '4.9/5', label: 'Average Rating' },
            { value: '$2M+', label: 'Invoiced Monthly' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center glass rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent mb-2">
                {stat.value}
              </h3>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
