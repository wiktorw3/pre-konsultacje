/**
 * Custom hook for managing accessibility settings
 * Uses localStorage for persistence (no cookies)
 */

import { useState, useEffect, useCallback } from 'react';
import {
  AccessibilitySettings,
  DEFAULT_SETTINGS,
} from './types';

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

    // Font size
    root.style.setProperty('--accessibility-font-size', `${settings.fontSize}`);
    body.style.fontSize = settings.fontSize === 1.0 ? '' : `${settings.fontSize * 100}%`;

    // Line spacing
    root.style.setProperty('--accessibility-line-height', `${settings.lineSpacing}`);
    body.style.lineHeight = settings.lineSpacing === 1.5 ? '' : `${settings.lineSpacing}`;

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
