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

interface AnalysisResultsProps {
  results: {
    predictions: Array<{
      x: number
      y: number
      width: number
      height: number
      class: string
      confidence: number
    }>
    severity: "mild" | "moderate" | "severe"
    percentages: {
      [key: string]: number
    }
  }
  image: string | null
}

export function AnalysisResults({ results, image }: AnalysisResultsProps) {
  const [showDots, setShowDots] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [language, setLanguage] = useState<"en" | "uz">("en")
  const [imageSize, setImageSize] = useState({ width: 500, height: 500 })

  useEffect(() => {
    // Get language from localStorage or other state management
    const storedLanguage = localStorage.getItem("language") as "en" | "uz" | null
    if (storedLanguage) {
      setLanguage(storedLanguage)
    }

    if (image && canvasRef.current) {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        setImageSize({ width: img.width, height: img.height })
        drawImageWithPredictions(img)
      }
      img.src = image
    }
  }, [image, results, showDots])

  const drawImageWithPredictions = (img: HTMLImageElement) => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions to match image
    canvas.width = img.width
    canvas.height = img.height

    // Draw the image
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

    // Draw predictions
    results.predictions.forEach((pred) => {
      const color = acneTypeColors[pred.class as keyof typeof acneTypeColors] || "#ff0000"

      // Draw bounding box
      ctx.strokeStyle = color
      ctx.lineWidth = 3
      ctx.strokeRect(pred.x, pred.y, pred.width, pred.height)

      // Draw label
      ctx.fillStyle = color
      ctx.fillRect(pred.x, pred.y - 25, 120, 25)
      ctx.fillStyle = "white"
      ctx.font = "14px Arial"
      ctx.fillText(`${pred.class} ${Math.round(pred.confidence * 100)}%`, pred.x + 5, pred.y - 7)

      // Draw dots if enabled
      if (showDots) {
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(pred.x + pred.width / 2, pred.y + pred.height / 2, 8, 0, Math.PI * 2)
        ctx.fill()
      }
    })

    // Connect dots if enabled
    if (showDots && results.predictions.length > 1) {
      ctx.strokeStyle = "rgba(255, 0, 0, 0.5)"
      ctx.lineWidth = 2
      ctx.beginPath()

      const firstPred = results.predictions[0]
      ctx.moveTo(firstPred.x + firstPred.width / 2, firstPred.y + firstPred.height / 2)

      for (let i = 1; i < results.predictions.length; i++) {
        const pred = results.predictions[i]
        ctx.lineTo(pred.x + pred.width / 2, pred.y + pred.height / 2)
      }

      ctx.closePath()
      ctx.stroke()
    }
  }

  const downloadImage = () => {
    if (canvasRef.current) {
      const link = document.createElement("a")
      link.download = "derion-analysis.png"
      link.href = canvasRef.current.toDataURL("image/png")
      link.click()
    }
  }

  const getSeverityColor = () => {
    switch (results.severity) {
      case "mild":
        return "bg-green-500"
      case "moderate":
        return "bg-amber-500"
      case "severe":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getSeverityPercentage = () => {
    switch (results.severity) {
      case "mild":
        return 30
      case "moderate":
        return 60
      case "severe":
        return 90
      default:
        return 0
    }
  }

  const acneCounts = results.predictions.reduce(
    (acc, pred) => {
      acc[pred.class] = (acc[pred.class] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const content = {
    en: {
      title: "Analysis Results",
      detected: "We've detected",
      lesions: "acne lesions on your skin.",
      severityLevel: "Severity Level:",
      acneTypesDetected: "Acne Types Detected:",
      nextSteps: "Next Steps:",
      chatWithDermAI: "Chat with DermAI",
      getProductRecommendations: "Get Product Recommendations",
      explanation: "Explanation",
      quickTips: "Quick Tips",
      warnings: "Warnings",
      understandingResults: "Understanding Your Results",
      analyzed: "Our AI has analyzed your skin and detected",
      acne: "acne. Here's what that means:",
      severity: "Severity:",
      acneTypesExplained: "Acne Types Explained:",
    },
    uz: {
      title: "Tahlil Natijalari",
      detected: "Biz aniqladik",
      lesions: "teringizdagi akne shikastlanishlari.",
      severityLevel: "Og'irlik darajasi:",
      acneTypesDetected: "Aniqlangan akne turlari:",
      nextSteps: "Keyingi qadamlar:",
      chatWithDermAI: "DermAI bilan suhbatlashing",
      getProductRecommendations: "Mahsulot tavsiyalarini oling",
      explanation: "Tushuntirish",
      quickTips: "Tezkor maslahatlar",
      warnings: "Ogohlantirishlar",
      understandingResults: "Natijalaringizni tushunish",
      analyzed: "Bizning AI teringizni tahlil qildi va aniqladi",
      acne: "akne. Mana bu nimani anglatadi:",
      severity: "Og'irlik darajasi:",
      acneTypesExplained: "Akne turlari tushuntirilgan:",
    },
  }

  const currentContent = content[language]

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="border-2 border-purple-200 shadow-lg overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2">
                <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                  <canvas ref={canvasRef} className="w-full h-auto"></canvas>
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white/80 backdrop-blur-sm"
                      onClick={() => setShowDots(!showDots)}
                    >
                      {showDots ? "Hide" : "Show"} Dots
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white/80 backdrop-blur-sm"
                      onClick={downloadImage}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="md:w-1/2 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-purple-900 mb-2">{currentContent.title}</h2>
                  <p className="text-gray-700">
                    {currentContent.detected} {results.predictions.length} {currentContent.lesions}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{currentContent.severityLevel}</span>
                    <span className="font-bold capitalize">{results.severity}</span>
                  </div>
                  <Progress value={getSeverityPercentage()} className="h-2" indicatorClassName={getSeverityColor()} />
                </div>

                <div>
                  <h3 className="font-medium mb-2">{currentContent.acneTypesDetected}</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {Object.entries(results.percentages).map(([type, percentage]) => (
                      <div key={type} className="flex items-center justify-between p-2 rounded-md bg-purple-50">
                        <div className="flex items-center">
                          <div
                            className="w-4 h-4 rounded-full mr-2"
                            style={{
                              backgroundColor: acneTypeColors[type as keyof typeof acneTypeColors] || "#ff0000",
                            }}
                          ></div>
                          <span className="capitalize">{type}:</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-bold mr-2">{acneCounts[type] || 0}</span>
                          <span className="text-sm text-gray-500">({percentage}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="font-medium mb-3">{currentContent.nextSteps}</h3>
                  <div className="space-y-2">
                    <NextStepButton
                      icon={<MessageCircle className="h-4 w-4" />}
                      text={currentContent.chatWithDermAI}
                      href="/chat"
                    />
                    <NextStepButton
                      icon={<ShoppingBag className="h-4 w-4" />}
                      text={currentContent.getProductRecommendations}
                      href="/recommendations"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="explanation" className="max-w-3xl mx-auto">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="explanation">{currentContent.explanation}</TabsTrigger>
          <TabsTrigger value="recommendations">{currentContent.quickTips}</TabsTrigger>
          <TabsTrigger value="warnings">{currentContent.warnings}</TabsTrigger>
        </TabsList>

        <TabsContent value="explanation" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-3 text-purple-900">{currentContent.understandingResults}</h3>
              <p className="text-gray-700 mb-4">
                {currentContent.analyzed} {results.severity} {currentContent.acne}
              </p>

              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-1">
                    {currentContent.severity} {results.severity}
                  </h4>
                  <p className="text-sm text-gray-700">
                    {results.severity === "mild" &&
                      (language === "en"
                        ? "You have a few scattered lesions. This is typically easy to treat with over-the-counter products."
                        : "Sizda bir nechta tarqalgan shikastlanishlar bor. Bu odatda aptekada sotiladigan mahsulotlar bilan davolash oson.")}
                    {results.severity === "moderate" &&
                      (language === "en"
                        ? "You have multiple lesions across your face. This may require a combination of treatments."
                        : "Yuzingizda bir nechta shikastlanishlar bor. Bu davolashning kombinatsiyasini talab qilishi mumkin.")}
                    {results.severity === "severe" &&
                      (language === "en"
                        ? "You have numerous inflamed lesions. Consider consulting a dermatologist for prescription treatments."
                        : "Sizda ko'plab yallig'langan shikastlanishlar bor. Retsept bilan beriladigan davolash uchun dermatologga murojaat qilishni o'ylab ko'ring.")}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-purple-900 mb-1">{currentContent.acneTypesExplained}</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    {Object.entries(acneCounts).map(([type, count]) => (
                      <li key={type} className="flex items-start gap-2">
                        <div
                          className="w-4 h-4 rounded-full mt-1 flex-shrink-0"
                          style={{ backgroundColor: acneTypeColors[type as keyof typeof acneTypeColors] || "#ff0000" }}
                        ></div>
                        <div>
                          <span className="font-bold capitalize">
                            {type} ({count}):
                          </span>{" "}
                          <span>
                            {acneTypeDescriptions[type as keyof typeof acneTypeDescriptions] || "Acne lesion"}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-3 text-purple-900">
                {language === "en" ? "Quick Treatment Tips" : "Tezkor davolash maslahatlari"}
              </h3>
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-1">
                    {language === "en" ? "Daily Skincare Routine" : "Kundalik teri parvarishi"}
                  </h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>
                      •{" "}
                      {language === "en"
                        ? "Cleanse twice daily with a gentle, pH-balanced cleanser"
                        : "Kuniga ikki marta yumshoq, pH muvozanatlangan tozalovchi vosita bilan tozalang"}
                    </li>
                    <li>
                      •{" "}
                      {language === "en"
                        ? "Use non-comedogenic moisturizer to maintain skin barrier"
                        : "Teri to'sig'ini saqlash uchun non-komedogen namlovchidan foydalaning"}
                    </li>
                    <li>
                      •{" "}
                      {language === "en"
                        ? "Apply SPF 30+ sunscreen every morning"
                        : "Har kuni ertalab SPF 30+ quyoshdan himoya kremini qo'llang"}
                    </li>
                    <li>
                      •{" "}
                      {language === "en"
                        ? "Avoid touching your face throughout the day"
                        : "Kun davomida yuzingizga tegishdan saqlaning"}
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-1">
                    {language === "en" ? "Recommended Ingredients" : "Tavsiya etilgan tarkibiy qismlar"}
                  </h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>
                      •{" "}
                      {language === "en"
                        ? "Salicylic Acid: Unclogs pores and reduces inflammation"
                        : "Salitsil kislotasi: Teshiklarni ochadi va yallig'lanishni kamaytiradi"}
                    </li>
                    <li>
                      •{" "}
                      {language === "en"
                        ? "Benzoyl Peroxide: Kills acne-causing bacteria"
                        : "Benzoil peroksid: Akne keltirib chiqaruvchi bakteriyalarni o'ldiradi"}
                    </li>
                    <li>
                      •{" "}
                      {language === "en"
                        ? "Niacinamide: Reduces inflammation and oil production"
                        : "Niacinamide: Yallig'lanishni va yog' ishlab chiqarishni kamaytiradi"}
                    </li>
                    <li>
                      •{" "}
                      {language === "en"
                        ? "Retinoids: Prevents clogged pores and promotes cell turnover"
                        : "Retinoidlar: Teshiklarning tiqilib qolishini oldini oladi va hujayralarning yangilanishini rag'batlantiradi"}
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="warnings" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <h3 className="text-lg font-medium text-purple-900">
                  {language === "en" ? "Important Warnings" : "Muhim ogohlantirishlar"}
                </h3>
              </div>

              <div className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-1">
                    {language === "en" ? "What NOT to Do" : "Nima qilmaslik kerak"}
                  </h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>
                      •{" "}
                      {language === "en"
                        ? "Don't pick, pop, or squeeze pimples (can lead to scarring)"
                        : "Husnbuzarlarni tirmamang, siqmang (chandiq qolishiga olib kelishi mumkin)"}
                    </li>
                    <li>
                      •{" "}
                      {language === "en"
                        ? "Avoid harsh scrubs or excessive exfoliation"
                        : "Qattiq skrablar yoki haddan tashqari exfoliatsiyadan saqlaning"}
                    </li>
                    <li>
                      •{" "}
                      {language === "en"
                        ? "Don't apply toothpaste, lemon juice, or DIY remedies"
                        : "Tish pastasi, limon sharbati yoki uy sharoitida tayyorlangan vositalarni qo'llamang"}
                    </li>
                    <li>
                      •{" "}
                      {language === "en"
                        ? "Avoid using multiple active ingredients at once"
                        : "Bir vaqtning o'zida bir nechta faol tarkibiy qismlardan foydalanishdan saqlaning"}
                    </li>
                  </ul>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg">
                  <h4 className="font-medium text-amber-800 mb-1">
                    {language === "en" ? "When to See a Dermatologist" : "Qachon dermatologga murojaat qilish kerak"}
                  </h4>
                  <p className="text-sm text-gray-700 mb-2">
                    {language === "en"
                      ? "Consider consulting a dermatologist if:"
                      : "Quyidagi hollarda dermatologga murojaat qilishni o'ylab ko'ring:"}
                  </p>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>
                      • {language === "en" ? "Your acne is severe or cystic" : "Akneingiz og'ir yoki kistali bo'lsa"}
                    </li>
                    <li>
                      •{" "}
                      {language === "en"
                        ? "Over-the-counter treatments haven't worked after 8-12 weeks"
                        : "Aptekada sotiladigan davolash vositalari 8-12 hafta davomida yordam bermasa"}
                    </li>
                    <li>
                      •{" "}
                      {language === "en"
                        ? "You're developing scars from your acne"
                        : "Aknedan chandiqlar paydo bo'layotgan bo'lsa"}
                    </li>
                    <li>
                      •{" "}
                      {language === "en"
                        ? "Your acne is causing significant psychological distress"
                        : "Akneingiz sezilarli psixologik stress keltirib chiqarayotgan bo'lsa"}
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface NextStepButtonProps {
  icon: React.ReactNode
  text: string
  href: string
}

function NextStepButton({ icon, text, href }: NextStepButtonProps) {
  return (
    <Button asChild variant="outline" className="w-full justify-between hover:bg-purple-50 border-purple-200">
      <Link href={href}>
        <div className="flex items-center">
          {icon}
          <span className="ml-2">{text}</span>
        </div>
        <ChevronRight className="h-4 w-4" />
      </Link>
    </Button>
  )
}
