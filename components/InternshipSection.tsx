import React from 'react'

const InternshipSection = () => {
  return (
    <section id="internship" className="py-24 lg:py-32 relative overflow-hidden" style={{ backgroundColor: '#141650' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #4db848 0%, transparent 70%)', transform: 'translate(20%, -20%)' }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image side */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl" style={{ aspectRatio: '4/3' }}>
              <img
                src="https://images.unsplash.com/photo-1690378820474-b468b8ee64d3?w=900&h=675&fit=crop&auto=format"
                alt="Interns collaborating with laptops in a modern workspace"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Badge */}
            <div
              className="absolute -bottom-5 -right-4 rounded-2xl p-5 shadow-xl"
              style={{ backgroundColor: '#4db848' }}
            >
              <div className="text-white font-black text-3xl mb-0.5" style={{ fontFamily: 'Fraunces, serif' }}>12</div>
              <div className="text-white/90 text-sm font-medium">Week Program</div>
            </div>
          </div>

          {/* Text side */}
          <div>
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-8 h-px bg-green-400" style={{ backgroundColor: '#4db848' }} />
              <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: '#4db848' }}>Internship</span>
            </div>

            <h2
              className="text-4xl lg:text-5xl font-black text-white leading-tight mb-6"
              style={{ fontFamily: 'Fraunces, serif' }}
            >
              Not just an internship.
              <br />
              <em className="not-italic" style={{ color: '#4db848' }}>A career launchpad.</em>
            </h2>

            <p className="text-white/70 text-lg leading-relaxed mb-8">
              The Grouh Internship is a structured, mentor-led, 12-week program where you work on real projects alongside experienced professionals. Every intern leaves with shipped work in their portfolio and a network that opens doors.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {[
                'Dedicated mentor assigned',
                'Weekly milestone reviews',
                'Real project ownership',
                'Partner company exposure',
                'Portfolio-ready deliverables',
                'Certificate upon completion',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'rgba(77,184,72,0.2)' }}
                  >
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#4db848" strokeWidth="2.5">
                      <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-white/80 text-sm">{item}</span>
                </div>
              ))}
            </div>

            <a
              href="#"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold text-base transition-all hover:scale-105"
              style={{ backgroundColor: '#4db848' }}
            >
              Apply for Internship
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default InternshipSection
