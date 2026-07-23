# Torba — Yerel Ticaret, Sadakat & Vergi Avantajlı Kurumsal Yemek Kartı Ekosistemi

> **Versiyon:** 3.0.0  
> **Durum:** Full-Stack Web & Mobil Ekosistem (PostgreSQL 16 Engine, Real JWT Auth, Zod Validation, Payment Gateway Interface, Double-Entry Ledger Core)  
> **Ana Marka Rengi:** `#00B7EB` (Turkuaz / Cyan)  
> **Görsel Tema:** Light Mode Öncelikli (`#F7FAFC` Zemin, `#FFFFFF` Kartlar)

---

## 📌 Ana Ürün Yaklaşımı

Torba; kullanıcıların yakınlarındaki işletmeleri, kampanyaları, kuponları ve sadakat avantajlarını keşfettiği, işletmelerin şeffaf komisyonla hakediş elde ettiği ve kurumsal şirketlerin GVK 23/8 vergi muafiyeti ile yemek bakiyesi yüklediği **mobil öncelikli yerel ticaret ekosistemidir.**

- İşletmeleri ve kampanyaları keşfetmek
- Sadakat puanı (Toin) kazanmak ve kullanmak
- Kuponları ve dijital yemek kartını tek yerde yönetmek
- Kasiyer POS cihazında dinamik QR kod ile anında güvenli ödeme yapmak
- GVK 23/8 %100 vergi istisnası ile kurumsal bakiye dağıtmak

---

## 📱 Ekranlar ve Web Portalları

1. **Mobil Uygulama (`/mobile`):** Ana Sayfa, Yakınımda (Harita & Liste), Cüzdan (Yemek Kartı ₺4.500 + Toin Puan 1.250), Puanlarım (Gümüş Tier), Profilim.
2. **İşletme / Bayi Paneli (`/panel`):** Bugünkü hacim, 7 günde hakediş takvimi, %3 komisyon dökümü & Kasiyer POS QR Tahsilat Modu.
3. **Kurumsal İK Portalı (`/corporate`):** 120 Çalışan, ₺540.000 Aylık bütçe, GVK 23/8 Vergi tasarrufu (₺189.000,00) & Excel yükleme.
4. **Super Admin Paneli (`/admin`):** Platform GMV takibi & veritabanı seviyesinde değiştirilemez (immutable) audit log izlenebilirlik paneli.

---

## 🏗️ Mimarî ve Altyapı Özellikleri

- **Veritabanı Engine:** PostgreSQL 16 + pgcrypto (`001_core_schema.sql`, `002_ledger_integrity.sql`, `003_partitioning_and_indexes.sql`).
- **Çift Taraflı Ledger:** `DEBIT = CREDIT` denkliği ve `SELECT FOR UPDATE` kilitlemeli idyempotent muhasebe servisi.
- **Güvenlik & Auth:** Zod şema doğrulaması, JOSE HS256 JWT oturum yönetimi, HTTP-Only çerezler ve RBAC Middleware.
- **Kriptografik QR Motoru:** HMAC-SHA256 imzalı 60 saniye süreli dinamik QR token servisi.
- **Ödeme & SMS:** Netgsm / Twilio SMS Gateway entegrasyonu ve Craftgate/Iyzico sanal POS webhook doğrulama arayüzü.
- **Yapay Zekâ Suite:** Akıllı kampanya öneri motoru ve Anti-Fraud risk değerlendirme algoritması.
- **DevOps:** Dockerfile (Node 20 Alpine), docker-compose.prod.yml (PostgreSQL 16 + DragonflyDB + PgBouncer + Go QR Fastpath), GitHub Actions CI/CD.

---

## 🧪 Test ve Doğrulama Komutları

```bash
# Migration doğrulama
npm run validate:migrations

# Birim ve entegrasyon testleri (11/11 Passed)
npm run test

# Yüksek eşzamanlılık yük testi
npm run loadtest

# Canlı HTTP API yük testi (7.000+ RPS)
npm run httploadtest

# Çok çekirdekli küme yük testi (13.975+ RPS)
npm run clusterloadtest

# TypeScript tür denetimi
npm run typecheck

# Production derlemesi (24/24 Rotası derlenir)
npm run build

# Tüm süreci tek komutta doğrulama
npm run verify
```
