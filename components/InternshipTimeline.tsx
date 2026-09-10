import React from 'react'

function IconCalendar() {
  return (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function IconUsers() {
  return (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function IconBriefcase() {
  return (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  )
}

function IconCode() {
  return (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12" />
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

const events = [
  { phase: 'Week 0', title: 'Applications Open', desc: 'Rolling — submit any time. Applications are reviewed within 3 business days.', icon: <IconCalendar /> },
  { phase: 'Week 1', title: 'Screening & Assessment', desc: 'Skills test and 20-minute virtual interview with a Grouh mentor.', icon: <IconUsers /> },
  { phase: 'Week 2', title: 'Offer & Onboarding', desc: 'Successful applicants receive an offer letter, pay the assessment fee, and access onboarding.', icon: <IconBriefcase /> },
  { phase: 'Weeks 3–9', title: 'Active Internship', desc: 'Live sprints, workshops, mentor sessions, and iterative project work.', icon: <IconCode /> },
  { phase: 'Week 10', title: 'Final Presentation', desc: 'Present your project to a panel of mentors and industry guests.', icon: <IconStar /> },
  { phase: 'Week 10+', title: 'Graduation & Certificate', desc: 'Receive your Grouh Academy certificate and join the alumni community.', icon: <IconCheck /> },
]

const InternshipTimeline = () => {
  return (
    <section className="py-24" style={{ background: '#1C1D52' }} id="timeline">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-px" style={{ background: '#4db848' }} />
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#4db848' }}>Why join</span>
            <div className="w-8 h-px" style={{ background: '#4db848' }} />
          </div>
          <h2 className="font-display font-black text-white" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em' }}>Program Timeline</h2>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto">Internships run in rolling cohorts — there's always an upcoming start date.</p>
        </div>

        <div className="relative">
          <div style={{ position: 'absolute', left: '27px', top: '8px', bottom: '8px', width: '2px', background: 'linear-gradient(to bottom, #5FBB46, rgba(249,115,22,0.1))' }} />
          <div className="flex flex-col gap-8">
            {events.map((e, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: i === 0 ? 'linear-gradient(135deg, #5FBB46, #1c570c)' : '#0d0f3a', border: i === 0 ? 'none' : '2px solid #1e2a45', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: i === 0 ? 'white' : '#5FBB46', zIndex: 1, position: 'relative' }}>
                  {e.icon}
                </div>
                <div style={{ paddingTop: '12px' }}>
                  <span style={{ color: '#5FBB46', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em' }} className="font-display">{e.phase}</span>
                  <h3 className="font-display font-bold text-white mt-0.5 mb-1">{e.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{e.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default InternshipTimeline
