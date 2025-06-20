import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { UrlShortener } from "@/lib/url-shortner"

interface RedirectPageProps {
  params: {
    shortCode: string
  }
}

export default async function RedirectPage({ params }: RedirectPageProps) {
  const { shortCode } = params

  // Get the original URL
  const result = await UrlShortener.getOriginalUrl(shortCode)

  if (!result.success || !result.data) {
    // Return a 404 page for invalid short codes
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Not Found</h1>
          <p className="text-gray-600 mb-8">The short URL you're looking for doesn't exist or has expired.</p>
          <a href="/" className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
            Create a Short URL
          </a>
        </div>
      </div>
    )
  }

  // Record the click (in a real app, you might want to do this in middleware)
  const headersList = headers()
  const userAgent = (await headersList).get("user-agent") || undefined
  const referer = (await headersList).get("referer") || undefined
  const forwardedFor = (await headersList).get("x-forwarded-for")
  const ipAddress = forwardedFor ? forwardedFor.split(",")[0] : undefined

  // Record click asynchronously
  UrlShortener.recordClick(shortCode, ipAddress, userAgent, referer)

  // Redirect to the original URL
  redirect(result.data.original_url)
}
