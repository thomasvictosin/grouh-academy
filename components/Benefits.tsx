import React from 'react'

const Benefits = () => {

  const list = [
    'Hands-on projects with real-world constraints and deliverables',
    '1-on-1 mentorship from industry practitioners',
    'Official Grouh Academy certificate recognized by partner employers',
    'Portfolio-ready case studies to attach to job applications',
    'Access to Grouh Academy alumni network across Africa',
    'Weekly live workshops, code reviews, and design critiques',
    'Career coaching and resume / portfolio review session',
    'Priority referrals to Grouh Academy hiring partners',
  ]


  function IconCheck() {
  return (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

  return (
     <section className="py-24" style={{ background: '#f3f4fc' }} id="benefits">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
         <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-px" style={{ background: '#4db848' }} />
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#4db848' }}>Why join</span>
            <div className="w-8 h-px" style={{ background: '#4db848' }} />
          </div>
          <h2 className="font-display font-black text-[#1a2060]" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em' }}>What You Get</h2>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto">Every intern graduates with tangible assets — not just a line on a CV.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {list.map((item, i) => (
            <div key={i} style={{ background: '#ffffff', border: '1px solid #dae3f8', borderRadius: '12px', padding: '16px 20px', transition: 'border-color 0.3s' }}
              className="flex items-start gap-4 hover:border-orange-500/40">
              <div style={{ background: 'rgba(77,184,72,0.15)', borderRadius: '8px', padding: '6px', flexShrink: 0 }}>
                <span style={{ color: '#4db848' }}><IconCheck /></span>
              </div>
              <p className="text-{#0d0f3a} text-sm leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Benefits
