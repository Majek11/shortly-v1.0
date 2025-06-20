// interface ShortenUrlRequest {
//   original_url: string
//   custom_alias?: string | null
//   expires_at?: string | null
// }

// interface ShortenUrlResponse {
//   short_url: string
//   original_url: string
//   clicks: number
//   created_at: string
//   expires_at?: string | null
//   qr_code?: string | null
// }

// interface UrlStatsResponse {
//   short_url: string
//   original_url: string
//   clicks: number
//   created_at: string
//   last_clicked_at?: string | null
//   click_history: Array<{
//     timestamp: string
//     ip_address?: string
//     user_agent?: string
//     country?: string
//   }>
// }

// export class PythonApiClient {
//   private baseUrl: string
//   private apiKey?: string

//   constructor(baseUrl: string = process.env.PYTHON_API_URL || "http://localhost:8000", apiKey?: string) {
//     this.baseUrl = baseUrl.replace(/\/$/, "") // Remove trailing slash
//     this.apiKey = apiKey || process.env.PYTHON_API_KEY
//   }

//   private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
//     const url = `${this.baseUrl}${endpoint}`
//     const headers: HeadersInit = {
//       "Content-Type": "application/json",
//       ...options.headers,
//     }

//     if (this.apiKey) {
//       headers.Authorization = `Bearer ${this.apiKey}`
//     }

//     const response = await fetch(url, {
//       ...options,
//       headers,
//     })

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}))
//       throw new Error(errorData.detail || errorData.message || `HTTP ${response.status}`)
//     }

//     return response.json()
//   }

//   async shortenUrl(data: ShortenUrlRequest): Promise<ShortenUrlResponse> {
//     return this.makeRequest<ShortenUrlResponse>("/api/v1/shorten", {
//       method: "POST",
//       body: JSON.stringify(data),
//     })
//   }

//   async getUrlStats(shortCode: string): Promise<UrlStatsResponse> {
//     return this.makeRequest<UrlStatsResponse>(`/api/v1/stats/${shortCode}`)
//   }

//   async deleteUrl(shortCode: string): Promise<{ message: string }> {
//     return this.makeRequest<{ message: string }>(`/api/v1/urls/${shortCode}`, {
//       method: "DELETE",
//     })
//   }
// }

// export const pythonApi = new PythonApiClient()
