"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Home, Search, MessageCircle, ShoppingBag, Globe } from "lucide-react"
import { usePathname } from "next/navigation"
import { useMobile } from "@/hooks/use-mobile"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const isMobile = useMobile()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-purple-100 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2" onClick={closeMenu}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <span className="font-bold text-xl text-purple-900">Derion AI</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink href="/" isActive={isActive("/")} icon={<Home size={18} />}>
              Home
            </NavLink>
            <NavLink href="/analyze" isActive={isActive("/analyze")} icon={<Search size={18} />}>
              Analyze
            </NavLink>
            <NavLink href="/chat" isActive={isActive("/chat")} icon={<MessageCircle size={18} />}>
              Chat
            </NavLink>
            <NavLink href="/recommendations" isActive={isActive("/recommendations")} icon={<ShoppingBag size={18} />}>
              Products
            </NavLink>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Globe size={16} />
              <span>EN</span>
            </Button>
            <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white">
              Sign Up
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && isMobile && (
          <div className="md:hidden mt-3 py-3 border-t border-gray-200">
            <nav className="flex flex-col space-y-3">
              <MobileNavLink href="/" isActive={isActive("/")} icon={<Home size={18} />} onClick={closeMenu}>
                Home
              </MobileNavLink>
              <MobileNavLink
                href="/analyze"
                isActive={isActive("/analyze")}
                icon={<Search size={18} />}
                onClick={closeMenu}
              >
                Analyze
              </MobileNavLink>
              <MobileNavLink
                href="/chat"
                isActive={isActive("/chat")}
                icon={<MessageCircle size={18} />}
                onClick={closeMenu}
              >
                Chat
              </MobileNavLink>
              <MobileNavLink
                href="/recommendations"
                isActive={isActive("/recommendations")}
                icon={<ShoppingBag size={18} />}
                onClick={closeMenu}
              >
                Products
              </MobileNavLink>
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Globe size={16} />
                  <span>EN</span>
                </Button>
                <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white">
                  Sign Up
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

interface NavLinkProps {
  href: string
  isActive: boolean
  icon: React.ReactNode
  children: React.ReactNode
}

function NavLink({ href, isActive, icon, children }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors
        ${isActive ? "bg-purple-100 text-purple-900" : "text-gray-700 hover:bg-purple-50 hover:text-purple-900"}`}
    >
      {icon}
      <span>{children}</span>
    </Link>
  )
}

interface MobileNavLinkProps extends NavLinkProps {
  onClick: () => void
}

function MobileNavLink({ href, isActive, icon, children, onClick }: MobileNavLinkProps) {
  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2
        ${isActive ? "bg-purple-100 text-purple-900" : "text-gray-700 hover:bg-purple-50 hover:text-purple-900"}`}
      onClick={onClick}
    >
      {icon}
      <span>{children}</span>
    </Link>
  )
}
