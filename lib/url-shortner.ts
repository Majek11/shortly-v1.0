import db from "./database"

export interface UrlRecord {
  id: number
  short_code: string
  original_url: string
  created_at: string
  expires_at?: string
  clicks: number
  is_active: boolean
}

export interface ClickRecord {
  id: number
  short_code: string
  clicked_at: string
  ip_address?: string
  user_agent?: string
  referer?: string
  country?: string
}

export class UrlShortener {
  private static generateShortCode(length = 6): string {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let result = ""
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  private static isValidUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  static async createShortUrl(
    originalUrl: string,
    customAlias?: string,
    expiresAt?: Date,
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    console.log("createShortUrl called with:", { originalUrl, customAlias, expiresAt })

    try {
      // Validate URL
      if (!this.isValidUrl(originalUrl)) {
        console.log("Invalid URL format:", originalUrl)
        return { success: false, error: "Invalid URL format" }
      }

      // Generate or use custom short code
      let shortCode = customAlias || this.generateShortCode()
      console.log("Generated short code:", shortCode)

      // Ensure short code is unique
      let attempts = 0
      while (attempts < 10) {
        const existing = db.prepare("SELECT id FROM urls WHERE short_code = ?").get(shortCode)
        if (!existing) break

        if (customAlias) {
          return { success: false, error: "Custom alias already exists" }
        }

        shortCode = this.generateShortCode()
        attempts++
      }

      if (attempts >= 10) {
        return { success: false, error: "Unable to generate unique short code" }
      }

      console.log("Final short code:", shortCode)

      // Insert into database
      const stmt = db.prepare(`
        INSERT INTO urls (short_code, original_url, expires_at)
        VALUES (?, ?, ?)
      `)

      const result = stmt.run(shortCode, originalUrl, expiresAt?.toISOString() || null)
      console.log("Database insert result:", result)

      const urlRecord = db.prepare("SELECT * FROM urls WHERE id = ?").get(result.lastInsertRowid) as UrlRecord
      console.log("Retrieved URL record:", urlRecord)

      const responseData = {
        id: urlRecord.id,
        short_url: shortCode,
        short_code: shortCode,
        original_url: originalUrl,
        created_at: urlRecord.created_at,
        expires_at: urlRecord.expires_at,
        clicks: 0,
        is_active: true,
      }

      console.log("Returning response data:", responseData)
      return {
        success: true,
        data: responseData,
      }
    } catch (error) {
      console.error("Error creating short URL:", error)
      return { success: false, error: `Database error: ${error instanceof Error ? error.message : "Unknown error"}` }
    }
  }

  static async getOriginalUrl(shortCode: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const urlRecord = db
        .prepare(`
        SELECT * FROM urls 
        WHERE short_code = ? AND is_active = 1
      `)
        .get(shortCode) as UrlRecord

      if (!urlRecord) {
        return { success: false, error: "Short URL not found" }
      }

      // Check if expired
      if (urlRecord.expires_at && new Date(urlRecord.expires_at) < new Date()) {
        return { success: false, error: "Short URL has expired" }
      }

      return {
        success: true,
        data: {
          original_url: urlRecord.original_url,
          short_code: shortCode,
        },
      }
    } catch (error) {
      console.error("Error getting original URL:", error)
      return { success: false, error: "Internal server error" }
    }
  }

  static async recordClick(shortCode: string, ipAddress?: string, userAgent?: string, referer?: string): Promise<void> {
    try {
      // Record the click
      const clickStmt = db.prepare(`
        INSERT INTO clicks (short_code, ip_address, user_agent, referer)
        VALUES (?, ?, ?, ?)
      `)
      clickStmt.run(shortCode, ipAddress, userAgent, referer)

      // Update click count
      const updateStmt = db.prepare(`
        UPDATE urls SET clicks = clicks + 1 WHERE short_code = ?
      `)
      updateStmt.run(shortCode)
    } catch (error) {
      console.error("Error recording click:", error)
    }
  }

  static async getUrlStats(shortCode: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const urlRecord = db
        .prepare(`
        SELECT * FROM urls WHERE short_code = ?
      `)
        .get(shortCode) as UrlRecord

      if (!urlRecord) {
        return { success: false, error: "Short URL not found" }
      }

      // Get click history
      const clicks = db
        .prepare(`
        SELECT * FROM clicks 
        WHERE short_code = ? 
        ORDER BY clicked_at DESC 
        LIMIT 100
      `)
        .all(shortCode) as ClickRecord[]

      // Get daily click stats for the last 30 days
      const dailyStats = db
        .prepare(`
        SELECT 
          DATE(clicked_at) as date,
          COUNT(*) as clicks
        FROM clicks 
        WHERE short_code = ? 
          AND clicked_at >= datetime('now', '-30 days')
        GROUP BY DATE(clicked_at)
        ORDER BY date DESC
      `)
        .all(shortCode)

      return {
        success: true,
        data: {
          short_code: shortCode,
          original_url: urlRecord.original_url,
          created_at: urlRecord.created_at,
          expires_at: urlRecord.expires_at,
          total_clicks: urlRecord.clicks,
          is_active: urlRecord.is_active,
          recent_clicks: clicks,
          daily_stats: dailyStats,
        },
      }
    } catch (error) {
      console.error("Error getting URL stats:", error)
      return { success: false, error: "Internal server error" }
    }
  }

  static async getAllUrls(limit = 50): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const urls = db
        .prepare(`
        SELECT * FROM urls 
        ORDER BY created_at DESC 
        LIMIT ?
      `)
        .all(limit) as UrlRecord[]

      return {
        success: true,
        data: urls,
      }
    } catch (error) {
      console.error("Error getting all URLs:", error)
      return { success: false, error: "Internal server error" }
    }
  }

  static async deleteUrl(shortCode: string): Promise<{ success: boolean; error?: string }> {
    try {
      const stmt = db.prepare("UPDATE urls SET is_active = 0 WHERE short_code = ?")
      const result = stmt.run(shortCode)

      if (result.changes === 0) {
        return { success: false, error: "Short URL not found" }
      }

      return { success: true }
    } catch (error) {
      console.error("Error deleting URL:", error)
      return { success: false, error: "Internal server error" }
    }
  }
}
