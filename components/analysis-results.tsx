"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, ChevronRight, Download, MessageCircle, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { acneTypeColors, acneTypeDescriptions } from "@/lib/roboflow-api"

interface Prediction {
  x: number
  y: number
  width: number
  height: number
  class: string
  confidence: number
  points?: Array<{ x: number; y: number }>
}

interface AnalysisResultsProps {
  results: {
    predictions: Prediction[]
    severity: "mild" | "moderate" | "severe"
    percentages: { [key: string]: number }
  }
  image: string | null
}

export function AnalysisResults({ results, image }: AnalysisResultsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [language, setLanguage] = useState<"en" | "uz">("en")

  useEffect(() => {
    const lang = localStorage.getItem("language") as "en" | "uz" | null
    if (lang) setLanguage(lang)
  }, [])

  useEffect(() => {
    if (!image || !canvasRef.current) return
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => drawCanvas(img)
    img.src = image
  }, [image, results])

  const drawCanvas = (img: HTMLImageElement) => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext("2d")!
    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0)

    results.predictions.forEach((pred) => {
      const cx = pred.x
      const cy = pred.y
      const hw = pred.width / 2
      const hh = pred.height / 2

      // Semi-transparent red fill overlay
      ctx.fillStyle = "rgba(255, 30, 30, 0.18)"
      ctx.beginPath()
      if (pred.points && pred.points.length > 2) {
        ctx.moveTo(pred.points[0].x, pred.points[0].y)
        pred.points.forEach((pt) => ctx.lineTo(pt.x, pt.y))
        ctx.closePath()
      } else {
        ctx.ellipse(cx, cy, hw, hh, 0, 0, Math.PI * 2)
      }
      ctx.fill()

      // Red outline / contour
      ctx.strokeStyle = "#FF2222"
      ctx.lineWidth = 2.5
      ctx.beginPath()
      if (pred.points && pred.points.length > 2) {
        ctx.moveTo(pred.points[0].x, pred.points[0].y)
        pred.points.forEach((pt) => ctx.lineTo(pt.x, pt.y))
        ctx.closePath()
      } else {
        ctx.ellipse(cx, cy, hw, hh, 0, 0, Math.PI * 2)
      }
      ctx.stroke()

      // Pulsing red dot at center
      // outer glow
      ctx.beginPath()
      ctx.arc(cx, cy, 12, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(255, 0, 0, 0.25)"
      ctx.fill()
      // main dot
      ctx.beginPath()
      ctx.arc(cx, cy, 7, 0, Math.PI * 2)
      ctx.fillStyle = "#FF2222"
      ctx.fill()
      // white center
      ctx.beginPath()
      ctx.arc(cx, cy, 2.5, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(255,255,255,0.9)"
      ctx.fill()

      // Confidence label
      const label = `${Math.round(pred.confidence * 100)}%`
      ctx.font = "bold 13px Arial"
      const tw = ctx.measureText(label).width
      ctx.fillStyle = "rgba(200,0,0,0.85)"
      ctx.fillRect(cx - tw / 2 - 4, cy - hh - 20, tw + 8, 18)
      ctx.fillStyle = "#fff"
      ctx.textAlign = "center"
      ctx.fillText(label, cx, cy - hh - 6)
      ctx.textAlign = "left"
    })
  }

  const downloadImage = () => {
    if (!canvasRef.current) return
    const a = document.createElement("a")
    a.download = "derion-analysis.png"
    a.href = canvasRef.current.toDataURL("image/png")
    a.click()
  }

  const total = results.predictions.length

  const severityPct = { mild: 30, moderate: 60, severe: 90 }[results.severity]
  const severityColor = { mild: "bg-green-500", moderate: "bg-amber-500", severe: "bg-red-500" }[results.severity]

  const acneCounts = results.predictions.reduce((acc, p) => {
    acc[p.class] = (acc[p.class] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const t = {
    en: {
      title: "Analysis Results", detected: "Detected", lesions: "acne lesions",
      severity: "Severity:", types: "Acne Types:", next: "Next Steps:",
      chat: "Chat with DermAI", products: "Product Recommendations",
      explain: "Explanation", tips: "Quick Tips", warn: "Warnings",
    },
    uz: {
      title: "Tahlil Natijalari", detected: "Aniqlandi", lesions: "akne shikastlanishi",
      severity: "Og'irlik:", types: "Akne turlari:", next: "Keyingi qadamlar:",
      chat: "DermAI bilan suhbatlash", products: "Mahsulot tavsiyalari",
      explain: "Tushuntirish", tips: "Maslahatlar", warn: "Ogohlantirishlar",
    },
  }[language]

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="border-2 border-purple-200 shadow-lg overflow-hidden">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">

              {/* Canvas with detection */}
              <div className="md:w-1/2">
                <div className="relative bg-gray-100 rounded-xl overflow-hidden">
                  <canvas ref={canvasRef} className="w-full h-auto rounded-xl" />
                  <div className="absolute top-3 left-3 bg-red-600/80 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    {total} {language === "en" ? "acne detected" : "akne aniqlandi"}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm"
                    onClick={downloadImage}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="md:w-1/2 space-y-5">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-purple-900 mb-1">{t.title}</h2>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {t.detected} <span className="font-bold text-red-600">{total}</span> {t.lesions}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>{t.severity}</span>
                    <span className="capitalize font-bold">{results.severity}</span>
                  </div>
                  <Progress value={severityPct} className="h-2.5" indicatorClassName={severityColor} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-2 text-gray-700">{t.types}</h3>
                  <div className="space-y-2">
                    {Object.entries(acneCounts).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between px-3 py-2 rounded-lg bg-red-50 border border-red-100">
                        <div className="flex items-center gap-2">
                          <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: acneTypeColors[type] || "#FF2222" }} />
                          <span className="capitalize text-sm font-medium">{type}</span>
                        </div>
                        <span className="text-sm font-bold text-red-700">{count} ({results.percentages[type] ?? 0}%)</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t.next}</p>
                  <NextBtn icon={<MessageCircle className="h-4 w-4" />} text={t.chat} href="/chat" />
                  <NextBtn icon={<ShoppingBag className="h-4 w-4" />} text={t.products} href="/recommendations" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="explanation" className="max-w-3xl mx-auto">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="explanation">{t.explain}</TabsTrigger>
          <TabsTrigger value="tips">{t.tips}</TabsTrigger>
          <TabsTrigger value="warnings">{t.warn}</TabsTrigger>
        </TabsList>

        <TabsContent value="explanation" className="mt-4">
          <Card><CardContent className="pt-5 space-y-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="font-semibold text-purple-900 mb-1 capitalize">{results.severity} {language === "en" ? "severity" : "daraja"}</p>
              <p className="text-sm text-gray-700">
                {results.severity === "mild" && (language === "en" ? "A few scattered lesions. Easy to treat with OTC products." : "Bir nechta tarqalgan dog'lar. Apteka vositalari bilan davolash oson.")}
                {results.severity === "moderate" && (language === "en" ? "Multiple lesions across face. May need combined treatment." : "Yuzda bir nechta shikastlanish. Kombinatsiyali davolash kerak bo'lishi mumkin.")}
                {results.severity === "severe" && (language === "en" ? "Numerous lesions. Consult a dermatologist for prescription treatment." : "Ko'p shikastlanish. Dermatologga murojaat qiling.")}
              </p>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              {Object.entries(acneCounts).map(([type, count]) => (
                <li key={type} className="flex items-start gap-2">
                  <div className="w-3.5 h-3.5 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: acneTypeColors[type] || "#FF2222" }} />
                  <span><b className="capitalize">{type} ({count}):</b> {acneTypeDescriptions[type] || "Acne lesion"}</span>
                </li>
              ))}
            </ul>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="tips" className="mt-4">
          <Card><CardContent className="pt-5 space-y-3">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="font-medium text-green-800 mb-2">{language === "en" ? "Daily Skincare" : "Kundalik parvarish"}</p>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• {language === "en" ? "Cleanse twice daily with gentle pH-balanced cleanser" : "Kuniga 2 marta yumshoq tozalovchi bilan yuving"}</li>
                <li>• {language === "en" ? "Use non-comedogenic moisturizer" : "Non-komedogen namlovchi ishlating"}</li>
                <li>• {language === "en" ? "Apply SPF 30+ every morning" : "Har kuni SPF 30+ quyoshdan himoya qo'llang"}</li>
                <li>• {language === "en" ? "Don't touch your face" : "Yuzingizga qo'l tegizmang"}</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="font-medium text-blue-800 mb-2">{language === "en" ? "Key Ingredients" : "Asosiy tarkiblar"}</p>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Salicylic Acid — {language === "en" ? "unclogs pores" : "g'ovaklarni tozalaydi"}</li>
                <li>• Niacinamide — {language === "en" ? "reduces redness" : "qizillikni kamaytiradi"}</li>
                <li>• Benzoyl Peroxide — {language === "en" ? "kills bacteria" : "bakteriyalarni o'ldiradi"}</li>
              </ul>
            </div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="warnings" className="mt-4">
          <Card><CardContent className="pt-5 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <h3 className="font-semibold text-purple-900">{language === "en" ? "Important Warnings" : "Muhim ogohlantirishlar"}</h3>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="font-medium text-red-800 mb-2">{language === "en" ? "Don't do:" : "Qilmang:"}</p>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• {language === "en" ? "Don't pop or squeeze pimples" : "Husnbuzarlarni siqmang"}</li>
                <li>• {language === "en" ? "Avoid harsh scrubs" : "Qattiq skrablardan saqlaning"}</li>
                <li>• {language === "en" ? "No DIY remedies (toothpaste, lemon)" : "Uy vositalarini ishlatmang (tish pastasi, limon)"}</li>
              </ul>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg">
              <p className="font-medium text-amber-800 mb-1">{language === "en" ? "See a dermatologist if:" : "Dermatologga boring agar:"}</p>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• {language === "en" ? "Acne is severe or cystic" : "Akne og'ir yoki kistali bo'lsa"}</li>
                <li>• {language === "en" ? "OTC treatments fail after 8 weeks" : "8 haftada apteka vositalari yordam bermasa"}</li>
                <li>• {language === "en" ? "Scarring develops" : "Chandiqlar paydo bo'lsa"}</li>
              </ul>
            </div>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function NextBtn({ icon, text, href }: { icon: React.ReactNode; text: string; href: string }) {
  return (
    <Button asChild variant="outline" className="w-full justify-between hover:bg-purple-50 border-purple-200">
      <Link href={href}>
        <div className="flex items-center gap-2">{icon}<span>{text}</span></div>
        <ChevronRight className="h-4 w-4" />
      </Link>
    </Button>
  )
}
