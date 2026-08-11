import React from 'react'
import { MILESTONES } from '@/constants/data/milestone'

const OurStory = () => {
  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-[300px_1fr] gap-16 items-start">
          <div className="lg:sticky lg:top-32">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="w-8 h-px" style={{ background: '#4db848' }} />
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#4db848' }}>Our Story</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-black leading-tight" style={{ fontFamily: 'Fraunces, serif', color: '#141650' }}>
              A Google Doc and a bold idea.
            </h2>
          </div>

          <div>
            <div className="relative pl-8 border-l-2" style={{ borderColor: '#e8e9f8' }}>
              {MILESTONES.map((m, i) => (
                <div key={i} className="relative mb-12 last:mb-0">
                  <div
                    className="absolute -left-[41px] w-5 h-5 rounded-full border-4 border-white"
                    style={{ background: i === MILESTONES.length - 1 ? '#4db848' : '#2b2e82', top: '4px' }}
                  />
                  <div className="flex items-start gap-6">
                    <span
                      className="flex-shrink-0 font-black text-sm px-3 py-1 rounded-full"
                      style={{ background: i === MILESTONES.length - 1 ? '#e8f7e7' : '#f3f4fc', color: i === MILESTONES.length - 1 ? '#3a9030' : '#2b2e82', fontFamily: 'Fraunces, serif' }}
                    >
                      {m.year}
                    </span>
                    <p className="text-base leading-relaxed pt-0.5" style={{ color: '#4a4d7a' }}>{m.event}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 rounded-2xl p-8 relative overflow-hidden" style={{ background: '#141650' }}>
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #4db848, transparent)', transform: 'translate(30%, -30%)' }} />
              <svg className="mb-4 opacity-25" width="40" height="30" viewBox="0 0 40 30" fill="white">
                <path d="M0 30V19C0 9.333 4.333 3 13 0l3 4C12 6 9.667 9.667 9.333 15H17V30H0zm23 0V19c0-9.667 4.333-16 13-19l3 4c-4 2-6.333 5.667-6.667 11H40V30H23z" />
              </svg>
              <p className="text-white text-xl font-medium leading-relaxed" style={{ fontFamily: 'Fraunces, serif' }}>
                "We didn't start Grouh to build a school. We started it because the students we knew were talented, hungry, and completely unprepared for the real world."
              </p>
              <div className="mt-5 flex items-center gap-3">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format" alt="Oluwaseun" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="text-white font-semibold text-sm">Oluwaseun Adeyemi</p>
                  <p className="text-white/50 text-xs">Founder & CEO</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default OurStory
