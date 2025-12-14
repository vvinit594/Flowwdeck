'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const KanbanContext = createContext();

export function KanbanProvider({ children }) {
  const [tasks, setTasks] = useState([]);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('kanbanTasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('kanbanTasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  // Add new tasks from AI summary
  const addTasksFromAI = (projectId, projectName, aiTasks) => {
    const newTasks = aiTasks.map((task, index) => ({
      id: `task-${Date.now()}-${index}`,
      title: task.title,
      description: task.description || '',
      subtasks: task.subtasks || [],
      deadline: task.deadline || '',
      status: 'todo', // Always start in "To Do" column
      priority: task.priority || 'medium',
      projectId: projectId, // Link to project
      projectName: projectName,
      createdAt: new Date().toISOString()
    }));

    setTasks(prev => [...prev, ...newTasks]);
    return newTasks.length;
  };

  // Update task status (for drag-and-drop or manual change)
  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  // Update task details
  const updateTask = (taskId, updates) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
  };

  // Delete a task
  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  // Clear all tasks
  const clearAllTasks = () => {
    setTasks([]);
    localStorage.removeItem('kanbanTasks');
  };

  return (
    <KanbanContext.Provider
      value={{
        tasks,
        addTasksFromAI,
        updateTaskStatus,
        updateTask,
        deleteTask,
        clearAllTasks
      }}
    >
      {children}
    </KanbanContext.Provider>
  );
}

export function useKanban() {
  const context = useContext(KanbanContext);
  if (!context) {
    throw new Error('useKanban must be used within a KanbanProvider');
  }
  return context;
}
