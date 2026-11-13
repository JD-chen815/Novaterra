export default {
  "name": "india",
  "title": "THE PINK CITY",
  "subtitle": "Jaipur \u00b7 Streets of Color",
  "seed": 20261113,
  "terrain": {
    "width": 68,
    "depth": 52,
    "thickness": 3,
    "surface": "plaza",
    "relief": 0
  },
  "camera": {
    "position": [
      39,
      46,
      72
    ],
    "target": [
      0,
      3.6,
      -1
    ],
    "viewHeight": 65,
    "minZoom": 0.6,
    "maxZoom": 3.1,
    "minPolarAngle": 0.18,
    "maxPolarAngle": 1.28,
    "autoRotate": true,
    "autoRotateSpeed": 0.045
  },
  "weather": {
    "preset": "clear",
    "wind": 0.25,
    "rainCount": 0
  },
  "lighting": {
    "night": false,
    "time": "sunset",
    "windowLitRate": 0.72,
    "bloom": 0.17,
    "exposure": 1.05,
    "dayBackground": "#cbd7d3",
    "nightBackground": "#172a3d",
    "sunsetBackground": "#c9c7ba"
  },
  "visual": {
    "palette": {},
    "fontFamily": "\"Noto Devanagari\",Arial,sans-serif",
    "outlineOpacity": 0.17,
    "pixelRatio": 1.5,
    "shadows": true
  },
  "people": {
    "count": 28,
    "economyCount": 16,
    "speedScale": 0.85
  },
  "traffic": {
    "count": 7,
    "modelScale": 1,
    "speedScale": 0.8,
    "signals": true,
    "signalPlan": [
      [
        "LOOP",
        15
      ],
      [
        "LOOP_AMBER",
        2
      ],
      [
        "LOOP_CLEAR",
        1.5
      ],
      [
        "PED",
        5
      ],
      [
        "PED_CLEAR",
        1.5
      ]
    ],
    "labels": {
      "bus": "JAIPUR",
      "route": "02",
      "delivery": "DELIVERY"
    }
  }
};
