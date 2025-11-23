# Doküman İndeksi

Studio Display Management System - Tüm dokümanların merkezi indeksi.

---

## 📚 Ana Dokümanlar

### 1. [README.md](./README.md)
**Genel Bakış ve Hızlı Başlangıç**

Projeye ilk bakış için başlangıç noktası:
- Proje özeti
- Temel özellikler
- Hızlı kurulum
- Teknoloji stack
- Doküman linkleri

**Hedef Kitle:** Herkes (yeni geliştiriciler, kullanıcılar)

---

### 2. [ARCHITECTURE.md](./ARCHITECTURE.md)
**Sistem Mimarisi ve Teknik Detaylar**

Projenin teknik mimarisinin tam açıklaması:
- Sistem mimarisi diyagramları
- Backend yapısı (routes, services, middleware)
- Frontend yapısı (admin, display)
- Socket.IO real-time iletişim
- Database şeması
- API tasarımı
- Güvenlik mimarisi

**Hedef Kitle:** Backend/Frontend geliştiriciler, sistem mimarları

**Sayfa Sayısı:** ~26KB

---

### 3. [API.md](./API.md)
**API Endpoint Referansı**

Tüm backend API endpoint'lerinin detaylı dokümanı:
- Auth endpoints (login)
- Lessons CRUD
- Instructors CRUD
- Schedule management
- Contents (ads/media)
- Screens monitoring
- Settings
- Socket.IO events
- Error responses
- Rate limiting

**Hedef Kitle:** Frontend geliştiriciler, API tüketicileri

**Sayfa Sayısı:** ~7KB

---

### 4. [SETUP.md](./SETUP.md)
**Kurulum ve Yapılandırma Rehberi**

Sıfırdan kurulum için adım adım rehber:
- Sistem gereksinimleri
- Backend/Frontend kurulumu
- Environment variables
- Config dosyaları
- Dosya yükleme yapılandırması
- Sorun giderme
- Production kurulum
- PM2 process manager
- Nginx reverse proxy
- SSL sertifikası

**Hedef Kitle:** DevOps, sistem yöneticileri, yeni geliştiriciler

**Sayfa Sayısı:** ~8KB

---

### 5. [CALENDAR.md](./CALENDAR.md)
**Takvim Drag-Drop Kullanım Kılavuzu**

Admin panel takvim özelliğinin detaylı kullanımı:
- Genel bakış
- Ders/Reklam slotu ekleme
- Drag-drop slot taşıma
- Resize ile süre değiştirme
- Slot düzenleme/silme
- Renk kodları
- Otomatik yuvarlanma
- Klavye kısayolları (gelecek)
- Debug ipuçları

**Hedef Kitle:** Admin kullanıcıları, UI/UX geliştiriciler

**Sayfa Sayısı:** ~9KB

---

### 6. [DEPLOYMENT.md](./DEPLOYMENT.md)
**Production Deployment Rehberi**

Production ortamına deploy için tam rehber:
- VPS kurulumu (Ubuntu)
- Node.js ve PM2 kurulumu
- Environment variables (production)
- Nginx reverse proxy
- SSL sertifikası (Let's Encrypt)
- Firewall yapılandırması
- PostgreSQL kurulumu
- Backup stratejisi
- Monitoring ve logging
- Güvenlik checklist
- Performance optimization
- Troubleshooting

**Hedef Kitle:** DevOps, sistem yöneticileri

**Sayfa Sayısı:** ~12KB

---

### 7. [CHANGELOG.md](./CHANGELOG.md)
**Sürüm Geçmişi ve Değişiklikler**

Projedeki tüm değişikliklerin kronolojik kaydı:
- Sürüm notları (v1.0.0, v0.9.0, vb.)
- Eklenen özellikler
- Değişiklikler
- Düzeltilen buglar
- Gelecek planları
- Migration guide
- Git commit formatı

**Hedef Kitle:** Herkes (özellikle upgrade yapanlar)

**Sayfa Sayısı:** ~3KB

---

## 🗂️ Doküman Kategorileri

### Başlangıç Seviyesi
1. README.md - Projeye giriş
2. SETUP.md - Kurulum
3. CALENDAR.md - Kullanıcı arayüzü

### Orta Seviye
1. API.md - API kullanımı
2. CHANGELOG.md - Değişiklik takibi

### İleri Seviye
1. ARCHITECTURE.md - Sistem tasarımı
2. DEPLOYMENT.md - Production deployment

---

## 🎯 Kullanım Senaryoları

### Senaryo 1: Yeni Geliştirici Katılıyor

**Okuma Sırası:**
1. **README.md** - Projeyi tanı
2. **SETUP.md** - Geliştirme ortamını kur
3. **ARCHITECTURE.md** - Sistem mimarisini anla
4. **API.md** - API'leri öğren
5. **CALENDAR.md** - UI özelliklerini öğren

### Senaryo 2: Production'a Deploy Edilecek

**Okuma Sırası:**
1. **DEPLOYMENT.md** - Deployment adımları
2. **SETUP.md** - Environment config
3. **CHANGELOG.md** - Son değişiklikleri gör
4. Security checklist (DEPLOYMENT.md içinde)

### Senaryo 3: Admin Kullanıcısı Eğitimi

**Okuma Sırası:**
1. **README.md** - Genel bakış
2. **CALENDAR.md** - Takvim kullanımı
3. Admin panel özellikleri (README.md içinde)

### Senaryo 4: API Entegrasyonu

**Okuma Sırası:**
1. **API.md** - Tüm endpoint'ler
2. **ARCHITECTURE.md** - Auth ve security
3. Socket.IO events (API.md içinde)

### Senaryo 5: Troubleshooting

**Okuma Sırası:**
1. **SETUP.md** - Sorun giderme bölümü
2. **DEPLOYMENT.md** - Production troubleshooting
3. **CHANGELOG.md** - Breaking changes kontrol

---

## 📖 Doküman Formatı

Tüm dokümanlar **Markdown** formatındadır:
- GitHub'da otomatik render edilir
- VS Code ile preview açılabilir
- Markdown viewer'larda okunabilir

### VS Code'da Okuma

```bash
# Preview aç (macOS)
Cmd + Shift + V

# Preview aç (Windows/Linux)
Ctrl + Shift + V
```

### Web'de Okuma

GitHub repo'sunda her dosya otomatik render edilir.

---

## 🔍 Hızlı Arama

Doküman içinde arama yapmak için:

**macOS:**
```bash
grep -r "aranacak kelime" /Users/mertcanyuksel/docs/
```

**Veya VS Code:**
- Cmd+Shift+F (macOS) / Ctrl+Shift+F (Windows)
- docs klasöründe ara

---

## 📊 Doküman İstatistikleri

| Dosya | Boyut | Satır | Konu |
|-------|-------|-------|------|
| README.md | 4.2KB | ~150 | Genel bakış |
| ARCHITECTURE.md | 26KB | ~850 | Sistem mimarisi |
| API.md | 6.7KB | ~280 | API referansı |
| SETUP.md | 8.3KB | ~350 | Kurulum |
| CALENDAR.md | 9.1KB | ~400 | Takvim kullanımı |
| DEPLOYMENT.md | 12KB | ~500 | Production deploy |
| CHANGELOG.md | 3KB | ~120 | Sürüm geçmişi |
| **TOPLAM** | **~70KB** | **~2650** | **7 dosya** |

---

## 🛠️ Doküman Bakımı

### Güncelleme Sıklığı

- **README.md:** Her major release
- **ARCHITECTURE.md:** Mimari değişikliklerinde
- **API.md:** Yeni endpoint eklendiğinde
- **SETUP.md:** Kurulum değişikliklerinde
- **CALENDAR.md:** UI değişikliklerinde
- **DEPLOYMENT.md:** Production prosedürü değiştiğinde
- **CHANGELOG.md:** Her commit/release'de

### Doküman Güncelleme Checklist

Yeni özellik eklendiğinde:
- [ ] CHANGELOG.md'ye ekle
- [ ] İlgili dokümanı güncelle (API/CALENDAR/vb.)
- [ ] README.md'deki özellik listesini güncelle
- [ ] ARCHITECTURE.md'yi güncelle (gerekirse)
- [ ] Code comments ekle

---

## 📝 Katkıda Bulunma

Dokümanlara katkıda bulunmak için:

1. Typo/hata bulursanız düzeltin
2. Eksik bilgi varsa ekleyin
3. Örnekler ekleyin
4. Diagramlar çizin
5. Pull request açın

**Doküman Yazma Kuralları:**
- Açık ve net dil kullanın
- Örnekler verin
- Kod blokları ekleyin
- Başlıkları mantıklı kullanın
- TOC (Table of Contents) ekleyin
- Emoji kullanın (okunabilirlik için) 😊

---

## 🔗 Harici Kaynaklar

Ek okumalar için:

### Node.js/Express
- [Express.js Docs](https://expressjs.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

### Socket.IO
- [Socket.IO Documentation](https://socket.io/docs/)
- [Real-time Apps Guide](https://socket.io/get-started/chat)

### Frontend
- [Vanilla JS Guide](https://javascript.info/)
- [CSS Glassmorphism](https://css-tricks.com/glassmorphism/)

### Deployment
- [PM2 Documentation](https://pm2.keymetrics.io/)
- [Nginx Guide](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/)

---

## 💡 İpuçları

### Doküman Okuma İpuçları

1. **Sırayla okuyun:** INDEX → README → ilgili doküman
2. **Kod örneklerini test edin:** Kopyala-yapıştır yapın
3. **Not alın:** Önemli kısımları işaretleyin
4. **Pratik yapın:** Okuduklarınızı uygulayın

### Etkili Öğrenme

1. **Önce genel bakış:** README'den başlayın
2. **Derinlemesine inin:** ARCHITECTURE'u okuyun
3. **Pratik yapın:** Kodu yazın/değiştirin
4. **Troubleshoot edin:** Hata çözmeyi öğrenin

---

## 📞 Yardım

Dokümanlar hakkında soru sormak için:
- GitHub Issues açın
- Geliştiricilere ulaşın
- FAQ bölümünü kontrol edin (ileride eklenecek)

---

## ✅ Checklist: Doküman Okuma

Tüm dokümanları okuduğunuzda:

- [ ] README.md okudum
- [ ] ARCHITECTURE.md okudum
- [ ] API.md okudum
- [ ] SETUP.md okudum (ve kurulum yaptım)
- [ ] CALENDAR.md okudum (ve test ettim)
- [ ] DEPLOYMENT.md okudum
- [ ] CHANGELOG.md okudum

Tebrikler! Artık proje hakkında uzman oldunuz! 🎉

---

**Son Güncelleme:** 2025-11-22
**Versiyon:** 1.0.0
**Toplam Doküman:** 7 dosya (~70KB)
