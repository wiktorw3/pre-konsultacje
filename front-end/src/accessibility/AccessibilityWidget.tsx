/**
 * Accessibility Widget Component
 * WCAG 2.2 AA compliant React widget for public-sector websites
 * 
 * Features:
 * - Font size adjustment
 * - Line spacing adjustment
 * - High contrast mode
 * - Grayscale/desaturation
 * - Dyslexia-friendly font
 * - Link and heading highlighting
 * - Animation pause
 * - Settings persistence (localStorage)
 */

import React, { useRef, useEffect } from 'react';
import { AccessibilityWidgetProps } from './types';
import { useAccessibilitySettings } from './useAccessibilitySettings';
import { isTTSAvailable } from './tts';
import './accessibility-widget.css';

const DEFAULT_POSITION = {
  bottom: '20px',
  right: '20px',
};

const ACCESSIBILITY_STATEMENT_URL = '#accessibility-statement'; // Placeholder - replace with actual URL

export const AccessibilityWidget: React.FC<AccessibilityWidgetProps> = ({
  position = DEFAULT_POSITION,
  buttonLabel = 'Ustawienia dostępności',
  storageKey,
}) => {
  const { settings, updateSetting, resetSettings, isOpen, setIsOpen } =
    useAccessibilitySettings(storageKey);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Handle keyboard navigation
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        isOpen &&
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  // Focus trap for accessibility panel
  useEffect(() => {
    if (isOpen && panelRef.current) {
      const focusableElements = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleTab = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      };

      document.addEventListener('keydown', handleTab);
      firstElement?.focus();

      return () => {
        document.removeEventListener('keydown', handleTab);
      };
    }
  }, [isOpen]);

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  const handleButtonKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  return (
    <>
      <button
        ref={buttonRef}
        className="accessibility-widget-button"
        onClick={handleButtonClick}
        onKeyDown={handleButtonKeyDown}
        aria-label={buttonLabel}
        aria-expanded={isOpen}
        aria-controls="accessibility-panel"
        aria-haspopup="true"
        style={position}
        type="button"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          <path d="M2 12h20" />
        </svg>
        <span className="accessibility-widget-button-text">{buttonLabel}</span>
      </button>

      {isOpen && (
        <div
          ref={panelRef}
          id="accessibility-panel"
          className="accessibility-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="accessibility-panel-title"
          aria-describedby="accessibility-panel-description"
        >
          <div className="accessibility-panel-header">
            <h2 id="accessibility-panel-title">Ustawienia dostępności</h2>
            <button
              className="accessibility-panel-close"
              onClick={() => setIsOpen(false)}
              aria-label="Zamknij"
              type="button"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>

          <div
            id="accessibility-panel-description"
            className="sr-only"
          >
            Użyj tych ustawień, aby dostosować wygląd strony do swoich potrzeb.
          </div>

          <div className="accessibility-panel-content">
            {/* Font Size Control */}
            <div className="accessibility-control-group">
              <label htmlFor="font-size-control" className="accessibility-label">
                Rozmiar czcionki
              </label>
              <div className="accessibility-range-control">
                <button
                  id="font-size-decrease"
                  onClick={() =>
                    updateSetting('fontSize', Math.max(0.75, settings.fontSize - 0.25))
                  }
                  aria-label="Zmniejsz rozmiar czcionki"
                  disabled={settings.fontSize <= 0.75}
                  type="button"
                >
                  <span aria-hidden="true">−</span>
                </button>
                <span
                  id="font-size-display"
                  className="accessibility-value-display"
                  aria-live="polite"
                >
                  {Math.round(settings.fontSize * 100)}%
                </span>
                <button
                  id="font-size-increase"
                  onClick={() =>
                    updateSetting('fontSize', Math.min(2.0, settings.fontSize + 0.25))
                  }
                  aria-label="Zwiększ rozmiar czcionki"
                  disabled={settings.fontSize >= 2.0}
                  type="button"
                >
                  <span aria-hidden="true">+</span>
                </button>
              </div>
            </div>

            {/* Line Spacing Control */}
            <div className="accessibility-control-group">
              <label htmlFor="line-spacing-control" className="accessibility-label">
                Odstępy między wierszami
              </label>
              <div className="accessibility-range-control">
                <button
                  id="line-spacing-decrease"
                  onClick={() =>
                    updateSetting('lineSpacing', Math.max(1.0, settings.lineSpacing - 0.25))
                  }
                  aria-label="Zmniejsz odstępy"
                  disabled={settings.lineSpacing <= 1.0}
                  type="button"
                >
                  <span aria-hidden="true">−</span>
                </button>
                <span
                  id="line-spacing-display"
                  className="accessibility-value-display"
                  aria-live="polite"
                >
                  {settings.lineSpacing.toFixed(2)}x
                </span>
                <button
                  id="line-spacing-increase"
                  onClick={() =>
                    updateSetting('lineSpacing', Math.min(3.0, settings.lineSpacing + 0.25))
                  }
                  aria-label="Zwiększ odstępy"
                  disabled={settings.lineSpacing >= 3.0}
                  type="button"
                >
                  <span aria-hidden="true">+</span>
                </button>
              </div>
            </div>

            {/* Toggle Controls */}
            <div className="accessibility-toggle-group">
              <label className="accessibility-toggle">
                <input
                  type="checkbox"
                  checked={settings.highContrast}
                  onChange={(e) => updateSetting('highContrast', e.target.checked)}
                  aria-describedby="high-contrast-desc"
                />
                <span>Wysoki kontrast</span>
                <span id="high-contrast-desc" className="sr-only">
                  Zwiększa kontrast między tekstem a tłem
                </span>
              </label>

              <label className="accessibility-toggle">
                <input
                  type="checkbox"
                  checked={settings.grayscale}
                  onChange={(e) => updateSetting('grayscale', e.target.checked)}
                  aria-describedby="grayscale-desc"
                />
                <span>Skala szarości</span>
                <span id="grayscale-desc" className="sr-only">
                  Usuwa kolory, wyświetla tylko odcienie szarości
                </span>
              </label>

              <label className="accessibility-toggle">
                <input
                  type="checkbox"
                  checked={settings.dyslexiaFont}
                  onChange={(e) => updateSetting('dyslexiaFont', e.target.checked)}
                  aria-describedby="dyslexia-font-desc"
                />
                <span>Czcionka przyjazna dla dysleksji</span>
                <span id="dyslexia-font-desc" className="sr-only">
                  Używa czcionki OpenDyslexic, łatwiejszej do czytania dla osób z dysleksją
                </span>
              </label>

              <label className="accessibility-toggle">
                <input
                  type="checkbox"
                  checked={settings.highlightLinks}
                  onChange={(e) => updateSetting('highlightLinks', e.target.checked)}
                  aria-describedby="highlight-links-desc"
                />
                <span>Podświetlaj linki</span>
                <span id="highlight-links-desc" className="sr-only">
                  Podkreśla wszystkie linki na stronie
                </span>
              </label>

              <label className="accessibility-toggle">
                <input
                  type="checkbox"
                  checked={settings.highlightHeadings}
                  onChange={(e) => updateSetting('highlightHeadings', e.target.checked)}
                  aria-describedby="highlight-headings-desc"
                />
                <span>Podświetlaj nagłówki</span>
                <span id="highlight-headings-desc" className="sr-only">
                  Podkreśla wszystkie nagłówki na stronie
                </span>
              </label>

              <label className="accessibility-toggle">
                <input
                  type="checkbox"
                  checked={settings.pauseAnimations}
                  onChange={(e) => updateSetting('pauseAnimations', e.target.checked)}
                  aria-describedby="pause-animations-desc"
                />
                <span>Zatrzymaj animacje</span>
                <span id="pause-animations-desc" className="sr-only">
                  Zatrzymuje wszystkie animacje i przejścia na stronie
                </span>
              </label>

              {/* TTS Toggle */}
              <label className="accessibility-toggle">
                <input
                  type="checkbox"
                  checked={settings.ttsEnabled}
                  onChange={(e) => updateSetting('ttsEnabled', e.target.checked)}
                  aria-describedby="tts-enabled-desc"
                  disabled={!isTTSAvailable()}
                />
                <span>Czytaj tekst po najechaniu myszką</span>
                {!isTTSAvailable() && (
                  <span className="accessibility-disabled-hint" style={{ fontSize: '0.85em', color: '#666' }}>
                    (niedostępne w tej przeglądarce)
                  </span>
                )}
                <span id="tts-enabled-desc" className="sr-only">
                  Czyta na głos tekst po najechaniu myszką
                </span>
              </label>
            </div>

            {/* TTS Settings (only show if TTS is enabled) */}
            {settings.ttsEnabled && isTTSAvailable() && (
              <>
                {/* TTS Speed Control */}
                <div className="accessibility-control-group">
                  <label htmlFor="tts-rate-control" className="accessibility-label">
                    Szybkość czytania
                  </label>
                  <div className="accessibility-range-control">
                    <button
                      id="tts-rate-decrease"
                      onClick={() =>
                        updateSetting('ttsRate', Math.max(0.5, settings.ttsRate - 0.1))
                      }
                      aria-label="Zmniejsz szybkość czytania"
                      disabled={settings.ttsRate <= 0.5}
                      type="button"
                    >
                      <span aria-hidden="true">−</span>
                    </button>
                    <span
                      id="tts-rate-display"
                      className="accessibility-value-display"
                      aria-live="polite"
                    >
                      {settings.ttsRate.toFixed(1)}x
                    </span>
                    <button
                      id="tts-rate-increase"
                      onClick={() =>
                        updateSetting('ttsRate', Math.min(2.0, settings.ttsRate + 0.1))
                      }
                      aria-label="Zwiększ szybkość czytania"
                      disabled={settings.ttsRate >= 2.0}
                      type="button"
                    >
                      <span aria-hidden="true">+</span>
                    </button>
                  </div>
                </div>

                {/* TTS Volume Control */}
                <div className="accessibility-control-group">
                  <label htmlFor="tts-volume-control" className="accessibility-label">
                    Głośność
                  </label>
                  <div className="accessibility-range-control">
                    <button
                      id="tts-volume-decrease"
                      onClick={() =>
                        updateSetting('ttsVolume', Math.max(0.0, settings.ttsVolume - 0.1))
                      }
                      aria-label="Zmniejsz głośność"
                      disabled={settings.ttsVolume <= 0.0}
                      type="button"
                    >
                      <span aria-hidden="true">−</span>
                    </button>
                    <span
                      id="tts-volume-display"
                      className="accessibility-value-display"
                      aria-live="polite"
                    >
                      {Math.round(settings.ttsVolume * 100)}%
                    </span>
                    <button
                      id="tts-volume-increase"
                      onClick={() =>
                        updateSetting('ttsVolume', Math.min(1.0, settings.ttsVolume + 0.1))
                      }
                      aria-label="Zwiększ głośność"
                      disabled={settings.ttsVolume >= 1.0}
                      type="button"
                    >
                      <span aria-hidden="true">+</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Reset Button */}
            <div className="accessibility-actions">
              <button
                className="accessibility-reset-button"
                onClick={resetSettings}
                type="button"
              >
                Przywróć domyślne
              </button>
            </div>

            {/* Accessibility Statement Link */}
            <div className="accessibility-statement">
              <a
                href={ACCESSIBILITY_STATEMENT_URL}
                onClick={(e) => {
                  e.preventDefault();
                  // Navigate to accessibility statement page
                  // This should be implemented based on your routing
                }}
              >
                Deklaracja dostępności
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Screen reader only class helper
if (typeof document !== 'undefined') {
  const styleId = 'accessibility-widget-sr-only';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
      }
    `;
    document.head.appendChild(style);
  }
}
