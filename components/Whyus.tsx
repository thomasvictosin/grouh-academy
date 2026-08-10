import React from 'react'

const Whyus = () => {

  const features = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M22 4L12 14.01l-3-3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: 'Practical-First Learning',
      desc: 'Every module is built around doing, not just watching. Real codebases, live briefs, and industry tools from day one.',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="8" r="4"/>
          <path d="M6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2" strokeLinecap="round"/>
        </svg>
      ),
      title: 'Experienced Instructors',
      desc: 'Learn from practitioners who are currently working in their fields — not just theorists. Real experience, real insights.',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="3" width="20" height="14" rx="2"/>
          <path d="M8 21h8M12 17v4" strokeLinecap="round"/>
        </svg>
      ),
      title: 'Real-World Projects',
      desc: 'Graduate with a portfolio of projects that solve actual problems — built during your course and internship.',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: 'Career Development',
      desc: 'Resume reviews, interview prep, and direct access to our network of 60+ hiring partners across the continent.',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      ),
      title: 'Structured Internships',
      desc: 'A 12-week program with mentors, weekly milestones, and a real team. Not coffee-fetching — actual work that matters.',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round"/>
        </svg>
      ),
      title: 'Industry Exposure',
      desc: 'Cohort learning puts you alongside peers building their careers. Guest speakers, company visits, and live demos monthly.',
    },
  ]

  return (
    <section id="about" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-16 items-start">
          {/* Left label */}
          <div className="lg:sticky lg:top-32">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-px" style={{ backgroundColor: '#4db848' }} />
              <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: '#4db848' }}>Why Grouh</span>
            </div>
            <h2
              className="text-4xl lg:text-5xl font-black leading-tight mb-6"
              style={{ fontFamily: 'Fraunces, serif', color: '#141650' }}
            >
              Built for people who want to actually
              <em className="not-italic" style={{ color: '#4db848' }}> build things.</em>
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              We designed the academy around the gap between classroom theory and employer expectations. Every decision reflects that.
            </p>
          </div>

          {/* Right grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-md transition-all duration-300 bg-white"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors group-hover:bg-green-100"
                  style={{ backgroundColor: '#f2fbf2', color: '#4db848' }}
                >
                  {f.icon}
                </div>
                <h3 className="font-bold text-base mb-2" style={{ color: '#141650' }}>{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Whyus
