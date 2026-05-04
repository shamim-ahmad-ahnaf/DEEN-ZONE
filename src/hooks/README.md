// Custom React hooks for reusable logic.

### 📦 useLocalStorage
Syncs state with `localStorage` for persistence across refreshes.
```tsx
const [count, setCount] = useLocalStorage('my-key', 0);
```

### ⏰ useCurrentTime
Provides a live `Date` object that updates every second by default.
```tsx
const now = useCurrentTime();
const timeStr = now.toLocaleTimeString();
```

### 🔄 useToggle
A simple switch for binary states (modals, menus, etc).
```tsx
const [isOpen, toggle] = useToggle(false);
<button onClick={toggle}>Toggle Me</button>
```
export {};
