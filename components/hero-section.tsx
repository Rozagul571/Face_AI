"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, Camera, MessageCircle, Sparkles } from "lucide-react"

export function HeroSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <section className="py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-purple-900 font-heading leading-tight">
                <span className="block">Clear skin,</span>
                <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text">
                  confident you!
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-lg">
                Derion AI uses advanced artificial intelligence to analyze your skin, detect acne, and provide
                personalized treatment recommendations.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-6 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105"
                >
                  <Link href="/analyze">
                    <Camera className="mr-2 h-5 w-5" />
                    Analyze My Face
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="px-8 py-6 rounded-full border-2 border-purple-300 hover:border-purple-500 transform transition-all duration-300 hover:scale-105"
                >
                  <Link href="/chat">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Chat with DermAI
                  </Link>
                </Button>
              </div>

              <div className="mt-8 flex items-center text-sm text-gray-600">
                <Sparkles className="h-4 w-4 text-pink-500 mr-2" />
                <span>Powered by Roboflow Acne Detection & OpenAI</span>
              </div>
            </motion.div>
          </div>

          <div className="md:w-1/2 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="w-full h-[400px] md:h-[500px] bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl overflow-hidden shadow-xl relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src="/placeholder.svg?height=400&width=400"
                    alt="AI Skin Analysis Demo"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent flex flex-col items-center justify-end p-8">
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 max-w-xs">
                      <div className="flex items-start gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white">
                          <Sparkles size={16} />
                        </div>
                        <div>
                          <h3 className="font-bold text-purple-900">AI Analysis Result</h3>
                          <p className="text-sm text-gray-700">Moderate acne detected</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">3 papules, 2 pustules</span>
                        <Button size="sm" variant="ghost" className="text-purple-600 p-0 h-auto">
                          <ArrowRight size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Animated dots representing acne detection */}
                <motion.div
                  className="absolute top-1/4 left-1/3 w-6 h-6 rounded-full border-2 border-red-500"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 2,
                  }}
                />
                <motion.div
                  className="absolute top-1/2 left-1/2 w-6 h-6 rounded-full border-2 border-red-500"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 2,
                    delay: 0.5,
                  }}
                />
                <motion.div
                  className="absolute bottom-1/3 right-1/4 w-6 h-6 rounded-full border-2 border-red-500"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 2,
                    delay: 1,
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
