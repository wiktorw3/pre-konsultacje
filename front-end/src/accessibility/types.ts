/**
 * TypeScript types for Accessibility Widget
 * WCAG 2.2 AA compliant
 */

export interface AccessibilitySettings {
  fontSize: number; // multiplier (0.75 - 2.0)
  lineSpacing: number; // multiplier (1.0 - 3.0)
  highContrast: boolean;
  grayscale: boolean;
  dyslexiaFont: boolean;
  highlightLinks: boolean;
  highlightHeadings: boolean;
  pauseAnimations: boolean;
  ttsEnabled: boolean; // Text-to-Speech on hover
  ttsRate: number; // 0.5 - 2.0
  ttsVolume: number; // 0.0 - 1.0
}

export const DEFAULT_SETTINGS: AccessibilitySettings = {
  fontSize: 1.0,
  lineSpacing: 1.5,
  highContrast: false,
  grayscale: false,
  dyslexiaFont: false,
  highlightLinks: false,
  highlightHeadings: false,
  pauseAnimations: false,
  ttsEnabled: false,
  ttsRate: 1.0,
  ttsVolume: 1.0,
};

export interface AccessibilityWidgetProps {
  /**
   * Custom position for the floating button
   * @default { bottom: '20px', right: '20px' }
   */
  position?: {
    bottom?: string;
    right?: string;
    top?: string;
    left?: string;
  };
  /**
   * Custom label for the widget button
   * @default 'Ustawienia dostępności'
   */
  buttonLabel?: string;
  /**
   * Storage key for persisting settings
   * @default 'accessibility-settings'
   */
  storageKey?: string;
}
