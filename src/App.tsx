import Nav from './components/Nav'
import Hero from './components/Hero'
import ValueStrip from './components/ValueStrip'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import MagicMoment from './components/MagicMoment'
import Secondhand from './components/Secondhand'
import Pricing from './components/Pricing'
import DownloadCTA from './components/DownloadCTA'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ValueStrip />
        <Features />
        <HowItWorks />
        <MagicMoment />
        <Secondhand />
        <Pricing />
        <DownloadCTA />
      </main>
      <Footer />
    </>
  )
}
