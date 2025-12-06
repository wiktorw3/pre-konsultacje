import { useState } from 'react'

// Types
type BillType = 'ustawa' | 'projekt'
type BillStatus = 'Veto Prezydenta' | 'Podpisana' | 'W Senacie' | 'W Sejmie' | 'Złożona'

interface Bill {
  id: number
  name: string
  date: string
  status: BillStatus
  type: BillType
}

interface Consultation {
  id: number
  title: string
  category: string
  deadline: string
}

interface LandingPageProps {
  isLoggedIn: boolean
  onLoginClick: () => void
  onLogout: () => void
}

// Mock Data
const bills: Bill[] = [
  { id: 1, name: 'Ustawa o Kryptowalutach', date: '4.12.2025', status: 'Veto Prezydenta', type: 'ustawa' },
  { id: 2, name: 'Ustawa o Ochronie Środowiska', date: '3.12.2025', status: 'Podpisana', type: 'ustawa' },
  { id: 3, name: 'Ustawa o Sztucznej Inteligencji', date: '2.12.2025', status: 'W Senacie', type: 'ustawa' },
  { id: 4, name: 'Ustawa o Cyfryzacji Urzędów', date: '1.12.2025', status: 'W Sejmie', type: 'ustawa' },
  { id: 5, name: 'Ustawa o Odnawialnych Źródłach Energii', date: '30.11.2025', status: 'Złożona', type: 'ustawa' },
  { id: 6, name: 'Projekt Reformy Edukacji', date: '4.12.2025', status: 'W Sejmie', type: 'projekt' },
  { id: 7, name: 'Projekt Ustawy o E-Zdrowiu', date: '3.12.2025', status: 'Złożona', type: 'projekt' },
  { id: 8, name: 'Projekt Zmian w Kodeksie Pracy', date: '2.12.2025', status: 'W Senacie', type: 'projekt' },
  { id: 9, name: 'Projekt Ustawy o Transporcie Publicznym', date: '1.12.2025', status: 'W Sejmie', type: 'projekt' },
]

const preConsultations: Consultation[] = [
  { id: 1, title: 'Pre-konsultacje ws. Ustawy o Kryptowalutach', category: 'Cyfryzacja', deadline: '15.12.2025' },
  { id: 2, title: 'Pre-konsultacje ws. Reformy Emerytalnej', category: 'Finanse', deadline: '18.12.2025' },
  { id: 3, title: 'Pre-konsultacje ws. Ochrony Danych', category: 'Prawo', deadline: '22.12.2025' },
]

const consultations: Consultation[] = [
  { id: 1, title: 'Konsultacje ws. Służby Zdrowia', category: 'Zdrowie', deadline: '20.12.2025' },
  { id: 2, title: 'Konsultacje ws. Programu Mieszkaniowego', category: 'Budownictwo', deadline: '25.12.2025' },
  { id: 3, title: 'Konsultacje ws. Transportu Miejskiego', category: 'Transport', deadline: '28.12.2025' },
  { id: 4, title: 'Konsultacje ws. Ochrony Klimatu', category: 'Środowisko', deadline: '30.12.2025' },
]

// Status color mapping
const getStatusStyles = (status: BillStatus): string => {
  switch (status) {
    case 'Veto Prezydenta':
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

export default function LandingPage({ isLoggedIn, onLoginClick, onLogout }: LandingPageProps) {
  const [filterType, setFilterType] = useState<BillType>('ustawa')
  const [searchQuery, setSearchQuery] = useState('')

  // Filter bills based on type and search query
  const filteredBills = bills.filter((bill) => {
    const matchesType = bill.type === filterType
    const matchesSearch = bill.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSearch
  })

  return (
    <div className="min-h-screen bg-neutral-100 py-8 px-4">
      {/* Main Container */}
      <div className="max-w-[1200px] mx-auto bg-[#dbe6c6] rounded-3xl shadow-lg p-6 md:p-10">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 pb-4 border-b border-[#c5d4a8]">
          <h2 className="text-xl font-bold text-gray-900">Obywatelski Portal</h2>
          
          {/* Right Side - Login/Profile */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                {/* User Profile Chip */}
                <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white shadow-sm hover:bg-gray-50 transition-colors">
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
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-300 bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
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
        </header>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-8">
          {/* Left Column - Bills */}
          <section>
            {/* Filters and Search Row */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-4">
              {/* Filter Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterType('ustawa')}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    filterType === 'ustawa'
                      ? 'bg-gray-900 text-white'
                      : 'bg-white text-gray-900 border border-gray-400 hover:border-gray-600'
                  }`}
                >
                  Ustawy
                </button>
                <button
                  onClick={() => setFilterType('projekt')}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    filterType === 'projekt'
                      ? 'bg-gray-900 text-white'
                      : 'bg-white text-gray-900 border border-gray-400 hover:border-gray-600'
                  }`}
                >
                  Projekty
                </button>
              </div>

              {/* Search Input */}
              <div className="relative flex-1 w-full sm:w-auto">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Szukaj po nazwie ustawy..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8fa869] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Bills List - Scrollable Container */}
            <div className="max-h-80 overflow-y-auto pr-1">
              <div className="bg-white/60 rounded-2xl overflow-hidden divide-y divide-gray-200">
              {filteredBills.length > 0 ? (
                filteredBills.map((bill) => (
                  <div
                    key={bill.id}
                    className="flex items-center justify-between p-4 hover:bg-white/80 cursor-pointer transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {bill.name}
                      </h4>
                      <p className="text-sm text-gray-500 mt-0.5">{bill.date}</p>
                    </div>
                    <span
                      className={`ml-4 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${getStatusStyles(
                        bill.status
                      )}`}
                    >
                      {bill.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500">
                  Nie znaleziono pasujących wyników
                </div>
              )}
              </div>
            </div>
          </section>

          {/* Right Column - Consultations */}
          <aside className="space-y-6">
            {/* Pre-konsultacje Section */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Pre-konsultacje
              </h3>
              <div className="space-y-3">
                {preConsultations.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white/60 rounded-xl p-4 hover:bg-white/80 cursor-pointer transition-colors"
                  >
                    <h4 className="font-semibold text-gray-900 text-sm leading-snug">
                      {item.title}
                    </h4>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#e8edd9] text-gray-700 font-medium">
                        {item.category}
                      </span>
                      <span className="text-gray-500">
                        Do kiedy: <span className="font-bold text-gray-700">{item.deadline}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Otwarte Konsultacje Section */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Otwarte Konsultacje
              </h3>
              <div className="bg-white/60 rounded-xl overflow-hidden">
                {/* Table Header */}
                <div className="hidden sm:grid grid-cols-3 gap-2 px-4 py-2 bg-white/40 text-xs font-bold text-gray-600 border-b border-gray-200">
                  <span>Konsultacja</span>
                  <span>Branża</span>
                  <span>Do kiedy?</span>
                </div>
                {/* Table Body */}
                <div className="divide-y divide-gray-200">
                  {consultations.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 hover:bg-white/80 cursor-pointer transition-colors"
                    >
                      {/* Desktop View */}
                      <div className="hidden sm:grid grid-cols-3 gap-2 items-center text-sm">
                        <span className="font-medium text-gray-900 truncate">
                          {item.title}
                        </span>
                        <span className="text-gray-600">{item.category}</span>
                        <span className="font-bold text-gray-700">{item.deadline}</span>
                      </div>
                      {/* Mobile View */}
                      <div className="sm:hidden">
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {item.title}
                        </h4>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                          <span>Branża: <span className="text-gray-700">{item.category}</span></span>
                          <span>•</span>
                          <span>Do: <span className="font-bold text-gray-700">{item.deadline}</span></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-[1200px] mx-auto mt-6 px-4 text-center text-sm text-gray-500">
        © 2025 Obywatelski Portal • HackNation 2025
      </footer>
    </div>
  )
}
