# TORBAA Admin Paneli Spesifikasyonu

## 1. Amaç
TORBAA operasyon, finans, destek, risk ve içerik ekiplerinin platformu güvenli ve denetlenebilir biçimde yönetmesini sağlar.

## 2. Admin Rolleri
- Süper admin
- Operasyon
- Finans
- Risk ve uyum
- Destek
- Kampanya ve içerik
- Salt okunur denetçi

Kritik yetkiler görev ayrılığı ilkesine göre dağıtılır.

## 3. Genel Dashboard
- Aktif kullanıcı ve işletme
- Günlük işlem hacmi
- Toin yükümlülüğü
- Yemek kartı işlem hacmi
- Bekleyen hakediş
- Başarısız işlemler
- Risk alarmları
- Açık destek kayıtları

## 4. Başvuru Yönetimi
- İşletme başvuruları
- Kurumsal şirket başvuruları
- Belge inceleme
- Eksik belge talebi
- Onay, ret, askıya alma
- Sözleşme durumu

## 5. Kullanıcı ve Yetki Yönetimi
- Kullanıcı arama
- Hesap durumu
- Cihaz ve oturumlar
- Hesap askıya alma
- Admin rol ve yetkileri
- Yetki değişikliği audit logu

## 6. Finansal Operasyon
- Ledger hareketleri
- Cüzdan hesapları
- Komisyon kuralları
- Hakediş dönemleri
- Banka transferleri
- Mutabakat farkları
- İade ve ters kayıtlar
- Manuel finansal düzeltmeler için çift onay

## 7. Toin ve Kampanya Yönetimi
- Kazanım kuralları
- Bütçe sahibi
- Kampanya onayı
- Günlük ve kullanıcı limitleri
- Süre sonu kuralları
- İade sonrası Toin geri alma
- Toplam açık Toin yükümlülüğü

## 8. Risk ve Uyum
- Şüpheli işlem kuyruğu
- Hız ve tutar kuralları
- Aynı cihaz/hesap ilişkileri
- İşletme ve kullanıcı risk skoru
- İnceleme notları
- Hesap kısıtlama
- Kanıt ve karar geçmişi

## 9. Destek ve İtiraz
- Kullanıcı ve işletme talepleri
- İşlem itirazları
- İade talepleri
- SLA ve atama
- İç notlar
- Hazır yanıtlar
- Karar ve bildirim geçmişi

## 10. İçerik ve Bildirim
- Kategori ve şehir içerikleri
- Banner ve kampanya alanları
- Push, SMS ve e-posta şablonları
- Hedef kitle seçimi
- Gönderim onayı

## 11. Sistem Ayarları
- Tarihçeli mevzuat parametreleri
- İşlem limitleri
- Özellik bayrakları
- Entegrasyon durumu
- Bakım modu
- Sistem sağlık ekranı

## 12. Değiştirilemez Kayıt
Admin işlemlerinde aktör, zaman, önceki değer, yeni değer, gerekçe, IP ve cihaz bilgisi tutulur. Audit kayıtları normal panelden silinemez.

## 13. Kabul Kriterleri
- Finansal manuel düzeltme tek kişiyle tamamlanmamalı
- Onaysız işletme yemek kartı tahsilatı yapamamalı
- Tüm kritik admin işlemleri audit log üretmeli
- Yetkisiz rol hassas verileri görememeli
- Riskli işlem inceleme tamamlanana kadar kısıtlanabilmeli
