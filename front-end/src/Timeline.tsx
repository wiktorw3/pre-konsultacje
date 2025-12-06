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
        <div className="flex items-center justify-center gap-1 md:gap-2 flex-wrap">
          {sortedData.map((item, index) => {
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

                  {/* Tooltip */}
                  {activeTooltip === index && item.description && (
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 bg-gray-900 text-white px-4 py-3 rounded-lg text-sm max-w-xs w-max shadow-lg"
                      role="tooltip"
                    >
                      <p className="font-semibold mb-1">{item.stage}</p>
                      <p className="text-gray-300 text-xs leading-relaxed">
                        {item.description}
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
  )
}

// Example timeline data export
export const exampleTimelineData = [
  {
    stage: 'Pomysł',
    status: 'passed' as const,
    description: 'Początkowy etap, gdzie powstają pomysły na nowe przepisy.'
  },
  {
    stage: 'Prekonsultacje',
    status: 'passed' as const,
    description: 'Wstępny etap konsultacji. Każdy może zgłaszać pomysły i opinie.'
  },
  {
    stage: 'Projekt',
    status: 'passed' as const,
    description: 'Tworzony jest oficjalny projekt ustawy.'
  },
  {
    stage: 'Konsultacje',
    status: 'consultations' as const,
    description: 'Projekt udostępniany publicznie. Można zgłaszać uwagi.'
  },
  {
    stage: 'Ustawa',
    status: 'consultations' as const,
    description: 'Projekt przyjęty przez rząd i skierowany do Sejmu.'
  },
  {
    stage: 'Sejm',
    status: 'preparing' as const,
    description: 'Posłowie głosują nad projektem.'
  },
  {
    stage: 'Senat',
    status: 'preparing' as const,
    description: 'Senat może zaakceptować lub wprowadzić poprawki.'
  },
  {
    stage: 'Prezydent',
    status: 'preparing' as const,
    description: 'Prezydent może podpisać lub zawetować ustawę.'
  }
]
