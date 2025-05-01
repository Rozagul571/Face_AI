"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Droplet, Sparkles, Sun, AlertTriangle, CheckCircle2 } from "lucide-react"

const mockProducts = {
  basic: [
    {
      id: "1",
      name: "CeraVe Foaming Cleanser",
      description: "Gentle foaming cleanser for normal to oily skin",
      price: 12.99,
      image: "/placeholder.svg?height=200&width=200",
      category: "Cleanser",
      ingredients: ["Ceramides", "Niacinamide", "Hyaluronic Acid"],
      rating: 4.7,
    },
    {
      id: "2",
      name: "Metrogil Gel",
      description: "Topical antibiotic for inflammatory acne",
      price: 8.5,
      image: "/placeholder.svg?height=200&width=200",
      category: "Treatment",
      ingredients: ["Metronidazole 1%"],
      rating: 4.3,
    },
    {
      id: "3",
      name: "Neutrogena Oil-Free Moisturizer",
      description: "Lightweight, oil-free moisturizer for acne-prone skin",
      price: 9.99,
      image: "/placeholder.svg?height=200&width=200",
      category: "Moisturizer",
      ingredients: ["Glycerin", "Dimethicone"],
      rating: 4.5,
    },
  ],
  premium: [
    {
      id: "4",
      name: "La Roche-Posay Effaclar Duo",
      description: "Dual action acne treatment with niacinamide",
      price: 29.99,
      image: "/placeholder.svg?height=200&width=200",
      category: "Treatment",
      ingredients: ["Niacinamide", "LHA", "Glycerin"],
      rating: 4.8,
    },
    {
      id: "5",
      name: "Paula's Choice 2% BHA Liquid Exfoliant",
      description: "Gentle exfoliant that unclogs pores and smooths skin",
      price: 32.0,
      image: "/placeholder.svg?height=200&width=200",
      category: "Exfoliant",
      ingredients: ["Salicylic Acid 2%", "Green Tea Extract"],
      rating: 4.9,
    },
    {
      id: "6",
      name: "The Ordinary Niacinamide 10% + Zinc 1%",
      description: "Serum to reduce sebum production and minimize pores",
      price: 6.99,
      image: "/placeholder.svg?height=200&width=200",
      category: "Serum",
      ingredients: ["Niacinamide 10%", "Zinc PCA 1%"],
      rating: 4.6,
    },
    {
      id: "7",
      name: "Avène Cleanance Cleansing Gel",
      description: "Soap-free cleansing gel for oily, blemish-prone skin",
      price: 20.0,
      image: "/placeholder.svg?height=200&width=200",
      category: "Cleanser",
      ingredients: ["Zinc Gluconate", "Monolaurin"],
      rating: 4.5,
    },
    {
      id: "8",
      name: "Bioderma Sébium Pore Refiner",
      description: "Smoothing concentrate for enlarged pores",
      price: 19.9,
      image: "/placeholder.svg?height=200&width=200",
      category: "Treatment",
      ingredients: ["Salicylic Acid", "Agaric Acid"],
      rating: 4.4,
    },
  ],
}

export default function RecommendationsPage() {
  const [skinType, setSkinType] = useState("combination")
  const [severity, setSeverity] = useState(50)
  const [tier, setTier] = useState("basic")

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      <Navbar />

      <div className="container max-w-6xl mx-auto py-10 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 font-heading text-purple-900">
          Personalized Recommendations
        </h1>
        <p className="text-center text-gray-700 mb-10 max-w-2xl mx-auto">
          Get customized skincare product recommendations based on your skin type and acne severity.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="border-2 border-purple-200 shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Droplet className="h-5 w-5 text-pink-500" />
                <h3 className="text-lg font-medium">Skin Type</h3>
              </div>
              <RadioGroup value={skinType} onValueChange={setSkinType} className="gap-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dry" id="dry" />
                  <Label htmlFor="dry">Dry</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="oily" id="oily" />
                  <Label htmlFor="oily">Oily</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="combination" id="combination" />
                  <Label htmlFor="combination">Combination</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sensitive" id="sensitive" />
                  <Label htmlFor="sensitive">Sensitive</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Sun className="h-5 w-5 text-pink-500" />
                <h3 className="text-lg font-medium">Acne Severity</h3>
              </div>
              <div className="space-y-4">
                <Slider
                  value={[severity]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => setSeverity(value[0])}
                  className="mt-6"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Mild</span>
                  <span>Moderate</span>
                  <span>Severe</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-pink-500" />
                <h3 className="text-lg font-medium">Recommendation Tier</h3>
              </div>
              <RadioGroup value={tier} onValueChange={setTier} className="gap-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="basic" id="basic" />
                  <Label htmlFor="basic">Basic (3-5 products)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="premium" id="premium" />
                  <Label htmlFor="premium">Premium (7-10 products)</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="products" className="max-w-5xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="products">Recommended Products</TabsTrigger>
            <TabsTrigger value="routine">Daily Routine</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockProducts[tier === "premium" ? "premium" : "basic"].map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="routine" className="mt-0">
            <Card className="border-2 border-purple-200 shadow-lg">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-4 text-purple-900">Your 7-Day Skincare Routine</h3>

                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h4 className="font-medium text-lg mb-2">Morning Routine</h4>
                    <ol className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Cleanse with a gentle foaming cleanser</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Apply toner with a cotton pad</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Use oil-free moisturizer</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Apply SPF 30+ sunscreen</span>
                      </li>
                    </ol>
                  </div>

                  <div className="border-b pb-4">
                    <h4 className="font-medium text-lg mb-2">Evening Routine</h4>
                    <ol className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Remove makeup with micellar water</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Cleanse with the same gentle cleanser</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Apply Metrogil gel to affected areas</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Use a lightweight, non-comedogenic moisturizer</span>
                      </li>
                    </ol>
                  </div>

                  <div>
                    <h4 className="font-medium text-lg mb-2 flex items-center">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                      What NOT to do
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 font-bold">✕</span>
                        <span>Don't use harsh scrubs or exfoliants more than twice a week</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 font-bold">✕</span>
                        <span>Avoid picking or squeezing pimples</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 font-bold">✕</span>
                        <span>Don't apply lemon, toothpaste, or DIY remedies</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 font-bold">✕</span>
                        <span>Avoid heavy, comedogenic makeup products</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}
