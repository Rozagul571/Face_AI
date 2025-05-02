"use client"

import { useRef, useEffect } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { acneTypeColors } from "@/lib/roboflow-api"
import gsap from "gsap"

interface Acne3DVisualizationProps {
  predictions: Array<{
    x: number
    y: number
    width: number
    height: number
    class: string
    confidence: number
  }>
  imageWidth: number
  imageHeight: number
}

export function Acne3DVisualization({ predictions, imageWidth, imageHeight }: Acne3DVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || predictions.length === 0) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000,
    )
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    containerRef.current.appendChild(renderer.domElement)

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(1, 1, 1)
    scene.add(directionalLight)

    // Add realistic face mesh
    const headGeometry = new THREE.SphereGeometry(2, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6)
    headGeometry.scale(1, 1.3, 1)

    // Create a more realistic skin material
    const skinTexture = new THREE.TextureLoader().load("/skin-texture.png")
    const faceMaterial = new THREE.MeshStandardMaterial({
      map: skinTexture,
      color: 0xf5e0dc,
      metalness: 0.1,
      roughness: 0.8,
      transparent: false,
    })

    const head = new THREE.Mesh(headGeometry, faceMaterial)
    head.rotation.x = Math.PI * 0.1
    scene.add(head)

    // Add facial features
    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.2, 32, 32)
    const eyeMaterial = new THREE.MeshStandardMaterial({
      color: 0x3a3a3a,
      metalness: 0.2,
      roughness: 0.3,
    })

    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
    leftEye.position.set(-0.6, 0.3, 1.8)
    head.add(leftEye)

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
    rightEye.position.set(0.6, 0.3, 1.8)
    head.add(rightEye)

    // Nose
    const noseGeometry = new THREE.ConeGeometry(0.2, 0.5, 32)
    const noseMaterial = new THREE.MeshStandardMaterial({
      color: 0xf5e0dc,
      metalness: 0.1,
      roughness: 0.8,
    })

    const nose = new THREE.Mesh(noseGeometry, noseMaterial)
    nose.rotation.x = -Math.PI / 2
    nose.position.set(0, 0, 2)
    head.add(nose)

    // Mouth
    const mouthGeometry = new THREE.TorusGeometry(0.4, 0.1, 16, 32, Math.PI)
    const mouthMaterial = new THREE.MeshStandardMaterial({
      color: 0xd63031,
      metalness: 0.2,
      roughness: 0.8,
    })

    const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial)
    mouth.rotation.x = Math.PI
    mouth.position.set(0, -0.5, 1.9)
    head.add(mouth)

    // Add wrinkles to the face
    const addWrinkle = (startPoint: THREE.Vector3, endPoint: THREE.Vector3, depth: number, width: number) => {
      const direction = new THREE.Vector3().subVectors(endPoint, startPoint)
      const length = direction.length()
      direction.normalize()

      const wrinkleGeometry = new THREE.BoxGeometry(length, width, depth)
      const wrinkleMaterial = new THREE.MeshStandardMaterial({
        color: 0xd4a190,
        metalness: 0.1,
        roughness: 1.0,
        transparent: true,
        opacity: 0.8,
      })

      const wrinkle = new THREE.Mesh(wrinkleGeometry, wrinkleMaterial)

      // Position at midpoint
      const midpoint = new THREE.Vector3().addVectors(
        startPoint,
        new THREE.Vector3().subVectors(endPoint, startPoint).multiplyScalar(0.5),
      )
      wrinkle.position.copy(midpoint)

      // Orient along direction
      wrinkle.lookAt(endPoint)
      wrinkle.rotateX(Math.PI / 2)

      return wrinkle
    }

    // Add acne markers
    const markers: THREE.Mesh[] = []
    const normalizedPredictions = predictions.map((pred) => ({
      ...pred,
      normalizedX: (pred.x / imageWidth) * 4 - 2,
      normalizedY: -(pred.y / imageHeight) * 3 + 1.5,
      normalizedSize: (Math.max(pred.width, pred.height) / imageWidth) * 0.5 + 0.05,
    }))

    // Add wrinkles based on prediction locations
    normalizedPredictions.forEach((pred) => {
      // Create wrinkles near prediction areas
      if (pred.class === "papule" || pred.class === "pustule") {
        // Create forehead wrinkles
        if (pred.normalizedY < -0.5) {
          const startPoint = new THREE.Vector3(pred.normalizedX - 0.5, pred.normalizedY, 1.9)
          const endPoint = new THREE.Vector3(pred.normalizedX + 0.5, pred.normalizedY, 1.9)
          const wrinkle = addWrinkle(startPoint, endPoint, 0.05, 0.05)
          head.add(wrinkle)
          markers.push(wrinkle)
        }

        // Create crow's feet wrinkles
        if (Math.abs(pred.normalizedX) > 1.0 && Math.abs(pred.normalizedY) < 0.5) {
          const startPoint = new THREE.Vector3(pred.normalizedX, pred.normalizedY, 1.9)
          const endPoint = new THREE.Vector3(
            pred.normalizedX + (pred.normalizedX > 0 ? -0.5 : 0.5),
            pred.normalizedY - 0.3,
            1.8,
          )
          const wrinkle = addWrinkle(startPoint, endPoint, 0.05, 0.05)
          head.add(wrinkle)
          markers.push(wrinkle)
        }

        // Create smile lines
        if (Math.abs(pred.normalizedX) > 0.3 && pred.normalizedY > 0.5) {
          const startPoint = new THREE.Vector3(pred.normalizedX, pred.normalizedY - 0.3, 1.9)
          const endPoint = new THREE.Vector3(pred.normalizedX, pred.normalizedY + 0.3, 1.7)
          const wrinkle = addWrinkle(startPoint, endPoint, 0.05, 0.05)
          head.add(wrinkle)
          markers.push(wrinkle)
        }
      }
    })

    normalizedPredictions.forEach((pred) => {
      const color = acneTypeColors[pred.class as keyof typeof acneTypeColors] || 0xff0000

      // Create different geometries based on acne type
      let geometry: THREE.BufferGeometry

      switch (pred.class) {
        case "blackhead":
          // Flatter, wider shape for blackheads
          geometry = new THREE.CylinderGeometry(pred.normalizedSize, pred.normalizedSize, pred.normalizedSize * 0.5, 32)
          break
        case "whitehead":
          // Rounded bump for whiteheads
          geometry = new THREE.SphereGeometry(pred.normalizedSize * 0.8, 32, 32)
          break
        case "papule":
          // Small rounded bump for papules
          geometry = new THREE.SphereGeometry(pred.normalizedSize, 32, 32)
          break
        case "pustule":
          // Sphere with slight point for pustules
          geometry = new THREE.ConeGeometry(pred.normalizedSize, pred.normalizedSize * 1.5, 32)
          geometry.scale(1, 0.7, 1)
          geometry.translate(0, -pred.normalizedSize * 0.2, 0)
          break
        case "nodule":
          // Larger, irregular shape for nodules
          geometry = new THREE.DodecahedronGeometry(pred.normalizedSize * 1.2, 0)
          break
        case "cyst":
          // Largest, most irregular shape for cysts
          geometry = new THREE.DodecahedronGeometry(pred.normalizedSize * 1.5, 1)
          break
        default:
          geometry = new THREE.SphereGeometry(pred.normalizedSize, 32, 32)
      }

      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        metalness: 0.3,
        roughness: 0.7,
        emissive: new THREE.Color(color),
        emissiveIntensity: 0.2,
      })

      const marker = new THREE.Mesh(geometry, material)

      // Calculate position on the face surface
      const phi = Math.acos(-pred.normalizedY / 2)
      const theta = Math.atan2(pred.normalizedX, 0) + Math.PI

      const radius = 2
      marker.position.x = radius * Math.sin(phi) * Math.cos(theta)
      marker.position.y = radius * Math.cos(phi)
      marker.position.z = radius * Math.sin(phi) * Math.sin(theta)

      // Adjust to face the normal direction
      marker.lookAt(0, 0, 0)
      marker.position.normalize().multiplyScalar(radius + 0.1)

      head.add(marker)
      markers.push(marker)

      // Add confidence label
      const confidenceText = `${Math.round(pred.confidence * 100)}%`
      const textGeometry = new THREE.PlaneGeometry(pred.normalizedSize * 2, pred.normalizedSize * 0.5)
      const canvas = document.createElement("canvas")
      const context = canvas.getContext("2d")

      if (context) {
        canvas.width = 128
        canvas.height = 64
        context.fillStyle = "rgba(0, 0, 0, 0.7)"
        context.fillRect(0, 0, canvas.width, canvas.height)
        context.font = "24px Arial"
        context.fillStyle = "white"
        context.textAlign = "center"
        context.textBaseline = "middle"
        context.fillText(confidenceText, canvas.width / 2, canvas.height / 2)

        const texture = new THREE.CanvasTexture(canvas)
        const textMaterial = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity: 0.8,
          side: THREE.DoubleSide,
        })

        const textMesh = new THREE.Mesh(textGeometry, textMaterial)
        textMesh.position.copy(marker.position)
        textMesh.position.multiplyScalar(1.1)
        textMesh.lookAt(camera.position)
        scene.add(textMesh)
        markers.push(textMesh)
      }

      // Animate marker appearance
      gsap.from(marker.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)",
        delay: Math.random() * 0.5,
      })
    })

    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.enableZoom = true
    controls.autoRotate = true
    controls.autoRotateSpeed = 1

    // Animation
    const clock = new THREE.Clock()

    const animate = () => {
      const elapsedTime = clock.getElapsedTime()

      // Pulse animation for markers
      markers.forEach((marker, index) => {
        if (marker.geometry.type !== "PlaneGeometry") {
          marker.scale.x = 1 + Math.sin(elapsedTime * 2 + index) * 0.2
          marker.scale.y = marker.scale.x
          marker.scale.z = marker.scale.x
        }
      })

      // Update controls
      controls.update()

      // Render
      renderer.render(scene, camera)

      requestAnimationFrame(animate)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return

      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)

      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement)
      }

      // Dispose geometries and materials
      markers.forEach((marker) => {
        marker.geometry.dispose()
        ;(marker.material as THREE.Material).dispose()
      })
    }
  }, [predictions, imageWidth, imageHeight])

  return (
    <div
      ref={containerRef}
      className="w-full h-64 rounded-lg overflow-hidden border border-purple-200 bg-gradient-to-b from-purple-900/10 to-pink-600/5"
    ></div>
  )
}
