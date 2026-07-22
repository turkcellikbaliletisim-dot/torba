# FLOW — Ürün ve Sistem Dokümanı (Master)
Tarih: 01.03.2026

## 1. Ürün Özeti
FLOW; SMMM (mali müşavir) ile işletmelerin, çalışanların ve kuryelerin **mali bildirim–onay–ödeme yönlendirme**, **evrak kütüphanesi**, **talep/gider süreçleri** ve **aktivite logu** üzerinden tek merkezden yönetildiği web tabanlı bir SaaS panelidir.

## 2. Temel Roller
- **SMMM:** Firma yönetimi, mali bildirim oluşturma, evrak yükleme, firma notları, toplu duyuru/mevzuat paylaşımı.
- **İşletme:** Bildirim onayı, “Ödeme Yap” yönlendirmesi (GİB/SGK), evrak yükleme, çalışan/kurye taleplerini onaylama.
- **Çalışan:** Masraf/avans/mesai talebi, bordro görüntüleme, özlük/İSG evrakları.
- **Kurye:** Gider girişi (fiş/fatura), gider geçmişi, durum takibi.

## 3. Seçili Firma Context (Kritik Kural)
SMMM panelinde tüm firma-bağlı işlemler **seçili firma** ile çalışır:
- Hızlı İşlemler, Mali Bildirim, Evrak, Eksik/Zorunlu Evrak, Firma Notları, Log.
Firma seçilmeden firma-bağlı aksiyon başlatılamaz.

## 4. Modüller
### 4.1 SMMM Paneli
- Dashboard (kontrol merkezi)
- Firmalarım (kart/liste + firma kartı)
- Mali Bildirimler (liste + detay + oluştur)
- Evrak Kütüphanesi (sürümleme)
- Duyurular / Toplu duyuru
- Pratik hesaplayıcılar
- Kişisel alan (kendi evraklarım/notlarım)

### 4.2 İşletme Paneli
- Dashboard (aksiyon odaklı)
- Onay kuyruğu
- Ödeme merkezi (GİB/SGK WebView yönlendirme)
- Evraklarım
- Çalışan/Kurye onay ekranları

### 4.3 Çalışan Paneli
- Çalışan ana sayfa
- Taleplerim (masraf/avans/mesai)
- Bordrom (maaş)
- Özlük/İSG evraklarım

### 4.4 Kurye Paneli
- Kurye ana sayfa
- Gider ekle (fiş/fatura fotoğraf)
- Gider geçmişi + durum

## 5. Ana İş Akışları
### 5.1 Mali Bildirim Akışı
1) SMMM “Yeni Mali Bildirim” oluşturur (KDV/Stopaj-Muhtasar/SGK/Geçici Vergi)
2) İşletmeye bildirim düşer
3) İşletme “Onayla” veya “Revize İste” yapar
4) İşletme “Ödeme Yap” derse GİB/SGK portalı uygulama içinde açılır (yönlendirme)
5) İşletme “Ödendi” işaretler (dekont opsiyonel)
6) Tüm adımlar Aktivite Logu’na kaydolur

### 5.2 Evrak Akışı (Kilitli Sürüm)
- Zorunlu evraklar kilitlidir: yeni sürüm yüklenince eski sürüm **pasif** olur, silinmez.

### 5.3 Çalışan/Kurye Talepleri
- Talep/gider oluşturulur → işletme onayı → sonuç bildirimi → log

## 6. Durum Rozetleri Standardı
Yeni, Gönderildi, Görüldü, Onaylandı, Revize İstendi, Reddedildi, Ödeme Yapılıyor, Ödendi, Gecikti, Eksik, Güncel, Süresi Yaklaşıyor

## 7. Güvenlik ve Kayıt
- Rol bazlı erişim
- Hassas alan maskeleme (TCKN/IBAN vb.)
- Audit log zorunluluğu
- Şifre kasası: maskeli ve yetkili erişim

## 8. Teslim ve Geliştirme Notu
Bu master doküman bir özet/çerçevedir. Detaylar için:
- **03_Sayfa_Spesifikasyonlari** (sayfa PRD’leri)
- **02_PRD_ve_Moduller** (modül PRD’leri)
- **04_Tasarim_Sistemi** (tasarım sistemi)
- **05_Teknik_API_DB** (API/DB/kurulum)

