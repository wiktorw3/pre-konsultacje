import { Bill, BillStatus } from './types'

interface BillProjectDetailProps {
  item: Bill
  onBack: () => void
}

// Status color mapping
const getStatusStyles = (status: BillStatus): string => {
  switch (status) {
    case 'Weto Prezydenta':
      return 'bg-[#e5572f] text-white'
    case 'Podpisana':
      return 'bg-[#3c9d5b] text-white'
    case 'W Senacie':
    case 'W Sejmie':
    case 'Złożona':
    default:
      return 'bg-[#f1f1f1] text-gray-800'
  }
}

export default function BillProjectDetail({ item, onBack }: BillProjectDetailProps) {
  const isProject = item.type === 'projekt'
  
  // Reverse the timeline for display (show from left=earliest to right=current)
  const reversedSteps = [...item.timelineSteps].reverse()
  
  return (
    <div className="min-h-screen bg-neutral-100 py-8 px-4">
      {/* Main Container */}
      <div className="max-w-[900px] mx-auto bg-gray-100 rounded-3xl shadow-lg p-6 md:p-10">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Wróć</span>
        </button>

        {/* Header - Title, Date, Status */}
        <header className="mb-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {isProject ? 'Projekt' : 'Ustawa'}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
                {item.name}
              </h1>
              <p className="text-gray-500 mt-2">{item.date}</p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${getStatusStyles(
                item.status
              )}`}
            >
              {item.status}
            </span>
          </div>
        </header>

        {/* Timeline Section - Horizontal */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            {isProject ? 'Etapy projektu' : 'Proces legislacyjny'}
          </h2>
          
          {/* Horizontal Timeline */}
          <div className="relative">
            {/* Timeline container with horizontal scroll on mobile */}
            <div className="overflow-x-auto pb-4">
              <div className="flex items-start min-w-max">
                {reversedSteps.map((step, index) => {
                  const isLastStep = index === reversedSteps.length - 1 // Current step (rightmost)
                  
                  return (
                    <div key={index} className="flex items-start">
                      {/* Step */}
                      <div className="flex flex-col items-center">
                        {/* Circle indicator */}
                        <div
                          className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                            isLastStep
                              ? 'bg-gray-900 border-gray-900'
                              : 'bg-gray-900 border-gray-900'
                          }`}
                        >
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        
                        {/* Step label */}
                        <div className="mt-3 text-center max-w-[120px]">
                          <p
                            className={`text-sm font-medium ${
                              isLastStep ? 'text-gray-900' : 'text-gray-700'
                            }`}
                          >
                            {step}
                          </p>
                          {isLastStep && (
                            <span className="inline-block mt-1 text-xs text-gray-600 font-semibold">
                              Aktualny etap
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Connecting line (not after last item) */}
                      {index < reversedSteps.length - 1 && (
                        <div className="flex items-center h-10 px-2">
                          <div className="w-16 md:w-24 h-1 bg-gray-900 rounded-full" />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Summary Section */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Streszczenie</h2>
          <div className="bg-white/60 rounded-xl p-5">
            <p className="text-gray-700 leading-relaxed">{item.summary}</p>
          </div>
        </section>

        {/* Cele, Założenia, Skutki - Horizontal Row */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Cele */}
            <div className="bg-white/60 rounded-xl p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                Cele
              </h3>
              <ul className="space-y-2">
                {item.goals.map((goal, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700 text-sm">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Założenia */}
            <div className="bg-white/60 rounded-xl p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                Założenia
              </h3>
              <ul className="space-y-2">
                {item.assumptions.map((assumption, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700 text-sm">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>{assumption}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Skutki */}
            <div className="bg-white/60 rounded-xl p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                Skutki
              </h3>
              <ul className="space-y-2">
                {item.impacts.map((impact, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700 text-sm">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>{impact}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Zwolennicy i Przeciwnicy */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Zwolennicy */}
            <div className="bg-white/60 rounded-xl p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide flex items-center gap-2">
                <span className="text-green-500">👍</span> Zwolennicy
              </h3>
              <div className="flex flex-wrap gap-2">
                {item.zwolennicy.map((zwolennik, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium"
                  >
                    {zwolennik}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Przeciwnicy */}
            <div className="bg-white/60 rounded-xl p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide flex items-center gap-2">
                <span className="text-red-500">👎</span> Przeciwnicy
              </h3>
              <div className="flex flex-wrap gap-2">
                {item.przeciwnicy.map((przeciwnik, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium"
                  >
                    {przeciwnik}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="max-w-[900px] mx-auto mt-6 px-4 text-center text-sm text-gray-500">
        © 2025 Obywatelski Portal • HackNation 2025
      </footer>
    </div>
  )
}
