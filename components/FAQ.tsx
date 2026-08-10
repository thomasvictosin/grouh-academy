'use client'

import React, { useState } from 'react'

const FAQ = () => {

    const [open, setOpen] = useState<number | null>(0)
    
    const FAQS = [
       {
         q: 'How are courses structured?',
         a: 'Each course is built around weekly modules with video lessons, readings, quizzes, and hands-on assignments. You progress at your own pace within the cohort timeline.',
       },
       {
         q: 'What payment methods do you accept?',
         a: 'We accept card payments, bank transfers, and mobile money. Flexible installment plans are available for all flagship courses.',
       },
       {
         q: 'Do I receive a certificate upon completion?',
         a: 'Yes. Verified digital certificates are issued for every completed course and internship. They are shareable directly to LinkedIn.',
       },
       {
         q: 'How does the internship admission process work?',
         a: 'You submit an application, complete a short assessment, and submit a practical task. Accepted applicants receive a structured 12-week internship with dedicated mentorship.',
       },
       {
         q: 'Can I take a course and do the internship simultaneously?',
         a: 'Absolutely. Both programs share a single account — you can enroll in courses and apply for the internship independently, managing both from your dashboard.',
       },
      {
         q: 'What happens if I fall behind on a course?',
         a: 'All lesson content stays accessible after the cohort ends, so you can catch up on your own schedule. Your instructor and community are available throughout.',
       },
    ]


  return (
    <section id="faqs" className="py-24 lg:py-32 bg-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-px" style={{ backgroundColor: '#4db848' }} />
            <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: '#4db848' }}>FAQ</span>
            <div className="w-8 h-px" style={{ backgroundColor: '#4db848' }} />
          </div>
          <h2
            className="text-4xl lg:text-5xl font-black leading-tight"
            style={{ fontFamily: 'Fraunces, serif', color: '#141650' }}
          >
            Answers to the obvious questions.
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                open === i ? 'border-green-200 shadow-sm' : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <button
                className="w-full flex items-center justify-between p-6 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-semibold text-base pr-4" style={{ color: '#141650' }}>
                  {faq.q}
                </span>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
                  style={{ backgroundColor: open === i ? '#4db848' : '#f3f4fc' }}
                >
                  <svg
                    width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke={open === i ? 'white' : '#5457b8'}
                    strokeWidth="2.5"
                    className={`transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`}
                  >
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </button>
              {open === i && (
                <div className="px-6 pb-6">
                  <p className="text-gray-500 text-base leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQ
