# Production Deployment Rehberi

Bu rehber, Studio Display Management System'in production ortamına nasıl deploy edileceğini anlatır.

## 🎯 Deployment Seçenekleri

### 1. VPS (Virtual Private Server)
- DigitalOcean Droplet
- AWS EC2
- Google Cloud Compute Engine
- Linode

### 2. PaaS (Platform as a Service)
- Heroku
- Railway
- Render
- Fly.io

### 3. Container
- Docker + Docker Compose
- Kubernetes

Bu rehberde **VPS (Ubuntu Server)** üzerinden deployment anlatılacaktır.

---

## 📋 Gereksinimler

### Sunucu Gereksinimleri
- **OS:** Ubuntu 20.04 LTS veya üzeri
- **RAM:** Minimum 2GB (4GB önerilir)
- **Disk:** 20GB SSD
- **CPU:** 1 vCPU (2 vCPU önerilir)
- **Network:** Statik IP adresi

### Domain ve SSL
- Domain adı (örn: studiodisplay.com)
- SSL sertifikası (Let's Encrypt ücretsiz)

---

## 🚀 Adım Adım Deployment

### 1. Sunucu Hazırlığı

#### Ubuntu Güncellemeleri

```bash
# Sunucuya SSH ile bağlanın
ssh root@your-server-ip

# Sistem güncellemeleri
apt update && apt upgrade -y

# Gerekli paketler
apt install -y curl git nginx
```

#### Node.js Kurulumu

```bash
# NodeSource repository ekle (Node.js 18.x)
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -

# Node.js ve npm yükle
apt install -y nodejs

# Versiyonları kontrol et
node -v  # v18.x.x
npm -v   # 9.x.x
```

#### PM2 Kurulumu (Process Manager)

```bash
npm install -g pm2
```

---

### 2. Kullanıcı Oluşturma

Güvenlik için root yerine ayrı kullanıcı oluşturun:

```bash
# Yeni kullanıcı
adduser studio
usermod -aG sudo studio

# Kullanıcıya geç
su - studio
```

---

### 3. Proje Kurulumu

#### Proje Dosyalarını Upload Etme

**Yöntem 1: Git Clone**

```bash
cd ~
git clone https://github.com/yourusername/studio-display.git
cd studio-display
```

**Yöntem 2: SCP ile Transfer**

Local bilgisayarınızdan:

```bash
# Backend
scp -r /Users/mertcanyuksel/backend studio@your-server-ip:~/backend

# Frontend
scp -r /Users/mertcanyuksel/frontend studio@your-server-ip:~/frontend
```

#### Backend Kurulum

```bash
cd ~/backend
npm install --production
```

#### Frontend Kurulum

```bash
cd ~/frontend
npm install --production
```

---

### 4. Environment Variables

Production environment dosyası oluşturun:

```bash
cd ~/backend
nano .env
```

İçerik:

```bash
# Production Environment
NODE_ENV=production
PORT=4141

# JWT Secret (güçlü random string)
JWT_SECRET=your-super-secret-random-string-here-change-this

# Frontend URL
FRONTEND_URL=https://yourdomain.com

# Database (production'da gerçek DB)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=studio_display
DB_USER=studio_user
DB_PASSWORD=strong-password-here

# Logs
LOG_LEVEL=info
LOG_DIR=/var/log/studio-display
```

**Önemli:** `.env` dosyasını Git'e eklemeyin!

```bash
echo ".env" >> .gitignore
```

---

### 5. PM2 ile Backend Başlatma

#### PM2 Ecosystem Dosyası

```bash
cd ~/backend
nano ecosystem.config.js
```

İçerik:

```javascript
module.exports = {
  apps: [{
    name: 'studio-backend',
    script: './src/app.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    },
    error_file: '/var/log/studio-display/error.log',
    out_file: '/var/log/studio-display/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm Z',
    max_memory_restart: '500M',
    autorestart: true,
    watch: false
  }]
};
```

#### PM2 Başlatma

```bash
# Backend başlat
pm2 start ecosystem.config.js

# Status kontrol
pm2 status

# Logs
pm2 logs studio-backend

# Sunucu reboot'ta otomatik başlasın
pm2 startup systemd
pm2 save
```

---

### 6. Nginx Reverse Proxy

#### Nginx Config

```bash
sudo nano /etc/nginx/sites-available/studio-display
```

İçerik:

```nginx
# Upstream backend
upstream studio_backend {
    server 127.0.0.1:4141;
    keepalive 64;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Root directory (frontend)
    root /home/studio/frontend;
    index index.html;

    # Logs
    access_log /var/log/nginx/studio-access.log;
    error_log /var/log/nginx/studio-error.log;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1000;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Frontend static files
    location / {
        try_files $uri $uri/ /index.html;
        expires 1h;
        add_header Cache-Control "public, immutable";
    }

    # Admin panel
    location /admin {
        try_files $uri $uri/ /admin/index.html;
    }

    # Display
    location /display {
        try_files $uri $uri/ /display/index.html;
    }

    # API proxy
    location /api {
        proxy_pass http://studio_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Socket.IO
    location /socket.io {
        proxy_pass http://studio_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Uploads
    location /uploads {
        alias /home/studio/backend/public/uploads;
        expires 7d;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Nginx Aktifleştirme

```bash
# Symlink oluştur
sudo ln -s /etc/nginx/sites-available/studio-display /etc/nginx/sites-enabled/

# Default site'ı kaldır
sudo rm /etc/nginx/sites-enabled/default

# Config test
sudo nginx -t

# Nginx restart
sudo systemctl restart nginx
```

---

### 7. SSL Sertifikası (HTTPS)

Let's Encrypt ile ücretsiz SSL:

```bash
# Certbot kurulum
sudo apt install -y certbot python3-certbot-nginx

# SSL sertifikası al
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Email ve HTTPS redirect sorularını yanıtlayın

# Otomatik yenileme testi
sudo certbot renew --dry-run
```

Nginx config otomatik güncellenecek ve HTTPS aktif olacak.

---

### 8. Firewall (UFW)

```bash
# UFW aktif et
sudo ufw enable

# Port izinleri
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS

# Status
sudo ufw status
```

---

### 9. Database Kurulumu (Production)

Mock data yerine gerçek database kullanmak için:

#### PostgreSQL Kurulum

```bash
# PostgreSQL yükle
sudo apt install -y postgresql postgresql-contrib

# PostgreSQL başlat
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Kullanıcı ve database oluştur
sudo -u postgres psql

CREATE DATABASE studio_display;
CREATE USER studio_user WITH PASSWORD 'strong-password-here';
GRANT ALL PRIVILEGES ON DATABASE studio_display TO studio_user;
\q
```

#### Database Migration

```bash
cd ~/backend

# Database şeması oluştur
npm run migrate  # (Bu script'i oluşturmanız gerekir)
```

#### Backend'de Database Modu Aktif Etme

`backend/src/app.js` içinde:

```javascript
const DB_MODE = process.env.DB_MODE || 'postgres'; // 'mock' yerine
```

---

### 10. Monitoring ve Logging

#### PM2 Monitoring

```bash
# PM2 monit
pm2 monit

# Process listesi
pm2 list

# Detaylı bilgi
pm2 info studio-backend

# Logs
pm2 logs --lines 100
```

#### Log Rotation

```bash
sudo nano /etc/logrotate.d/studio-display
```

İçerik:

```
/var/log/studio-display/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 studio studio
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
```

---

### 11. Backup Stratejisi

#### Database Backup

Otomatik backup script:

```bash
nano ~/backup-db.sh
```

İçerik:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/studio/backups"
mkdir -p $BACKUP_DIR

# PostgreSQL backup
pg_dump -U studio_user studio_display | gzip > $BACKUP_DIR/db_backup_$DATE.sql.gz

# Eski backupları sil (30 günden eski)
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: db_backup_$DATE.sql.gz"
```

İzinler:

```bash
chmod +x ~/backup-db.sh
```

Cron job:

```bash
crontab -e

# Her gün saat 03:00'da backup
0 3 * * * /home/studio/backup-db.sh >> /var/log/backup.log 2>&1
```

#### Uploads Backup

```bash
# Uploads klasörünü yedekle
tar -czf ~/backups/uploads_$(date +%Y%m%d).tar.gz ~/backend/public/uploads
```

---

### 12. Güncelleme Prosedürü

Yeni versiyon deploy etmek için:

```bash
# Git pull (veya dosya transferi)
cd ~/backend
git pull origin main

# Dependencies güncelle
npm install --production

# PM2 restart
pm2 restart studio-backend

# Nginx reload (gerekirse)
sudo nginx -s reload
```

**Zero-downtime deployment için:**

```bash
pm2 reload studio-backend
```

---

## 🔐 Güvenlik Checklist

Production'da mutlaka yapılması gerekenler:

- [ ] `.env` dosyası güçlü şifrelerle dolduruldu
- [ ] Admin şifresi değiştirildi (mock'tan farklı)
- [ ] JWT_SECRET güçlü random string
- [ ] HTTPS aktif (SSL sertifikası)
- [ ] Firewall aktif (UFW)
- [ ] SSH key-based auth (şifre girişi kapalı)
- [ ] Database şifreleri güçlü
- [ ] Nginx security headers aktif
- [ ] PM2 ile process izolasyonu
- [ ] Log rotation aktif
- [ ] Backup stratejisi çalışıyor
- [ ] Rate limiting aktif
- [ ] CORS sadece gerekli domainlere açık

---

## 📊 Performance Optimization

### PM2 Cluster Mode

```javascript
// ecosystem.config.js
instances: 'max',  // CPU çekirdek sayısı kadar
exec_mode: 'cluster'
```

### Nginx Caching

```nginx
# Static cache
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

### Database Connection Pool

```javascript
// backend/src/config/database.js
const pool = new Pool({
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});
```

---

## 🔍 Troubleshooting

### Backend Çalışmıyor

```bash
# PM2 status
pm2 status

# Logs
pm2 logs studio-backend --lines 50

# Restart
pm2 restart studio-backend
```

### Nginx Hataları

```bash
# Nginx test
sudo nginx -t

# Error log
sudo tail -f /var/log/nginx/studio-error.log

# Access log
sudo tail -f /var/log/nginx/studio-access.log
```

### Database Bağlantı Hatası

```bash
# PostgreSQL çalışıyor mu?
sudo systemctl status postgresql

# Bağlantı testi
psql -U studio_user -d studio_display -h localhost
```

### SSL Sertifika Yenileme

```bash
# Manuel yenileme
sudo certbot renew

# Cron job (otomatik)
0 3 * * 0 certbot renew --quiet
```

---

## 📱 Display Cihazları Yapılandırması

### Raspberry Pi Setup

Display ekranları için Raspberry Pi kullanıyorsanız:

```bash
# Chromium autostart
nano ~/.config/lxsession/LXDE-pi/autostart

# Ekle:
@chromium-browser --kiosk --disable-restore-session-state https://yourdomain.com/display/?studio=1
```

### Tablet/iPad Setup

- Safari/Chrome açın
- Display URL'e gidin: `https://yourdomain.com/display/?studio=1`
- "Add to Home Screen"
- Home ekranından başlatın (fullscreen)

---

## 📈 Monitoring Tools (Opsiyonel)

### 1. PM2 Plus

```bash
pm2 link <secret> <public>
```

Web dashboard: https://app.pm2.io

### 2. Uptime Monitoring

- UptimeRobot
- Pingdom
- StatusCake

### 3. Error Tracking

- Sentry
- Rollbar
- Bugsnag

---

## ✅ Post-Deployment Checklist

- [ ] Backend PM2'de çalışıyor
- [ ] Frontend Nginx'ten servis ediliyor
- [ ] HTTPS aktif ve çalışıyor
- [ ] Admin panel açılıyor (https://yourdomain.com/admin)
- [ ] Display ekranları açılıyor
- [ ] Socket.IO bağlantıları çalışıyor
- [ ] QR kodları oluşuyor
- [ ] Geri sayım çalışıyor
- [ ] Fotoğraflar yükleniyor
- [ ] Database bağlantısı aktif
- [ ] Backup çalışıyor
- [ ] Monitoring aktif
- [ ] Loglar düzgün yazılıyor

Deployment tamamlandı! 🎉

---

## 📞 Destek

Deployment sırasında sorun yaşarsanız:

1. Logları kontrol edin
2. Error mesajlarını okuyun
3. Google/Stack Overflow'da arayın
4. GitHub issues açın
