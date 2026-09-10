import React from 'react'
import InternshipHero from '@/components/InternshipHero'
import HowItWorks from '@/components/HowItWorks'
import WhoShouldApply from '@/components/WhoShouldApply'
import Benefits from '@/components/Benefits'
import Requirements from '@/components/Requirements'
import InternshipTimeline from '@/components/InternshipTimeline'
import AssessmentProcess from '@/components/AssessmentProcess'
import InternshipPricing from '@/components/InternshipPricing'

const page = () => {
  return (
    <div>
      < InternshipHero />
      < HowItWorks />
      < WhoShouldApply />
      <Benefits />
      <Requirements />
      <InternshipTimeline />
      <AssessmentProcess />
      <InternshipPricing />
    </div>
  )
}

export default page
