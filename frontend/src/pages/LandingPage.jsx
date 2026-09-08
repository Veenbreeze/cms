import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

import AboutSection from '../features/landing/AboutSection'
import CTASection from '../features/landing/CTASection'
import EventsSection from '../features/landing/EventsSection'
import GallerySection from '../features/landing/GallerySection'
import Hero from '../features/landing/Hero'
import MediaTeachingSection from '../features/landing/MediaTeachingSection'
import MinistriesSection from '../features/landing/MinistriesSection'
import NewsSection from '../features/landing/NewsSection'
import QuickAccessSection from '../features/landing/QuickAccessSection'
import ServicesSection from '../features/landing/ServicesSection'
import { getLandingFeed } from '../services/api/publicContentService'

export default function LandingPage() {
  const { church } = useOutletContext()
  const [feed, setFeed] = useState(null)

  useEffect(() => {
    getLandingFeed()
      .then(setFeed)
      .catch(() => setFeed(null))
  }, [])

  return (
    <>
      <Hero church={church} backgroundImage={feed?.photos?.[0]?.image} />
      <QuickAccessSection />
      <AboutSection church={church} imageUrl={church?.logo || feed?.photos?.[1]?.image} />
      <NewsSection announcements={feed?.announcements} />
      <EventsSection events={feed?.events} />
      <GallerySection photos={feed?.photos} />
      <MediaTeachingSection lesson={feed?.lesson} />
      <MinistriesSection />
      <ServicesSection variant="compact" />
      <CTASection />
    </>
  )
}
