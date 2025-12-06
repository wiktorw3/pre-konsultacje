import React, { useState, useEffect, useRef } from 'react';
import './Timeline.css';

/**
 * Komponent osi czasu procesu legislacji w Polsce
 * Spełnia wymagania WCAG 2.1 AA
 */

// Ikony dla każdego etapu
const stageIcons = {
  'Prekonsultacje': '💭',
  'Projekt': '✏️',
  'Konsultacje': '🗣️',
  'Ustawa': '📄',
  'Głosowanie w Sejmie': '🗳️',
  'Głosowanie w Senacie': '⚖️',
  'Decyzja Prezydenta': '✒️'
};

// Mapowanie etapów na klasy CSS (każdy etap ma swój kolor)
const stageClasses = {
  'Prekonsultacje': 'timeline-stage--prekonsultacje',
  'Projekt': 'timeline-stage--projekt',
  'Konsultacje': 'timeline-stage--konsultacje',
  'Ustawa': 'timeline-stage--ustawa',
  'Głosowanie w Sejmie': 'timeline-stage--sejm',
  'Głosowanie w Senacie': 'timeline-stage--senat',
  'Decyzja Prezydenta': 'timeline-stage--prezydent'
};

// Mapowanie statusów na klasy CSS (zachowane dla kompatybilności)
const statusClasses = {
  'preparing': 'timeline-stage--preparing',
  'consultations': 'timeline-stage--consultations',
  'passed': 'timeline-stage--passed',
  'risks': 'timeline-stage--risks'
};

const Timeline = ({ data = [], onStageClick }) => {
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);
  const modalRef = useRef(null);
  const previousActiveElementRef = useRef(null);

  const handleStageClick = (stage, event) => {
    event.preventDefault();
    previousActiveElementRef.current = document.activeElement;
    setSelectedStage(stage);
    if (onStageClick) {
      onStageClick(stage);
    }
  };

  const handleKeyDown = (stage, event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleStageClick(stage, event);
    }
  };

  const closeModal = () => {
    setSelectedStage(null);
    // Zwróć focus do poprzedniego aktywnego elementu
    if (previousActiveElementRef.current) {
      previousActiveElementRef.current.focus();
    }
  };

  // Zarządzanie focusem w modalu
  useEffect(() => {
    if (selectedStage && modalRef.current) {
      // Ustaw focus na pierwszy interaktywny element w modalu (przycisk zamknij)
      const closeButton = modalRef.current.querySelector('.timeline-modal-close');
      if (closeButton) {
        closeButton.focus();
      }
    }
  }, [selectedStage]);

  const handleModalKeyDown = (event) => {
    if (event.key === 'Escape') {
      closeModal();
    }
  };

  // Filtruj puste dane i sortuj według kolejności etapów
  const orderedStages = [
    'Prekonsultacje',
    'Projekt',
    'Konsultacje',
    'Ustawa',
    'Głosowanie w Sejmie',
    'Głosowanie w Senacie',
    'Decyzja Prezydenta'
  ];

  const sortedData = orderedStages
    .map(stageName => data.find(item => item.stage === stageName))
    .filter(Boolean);

  if (sortedData.length === 0) {
    return (
      <div className="timeline-container" role="status" aria-live="polite">
        <p>Brak danych do wyświetlenia</p>
      </div>
    );
  }

  return (
    <>
      <div className="timeline-container" role="region" aria-label="Oś czasu procesu legislacji">
        <div className="timeline-line" aria-hidden="true"></div>
        <ol className="timeline-list" role="list">
          {sortedData.map((item, index) => {
            const stageClass = stageClasses[item.stage] || '';
            const isLast = index === sortedData.length - 1;
            const stageId = `stage-${index}`;

            return (
              <li
                key={item.stage}
                className={`timeline-item ${isLast ? 'timeline-item--last' : ''}`}
                role="listitem"
              >
                <button
                  className={`timeline-stage ${stageClass}`}
                  onClick={(e) => handleStageClick(item, e)}
                  onKeyDown={(e) => handleKeyDown(item, e)}
                  onMouseEnter={() => setActiveTooltip(index)}
                  onMouseLeave={() => setActiveTooltip(null)}
                  onFocus={() => setActiveTooltip(index)}
                  onBlur={() => setActiveTooltip(null)}
                  aria-label={`${item.stage}, status: ${getStatusLabel(item.status)}. Kliknij, aby zobaczyć szczegóły.`}
                  aria-describedby={`tooltip-${index}`}
                  id={stageId}
                >
                  <span className="timeline-stage-icon" aria-hidden="true">
                    {stageIcons[item.stage] || '•'}
                  </span>
                  <span className="timeline-stage-label">{item.stage}</span>
                  <span className="timeline-stage-indicator" aria-hidden="true"></span>
                </button>

                {/* Tooltip - tylko opis w prostym języku */}
                {activeTooltip === index && (item.osrSummary || item.description) && (
                  <div
                    id={`tooltip-${index}`}
                    className="timeline-tooltip"
                    role="tooltip"
                    aria-live="polite"
                  >
                    <p className="timeline-tooltip-description">
                      {item.osrSummary || item.description}
                    </p>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      {/* Modal z szczegółami */}
      {selectedStage && (
        <div
          className="timeline-modal-overlay"
          onClick={closeModal}
          onKeyDown={handleModalKeyDown}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            ref={modalRef}
            className="timeline-modal"
            onClick={(e) => e.stopPropagation()}
            role="document"
          >
            <button
              className="timeline-modal-close"
              onClick={closeModal}
              aria-label="Zamknij okno szczegółów"
            >
              ×
            </button>
            <h2 id="modal-title" className="timeline-modal-title">
              {selectedStage.stage}
            </h2>
            <div className="timeline-modal-content">
              <div className="timeline-modal-section">
                <h3>Status</h3>
                <span className={`timeline-status-badge ${statusClasses[selectedStage.status]}`}>
                  {getStatusLabel(selectedStage.status)}
                </span>
              </div>
              
              {selectedStage.projectName && (
                <div className="timeline-modal-section">
                  <h3>Nazwa projektu</h3>
                  <p>{selectedStage.projectName}</p>
                </div>
              )}

              {selectedStage.ministry && (
                <div className="timeline-modal-section">
                  <h3>Ministerstwo</h3>
                  <p>{selectedStage.ministry}</p>
                </div>
              )}

              {selectedStage.osrSummary && (
                <div className="timeline-modal-section">
                  <h3>Skrót OSR (w prostym języku)</h3>
                  <p>{selectedStage.osrSummary}</p>
                </div>
              )}

              {selectedStage.description && (
                <div className="timeline-modal-section">
                  <h3>Opis</h3>
                  <p>{selectedStage.description}</p>
                </div>
              )}

              {selectedStage.link && (
                <div className="timeline-modal-section">
                  <a
                    href={selectedStage.link}
                    className="timeline-modal-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Zobacz dokumenty →
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Funkcja pomocnicza do tłumaczenia statusów na polskie etykiety
function getStatusLabel(status) {
  const labels = {
    'preparing': 'W przygotowaniu',
    'consultations': 'W konsultacjach',
    'passed': 'Uchwalona',
    'risks': 'Ryzyka wdrożeniowe'
  };
  return labels[status] || 'Nieznany';
}

export default Timeline;

