import React from 'react'
import { PHILOSOPHY_PILLARS } from '@/constants/data/philosophy'

const LearningPhilosophy = () => {
  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-px" style={{ background: '#4db848' }} />
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#4db848' }}>How we teach</span>
            <div className="w-8 h-px" style={{ background: '#4db848' }} />
          </div>
          <h2 className="text-4xl lg:text-5xl font-black leading-tight max-w-2xl mx-auto" style={{ fontFamily: 'Fraunces, serif', color: '#141650' }}>
            Our learning philosophy in four principles.
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          {PHILOSOPHY_PILLARS.map((p, i) => (
            <div
              key={i}
              className="group rounded-3xl p-10 border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden"
              style={{ borderColor: '#e8e9f8', background: i % 2 === 0 ? 'white' : '#f8f9fe' }}
            >
              <div className="absolute top-0 right-0 font-black text-8xl opacity-[0.04] leading-none pr-6 pt-2" style={{ fontFamily: 'Fraunces, serif', color: p.color }}>
                {p.num}
              </div>
              <div className="relative">
                <span className="inline-block text-xs font-bold tracking-widest uppercase mb-4 px-3 py-1 rounded-full" style={{ background: p.color === '#4db848' ? '#e8f7e7' : '#f3f4fc', color: p.color }}>
                  Principle {p.num}
                </span>
                <h3 className="text-2xl font-black mb-4 leading-tight" style={{ fontFamily: 'Fraunces, serif', color: '#141650' }}>
                  {p.heading}
                </h3>
                <p className="leading-relaxed" style={{ color: '#6b6f9a' }}>{p.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Teaching image */}
        <div className="mt-5 rounded-3xl overflow-hidden" style={{ height: 360 }}>
          <img
            src="https://images.unsplash.com/photo-1522881193457-37ae97c905bf?w=1400&h=720&fit=crop&auto=format"
            alt="Grouh instructor teaching a student"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  )
}

export default LearningPhilosophy
