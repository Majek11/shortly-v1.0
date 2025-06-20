import Database from "better-sqlite3"
import path from "path"
import fs from "fs"

// Ensure data directory exists
const dataDir = path.join(process.cwd(), "data")
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const dbPath = path.join(dataDir, "urls.db")
console.log("Database path:", dbPath)

// Create database connection
const db = new Database(dbPath)

// Enable WAL mode for better performance
db.pragma("journal_mode = WAL")

// Create tables
const createTables = () => {
  console.log("Creating database tables...")

  try {
    // URLs table
    db.exec(`
      CREATE TABLE IF NOT EXISTS urls (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        short_code TEXT UNIQUE NOT NULL,
        original_url TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        expires_at DATETIME,
        clicks INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT 1
      )
    `)

    // Clicks table for analytics
    db.exec(`
      CREATE TABLE IF NOT EXISTS clicks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        short_code TEXT NOT NULL,
        clicked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        ip_address TEXT,
        user_agent TEXT,
        referer TEXT,
        country TEXT,
        FOREIGN KEY (short_code) REFERENCES urls (short_code)
      )
    `)

    // Create indexes for better performance
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_urls_short_code ON urls(short_code);
      CREATE INDEX IF NOT EXISTS idx_clicks_short_code ON clicks(short_code);
      CREATE INDEX IF NOT EXISTS idx_clicks_clicked_at ON clicks(clicked_at);
    `)

    console.log("Database tables created successfully")
  } catch (error) {
    console.error("Error creating database tables:", error)
    throw error
  }
}

// Initialize database
createTables()

export default db
