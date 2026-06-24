import React from 'react';
import './Description.css';

const Description = () => {
  return (
    <section className="description-section">
      <div className="description-container">
        {/* Left Column - Academic Background */}
        <div className="description-column">
          <h2 className="description-title">Academic Background</h2>
          <p className="description-text">
            This website is developed as a final project for a bachelor's degree, 
            focusing on the application of artificial intelligence in environmental 
            problem solving. The project explores how computer vision can be used 
            to automatically classify waste and support more accurate recycling 
            practices.
          </p>
        </div>

        {/* Right Column - Model Development */}
        <div className="description-column">
          <h2 className="description-title">Model Development & Evaluation</h2>
          <p className="description-text">
            The system performs waste classification into four categories: plastic, 
            glass, metal, and others. Several Convolutional Neural Network (CNN) 
            architectures—VGG16, MobileNetV2, and DenseNet121—are evaluated 
            and compared. The model with the best performance is selected and 
            deployed on this website to detect waste images uploaded by users.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Description;