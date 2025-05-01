"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Star, Info, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  ingredients: string[]
  rating: number
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  return (
    <Card className="overflow-hidden border-2 border-purple-100 hover:border-purple-300 transition-all duration-300 hover:shadow-lg group">
      <div className="relative overflow-hidden">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Badge className="absolute top-2 right-2 bg-purple-600">{product.category}</Badge>
      </div>

      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-purple-900 line-clamp-1">{product.name}</h3>
          <button onClick={toggleFavorite} className="text-gray-400 hover:text-pink-500 transition-colors">
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-pink-500 text-pink-500" : ""}`} />
          </button>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
            <span className="text-sm font-medium ml-1">{product.rating.toFixed(1)}</span>
          </div>
          <span className="font-bold text-purple-900">${product.price.toFixed(2)}</span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button variant="outline" size="sm" className="flex-1 border-purple-200 text-purple-700 hover:bg-purple-50">
          <ShoppingCart className="h-4 w-4 mr-1" />
          Add to Cart
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="w-10 h-10 p-0 text-purple-700">
              <Info className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl text-purple-900">{product.name}</DialogTitle>
              <DialogDescription className="text-gray-700">{product.description}</DialogDescription>
            </DialogHeader>

            <div className="mt-4">
              <h4 className="font-medium text-purple-900 mb-2">Key Ingredients:</h4>
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((ingredient, index) => (
                  <Badge key={index} variant="outline" className="bg-purple-50">
                    {ingredient}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div className="flex items-center">
                <span className="font-bold text-lg text-purple-900">${product.price.toFixed(2)}</span>
                <div className="flex items-center ml-3">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-medium ml-1">{product.rating.toFixed(1)}</span>
                </div>
              </div>

              <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </div>

            <DialogClose className="absolute top-4 right-4 rounded-full p-1 hover:bg-gray-100">
              <X className="h-4 w-4" />
            </DialogClose>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
}
