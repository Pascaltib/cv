import { useEffect, useState } from 'react';

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

// Small screens, touch devices and reduced-motion users get the "lite" site:
// no webcam background, fluid cursor, iPod or retro computer, and no draggable cards.
export const LITE_QUERY =
  '(max-width: 1023px), (hover: none) and (pointer: coarse), (prefers-reduced-motion: reduce)';

export function useLiteMode() {
  return useMediaQuery(LITE_QUERY);
}
