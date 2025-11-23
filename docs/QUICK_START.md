# Quick Start Guide

## Your System is Ready!

Both servers are currently running:

- **Backend API**: http://localhost:4141 ✓
- **Frontend Server**: http://localhost:4040 ✓

## Access Your System

### 1. Display Screens (Open in Browser)

**Studio A Display:**
```
http://localhost:4040/display/index.html?studio=1
```

**Studio B Display:**
```
http://localhost:4040/display/index.html?studio=2
```

These screens will:
- Show current lesson with countdown timer
- Display instructor photo and information
- Show QR code for booking
- Display enrollment numbers
- Auto-update every 10 seconds via Socket.IO
- Switch to next lesson automatically

### 2. Admin Panel (Open in Browser)

**Login Page:**
```
http://localhost:4040/admin/index.html
```

**Credentials:**
- Username: `admin`
- Password: `admin123`

After login, you can:
- View dashboard with stats and schedules
- Manage lessons and instructors
- Upload content (videos/images)
- Monitor screen status
- Change settings
- Send emergency broadcasts

### 3. API Endpoints

**Health Check:**
```bash
curl http://localhost:4141/api/health
```

**Current Lesson (Studio 1):**
```bash
curl http://localhost:4141/api/lessons/current/1
```

**Today's Schedule (Studio 1):**
```bash
curl http://localhost:4141/api/lessons/today/1
```

## Current Mock Data

### Instructors
- Ayşe Yılmaz (Yoga instructor)
- Mehmet Demir (Pilates expert)
- Zeynep Kaya (Spinning specialist)

### Today's Schedule

**Studio A:**
- 09:00-10:00: Morning Yoga (Ayşe Yılmaz) - 12/15 enrolled
- 11:00-12:00: Spinning Class (Zeynep Kaya) - 18/20 enrolled
- 18:00-19:00: Evening Yoga (Ayşe Yılmaz) - 15/15 FULL

**Studio B:**
- 09:30-10:30: Power Pilates (Mehmet Demir) - 10/12 enrolled
- 14:00-15:00: Morning Yoga (Ayşe Yılmaz) - 8/15 enrolled

## Features to Test

### On Display Screens:
1. ✓ Current lesson display
2. ✓ Live countdown timer
3. ✓ Instructor information
4. ✓ QR code generation
5. ✓ Enrollment status bar
6. ✓ "No class" state when no lesson
7. ✓ Next lesson preview
8. ✓ Real-time Socket.IO updates
9. ✓ Automatic lesson switching
10. ✓ Emergency broadcast overlay

### In Admin Panel:
1. ✓ Dashboard with statistics
2. ✓ Today's schedule for all studios
3. ✓ Screen status monitoring
4. ✓ Lesson management (CRUD)
5. ✓ Instructor management with photos
6. ✓ Content upload (videos/images)
7. ✓ Settings configuration
8. ✓ Emergency broadcast
9. ✓ JWT authentication
10. ✓ Responsive design

## Stopping the Servers

The servers are currently running in the background. To stop them, you can:

1. Find the process IDs:
```bash
lsof -i :4141  # Backend
lsof -i :4040  # Frontend
```

2. Kill the processes:
```bash
kill <PID>
```

Or restart them anytime:

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npx http-server -p 4040 -c-1
```

## Next Steps

### 1. Customize Mock Data
Edit `backend/src/data/mockData.js` to:
- Add more instructors
- Create different lesson types
- Update schedule times
- Change studio names

### 2. Upload Instructor Photos
Use the admin panel to upload real instructor photos:
1. Login to admin panel
2. Go to "Instructors"
3. Click on an instructor
4. Upload photo

### 3. Add Content
Upload promotional videos or images:
1. Go to "Content" in admin panel
2. Click "Upload Content"
3. Select file and set duration/priority

### 4. Test Real-time Updates
1. Open a display screen in one browser window
2. Open admin panel in another
3. Make changes in admin panel
4. Watch display screen update in real-time

### 5. Test Emergency Broadcast
1. Login to admin panel
2. Go to Dashboard
3. Enter emergency message
4. Send broadcast
5. Check display screens (they'll show the emergency overlay)

## Troubleshooting

### Display screen not updating?
- Check browser console for errors
- Verify Socket.IO connection (green status indicator)
- Make sure backend is running on port 4141

### Admin login not working?
- Use exact credentials: admin / admin123
- Check that backend is running
- Clear browser cache/localStorage

### Port already in use?
- Change ports in .env (backend) and config.js (frontend)
- Make sure nothing else is using 4040 or 4141

## File Structure Reference

```
/Users/mertcanyuksel/
├── backend/              # Backend API (Port 4141)
│   ├── src/
│   │   ├── app.js
│   │   ├── data/mockData.js
│   │   ├── services/
│   │   ├── controllers/
│   │   └── routes/
│   └── .env
├── frontend/             # Frontend (Port 4040)
│   ├── display/         # Display screens
│   └── admin/           # Admin panel
└── README.md            # Full documentation
```

## Support

Check the full README.md for:
- Detailed API documentation
- Configuration options
- Production deployment guide
- SQL Server migration instructions

---

**System Status:** ✓ Running
**Mode:** Mock Data (no database required)
**Backend:** http://localhost:4141
**Frontend:** http://localhost:4040

Enjoy your Sport Studio Display Management System!
