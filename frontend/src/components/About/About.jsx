import React from "react";
import './About.css';
import {
  Camera, Wand2, BrainCircuit, BarChart3,
  CheckCircle2, Trash2, Wrench, FlaskConical, Users
} from 'lucide-react';

const workflowSteps = [
  {
    icon: <Camera size={22} />,
    title: 'Image Capture',
    desc: 'High-resolution optical feed captures waste items on the sorting belt.',
  },
  {
    icon: <Wand2 size={22} />,
    title: 'Preprocessing',
    desc: 'Normalization, resizing (224x224), and noise reduction via OpenCV.',
  },
  {
    icon: <BrainCircuit size={22} />,
    title: 'CNN Classification',
    desc: 'Deep feature extraction mapping spatial hierarchies to predict material class.',
  },
  {
    icon: <BarChart3 size={22} />,
    title: 'Results Output',
    desc: 'JSON payload with confidence scores routed to dashboard & actuators.',
  },
];

const flaskFeatures = [
  'RESTful API endpoints for asynchronous image ingestion.',
  'Memory-efficient base64 decoding and tensor preparation.',
  'Integration with PostgreSQL for historical telemetry logging.',
];

const cnnMetrics = [
  { label: 'ARCHITECTURE', value: 'ResNet-50 v2' },
  { label: 'INFERENCE TIME', value: '~45ms' },
  { label: 'VALIDATION ACC.', value: '98.4%' },
  { label: 'INPUT SHAPE', value: '224x224x3' },
];

const swatchColors = ['#c8c8d4', '#9fa8da', '#90a4ae', '#4db6ac', '#e0e0e0'];

const datasets = [
  {
    icon: <Trash2 size={24} />,
    name: 'Plastic',
    vol: '35% Vol',
    desc: 'Syringes, IV bags, rigid containers, and flexible packaging.',
  },
  {
    icon: <Wrench size={24} />,
    name: 'Metal',
    vol: '25% Vol',
    desc: 'Scalpels, forceps, foil blister packs, and metallic instrument fragments.',
  },
  {
    icon: <FlaskConical size={24} />,
    name: 'Glass',
    vol: '20% Vol',
    desc: 'Ampoules, vials, slide glasses, and broken beaker fragments.',
  },
  {
    icon: <Users size={24} />,
    name: 'Other',
    vol: '20% Vol',
    desc: 'Textiles, paper products, organic matter, and complex multi-material items.',
  },
];

const About = () => {
  return (
    <section className="about-page" id="about">
      {/* ── Hero ── */}
      <div className="about-hero">
        <h1 className="about-hero-title">System Architecture</h1>
        <p className="about-hero-desc">
          Understanding the technical foundation of EcoScan AI. Our pipeline integrates a robust Python Flask
          backend with a customized Convolutional Neural Network (CNN) to deliver precise, real-time clinical waste
          classification.
        </p>
      </div>

      {/* ── Workflow ── */}
      <div className="about-block">
        <h2 className="section-heading">End-to-End AI Workflow</h2>
        <div className="workflow-card">
          {workflowSteps.map((step, i) => (
            <React.Fragment key={step.title}>
              <div className="workflow-step">
                <div className="workflow-icon">{step.icon}</div>
                <h4 className="workflow-title">{step.title}</h4>
                <p className="workflow-desc">{step.desc}</p>
              </div>
              {i < workflowSteps.length - 1 && (
                <div className="workflow-arrow">→</div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── Two columns ── */}
      <div className="tech-grid">
        {/* Flask */}
        <div className="tech-card">
          <h3 className="tech-title flask-title">
            <span className="tech-icon flask-icon">▣</span>
            Python Flask Backend
          </h3>
          <p className="tech-desc">
            The orchestration layer is built on a lightweight, high-performance Flask architecture.
            It serves as the bridge between the edge-device optical sensors and the inference engine.
          </p>
          <ul className="feature-list">
            {flaskFeatures.map(f => (
              <li key={f} className="feature-item">
                <CheckCircle2 size={16} className="check-icon" />
                {f}
              </li>
            ))}
          </ul>
          <pre className="code-block">
            <code>{`@app.route('/api/v1/predict', methods=['POST'])
def predict():
    tensor = preprocess(request.data)
    result = model.infer(tensor)
    return jsonify(result)`}</code>
          </pre>
        </div>

        {/* CNN */}
        <div className="tech-card">
          <h3 className="tech-title cnn-title">
            <span className="tech-icon cnn-icon">✦</span>
            Convolutional Neural Network
          </h3>
          <p className="tech-desc">
            Our proprietary model architecture is optimized for edge inference, balancing high accuracy
            with low latency. It utilizes transfer learning from a ResNet backbone, fine-tuned
            specifically for clinical and industrial waste profiles.
          </p>
          <div className="metrics-grid">
            {cnnMetrics.map(m => (
              <div key={m.label} className="metric-box">
                <span className="metric-label">{m.label}</span>
                <span className="metric-value">{m.value}</span>
              </div>
            ))}
          </div>
          <div className="swatches">
            {swatchColors.map((c, i) => (
              <span key={i} className="swatch" style={{ backgroundColor: c }} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Dataset ── */}
      <div className="about-block">
        <h2 className="section-heading">Dataset Topography</h2>
        <p className="dataset-intro">
          The model was trained on a proprietary dataset of over 100,000 augmented images, carefully balanced to
          ensure reliable performance across the primary material categories encountered in clinical waste streams.
        </p>
        <div className="dataset-grid">
          {datasets.map(d => (
            <div key={d.name} className="dataset-card">
              <div className="dataset-card-top">
                <span className="dataset-icon">{d.icon}</span>
                <span className="dataset-vol">{d.vol}</span>
              </div>
              <h4 className="dataset-name">{d.name}</h4>
              <p className="dataset-desc">{d.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
