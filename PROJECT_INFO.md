# StudioFlow - Proje Bilgileri

**Proje İsmi:** StudioFlow
**Versiyon:** 1.0.0
**Tarih:** 22 Kasım 2025
**Geliştirici:** Mert Can Yüksel

---

## 📊 Proje İstatistikleri

### Dosya Yapısı
- **Toplam Boyut:** ~19 MB
- **Backend:** 19 MB (2329 dosya - çoğu node_modules)
- **Frontend:** 156 KB (26 dosya)
- **Docs:** 128 KB (11 doküman)

### Kod İstatistikleri
- **Backend JS Dosyaları:** ~15 dosya
- **Frontend JS Dosyaları:** ~10 dosya
- **HTML Dosyaları:** ~8 dosya
- **CSS Dosyaları:** ~5 dosya
- **Markdown Dokümanları:** 11 dosya

---

## 📁 Klasör Yapısı

```
/Users/mertcanyuksel/StudioFlow/
├── README.md              # Ana README
├── LICENSE               # MIT License
├── .gitignore           # Git ignore kuralları
├── ARCHITECTURE.md      # Sistem mimarisi
│
├── backend/             # Backend API
│   ├── src/
│   │   ├── app.js
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── data/
│   ├── public/
│   │   └── uploads/
│   ├── logs/
│   ├── package.json
│   └── .env
│
├── frontend/           # Frontend
│   ├── admin/         # Admin panel
│   ├── display/       # Display screens
│   ├── assets/        # Shared assets
│   └── package.json
│
└── docs/              # Dokümantasyon
    ├── INDEX.md       # Doküman indeksi
    ├── API.md         # API referansı
    ├── SETUP.md       # Kurulum
    ├── CALENDAR.md    # Takvim kullanımı
    ├── DEPLOYMENT.md  # Production deploy
    ├── CHANGELOG.md   # Değişiklik logu
    └── README.md      # Docs README
```

---

## 🚀 Çalıştırma

### Backend Başlatma
```bash
cd /Users/mertcanyuksel/StudioFlow/backend
npm start
```
**URL:** http://localhost:4141

### Frontend Başlatma
```bash
cd /Users/mertcanyuksel/StudioFlow/frontend
npm start
```
**URL:** http://localhost:4040

---

## 🔗 Önemli URL'ler

### Development
- **Backend API:** http://localhost:4141
- **Admin Panel:** http://localhost:4040/admin/
- **Studio A Display:** http://localhost:4040/display/?studio=1
- **Studio B Display:** http://localhost:4040/display/?studio=2

### API Endpoints
- **Health Check:** http://localhost:4141/api/health
- **Current Lesson:** http://localhost:4141/api/lessons/current/1
- **Login:** http://localhost:4141/api/auth/login

---

## 📚 Doküman Rehberi

### Yeni Başlayanlar İçin
1. [README.md](./README.md) - Projeye genel bakış
2. [docs/SETUP.md](./docs/SETUP.md) - Kurulum adımları
3. [docs/CALENDAR.md](./docs/CALENDAR.md) - Takvim kullanımı

### Geliştiriciler İçin
1. [ARCHITECTURE.md](./ARCHITECTURE.md) - Sistem mimarisi
2. [docs/API.md](./docs/API.md) - API referansı
3. [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) - Production deploy

### Tüm Dokümanlar
- [docs/INDEX.md](./docs/INDEX.md) - Doküman haritası

---

## 🛠️ Teknolojiler

### Backend
- Node.js 18.x
- Express.js 4.x
- Socket.IO 4.x
- JWT Authentication
- Winston Logger
- Multer (File Upload)
- QRCode Generator

### Frontend
- HTML5
- CSS3 (Glassmorphism)
- Vanilla JavaScript ES6+
- Socket.IO Client
- QRCode.js
- http-server

---

## 🔐 Varsayılan Bilgiler

### Admin Girişi
- **Kullanıcı:** admin
- **Şifre:** admin123
- **URL:** http://localhost:4040/admin/

### Mock Data
- **Studios:** 2 (Studio A, Studio B)
- **Instructors:** 5 eğitmen
- **Lessons:** 7 ders tipi
- **Schedule:** 9 ders slotu

---

## 📦 Kurulum Komutları

### İlk Kurulum
```bash
# Backend
cd StudioFlow/backend
npm install

# Frontend
cd StudioFlow/frontend
npm install
```

### Production Build
```bash
# Backend - PM2 ile
cd StudioFlow/backend
pm2 start ecosystem.config.js

# Frontend - Nginx ile servis
# docs/DEPLOYMENT.md'ye bakın
```

---

## 🔄 Git Komutları

### Yeni Repo Oluşturma
```bash
cd /Users/mertcanyuksel/StudioFlow
git init
git add .
git commit -m "feat: initial commit - StudioFlow v1.0.0"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

### Güncelleme
```bash
git add .
git commit -m "feat: description of changes"
git push
```

---

## 🐛 Sorun Giderme

### Port Zaten Kullanımda
```bash
# 4141 portunu temizle
lsof -ti:4141 | xargs kill -9

# 4040 portunu temizle
lsof -ti:4040 | xargs kill -9
```

### Node Modules Problemi
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Logs Kontrol
```bash
# Backend logs
tail -f backend/logs/combined.log

# PM2 logs (production)
pm2 logs studio-backend
```

---

## 📝 Önemli Notlar

### ⚠️ Güvenlik
- Production'da `.env` dosyasını değiştirin
- Admin şifresini değiştirin
- JWT_SECRET'i güçlü yapın
- HTTPS kullanın

### 💡 İpuçları
- Mock data geliştirme içindir
- Production'da PostgreSQL kullanın
- PM2 ile process yönetimi yapın
- Nginx reverse proxy kullanın

### 🔄 Güncel Kalma
- Düzenli `npm audit` çalıştırın
- Dependencies'leri güncelleyin
- Logs'ları kontrol edin
- Backup alın

---

## 📞 Destek ve İletişim

### Dokümantasyon
- Ana README: [README.md](./README.md)
- Doküman İndeksi: [docs/INDEX.md](./docs/INDEX.md)
- API Referansı: [docs/API.md](./docs/API.md)

### Sorun Bildirme
- GitHub Issues
- Email: [developer@example.com]

---

## ✅ Checklist: Proje Kurulumu

- [ ] Node.js kurulu
- [ ] npm kurulu
- [ ] Proje klonlandı/indirildi
- [ ] Backend dependencies yüklendi (`npm install`)
- [ ] Frontend dependencies yüklendi (`npm install`)
- [ ] Backend başlatıldı (port 4141)
- [ ] Frontend başlatıldı (port 4040)
- [ ] Admin panel açıldı
- [ ] Display ekranları test edildi
- [ ] QR kodları çalışıyor
- [ ] Geri sayım çalışıyor
- [ ] Socket.IO bağlantısı aktif

---

## 🎉 Proje Tamamlandı!

StudioFlow başarıyla organize edildi ve kullanıma hazır!

**Proje Konumu:** `/Users/mertcanyuksel/StudioFlow/`

---

**Son Güncelleme:** 22 Kasım 2025
**Durum:** ✅ Stabil - Production Ready
