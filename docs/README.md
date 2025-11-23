# Studio Display Management System

Spor salonları için ders bilgilerini stüdyo kapılarında göstermek üzere tasarlanmış web tabanlı bir yönetim sistemi.

## 📋 Proje Özeti

Bu sistem, spor salonlarının stüdyo kapılarında bulunan ekranlarda aktif dersleri, eğitmen bilgilerini, QR kodlarını ve geri sayım sayaçlarını göstermek için geliştirilmiştir. Admin paneli ile dersler, eğitmenler, takvim ve reklam içerikleri yönetilebilir.

## 🎯 Özellikler

### Display (Ekran) Özellikleri
- ✅ Anlık ders bilgisi gösterimi
- ✅ Geri sayım sayacı (ders bitiş zamanı)
- ✅ Eğitmen fotoğrafı
- ✅ QR kod ile kayıt olma
- ✅ Modern, şık dark tema tasarım
- ✅ Gerçek zamanlı Socket.IO güncellemeleri

### Admin Panel Özellikleri
- ✅ Dashboard (istatistikler)
- ✅ Ders yönetimi (CRUD)
- ✅ Eğitmen yönetimi (CRUD)
- ✅ Takvim yönetimi (drag-drop ile slot ekleme/düzenleme)
- ✅ Reklam slotu ekleme
- ✅ İçerik yönetimi (video/resim)
- ✅ Ekran durumu takibi
- ✅ Ayarlar

## 🏗️ Mimari

### Backend
- **Port:** 4141
- **Framework:** Node.js + Express.js
- **Real-time:** Socket.IO
- **Veri:** Mock Data (geliştirme modunda)
- **Auth:** JWT Token

### Frontend
- **Port:** 4040
- **Server:** http-server
- **Tech:** Vanilla JavaScript, HTML5, CSS3
- **Libraries:** Socket.IO Client, QRCode.js

## 📁 Proje Yapısı

```
/Users/mertcanyuksel/
├── backend/                 # Backend API
│   ├── src/
│   │   ├── app.js          # Ana uygulama
│   │   ├── routes/         # API route'ları
│   │   ├── services/       # İş mantığı
│   │   ├── middleware/     # Auth, rate limit vb.
│   │   └── data/           # Mock data
│   └── package.json
│
├── frontend/               # Frontend statik dosyalar
│   ├── admin/             # Admin panel
│   │   ├── calendar.html  # Takvim yönetimi
│   │   ├── lessons.html   # Ders yönetimi
│   │   ├── css/
│   │   └── js/
│   ├── display/           # Stüdyo ekranları
│   │   ├── index.html     # Ana ekran
│   │   ├── css/
│   │   └── js/
│   └── package.json
│
├── docs/                  # Dokümanlar
│   ├── README.md         # Bu dosya
│   ├── ARCHITECTURE.md   # Mimari detayları
│   ├── API.md           # API referansı
│   └── SETUP.md         # Kurulum rehberi
│
└── ARCHITECTURE.md       # Ana mimari döküman
```

## 🚀 Hızlı Başlangıç

### Backend Başlatma
```bash
cd /Users/mertcanyuksel/backend
npm install
npm start
```
Backend: http://localhost:4141

### Frontend Başlatma
```bash
cd /Users/mertcanyuksel/frontend
npm install
npm start
```
Frontend: http://localhost:4040

### Ekranlar
- **Admin Panel:** http://localhost:4040/admin/
  - Kullanıcı: `admin`
  - Şifre: `admin123`
- **Studio A Ekranı:** http://localhost:4040/display/?studio=1
- **Studio B Ekranı:** http://localhost:4040/display/?studio=2

## 📖 Dokümanlar

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Sistem mimarisi ve teknik detaylar
- [API.md](./API.md) - API endpoint referansı
- [SETUP.md](./SETUP.md) - Detaylı kurulum ve yapılandırma
- [CALENDAR.md](./CALENDAR.md) - Takvim drag-drop kullanımı
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Production'a alma

## 🛠️ Teknoloji Stack

### Backend
- Node.js
- Express.js
- Socket.IO (WebSocket)
- Winston (Logging)
- JWT (Authentication)
- Multer (File Upload)
- QRCode Generator

### Frontend
- Vanilla JavaScript (ES6+)
- HTML5
- CSS3 (Glassmorphism, Gradients)
- Socket.IO Client
- QRCode.js

## 📝 Son Değişiklikler

### v1.0 (2025-11-22)
- ✅ Kapasite takibi kaldırıldı
- ✅ Modern dark tema tasarım (mor renkler kaldırıldı)
- ✅ QR kod üretimi düzeltildi
- ✅ Eğitmen fotoğrafı placeholder desteği
- ✅ Geri sayım sayacı düzeltildi
- ✅ Takvim drag-drop özelliği eklendi
- ✅ Reklam slotu desteği

## 🐛 Bilinen Sorunlar

Şu anda bilinen kritik sorun yok.

## 📞 Destek

Sorularınız için proje dokümanlarını inceleyebilir veya issue açabilirsiniz.

## 📄 Lisans

Bu proje özel kullanım için geliştirilmiştir.
