# System Architecture Overview

## Component Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSERS                           │
├─────────────────────────────────────────────────────────────────┤
│  Studio A Display    Studio B Display    Admin Panel (Login)   │
│  (localhost:4040)    (localhost:4040)    (localhost:4040)       │
└───────────┬──────────────────┬─────────────────┬────────────────┘
            │                  │                 │
            │  Socket.IO       │  Socket.IO      │  HTTP REST + JWT
            │  WebSocket       │  WebSocket      │
            └──────────────────┴─────────────────┴─────────────────┐
                                                                    │
            ┌───────────────────────────────────────────────────────┘
            │
┌───────────▼─────────────────────────────────────────────────────┐
│                    BACKEND API SERVER                           │
│                    (localhost:4141)                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                    Socket.IO Server                     │  │
│  │  - Connection Management                                │  │
│  │  - Room Management (studio-1, studio-2)                │  │
│  │  - Event Broadcasting                                   │  │
│  │  - Heartbeat Handling                                   │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                      Express.js                         │  │
│  │  - REST API Routes                                      │  │
│  │  - CORS Middleware                                      │  │
│  │  - JWT Authentication                                   │  │
│  │  - Rate Limiting                                        │  │
│  │  - Helmet Security                                      │  │
│  │  - Static File Serving (/uploads)                      │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                     Controllers                         │  │
│  │  ├─ Auth Controller (login, verify)                    │  │
│  │  ├─ Lesson Controller (CRUD + current/next/today)      │  │
│  │  ├─ Instructor Controller (CRUD + photo upload)        │  │
│  │  ├─ Content Controller (upload, delete)                │  │
│  │  ├─ Screen Controller (status, heartbeat)              │  │
│  │  └─ Settings Controller (get, update)                  │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                       Services                          │  │
│  │  ├─ Mock Data Service (data access layer)              │  │
│  │  ├─ Socket Service (event handlers)                    │  │
│  │  ├─ Scheduler Service (auto-updates every 10s)         │  │
│  │  └─ QR Code Service (generation)                       │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                     Mock Database                       │  │
│  │  ├─ Studios (2 studios)                                 │  │
│  │  ├─ Instructors (3 instructors)                         │  │
│  │  ├─ Lessons (4 lesson types)                            │  │
│  │  ├─ Today's Schedule (5 scheduled sessions)            │  │
│  │  ├─ Screens (2 display screens)                         │  │
│  │  ├─ Contents (2 promotional items)                      │  │
│  │  ├─ Settings (7 configuration options)                  │  │
│  │  └─ Admin Users (1 admin account)                       │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                    File Storage                         │  │
│  │  ├─ /uploads/videos/      (promotional videos)         │  │
│  │  ├─ /uploads/images/      (promotional images)         │  │
│  │  ├─ /uploads/instructors/ (instructor photos)          │  │
│  │  └─ /uploads/qrcodes/     (generated QR codes)         │  │
│  └─────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND STATIC SERVER                       │
│                    (localhost:4040)                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │               Display Screens (/display/)               │  │
│  │                                                          │  │
│  │  HTML:                                                   │  │
│  │  - Current lesson display                               │  │
│  │  - Countdown timer                                       │  │
│  │  - Instructor photo & info                              │  │
│  │  - QR code canvas                                        │  │
│  │  - Enrollment progress bar                              │  │
│  │  - Next lesson preview                                   │  │
│  │  - Emergency overlay                                     │  │
│  │  - Status indicator                                      │  │
│  │                                                          │  │
│  │  CSS:                                                    │  │
│  │  - Gradient backgrounds                                  │  │
│  │  - Smooth animations (fade, pulse, float)              │  │
│  │  - Responsive layout                                     │  │
│  │  - Color-coded states                                    │  │
│  │                                                          │  │
│  │  JavaScript:                                             │  │
│  │  - DisplayManager (UI logic)                            │  │
│  │  - SocketClient (real-time connection)                 │  │
│  │  - Countdown logic (updates every second)              │  │
│  │  - QR code generation (qrcode.js)                      │  │
│  │  - Auto-refresh (every 10s as fallback)                │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                 Admin Panel (/admin/)                   │  │
│  │                                                          │  │
│  │  Pages:                                                  │  │
│  │  ├─ index.html        (Login page)                      │  │
│  │  ├─ dashboard.html    (Stats & overview)                │  │
│  │  ├─ lessons.html      (Lesson management)               │  │
│  │  ├─ instructors.html  (Instructor management)           │  │
│  │  ├─ contents.html     (Content management)              │  │
│  │  ├─ screens.html      (Screen monitoring)               │  │
│  │  └─ settings.html     (System settings)                 │  │
│  │                                                          │  │
│  │  JavaScript:                                             │  │
│  │  ├─ auth.js           (Login, logout, token mgmt)       │  │
│  │  ├─ api.js            (API client wrapper)              │  │
│  │  ├─ dashboard.js      (Dashboard logic)                 │  │
│  │  ├─ lessons.js        (Lesson CRUD)                     │  │
│  │  ├─ instructors.js    (Instructor CRUD + upload)        │  │
│  │  ├─ contents.js       (Content upload/delete)           │  │
│  │  ├─ screens.js        (Screen monitoring)               │  │
│  │  └─ settings.js       (Settings management)             │  │
│  └─────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### 1. Display Screen - Lesson Update Flow

```
┌──────────────┐
│ Display      │
│ Screen Opens │
└──────┬───────┘
       │
       │ 1. Connect to Socket.IO
       ▼
┌──────────────────┐
│ Socket.IO Server │
└──────┬───────────┘
       │
       │ 2. emit('join-studio', studioId)
       ▼
┌─────────────────┐
│ Join Studio     │
│ Room            │
└──────┬──────────┘
       │
       │ 3. Get current lesson data
       ▼
┌────────────────┐
│ Mock Data      │
│ Service        │
└──────┬─────────┘
       │
       │ 4. Return lesson + instructor + schedule
       ▼
┌──────────────────┐
│ emit('lesson-    │
│ update', data)   │
└──────┬───────────┘
       │
       │ 5. Receive lesson data
       ▼
┌──────────────────┐
│ Display Manager  │
│ - Show lesson    │
│ - Start countdown│
│ - Generate QR    │
│ - Show instructor│
└──────┬───────────┘
       │
       │ Every 1 second
       ▼
┌──────────────────┐
│ Update Countdown │
│ Timer            │
└──────────────────┘

       │ Every 10 seconds (from scheduler)
       ▼
┌──────────────────┐
│ Auto broadcast   │
│ lesson updates   │
└──────────────────┘
```

### 2. Admin Panel - Lesson Edit Flow

```
┌──────────────┐
│ Admin clicks │
│ "Edit Lesson"│
└──────┬───────┘
       │
       │ 1. Show modal with current data
       ▼
┌──────────────────┐
│ Edit Form        │
│ (Modal Dialog)   │
└──────┬───────────┘
       │
       │ 2. Submit form
       ▼
┌──────────────────┐
│ PUT /api/lessons │
│ /:id             │
│ + JWT Token      │
└──────┬───────────┘
       │
       │ 3. Validate JWT
       ▼
┌──────────────────┐
│ Auth Middleware  │
└──────┬───────────┘
       │
       │ 4. Update in mock data
       ▼
┌──────────────────┐
│ Mock Data        │
│ Service          │
└──────┬───────────┘
       │
       │ 5. Return updated lesson
       ▼
┌──────────────────┐
│ Success response │
└──────┬───────────┘
       │
       │ 6. Reload lessons list
       ▼
┌──────────────────┐
│ Refresh UI       │
└──────┬───────────┘
       │
       │ 7. Next scheduler broadcast (10s)
       ▼
┌──────────────────┐
│ All displays     │
│ auto-update with │
│ new data         │
└──────────────────┘
```

### 3. File Upload Flow (Instructor Photo)

```
┌──────────────┐
│ Select photo │
│ in form      │
└──────┬───────┘
       │
       │ 1. Show preview (FileReader)
       ▼
┌──────────────────┐
│ Preview image    │
└──────┬───────────┘
       │
       │ 2. Submit form
       ▼
┌──────────────────┐
│ Create FormData  │
│ with file        │
└──────┬───────────┘
       │
       │ 3. POST /api/instructors/:id/photo
       │    + JWT Token
       │    + multipart/form-data
       ▼
┌──────────────────┐
│ Multer Middleware│
│ - Validate type  │
│ - Check size     │
│ - Generate name  │
└──────┬───────────┘
       │
       │ 4. Save to /uploads/instructors/
       ▼
┌──────────────────┐
│ File Storage     │
└──────┬───────────┘
       │
       │ 5. Update instructor PhotoPath
       ▼
┌──────────────────┐
│ Mock Data Service│
└──────┬───────────┘
       │
       │ 6. Return file path
       ▼
┌──────────────────┐
│ Display updated  │
│ instructor card  │
│ with new photo   │
└──────────────────┘
```

### 4. Real-time Update Flow (Socket.IO)

```
┌──────────────────────┐
│ Scheduler Service    │
│ (runs every 10s)     │
└──────────┬───────────┘
           │
           │ For each studio (1, 2)
           ▼
┌──────────────────────┐
│ Get current lesson   │
│ Get next lesson      │
└──────────┬───────────┘
           │
           │ Prepare data
           ▼
┌──────────────────────┐
│ io.to('studio-1')    │
│   .emit('lesson-     │
│   update', data)     │
└──────────┬───────────┘
           │
           │ Broadcast to all clients in room
           ▼
┌──────────────────────┬──────────────────────┐
│ Display Screen 1     │ Display Screen 2     │
│ (Connected to        │ (Connected to        │
│  studio-1 room)      │  studio-1 room)      │
└──────────┬───────────┴──────────┬───────────┘
           │                      │
           │ Receive update       │ Receive update
           ▼                      ▼
┌──────────────────────┬──────────────────────┐
│ Update UI            │ Update UI            │
│ - Lesson info        │ - Lesson info        │
│ - Countdown          │ - Countdown          │
│ - Instructor         │ - Instructor         │
└──────────────────────┴──────────────────────┘
```

## Security Layers

```
┌─────────────────────────────────────────────┐
│              Public Access                  │
│  - Display screens (no auth)                │
│  - Current/next lesson endpoints            │
└─────────────────────────────────────────────┘
                    │
                    │ JWT Required for Admin
                    ▼
┌─────────────────────────────────────────────┐
│         Authentication Layer                │
│  POST /api/auth/login                       │
│  - Validate username/password               │
│  - Generate JWT token (24h expiry)          │
└─────────────────────────────────────────────┘
                    │
                    │ Token in Authorization header
                    ▼
┌─────────────────────────────────────────────┐
│         Authorization Middleware            │
│  - Verify JWT signature                     │
│  - Check token expiry                       │
│  - Extract user info                        │
└─────────────────────────────────────────────┘
                    │
                    │ If valid
                    ▼
┌─────────────────────────────────────────────┐
│         Protected Endpoints                 │
│  - Admin panel APIs                         │
│  - CRUD operations                          │
│  - File uploads                             │
│  - Settings management                      │
└─────────────────────────────────────────────┘
```

## State Management

### Display Screen State

```
DisplayManager {
  currentLesson: {
    LessonID, LessonName, Description,
    InstructorID, InstructorName, InstructorPhoto,
    StartTime, EndTime, RemainingMinutes,
    Capacity, CurrentEnrollment,
    DisplayColor, QRCodeData
  },

  nextLesson: {
    LessonName, InstructorName, StartTime
  },

  countdownInterval: setInterval(...),
  contentTimeout: setTimeout(...)
}
```

### Admin Panel State

```
Each page manages:
- Data array (lessons[], instructors[], etc.)
- Loading state
- Error state
- Modal open/close state
- Current editing item ID

API Client manages:
- JWT token (localStorage)
- Base URL configuration
- Request/response handling
- Error handling
```

## Technology Integration Points

```
┌─────────────────────────────────────────────┐
│            Frontend Technologies            │
├─────────────────────────────────────────────┤
│ HTML5                                       │
│ - Semantic markup                           │
│ - Canvas for QR codes                       │
│ - Video/Image elements for content          │
│                                             │
│ CSS3                                        │
│ - Flexbox & Grid layouts                    │
│ - CSS animations & transitions              │
│ - Media queries for responsive              │
│ - CSS variables for theming                 │
│                                             │
│ Vanilla JavaScript                          │
│ - ES6+ features                             │
│ - Async/await                               │
│ - Fetch API                                 │
│ - Classes for organization                  │
│                                             │
│ External Libraries                          │
│ - Socket.IO Client (CDN)                    │
│ - QRCode.js (CDN)                          │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│            Backend Technologies             │
├─────────────────────────────────────────────┤
│ Node.js & Express                           │
│ - REST API routing                          │
│ - Middleware pipeline                       │
│ - Error handling                            │
│                                             │
│ Socket.IO Server                            │
│ - WebSocket connections                     │
│ - Room management                           │
│ - Event broadcasting                        │
│                                             │
│ Authentication                              │
│ - JWT (jsonwebtoken)                        │
│ - bcryptjs (for password hashing)           │
│                                             │
│ File Handling                               │
│ - Multer (multipart/form-data)              │
│ - File system (fs)                          │
│                                             │
│ Utilities                                   │
│ - Winston (logging)                         │
│ - qrcode (QR generation)                    │
│ - Helmet (security)                         │
│ - CORS (cross-origin)                       │
│ - express-rate-limit                        │
│ - compression                               │
└─────────────────────────────────────────────┘
```

---

**Architecture Summary:**
- **Separation of Concerns**: Backend API separate from frontend static server
- **Real-time Communication**: Socket.IO for live updates
- **RESTful Design**: Clean API endpoints following REST principles
- **Mock Data First**: Works immediately without database
- **Future-Ready**: Easy to switch to SQL Server when needed
- **Scalable**: Can add more studios, screens, and features easily
- **Secure**: JWT authentication, rate limiting, input validation
- **Performant**: Compression, caching headers, efficient updates
