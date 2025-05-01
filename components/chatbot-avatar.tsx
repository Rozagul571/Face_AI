"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export function ChatbotAvatar() {
  const [mounted, setMounted] = useState(false)
  const [isWinking, setIsWinking] = useState(false)
  const [isTalking, setIsTalking] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Random winking effect
    const winkInterval = setInterval(() => {
      setIsWinking(true)
      setTimeout(() => setIsWinking(false), 300)
    }, 5000)

    // Random talking effect
    const talkInterval = setInterval(() => {
      setIsTalking(true)
      setTimeout(() => setIsTalking(false), 1500)
    }, 3000)

    return () => {
      clearInterval(winkInterval)
      clearInterval(talkInterval)
    }
  }, [])

  if (!mounted) return null

  return (
    <div className="chatbot-avatar-container">
      <motion.div
        className="chatbot-avatar-animation"
        animate={{
          y: [0, -5, 0],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 4,
          ease: "easeInOut",
        }}
      >
        <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl p-4 shadow-lg">
          <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Face */}
            <circle cx="100" cy="100" r="80" fill="url(#paint0_linear)" />

            {/* Eyes */}
            <ellipse cx="70" cy="85" rx="12" ry={isWinking ? "1" : "12"} fill="#5B21B6" />
            <circle cx="130" cy="85" r="12" fill="#5B21B6" />

            {/* Mouth */}
            <path
              d={isTalking ? "M70 130 Q100 150 130 130" : "M70 130 Q100 140 130 130"}
              stroke="#5B21B6"
              strokeWidth="4"
              fill="none"
            />

            {/* Blush */}
            <circle cx="60" cy="110" r="10" fill="#FCA5A5" opacity="0.6" />
            <circle cx="140" cy="110" r="10" fill="#FCA5A5" opacity="0.6" />

            {/* Gradient */}
            <defs>
              <linearGradient id="paint0_linear" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
                <stop stopColor="#EC4899" />
                <stop offset="1" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
          </svg>

          <div className="text-center mt-4">
            <h3 className="font-bold text-purple-900">DermAI</h3>
            <p className="text-sm text-gray-600">Your AI Dermatologist</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
