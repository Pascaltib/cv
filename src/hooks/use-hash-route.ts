import { useCallback, useEffect, useState } from 'react';

// Tiny hash router: "#/globe" opens the globe overlay, anything else is the CV.
// Hash routing keeps GitHub Pages happy (no server rewrites) and gives the back button a job.

const readHash = () => (typeof window === 'undefined' ? '' : window.location.hash.replace(/^#/, ''));

export function useHashRoute() {
  const [route, setRoute] = useState(readHash);

  useEffect(() => {
    const onChange = () => setRoute(readHash());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = useCallback((to: string) => {
    window.location.hash = to;
  }, []);

  const back = useCallback(() => {
    // Came from the CV: step back so the scroll position survives. Deep link: just clear the hash.
    if (window.history.length > 1 && document.referrer !== '') {
      window.history.back();
    } else {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      setRoute('');
    }
  }, []);

  return { route, navigate, back };
}
