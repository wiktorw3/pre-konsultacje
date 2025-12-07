import { useState, useEffect } from 'react'
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
    name: 'Ustawa o rynku kryptoaktywów',
    date: '05.12.2025',
    status: 'Weto Prezydenta',
    type: 'ustawa',
    summary: 'Wdrożenie unijnego rozporządzenia MiCA, regulującego rynek kryptoaktywów w Polsce zgodnie ze standardami UE.',
    goals: [
      'Wdrożenie MiCA i ujednolicenie zasad w UE',
      'Ochrona inwestorów przed scamami i oszustwami',
      'Zwiększenie nadzoru nad rynkiem kryptoaktywów'
    ],
    assumptions: [
      'Licencjonowanie dostawców usług krypto przez KNF',
      'Pełne KYC/AML i obowiązki raportowania',
      'Kary do 20 mln zł lub 5% obrotu'
    ],
    impacts: [
      'Opóźnienie regulacji = dalsze ryzyko scamów',
      'Dominacja giełd z licencjami zagranicznymi',
      'Osłabienie narzędzi AML i walki z praniem pieniędzy'
    ],
    zwolennicy: ['Rząd KO+Lewica', 'KNF', 'Ministerstwo Finansów'],
    przeciwnicy: ['Prezydent Karol Nawrocki', 'Konfederacja', 'Część społeczności krypto'],
    timelineSteps: ['Weto Prezydenta podtrzymane', 'Głosowanie w Sejmie', 'Senat', 'Inicjatywa']
  },
  {
    id: 2,
    name: 'Ustawa budżetowa na rok 2026',
    date: '05.12.2025',
    status: 'W Sejmie',
    type: 'ustawa',
    summary: 'Ustawa budżetowa z planowanym deficytem 271,7 mld zł, określająca dochody i wydatki państwa na rok 2026.',
    goals: [
      'Stymulowanie gospodarki po stagnacji',
      'Finansowanie kluczowych inwestycji i obronności',
      'Zwiększenie wpływów z VAT i akcyzy'
    ],
    assumptions: [
      'Dochody budżetu: 647,2 mld zł',
      'Wydatki: 918,9 mld zł',
      'Deficyt: 271,7 mld zł'
    ],
    impacts: [
      'Rekordowy deficyt i wzrost długu publicznego',
      'Wyższe wydatki na 800+ i służbę zdrowia',
      'Ryzyko inflacji w 2026 r.'
    ],
    zwolennicy: ['Koalicja rządząca', 'Ministerstwo Finansów', 'Związki zawodowe'],
    przeciwnicy: ['Opozycja (PiS, Konfederacja)', 'Ekonomiści ostrzegający przed przegrzaniem'],
    timelineSteps: ['Skierowana do Senatu', 'Głosowanie w Sejmie', 'Inicjatywa']
  },
  {
    id: 3,
    name: 'Ustawa o zmianie ustawy – Prawo o ruchu drogowym oraz niektórych innych ustaw',
    date: '02.12.2025',
    status: 'Podpisana',
    type: 'ustawa',
    summary: 'Zaostrzenie kar za przekroczenie prędkości, umożliwienie uzyskania prawa jazdy od 17 lat oraz obowiązkowy kask dla rowerzystów poniżej 18 roku życia.',
    goals: [
      'Zwiększenie bezpieczeństwa na drogach',
      'Ułatwienie mobilności młodych kierowców',
      'Redukcja biurokracji w rejestracji pojazdów'
    ],
    assumptions: [
      'Zatrzymanie prawa jazdy za +50 km/h w terenie zabudowanym',
      'Prawo jazdy kat. B od 17 lat (z opiekunem)',
      'Rejestracja pojazdu online'
    ],
    impacts: [
      'Mniej śmiertelnych wypadków',
      'Łatwiejszy dostęp do prawa jazdy dla młodzieży',
      'Mniej kolejek w wydziałach komunikacji'
    ],
    zwolennicy: ['Prezydent Karol Nawrocki', 'Ministerstwo Infrastruktury', 'Policja drogowa'],
    przeciwnicy: ['Kierowcy (surowsze kary)', 'Rodzice rowerzystów'],
    timelineSteps: ['Podpisana', 'Senat', 'Sejm', 'Inicjatywa']
  },
  {
    id: 4,
    name: 'Poselski projekt ustawy o zmianie ustawy o ochronie przyrody',
    date: '04.12.2025',
    status: 'Złożona',
    type: 'ustawa',
    summary: 'Uproszczenie procedur wycinki drzew oraz poszerzenie katalogu gatunków inwazyjnych i łownych.',
    goals: [
      'Przyspieszenie inwestycji i decyzji administracyjnych',
      'Aktualizacja listy gatunków chronionych',
      'Ułatwienia dla samorządów i inwestorów'
    ],
    assumptions: [
      'Skrócenie terminu sprzeciwu do wycinki do 35 dni',
      'Dodanie kormorana, żurawia i bobra do gatunków łownych',
      'Zmiany w zarządzeniach parków narodowych'
    ],
    impacts: [
      'Szybsze realizacje inwestycji infrastrukturalnych',
      'Kontrowersje ekologiczne i protesty organizacji',
      'Ryzyko utraty bioróżnorodności'
    ],
    zwolennicy: ['Konfederacja', 'Samorządy', 'Przedsiębiorcy budowlani'],
    przeciwnicy: ['Organizacje ekologiczne', 'Fundacja PRIMUM', 'Ministerstwo Klimatu'],
    timelineSteps: ['Złożona', 'Inicjatywa']
  },
  {
    id: 5,
    name: 'Ustawa o szczególnych rozwiązaniach służących wsparciu górnictwa węgla kamiennego',
    date: '05.12.2025',
    status: 'W Sejmie',
    type: 'ustawa',
    summary: 'Ustawa umożliwiająca dalsze wsparcie dla PGG i JSW oraz likwidację nierentownych kopalń z osłonami dla górników.',
    goals: [
      'Kontrolowana likwidacja kopalń do 2030-2034',
      'Ochrona miejsc pracy i transformacja Śląska',
      'Zakończenie dopłat bieżących do strat'
    ],
    assumptions: [
      'Finansowanie likwidacji z budżetu państwa',
      'Osłony socjalne i przekwalifikowania',
      'Rekultywacja terenów poprzemysłowych'
    ],
    impacts: [
      'Koszty dla budżetu rzędu kilkudziesięciu mld zł',
      'Nowe miejsca pracy w zielonej energetyce',
      'Końcowy etap odchodzenia od węgla'
    ],
    zwolennicy: ['Związki zawodowe (Solidarność, Kadra)', 'Prezydent Karol Nawrocki', 'Rząd'],
    przeciwnicy: ['Organizacje ekologiczne', 'Część ekonomistów', 'Mieszkańcy obawiający się utraty pracy'],
    timelineSteps: ['Skierowana do Senatu', 'Głosowanie w Sejmie', 'Inicjatywa']
  }
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
      return 'bg-[#dc143c] text-white'
    case 'Podpisana':
      return 'bg-[#3c9d5b] text-white'
    case 'W Senacie':
    case 'W Sejmie':
    case 'Złożona':
      return 'bg-gray-900 text-white'
    default:
      return 'bg-gray-900 text-white'
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
      return 'Skierowana do Sejmu'
    case 'W Sejmie':
      return 'Skierowana do Senatu'
    case 'W Senacie':
      return 'Skierowana do Prezydenta'
    case 'Podpisana':
      return 'Podpisana przez Prezydenta'
    case 'Weto Prezydenta':
      return 'Prezydenckie Weto'
    default:
      return status
  }
}

// Train visualization component
const BillTrain = ({ status }: { status: BillStatus }) => {
  const completedStages = getCompletedStages(status)
  const isVetoed = status === 'Weto Prezydenta'
  const isSigned = status === 'Podpisana'
  const isInProgress = !isVetoed && !isSigned
  
  // Destination stage index (where the bill is heading to)
  const destinationStageIndex = completedStages
  
  return (
    <div className="flex items-center flex-wrap gap-y-1">
      {allStages.map((stage, index) => {
        const isCompleted = index < completedStages
        const isDestination = index === destinationStageIndex && isInProgress
        const isLast = index === allStages.length - 1
        
        // Determine colors
        let bgColor = 'bg-gray-100 text-gray-400'
        
        if (isCompleted) {
          // Completed stages
          if (isLast && isVetoed) {
            bgColor = 'bg-[#dc143c] text-white'
          } else {
            bgColor = 'bg-green-500 text-white'
          }
        } else if (isDestination) {
          // Destination stage (where bill is heading) is black
          bgColor = 'bg-gray-900 text-white'
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
  
  // Likes state - load from localStorage
  const [likedPreConsultations, setLikedPreConsultations] = useState<Set<number>>(new Set())
  const [likeCounts, setLikeCounts] = useState<Record<number, number>>({})
  
  useEffect(() => {
    try {
      const stored = localStorage.getItem('liked-pre-consultations')
      if (stored) {
        const likedIds = JSON.parse(stored) as number[]
        setLikedPreConsultations(new Set(likedIds))
      }
      
      // Load like counts
      const storedCounts = localStorage.getItem('pre-consultation-like-counts')
      if (storedCounts) {
        setLikeCounts(JSON.parse(storedCounts))
      } else {
        // Initialize with default counts (0) for all pre-consultations
        const initialCounts: Record<number, number> = {}
        preConsultations.forEach(consultation => {
          initialCounts[consultation.id] = 0
        })
        setLikeCounts(initialCounts)
        localStorage.setItem('pre-consultation-like-counts', JSON.stringify(initialCounts))
      }
    } catch (error) {
      console.warn('Failed to load liked pre-consultations:', error)
    }
  }, [])
  
  const toggleLike = (consultationId: number, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent opening consultation details
    
    if (!isLoggedIn) {
      return // Don't allow liking if not logged in
    }
    
    // Sprawdź aktualny stan z localStorage (źródło prawdy) - zapobiega podwójnemu kliknięciu
    try {
      const stored = localStorage.getItem('liked-pre-consultations')
      const likedIds = stored ? (JSON.parse(stored) as number[]) : []
      const wasLiked = likedIds.includes(consultationId)
      const newIsLiked = !wasLiked
      
      // Update liked list in localStorage
      const newLikedIds = newIsLiked 
        ? [...likedIds.filter(id => id !== consultationId), consultationId] // Usuń duplikaty i dodaj
        : likedIds.filter(id => id !== consultationId)
      localStorage.setItem('liked-pre-consultations', JSON.stringify(Array.from(new Set(newLikedIds))))
      
      // Update like count - sprawdzamy STARY stan (wasLiked)
      const storedCounts = localStorage.getItem('pre-consultation-like-counts')
      const counts = storedCounts ? (JSON.parse(storedCounts) as Record<number, number>) : {}
      const currentCount = counts[consultationId] || 0
      const newCount = currentCount + (wasLiked ? -1 : 1)
      const finalCount = Math.max(0, newCount)
      
      counts[consultationId] = finalCount
      localStorage.setItem('pre-consultation-like-counts', JSON.stringify(counts))
      
      // Update state
      setLikedPreConsultations(new Set(newLikedIds))
      setLikeCounts({ ...counts })
    } catch (error) {
      console.warn('Failed to toggle like:', error)
    }
  }

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
            {(consultationType === 'Prekonsultacje' ? preConsultations : consultations).map((item) => {
              const isLiked = consultationType === 'Prekonsultacje' && likedPreConsultations.has(item.id)
              const likeCount = consultationType === 'Prekonsultacje' ? (likeCounts[item.id] || 0) : 0
              
              return (
                <div
                  key={item.id}
                  className="flex-shrink-0 w-64 bg-white rounded-xl p-4 hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm"
                >
                  <div
                    onClick={() => onConsultationClick(item)}
                    className="cursor-pointer"
                  >
                    <h4 className="font-semibold text-gray-900 text-sm leading-snug">
                      {item.title}
                    </h4>
                    <div className="mt-2 flex items-center gap-2 text-xs">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-900 text-white font-medium">
                        {item.category}
                      </span>
                      <span className="text-gray-500 whitespace-nowrap">
                        Do kiedy: <span className="font-bold text-gray-700">{item.deadline}</span>
                      </span>
                    </div>
                  </div>
                  
                  {/* Like counter/button - zawsze widoczny, klikalny tylko dla zalogowanych, poniżej po prawej */}
                  {consultationType === 'Prekonsultacje' && (
                    <div className="mt-2 flex justify-end">
                      {isLoggedIn ? (
                        <button
                          onClick={(e) => toggleLike(item.id, e)}
                          className="inline-flex items-center gap-1 text-gray-600 bg-white/80 rounded-full px-2 py-1 shadow-sm hover:bg-white transition-colors"
                          aria-label={isLiked ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
                          type="button"
                        >
                          <svg 
                            className={`w-4 h-4 transition-colors ${isLiked ? 'text-red-500 fill-current' : 'text-gray-400'}`}
                            fill={isLiked ? 'currentColor' : 'none'}
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                          <span className="text-xs font-medium">{likeCount}</span>
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-gray-600 bg-white/80 rounded-full px-2 py-1 shadow-sm">
                          <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <span className="text-xs font-medium">{likeCount}</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
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
            Poznaj przebieg prac legislacyjnych - wybierz ustawę, aby zobaczyć szczegóły
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
