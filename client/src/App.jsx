import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar/Navbar.jsx'
import HomePage from './pages/HomePage/HomePage.jsx'
import Footer from './components/Footer/Footer.jsx'
import Login from './pages/Login/Login.jsx'
import Register from './pages/Register/Register.jsx'
import Contact from './pages/Contact/Contact.jsx'
import About from './pages/About/About.jsx'
import Services from './pages/Services/Services.jsx'
import Projects from './pages/Projects/Projects.jsx'
import Internships from './pages/Internships/Internships.jsx'
import Portfolio from './pages/Portfolio/Portfolio.jsx'
import ClientDashboard from './pages/ClientDashboard/ClientDashboard.jsx'
import VerifyCertificate from './pages/VerifyCertificate/VerifyCertificate.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar />



      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/about' element={<About />} />
        <Route path='/services' element={<Services />} />
        <Route path='/projects' element={<Projects />} />
        <Route path='/internships' element={<Internships />} />
        <Route path='/portfolio' element={<Portfolio />} />
        <Route path='/client-dashboard' element={<ClientDashboard />} />
        <Route path='/verify-certificate/:referenceNumber' element={<VerifyCertificate />} />

      </Routes>
      <Footer />

    </>
  )
}

export default App
