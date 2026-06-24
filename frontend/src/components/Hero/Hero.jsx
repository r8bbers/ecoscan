import React from 'react'
import './Hero.css'
import dark_arrow from '../../assets/dark-arrow.png'

const Hero = () => {
  return (
    <div className='hero container'>
        <div className="hero-text">
            <h1>Scan. Detect. Recycle Smarter.</h1>
            <p>AI-powered trash detection using computer vision to help you classify waste and recycle smarter.</p>
            <button className='btn'>Scan Your Waste <img src={dark_arrow} alt=''/></button>
        </div> 
    </div>
  )
}

export default Hero