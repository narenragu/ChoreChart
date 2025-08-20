import { useEffect } from 'react';
//need some kinda timeout for errors
export function useErrorTimeout(error, setError, timeout = 5000) {
  useEffect(() => {
    if (!error || !error.msg) return;
    const timer = setTimeout(() => {
      setError((prev) => ({
        ...prev,
        msg: "",
        timestamp: Date.now(),
      }));
    }, timeout);
    return () => clearTimeout(timer);
  }, [error.timestamp, setError, timeout]);
}
