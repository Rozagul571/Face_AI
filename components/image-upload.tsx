"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { X, ImageIcon, FileUp } from "lucide-react"
import { motion } from "framer-motion"

interface ImageUploadProps {
  onImageSelected: (imageDataUrl: string) => void
}

export function ImageUpload({ onImageSelected }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0])
    }
  }

  const processFile = (file: File) => {
    if (!file.type.match("image.*")) {
      alert("Please select an image file")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setPreview(result)
      onImageSelected(result)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    onImageSelected("")
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="w-full">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

      {preview ? (
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <img
            src={preview || "/placeholder.svg"}
            alt="Preview"
            className="w-full h-64 object-contain rounded-lg border border-purple-200"
          />
          <button
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-700" />
          </button>
        </motion.div>
      ) : (
        <motion.div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging ? "border-purple-500 bg-purple-50" : "border-gray-300 hover:border-purple-400"
          } transition-colors duration-200`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          whileHover={{ boxShadow: "0 4px 20px rgba(160, 174, 192, 0.2)" }}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <motion.div
              className="w-24 h-24 flex items-center justify-center bg-purple-100 rounded-full"
              whileHover={{ scale: 1.1, backgroundColor: "#f3e8ff" }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <ImageIcon className="h-12 w-12 text-purple-500" />
            </motion.div>
            <div>
              <p className="text-lg font-medium text-gray-700">Drag and drop your image here</p>
              <p className="text-sm text-gray-500 mt-1">or click the button below</p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleButtonClick}
                variant="outline"
                className="border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                <FileUp className="mr-2 h-4 w-4" />
                Select Image
              </Button>
            </motion.div>
            <p className="text-xs text-gray-500">Supported formats: JPG, PNG, WEBP (max 5MB)</p>

            {/* Animated decorative elements */}
            <div className="absolute top-5 left-5 w-3 h-3 rounded-full bg-pink-400 opacity-50"></div>
            <div className="absolute bottom-5 right-5 w-4 h-4 rounded-full bg-purple-400 opacity-50"></div>
            <div className="absolute top-1/3 right-10 w-2 h-2 rounded-full bg-blue-400 opacity-50"></div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
