"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion, useAnimation, useInView } from "framer-motion"
import { ArrowRight, Camera, MessageCircle, Sparkles } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export function HeroSection() {
  const [mounted, setMounted] = useState(false)
  const [language, setLanguage] = useState<"en" | "uz">("en")
  const heroRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const isInView = useInView(heroRef, { once: false, amount: 0.3 })
  const controls = useAnimation()

  useEffect(() => {
    setMounted(true)

    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  useEffect(() => {
    if (!mounted) return

    // GSAP animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top center",
        end: "bottom top",
        scrub: 1,
      },
    })

    tl.to(videoRef.current, {
      y: 100,
      scale: 0.9,
      opacity: 0.8,
      duration: 1,
    })

    // Parallax effect on text
    gsap.to(textRef.current, {
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
      y: 50,
      opacity: 0.8,
      duration: 1,
    })

    // Cleanup
    return () => {
      if (typeof window !== "undefined") {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
      }
    }
  }, [mounted])

  if (!mounted) {
    return null
  }

  const content = {
    en: {
      heading1: "Clear skin,",
      heading2: "confident you!",
      description:
        "Every girl deserves to feel beautiful in her own skin. Your journey to clear, radiant skin starts here - because you're worth it!",
      button1: "Analyze My Face",
      button2: "Chat with DermAI",
    },
    uz: {
      heading1: "Toza teri,",
      heading2: "ishonchli siz!",
      description:
        "Har bir qiz o'z terisida go'zal bo'lishga loyiq. Toza, nur sochib turadigan teriga ega bo'lish yo'lingiz shu yerdan boshlanadi - chunki siz bunga loyiqsiz!",
      button1: "Yuzimni tahlil qil",
      button2: "DermAI bilan suhbatlashing",
    },
  }

  const currentContent = content[language]

  return (
    <section ref={heroRef} className="py-10 md:py-20 lg:py-28 overflow-hidden relative min-h-[100svh] flex items-center">
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-pink-600/5"></div>
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-pink-500"
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
              opacity: Math.random() * 0.5 + 0.3,
            }}
            animate={{
              y: [null, Math.random() * 100 + "%"],
              opacity: [null, Math.random() * 0.5 + 0.1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10 w-full">
        {/* Language switcher */}
        <div className="flex justify-end mb-4 space-x-2">
          <button
            onClick={() => setLanguage("en")}
            className={`px-3 py-1 rounded-full text-sm font-medium ${language === "en" ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage("uz")}
            className={`px-3 py-1 rounded-full text-sm font-medium ${language === "uz" ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            UZ
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-6">
          <div ref={textRef} className="w-full md:w-1/2 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-8 text-purple-900 font-heading leading-tight">
                <span className="block">{currentContent.heading1}</span>
                <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text">
                  {currentContent.heading2}
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 mb-6 md:mb-10 max-w-xl mx-auto md:mx-0">
                {currentContent.description}
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-6 justify-center md:justify-start">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 sm:px-10 py-5 sm:py-8 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 relative overflow-hidden group text-base sm:text-xl w-full sm:w-auto"
                >
                  <Link href="/analyze">
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-pink-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span className="relative flex items-center justify-center">
                      <Camera className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                      {currentContent.button1}
                    </span>
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="px-6 sm:px-10 py-5 sm:py-8 rounded-full border-2 border-purple-300 hover:border-purple-500 transform transition-all duration-300 hover:scale-105 relative overflow-hidden group text-base sm:text-xl w-full sm:w-auto"
                >
                  <Link href="/chat">
                    <span className="absolute inset-0 w-full h-full bg-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span className="relative flex items-center justify-center">
                      <MessageCircle className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                      {currentContent.button2}
                    </span>
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>

          <div className="w-full md:w-1/2 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="relative"
            >
              <div className="w-full h-[280px] sm:h-[380px] md:h-[480px] lg:h-[600px] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl relative">
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay loop muted playsInline>
                  <source src="/ACNE.mp4" type="video/mp4" />
                </video>

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-900/80 to-transparent p-4 md:p-8">
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 sm:p-6 max-w-sm mx-auto transform hover:scale-105 transition-transform duration-300">
                    <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white flex-shrink-0">
                        <Sparkles size={16} />
                      </div>
                      <div>
                        <h3 className="font-bold text-base sm:text-xl text-purple-900">AI ButyFace</h3>
                        <p className="text-xs sm:text-md text-gray-700">Your skin analysis assistant</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2 sm:mt-3">
                      <span className="text-xs sm:text-sm text-gray-500">Advanced AI technology</span>
                      <Button size="sm" variant="ghost" className="text-purple-600 p-0 h-auto">
                        <ArrowRight size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
