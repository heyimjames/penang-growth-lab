const API_BASE = "https://www.usenoreply.com/api"

// Token storage helpers
export async function getStoredToken(): Promise<string | null> {
  return new Promise((resolve) => {
    chrome.storage.local.get(["access_token"], (result) => {
      resolve(result.access_token || null)
    })
  })
}

export async function storeTokens(accessToken: string, refreshToken: string, user: { id: string; email: string }): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.set({
      access_token: accessToken,
      refresh_token: refreshToken,
      user: user,
    }, resolve)
  })
}

export async function clearTokens(): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.remove(["access_token", "refresh_token", "user"], resolve)
  })
}

export async function getStoredUser(): Promise<{ id: string; email: string } | null> {
  return new Promise((resolve) => {
    chrome.storage.local.get(["user"], (result) => {
      resolve(result.user || null)
    })
  })
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = await getStoredToken()

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options?.headers as Record<string, string>,
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }))
    throw new Error(error.error || `HTTP ${response.status}`)
  }

  return response.json()
}

export interface SessionResponse {
  user: { id: string; email: string } | null
}

export interface Case {
  id: string
  title: string
  company_name: string | null
  company_domain: string | null
  status: string
  confidence_score: number | null
  identified_issues: string[] | null
  legal_basis: string | null
  created_at: string
  updated_at: string
}

export interface CaseNote {
  id: string
  case_id: string
  content: string
  source: string
  created_at: string
}

export interface LegalReference {
  title: string
  description: string
  source: string
  relevance: "high" | "medium" | "low"
}

export interface CompanyIntel {
  name: string
  domain: string
  complaint_channels: string[]
  response_time: string | null
  success_rate: number | null
}

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

export interface SuggestResponseResult {
  suggestion: string
  tone: "firm" | "polite" | "escalation"
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  user: { id: string; email: string }
}

export const api = {
  // Auth
  getSession: () => fetchApi<SessionResponse>("/auth/session"),

  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Login failed" }))
      throw new Error(error.error || `HTTP ${response.status}`)
    }

    return response.json()
  },

  // Cases
  getCases: () => fetchApi<Case[]>("/cases"),
  getCase: (id: string) => fetchApi<Case>(`/cases/${id}`),

  // Case Notes
  addNote: (caseId: string, content: string) =>
    fetchApi<CaseNote>(`/cases/${caseId}/notes`, {
      method: "POST",
      body: JSON.stringify({ content, source: "extension" }),
    }),

  // Legal Research
  searchLegal: (query: string) =>
    fetchApi<{ references: LegalReference[] }>(`/research/legal?query=${encodeURIComponent(query)}`),

  // Company Intel
  getCompanyIntel: (domain: string) =>
    fetchApi<CompanyIntel>(`/research/company?domain=${encodeURIComponent(domain)}`),

  // AI Chat / Response Suggestions
  suggestResponse: (companyMessage: string, tone: string, caseId?: string) =>
    fetchApi<SuggestResponseResult>("/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: `You are helping a consumer respond to a company message. Generate a ${tone} response that asserts their consumer rights professionally. Keep it concise but firm.`,
          },
          {
            role: "user",
            content: `The company said: "${companyMessage}"\n\nSuggest a ${tone} response I can send back.`,
          },
        ],
        caseId,
      }),
    }),

  // Credits
  getCredits: () => fetchApi<{ credits: number }>("/credits"),
}
