"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Camera, MessageCircle, ShoppingBag, Calendar, Users, Search, ArrowRight } from "lucide-react"
import Link from "next/link"

export function Features() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const features = [
    {
      icon: <Camera className="h-10 w-10 text-pink-500" />,
      title: "AI Skin Analysis",
      description: "Upload a photo and get an AI-powered analysis of your skin condition with acne detection.",
      link: "/analyze",
      color: "from-pink-500 to-pink-600",
    },
    {
      icon: <MessageCircle className="h-10 w-10 text-purple-500" />,
      title: "DermAI Chat",
      description: "Chat with our AI dermatologist assistant for personalized skincare advice.",
      link: "/chat",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: <ShoppingBag className="h-10 w-10 text-indigo-500" />,
      title: "Product Recommendations",
      description: "Get personalized product recommendations based on your skin type and concerns.",
      link: "/recommendations",
      color: "from-indigo-500 to-indigo-600",
    },
    {
      icon: <Calendar className="h-10 w-10 text-blue-500" />,
      title: "7-Day Cleansing Plan",
      description: "Follow a customized 7-day skincare routine designed for your specific needs.",
      link: "#",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: <Users className="h-10 w-10 text-teal-500" />,
      title: "Community Support",
      description: "Connect with others, share experiences, and learn from success stories.",
      link: "#",
      color: "from-teal-500 to-teal-600",
    },
    {
      icon: <Search className="h-10 w-10 text-rose-500" />,
      title: "Product Comparison",
      description: "Compare skincare products by ingredients, price, and effectiveness for your skin.",
      link: "#",
      color: "from-rose-500 to-rose-600",
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-purple-900 font-heading">
              How Derion AI Helps Your Skin
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Our AI-powered platform provides comprehensive skincare solutions tailored to your unique needs.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={feature.link}>
                <Card className="h-full border-2 border-purple-100 hover:border-purple-300 transition-all duration-300 hover:shadow-lg overflow-hidden group">
                  <CardContent className="p-6">
                    <div className="mb-4 relative">
                      <div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300`}
                      >
                        {feature.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-purple-900 group-hover:text-purple-700 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-700 mb-4">{feature.description}</p>
                    <div className="flex items-center text-sm font-medium text-purple-600 group-hover:translate-x-1 transition-transform duration-300">
                      <span>Learn more</span>
                      <ArrowRight className="ml-1 h-4 w-4" />
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
