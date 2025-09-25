# CEC Portal (ready-to-run)

This folder is a minimal Vite + React project for the **Community Energy Compass** portal.
It uses **Tailwind via CDN** so you don't need to install Tailwind locally.

## Run (dev)

```bash
cd cec-portal
npm install
npm run dev
```

Open the printed URL (usually http://localhost:5173), then pass your app URLs:

```
http://localhost:5173/?explore=http://localhost:8501/explore&tradeoffs=http://localhost:8502/tradeoffs&blender=http://localhost:8503/blender&dev=1
```

- `&dev=1` shows a config tester at the bottom.
- Each tile has **Open in-page** (iframe) and **New tab**.

## Build (static)

```bash
npm run build
npm run preview
```

## Configure without query params (optional)

Edit `index.html` and set:

```html
<script>
  window.CEC_APPS = {
    explore: "http://localhost:8501/explore",
    tradeoffs: "http://localhost:8502/tradeoffs",
    blender: "http://localhost:8503/blender",
  };
  // window.CEC_HERO_IMG = "https://your-host/Conceptual_framework.png";
</script>
```

## Notes

- The code guards `process.env` so it won't crash in the browser.
- If iframes refuse to load, start each Streamlit app with:
  `--server.enableCORS=false --server.enableXsrfProtection=false --server.baseUrlPath=/...`
