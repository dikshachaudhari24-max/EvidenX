"use client"

import type React from "react"
import { motion } from "framer-motion"
import {
  Shield,
  FileText,
  Users,
  Activity,
  AlertCircle,
  BarChart2,
  ChevronDown,
  Search,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
} from "lucide-react"

export function DashboardMockup() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.5,
      },
    },
  }

  const panelVariants = {
    hidden: {
      opacity: 0,
      x: 100,
      y: -80,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  }

  return (
    <motion.div
      className="w-full h-full bg-zinc-950 flex flex-col overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Top bar */}
      <motion.div
        className="h-12 border-b border-zinc-800/60 flex items-center px-4 gap-4 bg-zinc-950 shrink-0"
        variants={panelVariants}
      >
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-500" />
          <span className="text-white font-semibold text-sm">EvidenX</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-300">Dashboard</span>
        </div>
        <div className="ml-auto flex items-center gap-2 px-2.5 py-1 bg-zinc-900/80 rounded-md text-zinc-500 text-xs border border-zinc-800/60">
          <Search className="w-3 h-3" />
          <span>Search evidence, cases...</span>
        </div>
      </motion.div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <motion.div
          className="w-56 h-full bg-zinc-900 border-r border-zinc-800 flex flex-col shrink-0"
          variants={panelVariants}
        >
          <div className="p-3">
            <div className="px-2 py-1 text-[10px] text-zinc-500 font-medium uppercase tracking-wider">
              Workspace
            </div>
            <div className="space-y-0.5 mt-1">
              <SidebarItem icon={BarChart2} label="Dashboard" active />
              <SidebarItem icon={FileText} label="Evidence" badge="247" />
              <SidebarItem icon={Activity} label="Custody Events" />
              <SidebarItem icon={Users} label="Actors" />
              <SidebarItem icon={AlertCircle} label="Triggers" />
              <SidebarItem icon={Shield} label="Integrity Audit" />
            </div>
          </div>

          <div className="mt-5 px-3">
            <div className="px-2 py-1 text-[10px] text-zinc-500 font-medium uppercase tracking-wider">
              Recent Cases
            </div>
            <div className="space-y-0.5 mt-1">
              <div className="flex items-center gap-2 px-2 py-1.5 text-zinc-400 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="truncate">CASE-2024-0847</span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 text-zinc-400 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span className="truncate">CASE-2024-0839</span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 text-zinc-400 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span className="truncate">CASE-2024-0821</span>
              </div>
            </div>
          </div>

          <div className="mt-auto p-3 border-t border-zinc-800">
            <div className="flex items-center gap-2 px-2 py-1.5">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-700" />
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-medium truncate">Sarah Chen</p>
                <p className="text-zinc-500 text-[10px] truncate">Lead Investigator</p>
              </div>
              <ChevronDown className="w-3 h-3 text-zinc-500" />
            </div>
          </div>
        </motion.div>

        {/* Main content */}
        <motion.div
          className="flex-1 h-full bg-[#09090B] overflow-auto scrollbar-hide"
          variants={panelVariants}
        >
          <div className="p-6">
            {/* Page header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-white text-xl font-semibold">Evidence Dashboard</h1>
                <p className="text-zinc-500 text-xs mt-1">
                  Overview of all active evidence and custody activity
                </p>
              </div>
              <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors">
                + Add Evidence
              </button>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              <KPICard label="Total Evidence" value="247" trend="+12%" trendDir="up" />
              <KPICard label="Active Versions" value="89" trend="+5%" trendDir="up" />
              <KPICard label="Custody Events" value="1,432" trend="+23%" trendDir="up" />
              <KPICard label="Failed Audits" value="3" trend="-1" trendDir="down" danger />
            </div>

            {/* Recent Evidence table */}
            <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden mb-4">
              <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
                <h3 className="text-white text-sm font-medium">Recent Evidence</h3>
                <MoreHorizontal className="w-4 h-4 text-zinc-500" />
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800/60">
                    <th className="text-left px-4 py-2 text-[10px] text-zinc-500 font-medium uppercase tracking-wider">
                      ID
                    </th>
                    <th className="text-left px-4 py-2 text-[10px] text-zinc-500 font-medium uppercase tracking-wider">
                      Description
                    </th>
                    <th className="text-left px-4 py-2 text-[10px] text-zinc-500 font-medium uppercase tracking-wider">
                      Type
                    </th>
                    <th className="text-left px-4 py-2 text-[10px] text-zinc-500 font-medium uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left px-4 py-2 text-[10px] text-zinc-500 font-medium uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <EvidenceRow
                    id="EV-0044"
                    description="Mobile device seized at 1225 Main St"
                    type="Digital"
                    status="Secured"
                    date="Aug 22"
                  />
                  <EvidenceRow
                    id="EV-0043"
                    description="Blood sample - container #A-112"
                    type="Biological"
                    status="Analyzed"
                    date="Aug 21"
                  />
                  <EvidenceRow
                    id="EV-0041"
                    description="Surveillance footage, 4-channel"
                    type="Digital"
                    status="Compromised"
                    date="Aug 19"
                  />
                </tbody>
              </table>
            </div>

            {/* Custody events mini list */}
            <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
              <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
                <h3 className="text-white text-sm font-medium">Custody Events</h3>
                <MoreHorizontal className="w-4 h-4 text-zinc-500" />
              </div>
              <div className="divide-y divide-zinc-800/60">
                <CustodyRow
                  actor="J. Martinez"
                  action="transferred"
                  evidenceId="EV-0044"
                  time="12 min ago"
                />
                <CustodyRow
                  actor="A. Kim"
                  action="sealed"
                  evidenceId="EV-0043"
                  time="2h ago"
                />
                <CustodyRow
                  actor="S. Chen"
                  action="analyzed"
                  evidenceId="EV-0041"
                  time="5h ago"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

function SidebarItem({
  icon: Icon,
  label,
  active,
  badge,
}: {
  icon: React.ElementType
  label: string
  active?: boolean
  badge?: string
}) {
  return (
    <div
      className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
        active ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-800/50"
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="flex-1 text-xs">{label}</span>
      {badge && (
        <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">
          {badge}
        </span>
      )}
    </div>
  )
}

function KPICard({
  label,
  value,
  trend,
  trendDir,
  danger,
}: {
  label: string
  value: string
  trend: string
  trendDir: "up" | "down"
  danger?: boolean
}) {
  const TrendIcon = trendDir === "up" ? TrendingUp : TrendingDown
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
      <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium mb-1">
        {label}
      </p>
      <div className="flex items-baseline gap-2">
        <span className={`text-xl font-semibold ${danger ? "text-red-400" : "text-white"}`}>
          {value}
        </span>
        <span
          className={`text-[10px] flex items-center gap-0.5 ${
            danger ? "text-red-400" : trendDir === "up" ? "text-emerald-400" : "text-red-400"
          }`}
        >
          <TrendIcon className="w-2.5 h-2.5" />
          {trend}
        </span>
      </div>
    </div>
  )
}

function EvidenceRow({
  id,
  description,
  type,
  status,
  date,
}: {
  id: string
  description: string
  type: string
  status: "Secured" | "Analyzed" | "Compromised"
  date: string
}) {
  const statusStyles: Record<string, string> = {
    Secured: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    Analyzed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    Compromised: "bg-red-500/20 text-red-400 border-red-500/30",
  }
  return (
    <tr className="border-b border-zinc-800/40 last:border-b-0">
      <td className="px-4 py-2.5 text-xs text-zinc-400 font-mono">{id}</td>
      <td className="px-4 py-2.5 text-xs text-zinc-300">{description}</td>
      <td className="px-4 py-2.5 text-xs text-zinc-500">{type}</td>
      <td className="px-4 py-2.5">
        <span
          className={`inline-block text-[10px] px-2 py-0.5 rounded border ${statusStyles[status]}`}
        >
          {status}
        </span>
      </td>
      <td className="px-4 py-2.5 text-xs text-zinc-500">{date}</td>
    </tr>
  )
}

function CustodyRow({
  actor,
  action,
  evidenceId,
  time,
}: {
  actor: string
  action: string
  evidenceId: string
  time: string
}) {
  return (
    <div className="px-4 py-2.5 flex items-center gap-3">
      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-zinc-600 to-zinc-800 shrink-0" />
      <div className="flex-1 text-xs">
        <span className="text-white font-medium">{actor}</span>
        <span className="text-zinc-500"> {action} </span>
        <span className="text-blue-400 font-mono">{evidenceId}</span>
      </div>
      <span className="text-[10px] text-zinc-600">{time}</span>
    </div>
  )
}
