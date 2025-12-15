# 🚀 FlowDeck Chat - Quick Start Guide

## Prerequisites
- ✅ PostgreSQL database running
- ✅ Node.js installed
- ✅ Backend and Frontend repos set up

## 1. Database Setup (Already Complete)

The chat tables are already created. To verify:

```bash
cd FlowDeck_Backend-main
node check-tables.js
```

Should show:
```
✅ conversations
✅ messages
✅ message_status
```

## 2. Start Backend

```bash
cd FlowDeck_Backend-main
npm run dev
```

**Expected Output:**
```
✅ Socket.IO server initialized
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 FlowDeck Backend Server Running
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Port: 5000
💬 Socket.IO: Enabled
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 3. Start Frontend

```bash
cd FlowDeck-main
npm run dev
```

**Expected Output:**
```
▲ Next.js 16.0.0
- Local: http://localhost:3000
```

## 4. Test the Chat System

### Create Test Users

#### Option A: Signup New Users
1. Go to `http://localhost:3000/signup`
2. Create **Client** account:
   - Email: `client@test.com`
   - Password: `Password123`
   - User Type: **Client**
3. Complete client onboarding
4. Logout

5. Create **Freelancer** account:
   - Email: `freelancer@test.com`
   - Password: `Password123`
   - User Type: **Freelancer**
6. Complete profile setup

#### Option B: Use Existing Accounts
If you already have accounts, just login.

### Test Chat Flow

#### As Freelancer:
1. Login to `http://localhost:3000/login`
2. Go to dashboard
3. Click the **floating chat button** (bottom-right, purple gradient)
4. Click **"New Message"**
5. Search for client by name
6. Select client from results
7. Type message: `"Hello from Freelancer!"`
8. Press Enter or click Send
9. **Expected**: Message appears on right side (purple bubble)

#### As Client (Open in Incognito/Another Browser):
1. Login to `http://localhost:3000/login`
2. Go to client dashboard
3. Click the **chat icon** (top-right navbar)
4. **Expected**: See conversation with freelancer
5. **Expected**: See message "Hello from Freelancer!" on left side
6. Reply: `"Hi! Thanks for reaching out!"`
7. Press Enter
8. **Expected**: Message sent instantly

#### Back to Freelancer:
1. **Expected**: See client's reply appear instantly
2. **Expected**: Typing indicator when client types
3. **Expected**: Double checkmark (✓✓) when client reads your message

### Verify All Features

#### ✅ Real-Time Messaging
- [ ] Send message from Freelancer → appears on Client instantly
- [ ] Send message from Client → appears on Freelancer instantly
- [ ] Messages persist after page refresh

#### ✅ Typing Indicators
- [ ] Start typing → other user sees "Name is typing..."
- [ ] Stop typing for 2 seconds → indicator disappears
- [ ] Animated bouncing dots visible

#### ✅ Read Receipts
- [ ] Send message → shows single checkmark (✓)
- [ ] Other user opens chat → shows double checkmark (✓✓)
- [ ] Double checkmark turns blue

#### ✅ Conversations List
- [ ] All conversations listed on left
- [ ] Last message preview shown
- [ ] Time formatted correctly (2m, 1h, Yesterday)
- [ ] Unread count badge visible
- [ ] Avatar with online status (green dot)

#### ✅ User Search
- [ ] Click "New Message"
- [ ] Search for user by name
- [ ] Results appear after 2 characters
- [ ] Only opposite user type shown (client sees freelancers)
- [ ] Click result → opens/creates conversation

#### ✅ UI/UX
- [ ] Message bubbles styled correctly
- [ ] Sender messages on right (purple gradient)
- [ ] Recipient messages on left (dark glass)
- [ ] Smooth animations
- [ ] Auto-scroll to bottom on new message
- [ ] Modal opens/closes smoothly

#### ✅ Context Panel (Right Side)
- [ ] Shows participants
- [ ] Quick Actions buttons visible
- [ ] Panel can be toggled with More button
- [ ] Slides in/out smoothly

## 5. Troubleshooting

### Issue: "Socket not connected"
```bash
# Check backend is running
curl http://localhost:5000/health

# Check Socket.IO is enabled
# Look for "💬 Socket.IO: Enabled" in backend console
```

### Issue: Messages not sending
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for errors
4. Check Network tab for failed requests

### Issue: "Cannot connect to database"
```bash
# Check PostgreSQL is running
psql -U postgres -d flowdeck_db -c "SELECT 1"

# Verify tables exist
psql -U postgres -d flowdeck_db -c "\dt"
```

### Issue: "Token expired" or "Unauthorized"
1. Logout
2. Clear browser cache
3. Login again

### Issue: No conversations showing
```sql
-- Check database has conversations
SELECT * FROM conversations;

-- Check messages exist
SELECT * FROM messages;
```

## 6. Debug Mode

### Enable Socket.IO Debug Logs (Frontend)
In browser console:
```javascript
localStorage.setItem('debug', 'socket.io-client:*');
```
Refresh page to see detailed Socket.IO logs.

### Enable Backend Verbose Logging
In terminal:
```bash
DEBUG=socket.io:* npm run dev
```

## 7. API Endpoints Reference

### REST Endpoints
```
GET    /api/chat/conversations       # Get all conversations
POST   /api/chat/conversations       # Create/get conversation
GET    /api/chat/conversations/:id/messages  # Get messages
GET    /api/chat/search?search=query # Search users
```

### Socket.IO Events

#### Client → Server
```javascript
socket.emit('join_conversation', conversationId);
socket.emit('send_message', { conversationId, content, messageType });
socket.emit('typing', { conversationId });
socket.emit('stop_typing', { conversationId });
socket.emit('mark_read', { messageId });
```

#### Server → Client
```javascript
socket.on('new_message', (message) => {...});
socket.on('user_typing', ({ userId }) => {...});
socket.on('user_stop_typing', () => {...});
socket.on('message_read', ({ messageId }) => {...});
```

## 8. Demo Script

Copy this into your terminal for automated testing:

```bash
# Test backend health
echo "Testing backend..."
curl http://localhost:5000/health

# Test frontend
echo "Testing frontend..."
curl http://localhost:3000

echo "✅ All systems operational!"
echo "Open http://localhost:3000 in your browser"
```

## 9. Common Workflows

### Workflow 1: Freelancer initiates chat
1. Freelancer clicks chat button
2. Searches for client
3. Sends first message
4. Client receives notification
5. Client opens chat and replies

### Workflow 2: Client needs support
1. Client clicks chat icon
2. Sees conversation with freelancer
3. Asks question
4. Freelancer responds
5. Real-time back-and-forth

### Workflow 3: Group discussion (future)
1. Multiple freelancers on project
2. Client creates group chat
3. Everyone receives messages
4. Typing indicators for all
5. Read receipts track who saw what

## 10. Performance Check

### Metrics to Monitor
- **Message Latency**: < 100ms
- **Typing Indicator Delay**: < 100ms
- **Page Load Time**: < 2s
- **Socket Connection Time**: < 500ms

### Test with Load
```bash
# Send 100 messages rapidly
for i in {1..100}; do
  # Use Postman or similar to POST messages
  echo "Sending message $i"
done
```

## 11. Next Steps

Once basic chat works:
1. Test with multiple conversations
2. Try searching different users
3. Test read receipts with multiple users
4. Test typing indicators
5. Verify messages persist across page reloads

## 12. Success Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Database tables created
- [ ] Socket.IO connected
- [ ] Can send messages
- [ ] Messages appear instantly
- [ ] Typing indicators work
- [ ] Read receipts update
- [ ] Conversation list updates
- [ ] User search works
- [ ] No console errors
- [ ] Smooth animations

## 🎉 You're Ready!

If all checkboxes are ticked, your FlowDeck Chat system is fully operational!

For detailed documentation, see:
- `CHAT_SYSTEM_GUIDE.md` - Complete architecture
- `CHAT_UI_DESIGN.md` - Design specifications

**Happy Chatting! 💬**
