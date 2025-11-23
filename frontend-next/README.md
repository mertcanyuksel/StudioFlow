# StudioFlow - Next.js Frontend

Modern React/Next.js uygulaması - Studio Display yönetim sistemi

## 🚀 Teknolojiler

- **Next.js 15** - React framework (App Router)
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - State management
- **Socket.IO Client** - Real-time communication
- **Axios** - HTTP client
- **date-fns** - Date utilities

## 📁 Proje Yapısı

```
frontend-next/
├── app/                      # Next.js App Router
│   ├── admin/               # Admin panel sayfaları
│   │   ├── dashboard/       # Dashboard
│   │   ├── lessons/         # Ders yönetimi
│   │   ├── instructors/     # Eğitmen yönetimi
│   │   ├── schedule/        # Haftalık program
│   │   ├── contents/        # Medya yönetimi
│   │   ├── screens/         # Ekran yönetimi
│   │   ├── settings/        # Ayarlar
│   │   └── layout.tsx       # Admin layout
│   ├── display/             # Display screen
│   │   └── [screenId]/      # Dynamic screen page
│   ├── login/               # Login sayfası
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Ana sayfa
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── ui/                  # UI component library
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Modal.tsx
│   │   └── Loading.tsx
│   └── admin/
│       └── Sidebar.tsx      # Admin sidebar
├── store/                   # Zustand stores
│   ├── authStore.ts         # Authentication
│   ├── mediaStore.ts        # Media management
│   └── scheduleStore.ts     # Schedule management
├── lib/                     # Utilities
│   ├── api.ts               # API client
│   └── dateUtils.ts         # Date helpers
├── types/                   # TypeScript types
│   └── index.ts             # Type definitions
├── .env.local               # Environment variables
├── next.config.ts           # Next.js configuration
├── tailwind.config.ts       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies
```

## 🛠️ Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Development server'ı başlat
npm run dev

# Production build
npm run build

# Production server
npm start
```

## 🌐 Erişim

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4141
- **Admin Panel**: http://localhost:3000/admin/dashboard
- **Login**: http://localhost:3000/login
- **Display Screen**: http://localhost:3000/display/[screenId]

## 📋 Özellikler

### Admin Panel
- ✅ Dashboard - İstatistikler ve hızlı erişim
- ✅ Lessons - Ders programı yönetimi
- ✅ Instructors - Eğitmen bilgileri
- ✅ Schedule - Haftalık program ve override yönetimi
- ✅ Contents - Medya dosyası yükleme ve yönetimi
- ✅ Screens - Display ekran yönetimi
- ✅ Settings - Uygulama ayarları

### Display Screen
- ✅ Real-time content updates (Socket.IO)
- ✅ Lesson display (current and next)
- ✅ Media playback (video/image)
- ✅ Responsive full-screen design
- ✅ Clock and date display

### State Management
- ✅ Authentication state (Zustand)
- ✅ Media library state (Zustand)
- ✅ Schedule state (Zustand)
- ✅ Persistent localStorage integration

### API Integration
- ✅ JWT token authentication
- ✅ Automatic token refresh
- ✅ Request/response interceptors
- ✅ Error handling
- ✅ File upload support

## 🔐 Authentication

Login sayfasından giriş yapın:
- Kullanıcı adı ve şifre ile giriş
- JWT token localStorage'da saklanır
- Otomatik route protection
- Unauthorized isteklerde otomatik logout

## 🎨 UI Components

Tüm UI componentleri Tailwind CSS ile stillendirilmiş ve type-safe:

```tsx
import { Button, Input, Select, Modal, Loading } from '@/components/ui';

<Button variant="primary" size="md" onClick={handleClick}>
  Kaydet
</Button>

<Input label="Email" type="email" fullWidth required />

<Modal isOpen={isOpen} onClose={handleClose} title="Başlık">
  Modal içeriği
</Modal>
```

## 📡 API Client

```typescript
import { api } from '@/lib/api';

// GET request
const response = await api.request<Lesson[]>('/lessons');

// POST request
await api.request('/lessons', 'POST', { LessonName: 'Yoga' });

// File upload
const formData = new FormData();
formData.append('file', file);
await api.upload('/media', formData);
```

## 🔄 Real-time Updates

Display screen Socket.IO ile backend'e bağlanır:

```typescript
const socket = io('http://localhost:4141');
socket.on('content-update', (data) => {
  setContent(data);
});
```

## 🎯 Environment Variables

`.env.local` dosyası:

```env
NEXT_PUBLIC_API_URL=http://localhost:4141/api
```

## 📦 Build & Deploy

```bash
# Production build oluştur
npm run build

# Build'i test et
npm start

# Lint kontrolü
npm run lint
```

## 🔧 Geliştirme Notları

- Next.js App Router kullanılıyor (Pages Router değil)
- Client Components: 'use client' direktifi ile işaretlenmiş
- Server Components: Default olarak server-side render
- Type safety: Tüm API responses type-safe
- Responsive: Tailwind ile mobile-first design

## 🚨 Önemli

- Backend'in port 4141'de çalışması gerekiyor
- Socket.IO bağlantısı için backend'in WebSocket desteği aktif olmalı
- Image/video uploads için backend'de `/uploads` klasörü erişilebilir olmalı

## 📝 TODO

İleride eklenebilecek özellikler:
- [ ] Dark mode desteği
- [ ] Multi-language support (i18n)
- [ ] Advanced drag & drop for schedule
- [ ] PDF export functionality
- [ ] Email notifications
- [ ] Advanced analytics dashboard

## 📄 Lisans

Bu proje özel kullanım içindir.
