// Penang Growth Lab Types

// Tool tracking types
export interface ToolUsageEvent {
  toolId: string
  toolName: string
  category: string
  timestamp: string
}

// Calculator result types
export interface CalculatorResult {
  value: number
  formatted: string
  breakdown?: Record<string, number>
}

// AI Generation types
export interface GenerationRequest {
  product?: string
  brand?: string
  tone?: string
  platform?: string
  audience?: string
}

export interface GeneratedCopy {
  headline: string
  body: string
  cta?: string
}

// Analysis types
export interface AnalysisResult {
  score: number
  feedback: string[]
  suggestions: string[]
}
