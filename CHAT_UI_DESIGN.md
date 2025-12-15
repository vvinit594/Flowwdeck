# 🎨 FlowDeck Chat UI - Design Specifications

## Color Palette

```css
/* Background Colors */
--bg-primary: #0B0C10;          /* Main background */
--bg-secondary: #0a0a1f;        /* Sidebar background */
--bg-glass: rgba(255,255,255,0.05);  /* Glassmorphism */

/* Text Colors */
--text-primary: #ffffff;
--text-secondary: #9ca3af;
--text-muted: #6b7280;

/* Accent Colors */
--purple-gradient: linear-gradient(135deg, #9333ea 0%, #3b82f6 100%);
--border-glow: rgba(147, 51, 234, 0.2);
--hover-overlay: rgba(255,255,255,0.05);

/* Status Colors */
--online: #10b981;
--offline: #6b7280;
--unread: #9333ea;
--read: #3b82f6;
```

## Typography

```css
/* Font Family */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Font Sizes */
--text-xs: 0.75rem;     /* 12px - timestamps, badges */
--text-sm: 0.875rem;    /* 14px - messages, labels */
--text-base: 1rem;      /* 16px - inputs */
--text-lg: 1.125rem;    /* 18px - headers */
--text-xl: 1.25rem;     /* 20px - titles */
--text-2xl: 1.5rem;     /* 24px - page headers */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

## Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                     Top Header (60px)                            │
│  Avatar + Name + Status    |    Search · Attachments · More     │
├───────────────────┬─────────────────────────────────────────────┤
│                   │                                             │
│  Conversations    │           Chat Messages                     │
│  List (320px)     │           (flex-1)                          │
│                   │                                             │
│  [Search bar]     │  ┌─────────────────────────────────────┐   │
│                   │  │ Message Bubble (Them)               │   │
│  ┌──────────────┐ │  │ Left-aligned, dark glass            │   │
│  │ User Avatar  │ │  └─────────────────────────────────────┘   │
│  │ Name         │ │                                             │
│  │ Last msg...  │ │              ┌──────────────────────────┐  │
│  │ 2m      [3]  │ │              │ Message Bubble (You)    │  │
│  └──────────────┘ │              │ Right-aligned, purple   │  │
│                   │              └──────────────────────────┘  │
│  ┌──────────────┐ │                                             │
│  │ User Avatar  │ │  [Typing indicator...]                     │
│  │ Name         │ │                                             │
│  │ Last msg...  │ │  ┌─────────────────────────────────────┐   │
│  │ 15m          │ │  │ 😊 📎 [Type message...] 🤖 [Send]  │   │
│  └──────────────┘ │  └─────────────────────────────────────┘   │
│                   │                                             │
├───────────────────┴─────────────────────────────────────────────┤
│                Right Context Panel (320px)                      │
│                                                                 │
│  PARTICIPANTS                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  👤 Client Name                                           │  │
│  │     Company · Online                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  QUICK ACTIONS                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  ➕ Create Task from Chat                                 │  │
│  │  📦 Add Deliverable                                       │  │
│  │  💸 Create Invoice                                        │  │
│  │  🤖 Summarize Conversation                                │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Component Dimensions

### Conversations List
- **Width**: 320px (fixed)
- **Height**: 100vh
- **Padding**: 16px
- **Item Height**: ~80px
- **Search Bar Height**: 40px

### Message Bubble
- **Max Width**: 70% of container
- **Min Width**: 100px
- **Padding**: 12px 16px
- **Border Radius**: 16px
- **Gap between bubbles**: 16px

### Input Bar
- **Height**: ~60px
- **Padding**: 16px 24px
- **Input Height**: 40px
- **Button Size**: 40x40px

### Context Panel
- **Width**: 320px (fixed)
- **Padding**: 24px
- **Section Gap**: 24px
- **Button Height**: 44px

## Micro-Interactions

### Message Send Animation
```javascript
initial: { opacity: 0, y: 20 }
animate: { opacity: 1, y: 0 }
transition: { duration: 0.2 }
```

### Hover Effects
```css
/* Conversation Item */
hover: { scale: 1.01 }
transition: { duration: 0.2 }

/* Buttons */
hover: { scale: 1.05 }
tap: { scale: 0.95 }
```

### Typing Indicator
```css
/* Bouncing Dots */
animation: bounce 1.4s infinite
animation-delay: 0ms, 150ms, 300ms
```

### Read Receipt Animation
```javascript
/* Checkmark Transition */
✓ → ✓✓ (smooth color change)
opacity: 0.6 → 1
color: gray → blue (#3b82f6)
duration: 0.3s
```

## Message Bubble Styles

### Sender (Right-Aligned)
```jsx
<div className="flex justify-end">
  <div className="bg-gradient-to-r from-purple-600 to-blue-600 
                  text-white rounded-2xl px-4 py-2 max-w-[70%]">
    <p className="text-sm">Message content here</p>
    <div className="flex items-center justify-end gap-1 mt-1">
      <span className="text-xs opacity-60">14:23</span>
      <CheckCheck size={14} className="text-blue-400" />
    </div>
  </div>
</div>
```

### Recipient (Left-Aligned)
```jsx
<div className="flex gap-2">
  <div className="w-8 h-8 rounded-full bg-gradient-to-br 
                  from-gray-600 to-gray-800 flex items-center 
                  justify-center text-xs">
    A
  </div>
  <div className="bg-white/5 backdrop-blur-xl border border-white/10 
                  text-gray-100 rounded-2xl px-4 py-2 max-w-[70%]">
    <p className="text-xs text-gray-400 mb-1">Alice</p>
    <p className="text-sm">Message content here</p>
    <span className="text-xs opacity-60">14:23</span>
  </div>
</div>
```

## Glassmorphism Effect

```css
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(16px);
border: 1px solid rgba(255, 255, 255, 0.1);
box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
```

## Icon Sizes

| Context | Size | Example |
|---------|------|---------|
| Navigation | 20px | Menu icons |
| Actions | 18px | Send, Attach |
| Status | 16px | Online dot |
| Small UI | 14px | Checkmarks |

## Spacing System

```css
/* Based on 4px grid */
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
--space-12: 48px;
```

## Z-Index Layers

```css
--z-base: 0;
--z-dropdown: 10;
--z-sticky: 20;
--z-modal-backdrop: 40;
--z-modal: 50;
--z-tooltip: 60;
```

## Responsive Breakpoints

```css
/* Tablet */
@media (max-width: 1024px) {
  /* Hide context panel */
  /* Stack conversations list */
}

/* Mobile */
@media (max-width: 768px) {
  /* Full-screen chat */
  /* Conversations as overlay */
}
```

## Accessibility

### Keyboard Navigation
- **Tab**: Navigate through inputs/buttons
- **Enter**: Send message
- **Shift + Enter**: New line
- **Esc**: Close modals

### ARIA Labels
```jsx
<button aria-label="Send message">
<input aria-label="Type a message" />
<div role="status" aria-live="polite">User is typing...</div>
```

### Focus States
```css
focus:outline-none 
focus:ring-2 
focus:ring-purple-500/50 
focus:border-purple-500
```

## Animation Performance

### Use GPU-Accelerated Properties
```css
/* ✅ Good */
transform: translateY(20px);
opacity: 0;

/* ❌ Avoid */
top: 20px;
margin-top: 20px;
```

### Framer Motion Config
```javascript
transition={{
  type: "spring",
  stiffness: 400,
  damping: 30
}}
```

## Loading States

### Skeleton Loader
```jsx
<div className="animate-pulse space-y-4">
  <div className="h-16 bg-white/5 rounded-lg" />
  <div className="h-16 bg-white/5 rounded-lg" />
</div>
```

### Message Sending
```jsx
<div className="opacity-50">
  {/* Message bubble with spinner */}
  <Loader className="animate-spin" size={14} />
</div>
```

## Empty States

### No Conversations
```jsx
<div className="flex flex-col items-center justify-center h-full">
  <MessageCircle size={48} className="text-gray-600 mb-4" />
  <p className="text-gray-400">No messages yet</p>
  <p className="text-gray-500 text-xs">Start a conversation</p>
</div>
```

### No Results
```jsx
<div className="text-center py-12">
  <Search size={48} className="text-gray-600 mx-auto mb-4" />
  <p className="text-gray-400">No conversations found</p>
</div>
```

## Badge System

### Unread Count
```jsx
<span className="absolute -top-1 -right-1 w-5 h-5 
               bg-purple-500 rounded-full flex items-center 
               justify-center text-xs font-bold">
  {count}
</span>
```

### Online Status
```jsx
<div className="absolute bottom-0 right-0 w-3 h-3 
                bg-green-500 rounded-full border-2 
                border-[#0B0C10]" />
```

## Best Practices

### Performance
- ✅ Virtualize long conversation lists
- ✅ Lazy load messages on scroll
- ✅ Debounce search input (500ms)
- ✅ Use React.memo for message bubbles
- ✅ Optimize Socket.IO event listeners

### UX
- ✅ Auto-scroll to bottom on new message
- ✅ Show typing indicator within 100ms
- ✅ Clear indicator after 2s of no typing
- ✅ Confirm before leaving with unsent message
- ✅ Retry failed messages automatically

### Security
- ✅ Sanitize message content (XSS prevention)
- ✅ Validate file uploads (type, size)
- ✅ Rate limit message sending
- ✅ Encrypt messages in transit (WSS)

---

## Visual Hierarchy

1. **Primary Actions**: Purple gradient buttons
2. **Secondary Actions**: Glass buttons with borders
3. **Text Hierarchy**: Bold names > Regular messages > Muted timestamps
4. **Status Indicators**: Bright colors (green online, purple unread)

## Design Tokens

```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      'flow-dark': '#0B0C10',
      'flow-purple': '#9333ea',
      'flow-blue': '#3b82f6',
    },
    animation: {
      'bounce-slow': 'bounce 1.4s infinite',
    }
  }
}
```

This design specification ensures consistency across all chat UI components and provides clear guidelines for future enhancements.
