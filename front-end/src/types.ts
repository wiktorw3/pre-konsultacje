// Shared types for the application

export type BillType = 'ustawa' | 'projekt'
export type BillStatus = 'Weto Prezydenta' | 'Podpisana' | 'W Senacie' | 'W Sejmie' | 'Złożona'

export interface Bill {
  id: number
  name: string
  date: string
  status: BillStatus
  type: BillType
  summary: string
  goals: string
  assumptions: string
  impacts: string
  timelineSteps: string[]
}

// Consultation types
export type ConsultationType = 'pre' | 'consultation'

export interface Consultation {
  id: number
  type: ConsultationType
  title: string
  category: string
  deadline: string
  description: string
  goals: string
  assumptions: string
  impacts: string
  timelineSteps: string[]
}

