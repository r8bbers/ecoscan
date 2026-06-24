import React, { useState } from 'react';
import './Information.css';
import { Search, Trash2, LayoutGrid, GlassWater, Coffee, Droplets } from 'lucide-react';

const materials = [
  {
    id: 'plastic',
    icon: <Trash2 size={20} />,
    iconBg: '#ccf5ef',
    iconColor: '#0d9488',
    blobColor: '#d0f5ee',
    title: 'Plastic',
    desc: 'Synthetic materials primarily derived from petrochemicals. Highly durable but environmentally persistent.',
    examples: 'PET Bottles, Food Wrappers, Straws',
    metrics: [
      { label: 'DECOMPOSITION', value: '20-500 Years', orange: true },
      { label: 'IMPACT', value: 'Microplastics', orange: false },
    ],
    disposal: 'Rinse containers before recycling. Do not bag recyclables. Check local guidelines for accepted numbers (#1 and #2 are most common).',
  },
  {
    id: 'metal',
    icon: <LayoutGrid size={20} />,
    iconBg: '#dde8ff',
    iconColor: '#3b5bdb',
    blobColor: '#dde8ff',
    title: 'Metal',
    desc: 'Highly recyclable materials that can often be repurposed infinitely without loss of quality.',
    examples: 'Aluminum Cans, Steel Tins, Foil',
    metrics: [
      { label: 'DECOMPOSITION', value: '50-200 Years', orange: true },
      { label: 'RECYCLABILITY', value: 'Nearly 100%', orange: false },
    ],
    disposal: 'Empty and lightly rinse. Crush aluminum cans to save space if permitted. Ball clean aluminum foil into a larger sphere before recycling.',
  },
  {
    id: 'glass',
    icon: <GlassWater size={20} />,
    iconBg: '#ccf5ef',
    iconColor: '#0d9488',
    blobColor: '#d0f5ee',
    title: 'Glass',
    desc: 'An inert material made primarily from sand. It is 100% recyclable and can be recycled endlessly.',
    examples: 'Beverage Bottles, Food Jars',
    metrics: [
      { label: 'DECOMPOSITION', value: '1 Million+ Yrs', orange: true },
      { label: 'ENERGY SAVED', value: 'High', orange: false },
    ],
    disposal: 'Sort by color if required locally. Remove metal or plastic lids. Do not mix with ceramics, Pyrex, or window glass, which have different melting points.',
  },
];

const tips = [
  {
    icon: <Coffee size={22} />,
    title: 'Audit Your Bin',
    desc: 'Take 5 minutes before taking out the trash to check for misplaced recyclables. Small daily corrections build lasting habits.',
  },
  {
    icon: <Droplets size={22} />,
    title: "The 'Clean Enough' Rule",
    desc: "Recyclables don't need to be dish-washer clean. A quick rinse to remove food residue is usually sufficient to prevent contamination.",
  },
];

const Information = () => {
  const [query, setQuery] = useState('');

  return (
    <section className="info-page" id="info">
      {/* ── Hero ── */}
      <div className="info-hero">
        <h1 className="info-title">Waste Education Center</h1>
        <p className="info-subtitle">
          Explore detailed information on different waste categories to improve your recycling
          accuracy and understand your environmental impact.
        </p>
        <div className="info-search-bar">
          <Search size={17} className="info-search-icon" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search specific materials (e.g., PET bottle, aluminum can)..."
            className="info-search-input"
          />
        </div>
      </div>

      {/* ── Material Cards ── */}
      <div className="material-grid">
        {materials.map(m => (
          <div key={m.id} className="material-card">
            {/* Blob decoration */}
            <div className="material-blob" style={{ background: m.blobColor }} />

            {/* Header row */}
            <div className="material-header">
              <span
                className="material-icon"
                style={{ background: m.iconBg, color: m.iconColor }}
              >
                {m.icon}
              </span>
              <h3 className="material-name">{m.title}</h3>
            </div>

            <p className="material-desc">{m.desc}</p>

            <p className="info-meta-label">EXAMPLES</p>
            <p className="info-meta-value">{m.examples}</p>

            <div className="info-metrics-row">
              {m.metrics.map(mt => (
                <div key={mt.label} className="info-metric-box">
                  <span className="info-metric-label">{mt.label}</span>
                  <span className={`info-metric-value ${mt.orange ? 'metric-orange' : ''}`}>
                    {mt.value}
                  </span>
                </div>
              ))}
            </div>

            <p className="info-meta-label">DISPOSAL BEST PRACTICES</p>
            <p className="material-disposal">{m.disposal}</p>
          </div>
        ))}
      </div>

      {/* ── Daily Sustainability Tips ── */}
      <div className="tips-section">
        <h2 className="tips-heading">Daily Sustainability Tips</h2>
        <hr className="tips-divider" />
        <div className="tips-grid">
          {tips.map(tip => (
            <div key={tip.title} className="tip-card">
              <span className="tip-icon">{tip.icon}</span>
              <h4 className="tip-title">{tip.title}</h4>
              <p className="tip-desc">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Information;
