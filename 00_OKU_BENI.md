# FLOW — Tam Proje Paketi (TR) v1
Tarih: 01.03.2026

Bu ZIP paketi; FLOW’un **ürün tanımı, sayfa gereksinimleri, rol/yetki yapısı, onay/durum geçişleri, evrak kütüphanesi sürümleme mantığı, tasarım sistemi, teknik/API/DB notları ve test–canlıya alma** dokümanlarını tek yerde toplar.

## Paketi nasıl kullanmalısınız?
### Yazılım ekibi için
1) **01_Master_Dokuman** içindeki ana dokümanı okuyun (kapsam + akış + kurallar).
2) **03_Sayfa_Spesifikasyonlari** içindeki sayfa bazlı PRD’lere göre ekranları tamamlayın.
3) **02_PRD_ve_Moduller** içindeki modül PRD’leriyle iş akışlarını doğrulayın.
4) **05_Teknik_API_DB** içindeki API/DB notlarına göre entegrasyonu hizalayın.
5) **06_Test_DevOps** ile test ve canlıya alma adımlarını uygulayın.

### Kimi / AI ile çalışacaksanız
- Her iş için küçük ve kontrollü prompt kullanın.
- “Mevcut çalışan sistemi bozma, önce yedekle” talimatını standart hale getirin.
- Önce **1 sayfa** üzerinde çalıştırıp onay alın, sonra devam edin.

## Kapsam (özet)
- Roller: SMMM, İşletme, Çalışan, Kurye
- Omurga: Mali bildirim → işletme onay → GİB/SGK yönlendirme → ödendi işaretleme + log
- Evrak: Zorunlu evrak (kilitli) + dönemsel mali evrak + çalışan/kurye ekleri
- Talepler: Çalışan (masraf/avans/mesai), Kurye (gider/fiş)
- Denetim: Aktivite logu + durum geçişleri

> Not: Paket içindeki tüm dokümanlar Türkçe karakter uyumludur.
