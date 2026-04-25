"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Shield } from "lucide-react"
import { DashboardMockup } from "./dashboard-mockup"
import { Navbar } from "./navbar"
import { LogoCloud } from "./logo-cloud"
import { FeatureCardsSection } from "./feature-cards-section"
import { AISection } from "./ai-section"
import { ProductDirectionSection } from "./product-direction-section"
import { WorkflowsSection } from "./workflows-section"
import { CTASection } from "./cta-section"
import { Footer } from "./footer"
import { Shuffle } from "./react-bits/shuffle"
import ClickSpark from "./react-bits/click-spark"

export function Hero3DStage() {
  const [yOffset, setYOffset] = useState(0)
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 })
  const heroRef = useRef<HTMLDivElement>(null)
  // Scroll parallax
  useEffect(() => {
    const handleScroll = () => {
      setYOffset(Math.min(window.scrollY / 300, 1) * -20)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Cursor parallax on hero section
  useEffect(() => {
    const section = heroRef.current
    if (!section) return
    const handleMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect()
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2
      setMouseOffset({ x: nx * 3, y: ny * -3 })
    }
    section.addEventListener("mousemove", handleMouseMove, { passive: true })
    return () => section.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Heading 3D float on hover
  const headingRef = useRef<HTMLHeadingElement>(null)
  const [headingTilt, setHeadingTilt] = useState({ rx: 0, ry: 0, tz: 0 })

  const handleHeadingMouseMove = (e: React.MouseEvent<HTMLHeadingElement>) => {
    const el = headingRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    setHeadingTilt({ rx: ny * -6, ry: nx * 4, tz: -8 })
  }

  const handleHeadingMouseLeave = () => {
    setHeadingTilt({ rx: 0, ry: 0, tz: 0 })
  }

  const baseTransform = {
    translateX: 2,
    scale: 1.2,
    rotateX: 47,
    rotateY: 31,
    rotateZ: 324,
  }

  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: "#09090B" }}>
      <ClickSpark
        sparkColor="#4F8EF7"
        sparkSize={12}
        sparkRadius={20}
        sparkCount={10}
        duration={500}
        easing="ease-out"
        extraScale={1.2}
      >
        <div ref={heroRef} className="relative min-h-screen overflow-hidden">
          <Navbar />

          {/* Subtle glow */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -30%)",
              width: "1200px",
              height: "800px",
              background: "radial-gradient(ellipse at center, rgba(99, 102, 241, 0.08) 0%, transparent 70%)",
            }}
          />

          {/* Main content */}
          <div className="relative z-10 pt-28 flex flex-col">
            {/* Hero text - contained and centered */}
            <div className="w-full flex justify-center px-6 mt-16">
              <div className="w-full max-w-4xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Shuffle
                    ref={headingRef}
                    text="EvidenX is a purpose-built tool for forensic evidence management"
                    tag="h1"
                    shuffleDirection="right"
                    animationMode="evenodd"
                    duration={0.4}
                    stagger={0.025}
                    shuffleTimes={2}
                    scrambleCharset="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
                    triggerOnce={true}
                    triggerOnHover={true}
                    colorFrom="#888888"
                    colorTo="#ffffff"
                    textAlign="left"
                    onMouseMove={handleHeadingMouseMove}
                    onMouseLeave={handleHeadingMouseLeave}
                    style={{
                      transform: `perspective(800px) rotateX(${headingTilt.rx}deg) rotateY(${headingTilt.ry}deg) translateZ(${headingTilt.tz}px)`,
                      transition: "transform 0.2s ease-out",
                      cursor: "default",
                      willChange: "transform",
                      fontWeight: 538,
                      letterSpacing: "-0.0325em",
                      fontVariationSettings: '"opsz" 28',
                      lineHeight: 1.1,
                    }}
                    className="text-4xl md:text-5xl lg:text-[56px] text-balance"
                  />
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="mt-6 text-lg text-zinc-400"
                >
                  Meet the system for modern forensic investigations. Streamline evidence handling, custody chains, and
                  case management.
                </motion.p>
              </div>
            </div>

            {/* Mobile fallback card (shown only on < md) */}
            <div className="md:hidden mx-4 mt-10 bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-zinc-400 font-medium">EvidenX Dashboard</span>
              </div>
              <div className="space-y-2">
                {["Total Evidence: 247", "Active Versions: 89", "Custody Events: 1,432", "Failed Audits: 3"].map((t) => (
                  <div key={t} className="h-8 bg-zinc-800/60 rounded flex items-center px-3">
                    <span className="text-xs text-zinc-500">{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3D Stage - full bleed (desktop only) */}
            <div
              className="hidden md:block relative mt-16"
              style={{
                width: "100vw",
                marginLeft: "-50vw",
                marginRight: "-50vw",
                position: "relative",
                left: "50%",
                right: "50%",
                height: "700px",
                marginTop: "-60px",
              }}
            >
              <div
                className="absolute bottom-0 left-0 right-0 h-72 z-10 pointer-events-none"
                style={{
                  background: "linear-gradient(to top, #09090B 20%, transparent 100%)",
                }}
              />

              {/* Perspective container */}
              <div
                style={{
                  transform: `translateY(${yOffset}px)`,
                  transition: "transform 0.1s ease-out",
                  contain: "strict",
                  perspective: "4000px",
                  perspectiveOrigin: "100% 0",
                  width: "100%",
                  height: "100%",
                  transformStyle: "preserve-3d",
                  position: "relative",
                  willChange: "transform",
                }}
              >
                {/* Transformed base */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    delay: 0.5,
                    duration: 1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{
                    backgroundColor: "#09090B",
                    transformOrigin: "0 0",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    border: "1px solid #1e1e1e",
                    borderRadius: "10px",
                    width: "1600px",
                    height: "900px",
                    margin: "280px auto auto",
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    transform: `translate(${baseTransform.translateX}%) scale(${baseTransform.scale}) rotateX(${baseTransform.rotateX + mouseOffset.y}deg) rotateY(${baseTransform.rotateY + mouseOffset.x}deg) rotate(${baseTransform.rotateZ}deg)`,
                    transformStyle: "preserve-3d",
                    overflow: "hidden",
                    willChange: "transform",
                    transition: "transform 0.15s ease-out",
                  }}
                >
                  <DashboardMockup />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </ClickSpark>

      {/* Section anchors for navbar smooth-scroll */}
      <div id="features">
        <LogoCloud />
        <FeatureCardsSection />
      </div>
      <div id="custody-events">
        <ProductDirectionSection />
      </div>
      <div id="actors">
        <AISection />
      </div>
      <div id="integrity-audit">
        <WorkflowsSection />
      </div>
      <CTASection />
      <Footer />
    </section>
  )
}
