import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook that logs out user after specified minutes of inactivity
 * @param {Function} onTimeout - Callback to execute when timeout occurs
 * @param {number} timeoutMinutes - Minutes of inactivity before timeout (default: 30)
 * @param {boolean} enabled - Whether the timeout is active (default: true)
 */
export const useInactivityTimeout = (onTimeout, timeoutMinutes = 30, enabled = true) => {
  const timeoutRef = useRef(null);
  const warningTimeoutRef = useRef(null);
  const TIMEOUT_MS = timeoutMinutes * 60 * 1000; // Convert minutes to milliseconds
  const WARNING_MS = 2 * 60 * 1000; // Warn 2 minutes before logout

  const clearTimeouts = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
      warningTimeoutRef.current = null;
    }
  }, []);

  const showWarning = useCallback(() => {
    const remainingTime = Math.floor(WARNING_MS / 60000);
    alert(`You will be logged out in ${remainingTime} minutes due to inactivity.`);
  }, [WARNING_MS]);

  const resetTimeout = useCallback(() => {
    if (!enabled) return;

    clearTimeouts();

    // Set warning timeout (2 minutes before logout)
    warningTimeoutRef.current = setTimeout(() => {
      showWarning();
    }, TIMEOUT_MS - WARNING_MS);

    // Set logout timeout
    timeoutRef.current = setTimeout(() => {
      console.log('User inactive for 30 minutes, logging out...');
      onTimeout();
    }, TIMEOUT_MS);
  }, [enabled, onTimeout, clearTimeouts, showWarning, TIMEOUT_MS, WARNING_MS]);

  useEffect(() => {
    if (!enabled) {
      clearTimeouts();
      return;
    }

    // Events to track user activity
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    // Reset timeout on any user activity
    events.forEach(event => {
      document.addEventListener(event, resetTimeout);
    });

    // Initialize timeout
    resetTimeout();

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetTimeout);
      });
      clearTimeouts();
    };
  }, [enabled, resetTimeout, clearTimeouts]);
};
