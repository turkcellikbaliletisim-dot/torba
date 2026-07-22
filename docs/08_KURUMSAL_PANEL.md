# TORBAA Kurumsal Şirket Paneli Spesifikasyonu

## 1. Amaç
Şirketlerin çalışan yemek bütçelerini, kurumsal Toin ödüllerini, departmanları, maliyet merkezlerini, faturaları ve raporları yönetmesini sağlar.

## 2. Roller
- Şirket yöneticisi
- İK yöneticisi
- Finans yetkilisi
- Onay yetkilisi
- Rapor görüntüleyici

## 3. Şirket Başvurusu
- Ticari bilgiler
- Vergi bilgileri
- Yetkili kişi
- Sözleşme
- Fatura ve ödeme tercihleri
- Admin onayı

## 4. Çalışan Yönetimi
- Tekli çalışan ekleme
- Excel/CSV ile toplu ekleme
- Departman ve maliyet merkezi
- Aktif, askıda ve ayrılmış çalışan durumu
- Telefon doğrulama daveti
- Kart veya cüzdan aktivasyonu

## 5. Bakiye Yükleme
- Dönem seçimi
- Günlük veya aylık tutar
- Çalışılan gün sayısı
- Toplu yükleme
- Önizleme
- Yetkili onayı
- Ödeme sonrası kesinleştirme
- Hatalı kayıt raporu

## 6. Kurumsal Toin
- Performans primi
- Özel gün ödülü
- Kampanya bütçesi
- Çalışan veya grup seçimi
- Kullanım süresi
- Muhasebe raporu

## 7. Onay Akışı
Taslak -> Onay Bekliyor -> Onaylandı -> Ödeme Bekliyor -> İşlendi -> İptal/İade

Tutar eşiklerine göre bir veya birden fazla onaycı tanımlanabilir.

## 8. Fatura ve Ödemeler
- Aylık fatura
- Ön ödeme ve bakiye durumu
- Dekontlar
- Başarısız ödeme
- İade ve düzeltme belgesi
- Muhasebe dışa aktarımı

## 9. Raporlama
- Çalışan bazlı kullanım
- Departman ve maliyet merkezi
- Kullanılmayan bakiye
- İşletme ve kategori dağılımı
- Dönem karşılaştırması
- Vergi parametrelerine dayalı bilgilendirme raporu

Vergi veya istisna tutarları kod içine sabit yazılmaz; tarihçeli parametre olarak yönetilir ve hukuki/mali doğrulama gerektirir.

## 10. Güvenlik
- Kurumsal kullanıcılar için MFA
- Yükleme ve onay işlemlerinde audit log
- Tutar eşiği ve yetki kontrolü
- Dosya yüklemelerinde virüs ve format kontrolü
- Hassas çalışan verilerinde maskeleme

## 11. MVP Dışında Tutulanlar
- Tam ERP çift yönlü entegrasyon
- Bordro motoru
- Çok ülkeli vergi modeli
- Gelişmiş yan hak pazaryeri

## 12. Kabul Kriterleri
- Çalışanlar toplu eklenebilmeli
- Bakiye yüklemesi onay olmadan gerçekleşmemeli
- Başarısız satırlar ayrı raporlanmalı
- Her yükleme ledger referansına bağlanmalı
- Ayrılan çalışanın gelecekteki yüklemesi durdurulmalı
