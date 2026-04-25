"use client"

import { motion } from "framer-motion"
import { Shield, Lock, Database, Eye } from "lucide-react"

const partners = [
  { name: "Interpol", icon: Shield },
  { name: "FBI", icon: Lock },
  { name: "Europol", icon: Database },
  { name: "CBI", icon: Eye },
  { name: "NBI", icon: Shield },
  { name: "Forensiq", icon: Lock },
  { name: "CrimeDB", icon: Database },
  { name: "AuditX", icon: Eye },
]

export function LogoCloud() {
  return (
    <div className="relative z-20 pb-24 pt-8" style={{ backgroundColor: "#09090B" }}>
      <div className="w-full flex justify-center px-6">
        <div className="w-full max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-lg text-zinc-300 mb-2"
          >
            Powering the world&apos;s best forensic investigation teams.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-zinc-500 mb-16"
          >
            From small departments to large law enforcement agencies.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative group cursor-pointer"
          >
            {/* Logo grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-16 gap-y-10 items-center justify-items-center transition-all duration-300 group-hover:blur-[2.5px] group-hover:opacity-50">
              {partners.map((partner, i) => {
                const Icon = partner.icon
                return (
                  <div
                    key={`${partner.name}-${i}`}
                    className="text-white font-semibold text-lg flex items-center gap-2"
                  >
                    <Icon className="w-5 h-5" />
                    {partner.name}
                  </div>
                )
              })}
            </div>

            {/* Hover overlay button */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="px-5 py-2.5 bg-zinc-800/80 backdrop-blur-sm border border-zinc-700 rounded-full text-sm text-zinc-300 flex items-center gap-2">
                Meet our customers
                <span aria-hidden="true">›</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
