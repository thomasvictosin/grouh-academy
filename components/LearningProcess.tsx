import React from 'react'

const PROCESS_STEPS: { num: string; label: string; desc: string }[] = [
  { num: '01', label: 'Introduction', desc: 'Overview and getting started.' },
  { num: '02', label: 'Fundamentals', desc: 'Core concepts and theory.' },
  { num: '03', label: 'Hands-on', desc: 'Practical projects and exercises.' },
  { num: '04', label: 'Portfolio', desc: 'Build real-world portfolio pieces.' },
  { num: '05', label: 'Interview Prep', desc: 'Mock interviews and feedback.' },
  { num: '06', label: 'Job Support', desc: 'Apply and secure your first role.' },
]

const LearningProcess = () => {
  return (
    <section className="py-24 lg:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-px" style={{ backgroundColor: '#4db848' }} />
            <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: '#4db848' }}>The Path</span>
            <div className="w-8 h-px" style={{ backgroundColor: '#4db848' }} />
          </div>
          <h2
            className="text-4xl lg:text-5xl font-black leading-tight"
            style={{ fontFamily: 'Fraunces, serif', color: '#141650' }}
          >
            From first lesson to first job.
          </h2>
        </div>

        <div className="relative">
          {/* Connector line */}
          <div
            className="hidden lg:block absolute top-10 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, #e8e9f8 10%, #e8e9f8 90%, transparent)', top: '2.5rem' }}
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-6 lg:gap-4">
            {PROCESS_STEPS.map((step, i) => (
              <div key={i} className="relative flex flex-col items-center text-center group">
                {/* Node */}
                <div
                  className="relative w-20 h-20 rounded-2xl flex flex-col items-center justify-center mb-4 z-10 border-2 transition-all duration-300 group-hover:shadow-lg"
                  style={{
                    backgroundColor: i === 5 ? '#141650' : i % 2 === 0 ? '#f2fbf2' : '#f3f4fc',
                    borderColor: i === 5 ? '#141650' : i % 2 === 0 ? '#4db848' : '#e8e9f8',
                  }}
                >
                  <span
                    className="text-xs font-bold tracking-widest"
                    style={{ color: i === 5 ? '#4db848' : '#a0a3c4' }}
                  >
                    {step.num}
                  </span>
                </div>
                <h3
                  className="font-bold text-sm mb-2 leading-tight"
                  style={{ color: '#141650' }}
                >
                  {step.label}
                </h3>
                <p className="text-gray-400 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section> 
  )
}

export default LearningProcess
