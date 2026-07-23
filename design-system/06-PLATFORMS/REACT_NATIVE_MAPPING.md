# REACT_NATIVE_MAPPING — React Native Bileşen Eşleşmeleri

> **Framework:** React Native / Expo

---

## 1. Tasarım Tokenları

```typescript
// src/theme/tokens.ts
export const colors = {
  brand50: '#F1FBFE',
  brand100: '#DDF6FD',
  brand500: '#00B7EB',
  brand600: '#009BC8',
  brand700: '#007DA3',
  bg: '#F7FAFC',
  surface: '#FFFFFF',
  border: '#DCE6EB',
  textMain: '#10212B',
  textSub: '#647681',
  campaign: '#FF6B35',
  points: '#F4B400',
  success: '#16A56A',
  error: '#E34D59',
} as const;

export const spacing = { s1: 4, s2: 8, s3: 12, s4: 16, s5: 20, s6: 24, s8: 32 } as const;
export const radius = { sm: 8, md: 12, lg: 16, xl: 20, 2xl: 24, full: 9999 } as const;
```

---

## 2. Bileşen Eşleşmeleri

| Design System | React Native |
|---|---|
| `BUTTONS / Primary` | `Pressable` (backgroundColor: `#00B7EB`) |
| `CARDS / Campaign` | `View` (borderRadius: 20, shadowColor: `#10212B`) |
| `BOTTOM_NAVIGATION` | `@react-navigation/bottom-tabs` (5 sekmeli) |
| `MODALS / Bottom Sheet` | `@gorhom/bottom-sheet` (borderRadius: 24) |
