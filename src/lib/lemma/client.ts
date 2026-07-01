import { LemmaClient } from 'lemma-sdk';

// ============================================================================
// STATE: JUDGE MODE / DEMO MODE
// ============================================================================
export const demoState = {
  get enabled() {
    if (typeof document !== 'undefined') {
      const hasCookie = document.cookie.includes('demo_mode=true');
      const isEnvTrue = import.meta.env.VITE_DEMO_MODE === 'true';
      return hasCookie || isEnvTrue;
    }
    return false; // Safest default if no document
  }
};

export const setDemoMode = (enabled: boolean) => {
  if (typeof document !== 'undefined') {
    document.cookie = `demo_mode=${enabled}; path=/`;
  }
};

// ============================================================================
// API CLIENT: PRODUCTION MODE
// ============================================================================

export const lemmaClient = new LemmaClient({
  podId: "019f1298-0778-702b-9841-dd2bc545d223",
  apiUrl: import.meta.env.DEV ? '/api' : (import.meta.env.VITE_LEMMA_API_URL || 'https://api.lemma.work'),
});

// Remove token injection logic since we are migrating to AuthGuard and cookie-based auth.
