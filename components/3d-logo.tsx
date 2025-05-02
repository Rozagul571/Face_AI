"use client"

import { useRef, useEffect } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import gsap from "gsap"

export function Logo3D() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    })

    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(1, 1, 1)
    scene.add(directionalLight)

    // Create logo geometry
    const faceGeometry = new THREE.SphereGeometry(1.2, 32, 32)
    const faceMaterial = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      metalness: 0.7,
      roughness: 0.2,
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
    leftEye.position.set(-0.5, 0.3, 1)
    face.add(leftEye)

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
    rightEye.position.set(0.5, 0.3, 1)
    face.add(rightEye)

    // Add mouth
    const mouthGeometry = new THREE.TorusGeometry(0.5, 0.1, 16, 32, Math.PI)
    const mouthMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 0.5,
    })

    const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial)
    mouth.position.set(0, -0.3, 1)
    mouth.rotation.x = Math.PI
    face.add(mouth)

    // Add particles around the face
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

    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.enableZoom = false

    // Animation
    const clock = new THREE.Clock()

    // Initial animation
    gsap.from(face.scale, {
      x: 0,
      y: 0,
      z: 0,
      duration: 1.5,
      ease: "elastic.out(1, 0.3)",
    })

    // Mouse move effect
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

    // Animation loop
    const animate = () => {
      const elapsedTime = clock.getElapsedTime()

      // Rotate particles
      particles.rotation.x = elapsedTime * 0.05
      particles.rotation.y = elapsedTime * 0.1

      // Subtle face animation
      face.position.y = Math.sin(elapsedTime * 0.5) * 0.1

      // Update controls
      controls.update()

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

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      container.removeEventListener("mousemove", handleMouseMove)
      container.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={containerRef} className="w-full h-full min-h-[300px]"></div>
}
