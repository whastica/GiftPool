import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for handling async operations
 * @param asyncFunction - Async function to execute
 * @param immediate - Execute immediately on mount (default: true)
 * @returns {Object} { execute, status, data, error, loading }
 *
 * @example
 * const { execute, loading, data, error } = useAsync(fetchUser, false)
 *
 * const handleClick = () => {
 *   execute(userId)
 * }
 */
export const useAsync = <T, P extends unknown[]>(
  asyncFunction: (...params: P) => Promise<T>,
  immediate = true
) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<unknown>(null);

  // Memoize execute function
  const execute = useCallback(
    async (...params: P): Promise<T> => {
      setStatus('loading');
      setData(null);
      setError(null);

      try {
        const response = await asyncFunction(...params);
        setData(response);
        setStatus('success');
        return response;
      } catch (error) {
        setError(error);
        setStatus('error');
        throw error;
      }
    },
    [asyncFunction]
  );

  // Execute immediately on mount if immediate is true
  useEffect(() => {
    if (immediate) {
      (async () => {
        try {
          await execute(...([] as unknown[] as P));
        } catch {
          // Handle error silently
        }
      })();
    }
  }, [immediate, execute]);

  return {
    execute,
    status,
    data,
    error,
    loading: status === 'loading',
    idle: status === 'idle',
    success: status === 'success',
  };
};

export default useAsync;