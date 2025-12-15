'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Search,
  Download,
  Eye,
  CreditCard,
  FileText
} from 'lucide-react';
import Sidebar from '@/app/components/dashboard/Sidebar';
import TopNavbar from '@/app/components/dashboard/TopNavbar';
import { userAPI, isAuthenticated } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function ClientPaymentsPage() {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState({
    name: 'User',
    role: 'Client',
    avatar: '👤',
    status: 'Online'
  });
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState({
    total_pending: 0,
    total_paid: 0,
    overdue_count: 0
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

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
          const profile = userData.client_profile || userData.profile;

          setUser({
            id: userData.id,
            name: profile?.company_name || profile?.displayName || userData.email.split('@')[0],
            role: 'Client',
            avatar: profile?.avatarUrl || '👤',
            status: 'Online',
            email: userData.email,
            user_type: userData.user_type || userData.userType || 'client'
          });
        }
        
        await fetchInvoices();
      } catch (error) {
        console.error('Failed to load user data:', error);
        setLoading(false);
      }
    };

    loadUserData();
  }, [router]);

  useEffect(() => {
    calculateStats();
  }, [invoices]);

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

  const calculateStats = () => {
    const total_pending = invoices
      .filter(inv => inv.status === 'sent' || inv.status === 'overdue')
      .reduce((sum, inv) => sum + parseFloat(inv.total_amount), 0);
    
    const total_paid = invoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + parseFloat(inv.total_amount), 0);
    
    const overdue_count = invoices.filter(inv => inv.status === 'overdue').length;

    setStats({ total_pending, total_paid, overdue_count });
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
                         invoice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.freelancer_name?.toLowerCase().includes(searchTerm.toLowerCase());
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

  const handleViewInvoice = async (invoiceId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/invoices/${invoiceId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch invoice details');
      }
      
      const data = await response.json();
      setSelectedInvoice(data);
      setShowInvoiceModal(true);
    } catch (error) {
      console.error('Failed to fetch invoice details:', error);
      alert('Failed to load invoice. Please try again.');
    }
  };

  const handleMarkAsPaid = async (invoiceId) => {
    if (!confirm('Are you sure you want to mark this invoice as paid?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/invoices/${invoiceId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'paid' })
      });

      if (response.ok) {
        fetchInvoices();
        alert('Invoice marked as paid successfully!');
      }
    } catch (error) {
      console.error('Failed to update invoice:', error);
      alert('Failed to mark invoice as paid. Please try again.');
    }
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
            <h1 className="text-3xl font-bold text-white mb-2">Payments & Invoices</h1>
            <p className="text-gray-400">View and manage your invoices from freelancers</p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Pending */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
            >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Pending Payments</h3>
          <p className="text-3xl font-bold text-white">
            {formatCurrency(stats.total_pending)}
          </p>
          <p className="text-blue-400 text-sm mt-2">Awaiting payment</p>
        </motion.div>

            {/* Total Paid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
            >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Total Paid</h3>
          <p className="text-3xl font-bold text-white">
            {formatCurrency(stats.total_paid)}
          </p>
          <p className="text-green-400 text-sm mt-2">All time</p>
        </motion.div>

            {/* Overdue */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
            >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Overdue Invoices</h3>
          <p className="text-3xl font-bold text-white">
            {stats.overdue_count}
          </p>
              <p className="text-red-400 text-sm mt-2">Needs attention</p>
            </motion.div>
          </div>

          {/* Invoices Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all"
          >
            {/* Table Header Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h2 className="text-xl font-bold text-white">Your Invoices</h2>
              
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
                  <option value="sent" className="bg-gray-900 text-white">Sent</option>
                  <option value="paid" className="bg-gray-900 text-white">Paid</option>
                  <option value="overdue" className="bg-gray-900 text-white">Overdue</option>
                </select>
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
                  <FileText className="w-10 h-10 text-gray-500" />
                </div>
                <p className="text-gray-400 mb-2">No invoices found</p>
                <p className="text-gray-500 text-sm">You don't have any invoices yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-4 px-4 text-gray-400 font-medium">Invoice ID</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-medium">Title</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-medium">Freelancer</th>
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
                          <span className="text-gray-300">{invoice.freelancer_name || 'N/A'}</span>
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
                            <button 
                              onClick={() => handleViewInvoice(invoice.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-lg hover:bg-purple-600/30 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                            {(invoice.status === 'sent' || invoice.status === 'overdue') && (
                              <button 
                                onClick={() => handleMarkAsPaid(invoice.id)}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-600/30 transition-colors"
                              >
                                <CreditCard className="w-4 h-4" />
                                Pay Now
                              </button>
                            )}
                            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Download">
                              <Download className="w-4 h-4 text-gray-400" />
                            </button>
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

      {/* Invoice Detail Modal */}
      {showInvoiceModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0f0f23] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-white/10 pb-6 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">INVOICE</h2>
                  <p className="text-purple-400 font-mono">{selectedInvoice.invoice_number}</p>
                </div>
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <span className="text-gray-400 text-xl">×</span>
                </button>
              </div>

              {/* Invoice Details */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-400 mb-1">From:</p>
                  <p className="text-white font-semibold">{selectedInvoice.freelancer_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Issue Date:</p>
                  <p className="text-white">{formatDate(selectedInvoice.issue_date)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Bill To:</p>
                  <p className="text-white font-semibold">{selectedInvoice.client_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Due Date:</p>
                  <p className="text-white">{formatDate(selectedInvoice.due_date)}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">{selectedInvoice.title}</h3>
                {selectedInvoice.description && (
                  <p className="text-gray-400">{selectedInvoice.description}</p>
                )}
              </div>

              {/* Items */}
              <div className="mb-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 text-gray-400 font-medium">Description</th>
                      <th className="text-right py-3 text-gray-400 font-medium">Qty</th>
                      <th className="text-right py-3 text-gray-400 font-medium">Rate</th>
                      <th className="text-right py-3 text-gray-400 font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.items?.map((item, index) => (
                      <tr key={index} className="border-b border-white/5">
                        <td className="py-3 text-white">{item.description}</td>
                        <td className="py-3 text-gray-300 text-right">{item.quantity}</td>
                        <td className="py-3 text-gray-300 text-right">{formatCurrency(item.rate, selectedInvoice.currency)}</td>
                        <td className="py-3 text-white font-medium text-right">{formatCurrency(item.amount, selectedInvoice.currency)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-gray-300">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(selectedInvoice.subtotal, selectedInvoice.currency)}</span>
                  </div>
                  {selectedInvoice.tax_rate > 0 && (
                    <div className="flex items-center justify-between text-gray-300">
                      <span>Tax ({selectedInvoice.tax_rate}%):</span>
                      <span>{formatCurrency(selectedInvoice.tax_amount, selectedInvoice.currency)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-xl font-bold text-white pt-4 border-t border-white/10">
                    <span>Total:</span>
                    <span>{formatCurrency(selectedInvoice.total_amount, selectedInvoice.currency)}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedInvoice.notes && (
                <div className="mb-6">
                  <p className="text-sm text-gray-400 mb-2">Notes:</p>
                  <p className="text-white text-sm bg-white/5 border border-white/10 rounded-xl p-4">
                    {selectedInvoice.notes}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  className="flex-1 px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
                >
                  Close
                </button>
                {(selectedInvoice.status === 'sent' || selectedInvoice.status === 'overdue') && (
                  <button
                    onClick={() => {
                      handleMarkAsPaid(selectedInvoice.id);
                      setShowInvoiceModal(false);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all"
                  >
                    <CreditCard className="w-5 h-5" />
                    Mark as Paid
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
