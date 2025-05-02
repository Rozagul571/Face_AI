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
import { motion } from "framer-motion"

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
  const [isHovered, setIsHovered] = useState(false)

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  return (
    <motion.div
      whileHover={{ y: -10 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        className="overflow-hidden border-2 border-purple-100 hover:border-purple-300 transition-all duration-300 hover:shadow-lg group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden">
          <motion.div animate={isHovered ? { scale: 1.1 } : { scale: 1 }} transition={{ duration: 0.5 }}>
            <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-48 object-cover" />
          </motion.div>

          {/* Miracle effect when hovered */}
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-gradient-to-t from-purple-600/40 to-pink-500/20 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 font-bold text-purple-900"
              >
                Miracle Product!
              </motion.div>
            </motion.div>
          )}

          <Badge className="absolute top-2 right-2 bg-purple-600">{product.category}</Badge>

          {/* Sparkle effects */}
          {isHovered && (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-300 rounded-full"
                style={{ boxShadow: "0 0 10px 2px rgba(250, 204, 21, 0.7)" }}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute top-1/3 right-1/3 w-3 h-3 bg-pink-300 rounded-full"
                style={{ boxShadow: "0 0 10px 2px rgba(236, 72, 153, 0.7)" }}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-purple-300 rounded-full"
                style={{ boxShadow: "0 0 10px 2px rgba(147, 51, 234, 0.7)" }}
              />
            </>
          )}
        </div>

        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg text-purple-900 line-clamp-1">{product.name}</h3>
            <motion.button
              onClick={toggleFavorite}
              className="text-gray-400 hover:text-pink-500 transition-colors"
              whileTap={{ scale: 0.8 }}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? "fill-pink-500 text-pink-500" : ""}`} />
            </motion.button>
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
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-purple-200 text-purple-700 hover:bg-purple-50"
            as={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Add to Cart
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-10 h-10 p-0 text-purple-700"
                as={motion.button}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
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

                <Button
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                  as={motion.button}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
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
    </motion.div>
  )
}
