/**
 * Text-to-Speech functionality for accessibility
 * Uses Web Speech API
 */

class TTSManager {
  private speechSynthesis: SpeechSynthesis | null = null;
  private utterance: SpeechSynthesisUtterance | null = null;
  private isSupported: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.speechSynthesis = window.speechSynthesis;
      this.isSupported = true;
    }
  }

  isAvailable(): boolean {
    return this.isSupported && this.speechSynthesis !== null;
  }

  speak(text: string, rate: number = 1.0, volume: number = 1.0, lang: string = 'pl-PL'): void {
    if (!this.isAvailable() || !this.speechSynthesis) {
      return;
    }
    this.stop();
    this.utterance = new SpeechSynthesisUtterance(text);
    this.utterance.rate = Math.max(0.5, Math.min(2.0, rate));
    this.utterance.volume = Math.max(0.0, Math.min(1.0, volume));
    this.utterance.lang = lang;
    this.utterance.pitch = 1.0;
    this.speechSynthesis.speak(this.utterance);
  }

  stop(): void {
    if (this.speechSynthesis) {
      this.speechSynthesis.cancel();
    }
    this.utterance = null;
  }

  isSpeaking(): boolean {
    return this.isAvailable() && this.speechSynthesis?.speaking === true;
  }
}

let ttsManagerInstance: TTSManager | null = null;

export function getTTSManager(): TTSManager {
  if (!ttsManagerInstance) {
    ttsManagerInstance = new TTSManager();
  }
  return ttsManagerInstance;
}

export function speakText(text: string, rate: number = 1.0, volume: number = 1.0, lang: string = 'pl-PL'): void {
  const manager = getTTSManager();
  manager.speak(text, rate, volume, lang);
}

export function stopTTS(): void {
  const manager = getTTSManager();
  manager.stop();
}

export function isTTSAvailable(): boolean {
  const manager = getTTSManager();
  return manager.isAvailable();
}

export function getTextForTTS(element: HTMLElement): string {
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel && ariaLabel.trim()) {
    return ariaLabel.trim();
  }

  let directText = '';
  for (const node of Array.from(element.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE) {
      directText += node.textContent || '';
    }
  }
  directText = directText.trim();
  
  if (directText && directText.length > 0 && directText.length < 500) {
    return directText;
  }

  const textContent = element.textContent?.trim();
  if (textContent && textContent.length > 0) {
    if (textContent.length > 500) {
      return textContent.substring(0, 497) + '...';
    }
    return textContent;
  }

  if (element instanceof HTMLImageElement && element.alt) {
    return element.alt;
  }

  const title = element.getAttribute('title');
  if (title && title.trim()) {
    return title.trim();
  }

  if (element instanceof HTMLInputElement && element.placeholder) {
    return element.placeholder;
  }

  return '';
}
