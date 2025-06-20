import { type NextRequest, NextResponse } from "next/server"
import { UrlShortener } from "@/lib/url-shortner"

export async function DELETE(request: NextRequest, { params }: { params: { shortCode: string } }) {
  try {
    const { shortCode } = params

    if (!shortCode) {
      return NextResponse.json({ error: "Short code is required" }, { status: 400 })
    }

    const result = await UrlShortener.deleteUrl(shortCode)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 404 })
    }

    return NextResponse.json({ message: "URL deleted successfully" })
  } catch (error) {
    console.error("Error in delete URL API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
