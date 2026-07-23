# SWIFTUI_MAPPING — SwiftUI View Eşleşmeleri

> **Platform:** iOS 16+

---

## 1. Tasarım Tokenları

```swift
// Theme/TorbaColors.swift
extension Color {
    static let torbaBrand = Color(hex: "#00B7EB")
    static let torbaBrandLight = Color(hex: "#F1FBFE")
    static let torbaBg = Color(hex: "#F7FAFC")
    static let torbaSurface = Color(hex: "#FFFFFF")
    static let torbaBorder = Color(hex: "#DCE6EB")
    static let torbaTextMain = Color(hex: "#10212B")
    static let torbaTextSub = Color(hex: "#647681")
    static let torbaCampaign = Color(hex: "#FF6B35")
    static let torbaPoints = Color(hex: "#F4B400")
}
```

---

## 2. Bileşen Eşleşmeleri

| Design System | SwiftUI |
|---|---|
| `BUTTONS / Primary` | `Button` + `.tint(Color.torbaBrand)` |
| `CARDS / Campaign` | `VStack` in `RoundedRectangle(cornerRadius: 20)` |
| `BOTTOM_NAVIGATION` | `TabView` (5 sekmeli) |
| `MODALS / Bottom Sheet` | `.sheet` + `presentationDetents` |
