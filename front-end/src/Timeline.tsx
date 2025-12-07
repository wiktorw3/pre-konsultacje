import { useState } from 'react'

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
  selectedStage?: string
  onStageSelect?: (stageName: string) => void
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

export default function Timeline({ data = [], selectedStage, onStageSelect }: TimelineProps) {
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null)

  const handleStageClick = (stageName: string) => {
    if (onStageSelect) {
      onStageSelect(stageName)
    }
  }

  // Sort data according to ordered stages
  const sortedData = orderedStages
    .map(stageName => {
      const found = data.find(item => item.stage === stageName)
      return found || { stage: stageName, status: 'preparing' as const, description: '' }
    })

  return (
    <div className="py-6 px-4" role="region" aria-label="Oś czasu procesu legislacji">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-center gap-1 md:gap-2 flex-wrap relative">
          {sortedData.map((item, index) => {
            const isFirst = index === 0
            const isLast = index === sortedData.length - 1
            const isSelected = selectedStage === item.stage
            const isClickable = item.stage === 'Prekonsultacje' || item.stage === 'Konsultacje'

            return (
              <div key={item.stage} className="flex items-center">
                {/* Stage Button */}
                <div className="relative">
                  <button
                    onClick={() => isClickable && handleStageClick(item.stage)}
                    onMouseEnter={() => setActiveTooltip(index)}
                    onMouseLeave={() => setActiveTooltip(null)}
                    onFocus={() => setActiveTooltip(index)}
                    onBlur={() => setActiveTooltip(null)}
                    aria-label={`${item.stage}${isClickable ? '. Kliknij, aby zobaczyć szczegóły.' : ''}`}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs md:text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-gray-400 ${
                      isSelected 
                        ? 'bg-gray-900 border border-gray-900 text-white' 
                        : isClickable
                          ? 'bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 hover:border-gray-400 cursor-pointer'
                          : 'bg-white border border-gray-200 text-gray-400 cursor-default'
                    }`}
                  >
                    <span className="text-base md:text-lg">{stageIcons[item.stage] || '•'}</span>
                    <span className="hidden sm:inline">{item.stage}</span>
                  </button>

                  {/* Tooltip - inteligentne pozycjonowanie */}
                  {activeTooltip === index && item.description && (
                    <div
                      className={`absolute z-50 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg ${
                        isFirst
                          ? 'top-full left-0 mt-2' // Dla pierwszego (Pomysł) - szeroki, poziomy
                          : isLast
                          ? 'top-full right-0 mt-2' // Dla ostatniego (Prezydent) - szeroki, poziomy
                          : 'top-full left-1/2 -translate-x-1/2 mt-2' // Dla środkowych - szeroki, poziomy
                      }`}
                      style={{
                        maxWidth: 'min(1200px, 95vw)',
                        minWidth: '400px',
                        width: 'auto'
                      }}
                      role="tooltip"
                    >
                      <p className="font-semibold mb-1.5 text-sm">{item.stage}</p>
                      <p className="text-gray-300 text-sm leading-normal break-words">
                        {item.description}
                      </p>
                      {/* Strzałka wskazująca na przycisk */}
                      <div
                        className={`absolute bottom-full border-8 border-transparent border-b-gray-900 ${
                          isFirst
                            ? 'left-4' // Strzałka po lewej dla pierwszego
                            : isLast
                            ? 'right-4' // Strzałka po prawej dla ostatniego
                            : 'left-1/2 -translate-x-1/2' // Strzałka wyśrodkowana dla środkowych
                        }`}
                      ></div>
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
  )
}

// Example timeline data export
export const exampleTimelineData = [
  {
    stage: 'Pomysł',
    status: 'passed' as const,
    description: 'Etap, w którym pojawia się potrzeba zmiany prawa oraz wstępne kierunki regulacji.'
  },
  {
    stage: 'Prekonsultacje',
    status: 'passed' as const,
    description: 'Wczesne zbieranie opinii i sygnałów przed stworzeniem projektu ustawy.'
  },
  {
    stage: 'Projekt',
    status: 'passed' as const,
    description: 'Wypracowany projekt ustawy przygotowany przez uprawniony podmiot.'
  },
  {
    stage: 'Konsultacje',
    status: 'consultations' as const,
    description: 'Projekt kierowany do konsultacji publicznych i uzgodnień — można zgłaszać uwagi.'
  },
  {
    stage: 'Ustawa',
    status: 'consultations' as const,
    description: 'Projekt ustawy zostaje formalnie wniesiony do Sejmu przez uprawniony podmiot.'
  },
  {
    stage: 'Sejm',
    status: 'preparing' as const,
    description: 'Sejm przeprowadza czytania, debatę, poprawki i głosowania. Może projekt przyjąć, zmienić lub odrzucić.'
  },
  {
    stage: 'Senat',
    status: 'preparing' as const,
    description: 'Senat może ustawę przyjąć, wprowadzić poprawki lub odrzucić.'
  },
  {
    stage: 'Prezydent',
    status: 'preparing' as const,
    description: 'Prezydent może ustawę podpisać, zawetować lub skierować ją do Trybunału Konstytucyjnego.'
  }
]
