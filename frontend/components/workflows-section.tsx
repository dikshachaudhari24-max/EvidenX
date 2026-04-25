"use client"

import { useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  FileText,
  GitCommit,
  ShieldCheck,
  Users,
  Zap,
  Activity,
  AlertTriangle,
} from "lucide-react"

type WorkflowCard = {
  id: number
  category: string
  title: string
  mockup: "intake" | "custody" | "audit" | "actors" | "triggers" | "logs" | "alerts"
}

const workflowCards: WorkflowCard[] = [
  { id: 1, category: "Evidence Intake", title: "Log and tag new evidence with auto-generated IDs", mockup: "intake" },
  { id: 2, category: "Custody Chain", title: "Track every transfer with timestamped custody events", mockup: "custody" },
  { id: 3, category: "Integrity Audit", title: "Run hash verification and detect tampering instantly", mockup: "audit" },
  { id: 4, category: "Actor Management", title: "Register personnel and map roles to access permissions", mockup: "actors" },
  { id: 5, category: "Database Triggers", title: "Auto-enforce business rules with SQL trigger logic", mockup: "triggers" },
  { id: 6, category: "Access Logs", title: "Full searchable log of every evidence access event", mockup: "logs" },
  { id: 7, category: "Alerts & Escalation", title: "Get notified on anomalies and quarantine compromised items", mockup: "alerts" },
]

function IntakeMockup() {
  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex items-center gap-2 text-xs text-zinc-400">
        <FileText className="w-3.5 h-3.5" />
        <span>New Evidence</span>
      </div>
      <div className="flex items-center gap-2 bg-zinc-800/50 rounded-lg px-3 py-2">
        <span className="text-[10px] font-mono text-blue-400">EV-0047</span>
        <span className="text-xs text-zinc-400">Blood sample · Vial B</span>
      </div>
      <div className="flex items-center gap-2 bg-zinc-800/30 rounded-lg px-3 py-2">
        <span className="text-[10px] font-mono text-blue-400">EV-0048</span>
        <span className="text-xs text-zinc-400">CCTV clip · Gate 4</span>
      </div>
      <div className="flex items-center gap-2 bg-zinc-800/30 rounded-lg px-3 py-2">
        <span className="text-[10px] font-mono text-blue-400">EV-0049</span>
        <span className="text-xs text-zinc-400">Fingerprint · Door</span>
      </div>
    </div>
  )
}

function CustodyMockup() {
  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex items-center gap-2 text-xs text-zinc-400">
        <GitCommit className="w-3.5 h-3.5" />
        <span>Custody Chain · EV-0042</span>
      </div>
      <div className="relative pl-4">
        <div className="absolute left-1 top-1 bottom-1 w-px bg-zinc-700" />
        {[
          { who: "Det. Sharma", action: "Collected", when: "Aug 10" },
          { who: "Officer Rao", action: "Transferred", when: "Aug 11" },
          { who: "Lab A", action: "Received", when: "Aug 12" },
        ].map((row, i) => (
          <div key={i} className="relative mb-2 flex items-center gap-2">
            <div className="absolute -left-3 top-1 w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-xs text-zinc-300">{row.who}</span>
            <span className="text-[10px] text-zinc-500">{row.action}</span>
            <span className="ml-auto text-[10px] text-zinc-600">{row.when}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function AuditMockup() {
  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex items-center gap-2 text-xs text-zinc-400">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>Hash Verification</span>
      </div>
      <div className="bg-zinc-800/50 rounded-lg p-2 font-mono text-[10px] text-emerald-400">
        sha256: 3f2a...c8d1
      </div>
      <div className="flex items-center gap-2 text-xs">
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
        <span className="text-zinc-300">Match verified</span>
        <span className="ml-auto text-[10px] text-zinc-500">v3</span>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <span className="w-2 h-2 rounded-full bg-red-500" />
        <span className="text-zinc-300">Mismatch</span>
        <span className="ml-auto text-[10px] text-zinc-500">EV-0044</span>
      </div>
    </div>
  )
}

function ActorsMockup() {
  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex items-center gap-2 text-xs text-zinc-400">
        <Users className="w-3.5 h-3.5" />
        <span>Personnel</span>
      </div>
      {[
        { name: "Det. Sharma", role: "Investigator", color: "bg-blue-500/20 text-blue-400" },
        { name: "Dr. Patel", role: "Lab Analyst", color: "bg-purple-500/20 text-purple-400" },
        { name: "Officer Rao", role: "Custodian", color: "bg-amber-500/20 text-amber-400" },
      ].map((p) => (
        <div key={p.name} className="flex items-center gap-2 bg-zinc-800/40 rounded-lg px-2 py-1.5">
          <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center text-[10px] text-zinc-300">
            {p.name.charAt(0)}
          </div>
          <span className="text-xs text-zinc-300">{p.name}</span>
          <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded ${p.color}`}>{p.role}</span>
        </div>
      ))}
    </div>
  )
}

function TriggersMockup() {
  return (
    <div className="flex flex-col gap-2 p-4 font-mono">
      <div className="flex items-center gap-2 text-xs text-zinc-400 font-sans">
        <Zap className="w-3.5 h-3.5 text-amber-400" />
        <span>trg_custody_log</span>
      </div>
      <div className="bg-zinc-800/50 rounded-lg p-2 text-[10px] space-y-1">
        <div>
          <span className="text-purple-400">CREATE</span> <span className="text-blue-400">TRIGGER</span>
        </div>
        <div className="text-zinc-500">ON evidence_transfers</div>
        <div>
          <span className="text-purple-400">AFTER</span> <span className="text-blue-400">INSERT</span>
        </div>
        <div className="text-emerald-400">-- logs custody event</div>
      </div>
    </div>
  )
}

function LogsMockup() {
  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex items-center gap-2 text-xs text-zinc-400">
        <Activity className="w-3.5 h-3.5" />
        <span>Access Logs</span>
      </div>
      {[
        { who: "admin", action: "READ", id: "EV-0042", t: "2m" },
        { who: "lab_a", action: "WRITE", id: "EV-0043", t: "7m" },
        { who: "officer", action: "READ", id: "EV-0041", t: "14m" },
        { who: "auditor", action: "READ", id: "EV-0044", t: "23m" },
      ].map((l, i) => (
        <div key={i} className="flex items-center gap-2 text-[10px]">
          <span className="text-zinc-500 w-14 truncate">{l.who}</span>
          <span className="text-blue-400 w-10">{l.action}</span>
          <span className="text-zinc-300 font-mono">{l.id}</span>
          <span className="ml-auto text-zinc-600">{l.t} ago</span>
        </div>
      ))}
    </div>
  )
}

function AlertsMockup() {
  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex items-center gap-2 text-xs text-zinc-400">
        <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
        <span>Active Alerts</span>
      </div>
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2">
        <div className="text-[10px] text-red-400 font-medium">Hash mismatch · EV-0044</div>
        <div className="text-[10px] text-zinc-500 mt-1">Quarantined automatically</div>
      </div>
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-2">
        <div className="text-[10px] text-amber-400 font-medium">Unlogged gap · EV-0042</div>
        <div className="text-[10px] text-zinc-500 mt-1">4h custody window</div>
      </div>
    </div>
  )
}

function CardMockup({ type }: { type: WorkflowCard["mockup"] }) {
  switch (type) {
    case "intake":
      return <IntakeMockup />
    case "custody":
      return <CustodyMockup />
    case "audit":
      return <AuditMockup />
    case "actors":
      return <ActorsMockup />
    case "triggers":
      return <TriggersMockup />
    case "logs":
      return <LogsMockup />
    case "alerts":
      return <AlertsMockup />
    default:
      return null
  }
}

export function WorkflowsSection() {
  const [scrollPosition, setScrollPosition] = useState(0)

  const scrollLeft = () => setScrollPosition(Math.max(0, scrollPosition - 1))
  const scrollRight = () =>
    setScrollPosition(Math.min(workflowCards.length - 4, scrollPosition + 1))

  return (
    <section className="relative py-24" style={{ backgroundColor: "#09090B" }}>
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: "20%",
          background: "linear-gradient(to bottom, rgba(255,255,255,0.05), transparent)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-16">
          <div className="lg:max-w-xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="text-sm text-zinc-400">Workflows and forensic operations</span>
              <ChevronRight className="w-4 h-4 text-zinc-600" />
            </div>

            <h2
              className="text-4xl md:text-5xl text-white"
              style={{
                fontWeight: 538,
                letterSpacing: "-0.0325em",
                fontVariationSettings: '"opsz" 28',
                lineHeight: 1.1,
              }}
            >
              Collaborate across
              <br />
              teams and evidence
            </h2>
          </div>

          <p className="text-zinc-400 lg:max-w-sm lg:pt-12">
            EvidenX automates the operational backbone of forensic investigations — from intake to audit closure.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative overflow-hidden">
          <div
            className="flex gap-4 transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${scrollPosition * (100 / 4)}%)` }}
          >
            {workflowCards.map((card) => (
              <div key={card.id} className="flex-shrink-0 w-[calc(25%-12px)] min-w-[280px]">
                <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl overflow-hidden h-[340px] flex flex-col hover:border-zinc-700 transition-colors">
                  <div className="flex-1 relative overflow-hidden">
                    <CardMockup type={card.mockup} />
                    <div
                      className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
                      style={{
                        background: "linear-gradient(to top, rgba(9,9,11,0.9), transparent)",
                      }}
                    />
                  </div>

                  <div className="p-4 border-t border-zinc-800/30">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-zinc-500 mb-1">{card.category}</p>
                        <p className="text-sm text-zinc-200 leading-snug">{card.title}</p>
                      </div>
                      <button
                        type="button"
                        aria-label={`Learn more about ${card.category}`}
                        className="flex-shrink-0 w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:border-zinc-600 transition-colors"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation arrows */}
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            type="button"
            onClick={scrollLeft}
            className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            disabled={scrollPosition === 0}
            aria-label="Previous workflow"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={scrollRight}
            className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            disabled={scrollPosition >= workflowCards.length - 4}
            aria-label="Next workflow"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  )
}
