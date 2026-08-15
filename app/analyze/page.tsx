"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ImageUpload } from "@/components/image-upload"
import { WebcamCapture } from "@/components/webcam-capture"
import { ImageUrlInput } from "@/components/image-url-input"
import { AnalysisResults } from "@/components/analysis-results"
import { Loader2, Camera, Upload, Globe, Sparkles } from "lucide-react"
import { analyzeImage } from "@/lib/roboflow-api"
import { motion } from "framer-motion"

export default function AnalyzePage() {
  const [image, setImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<any | null>(null)
  const [language, setLanguage] = useState<"en" | "uz">("en")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language") as "en" | "uz" | null
    if (storedLanguage) setLanguage(storedLanguage)
  }, [])

  const handleAnalyze = async () => {
    if (!image) return

    setIsAnalyzing(true)
    setError(null)

    try {
      console.log("Starting analysis...")

      // Validate image data format
      if (!image.startsWith("data:image")) {
        throw new Error("Invalid image format. Image must be a data URL.")
      }

      // Call the Roboflow API through our wrapper
      const analysisResults = await analyzeImage(image)
      console.log("Analysis complete:", analysisResults)
      setResults(analysisResults)
    } catch (error) {
      console.error("Error analyzing image:", error)

      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      setError(errorMessage)

      alert(
        language === "en"
          ? `There was an error analyzing your image: ${errorMessage}. Please try again.`
          : `Rasmingizni tahlil qilishda xatolik yuz berdi: ${errorMessage}. Iltimos, qayta urinib ko'ring.`,
      )
    } finally {
      setIsAnalyzing(false)
    }
  }

  const resetAnalysis = () => {
    setImage(null)
    setResults(null)
    setError(null)
  }

  const content = {
    en: {
      title: "Analyze My Face",
      subtitle:
        "Upload a photo of your face or use your webcam to get an AI-powered analysis of your skin condition and personalized treatment recommendations.",
      upload: "Upload Photo",
      webcam: "Use Webcam",
      url: "Image URL",
      analyzing: "Analyzing...",
      analyze: "Analyze My Face",
      newAnalysis: "Start New Analysis",
      error: "Error: ",
    },
    uz: {
      title: "Yuzimni tahlil qil",
      subtitle:
        "Teringiz holatining AI tahlilini va shaxsiy davolash tavsiyalarini olish uchun yuzingizning rasmini yuklang yoki veb-kameradan foydalaning.",
      upload: "Rasmni yuklash",
      webcam: "Veb-kameradan foydalanish",
      url: "Rasm URL",
      analyzing: "Tahlil qilinmoqda...",
      analyze: "Yuzimni tahlil qil",
      newAnalysis: "Yangi tahlilni boshlash",
      error: "Xato: ",
    },
  }

  const currentContent = content[language]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      <Navbar />
      <div className="container max-w-5xl mx-auto py-10 px-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 font-heading text-purple-900">
            {currentContent.title}
          </h1>
        </motion.div>

        {results ? (
          <div className="mt-8">
            <AnalysisResults results={results} image={image} />
            <div className="flex justify-center mt-8">
              <Button
                onClick={resetAnalysis}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-2 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105"
              >
                {currentContent.newAnalysis}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p className="text-center text-gray-700 mb-8 max-w-2xl mx-auto">{currentContent.subtitle}</p>
            </motion.div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
                {currentContent.error} {error}
              </div>
            )}

            <Tabs defaultValue="upload" className="max-w-3xl mx-auto">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  {currentContent.upload}
                </TabsTrigger>
                <TabsTrigger value="webcam" className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  {currentContent.webcam}
                </TabsTrigger>
                <TabsTrigger value="url" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  {currentContent.url}
                </TabsTrigger>
              </TabsList>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
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
                      <motion.div
                        className="mt-6 flex justify-center"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Button
                          onClick={handleAnalyze}
                          disabled={isAnalyzing}
                          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-2 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 disabled:opacity-70"
                        >
                          {isAnalyzing ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              {currentContent.analyzing}
                            </>
                          ) : (
                            <>
                              <Sparkles className="mr-2 h-4 w-4" />
                              {currentContent.analyze}
                            </>
                          )}
                        </Button>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </Tabs>
          </>
        )}
      </div>
      <Footer />
    </div>
  )
}
