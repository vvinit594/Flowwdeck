import { NextResponse } from 'next/server';

// Server-side proxy to OpenRouter (openrouter.ai)
// Expects POST with JSON body { type: 'summarize'|'chat', payload: { ... } }

export async function POST(req) {
  try {
    const body = await req.json();
    const key = process.env.OPENROUTER_API_KEY;

    if (!key) {
      return NextResponse.json({ error: 'OPENROUTER_API_KEY not configured on server.' }, { status: 500 });
    }

    // Build messages depending on request type
    let messages = [];

    // Base system instruction: constrain assistant to project context
    const systemMessage = {
      role: 'system',
      content: `You are FlowDeck's Project Assistant, an expert in project planning and task breakdown. Your responses must be well-formatted, readable, and properly structured using markdown.

IMPORTANT FORMATTING RULES:
- Use proper markdown headings (# ## ###) with blank lines before and after
- Add blank lines between sections and paragraphs for readability
- Use bullet points (- or •) with proper spacing
- For tables, ensure proper alignment and spacing
- Add line breaks between major sections
- Keep paragraphs concise and well-spaced
- Use **bold** for emphasis, not for entire paragraphs

When given project details, produce a clean, well-structured response with:

# Project Summary
[2-3 concise paragraphs about the project, well-spaced]

## Task Breakdown

### Task 1: [Task Name]
**Deadline:** [Date]
**Subtasks:**
- Subtask 1
- Subtask 2
- Subtask 3

### Task 2: [Task Name]
**Deadline:** [Date]
**Subtasks:**
- Subtask 1
- Subtask 2

[Continue for all tasks...]

## Project Deadlines Summary
- **Task 1:** [Deadline]
- **Task 2:** [Deadline]
[etc.]

## Conclusion
[Brief 1-2 paragraph conclusion]

For follow-up queries, maintain the same clean formatting standards. Only answer questions related to the supplied project context. If asked about topics outside the project scope, politely redirect to project-related discussions.`
    };

    if (body.type === 'summarize') {
      // payload should be the full formData
      const { formData } = body;
      
      // Format the deadline duration
      const deadlineDuration = formData.deadlineValue && formData.deadlineUnit 
        ? `${formData.deadlineValue} ${formData.deadlineUnit}`
        : 'Not specified';
      
      messages = [
        systemMessage,
        {
          role: 'user',
          content: `I need you to analyze this project and create a professional, well-structured project plan.

**Project Details:**
- **Project Name:** ${formData.projectName || 'Not specified'}
- **Project Type:** ${formData.projectType || 'Not specified'}
- **Description:** ${formData.projectDescription || 'Not specified'}
- **Total Project Duration:** ${deadlineDuration}
- **Client Name:** ${formData.clientName || 'Not specified'}
- **Client Email:** ${formData.clientEmail || 'Not specified'}
- **Payment Amount:** ${formData.paymentAmount ? '$' + formData.paymentAmount : 'Not specified'}
- **Payment Status:** ${formData.paymentStatus || 'Not specified'}
- **Priority:** ${formData.priority || 'Not specified'}
- **Milestones/Deliverables:** ${formData.milestones || 'Not specified'}
- **Team Members:** ${formData.teamMembers || 'Not specified'}
- **Project Status:** ${formData.projectStatus || 'Not specified'}
- **Tools Needed:** ${formData.toolsNeeded || 'Not specified'}
- **AI Assistance Required:** ${formData.aiAssistance || 'Not specified'}
- **Keywords/Focus Areas:** ${formData.keywords || 'Not specified'}
- **Additional Notes:** ${formData.notes || 'Not specified'}
- **Reminders Enabled:** ${formData.reminderToggle ? 'Yes' : 'No'}
- **Estimated Hours:** ${formData.estimatedHours || 'Not specified'}

Please provide a comprehensive project plan with:

1. **Project Summary** - A clear, concise overview (2-3 paragraphs)

2. **Task Breakdown** - Break down the project into major tasks, each with:
   - Task name and description
   - Suggested subtasks (3-6 actionable items)
   - **IMPORTANT:** Deadline expressed as relative duration from project start (e.g., "Day 1-5", "Week 1-2", "Days 1-10", "Weeks 2-4"). Divide the total duration (${deadlineDuration}) proportionally across all tasks. DO NOT use fixed calendar dates.

3. **Deadlines Summary** - A quick reference list showing the duration allocation for each task (e.g., "UI Design: Days 1-7", "Backend: Days 8-20")

4. **Conclusion** - Brief next steps and success criteria

Use proper markdown formatting with headings, bullet points, and spacing for readability.`
        }
      ];
    } else if (body.type === 'chat') {
      // payload: { projectContext, userMessages }
      const { projectContext, userMessages } = body;

      // projectContext should be a text summary previously returned; include it as system/context
      const contextMessage = {
        role: 'user',
        content: `PROJECT CONTEXT:\n${projectContext}`
      };

      messages = [systemMessage, contextMessage, ...userMessages];
    } else {
      return NextResponse.json({ error: 'Invalid request type' }, { status: 400 });
    }

    // Forward to OpenRouter
    const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({ model: 'openai/gpt-oss-20b:free', messages })
    });

    if (!resp.ok) {
      const text = await resp.text();
      return NextResponse.json({ error: 'Upstream error', details: text }, { status: 502 });
    }

    const data = await resp.json();

    // OpenRouter may return assistant messages in choices[0].message.content or different layout; normalize
    const reply = (data?.choices && data.choices[0]?.message?.content) || data?.output || JSON.stringify(data);

    return NextResponse.json({ reply, raw: data });
  } catch (err) {
    console.error('openrouter error', err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
