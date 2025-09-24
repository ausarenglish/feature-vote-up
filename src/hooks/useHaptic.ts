import { useCallback } from 'react';

export function useHaptic() {
  const triggerHaptic = useCallback(() => {
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(10);
      }
    } catch (error) {
      // Silently ignore any vibration errors
    }
  }, []);

  return triggerHaptic;
}