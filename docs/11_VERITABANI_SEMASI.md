# TORBAA Veritabanı Şeması

## 1. Amaç
Bu belge, TORBAA'nın sadakat, yemek kartı, işletme, kurumsal şirket ve finansal işlem altyapısı için gerekli çekirdek veri modelini tanımlar.

## 2. Temel İlkeler
- PostgreSQL ana veritabanı olarak kullanılmalıdır.
- Finansal kayıtlar silinmemeli; düzeltmeler ters kayıtla yapılmalıdır.
- Para ve puan alanları `float` ile tutulmamalı; kuruş bazlı `bigint` veya uygun `numeric` kullanılmalıdır.
- Tüm kritik tablolarda `created_at`, `updated_at`, `created_by` ve gerekiyorsa `version` alanları bulunmalıdır.
- Kimlikler tahmin edilebilir artan sayılar yerine UUID/ULID olabilir.

## 3. Kimlik ve Yetki Tabloları
### users
- id
- phone
- email
- full_name
- status
- phone_verified_at
- last_login_at

### user_devices
- id
- user_id
- device_fingerprint
- platform
- push_token
- trusted_at
- revoked_at

### roles
- id
- code
- name

### permissions
- id
- code
- name

### user_role_assignments
- id
- user_id
- role_id
- scope_type
- scope_id

## 4. İşletme Tabloları
### merchants
- id
- legal_name
- display_name
- tax_number
- tax_office
- status
- category_id
- agreement_status

### merchant_branches
- id
- merchant_id
- name
- address
- latitude
- longitude
- phone
- status
- meal_card_enabled

### merchant_staff
- id
- branch_id
- user_id
- staff_role
- status

### merchant_bank_accounts
- id
- merchant_id
- iban_encrypted
- account_holder
- verified_at
- status

### merchant_documents
- id
- merchant_id
- document_type
- file_key
- verification_status
- verified_by

## 5. Kurumsal Şirket Tabloları
### corporate_companies
- id
- legal_name
- tax_number
- tax_office
- status
- agreement_status

### corporate_departments
- id
- company_id
- name
- cost_center_code

### corporate_employees
- id
- company_id
- user_id
- employee_number
- department_id
- employment_status
- meal_card_status

### allowance_batches
- id
- company_id
- period
- total_amount_minor
- employee_count
- status
- approved_by

### allowance_batch_items
- id
- batch_id
- employee_id
- amount_minor
- status

## 6. Cüzdan ve Ledger Tabloları
### wallets
- id
- owner_type
- owner_id
- wallet_type
- currency
- status

`wallet_type` örnekleri:
- USER_TOIN
- USER_MEAL
- CORPORATE_FUNDING
- MERCHANT_RECEIVABLE
- TORBAA_COMMISSION
- CAMPAIGN_BUDGET
- SETTLEMENT_CLEARING

### ledger_transactions
- id
- transaction_type
- external_reference
- idempotency_key
- status
- occurred_at
- reversed_transaction_id
- metadata_json

### ledger_entries
- id
- ledger_transaction_id
- wallet_id
- direction
- amount_minor
- balance_after_minor

Her `ledger_transaction` için toplam borç ve alacak eşit olmalıdır.

## 7. Ödeme ve QR Tabloları
### qr_payment_intents
- id
- token_hash
- branch_id
- cashier_user_id
- amount_minor
- allowed_payment_methods
- expires_at
- status

### payments
- id
- payment_intent_id
- user_id
- merchant_id
- branch_id
- payment_method
- gross_amount_minor
- commission_amount_minor
- reward_amount_minor
- net_amount_minor
- status
- ledger_transaction_id

### refunds
- id
- payment_id
- amount_minor
- reason_code
- status
- ledger_transaction_id
- approved_by

## 8. Toin ve Kampanya Tabloları
### campaigns
- id
- merchant_id
- title
- campaign_type
- funding_source
- reward_rate_bps
- fixed_reward_minor
- budget_minor
- starts_at
- ends_at
- status

### campaign_rules
- id
- campaign_id
- rule_type
- rule_payload_json

### reward_events
- id
- user_id
- campaign_id
- payment_id
- reward_amount_minor
- status
- ledger_transaction_id

## 9. Hakediş ve Mutabakat Tabloları
### settlement_periods
- id
- merchant_id
- starts_at
- ends_at
- gross_amount_minor
- commission_amount_minor
- refund_amount_minor
- net_amount_minor
- status

### settlement_items
- id
- settlement_period_id
- payment_id
- net_amount_minor

### settlement_transfers
- id
- settlement_period_id
- bank_account_id
- provider_reference
- amount_minor
- status
- transferred_at

### reconciliation_records
- id
- source
- source_reference
- internal_reference
- amount_minor
- reconciliation_status

## 10. Operasyon Tabloları
- notifications
- support_tickets
- disputes
- audit_logs
- risk_events
- system_parameters
- legal_consents
- file_assets

## 11. İndeks ve Kısıtlar
- `idempotency_key` benzersiz olmalıdır.
- Aktif telefon numarası benzersiz olmalıdır.
- Aynı ödeme için toplam iade, ödeme tutarını aşmamalıdır.
- Ledger işlemi dengeli değilse commit edilmemelidir.
- Süresi geçmiş QR intent ödeme kabul etmemelidir.

## 12. MVP Çıkışı
MVP için önce kimlik, işletme, şirket, cüzdan, ledger, payment, reward, settlement ve audit tabloları uygulanmalıdır. OCR, hediye çeki, sosyal özellikler ve tedarik pazaryeri tabloları sonraki faza bırakılır.
