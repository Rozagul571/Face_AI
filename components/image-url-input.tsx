"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, X } from "lucide-react"

interface ImageUrlInputProps {
  onImageLoaded: (imageDataUrl: string) => void
}

export function ImageUrlInput({ onImageLoaded }: ImageUrlInputProps) {
  const [url, setUrl] = useState("")
  const [preview, setPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value)
    setError(null)
  }

  const loadImage = () => {
    if (!url) {
      setError("Please enter an image URL")
      return
    }

    setIsLoading(true)
    setError(null)

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      setPreview(url)
      onImageLoaded(url)
      setIsLoading(false)
    }
    img.onerror = () => {
      setError("Failed to load image. Please check the URL and try again.")
      setIsLoading(false)
    }
    img.src = url
  }

  const handleRemoveImage = () => {
    setPreview(null)
    setUrl("")
    onImageLoaded("")
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
          value={url}
          onChange={handleUrlChange}
          className="flex-1"
        />
        <Button
          onClick={loadImage}
          disabled={isLoading || !url}
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading
            </>
          ) : (
            "Load Image"
          )}
        </Button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {preview && (
        <div className="relative">
          <img
            src={preview || "/placeholder.svg"}
            alt="Preview"
            className="w-full h-64 object-contain rounded-lg border border-purple-200"
          />
          <button
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-700" />
          </button>
        </div>
      )}
    </div>
  )
}
