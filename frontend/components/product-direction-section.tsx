"use client"

import { ChevronRight } from "lucide-react"

const timelineEntries = [
  { label: "Case Opened", color: "bg-green-500", left: "4%", top: "80px", width: "42%" },
  { label: "Evidence Collection", color: "bg-blue-500", left: "12%", top: "130px", width: "48%" },
  { label: "Custody Transfer", color: "bg-amber-500", left: "22%", top: "180px", width: "40%" },
  { label: "Lab Analysis", color: "bg-purple-500", left: "34%", top: "230px", width: "38%" },
  { label: "Audit Review", color: "bg-emerald-500", left: "50%", top: "280px", width: "32%" },
  { label: "Case Closure", color: "bg-zinc-500", left: "60%", top: "330px", width: "28%" },
]

const progressCards = [
  {
    label: "Chain of Custody",
    value: 78,
    color: "bg-blue-500",
    trackColor: "bg-blue-500/20",
    textColor: "text-blue-400",
  },
  {
    label: "Integrity Audits",
    value: 92,
    color: "bg-emerald-500",
    trackColor: "bg-emerald-500/20",
    textColor: "text-emerald-400",
  },
  {
    label: "Access Logs",
    value: 65,
    color: "bg-amber-500",
    trackColor: "bg-amber-500/20",
    textColor: "text-amber-400",
  },
]

export function ProductDirectionSection() {
  return (
    <section className="relative py-40 px-6 md:px-12 lg:px-24" style={{ backgroundColor: "#09090B" }}>
      {/* Gradient overlay at top */}
      <div
        className="absolute inset-x-0 top-0 pointer-events-none"
        style={{
          height: "20%",
          background: "linear-gradient(to bottom, rgba(255,255,255,0.05), transparent 100%)",
        }}
      />

      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-zinc-400 text-sm">Case timeline and audit planning</span>
          <ChevronRight className="w-4 h-4 text-zinc-500" />
        </div>

        {/* Section heading */}
        <h2
          className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-medium text-white mb-8 max-w-3xl"
          style={{
            letterSpacing: "-0.0325em",
            fontVariationSettings: '"opsz" 28',
            fontWeight: 538,
            lineHeight: 1.1,
          }}
        >
          Set the investigation direction
        </h2>

        {/* Description */}
        <p className="text-zinc-400 text-lg max-w-md mb-16">
          <span className="text-white font-medium">
            Align your team around a unified case timeline.
          </span>{" "}
          Plan, manage, and track all evidence and custody milestones with EvidenX&apos;s visual
          audit tools.
        </p>

        {/* Two-column: 3D timeline (left) + progress cards (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 3D Timeline */}
          <div
            className="lg:col-span-2 relative w-full"
            style={{
              perspective: "1200px",
            }}
          >
            <div
              className="relative"
              style={{
                transform: "rotateX(50deg) rotateZ(-35deg)",
                transformStyle: "preserve-3d",
                transformOrigin: "center center",
              }}
            >
              <div className="relative h-[460px]">
                {/* Diagonal dashed connector line */}
                <div
                  className="absolute w-[1px]"
                  style={{
                    height: "600px",
                    left: "55%",
                    top: "-100px",
                    backgroundImage:
                      "repeating-linear-gradient(to bottom, transparent, transparent 4px, rgba(113, 113, 122, 0.5) 4px, rgba(113, 113, 122, 0.5) 8px)",
                  }}
                />

                {/* Tick marks */}
                <div className="flex items-end gap-[3px] absolute top-0 left-[5%] right-0">
                  {Array.from({ length: 60 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-zinc-600/60"
                      style={{
                        width: "1px",
                        height: i % 7 === 0 ? "16px" : "8px",
                      }}
                    />
                  ))}
                </div>

                {/* Date labels */}
                <div className="absolute text-zinc-500 text-sm" style={{ left: "8%", top: "30px" }}>
                  AUG 1
                </div>
                <div
                  className="absolute text-zinc-500 text-sm"
                  style={{ left: "32%", top: "25px" }}
                >
                  AUG 10
                </div>
                <div
                  className="absolute px-3 py-1 rounded-md bg-zinc-700/80 text-zinc-300 text-sm font-medium"
                  style={{ left: "58%", top: "20px" }}
                >
                  AUG 22
                </div>
                <div
                  className="absolute text-zinc-500/50 text-sm"
                  style={{ left: "88%", top: "15px" }}
                >
                  SEP
                </div>

                {/* Timeline phase bars */}
                {timelineEntries.map((entry) => (
                  <div
                    key={entry.label}
                    className="absolute rounded-lg bg-zinc-800/90 border border-zinc-700/50 px-4 py-3 flex items-center gap-3"
                    style={{
                      left: entry.left,
                      top: entry.top,
                      width: entry.width,
                      height: "44px",
                    }}
                  >
                    <div className={`w-2.5 h-2.5 rounded-full ${entry.color} shrink-0`} />
                    <span className="text-zinc-300 text-sm font-medium truncate">
                      {entry.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel: progress cards */}
          <div className="flex flex-col gap-4">
            {progressCards.map((card) => (
              <div
                key={card.label}
                className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-zinc-200 font-medium text-sm">{card.label}</span>
                  <span className={`text-sm font-semibold ${card.textColor}`}>
                    {card.value}%
                  </span>
                </div>
                <div className={`w-full h-2 rounded-full overflow-hidden ${card.trackColor}`}>
                  <div
                    className={`h-full ${card.color} rounded-full transition-all`}
                    style={{ width: `${card.value}%` }}
                  />
                </div>
                <p className="text-zinc-500 text-xs mt-3">
                  {card.label === "Chain of Custody" &&
                    "Unbroken handoff tracking across all evidence items."}
                  {card.label === "Integrity Audits" &&
                    "Hash verification passing across your case archive."}
                  {card.label === "Access Logs" &&
                    "Role-based access events recorded and reviewed."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
