'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Sparkles, 
  LayoutGrid, 
  List, 
  Calendar,
  Flag,
  User,
  Clock,
  ChevronRight,
  X,
  Paperclip,
  MessageCircle,
  MoreVertical,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  FolderGit2,
  ChevronDown
} from 'lucide-react';
import Sidebar from '../../components/dashboard/Sidebar';
import AIAssistant from '../../components/dashboard/AIAssistant';
import { useKanban } from '../../context/KanbanContext';
import { useProjects } from '../../context/ProjectContext';

export default function KanbanPage() {
  const { tasks: allTasks, updateTaskStatus } = useKanban();
  const { projects, activeProjectId, setActiveProjectId } = useProjects();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState('board'); // 'board' or 'list'
  const [showInsights, setShowInsights] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Auto-close insights sidebar after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInsights(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);

  // Filter tasks by active project
  const projectTasks = activeProjectId 
    ? allTasks.filter(t => t.projectId === activeProjectId)
    : allTasks;

  // Organize tasks by status
  const tasksByStatus = {
    todo: projectTasks.filter(t => t.status === 'todo'),
    inProgress: projectTasks.filter(t => t.status === 'inProgress'),
    review: projectTasks.filter(t => t.status === 'review'),
    completed: projectTasks.filter(t => t.status === 'completed')
  };

  const columns = [
    { id: 'todo', title: 'To Do', color: 'from-gray-500 to-gray-600', count: tasksByStatus.todo.length },
    { id: 'inProgress', title: 'In Progress', color: 'from-blue-500 to-indigo-600', count: tasksByStatus.inProgress.length },
    { id: 'review', title: 'Review', color: 'from-amber-500 to-orange-600', count: tasksByStatus.review.length },
    { id: 'completed', title: 'Completed', color: 'from-green-500 to-emerald-600', count: tasksByStatus.completed.length }
  ];

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTotalTasks = () => {
    return allTasks.length;
  };

  const getTasksDueToday = () => {
    const today = new Date().toISOString().split('T')[0];
    return allTasks.filter(task => task.deadline === today).length;
  };

  const handleAISort = () => {
    // AI Sort logic would go here
    console.log('AI Sort triggered');
  };

  // Move task to different column
  const handleMoveTask = (taskId, newStatus) => {
    updateTaskStatus(taskId, newStatus);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProjectDropdown && !event.target.closest('.project-dropdown-container')) {
        setShowProjectDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProjectDropdown]);

  return (
    <div className="min-h-screen bg-[#0f0f23] dark:bg-[#0f0f23] light:bg-gray-50 text-white dark:text-white light:text-gray-900 transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar onToggle={setIsCollapsed} />

      {/* Main Kanban Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        <div className="sticky top-0 z-30 bg-[#0f0f23]/80 dark:bg-[#0f0f23]/80 light:bg-white/80 backdrop-blur-xl border-b border-white/5 dark:border-white/5 light:border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-1">Kanban Board</h1>
              <p className="text-gray-400 dark:text-gray-400 light:text-gray-600">Manage your tasks visually</p>
            </div>
            
            {/* Project Switcher */}
            <div className="relative project-dropdown-container">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                className="flex items-center gap-3 px-4 py-2.5 bg-white/5 dark:bg-white/5 light:bg-gray-100 border border-white/10 dark:border-white/10 light:border-gray-300 rounded-lg hover:bg-white/10 transition-all"
              >
                <FolderGit2 className="w-5 h-5 text-indigo-400" />
                <div className="text-left">
                  <p className="text-xs text-gray-400">Current Project</p>
                  <p className="font-semibold text-sm">
                    {activeProjectId 
                      ? projects.find(p => p.id === activeProjectId)?.name || 'All Tasks'
                      : 'All Tasks'}
                  </p>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${showProjectDropdown ? 'rotate-180' : ''}`} />
              </motion.button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {showProjectDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-80 bg-[#1a1a2e] border border-white/10 rounded-lg shadow-xl overflow-hidden z-50"
                  >
                    {/* All Tasks Option */}
                    <button
                      onClick={() => {
                        setActiveProjectId(null);
                        setShowProjectDropdown(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-white/5 transition-colors border-b border-white/5 ${
                        !activeProjectId ? 'bg-indigo-600/20 border-l-4 border-l-indigo-500' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <LayoutGrid className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-semibold">All Tasks</p>
                          <p className="text-xs text-gray-400">{allTasks.length} total tasks</p>
                        </div>
                      </div>
                    </button>

                    {/* Project List */}
                    <div className="max-h-96 overflow-y-auto">
                      {projects.length > 0 ? (
                        projects.map((project) => (
                          <button
                            key={project.id}
                            onClick={() => {
                              setActiveProjectId(project.id);
                              setShowProjectDropdown(false);
                            }}
                            className={`w-full px-4 py-3 text-left hover:bg-white/5 transition-colors border-b border-white/5 ${
                              activeProjectId === project.id ? 'bg-indigo-600/20 border-l-4 border-l-indigo-500' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <FolderGit2 className="w-5 h-5 text-indigo-400 mt-0.5" />
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold truncate">{project.name}</p>
                                <p className="text-xs text-gray-400 truncate">{project.type}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={`text-xs px-2 py-0.5 rounded ${
                                    project.priority === 'High' ? 'bg-red-500/20 text-red-400' :
                                    project.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                    'bg-green-500/20 text-green-400'
                                  }`}>
                                    {project.priority}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {allTasks.filter(t => t.projectId === project.id).length} tasks
                                  </span>
                                </div>
                              </div>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-8 text-center text-gray-500">
                          <FolderGit2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
                          <p className="text-sm">No projects yet</p>
                          <p className="text-xs mt-1">Create a project in Workplace</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Toolbar Actions */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Add Task Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddTask(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Task
            </motion.button>

            {/* Search Bar */}
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 dark:bg-white/5 light:bg-gray-100 border border-white/10 dark:border-white/10 light:border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm"
              />
            </div>

            {/* Filter Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2.5 bg-white/5 dark:bg-white/5 light:bg-gray-100 rounded-lg hover:bg-white/10 transition flex items-center gap-2 border border-white/10 dark:border-white/10 light:border-gray-300"
            >
              <Filter className="w-4 h-4" />
              Filter
            </motion.button>

            {/* AI Sort Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAISort}
              className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              AI Sort
            </motion.button>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 p-6 overflow-x-auto">
          <div className="flex gap-6 min-w-max">
            {columns.map((column) => (
              <motion.div
                key={column.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-shrink-0 w-80"
              >
                {/* Column Header */}
                <div className="mb-4">
                  <div className={`bg-linear-to-r ${column.color} rounded-lg p-4 shadow-lg`}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-white">{column.title}</h3>
                      <span className="px-2.5 py-1 bg-white/20 rounded-full text-sm font-medium text-white">
                        {column.count}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tasks List */}
                <div className="space-y-3 min-h-[200px]">
                  <AnimatePresence>
                    {tasksByStatus[column.id].map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        onClick={() => setSelectedTask(task)}
                        className="bg-[#1a1a35] dark:bg-[#1a1a35] light:bg-white rounded-xl p-4 border border-white/10 dark:border-white/10 light:border-gray-200 cursor-pointer hover:border-indigo-500/50 transition-all group shadow-lg"
                      >
                        {/* Task Header */}
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-semibold text-white dark:text-white light:text-gray-900 group-hover:text-indigo-400 transition pr-2">
                            {task.title}
                          </h4>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="opacity-0 group-hover:opacity-100 transition p-1 hover:bg-white/10 rounded"
                          >
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                          </motion.button>
                        </div>

                        {/* Project Name Tag */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="px-2.5 py-1 bg-indigo-500/20 rounded-md text-xs font-medium text-indigo-400 border border-indigo-500/30">
                            {task.projectName || 'Project'}
                          </div>
                        </div>

                        {/* Priority & Deadline */}
                        <div className="flex items-center justify-between mb-3">
                          <div className={`px-2.5 py-1 rounded-md text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                            <Flag className="w-3 h-3 inline mr-1" />
                            {task.priority}
                          </div>
                          {task.deadline && (
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <Calendar className="w-3 h-3" />
                              {task.deadline}
                            </div>
                          )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-white/5 dark:border-white/5 light:border-gray-200">
                          <div className="flex items-center gap-3 text-xs text-gray-400">
                            {task.subtasks && task.subtasks.length > 0 && (
                              <div className="flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                {task.subtasks.length} subtasks
                              </div>
                            )}
                          </div>
                          
                          {/* AI Help Button */}
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-2 py-1 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-md text-xs font-medium text-indigo-400 border border-indigo-500/30 hover:border-indigo-500/50 transition flex items-center gap-1"
                          >
                            <Sparkles className="w-3 h-3" />
                            AI Help
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Add Task to Column */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full p-4 border-2 border-dashed border-white/10 dark:border-white/10 light:border-gray-300 rounded-xl hover:border-indigo-500/50 transition-all flex items-center justify-center gap-2 text-gray-400 hover:text-indigo-400"
                  >
                    <Plus className="w-4 h-4" />
                    Add Task
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Insights */}
      <AnimatePresence>
        {showInsights && (
          <motion.div
            initial={{ x: 320 }}
            animate={{ x: 0 }}
            exit={{ x: 320 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed right-0 top-0 h-screen w-80 bg-[#0a0a1f] dark:bg-[#0a0a1f] light:bg-white border-l border-white/5 dark:border-white/5 light:border-gray-200 p-6 overflow-y-auto z-40"
          >
            {/* Close Button */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Quick Insights</h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowInsights(false)}
                className="p-2 hover:bg-white/5 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Insights Cards */}
            <div className="space-y-4">
              {/* Total Tasks */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-linear-to-br from-indigo-600/20 to-purple-600/20 rounded-xl p-4 border border-indigo-500/30"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Total Tasks</span>
                  <TrendingUp className="w-4 h-4 text-indigo-400" />
                </div>
                <p className="text-3xl font-bold text-white">{getTotalTasks()}</p>
              </motion.div>

              {/* Tasks Due Today */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-linear-to-br from-amber-600/20 to-orange-600/20 rounded-xl p-4 border border-amber-500/30"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Due Today</span>
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-3xl font-bold text-white">{getTasksDueToday()}</p>
              </motion.div>

              {/* AI Suggestions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[#1a1a35] dark:bg-[#1a1a35] light:bg-gray-50 rounded-xl p-4 border border-white/10 dark:border-white/10 light:border-gray-200"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <h4 className="font-semibold text-sm">AI Suggestions</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-sm">
                    <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-400 dark:text-gray-400 light:text-gray-600">
                      3 tasks are approaching deadline. Consider reprioritizing.
                    </p>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <Sparkles className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-400 dark:text-gray-400 light:text-gray-600">
                      AI can help write blog post content for ContentHub project.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-[#1a1a35] dark:bg-[#1a1a35] light:bg-gray-50 rounded-xl p-4 border border-white/10 dark:border-white/10 light:border-gray-200"
              >
                <h4 className="font-semibold text-sm mb-3">Recent Activity</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-gray-400 dark:text-gray-400 light:text-gray-600">Task completed: Social Media Graphics</p>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <p className="text-gray-400 dark:text-gray-400 light:text-gray-600">Task moved to Review: Mobile App Prototype</p>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <p className="text-gray-400 dark:text-gray-400 light:text-gray-600">New comment on E-commerce Dashboard</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Insights Button (when hidden) */}
      {!showInsights && (
        <motion.button
          initial={{ x: 100 }}
          animate={{ x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowInsights(true)}
          className="fixed right-6 top-6 p-3 bg-indigo-600 rounded-lg shadow-lg z-40 hover:bg-indigo-700 transition"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      )}

      {/* AI Assistant Widget */}
      <AIAssistant />

      {/* Task Details Modal */}
      <AnimatePresence>
        {selectedTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedTask(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1a1a35] dark:bg-[#1a1a35] light:bg-white rounded-2xl border border-white/10 dark:border-white/10 light:border-gray-200 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-white/10 dark:border-white/10 light:border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">{selectedTask.title}</h2>
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="px-3 py-1 bg-indigo-500/20 rounded-md text-sm font-medium text-indigo-400 border border-indigo-500/30">
                        {selectedTask.client}
                      </div>
                      <div className={`px-3 py-1 rounded-md text-sm font-medium border ${getPriorityColor(selectedTask.priority)}`}>
                        {selectedTask.priority} Priority
                      </div>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedTask(null)}
                    className="p-2 hover:bg-white/5 rounded-lg transition"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 mb-2">Description</h3>
                  <p className="text-gray-300 dark:text-gray-300 light:text-gray-700">{selectedTask.description}</p>
                </div>

                {/* Subtasks */}
                {selectedTask.subtasks && selectedTask.subtasks.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">Subtasks</h3>
                    <ul className="space-y-2">
                      {selectedTask.subtasks.map((subtask, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-300">
                          <CheckCircle2 className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                          <span className="text-sm">{subtask}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Status Change Buttons */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 mb-3">Move to</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        handleMoveTask(selectedTask.id, 'todo');
                        setSelectedTask(null);
                      }}
                      disabled={selectedTask.status === 'todo'}
                      className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                        selectedTask.status === 'todo'
                          ? 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
                          : 'bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 border border-gray-500/30'
                      }`}
                    >
                      📋 To Do
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        handleMoveTask(selectedTask.id, 'inProgress');
                        setSelectedTask(null);
                      }}
                      disabled={selectedTask.status === 'inProgress'}
                      className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                        selectedTask.status === 'inProgress'
                          ? 'bg-blue-500/20 text-blue-500 cursor-not-allowed'
                          : 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      🔄 In Progress
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        handleMoveTask(selectedTask.id, 'review');
                        setSelectedTask(null);
                      }}
                      disabled={selectedTask.status === 'review'}
                      className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                        selectedTask.status === 'review'
                          ? 'bg-amber-500/20 text-amber-500 cursor-not-allowed'
                          : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      👁️ Review
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        handleMoveTask(selectedTask.id, 'completed');
                        setSelectedTask(null);
                      }}
                      disabled={selectedTask.status === 'completed'}
                      className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                        selectedTask.status === 'completed'
                          ? 'bg-green-500/20 text-green-500 cursor-not-allowed'
                          : 'bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30'
                      }`}
                    >
                      ✅ Completed
                    </motion.button>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {selectedTask.deadline && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-400 mb-2">Deadline</h3>
                      <div className="flex items-center gap-2 text-gray-300">
                        <Calendar className="w-4 h-4 text-indigo-400" />
                        <span className="text-sm">{selectedTask.deadline}</span>
                      </div>
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">Project</h3>
                    <div className="flex items-center gap-2 text-gray-300">
                      <span className="text-sm">{selectedTask.projectName || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* AI Help Section */}
                <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-xl p-4 border border-indigo-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <h3 className="text-sm font-semibold">AI Assistant</h3>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">
                    Get AI help with task completion, content generation, or workflow optimization.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition"
                  >
                    Get AI Help
                  </motion.button>
                </div>

                {/* Attachments & Comments */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
                      <Paperclip className="w-4 h-4" />
                      Attachments ({selectedTask.attachments})
                    </h3>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Comments ({selectedTask.comments})
                    </h3>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
