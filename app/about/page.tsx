import AboutCTA from '@/components/AboutCTA'
import AboutHero from '@/components/AboutHero'
import AcademyStats from '@/components/AcademyStats'
import LearningPhilosophy from '@/components/LearningPhilosophy'
import MeetTheTeam from '@/components/MeetTheTeam'
import MissionVision from '@/components/MissionVision'
import OurStory from '@/components/OurStory'
import React from 'react'

const page = () => {
  return (
    <div>
      <AboutHero />
      <OurStory />
      <MissionVision />
      <LearningPhilosophy />
      <AcademyStats />
      <MeetTheTeam />
      <AboutCTA />
    </div>
  )
}

export default page
