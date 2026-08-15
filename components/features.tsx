"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Camera, MessageCircle, ShoppingBag, Calendar, Users, Search, ArrowRight } from "lucide-react"
import Link from "next/link"

export function Features() {
  const [mounted, setMounted] = useState(false)
  const [language, setLanguage] = useState<"en" | "uz">("en")

  useEffect(() => {
    setMounted(true)
    // Get language from localStorage or other state management
    const storedLanguage = localStorage.getItem("language") as "en" | "uz" | null
    if (storedLanguage) {
      setLanguage(storedLanguage)
    }
  }, [])

  useEffect(() => {
    // Save language preference
    if (mounted) {
      localStorage.setItem("language", language)
    }
  }, [language, mounted])

  if (!mounted) {
    return null
  }

  const content = {
    en: {
      title: "How Derion AI Helps Your Skin",
      subtitle: "Our AI-powered platform provides comprehensive skincare solutions tailored to your unique needs.",
      features: [
        {
          icon: <Camera className="h-12 w-12 text-pink-500" />,
          title: "AI Skin Analysis",
          description: "Upload a photo and get an AI-powered analysis of your skin condition with acne detection.",
          link: "/analyze",
          color: "from-pink-500 to-pink-600",
        },
        {
          icon: <MessageCircle className="h-12 w-12 text-purple-500" />,
          title: "DermAI Chat",
          description: "Chat with our AI dermatologist assistant for personalized skincare advice.",
          link: "/chat",
          color: "from-purple-500 to-purple-600",
        },
        {
          icon: <ShoppingBag className="h-12 w-12 text-indigo-500" />,
          title: "Product Recommendations",
          description: "Get personalized product recommendations based on your skin type and concerns.",
          link: "/recommendations",
          color: "from-indigo-500 to-indigo-600",
        },
        {
          icon: <Calendar className="h-12 w-12 text-blue-500" />,
          title: "7-Day Cleansing Plan",
          description: "Follow a customized 7-day skincare routine designed for your specific needs.",
          link: "#",
          color: "from-blue-500 to-blue-600",
        },
        {
          icon: <Users className="h-12 w-12 text-teal-500" />,
          title: "Community Support",
          description: "Connect with others, share experiences, and learn from success stories.",
          link: "#",
          color: "from-teal-500 to-teal-600",
        },
        {
          icon: <Search className="h-12 w-12 text-rose-500" />,
          title: "Product Comparison",
          description: "Compare skincare products by ingredients, price, and effectiveness for your skin.",
          link: "#",
          color: "from-rose-500 to-rose-600",
        },
      ],
    },
    uz: {
      title: "Derion AI teringizga qanday yordam beradi",
      subtitle:
        "Bizning AI platformamiz sizning noyob ehtiyojlaringizga moslashtirilgan keng qamrovli teri parvarishi yechimlarini taqdim etadi.",
      features: [
        {
          icon: <Camera className="h-12 w-12 text-pink-500" />,
          title: "AI Teri Tahlili",
          description: "Rasmingizni yuklang va teringiz holatining AI tahlilini oling.",
          link: "/analyze",
          color: "from-pink-500 to-pink-600",
        },
        {
          icon: <MessageCircle className="h-12 w-12 text-purple-500" />,
          title: "DermAI Chat",
          description: "Shaxsiy teri parvarishi maslahatlari uchun AI dermatolog yordamchisi bilan suhbatlashing.",
          link: "/chat",
          color: "from-purple-500 to-purple-600",
        },
        {
          icon: <ShoppingBag className="h-12 w-12 text-indigo-500" />,
          title: "Mahsulot Tavsiyalari",
          description: "Teri turingiz va muammolaringizga asoslangan shaxsiy mahsulot tavsiyalarini oling.",
          link: "/recommendations",
          color: "from-indigo-500 to-indigo-600",
        },
        {
          icon: <Calendar className="h-12 w-12 text-blue-500" />,
          title: "7 kunlik tozalash rejasi",
          description:
            "O'zingizning maxsus ehtiyojlaringiz uchun mo'ljallangan 7 kunlik teri parvarishi rejasiga amal qiling.",
          link: "#",
          color: "from-blue-500 to-blue-600",
        },
        {
          icon: <Users className="h-12 w-12 text-teal-500" />,
          title: "Jamiyat Qo'llab-quvvatlashi",
          description:
            "Boshqalar bilan bog'laning, tajribalaringizni baham ko'ring va muvaffaqiyat hikoyalaridan o'rganing.",
          link: "#",
          color: "from-teal-500 to-teal-600",
        },
        {
          icon: <Search className="h-12 w-12 text-rose-500" />,
          title: "Mahsulotlarni Taqqoslash",
          description:
            "Teri parvarishi mahsulotlarini tarkibiy qismlari, narxi va teringiz uchun samaradorligi bo'yicha taqqoslang.",
          link: "#",
          color: "from-rose-500 to-rose-600",
        },
      ],
    },
  }

  const currentContent = content[language]

  return (
    <section className="py-10 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-purple-900 font-heading">{currentContent.title}</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">{currentContent.subtitle}</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-10">
          {currentContent.features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={feature.link}>
                <Card className="h-full border-3 border-purple-100 hover:border-purple-300 transition-all duration-300 hover:shadow-xl overflow-hidden group">
                  <CardContent className="p-4 sm:p-6 md:p-8">
                    <div className="mb-4 sm:mb-6 relative">
                      <div
                        className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300`}
                      >
                        {feature.icon}
                      </div>
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 text-purple-900 group-hover:text-purple-700 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-3 sm:mb-5">{feature.description}</p>
                    <div className="flex items-center text-sm sm:text-md font-medium text-purple-600 group-hover:translate-x-1 transition-transform duration-300">
                      <span>Learn more</span>
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
