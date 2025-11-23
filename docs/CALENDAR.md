# Takvim Drag-Drop Kullanım Kılavuzu

Admin panelindeki takvim yönetimi özelliğinin detaylı kullanım rehberi.

## 📅 Genel Bakış

Takvim sayfası, stüdyoların günlük ders programlarını görsel olarak yönetmenizi sağlar. Drag-drop ile slot ekleme, düzenleme, taşıma ve boyutlandırma yapabilirsiniz.

**Erişim:** http://localhost:4040/admin/calendar.html

---

## 🎯 Özellikler

### ✅ Mevcut Özellikler
- 24 saatlik grid görünümü
- Stüdyo sekmeleri (Studio A / Studio B)
- Ders slotları ekleme
- Reklam slotları ekleme
- Drag-drop ile slot taşıma
- Alt kenardan resize ile süre değiştirme
- Slot düzenleme (başlangıç, süre)
- Slot silme
- Renk kodlu ders gösterimi
- Otomatik 15 dakika yuvarlaması

---

## 🖱️ Temel Kullanım

### 1. Stüdyo Seçimi

Üstte bulunan sekmeleri kullanarak stüdyo değiştirin:

```
[Studio A] [Studio B]
```

Her stüdyonun ayrı programı vardır.

### 2. Ders Slotu Ekleme

**Adımlar:**
1. Sağ üstteki **"Ders Ekle"** butonuna tıklayın
2. Modal açılır:
   - **Ders Seçin:** Dropdown'dan ders seçin
   - **Başlangıç Saati:** Saat seçin (örn: 09:00)
   - **Süre (dakika):** Ders süresi (15-180 dk arası, 15'in katları)
3. **"Ekle"** butonuna tıklayın
4. Slot takvime eklenir

**Örnek:**
- Ders: Morning Yoga
- Başlangıç: 09:00
- Süre: 60 dakika
→ Slot 09:00-10:00 arasında oluşturulur

### 3. Reklam Slotu Ekleme

**Adımlar:**
1. **"Reklam Slotu Ekle"** butonuna tıklayın
2. Modal açılır:
   - **Reklam İçeriği:** Content dropdown'dan seçin
   - **Başlangıç Saati:** Saat seçin
   - **Süre (dakika):** 1-30 dakika arası
3. **"Ekle"** butonuna tıklayın
4. Reklam slotu takvime eklenir (kesik çizgili border ile)

**Not:** Reklam slotları gri renkte ve kesik çizgili border ile gösterilir.

---

## 🎨 Görsel Öğeler

### Slot Renkleri

Her ders tipi farklı renkte gösterilir:

| Ders Tipi | Renk | Hex Kod |
|-----------|------|---------|
| Yoga | 🟢 Yeşil | #10b981 |
| Pilates | 🔵 Mavi | #3b82f6 |
| Spinning | 🔴 Kırmızı | #ef4444 |
| Evening Yoga | 🟣 Mor | #8b5cf6 |
| Meditasyon | 🟣 İndigo | #6366f1 |
| HIIT | 🟠 Turuncu | #f59e0b |
| Stretching | 🟢 Teal | #14b8a6 |
| Reklam | ⚫ Gri | #64748b |

### Slot Bilgileri

Her slot içinde şunlar gösterilir:
- **Başlık:** Ders/Reklam adı
- **Zaman:** Başlangıç - Bitiş (örn: 09:00 - 10:00)
- **Açıklama:** Ders açıklaması (varsa)
- **Eğitmen:** Eğitmen adı (ders slotlarında)

---

## ↔️ Drag-Drop İşlemleri

### Slot Taşıma

**Nasıl Yapılır:**
1. Slotun üzerine mouse ile gelin
2. Sola tıklayıp basılı tutun
3. Yukarı/aşağı sürükleyin
4. Bıraktığınızda yeni saate yuvarlanır

**Özellikler:**
- Otomatik 15 dakika yuvarlaması
- Takvim sınırlarına takılma (00:00 - 24:00)
- Görsel feedback (opacity değişir)

**Örnek:**
- 09:17'ye bıraktınız → 09:15'e yuvarlanır
- 14:23'e bıraktınız → 14:30'a yuvarlanır

### Slot Boyutlandırma (Resize)

**Nasıl Yapılır:**
1. Slotun **alt kenarına** mouse ile gelin
2. Alt kenarda resize handle belirir
3. Aşağı/yukarı sürükleyin
4. Süre otomatik 15 dakikaya yuvarlanır

**Özellikler:**
- Minimum süre: 15 dakika
- Maksimum süre: 180 dakika (ders), 30 dakika (reklam)
- Anlık görsel feedback

**Örnek:**
- 1 saat slot'u 37 dakika yaptınız → 45 dakikaya yuvarlanır
- 2 saat slot'u 1 saat 20 dakika yaptınız → 1 saat 15 dakikaya yuvarlanır

---

## ✏️ Slot Düzenleme

### Düzenleme Modalı Açma

**Yöntem 1:** Slota çift tıklayın
**Yöntem 2:** Slota sağ tıklayın (ileride eklenebilir)

### Düzenleme Seçenekleri

Modal açıldığında:
- **Başlangıç Saati:** Değiştirin
- **Süre (dakika):** Değiştirin
- **Sil:** Slotu tamamen kaldırır
- **İptal:** Değişiklikleri iptal eder
- **Kaydet:** Değişiklikleri uygular

---

## 🗑️ Slot Silme

**Yöntem 1:** Düzenleme modalından "Sil" butonu
**Yöntem 2:** (İleride) Sağ tıklayıp "Delete"

**Onay:** Silme işlemi onay ister (ileride eklenebilir)

---

## ⏰ Zaman Çizelgesi

### Grid Yapısı

Takvim 24 saatlik (00:00 - 24:00) grid olarak gösterilir:

```
00:00 ─────────────────────────
01:00 ─────────────────────────
02:00 ─────────────────────────
...
23:00 ─────────────────────────
24:00
```

### Saat Etiketleri

Sol tarafta saat etiketleri gösterilir:
- 00:00, 01:00, 02:00, ... 23:00

### Pozisyonlama

Slotlar saat ve süreye göre otomatik konumlandırılır:

**Formül:**
- **Top Position:** `(saat * 60 + dakika) / 1440 * 100%`
- **Height:** `süre / 1440 * 100%`

**Örnek:**
- 09:00 başlangıç, 60 dakika süre
- Top: `(9*60 + 0) / 1440 * 100 = 37.5%`
- Height: `60 / 1440 * 100 = 4.17%`

---

## 🔄 Otomatik Özellikler

### 15 Dakika Yuvarlaması

Tüm işlemlerde zaman otomatik 15 dakikaya yuvarlanır:

| Girilen | Yuvarlanan |
|---------|------------|
| 09:07 | 09:00 |
| 09:12 | 09:15 |
| 09:18 | 09:15 |
| 09:23 | 09:30 |
| 14:37 | 14:30 |
| 14:38 | 14:45 |

**Kod:**
```javascript
const roundedMinutes = Math.round(minutes / 15) * 15;
```

### Çakışma Kontrolü (İleride)

Şu an çakışma kontrolü yok, ileride eklenebilir:
- Aynı stüdyoda aynı saatte iki ders olamaz
- Reklam slotları derslerin üzerine düşebilir (warning)

---

## 💾 Veri Kaydetme

### API Endpoint'leri

**Yeni Slot Ekleme:**
```javascript
POST /api/schedule
{
  "StudioID": 1,
  "LessonID": 3,
  "StartTime": "09:00",
  "EndTime": "10:00"
}
```

**Slot Güncelleme:**
```javascript
PUT /api/schedule/{id}
{
  "StartTime": "09:30",
  "EndTime": "10:30"
}
```

**Slot Silme:**
```javascript
DELETE /api/schedule/{id}
```

### Otomatik Kaydetme

- Drag-drop sonrası otomatik kaydedilir
- Resize sonrası otomatik kaydedilir
- Hata durumunda kullanıcıya bildirim gösterilir

---

## 🎛️ Gelişmiş Kullanım

### Klavye Kısayolları (İleride)

Planlanmış klavye kısayolları:

| Kısayol | Fonksiyon |
|---------|-----------|
| `Ctrl+Z` | Geri al |
| `Ctrl+Y` | İleri al |
| `Delete` | Seçili slotu sil |
| `Ctrl+C` | Slotu kopyala |
| `Ctrl+V` | Slotu yapıştır |
| `Ctrl+D` | Slotu çoğalt |

### Toplu İşlemler (İleride)

- Haftalık program şablonu
- Toplu slot ekleme
- CSV import/export
- Takvimi PDF olarak dışa aktar

### Görünüm Seçenekleri (İleride)

- Günlük görünüm (varsayılan)
- Haftalık görünüm
- Aylık görünüm
- Zoom in/out

---

## 🐛 Bilinen Sınırlamalar

### Mevcut Sınırlamalar

1. **Çakışma Kontrolü Yok:** Aynı saatte birden fazla ders eklenebilir
2. **Tek Gün:** Sadece bugünün programı görünür
3. **Manuel Refresh:** Sayfa yenilenmeden değişiklikler görünmez
4. **Geri Alma Yok:** Ctrl+Z desteği yok

### Çözümler

1. **Çakışma:** Görsel uyarı eklenecek
2. **Haftalık:** Tarih seçici eklenecek
3. **Auto-refresh:** Socket.IO ile otomatik güncelleme
4. **Undo/Redo:** State management ile

---

## 📱 Responsive Tasarım

### Desktop (>1024px)
- Tam görünüm
- Tüm özellikler aktif

### Tablet (768-1024px)
- Zaman etiketleri daha küçük
- Slot yazıları küçültülür

### Mobile (<768px)
- Önerilmez (admin panel desktop içindir)
- Gerekirse dikey scroll

---

## 🎨 Özelleştirme

### Renkleri Değiştirme

`frontend/admin/css/calendar.css` içinde:

```css
.schedule-slot {
    background: linear-gradient(135deg, color1, color2);
}
```

### Grid Satır Yüksekliği

Varsayılan: 60px/saat = 1440px toplam

Değiştirmek için CSS'te:

```css
.calendar-grid {
    min-height: 2000px; /* Daha uzun grid */
}
```

### Yuvarlanma Değeri

`frontend/admin/js/calendar.js` içinde:

```javascript
const SNAP_INTERVAL = 15; // 15 dakika → 30 veya 5 yapın
const roundedMinutes = Math.round(minutes / SNAP_INTERVAL) * SNAP_INTERVAL;
```

---

## 🔍 Debug İpuçları

### Console Logları

Browser console'da (F12) şunları kontrol edin:

```javascript
// Slot eklendiğinde
console.log('Slot added:', slotData);

// Drag başladığında
console.log('Drag start:', draggedElement);

// API yanıtı
console.log('API response:', response);
```

### Network İsteği

Network tab'inde (F12):
- POST /api/schedule → 201 Created dönmeli
- Hata varsa 400/500 status code

### Element İnceleme

Slot üzerinde sağ tıklayıp "Inspect":
- `top` ve `height` değerlerini kontrol edin
- CSS class'larını kontrol edin

---

## 📊 Performans

### Optimizasyon İpuçları

1. **100'den fazla slot varsa:** Sanal scroll kullanın
2. **Animasyonlar yavaşsa:** CSS transitions'ı azaltın
3. **Drag laggy ise:** RequestAnimationFrame kullanın

---

## ✅ Checklist: Takvim Kullanımı

Yeni kullanıcılar için checklist:

- [ ] Stüdyo sekmelerini keşfettim
- [ ] Ders slotu ekledim
- [ ] Reklam slotu ekledim
- [ ] Slot taşıdım (drag)
- [ ] Slot uzattım/kısalttım (resize)
- [ ] Slot düzenledim (çift tıklama)
- [ ] Slot sildim
- [ ] Renk kodlarını anladım
- [ ] 15 dakika yuvarlamasını test ettim
- [ ] Değişikliklerin kaydedildiğini doğruladım

Tüm maddeleri tamamladıysanız, takvim yönetiminde uzmanlaştınız! 🎉
