import { type NextRequest, NextResponse } from "next/server"
import { UrlShortener } from "@/lib/url-shortner"

export async function GET(request: NextRequest, { params }: { params: { shortCode: string } }) {
  try {
    const { shortCode } = params

    if (!shortCode) {
      return NextResponse.json({ error: "Short code is required" }, { status: 400 })
    }

    const result = await UrlShortener.getUrlStats(shortCode)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 404 })
    }

    return NextResponse.json(result.data)
  } catch (error) {
    console.error("Error in stats API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
