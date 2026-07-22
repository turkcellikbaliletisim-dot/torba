# TORBAA — Mobil Uygulama (B2C & Şirket Çalışanı) Master Spesifikasyonu

> **Doküman Amacı**: Bu spesifikasyon dokümanı, TORBAA B2B2C Sadakat, Keşif ve Dijital Yemek Kartı ekosisteminin **sadece Mobil Uygulama (`/mobile/...`)** kısmını kapsar. Google AI Studio ve diğer LLM kod üreticileri için tam teknik mobil geliştirme kılavuzudur.

---

## 1. MOBİL UYGULAMA GENEL BAKIŞI VE ROL

TORBAA Mobil Uygulaması, son tüketicilerin ve şirket çalışanlarının çevresindeki restoran ve mağazaları keşfettiği, harcamalarından Toin (dijital puan) kazandığı, kurumsal **TORBAA Yemek Kartı** bakiyesini harcadığı, fiş yükleyerek iade aldığı ve oyunlaştırılmış ödüller topladığı ana istemcidir.

### 1.1 Temel Kullanıcı Senaryoları
1. **Harca & Kazan (Cashback)**: Anlaşmalı işletmelerde QR okutarak her harcamadan %5 Toin kazanma.
2. **TORBAA Yemek Kartı Kullanımı**: Şirketi tarafından yüklenen vergi istisnalı (GVK 23/8) yemek bakiyesini anlaşmalı restoranlarda harcama ve bu harcamadan da ekstra %5 Toin kazanma.
3. **Fiş/Fatura OCR Tara-Kazan**: Alışveriş fişinin fotoğrafını yükleyerek otomatik Toin kazanma.
4. **Günlük Giriş Serisi (Streak) & Şans Çarkı**: Her gün uygulamaya girerek katlanarak artan Toin ödülü toplama ve 7. gün bonusunu kapma.
5. **Hediye Çeki & P2P Transfer**: Biriken Toin'leri Trendyol, Migros, Kahve Dünyası e-hediye çeklerine dönüştürme veya arkadaşının telefon numarasına Toin gönderme.

---

## 2. DİJİTAL VARLIK VE İŞ KURALLARI (BUSINESS LOGIC)

- **Puan Değer Denkliği**: `1 Toin = 1 TL` değerindedir.
- **Standart Kazanım Oranı**: Yapılan harcamanın **%5**'i oranında Toin kazanılır (Örn: 200 TL harcama = 10 Toin).
- **Günlük Kazanım Limiti**: Kullanıcıların bir günde kazanabileceği maksimum tutar **200 Toin** ile sınırlıdır.
- **TORBAA Yemek Kartı Bakiyesi**: Şirket tarafından yüklenen vergi istisnalı yemek bakiyesidir (Örn: Net 4.500 TL/Ay). Yalnızca TORBAA üye restoranlarında geçerlidir.
- **Sadakat Seviyeleri (Tiers)**:
  - Bronz: 0 - 499 TP (%5 Toin kazanım)
  - Gümüş: 500 - 999 TP (%7 Toin kazanım)
  - Altın: 1000 - 2499 TP (%10 Toin kazanım)
  - Platin: 2500+ TP (%15 Toin kazanım)
- **7 Günlük Giriş Serisi (Streak)**:
  - 1. Gün: +5 Toin | 2. Gün: +10 Toin | 3. Gün: +15 Toin | 4. Gün: +20 Toin | 5. Gün: +25 Toin | 6. Gün: +30 Toin | 7. Gün Bonus: +100 Toin.

---

## 3. VERİ MODELLERİ (TYPESCRIPT SCHEMAS)

```typescript
export interface User {
  id: string;
  phone: string;
  name: string;
  email?: string;
  avatar?: string;
  toinBalance: number;
  torbaaMealBalance: number; // TORBAA Dijital Yemek Kartı Bakiyesi (TL)
  corporateInfo?: {
    companyId: string;
    companyName: string;
    employeeId: string;
    monthlyAllowance: number;
    cardNo: string; // Örn: 9876-1234-5678-0001
  };
  dailyEarned: number;
  lastEarnDate: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  tierPoints: number;
  spinAvailable: boolean;
  vouchers?: Voucher[];
}

export interface Voucher {
  id: string;
  brand: string;
  title: string;
  costToin: number;
  valueTL: number;
  code: string;
  expiry: string;
  image: string;
  isRedeemed: boolean;
}

export interface Merchant {
  id: string;
  name: string;
  category: string;
  image: string;
  address: string;
  distance: string;
  rating: number;
  isTorbaaMealMerchant: boolean; // TORBAA Yemek Kartı Geçiyor Mu?
  menu: MenuItem[];
  campaigns: Campaign[];
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  image?: string;
}

export interface Campaign {
  id: string;
  merchantId: string;
  merchantName?: string;
  title: string;
  description: string;
  type: 'earn' | 'discount' | 'gift';
  earnRate?: number;
  discountRate?: number;
  minAmount?: number;
  startDate: string;
  endDate: string;
  quota: number;
  usedCount: number;
  isActive: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  merchantId: string;
  merchantName: string;
  type: 'earn' | 'spend' | 'torbaa_meal_pay';
  paymentMethod: 'torbaa_meal_card' | 'toin_balance' | 'credit_card';
  amount: number;
  toinAmount: number;
  date: string;
  description: string;
}
```

---

## 4. MOBİL EKRAN SPESİFİKASYONLARI VE AKIŞLAR (`/mobile/...`)

### 1. Giriş Ekranı (`/mobile/login`)
- Telefon numarası girme alanı (10 hane).
- SMS OTP doğrulama ekranı (Demo Kodu: `1234`).
- Doğrulama sonrası kullanıcı durumunu yerel depolamaya kaydetme (`localStorage.setItem('torbaa_user', ...)`).

### 2. Keşfet / Ana Sayfa (`/mobile/explore`)
- **Arama & Kategori Filtreleri**: Tüm İşletmeler, Kafe, Restoran, Fast Food, Giyim, Market ve *"TORBAA Yemek Kartı Geçen Restoranlar"* özel filtresi.
- **Sadakat Seviye Kartı**: Bronz, Gümüş, Altın, Platin rozeti ve seviye ilerleme çubuğu.
- **7 Günlük Giriş Serisi (StreakCard)**: Günlük seri ödülü toplama butonu.
- **Hızlı Eylem Düğmeleri**: Günlük Şans Çarkı Modalı ve Fiş OCR Yükleme Modalı tetikleyicileri.
- **AI Öneri Motoru Kartı (AiRecommendCard)**: Kullanıcıya özel %25 Toin iade önerisi.
- **Yakındaki İşletmeler & Öne Çıkan Fırsatlar Grid'i**.

### 3. İşletme Detay Ekranı (`/mobile/merchant/[id]`)
- İşletme kapak görseli, puanı, adresi, harita yol tarifi ve arama butonları.
- **TORBAA Yemek Kartı Geçerli** rozeti.
- **Sipariş & Menü Sekmesi**: Ürün listesi, sepete ekleme/çıkarma, dinamik hesaplanan Toin kazanım tutarı.
- **Aktif Fırsatlar Sekmesi**: Kampanya kartları.
- **Sepet Çekmecesi**: Toplam sipariş tutarı ve kazanılacak Toin puan göstergesi.

### 4. QR Ödeme & Tahsilat Terminali (`/mobile/qr`)
- **Ödeme Yöntemi Seçici**: 
  - `TORBAA Yemek Kartı Bakiyesinden Öde`
  - `Toin Bakiyesinden Harca`
  - `Toin Kazan (%5)`
- **Kamera / Lazer Tarayıcı Simülasyonu**.
- **İşlem Token Girişi**: Manuel kod girişi (`KD001`, `BK002`) veya hızlı demo butonları.
- **Tutar Girişi (TL)**: İşlem onaylama sonrası bakiyeden düşüm veya Toin kazanımı tetikleme.

### 5. Cüzdan & Dijital Kart Ekranı (`/mobile/wallet`)
- **Resmi TORBAA Dijital Yemek Kartı Widget'ı**: 16 haneli numaralı, çipli kart görseli dökümü.
- **Çift Bakiye Kartları**: **TORBAA Yemek Kartı Bakiyesi (4.500 TL)** ve **Toin Bakiyesi (745 Toin)**.
- **Hediye Çekleri Kataloğu Modalı**: Trendyol, Migros, Kahve Dünyası, Shell e-hediye çeklerini Toin ile satın alma.
- **P2P Toin Transfer Modalı**: Telefon numarasına anında Toin gönderme.
- **İşlem Geçmişi Tablosu**: Kazanımlar, Harcamalar ve Yemek Kartı ödemeleri dökümü.

### 6. Profil & Başarımlar Ekranı (`/mobile/profile`)
- Kullanıcı profil bilgileri ve sadakat seviyesi.
- **Sadakat Başarım Rozetleri Grid'i (AchievementBadges)**: "İlk Kahve", "Fiş Üstadı", "VIP Alışverişçi", "Çark Şampiyonu".
- Hesap ayarları ve Yardım/Canlı Destek bağlantıları.
- Oturum kapatma.

### 7. Kampanyalar Ekranı (`/mobile/campaigns`)
- Tüm aktif kampanyaların filtrelenebilir listesi.

---

## 5. MOBİL API ENDPOINT SPESİFİKASYONLARI

- `POST /api/auth/otp/verify`: `{ phone, otp }` -> Kullanıcı doğrular, `{ user }` nesnesi döner.
- `GET /api/merchants/nearby`: Yakındaki üye işletmeleri döner.
- `GET /api/merchants/[id]`: İşletme ve menü detayını döner.
- `GET /api/merchants/[id]/campaigns`: İşletmenin kampanyalarını döner.
- `POST /api/qr/earn`: `{ token, amount, userId }` -> Harcamadan %5 Toin kazanımını işler.
- `POST /api/qr/spend`: `{ token, amount, userId }` -> Toin bakiyesinden harcama yapar.
- `POST /api/qr/meal-pay`: `{ token, amount, userId }` -> TORBAA Yemek bakiyesinden harcama yapar ve +%5 Toin kazandırır.
- `GET /api/wallet/txns`: Kullanıcı işlem geçmişini döner.

---

## 6. PROMPT REHBERİ (GOOGLE AI STUDIO İÇİN INSTRUCTIONS)

Google AI Studio'da sadece Mobil Uygulamayı ürettirirken şu talimat setini kullanabilirsiniz:

```text
Siz kıdemli bir Mobil Web Arayüz Geliştiricisisiniz. TORBAA platformunun sadece MOBİL UYGULAMA (/mobile/*) kısmını Next.js 14 App Router, TypeScript ve TailwindCSS kullanarak inşa edeceksiniz.

Aşağıdaki mobil iş kurallarına ve ekran yapısına kesinlikle uyunuz:
1. Değer Denkliği: 1 Toin = 1 TL.
2. Çift Bakiye Cüzdanı: Kullanıcıların 'TORBAA Yemek Kartı Bakiyesi' (Net 4.500 TL/Ay) ve 'Toin Sadakat Bakiyesi' vardır.
3. TORBAA Yemek Kartı harcamasında kullanıcı ayrıca %5 Toin sadakat puanı kazanır.
4. Mobil Rota Yapısı:
   - /mobile/login (SMS OTP Girişi)
   - /mobile/explore (İşletme Keşfet, Kategori Filtreleri, Yemek Kartı Filtresi, Seviye Göstergesi)
   - /mobile/merchant/[id] (Menü Sipariş, Sepet Çekmecesi, Toin Hesaplayıcı)
   - /mobile/qr (Yemek Bakiyesi ile Öde / Toin Harca / Toin Kazan Modları)
   - /mobile/wallet (Çipli TORBAA Dijital Yemek Kartı Widget'ı, Hediye Çeki Pazarı, P2P Transfer)
   - /mobile/profile (Başarım Rozetleri Grid'i, Seviye Durumu)
   - /mobile/campaigns (Fırsat Listesi)
5. Mobil Bileşenler & Modallar:
   - Günlük Şans Çarkı (Spin Wheel) Modalı
   - Fiş/Fatura OCR Yükle-Kazan Modalı
   - 7 Günlük Giriş Serisi (StreakCard)
   - AI Öneri Motoru Kartı (AiRecommendCard)
   - Hediye Çeki Kataloğu & P2P Toin Transfer Modalı

Tüm mobil akışlar mock veri deposu (in-memory store & localStorage) ile tam senkronize ve hatasız çalışmalıdır.
```
