# Komisyon ve Hakediş Sistemi

## Amaç

İşletmenin her işlemde ne kadar kesinti yapıldığını, ne zaman ve ne kadar ödeme alacağını açıkça görmesini sağlamak.

## İşlem hesaplaması

Her işlem için minimum şu değerler saklanır:

- Brüt işlem tutarı
- Uygulanan fiyat planı ve sürümü
- Komisyon oranı/tutarı
- Diğer izinli kesintiler
- Vergi bilgileri
- Net hakediş
- Hakediş uygunluk tarihi
- Planlanan ödeme tarihi
- Gerçek ödeme tarihi

Geçmiş işlem, fiyat planı sonradan değişse bile eski planın hesaplamasını korur.

## Hakediş durumları

- `pending`: İşlem tamamlandı, bekleme süresinde
- `eligible`: Ödemeye uygun
- `on_hold`: Risk, itiraz veya belge nedeniyle blokeli
- `scheduled`: Ödeme planına alındı
- `processing`: Banka/iş ortağına gönderildi
- `paid`: Başarıyla ödendi
- `failed`: Ödeme başarısız
- `reversed`: İade veya düzeltmeyle geri alındı

## Mutabakat

Günlük mutabakat aşağıdakileri karşılaştırır:

1. TORBAA işlem kayıtları
2. Ledger hareketleri
3. Ödeme ortağı işlem sonuçları
4. Banka/hakediş ödeme sonuçları

Fark oluştuğunda otomatik kapatma yapılmaz; istisna kuyruğuna düşer.

## İade etkisi

- Hakediş öncesi iade: İlgili işlem hakediş havuzundan çıkarılır.
- Hakediş sonrası iade: Sonraki hakedişten mahsup veya işletmeden tahsilat kaydı oluşturulur.
- Kısmi iade: Komisyon ve Toin etkisi oransal veya sözleşmedeki kurala göre ters çevrilir.

## Şeffaflık ekranı

İşletme paneli şu örneğe benzer bir döküm sunar:

```text
Brüt işlem            1.000,00 TL
Komisyon                 20,00 TL
Diğer kesinti              0,00 TL
Net hakediş              980,00 TL
Uygunluk tarihi       29.07.2026
Planlanan ödeme       30.07.2026
```

## Yetki ve güvenlik

- Komisyon planı değişikliği çift onay gerektirebilir.
- Manuel hakediş düzeltmesi sebep, belge ve audit kaydı olmadan yapılamaz.
- Banka hesabı değişikliğinde güçlü doğrulama ve bekleme süresi uygulanır.
- Ödeme dosyası oluşturma ve onaylama aynı kullanıcı tarafından yapılamaz.
