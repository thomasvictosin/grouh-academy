import React from 'react'

const MissionVision = () => {
  return (
    <section className="py-24 lg:py-32 overflow-hidden" style={{ background: '#f8f9fe' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Mission */}
          <div className="relative rounded-3xl p-10 lg:p-14 overflow-hidden" style={{ background: '#141650', minHeight: 400 }}>
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #4db848, transparent)', transform: 'translate(30%, -30%)' }} />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-8" style={{ background: 'radial-gradient(circle, #5457b8, transparent)', transform: 'translate(-30%, 30%)' }} />

            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8 text-xs font-bold tracking-widest uppercase" style={{ background: 'rgba(77,184,72,0.2)', color: '#4db848' }}>
                ◎ Mission
              </div>
              <p className="text-white/40 text-sm mb-6 uppercase tracking-widest font-semibold">What we do every day</p>
              <h3 className="text-3xl lg:text-4xl font-black text-white leading-tight mb-6" style={{ fontFamily: 'Fraunces, serif' }}>
                To equip Africa's next generation with the skills, experience, and network to build remarkable careers.
              </h3>
              <p className="text-white/60 leading-relaxed">
                Not through passive lectures. Through real projects, relentless feedback, and a community that holds each learner to a higher standard.
              </p>
            </div>
          </div>

          {/* Vision */}
          <div className="relative rounded-3xl p-10 lg:p-14 overflow-hidden border-2" style={{ background: 'white', borderColor: '#e8e9f8', minHeight: 400 }}>
            <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full opacity-8" style={{ background: 'radial-gradient(circle, #4db848, transparent)', transform: 'translate(30%, 30%)' }} />

            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8 text-xs font-bold tracking-widest uppercase" style={{ background: '#e8f7e7', color: '#3a9030' }}>
                ◈ Vision
              </div>
              <p className="text-xs mb-6 uppercase tracking-widest font-semibold" style={{ color: '#9295b8' }}>Where we're going</p>
              <h3 className="text-3xl lg:text-4xl font-black leading-tight mb-6" style={{ fontFamily: 'Fraunces, serif', color: '#141650' }}>
                A world where your address never limits your access to world-class education and career opportunity.
              </h3>
              <p className="leading-relaxed" style={{ color: '#6b6f9a' }}>
                We believe the talent gap between continents is manufactured — by access, not ability. We're here to prove it.
              </p>
            </div>

            {/* Small decorative stat */}
            <div className="mt-10 pt-6 border-t" style={{ borderColor: '#e8e9f8' }}>
              <div className="flex gap-8">
                <div>
                  <div className="font-black text-2xl" style={{ fontFamily: 'Fraunces, serif', color: '#4db848' }}>8</div>
                  <div className="text-xs" style={{ color: '#9295b8' }}>Countries reached</div>
                </div>
                <div>
                  <div className="font-black text-2xl" style={{ fontFamily: 'Fraunces, serif', color: '#141650' }}>2030</div>
                  <div className="text-xs" style={{ color: '#9295b8' }}>Target: 50k graduates</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why We Exist — manifesto strip */}
        <div className="mt-6 rounded-3xl p-10 lg:p-14" style={{ background: '#4db848' }}>
          <div className="grid lg:grid-cols-[1fr_2fr] gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 text-xs font-bold tracking-widest uppercase" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
                ✦ Why We Exist
              </div>
              <h3 className="text-3xl font-black text-white leading-tight" style={{ fontFamily: 'Fraunces, serif' }}>
                The problem is real. So is our answer.
              </h3>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { stat: '60%', text: 'of African graduates report being unemployable in their chosen field within a year of graduation.' },
                { stat: '3×', text: 'faster career growth for learners who complete project-based programs vs. traditional courses.' },
                { stat: '72%', text: 'of tech employers say portfolio work matters more than degrees when making hiring decisions.' },
              ].map((item, i) => (
                <div key={i} className="bg-white/15 rounded-2xl p-5">
                  <div className="font-black text-3xl text-white mb-2" style={{ fontFamily: 'Fraunces, serif' }}>{item.stat}</div>
                  <p className="text-white/80 text-sm leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MissionVision
