import { Routes, Route } from 'react-router-dom'
import { Hero } from './components/Hero'
import { Nav } from './components/Nav'
import { Info } from './components/Info'
import { FontGuide } from './components/FontGuide'

function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="p-5">
        <Nav />
        <Hero />
        <Info />
      </div>
    </div>
  )
}

function FontGuidePage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="p-5">
        <FontGuide />
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/font" element={<FontGuidePage />} />
    </Routes>
  )
}

export default App
