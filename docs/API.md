# API Referansı

Studio Display Backend API endpoint'leri.

**Base URL:** `http://localhost:4141/api`

## 🔐 Authentication

Çoğu endpoint JWT token gerektirir. Login sonrası dönen token'ı header'a ekleyin:

```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### POST /api/auth/login
Admin girişi yapar ve JWT token döner.

**Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "UserID": 1,
    "Username": "admin",
    "FullName": "Admin User"
  }
}
```

---

## Lessons Endpoints

### GET /api/lessons
Tüm dersleri listeler.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "LessonID": 1,
      "LessonName": "Morning Yoga",
      "InstructorID": 1,
      "Description": "Start your day with energizing yoga poses",
      "QRCodeData": "https://yourgym.com/lesson/1",
      "DisplayColor": "#10b981",
      "IsActive": true
    }
  ]
}
```

### GET /api/lessons/:id
Belirli bir dersin detayını getirir.

### GET /api/lessons/current/:studioId
O anda aktif olan dersi getirir.

**Response:**
```json
{
  "success": true,
  "data": {
    "LessonID": 5,
    "LessonName": "Gece Meditasyon",
    "InstructorID": 4,
    "InstructorName": "Can Özkan",
    "InstructorPhoto": "/instructors/can.jpg",
    "Description": "Günün stresini atan derin meditasyon seansı",
    "StartTime": "23:00",
    "EndTime": "23:59",
    "RemainingMinutes": 25,
    "QRCodeData": "https://yourgym.com/lesson/5",
    "DisplayColor": "#6366f1"
  }
}
```

### GET /api/lessons/next/:studioId
Sıradaki dersi getirir.

### GET /api/lessons/today/:studioId
Bugünkü tüm dersleri getirir.

### POST /api/lessons
Yeni ders ekler. (Auth gerekli)

**Body:**
```json
{
  "LessonName": "Evening Stretching",
  "InstructorID": 2,
  "Description": "Relax after a long day",
  "QRCodeData": "https://yourgym.com/lesson/8",
  "DisplayColor": "#14b8a6"
}
```

### PUT /api/lessons/:id
Dersi günceller. (Auth gerekli)

### DELETE /api/lessons/:id
Dersi siler. (Auth gerekli)

---

## Instructors Endpoints

### GET /api/instructors
Tüm eğitmenleri listeler.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "InstructorID": 1,
      "InstructorName": "Ayşe Yılmaz",
      "PhotoPath": "/instructors/ayse.jpg",
      "Bio": "Yoga instructor with 10 years experience",
      "Phone": "555-0001",
      "Email": "ayse@gym.com",
      "IsActive": true
    }
  ]
}
```

### GET /api/instructors/:id
Belirli bir eğitmenin detayını getirir.

### POST /api/instructors
Yeni eğitmen ekler. (Auth gerekli)

### PUT /api/instructors/:id
Eğitmeni günceller. (Auth gerekli)

### DELETE /api/instructors/:id
Eğitmeni siler. (Auth gerekli)

---

## Schedule Endpoints

### GET /api/schedule/today/:studioId
Belirli bir stüdyonun bugünkü programını getirir.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "ScheduleID": 1,
      "StudioID": 1,
      "LessonID": 7,
      "LessonName": "Sabah Stretching",
      "InstructorName": "Mehmet Demir",
      "StartTime": "07:00",
      "EndTime": "08:00",
      "DisplayColor": "#14b8a6"
    }
  ]
}
```

### POST /api/schedule
Yeni ders programı ekler. (Auth gerekli)

**Body:**
```json
{
  "StudioID": 1,
  "LessonID": 3,
  "StartTime": "15:00",
  "EndTime": "16:00"
}
```

### PUT /api/schedule/:id
Program slotunu günceller. (Auth gerekli)

### DELETE /api/schedule/:id
Program slotunu siler. (Auth gerekli)

---

## Contents Endpoints

### GET /api/contents
Tüm içerikleri (reklam/video/resim) listeler.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "ContentID": 1,
      "ContentType": "video",
      "Title": "Summer Promotion",
      "FilePath": "/videos/summer-promo.mp4",
      "Duration": 30,
      "Priority": 1,
      "IsActive": true
    }
  ]
}
```

### POST /api/contents/upload
Yeni içerik yükler. (Auth + Multipart gerekli)

**Form Data:**
```
file: [binary]
title: "New Ad"
contentType: "image"
duration: 15
priority: 1
```

### DELETE /api/contents/:id
İçeriği siler. (Auth gerekli)

---

## Screens Endpoints

### GET /api/screens
Tüm ekranları listeler.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "ScreenID": 1,
      "StudioID": 1,
      "ScreenName": "Studio A Door Display",
      "DeviceToken": "token-studio-a",
      "IsOnline": true,
      "LastConnected": "2025-11-22T20:46:50.911Z"
    }
  ]
}
```

### POST /api/screens/heartbeat
Ekran aktiflik durumunu günceller.

**Body:**
```json
{
  "deviceToken": "token-studio-a"
}
```

---

## Settings Endpoints

### GET /api/settings
Tüm ayarları getirir.

**Response:**
```json
{
  "success": true,
  "data": {
    "ShowAdsWhenClassActive": "true",
    "AdIntervalMinutes": "5",
    "AdDurationSeconds": "30",
    "CountdownWarningMinutes": "5",
    "RefreshIntervalSeconds": "10",
    "QRCodeSize": "200",
    "ShowInstructorPhoto": "true"
  }
}
```

### PUT /api/settings
Ayarları günceller. (Auth gerekli)

**Body:**
```json
{
  "AdIntervalMinutes": "10",
  "CountdownWarningMinutes": "3"
}
```

---

## Socket.IO Events

### Client → Server

#### `join-studio`
Belirli bir stüdyo odasına katılır.
```javascript
socket.emit('join-studio', { studioId: 1 });
```

#### `screen-heartbeat`
Ekran canlılık sinyali gönderir.
```javascript
socket.emit('screen-heartbeat', {
  deviceToken: 'token-studio-a',
  studioId: 1
});
```

#### `refresh-lesson`
Ders bilgilerinin yenilenmesini ister.
```javascript
socket.emit('refresh-lesson', { studioId: 1 });
```

### Server → Client

#### `lesson-update`
Ders bilgileri güncellendiğinde tüm istemcilere gönderilir.
```javascript
socket.on('lesson-update', (data) => {
  console.log('Current:', data.current);
  console.log('Next:', data.next);
});
```

#### `content-display`
Reklam içeriği gösterilmesi gerektiğinde gönderilir.
```javascript
socket.on('content-display', (content) => {
  console.log('Show ad:', content);
});
```

#### `emergency-message`
Acil durum mesajı gönderilir.
```javascript
socket.on('emergency-message', (message) => {
  console.log('Emergency:', message);
});
```

#### `screen-status`
Ekran durumu değiştiğinde gönderilir.
```javascript
socket.on('screen-status', (status) => {
  console.log('Screen online:', status.isOnline);
});
```

---

## Error Responses

Hata durumunda dönen yanıt formatı:

```json
{
  "success": false,
  "message": "Error description"
}
```

### HTTP Status Codes
- `200` - Başarılı
- `201` - Oluşturuldu
- `400` - Geçersiz istek
- `401` - Yetkisiz (token geçersiz/yok)
- `404` - Bulunamadı
- `429` - Çok fazla istek (rate limit)
- `500` - Sunucu hatası

---

## Rate Limiting

API'de rate limiting aktif:
- **Pencere:** 15 dakika
- **Maksimum İstek:** 100

Limit aşıldığında `429 Too Many Requests` hatası döner.
