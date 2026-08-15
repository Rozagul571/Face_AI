import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Instagram, Twitter, Facebook, Youtube, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-purple-900 text-white pt-8 md:pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8">
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <span className="font-bold text-xl">Derion AI</span>
            </div>
            <p className="text-purple-200 text-sm">
              AI-powered acne analysis and personalized skincare solutions for Uzbekistan's youth.
            </p>
            <div className="flex space-x-3">
              <SocialIcon icon={<Instagram size={18} />} href="#" />
              <SocialIcon icon={<Twitter size={18} />} href="#" />
              <SocialIcon icon={<Facebook size={18} />} href="#" />
              <SocialIcon icon={<Youtube size={18} />} href="#" />
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Features</h3>
            <ul className="space-y-2">
              <FooterLink href="/analyze">AI Skin Analysis</FooterLink>
              <FooterLink href="/chat">DermAI Chat</FooterLink>
              <FooterLink href="/recommendations">Product Recommendations</FooterLink>
              <FooterLink href="#">7-Day Cleansing Plan</FooterLink>
              <FooterLink href="#">Blog & Community</FooterLink>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              <FooterLink href="#">About Us</FooterLink>
              <FooterLink href="#">Our Team</FooterLink>
              <FooterLink href="#">Careers</FooterLink>
              <FooterLink href="#">Privacy Policy</FooterLink>
              <FooterLink href="#">Terms of Service</FooterLink>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Subscribe</h3>
            <p className="text-purple-200 text-sm mb-4">
              Get the latest updates and skincare tips delivered to your inbox.
            </p>
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="Your email"
                className="bg-purple-800 border-purple-700 text-white placeholder:text-purple-400"
              />
              <Button className="bg-pink-500 hover:bg-pink-600">
                <Mail size={18} />
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-purple-800 pt-6 mt-6 text-center text-purple-300 text-sm">
          <p>© {new Date().getFullYear()} Derion AI. All rights reserved.</p>
          <p className="mt-1">
            <span className="block md:inline">Uzbek: "Ugri emas, o'zingni ko'r!"</span>
            <span className="hidden md:inline mx-2">|</span>
            <span className="block md:inline">English: "Clear skin, confident you!"</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

interface FooterLinkProps {
  href: string
  children: React.ReactNode
}

function FooterLink({ href, children }: FooterLinkProps) {
  return (
    <li>
      <Link href={href} className="text-purple-200 hover:text-white transition-colors">
        {children}
      </Link>
    </li>
  )
}

interface SocialIconProps {
  icon: React.ReactNode
  href: string
}

function SocialIcon({ icon, href }: SocialIconProps) {
  return (
    <a
      href={href}
      className="w-8 h-8 rounded-full bg-purple-800 flex items-center justify-center hover:bg-pink-500 transition-colors"
      target="_blank"
      rel="noopener noreferrer"
    >
      {icon}
    </a>
  )
}
