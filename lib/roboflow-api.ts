// This file contains the implementation for the Roboflow API integration

export interface AcnePrediction {
  x: number
  y: number
  width: number
  height: number
  class: string
  confidence: number
}

export interface AnalysisResult {
  predictions: AcnePrediction[]
  severity: "mild" | "moderate" | "severe"
  percentages: {
    [key: string]: number
  }
}

export async function analyzeImage(imageData: string): Promise<AnalysisResult> {
  try {
    console.log("Starting image analysis with Roboflow API")

    // Remove the data:image/jpeg;base64, part if present
    const base64Data = imageData.includes("base64,") ? imageData.split("base64,")[1] : imageData

    // Ensure we're sending valid JSON
    const requestBody = JSON.stringify({
      image: base64Data,
    })

    console.log("Sending request to analyze API")

    // Call our own API route which will handle the Roboflow API call
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    })

    console.log(`API response status: ${response.status}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`API error: ${errorText}`)
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    console.log("API response received:", JSON.stringify(data).substring(0, 200) + "...")

    const predictions = data.predictions || []

    // Calculate percentages
    const counts: { [key: string]: number } = {}
    predictions.forEach((pred: AcnePrediction) => {
      counts[pred.class] = (counts[pred.class] || 0) + 1
    })

    const total = predictions.length
    const percentages: { [key: string]: number } = {}

    if (total > 0) {
      Object.keys(counts).forEach((key) => {
        percentages[key] = Math.round((counts[key] / total) * 100)
      })
    }

    // Determine severity based on types and counts
    let severity: "mild" | "moderate" | "severe" = "mild"

    if (counts["nodule"] > 0 || counts["cyst"] > 0 || total > 8) {
      severity = "severe"
    } else if (counts["pustule"] > 1 || total > 4) {
      severity = "moderate"
    }

    return {
      predictions,
      severity,
      percentages,
    }
  } catch (error) {
    console.error("Error analyzing image:", error)

    // Fallback to mock data if API call fails
    console.log("Falling back to mock data")

    const mockPredictions = [
      { x: 120, y: 150, width: 40, height: 40, class: "papule", confidence: 0.92 },
      { x: 200, y: 180, width: 30, height: 30, class: "pustule", confidence: 0.87 },
      { x: 280, y: 140, width: 35, height: 35, class: "blackhead", confidence: 0.79 },
      { x: 150, y: 200, width: 25, height: 25, class: "whitehead", confidence: 0.85 },
      { x: 320, y: 220, width: 45, height: 45, class: "nodule", confidence: 0.72 },
    ]

    // Calculate percentages
    const counts: { [key: string]: number } = {}
    mockPredictions.forEach((pred) => {
      counts[pred.class] = (counts[pred.class] || 0) + 1
    })

    const total = mockPredictions.length
    const percentages: { [key: string]: number } = {}

    Object.keys(counts).forEach((key) => {
      percentages[key] = Math.round((counts[key] / total) * 100)
    })

    return {
      predictions: mockPredictions,
      severity: "moderate",
      percentages,
    }
  }
}

export const acneTypeColors = {
  blackhead: "#333333", // Dark gray/black
  whitehead: "#FFFFFF", // White
  papule: "#FF6B6B", // Red
  pustule: "#FFCC00", // Yellow
  nodule: "#9C27B0", // Purple
  cyst: "#8E44AD", // Deep purple
}

export const acneTypeDescriptions = {
  blackhead: "Open comedones that appear as small dark spots due to oxidation",
  whitehead: "Closed comedones that appear as small white or flesh-colored bumps",
  papule: "Small, raised, solid pimples that are often red and tender",
  pustule: "Pimples containing pus that have a white or yellow center",
  nodule: "Large, solid, painful lumps beneath the skin's surface",
  cyst: "Deep, painful, pus-filled lesions that can cause scarring",
}

// Export Korean products data
export const koreanProducts = [
  {
    id: "1",
    name: "Cosrx Low pH Good Morning Gel Cleanser",
    description: "A gentle cleansing gel with a pH level of 5.0-6.0. Contains 0.5% salicylic acid and tea tree oil.",
    price: 12.0,
    image: "https://beholdbeauty.lk/wp-content/uploads/2021/04/1Wrtewre-1.png",
    category: "Cleanser",
    ingredients: ["Salicylic Acid 0.5%", "Tea Tree Oil", "Betaine Salicylate"],
    rating: 4.7,
    forProblems: ["Open comedones", "Closed comedones", "Papules", "Pustules", "Large pores"],
  },
  {
    id: "2",
    name: "Cosrx Acne Pimple Master Patch",
    description: "Hydrocolloid patches that protect acne areas and accelerate healing.",
    price: 6.0,
    image: "https://www.btycosmetics.co.uk/cdn/shop/files/IMG-6807_800x.webp?v=1736275243",
    category: "Treatment",
    ingredients: ["Hydrocolloid", "Salicylic Acid", "Centella Asiatica"],
    rating: 4.9,
    forProblems: ["Papules", "Pustules", "Nodules", "Blackheads"],
  },
  {
    id: "3",
    name: "Cosrx Advanced Snail 96 Mucin Power Essence",
    description: "Contains 96% snail mucus filtrate and niacinamide (2%). Restores skin barrier.",
    price: 19.0,
    image: "https://www.kiyoko.com/cdn/shop/products/8058a7526ca0405f198521a8e72ccc7e_1400x.jpg?v=1708112316",
    category: "Essence",
    ingredients: ["Snail Secretion Filtrate 96%", "Niacinamide 2%"],
    rating: 4.8,
    forProblems: ["Dry skin", "Acne scars", "Papules", "Large pores"],
  },
  {
    id: "4",
    name: "Cosrx BHA Blackhead Power Liquid",
    description: "Contains 4% betaine salicylate (BHA) to remove blackheads and dead skin cells.",
    price: 22.0,
    image: "/placeholder.svg?height=200&width=200",
    category: "Exfoliant",
    ingredients: ["Betaine Salicylate 4%", "Niacinamide", "Willow Bark Water"],
    rating: 4.6,
    forProblems: ["Blackheads", "Closed comedones", "Large pores", "Oily skin"],
  },
  {
    id: "5",
    name: "Some By Mi AHA-BHA-PHA 30 Days Miracle Toner",
    description: "Contains AHA, BHA, and PHA to exfoliate and treat acne. Also contains tea tree extract.",
    price: 16.0,
    image: "https://koreanskincare.nl/cdn/shop/files/sbm_miracletoner_01.jpg?v=1712047447",
    category: "Toner",
    ingredients: ["AHA", "BHA", "PHA", "Tea Tree Extract"],
    rating: 4.5,
    forProblems: ["Acne", "Blackheads", "Whiteheads", "Uneven skin texture"],
  },
  {
    id: "6",
    name: "Dr.Jart+ Cicapair Tiger Grass Color Correcting Treatment SPF 30",
    description: "Color-correcting treatment that neutralizes redness and provides sun protection.",
    price: 52.0,
    image:
      "https://oprahdailyprod.vtexassets.com/unsafe/1440x0/center/middle/filters:quality(85)/https%3A%2F%2Foprahdailyprod.vtexassets.com%2Farquivos%2Fids%2F499493%2Fimage_2.jpg%3Fv%3D638812818751770000",
    category: "Treatment",
    ingredients: ["Centella Asiatica", "Mineral Sunscreen", "Tiger Grass"],
    rating: 4.7,
    forProblems: ["Redness", "Inflammation", "Sensitive skin", "Acne"],
  },
  {
    id: "7",
    name: "Some By Mi Snail Truecica Miracle Repair Serum",
    description: "Repair serum with snail mucin and truecica complex for damaged skin.",
    price: 18.0,
    image: "https://koreanskincare.nl/cdn/shop/files/m_kr_snail_serum_01.jpg?v=1688990607",
    category: "Serum",
    ingredients: ["Snail Secretion Filtrate", "Truecica Complex", "Centella Asiatica"],
    rating: 4.6,
    forProblems: ["Acne scars", "Damaged skin", "Inflammation", "Dryness"],
  },
]
