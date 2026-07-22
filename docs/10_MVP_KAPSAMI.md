# TORBAA MVP Kapsamı

## 1. MVP'nin Amacı
Balıkesir pilotunda TORBAA'nın ana değer önerisini doğrulamak:
- Kullanıcı yerel işletme keşfeder.
- Kampanya üzerinden Toin kazanır ve kullanır.
- İşletme müşteri ve kampanya performansını izler.
- Admin platformu yönetir.
- Sınırlı bir kurumsal yemek kartı pilotu kontrollü biçimde çalışır.

## 2. MVP İçindeki Modüller
### Kullanıcı
- Telefon + OTP kayıt
- Ana sayfa ve keşfet
- İşletme detayı
- Kampanya görüntüleme
- QR ile Toin kazanma/kullanma
- Toin ve yemek kartı cüzdanı
- İşlem geçmişi
- Destek ve itiraz

### İşletme
- Başvuru ve admin onayı
- Şube ve kasiyer
- QR tahsilat
- Basit kampanya oluşturma
- İşlem ve hakediş takibi
- İade talebi

### Kurumsal
- Şirket başvurusu
- Çalışan ekleme ve CSV yükleme
- Yemek bakiyesi yükleme talebi
- Onay ve raporlama

### Admin
- Başvurular
- Kullanıcı/işletme/şirket yönetimi
- Kampanya onayı
- İşlem, ledger ve hakediş görüntüleme
- Risk ve destek kuyruğu
- Parametre ve yetki yönetimi

### Finansal Çekirdek
- Ayrı Toin ve yemek hesapları
- Çift taraflı ledger
- İdempotent işlemler
- Dinamik QR
- Komisyon ve net hakediş
- Tam/kısmi iade ters kayıtları
- Mutabakat çıktısı

## 3. MVP Dışında Tutulanlar
- P2P Toin transferi
- Fiş OCR
- Şans çarkı ve gelişmiş oyunlaştırma
- Hediye çeki pazarı
- Tedarik pazaryeri
- Fiziksel POS cihaz uygulaması
- Gelişmiş ERP entegrasyonları
- Yapay zekâ öneri motoru
- Birden fazla ülke veya para birimi

## 4. Pilot Hedefleri
Başlangıç hedefleri karar niteliğinde değil, saha doğrulaması için öneridir:
- 50-100 aktif işletme
- 3-5 kurumsal şirket
- 500-1.000 şirket çalışanı
- 2.000+ son kullanıcı
- En az 8 haftalık pilot veri

## 5. Başarı Ölçütleri
- Aktif kullanıcı oranı
- İlk işlem dönüşümü
- Tekrar işlem oranı
- İşletme başvuru-onay süresi
- İşlem başarı oranı
- İade ve itiraz oranı
- Hakediş zamanında ödeme oranı
- Toin maliyeti / üretilen ek ciro
- Kurumsal yükleme hatası
- Destek çözüm süresi

## 6. Canlıya Geçiş Kapıları
Aşağıdakiler tamamlanmadan gerçek finansal pilot açılmaz:
- Hukuki faaliyet modeli onayı
- Ödeme kuruluşu/partner sözleşmesi
- Ledger ve mutabakat testleri
- Yetki ve audit log testleri
- İade/ters kayıt senaryoları
- Sızma testi ve kritik açıkların kapanması
- KVKK metinleri ve veri envanteri
- Destek ve olay müdahale süreci

## 7. Geliştirme Sırası
1. Ürün ve ekran prototipi
2. Kimlik, rol ve başvuru
3. İşletme keşfi ve kampanya
4. Toin ledger ve QR
5. Admin operasyonu
6. Kurumsal çalışan yönetimi
7. Yemek kartı partner sandbox entegrasyonu
8. Hakediş ve mutabakat
9. Güvenlik ve pilot testi

## 8. Tamamlanmış Sayılma Kriteri
MVP; yalnızca sayfaların görünmesiyle değil, uçtan uca en az şu akışların test edilmesiyle tamamlanır:
- İşletme başvurusu -> admin onayı -> kampanya -> kullanıcı işlemi
- Toin kazanma -> Toin kullanma -> iade -> ters kayıt
- Şirket çalışan yükleme -> yemek bakiyesi -> restoran ödemesi -> hakediş
- Risk alarmı -> admin incelemesi -> karar -> audit log
