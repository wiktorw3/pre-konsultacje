import { useState } from 'react'
import LandingPage from './PreKonsultacje'
import LoginScreen from './LoginScreen'
import BillProjectDetail from './BillProjectDetail'
import ConsultationDetail from './ConsultationDetail'
import { Bill, Consultation } from './types'
import { AccessibilityWidget } from './accessibility/AccessibilityWidget'

type ViewType = 'landing' | 'login' | 'detail' | 'consultationDetail'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentView, setCurrentView] = useState<ViewType>('landing')
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null)
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null)

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
    setSelectedBill(null)
    setSelectedConsultation(null)
  }

  const handleBillClick = (bill: Bill) => {
    setSelectedBill(bill)
    setCurrentView('detail')
  }

  const handleConsultationClick = (consultation: Consultation) => {
    setSelectedConsultation(consultation)
    setCurrentView('consultationDetail')
  }

  return (
    <>
      {currentView === 'login' ? (
        <LoginScreen onBack={handleBack} onLoginSuccess={handleLoginSuccess} />
      ) : currentView === 'detail' && selectedBill ? (
        <BillProjectDetail item={selectedBill} onBack={handleBack} />
      ) : currentView === 'consultationDetail' && selectedConsultation ? (
        <ConsultationDetail 
          item={selectedConsultation} 
          isLoggedIn={isLoggedIn}
          onBack={handleBack} 
        />
      ) : (
        <LandingPage
          isLoggedIn={isLoggedIn}
          onLoginClick={handleLoginClick}
          onLogout={handleLogout}
          onBillClick={handleBillClick}
          onConsultationClick={handleConsultationClick}
        />
      )}
      <AccessibilityWidget />
    </>
  )
}

export default App
