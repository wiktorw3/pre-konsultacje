/**
 * Custom hook for managing accessibility settings
 * Uses localStorage for persistence (no cookies)
 */

import { useState, useEffect, useCallback } from 'react';
import {
  AccessibilitySettings,
  DEFAULT_SETTINGS,
} from './types';
import { speakText, stopTTS, getTextForTTS } from './tts';
import { speakText, stopTTS, getTextForTTS } from './tts';

const STORAGE_KEY = 'accessibility-settings';

/**
 * Hook to manage accessibility settings with localStorage persistence
 */
export function useAccessibilitySettings(
  customStorageKey?: string
): {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => void;
  resetSettings: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
} {
  const storageKey = customStorageKey || STORAGE_KEY;
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_SETTINGS);
  const [isOpen, setIsOpen] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<AccessibilitySettings>;
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      }
    } catch (error) {
      console.warn('Failed to load accessibility settings:', error);
    }
  }, [storageKey]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(settings));
    } catch (error) {
      console.warn('Failed to save accessibility settings:', error);
    }
  }, [settings, storageKey]);

  // Apply settings to document
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // Font size - apply to html element using percentage (scales rem/em units only)
    root.style.setProperty('--accessibility-font-size', `${settings.fontSize}`);
    if (settings.fontSize !== 1.0) {
      // Set base font size on html - rem/em units will scale automatically
      // This only affects text size, not layout elements
      root.style.fontSize = `${settings.fontSize * 100}%`;
    } else {
      root.style.fontSize = '';
    }

    // Line spacing - apply globally using style tag (exclude accessibility widget)
    root.style.setProperty('--accessibility-line-height', `${settings.lineSpacing}`);
    let lineHeightStyle = document.getElementById('accessibility-line-height-style');
    if (!lineHeightStyle) {
      lineHeightStyle = document.createElement('style');
      lineHeightStyle.id = 'accessibility-line-height-style';
      document.head.appendChild(lineHeightStyle);
    }
    if (settings.lineSpacing !== 1.5) {
      lineHeightStyle.textContent = `
        body *:not(.accessibility-widget-button):not(.accessibility-panel):not(.accessibility-panel *) {
          line-height: ${settings.lineSpacing} !important;
        }
      `;
    } else {
      lineHeightStyle.textContent = '';
      if (lineHeightStyle.parentNode) {
        lineHeightStyle.remove();
      }
    }

    // High contrast
    if (settings.highContrast) {
      body.classList.add('accessibility-high-contrast');
    } else {
      body.classList.remove('accessibility-high-contrast');
    }

    // Grayscale
    if (settings.grayscale) {
      body.classList.add('accessibility-grayscale');
    } else {
      body.classList.remove('accessibility-grayscale');
    }

    // Dyslexia font
    if (settings.dyslexiaFont) {
      body.classList.add('accessibility-dyslexia-font');
    } else {
      body.classList.remove('accessibility-dyslexia-font');
    }

    // Highlight links
    if (settings.highlightLinks) {
      body.classList.add('accessibility-highlight-links');
    } else {
      body.classList.remove('accessibility-highlight-links');
    }

    // Highlight headings
    if (settings.highlightHeadings) {
      body.classList.add('accessibility-highlight-headings');
    } else {
      body.classList.remove('accessibility-highlight-headings');
    }

    // Pause animations
    if (settings.pauseAnimations) {
      body.classList.add('accessibility-pause-animations');
    } else {
      body.classList.remove('accessibility-pause-animations');
    }

    // TTS on hover - use event delegation for efficiency
    let hoverTimeout: number | null = null;
    let lastElement: HTMLElement | null = null;
    let isLeavingPage = false;

    const handleMouseOver = (e: MouseEvent) => {
      if (!settings.ttsEnabled || isLeavingPage) return;
      
      const target = e.target as HTMLElement;
      if (!target || target === lastElement) return;

      // Skip if hovering over accessibility widget or specific interactive elements
      if (
        target.closest('.accessibility-widget-button, .accessibility-panel') ||
        (target.tagName === 'INPUT' && 
        (target.getAttribute('type') !== 'text' && target.getAttribute('type') !== 'search')) ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      ) {
        lastElement = null;
        return;
      }
      
      // Allow reading button text
      if (target.tagName === 'BUTTON' || target.getAttribute('role') === 'button') {
        const buttonText = getTextForTTS(target);
        if (!buttonText || buttonText.length === 0) {
          lastElement = null;
          return;
        }
      }

      lastElement = target;
      
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
      stopTTS();

      hoverTimeout = setTimeout(() => {
        if (isLeavingPage || !settings.ttsEnabled) return;
        
        const text = getTextForTTS(target);
        if (text && text.length > 0 && text.length < 500) {
          speakText(text, settings.ttsRate, settings.ttsVolume, 'pl-PL');
        }
      }, 600); // 600ms delay
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const relatedTarget = e.relatedTarget as HTMLElement;
      
      if (!target || !relatedTarget || !target.contains(relatedTarget)) {
        lastElement = null;
        if (hoverTimeout) {
          clearTimeout(hoverTimeout);
          hoverTimeout = null;
        }
        stopTTS();
      }
    };

    if (settings.ttsEnabled) {
      document.addEventListener('mouseover', handleMouseOver, true);
      document.addEventListener('mouseout', handleMouseOut, true);

      const handleBeforeUnload = () => {
        isLeavingPage = true;
        stopTTS();
      };
      window.addEventListener('beforeunload', handleBeforeUnload);

      // MutationObserver to handle dynamically added content
      const observer = new MutationObserver(() => {
        // Re-evaluate elements for TTS if needed
      });
      observer.observe(document.body, { childList: true, subtree: true });

      return () => {
        isLeavingPage = true;
        document.removeEventListener('mouseover', handleMouseOver, true);
        document.removeEventListener('mouseout', handleMouseOut, true);
        window.removeEventListener('beforeunload', handleBeforeUnload);
        observer.disconnect();
        if (hoverTimeout) {
          clearTimeout(hoverTimeout);
        }
        stopTTS();
        lastElement = null;
      };
    } else {
      stopTTS();
    }
  }, [settings]);

  const updateSetting = useCallback(
    <K extends keyof AccessibilitySettings>(
      key: K,
      value: AccessibilitySettings[K]
    ) => {
      setSettings((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return {
    settings,
    updateSetting,
    resetSettings,
    isOpen,
    setIsOpen,
  };
}
