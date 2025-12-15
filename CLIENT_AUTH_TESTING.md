# Client Authentication System Testing Guide

## ✅ What Was Implemented

### Backend Changes:
1. **Database**: Added `client_profiles` table with proper constraints
2. **Controllers**: Created `clientController.js` for client profile management
3. **Middleware**: Added role-based authentication (`requireClient`, `requireFreelancer`)
4. **Routes**: New `/api/client/*` endpoints
5. **Updated `/api/me`**: Now returns role-specific profiles

### Frontend Changes:
1. **API Library**: Added `clientAPI` methods
2. **Client Dashboard**: Fetches real user data and displays actual name
3. **Client Onboarding**: New profile setup page
4. **Login Flow**: Routes clients to onboarding if no profile exists

---

## 🧪 Testing Steps

### **STEP 1: Test Backend API Endpoints**

#### Check Health:
```bash
curl http://localhost:5000/health
```

#### Test Signup (Client):
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testclient@example.com",
    "password": "Test@1234",
    "fullName": "David Miller",
    "userType": "client"
  }'
```

**Expected Response:**
- `success: true`
- `token` and `refreshToken` provided
- User created with role `client`

#### Test Login (Client):
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testclient@example.com",
    "password": "Test@1234"
  }'
```

**Expected Response:**
- Returns JWT token
- User type is `client`

#### Test GET /api/me (Before Profile):
```bash
curl http://localhost:5000/api/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "testclient@example.com",
    "role": "client",
    "userType": "client",
    "profile": null,
    "hasProfile": false
  }
}
```

#### Test Create Client Profile:
```bash
curl -X POST http://localhost:5000/api/client/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "David Miller",
    "companyName": "Acme Corp",
    "timezone": "America/New_York",
    "phone": "+1-555-123-4567"
  }'
```

**Expected Response:**
- `success: true`
- Profile created with all fields

#### Test GET /api/me (After Profile):
```bash
curl http://localhost:5000/api/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "role": "client",
    "profile": {
      "fullName": "David Miller",
      "companyName": "Acme Corp",
      "timezone": "America/New_York"
    },
    "hasProfile": true
  }
}
```

---

### **STEP 2: Test Frontend Flow**

#### Test 1: New Client Signup
1. Go to: http://localhost:3000/signup
2. Select "Client" user type
3. Enter:
   - Email: `newclient@test.com`
   - Password: `Test@123`
   - Full Name: `Jane Smith`
4. Click "Sign Up"
5. **Expected**: Redirect to `/client-onboarding`

#### Test 2: Client Onboarding
1. You should see the onboarding form
2. Fill in:
   - Full Name: `Jane Smith`
   - Company: `Tech Innovations Inc`
   - Phone: `+1-555-987-6543`
   - Timezone: Select your timezone
3. Click "Complete Setup"
4. **Expected**: Redirect to `/dashboard/client`

#### Test 3: Client Dashboard
1. Dashboard should load with:
   - **Welcome back, Jane Smith 👋** (your actual name)
   - Avatar initials: "JS"
   - All dashboard widgets visible
2. Refresh page - name should persist

#### Test 4: Logout and Login
1. Logout
2. Go to: http://localhost:3000/login
3. Login with: `newclient@test.com` / `Test@123`
4. **Expected**: 
   - Direct redirect to `/dashboard/client` (skips onboarding)
   - Your name displays correctly

#### Test 5: Duplicate Profile Prevention
1. Open browser DevTools console
2. Try to manually call:
   ```javascript
   clientAPI.createOrUpdateProfile({ fullName: "Another Name" })
   ```
3. **Expected**: Profile updates (not creates duplicate)

#### Test 6: Role Protection
1. Try accessing: http://localhost:3000/dashboard/client (as freelancer)
2. **Expected**: API returns 403 Forbidden or redirects

---

### **STEP 3: Security Testing**

#### Test Invalid Token:
```bash
curl http://localhost:5000/api/me \
  -H "Authorization: Bearer invalid_token"
```

**Expected**: 401 Unauthorized

#### Test Client-Only Endpoint (as freelancer):
Sign up as freelancer, then try:
```bash
curl -X POST http://localhost:5000/api/client/profile \
  -H "Authorization: Bearer FREELANCER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"fullName": "Test"}'
```

**Expected**: 403 Forbidden - "Client role required"

---

## 🔍 Verify Database

Connect to your PostgreSQL database:

```sql
-- Check client_profiles table exists
SELECT * FROM client_profiles;

-- Check users table has correct user_type
SELECT id, email, user_type FROM users WHERE user_type = 'client';

-- Verify unique constraint on user_id
SELECT COUNT(*), user_id 
FROM client_profiles 
GROUP BY user_id 
HAVING COUNT(*) > 1;
-- Should return 0 rows
```

---

## ✅ Success Checklist

- [ ] Backend endpoints return correct responses
- [ ] Client signup creates user with `userType: 'client'`
- [ ] Login redirects to onboarding if no profile
- [ ] Onboarding creates client profile
- [ ] Dashboard displays real client name
- [ ] Name persists after refresh
- [ ] Cannot create duplicate profiles
- [ ] Role-based access control works
- [ ] Freelancers cannot access client endpoints
- [ ] Clients cannot access freelancer endpoints

---

## 🐛 Common Issues

### Issue: "ECONNREFUSED" on login
**Solution**: Ensure PostgreSQL is running and `.env` is configured

### Issue: "Profile not found" after onboarding
**Solution**: Check that `client_profiles` table was created via migration

### Issue: Name shows "undefined"
**Solution**: Verify `/api/me` returns `profile.fullName` correctly

### Issue: Port 5000 already in use
**Solution**: Kill existing process:
```powershell
Get-NetTCPConnection -LocalPort 5000 | Select -ExpandProperty OwningProcess | Stop-Process -Force
```

---

## 📊 API Endpoints Summary

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/api/auth/signup` | ❌ | - | Create account |
| POST | `/api/auth/login` | ❌ | - | Login |
| GET | `/api/me` | ✅ | Any | Get current user + profile |
| POST | `/api/client/profile` | ✅ | Client | Create/update profile |
| GET | `/api/client/profile` | ✅ | Client | Get profile |

---

## 🎯 Next Steps (Optional Enhancements)

1. Add client avatar upload
2. Add email verification for clients
3. Add client dashboard analytics
4. Add client project management
5. Add client-freelancer messaging
6. Add payment integration for clients

---

**All authentication system features are now complete and ready for testing!** 🚀
