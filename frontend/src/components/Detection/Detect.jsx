import React, { useRef, useState, useEffect, useCallback } from 'react';
import './Detect.css';
import { Camera, RefreshCw, Maximize2, Recycle, Trash2, AlertCircle, Loader2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

const CLASS_META = {
  Glass: {
    displayName: 'Glass',
    recyclable: true,
    icon: '🫙',
    recommendation: 'Sort by color if required locally. Remove metal or plastic lids before placing in the recycling bin.',
  },
  Metal: {
    displayName: 'Metal',
    recyclable: true,
    icon: '🥫',
    recommendation: 'Empty and lightly rinse. Crush cans to save space if permitted. Ball foil into a sphere before recycling.',
  },
  Others: {
    displayName: 'Other Waste',
    recyclable: false,
    icon: '🗑️',
    recommendation: 'This item may not be recyclable. Check local waste guidelines for proper disposal options.',
  },
  Plastic: {
    displayName: 'Plastic',
    recyclable: true,
    icon: '♻️',
    recommendation: 'Rinse containers before recycling. Check accepted resin codes — #1 (PET) and #2 (HDPE) are most common.',
  },
};

const formatDate = () => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getFullYear()).slice(2)}`;
};

const Detect = () => {
  const videoRef   = useRef(null);
  const canvasRef  = useRef(null);
  const streamRef  = useRef(null);

  const [cameraOn,    setCameraOn]    = useState(false);
  const [facingMode,  setFacingMode]  = useState('environment');
  const [loading,     setLoading]     = useState(false);
  const [camError,    setCamError]    = useState(null);
  const [result,      setResult]      = useState(null);   // { class, confidence, all_scores }
  const [apiError,    setApiError]    = useState(null);
  const [recentScans, setRecentScans] = useState([]);

  // ── Start camera ──────────────────────────────────────────────────────────
  const startCamera = useCallback(async (facing = facingMode) => {
    setCamError(null);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraOn(true);
    } catch (err) {
      setCamError('Camera access denied or not available. Please allow camera permissions.');
      setCameraOn(false);
    }
  }, [facingMode]);

  // ── Stop camera ───────────────────────────────────────────────────────────
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraOn(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => () => stopCamera(), [stopCamera]);

  // ── Flip camera ───────────────────────────────────────────────────────────
  const flipCamera = () => {
    const next = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(next);
    if (cameraOn) startCamera(next);
  };

  // ── Capture & predict ─────────────────────────────────────────────────────
  const captureAndPredict = async () => {
    if (!videoRef.current || !cameraOn) return;

    const video  = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width  = video.videoWidth  || 224;
    canvas.height = video.videoHeight || 224;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      setLoading(true);
      setApiError(null);
      setResult(null);

      try {
        const body = new FormData();
        body.append('file', blob, 'capture.jpg');

        const res  = await fetch(`${API_URL}/api/v1/predict`, { method: 'POST', body });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Prediction failed');

        setResult(data);

        // Prepend to recent scans, keep last 3
        setRecentScans(prev => [
          {
            id:         Date.now(),
            className:  data.class,
            confidence: `${(data.confidence * 100).toFixed(0)}%`,
            date:       formatDate(),
            icon:       CLASS_META[data.class]?.icon ?? '🗑️',
          },
          ...prev,
        ].slice(0, 3));

      } catch (err) {
        setApiError(err.message || 'Could not reach the prediction server.');
      } finally {
        setLoading(false);
      }
    }, 'image/jpeg', 0.9);
  };

  // ── Derived display values ────────────────────────────────────────────────
  const meta       = result ? CLASS_META[result.class] : null;
  const confidence = result ? (result.confidence * 100).toFixed(1) : null;

  return (
    <section className="detect-section" id="detect">
      <div className="detect-wrapper">
        <div className="detect-header">
          <h2 className="detect-heading">Live AI Detection</h2>
          <p className="detect-subheading">Position item clearly within the frame for automated classification</p>
        </div>

        <div className="detect-container">

          {/* ── Left — Camera ── */}
          <div className="camera-section">
            <div className="camera-feed">
              {/* Live video */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`camera-video ${cameraOn ? 'visible' : ''}`}
              />

              {/* Placeholder when camera is off */}
              {!cameraOn && (
                <div className="camera-placeholder-inner">
                  {camError
                    ? <><AlertCircle size={48} className="cam-error-icon" /><p className="camera-label">{camError}</p></>
                    : <><Camera size={64} strokeWidth={1} className="camera-icon" /><p className="camera-label">Click "Start Camera" to begin</p></>
                  }
                </div>
              )}

              {/* Detection overlay box */}
              {cameraOn && <div className="detection-box" />}

              {/* Loading spinner overlay */}
              {loading && (
                <div className="loading-overlay">
                  <Loader2 size={40} className="spinner" />
                  <p>Analysing…</p>
                </div>
              )}

              {/* Hidden canvas for frame capture */}
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>

            {/* Controls */}
            <div className="camera-controls">
              <button className="ctrl-btn" aria-label="Flip camera" onClick={flipCamera} disabled={!cameraOn}>
                <RefreshCw size={18} />
              </button>
              <button
                className={`ctrl-btn ctrl-btn-toggle ${cameraOn ? 'active' : ''}`}
                aria-label="Toggle camera"
                onClick={cameraOn ? stopCamera : () => startCamera()}
              >
                <Camera size={18} />
              </button>
              <button className="ctrl-btn" aria-label="Fullscreen" onClick={() => videoRef.current?.requestFullscreen()} disabled={!cameraOn}>
                <Maximize2 size={18} />
              </button>
            </div>

            <button
              className="capture-btn"
              onClick={captureAndPredict}
              disabled={!cameraOn || loading}
            >
              {loading
                ? <><Loader2 size={18} className="spinner-sm" /> Analysing…</>
                : <><Camera size={18} /> Capture Image</>
              }
            </button>
          </div>

          {/* ── Right — Result panel ── */}
          <div className="result-panel">
            <div className="result-header">
              <span className="result-title">Detection Result</span>
              {result && (
                <span className={`recyclable-badge ${meta?.recyclable ? '' : 'non-recyclable-badge'}`}>
                  {meta?.recyclable
                    ? <><Recycle size={13} /> RECYCLABLE</>
                    : <><Trash2  size={13} /> NON-RECYCLABLE</>
                  }
                </span>
              )}
            </div>

            {/* Result or idle state */}
            {result ? (
              <>
                <p className="result-label">CLASSIFICATION OUTPUT</p>
                <h3 className="result-class">{meta?.displayName ?? result.class}</h3>
                <p className="result-confidence">
                  Confidence: <strong>{confidence}%</strong>
                </p>
                <p className="result-recommendation">{meta?.recommendation}</p>

                {/* All scores */}
                <div className="all-scores">
                  {Object.entries(result.all_scores).map(([label, score]) => (
                    <div key={label} className="score-row">
                      <span className="score-label">{label}</span>
                      <div className="score-bar-track">
                        <div className="score-bar-fill" style={{ width: `${(score * 100).toFixed(0)}%` }} />
                      </div>
                      <span className="score-pct">{(score * 100).toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="idle-state">
                {apiError
                  ? <><AlertCircle size={32} className="idle-error-icon" /><p>{apiError}</p></>
                  : <><Camera size={32} className="idle-camera-icon" /><p>Start the camera and capture an image to see results.</p></>
                }
              </div>
            )}

            <hr className="result-divider" />

            {/* Recent Scans */}
            <div className="recent-scans-header">
              <span className="recent-title">Recent Scans</span>
            </div>

            {recentScans.length === 0 ? (
              <p className="no-scans">No scans yet — results will appear here.</p>
            ) : (
              <ul className="recent-scans-list">
                {recentScans.map(scan => (
                  <li key={scan.id} className="scan-item">
                    <span className="scan-icon">{scan.icon}</span>
                    <div className="scan-info">
                      <span className="scan-name">{scan.className}</span>
                      <span className="scan-date">{scan.date}</span>
                    </div>
                    <span className="scan-confidence">{scan.confidence}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Detect;
