import { useState, useEffect, useRef } from 'react'

/**
 * Timeline component for the legislative process in Poland
 */

interface TimelineStage {
  stage: string
  status: 'preparing' | 'consultations' | 'passed' | 'risks'
  description: string
  link?: string
  projectName?: string
  ministry?: string
  osrSummary?: string
}

interface TimelineProps {
  data?: TimelineStage[]
  onStageClick?: (stage: TimelineStage) => void
}

// Icons for each stage
const stageIcons: Record<string, string> = {
  'Pomysł': '💡',
  'Prekonsultacje': '💭',
  'Projekt': '✏️',
  'Konsultacje': '🗣️',
  'Ustawa': '📄',
  'Sejm': '🗳️',
  'Senat': '⚖️',
  'Prezydent': '✒️'
}

// Status labels in Polish
function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    'preparing': 'W przygotowaniu',
    'consultations': 'W konsultacjach',
    'passed': 'Uchwalona',
    'risks': 'Ryzyka wdrożeniowe'
  }
  return labels[status] || 'Nieznany'
}

// Status to CSS class mapping
const statusClasses: Record<string, string> = {
  'preparing': 'preparing',
  'consultations': 'consultations',
  'passed': 'passed',
  'risks': 'risks'
}

// Ordered stages for the legislative process
const orderedStages = [
  'Pomysł',
  'Prekonsultacje',
  'Projekt',
  'Konsultacje',
  'Ustawa',
  'Sejm',
  'Senat',
  'Prezydent'
]

export default function Timeline({ data = [], onStageClick }: TimelineProps) {
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null)
  const [selectedStage, setSelectedStage] = useState<TimelineStage | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const previousActiveElementRef = useRef<Element | null>(null)

  const handleStageClick = (stage: TimelineStage, event: React.MouseEvent) => {
    event.preventDefault()
    previousActiveElementRef.current = document.activeElement
    setSelectedStage(stage)
    if (onStageClick) {
      onStageClick(stage)
    }
  }

  const handleKeyDown = (stage: TimelineStage, event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleStageClick(stage, event as unknown as React.MouseEvent)
    }
  }

  const closeModal = () => {
    setSelectedStage(null)
    if (previousActiveElementRef.current && previousActiveElementRef.current instanceof HTMLElement) {
      previousActiveElementRef.current.focus()
    }
  }

  const handleModalKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      closeModal()
    }
  }

  // Focus management for modal
  useEffect(() => {
    if (selectedStage && modalRef.current) {
      const closeButton = modalRef.current.querySelector('button') as HTMLElement
      if (closeButton) {
        closeButton.focus()
      }
    }
  }, [selectedStage])

  // Sort data according to ordered stages
  const sortedData = orderedStages
    .map(stageName => data.find(item => item.stage === stageName))
    .filter((item): item is TimelineStage => item !== undefined)

  if (sortedData.length === 0) {
    return (
      <div className="py-6 text-center text-gray-500">
        <p>Brak danych do wyświetlenia</p>
      </div>
    )
  }

  return (
    <>
      <div className="py-6 px-4" role="region" aria-label="Oś czasu procesu legislacji">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center justify-center gap-1 md:gap-2 flex-wrap">
            {sortedData.map((item, index) => {
              const isLast = index === sortedData.length - 1

              return (
                <div key={item.stage} className="flex items-center">
                  {/* Stage Button */}
                  <div className="relative">
                    <button
                      onClick={(e) => handleStageClick(item, e)}
                      onKeyDown={(e) => handleKeyDown(item, e)}
                      onMouseEnter={() => setActiveTooltip(index)}
                      onMouseLeave={() => setActiveTooltip(null)}
                      onFocus={() => setActiveTooltip(index)}
                      onBlur={() => setActiveTooltip(null)}
                      aria-label={`${item.stage}, status: ${getStatusLabel(item.status)}. Kliknij, aby zobaczyć szczegóły.`}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs md:text-sm font-medium transition-all bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                      <span className="text-base md:text-lg">{stageIcons[item.stage] || '•'}</span>
                      <span className="hidden sm:inline">{item.stage}</span>
                    </button>

                    {/* Tooltip */}
                    {activeTooltip === index && (item.osrSummary || item.description) && (
                      <div
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 bg-gray-900 text-white px-4 py-3 rounded-lg text-sm max-w-xs w-max shadow-lg"
                        role="tooltip"
                      >
                        <p className="font-semibold mb-1">{item.stage}</p>
                        <p className="text-gray-300 text-xs leading-relaxed">
                          {item.osrSummary || item.description}
                        </p>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-8 border-transparent border-b-gray-900"></div>
                      </div>
                    )}
                  </div>

                  {/* Arrow to next stage */}
                  {!isLast && (
                    <span className="mx-1 md:mx-2 text-gray-400 text-lg md:text-xl">→</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Modal with details */}
      {selectedStage && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000] p-4"
          onClick={closeModal}
          onKeyDown={handleModalKeyDown}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            ref={modalRef}
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{stageIcons[selectedStage.stage]}</span>
                <h2 id="modal-title" className="text-xl font-bold text-gray-900">
                  {selectedStage.stage}
                </h2>
              </div>
              <button
                onClick={closeModal}
                aria-label="Zamknij okno szczegółów"
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none p-1"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Status</h3>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  selectedStage.status === 'passed' ? 'bg-green-100 text-green-800' :
                  selectedStage.status === 'consultations' ? 'bg-blue-100 text-blue-800' :
                  selectedStage.status === 'risks' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {getStatusLabel(selectedStage.status)}
                </span>
              </div>
              
              {selectedStage.projectName && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Nazwa projektu</h3>
                  <p className="text-gray-900">{selectedStage.projectName}</p>
                </div>
              )}

              {selectedStage.ministry && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Ministerstwo</h3>
                  <p className="text-gray-900">{selectedStage.ministry}</p>
                </div>
              )}

              {selectedStage.osrSummary && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Skrót OSR (w prostym języku)</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedStage.osrSummary}</p>
                </div>
              )}

              {selectedStage.description && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Opis</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedStage.description}</p>
                </div>
              )}

              {selectedStage.link && (
                <div className="pt-2">
                  <a
                    href={selectedStage.link}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Zobacz dokumenty
                    <span>→</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Example timeline data export
export const exampleTimelineData = [
  {
    stage: 'Pomysł',
    status: 'passed' as const,
    description: 'Etap generowania i zbierania pomysłów na nowe regulacje.',
    link: 'https://www.gov.pl',
    projectName: 'Ustawa o wspieraniu innowacyjności',
    ministry: 'Ministerstwo Rozwoju i Technologii',
    osrSummary: 'Początkowy etap, gdzie powstają pomysły na nowe przepisy. Obywatele i eksperci mogą zgłaszać swoje propozycje.'
  },
  {
    stage: 'Prekonsultacje',
    status: 'passed' as const,
    description: 'Etap wstępnych konsultacji społecznych i analiz.',
    link: 'https://www.gov.pl/web/prekonsultacje',
    projectName: 'Ustawa o wspieraniu innowacyjności',
    ministry: 'Ministerstwo Rozwoju i Technologii',
    osrSummary: 'Wstępny etap przygotowywania projektu ustawy. Każdy może zgłaszać pomysły i opinie.'
  },
  {
    stage: 'Projekt',
    status: 'passed' as const,
    description: 'Przygotowanie projektu ustawy przez ministerstwo.',
    link: 'https://www.gov.pl/web/dziennik-ustaw',
    projectName: 'Ustawa o wspieraniu innowacyjności',
    ministry: 'Ministerstwo Rozwoju i Technologii',
    osrSummary: 'Tworzony jest oficjalny projekt ustawy. Zawiera treść przepisów i uzasadnienie.'
  },
  {
    stage: 'Konsultacje',
    status: 'consultations' as const,
    description: 'Publiczne konsultacje projektu ustawy.',
    link: 'https://www.gov.pl/web/konsultacje-spoleczne',
    projectName: 'Ustawa o wspieraniu innowacyjności',
    ministry: 'Ministerstwo Rozwoju i Technologii',
    osrSummary: 'Projekt udostępniany interesariuszom. Można zgłaszać uwagi i sugestie zmian.'
  },
  {
    stage: 'Ustawa',
    status: 'consultations' as const,
    description: 'Projekt przekazany do prac legislacyjnych.',
    link: 'https://www.sejm.gov.pl',
    projectName: 'Ustawa o wspieraniu innowacyjności',
    ministry: 'Ministerstwo Rozwoju i Technologii',
    osrSummary: 'Projekt przyjęty przez rząd i skierowany do Sejmu.'
  },
  {
    stage: 'Sejm',
    status: 'preparing' as const,
    description: 'Projekt w trakcie procedowania w Sejmie RP.',
    link: 'https://www.sejm.gov.pl',
    projectName: 'Ustawa o wspieraniu innowacyjności',
    ministry: 'Ministerstwo Rozwoju i Technologii',
    osrSummary: 'Posłowie głosują nad projektem. Jeśli większość popiera, przechodzi do Senatu.'
  },
  {
    stage: 'Senat',
    status: 'preparing' as const,
    description: 'Ustawa trafia do Senatu.',
    link: 'https://www.senat.gov.pl',
    projectName: 'Ustawa o wspieraniu innowacyjności',
    ministry: 'Ministerstwo Rozwoju i Technologii',
    osrSummary: 'Senat może zaakceptować, wprowadzić poprawki lub zgłosić uwagi.'
  },
  {
    stage: 'Prezydent',
    status: 'risks' as const,
    description: 'Prezydent podpisuje lub wetuje ustawę.',
    link: 'https://www.prezydent.pl',
    projectName: 'Ustawa o wspieraniu innowacyjności',
    ministry: 'Ministerstwo Rozwoju i Technologii',
    osrSummary: 'Prezydent może podpisać, zawetować lub skierować do Trybunału Konstytucyjnego.'
  }
]
