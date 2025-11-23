# StudioFlow

> Modern Sport Studio Display Management System

Spor salonları için ders bilgilerini stüdyo kapılarında göstermek üzere tasarlanmış, modern ve kullanıcı dostu web tabanlı yönetim sistemi.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-18.x-green.svg)
![License](https://img.shields.io/badge/license-Private-red.svg)

---

## 📋 Proje Hakkında

StudioFlow, spor salonlarının stüdyo kapılarında bulunan ekranlarda aktif dersleri, eğitmen bilgilerini, QR kodlarını ve geri sayım sayaçlarını göstermek için geliştirilmiş, gerçek zamanlı bir display yönetim sistemidir.

### ✨ Öne Çıkan Özellikler

- 🎨 **Modern Dark Tema** - Glassmorphism tasarım
- ⚡ **Gerçek Zamanlı Güncelleme** - Socket.IO ile anlık veri
- 📅 **Drag-Drop Takvim** - Kolay program yönetimi
- 📱 **Responsive Tasarım** - Her ekran boyutunda uyumlu
- 🔐 **Güvenli Admin Panel** - JWT authentication
- 📊 **QR Kod Desteği** - Kayıt için QR kod
- ⏱️ **Geri Sayım Sayacı** - Ders bitiş zamanı

---

## 🏗️ Proje Yapısı

```
StudioFlow/
├── backend/              # Backend API (Node.js + Express)
│   ├── src/
│   │   ├── app.js       # Ana uygulama
│   │   ├── routes/      # API endpoints
│   │   ├── controllers/ # İstek kontrolcüleri
│   │   ├── services/    # İş mantığı
│   │   ├── utils/       # Yardımcı fonksiyonlar
│   │   └── data/        # Mock data
│   └── package.json
│
├── frontend-next/       # Frontend (Next.js 15 + TypeScript)
│   ├── app/            # Next.js App Router
│   │   ├── admin/      # Admin panel sayfaları
│   │   │   ├── dashboard/
│   │   │   ├── schedule/    # Program yönetimi
│   │   │   ├── lessons/
│   │   │   ├── instructors/
│   │   │   ├── contents/
│   │   │   └── screens/
│   │   ├── display/    # Stüdyo ekranları
│   │   └── login/      # Giriş sayfası
│   ├── components/     # React bileşenleri
│   │   ├── ui/         # Button, Input, Modal vb.
│   │   └── admin/      # Sidebar vb.
│   ├── store/          # Zustand state yönetimi
│   ├── lib/            # API client ve utils
│   ├── types/          # TypeScript tipleri
│   └── package.json
│
├── frontend/            # Legacy Frontend (Static HTML/CSS/JS)
│   ├── admin/          # Eski admin panel
│   └── display/        # Eski stüdyo ekranları
│
├── docs/               # Dokümantasyon
│   ├── INDEX.md       # Doküman indeksi
│   ├── API.md         # API referansı
│   ├── SETUP.md       # Kurulum rehberi
│   ├── CALENDAR.md    # Takvim kullanımı
│   ├── DEPLOYMENT.md  # Production deploy
│   └── CHANGELOG.md   # Sürüm geçmişi
│
├── ARCHITECTURE.md     # Sistem mimarisi
├── README.md          # Bu dosya
├── LICENSE            # Lisans
└── .gitignore        # Git ignore
```

---

## 🚀 Hızlı Başlangıç

### Gereksinimler

- **Node.js** 16.x veya üzeri
- **npm** 8.x veya üzeri
- **Git** (opsiyonel)

### 1. Kurulum

```bash
# Proje dizinine girin
cd StudioFlow

# Backend kurulum
cd backend
npm install

# Frontend kurulum (Next.js)
cd ../frontend-next
npm install
```

### 2. Çalıştırma

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
Backend API: http://localhost:4141 ✓

**Terminal 2 - Frontend (Next.js):**
```bash
cd frontend-next
npm run dev
```
Frontend: http://localhost:3000 ✓

### 3. Giriş

**Admin Panel:** http://localhost:3000/admin/dashboard
- Kullanıcı: `admin`
- Şifre: `admin123`

**Display Ekranları:**
- Studio A: http://localhost:3000/display/1
- Studio B: http://localhost:3000/display/2

---

## 📖 Dokümantasyon

Detaylı dokümantasyon için [docs/](./docs/) klasörüne bakın:

| Doküman | Açıklama |
|---------|----------|
| [INDEX.md](./docs/INDEX.md) | Doküman haritası ve okuma sırası |
| [API.md](./docs/API.md) | API endpoint referansı |
| [SETUP.md](./docs/SETUP.md) | Detaylı kurulum rehberi |
| [CALENDAR.md](./docs/CALENDAR.md) | Takvim drag-drop kullanımı |
| [DEPLOYMENT.md](./docs/DEPLOYMENT.md) | Production deployment |
| [CHANGELOG.md](./docs/CHANGELOG.md) | Sürüm geçmişi |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Sistem mimarisi |

**Başlangıç için okuma sırası:**
1. Bu dosya (README.md)
2. [SETUP.md](./docs/SETUP.md) - Kurulum
3. [CALENDAR.md](./docs/CALENDAR.md) - Takvim kullanımı
4. [API.md](./docs/API.md) - API referansı

---

## 🛠️ Teknoloji Stack

### Backend
- **Runtime:** Node.js 18.x
- **Framework:** Express.js 4.x
- **Real-time:** Socket.IO 4.x
- **Auth:** JWT (jsonwebtoken)
- **File Upload:** Multer
- **Logging:** Winston
- **QR Code:** qrcode

### Frontend (Next.js 15)
- **Framework:** Next.js 15.1.4
- **Language:** TypeScript
- **UI Library:** React 19
- **Styling:** Tailwind CSS 3.x
- **State Management:** Zustand
- **Real-time:** Socket.IO Client
- **HTTP Client:** Fetch API

### Legacy Frontend (Static)
- **HTML5** - Semantic markup
- **CSS3** - Glassmorphism, Gradients
- **JavaScript** - ES6+ Vanilla JS
- **Socket.IO Client** - Real-time updates
- **http-server** - Static file server

### DevOps
- **Process Manager:** PM2 (production)
- **Reverse Proxy:** Nginx
- **SSL:** Let's Encrypt
- **Database:** Mock data (dev) / PostgreSQL (prod)

---

## 🎯 Kullanım Senaryoları

### 1. Takvim Yönetimi
Admin panel → Takvim → Ders/Reklam slotu ekle → Drag-drop ile düzenle

### 2. Ders Yönetimi
Admin panel → Lessons → Yeni ders ekle → Eğitmen ata → Renk seç → Kaydet

### 3. Display Ekranı
Browser → Display URL → Otomatik güncel ders gösterimi → QR kod + sayaç

---

## 📊 Özellikler

### Display Ekranları
- ✅ Anlık ders bilgisi
- ✅ Eğitmen fotoğrafı (placeholder destekli)
- ✅ QR kod ile kayıt
- ✅ Geri sayım sayacı (uyarı rengi ile)
- ✅ Başlangıç/Bitiş saati
- ✅ Ders açıklaması
- ✅ Bağlantı durumu göstergesi
- ✅ Acil durum overlay
- ✅ Reklam/içerik gösterimi

### Admin Panel
- ✅ Dashboard (istatistikler)
- ✅ Ders yönetimi (CRUD)
- ✅ Eğitmen yönetimi (CRUD)
- ✅ Takvim yönetimi (drag-drop)
- ✅ Reklam slotu ekleme
- ✅ İçerik yönetimi (video/resim upload)
- ✅ Ekran durumu izleme
- ✅ Ayarlar (QR boyutu, refresh interval, vb.)

### API
- ✅ RESTful API
- ✅ JWT authentication
- ✅ Rate limiting
- ✅ CORS protection
- ✅ Socket.IO events
- ✅ File upload
- ✅ Error handling

---

## 🔐 Güvenlik

- ✅ JWT token authentication
- ✅ Bcrypt password hashing
- ✅ Rate limiting (100 req/15min)
- ✅ CORS yapılandırması
- ✅ Input validation
- ✅ Secure headers
- ✅ HTTPS (production)

---

## 🧪 Test

```bash
# Backend test
cd backend
npm test

# Frontend test
cd frontend
npm test
```

---

## 📦 Build & Deploy

### Development
```bash
npm start
```

### Production
```bash
# PM2 ile production deploy
cd backend
pm2 start ecosystem.config.js

# Nginx reverse proxy ayarları için
# docs/DEPLOYMENT.md dosyasına bakın
```

Detaylı deployment rehberi: [DEPLOYMENT.md](./docs/DEPLOYMENT.md)

---

## 🔄 Güncelleme

```bash
# Git ile güncelleme
git pull origin main

# Dependencies
npm install

# Restart
pm2 restart studio-backend
```

---

## 🐛 Sorun Giderme

### Backend başlamıyor
```bash
# Logları kontrol edin
pm2 logs studio-backend

# Port kontrolü
lsof -i :4141
```

### Socket.IO bağlanmıyor
- Backend çalışıyor mu?
- CORS ayarları doğru mu?
- Firewall engelliyor mu?

### QR kod görünmüyor
- Console'da hata var mı?
- QRCode.js yüklü mü?

Detaylı troubleshooting: [SETUP.md](./docs/SETUP.md)

---

## 📝 Changelog

Tüm değişiklikler için: [CHANGELOG.md](./docs/CHANGELOG.md)

### v1.0.0 (2025-11-22)
- ✨ İlk stabil sürüm
- ✅ Modern dark tema
- ✅ Drag-drop takvim
- ✅ QR kod düzeltmesi
- ✅ Placeholder fotoğraf desteği
- 🗑️ Enrollment/kapasite kaldırıldı

---

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing`)
3. Commit yapın (`git commit -m 'feat: add amazing feature'`)
4. Push edin (`git push origin feature/amazing`)
5. Pull Request açın

### Commit Mesaj Formatı

```
<type>(<scope>): <subject>

feat: Yeni özellik
fix: Bug düzeltmesi
docs: Doküman değişikliği
style: Kod formatı
refactor: Refactoring
test: Test ekleme
chore: Build/config
```

---

## 📄 Lisans

Bu proje özel kullanım için geliştirilmiştir.

---

## 👥 Geliştirici

**Mert Can Yüksel**

---

## 📞 Destek

- 📚 [Dokümantasyon](./docs/)
- 🐛 [Issues](https://github.com/yourusername/studioflow/issues)
- 💬 [Discussions](https://github.com/yourusername/studioflow/discussions)

---

## 🙏 Teşekkürler

- Express.js team
- Socket.IO team
- QRCode.js contributors
- Ve tüm açık kaynak topluluğuna

---

<div align="center">

**StudioFlow** - Modern Studio Display Management

Made with ❤️ in Turkey

[Dokümantasyon](./docs/) • [API](./docs/API.md) • [Kurulum](./docs/SETUP.md) • [Changelog](./docs/CHANGELOG.md)

</div>
