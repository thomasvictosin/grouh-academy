import React from 'react'
import { GraduationCap, RefreshCw, Globe2, Rocket } from 'lucide-react'

const WhoShouldApply = () => {

     const profiles = [
    { icon: GraduationCap, title: 'Final-Year Students', desc: 'Undergraduates or recent graduates looking to turn academic knowledge into industry-ready experience.' },
    { icon: RefreshCw, title: 'Career Switchers', desc: 'Professionals pivoting into tech, design, or digital marketing who need a credible, structured transition path.' },
    { icon: Globe2, title: 'Self-Taught Builders', desc: 'Autodidacts with raw skills and ambition who need a professional environment to sharpen and showcase their work.' },
    { icon: Rocket, title: 'Ambitious Early Starters', desc: 'Second or third-year students hungry to get ahead and build a competitive portfolio before graduation.' },
  ]

  function Label({ children }: { children: string }) {
  return (
    <div className="inline-flex items-center gap-2 mb-4">
      <div style={{ background: 'linear-gradient(90deg, #4db848, #65d665)', height: '2px', width: '24px' }} />
      <span style={{ color: '#4db848' }} className="text-xs font-semibold tracking-widest uppercase font-display">{children}</span>
      <div style={{ background: 'linear-gradient(90deg, #4db848, #65d665)', height: '2px', width: '24px' }} />
    </div>
  )
  }

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

  return (
    <section className="py-24" id="who-applies" style={{ backgroundColor: '#0d0f3a' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <Label>Ideal Candidates</Label>
            <h2 className="font-display font-black text-white mb-6" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em' }}>
              Who Should Apply?
            </h2>
            <p className="text-slate-400 leading-relaxed mb-8">
              We don't require perfection — we require <strong className="text-white">drive</strong>. Whether you're fresh out of school, pivoting careers, or purely self-taught, Grouh Academy's internship is built for builders who want to grow.
            </p>
            <a href="#apply" style={{ color: '#4db848', borderBottom: '1px solid rgba(122, 245, 15, 0.4)' }} className="font-semibold text-sm flex items-center gap-2 w-fit hover:border-orange-400 transition-colors font-display">
              See if you qualify <IconArrow />
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {profiles.map(p => (
              <div key={p.title} style={{ background: '#0d0f3a36', border: '1px solid #1e2a45', borderRadius: '16px', padding: '24px', transition: 'border-color 0.3s, transform 0.3s' }}
                className="hover:border-orange-500/40 hover:-translate-y-1">
                <div className="mb-3 text-[#5FBB46]"><p.icon className="h-8 w-8" /></div>
                <h3 className="font-display font-bold text-white mb-2 text-sm">{p.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhoShouldApply
