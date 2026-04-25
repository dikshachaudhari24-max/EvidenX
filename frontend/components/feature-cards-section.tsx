"use client"

import { motion } from "framer-motion"
import { ChevronRight, Plus } from "lucide-react"

const featureCards = [
  {
    title: "Chain of Custody tracking",
    illustration: (
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 336 360"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Dashed connector line */}
          <line
            x1="60"
            y1="80"
            x2="60"
            y2="380"
            stroke="#3b82f6"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.4"
          />
          {/* Node 1 */}
          <circle cx="60" cy="80" r="6" fill="#3b82f6" />
          <rect x="80" y="76" width="160" height="8" rx="2" fill="#27272a" />
          <rect x="80" y="88" width="100" height="4" rx="1" fill="#18181b" />
          {/* Node 2 */}
          <circle cx="60" cy="180" r="6" fill="#3b82f6" />
          <rect x="80" y="176" width="180" height="8" rx="2" fill="#27272a" />
          <rect x="80" y="188" width="120" height="4" rx="1" fill="#18181b" />
          {/* Node 3 */}
          <circle cx="60" cy="280" r="6" fill="#3b82f6" />
          <rect x="80" y="276" width="140" height="8" rx="2" fill="#27272a" />
          <rect x="80" y="288" width="90" height="4" rx="1" fill="#18181b" />
          {/* Node 4 */}
          <circle cx="60" cy="380" r="6" fill="#3b82f6" />
          <rect x="80" y="376" width="160" height="8" rx="2" fill="#27272a" />
        </svg>
      </div>
    ),
  },
  {
    title: "Integrity audit with hash verification",
    illustration: (
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 336 360"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Glow */}
          <circle cx="168" cy="180" r="120" fill="#10b981" opacity="0.08" />
          <circle cx="168" cy="180" r="80" fill="#10b981" opacity="0.12" />
          {/* Back shield (larger, offset) */}
          <path
            d="M188 100 L248 124 L248 200 C248 240 218 270 188 284 L188 284 L188 100 Z M188 100 L128 124 L128 200 C128 240 158 270 188 284 L188 100 Z"
            fill="#10b981"
            opacity="0.15"
          />
          {/* Front shield */}
          <path
            d="M168 120 L220 142 L220 206 C220 238 196 262 168 274 C140 262 116 238 116 206 L116 142 L168 120 Z"
            fill="#10b981"
            opacity="0.3"
            stroke="#10b981"
            strokeWidth="1.5"
            strokeOpacity="0.5"
          />
          {/* Checkmark */}
          <path
            d="M140 196 L160 216 L200 170"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>
    ),
  },
  {
    title: "Role-based secure access",
    illustration: (
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 336 360"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Row 1: Admin (4 green) */}
          <text x="40" y="125" fill="#a1a1aa" fontSize="12" fontFamily="ui-sans-serif">
            Admin
          </text>
          <circle cx="160" cy="120" r="5" fill="#10b981" />
          <circle cx="185" cy="120" r="5" fill="#10b981" />
          <circle cx="210" cy="120" r="5" fill="#10b981" />
          <circle cx="235" cy="120" r="5" fill="#10b981" />
          {/* Row 2: Investigator (3 green 1 red) */}
          <text x="40" y="195" fill="#a1a1aa" fontSize="12" fontFamily="ui-sans-serif">
            Investigator
          </text>
          <circle cx="160" cy="190" r="5" fill="#10b981" />
          <circle cx="185" cy="190" r="5" fill="#10b981" />
          <circle cx="210" cy="190" r="5" fill="#10b981" />
          <circle cx="235" cy="190" r="5" fill="#ef4444" />
          {/* Row 3: Viewer (1 green 3 red) */}
          <text x="40" y="265" fill="#a1a1aa" fontSize="12" fontFamily="ui-sans-serif">
            Viewer
          </text>
          <circle cx="160" cy="260" r="5" fill="#10b981" />
          <circle cx="185" cy="260" r="5" fill="#ef4444" />
          <circle cx="210" cy="260" r="5" fill="#ef4444" />
          <circle cx="235" cy="260" r="5" fill="#ef4444" />
          {/* Subtle divider lines */}
          <line x1="40" y1="145" x2="260" y2="145" stroke="#27272a" strokeWidth="1" />
          <line x1="40" y1="215" x2="260" y2="215" stroke="#27272a" strokeWidth="1" />
        </svg>
      </div>
    ),
  },
]

export function FeatureCardsSection() {
  return (
    <div
      id="features"
      className="relative z-20 py-40"
      style={{ backgroundColor: "#09090B" }}
    >
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: "20%",
          background: "linear-gradient(to bottom, rgba(255,255,255,0.05) 0%, transparent 100%)",
        }}
      />
      <div className="w-full flex justify-center px-6">
        <div className="w-full max-w-5xl">
          {/* Header row */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] text-white max-w-md"
              style={{
                letterSpacing: "-0.0325em",
                fontVariationSettings: '"opsz" 28',
                fontWeight: 538,
                lineHeight: 1.1,
              }}
            >
              Made for modern forensic teams
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="max-w-md"
            >
              <p className="text-zinc-400 leading-relaxed">
                EvidenX is shaped by the standards that distinguish world-class forensic
                operations: ironclad chain of custody, tamper-proof audit trails, and precision
                evidence tracking.{" "}
                <a href="#" className="text-white inline-flex items-center gap-1 hover:underline">
                  Make the switch <ChevronRight className="w-4 h-4" />
                </a>
              </p>
            </motion.div>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featureCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer group overflow-hidden relative flex flex-col justify-end"
                style={{
                  aspectRatio: "336 / 360",
                  borderRadius: "30px",
                  height: "360px",
                  isolation: "isolate",
                }}
              >
                <div
                  className="absolute top-0 left-0 w-full h-full flex"
                  style={{
                    maskImage: "linear-gradient(#000 70%, transparent 90%)",
                    WebkitMaskImage: "linear-gradient(#000 70%, transparent 90%)",
                  }}
                >
                  {card.illustration}
                </div>
                <div
                  className="relative z-10 flex items-center justify-between w-full"
                  style={{ padding: "0 24px 40px", gap: "16px" }}
                >
                  <h3 className="text-white font-medium text-lg leading-tight">{card.title}</h3>
                  <div className="w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-500 group-hover:border-zinc-500 group-hover:text-zinc-300 transition-colors flex-shrink-0">
                    <Plus className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
