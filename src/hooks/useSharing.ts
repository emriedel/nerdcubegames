'use client'

import { useState, useCallback } from 'react';
import { ShareUtils } from '@/games/shared/ShareUtils';
import { ShareableResult } from '@/games/shared/GameTypes';

export function useSharing() {
  const [isSharing, setIsSharing] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = useCallback(async (result: ShareableResult): Promise<boolean> => {
    try {
      setIsSharing(true);
      setShareError(null);
      setCopySuccess(false);

      const success = await ShareUtils.copyToClipboard(result.text);
      
      if (success) {
        setCopySuccess(true);
        // Reset success message after 3 seconds
        setTimeout(() => setCopySuccess(false), 3000);
      } else {
        setShareError('Failed to copy to clipboard');
      }
      
      return success;
    } catch (error) {
      setShareError(error instanceof Error ? error.message : 'Failed to copy');
      return false;
    } finally {
      setIsSharing(false);
    }
  }, []);

  const shareNative = useCallback(async (result: ShareableResult): Promise<boolean> => {
    try {
      setIsSharing(true);
      setShareError(null);

      if (typeof navigator === 'undefined' || !('share' in navigator)) {
        return await copyToClipboard(result);
      }

      const shareData: ShareData = {
        title: `${result.gameType} ${result.date}`,
        text: result.text,
        url: window.location.origin,
      };

      const success = await ShareUtils.shareNative(shareData);
      
      if (!success) {
        // Fallback to clipboard if native sharing is not available
        return await copyToClipboard(result);
      }
      
      return true;
    } catch (error) {
      setShareError(error instanceof Error ? error.message : 'Failed to share');
      return false;
    } finally {
      setIsSharing(false);
    }
  }, [copyToClipboard]);

  const share = useCallback(async (result: ShareableResult): Promise<boolean> => {
    // Try native sharing first, fallback to clipboard
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      return await shareNative(result);
    } else {
      return await copyToClipboard(result);
    }
  }, [shareNative, copyToClipboard]);

  const clearError = useCallback(() => {
    setShareError(null);
  }, []);

  return {
    isSharing,
    shareError,
    copySuccess,
    copyToClipboard,
    shareNative,
    share,
    clearError,
  };
}