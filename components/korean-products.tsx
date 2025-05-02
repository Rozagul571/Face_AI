"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { koreanProducts } from "@/lib/roboflow-api"

export function KoreanProducts() {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)

  const product = selectedProduct ? koreanProducts.find((p) => p.id === selectedProduct) : null

  return (
    <Card className="border-2 border-purple-200 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-purple-900">Korean Skincare Products for Acne</CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="products">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="details">Product Details</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {koreanProducts.map((product) => (
                <motion.div
                  key={product.id}
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Card
                    className={`cursor-pointer border-2 hover:shadow-md transition-all ${
                      selectedProduct === product.id ? "border-pink-500" : "border-gray-200"
                    }`}
                    onClick={() => setSelectedProduct(product.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-16 h-16 rounded-md flex items-center justify-center flex-shrink-0 overflow-hidden">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-purple-900 line-clamp-2">{product.name}</h3>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-1">{product.category}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm font-bold text-pink-600">${product.price.toFixed(2)}</span>
                            <div className="flex items-center">
                              <span className="text-amber-500">★</span>
                              <span className="text-sm ml-1">{product.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="details" className="mt-0">
            {product ? (
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-24 h-24 rounded-md flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-purple-900">{product.name}</h3>
                    <p className="text-gray-700 mt-1">{product.description}</p>
                    <div className="flex items-center mt-2">
                      <span className="text-lg font-bold text-pink-600 mr-3">${product.price.toFixed(2)}</span>
                      <div className="flex items-center">
                        <span className="text-amber-500">★</span>
                        <span className="ml-1">{product.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-purple-900 mb-2">Key Ingredients:</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.ingredients.map((ingredient, index) => (
                      <Badge key={index} variant="outline" className="bg-purple-50">
                        {ingredient}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-purple-900 mb-2">Good For:</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.forProblems.map((problem, index) => (
                      <Badge key={index} className="bg-pink-100 text-pink-800 hover:bg-pink-200">
                        {problem}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <Button variant="outline" onClick={() => setSelectedProduct(null)}>
                    Back to Products
                  </Button>
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white">
                    Add to Cart
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Select a product to view details</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
