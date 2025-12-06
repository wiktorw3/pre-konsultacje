import { useMemo } from 'react'
import QRCode from 'react-qr-code'
import mobywatelLogo from './assets/mobywatel-logo.png'

interface LoginScreenProps {
  onBack: () => void
  onLoginSuccess: () => void
}

export default function LoginScreen({ onBack, onLoginSuccess }: LoginScreenProps) {
  // Generate a random session ID for the QR code
  const sessionId = useMemo(() => Math.random().toString(36).slice(2), [])
  const qrValue = `mobywatel://login?session=${sessionId}`

  const steps = [
    'Zaloguj się do aplikacji mObywatel.',
    <>W dolnym menu aplikacji wybierz przycisk <strong>Kod QR</strong>.</>,
    <>Wybierz przycisk <strong>Zeskanuj kod QR</strong>.</>,
    'Zeskanuj aplikacją kod QR z tego ekranu.',
    <>W aplikacji wybierz przycisk <strong>Udostępnij dane</strong>, aby przejść do usługi.</>,
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-[1000px] mx-auto">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Wróć
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8 md:py-12">
        <div className="max-w-[1000px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Left Column - QR Code */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
              {/* mObywatel Logo */}
              <div className="flex justify-center mb-6">
                <img 
                  src={mobywatelLogo} 
                  alt="mObywatel" 
                  className="h-14 w-auto"
                />
              </div>

              {/* QR Code */}
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white rounded-xl border-2 border-gray-100">
                  <QRCode
                    value={qrValue}
                    size={200}
                    level="M"
                    className="w-48 h-48 md:w-52 md:h-52"
                  />
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">
                  Kod QR wygaśnie za: <span className="font-semibold text-gray-900">4:51</span>
                </p>
                {/* Progress Bar */}
                <div className="max-w-xs mx-auto">
                  <div className="h-1.5 w-full rounded-full bg-gray-200">
                    <div className="h-1.5 rounded-full bg-blue-500 w-3/5 transition-all"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Instructions */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-3">
                  Aplikacja mObywatel
                </h1>
                <p className="text-gray-600">
                  Aby potwierdzić swoją tożsamość, zeskanuj kod QR za pomocą aplikacji mObywatel.
                </p>
              </div>

              {/* Steps List */}
              <ol className="space-y-4">
                {steps.map((step, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-gray-900 text-white text-sm font-semibold">
                      {index + 1}
                    </span>
                    <span className="text-gray-700 pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>

              {/* Simulate Login Button */}
              <button
                onClick={onLoginSuccess}
                className="mt-6 inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
              >
                Symuluj zalogowanie
              </button>

              {/* Info Text */}
              <p className="text-xs text-gray-500 mt-4">
                Nie masz jeszcze aplikacji mObywatel?{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  Pobierz aplikację
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-[1000px] mx-auto text-center text-xs text-gray-500">
          © 2025 Obywatelski Portal • Logowanie przez mObywatel
        </div>
      </footer>
    </div>
  )
}

