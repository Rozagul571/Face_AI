"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ImageUpload } from "@/components/image-upload"
import { WebcamCapture } from "@/components/webcam-capture"
import { ImageUrlInput } from "@/components/image-url-input"
import { AnalysisResults } from "@/components/analysis-results"
import { Loader2 } from "lucide-react"

export default function AnalyzePage() {
  const [image, setImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<any | null>(null)

  const handleAnalyze = async () => {
    if (!image) return

    setIsAnalyzing(true)

    try {
      // In a real implementation, this would call the Roboflow API
      // For the MVP, we'll simulate a response after a delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock results for demonstration
      setResults({
        predictions: [
          { x: 120, y: 150, width: 40, height: 40, class: "papule", confidence: 0.92 },
          { x: 200, y: 180, width: 30, height: 30, class: "pustule", confidence: 0.87 },
          { x: 280, y: 140, width: 35, height: 35, class: "blackhead", confidence: 0.79 },
        ],
        severity: "moderate",
      })
    } catch (error) {
      console.error("Error analyzing image:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const resetAnalysis = () => {
    setImage(null)
    setResults(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      <Navbar />
      <div className="container max-w-5xl mx-auto py-10 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 font-heading text-purple-900">
          Yuzimni tahlil qil <span className="block text-2xl text-pink-600">(Analyze My Face)</span>
        </h1>

        {results ? (
          <div className="mt-8">
            <AnalysisResults results={results} image={image} />
            <div className="flex justify-center mt-8">
              <Button
                onClick={resetAnalysis}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-2 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105"
              >
                Start New Analysis
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-center text-gray-700 mb-8 max-w-2xl mx-auto">
              Upload a photo of your face or use your webcam to get an AI-powered analysis of your skin condition and
              personalized treatment recommendations.
            </p>

            <Tabs defaultValue="upload" className="max-w-3xl mx-auto">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="upload">Upload Photo</TabsTrigger>
                <TabsTrigger value="webcam">Use Webcam</TabsTrigger>
                <TabsTrigger value="url">Image URL</TabsTrigger>
              </TabsList>

              <Card className="border-2 border-purple-200 shadow-lg">
                <CardContent className="pt-6">
                  <TabsContent value="upload" className="mt-0">
                    <ImageUpload onImageSelected={setImage} />
                  </TabsContent>

                  <TabsContent value="webcam" className="mt-0">
                    <WebcamCapture onCapture={setImage} />
                  </TabsContent>

                  <TabsContent value="url" className="mt-0">
                    <ImageUrlInput onImageLoaded={setImage} />
                  </TabsContent>

                  {image && (
                    <div className="mt-6 flex justify-center">
                      <Button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                        className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-2 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 disabled:opacity-70"
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          "Analyze My Face"
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Tabs>
          </>
        )}
      </div>
      <Footer />
    </div>
  )
}
