'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ChevronRight, 
  ChevronLeft,
  Plus,
  Trash2,
  FileText,
  Calendar,
  DollarSign,
  Eye,
  Send,
  Save
} from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Basic Details', icon: FileText },
  { id: 2, title: 'Line Items', icon: DollarSign },
  { id: 3, title: 'Payment Details', icon: Calendar },
  { id: 4, title: 'Preview & Send', icon: Eye }
];

export default function CreateInvoiceModal({ isOpen, onClose, onInvoiceCreated }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  
  // Form data
  const [formData, setFormData] = useState({
    // Step 1: Basic Details
    project_id: '',
    client_id: '',
    client_name: '',
    title: '',
    
    // Step 2: Line Items
    items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
    
    // Step 3: Payment Details
    due_date: '',
    currency: 'USD',
    tax_rate: 0,
    notes: '',
    payment_method: 'bank_transfer',
    
    // Calculated
    subtotal: 0,
    tax_amount: 0,
    total_amount: 0
  });

  useEffect(() => {
    if (isOpen) {
      // Fetch projects for the dropdown
      fetchProjects();
    }
  }, [isOpen]);

  useEffect(() => {
    // Calculate totals whenever items or tax_rate changes
    calculateTotals();
  }, [formData.items, formData.tax_rate]);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      // TODO: Replace with actual projects API endpoint
      // For now, using mock data
      setProjects([
        { id: '1', name: 'Website Redesign', client_name: 'Tech Corp' },
        { id: '2', name: 'Mobile App Development', client_name: 'StartupXYZ' },
        { id: '3', name: 'Brand Identity Design', client_name: 'Fashion Brand' }
      ]);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + (item.amount || 0), 0);
    const tax_amount = (subtotal * formData.tax_rate) / 100;
    const total_amount = subtotal + tax_amount;

    setFormData(prev => ({
      ...prev,
      subtotal,
      tax_amount,
      total_amount
    }));
  };

  const handleProjectChange = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setFormData(prev => ({
        ...prev,
        project_id: projectId,
        client_name: project.client_name,
        title: `Invoice for ${project.name}`
      }));
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    
    // Auto-calculate amount
    if (field === 'quantity' || field === 'rate') {
      newItems[index].amount = (newItems[index].quantity || 0) * (newItems[index].rate || 0);
    }
    
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, rate: 0, amount: 0 }]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async (asDraft = false) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          status: asDraft ? 'draft' : 'sent'
        })
      });

      if (response.ok) {
        const data = await response.json();
        onInvoiceCreated(data);
        onClose();
        resetForm();
      } else {
        const error = await response.json();
        alert(`Failed to create invoice: ${error.message}`);
      }
    } catch (error) {
      console.error('Failed to create invoice:', error);
      alert('Failed to create invoice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setFormData({
      project_id: '',
      client_id: '',
      client_name: '',
      title: '',
      items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
      due_date: '',
      currency: 'USD',
      tax_rate: 0,
      notes: '',
      payment_method: 'bank_transfer',
      subtotal: 0,
      tax_amount: 0,
      total_amount: 0
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: formData.currency
    }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Create Invoice</h2>
            <p className="text-gray-400 text-sm mt-1">Step {currentStep} of 4</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    currentStep >= step.id 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                      : 'bg-white/5 text-gray-500'
                  }`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <div className="hidden md:block">
                    <p className={`font-medium text-sm ${
                      currentStep >= step.id ? 'text-white' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-white/10'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {/* Step 1: Basic Details */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Select Project *
                  </label>
                  <select
                    value={formData.project_id}
                    onChange={(e) => handleProjectChange(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    required
                  >
                    <option value="">Choose a project...</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name} - {project.client_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={formData.client_name}
                    readOnly
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 cursor-not-allowed"
                    placeholder="Auto-filled from project"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Invoice Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    placeholder="e.g., Website Development - Phase 1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 resize-none"
                    rows="3"
                    placeholder="Add any additional details..."
                  />
                </div>
              </motion.div>
            )}

            {/* Step 2: Line Items */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Invoice Items</h3>
                  <button
                    onClick={addItem}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-xl hover:bg-purple-600/30 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Item
                  </button>
                </div>

                {formData.items.map((item, index) => (
                  <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-sm font-medium text-gray-400">Item #{index + 1}</span>
                      {formData.items.length > 1 && (
                        <button
                          onClick={() => removeItem(index)}
                          className="p-1 hover:bg-red-500/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Description *
                        </label>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
                          placeholder="e.g., Frontend Development"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Quantity/Hours *
                        </label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Rate ({formData.currency}) *
                        </label>
                        <input
                          type="number"
                          value={item.rate}
                          onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <span className="text-sm text-gray-400">Amount:</span>
                      <span className="text-lg font-semibold text-white">
                        {formatCurrency(item.amount)}
                      </span>
                    </div>
                  </div>
                ))}

                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-4 mt-6">
                  <div className="flex items-center justify-between text-xl font-bold">
                    <span className="text-white">Subtotal:</span>
                    <span className="text-white">{formatCurrency(formData.subtotal)}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Payment Details */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Due Date *
                    </label>
                    <input
                      type="date"
                      value={formData.due_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Currency *
                    </label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="INR">INR - Indian Rupee</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    value={formData.tax_rate}
                    onChange={(e) => setFormData(prev => ({ ...prev, tax_rate: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Payment Method
                  </label>
                  <select
                    value={formData.payment_method}
                    onChange={(e) => setFormData(prev => ({ ...prev, payment_method: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="paypal">PayPal</option>
                    <option value="stripe">Stripe</option>
                    <option value="crypto">Cryptocurrency</option>
                    <option value="cash">Cash</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 resize-none"
                    rows="4"
                    placeholder="Payment instructions, terms & conditions, etc."
                  />
                </div>
              </motion.div>
            )}

            {/* Step 4: Preview & Send */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  {/* Invoice Preview Header */}
                  <div className="border-b border-white/10 pb-6 mb-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">INVOICE</h3>
                        <p className="text-gray-400">Will be auto-generated</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Issue Date</p>
                        <p className="text-white font-medium">{new Date().toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Bill To */}
                  <div className="mb-6">
                    <p className="text-sm text-gray-400 mb-2">Bill To:</p>
                    <p className="text-white font-semibold text-lg">{formData.client_name || 'Client Name'}</p>
                    <p className="text-gray-300">{formData.title}</p>
                  </div>

                  {/* Items Table */}
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
                        {formData.items.map((item, index) => (
                          <tr key={index} className="border-b border-white/5">
                            <td className="py-3 text-white">{item.description}</td>
                            <td className="py-3 text-gray-300 text-right">{item.quantity}</td>
                            <td className="py-3 text-gray-300 text-right">{formatCurrency(item.rate)}</td>
                            <td className="py-3 text-white font-medium text-right">{formatCurrency(item.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-gray-300">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(formData.subtotal)}</span>
                    </div>
                    {formData.tax_rate > 0 && (
                      <div className="flex items-center justify-between text-gray-300">
                        <span>Tax ({formData.tax_rate}%):</span>
                        <span>{formatCurrency(formData.tax_amount)}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-xl font-bold text-white pt-4 border-t border-white/10">
                      <span>Total:</span>
                      <span>{formatCurrency(formData.total_amount)}</span>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Due Date:</p>
                        <p className="text-white font-medium">{formData.due_date || 'Not set'}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Payment Method:</p>
                        <p className="text-white font-medium capitalize">{formData.payment_method.replace('_', ' ')}</p>
                      </div>
                    </div>
                    {formData.notes && (
                      <div className="mt-4">
                        <p className="text-gray-400 text-sm">Notes:</p>
                        <p className="text-white text-sm mt-1">{formData.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          <div className="flex items-center gap-3">
            {currentStep === 4 ? (
              <>
                <button
                  onClick={() => handleSubmit(true)}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  Save as Draft
                </button>
                <button
                  onClick={() => handleSubmit(false)}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                  Send to Client
                </button>
              </>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
