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
