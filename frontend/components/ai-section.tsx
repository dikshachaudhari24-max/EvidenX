"use client"

import { motion } from "framer-motion"
import { ChevronRight, Paperclip, Globe, Lightbulb, AlertTriangle } from "lucide-react"

const insightTypes = [
  { name: "Hash Mismatch Detection", selected: true },
  { name: "Custody Anomaly Alert", selected: false },
  { name: "Access Pattern Analysis", selected: false },
  { name: "Integrity Risk Scoring", selected: false },
  { name: "Duplicate Evidence Flag", selected: false },
  { name: "Tamper Probability Report", selected: false },
]

export function AISection() {
  return (
    <div className="relative z-20 py-40" style={{ backgroundColor: "#09090B" }}>
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: "20%",
          background: "linear-gradient(to bottom, rgba(255,255,255,0.05) 0%, transparent 100%)",
        }}
      />
      <div className="w-full flex justify-center px-6">
        <div className="w-full max-w-5xl">
          {/* Section label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 mb-6"
          >
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-zinc-400 text-sm">Artificial intelligence</span>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] text-white max-w-3xl mb-8"
            style={{
              letterSpacing: "-0.0325em",
              fontVariationSettings: '"opsz" 28',
              fontWeight: 538,
              lineHeight: 1.1,
            }}
          >
            AI-assisted evidence analysis
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-400 max-w-md mb-8"
          >
            <span className="text-white font-medium">EvidenX Intelligence.</span> Automatically
            flag anomalies in custody chains, detect hash mismatches before they become
            incidents, and surface audit risks with AI-powered forensic insights.
          </motion.p>

          {/* Learn more button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="px-5 py-2.5 bg-zinc-800 text-zinc-300 rounded-lg border border-zinc-700 hover:bg-zinc-700 transition-colors text-sm flex items-center gap-2 mb-20"
          >
            Learn more
            <ChevronRight className="w-4 h-4" />
          </motion.button>

          {/* Two-panel layout: Insight Types | AI Output */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Left: AI Insight Types list */}
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-zinc-300 text-sm font-medium">AI Insight Types</span>
              </div>
              <div className="space-y-1">
                {insightTypes.map((insight) => (
                  <div
                    key={insight.name}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors cursor-pointer ${
                      insight.selected
                        ? "bg-zinc-800/80 border border-zinc-700"
                        : "hover:bg-zinc-800/40 border border-transparent"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        insight.selected ? "bg-blue-500" : "bg-zinc-700"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        insight.selected ? "text-white font-medium" : "text-zinc-400"
                      }`}
                    >
                      {insight.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: AI Chat / Output panel */}
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 flex flex-col">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-zinc-300 text-sm font-medium">EvidenX AI</span>
              </div>

              {/* AI Output bubble */}
              <div className="bg-zinc-800 rounded-lg p-3 text-sm text-zinc-300 mb-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <span className="font-mono text-blue-400">EV-0044</span> shows hash mismatch
                    between Version 2 and Version 3. Custody chain has a 4-hour gap on Aug 12.
                    Recommend quarantine.
                  </p>
                </div>
              </div>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="flex items-center gap-1.5 border border-zinc-700 text-zinc-400 text-xs px-3 py-1.5 rounded-full">
                  Integrity Alerts
                </span>
                <span className="flex items-center gap-1.5 border border-zinc-700 text-zinc-400 text-xs px-3 py-1.5 rounded-full">
                  Chain Analysis
                </span>
                <span className="flex items-center gap-1.5 border border-zinc-700 text-zinc-400 text-xs px-3 py-1.5 rounded-full">
                  Risk Scoring
                </span>
              </div>

              {/* Input */}
              <div className="mt-auto bg-zinc-800/60 border border-zinc-700/60 rounded-lg p-3">
                <p className="text-zinc-500 text-sm mb-3">Ask EvidenX AI about your evidence...</p>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 border border-zinc-700 text-zinc-500 text-xs px-2.5 py-1 rounded-full hover:bg-zinc-700/30 transition-colors">
                    <Paperclip className="w-3 h-3" />
                    Attach
                  </button>
                  <button className="flex items-center gap-1.5 border border-zinc-700 text-zinc-500 text-xs px-2.5 py-1 rounded-full hover:bg-zinc-700/30 transition-colors">
                    <Globe className="w-3 h-3" />
                    Search
                  </button>
                  <button className="flex items-center gap-1.5 border border-zinc-700 text-zinc-500 text-xs px-2.5 py-1 rounded-full hover:bg-zinc-700/30 transition-colors">
                    <Lightbulb className="w-3 h-3" />
                    Reason
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
