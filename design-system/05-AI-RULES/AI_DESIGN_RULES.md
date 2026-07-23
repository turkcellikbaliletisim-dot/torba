# AI_DESIGN_RULES — Cursor, Codex, Claude, Gemini & OpenAI Ortak Tasarım Kuralları

> **Hedef:** Tüm yapay zeka kodlama ajanlarının (AI Coding Agents) Torba projesinde kod üretirken %100 orijinal marka kimliği ve görsel standartlara uymasını sağlamak.

---

## 1. Temel AI Kodlama Kuralları

1. **Ana Marka Rengi `#00B7EB` Turkuazdır:**
   - Ana CTA butonlarında, aktif navigasyon sekmesinde, seçili filtrelerde ve onay doğrulamalarında her zaman `#00B7EB` (`brand-500`) kullanın.
   - Büyük kaplama yüzeylerinde `#F1FBFE` (`brand-50`) veya `#DDF6FD` (`brand-100`) tercih edin.

2. **Rastgele Hex Kodu veya Ad-Hoc Marjin Yasaktır:**
   - Asla ad-hoc hex kodları (örn: `#23b491`, `#111`) veya rastgele marjinler (örn: `margin-top: 13px`) yazmayın.
   - Her zaman `design-system/04-TOKENS/` içindeki değişkenleri veya Tailwind `torba-*` sınıflarını kullanın.

3. **Uygulama Zemin Rengi `#F7FAFC` (Light Mode Priority):**
   - Torba bir finans uygulaması değildir; fırsat, keşif ve yerel ticaret uygulamasıdır. Varsayılan zemin rengi `#F7FAFC` (`neutral-50`), ana kart zemin rengi `#FFFFFF` (`white`) olmalıdır.

4. **Özel Anlamsal Renk Kullanımı:**
   - **Kampanya & Fırsat vurguları:** `#FF6B35` (Turuncu)
   - **Puan & Toin Değerleri:** `#F4B400` (Puan Sarısı)
   - **VIP / Premium Seviyeler:** `#7B61FF` (Mor)

5. **Dokunma Alanı (Touch Target):**
   - Tüm mobil tıklanabilir elemanlara minimum `min-h-[44px]` ve `min-w-[44px]` touch target tanımlayın.

6. **Mikro-Metin Dili:**
   - Dili kısa, sıcak ve doğrudan tutun: "Kuponu kullan", "250 puan kazan", "2 gün kaldı", "Yakınındaki fırsatlar".
