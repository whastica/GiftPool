import { useState } from 'react';

/**
 * Custom hook to copy text to clipboard
 * @returns {Object} { copied, copy }
 */
export const useCopyToClipboard = () => {
  const [copied, setCopied] = useState(false);

  const copy = async (text: string): Promise<boolean> => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported');
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);

      return true;
    } catch (error) {
      console.error('Failed to copy:', error);
      setCopied(false);
      return false;
    }
  };

  return { copied, copy };
};

export default useCopyToClipboard