# TORBAA Terimler Sözlüğü

## Temel Terimler
- **TORBAA:** Sadakat, keşif, yerel ticaret ve kurumsal yan haklar platformu.
- **Toin:** TORBAA sadakat sisteminde kazanılan ve kullanım koşulları sistem parametreleriyle yönetilen ödül varlığı.
- **Yemek Bakiyesi:** Kurumsal şirket tarafından çalışan adına tanımlanan ve uygun yemek işletmelerinde kullanılabilen ayrı bakiye.
- **Cüzdan:** Kullanıcı, işletme, şirket veya sistem hesabını temsil eden mantıksal hesap.
- **Ledger:** Her finansal hareketi çift taraflı kayıtlarla izleyen değiştirilemez işlem defteri.
- **Ledger Transaction:** Tek bir iş olayına ait muhasebesel kayıt grubu.
- **Ledger Entry:** Bir cüzdana borç veya alacak yönünde yazılan tek kayıt.
- **Hakediş:** İşletmenin işlemlerden doğan ve kesintiler sonrası ödenebilir tutarı.
- **Mutabakat:** TORBAA kayıtlarıyla ödeme kuruluşu, banka veya işletme kayıtlarının karşılaştırılması.
- **İade:** Tamamlanmış ödemenin tamamının veya bir kısmının ters kayıtla geri çevrilmesi.
- **Ters Kayıt:** Geçmiş kaydı silmeden etkisini karşılayan yeni ledger işlemi.
- **Komisyon:** İşletmeden işlem veya hizmet karşılığında alınan sözleşmesel bedel.
- **Toplam Maliyet:** Komisyon, cihaz, transfer, hızlı ödeme ve diğer ücretlerin toplam etkisi.

## Teknik Terimler
- **Idempotency:** Aynı isteğin tekrar gönderilmesinde ikinci finansal işlem oluşmasını engelleme özelliği.
- **QR Payment Intent:** Belirli tutar, şube, kasiyer ve süre için oluşturulan ödeme niyeti.
- **Outbox:** Veritabanı işlemiyle dış mesaj yayınlama arasındaki veri kaybını önleyen desen.
- **RBAC:** Rol tabanlı erişim kontrolü.
- **Scope:** Yetkinin hangi şirket, işletme veya şube içinde geçerli olduğunu belirten sınır.
- **Maker-Checker:** Kritik işlemin bir kullanıcı tarafından hazırlanıp başka kullanıcı tarafından onaylanması.
- **Audit Log:** Yönetici ve sistem aksiyonlarının değiştirilemez denetim kaydı.
- **Feature Flag:** Özelliği kod dağıtımından bağımsız açıp kapatan sistem parametresi.
- **Webhook:** Harici sistemlerin TORBAA'ya imzalı olay bildirimi göndermesi.
- **Correlation ID:** Bir isteğin servisler ve loglar boyunca izlenmesini sağlayan tekil kimlik.

## Roller
- **Kullanıcı:** TORBAA mobil uygulamasını kullanan tüketici veya çalışan.
- **Kasiyer:** Şube adına QR tahsilat başlatabilen sınırlı yetkili personel.
- **Şube Yöneticisi:** Belirli bir şubenin personel ve operasyonunu yönetir.
- **İşletme Sahibi:** İşletmenin tüm şubeleri, kampanyaları ve hakedişlerini yönetir.
- **Kurumsal İK:** Çalışan ve yan hak operasyonunu yönetir.
- **Kurumsal Finans:** Bakiye yükleme, fatura ve mutabakat süreçlerini yönetir.
- **Admin Operasyon:** Başvuru ve platform operasyonunu yönetir.
- **Admin Finans:** Hakediş, iade ve mutabakat süreçlerinde yetkilidir.
- **Admin Risk:** Şüpheli işlem, limit ve hesap aksiyonlarını yönetir.
- **Destek:** Kullanıcı ve işletme taleplerini sınırlı veri görünümüyle çözer.

## Durum Terimleri
- **Pending:** İşlem başlatılmış ancak kesinleşmemiştir.
- **Completed:** İşlem başarıyla tamamlanmıştır.
- **Failed:** İşlem teknik veya iş kuralı nedeniyle tamamlanmamıştır.
- **Reversed:** İşlemin etkisi ters kayıtla kapatılmıştır.
- **Settled:** İşletme hakedişi ödeme sürecinde tamamlanmıştır.
- **Suspended:** Hesap veya özellik geçici olarak kullanıma kapalıdır.
