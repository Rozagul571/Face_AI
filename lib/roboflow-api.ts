export interface AcnePrediction {
  x: number
  y: number
  width: number
  height: number
  class: string
  confidence: number
  points?: Array<{ x: number; y: number }>
}

export interface AnalysisResult {
  predictions: AcnePrediction[]
  severity: "mild" | "moderate" | "severe"
  percentages: { [key: string]: number }
}

export async function analyzeImage(imageData: string): Promise<AnalysisResult> {
  const base64Data = imageData.includes("base64,") ? imageData.split("base64,")[1] : imageData

  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: base64Data }),
  })

  if (!response.ok) throw new Error(`API error ${response.status}`)

  const data = await response.json()
  const predictions: AcnePrediction[] = data.predictions || []

  const counts: Record<string, number> = {}
  predictions.forEach((p) => { counts[p.class] = (counts[p.class] || 0) + 1 })

  const total = predictions.length
  const percentages: Record<string, number> = {}
  Object.keys(counts).forEach((k) => { percentages[k] = Math.round((counts[k] / total) * 100) })

  let severity: "mild" | "moderate" | "severe" = "mild"
  if (total > 8) severity = "severe"
  else if (total > 4) severity = "moderate"

  return { predictions, severity, percentages }
}

export const acneTypeColors: Record<string, string> = {
  acne: "#FF2222",
  blackhead: "#333333",
  whitehead: "#FFEEEE",
  papule: "#FF6B6B",
  pustule: "#FFAA00",
  nodule: "#9C27B0",
  cyst: "#8E44AD",
}

export const acneTypeDescriptions: Record<string, string> = {
  acne: "Acne lesion detected on the skin surface",
  blackhead: "Open comedones appearing as small dark spots",
  whitehead: "Closed comedones appearing as small white bumps",
  papule: "Small raised solid pimples, often red and tender",
  pustule: "Pimples containing pus with a white or yellow center",
  nodule: "Large solid painful lumps beneath the skin surface",
  cyst: "Deep painful pus-filled lesions that can cause scarring",
}

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
    description: "Contains AHA, BHA, and PHA to exfoliate and treat acne.",
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
    image: "https://oprahdailyprod.vtexassets.com/unsafe/1440x0/center/middle/filters:quality(85)/https%3A%2F%2Foprahdailyprod.vtexassets.com%2Farquivos%2Fids%2F499493%2Fimage_2.jpg%3Fv%3D638812818751770000",
    category: "Treatment",
    ingredients: ["Centella Asiatica", "Mineral Sunscreen", "Tiger Grass"],
    rating: 4.7,
    forProblems: ["Redness", "Inflammation", "Sensitive skin", "Acne"],
  },
]
