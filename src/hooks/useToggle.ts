import { useState, useCallback } from 'react';

/**
 * A simple hook for toggling a boolean state.
 * Returns the state and a function to toggle it.
 */
export function useToggle(initialState: boolean = false): [boolean, () => void] {
  const [state, setState] = useState<boolean>(initialState);

  const toggle = useCallback(() => {
    setState((prev) => !prev);
  }, []);

  return [state, toggle];
}
