"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { CheckCircle2, AlertTriangle, Calendar, ArrowRight, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"

interface SkinCareRoutine {
  morning: string[]
  evening: string[]
  weekly: string[]
  warnings: string[]
}

interface SkinCareRoutines {
  [key: string]: {
    [key: string]: SkinCareRoutine
  }
}

const skinCareRoutines: SkinCareRoutines = {
  dry: {
    mild: {
      morning: [
        "Cleanse with a gentle, hydrating cleanser (e.g., CeraVe Hydrating Cleanser)",
        "Apply alcohol-free toner with hyaluronic acid",
        "Use a lightweight serum with niacinamide",
        "Apply oil-free moisturizer with ceramides",
        "Finish with SPF 30+ sunscreen",
      ],
      evening: [
        "Remove makeup with micellar water or cleansing balm",
        "Cleanse with the same gentle cleanser",
        "Apply a thin layer of 2.5% benzoyl peroxide to affected areas",
        "Use a hydrating serum with hyaluronic acid",
        "Apply a richer night moisturizer with ceramides",
      ],
      weekly: [
        "Use a gentle chemical exfoliant with lactic acid (1-2 times per week)",
        "Apply a hydrating mask with honey or aloe vera",
        "Skip any active ingredients on exfoliation days",
      ],
      warnings: [
        "Avoid harsh physical scrubs that can damage dry skin",
        "Don't use products with alcohol or fragrance",
        "Avoid hot water when washing your face",
        "Don't layer multiple active ingredients without patch testing",
      ],
    },
    moderate: {
      morning: [
        "Cleanse with a gentle, hydrating cleanser (e.g., CeraVe Hydrating Cleanser)",
        "Apply alcohol-free toner with hyaluronic acid",
        "Use a serum with niacinamide and zinc",
        "Apply oil-free moisturizer with ceramides",
        "Finish with SPF 30+ sunscreen",
      ],
      evening: [
        "Remove makeup with micellar water or cleansing balm",
        "Cleanse with the same gentle cleanser",
        "Apply a thin layer of adapalene gel 0.1% (Differin) to entire face",
        "Wait 20 minutes, then apply a hydrating serum",
        "Apply a richer night moisturizer with ceramides",
      ],
      weekly: [
        "Use a gentle chemical exfoliant with lactic acid (1-2 times per week)",
        "Apply a hydrating mask with honey or aloe vera",
        "Skip adapalene on exfoliation days",
      ],
      warnings: [
        "Avoid harsh physical scrubs that can damage dry skin",
        "Don't use products with alcohol or fragrance",
        "Avoid hot water when washing your face",
        "Don't use adapalene with other active ingredients without dermatologist approval",
      ],
    },
    severe: {
      morning: [
        "Cleanse with a gentle, hydrating cleanser (e.g., CeraVe Hydrating Cleanser)",
        "Apply alcohol-free toner with hyaluronic acid",
        "Use a prescription antibiotic lotion if prescribed",
        "Apply oil-free moisturizer with ceramides",
        "Finish with SPF 30+ sunscreen",
      ],
      evening: [
        "Remove makeup with micellar water or cleansing balm",
        "Cleanse with the same gentle cleanser",
        "Apply prescription treatments as directed by dermatologist",
        "Wait 20 minutes, then apply a hydrating serum",
        "Apply a richer night moisturizer with ceramides",
      ],
      weekly: [
        "Use a gentle chemical exfoliant with lactic acid (once per week)",
        "Apply a hydrating mask with honey or aloe vera",
        "Skip prescription treatments on exfoliation days",
      ],
      warnings: [
        "Consult a dermatologist before starting any routine",
        "Don't use products with alcohol or fragrance",
        "Avoid hot water when washing your face",
        "Don't use prescription treatments with other active ingredients without dermatologist approval",
      ],
    },
  },
  oily: {
    mild: {
      morning: [
        "Cleanse with a gentle foaming cleanser with salicylic acid",
        "Apply alcohol-free toner with witch hazel",
        "Use a lightweight serum with niacinamide and zinc",
        "Apply oil-free gel moisturizer",
        "Finish with oil-free SPF 30+ sunscreen",
      ],
      evening: [
        "Remove makeup with micellar water (if needed)",
        "Cleanse with the same foaming cleanser",
        "Apply a thin layer of 2.5% benzoyl peroxide to affected areas",
        "Use a lightweight serum with niacinamide",
        "Apply a lightweight oil-free gel moisturizer",
      ],
      weekly: [
        "Use a chemical exfoliant with salicylic acid (2-3 times per week)",
        "Apply a clay mask to absorb excess oil (once per week)",
        "Skip benzoyl peroxide on exfoliation days",
      ],
      warnings: [
        "Don't over-cleanse or use harsh soaps that strip natural oils",
        "Avoid alcohol-based products that can increase oil production",
        "Don't skip moisturizer (it's essential even for oily skin)",
        "Avoid comedogenic (pore-clogging) ingredients",
      ],
    },
    moderate: {
      morning: [
        "Cleanse with a gentle foaming cleanser with salicylic acid",
        "Apply alcohol-free toner with witch hazel",
        "Use a lightweight serum with niacinamide and zinc",
        "Apply oil-free gel moisturizer",
        "Finish with oil-free SPF 30+ sunscreen",
      ],
      evening: [
        "Remove makeup with micellar water (if needed)",
        "Cleanse with the same foaming cleanser",
        "Apply a thin layer of adapalene gel 0.1% (Differin) to entire face",
        "Wait 20 minutes, then apply a lightweight serum with niacinamide",
        "Apply a lightweight oil-free gel moisturizer",
      ],
      weekly: [
        "Use a chemical exfoliant with salicylic acid (1-2 times per week)",
        "Apply a clay mask to absorb excess oil (once per week)",
        "Skip adapalene on exfoliation days",
      ],
      warnings: [
        "Don't over-cleanse or use harsh soaps that strip natural oils",
        "Avoid alcohol-based products that can increase oil production",
        "Don't skip moisturizer (it's essential even for oily skin)",
        "Don't use adapalene with other active ingredients without dermatologist approval",
      ],
    },
    severe: {
      morning: [
        "Cleanse with a gentle foaming cleanser with salicylic acid",
        "Apply alcohol-free toner with witch hazel",
        "Use a prescription antibiotic lotion if prescribed",
        "Apply oil-free gel moisturizer",
        "Finish with oil-free SPF 30+ sunscreen",
      ],
      evening: [
        "Remove makeup with micellar water (if needed)",
        "Cleanse with the same foaming cleanser",
        "Apply prescription treatments as directed by dermatologist",
        "Wait 20 minutes, then apply a lightweight serum with niacinamide",
        "Apply a lightweight oil-free gel moisturizer",
      ],
      weekly: [
        "Use a chemical exfoliant with salicylic acid (once per week)",
        "Apply a clay mask to absorb excess oil (once per week)",
        "Skip prescription treatments on exfoliation days",
      ],
      warnings: [
        "Consult a dermatologist before starting any routine",
        "Don't over-cleanse or use harsh soaps that strip natural oils",
        "Avoid alcohol-based products that can increase oil production",
        "Don't use prescription treatments with other active ingredients without dermatologist approval",
      ],
    },
  },
  combination: {
    mild: {
      morning: [
        "Cleanse with a gentle balanced cleanser (e.g., CeraVe Foaming Cleanser)",
        "Apply alcohol-free toner with niacinamide",
        "Use a lightweight serum with hyaluronic acid",
        "Apply a lightweight moisturizer (more on dry areas, less on oily areas)",
        "Finish with SPF 30+ sunscreen",
      ],
      evening: [
        "Remove makeup with micellar water",
        "Cleanse with the same balanced cleanser",
        "Apply a thin layer of 2.5% benzoyl peroxide to affected areas",
        "Use a lightweight serum with niacinamide",
        "Apply a balanced moisturizer (more on dry areas, less on oily areas)",
      ],
      weekly: [
        "Use a chemical exfoliant with glycolic acid (1-2 times per week)",
        "Apply a multi-masking technique: clay mask on T-zone, hydrating mask on dry areas",
        "Skip benzoyl peroxide on exfoliation days",
      ],
      warnings: [
        "Don't use the same products all over your face if needs differ",
        "Avoid products with alcohol or fragrance",
        "Don't over-exfoliate the dry areas of your face",
        "Avoid comedogenic (pore-clogging) ingredients",
      ],
    },
    moderate: {
      morning: [
        "Cleanse with a gentle balanced cleanser (e.g., CeraVe Foaming Cleanser)",
        "Apply alcohol-free toner with niacinamide",
        "Use a lightweight serum with hyaluronic acid and zinc",
        "Apply a lightweight moisturizer (more on dry areas, less on oily areas)",
        "Finish with SPF 30+ sunscreen",
      ],
      evening: [
        "Remove makeup with micellar water",
        "Cleanse with the same balanced cleanser",
        "Apply a thin layer of adapalene gel 0.1% (Differin) to entire face",
        "Wait 20 minutes, then apply a lightweight serum with niacinamide",
        "Apply a balanced moisturizer (more on dry areas, less on oily areas)",
      ],
      weekly: [
        "Use a chemical exfoliant with glycolic acid (1-2 times per week)",
        "Apply a multi-masking technique: clay mask on T-zone, hydrating mask on dry areas",
        "Skip adapalene on exfoliation days",
      ],
      warnings: [
        "Don't use the same products all over your face if needs differ",
        "Avoid products with alcohol or fragrance",
        "Don't over-exfoliate the dry areas of your face",
        "Don't use adapalene with other active ingredients without dermatologist approval",
      ],
    },
    severe: {
      morning: [
        "Cleanse with a gentle balanced cleanser (e.g., CeraVe Foaming Cleanser)",
        "Apply alcohol-free toner with niacinamide",
        "Use a prescription antibiotic lotion if prescribed",
        "Apply a lightweight moisturizer (more on dry areas, less on oily areas)",
        "Finish with SPF 30+ sunscreen",
      ],
      evening: [
        "Remove makeup with micellar water",
        "Cleanse with the same balanced cleanser",
        "Apply prescription treatments as directed by dermatologist",
        "Wait 20 minutes, then apply a lightweight serum with niacinamide",
        "Apply a balanced moisturizer (more on dry areas, less on oily areas)",
      ],
      weekly: [
        "Use a chemical exfoliant with glycolic acid (once per week)",
        "Apply a multi-masking technique: clay mask on T-zone, hydrating mask on dry areas",
        "Skip prescription treatments on exfoliation days",
      ],
      warnings: [
        "Consult a dermatologist before starting any routine",
        "Don't use the same products all over your face if needs differ",
        "Avoid products with alcohol or fragrance",
        "Don't use prescription treatments with other active ingredients without dermatologist approval",
      ],
    },
  },
  sensitive: {
    mild: {
      morning: [
        "Cleanse with a fragrance-free, gentle cleanser (e.g., Vanicream Gentle Facial Cleanser)",
        "Apply alcohol-free, fragrance-free toner (optional)",
        "Use a simple moisturizer with minimal ingredients",
        "Finish with mineral-based SPF 30+ sunscreen (zinc oxide or titanium dioxide)",
      ],
      evening: [
        "Remove makeup with micellar water formulated for sensitive skin",
        "Cleanse with the same gentle cleanser",
        "Apply azelaic acid 10% to affected areas (gentler than benzoyl peroxide)",
        "Use a simple, fragrance-free moisturizer",
      ],
      weekly: [
        "Use a very gentle chemical exfoliant with mandelic acid (once per week)",
        "Apply a soothing mask with oat, aloe vera, or centella asiatica",
        "Skip azelaic acid on exfoliation days",
      ],
      warnings: [
        "Always patch test new products for 24-48 hours before full application",
        "Avoid products with fragrance, essential oils, alcohol, or sulfates",
        "Don't use hot water when washing your face",
        "Introduce new products one at a time, at least 2 weeks apart",
      ],
    },
    moderate: {
      morning: [
        "Cleanse with a fragrance-free, gentle cleanser (e.g., Vanicream Gentle Facial Cleanser)",
        "Apply alcohol-free, fragrance-free toner (optional)",
        "Use a simple moisturizer with minimal ingredients",
        "Finish with mineral-based SPF 30+ sunscreen (zinc oxide or titanium dioxide)",
      ],
      evening: [
        "Remove makeup with micellar water formulated for sensitive skin",
        "Cleanse with the same gentle cleanser",
        "Apply azelaic acid 15-20% to affected areas (prescription strength)",
        "Use a simple, fragrance-free moisturizer with ceramides",
      ],
      weekly: [
        "Use a very gentle chemical exfoliant with mandelic acid (once per week)",
        "Apply a soothing mask with oat, aloe vera, or centella asiatica",
        "Skip azelaic acid on exfoliation days",
      ],
      warnings: [
        "Consult a dermatologist before starting any active ingredients",
        "Avoid products with fragrance, essential oils, alcohol, or sulfates",
        "Don't use hot water when washing your face",
        "Introduce new products one at a time, at least 2 weeks apart",
      ],
    },
    severe: {
      morning: [
        "Cleanse with a fragrance-free, gentle cleanser (e.g., Vanicream Gentle Facial Cleanser)",
        "Apply alcohol-free, fragrance-free toner (optional)",
        "Use a prescription antibiotic lotion if prescribed",
        "Use a simple moisturizer with minimal ingredients",
        "Finish with mineral-based SPF 30+ sunscreen (zinc oxide or titanium dioxide)",
      ],
      evening: [
        "Remove makeup with micellar water formulated for sensitive skin",
        "Cleanse with the same gentle cleanser",
        "Apply prescription treatments as directed by dermatologist",
        "Use a simple, fragrance-free moisturizer with ceramides",
      ],
      weekly: [
        "Follow dermatologist recommendations for exfoliation (if any)",
        "Apply a soothing mask with oat, aloe vera, or centella asiatica",
        "Skip prescription treatments on mask days",
      ],
      warnings: [
        "Consult a dermatologist before starting any routine",
        "Avoid products with fragrance, essential oils, alcohol, or sulfates",
        "Don't use hot water when washing your face",
        "Don't use prescription treatments with other active ingredients without dermatologist approval",
      ],
    },
  },
}

export function SevenDayPlan({
  skinType = "combination",
  severity = "moderate",
}: { skinType?: string; severity?: string }) {
  const [currentDay, setCurrentDay] = useState(1)
  const [completedDays, setCompletedDays] = useState<number[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const routine = skinCareRoutines[skinType]?.[severity] || skinCareRoutines.combination.moderate

  const markDayComplete = () => {
    if (!completedDays.includes(currentDay)) {
      setCompletedDays([...completedDays, currentDay])

      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }
  }

  const goToNextDay = () => {
    if (currentDay < 7) {
      setCurrentDay(currentDay + 1)
    }
  }

  const goToPrevDay = () => {
    if (currentDay > 1) {
      setCurrentDay(currentDay - 1)
    }
  }

  return (
    <Card className="border-2 border-purple-200 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold text-purple-900 flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-pink-500" />
          Your 7-Day Skincare Plan
          <span className="ml-auto text-sm font-normal text-gray-500">Day {currentDay} of 7</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevDay}
            disabled={currentDay === 1}
            className="border-purple-200"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <div className="flex space-x-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <button
                key={i}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors
                  ${
                    currentDay === i + 1
                      ? "bg-purple-600 text-white"
                      : completedDays.includes(i + 1)
                        ? "bg-green-100 text-green-700 border border-green-300"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                onClick={() => setCurrentDay(i + 1)}
              >
                {completedDays.includes(i + 1) ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={goToNextDay}
            disabled={currentDay === 7}
            className="border-purple-200"
          >
            Next
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        <Tabs defaultValue="morning">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="morning">Morning</TabsTrigger>
            <TabsTrigger value="evening">Evening</TabsTrigger>
            <TabsTrigger value="weekly">{currentDay === 7 ? "Weekly" : "Tips"}</TabsTrigger>
          </TabsList>

          <TabsContent value="morning" className="mt-0 space-y-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <h3 className="font-medium text-lg mb-3 text-purple-900">Morning Routine</h3>
              <div className="space-y-2">
                {routine.morning.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 p-2 rounded-md hover:bg-purple-50 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="evening" className="mt-0 space-y-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <h3 className="font-medium text-lg mb-3 text-purple-900">Evening Routine</h3>
              <div className="space-y-2">
                {routine.evening.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 p-2 rounded-md hover:bg-purple-50 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="weekly" className="mt-0 space-y-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              {currentDay === 7 ? (
                <>
                  <h3 className="font-medium text-lg mb-3 text-purple-900">Weekly Treatments</h3>
                  <div className="space-y-2">
                    {routine.weekly.map((step, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 p-2 rounded-md hover:bg-purple-50 transition-colors"
                      >
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <h3 className="font-medium text-lg mb-3 text-purple-900 flex items-center">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                    Important Tips
                  </h3>
                  <div className="space-y-2">
                    {routine.warnings.map((warning, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 p-2 rounded-md hover:bg-red-50 transition-colors"
                      >
                        <span className="text-red-500 font-bold mt-0.5">✕</span>
                        <span>{warning}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-center">
          <Button
            onClick={markDayComplete}
            disabled={completedDays.includes(currentDay)}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-2 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105"
          >
            {completedDays.includes(currentDay) ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Completed
              </>
            ) : (
              "Mark Day Complete"
            )}
          </Button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">{completedDays.length} of 7 days completed</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div
              className="bg-gradient-to-r from-pink-500 to-purple-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${(completedDays.length / 7) * 100}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
