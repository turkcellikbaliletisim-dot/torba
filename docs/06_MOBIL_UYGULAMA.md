# TORBAA Mobil Uygulama Spesifikasyonu

## 1. Amaç
TORBAA mobil uygulaması; kullanıcıların yakındaki işletmeleri keşfetmesini, kampanyalara katılmasını, Toin kazanıp kullanmasını ve uygun kullanıcıların TORBAA Yemek Kartı bakiyesini harcamasını sağlar.

## 2. Ana Navigasyon
- Ana Sayfa
- Keşfet
- QR
- Cüzdan
- Profil

## 3. Temel Ekranlar
### 3.1 Kayıt ve Giriş
- Telefon numarası
- SMS OTP
- KVKK ve üyelik onayı
- Cihaz oturumu
- Profil tamamlama

### 3.2 Ana Sayfa
- Yakındaki fırsatlar
- Kullanıcının Toin bakiyesi
- Varsa yemek kartı bakiyesi
- Kategoriler
- Kişiselleştirilmiş kampanyalar
- Favori işletmeler
- Son işlemler

### 3.3 Keşfet
- Harita ve liste görünümü
- Kategori, mesafe, puan ve kampanya filtresi
- Yemek kartı geçen işletmeler filtresi
- Açık işletmeler filtresi

### 3.4 İşletme Detayı
- İşletme, şube, adres ve çalışma saatleri
- Kampanyalar
- Menü veya ürün vitrini
- Toin kazanım kuralı
- Yemek kartı geçerlilik bilgisi
- Yol tarifi, arama, favoriye ekleme

### 3.5 QR İşlemleri
- Toin kazan
- Toin kullan
- Yemek kartı ile öde
- İşlem özeti ve kullanıcı onayı
- Başarılı/başarısız işlem ekranı

### 3.6 Cüzdan
- Toin hesabı
- Yemek kartı hesabı
- Kuponlar ve ödüller
- İşlem geçmişi
- Bekleyen ve iptal edilen işlemler

### 3.7 Profil ve Destek
- Kullanıcı bilgileri
- Bildirim tercihleri
- Güvenlik ve cihazlar
- KVKK izinleri
- Destek talebi
- İşlem itirazı
- Hesap kapatma

## 4. MVP Dışında Tutulanlar
- P2P Toin transferi
- Şans çarkı
- Fiş OCR
- Hediye çeki pazarı
- Sosyal takip ve yorum sistemi

## 5. Güvenlik Kuralları
- Dinamik QR kısa süreli olmalı
- Hassas işlemlerde PIN veya biyometrik onay desteklenmeli
- Aynı işlem iki kez uygulanmamalı
- Bakiyeler istemcide değil sunucuda doğrulanmalı
- Root/jailbreak ve anormal cihaz davranışı risk sinyali üretmeli

## 6. Kabul Kriterleri
- Kullanıcı kayıt olup işletme keşfedebilmeli
- Kampanya koşullarını işlem öncesi görebilmeli
- Toin ve yemek bakiyesi birbirinden ayrı gösterilmeli
- İşlem geçmişindeki her hareket tekil referans taşımalı
- İtiraz başlatılabilmeli
