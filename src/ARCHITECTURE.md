# Deen Zone - Architectural Overview

Welcome to the **Deen Zone** architecture guide. As a senior architect, I've designed this structure to be **feature-focused**, **modular**, and **highly scalable**.

## 📂 Folder Structure

### `src/components`
This is where our building blocks live.
- **`common/`**: Low-level, generic components (Atoms) like `Button`, `Card`, `Input`, `Modal`. These do not depend on any specific feature.
- **`layout/`**: Structural components that wrap our application like `Navbar`, `Sidebar`, `BottomNav`, and the main `Layout` wrapper.
- **`features/`** (Optional/Future): If a page grows too complex, we extract its sub-components into `src/components/features/{feature-name}`.

### `src/pages`
Route-level components. Each file represents a single view (e.g., `Prayer.tsx`, `Quran.tsx`). Pages should primarily compose components and manage high-level state.

### `src/data`
The source of truth for static content. We keep data separate from UI to make updating content (like Hadith or Dua lists) as simple as editing a JSON-like TypeScript file.

### `src/hooks`
Reusable React logic. If you find yourself copying `useEffect` or `useState` logic across components, it belongs here. (e.g., `useAudioPlayer.ts`, `usePrayerTimes.ts`).

### `src/utils`
Pure utility functions. These should be framework-agnostic helper functions for formatting dates, manipulating strings, or performing calculations.

### `src/assets`
Static media assets.
- **`images/`**: Photos, banners, and backgrounds.
- **`icons/`**: Custom SVG icons (though we prefer `lucide-react`).

## 🚀 Why This Structure?

1. **Separation of Concerns**: UI (components) is separated from Business Logic (hooks) and Data (data).
2. **Predictability**: New developers know exactly where to put a new file.
3. **Refactor-Friendly**: Smaller components are easier to test and modify without breaking the entire page.
4. **Clean Imports**: Prevents deep, messy relative imports (e.g., `../../../../`).

---

*“Knowledge is light (Al-Ilmu Nurun). Keep your code clean, and your mind will be clear.”*
