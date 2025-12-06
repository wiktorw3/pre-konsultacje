import { useState } from 'react'
import LandingPage from './PreKonsultacje'
import LoginScreen from './LoginScreen'

type ViewType = 'landing' | 'login'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentView, setCurrentView] = useState<ViewType>('landing')

  const handleLoginClick = () => {
    setCurrentView('login')
  }

  const handleLoginSuccess = () => {
    setIsLoggedIn(true)
    setCurrentView('landing')
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  const handleBack = () => {
    setCurrentView('landing')
  }

  if (currentView === 'login') {
    return <LoginScreen onBack={handleBack} onLoginSuccess={handleLoginSuccess} />
  }

  return (
    <LandingPage
      isLoggedIn={isLoggedIn}
      onLoginClick={handleLoginClick}
      onLogout={handleLogout}
    />
  )
}

export default App
