'use client'

import React from 'react'
import Breadcrumbs from './Breadcrumbs'

function IconArrow() {
  return (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  )
}
function IconStar() {
  return (
    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

const InternshipHero = () => {

  return (
   <section className="relative pt-28 pb-0 overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0d0f3a 0%, #141650 60%, #1a2060 100%)', minHeight: '72vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
   >
       {/* Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute rounded-full" style={{ width: 500, height: 500, top: '-80px', right: '-60px', background: 'radial-gradient(circle, rgba(77,184,72,0.14) 0%, transparent 70%)' }} />
        <div className="absolute rounded-full" style={{ width: 340, height: 340, bottom: '10%', left: '-80px', background: 'radial-gradient(circle, rgba(84,87,184,0.18) 0%, transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      </div>


      {/* Glow */}
      <div style={{ position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', width: '700px', height: '400px', background: 'radial-gradient(ellipse, rgba(249,115,22,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-8"><Breadcrumbs current="Internship" dark /></div>
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div style={{ border: '1px solid rgba(77,184,72,0.3)', color: '#4db848', background: 'rgba(77,184,72,0.15)' }} className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 font-display tracking-wide">
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4db848', animation: 'pulse 2s infinite' }} />
              ROLLING ADMISSIONS — APPLY ANYTIME
            </div>
            <h1 className="font-display font-black text-white leading-tight mb-6" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.75rem)', letterSpacing: '-0.02em' }}>
              Launch Your Career with an{' '}
              Internship
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-lg">
              Grouh Academy&apos;s internship program connects Africa&apos;s sharpest emerging talent with hands-on projects, expert mentorship, and a credential that actually opens doors.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#apply" style={{ background: 'linear-gradient(135deg, #4db848, #65d665)', boxShadow: '0 4px 30px rgba(77,184,72,0.4)' }}
                className="font-semibold text-white px-8 py-4 rounded-xl hover:opacity-90 transition-all flex items-center gap-2 font-display">
                Apply Now <IconArrow />
              </a>
              <a href="#tracks" style={{ border: '1px solid #1e2a45', color: '#cbd5e1' }}
                className="font-semibold px-8 py-4 rounded-xl hover:border-orange-500 hover:text-white transition-all font-display">
                Explore Tracks
              </a>
            </div>

            <div className="flex gap-8 mt-10 pt-8" style={{ borderTop: '1px solid #1e2a45' }}>
              {[['8 Weeks', 'Program Duration'], ['Rolling', 'Intake Cycle'], ['3 Tracks', 'Specializations']].map(([val, label]) => (
                <div key={label}>
                  <div className="font-display font-black text-2xl text-white">{val}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden md:block">
            <div style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid #1e2a45', position: 'relative' }}>
              <img
                src="https://images.unsplash.com/photo-1655720348590-c739c860beed?w=600&h=480&fit=crop&auto=format"
                alt="Grouh Academy interns collaborating on laptops"
                className="w-full block"
                style={{ filter: 'brightness(0.85)' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(11,15,30,0.7) 0%, transparent 60%)' }} />
            </div>
            
            {/* Floating badge */}
            <div style={{ position: 'absolute', bottom: '-16px', left: '-16px', background: '#161d30', border: '1px solid #1e2a45', borderRadius: '16px', padding: '16px 20px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
              <div className="flex items-center gap-3">
                <div style={{ background: 'linear-gradient(135deg, #4db848, #65d665)', borderRadius: '10px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <IconStar />
                </div>
                <div>
                  <div className="font-display font-bold text-white text-sm">98% Success Rate</div>
                  <div className="text-xs text-slate-400">Among program graduates</div>
                </div>
              </div>
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

export default InternshipHero
