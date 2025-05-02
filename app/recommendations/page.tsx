"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Droplet, Sparkles, Sun } from "lucide-react"
import { SevenDayPlan } from "@/components/seven-day-plan"
import { KoreanProducts } from "@/components/korean-products"
import { motion } from "framer-motion"

// Update the product database with the provided images
const productDatabase = {
  dry: {
    mild: {
      basic: [
        {
          id: "d1",
          name: "CeraVe Hydrating Cleanser",
          description: "Gentle hydrating cleanser with ceramides and hyaluronic acid",
          price: 14.99,
          image: "https://beholdbeauty.lk/wp-content/uploads/2021/04/3423ctf23.jpeg",
          category: "Cleanser",
          ingredients: ["Ceramides", "Hyaluronic Acid", "Glycerin"],
          rating: 4.8,
        },
        {
          id: "d2",
          name: "The Ordinary Hyaluronic Acid 2% + B5",
          description: "Hydrating serum for multiple layers of hydration",
          price: 7.9,
          image:
            "https://www.lookfantastic.com/images?url=https://static.thcdn.com/productimg/original/13187076-6935232039266112.jpg&format=webp&auto=avif&width=985&height=985&fit=cover",
          category: "Serum",
          ingredients: ["Hyaluronic Acid", "Vitamin B5"],
          rating: 4.5,
        },
        {
          id: "d3",
          name: "La Roche-Posay Toleriane Double Repair Moisturizer",
          description: "Moisturizer with ceramides and niacinamide for dry skin",
          price: 19.99,
          image: "/placeholder.svg?height=200&width=200",
          category: "Moisturizer",
          ingredients: ["Ceramides", "Niacinamide", "Glycerin"],
          rating: 4.7,
        },
      ],
      premium: [
        {
          id: "d4",
          name: "CeraVe Hydrating Cleanser",
          description: "Gentle hydrating cleanser with ceramides and hyaluronic acid",
          price: 14.99,
          image: "/placeholder.svg?height=200&width=200",
          category: "Cleanser",
          ingredients: ["Ceramides", "Hyaluronic Acid", "Glycerin"],
          rating: 4.8,
        },
        {
          id: "d5",
          name: "The Ordinary Hyaluronic Acid 2% + B5",
          description: "Hydrating serum for multiple layers of hydration",
          price: 7.9,
          image: "/placeholder.svg?height=200&width=200",
          category: "Serum",
          ingredients: ["Hyaluronic Acid", "Vitamin B5"],
          rating: 4.5,
        },
        {
          id: "d6",
          name: "Paula's Choice 2% BHA Liquid Exfoliant",
          description: "Gentle exfoliant that unclogs pores and smooths skin",
          price: 32.0,
          image: "/placeholder.svg?height=200&width=200",
          category: "Exfoliant",
          ingredients: ["Salicylic Acid 2%", "Green Tea Extract"],
          rating: 4.9,
        },
        {
          id: "d7",
          name: "La Roche-Posay Toleriane Double Repair Moisturizer",
          description: "Moisturizer with ceramides and niacinamide for dry skin",
          price: 19.99,
          image: "/placeholder.svg?height=200&width=200",
          category: "Moisturizer",
          ingredients: ["Ceramides", "Niacinamide", "Glycerin"],
          rating: 4.7,
        },
        {
          id: "d8",
          name: "EltaMD UV Clear Broad-Spectrum SPF 46",
          description: "Oil-free sunscreen with niacinamide for sensitive skin",
          price: 37.0,
          image: "/placeholder.svg?height=200&width=200",
          category: "Sunscreen",
          ingredients: ["Zinc Oxide", "Niacinamide", "Hyaluronic Acid"],
          rating: 4.8,
        },
      ],
    },
    moderate: {
      basic: [
        {
          id: "d9",
          name: "CeraVe Hydrating Cleanser",
          description: "Gentle hydrating cleanser with ceramides and hyaluronic acid",
          price: 14.99,
          image: "/placeholder.svg?height=200&width=200",
          category: "Cleanser",
          ingredients: ["Ceramides", "Hyaluronic Acid", "Glycerin"],
          rating: 4.8,
        },
        {
          id: "d10",
          name: "Differin Gel 0.1%",
          description: "Adapalene gel for treating acne and preventing clogged pores",
          price: 13.99,
          image: "/placeholder.svg?height=200&width=200",
          category: "Treatment",
          ingredients: ["Adapalene 0.1%"],
          rating: 4.6,
        },
        {
          id: "d11",
          name: "La Roche-Posay Toleriane Double Repair Moisturizer",
          description: "Moisturizer with ceramides and niacinamide for dry skin",
          price: 19.99,
          image: "/placeholder.svg?height=200&width=200",
          category: "Moisturizer",
          ingredients: ["Ceramides", "Niacinamide", "Glycerin"],
          rating: 4.7,
        },
      ],
      premium: [
        {
          id: "d12",
          name: "CeraVe Hydrating Cleanser",
          description: "Gentle hydrating cleanser with ceramides and hyaluronic acid",
          price: 14.99,
          image: "/placeholder.svg?height=200&width=200",
          category: "Cleanser",
          ingredients: ["Ceramides", "Hyaluronic Acid", "Glycerin"],
          rating: 4.8,
        },
        {
          id: "d13",
          name: "The Ordinary Hyaluronic Acid 2% + B5",
          description: "Hydrating serum for multiple layers of hydration",
          price: 7.9,
          image: "/placeholder.svg?height=200&width=200",
          category: "Serum",
          ingredients: ["Hyaluronic Acid", "Vitamin B5"],
          rating: 4.5,
        },
        {
          id: "d14",
          name: "Differin Gel 0.1%",
          description: "Adapalene gel for treating acne and preventing clogged pores",
          price: 13.99,
          image: "/placeholder.svg?height=200&width=200",
          category: "Treatment",
          ingredients: ["Adapalene 0.1%"],
          rating: 4.6,
        },
        {
          id: "d15",
          name: "Paula's Choice 2% BHA Liquid Exfoliant",
          description: "Gentle exfoliant that unclogs pores and smooths skin",
          price: 32.0,
          image: "/placeholder.svg?height=200&width=200",
          category: "Exfoliant",
          ingredients: ["Salicylic Acid 2%", "Green Tea Extract"],
          rating: 4.9,
        },
        {
          id: "d16",
          name: "La Roche-Posay Toleriane Double Repair Moisturizer",
          description: "Moisturizer with ceramides and niacinamide for dry skin",
          price: 19.99,
          image: "/placeholder.svg?height=200&width=200",
          category: "Moisturizer",
          ingredients: ["Ceramides", "Niacinamide", "Glycerin"],
          rating: 4.7,
        },
      ],
    },
  },
  oily: {
    mild: {
      basic: [
        {
          id: "o1",
          name: "CeraVe Foaming Cleanser",
          description: "Gentle foaming cleanser for normal to oily skin",
          price: 12.99,
          image: "https://beholdbeauty.lk/wp-content/uploads/2021/04/3423ctf23.jpeg",
          category: "Cleanser",
          ingredients: ["Ceramides", "Niacinamide", "Hyaluronic Acid"],
          rating: 4.7,
        },
        {
          id: "o2",
          name: "The Ordinary Niacinamide 10% + Zinc 1%",
          description: "Serum to reduce sebum production and minimize pores",
          price: 6.99,
          image:
            "https://www.lookfantastic.com/images?url=https://static.thcdn.com/productimg/original/13187076-6935232039266112.jpg&format=webp&auto=avif&width=985&height=985&fit=cover",
          category: "Serum",
          ingredients: ["Niacinamide 10%", "Zinc PCA 1%"],
          rating: 4.6,
        },
        {
          id: "o3",
          name: "Neutrogena Oil-Free Moisturizer",
          description: "Lightweight, oil-free moisturizer for acne-prone skin",
          price: 9.99,
          image:
            "https://cdn.klassy.com.bd/uploads/products/products/NEUTROGENA(r)-Refreshingly-Clear-Oil-Free-Moisturiser-50ml-82ac-products.webp",
          category: "Moisturizer",
          ingredients: ["Glycerin", "Dimethicone"],
          rating: 4.5,
        },
      ],
      premium: [
        {
          id: "o4",
          name: "CeraVe Foaming Cleanser",
          description: "Gentle foaming cleanser for normal to oily skin",
          price: 12.99,
          image: "/placeholder.svg?height=200&width=200",
          category: "Cleanser",
          ingredients: ["Ceramides", "Niacinamide", "Hyaluronic Acid"],
          rating: 4.7,
        },
        {
          id: "o5",
          name: "The Ordinary Niacinamide 10% + Zinc 1%",
          description: "Serum to reduce sebum production and minimize pores",
          price: 6.99,
          image: "/placeholder.svg?height=200&width=200",
          category: "Serum",
          ingredients: ["Niacinamide 10%", "Zinc PCA 1%"],
          rating: 4.6,
        },
        {
          id: "o6",
          name: "Paula's Choice 2% BHA Liquid Exfoliant",
          description: "Gentle exfoliant that unclogs pores and smooths skin",
          price: 32.0,
          image: "/placeholder.svg?height=200&width=200",
          category: "Exfoliant",
          ingredients: ["Salicylic Acid 2%", "Green Tea Extract"],
          rating: 4.9,
        },
        {
          id: "o7",
          name: "Neutrogena Oil-Free Moisturizer",
          description: "Lightweight, oil-free moisturizer for acne-prone skin",
          price: 9.99,
          image: "/placeholder.svg?height=200&width=200",
          category: "Moisturizer",
          ingredients: ["Glycerin", "Dimethicone"],
          rating: 4.5,
        },
        {
          id: "o8",
          name: "La Roche-Posay Effaclar Duo",
          description: "Dual action acne treatment with niacinamide",
          price: 29.99,
          image: "/placeholder.svg?height=200&width=200",
          category: "Treatment",
          ingredients: ["Niacinamide", "LHA", "Glycerin"],
          rating: 4.8,
        },
      ],
    },
    moderate: {
      basic: [
        {
          id: "o9",
          name: "CeraVe Foaming Cleanser",
          description: "Gentle foaming cleanser for normal to oily skin",
          price: 12.99,
          image: "/placeholder.svg?height=200&width=200",
          category: "Cleanser",
          ingredients: ["Ceramides", "Niacinamide", "Hyaluronic Acid"],
          rating: 4.7,
        },
        {
          id: "o10",
          name: "Differin Gel 0.1%",
          description: "Adapalene gel for treating acne and preventing clogged pores",
          price: 13.99,
          image: "/placeholder.svg?height=200&width=200",
          category: "Treatment",
          ingredients: ["Adapalene 0.1%"],
          rating: 4.6,
        },
        {
          id: "o11",
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
          id: "o12",
          name: "CeraVe Foaming Cleanser",
          description: "Gentle foaming cleanser for normal to oily skin",
          price: 12.99,
          image: "/placeholder.svg?height=200&width=200",
          category: "Cleanser",
          ingredients: ["Ceramides", "Niacinamide", "Hyaluronic Acid"],
          rating: 4.7,
        },
        {
          id: "o13",
          name: "The Ordinary Niacinamide 10% + Zinc 1%",
          description: "Serum to reduce sebum production and minimize pores",
          price: 6.99,
          image: "/placeholder.svg?height=200&width=200",
          category: "Serum",
          ingredients: ["Niacinamide 10%", "Zinc PCA 1%"],
          rating: 4.6,
        },
        {
          id: "o14",
          name: "Differin Gel 0.1%",
          description: "Adapalene gel for treating acne and preventing clogged pores",
          price: 13.99,
          image: "/placeholder.svg?height=200&width=200",
          category: "Treatment",
          ingredients: ["Adapalene 0.1%"],
          rating: 4.6,
        },
        {
          id: "o15",
          name: "Paula's Choice 2% BHA Liquid Exfoliant",
          description: "Gentle exfoliant that unclogs pores and smooths skin",
          price: 32.0,
          image: "/placeholder.svg?height=200&width=200",
          category: "Exfoliant",
          ingredients: ["Salicylic Acid 2%", "Green Tea Extract"],
          rating: 4.9,
        },
        {
          id: "o16",
          name: "Neutrogena Oil-Free Moisturizer",
          description: "Lightweight, oil-free moisturizer for acne-prone skin",
          price: 9.99,
          image: "/placeholder.svg?height=200&width=200",
          category: "Moisturizer",
          ingredients: ["Glycerin", "Dimethicone"],
          rating: 4.5,
        },
      ],
    },
  },
  combination: {
    mild: {
      basic: [
        {
          id: "1",
          name: "CeraVe Foaming Cleanser",
          description: "Gentle foaming cleanser for normal to oily skin",
          price: 12.99,
          image: "https://beholdbeauty.lk/wp-content/uploads/2021/04/3423ctf23.jpeg",
          category: "Cleanser",
          ingredients: ["Ceramides", "Niacinamide", "Hyaluronic Acid"],
          rating: 4.7,
        },
        {
          id: "2",
          name: "Differin Gel 0.1%",
          description: "Adapalene gel for treating acne and preventing clogged pores",
          price: 13.99,
          image: "https://img.fruugo.com/product/7/16/866232167_max.jpg",
          category: "Treatment",
          ingredients: ["Adapalene 0.1%"],
          rating: 4.6,
        },
        {
          id: "3",
          name: "Neutrogena Oil-Free Moisturizer",
          description: "Lightweight, oil-free moisturizer for acne-prone skin",
          price: 9.99,
          image:
            "https://cdn.klassy.com.bd/uploads/products/products/NEUTROGENA(r)-Refreshingly-Clear-Oil-Free-Moisturiser-50ml-82ac-products.webp",
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
          image:
            "https://www.paulaschoice.com/dw/image/v2/BBNX_PRD/on/demandware.static/-/Sites-pc-catalog/default/dwc5c8a8b7/images/products/2-percent-bha-liquid-exfoliant-2010-portrait.png?sw=2000&sfrm=png",
          category: "Exfoliant",
          ingredients: ["Salicylic Acid 2%", "Green Tea Extract"],
          rating: 4.9,
        },
        {
          id: "6",
          name: "The Ordinary Niacinamide 10% + Zinc 1%",
          description: "Serum to reduce sebum production and minimize pores",
          price: 6.99,
          image:
            "https://www.lookfantastic.com/images?url=https://static.thcdn.com/productimg/original/13187076-6935232039266112.jpg&format=webp&auto=avif&width=985&height=985&fit=cover",
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
    },
    moderate: {
      basic: [
        {
          id: "c1",
          name: "CeraVe Foaming Cleanser",
          description: "Gentle foaming cleanser for normal to oily skin",
          price: 12.99,
          image: "/placeholder.svg?height=200&width=200",
          category: "Cleanser",
          ingredients: ["Ceramides", "Niacinamide", "Hyaluronic Acid"],
          rating: 4.7,
        },
        {
          id: "c2",
          name: "Differin Gel 0.1%",
          description: "Adapalene gel for treating acne and preventing clogged pores",
          price: 13.99,
          image: "/placeholder.svg?height=200&width=200",
          category: "Treatment",
          ingredients: ["Adapalene 0.1%"],
          rating: 4.6,
        },
        {
          id: "c3",
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
          id: "c4",
          name: "CeraVe Foaming Cleanser",
          description: "Gentle foaming cleanser for normal to oily skin",
          price: 12.99,
          image: "/placeholder.svg?height=200&width=200",
          category: "Cleanser",
          ingredients: ["Ceramides", "Niacinamide", "Hyaluronic Acid"],
          rating: 4.7,
        },
        {
          id: "c5",
          name: "The Ordinary Niacinamide 10% + Zinc 1%",
          description: "Serum to reduce sebum production and minimize pores",
          price: 6.99,
          image: "/placeholder.svg?height=200&width=200",
          category: "Serum",
          ingredients: ["Niacinamide 10%", "Zinc PCA 1%"],
          rating: 4.6,
        },
        {
          id: "c6",
          name: "Differin Gel 0.1%",
          description: "Adapalene gel for treating acne and preventing clogged pores",
          price: 13.99,
          image: "/placeholder.svg?height=200&width=200",
          category: "Treatment",
          ingredients: ["Adapalene 0.1%"],
          rating: 4.6,
        },
        {
          id: "c7",
          name: "Paula's Choice 2% BHA Liquid Exfoliant",
          description: "Gentle exfoliant that unclogs pores and smooths skin",
          price: 32.0,
          image: "/placeholder.svg?height=200&width=200",
          category: "Exfoliant",
          ingredients: ["Salicylic Acid 2%", "Green Tea Extract"],
          rating: 4.9,
        },
        {
          id: "c8",
          name: "Neutrogena Oil-Free Moisturizer",
          description: "Lightweight, oil-free moisturizer for acne-prone skin",
          price: 9.99,
          image: "/placeholder.svg?height=200&width=200",
          category: "Moisturizer",
          ingredients: ["Glycerin", "Dimethicone"],
          rating: 4.5,
        },
      ],
    },
  },
  sensitive: {
    mild: {
      basic: [
        {
          id: "s1",
          name: "Vanicream Gentle Facial Cleanser",
          description: "Ultra-gentle cleanser for sensitive skin",
          price: 8.99,
          image: "/placeholder.svg?height=200&width=200",
          category: "Cleanser",
          ingredients: ["Glycerin", "Coco Glucoside"],
          rating: 4.7,
        },
        {
          id: "s2",
          name: "Avène Thermal Spring Water",
          description: "Soothing thermal water spray for sensitive skin",
          price: 14.0,
          image: "/placeholder.svg?height=200&width=200",
          category: "Toner",
          ingredients: ["Thermal Spring Water"],
          rating: 4.5,
        },
        {
          id: "s3",
          name: "La Roche-Posay Toleriane Double Repair Face Moisturizer",
          description: "Gentle moisturizer for sensitive skin",
          price: 19.99,
          image: "/placeholder.svg?height=200&width=200",
          category: "Moisturizer",
          ingredients: ["Ceramides", "Niacinamide", "Glycerin"],
          rating: 4.8,
        },
      ],
      premium: [
        {
          id: "s4",
          name: "Vanicream Gentle Facial Cleanser",
          description: "Ultra-gentle cleanser for sensitive skin",
          price: 8.99,
          image: "/placeholder.svg?height=200&width=200",
          category: "Cleanser",
          ingredients: ["Glycerin", "Coco Glucoside"],
          rating: 4.7,
        },
        {
          id: "s5",
          name: "Avène Thermal Spring Water",
          description: "Soothing thermal water spray for sensitive skin",
          price: 14.0,
          image: "/placeholder.svg?height=200&width=200",
          category: "Toner",
          ingredients: ["Thermal Spring Water"],
          rating: 4.5,
        },
        {
          id: "s6",
          name: "Azelaic Acid Suspension 10%",
          description: "Gentle treatment for acne and redness",
          price: 7.9,
          image: "/placeholder.svg?height=200&width=200",
          category: "Treatment",
          ingredients: ["Azelaic Acid 10%"],
          rating: 4.3,
        },
        {
          id: "s7",
          name: "La Roche-Posay Toleriane Double Repair Face Moisturizer",
          description: "Gentle moisturizer for sensitive skin",
          price: 19.99,
          image: "/placeholder.svg?height=200&width=200",
          category: "Moisturizer",
          ingredients: ["Ceramides", "Niacinamide", "Glycerin"],
          rating: 4.8,
        },
        {
          id: "s8",
          name: "EltaMD UV Clear Broad-Spectrum SPF 46",
          description: "Oil-free sunscreen with niacinamide for sensitive skin",
          price: 37.0,
          image: "/placeholder.svg?height=200&width=200",
          category: "Sunscreen",
          ingredients: ["Zinc Oxide", "Niacinamide", "Hyaluronic Acid"],
          rating: 4.8,
        },
      ],
    },
    moderate: {
      basic: [
        {
          id: "s9",
          name: "Vanicream Gentle Facial Cleanser",
          description: "Ultra-gentle cleanser for sensitive skin",
          price: 8.99,
          image: "/placeholder.svg?height=200&width=200",
          category: "Cleanser",
          ingredients: ["Glycerin", "Coco Glucoside"],
          rating: 4.7,
        },
        {
          id: "s10",
          name: "Finacea Gel 15%",
          description: "Prescription-strength azelaic acid for acne and rosacea",
          price: 35.0,
          image: "/placeholder.svg?height=200&width=200",
          category: "Treatment",
          ingredients: ["Azelaic Acid 15%"],
          rating: 4.6,
        },
        {
          id: "s11",
          name: "La Roche-Posay Toleriane Double Repair Face Moisturizer",
          description: "Gentle moisturizer for sensitive skin",
          price: 19.99,
          image: "/placeholder.svg?height=200&width=200",
          category: "Moisturizer",
          ingredients: ["Ceramides", "Niacinamide", "Glycerin"],
          rating: 4.8,
        },
      ],
      premium: [
        {
          id: "s12",
          name: "Vanicream Gentle Facial Cleanser",
          description: "Ultra-gentle cleanser for sensitive skin",
          price: 8.99,
          image: "/placeholder.svg?height=200&width=200",
          category: "Cleanser",
          ingredients: ["Glycerin", "Coco Glucoside"],
          rating: 4.7,
        },
        {
          id: "s13",
          name: "Avène Thermal Spring Water",
          description: "Soothing thermal water spray for sensitive skin",
          price: 14.0,
          image: "/placeholder.svg?height=200&width=200",
          category: "Toner",
          ingredients: ["Thermal Spring Water"],
          rating: 4.5,
        },
        {
          id: "s14",
          name: "Finacea Gel 15%",
          description: "Prescription-strength azelaic acid for acne and rosacea",
          price: 35.0,
          image: "/placeholder.svg?height=200&width=200",
          category: "Treatment",
          ingredients: ["Azelaic Acid 15%"],
          rating: 4.6,
        },
        {
          id: "s15",
          name: "La Roche-Posay Toleriane Double Repair Face Moisturizer",
          description: "Gentle moisturizer for sensitive skin",
          price: 19.99,
          image: "/placeholder.svg?height=200&width=200",
          category: "Moisturizer",
          ingredients: ["Ceramides", "Niacinamide", "Glycerin"],
          rating: 4.8,
        },
        {
          id: "s16",
          name: "EltaMD UV Clear Broad-Spectrum SPF 46",
          description: "Oil-free sunscreen with niacinamide for sensitive skin",
          price: 37.0,
          image: "/placeholder.svg?height=200&width=200",
          category: "Sunscreen",
          ingredients: ["Zinc Oxide", "Niacinamide", "Hyaluronic Acid"],
          rating: 4.8,
        },
      ],
    },
  },
}

export default function RecommendationsPage() {
  const [skinType, setSkinType] = useState("combination")
  const [severity, setSeverity] = useState(50)
  const [tier, setTier] = useState("basic")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const getSeverityLevel = () => {
    if (severity < 33) return "mild"
    if (severity < 66) return "moderate"
    return "severe"
  }

  const severityLevel = getSeverityLevel()

  // Get products based on skin type, severity, and tier
  const getProducts = () => {
    const skinTypeProducts = productDatabase[skinType as keyof typeof productDatabase] || productDatabase.combination
    const severityProducts =
      skinTypeProducts[severityLevel as keyof typeof skinTypeProducts] || skinTypeProducts.moderate
    return severityProducts[tier as keyof typeof severityProducts] || severityProducts.basic
  }

  const products = getProducts()

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      <Navbar />

      <div className="container max-w-6xl mx-auto py-10 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 font-heading text-purple-900">
            Personalized Recommendations
          </h1>
          <p className="text-center text-gray-700 mb-10 max-w-2xl mx-auto">
            Get customized skincare product recommendations based on your skin type and acne severity.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-2 border-purple-200 shadow-md hover:shadow-lg transition-shadow duration-300">
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-2 border-purple-200 shadow-md hover:shadow-lg transition-shadow duration-300">
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="border-2 border-purple-200 shadow-md hover:shadow-lg transition-shadow duration-300">
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
          </motion.div>
        </div>

        <Tabs defaultValue="products" className="max-w-5xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="products">Recommended Products</TabsTrigger>
            <TabsTrigger value="korean">Korean Products</TabsTrigger>
            <TabsTrigger value="routine">Daily Routine</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-0">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="korean" className="mt-0">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <KoreanProducts />
            </motion.div>
          </TabsContent>

          <TabsContent value="routine" className="mt-0">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <SevenDayPlan skinType={skinType} severity={getSeverityLevel()} />
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}
