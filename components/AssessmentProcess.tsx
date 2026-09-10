import React from 'react'

const AssessmentProcess = () => {
    const stages = [
    { n: 1, title: 'Application Review', desc: 'Our admissions team reviews your application, portfolio links, and motivation statement within 3 business days.' },
    { n: 2, title: 'Skills Test', desc: 'A 60-minute asynchronous test tailored to your chosen track — practical tasks, not trivia.' },
    { n: 3, title: 'Virtual Interview', desc: 'A 20-minute video call with a senior mentor. We want to hear how you think, not just what you know.' },
    { n: 4, title: 'Decision & Offer', desc: 'Accepted applicants receive a formal offer letter with cohort start date, track details, and next steps within 48 hours.' },
  ]
  return (
    <div>
       <section className="py-24" id="assessment">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-px" style={{ background: '#4db848' }} />
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#4db848' }}>Why join</span>
            <div className="w-8 h-px" style={{ background: '#4db848' }} />
          </div>
          <h2 className="font-display font-black text-[#1C1D52]" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em' }}>Assessment Process</h2>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto">Transparent, fair, and designed to surface genuine potential — not just polished CVs.</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {stages.map((s, i) => (
            <div key={s.n} style={{ background: '#161d30', border: '1px solid #1e2a45', borderRadius: '20px', padding: '28px 24px', position: 'relative', transition: 'border-color 0.3s, transform 0.3s' }}
              className="hover:border-orange-500/40 hover:-translate-y-1">
              {/* Connector */}
              {i < stages.length - 1 && (
                <div style={{ position: 'absolute', right: '-13px', top: '50%', transform: 'translateY(-50%)', width: '26px', height: '2px', background: 'linear-gradient(90deg, #f97316, #1e2a45)', zIndex: 1 }} className="hidden md:block" />
              )}
              <div style={{ background: 'linear-gradient(135deg, #4db848, #fbbf24)', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <span className="font-display font-black text-white text-sm">{s.n}</span>
              </div>
              <h3 className="font-display font-bold text-white mb-2 text-sm">{s.title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
    </div>
  )
}

export default AssessmentProcess
