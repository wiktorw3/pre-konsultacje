# Accessibility Widget

Lekki widget dostępności dla aplikacji React + TypeScript, zgodny z WCAG 2.2 AA i wymaganiami sektora publicznego w Polsce (gov.pl, WCAG, RODO).

## 📋 Spis treści

- [Cechy](#cechy)
- [Wymagania](#wymagania)
- [Instalacja](#instalacja)
- [Użycie](#użycie)
- [Zgodność WCAG](#zgodność-wcag)
- [Zgodność z sektorem publicznym](#zgodność-z-sektorem-publicznym)
- [API](#api)
- [Przykłady](#przykłady)

## ✨ Cechy

### Funkcjonalności dostępności:

- **Rozmiar czcionki** - zwiększanie/zmniejszanie od 75% do 200%
- **Odstępy między wierszami** - regulacja od 1.0x do 3.0x
- **Wysoki kontrast** - zwiększenie kontrastu między tekstem a tłem
- **Skala szarości** - usunięcie kolorów (desaturacja 100%)
- **Czcionka dla dysleksji** - użycie OpenDyslexic/Comic Sans
- **Podświetlenie linków** - wyraźne oznaczenie wszystkich linków
- **Podświetlenie nagłówków** - wyraźne oznaczenie nagłówków
- **Zatrzymanie animacji** - pauza wszystkich animacji i przejść
- **Reset ustawień** - przywrócenie domyślnych wartości

### Cechy techniczne:

- ✅ React 18+ z TypeScript
- ✅ Pełna zgodność WCAG 2.2 AA
- ✅ Pełna obsługa klawiatury
- ✅ Przyjazny dla czytników ekranu (ARIA)
- ✅ Responsywny design
- ✅ Ustawienia zapisywane w localStorage (bez cookies)
- ✅ Brak śledzenia, analityki, fingerprintingu
- ✅ Bezpieczny dla stron rządowych
- ✅ Open-source friendly

## 📦 Wymagania

- React 18.0.0 lub nowszy
- TypeScript 4.5 lub nowszy
- Node.js 16+ (dla development)

## 🚀 Instalacja

Widget jest gotowy do użycia - skopiuj folder `accessibility` do swojego projektu.

### Struktura plików:

```
src/accessibility/
├── AccessibilityWidget.tsx       # Główny komponent
├── accessibility-widget.css      # Style CSS
├── types.ts                      # Definicje TypeScript
├── useAccessibilitySettings.ts   # Hook dla ustawień
└── README.md                     # Dokumentacja
```

## 💻 Użycie

### Podstawowa integracja:

```tsx
import { AccessibilityWidget } from './accessibility/AccessibilityWidget';

function App() {
  return (
    <div>
      {/* Twoja aplikacja */}
      <AccessibilityWidget />
    </div>
  );
}
```

### Zaawansowana integracja z opcjami:

```tsx
import { AccessibilityWidget } from './accessibility/AccessibilityWidget';

function App() {
  return (
    <div>
      {/* Twoja aplikacja */}
      <AccessibilityWidget
        position={{ bottom: '30px', right: '30px' }}
        buttonLabel="Dostępność"
        storageKey="my-app-accessibility"
      />
    </div>
  );
}
```

### Przykład z React Router:

```tsx
import { AccessibilityWidget } from './accessibility/AccessibilityWidget';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
      {/* Widget dostępny na wszystkich stronach */}
      <AccessibilityWidget />
    </BrowserRouter>
  );
}
```

## 🎯 Zgodność WCAG 2.2 AA

Widget spełnia wszystkie wymagania WCAG 2.2 AA:

### Poziom A:
- ✅ 1.1.1 Treść nietekstowa - wszystkie ikony mają tekst alternatywny
- ✅ 2.1.1 Klawiatura - pełna funkcjonalność bez myszy
- ✅ 2.1.2 Brak pułapki na klawiaturę - focus trap z możliwością wyjścia (ESC)
- ✅ 3.2.1 Przy fokusie - zmiany nie powodują nieoczekiwanych zmian kontekstu
- ✅ 4.1.2 Nazwa, rola, wartość - wszystkie elementy mają właściwe ARIA

### Poziom AA:
- ✅ 1.4.3 Kontrast - minimalny kontrast 4.5:1 dla tekstu
- ✅ 1.4.5 Obrazy tekstu - używamy SVG i ikon tekstowych
- ✅ 2.4.3 Kolejność fokusa - logiczna kolejność nawigacji
- ✅ 2.4.7 Widoczny fokus - wyraźne wskaźniki fokusa (outline)
- ✅ 3.2.3 Spójna nawigacja - widget w tym samym miejscu
- ✅ 3.2.4 Spójna identyfikacja - przycisk zawsze ten sam
- ✅ 4.1.3 Komunikaty statusu - użycie aria-live dla zmian wartości

### Dodatkowo (WCAG 2.2):
- ✅ 2.4.11 Focus Not Obscured - fokus nie jest zakrywany
- ✅ 3.2.6 Consistent Help - dostępność widget w stałym miejscu
- ✅ 3.3.8 Accessible Authentication - brak wymagań autentykacji

### Preferencje użytkownika:
- ✅ `prefers-reduced-motion` - wyłącza animacje gdy użytkownik preferuje
- ✅ `prefers-contrast` - zwiększa kontrast w trybie wysokiego kontrastu

## 🏛️ Zgodność z sektorem publicznym

### RODO (GDPR):
- ✅ **Brak cookies** - używa tylko localStorage (nie jest cookie)
- ✅ **Brak danych osobowych** - ustawienia dostępności nie są danymi osobowymi
- ✅ **Brak śledzenia** - zero analityki, fingerprintingu, zewnętrznych połączeń
- ✅ **Lokalne przetwarzanie** - wszystko dzieje się w przeglądarce użytkownika

### Wymagania gov.pl:
- ✅ **Dostępność WCAG 2.2 AA** - pełna zgodność
- ✅ **Bezpieczeństwo** - brak zewnętrznych zależności, zero trackingu
- ✅ **Język polski** - wszystkie etykiety po polsku
- ✅ **Deklaracja dostępności** - link do deklaracji w panelu (placeholder)

### Prawne bezpieczeństwo:
- ✅ **Open-source friendly** - kod dostępny, audytowalny
- ✅ **Bez zależności zewnętrznych** - zero CDN, zero trackingu
- ✅ **Bezpieczny dla danych wrażliwych** - działa offline

## 📚 API

### `<AccessibilityWidget />` Props

| Prop | Typ | Domyślna wartość | Opis |
|------|-----|------------------|------|
| `position` | `{ bottom?, right?, top?, left? }` | `{ bottom: '20px', right: '20px' }` | Pozycja przycisku floating |
| `buttonLabel` | `string` | `'Ustawienia dostępności'` | Etykieta przycisku |
| `storageKey` | `string` | `'accessibility-settings'` | Klucz localStorage dla ustawień |

### Typy TypeScript:

```typescript
interface AccessibilitySettings {
  fontSize: number;          // 0.75 - 2.0 (multiplier)
  lineSpacing: number;       // 1.0 - 3.0 (multiplier)
  highContrast: boolean;     // true/false
  grayscale: boolean;        // true/false
  dyslexiaFont: boolean;     // true/false
  highlightLinks: boolean;   // true/false
  highlightHeadings: boolean;// true/false
  pauseAnimations: boolean;  // true/false
}
```

### Hooks:

#### `useAccessibilitySettings(storageKey?)`

Hook zarządzający ustawieniami dostępności.

```typescript
const {
  settings,        // Aktualne ustawienia
  updateSetting,   // Funkcja aktualizacji pojedynczego ustawienia
  resetSettings,   // Funkcja resetu do domyślnych
  isOpen,          // Czy panel jest otwarty
  setIsOpen        // Funkcja otwierania/zamykania panelu
} = useAccessibilitySettings();
```

## 🎨 Przykłady

### Custom styling:

Możesz nadpisać style używając CSS:

```css
/* Nadpisz kolor przycisku */
.accessibility-widget-button {
  background-color: #your-color !important;
}

/* Dostosuj pozycję panelu */
.accessibility-panel {
  right: 10px !important;
  bottom: 90px !important;
}
```

### Programatyczne zarządzanie ustawieniami:

```typescript
import { useAccessibilitySettings } from './accessibility/useAccessibilitySettings';

function MyComponent() {
  const { settings, updateSetting } = useAccessibilitySettings();

  // Zwiększ rozmiar czcionki programatycznie
  const increaseFont = () => {
    updateSetting('fontSize', Math.min(2.0, settings.fontSize + 0.25));
  };

  return (
    <button onClick={increaseFont}>
      Zwiększ czcionkę: {settings.fontSize * 100}%
    </button>
  );
}
```

## 🧪 Testowanie

### Testowanie dostępności:

1. **Czytnik ekranu**: Przetestuj z NVDA (Windows) lub VoiceOver (macOS)
2. **Nawigacja klawiaturą**: Sprawdź, czy wszystkie funkcje są dostępne przez Tab/Enter/Space
3. **Kontrast**: Użyj narzędzi jak WAVE lub axe DevTools
4. **Keyboard trap**: Upewnij się, że możesz wyjść z panelu przez ESC

### Testowanie zgodności:

```bash
# Użyj axe DevTools w przeglądarce
# lub Lighthouse Accessibility audit
npm install -g @axe-core/cli
axe http://localhost:5173
```

## 🔧 Rozwiązywanie problemów

### Widget nie wyświetla się:

- Sprawdź, czy CSS jest zaimportowany: `import './accessibility/accessibility-widget.css'`
- Sprawdź z-index - upewnij się, że inne elementy nie zakrywają widgetu (z-index: 9999)

### Ustawienia nie są zapisywane:

- Sprawdź, czy localStorage jest dostępny (nie działa w trybie incognito w niektórych przeglądarkach)
- Sprawdź konsolę przeglądarki pod kątem błędów

### Style nie są aplikowane:

- Sprawdź, czy klasy są dodawane do `<body>`: `accessibility-high-contrast`, etc.
- Sprawdź specyficzność CSS - może być potrzeba użycia `!important`

## 📝 Licencja

Widget jest dostępny jako open-source i może być używany w projektach rządowych i komercyjnych.

## 🤝 Wsparcie

W razie pytań lub problemów, sprawdź:
- Dokumentację WCAG 2.2: https://www.w3.org/WAI/WCAG22/quickref/
- Wymagania dostępności gov.pl: https://www.gov.pl/web/dostepnosc-cyfrowa

---

**Wersja**: 1.0.0  
**Data**: 2024  
**Zgodność**: WCAG 2.2 AA, RODO, gov.pl requirements
