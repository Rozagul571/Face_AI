"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Camera, RefreshCw, X } from "lucide-react"

interface WebcamCaptureProps {
  onCapture: (imageDataUrl: string) => void
}

export function WebcamCapture({ onCapture }: WebcamCaptureProps) {
  const [isStreaming, setIsStreaming] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    return () => {
      // Clean up the stream when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setIsStreaming(true)
      }
    } catch (err) {
      console.error("Error accessing webcam:", err)

      alert(
        "Unable to access webcam. Please make sure you have a webcam connected and have granted permission to use it.",
      )
    }
  }

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    setIsStreaming(false)
  }

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Draw the current video frame on the canvas
      const ctx = canvas.getContext("2d")
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Convert canvas to data URL
      const imageDataUrl = canvas.toDataURL("image/png")
      setCapturedImage(imageDataUrl)
      onCapture(imageDataUrl)

      // Stop the webcam stream
      stopWebcam()
    }
  }

  const retakePhoto = () => {
    setCapturedImage(null)
    onCapture("")
    startWebcam()
  }

  return (
    <div className="w-full">
      <canvas ref={canvasRef} className="hidden"></canvas>

      {capturedImage ? (
        <div className="relative">
          <img
            src={capturedImage || "/placeholder.svg"}
            alt="Captured"
            className="w-full h-64 object-contain rounded-lg border border-purple-200"
          />
          <button
            onClick={() => {
              setCapturedImage(null)
              onCapture("")
            }}
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-700" />
          </button>
          <Button
            onClick={retakePhoto}
            variant="outline"
            className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retake
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden border border-purple-200">
            {isStreaming ? (
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Webcam feed will appear here</p>
              </div>
            )}
          </div>

          <div className="flex justify-center space-x-4">
            {isStreaming ? (
              <>
                <Button
                  onClick={captureImage}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Capture Photo
                </Button>
                <Button onClick={stopWebcam} variant="outline">
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                onClick={startWebcam}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
              >
                <Camera className="h-4 w-4 mr-2" />
                Start Camera
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
