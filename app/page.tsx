"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Copy, QrCode, ArrowRight, Check, Zap } from "lucide-react"
import Link from "next/link"

export default function ShortlyLanding() {
  const [url, setUrl] = useState("")
  const [shortenedUrl, setShortenedUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleShortenUrl = async () => {
    if (!url) return

    setIsLoading(true)
    setError("")

    try {
      console.log("Sending request to shorten URL:", url)

      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      console.log("Response status:", response.status)
      console.log("Response headers:", Object.fromEntries(response.headers.entries()))

      // Get response text first to debug
      const responseText = await response.text()
      console.log("Response text:", responseText)

      // Try to parse as JSON
      let data
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error("JSON parse error:", parseError)
        console.error("Response was:", responseText)
        throw new Error("Server returned invalid response")
      }

      if (response.ok) {
        const shortUrl = `${window.location.origin}/${data.short_code}`
        setShortenedUrl(shortUrl)
        console.log("Successfully created short URL:", shortUrl)
      } else {
        const errorMessage = data.error || "Failed to shorten URL"
        setError(errorMessage)
        console.error("API Error:", errorMessage)
      }
    } catch (error) {
      console.error("Error shortening URL:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to shorten URL. Please try again."
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyLink = async () => {
    if (shortenedUrl) {
      try {
        await navigator.clipboard.writeText(shortenedUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (error) {
        console.error("Failed to copy:", error)
        // Fallback for older browsers
        const textArea = document.createElement("textarea")
        textArea.value = shortenedUrl
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand("copy")
        document.body.removeChild(textArea)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    }
  }

  const handleGenerateQR = () => {
    if (shortenedUrl) {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shortenedUrl)}`
      window.open(qrUrl, "_blank")
    }
  }

  const resetForm = () => {
    setShortenedUrl("")
    setUrl("")
    setCopied(false)
    setError("")
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex justify-around gap-[800px] items-center justify-between px-4 sm:px-6 lg:px-8 py-4 sm:py-5 bg-white animate-fade-in">
        <div className="items-center space-x-2">
          <span className="text-base sm:text-lg font-medium text-black">Shortly</span>
        </div>
        <Link
          href="#"
          className="flex items-center space-x-1 text-gray-600 hover:text-black transition-all duration-300 group"
        >
          <span className="text-sm sm:text-base">Explore More</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </header>

      <div className="flex justify-around flex-col lg:flex-row min-h-[calc(100vh-81px)] lg:gap-4 xl:gap-6">
        {/* Left Hero Section */}
        <div className="flex items-center px-4 sm:px-6 lg:px-8 py-8 lg:py-0 animate-slide-in-left">
          <div className="max-w-2xl mx-auto lg:mx-0">
            <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
              <div className="space-y-2 sm:space-y-3">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-light text-gray-400 leading-tight animate-fade-in-up">
                  Meet Your New
                </h1>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-black leading-tight animate-fade-in-up animation-delay-200">
                  URL Shortcut!
                </h2>
              </div>

              <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-lg mx-auto lg:mx-0 animate-fade-in-up animation-delay-400">
                Transform your long URLs into clean, shareable links with powerful analytics and custom options.
              </p>

              <div className="space-y-3 sm:space-y-4 animate-fade-in-up animation-delay-600">
                <Button
                  size="lg"
                  className="bg-black hover:bg-gray-800 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg group"
                >
                  <span>Simplify Your Links</span>
                  <ArrowRight className="ml-2 sm:ml-3 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
                <p className="text-sm text-gray-500 animate-pulse">Start for Free! No Card Required</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Responsive Card */}
        <div className="w-full lg:w-[420px] xl:w-[480px] flex items-center justify-center p-4 sm:p-6 lg:p-4 xl:p-6 animate-slide-in-right">
          <Card className="w-full max-w-md lg:max-w-none p-6 sm:p-8 shadow-xl border border-gray-200 bg-white rounded-2xl transition-all duration-300 hover:shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 sm:mb-8 animate-fade-in-up">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-700">Paste Your Link</h3>
              <div className="w-8 sm:w-10 h-8 sm:h-10 bg-orange-500 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110 hover:rotate-12">
                <ArrowRight className="h-4 sm:h-5 w-4 sm:w-5 text-white" />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg animate-fade-in-up">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* URL Input Section */}
            {!shortenedUrl && (
              <div className="space-y-4 sm:space-y-6 animate-fade-in-up animation-delay-200">
                <div className="relative group">
                  <Input
                    type="url"
                    placeholder="Enter your long URL here..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleShortenUrl()}
                    className="w-full h-12 sm:h-14 px-4 sm:px-5 text-sm sm:text-base border-2 border-gray-300 rounded-xl focus:border-black focus:ring-0 transition-all duration-300 bg-gray-50 focus:bg-white group-hover:border-gray-400"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/10 to-purple-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>

                <Button
                  onClick={handleShortenUrl}
                  disabled={!url || isLoading}
                  className="w-full h-12 sm:h-14 bg-black hover:bg-gray-800 text-white font-semibold text-sm sm:text-base rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-4 sm:w-5 h-4 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Creating magic...</span>
                    </div>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative">✨ Shorten URL</span>
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Result Section */}
            {shortenedUrl && (
              <div className="space-y-6 sm:space-y-8 animate-fade-in-up">
                {/* Shortened URL Display */}
                <div className="space-y-3 sm:space-y-4 animate-scale-in">
                  <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-xl transition-all duration-300 hover:bg-gray-100">
                    <div className="relative">
                      <Zap className="h-5 sm:h-6 w-5 sm:w-6 text-orange-500 animate-pulse" />
                      <div className="absolute inset-0 h-5 sm:h-6 w-5 sm:w-6 bg-orange-500 rounded-full animate-ping opacity-20"></div>
                    </div>
                    <span className="text-lg sm:text-xl font-bold text-black break-all">
                      {shortenedUrl.replace(window.location.origin + "/", "")}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm text-gray-500 pl-4 sm:pl-6 animate-slide-in-right animation-delay-200">
                    <ArrowRight className="h-3 sm:h-4 w-3 sm:w-4 text-orange-500 flex-shrink-0" />
                    <span className="font-medium break-all">{url}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 animate-fade-in-up animation-delay-400">
                  <Button
                    variant="outline"
                    onClick={handleCopyLink}
                    className="h-10 sm:h-12 border-2 border-gray-300 hover:border-green-500 hover:bg-green-50 transition-all duration-300 rounded-xl group relative overflow-hidden text-xs sm:text-sm"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {copied ? (
                      <>
                        <Check className="h-4 sm:h-5 w-4 sm:w-5 mr-1 sm:mr-2 text-green-600 animate-bounce" />
                        <span className="text-green-600 font-semibold relative">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 sm:h-5 w-4 sm:w-5 mr-1 sm:mr-2 transition-transform duration-300 group-hover:scale-110 relative" />
                        <span className="font-medium relative">Copy link</span>
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleGenerateQR}
                    className="h-10 sm:h-12 border-2 border-gray-300 hover:border-purple-500 hover:bg-purple-50 transition-all duration-300 rounded-xl group relative overflow-hidden text-xs sm:text-sm"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <QrCode className="h-4 sm:h-5 w-4 sm:w-5 mr-1 sm:mr-2 transition-transform duration-300 group-hover:rotate-12 relative" />
                    <span className="font-medium relative">Generate QR</span>
                  </Button>
                </div>
              </div>
            )}

            {/* Trusted Companies Section */}
            <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-gray-100 animate-fade-in-up animation-delay-600">
              <p className="text-xs sm:text-sm text-gray-500 text-center mb-4 sm:mb-6 font-medium">
                Trusted by Leading Companies
              </p>
              <div className="flex items-center justify-center space-x-4 sm:space-x-6 lg:space-x-4 xl:space-x-8">
                {["Airtable", "Podium", "Zendesk", "Databricks"].map((company, index) => (
                  <div
                    key={company}
                    className="text-xs font-semibold text-gray-400 hover:text-gray-600 transition-all duration-300 cursor-pointer transform hover:scale-110 animate-fade-in-up"
                    style={{ animationDelay: `${800 + index * 100}ms` }}
                  >
                    {company}
                  </div>
                ))}
              </div>
            </div>

            {/* Reset button when URL is shortened */}
            {shortenedUrl && (
              <Button
                variant="ghost"
                onClick={resetForm}
                className="w-full mt-4 sm:mt-6 text-gray-500 hover:text-black hover:bg-gray-50 transition-all duration-300 rounded-xl font-medium animate-fade-in-up animation-delay-800 text-sm sm:text-base"
              >
                Shorten Another URL
              </Button>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
