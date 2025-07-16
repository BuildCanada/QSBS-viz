import { Routes, Route } from 'react-router-dom'
import { Hero } from './components/Hero'
import { Nav } from './components/Nav'
import { FontGuide } from './components/FontGuide'

function HomePage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#C7C7E0' }}>
      <div className="p-5 flex flex-col gap-3">
        <Nav />
        <Hero />
      </div>
    </div>
  )
}

function FontGuidePage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#C7C7E0' }}>
      <div className="p-5 flex flex-col gap-3">
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
