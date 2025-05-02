"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { Card } from "@/components/ui/card"

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

  // Format the message content if it contains bullet points
  const formatContent = (content: string) => {
    if (!content.includes("• ") && !content.includes("- ")) {
      return <p className="text-sm">{content}</p>
    }

    // Split by bullet points
    const parts = content.split(/(?=• )|(?=- )/)

    return (
      <div className="text-sm">
        {parts.map((part, index) => {
          if (part.startsWith("• ") || part.startsWith("- ")) {
            // This is a bullet point
            return (
              <div key={index} className="flex items-start mt-1">
                <span className="mr-2">{part.startsWith("• ") ? "•" : "-"}</span>
                <span>{part.replace(/^[•-] /, "")}</span>
              </div>
            )
          } else {
            // This is regular text
            return (
              <p key={index} className="mb-2">
                {part}
              </p>
            )
          }
        })}
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div className={`flex items-start max-w-[85%] ${isUser ? "flex-row-reverse" : ""}`}>
        <div
          className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
            isUser
              ? "bg-purple-100 text-purple-600 ml-2"
              : "bg-gradient-to-r from-pink-400 to-purple-500 text-white mr-2"
          }`}
        >
          {isUser ? <span className="text-sm font-bold">U</span> : <Sparkles size={16} />}
        </div>

        <Card
          className={`px-4 py-3 ${
            isUser ? "bg-purple-100 border-purple-200 text-purple-900" : "bg-white border-purple-200 text-gray-800"
          }`}
        >
          {formatContent(message.content)}
          <div className={`text-xs mt-1 ${isUser ? "text-purple-500" : "text-gray-500"}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        </Card>
      </div>
    </motion.div>
  )
}
