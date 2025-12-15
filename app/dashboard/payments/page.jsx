'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Send
} from 'lucide-react';
import CreateInvoiceModal from '@/app/components/invoice/CreateInvoiceModal';
import Sidebar from '@/app/components/dashboard/Sidebar';
import TopNavbar from '@/app/components/dashboard/TopNavbar';
import { userAPI, isAuthenticated } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function PaymentsPage() {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState({
    name: 'User',
    role: 'Freelancer',
    avatar: '👨‍💻',
    status: 'Online'
  });
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState({
    total_earnings: 0,
    pending_payments: 0,
    paid_count: 0,
    overdue_amount: 0
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      if (!isAuthenticated()) {
        router.push('/login');
        return;
      }

      setLoading(true);
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
        
        await fetchStats();
        await fetchInvoices();
      } catch (error) {
        console.error('Failed to load user data:', error);
        setLoading(false);
      }
    };

    loadUserData();
  }, [router]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/invoices/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      // Keep default stats on error
    }
  };

  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/invoices', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch invoices');
      }
      
      const data = await response.json();
      // Ensure data is an array before setting state
      setInvoices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
      setInvoices([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      sent: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      paid: 'bg-green-500/20 text-green-300 border-green-500/30',
      overdue: 'bg-red-500/20 text-red-300 border-red-500/30',
      cancelled: 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    };
    return colors[status] || colors.draft;
  };

  const getStatusIcon = (status) => {
    const icons = {
      draft: '📝',
      sent: '📤',
      paid: '✅',
      overdue: '⚠️',
      cancelled: '❌'
    };
    return icons[status] || '📝';
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

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
            <h1 className="text-3xl font-bold text-white mb-2">Payment & Invoicing</h1>
            <p className="text-gray-400">Manage your invoices and track payments</p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Earnings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
            >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Total Earnings</h3>
          <p className="text-3xl font-bold text-white">
            {formatCurrency(stats.total_earnings)}
          </p>
          <p className="text-green-400 text-sm mt-2">↑ All time</p>
        </motion.div>

            {/* Pending Payments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
            >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Pending Payments</h3>
          <p className="text-3xl font-bold text-white">
            {formatCurrency(stats.pending_payments)}
          </p>
          <p className="text-blue-400 text-sm mt-2">Awaiting payment</p>
        </motion.div>

            {/* Paid Invoices */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
            >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Paid Invoices</h3>
          <p className="text-3xl font-bold text-white">
            {stats.paid_count}
          </p>
          <p className="text-purple-400 text-sm mt-2">Completed</p>
        </motion.div>

            {/* Overdue Payments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
            >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Overdue Payments</h3>
          <p className="text-3xl font-bold text-white">
            {formatCurrency(stats.overdue_amount)}
          </p>
              <p className="text-red-400 text-sm mt-2">Needs attention</p>
            </motion.div>
          </div>

          {/* Invoices Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all"
          >
            {/* Table Header Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h2 className="text-xl font-bold text-white">Invoices</h2>
              
              <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search invoices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 w-full md:w-64"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                  style={{
                    colorScheme: 'dark'
                  }}
                >
                  <option value="all" className="bg-gray-900 text-white">All Status</option>
                  <option value="draft" className="bg-gray-900 text-white">Draft</option>
                  <option value="sent" className="bg-gray-900 text-white">Sent</option>
                  <option value="paid" className="bg-gray-900 text-white">Paid</option>
                  <option value="overdue" className="bg-gray-900 text-white">Overdue</option>
                  <option value="cancelled" className="bg-gray-900 text-white">Cancelled</option>
                </select>

                {/* Create Invoice Button */}
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Create Invoice
                </button>
              </div>
            </div>

            {/* Table */}
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400 mt-4">Loading invoices...</p>
              </div>
            ) : filteredInvoices.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-10 h-10 text-gray-500" />
                </div>
                <p className="text-gray-400 mb-2">No invoices found</p>
                <p className="text-gray-500 text-sm">Create your first invoice to get started</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-4 px-4 text-gray-400 font-medium">Invoice ID</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-medium">Title</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-medium">Client</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-medium">Amount</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-medium">Status</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-medium">Due Date</th>
                      <th className="text-right py-4 px-4 text-gray-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvoices.map((invoice) => (
                      <tr key={invoice.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-4">
                      <span className="text-purple-400 font-mono text-sm">
                        {invoice.invoice_number}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-white font-medium">{invoice.title}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-300">{invoice.client_name || 'N/A'}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-white font-semibold">
                        {formatCurrency(invoice.total_amount, invoice.currency)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(invoice.status)}`}>
                        <span>{getStatusIcon(invoice.status)}</span>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-300">{formatDate(invoice.due_date)}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="View">
                          <Eye className="w-4 h-4 text-gray-400" />
                        </button>
                        {invoice.status === 'draft' && (
                          <>
                            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Edit">
                              <Edit className="w-4 h-4 text-gray-400" />
                            </button>
                            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Send">
                              <Send className="w-4 h-4 text-blue-400" />
                            </button>
                          </>
                        )}
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Download">
                          <Download className="w-4 h-4 text-gray-400" />
                        </button>
                        {invoice.status === 'draft' && (
                          <button className="p-2 hover:bg-red-500/20 rounded-lg transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        )}
                      </div>
                    </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </main>
      </div>

      {/* Create Invoice Modal */}
      <CreateInvoiceModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onInvoiceCreated={(newInvoice) => {
          fetchStats();
          fetchInvoices();
        }}
      />
    </div>
  );
}
