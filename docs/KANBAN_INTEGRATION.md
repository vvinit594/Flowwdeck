# Kanban Integration Feature

## Overview
Tasks generated from the AI Project Summary in the Workplace are automatically added to the Kanban board.

## How It Works

### 1. Create a Project in Workplace
- Fill out the New Project form with project details
- Submit the form to generate an AI summary

### 2. AI Parses Tasks
- The AI analyzes your project and breaks it down into tasks
- Each task includes:
  - Task title
  - Description
  - Subtasks
  - Deadline/duration
  - Priority level

### 3. Auto-Add to Kanban
- All tasks are automatically added to the **To Do** column
- Tasks persist in localStorage
- Success notification appears in chat

### 4. Manual Task Management
Users can manually move tasks between columns:
- **To Do** → Tasks that haven't started
- **In Progress** → Tasks currently being worked on
- **Review** → Tasks awaiting review/approval
- **Completed** → Finished tasks

## Task Movement

### Method 1: Click on Task Card
1. Click any task card to open the detail modal
2. Use the "Move to" buttons at the bottom:
   - 📋 To Do
   - 🔄 In Progress
   - 👁️ Review
   - ✅ Completed
3. The current status button is disabled

### Method 2: Future Drag & Drop (Coming Soon)
- Drag tasks between columns
- Real-time status updates

## Data Persistence
- All tasks are saved to localStorage
- Tasks persist across browser sessions
- Clear tasks from the Kanban context if needed

## Task Structure
```javascript
{
  id: 'task-timestamp-index',
  title: 'Task Name',
  description: 'Task description',
  subtasks: ['Subtask 1', 'Subtask 2'],
  deadline: 'Days 1-5',
  status: 'todo', // 'todo' | 'inProgress' | 'review' | 'completed'
  priority: 'medium', // 'low' | 'medium' | 'high'
  projectName: 'Project Name',
  createdAt: '2025-11-07T...'
}
```

## Example Workflow

1. **Workplace**: Create "AI Interview Platform" project with 7 days duration
2. **AI Summary**: Generates 4 major tasks with subtasks
3. **Auto-Add**: 4 tasks appear in Kanban "To Do" column
4. **Work**: User starts "UI Design" → moves to "In Progress"
5. **Review**: After design is done → moves to "Review"
6. **Complete**: After client approval → moves to "Completed"

## Technical Details

### Files Modified
- `app/context/KanbanContext.js` - Shared state management
- `app/utils/taskParser.js` - AI response parsing
- `app/dashboard/workplace/page.jsx` - Task generation
- `app/dashboard/kanban/page.jsx` - Task display & management
- `app/layout.js` - Context provider wrapper

### Key Functions
- `addTasksFromAI(projectName, tasks)` - Add tasks to Kanban
- `updateTaskStatus(taskId, newStatus)` - Move task between columns
- `parseTasksFromAI(aiResponse, projectName)` - Extract tasks from AI text
