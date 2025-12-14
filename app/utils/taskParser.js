// Parse AI-generated project summary and extract tasks
export function parseTasksFromAI(aiResponse, projectName) {
  const tasks = [];
  const lines = aiResponse.split('\n');
  
  let currentTask = null;
  let inSubtasks = false;
  let subtasks = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Detect task headers (### Task N: or ### TaskName)
    if (line.match(/^###\s+(?:Task\s+\d+:\s*)?(.+)/i)) {
      // Save previous task if exists
      if (currentTask) {
        currentTask.subtasks = subtasks;
        tasks.push(currentTask);
        subtasks = [];
      }

      // Extract task name
      const taskName = line.replace(/^###\s+(?:Task\s+\d+:\s*)?/i, '').trim();
      currentTask = {
        title: taskName,
        description: '',
        deadline: '',
        priority: 'medium',
        subtasks: []
      };
      inSubtasks = false;
    }
    
    // Detect deadline/duration line
    if (currentTask && line.match(/\*\*(?:Deadline|Duration):\*\*/i)) {
      const deadlineMatch = line.match(/\*\*(?:Deadline|Duration):\*\*\s*(.+)/i);
      if (deadlineMatch) {
        currentTask.deadline = deadlineMatch[1].trim();
      }
    }

    // Detect subtasks section
    if (currentTask && line.match(/\*\*Subtasks:\*\*/i)) {
      inSubtasks = true;
      continue;
    }

    // Collect subtasks (bullet points after "Subtasks:")
    if (currentTask && inSubtasks && line.match(/^[-•\*]\s+(.+)/)) {
      const subtask = line.replace(/^[-•\*]\s+/, '').trim();
      if (subtask) {
        subtasks.push(subtask);
      }
    }

    // If we hit another bold section that's not subtasks, stop collecting subtasks
    if (currentTask && inSubtasks && line.match(/^\*\*[^:]+:\*\*/) && !line.match(/\*\*Subtasks:\*\*/i)) {
      inSubtasks = false;
    }

    // Collect task description (first paragraph after task header)
    if (currentTask && !currentTask.description && !line.match(/^###/) && !line.match(/^\*\*/) && line.length > 0 && !line.match(/^[-•\*]/)) {
      currentTask.description = line;
    }
  }

  // Save last task
  if (currentTask) {
    currentTask.subtasks = subtasks;
    tasks.push(currentTask);
  }

  return tasks;
}

// Extract project name from AI response if not provided
export function extractProjectName(aiResponse) {
  const lines = aiResponse.split('\n');
  for (const line of lines) {
    // Look for "# Project Summary" or similar
    if (line.match(/^#\s+(.+)\s+(?:Summary|Project)/i)) {
      return line.replace(/^#\s+/, '').replace(/\s+(?:Summary|Project)/i, '').trim();
    }
  }
  return 'Untitled Project';
}
