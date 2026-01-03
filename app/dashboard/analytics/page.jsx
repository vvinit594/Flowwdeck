'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Briefcase,
  CheckCircle,
  Clock,
  Calendar,
  Users,
  Target,
  Activity,
  BarChart3,
  PieChart,
  Zap,
  Download,
  Filter as FilterIcon
} from 'lucide-react';
import Sidebar from '@/app/components/dashboard/Sidebar';
import TopNavbar from '@/app/components/dashboard/TopNavbar';
import { userAPI, isAuthenticated } from '@/lib/api';
import { useRouter } from 'next/navigation';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPie,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Mock data for charts
const earningsData = [
  { month: 'Jul', earnings: 4500 },
  { month: 'Aug', earnings: 5200 },
  { month: 'Sep', earnings: 4800 },
  { month: 'Oct', earnings: 6100 },
  { month: 'Nov', earnings: 7200 },
  { month: 'Dec', earnings: 8500 }
];

const projectStatusData = [
  { name: 'Active', value: 5, color: '#3b82f6' },
  { name: 'Completed', value: 12, color: '#22c55e' },
  { name: 'Delayed', value: 2, color: '#ef4444' },
  { name: 'On Hold', value: 1, color: '#f59e0b' }
];

const workloadData = [
  { day: 'Mon', tasks: 8 },
  { day: 'Tue', tasks: 12 },
  { day: 'Wed', tasks: 10 },
  { day: 'Thu', tasks: 15 },
  { day: 'Fri', tasks: 9 },
  { day: 'Sat', tasks: 5 },
  { day: 'Sun', tasks: 3 }
];

const projectPerformanceData = [
  { name: 'Website Redesign', client: 'Acme Corp', progress: 75, daysLeft: 5, status: 'On Track' },
  { name: 'Mobile App', client: 'Tech Startup', progress: 45, daysLeft: 12, status: 'At Risk' },
  { name: 'Brand Identity', client: 'Fashion Co', progress: 90, daysLeft: 2, status: 'On Track' },
  { name: 'E-commerce Site', client: 'Retail Plus', progress: 30, daysLeft: 20, status: 'On Track' }
];

const clientValueData = [
  { name: 'Acme Corp', projects: 5, earnings: 15000, avgPayment: 15 },
  { name: 'Tech Startup', projects: 3, earnings: 9500, avgPayment: 22 },
  { name: 'Fashion Co', projects: 4, earnings: 12000, avgPayment: 10 },
  { name: 'Retail Plus', projects: 2, earnings: 6000, avgPayment: 30 }
];

const aiInsights = [
  { icon: '💰', text: 'You earn most from Web Development projects.', color: 'text-green-400' },
  { icon: '⚠️', text: '2 projects are at risk of delay.', color: 'text-yellow-400' },
  { icon: '💳', text: 'Client "Tech Startup" usually pays 7 days late.', color: 'text-orange-400' },
  { icon: '📈', text: 'You complete tasks 30% faster in the first half of the week.', color: 'text-blue-400' },
  { icon: '🎯', text: 'Your conversion rate increased by 15% this month.', color: 'text-purple-400' }
];

export default function AnalyticsPage() {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState({
    name: 'User',
    role: 'Freelancer',
    avatar: '👨‍💻',
    status: 'Online'
  });
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState('3months');
  const [projectType, setProjectType] = useState('all');

  useEffect(() => {
    const loadUserData = async () => {
      if (!isAuthenticated()) {
        router.push('/login');
        return;
      }

      try {
        const response = await userAPI.getMe();
        if (response.success && response.data) {
          const userData = response.data;
          const profile = userData.profile;

          setUser({
            id: userData.id,
            name: profile?.displayName || profile?.fullName || userData.email.split('@')[0],
            role: profile?.professionalTitle || 'Freelancer',
            avatar: profile?.avatarUrl || '👨‍💻',
            status: 'Online',
            email: userData.email,
            user_type: userData.user_type || userData.userType || 'freelancer'
          });
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };

    loadUserData();
  }, [router]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const kpiCards = [
    {
      title: 'Total Earnings',
      value: formatCurrency(42500),
      change: '+12%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600'
    },
    {
      title: 'This Month',
      value: formatCurrency(8500),
      change: '+18%',
      trend: 'up',
      icon: Calendar,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      title: 'Active Projects',
      value: '5',
      change: '+2',
      trend: 'up',
      icon: Briefcase,
      color: 'from-purple-500 to-pink-600'
    },
    {
      title: 'Completed',
      value: '12',
      change: '+3',
      trend: 'up',
      icon: CheckCircle,
      color: 'from-indigo-500 to-purple-600'
    },
    {
      title: 'Pending Payments',
      value: formatCurrency(3200),
      change: '-5%',
      trend: 'down',
      icon: Clock,
      color: 'from-orange-500 to-red-600'
    },
    {
      title: 'Avg Duration',
      value: '18 days',
      change: '-3 days',
      trend: 'down',
      icon: Target,
      color: 'from-pink-500 to-rose-600'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white">
      {/* Sidebar */}
      <Sidebar onToggle={setIsCollapsed} />

      {/* Main Content */}
      <div
        className="transition-all duration-300 ease-in-out min-h-screen"
        style={{
          marginLeft: isCollapsed ? '80px' : '256px'
        }}
      >
        {/* Top Navbar */}
        <TopNavbar user={user} />

        {/* Main Workspace */}
        <main className="p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                  <BarChart3 className="w-8 h-8 text-purple-500" />
                  Analytics
                </h1>
                <p className="text-gray-400">Track your business performance and insights</p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-3">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                  style={{ colorScheme: 'dark' }}
                >
                  <option value="1month" className="bg-gray-900 text-white">This Month</option>
                  <option value="3months" className="bg-gray-900 text-white">Last 3 Months</option>
                  <option value="6months" className="bg-gray-900 text-white">Last 6 Months</option>
                  <option value="1year" className="bg-gray-900 text-white">This Year</option>
                </select>

                <button className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-xl hover:bg-purple-600/30 transition-colors">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
          </motion.div>

          {/* SECTION A: Top KPI Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8"
          >
            {kpiCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 bg-gradient-to-br ${card.color} rounded-xl group-hover:scale-110 transition-transform`}>
                    <card.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${
                    card.trend === 'up' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {card.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {card.change}
                  </div>
                </div>
                <h3 className="text-gray-400 text-sm mb-1">{card.title}</h3>
                <p className="text-2xl font-bold text-white">{card.value}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* SECTION B: Charts Section */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            {/* Earnings Over Time - Line Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="xl:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Earnings Over Time</h3>
                  <p className="text-gray-400 text-sm">Monthly revenue trend</p>
                </div>
                <Activity className="w-6 h-6 text-purple-500" />
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={earningsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f1f3a',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#fff'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="earnings"
                    stroke="#a855f7"
                    strokeWidth={3}
                    dot={{ fill: '#a855f7', r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Project Status Distribution - Donut Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Project Status</h3>
                  <p className="text-gray-400 text-sm">Distribution</p>
                </div>
                <PieChart className="w-6 h-6 text-purple-500" />
              </div>

              <ResponsiveContainer width="100%" height={240}>
                <RechartsPie>
                  <Pie
                    data={projectStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {projectStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f1f3a',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#fff'
                    }}
                  />
                </RechartsPie>
              </ResponsiveContainer>

              <div className="grid grid-cols-2 gap-3 mt-4">
                {projectStatusData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-300">
                      {item.name} ({item.value})
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Workload Timeline - Bar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Workload Timeline</h3>
                <p className="text-gray-400 text-sm">Tasks completed per day</p>
              </div>
              <BarChart3 className="w-6 h-6 text-purple-500" />
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={workloadData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="day" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f1f3a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="tasks" fill="#a855f7" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* SECTION C: Project & Client Insights */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
            {/* Project Performance Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Project Performance</h3>
                  <p className="text-gray-400 text-sm">Current project status</p>
                </div>
                <Target className="w-6 h-6 text-purple-500" />
              </div>

              <div className="space-y-4">
                {projectPerformanceData.map((project, index) => (
                  <div
                    key={index}
                    className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-white font-semibold">{project.name}</h4>
                        <p className="text-gray-400 text-sm">{project.client}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          project.status === 'On Track'
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                            : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-white font-medium">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-400 text-xs">Days Left</p>
                        <p className="text-white font-bold">{project.daysLeft}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Client Value Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Client Value</h3>
                  <p className="text-gray-400 text-sm">Top clients by earnings</p>
                </div>
                <Users className="w-6 h-6 text-purple-500" />
              </div>

              <div className="space-y-4">
                {clientValueData.map((client, index) => (
                  <div
                    key={index}
                    className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-semibold">{client.name}</h4>
                      <span className="text-green-400 font-bold">
                        {formatCurrency(client.earnings)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400 text-xs">Projects</p>
                        <p className="text-white font-medium">{client.projects}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Avg Payment Time</p>
                        <p className="text-white font-medium">{client.avgPayment} days</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* SECTION D: AI Insights Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                  <Zap className="w-6 h-6 text-yellow-400" />
                  AI Insights
                </h3>
                <p className="text-gray-400 text-sm">Smart analytics powered by AI</p>
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-medium text-sm">
                Ask AI
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiInsights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{insight.icon}</span>
                    <p className={`text-sm ${insight.color} leading-relaxed`}>
                      {insight.text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
