import { useState } from 'react'
import { Bill, BillStatus, Consultation } from './types'
import mPrawoLogo from './assets/mPrawo-logo3.png'
import Timeline, { exampleTimelineData } from './Timeline'

interface LandingPageProps {
  isLoggedIn: boolean
  onLoginClick: () => void
  onLogout: () => void
  onBillClick: (bill: Bill) => void
  onConsultationClick: (consultation: Consultation) => void
}

// Mock Data with extended fields
export const bills: Bill[] = [
  { 
    id: 1, 
    name: 'Ustawa o Kryptowalutach', 
    date: '4.12.2025', 
    status: 'Weto Prezydenta', 
    type: 'ustawa',
    summary: 'Ustawa regulująca obrót kryptowalutami w Polsce, wprowadzająca wymogi licencyjne dla giełd oraz zasady opodatkowania zysków z handlu cyfrowymi aktywami.',
    goals: 'Uregulowanie rynku kryptowalut i ochrona inwestorów',
    assumptions: 'Licencjonowanie giełd, KYC/AML, podatek 19%',
    impacts: 'Wzrost bezpieczeństwa inwestorów, nowe wpływy podatkowe',
    timelineSteps: ['Weto Prezydenta', 'Głosowanie w Senacie', 'Głosowanie w Sejmie', 'Inicjatywa ustawodawcza']
  },
  { 
    id: 2, 
    name: 'Ustawa o Ochronie Środowiska', 
    date: '3.12.2025', 
    status: 'Podpisana', 
    type: 'ustawa',
    summary: 'Kompleksowa ustawa wzmacniająca ochronę środowiska naturalnego poprzez zaostrzenie norm emisji i wprowadzenie nowych obszarów chronionych.',
    goals: 'Redukcja emisji CO2 o 40% do 2030 roku',
    assumptions: 'Nowe normy emisji, rozszerzenie parków narodowych',
    impacts: 'Poprawa jakości powietrza, ochrona bioróżnorodności',
    timelineSteps: ['Podpisana', 'Głosowanie w Senacie', 'Głosowanie w Sejmie', 'Inicjatywa ustawodawcza']
  },
  { 
    id: 3, 
    name: 'Ustawa o Sztucznej Inteligencji', 
    date: '2.12.2025', 
    status: 'W Senacie', 
    type: 'ustawa',
    summary: 'Ustawa określająca ramy prawne dla rozwoju i stosowania systemów sztucznej inteligencji w Polsce, zgodna z regulacjami UE.',
    goals: 'Bezpieczny rozwój AI z poszanowaniem praw człowieka',
    assumptions: 'Klasyfikacja ryzyka AI, wymogi transparentności',
    impacts: 'Zwiększenie innowacyjności, ochrona przed nadużyciami',
    timelineSteps: ['W Senacie', 'Głosowanie w Sejmie', 'Inicjatywa ustawodawcza']
  },
  { 
    id: 4, 
    name: 'Ustawa o Cyfryzacji Urzędów', 
    date: '1.12.2025', 
    status: 'W Sejmie', 
    type: 'ustawa',
    summary: 'Ustawa wprowadzająca obowiązek cyfryzacji wszystkich usług administracji publicznej do 2027 roku.',
    goals: 'Pełna cyfryzacja usług publicznych',
    assumptions: 'e-Usługi, cyfrowa tożsamość, interoperacyjność',
    impacts: 'Oszczędność czasu obywateli, redukcja kosztów administracji',
    timelineSteps: ['W Sejmie', 'Inicjatywa ustawodawcza']
  },
  { 
    id: 5, 
    name: 'Ustawa o Odnawialnych Źródłach Energii', 
    date: '30.11.2025', 
    status: 'Złożona', 
    type: 'ustawa',
    summary: 'Nowelizacja ustawy OZE wprowadzająca nowe mechanizmy wsparcia dla prosumentów i spółdzielni energetycznych.',
    goals: '50% energii z OZE do 2030 roku',
    assumptions: 'Wyższe taryfy gwarantowane, ulgi dla prosumentów',
    impacts: 'Rozwój energetyki rozproszonej, niższe rachunki',
    timelineSteps: ['Złożona', 'Inicjatywa ustawodawcza']
  },
  { 
    id: 6, 
    name: 'Projekt Reformy Edukacji', 
    date: '4.12.2025', 
    status: 'W Sejmie', 
    type: 'projekt',
    summary: 'Projekt zakładający modernizację systemu edukacji z naciskiem na kompetencje cyfrowe i krytyczne myślenie.',
    goals: 'Nowoczesna edukacja przygotowująca do wyzwań XXI wieku',
    assumptions: 'Nowa podstawa programowa, szkolenia nauczycieli',
    impacts: 'Lepsze przygotowanie uczniów do rynku pracy',
    timelineSteps: ['Projekt', 'Pre-konsultacje', 'Pomysł']
  },
  { 
    id: 7, 
    name: 'Projekt Ustawy o E-Zdrowiu', 
    date: '3.12.2025', 
    status: 'Złożona', 
    type: 'projekt',
    summary: 'Projekt rozszerzający funkcjonalność Internetowego Konta Pacjenta i wprowadzający telemedycynę jako standard.',
    goals: 'Powszechny dostęp do usług telemedycznych',
    assumptions: 'Rozbudowa IKP, refundacja teleporad',
    impacts: 'Łatwiejszy dostęp do lekarzy, krótsze kolejki',
    timelineSteps: ['Projekt', 'Pre-konsultacje', 'Pomysł']
  },
  { 
    id: 8, 
    name: 'Projekt Zmian w Kodeksie Pracy', 
    date: '2.12.2025', 
    status: 'W Senacie', 
    type: 'projekt',
    summary: 'Projekt wprowadzający 4-dniowy tydzień pracy jako opcję dla pracodawców i pracowników.',
    goals: 'Poprawa work-life balance Polaków',
    assumptions: 'Dobrowolność, zachowanie wynagrodzenia',
    impacts: 'Wyższa produktywność, lepsze zdrowie pracowników',
    timelineSteps: ['Projekt', 'Pre-konsultacje', 'Pomysł']
  },
  { 
    id: 9, 
    name: 'Projekt Ustawy o Transporcie Publicznym', 
    date: '1.12.2025', 
    status: 'W Sejmie', 
    type: 'projekt',
    summary: 'Projekt zakładający integrację biletową w całym kraju i rozwój zeroemisyjnego transportu publicznego.',
    goals: 'Jeden bilet na cały transport publiczny w Polsce',
    assumptions: 'Wspólny system biletowy, dotacje na autobusy EV',
    impacts: 'Wygodniejsze podróżowanie, czystsze powietrze',
    timelineSteps: ['Projekt', 'Pre-konsultacje', 'Pomysł']
  },
]

export const preConsultations: Consultation[] = [
  { 
    id: 1, 
    type: 'pre',
    title: 'Regulacje E-sportu', 
    category: 'Sport', 
    deadline: '15.12.2025',
    description: 'Ministerstwo Sportu zaprasza do udziału w pre-konsultacjach dotyczących prawnego uregulowania branży e-sportowej w Polsce.',
    goals: 'Stworzenie ram prawnych dla profesjonalnego e-sportu',
    assumptions: 'Status zawodnika e-sportowego, organizacja turniejów, ochrona nieletnich',
    impacts: 'Rozwój branży e-sportowej, ochrona graczy, nowe miejsca pracy',
    timelineSteps: ['Pre-konsultacje otwarte', 'Pomysł regulacji', 'Identyfikacja problemu']
  },
  { 
    id: 2, 
    type: 'pre',
    title: 'Praca zdalna w administracji', 
    category: 'Administracja', 
    deadline: '18.12.2025',
    description: 'Konsultacje dotyczące rozszerzenia możliwości pracy zdalnej w urzędach administracji publicznej.',
    goals: 'Elastyczne formy pracy dla urzędników',
    assumptions: 'Hybrydowy model pracy, cyberbezpieczeństwo, dostępność usług',
    impacts: 'Lepsza równowaga życia zawodowego, oszczędności dla budżetu',
    timelineSteps: ['Pre-konsultacje otwarte', 'Pomysł regulacji', 'Identyfikacja problemu']
  },
  { 
    id: 3, 
    type: 'pre',
    title: 'Cyfrowa tożsamość obywatela', 
    category: 'Cyfryzacja', 
    deadline: '22.12.2025',
    description: 'Dyskusja nad wprowadzeniem jednolitego systemu cyfrowej tożsamości dla wszystkich obywateli.',
    goals: 'Bezpieczna i wygodna identyfikacja online',
    assumptions: 'Integracja z mObywatelem, biometria, blockchain',
    impacts: 'Szybsze załatwianie spraw, redukcja oszustw tożsamości',
    timelineSteps: ['Pre-konsultacje otwarte', 'Pomysł regulacji', 'Identyfikacja problemu']
  },
  { 
    id: 4, 
    type: 'pre',
    title: 'Ochrona influencerów i twórców', 
    category: 'Media', 
    deadline: '28.12.2025',
    description: 'Konsultacje dotyczące ochrony prawnej twórców internetowych i regulacji współpracy z markami.',
    goals: 'Uczciwe zasady współpracy influencerów z reklamodawcami',
    assumptions: 'Transparentność reklam, ochrona przed nieuczciwymi umowami',
    impacts: 'Większa ochrona twórców, zaufanie konsumentów',
    timelineSteps: ['Pre-konsultacje otwarte', 'Pomysł regulacji', 'Identyfikacja problemu']
  },
  { 
    id: 5, 
    type: 'pre',
    title: 'Zielone miasta przyszłości', 
    category: 'Środowisko', 
    deadline: '05.01.2026',
    description: 'Dyskusja nad nowymi standardami zieleni miejskiej i infrastruktury ekologicznej.',
    goals: 'Więcej terenów zielonych w miastach',
    assumptions: 'Minimalne normy zieleni, dachy zielone, parki kieszonkowe',
    impacts: 'Lepsza jakość życia, niższe temperatury w miastach',
    timelineSteps: ['Pre-konsultacje otwarte', 'Pomysł regulacji', 'Identyfikacja problemu']
  },
]

export const consultations: Consultation[] = [
  { 
    id: 1, 
    type: 'consultation',
    title: 'Reforma Służby Zdrowia', 
    category: 'Zdrowie', 
    deadline: '20.12.2025',
    description: 'Ministerstwo Zdrowia prowadzi konsultacje publiczne projektu ustawy o reorganizacji służby zdrowia. Projekt zakłada zwiększenie nakładów i skrócenie kolejek.',
    goals: 'Poprawa dostępności i jakości usług zdrowotnych',
    assumptions: 'Zwiększenie finansowania, cyfryzacja, nowe standardy',
    impacts: 'Krótsze kolejki, lepsza opieka nad pacjentami',
    timelineSteps: ['Konsultacje publiczne', 'Projekt regulacji', 'Pomysł regulacji']
  },
  { 
    id: 2, 
    type: 'consultation',
    title: 'Program Mieszkaniowy', 
    category: 'Budownictwo', 
    deadline: '25.12.2025',
    description: 'Konsultacje społeczne nowego programu mieszkaniowego „Mieszkanie dla Każdego". Program ma ułatwić młodym Polakom zakup pierwszego mieszkania.',
    goals: 'Zwiększenie dostępności mieszkań dla młodych',
    assumptions: 'Dopłaty do kredytów, budowa mieszkań komunalnych',
    impacts: 'Więcej Polaków z własnym mieszkaniem',
    timelineSteps: ['Konsultacje publiczne', 'Projekt regulacji', 'Pomysł regulacji']
  },
  { 
    id: 3, 
    type: 'consultation',
    title: 'Transport Miejski', 
    category: 'Transport', 
    deadline: '28.12.2025',
    description: 'Ministerstwo Infrastruktury konsultuje projekt ustawy o rozwoju zeroemisyjnego transportu miejskiego.',
    goals: 'Czyste powietrze w miastach dzięki elektromobilności',
    assumptions: 'Dotacje na autobusy elektryczne, infrastruktura ładowania',
    impacts: 'Redukcja smogu, cichszy transport publiczny',
    timelineSteps: ['Konsultacje publiczne', 'Projekt regulacji', 'Pomysł regulacji']
  },
  { 
    id: 4, 
    type: 'consultation',
    title: 'Ochrona Klimatu', 
    category: 'Środowisko', 
    deadline: '30.12.2025',
    description: 'Konsultacje publiczne Narodowego Planu Ochrony Klimatu do 2040 roku. Dokument określa ścieżkę transformacji energetycznej Polski.',
    goals: 'Neutralność klimatyczna Polski do 2050 roku',
    assumptions: 'Odejście od węgla, rozwój OZE, efektywność energetyczna',
    impacts: 'Czyste środowisko dla przyszłych pokoleń',
    timelineSteps: ['Konsultacje publiczne', 'Projekt regulacji', 'Pomysł regulacji']
  },
]

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

// All legislative stages
const allStages = ['Pomysł', 'Prekonsultacje', 'Projekt', 'Konsultacje', 'Ustawa', 'Sejm', 'Senat', 'Prezydent']

// Determine which stages are complete based on status
const getCompletedStages = (status: BillStatus): number => {
  switch (status) {
    case 'Złożona':
      return 5 // Up to Ustawa
    case 'W Sejmie':
      return 6 // Up to Sejm
    case 'W Senacie':
      return 7 // Up to Senat
    case 'Podpisana':
    case 'Weto Prezydenta':
      return 8 // All stages
    default:
      return 0
  }
}

// Get current stage name
const getCurrentStageName = (status: BillStatus): string => {
  switch (status) {
    case 'Złożona':
      return 'Złożona'
    case 'W Sejmie':
      return 'Przyjęta w Sejmie'
    case 'W Senacie':
      return 'Przyjęta w Senacie'
    case 'Podpisana':
      return 'Podpisana'
    case 'Weto Prezydenta':
      return 'Weto'
    default:
      return status
  }
}

// Train visualization component
const BillTrain = ({ status }: { status: BillStatus }) => {
  const completedStages = getCompletedStages(status)
  const isVetoed = status === 'Weto Prezydenta'
  const isSigned = status === 'Podpisana'
  
  return (
    <div className="flex items-center flex-wrap gap-y-1">
      {allStages.map((stage, index) => {
        const isCompleted = index < completedStages
        const isLast = index === allStages.length - 1
        
        // Determine colors
        let bgColor = 'bg-gray-100 text-gray-400'
        
        if (isCompleted) {
          if (isLast && isVetoed) {
            bgColor = 'bg-red-500 text-white'
          } else if (isLast && isSigned) {
            bgColor = 'bg-green-500 text-white'
          } else {
            bgColor = 'bg-green-500 text-white'
          }
        }
        
        return (
          <div key={stage} className="flex items-center">
            {/* Wagon with name */}
            <div 
              className={`px-2 py-1 text-xs font-medium rounded ${bgColor}`}
              title={stage}
            >
              {stage}
            </div>
            {/* Arrow connector */}
            {!isLast && (
              <span className="text-xs mx-1 text-gray-900">
                →
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function LandingPage({ isLoggedIn, onLoginClick, onLogout, onBillClick, onConsultationClick }: LandingPageProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [consultationType, setConsultationType] = useState<'Prekonsultacje' | 'Konsultacje'>('Prekonsultacje')

  // Filter bills (only ustawy) based on search query
  const filteredBills = bills.filter((bill) => {
    const isUstawa = bill.type === 'ustawa'
    const matchesSearch = bill.name.toLowerCase().includes(searchQuery.toLowerCase())
    return isUstawa && matchesSearch
  })

  // Handle timeline stage selection
  const handleStageSelect = (stageName: string) => {
    if (stageName === 'Prekonsultacje' || stageName === 'Konsultacje') {
      setConsultationType(stageName)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <img src={mPrawoLogo} alt="mPrawo" className="h-10" />
          
          {/* Right Side - Login/Profile */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                {/* User Profile Chip */}
                <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#dc143c] text-white text-sm font-semibold">
                    A
                  </span>
                  <span className="text-sm font-medium text-gray-800">Profil</span>
                </button>
                {/* Logout Button */}
                <button
                  onClick={onLogout}
                  className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Wyloguj
                </button>
              </>
            ) : (
              /* Login Button */
              <button
                onClick={onLoginClick}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#dc143c] hover:bg-[#b91234] text-sm font-medium text-white transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Zaloguj się
              </button>
            )}
          </div>
          </div>
        </header>

      {/* Timeline Section */}
      <div className="bg-gray-50 border-b border-gray-200">
        <Timeline 
          data={exampleTimelineData} 
          selectedStage={consultationType} 
          onStageSelect={handleStageSelect}
        />
      </div>

      {/* Consultation Section - Below Timeline */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-6">
          {/* Tagline - changes based on selection */}
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            {consultationType === 'Prekonsultacje' 
              ? 'Współtwórz lepsze prawo - podziel się uwagami do celów, założeń i skutków proponowanych zmian prawnych'
              : 'Weź udział w konsultacjach publicznych - zgłoś swoje uwagi do projektów ustaw i rozporządzeń'
            }
          </p>

          {/* List - Horizontal Scroll on Mobile */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {(consultationType === 'Prekonsultacje' ? preConsultations : consultations).map((item) => (
              <div
                key={item.id}
                onClick={() => onConsultationClick(item)}
                className="flex-shrink-0 w-64 bg-white rounded-xl p-4 hover:bg-gray-50 cursor-pointer transition-colors border border-gray-200 shadow-sm"
              >
                <h4 className="font-semibold text-gray-900 text-sm leading-snug">
                  {item.title}
                </h4>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-900 text-white font-medium">
                    {item.category}
                  </span>
                  <span className="text-gray-500">
                    Do kiedy: <span className="font-bold text-gray-700">{item.deadline}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-4 pb-8 px-4">
      {/* Main Container */}
      <div className="max-w-[1200px] mx-auto bg-gray-100 rounded-3xl shadow-lg p-6 md:p-10">

        {/* Tagline and Search Row */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
          <p className="text-sm text-gray-600 flex-shrink-0">
            Poznaj przebieg prac legislacyjnych - wybierz ustawę, aby zobaczyć szczegóły.
          </p>
          {/* Search Input */}
          <div className="relative w-full sm:w-auto sm:min-w-[320px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>
            <input
              type="text"
              placeholder="Szukaj ustawy..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all text-sm"
            />
          </div>
        </div>

        {/* Bills List - Scrollable Container */}
        <div className="md:max-h-[500px] overflow-y-auto pr-1">
              <div className="space-y-3">
              {filteredBills.length > 0 ? (
                filteredBills.map((bill) => (
                  <div
                    key={bill.id}
                    onClick={() => onBillClick(bill)}
                    className="bg-white rounded-xl p-4 hover:bg-gray-50 cursor-pointer transition-colors border border-gray-200 shadow-sm"
                  >
                    {/* Top Row - Name and Status Badge */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h4 className="font-semibold text-gray-900 text-sm leading-tight">
                        {bill.name}
                      </h4>
                    <span
                        className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap ${getStatusStyles(
                        bill.status
                      )}`}
                    >
                        {getCurrentStageName(bill.status)}
                      </span>
                    </div>
                    
                    {/* Train Visualization */}
                    <div className="flex items-center justify-between">
                      <BillTrain status={bill.status} />
                      <span className="text-xs text-gray-400 ml-3">
                        {bill.date}
                    </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500 bg-white rounded-xl">
                  Nie znaleziono pasujących wyników
                </div>
              )}
        </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-[1200px] mx-auto mt-6 px-4 text-center text-sm text-gray-500">
        © 2025 mPrawo • HackNation 2025
      </footer>
      </main>
    </div>
  )
}
