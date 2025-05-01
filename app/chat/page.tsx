"use client"

import { useState, useRef, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ChatMessage } from "@/components/chat-message"
import { ChatInput } from "@/components/chat-input"
import { ChatbotAvatar } from "@/components/chatbot-avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm DermAI, your personal skincare assistant. How can I help you with your skin concerns today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsTyping(true)

    // Simulate AI response after a delay
    setTimeout(() => {
      const botResponses = [
        "Based on what you've described, it sounds like you might have inflammatory acne. I recommend using a gentle cleanser with salicylic acid twice daily.",
        "For your skin concerns, I'd suggest trying a benzoyl peroxide spot treatment on the affected areas. Apply it at night after cleansing.",
        "It's important to avoid picking at your acne as it can lead to scarring. Instead, try using a hydrocolloid patch on any active pimples.",
        "Make sure to moisturize daily with a non-comedogenic moisturizer to maintain your skin barrier while treating your acne.",
        "Drinking plenty of water and reducing dairy consumption might also help improve your skin condition based on recent studies.",
      ]

      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)]

      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: randomResponse,
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-purple-50">
      <Navbar />

      <div className="flex-1 container max-w-4xl mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="md:w-1/3">
            <ChatbotAvatar />
          </div>
          <div className="md:w-2/3">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 font-heading text-purple-900">DermAI Chat</h1>
            <p className="text-gray-700">
              I'm your personal AI dermatologist assistant. Describe your skin concerns, and I'll provide personalized
              advice based on dermatological expertise.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSendMessage("I have red pimples on my forehead")}
              >
                I have red pimples on my forehead
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleSendMessage("My skin is very oily")}>
                My skin is very oily
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSendMessage("What products should I use for acne?")}
              >
                What products should I use for acne?
              </Button>
            </div>
          </div>
        </div>

        <Card className="border-2 border-purple-200 shadow-lg p-4 h-[500px] flex flex-col">
          <div className="flex-1 overflow-y-auto mb-4 pr-2">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isTyping && (
              <div className="flex items-center gap-2 text-sm text-gray-500 p-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center text-white">
                  <Sparkles size={16} />
                </div>
                <div className="flex space-x-1">
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <ChatInput onSendMessage={handleSendMessage} />
        </Card>
      </div>

      <Footer />
    </div>
  )
}
