import React from 'react'
import { ABOUT_STATS } from '@/constants/data/stats'

const AcademyStats = () => {
  return (
   <section className="py-24 lg:py-32 relative overflow-hidden" style={{ background: '#141650' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute rounded-full" style={{ width: 600, height: 600, top: '-200px', right: '-100px', background: 'radial-gradient(circle, rgba(77,184,72,0.12) 0%, transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-px" style={{ background: '#4db848' }} />
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#4db848' }}>By the numbers</span>
            <div className="w-8 h-px" style={{ background: '#4db848' }} />
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight" style={{ fontFamily: 'Fraunces, serif' }}>
            The proof is in the outcomes.
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-px rounded-3xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          {ABOUT_STATS.map((s, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center p-10 text-center transition-all duration-200 hover:bg-white/5"
              style={{ background: 'rgba(20,22,80,0.5)', backdropFilter: 'blur(8px)' }}
            >
              <div className="font-black mb-2" style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: i % 3 === 0 ? '#4db848' : i % 3 === 1 ? 'white' : '#8b8fce' }}>
                {s.value}
              </div>
              <div className="text-white font-bold text-base mb-1">{s.label}</div>
              <div className="text-white/40 text-xs">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AcademyStats
