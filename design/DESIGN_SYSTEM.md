# Torba Design System v1.0

## 1. Ürün karakteri

Torba; kullanıcıların yakınlarındaki işletmeleri, kampanyaları, kuponları ve sadakat avantajlarını keşfettiği mobil öncelikli bir platformdur. Arayüz finans uygulaması gibi görünmemeli; fırsat, keşif ve ödül duygusunu öne çıkarmalıdır.

## 2. Temel ilkeler

1. Kampanya önce gelir: Ana ekranın en görünür alanında fırsatlar yer alır.
2. Puan anlaşılır olmalıdır: Kullanıcı puan bakiyesini ve nasıl kazandığını tek bakışta görür.
3. Yerellik güçlüdür: Yakındaki işletmeler, mesafe ve harita bağlamıyla sunulur.
4. Cüzdan sade olmalıdır: Kuponlar, üyelik kartları ve kullanılabilir avantajlar tek yerde tutulur.
5. Her işlem güven verir: Kullanım koşulları, geçerlilik tarihi ve kazanım miktarı açıkça gösterilir.

## 3. Marka rengi

Ana renk: `#00B7EB`

Kullanım alanları:
- ana CTA butonları,
- aktif alt navigasyon öğesi,
- seçili filtreler,
- puan ve avantaj vurguları,
- doğrulanmış işletme işaretleri.

Ana renk tüm ekranı kaplayan ağır yüzeylerde kullanılmamalıdır. Büyük yüzeylerde açık tonlar kullanılmalıdır.

## 4. Yüzeyler

- Uygulama zemini: `#F7FAFC`
- Ana kart: `#FFFFFF`
- İkincil yüzey: `#EEF9FD`
- Ayırıcı: `#E5EDF2`
- Koyu metin: `#10212B`
- İkincil metin: `#647681`

## 5. Köşe yarıçapları

- Küçük etiket: 8 px
- Girdi ve küçük kart: 12 px
- Standart kart: 16 px
- Büyük kampanya kartı: 20 px
- Modal ve bottom sheet: 24 px
- Yuvarlak ikon butonu: tam daire

## 6. Gölgeler

Gölgeler hafif ve düşük kontrastlı olmalıdır.

- Kart: `0 6px 20px rgba(16, 33, 43, 0.07)`
- Yüzen alt menü: `0 -8px 28px rgba(16, 33, 43, 0.10)`
- Modal: `0 20px 50px rgba(16, 33, 43, 0.16)`

## 7. Grid ve ekran yapısı

- Mobil tasarım referansı: 390 x 844 px
- Yatay sayfa boşluğu: 20 px
- Kartlar arası boşluk: 12 veya 16 px
- Bölümler arası boşluk: 24 veya 32 px
- Alt navigasyon yüksekliği: 72-80 px + safe area
- Dokunma alanı: minimum 44 x 44 px

## 8. Görsel dil

- Fotoğraflar canlı, doğal ve işletmeyi anlaşılır biçimde göstermelidir.
- Kampanya görsellerinde fazla metin kullanılmamalıdır.
- İkonlar yuvarlatılmış, sade ve aynı stroke kalınlığında olmalıdır.
- Gradient yalnızca vurgu alanlarında ve kontrollü kullanılmalıdır.
- Cam efekti dekoratif amaçla sınırlı kullanılmalı; okunabilirliği düşürmemelidir.

## 9. Erişilebilirlik

- Normal metinde en az 4.5:1 kontrast hedeflenir.
- Renk tek başına durum belirtmez; ikon veya metinle desteklenir.
- Dinamik yazı boyutu desteklenir.
- Butonlar yalnızca ikon içeriyorsa erişilebilir etiket taşır.
- Hareket azaltma tercihi bulunan kullanıcılarda animasyonlar sadeleştirilir.

## 10. Durumlar

Her temel bileşen şu durumları tanımlamalıdır:
- default,
- pressed,
- focused,
- disabled,
- loading,
- success,
- error,
- empty.

## 11. Dil ve mikro metin

Dil kısa, sıcak ve doğrudan olmalıdır.

Doğru:
- `Kuponu kullan`
- `250 puan kazan`
- `2 gün kaldı`
- `Yakınındaki fırsatlar`

Kaçınılacak:
- uzun resmi açıklamalar,
- teknik sistem terimleri,
- belirsiz butonlar (`Devam`, `İşlem yap`) bağlam olmadan.
