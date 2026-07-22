# TORBAA Database

## Amaç
Bu klasör, TORBAA'nın PostgreSQL migration dosyalarını içerir.

## Kurallar
- Migration dosyaları değiştirilemez geçmiş olarak kabul edilir.
- Canlıya uygulanmış migration yeniden yazılmaz; yeni migration eklenir.
- Finansal kayıtlar silinmez.
- Para alanları kuruş bazlı `bigint` olarak tutulur.
- Ledger işlemleri dengeli olmak zorundadır.
- Her production migration için geri dönüş veya ileri düzeltme planı hazırlanır.

## İlk migration
`migrations/001_core_schema.sql` aşağıdaki çekirdeği oluşturur:
- kullanıcı ve roller,
- işletme ve şubeler,
- kurumsal şirket ve çalışanlar,
- cüzdanlar,
- ledger transactions ve entries,
- QR ödeme intentleri,
- ödemeler ve iadeler,
- audit logları.

## Çalıştırma örneği

```bash
psql "$DATABASE_URL" -f database/migrations/001_core_schema.sql
```

Bu komut geliştirme ortamı içindir. Production migration CI/CD içinde kontrollü ve yedekli çalıştırılmalıdır.
