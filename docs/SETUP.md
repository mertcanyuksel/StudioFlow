# Kurulum ve Yapılandırma Rehberi

Bu rehber, Studio Display Management System'in sıfırdan kurulumunu ve yapılandırılmasını anlatır.

## 📋 Gereksinimler

### Sistem Gereksinimleri
- **Node.js:** v16.x veya üzeri
- **npm:** v8.x veya üzeri
- **İşletim Sistemi:** macOS, Linux, Windows

### Donanım Önerileri
- **RAM:** Minimum 2GB
- **Disk:** 500MB boş alan
- **Network:** İnternet bağlantısı (npm paketleri için)

---

## 🚀 Kurulum Adımları

### 1. Projeyi İndirme

Projeyi klonlayın veya ZIP olarak indirin:

```bash
# Git ile klonlama (eğer repo varsa)
git clone <repo-url>
cd studio-display

# Veya ZIP dosyasından çıkarın
unzip studio-display.zip
cd studio-display
```

### 2. Backend Kurulumu

Backend klasörüne gidin ve bağımlılıkları yükleyin:

```bash
cd /Users/mertcanyuksel/backend
npm install
```

#### Backend Bağımlılıkları
- express
- socket.io
- jsonwebtoken
- bcryptjs
- multer
- winston
- cors
- dotenv
- qrcode

### 3. Frontend Kurulumu

Frontend klasörüne gidin ve bağımlılıkları yükleyin:

```bash
cd /Users/mertcanyuksel/frontend
npm install
```

#### Frontend Bağımlılıkları
- http-server (statik dosya sunucusu)

---

## ⚙️ Yapılandırma

### Backend Yapılandırması

#### 1. Environment Variables (Opsiyonel)

Backend'de `.env` dosyası kullanabilirsiniz (şu an mock modda çalıştığı için gerekli değil):

```bash
# /Users/mertcanyuksel/backend/.env
PORT=4141
JWT_SECRET=your-secret-key-here
NODE_ENV=development
DB_MODE=mock
FRONTEND_URL=http://localhost:4040
```

#### 2. Config Dosyası

Backend config'i `src/app.js` içinde tanımlı:

```javascript
const PORT = process.env.PORT || 4141;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4040';
```

### Frontend Yapılandırması

#### 1. Config Dosyası

`/Users/mertcanyuksel/frontend/display/js/config.js` ve `/Users/mertcanyuksel/frontend/admin/js/config.js`:

```javascript
const CONFIG = {
    API_URL: 'http://localhost:4141',
    UPLOADS_URL: 'http://localhost:4141/uploads/',
    STUDIO_ID: new URLSearchParams(window.location.search).get('studio') || '1',
    REFRESH_INTERVAL: 10000, // 10 saniye
    WARNING_MINUTES: 5
};
```

**Önemli:** Production'da `API_URL`'yi gerçek sunucu adresinize değiştirin.

---

## 🏃 Çalıştırma

### Geliştirme Modu

#### Terminal 1: Backend'i Başlatın
```bash
cd /Users/mertcanyuksel/backend
npm start
```

Çıktı:
```
╔═══════════════════════════════════════════════════╗
║   Studio Display Backend API                      ║
║   Port: 4141                                    ║
║   Mode: mock                                       ║
║   Status: Running ✓                               ║
╚═══════════════════════════════════════════════════╝
```

#### Terminal 2: Frontend'i Başlatın
```bash
cd /Users/mertcanyuksel/frontend
npm start
```

Çıktı:
```
Starting up http-server, serving ./
Available on:
  http://127.0.0.1:4040
  http://192.168.1.x:4040
Hit CTRL-C to stop the server
```

### Erişim URL'leri

- **Backend API:** http://localhost:4141
- **Admin Panel:** http://localhost:4040/admin/
- **Studio A Display:** http://localhost:4040/display/?studio=1
- **Studio B Display:** http://localhost:4040/display/?studio=2

---

## 👤 Varsayılan Giriş Bilgileri

### Admin Panel
- **Kullanıcı Adı:** `admin`
- **Şifre:** `admin123`

> ⚠️ **Güvenlik Uyarısı:** Production ortamında mutlaka şifreyi değiştirin!

---

## 📁 Dosya Yükleme

### Uploads Klasörü

Backend'de yüklenen dosyalar için klasör oluşturun:

```bash
cd /Users/mertcanyuksel/backend
mkdir -p public/uploads/instructors
mkdir -p public/uploads/videos
mkdir -p public/uploads/images
mkdir -p public/uploads/qrcodes
```

### Dosya İzinleri

Linux/macOS'ta yazma izinleri verin:

```bash
chmod -R 755 public/uploads
```

---

## 🔧 Sorun Giderme

### Port Zaten Kullanımda

**Hata:** `EADDRINUSE: address already in use :::4141`

**Çözüm:**
```bash
# macOS/Linux
lsof -ti:4141 | xargs kill -9

# Windows
netstat -ano | findstr :4141
taskkill /PID <PID> /F
```

### CORS Hatası

**Hata:** `Access to XMLHttpRequest blocked by CORS policy`

**Çözüm:** Backend `app.js`'de CORS ayarlarını kontrol edin:
```javascript
app.use(cors({
    origin: 'http://localhost:4040',
    credentials: true
}));
```

### Socket.IO Bağlantı Hatası

**Hata:** `WebSocket connection failed`

**Kontrol Edin:**
1. Backend çalışıyor mu? → `http://localhost:4141`
2. Config'de API_URL doğru mu?
3. Firewall Socket.IO'yu engelliyor mu?

### QR Kod Görünmüyor

**Çözüm:**
1. QRCode.js kütüphanesi yüklü mü kontrol edin
2. Console'da hata var mı bakın
3. `display.js`'de `generateQRCode` fonksiyonunu kontrol edin

---

## 🚀 Production Kurulumu

### 1. Environment Variables

Production `.env` dosyası:

```bash
NODE_ENV=production
PORT=4141
JWT_SECRET=<güçlü-random-secret>
FRONTEND_URL=https://yourdomain.com
```

### 2. Process Manager (PM2)

PM2 ile arka planda çalıştırma:

```bash
# PM2 kurulumu
npm install -g pm2

# Backend başlat
cd /Users/mertcanyuksel/backend
pm2 start src/app.js --name studio-backend

# Otomatik başlatma
pm2 startup
pm2 save
```

### 3. Nginx Reverse Proxy

Nginx config örneği:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        root /Users/mertcanyuksel/frontend;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:4141;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Socket.IO
    location /socket.io {
        proxy_pass http://localhost:4141;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
    }
}
```

### 4. SSL Sertifikası (HTTPS)

Let's Encrypt ile ücretsiz SSL:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## 📊 Monitoring

### PM2 Monitoring

```bash
# Status kontrol
pm2 status

# Logları görüntüle
pm2 logs studio-backend

# Restart
pm2 restart studio-backend

# Stop
pm2 stop studio-backend
```

### Winston Logs

Backend logları `backend/logs/` klasöründe:
- `combined.log` - Tüm loglar
- `error.log` - Sadece hatalar

---

## 🔄 Güncelleme

### Backend Güncelleme

```bash
cd /Users/mertcanyuksel/backend
git pull origin main
npm install
pm2 restart studio-backend
```

### Frontend Güncelleme

```bash
cd /Users/mertcanyuksel/frontend
git pull origin main
# Statik dosyalar otomatik güncellenir
```

---

## 🔐 Güvenlik

### Production Checklist

- [ ] JWT_SECRET değiştirildi ve güçlü
- [ ] Admin şifresi değiştirildi
- [ ] HTTPS aktif (SSL sertifikası)
- [ ] Rate limiting aktif
- [ ] CORS doğru yapılandırıldı
- [ ] Uploads klasörü izinleri doğru
- [ ] Database (production'da SQL) şifreleri güçlü
- [ ] Firewall kuralları aktif
- [ ] Backup stratejisi oluşturuldu

### Önerilen Ek Güvenlik

1. **Helmet.js** - HTTP header güvenliği
```bash
npm install helmet
```

2. **Express Rate Limit** - Zaten aktif ama ayarları gözden geçirin

3. **Input Validation** - express-validator kullanın

---

## 📞 Yardım

Sorun yaşarsanız:
1. Logları kontrol edin (`pm2 logs` veya `backend/logs/`)
2. Console hatalarına bakın (F12)
3. API endpoint'lerini test edin (Postman)
4. Dokümanları tekrar okuyun

---

## ✅ Kurulum Sonrası Test

Tüm özelliklerin çalıştığını doğrulamak için:

1. **Admin Panel Testi**
   - Login yapın
   - Yeni ders ekleyin
   - Takvimde slot oluşturun
   - Eğitmen ekleyin

2. **Display Testi**
   - Studio 1 ekranını açın
   - Aktif ders görünüyor mu?
   - Geri sayım çalışıyor mu?
   - QR kod oluşuyor mu?
   - Eğitmen fotoğrafı yükleniyor mu?

3. **Socket.IO Testi**
   - Admin'de ders ekleyin
   - Display otomatik güncelliyor mu?

4. **Performance Testi**
   - 2-3 browser tab açın
   - CPU ve RAM kullanımını kontrol edin
   - Socket bağlantıları stabil mi?

Tüm testler başarılıysa kurulum tamamdır! 🎉
