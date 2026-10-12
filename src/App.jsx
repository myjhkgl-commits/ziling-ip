import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import EthnicSection from './components/EthnicSection'
import MainIP from './components/MainIP'
import Footer from './components/Footer'

export default function App() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('is-in')
            io.unobserve(en.target)
          }
        })
      },
      { threshold: 0.12 },
    )
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div className="site">
      <Navbar />
      <Hero />
      <MainIP />
      <EthnicSection />
      <Footer />
    </div>
  )
}
