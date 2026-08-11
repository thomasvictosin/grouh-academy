'use client'

import React, { useState } from 'react'
import { TEAM } from '@/constants/data/team'

const MeetTheTeam = () => {
   
    const [active, setActive] = useState<number | null>(null)
    
  return (
     <section className="py-24 lg:py-32" style={{ background: '#f8f9fe' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-px" style={{ background: '#4db848' }} />
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#4db848' }}>The people</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black leading-tight" style={{ fontFamily: 'Fraunces, serif', color: '#141650' }}>
              Meet the team
              <br />behind the work.
            </h2>
          </div>
          <p className="text-base leading-relaxed max-w-sm lg:text-right" style={{ color: '#9295b8' }}>
            Practitioners first, educators second. Everyone on our team has done the work they teach.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TEAM.map((member, i) => (
            <div
              key={i}
              className="group rounded-2xl overflow-hidden border-2 transition-all duration-300 cursor-pointer"
              style={{
                borderColor: active === i ? '#4db848' : '#e8e9f8',
                background: 'white',
                transform: active === i ? 'translateY(-4px)' : 'none',
                boxShadow: active === i ? '0 16px 40px rgba(77,184,72,0.15)' : 'none',
              }}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              <div className="relative overflow-hidden" style={{ aspectRatio: '4/3', background: '#f3f4fc' }}>
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Tag overlay */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold text-white" style={{ background: 'rgba(20,22,80,0.75)', backdropFilter: 'blur(8px)' }}>
                    {member.tag}
                  </span>
                </div>
                {/* Social on hover */}
                <div className={`absolute bottom-0 left-0 right-0 flex items-center justify-center gap-3 pb-5 transition-all duration-300 ${active === i ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  {[
                    { icon: 'linkedin', href: member.linkedin },
                    { icon: 'twitter', href: member.twitter },
                  ].map(({ icon, href }) => (
                    <a
                      key={icon}
                      href={href}
                      onClick={e => e.stopPropagation()}
                      className="w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30 transition-colors hover:bg-white text-white hover:text-navy-900"
                      style={{ background: 'rgba(20,22,80,0.6)', '--tw-text-opacity': '1' } as React.CSSProperties}
                      aria-label={icon}
                    >
                      <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24">
                        {icon === 'linkedin'
                          ? <><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></>
                          : <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>}
                      </svg>
                    </a>
                  ))}
                </div>
              </div>

              <div className="p-6">
                <p className="font-black text-base mb-0.5" style={{ color: '#141650' }}>{member.name}</p>
                <p className="text-xs font-semibold mb-3" style={{ color: '#4db848' }}>{member.role}</p>
                <p className="text-sm leading-relaxed" style={{ color: '#6b6f9a' }}>{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MeetTheTeam
