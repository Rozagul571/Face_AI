"use client"

import { useState, useRef, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ChatMessage } from "@/components/chat-message"
import { ChatInput } from "@/components/chat-input"
import { ChatbotAvatar } from "@/components/chatbot-avatar"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [language, setLanguage] = useState<"en" | "uz">("en")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Get language from localStorage or other state management
    const storedLanguage = localStorage.getItem("language") as "en" | "uz" | null
    if (storedLanguage) {
      setLanguage(storedLanguage)
    }

    // Add initial welcome message
    const initialMessage = {
      id: "1",
      content:
        language === "en"
          ? "Hello! I'm DermAI, your personal skincare assistant. How can I help you with your skin concerns today? I can provide detailed advice on acne treatment, skincare routines, product recommendations, and more."
          : "Salom! Men DermAI, sizning shaxsiy teri parvarishi yordamchingizman. Bugun teri muammolaringiz bo'yicha qanday yordam bera olaman? Men akne davolash, teri parvarishi tartiblari, mahsulot tavsiyalari va boshqalar haqida batafsil maslahat bera olaman.",
      role: "assistant",
      timestamp: new Date(),
    }

    setMessages([initialMessage])
  }, [language])

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
      const botResponses = {
        en: [
          `Based on what you've described, it sounds like you might have inflammatory acne. This is a comprehensive approach I recommend:

**Understanding Your Condition**
Inflammatory acne occurs when clogged pores become infected with bacteria, leading to redness, swelling, and sometimes pain. The P. acnes bacteria naturally present on your skin multiplies in the oxygen-poor environment of a clogged pore, triggering an immune response that causes inflammation.

**Daily Skincare Routine**
1. **Morning Cleansing**: Use a gentle cleanser with salicylic acid (1-2%) twice daily. Avoid harsh soaps that can strip your skin's natural oils and worsen inflammation. CeraVe Foaming Facial Cleanser or La Roche-Posay Effaclar Medicated Gel Cleanser are excellent options.

2. **Targeted Treatment**: Apply a 2.5-5% benzoyl peroxide product only to affected areas in the morning. This concentration is as effective as higher percentages but less irritating. It works by killing acne-causing bacteria and reducing inflammation. The Ordinary's Benzoyl Peroxide 5% or Paula's Choice Clear Regular Strength 2.5% Benzoyl Peroxide are good choices.

3. **Hydration**: Use a non-comedogenic moisturizer to maintain your skin barrier. Look for ingredients like ceramides, hyaluronic acid, and niacinamide. Neutrogena Hydro Boost Gel-Cream or CeraVe PM Facial Moisturizing Lotion are excellent options that won't clog pores.

4. **Sun Protection**: Always apply SPF 30+ during the day, even if it's cloudy. Sun exposure can worsen inflammation and cause post-acne hyperpigmentation. Look for oil-free, non-comedogenic formulas like EltaMD UV Clear or La Roche-Posay Anthelios.

5. **Evening Treatment**: Consider using a retinoid like adapalene (Differin) in the evening. Start with applying it every third night and gradually increase frequency as your skin adjusts. Retinoids help prevent clogged pores and reduce inflammation.`,

          `For oily skin, I recommend a comprehensive approach targeting excess sebum production while maintaining your skin's natural barrier:

**Understanding Oily Skin**
Oily skin occurs when sebaceous glands produce excess sebum, often due to genetics, hormonal fluctuations, climate, or improper skincare. While it can be frustrating, oily skin actually has benefits - it typically ages more slowly and develops fewer wrinkles than dry skin.

**Complete Morning Routine**
1. **Cleansing**: Use a foaming cleanser containing salicylic acid (1-2%) or glycolic acid (5-7%) to control oil and prevent pore clogging. These ingredients help dissolve excess oil and exfoliate dead skin cells. Recommended products include CeraVe Foaming Facial Cleanser or La Roche-Posay Effaclar Purifying Foaming Gel.

2. **Toning**: Apply an alcohol-free toner with ingredients like witch hazel, niacinamide, or zinc PCA to regulate sebum. These ingredients help balance oil production without stripping the skin. Paula's Choice Pore-Reducing Toner or The Ordinary Niacinamide 10% + Zinc 1% are excellent options.

3. **Treatment Serum**: Use a lightweight serum containing niacinamide (5-10%) and/or salicylic acid (1-2%). Niacinamide has been shown to reduce sebum production by up to 50% in some studies, while also strengthening the skin barrier. The Ordinary Niacinamide 10% + Zinc 1% or Paula's Choice 10% Niacinamide Booster are effective choices.`,

          `For acne-prone skin, here's a comprehensive product routine I recommend:

**Understanding Acne-Prone Skin**
Acne develops when hair follicles become clogged with oil and dead skin cells, creating an environment where bacteria can thrive. An effective skincare routine for acne-prone skin should focus on gentle cleansing, exfoliation, targeted treatment, and non-comedogenic hydration.

**Morning Routine Products**

1. **Gentle Cleanser**: 
   - CeraVe Foaming Facial Cleanser ($15) - Contains ceramides and niacinamide to cleanse without disrupting the skin barrier
   - La Roche-Posay Toleriane Purifying Foaming Cleanser ($16) - Non-drying formula with niacinamide and ceramides
   - Neutrogena Ultra Gentle Daily Cleanser ($9) - Fragrance-free and non-irritating

2. **Alcohol-Free Toner** (Optional):
   - Paula's Choice Pore-Reducing Toner ($21) - Contains niacinamide to reduce sebum production
   - Thayers Alcohol-Free Witch Hazel Toner ($11) - Soothes and balances skin without drying`,
        ],
        uz: [
          `Siz tasvirlagan narsalarga asoslanib, sizda yallig'lanishli akne bo'lishi mumkin. Men tavsiya etadigan keng qamrovli yondashuv:

**Holatni tushunish**
Yallig'lanishli akne teshiklar bakteriyalar bilan infektsiyalanganda, qizarish, shish va ba'zan og'riqqa olib keladi. Teringizda tabiiy ravishda mavjud bo'lgan P. acnes bakteriyalari tiqilib qolgan teshikning kislorodsiz muhitida ko'payadi, bu esa yallig'lanishga olib keladigan immunitet javobini keltirib chiqaradi.

**Kundalik teri parvarishi**
1. **Ertalabki tozalash**: Salitsil kislotasi (1-2%) bilan yumshoq tozalovchi vositadan kuniga ikki marta foydalaning. Teringizning tabiiy moylarini olib tashlashi va yallig'lanishni yomonlashtirishi mumkin bo'lgan qattiq sovunlardan saqlaning. CeraVe Foaming Facial Cleanser yoki La Roche-Posay Effaclar Medicated Gel Cleanser ajoyib tanlovlardir.

2. **Maqsadli davolash**: Ertalab faqat ta'sirlangan joylarga 2,5-5% benzoil peroksid mahsulotini qo'llang. Bu kontsentratsiya yuqori foizlar kabi samarali, lekin kamroq ta'sirlanadi. U akne keltirib chiqaruvchi bakteriyalarni o'ldirish va yallig'lanishni kamaytirish orqali ishlaydi. The Ordinary's Benzoyl Peroxide 5% yoki Paula's Choice Clear Regular Strength 2.5% Benzoyl Peroxide yaxshi tanlovlardir.

3. **Namlik**: Teri to'sig'ini saqlash uchun non-komedogen namlovchidan foydalaning. Ceramidlar, gialuronik kislota va niacinamide kabi ingredientlarni qidiring. Neutrogena Hydro Boost Gel-Cream yoki CeraVe PM Facial Moisturizing Lotion teshiklarni tiqib qo'ymaydigan ajoyib variantlardir.`,

          `Yog'li teri uchun men teri tabiiy to'sig'ini saqlab qolgan holda ortiqcha sebum ishlab chiqarishni nishonga oluvchi keng qamrovli yondashuvni tavsiya qilaman:

**Yog'li terini tushunish**
Yog'li teri sebatsion bezlar ortiqcha sebum ishlab chiqarganda, ko'pincha genetika, gormonal o'zgarishlar, iqlim yoki noto'g'ri teri parvarishi tufayli yuzaga keladi. Garchi bu jirkanch bo'lishi mumkin bo'lsa-da, yog'li terining afzalliklari bor - u odatda sekinroq qariydi va quruq teriga qaraganda kamroq ajin paydo bo'ladi.

**To'liq ertalabki tartib**
1. **Tozalash**: Moyni nazorat qilish va teshiklarning tiqilib qolishining oldini olish uchun salitsil kislotasi (1-2%) yoki glikolik kislota (5-7%) bo'lgan ko'pikli tozalovchi vositadan foydalaning. Ushbu ingredientlar ortiqcha moyni eritishga va o'lik teri hujayralarini exfoliate qilishga yordam beradi. Tavsiya etilgan mahsulotlarga CeraVe Foaming Facial Cleanser yoki La Roche-Posay Effaclar Purifying Foaming Gel kiradi.

2. **Toning**: Sebumni tartibga solish uchun witch hazel, niacinamide yoki rux PCA kabi ingredientlari bo'lgan spirtli bo'lmagan tonerdan foydalaning. Ushbu ingredientlar terini ajratmasdan moy ishlab chiqarishni muvozanatlashga yordam beradi. Paula's Choice Pore-Reducing Toner yoki The Ordinary Niacinamide 10% + Zinc 1% ajoyib tanlovlardir.`,
        ],
      }

      // Select a random response based on language
      const responses = botResponses[language]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      const botMessage: Message = {
        id: Date.now().toString(),
        content: randomResponse,
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      <Navbar />
      <div className="container max-w-5xl mx-auto py-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <ChatbotAvatar />
            </motion.div>
          </div>
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-2 border-purple-200 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex flex-col h-[500px]">
                    <div className="flex-1 overflow-y-auto mb-4 pr-2">
                      {messages.map((message) => (
                        <ChatMessage key={message.id} message={message} />
                      ))}
                      {isTyping && (
                        <div className="flex justify-start mb-4">
                          <div className="bg-white border border-purple-200 rounded-lg px-4 py-2 max-w-[85%]">
                            <div className="flex space-x-2">
                              <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse-dot"></div>
                              <div
                                className="w-2 h-2 rounded-full bg-purple-500 animate-pulse-dot"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                              <div
                                className="w-2 h-2 rounded-full bg-purple-500 animate-pulse-dot"
                                style={{ animationDelay: "0.4s" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                    <div>
                      <ChatInput onSendMessage={handleSendMessage} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
