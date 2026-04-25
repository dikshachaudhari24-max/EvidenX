'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { FeatureCardsSection } from '@/components/feature-cards-section';
import { EvidenceTypesShowcase } from '@/components/evidence-types-showcase';
import Link from 'next/link';
import { ArrowRight, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <main className="bg-background overflow-hidden">
      <Navbar />

      {/* Animated background cursor effect */}
      <div
        className="fixed pointer-events-none w-96 h-96 bg-blue-500/20 rounded-full blur-3xl opacity-0 transition-opacity duration-300"
        style={{
          left: `${mousePosition.x - 192}px`,
          top: `${mousePosition.y - 192}px`,
          opacity: 0.15,
        }}
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-balance leading-tight">
              EvidenX is a forensic evidence management platform for criminal investigations
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto text-balance">
              Meet the system for modern forensic operations.
              <br />
              Secure chain of custody, streamlined evidence tracking, and audit trails.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 pt-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#features"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 text-gray-300 hover:text-white border border-gray-700 px-6 py-3 rounded-lg transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Evidence Types Showcase */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 space-y-2">
            <h2 className="text-3xl font-bold">Evidence Categories</h2>
            <p className="text-gray-400">Manage all types of criminal evidence with precision</p>
          </div>
          <EvidenceTypesShowcase />
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-b from-blue-500/20 to-transparent rounded-2xl border border-gray-700/50 p-8 md:p-12 overflow-hidden">
            <div className="aspect-video bg-gray-900 rounded-lg border border-gray-700 flex items-center justify-center">
              <div className="text-center space-y-4">
                <Shield className="w-16 h-16 text-blue-500 mx-auto" />
                <p className="text-gray-400">Dashboard Preview</p>
                <p className="text-sm text-gray-500">Sign in to explore the full interface</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 space-y-2">
            <h2 className="text-3xl font-bold">Powerful Features</h2>
            <p className="text-gray-400">Everything you need for professional evidence management</p>
          </div>
          <FeatureCardsSection />
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold">Powering the world&apos;s best investigation teams.</h2>
          <p className="text-xl text-gray-400">
            From small departments to established law enforcement agencies.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg transition-colors font-medium text-lg"
          >
            Start Your Investigation
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
