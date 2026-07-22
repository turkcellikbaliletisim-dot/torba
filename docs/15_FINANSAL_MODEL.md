# TORBAA Finansal Model

## 1. Amaç
Bu belge TORBAA'nın sadakat, yemek kartı ve işletme platformu gelir-gider mantığını tanımlar. Kesin fiyatlar; ödeme kuruluşu, banka, vergi, hukuk ve pilot verileri görülmeden sabitlenmez.

## 2. Ana Gelir Kanalları
- Yemek kartı işlem komisyonu
- Kurumsal şirket hizmet paketi
- İşletme premium aboneliği
- Sponsorlu kampanya ve görünürlük
- API ve ERP entegrasyon ücreti
- Erken hakediş hizmeti
- İlerleyen fazda tedarik pazaryeri komisyonu

## 3. Ana Maliyetler
- Ödeme kuruluşu ve banka maliyeti
- İşletme hakediş transferi
- SMS/OTP ve bildirim maliyeti
- Bulut, veri tabanı, izleme ve yedekleme
- Toin finansmanı
- Satış ve işletme edinme maliyeti
- Kurumsal satış ve destek
- Hukuk, mali müşavirlik ve denetim
- Sahtecilik, iade ve zarar karşılığı
- Personel ve operasyon giderleri

## 4. İşlem Birim Ekonomisi
Her ödeme için aşağıdaki değerler hesaplanmalıdır:
- Brüt işlem tutarı
- İşletme komisyonu
- Ödeme altyapısı maliyeti
- Toin maliyeti
- Hakediş transfer maliyeti
- Risk karşılığı
- TORBAA brüt katkı payı

Örnek formül:
`net_katki = komisyon_geliri - ödeme_maliyeti - toin_maliyeti - transfer_maliyeti - risk_payı`

Negatif katkı üreten kampanyalar bütçesiz açılamaz.

## 5. Toin Muhasebesi
- Toin kazanımı pazarlama gideri ve kullanıcı yükümlülüğü olarak izlenmelidir.
- Kullanılan, bekleyen, süresi dolan ve geri alınan Toin ayrı raporlanmalıdır.
- İade edilen işlemden kazanılan Toin ters kayıtla geri alınmalıdır.
- Kampanya bütçesi dolduğunda yeni kazanım durmalıdır.

## 6. Fiyatlandırma Senaryoları
### Standart
- En düşük toplam maliyet
- Standart hakediş süresi
- Sabit olmayan, maliyet temelli komisyon

### Hızlı Hakediş
- Daha kısa ödeme süresi
- Ek finansman maliyeti açıkça gösterilir

### Yüksek Hacim
- Hacim taahhüdüne bağlı özel oran
- Minimum aylık işlem veya hizmet bedeli uygulanabilir

### Sabit Paket
- Belirli işlem hacmine kadar aylık sabit ücret
- Aşım sonrası düşük oran

## 7. Üç Finansal Senaryo
Model en az şu ölçeklerde hazırlanmalıdır:
- Pilot: 1.000 aktif kullanıcı, 100 işletme
- Bölgesel: 25.000 aktif kullanıcı, 1.000 işletme
- Ulusal: 250.000+ aktif kullanıcı, çoklu şehir

Her senaryoda:
- İşlem hacmi
- Ortalama sepet
- Aktiflik oranı
- Gelir
- Değişken maliyet
- Sabit maliyet
- Toin yükümlülüğü
- Nakit ihtiyacı
- Başabaş noktası
hesaplanmalıdır.

## 8. Kontrol Kuralları
- Fiyatlar admin panelinde versiyonlu tutulur.
- Geçmiş işleme yeni fiyat uygulanmaz.
- Kampanya, Toin ve erken ödeme maliyeti ayrı gösterilir.
- İşletme ekranında toplam kesinti ve net hakediş görünür.
- Finans modeli aylık gerçekleşen verilerle güncellenir.

## 9. Karar Kapıları
Yemek kartı canlıya alınmadan önce:
- Pozitif veya kontrollü birim ekonomi
- En az 12 aylık nakit akışı
- Risk karşılığı
- Partner kuruluş maliyeti
- İade ve sahtecilik senaryosu
onaylanmalıdır.
