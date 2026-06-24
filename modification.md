# Project Modification Log — EcoScan AI

All changes are listed chronologically. Each entry records what was changed, which files were affected, and what was done.

---

## [Session 1] Frontend Redesign — Figma Implementation

**Date:** 2026-06-24
**Scope:** Frontend (React)

---

### 1. Rebranding — Trashify → EcoScan AI

**Files changed:**
- `frontend/index.html`
- `frontend/src/components/Navbar/Navbar.jsx`
- `frontend/src/components/Footer/Footer.jsx`

**What changed:**
- Page `<title>` updated from `Trashify` to `EcoScan AI`
- Navbar brand text changed from `Trashify.` to `EcoScan AI` with a green rounded icon
- Footer brand updated from `TRASHIFY` to `EcoScan AI` with a `Recycle` icon

---

### 2. Navbar — Full Redesign

**Files changed:**
- `frontend/src/components/Navbar/Navbar.jsx`
- `frontend/src/components/Navbar/Navbar.css`

**What changed:**
- Nav links updated: `Home | Detection | Information | About | Contact`
- Two icon buttons added on the right: `Wifi` (signal) + `UserCircle2` (account)
- Sticky scroll behavior retained; now uses `box-shadow` instead of background color on scroll
- CSS class renamed from `.container` / `.dark-nav` to `.navbar` / `.navbar-scrolled`
- `scroll` event listener now properly cleaned up with `removeEventListener`

---

### 3. Detection Section — Full Redesign

**Files changed:**
- `frontend/src/components/Detection/Detect.jsx`
- `frontend/src/components/Detection/Detect.css`

**What changed:**
- Added section heading: **"Live AI Detection"** with subtitle
- Left panel: camera feed area (dark background) with teal detection bounding box overlay, 3 camera control buttons (`RefreshCw`, `Settings`, `Maximize2`), and a **"Capture Image"** button
- Right panel: **Detection Result** card containing:
  - `RECYCLABLE` green badge
  - Classification name (`PET Plastic`)
  - Confidence score (`96.5%`)
  - Recommendation text
  - Divider
  - **Recent Scans** list (3 static placeholder items with icon, name, date, confidence badge)
- Color scheme: white background, green accent (`#3a7d52`), teal detection overlay (`#3ecf8e`)

---

### 4. Footer — Redesign

**Files changed:**
- `frontend/src/components/Footer/Footer.jsx`
- `frontend/src/components/Footer/Footer.css`

**What changed:**
- Removed social media icons (Instagram, LinkedIn, Twitter)
- Added tagline: `© 2024 EcoScan AI. High-tech clinical waste management.` (teal color)
- Footer links updated to: `Sustainability Goals | API Docs | Privacy Policy | Contact Support`
- Layout: left side has brand + tagline stacked; right side has nav links

---

### 5. About Section — Complete Rebuild as "System Architecture"

**Files changed:**
- `frontend/src/components/About/About.jsx`
- `frontend/src/components/About/About.css`

**What changed:**
- Replaced simple text block with a full technical documentation page
- **Hero**: "System Architecture" title + descriptive subtitle (centered)
- **End-to-End AI Workflow**: Section with 4-step horizontal pipeline card:
  `Image Capture → Preprocessing → CNN Classification → Results Output`
- **Python Flask Backend** card (teal header):
  - Description + 3 bullet feature points with `CheckCircle2` icons
  - Dark code block showing `@app.route('/api/v1/predict', ...)` snippet
- **Convolutional Neural Network** card (blue header):
  - Description + 2×2 metrics grid: Architecture, Inference Time, Validation Acc., Input Shape
  - 5 material color swatches
- **Dataset Topography**: 4-column material cards: Plastic (35%), Metal (25%), Glass (20%), Other (20%)

---

### 6. Information Section — New Component (replaces Cards + Marquee + Description)

**Files added:**
- `frontend/src/components/Information/Information.jsx` *(new)*
- `frontend/src/components/Information/Information.css` *(new)*

**Files affected:**
- `frontend/src/App.jsx` — removed `Cards`, `Marquee`, `Description`; added `Information`

**What changed:**
- `Cards.jsx`, `Marquee.jsx`, `Description.jsx` are no longer rendered (components retained on disk)
- New `Information` component built with:
  - **Hero**: "Waste Education Center" title + subtitle + pill-shaped search bar
  - **3-column material cards** (Plastic, Metal, Glass), each with:
    - Blob decoration in top-right corner
    - Icon + material name header
    - Description, Examples, Metrics (decomposition in orange, second metric), Disposal best practices
  - **Daily Sustainability Tips**: teal heading, divider, 2 tip cards:
    - "Audit Your Bin" (Coffee icon)
    - "The 'Clean Enough' Rule" (Droplets icon)
- Color scheme: teal (`#0d9488`), blue (`#3b5bdb`), orange for decomposition values (`#ea580c`), dark navy headings (`#0f1f44`)

---

### 7. App.jsx — Route/Component Order Update

**Files changed:**
- `frontend/src/App.jsx`

**New component render order:**
```
Navbar → Hero → Detect → Information → About → Footer
```

**Removed imports:** `Marquee`, `Cards`, `Description`
**Added import:** `Information`

---

## [Session 2] Backend Development — Flask API

**Date:** 2026-06-24
**Scope:** Backend (Python Flask)
**Source:** Training details extracted from `DenseNet121_final.ipynb`

---

### 8. Flask API — `/api/v1/predict` Endpoint

**Files changed:**
- `app.py` — full rewrite
- `requirements.txt` — created
- `models/` — directory created (model file to be placed here by user)

**Model details extracted from notebook:**

| Property | Value |
|---|---|
| Framework | TensorFlow / Keras |
| Architecture | DenseNet121 (frozen base) + GAP + Dense(128) + Dropout(0.3) + Dense(4, softmax) |
| Input size | 224 × 224 × 3 |
| Preprocessing | `tensorflow.keras.applications.densenet.preprocess_input` (NOT `rescale=1/255`) |
| Class labels | `['Glass', 'Metal', 'Others', 'Plastic']` (indices 0–3, alphabetical) |
| Model file | `densenet121_best.keras` (saved via `ModelCheckpoint`) |
| Val accuracy | 93.88% (best at epoch 14 of 22) |

**What was built in `app.py`:**
- Model loaded **once at startup** from `models/densenet121_best.keras`
- `POST /api/v1/predict` — accepts:
  - Multipart form (`field: file`) — JPEG / PNG / WebP, max 10 MB
  - JSON body (`field: image`) — base64-encoded string
- Returns: `{ class, confidence, all_scores }`
- `GET /api/v1/health` — returns model status, class list, input size
- `GET /` — basic ping/status
- CORS restricted to `localhost:5173` (React dev server)
- Full input validation: MIME type, file size, base64 decode check
- Structured JSON error responses with HTTP status codes
- `MODEL_PATH` overridable via `MODEL_PATH` environment variable

---

## Pending / TODO

- [ ] User downloads `densenet121_best.keras` from Google Drive → places in `models/`
- [ ] Install backend dependencies: `pip install -r requirements.txt`
- [ ] Wire React `Capture Image` button to `POST /api/v1/predict`
- [ ] Implement actual camera capture (`getUserMedia`) in `Detect.jsx`
- [ ] Replace static Recent Scans with real API response data
- [ ] End-to-end test: React (port 5173) + Flask (port 5000) running together
- [ ] Add remaining Figma screens: AI Model & Project Insights, EcoScan AI Dashboard, Educational Knowledge Center (blocked by Figma MCP rate limit)
