"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

interface ChatMessageProps {
  message: {
    id: string
    content: string
    role: "user" | "assistant"
    timestamp: Date
  }
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isUser = message.role === "user"

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div className={`flex items-start max-w-[80%] ${isUser ? "flex-row-reverse" : ""}`}>
        <div
          className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
            isUser
              ? "bg-purple-100 text-purple-600 ml-2"
              : "bg-gradient-to-r from-pink-400 to-purple-500 text-white mr-2"
          }`}
        >
          {isUser ? <span className="text-sm font-bold">U</span> : <Sparkles size={16} />}
        </div>

        <div
          className={`rounded-2xl px-4 py-2 ${
            isUser ? "bg-purple-100 text-purple-900" : "bg-white border border-purple-200 text-gray-800 shadow-sm"
          }`}
        >
          <p className="text-sm">{message.content}</p>
          <div className={`text-xs mt-1 ${isUser ? "text-purple-500" : "text-gray-500"}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
