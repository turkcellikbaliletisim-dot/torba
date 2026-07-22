# Toin Ekonomisi

## Amaç

Toin, TORBAA ekosisteminde kullanıcıyı tekrar işletmeye getiren sadakat varlığıdır. Yemek kartı bakiyesi değildir ve kurumsal yemek fonlarıyla karıştırılmaz.

## Temel kurallar

- Toin hesabı yemek bakiyesi hesabından ayrıdır.
- `1 Toin = 1 TL` denkliği henüz kesin karar değildir.
- Standart kazanım oranı kod içine sabitlenmez.
- Her kazanımın finansman kaynağı tutulur: işletme, kurumsal şirket veya TORBAA.
- Her kampanyanın bütçesi, başlangıç/bitiş tarihi, limitleri ve uygunluk koşulları bulunur.
- İade edilen işlemden kazanılan Toin ters kayıtla geri alınır.
- Toin hareketleri silinmez veya doğrudan düzenlenmez.

## Sürdürülebilir kazanım modeli

Başlangıç varsayımı:

- Düşük taban kazanım oranı
- İşletme katkısıyla yükselen kampanya oranı
- Kurumsal şirket tarafından fonlanan çalışan kampanyaları
- TORBAA tarafından sınırlı süre ve bütçeyle desteklenen büyüme kampanyaları

İşletmeden alınan komisyonun üzerinde sürekli Toin verilmesi yasaklanmasa bile finansal onay gerektirir. Kampanya oluşturulurken sistem tahmini yükümlülük ve marj etkisini göstermelidir.

## Hesap ve hareket türleri

- `reward_earn`: Toin kazanımı
- `reward_spend`: Toin kullanımı
- `reward_expire`: Süre sonu
- `reward_reversal`: İade/iptal geri alımı
- `reward_adjustment`: Yetkili düzeltme; çift onay ve audit zorunlu
- `campaign_funding`: Kampanya bütçesi yükleme
- `campaign_release`: Kullanılmayan bütçe çözme

## Limitler

- İşlem başı kazanım limiti
- Günlük ve aylık kullanıcı limiti
- Kampanya toplam bütçesi
- İşletme bazlı limit
- Cihaz ve hesap bazlı risk limiti

Limit aşımında işlem reddedilebilir veya ödül kısmı uygulanmayabilir; kullanıcıya açık sonuç gösterilir.

## Seviye sistemi

Seviyeler doğrudan yüzde 5, yüzde 10, yüzde 15 gibi sürdürülemez oranlar vermek zorunda değildir. Tercih edilen faydalar:

- Özel kampanyalara erken erişim
- Daha yüksek kampanya tavanı
- Ücretsiz ürün/kupon
- Destek önceliği
- Partner avantajları

## İade ve eksi bakiye

Kullanıcı kazandığı Toin'i harcadıktan sonra ana işlem iade edilirse:

1. Toin geri alma kaydı oluşturulur.
2. Yeterli bakiye yoksa hesap eksi bakiyeye düşürülebilir veya bloke alacağı oluşturulur.
3. Sonraki kazanımlar bu alacağı kapatır.
4. Kötüye kullanım şüphesinde hesap incelemeye alınır.

Kesin davranış açık kararlar dosyasında karara bağlanacaktır.

## MVP dışı

- Kullanıcılar arası P2P Toin transferi
- Toin'i nakde çevirme
- Kripto veya blokzincir kullanımı
- Kontrolsüz hediye çeki dönüşümü
