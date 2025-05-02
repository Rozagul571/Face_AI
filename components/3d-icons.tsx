"use client"

import { useRef, useEffect } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import gsap from "gsap"

interface Icon3DProps {
  type: "upload" | "webcam" | "url"
  size?: number
}

export function Icon3D({ type, size = 100 }: Icon3DProps) {
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
    const width = size
    const height = size

    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(1, 1, 1)
    scene.add(directionalLight)

    // Create icon geometry based on type
    let iconMesh: THREE.Mesh

    if (type === "upload") {
      // Create upload icon (cloud with arrow)
      const group = new THREE.Group()

      // Cloud base
      const cloudGeometry = new THREE.SphereGeometry(1, 32, 16)
      cloudGeometry.scale(1.5, 1, 1)
      const cloudMaterial = new THREE.MeshStandardMaterial({
        color: 0xec4899,
        metalness: 0.3,
        roughness: 0.4,
      })
      const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial)
      group.add(cloud)

      // Small clouds
      const smallCloud1 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 16), cloudMaterial)
      smallCloud1.position.set(-1, 0.5, 0)
      group.add(smallCloud1)

      const smallCloud2 = new THREE.Mesh(new THREE.SphereGeometry(0.6, 32, 16), cloudMaterial)
      smallCloud2.position.set(1, 0.4, 0)
      group.add(smallCloud2)

      // Arrow
      const arrowMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.3,
        roughness: 0.4,
      })

      const arrowShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.5, 16), arrowMaterial)
      arrowShaft.position.set(0, -0.5, 0.5)
      group.add(arrowShaft)

      const arrowHead = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.6, 16), arrowMaterial)
      arrowHead.position.set(0, 0.3, 0.5)
      group.add(arrowHead)

      iconMesh = group
    } else if (type === "webcam") {
      // Create webcam icon (camera)
      const group = new THREE.Group()

      // Camera body
      const cameraBodyGeometry = new THREE.BoxGeometry(2, 1.2, 0.8)
      const cameraMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b5cf6,
        metalness: 0.5,
        roughness: 0.3,
      })
      const cameraBody = new THREE.Mesh(cameraBodyGeometry, cameraMaterial)
      group.add(cameraBody)

      // Camera lens
      const lensGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.5, 32)
      const lensMaterial = new THREE.MeshStandardMaterial({
        color: 0x111111,
        metalness: 0.8,
        roughness: 0.2,
      })
      const lens = new THREE.Mesh(lensGeometry, lensMaterial)
      lens.rotation.x = Math.PI / 2
      lens.position.set(0, 0, 0.65)
      group.add(lens)

      // Lens glass
      const glassGeometry = new THREE.CircleGeometry(0.4, 32)
      const glassMaterial = new THREE.MeshStandardMaterial({
        color: 0x88ccff,
        metalness: 0.9,
        roughness: 0.1,
        transparent: true,
        opacity: 0.8,
      })
      const glass = new THREE.Mesh(glassGeometry, glassMaterial)
      glass.position.set(0, 0, 0.91)
      group.add(glass)

      // Flash
      const flashGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.1)
      const flashMaterial = new THREE.MeshStandardMaterial({
        color: 0xffcc00,
        emissive: 0xffcc00,
        emissiveIntensity: 0.5,
      })
      const flash = new THREE.Mesh(flashGeometry, flashMaterial)
      flash.position.set(0.8, 0.4, 0.45)
      group.add(flash)

      iconMesh = group
    } else {
      // Create URL icon (globe with link)
      const group = new THREE.Group()

      // Globe
      const globeGeometry = new THREE.SphereGeometry(1, 32, 32)
      const globeMaterial = new THREE.MeshStandardMaterial({
        color: 0x3b82f6,
        metalness: 0.3,
        roughness: 0.7,
      })
      const globe = new THREE.Mesh(globeGeometry, globeMaterial)
      group.add(globe)

      // Add latitude lines
      for (let i = 0; i < 5; i++) {
        const latitudeGeometry = new THREE.TorusGeometry(1, 0.02, 16, 100)
        const latitudeMaterial = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.3,
        })
        const latitude = new THREE.Mesh(latitudeGeometry, latitudeMaterial)
        latitude.rotation.x = Math.PI / 2
        latitude.position.y = -0.8 + i * 0.4
        group.add(latitude)
      }

      // Add longitude lines
      for (let i = 0; i < 6; i++) {
        const longitudeGeometry = new THREE.TorusGeometry(1, 0.02, 16, 100)
        const longitudeMaterial = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.3,
        })
        const longitude = new THREE.Mesh(longitudeGeometry, longitudeMaterial)
        longitude.rotation.y = (i * Math.PI) / 3
        group.add(longitude)
      }

      // Add link symbol
      const linkMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.5,
        roughness: 0.3,
      })

      const linkPart1 = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.08, 16, 32, Math.PI), linkMaterial)
      linkPart1.position.set(0.5, 0, 1.1)
      linkPart1.rotation.y = Math.PI / 4
      group.add(linkPart1)

      const linkPart2 = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.08, 16, 32, Math.PI), linkMaterial)
      linkPart2.position.set(1, 0, 0.6)
      linkPart2.rotation.y = -Math.PI / 4
      group.add(linkPart2)

      iconMesh = group
    }

    scene.add(iconMesh)

    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.enableZoom = false

    // Animation
    const clock = new THREE.Clock()

    // Initial animation
    gsap.from(iconMesh.scale, {
      x: 0,
      y: 0,
      z: 0,
      duration: 1,
      ease: "elastic.out(1, 0.3)",
    })

    // Animation loop
    const animate = () => {
      const elapsedTime = clock.getElapsedTime()

      // Rotate icon
      iconMesh.rotation.y = elapsedTime * 0.5

      // Subtle floating animation
      iconMesh.position.y = Math.sin(elapsedTime) * 0.1

      // Update controls
      controls.update()

      // Render
      renderer.render(scene, camera)

      requestAnimationFrame(animate)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      renderer.setSize(size, size)
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [type, size])

  return <div ref={containerRef} className="w-full h-full" style={{ width: size, height: size }}></div>
}
