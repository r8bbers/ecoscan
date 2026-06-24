import React from 'react';
import './Detect.css';
import { Camera, RefreshCw, Settings, Maximize2, Recycle } from 'lucide-react';

const recentScans = [
  { id: 1, name: 'EcoScan Bin', date: '24.05.25', confidence: '94%', icon: '🗑️' },
  { id: 2, name: 'Cardboard R. Bag', date: '22.05.25', confidence: '89%', icon: '📦' },
  { id: 3, name: 'Tissue Paper', date: '20.05.25', confidence: '76%', icon: '🧻' },
];

const Detect = () => {
  return (
    <section className="detect-section" id="detect">
      <div className="detect-wrapper">
        <div className="detect-header">
          <h2 className="detect-heading">Live AI Detection</h2>
          <p className="detect-subheading">Position item clearly within the frame for automated classification</p>
        </div>

        <div className="detect-container">
          {/* Left — Camera Feed */}
          <div className="camera-section">
            <div className="camera-feed">
              <div className="detection-box" />
              <Camera size={64} strokeWidth={1} className="camera-icon" />
              <p className="camera-label">Camera Preview</p>
            </div>
            <div className="camera-controls">
              <button className="ctrl-btn" aria-label="Flip camera"><RefreshCw size={18} /></button>
              <button className="ctrl-btn" aria-label="Settings"><Settings size={18} /></button>
              <button className="ctrl-btn" aria-label="Fullscreen"><Maximize2 size={18} /></button>
            </div>
            <button className="capture-btn">
              <Camera size={18} />
              Capture Image
            </button>
          </div>

          {/* Right — Detection Result */}
          <div className="result-panel">
            <div className="result-header">
              <span className="result-title">Detection Result</span>
              <span className="recyclable-badge"><Recycle size={13} /> RECYCLABLE</span>
            </div>

            <p className="result-label">CLASSIFICATION OUTPUT</p>
            <h3 className="result-class">PET Plastic</h3>
            <p className="result-confidence">Confidence: <strong>96.5%</strong></p>
            <p className="result-recommendation">
              Empty completely, remove cap, and rinse before placing in the Blue recycling bin.
            </p>

            <hr className="result-divider" />

            <div className="recent-scans-header">
              <span className="recent-title">Recent Scans</span>
              <a href="#scans" className="view-all-link">View All</a>
            </div>

            <ul className="recent-scans-list">
              {recentScans.map(scan => (
                <li key={scan.id} className="scan-item">
                  <span className="scan-icon">{scan.icon}</span>
                  <div className="scan-info">
                    <span className="scan-name">{scan.name}</span>
                    <span className="scan-date">{scan.date}</span>
                  </div>
                  <span className="scan-confidence">{scan.confidence}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Detect;