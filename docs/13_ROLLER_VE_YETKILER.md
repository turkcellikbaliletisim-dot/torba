# TORBAA Roller ve Yetkiler

## 1. Amaç
TORBAA'da yetkilendirme rol bazlı erişim kontrolü ve kaynak kapsamı birlikte uygulanmalıdır. Bir kullanıcının rolü kadar hangi işletme, şube veya şirket adına işlem yaptığı da kontrol edilmelidir.

## 2. Temel Roller
### Kullanıcı
- İşletme keşfetme
- Kampanya görüntüleme
- Kendi Toin ve yemek kartı hesabını görüntüleme
- QR işlemini onaylama
- Kendi işlem geçmişini görüntüleme
- İtiraz ve destek talebi oluşturma

### Kasiyer
- Atandığı şubede QR ödeme talebi oluşturma
- Şubenin gün içi işlemlerini görüntüleme
- Yetkisi varsa iade talebi oluşturma
- Bakiye, banka hesabı ve komisyon değiştiremez

### Şube Yöneticisi
- Kasiyerleri yönetme
- Şube işlemlerini ve raporlarını görüntüleme
- Kampanya taslağı oluşturma
- Belirli limite kadar iade talebi verme

### İşletme Sahibi / İşletme Yöneticisi
- İşletme ve tüm şubeleri yönetme
- Banka hesabı ekleme ve doğrulama başlatma
- Kampanya oluşturma
- Hakedişleri ve komisyonları görüntüleme
- Personel rolü atama
- Destek ve itiraz yönetimi

### Kurumsal İK Kullanıcısı
- Çalışan görüntüleme ve ekleme
- Departman yönetimi
- Bakiye yükleme taslağı oluşturma
- Rapor görüntüleme

### Kurumsal Finans Yetkilisi
- Bakiye yükleme taslağını onaylama
- Fatura ve ödeme görüntüleme
- Finansal rapor dışa aktarma

### Kurumsal Yönetici
- Şirket kullanıcılarını ve yetkilerini yönetme
- Kullanım politikalarını belirleme
- Yüksek tutarlı işlemleri onaylama

### Destek Uzmanı
- Destek taleplerini görüntüleme
- Kimlik ve finans verilerinin yalnızca maskeli halini görme
- İşlem düzeltmesi yapamaz

### Risk Uzmanı
- Risk olaylarını inceleme
- Hesap veya işlem üzerine geçici kısıt koyma
- İşlem geçmişini görüntüleme
- Tek başına manuel bakiye ekleyemez

### Finans Operasyon Uzmanı
- Hakediş ve mutabakat işlemlerini yönetme
- Banka transfer durumlarını takip etme
- İade ve düzeltme kayıtlarını hazırlama

### Admin
- Platform operasyonlarını yönetme
- Başvuru onaylama
- Kampanya ve içerik yönetme
- Kullanıcı durumlarını yönetme
- Yetkisi dışında finansal ledger kaydı değiştiremez

### Süper Admin
- Rol ve izin yönetimi
- Sistem parametresi yönetimi
- Kritik operasyonlarda ikinci onay
- Erişimler sınırlı sayıda kişiye verilmelidir

### Denetçi
- Salt okunur erişim
- Audit log, finans hareketi ve onay zincirlerini görüntüleme
- Veri değiştiremez

## 3. Scope Yapısı
Yetkiler şu kapsamlarla sınırlandırılabilir:
- SELF
- BRANCH
- MERCHANT
- CORPORATE_COMPANY
- PLATFORM

Örnek: Şube yöneticisi `transactions.read` iznine sahip olsa bile yalnızca kendi şubesindeki işlemleri görebilir.

## 4. Örnek İzin Kodları
- profile.read
- wallet.read
- payment.create
- payment.refund.request
- payment.refund.approve
- merchant.read
- merchant.update
- branch.manage
- cashier.manage
- campaign.create
- campaign.approve
- settlement.read
- settlement.execute
- corporate.employee.manage
- corporate.allowance.create
- corporate.allowance.approve
- risk.review
- account.suspend
- system.parameter.update
- audit.read

## 5. Görevler Ayrılığı
Aşağıdaki işlemler aynı kişi tarafından tek başına tamamlanmamalıdır:
- Banka hesabı ekleme ve doğrulama
- Yüksek tutarlı iade hazırlama ve onaylama
- Hakediş dosyası oluşturma ve transfer onayı
- Sistem komisyon oranı değiştirme ve canlıya alma
- Kurumsal toplu bakiye oluşturma ve fonlama onayı

## 6. Yetki Kontrol Kuralları
- Yetki kontrolü yalnızca arayüzde değil API katmanında yapılmalıdır.
- Rol isimleri yerine izin kodları kontrol edilmelidir.
- Rol değişiklikleri audit log'a yazılmalıdır.
- Kritik rol atamalarında ikinci onay ve MFA aranmalıdır.
- İşten ayrılan personelin erişimi anında iptal edilmelidir.
- Geçici yetkiler bitiş tarihli olmalıdır.

## 7. Kabul Kriterleri
- Her endpoint gerekli izin ve scope bilgisini tanımlamalıdır.
- Yetkisiz erişim denemeleri loglanmalıdır.
- Admin kullanıcıları varsayılan olarak en az yetkiyle başlamalıdır.
- Denetçi rolü hiçbir yazma işlemi yapamamalıdır.
- Rol matrisi otomatik testlerle doğrulanmalıdır.
