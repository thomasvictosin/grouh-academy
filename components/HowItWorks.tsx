import React from 'react'

const HowItWorks = () => {

  const steps = [
    { n: '01', title: 'Browse & Choose a Track', desc: 'Explore Software Dev, Digital Marketing, or UI/UX Design. Pick the path that matches your goals and current skills.' },
    { n: '02', title: 'Complete the Application', desc: 'Fill out our concise online application. Tell us about your background, motivations, and what you want to build.' },
    { n: '03', title: 'Assessment & Screening', desc: 'Undergo a short skills assessment and a brief virtual interview with our mentors to gauge your readiness.' },
    { n: '04', title: 'Pay the Assessment Fee', desc: 'A one-time, transparent fee covers administrative processing and unlocks access to your onboarding materials.' },
    { n: '05', title: 'Onboard & Kick Off', desc: 'Join your cohort, meet your mentor, and receive your first project brief. The real work starts here.' },
    { n: '06', title: 'Graduate & Get Certified', desc: 'Complete deliverables, receive a Grouh Academy certificate, and gain a portfolio-ready case study.' },
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

  return (
    <section className="py-24" id="how-it-works" style={{ background: '#ffffff' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <Label>Process</Label>
          <h2 className="font-display font-black text-[#1a2060]" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em' }}>How It Works</h2>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto">Six straightforward steps from application to certification. No guesswork, no hidden hurdles.</p>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div style={{ position: 'absolute', left: '28px', top: '24px', bottom: '24px', width: '2px', background: 'linear-gradient(to bottom, #3f3e3d, #1a2060)', opacity: 0.4 }} className="hidden md:block" />

          <div className="flex flex-col gap-6">
            {steps.map((step, i) => (
              <div key={step.n} className="flex gap-8 items-start group">
                <div style={{
                  minWidth: '56px', height: '56px', borderRadius: '50%',
                  background: i === 0 ? 'linear-gradient(135deg, #4db848, #65d665)' : '#1a2060',
                  border: i === 0 ? 'none' : '2px solid #1a2060',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, transition: 'all 0.3s', zIndex: 1, position: 'relative'
                }} className="group-hover:border-green-500">
                  <span className="font-display font-black text-sm" style={{ color: i === 0 ? 'white' : '#4db848' }}>{step.n}</span>
                </div>
                <div style={{ background: '#1a2060', border: '1px solid #1a2060', borderRadius: '16px', padding: '20px 24px', flex: 1, transition: 'border-color 0.3s' }}
                  className="group-hover:border-green-500/40">
                  <h3 className="font-display font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
