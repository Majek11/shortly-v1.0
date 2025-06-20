import { type NextRequest, NextResponse } from "next/server"
import { UrlShortener } from "@/lib/url-shortner"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    const result = await UrlShortener.getAllUrls(limit)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json(result.data)
  } catch (error) {
    console.error("Error in urls API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
