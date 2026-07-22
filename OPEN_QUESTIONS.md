# OPEN_QUESTIONS.md — TORBAA Açık Kararlar ve Teknik/Hukuki Sorular Dokümanı

Bu doküman, TORBAA platformunun geliştirilmesi ve canlıya alınması sürecinde netleştirilmesi gereken hukuki, mali, finansal ve teknik açık kararları derler.

---

## 1. HUKUKİ VE MALİ MEVZUAT (REGULATORY & LEGAL)

> [!IMPORTANT]
> **Açık Soru 1.1: BDDK / ÖDED Lisanslama Kapsamı**
> - **Soru**: TORBAA "Yemek Kartı İhraççısı" olarak bağımsız hizmet verirken ÖDED (Ödeme ve Elektronik Para Derneği) kapsamında ödeme kuruluşu lisansına mı tabidir, yoksa kapalı devre kurumsal yemek kartı muafiyeti kapsamında mı yürütülecektir?
> - **Etki**: Veri saklama (KVKK) ve TCMB ödeme lisans süreçleri.

> [!IMPORTANT]
> **Açık Soru 1.2: GVK 23/8 Vergi Muafiyeti E-Fatura Entegrasyonu**
> - **Soru**: Kurumsal şirkete kesilen aylık yemek kartı hizmet faturasında e-fatura senaryosu olarak 'Vergi İstisnalı Kurumsal Yan Hak' kodu nasıl entegre edilecek?

---

## 2. POS VE İŞLETME ENTEGRASYONLARI (HARDWARE & INTEGRATION)

> [!NOTE]
> **Açık Soru 2.1: Physical POS Terminal SDK vs. Web QR POS**
> - **Soru**: Üye restoranlarda sadece web paneli tabanlı Kasiyer POS ekranı (`/panel/dashboard` Quick POS) mı kullanılacak, yoksa Ingenico / Verifone / Profilo Android POS cihazlarına özel SDK uygulaması mı geliştirilecek?
> - **Öneri**: Faz 1'de Web QR POS, Faz 2'de Android POS APK/SDK dağıtımı.

---

## 3. BANKA TAKAS VE HAKEDİŞ HESAPLARI (SETTLEMENT & ESCROW)

> [!WARNING]
> **Açık Soru 3.1: Hakediş Takas Hesabı (Escrow) ve Mahsuplaşma**
> - **Soru**: İşletmenin TORBAA'dan olan 7 günlük yemek kartı hakediş alacağı, işletmenin B2B Toptan Tedarik Mağazasından verdiği sarf malzeme siparişleri ile anında otomatik mahsuplaştırılsın mı?

---

## 4. GÜVENLİK VE P2P BAKİYE TRANSFERİ (SECURITY)

> [!CAUTION]
> **Açık Soru 4.1: P2P Toin Transfer ve Güvenlik Sınırı**
> - **Soru**: Mobil uygulamadan arkadaşının telefon numarasına Toin gönderirken günlük maksimum limit ne olmalı ve SMS OTP doğrulaması istenmeli mi?
> - **Öneri**: Günlük maksimum 500 Toin sınırı ve 4 haneli PIN/OTP onayı.

---

## 5. ÇİFT BAKİYE YETERSİZLİK SENARYOSU (PARTIAL PAYMENT)

> [!NOTE]
> **Açık Soru 5.1: Yemek Kartı Bakiyesi Yetersiz Kaldığında Otomatik Tamamlama**
> - **Soru**: İşletmede 500 TL yemek tutarı ödenirken kullanıcının TORBAA Yemek Kartı bakiyesinde 400 TL varsa, kalan 100 TL otomatik olarak Toin bakiyesinden veya kayıtlı kredi kartından tamamlansın mı?
