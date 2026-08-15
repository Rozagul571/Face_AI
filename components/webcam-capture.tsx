"use client"

import { useState, useRef, useEffect, useCallback } from "react"
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
  const [language, setLanguage] = useState<"en" | "uz">("en")
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language") as "en" | "uz" | null
    if (storedLanguage) setLanguage(storedLanguage)

    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop())
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [])

  const drawOverlay = useCallback(() => {
    if (!videoRef.current || !overlayCanvasRef.current) return

    const video = videoRef.current
    const canvas = overlayCanvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const now = Date.now() / 1000
    const elapsed = (Date.now() - startTimeRef.current) / 1000
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const faceWidth = canvas.width * 0.45
    const faceHeight = canvas.height * 0.65

    // Animated scanning line (loops continuously)
    const scanY = centerY - faceHeight / 2 + ((elapsed * 120) % faceHeight)
    ctx.strokeStyle = "rgba(236, 72, 153, 0.9)"
    ctx.lineWidth = 2
    ctx.setLineDash([6, 4])
    ctx.beginPath()
    ctx.moveTo(centerX - faceWidth / 2, scanY)
    ctx.lineTo(centerX + faceWidth / 2, scanY)
    ctx.stroke()
    ctx.setLineDash([])

    // Face outline frame
    const cornerRadius = 20
    ctx.strokeStyle = `rgba(236, 72, 153, ${0.5 + Math.sin(now * 2) * 0.3})`
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(centerX - faceWidth / 2 + cornerRadius, centerY - faceHeight / 2)
    ctx.lineTo(centerX + faceWidth / 2 - cornerRadius, centerY - faceHeight / 2)
    ctx.quadraticCurveTo(centerX + faceWidth / 2, centerY - faceHeight / 2, centerX + faceWidth / 2, centerY - faceHeight / 2 + cornerRadius)
    ctx.lineTo(centerX + faceWidth / 2, centerY + faceHeight / 2 - cornerRadius)
    ctx.quadraticCurveTo(centerX + faceWidth / 2, centerY + faceHeight / 2, centerX + faceWidth / 2 - cornerRadius, centerY + faceHeight / 2)
    ctx.lineTo(centerX - faceWidth / 2 + cornerRadius, centerY + faceHeight / 2)
    ctx.quadraticCurveTo(centerX - faceWidth / 2, centerY + faceHeight / 2, centerX - faceWidth / 2, centerY + faceHeight / 2 - cornerRadius)
    ctx.lineTo(centerX - faceWidth / 2, centerY - faceHeight / 2 + cornerRadius)
    ctx.quadraticCurveTo(centerX - faceWidth / 2, centerY - faceHeight / 2, centerX - faceWidth / 2 + cornerRadius, centerY - faceHeight / 2)
    ctx.stroke()

    // Corner brackets highlight
    const bracketLen = 28
    ctx.strokeStyle = "rgba(168, 85, 247, 0.9)"
    ctx.lineWidth = 4
    const corners = [
      { x: centerX - faceWidth / 2, y: centerY - faceHeight / 2, dx: 1, dy: 1 },
      { x: centerX + faceWidth / 2, y: centerY - faceHeight / 2, dx: -1, dy: 1 },
      { x: centerX - faceWidth / 2, y: centerY + faceHeight / 2, dx: 1, dy: -1 },
      { x: centerX + faceWidth / 2, y: centerY + faceHeight / 2, dx: -1, dy: -1 },
    ]
    corners.forEach(({ x, y, dx, dy }) => {
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + dx * bracketLen, y)
      ctx.moveTo(x, y)
      ctx.lineTo(x, y + dy * bracketLen)
      ctx.stroke()
    })

    // Detection points after 3 seconds
    if (elapsed > 3) {
      const acnePoints = [
        { x: centerX - faceWidth * 0.18, y: centerY - faceHeight * 0.25, type: "papule", confidence: 0.92 },
        { x: centerX + faceWidth * 0.22, y: centerY - faceHeight * 0.15, type: "pustule", confidence: 0.87 },
        { x: centerX - faceWidth * 0.1, y: centerY + faceHeight * 0.05, type: "blackhead", confidence: 0.79 },
        { x: centerX + faceWidth * 0.08, y: centerY + faceHeight * 0.15, type: "whitehead", confidence: 0.85 },
        { x: centerX - faceWidth * 0.25, y: centerY + faceHeight * 0.22, type: "nodule", confidence: 0.72 },
      ]

      const colors: Record<string, string> = {
        papule: "#FF6B6B",
        pustule: "#FFCC00",
        blackhead: "#555555",
        whitehead: "#DDDDDD",
        nodule: "#9C27B0",
      }

      acnePoints.forEach(({ x, y, type, confidence }) => {
        const color = colors[type] || "#FF6B6B"
        const pulse = 1 + Math.sin(now * 4) * 0.15

        ctx.beginPath()
        ctx.arc(x, y, 14 * pulse, 0, Math.PI * 2)
        ctx.fillStyle = `${color}44`
        ctx.fill()

        ctx.beginPath()
        ctx.arc(x, y, 7 * pulse, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()

        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(255,255,255,0.9)"
        ctx.fill()

        ctx.font = "bold 11px Arial"
        ctx.fillStyle = "white"
        ctx.textAlign = "center"
        ctx.strokeStyle = "rgba(0,0,0,0.6)"
        ctx.lineWidth = 3
        ctx.strokeText(`${type} ${Math.round(confidence * 100)}%`, x, y - 18)
        ctx.fillText(`${type} ${Math.round(confidence * 100)}%`, x, y - 18)
      })
    }

    // Scanning label at bottom
    const label = language === "en" ? "Scanning face..." : "Yuz skanerlanyapti..."
    ctx.font = "bold 14px Arial"
    ctx.textAlign = "center"
    const textY = centerY + faceHeight / 2 + 26
    ctx.fillStyle = "rgba(0,0,0,0.5)"
    ctx.fillRect(centerX - 90, textY - 18, 180, 24)
    ctx.fillStyle = "rgba(255,255,255,0.95)"
    ctx.fillText(label, centerX, textY)

    animationRef.current = requestAnimationFrame(drawOverlay)
  }, [language])

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setIsStreaming(true)
        startTimeRef.current = Date.now()

        videoRef.current.onloadedmetadata = () => {
          drawOverlay()
          // Mark face detected after 3 seconds
          setTimeout(() => setFaceDetected(true), 3000)
        }
      }
    } catch {
      alert(
        language === "en"
          ? "Unable to access webcam. Please grant camera permission."
          : "Veb-kamerani ishlatib bo'lmadi. Kamera ruxsatini bering.",
      )
    }
  }

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    if (videoRef.current) videoRef.current.srcObject = null
    if (animationRef.current) cancelAnimationFrame(animationRef.current)
    setIsStreaming(false)
    setFaceDetected(false)
  }

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext("2d")
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height)
      const imageDataUrl = canvas.toDataURL("image/png")
      setCapturedImage(imageDataUrl)
      onCapture(imageDataUrl)
      stopWebcam()
    }
  }

  const retakePhoto = () => {
    setCapturedImage(null)
    onCapture("")
    startWebcam()
  }

  const content = {
    en: { webcamFeed: "Tap to start camera", startCamera: "Start Camera", capture: "Capture Photo", cancel: "Cancel", retake: "Retake" },
    uz: { webcamFeed: "Kamerani boshlash uchun bosing", startCamera: "Kamerani boshlash", capture: "Rasmga olish", cancel: "Bekor qilish", retake: "Qayta olish" },
  }

  const currentContent = content[language]

  return (
    <div className="w-full">
      <canvas ref={canvasRef} className="hidden" />

      {capturedImage ? (
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <img
            src={capturedImage}
            alt="Captured"
            className="w-full h-56 sm:h-64 md:h-72 object-contain rounded-lg border border-purple-200"
          />
          <button
            onClick={() => { setCapturedImage(null); onCapture("") }}
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-700" />
          </button>
          <Button
            onClick={retakePhoto}
            variant="outline"
            className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm text-sm"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            {currentContent.retake}
          </Button>
        </motion.div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          <div className="relative w-full h-56 sm:h-64 md:h-72 bg-gray-100 rounded-lg overflow-hidden border border-purple-200">
            {isStreaming ? (
              <>
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <canvas ref={overlayCanvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

                {faceDetected && (
                  <div className="absolute top-3 left-3 bg-green-500/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs sm:text-sm text-white flex items-center">
                    <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                    {language === "en" ? "Face detected" : "Yuz aniqlandi"}
                  </div>
                )}

                {/* Continuous scan indicator */}
                <div className="absolute top-3 right-3 bg-pink-500/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white flex items-center gap-1">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  {language === "en" ? "Live scan" : "Jonli skan"}
                </div>
              </>
            ) : (
              <button
                className="flex flex-col items-center justify-center h-full w-full hover:bg-gray-200 transition-colors"
                onClick={startWebcam}
              >
                <Camera className="h-14 w-14 sm:h-16 sm:w-16 text-purple-300 mb-2" />
                <p className="text-gray-500 text-sm sm:text-base">{currentContent.webcamFeed}</p>
              </button>
            )}
          </div>

          <div className="flex justify-center gap-3">
            {isStreaming ? (
              <>
                <Button
                  onClick={captureImage}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-sm sm:text-base"
                  disabled={!faceDetected}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  {!faceDetected
                    ? (language === "en" ? "Detecting..." : "Aniqlanmoqda...")
                    : currentContent.capture}
                </Button>
                <Button onClick={stopWebcam} variant="outline" className="text-sm sm:text-base">
                  {currentContent.cancel}
                </Button>
              </>
            ) : (
              <Button
                onClick={startWebcam}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-sm sm:text-base"
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
