import React from 'react'
import Image from 'next/image'
import logoWhite from '../public/logo-white.png'

const Footer = () => {
  return (
    <footer className="py-16" style={{ backgroundColor: '#0d0f3a' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="lg:col-span-1">
            <Image src={logoWhite} alt="Grouh Academy" className="mb-4 h-10 w-auto opacity-90" />
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              A unified platform for learning, internships, and career development across Africa and beyond.
            </p>
            <div className="flex gap-3 mt-5">
              {['twitter', 'linkedin', 'instagram'].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/40 hover:text-white hover:border-white/40 transition-colors"
                  aria-label={s}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    {s === 'twitter' && <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>}
                    {s === 'linkedin' && <><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></>}
                    {s === 'instagram' && <><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01" fill="none" stroke="currentColor" strokeWidth="2"/></>}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {[
            {
              heading: 'Platform',
              links: ['Courses', 'Internship Program', 'Instructor Portal', 'Blog'],
            },
            {
              heading: 'Company',
              links: ['About Us', 'Careers', 'Press', 'Contact', 'Partners'],
            },
            {
              heading: 'Support',
              links: ['Help Center', 'FAQs', 'Privacy Policy', 'Terms of Service', 'Cookie Policy'],
            },
          ].map((col) => (
            <div key={col.heading}>
              <h4 className="text-white font-semibold text-sm mb-5">{col.heading}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href={link === 'Courses' ? '/courses' : link === 'About Us' ? '/about' : link === 'Contact' ? '/contact' : '#'} className="text-white/40 text-sm hover:text-white/80 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm">© 2026 Grouh Academy. All rights reserved.</p>
          <p className="text-white/20 text-sm">Built for Africa&apos;s next generation of builders.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
