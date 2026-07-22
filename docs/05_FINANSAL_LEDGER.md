# Finansal Ledger Mimarisi

## Amaç

TORBAA'daki yemek bakiyesi, Toin, komisyon, hakediş ve iadelerin değiştirilemez ve denetlenebilir finansal kaydını tutmak.

## Temel prensipler

1. Her finansal olay en az iki ledger satırı üretir.
2. Toplam borç ve alacak her işlem grubunda dengede olmalıdır.
3. Ledger satırları silinmez veya güncellenmez.
4. Hata, iptal ve iadeler ters kayıtla düzeltilir.
5. Her istek idempotency key taşır.
6. Para tutarları floating point yerine en küçük para birimi veya kesin decimal tipinde tutulur.
7. Görünen bakiye, ledger toplamından üretilir veya doğrulanır.

## Hesap türleri

- `corporate_funding`
- `user_meal_balance`
- `user_toin_balance`
- `merchant_pending_settlement`
- `merchant_payable_settlement`
- `torbaa_commission_revenue`
- `campaign_budget`
- `refund_clearing`
- `payment_partner_clearing`
- `risk_hold`

## Örnek yemek kartı işlemi

Kullanıcı 500 TL ödeme yaptığında ve 10 TL komisyon oluştuğunda örnek kayıt mantığı:

```text
Kullanıcı yemek hesabı          -500 TL
İşletme bekleyen hakediş        +490 TL
TORBAA komisyon hesabı           +10 TL
```

Gerçek borç/alacak yönü kullanılan muhasebe modeline göre uygulanır; işlem grubu her durumda dengeli olmalıdır.

## Örnek Toin kazanımı

10 Toin işletme tarafından fonlanıyorsa:

```text
İşletme kampanya bütçesi         -10 Toin
Kullanıcı Toin hesabı            +10 Toin
```

Fon kaynağı kampanya kaydında zorunludur.

## Veri modeli

### Ledger account
- `id`
- `owner_type`
- `owner_id`
- `asset_type`
- `status`
- `created_at`

### Ledger transaction
- `id`
- `external_reference`
- `idempotency_key`
- `transaction_type`
- `status`
- `effective_at`
- `created_at`
- `reversal_of_id`

### Ledger entry
- `id`
- `transaction_id`
- `account_id`
- `direction`
- `amount`
- `currency_or_asset`
- `metadata`
- `created_at`

## Zorunlu kontroller

- Aynı idempotency key ikinci finansal hareketi oluşturamaz.
- Kapalı veya blokeli hesapta izin verilmeyen hareket yapılamaz.
- Yetersiz kullanılabilir bakiye işlemden önce kontrol edilir.
- Eşzamanlı harcamalar satır kilidi veya güvenli optimistic concurrency ile korunur.
- Ledger transaction tamamlanmadan dış sistemde başarılı işlem gösterilmez.
- Webhook tekrarları güvenli şekilde işlenir.

## Bakiye türleri

- `posted_balance`: Kesinleşmiş hareketler
- `pending_balance`: Bekleyen hareketler
- `available_balance`: Kullanılabilir tutar
- `held_balance`: Risk veya itiraz nedeniyle blokeli tutar

## Denetim

Her finansal hareket şu bağlamı taşımalıdır:

- kullanıcı/işletme/şirket kimliği
- şube ve kasiyer
- cihaz ve oturum
- API isteği ve correlation ID
- fiyat planı sürümü
- kampanya kuralı sürümü
- onaylayan yönetici
- ters işlem bağlantısı

## Test invariants

- Her işlem grubunda toplam borç = toplam alacak.
- Bakiye hiçbir zaman izin verilen limitin altına düşmez.
- Aynı istek tekrarlandığında sonuç değişmez.
- Tam iade sonrası ana işlem net etkisi sıfırdır.
- Kısmi iade yalnızca iade edilen tutar kadar etki oluşturur.
- Hakediş ödemesi işletmenin ödenebilir bakiyesini doğru azaltır.
