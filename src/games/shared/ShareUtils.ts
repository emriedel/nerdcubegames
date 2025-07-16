import { ShareableResult } from './GameTypes';

export class ShareUtils {
  static generateShareText(result: ShareableResult): string {
    const { gameType, date, score, maxScore, emojiGrid } = result;
    
    let text = `${gameType} ${date}\n`;
    text += `Score: ${score}/${maxScore}\n`;
    
    if (emojiGrid) {
      text += `\n${emojiGrid}\n`;
    }
    
    text += `\n🎮 Play at nerdcube.games`;
    
    return text;
  }

  static async copyToClipboard(text: string): Promise<boolean> {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        return successful;
      }
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }

  static async shareNative(shareData: ShareData): Promise<boolean> {
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to share natively:', error);
      return false;
    }
  }

  static generateScoreEmoji(score: number, maxScore: number): string {
    const percentage = (score / maxScore) * 100;
    
    if (percentage >= 90) return '🏆';
    if (percentage >= 80) return '🥇';
    if (percentage >= 70) return '🥈';
    if (percentage >= 60) return '🥉';
    if (percentage >= 50) return '👍';
    if (percentage >= 30) return '🎯';
    return '💪';
  }

  static formatDuration(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${remainingSeconds}s`;
  }

  static generateEmojiProgress(current: number, total: number, length: number = 10): string {
    const filled = Math.round((current / total) * length);
    const empty = length - filled;
    return '🟩'.repeat(filled) + '⬜'.repeat(empty);
  }
}