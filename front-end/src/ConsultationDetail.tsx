import { useState, useEffect } from 'react'
import { Consultation } from './types'

interface ConsultationDetailProps {
  item: Consultation
  isLoggedIn: boolean
  onBack: () => void
  onLoginClick?: () => void
}

export default function ConsultationDetail({ item, isLoggedIn, onBack, onLoginClick }: ConsultationDetailProps) {
  const isPreConsultation = item.type === 'pre'
  
  // Likes state - load from localStorage
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  
  useEffect(() => {
    // Load liked status
    try {
      const stored = localStorage.getItem('liked-pre-consultations')
      if (stored) {
        const likedIds = JSON.parse(stored) as number[]
        setIsLiked(likedIds.includes(item.id))
      }
    } catch (error) {
      console.warn('Failed to load liked status:', error)
    }
    
    // Load like count
    try {
      const storedCounts = localStorage.getItem('pre-consultation-like-counts')
      if (storedCounts) {
        const counts = JSON.parse(storedCounts) as Record<number, number>
        setLikeCount(counts[item.id] || 0)
      }
    } catch (error) {
      console.warn('Failed to load like count:', error)
    }
  }, [item.id])
  
  const toggleLike = () => {
    if (!isLoggedIn || !isPreConsultation) {
      return
    }
    
    // Sprawdź aktualny stan z localStorage (źródło prawdy)
    try {
      const stored = localStorage.getItem('liked-pre-consultations')
      const likedIds = stored ? (JSON.parse(stored) as number[]) : []
      const wasLiked = likedIds.includes(item.id)
      const newIsLiked = !wasLiked
      
      // Update liked list in localStorage
      const newLikedIds = newIsLiked 
        ? [...likedIds.filter(id => id !== item.id), item.id] // Usuń duplikaty i dodaj
        : likedIds.filter(id => id !== item.id)
      localStorage.setItem('liked-pre-consultations', JSON.stringify(newLikedIds))
      
      // Update like count - sprawdzamy STARY stan (wasLiked)
      const storedCounts = localStorage.getItem('pre-consultation-like-counts')
      const counts = storedCounts ? (JSON.parse(storedCounts) as Record<number, number>) : {}
      const currentCount = counts[item.id] || 0
      const newCount = currentCount + (wasLiked ? -1 : 1)
      const finalCount = Math.max(0, newCount)
      
      counts[item.id] = finalCount
      localStorage.setItem('pre-consultation-like-counts', JSON.stringify(counts))
      
      // Update state
      setIsLiked(newIsLiked)
      setLikeCount(finalCount)
    } catch (error) {
      console.warn('Failed to toggle like:', error)
    }
  }
  
  // Comments state for pre-consultations
  const [comments, setComments] = useState<string[]>([
    'To jest przykładowy komentarz obywatela dotyczący tej pre-konsultacji. Uważam, że regulacja powinna uwzględniać małe i średnie przedsiębiorstwa.',
    'Zgadzam się z kierunkiem zmian. Ważne, żeby nie wprowadzać zbyt restrykcyjnych wymogów na starcie.'
  ])
  const [newComment, setNewComment] = useState('')

  const handleAddComment = () => {
    if (newComment.trim().length > 0) {
      setComments([...comments, newComment.trim()])
      setNewComment('')
    }
  }

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

        {/* Header - Title, Category, Deadline */}
        <header className="mb-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex-1">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${
                isPreConsultation 
                  ? 'bg-amber-100 text-amber-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {isPreConsultation ? 'Pre-konsultacje' : 'Otwarte konsultacje'}
              </span>
              <div className="flex items-start gap-3">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1 flex-1">
                  {item.title}
                </h1>
                {/* Like button and counter - tylko dla prekonsultacji */}
                {isPreConsultation && (
                  <div className="mt-1">
                    {isLoggedIn ? (
                      <button
                        onClick={toggleLike}
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                        aria-label={isLiked ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
                        type="button"
                      >
                        <svg
                          className={`w-6 h-6 transition-colors ${isLiked ? 'text-red-500 fill-current' : 'text-gray-400'}`}
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
                        <span className="text-base font-medium">{likeCount}</span>
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-2 text-gray-600">
                        <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span className="text-base font-medium">{likeCount}</span>
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                <span className="text-gray-600">
                  Branża: <span className="font-semibold text-gray-900">{item.category}</span>
                </span>
                <span className="text-gray-600">
                  Do kiedy: <span className="font-bold text-gray-900">{item.deadline}</span>
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Timeline Section - Horizontal */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Ścieżka procesu
          </h2>
          
          {/* Horizontal Timeline */}
          <div className="relative">
            <div className="overflow-x-auto pb-4">
              <div className="flex items-start min-w-max">
                {reversedSteps.map((step, index) => {
                  const isLastStep = index === reversedSteps.length - 1
                  
                  return (
                    <div key={index} className="flex items-start">
                      {/* Step */}
                      <div className="flex flex-col items-center">
                        {/* Circle indicator */}
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 bg-gray-900 border-gray-900">
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
                          <p className={`text-sm font-medium ${isLastStep ? 'text-gray-900' : 'text-gray-700'}`}>
                            {step}
                          </p>
                          {isLastStep && (
                            <span className="inline-block mt-1 text-xs text-gray-600 font-semibold">
                              Aktualny etap
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Connecting line */}
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

        {/* Opis Section */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Opis</h2>
          <div className="bg-white/60 rounded-xl p-5">
            <p className="text-gray-700 leading-relaxed">{item.description}</p>
          </div>
        </section>

        {/* Cele, Założenia, Skutki - Horizontal Row */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Cele */}
            <div className="bg-white/60 rounded-xl p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                Cele
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">{item.goals}</p>
            </div>
            
            {/* Założenia */}
            <div className="bg-white/60 rounded-xl p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                Założenia
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">{item.assumptions}</p>
            </div>
            
            {/* Skutki */}
            <div className="bg-white/60 rounded-xl p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                Skutki
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">{item.impacts}</p>
            </div>
          </div>
        </section>

        {/* Comments Section for Pre-konsultacje only */}
        {isPreConsultation && (
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Komentarze</h2>
            
            {/* Comments List */}
            <div className="space-y-3 mb-4">
              {comments.map((comment, index) => (
                <div key={index} className="bg-white/60 rounded-xl px-4 py-3">
                  <p className="text-sm text-gray-700">{comment}</p>
                </div>
              ))}
            </div>

            {/* Add Comment Form */}
            {isLoggedIn ? (
              <div className="bg-white/60 rounded-xl p-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Napisz swój komentarz..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent resize-none"
                  rows={3}
                />
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={handleAddComment}
                    disabled={newComment.trim().length === 0}
                    className="inline-flex items-center justify-center rounded-full bg-gray-900 px-5 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Dodaj komentarz
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white/40 rounded-xl px-4 py-3 text-center">
                <p className="text-sm text-gray-600 mb-3">
                  Aby dodać komentarz, zaloguj się.
                </p>
                <button
                  onClick={onLoginClick}
                  className="inline-flex items-center justify-center rounded-full bg-[#dc143c] hover:bg-[#b91234] px-6 py-2.5 text-sm font-semibold text-white transition-colors shadow-sm"
                >
                  Zaloguj się
                </button>
              </div>
            )}
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="max-w-[900px] mx-auto mt-6 px-4 text-center text-sm text-gray-500">
        © 2025 Obywatelski Portal • HackNation 2025
      </footer>
    </div>
  )
}

