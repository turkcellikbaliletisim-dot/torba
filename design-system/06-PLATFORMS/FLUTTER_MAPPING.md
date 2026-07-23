# FLUTTER_MAPPING — Flutter Widget Eşleşmeleri

> **Framework:** Flutter / Dart  
> **Ana Marka Rengi:** `#00B7EB`

---

## 1. Tasarım Tokenları → Flutter ThemeData

```dart
// lib/theme/torba_theme.dart

final torbaLightTheme = ThemeData(
  brightness: Brightness.light,
  fontFamily: 'Inter',
  scaffoldBackgroundColor: const Color(0xFFF7FAFC),  // neutral-50
  cardColor: const Color(0xFFFFFFFF),                 // white
  primaryColor: const Color(0xFF00B7EB),              // brand-500
  colorScheme: const ColorScheme.light(
    primary: Color(0xFF00B7EB),
    secondary: Color(0xFFFF6B35),                    // campaign turuncusu
    surface: Color(0xFFFFFFFF),
    error: Color(0xFFE34D59),
  ),
);
```

---

## 2. Bileşen → Widget Eşleşmeleri

| Design System | Flutter Widget |
|---|---|
| `BUTTONS / Primary` | `ElevatedButton` (`Color(0xFF00B7EB)`) |
| `BUTTONS / Secondary` | `ElevatedButton` (`Color(0xFFF1FBFE)`) |
| `BUTTONS / Outline` | `OutlinedButton` |
| `INPUTS / Text` | `TextField` + `InputDecoration` |
| `CARDS / Campaign` | `Card(elevation: 2, shape: RoundedRectangleBorder(borderRadius: 20))` |
| `BOTTOM_NAVIGATION` | `BottomNavigationBar` (5 sekmeli) |
| `MODALS / Bottom Sheet` | `showModalBottomSheet` (shape 24px top radius) |
| `TOAST` | `ScaffoldMessenger.showSnackBar` |
