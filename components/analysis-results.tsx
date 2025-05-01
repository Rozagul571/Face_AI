"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, ChevronRight, Download, MessageCircle, ShoppingBag } from "lucide-react"
import Link from "next/link"

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
  }
  image: string | null
}

export function AnalysisResults({ results, image }: AnalysisResultsProps) {
  const [showDots, setShowDots] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (image && canvasRef.current) {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
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
      // Draw bounding box
      ctx.strokeStyle = "red"
      ctx.lineWidth = 2
      ctx.strokeRect(pred.x, pred.y, pred.width, pred.height)

      // Draw label
      ctx.fillStyle = "rgba(255, 0, 0, 0.7)"
      ctx.fillRect(pred.x, pred.y - 20, 100, 20)
      ctx.fillStyle = "white"
      ctx.font = "12px Arial"
      ctx.fillText(`${pred.class} ${Math.round(pred.confidence * 100)}%`, pred.x + 5, pred.y - 5)

      // Draw dots if enabled
      if (showDots) {
        ctx.fillStyle = "rgba(255, 0, 0, 0.5)"
        ctx.beginPath()
        ctx.arc(pred.x + pred.width / 2, pred.y + pred.height / 2, 5, 0, Math.PI * 2)
        ctx.fill()
      }
    })

    // Connect dots if enabled
    if (showDots && results.predictions.length > 1) {
      ctx.strokeStyle = "rgba(255, 0, 0, 0.3)"
      ctx.lineWidth = 1
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

  return (
    <div className="space-y-8">
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
                  <Button size="sm" variant="outline" className="bg-white/80 backdrop-blur-sm" onClick={downloadImage}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="md:w-1/2 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-purple-900 mb-2">Analysis Results</h2>
                <p className="text-gray-700">We've detected {results.predictions.length} acne lesions on your skin.</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Severity Level:</span>
                  <span className="font-bold capitalize">{results.severity}</span>
                </div>
                <Progress value={getSeverityPercentage()} className="h-2" indicatorClassName={getSeverityColor()} />
              </div>

              <div>
                <h3 className="font-medium mb-2">Acne Types Detected:</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(acneCounts).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between bg-purple-50 p-2 rounded-md">
                      <span className="capitalize">{type}:</span>
                      <span className="font-bold">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="font-medium mb-3">Next Steps:</h3>
                <div className="space-y-2">
                  <NextStepButton icon={<MessageCircle className="h-4 w-4" />} text="Chat with DermAI" href="/chat" />
                  <NextStepButton
                    icon={<ShoppingBag className="h-4 w-4" />}
                    text="Get Product Recommendations"
                    href="/recommendations"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="explanation" className="max-w-3xl mx-auto">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="explanation">Explanation</TabsTrigger>
          <TabsTrigger value="recommendations">Quick Tips</TabsTrigger>
          <TabsTrigger value="warnings">Warnings</TabsTrigger>
        </TabsList>

        <TabsContent value="explanation" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-3 text-purple-900">Understanding Your Results</h3>
              <p className="text-gray-700 mb-4">
                Our AI has analyzed your skin and detected {results.severity} acne. Here's what that means:
              </p>

              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-1">Severity: {results.severity}</h4>
                  <p className="text-sm text-gray-700">
                    {results.severity === "mild" &&
                      "You have a few scattered lesions. This is typically easy to treat with over-the-counter products."}
                    {results.severity === "moderate" &&
                      "You have multiple lesions across your face. This may require a combination of treatments."}
                    {results.severity === "severe" &&
                      "You have numerous inflamed lesions. Consider consulting a dermatologist for prescription treatments."}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-purple-900 mb-1">Acne Types Explained:</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    {Object.keys(acneCounts).includes("blackhead") && (
                      <li className="flex items-start gap-2">
                        <span className="font-bold">Blackheads:</span>
                        <span>Open comedones that appear as small dark spots due to oxidation.</span>
                      </li>
                    )}
                    {Object.keys(acneCounts).includes("whitehead") && (
                      <li className="flex items-start gap-2">
                        <span className="font-bold">Whiteheads:</span>
                        <span>Closed comedones that appear as small white or flesh-colored bumps.</span>
                      </li>
                    )}
                    {Object.keys(acneCounts).includes("papule") && (
                      <li className="flex items-start gap-2">
                        <span className="font-bold">Papules:</span>
                        <span>Small, raised, solid pimples that are often red and tender.</span>
                      </li>
                    )}
                    {Object.keys(acneCounts).includes("pustule") && (
                      <li className="flex items-start gap-2">
                        <span className="font-bold">Pustules:</span>
                        <span>Pimples containing pus that have a white or yellow center.</span>
                      </li>
                    )}
                    {Object.keys(acneCounts).includes("cyst") && (
                      <li className="flex items-start gap-2">
                        <span className="font-bold">Cysts:</span>
                        <span>Large, painful, pus-filled lesions deep in the skin that can cause scarring.</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-3 text-purple-900">Quick Treatment Tips</h3>
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-1">Daily Skincare Routine</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Cleanse twice daily with a gentle, pH-balanced cleanser</li>
                    <li>• Use non-comedogenic moisturizer to maintain skin barrier</li>
                    <li>• Apply SPF 30+ sunscreen every morning</li>
                    <li>• Avoid touching your face throughout the day</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-1">Recommended Ingredients</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Salicylic Acid: Unclogs pores and reduces inflammation</li>
                    <li>• Benzoyl Peroxide: Kills acne-causing bacteria</li>
                    <li>• Niacinamide: Reduces inflammation and oil production</li>
                    <li>• Retinoids: Prevents clogged pores and promotes cell turnover</li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-800 mb-1">Lifestyle Adjustments</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Stay hydrated by drinking at least 8 glasses of water daily</li>
                    <li>• Reduce dairy and high-glycemic foods in your diet</li>
                    <li>• Change pillowcases 2-3 times per week</li>
                    <li>• Manage stress through exercise, meditation, or adequate sleep</li>
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
                <h3 className="text-lg font-medium text-purple-900">Important Warnings</h3>
              </div>

              <div className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-1">What NOT to Do</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Don't pick, pop, or squeeze pimples (can lead to scarring)</li>
                    <li>• Avoid harsh scrubs or excessive exfoliation</li>
                    <li>• Don't apply toothpaste, lemon juice, or DIY remedies</li>
                    <li>• Avoid using multiple active ingredients at once</li>
                  </ul>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg">
                  <h4 className="font-medium text-amber-800 mb-1">When to See a Dermatologist</h4>
                  <p className="text-sm text-gray-700 mb-2">Consider consulting a dermatologist if:</p>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Your acne is severe or cystic</li>
                    <li>• Over-the-counter treatments haven't worked after 8-12 weeks</li>
                    <li>• You're developing scars from your acne</li>
                    <li>• Your acne is causing significant psychological distress</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-1">Disclaimer</h4>
                  <p className="text-sm text-gray-700">
                    This AI analysis is for informational purposes only and does not replace professional medical
                    advice. Results may vary, and the accuracy depends on image quality and other factors.
                  </p>
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
