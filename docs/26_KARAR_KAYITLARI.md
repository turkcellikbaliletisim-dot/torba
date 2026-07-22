# TORBAA Karar Kayıtları

Bu belge, ürün ve teknik kararların durumunu tek yerde izler. Her kesin karar ayrı bir ADR dosyasına taşınabilir.

## Durumlar
- `KABUL_EDILDI`
- `DENEME`
- `ACIK`
- `ERTELENDI`
- `IPTAL`

## Karar Listesi

| No | Karar | Durum | Gerekçe |
|---|---|---|---|
| K-001 | TORBAA'nın ana işi sadakat, keşif ve yerel ticarettir | KABUL_EDILDI | Yemek kartı tüm markayı sınırlandırmamalıdır |
| K-002 | Yemek kartı güçlü ana ürünlerden biridir | KABUL_EDILDI | Kurumsal trafik ve işletme ağı oluşturur |
| K-003 | Toin ve yemek bakiyesi ayrı ledger hesaplarında tutulur | KABUL_EDILDI | Hukuki, muhasebesel ve risk ayrımı gerekir |
| K-004 | Finansal hareketler silinmez; ters kayıt kullanılır | KABUL_EDILDI | Denetlenebilirlik ve mutabakat gerekir |
| K-005 | İlk teknik mimari modüler monolit olacaktır | KABUL_EDILDI | MVP hızını korurken modül sınırları sağlar |
| K-006 | İlk pilotta QR tabanlı tahsilat kullanılır | DENEME | Fiziksel POS maliyetini ve entegrasyon yükünü azaltır |
| K-007 | P2P Toin transferi MVP dışında tutulur | KABUL_EDILDI | Regülasyon ve suistimal riskini azaltır |
| K-008 | Şans çarkı, OCR ve hediye çeki MVP dışında tutulur | KABUL_EDILDI | Çekirdek değer ve finansal güvenlik önce gelir |
| K-009 | Yemek kartı başlangıçta lisanslı iş ortağı modeliyle değerlendirilir | ACIK | Hukuki ve ticari görüşmelerle kesinleşecektir |
| K-010 | 1 Toin'in kullanım ve değer denkliği | ACIK | Muhasebe, hukuk ve kampanya ekonomisi birlikte doğrulanmalıdır |
| K-011 | Kesin işletme komisyon oranı | ACIK | Ödeme altyapısı ve pilot maliyetlerinden sonra belirlenir |
| K-012 | Standart Toin kazanım oranı | ACIK | Birim ekonomi ve kampanya finansmanına bağlıdır |
| K-013 | Mobil uygulama ilk pilotta PWA mı native mi olacak | ACIK | Kullanıcı deneyimi ve bütçe karşılaştırılacaktır |
| K-014 | Hakediş standart süresi | ACIK | Partner maliyeti, nakit akışı ve işletme beklentisine bağlıdır |
| K-015 | Pilot şehir Balıkesir | DENEME | Mevcut yerel işletme ilişkileri ve operasyon erişimi avantaj sağlar |

## Karar Değiştirme Kuralı
- Kabul edilmiş karar sessizce değiştirilmez.
- Değişiklik gerekçesi, etkilediği belgeler ve geçiş planı yazılır.
- Finansal veya hukuki kararlar uzman onayı olmadan `KABUL_EDILDI` yapılmaz.
- Değişen kararın API, veritabanı, sözleşme, test ve operasyon etkisi kontrol edilir.

## ADR Şablonu
```text
Başlık:
Durum:
Tarih:
Bağlam:
Karar:
Alternatifler:
Sonuçlar:
Etkilenen Belgeler:
Onaylayanlar:
```
