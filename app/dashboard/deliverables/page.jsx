'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  Video, 
  Image as ImageIcon, 
  Code, 
  FileArchive, 
  File, 
  Link as LinkIcon,
  Download,
  Trash2,
  Check,
  X,
  Clock,
  AlertCircle,
  CheckCircle2,
  MessageSquare,
  Send,
  Sparkles,
  Calendar,
  Eye,
  Edit3,
  Plus,
  History,
  Package,
  Target,
  TrendingUp,
  Zap,
  ExternalLink,
  GitBranch,
  User,
  Users,
  ArrowRight,
  PlayCircle,
  PauseCircle,
  RefreshCw
} from 'lucide-react';
import Sidebar from '../../components/dashboard/Sidebar';
import AIAssistant from '../../components/dashboard/AIAssistant';
import { useProjects } from '../../context/ProjectContext';

export default function DeliverablesPage() {
  const { projects } = useProjects();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [clientComments, setClientComments] = useState([
    {
      id: 1,
      author: 'Client Name',
      avatar: '👤',
      comment: 'Looking forward to seeing the first draft!',
      timestamp: new Date(Date.now() - 86400000),
      type: 'comment'
    }
  ]);
  const [newComment, setNewComment] = useState('');
  const [revisionHistory, setRevisionHistory] = useState([
    {
      id: 1,
      version: 'V1',
      status: 'Approved',
      submittedAt: new Date(Date.now() - 172800000),
      files: 3,
      notes: 'Initial submission with core features'
    }
  ]);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [isRunningAICheck, setIsRunningAICheck] = useState(false);
  const [aiInsights, setAIInsights] = useState(null);
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  // Mock project for demonstration (will use real projects later)
  const mockProject = {
    id: 1,
    name: 'Portfolio Website for Client X',
    type: 'Web Development',
    deadline: new Date(Date.now() + 604800000), // 7 days from now
    status: 'In Progress',
    progress: 65,
    client: {
      name: 'John Doe',
      email: 'john@example.com',
      company: 'Tech Corp'
    }
  };

  const currentProject = selectedProject || mockProject;

  // Calculate deadline info
  const getDeadlineInfo = () => {
    const now = new Date();
    const deadline = new Date(currentProject.deadline);
    const diffTime = deadline - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    
    if (diffDays > 7) {
      return { text: `${diffDays} days remaining`, color: 'text-green-400', urgent: false };
    } else if (diffDays > 3) {
      return { text: `${diffDays} days remaining`, color: 'text-yellow-400', urgent: false };
    } else if (diffDays > 0) {
      return { text: `${diffDays} days remaining`, color: 'text-orange-400', urgent: true };
    } else if (diffHours > 0) {
      return { text: `${diffHours} hours remaining`, color: 'text-red-400', urgent: true };
    } else {
      return { text: 'Overdue', color: 'text-red-500', urgent: true };
    }
  };

  const deadlineInfo = getDeadlineInfo();

  // File handling
  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    if (['mp4', 'avi', 'mov', 'mkv', 'webm'].includes(extension)) return Video;
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension)) return ImageIcon;
    if (['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'py', 'java', 'cpp'].includes(extension)) return Code;
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) return FileArchive;
    if (['pdf', 'doc', 'docx'].includes(extension)) return FileText;
    return File;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleFileUpload = (files) => {
    const newFiles = Array.from(files).map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date(),
      file: file
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleSubmit = () => {
    if (uploadedFiles.length === 0) {
      alert('Please upload at least one file before submitting.');
      return;
    }
    
    const newRevision = {
      id: revisionHistory.length + 1,
      version: `V${revisionHistory.length + 1}`,
      status: 'Pending Review',
      submittedAt: new Date(),
      files: uploadedFiles.length,
      notes: submissionNotes
    };
    
    setRevisionHistory(prev => [newRevision, ...prev]);
    
    // Add system comment
    const systemComment = {
      id: clientComments.length + 1,
      author: 'System',
      avatar: '🤖',
      comment: `New submission uploaded: ${newRevision.version} with ${uploadedFiles.length} file(s)`,
      timestamp: new Date(),
      type: 'system'
    };
    setClientComments(prev => [...prev, systemComment]);
    
    // Reset
    setUploadedFiles([]);
    setSubmissionNotes('');
    
    alert('Deliverable submitted successfully! Client will be notified.');
  };

  const runAICheck = async () => {
    setIsRunningAICheck(true);
    setShowAIInsights(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      setAIInsights({
        overallScore: 85,
        strengths: [
          'Well-organized file structure',
          'All required assets included',
          'Professional naming convention'
        ],
        suggestions: [
          'Consider adding a README.md for documentation',
          'Compress images to reduce file size',
          'Include deployment instructions'
        ],
        missingAssets: [
          'favicon.ico',
          'Social media preview images'
        ],
        handoverMessage: `Hi ${currentProject.client?.name || 'Client'},\n\nI'm excited to share the completed ${currentProject.name} with you! This submission includes all the deliverables we discussed:\n\n• ${uploadedFiles.length} files/assets\n• Fully responsive design\n• Cross-browser tested\n\nPlease review and let me know if you need any adjustments. Looking forward to your feedback!\n\nBest regards`
      });
      setIsRunningAICheck(false);
    }, 2000);
  };

  const addComment = () => {
    if (!newComment.trim()) return;
    
    const comment = {
      id: clientComments.length + 1,
      author: 'You',
      avatar: '👨‍💻',
      comment: newComment,
      timestamp: new Date(),
      type: 'comment'
    };
    
    setClientComments(prev => [...prev, comment]);
    setNewComment('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
      case 'Approved':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'Pending Review':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'In Progress':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'Revisions Requested':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white">
      {/* Sidebar */}
      <Sidebar onToggle={setIsCollapsed} />

      {/* Main Content */}
      <div 
        className="transition-all duration-300 ease-in-out min-h-screen"
        style={{ marginLeft: isCollapsed ? '80px' : '256px' }}
      >
        {/* Header Section */}
        <div className="p-8 pb-6 border-b border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center"
                  >
                    <Package className="w-6 h-6" />
                  </motion.div>
                  <div>
                    <h1 className="text-3xl font-bold">{currentProject.name}</h1>
                    <p className="text-gray-400 text-sm mt-1">{currentProject.type}</p>
                  </div>
                </div>
                
                {/* Client Info */}
                {currentProject.client && (
                  <div className="flex items-center gap-2 text-sm text-gray-400 ml-15">
                    <User className="w-4 h-4" />
                    <span>{currentProject.client.name}</span>
                    {currentProject.client.company && (
                      <>
                        <span>•</span>
                        <span>{currentProject.client.company}</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Status Badge */}
              <div className={`px-4 py-2 rounded-lg border text-sm font-medium ${getStatusColor(currentProject.status)}`}>
                {currentProject.status}
              </div>
            </div>

            {/* Deadline Progress Bar */}
            <div className="bg-[#1a1a35] rounded-xl p-5 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock className={`w-5 h-5 ${deadlineInfo.color}`} />
                  <span className="font-medium">Project Deadline</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-sm font-semibold ${deadlineInfo.color}`}>
                    {deadlineInfo.text}
                  </span>
                  <span className="text-sm text-gray-400">
                    {new Date(currentProject.deadline).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="relative h-3 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${currentProject.progress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className={`h-full rounded-full ${
                    currentProject.progress >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                    currentProject.progress >= 50 ? 'bg-gradient-to-r from-blue-500 to-indigo-500' :
                    'bg-gradient-to-r from-orange-500 to-red-500'
                  }`}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-white drop-shadow-lg">
                    {currentProject.progress}% Complete
                  </span>
                </div>
              </div>

              {deadlineInfo.urgent && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 flex items-center gap-2 text-sm text-orange-400"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>Deadline approaching! Prioritize submission.</span>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="p-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Upload & Submission */}
            <div className="lg:col-span-2 space-y-6">
              {/* Upload Panel */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#1a1a35] rounded-xl border border-white/10 overflow-hidden"
              >
                <div className="p-6 border-b border-white/10">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Upload className="w-5 h-5 text-indigo-400" />
                    Upload Deliverables
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    Drag & drop files or click to upload
                  </p>
                </div>

                {/* Drag & Drop Zone */}
                <div
                  ref={dropZoneRef}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`m-6 border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-indigo-500 bg-indigo-500/10'
                      : 'border-white/20 hover:border-indigo-500/50 hover:bg-white/5'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                  />
                  
                  <motion.div
                    animate={{ y: isDragging ? -10 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Upload className={`w-16 h-16 mx-auto mb-4 ${isDragging ? 'text-indigo-400' : 'text-gray-500'}`} />
                    <p className="text-lg font-medium mb-2">
                      {isDragging ? 'Drop files here' : 'Click or drag files to upload'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Support for PDF, ZIP, MP4, DOCX, images, code files, and more
                    </p>
                  </motion.div>
                </div>

                {/* Uploaded Files List */}
                {uploadedFiles.length > 0 && (
                  <div className="p-6 pt-0">
                    <div className="space-y-2">
                      <AnimatePresence>
                        {uploadedFiles.map((file) => {
                          const FileIcon = getFileIcon(file.name);
                          return (
                            <motion.div
                              key={file.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              className="flex items-center gap-3 p-3 bg-[#0f0f23] rounded-lg border border-white/10 hover:border-indigo-500/50 transition-colors group"
                            >
                              <div className="p-2 bg-indigo-500/10 rounded-lg">
                                <FileIcon className="w-5 h-5 text-indigo-400" />
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{file.name}</p>
                                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                              </div>

                              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="p-1.5 hover:bg-white/5 rounded-lg transition-colors"
                                >
                                  <Eye className="w-4 h-4 text-gray-400" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => removeFile(file.id)}
                                  className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4 text-red-400" />
                                </motion.button>
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>

                    {/* AI Check Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={runAICheck}
                      disabled={isRunningAICheck}
                      className="mt-4 w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-700 disabled:to-gray-700 rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
                    >
                      {isRunningAICheck ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          Running AI Review...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          Run AI Quality Check
                        </>
                      )}
                    </motion.button>
                  </div>
                )}
              </motion.div>

              {/* Submission Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-[#1a1a35] rounded-xl border border-white/10 p-6"
              >
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  Submission Notes
                </h3>
                
                <textarea
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  placeholder="Describe your submission, list completed features, or add any notes for the client..."
                  rows="6"
                  className="w-full px-4 py-3 bg-[#0f0f23] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-sm"
                />

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={uploadedFiles.length === 0}
                  className="mt-4 w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold text-lg flex items-center justify-center gap-2 transition-all shadow-lg"
                >
                  <CheckCircle2 className="w-6 h-6" />
                  Mark as Final Submission
                </motion.button>

                {uploadedFiles.length === 0 && (
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Upload at least one file to submit
                  </p>
                )}
              </motion.div>

              {/* AI Insights Panel */}
              <AnimatePresence>
                {showAIInsights && aiInsights && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -20, height: 0 }}
                    className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-xl border border-purple-500/30 p-6 overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-400" />
                        AI Quality Insights
                      </h3>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowAIInsights(false)}
                        className="p-1 hover:bg-white/5 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </motion.button>
                    </div>

                    {/* Overall Score */}
                    <div className="mb-6 p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Overall Quality Score</span>
                        <span className="text-2xl font-bold text-purple-400">{aiInsights.overallScore}/100</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${aiInsights.overallScore}%` }}
                          transition={{ duration: 1, delay: 0.3 }}
                          className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {/* Strengths */}
                      <div>
                        <h4 className="text-sm font-semibold text-green-400 mb-2 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          Strengths
                        </h4>
                        <ul className="space-y-1">
                          {aiInsights.strengths.map((strength, index) => (
                            <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                              <span className="text-green-400 mt-1">•</span>
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Suggestions */}
                      <div>
                        <h4 className="text-sm font-semibold text-yellow-400 mb-2 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Suggestions
                        </h4>
                        <ul className="space-y-1">
                          {aiInsights.suggestions.map((suggestion, index) => (
                            <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                              <span className="text-yellow-400 mt-1">•</span>
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Missing Assets */}
                    {aiInsights.missingAssets.length > 0 && (
                      <div className="mb-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                        <h4 className="text-sm font-semibold text-orange-400 mb-2 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          Potentially Missing Assets
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {aiInsights.missingAssets.map((asset, index) => (
                            <span key={index} className="px-2 py-1 bg-orange-500/20 rounded text-xs text-orange-300">
                              {asset}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Handover Message */}
                    <div>
                      <h4 className="text-sm font-semibold text-indigo-400 mb-2 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        AI-Generated Handover Message
                      </h4>
                      <div className="p-3 bg-white/5 rounded-lg">
                        <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans">
                          {aiInsights.handoverMessage}
                        </pre>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            navigator.clipboard.writeText(aiInsights.handoverMessage);
                            alert('Message copied to clipboard!');
                          }}
                          className="mt-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 rounded text-xs font-medium transition-colors"
                        >
                          Copy to Clipboard
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Column - Feedback & History */}
            <div className="space-y-6">
              {/* Client Feedback */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[#1a1a35] rounded-xl border border-white/10 overflow-hidden"
              >
                <div className="p-4 border-b border-white/10 sticky top-0 bg-[#1a1a35] z-10">
                  <h3 className="font-bold flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-indigo-400" />
                    Client Feedback
                  </h3>
                </div>

                {/* Comments */}
                <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                  <AnimatePresence>
                    {clientComments.map((comment) => (
                      <motion.div
                        key={comment.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={`p-3 rounded-lg ${
                          comment.type === 'system' 
                            ? 'bg-indigo-500/10 border border-indigo-500/30' 
                            : 'bg-[#0f0f23]'
                        }`}
                      >
                        <div className="flex items-start gap-2 mb-2">
                          <span className="text-2xl">{comment.avatar}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-semibold">{comment.author}</span>
                              <span className="text-xs text-gray-500">
                                {new Date(comment.timestamp).toLocaleTimeString('en-US', {
                                  hour: 'numeric',
                                  minute: '2-digit',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                            <p className="text-sm text-gray-300">{comment.comment}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Add Comment */}
                <div className="p-4 border-t border-white/10">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addComment()}
                      placeholder="Add a comment..."
                      className="flex-1 px-3 py-2 bg-[#0f0f23] border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={addComment}
                      disabled={!newComment.trim()}
                      className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-colors"
                    >
                      <Send className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Revision History */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-[#1a1a35] rounded-xl border border-white/10 overflow-hidden"
              >
                <div className="p-4 border-b border-white/10">
                  <h3 className="font-bold flex items-center gap-2">
                    <History className="w-5 h-5 text-indigo-400" />
                    Revision History
                  </h3>
                </div>

                <div className="p-4 space-y-3">
                  {revisionHistory.map((revision, index) => (
                    <motion.div
                      key={revision.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative"
                    >
                      {index !== revisionHistory.length - 1 && (
                        <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-white/10" />
                      )}
                      
                      <div className="flex gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          revision.status === 'Approved' ? 'bg-green-500/20 text-green-400' :
                          revision.status === 'Pending Review' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-orange-500/20 text-orange-400'
                        }`}>
                          {revision.status === 'Approved' ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : revision.status === 'Pending Review' ? (
                            <Clock className="w-5 h-5" />
                          ) : (
                            <Edit3 className="w-5 h-5" />
                          )}
                        </div>

                        <div className="flex-1 pb-4">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold">{revision.version}</span>
                            <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(revision.status)}`}>
                              {revision.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400 mb-2">
                            {new Date(revision.submittedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit'
                            })}
                          </p>
                          <p className="text-xs text-gray-500 mb-2">{revision.notes}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              {revision.files} files
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-xl border border-indigo-500/30 p-4"
              >
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-indigo-400" />
                  Project Stats
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Total Revisions</span>
                    <span className="font-semibold">{revisionHistory.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Files Uploaded</span>
                    <span className="font-semibold">{uploadedFiles.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Client Messages</span>
                    <span className="font-semibold">{clientComments.filter(c => c.type === 'comment').length}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Assistant Widget */}
      <AIAssistant />

      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => fileInputRef.current?.click()}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-2xl flex items-center justify-center z-30 hover:shadow-indigo-500/50"
        style={{ marginLeft: isCollapsed ? '80px' : '256px' }}
      >
        <Plus className="w-8 h-8" />
      </motion.button>
    </div>
  );
}
