import { useState, useEffect } from 'react';

// Delays updating the value until the user has stopped typing for `delay` ms
// Useful for text filter inputs so we don't re-filter on every single keystroke
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
