"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import * as THREE from "three"
import gsap from "gsap"

export function ChatbotAvatar() {
  const [mounted, setMounted] = useState(false)
  const [isWinking, setIsWinking] = useState(false)
  const [isTalking, setIsTalking] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    face: THREE.Mesh
    particles: THREE.Points
  } | null>(null)

  useEffect(() => {
    setMounted(true)

    // Random winking effect
    const winkInterval = setInterval(() => {
      setIsWinking(true)
      setTimeout(() => setIsWinking(false), 300)
    }, 5000)

    // Random talking effect
    const talkInterval = setInterval(() => {
      setIsTalking(true)
      setTimeout(() => setIsTalking(false), 1500)
    }, 3000)

    return () => {
      clearInterval(winkInterval)
      clearInterval(talkInterval)
    }
  }, [])

  useEffect(() => {
    if (!mounted || !containerRef.current) return

    // Set up Three.js scene
    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    // Scene
    const scene = new THREE.Scene()

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.z = 5

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(1, 1, 1)
    scene.add(directionalLight)

    // Create face
    const faceGeometry = new THREE.SphereGeometry(1.5, 32, 32)
    const faceMaterial = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      metalness: 0.3,
      roughness: 0.4,
      emissive: 0xec4899,
      emissiveIntensity: 0.2,
    })

    const face = new THREE.Mesh(faceGeometry, faceMaterial)
    scene.add(face)

    // Add eyes
    const eyeGeometry = new THREE.SphereGeometry(0.2, 32, 32)
    const eyeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 0.5,
    })

    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
    leftEye.position.set(-0.5, 0.3, 1.2)
    face.add(leftEye)

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
    rightEye.position.set(0.5, 0.3, 1.2)
    face.add(rightEye)

    // Add pupils
    const pupilGeometry = new THREE.SphereGeometry(0.1, 32, 32)
    const pupilMaterial = new THREE.MeshStandardMaterial({
      color: 0x5b21b6,
      emissive: 0x5b21b6,
      emissiveIntensity: 0.5,
    })

    const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial)
    leftPupil.position.set(0, 0, 0.15)
    leftEye.add(leftPupil)

    const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial)
    rightPupil.position.set(0, 0, 0.15)
    rightEye.add(rightPupil)

    // Add mouth
    const mouthGeometry = new THREE.TorusGeometry(0.5, 0.1, 16, 32, Math.PI)
    const mouthMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 0.5,
    })

    const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial)
    mouth.position.set(0, -0.3, 1.2)
    mouth.rotation.x = Math.PI
    face.add(mouth)

    // Add particles
    const particleCount = 200
    const particleGeometry = new THREE.BufferGeometry()
    const particlePositions = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 2 + Math.random() * 2
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI

      particlePositions[i] = radius * Math.sin(phi) * Math.cos(theta)
      particlePositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta)
      particlePositions[i + 2] = radius * Math.cos(phi)
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3))

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    })

    const particles = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particles)

    // Store references
    sceneRef.current = {
      scene,
      camera,
      renderer,
      face,
      particles,
    }

    // Animation
    const clock = new THREE.Clock()

    const animate = () => {
      const elapsedTime = clock.getElapsedTime()

      // Rotate particles
      particles.rotation.x = elapsedTime * 0.05
      particles.rotation.y = elapsedTime * 0.1

      // Subtle face animation
      face.position.y = Math.sin(elapsedTime * 0.5) * 0.1

      // Winking animation
      if (isWinking) {
        leftEye.scale.y = 0.1
      } else {
        leftEye.scale.y = 1
      }

      // Talking animation
      if (isTalking) {
        mouth.scale.y = 0.5 + Math.sin(elapsedTime * 10) * 0.5
      } else {
        mouth.scale.y = 1
      }

      // Render
      renderer.render(scene, camera)

      requestAnimationFrame(animate)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      const width = container.clientWidth
      const height = container.clientHeight

      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener("resize", handleResize)

    // Handle mouse move for interactive face
    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      gsap.to(face.rotation, {
        x: y * 0.3,
        y: x * 0.5,
        duration: 1,
        ease: "power2.out",
      })
    }

    container.addEventListener("mousemove", handleMouseMove)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      container.removeEventListener("mousemove", handleMouseMove)

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }

      // Dispose geometries and materials
      faceGeometry.dispose()
      faceMaterial.dispose()
      eyeGeometry.dispose()
      eyeMaterial.dispose()
      pupilGeometry.dispose()
      pupilMaterial.dispose()
      mouthGeometry.dispose()
      mouthMaterial.dispose()
      particleGeometry.dispose()
      particleMaterial.dispose()
    }
  }, [mounted, isWinking, isTalking])

  if (!mounted) return null

  return (
    <div className="chatbot-avatar-container">
      <motion.div
        className="chatbot-avatar-animation"
        animate={{
          y: [0, -5, 0],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 4,
          ease: "easeInOut",
        }}
      >
        <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl p-4 shadow-lg">
          <div ref={containerRef} className="w-full h-[300px]"></div>
          <div className="text-center mt-4">
            <h3 className="font-bold text-purple-900">DermAI</h3>
            <p className="text-sm text-gray-600">Your AI Dermatologist</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
