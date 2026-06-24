import React from 'react';
import './Marquee.css';

const Marquee = () => {
    const marqueeItems = Array(10).fill('MORE ABOUT THE TRASH');
    
    return (
      <>
        <style>
            {`
            @keyframes scroll {
                0% {
                transform: translateX(0);
                }
                100% {
                transform: translateX(-50%);
                }
            }
            `}
        </style>
        <div className="marquee-container">
            <div className="marquee-content">
            {marqueeItems.map((text, index) => (
                <React.Fragment key={index}>
                <span className="marquee-text">{text}</span>
                <span className="separator">•</span>
                </React.Fragment>
            ))}
            
            {/* Duplicate for seamless loop */}
            {marqueeItems.map((text, index) => (
                <React.Fragment key={`duplicate-${index}`}>
                <span className="marquee-text">{text}</span>
                <span className="separator">•</span>
                </React.Fragment>
            ))}
            </div>
        </div>
        </> 
    )
}
export default Marquee;