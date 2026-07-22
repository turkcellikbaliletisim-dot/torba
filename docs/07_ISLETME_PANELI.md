# TORBAA İşletme Paneli Spesifikasyonu

## 1. Amaç
İşletmelerin TORBAA ekosistemine başvurmasını, şubelerini ve çalışanlarını yönetmesini, kampanya oluşturmasını, QR işlemlerini izlemesini ve yemek kartı hakedişlerini takip etmesini sağlar.

## 2. Roller
- İşletme sahibi
- Finans yetkilisi
- Şube yöneticisi
- Kasiyer
- Kampanya yöneticisi
- Rapor görüntüleyici

Her rol yalnızca yetkili olduğu ekran ve işlemlere erişir.

## 3. Başvuru ve Onay
- Vergi ve şirket bilgileri
- Yetkili kişi doğrulaması
- IBAN
- Şube bilgileri
- Sözleşme onayı
- Belge yükleme
- Admin incelemesi
- Onay, eksik belge veya ret durumu

## 4. Ana Ekran
- Günlük ve aylık işlem hacmi
- Toin işlemleri
- Yemek kartı işlemleri
- Bekleyen hakediş
- Sonraki ödeme tarihi
- Aktif kampanyalar
- Risk veya itiraz bildirimleri

## 5. Şube ve Kasiyer Yönetimi
- Şube ekleme ve düzenleme
- Çalışma saatleri
- Kategori ve konum
- Kasiyer hesabı oluşturma
- Cihaz eşleştirme
- Yetki ve işlem limiti
- Kasiyer oturumu kapatma

## 6. QR Tahsilat
- Dinamik QR oluşturma
- Tutar ve işlem türü seçimi
- Yemek kartı kabulü
- Toin kazanım veya kullanım işlemi
- İşlem sonucu ve referans numarası
- İptal/iade talebi

## 7. Kampanya Yönetimi
- Kampanya türü
- Başlangıç ve bitiş tarihi
- Şube seçimi
- Minimum harcama
- Kullanım kotası
- Toin katkı bütçesi
- Hedef kullanıcı kitlesi
- Admin onayı gerektiren kampanyalar
- Performans raporu

## 8. İşlemler ve İadeler
- Tarih, şube, kasiyer ve işlem türü filtreleri
- Brüt tutar, komisyon, Toin katkısı ve net hakediş
- Tam veya kısmi iade talebi
- İtiraz dosyası ve açıklama
- Dışa aktarma

## 9. Hakediş ve Mutabakat
- Günlük hakediş özeti
- Standart veya hızlı ödeme planı
- Kesinti dökümü
- Banka transfer geçmişi
- Mutabakat dosyası
- Fatura ve dekontlar

## 10. Raporlama
- Şube performansı
- Kampanya dönüşümü
- Yeni ve tekrar gelen müşteri
- Ortalama sepet
- Toin maliyeti
- Yemek kartı cirosu

## 11. MVP Dışında Tutulanlar
- Tedarik pazaryeri
- Gelişmiş CRM otomasyonu
- Fiziksel POS SDK
- Yapay zekâ kampanya önerileri

## 12. Kabul Kriterleri
- İşletme başvurusu admin onayına düşmeli
- Kasiyer yalnızca tahsilat yapabilmeli
- İşletme her işlemde net hakedişi görebilmeli
- Kampanya bütçesi limit aşımında durmalı
- İade işlemi orijinal işlemi değiştirmeden ters kayıt oluşturmalı
