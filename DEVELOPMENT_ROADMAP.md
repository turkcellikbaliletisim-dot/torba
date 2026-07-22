# DEVELOPMENT_ROADMAP.md — Codex / AI Geliştirme Yol Haritası

Bu doküman, TORBAA platformunun sırasıyla geliştirilmesi için hazırlanan adım adım görev ve kontrol listesidir (AI / Codex Roadmap).

---

## 🏁 FAZ 1: ÇEKİRDEK VERİ VE TİP MİMARİSİ (CORE & TYPES)

- [x] **Görev 1.1**: `types/index.ts` oluşturulması (`User`, `CorporateCompany`, `Merchant`, `MenuItem`, `Campaign`, `Transaction`, `Voucher` şemaları).
- [x] **Görev 1.2**: `lib/mock-store.ts` in-memory & localStorage mock veri deposunun yazılması.
- [x] **Görev 1.3**: `app/globals.css` ile Tailwind CSS değişkenlerinin ve TORBAA renk paletinin tanımlanması.

---

## 🎨 FAZ 2: ORTAK BİLEŞENLER VE TASARIM SİSTEMİ (DESIGN SYSTEM & COMPONENTS)

- [ ] **Görev 2.1**: `TorbaaMealCard` bileşeni (16 haneli çipli dijital yemek kartı widget'ı).
- [ ] **Görev 2.2**: Mobil Alt Navigasyon Barı (`components/mobile/BottomNav.tsx`).
- [ ] **Görev 2.3**: İşletme Yan Menüsü (`components/panel/Sidebar.tsx`).
- [ ] **Görev 2.4**: Ortak Modallar (`GiftCatalogModal`, `SpinWheelModal`, `QuickPosModal`, `ReceiptOcrModal`).

---

## 📱 FAZ 3: MOBİL UYGULAMA GELİŞTİRMESİ (`/mobile/...`)

- [ ] **Görev 3.1**: `/mobile/login` - Telefon numarası ve OTP doğrulama ekranı.
- [ ] **Görev 3.2**: `/mobile/explore` - Keşfet, arama, restoran kartları, Seviye göstergesi ve Streak card.
- [ ] **Görev 3.3**: `/mobile/merchant/[id]` - Restoran detay, menü, sepete ekleme ve Toin kazanım hesabı.
- [ ] **Görev 3.4**: `/mobile/qr` - QR Ödeme terminali (Yemek kartı, Toin harca, Toin kazan modları).
- [ ] **Görev 3.5**: `/mobile/wallet` - Çift bakiye göstergesi, dijital yemek kartı, hediye çeki pazarı ve P2P transfer.
- [ ] **Görev 3.6**: `/mobile/profile` - Profil, sadakat seviyeleri ve başarım rozetleri grid'i.
- [ ] **Görev 3.7**: `/mobile/campaigns` - Aktif kampanya listesi.

---

## 🏪 FAZ 4: İŞLETME / BAYİ PANELİ GELİŞTİRMESİ (`/panel/...`)

- [ ] **Görev 4.1**: `/panel/login` - Bayi giriş ekranı.
- [ ] **Görev 4.2**: `/panel/dashboard` - Ciro, hakediş alacağı summary ve Kasiyer POS QR Tahsilat Modalı.
- [ ] **Görev 4.3**: `/panel/balance` - Hakediş takvimi, banka hesabı çekim geçmişi ve B2B Tedarik Mağazası.
- [ ] **Görev 4.4**: `/panel/transactions` - Günlük/aylık tahsilat listesi ve filtreleme.
- [ ] **Görev 4.5**: `/panel/campaigns` - Fırsat/Kampanya oluşturma ekranı.

---

## 🏢 FAZ 5: KURUMSAL İK PORTALI GELİŞTİRMESİ (`/corporate/...`)

- [ ] **Görev 5.1**: `/corporate/dashboard` - Kurumsal şirket paneli, çalışan yemek bakiyesi toplu yükleme ve GVK 23/8 Vergi Muafiyet Hesaplama Raporu.

---

## ⚡ FAZ 6: REST API ENDPOINT'LERİ (`/api/...`)

- [ ] **Görev 6.1**: `/api/auth/otp/verify` - OTP doğrulama mock endpoint'i.
- [ ] **Görev 6.2**: `/api/merchants/nearby` - İşletme arama ve listeleme API'si.
- [ ] **Görev 6.3**: `/api/qr/meal-pay` - TORBAA Yemek Kartı harcama ve +%5 Toin tanımlama API'si.
- [ ] **Görev 6.4**: `/api/corporate/allowance` - Şirket çalışan bakiye yükleme API'si.

---

## ✅ FAZ 7: TEST VE DOĞRULAMA (VERIFICATION)

- [ ] **Görev 7.1**: `npm run build` ile TypeScript ve Next.js derleme kontrolü.
- [ ] **Görev 7.2**: Tüm modallar ve cüzdan bakiyelerinin senkronizasyon testi.
