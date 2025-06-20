import { type NextRequest, NextResponse } from "next/server"
import { UrlShortener } from "@/lib/url-shortner"

export async function POST(request: NextRequest) {
  console.log("Shorten API called")

  try {
    // Parse request body
    let body
    try {
      body = await request.json()
      console.log("Request body:", body)
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError)
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }

    const { url, custom_alias, expires_at } = body

    if (!url) {
      console.log("No URL provided")
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    console.log("Processing URL:", url)

    // Parse expiration date if provided
    let expiresAt: Date | undefined
    if (expires_at) {
      expiresAt = new Date(expires_at)
      if (isNaN(expiresAt.getTime())) {
        return NextResponse.json({ error: "Invalid expiration date" }, { status: 400 })
      }
    }

    // Create short URL
    const result = await UrlShortener.createShortUrl(url, custom_alias, expiresAt)
    console.log("UrlShortener result:", result)

    if (!result.success) {
      console.log("UrlShortener failed:", result.error)
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    console.log("Successfully created short URL:", result.data)
    return NextResponse.json(result.data, { status: 200 })
  } catch (error) {
    console.error("Unexpected error in shorten API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
