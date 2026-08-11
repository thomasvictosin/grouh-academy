'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

const AboutHero = () => {
  const router = useRouter()
  const onNavigate = (path: string) => router.push(path === 'home' ? '/' : `/${path}`)
  
  return (
   <section
      className="relative pt-28 pb-0 overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0d0f3a 0%, #141650 60%, #1a2060 100%)', minHeight: '72vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
    >
      {/* Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute rounded-full" style={{ width: 500, height: 500, top: '-80px', right: '-60px', background: 'radial-gradient(circle, rgba(77,184,72,0.14) 0%, transparent 70%)' }} />
        <div className="absolute rounded-full" style={{ width: 340, height: 340, bottom: '10%', left: '-80px', background: 'radial-gradient(circle, rgba(84,87,184,0.18) 0%, transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pb-20 pt-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
          <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">Home</button>
          <span>/</span>
          <span style={{ color: '#4db848' }}>About</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-end">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-semibold tracking-widest uppercase" style={{ background: 'rgba(77,184,72,0.15)', color: '#4db848', border: '1px solid rgba(77,184,72,0.3)' }}>
              Our Story
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-white leading-[1.0] tracking-tight mb-6" style={{ fontFamily: 'Fraunces, serif' }}>
              We exist to
              <br />close the gap.
            </h1>
            <p className="text-white/60 text-lg leading-relaxed max-w-lg">
              Between what schools teach and what employers need. Between ambition and opportunity. Between a degree and a career. That gap is what Grouh Academy was built to close.
            </p>
          </div>
          <div className="lg:text-right">
            <div className="inline-block rounded-2xl overflow-hidden shadow-2xl" style={{ maxWidth: 340 }}>
              <img
                src="https://images.unsplash.com/photo-1758270705290-62b6294dd044?w=700&h=480&fit=crop&auto=format"
                alt="Grouh Academy students collaborating"
                className="w-full object-cover"
                style={{ aspectRatio: '4/3' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Diagonal slice */}
      <div className="relative h-16 -mb-px">
        <svg viewBox="0 0 1440 64" preserveAspectRatio="none" className="w-full h-full" fill="white">
          <polygon points="0,64 1440,0 1440,64" />
        </svg>
      </div>
    </section>
  )
}

export default AboutHero
