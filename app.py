import os
import io
import base64
import logging

import numpy as np
from PIL import Image

from flask import Flask, jsonify, request
from flask_cors import CORS

import tensorflow as tf
from tensorflow.keras.applications import DenseNet121
from tensorflow.keras.applications.densenet import preprocess_input
from tensorflow.keras.layers import GlobalAveragePooling2D, Dense, Dropout
from tensorflow.keras import Model

# ── Logging ──────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s'
)
log = logging.getLogger(__name__)

# ── Config ───────────────────────────────────────────────────────────────────
MODEL_PATH        = os.environ.get('MODEL_PATH', 'models/densenet121_best.keras')
IMG_SIZE          = (224, 224)
MAX_BYTES         = 10 * 1024 * 1024          # 10 MB
ALLOWED_MIMETYPES = {'image/jpeg', 'image/png', 'image/webp'}

# Class labels — order MUST match training: {'Glass':0, 'Metal':1, 'Others':2, 'Plastic':3}
CLASS_LABELS = ['Glass', 'Metal', 'Others', 'Plastic']

# ── App ───────────────────────────────────────────────────────────────────────
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}})

# ── Model — loaded once at startup ───────────────────────────────────────────
model = None

def _build_architecture() -> Model:
    """Rebuild DenseNet121 classifier — must match training notebook exactly."""
    base = DenseNet121(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
    base.trainable = False
    x = GlobalAveragePooling2D()(base.output)
    x = Dense(128, activation='relu')(x)
    x = Dropout(0.3)(x)
    out = Dense(4, activation='softmax')(x)
    return Model(inputs=base.input, outputs=out)

def load_model_once():
    global model
    if not os.path.exists(MODEL_PATH):
        log.error(f'Model file not found: {MODEL_PATH}')
        return
    try:
        # Rebuild architecture first, then load only the weights.
        # This bypasses .keras config parsing which fails on quantization_config.
        model = _build_architecture()
        model.load_weights(MODEL_PATH)
        log.info(f'Model loaded: {MODEL_PATH}')
        log.info(f'Input shape : {model.input_shape}')
        log.info(f'Output shape: {model.output_shape}')
    except Exception as exc:
        log.error(f'Failed to load model: {exc}')

load_model_once()

# ── Helpers ───────────────────────────────────────────────────────────────────
def decode_image(raw: bytes) -> np.ndarray:
    """Convert raw image bytes → DenseNet121-ready (1, 224, 224, 3) array."""
    img = Image.open(io.BytesIO(raw)).convert('RGB')
    img = img.resize(IMG_SIZE, Image.LANCZOS)
    arr = np.array(img, dtype=np.float32)           # (224, 224, 3)
    arr = np.expand_dims(arr, axis=0)               # (1, 224, 224, 3)
    arr = preprocess_input(arr)                     # DenseNet-specific normalization
    return arr

def read_request_image() -> tuple[bytes | None, str | None]:
    """
    Extract raw image bytes from the request.
    Supports multipart/form-data (field: 'file') and JSON body (field: 'image', base64).
    Returns (bytes, error_message). If error_message is not None, bytes is None.
    """
    if 'file' in request.files:
        f = request.files['file']
        if f.mimetype not in ALLOWED_MIMETYPES:
            return None, f'Unsupported file type: {f.mimetype}. Use JPEG or PNG.'
        raw = f.read()
        if len(raw) > MAX_BYTES:
            return None, 'File too large. Maximum size is 10 MB.'
        return raw, None

    if request.is_json:
        body = request.get_json(silent=True) or {}
        if 'image' not in body:
            return None, 'Missing "image" field in JSON body.'
        try:
            raw = base64.b64decode(body['image'])
        except Exception:
            return None, 'Invalid base64 encoding.'
        if len(raw) > MAX_BYTES:
            return None, 'Image too large. Maximum size is 10 MB.'
        return raw, None

    return None, 'Send the image as multipart/form-data (field: "file") or as base64 JSON (field: "image").'

# ── Routes ────────────────────────────────────────────────────────────────────
@app.route('/')
def home():
    return jsonify({
        'status': 'ok',
        'message': 'EcoScan AI Flask API is running.',
        'model_loaded': model is not None,
        'classes': CLASS_LABELS,
    })


@app.route('/api/v1/predict', methods=['POST'])
def predict():
    # 1 — model availability
    if model is None:
        log.error('Prediction requested but model is not loaded.')
        return jsonify({'error': 'Model is not loaded. Check server logs.'}), 503

    # 2 — extract image from request
    raw, err = read_request_image()
    if err:
        return jsonify({'error': err}), 400

    # 3 — decode & preprocess
    try:
        arr = decode_image(raw)
    except Exception as exc:
        log.warning(f'Image decoding failed: {exc}')
        return jsonify({'error': f'Could not process image: {str(exc)}'}), 422

    # 4 — inference
    try:
        probs = model.predict(arr, verbose=0)[0]   # shape: (4,)
    except Exception as exc:
        log.error(f'Inference error: {exc}')
        return jsonify({'error': f'Inference failed: {str(exc)}'}), 500

    # 5 — build response
    pred_idx    = int(np.argmax(probs))
    pred_class  = CLASS_LABELS[pred_idx]
    confidence  = round(float(probs[pred_idx]), 4)
    all_scores  = {label: round(float(score), 4) for label, score in zip(CLASS_LABELS, probs)}

    log.info(f'Prediction: {pred_class} ({confidence*100:.1f}%)')

    return jsonify({
        'class':      pred_class,
        'confidence': confidence,
        'all_scores': all_scores,
    })


@app.route('/api/v1/health', methods=['GET'])
def health():
    return jsonify({
        'status':       'ok' if model is not None else 'degraded',
        'model_loaded': model is not None,
        'model_path':   MODEL_PATH,
        'classes':      CLASS_LABELS,
        'input_size':   list(IMG_SIZE),
    })


# ── Entry point ───────────────────────────────────────────────────────────────
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
