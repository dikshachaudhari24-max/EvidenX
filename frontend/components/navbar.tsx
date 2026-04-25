"use client"

import { useState } from "react"
import { Shield, Menu, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const navLinks = [
  { label: "Evidence", href: "#features" },
  { label: "Custody Events", href: "#custody-events" },
  { label: "Actors", href: "#actors" },
  { label: "Integrity Audit", href: "#integrity-audit" },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const router = useRouter()

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" })
    setMobileOpen(false)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-[#09090B]/55 backdrop-blur-md">
      <div className="max-w-4xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-500" />
          <span className="text-white font-semibold">EvidenX</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="text-sm text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-1.5 rounded-md border border-blue-500 transition-colors"
          >
            Get Started
          </button>
        </div>

        <button
          type="button"
          className="md:hidden flex items-center justify-center w-9 h-9 text-zinc-300 hover:text-white transition-colors"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#09090B]/95 backdrop-blur-md border-b border-zinc-800 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 border-t border-zinc-800">
            <button
              type="button"
              className="text-sm text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-1.5 rounded-md border border-blue-500 transition-colors"
              onClick={() => {
                setMobileOpen(false)
                router.push("/login")
              }}
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
