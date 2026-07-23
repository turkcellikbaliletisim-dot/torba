# JETPACK_COMPOSE_MAPPING — Android Jetpack Compose Eşleşmeleri

> **Platform:** Android API 24+

---

## 1. Tasarım Tokenları

```kotlin
// ui/theme/TorbaColors.kt
object TorbaColors {
    val Brand500 = Color(0xFF00B7EB)
    val Brand50 = Color(0xFFF1FBFE)
    val Bg = Color(0xFFF7FAFC)
    val Surface = Color(0xFFFFFFFF)
    val Border = Color(0xFFDCE6EB)
    val TextMain = Color(0xFF10212B)
    val TextSub = Color(0xFF647681)
    val Campaign = Color(0xFFFF6B35)
    val Points = Color(0xFFF4B400)
}
```

---

## 2. Bileşen Eşleşmeleri

| Design System | Compose |
|---|---|
| `BUTTONS / Primary` | `Button(colors = ButtonDefaults.buttonColors(containerColor = Brand500))` |
| `CARDS / Campaign` | `Card(shape = RoundedCornerShape(20.dp))` |
| `BOTTOM_NAVIGATION` | `NavigationBar` (5 sekmeli) |
| `MODALS / Bottom Sheet` | `ModalBottomSheet` |
