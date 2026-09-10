'use client'

import React, { useState } from 'react'

const Requirements = () => {

    function IconCheck() {
  return (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}   

    const general = [
    'Conversational English — written and spoken',
    'Stable internet connection and a working laptop or desktop',
    'Availability of at least 20 hours per week for 8 weeks',
    'Genuine motivation to learn, ship, and receive critique',
    'Completion of at least one relevant Grouh Academy course (recommended, not mandatory)',
  ]

  const byTrack: Record<string, string[]> = {
    'Software Dev': ['Basic knowledge of HTML, CSS, and JavaScript', 'Familiarity with Git fundamentals', 'Completed a small personal or academic project'],
    'Digital Marketing': ['Understanding of social media platforms and content creation', 'Curiosity about analytics and growth metrics', 'Prior hands-on experience with any digital channel (even personal)'],
    'UI/UX Design': ['Proficiency or active learning of Figma', 'An existing design portfolio or work-in-progress', 'Understanding of basic UX principles'],
  }

  const [active, setActive] = useState('Software Dev')

  return (
    <section className="py-24" id="requirements">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16">
            <div>
                <div className="inline-flex items-center gap-2 mb-4">
                   <div className="w-8 h-px" style={{ background: '#4db848' }} />
                   <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#4db848' }}>Prerequisites</span>
                   <div className="w-8 h-px" style={{ background: '#4db848' }} />
                </div>
                <h2 className="font-display font-black text-[#1C1D52] mb-6" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em' }}>Requirements</h2>
                <p className="text-slate-400 mb-8 leading-relaxed text-sm">All applicants must meet these general requirements, plus track-specific criteria.</p>
                <div className="flex flex-col gap-3">
                  {general.map((r, i) => (
                     <div key={i} className="flex items-start gap-3">
                       <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(77,184,72,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                         <span style={{ color: '#5FBB46', fontSize: '10px', fontWeight: 700 }}>{i + 1}</span>
                       </div>
                       <p className="text-[#1C1D52] text-sm leading-relaxed">{r}</p>
                     </div>
                  ))}
                </div>
            </div>
        

          <div>
            <p className="text-slate-500 text-xs uppercase tracking-widest mb-4 font-display font-semibold">Track-Specific</p>
            <div className="flex gap-2 mb-6">
              {Object.keys(byTrack).map(t => (
                <button key={t} onClick={() => setActive(t)}
                  style={{ background: active === t ? 'linear-gradient(135deg, #4db848, #65d665)' : '#1C1D52', border: active === t ? 'none' : '1px solid #1e2a45', borderRadius: '8px', padding: '6px 14px', color: active === t ? 'white' : '#94a3b8', fontSize: '12px', fontWeight: 600, transition: 'all 0.2s', cursor: 'pointer' }}
                  className="font-display hover:text-white">{t}</button>
              ))}
            </div>
            <div style={{ background: '#1C1D52', border: '1px solid #1e2a45', borderRadius: '16px', padding: '24px' }}>
              {byTrack[active].map((r, i) => (
                <div key={i} className="flex items-start gap-3 mb-4 last:mb-0">
                  <span style={{ color: '#5FBB46' }}><IconCheck /></span>
                  <p className="text-slate-300 text-sm leading-relaxed">{r}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Requirements

