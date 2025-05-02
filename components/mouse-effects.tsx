"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import gsap from "gsap"

export function MouseTrail() {
  const [trails, setTrails] = useState<{ x: number; y: number; id: number }[]>([])
  const requestRef = useRef<number>()
  const previousTimeRef = useRef<number>()
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isActive) {
        setIsActive(true)
      }

      setTrails((prev) => [...prev.slice(-20), { x: e.clientX, y: e.clientY, id: Date.now() }])
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [isActive])

  useEffect(() => {
    const animate = (time: number) => {
      if (previousTimeRef.current !== undefined) {
        setTrails((prev) => prev.filter((trail) => Date.now() - trail.id < 500))
      }
      previousTimeRef.current = time
      requestRef.current = requestAnimationFrame(animate)
    }

    requestRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(requestRef.current as number)
  }, [])

  if (!isActive) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {trails.map((trail, index) => (
        <motion.div
          key={trail.id}
          className="absolute h-3 w-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600"
          style={{
            left: trail.x,
            top: trail.y,
            opacity: 1 - index * 0.05,
            scale: 1 - index * 0.05,
          }}
          initial={{ opacity: 0.7, scale: 0.7 }}
          animate={{ opacity: 0, scale: 0, x: Math.random() * 20 - 10, y: Math.random() * 20 - 10 }}
          transition={{ duration: 0.5 }}
        />
      ))}
    </div>
  )
}

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorRingRef = useRef<HTMLDivElement>(null)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isActive) {
        setIsActive(true)
      }

      if (cursorRef.current && cursorRingRef.current) {
        gsap.to(cursorRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.1,
        })

        gsap.to(cursorRingRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.3,
        })
      }
    }

    const handleMouseDown = () => {
      if (cursorRef.current && cursorRingRef.current) {
        gsap.to(cursorRef.current, {
          scale: 0.8,
          duration: 0.2,
        })

        gsap.to(cursorRingRef.current, {
          scale: 1.5,
          opacity: 0.2,
          duration: 0.2,
        })
      }
    }

    const handleMouseUp = () => {
      if (cursorRef.current && cursorRingRef.current) {
        gsap.to(cursorRef.current, {
          scale: 1,
          duration: 0.2,
        })

        gsap.to(cursorRingRef.current, {
          scale: 1,
          opacity: 0.5,
          duration: 0.2,
        })
      }
    }

    const handleMouseEnterLink = () => {
      if (cursorRef.current && cursorRingRef.current) {
        gsap.to(cursorRef.current, {
          scale: 1.5,
          duration: 0.2,
        })

        gsap.to(cursorRingRef.current, {
          scale: 1.5,
          opacity: 0.5,
          duration: 0.2,
        })
      }
    }

    const handleMouseLeaveLink = () => {
      if (cursorRef.current && cursorRingRef.current) {
        gsap.to(cursorRef.current, {
          scale: 1,
          duration: 0.2,
        })

        gsap.to(cursorRingRef.current, {
          scale: 1,
          opacity: 0.5,
          duration: 0.2,
        })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)

    const links = document.querySelectorAll("a, button")
    links.forEach((link) => {
      link.addEventListener("mouseenter", handleMouseEnterLink)
      link.addEventListener("mouseleave", handleMouseLeaveLink)
    })

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)

      links.forEach((link) => {
        link.removeEventListener("mouseenter", handleMouseEnterLink)
        link.removeEventListener("mouseleave", handleMouseLeaveLink)
      })
    }
  }, [isActive])

  if (!isActive) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <div
        ref={cursorRef}
        className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600"
      />
      <div
        ref={cursorRingRef}
        className="absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-pink-500 opacity-50"
      />
    </div>
  )
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let current = 0
    let target = 0
    const ease = 0.075

    const lerp = (start: number, end: number, t: number) => {
      return start * (1 - t) + end * t
    }

    const setBodyHeight = () => {
      if (scrollContainerRef.current) {
        document.body.style.height = `${scrollContainerRef.current.getBoundingClientRect().height}px`
      }
    }

    const smoothScroll = () => {
      target = window.scrollY
      current = lerp(current, target, ease)

      if (scrollContainerRef.current) {
        scrollContainerRef.current.style.transform = `translate3d(0, ${-current}px, 0)`
      }

      requestAnimationFrame(smoothScroll)
    }

    setBodyHeight()
    window.addEventListener("resize", setBodyHeight)
    smoothScroll()

    return () => {
      window.removeEventListener("resize", setBodyHeight)
    }
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div ref={scrollContainerRef} className="will-change-transform">
        {children}
      </div>
    </div>
  )
}
