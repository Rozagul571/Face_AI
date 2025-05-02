import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import gsap from "gsap"

export class FaceScene {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer
  model: THREE.Group | null = null
  mixer: THREE.AnimationMixer | null = null
  clock: THREE.Clock
  controls: OrbitControls | null = null
  particles: THREE.Points | null = null
  animationFrameId: number | null = null
  isInitialized = false
  container: HTMLElement | null = null

  constructor() {
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    })
    this.clock = new THREE.Clock()

    // Set up camera position
    this.camera.position.z = 5

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    this.scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(1, 1, 1)
    this.scene.add(directionalLight)

    // Add particles
    this.addParticles()
  }

  init(container: HTMLElement) {
    if (this.isInitialized) return

    this.container = container
    const width = container.clientWidth
    const height = container.clientHeight

    this.renderer.setSize(width, height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()

    container.appendChild(this.renderer.domElement)

    // Add orbit controls for development
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true

    this.isInitialized = true
    this.animate()

    // Handle resize
    window.addEventListener("resize", this.handleResize)
  }

  handleResize = () => {
    if (!this.container) return

    const width = this.container.clientWidth
    const height = this.container.clientHeight

    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height)
  }

  loadFaceModel() {
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.5/")

    const loader = new GLTFLoader()
    loader.setDRACOLoader(dracoLoader)

    // Load face model
    loader.load("/face-model.glb", (gltf) => {
      this.model = gltf.scene
      this.scene.add(this.model)

      // Center the model
      const box = new THREE.Box3().setFromObject(this.model)
      const center = box.getCenter(new THREE.Vector3())
      this.model.position.sub(center)

      // Set up animations if available
      if (gltf.animations && gltf.animations.length) {
        this.mixer = new THREE.AnimationMixer(this.model)
        const action = this.mixer.clipAction(gltf.animations[0])
        action.play()
      }

      // Animate model appearance
      gsap.from(this.model.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1.5,
        ease: "elastic.out(1, 0.3)",
      })
    })
  }

  addParticles() {
    const particleCount = 1000
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 20
      positions[i + 1] = (Math.random() - 0.5) * 20
      positions[i + 2] = (Math.random() - 0.5) * 20
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))

    const material = new THREE.PointsMaterial({
      size: 0.05,
      color: 0xec4899,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    })

    this.particles = new THREE.Points(geometry, material)
    this.scene.add(this.particles)
  }

  animate = () => {
    this.animationFrameId = requestAnimationFrame(this.animate)

    const delta = this.clock.getDelta()

    // Update mixer for model animations
    if (this.mixer) {
      this.mixer.update(delta)
    }

    // Rotate particles
    if (this.particles) {
      this.particles.rotation.x += 0.0005
      this.particles.rotation.y += 0.0005
    }

    // Update controls
    if (this.controls) {
      this.controls.update()
    }

    this.renderer.render(this.scene, this.camera)
  }

  handleMouseMove(event: MouseEvent) {
    if (!this.container || !this.model) return

    const rect = this.container.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    gsap.to(this.model.rotation, {
      x: y * 0.3,
      y: x * 0.5,
      duration: 1,
      ease: "power2.out",
    })
  }

  dispose() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
    }

    window.removeEventListener("resize", this.handleResize)

    if (this.container) {
      this.container.removeChild(this.renderer.domElement)
    }

    this.isInitialized = false
  }
}

export class AcneVisualization {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer
  clock: THREE.Clock
  animationFrameId: number | null = null
  isInitialized = false
  container: HTMLElement | null = null
  acneMarkers: THREE.Mesh[] = []

  constructor() {
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    })
    this.clock = new THREE.Clock()

    // Set up camera position
    this.camera.position.z = 5

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    this.scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(1, 1, 1)
    this.scene.add(directionalLight)
  }

  init(container: HTMLElement) {
    if (this.isInitialized) return

    this.container = container
    const width = container.clientWidth
    const height = container.clientHeight

    this.renderer.setSize(width, height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()

    container.appendChild(this.renderer.domElement)

    this.isInitialized = true
    this.animate()

    // Handle resize
    window.addEventListener("resize", this.handleResize)
  }

  handleResize = () => {
    if (!this.container) return

    const width = this.container.clientWidth
    const height = this.container.clientHeight

    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height)
  }

  addAcneMarkers(predictions: any[]) {
    // Clear existing markers
    this.acneMarkers.forEach((marker) => this.scene.remove(marker))
    this.acneMarkers = []

    // Add new markers
    predictions.forEach((pred) => {
      const geometry = new THREE.SphereGeometry(0.1, 32, 32)

      // Different colors for different acne types
      let color
      switch (pred.class) {
        case "papule":
          color = 0xff0000 // Red
          break
        case "pustule":
          color = 0xffff00 // Yellow
          break
        case "blackhead":
          color = 0x000000 // Black
          break
        case "whitehead":
          color = 0xffffff // White
          break
        case "cyst":
          color = 0x800080 // Purple
          break
        default:
          color = 0xff0000 // Default red
      }

      const material = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8,
      })

      const marker = new THREE.Mesh(geometry, material)

      // Position based on normalized coordinates
      marker.position.set((pred.x / 500) * 5 - 2.5, -(pred.y / 500) * 5 + 2.5, 0.1)

      this.scene.add(marker)
      this.acneMarkers.push(marker)

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

    // Add connections between markers
    if (this.acneMarkers.length > 1) {
      const points = this.acneMarkers.map((marker) => marker.position)
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const material = new THREE.LineBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.3,
      })

      const line = new THREE.Line(geometry, material)
      this.scene.add(line)
      this.acneMarkers.push(line)
    }
  }

  animate = () => {
    this.animationFrameId = requestAnimationFrame(this.animate)

    // Pulse animation for markers
    this.acneMarkers.forEach((marker) => {
      if (marker instanceof THREE.Mesh) {
        marker.scale.x = 1 + Math.sin(this.clock.getElapsedTime() * 2 + Math.random() * 10) * 0.2
        marker.scale.y = marker.scale.x
        marker.scale.z = marker.scale.x
      }
    })

    this.renderer.render(this.scene, this.camera)
  }

  dispose() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
    }

    window.removeEventListener("resize", this.handleResize)

    if (this.container) {
      this.container.removeChild(this.renderer.domElement)
    }

    this.isInitialized = false
  }
}
