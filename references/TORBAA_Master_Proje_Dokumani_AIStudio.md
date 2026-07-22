# TORBAA — B2B2C Sadakat, Keşif, Bayi ve Özgün "TORBAA YEMEK KARTI" Ekosistemi Master Spesifikasyonu

> **Doküman Amacı**: Bu spesifikasyon dokümanı, TORBAA platformunun öz ürünü olan **TORBAA YEMEK KARTI (Proprietary Corporate Meal Card)** mimarisini, veri tiplerini, iş kurallarını, kullanıcı rollerini, takas/komisyon mantığını ve API uç noktalarını tanımlar. Google AI Studio ve diğer LLM kod üreticileri için tam teknik kılavuzdur.

---

## 1. PROJE ÖZETİ VE SİSTEM MİMARİSİ

TORBAA; pazardaki üçüncü parti kartlara bağımlı olmayan, **kendi bünyesinde yerli ve özgün "TORBAA YEMEK KARTI" markasını çıkaran** uçtan uca bir B2B2C sadakat, keşif, e-ticaret ve Yemek Kartı İhraççı (Meal Card Issuer) platformudur.

### 1.1 Temel Aktörler ve Roller
1. **TORBAA Platformu (Yemek Kartı İhraççısı & Takas Merkezi)**:
   - Şirketlere **TORBAA Yemek Kartı** kurumsal aboneliği satar.
   - Anlaşmalı restoranlara düşük komisyon oranlı (%3-%5) harcama takas ve hakediş ödemelerini gerçekleştirir.
   - GVK 23/8 Vergi İstisnası faturalandırmasını tek elden yönetir.
2. **Mobil Kullanıcı (B2C Tüketici / Şirket Çalışanı)**:
   - Uygulama içinde resmi **TORBAA Dijital Yemek Kartı**'na sahiptir.
   - Şirketi tarafından yüklenen aylık vergi istisnalı yemek bakiyesini anlaşmalı TORBAA üye restoran ve kafelerinde harcar.
   - TORBAA Yemek Kartı ile yaptığı her yemek harcamasında ekstra **%5 Toin sadakat puanı** kazanmaya devam eder.
3. **İşletme / Bayi Sahibi (TORBAA Yemek Kartı Üye İşletmesi)**:
   - "TORBAA Yemek Kartı Anlaşmalı Restoran" statüsüne sahiptir.
   - Kasada TORBAA Yemek Kartı QR ödemelerini kabul eder.
   - Haftalık/Aylık yemek kartı hakediş ödemelerini panellerinden takip eder.
   - Biriken B2B Toin bakiyeleri ile TORBAA tedarik mağazasından ambalaj ve sarf malzeme siparişi verir.
4. **Kurumsal Şirket / İK Yöneticisi (Corporate HR Client)**:
   - Şirketi adına **TORBAA Yemek Kartı Sözleşmesi** imzalar.
   - Çalışanlarına her ay GVK 23/8 vergi istisnalı TORBAA Yemek Kartı bakiyesi ve özel gün Toin primleri tanımlar.
   - Kurumsal yemek bütçesini ve vergi muafiyet raporlarını yönetir.
5. **Kasiyer / Şube Personeli (POS Cashier)**:
   - POS ekranından **TORBAA Yemek Kartı Tahsilat Modu** ile dinamik QR oluşturur ve ödemeyi onaylar.

---

## 2. İŞ KURALLARI VE DİJİTAL VARLIK MANTIĞI (BUSINESS LOGIC)

### 2.1 "TORBAA YEMEK KARTI" Öz Ürün Kuralları (Proprietary Meal Card Engine)
- **Bağımsız Yerli Ürün**: TORBAA platformu doğrudan bir **Yemek Kartı İhraççı Kurumudur** (Meal Card Issuer).
- **GVK 23/8 Vergi İstisnası**: TORBAA Yemek Kartı'na yüklenen bakiyeler %100 Gelir Vergisi ve SGK priminden istisnadır.
- **Çift Bakiye Cüzdanı (Dual Wallet)**:
  - `TORBAA Yemek Kartı Bakiyesi` (Örn: Net 4.500 TL/Ay): Yalnızca anlaşmalı TORBAA üye restoranlarında geçerli olan vergi istisnalı yemek bütçesi.
  - `Toin Sadakat Bakiyesi`: Tüm ekosistemde indirim veya hediye çeki olarak kullanılan nakit değerli sadakat puanı.
- **Çifte Kazanım (Cashback on TORBAA Meal Spend)**: Kullanıcı **TORBAA Yemek Kartı** ile ödeme yaptığında, harcadığı yemek tutarı üzerinden de ekstra **%5 Toin** kazanır!
- **Üye Restoran Takas & Komisyon Modeli**: TORBAA, üye işletmelerden rakiplerine göre daha düşük (%3-%5) komisyon alır ve hakediş ödemelerini 7 gün içinde işletmenin banka hesabına aktarır.

### 2.2 Toin Puan Kuralları
- **Değer Denkliği**: `1 Toin = 1 TL` değerindedir.
- **Standart Kazanım Oranı**: Yapılan harcamanın **%5**'i oranında Toin kazanılır (Örn: 200 TL yemek ödemesi = 10 Toin).
- **Günlük Kazanım Limiti**: Günlük maksimum **200 Toin**.

### 2.3 Sadakat Seviyeleri (Tier Engine)
- **Bronz (0 - 499 TP)**: %5 Toin kazanım oranı.
- **Gümüş (500 - 999 TP)**: %7 Toin kazanım oranı + Özel restoran indirimleri.
- **Altın (1000 - 2499 TP)**: %10 Toin kazanım oranı + VIP müşteri desteği.
- **Platin (2500+ TP)**: %15 Toin kazanım oranı + Günlük 2 kat Şans Çarkı hakkı.

---

## 3. VERİ MODELLERİ VE TİP TANIMLARI (TYPESCRIPT SCHEMAS)

```typescript
export interface User {
  id: string;
  phone: string;
  name: string;
  email?: string;
  avatar?: string;
  toinBalance: number;
  torbaaMealBalance: number; // TORBAA Öz Dijital Yemek Kartı Bakiyesi (TL)
  corporateInfo?: {
    companyId: string;
    companyName: string;
    employeeId: string;
    monthlyAllowance: number;
    cardNo: string; // TORBAA Yemek Kartı Numarası (Örn: 9876-1234-5678-0001)
  };
  dailyEarned: number;
  lastEarnDate: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  tierPoints: number;
  spinAvailable: boolean;
  vouchers?: Voucher[];
}

export interface CorporateCompany {
  id: string;
  companyName: string;
  taxNo: string;
  taxOffice: string;
  address: string;
  employeeCount: number;
  monthlyMealBudgetPerEmployee: number;
  corporateToinBalance: number;
  torbaaContractNo: string;
}

export interface Merchant {
  id: string;
  name: string;
  category: string;
  image: string;
  address: string;
  distance: string;
  rating: number;
  isTorbaaMealMerchant: boolean; // TORBAA Yemek Kartı Anlaşmalı Restoran Mı?
  commissionRate: number; // Örn: 0.04 (%4 TORBAA komisyonu)
  pendingSettlementTL: number; // İşletmenin TORBAA'dan alacağı hakediş tutarı (TL)
  menu: MenuItem[];
  campaigns: Campaign[];
  monthlyTarget: number;
  monthlyProgress: number;
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

## 4. SAYFA SPESİFİKASYONLARI VE KULLANICI AKIŞLARI

### 4.1 Mobil Kullanıcı Sayfaları (`/mobile/...`)

1. **Keşfet / Ana Sayfa (`/mobile/explore`)**:
   - Üye işletmeler listesi + *"TORBAA Yemek Kartı Geçen Restoranlar"* filtre rozeti.
   - Seviye Durumu, 7 Günlük Giriş Serisi ve Şans Çarkı.
2. **QR Ödeme Terminali (`/mobile/qr`)**:
   - Ödeme Yöntemi Seçimi: **TORBAA Yemek Kartı Bakiyesinden Öde** | **Toin Bakiyesinden Harca** | **Toin Kazan**.
   - TORBAA Yemek Kartı ile yapılan her ödemede ek olarak +%5 Toin kazanımı.
3. **Cüzdan Sayfası (`/mobile/wallet`)**:
   - Çipli, 16 haneli numaralı **Resmi TORBAA Dijital Yemek Kartı** bileşeni.
   - Çift Bakiye Göstergesi: **TORBAA Yemek Bakiyesi (4.500 TL)** ve **Toin Bakiyesi (745 Toin)**.
   - Hediye Çekleri Pazarı & P2P Toin Transferi.

---

### 4.2 İşletme / Bayi Paneli Sayfaları (`/panel/...`)

1. **Dashboard Sayfası (`/panel/dashboard`)**:
   - TORBAA Yemek Kartı ile yapılan toplam ciro ve TORBAA Hakediş Alacağı (`pendingSettlementTL`).
   - Hızlı POS Kasiyer Terminali (TORBAA Yemek Kartı QR Tahsilat Modu).
2. **Bakiye & Takas Sayfası (`/panel/balance`)**:
   - TORBAA Yemek Kartı haftalık hakediş ödeme takvimi ve banka hesabına aktarım geçmişi.
   - B2B Toptan Tedarik Mağazası.

---

### 4.3 Kurumsal Şirket İK Portalı Sayfaları (`/corporate/...`)

1. **İK Yönetim Paneli (`/corporate/dashboard`)**:
   - **TORBAA Yemek Kartı Kurumsal Yönetimi**.
   - Çalışanlara toplu TORBAA Yemek Kartı bakiyesi yükleme.
   - GVK 23/8 Vergi İstisnası Hesaplama Raporu (Şirketin kazandığı SGK ve Gelir Vergisi muafiyet tutarı dökümü).

---

## 5. PROMPT REHBERİ (GOOGLE AI STUDIO İÇİN INSTRUCTIONS)

Google AI Studio'da kod ürettirirken şu talimat setini kullanabilirsiniz:

```text
Siz kıdemli bir Full-Stack Web Geliştiricisisiniz. TORBAA adı verilen B2B2C Sadakat, Keşif ve Yerli "TORBAA YEMEK KARTI" (Proprietary Corporate Meal Card & Benefits Issuer) Platformunu Next.js 14 App Router, TypeScript ve TailwindCSS kullanarak inşa edeceksiniz.

Aşağıdaki iş kurallarına ve spesifikasyona kesinlikle uyunuz:
1. Öz Yemek Kartı Markası: TORBAA kendi bünyesinde yerli ve özgün "TORBAA YEMEK KARTI" ihraç eden bir platformdur.
2. Değer Denkliği & Çift Cüzdan: 1 Toin = 1 TL. Kullanıcıların TORBAA Yemek Kartı Bakiyesi (Net 4.500 TL/Ay) ve Toin Sadakat Bakiyesi vardır.
3. TORBAA Yemek Kartı harcamalarında kullanıcı ayrıca %5 Toin sadakat puanı kazanır.
4. GVK 23/8 Vergi İstisnası hesaplama raporları ve kurumsal şirket faturalandırma modülü mevcuttur.
5. Rota Yapısı:
   - Ana Açılış Portalı: /
   - Mobil Ekranlar: /mobile/explore, /mobile/merchant/[id], /mobile/qr, /mobile/wallet, /mobile/profile, /mobile/login, /mobile/campaigns
   - İşletme Paneli: /panel/dashboard, /panel/campaigns, /panel/balance, /panel/transactions, /panel/branches, /panel/settings, /panel/login
   - Kurumsal Şirket İK Paneli: /corporate/dashboard
6. Bileşenler & Modallar:
   - Resmi TORBAA Dijital Yemek Kartı Widget'ı (16 haneli kart numaralı çipli kart görseli)
   - Şans Çarkı, Fiş OCR Tara & Kazan, Hediye Çeki Pazarı & P2P Toin Transferi
   - Bayigo Aylık Ciro Hedef Barı (%85 tamamlanma, Bonus Toin)
   - Kasiyer Hızlı POS QR Terminali (TORBAA Yemek Kartı Tahsilat Modu)
   - B2B Toptan Tedarik Mağazası (Karton bardak, POS rulo kağıdı)
   - 7 Günlük Giriş Serisi (Streak) & Başarım Rozetleri

Tüm API uç noktaları mock veri deposu (in-memory store & localStorage) ile tam senkronize ve hatasız çalışmalıdır.
```
