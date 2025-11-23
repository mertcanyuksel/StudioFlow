# Changelog

Projedeki tüm önemli değişikliklerin kaydı.

## [1.0.0] - 2025-11-22

### ✨ İlk Sürüm

#### Eklenenler
- ✅ Backend API (Node.js + Express)
- ✅ Socket.IO gerçek zamanlı iletişim
- ✅ Frontend display ekranları
- ✅ Admin panel (dashboard, CRUD işlemleri)
- ✅ JWT authentication
- ✅ Mock data servisi
- ✅ QR kod üretimi
- ✅ Geri sayım sayacı
- ✅ Eğitmen fotoğrafları
- ✅ Drag-drop takvim yönetimi
- ✅ Reklam slotu desteği

#### Değişiklikler
- ✅ Kapasite/enrollment takibi kaldırıldı
- ✅ Mor renk teması kaldırıldı → Modern dark tema (#0f172a)
- ✅ QR kod canvas → div olarak değiştirildi
- ✅ Eğitmen fotoğrafı placeholder API desteği
- ✅ Glassmorphism UI tasarımı

#### Düzeltmeler
- 🐛 Geri sayım sayacı çalışmıyor → Düzeltildi
- 🐛 QR kod oluşmuyor → Düzeltildi (toDataURL kullanımı)
- 🐛 Fotoğraf gelmiyor → Placeholder fallback eklendi
- 🐛 Display dark background yerine mor arka plan → Düzeltildi

---

## [0.9.0] - 2025-11-21 (Beta)

### Eklenenler
- Backend API endpoints
- Admin panel temel CRUD
- Display ekranları (enrollment ile)

### Bilinen Sorunlar
- Enrollment gereksiz (kullanılmıyor)
- Purple tema kullanıcı istemiyor
- QR kod çalışmıyor
- Countdown çalışmıyor

---

## [0.5.0] - 2025-11-20 (Alpha)

### Eklenenler
- Proje başlangıcı
- Backend skeleton
- Frontend skeleton
- Mock data

---

## Versiyonlama

Bu proje [Semantic Versioning](https://semver.org/) kullanır:
- **MAJOR:** Geriye uyumsuz değişiklikler
- **MINOR:** Yeni özellikler (geriye uyumlu)
- **PATCH:** Bug fix'ler (geriye uyumlu)

## İleride Planlanıyor

### v1.1.0 (Gelecek Sürüm)
- [ ] Haftalık takvim görünümü
- [ ] PDF export
- [ ] Çakışma kontrolü
- [ ] Undo/Redo (Ctrl+Z/Y)
- [ ] Bulk operations

### v1.2.0
- [ ] Gerçek database (PostgreSQL)
- [ ] Kullanıcı rolleri (admin, editor, viewer)
- [ ] Email bildirimler
- [ ] SMS entegrasyonu

### v2.0.0
- [ ] Multi-tenant (birden fazla gym)
- [ ] Mobile app
- [ ] Analytics dashboard
- [ ] API rate limiting iyileştirmeleri

---

## Kategoriler

### 🎉 Added
Yeni özellikler

### 🔄 Changed
Mevcut özelliklerde değişiklikler

### 🗑️ Deprecated
Yakında kaldırılacak özellikler

### ❌ Removed
Kaldırılan özellikler

### 🐛 Fixed
Bug düzeltmeleri

### 🔒 Security
Güvenlik iyileştirmeleri

---

## Git Commit Formatı

Projede kullanılan commit message formatı:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: Yeni özellik
- `fix`: Bug fix
- `docs`: Doküman değişiklikleri
- `style`: Kod formatı (logic değişmedi)
- `refactor`: Kod refactoring
- `test`: Test ekleme/düzenleme
- `chore`: Build/config değişiklikleri

**Örnek:**
```
feat(calendar): add drag-drop functionality

- Implemented drag event handlers
- Added 15-minute snap interval
- Created resize handles for slots

Closes #23
```

---

## Migration Guide

### v0.9.0 → v1.0.0

#### Breaking Changes
1. **Enrollment Kaldırıldı**
   - `CurrentEnrollment` ve `Capacity` alanları yok
   - API response'larında bu alanlar dönmez
   - Frontend'de enrollment-section kaldırıldı

   **Migration:**
   ```javascript
   // Eski kod
   const enrollment = lesson.CurrentEnrollment;
   const capacity = lesson.Capacity;

   // Yeni kod
   // Bu alanlar artık yok, kaldırın
   ```

2. **QR Code Element Değişti**
   - Canvas → Div element

   **Migration:**
   ```html
   <!-- Eski -->
   <canvas id="qr-code"></canvas>

   <!-- Yeni -->
   <div id="qr-code"></div>
   ```

3. **Display Background**
   - Mor gradient → Dark tema

   **Migration:**
   ```css
   /* Eski */
   background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

   /* Yeni */
   background: #0f172a;
   ```

#### Non-Breaking Changes
- Placeholder fotoğraf desteği (otomatik fallback)
- Glassmorphism UI (CSS değişiklikleri)
- Takvim drag-drop (yeni özellik)

---

## Contributors

- **Mert Can Yüksel** - Initial work & maintenance

---

## License

Bu proje özel kullanım için geliştirilmiştir.
