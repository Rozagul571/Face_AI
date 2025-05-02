"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Camera, RefreshCw, X } from "lucide-react"
import { motion } from "framer-motion"

interface WebcamCaptureProps {
  onCapture: (imageDataUrl: string) => void
}

export function WebcamCapture({ onCapture }: WebcamCaptureProps) {
  const [isStreaming, setIsStreaming] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [faceDetected, setFaceDetected] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [language, setLanguage] = useState<"en" | "uz">("en")
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationRef = useRef<number | null>(null)
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Get language from localStorage or other state management
    const storedLanguage = localStorage.getItem("language") as "en" | "uz" | null
    if (storedLanguage) {
      setLanguage(storedLanguage)
    }

    return () => {
      // Clean up the stream when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }

      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current)
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

        // Start face detection overlay after video is loaded
        videoRef.current.onloadedmetadata = () => {
          drawFaceDetectionOverlay()

          // Start scan progress animation
          setScanProgress(0)
          scanIntervalRef.current = setInterval(() => {
            setScanProgress((prev) => {
              if (prev >= 100) {
                if (scanIntervalRef.current) clearInterval(scanIntervalRef.current)
                setFaceDetected(true)
                return 100
              }
              return prev + 2
            })
          }, 100)
        }
      }
    } catch (err) {
      console.error("Error accessing webcam:", err)

      alert(
        language === "en"
          ? "Unable to access webcam. Please make sure you have a webcam connected and have granted permission to use it."
          : "Veb-kamerani ishlatib bo'lmadi. Veb-kamera ulanganligini va undan foydalanish uchun ruxsat berganingizni tekshiring.",
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

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current)
    }

    setIsStreaming(false)
    setFaceDetected(false)
    setScanProgress(0)
  }

  const drawFaceDetectionOverlay = () => {
    if (!videoRef.current || !overlayCanvasRef.current || !isStreaming) return

    const video = videoRef.current
    const canvas = overlayCanvasRef.current
    const ctx = canvas.getContext("2d")

    if (!ctx) return

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480

    // Clear previous drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw face detection overlay
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const faceWidth = canvas.width * 0.4
    const faceHeight = canvas.height * 0.6

    // Draw scanning effect
    const time = Date.now() / 1000

    // Draw animated scanning line
    const scanY = centerY + Math.sin(time * 2) * (faceHeight / 2)
    ctx.strokeStyle = "rgba(236, 72, 153, 0.8)" // Pink-500
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(centerX - faceWidth / 2, scanY)
    ctx.lineTo(centerX + faceWidth / 2, scanY)
    ctx.stroke()
    ctx.setLineDash([])

    // Draw face detection frame with wrinkle detection points
    ctx.strokeStyle = "rgba(236, 72, 153, 0.7)" // Pink-500
    ctx.lineWidth = 3

    // Draw rounded rectangle for face outline
    const cornerRadius = 20
    ctx.beginPath()
    ctx.moveTo(centerX - faceWidth / 2 + cornerRadius, centerY - faceHeight / 2)
    ctx.lineTo(centerX + faceWidth / 2 - cornerRadius, centerY - faceHeight / 2)
    ctx.quadraticCurveTo(
      centerX + faceWidth / 2,
      centerY - faceHeight / 2,
      centerX + faceWidth / 2,
      centerY - faceHeight / 2 + cornerRadius,
    )
    ctx.lineTo(centerX + faceWidth / 2, centerY + faceHeight / 2 - cornerRadius)
    ctx.quadraticCurveTo(
      centerX + faceWidth / 2,
      centerY + faceHeight / 2,
      centerX + faceWidth / 2 - cornerRadius,
      centerY + faceHeight / 2,
    )
    ctx.lineTo(centerX - faceWidth / 2 + cornerRadius, centerY + faceHeight / 2)
    ctx.quadraticCurveTo(
      centerX - faceWidth / 2,
      centerY + faceHeight / 2,
      centerX - faceWidth / 2,
      centerY + faceHeight / 2 - cornerRadius,
    )
    ctx.lineTo(centerX - faceWidth / 2, centerY - faceHeight / 2 + cornerRadius)
    ctx.quadraticCurveTo(
      centerX - faceWidth / 2,
      centerY - faceHeight / 2,
      centerX - faceWidth / 2 + cornerRadius,
      centerY - faceHeight / 2,
    )
    ctx.stroke()

    // Draw problem areas (acne detection points)
    if (scanProgress > 60) {
      // Simulate acne detection points
      const acnePoints = [
        { x: centerX - faceWidth * 0.2, y: centerY - faceHeight * 0.3, type: "papule", confidence: 0.92 },
        { x: centerX + faceWidth * 0.25, y: centerY - faceHeight * 0.2, type: "pustule", confidence: 0.87 },
        { x: centerX - faceWidth * 0.15, y: centerY, type: "blackhead", confidence: 0.79 },
        { x: centerX + faceWidth * 0.1, y: centerY + faceHeight * 0.1, type: "whitehead", confidence: 0.85 },
        { x: centerX - faceWidth * 0.3, y: centerY + faceHeight * 0.2, type: "nodule", confidence: 0.72 },
      ]

      // Draw acne detection points
      acnePoints.forEach((point) => {
        drawAcneDetectionPoint(ctx, point.x, point.y, point.type, point.confidence)
      })

      // Connect acne points with lines
      ctx.beginPath()
      ctx.moveTo(acnePoints[0].x, acnePoints[0].y)
      for (let i = 1; i < acnePoints.length; i++) {
        ctx.lineTo(acnePoints[i].x, acnePoints[i].y)
      }
      ctx.closePath()
      ctx.strokeStyle = "rgba(236, 72, 153, 0.3)"
      ctx.stroke()
    }

    // Add scanning percentage
    const textX = centerX - 60
    const textY = centerY + faceHeight / 2 + 30
    const textWidth = 120
    const textHeight = 24

    const gradient = ctx.createLinearGradient(textX, textY - textHeight, textX, textY)
    gradient.addColorStop(0, "rgba(0, 0, 0, 0.7)")
    gradient.addColorStop(1, "rgba(0, 0, 0, 0.3)")

    ctx.fillStyle = gradient
    ctx.fillRect(textX, textY - textHeight, textWidth, textHeight)

    ctx.font = "16px Arial"
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
    ctx.fillText(`${language === "en" ? "Scanning" : "Skanerlash"}: ${scanProgress}%`, textX + 10, textY - 6)

    // Continue animation
    animationRef.current = requestAnimationFrame(drawFaceDetectionOverlay)
  }

  const drawAcneDetectionPoint = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    type: string,
    confidence: number,
  ) => {
    // Different colors for different acne types
    const colors: Record<string, string> = {
      papule: "#FF6B6B", // Red
      pustule: "#FFCC00", // Yellow
      blackhead: "#333333", // Dark gray
      whitehead: "#FFFFFF", // White
      nodule: "#9C27B0", // Purple
      cyst: "#8E44AD", // Deep purple
    }

    const color = colors[type] || "#FF6B6B"

    // Draw pulsing circle
    const time = Date.now() / 1000
    const pulseSize = 1 + Math.sin(time * 3) * 0.2

    // Draw outer glow
    ctx.beginPath()
    ctx.arc(x, y, 15 * pulseSize, 0, Math.PI * 2)
    ctx.fillStyle = `${color}33` // Add transparency
    ctx.fill()

    // Draw main circle
    ctx.beginPath()
    ctx.arc(x, y, 8 * pulseSize, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()

    ctx.beginPath()
    ctx.arc(x, y, 4, 0, Math.PI * 2)
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
    ctx.fill()

    // Draw label
    ctx.font = "12px Arial"
    ctx.fillStyle = "white"
    ctx.textAlign = "center"
    ctx.fillText(`${type} ${Math.round(confidence * 100)}%`, x, y - 15)
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

  const content = {
    en: {
      webcamFeed: "Webcam feed will appear here",
      startCamera: "Start Camera",
      capture: "Capture Photo",
      scanning: "Scanning",
      cancel: "Cancel",
      retake: "Retake",
    },
    uz: {
      webcamFeed: "Veb-kamera tasviri shu yerda paydo bo'ladi",
      startCamera: "Kamerani boshlash",
      capture: "Rasmga olish",
      scanning: "Skanerlash",
      cancel: "Bekor qilish",
      retake: "Qayta olish",
    },
  }

  const currentContent = content[language]

  return (
    <div className="w-full">
      <canvas ref={canvasRef} className="hidden"></canvas>

      {capturedImage ? (
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
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
            {currentContent.retake}
          </Button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden border border-purple-200">
            {isStreaming ? (
              <>
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <canvas ref={overlayCanvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

                {/* Scanning progress bar */}
                <div className="absolute bottom-4 left-4 right-4 bg-black/30 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  ></div>
                </div>

                {faceDetected && (
                  <div className="absolute top-4 left-4 bg-green-500/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-white flex items-center">
                    <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                    {language === "en" ? "Face detected" : "Yuz aniqlandi"}
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <Camera className="h-16 w-16 text-purple-300 mb-2" />
                <p className="text-gray-500">{currentContent.webcamFeed}</p>
              </div>
            )}
          </div>

          <div className="flex justify-center space-x-4">
            {isStreaming ? (
              <>
                <Button
                  onClick={captureImage}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                  disabled={scanProgress < 100}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  {scanProgress < 100 ? `${currentContent.scanning} (${scanProgress}%)` : currentContent.capture}
                </Button>
                <Button onClick={stopWebcam} variant="outline">
                  {currentContent.cancel}
                </Button>
              </>
            ) : (
              <Button
                onClick={startWebcam}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
              >
                <Camera className="h-4 w-4 mr-2" />
                {currentContent.startCamera}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
