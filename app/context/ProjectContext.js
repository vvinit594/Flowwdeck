'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const ProjectContext = createContext();

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(null);

  // Load projects from localStorage on mount
  useEffect(() => {
    const savedProjects = localStorage.getItem('projects');
    const savedActiveId = localStorage.getItem('activeProjectId');
    
    if (savedProjects) {
      const parsed = JSON.parse(savedProjects);
      setProjects(parsed);
      
      // Set active project
      if (savedActiveId && parsed.find(p => p.id === savedActiveId)) {
        setActiveProjectId(savedActiveId);
      } else if (parsed.length > 0) {
        setActiveProjectId(parsed[0].id);
      }
    }
  }, []);

  // Save projects to localStorage whenever they change
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem('projects', JSON.stringify(projects));
    }
  }, [projects]);

  // Save active project ID
  useEffect(() => {
    if (activeProjectId) {
      localStorage.setItem('activeProjectId', activeProjectId);
    }
  }, [activeProjectId]);

  // Create a new project
  const createProject = (projectData, aiSummary) => {
    const newProject = {
      id: `project-${Date.now()}`,
      name: projectData.projectName,
      type: projectData.projectType,
      description: projectData.projectDescription,
      duration: {
        value: projectData.deadlineValue,
        unit: projectData.deadlineUnit
      },
      client: projectData.clientName,
      priority: projectData.priority,
      status: projectData.projectStatus,
      aiSummary: aiSummary,
      formData: projectData,
      createdAt: new Date().toISOString(),
      messages: [] // Chat history for this project
    };

    setProjects(prev => [newProject, ...prev]);
    setActiveProjectId(newProject.id);
    return newProject;
  };

  // Add a message to a project's chat history
  const addMessageToProject = (projectId, message) => {
    setProjects(prev =>
      prev.map(project =>
        project.id === projectId
          ? { ...project, messages: [...project.messages, message] }
          : project
      )
    );
  };

  // Get active project
  const getActiveProject = () => {
    return projects.find(p => p.id === activeProjectId);
  };

  // Delete a project
  const deleteProject = (projectId) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    
    // If deleting active project, switch to first available
    if (projectId === activeProjectId) {
      const remaining = projects.filter(p => p.id !== projectId);
      setActiveProjectId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  // Update project
  const updateProject = (projectId, updates) => {
    setProjects(prev =>
      prev.map(project =>
        project.id === projectId ? { ...project, ...updates } : project
      )
    );
  };

  // Clear all projects
  const clearAllProjects = () => {
    setProjects([]);
    setActiveProjectId(null);
    localStorage.removeItem('projects');
    localStorage.removeItem('activeProjectId');
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        activeProjectId,
        setActiveProjectId,
        createProject,
        addMessageToProject,
        getActiveProject,
        deleteProject,
        updateProject,
        clearAllProjects
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
}
