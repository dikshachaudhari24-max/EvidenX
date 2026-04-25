'use client';

import { motion, type Variants } from 'framer-motion';
import {
  FileText,
  Camera,
  Dna,
  Fingerprint,
  AlertTriangle,
  MapPin,
  Droplet,
  Lock,
} from 'lucide-react';

const evidenceTypes = [
  {
    icon: FileText,
    name: 'Digital Records',
    description: 'Documents, emails, and logs',
    color: 'text-blue-500',
  },
  {
    icon: Camera,
    name: 'Images & Video',
    description: 'Crime scene photos and surveillance footage',
    color: 'text-cyan-500',
  },
  {
    icon: Dna,
    name: 'Biological',
    description: 'DNA samples and tissue analysis',
    color: 'text-emerald-500',
  },
  {
    icon: Fingerprint,
    name: 'Biometric',
    description: 'Fingerprints and identifying data',
    color: 'text-purple-500',
  },
  {
    icon: AlertTriangle,
    name: 'Physical Items',
    description: 'Weapons, tools, and materials',
    color: 'text-orange-500',
  },
  {
    icon: MapPin,
    name: 'Location Data',
    description: 'GPS, coordinates, and geo-references',
    color: 'text-rose-500',
  },
  {
    icon: Droplet,
    name: 'Trace Evidence',
    description: 'Blood, hair, fiber, and residue',
    color: 'text-red-500',
  },
  {
    icon: Lock,
    name: 'Digital Forensics',
    description: 'Devices, drives, and encrypted data',
    color: 'text-indigo-500',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
} satisfies Variants;

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 10,
    },
  },
} satisfies Variants;

export function EvidenceTypesShowcase() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {evidenceTypes.map((type, index) => {
        const Icon = type.icon;
        return (
          <motion.div
            key={index}
            variants={item}
            className="group relative p-6 rounded-lg border border-gray-700 bg-gray-900/30 hover:bg-gray-900/60 transition-all duration-300 hover:border-gray-600 cursor-pointer"
          >
            {/* Hover gradient overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 pointer-events-none" />

            <div className="relative z-10">
              <Icon className={`w-8 h-8 mb-3 ${type.color}`} />
              <h3 className="font-semibold mb-1">{type.name}</h3>
              <p className="text-sm text-gray-400">{type.description}</p>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
