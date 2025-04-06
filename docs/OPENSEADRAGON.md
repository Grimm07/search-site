Here’s a concise breakdown of the **OpenSeadragon capabilities** you can take advantage of when you revisit this:

---

## ✅ **OpenSeadragon Capabilities You Can Use**

### 1. **IIIF Manifest Support**
- Load multi-resolution images directly via a IIIF image service or manifest.
- Supports zoom levels and tiles automatically.
- Great for deep zoom and academic or archival data.

> `tileSources: 'https://.../manifest.json'`

---

### 2. **Image Overlays**
- Add **bounding boxes**, **highlights**, or even full DOM elements (e.g. tooltips, buttons) over the image.
- Supports:
    - `addOverlay()` — image-relative positioning
    - `removeOverlay()`, `updateOverlay()`
    - Mouse/tap interactivity

---

### 3. **Custom Zoom & Navigation Controls**
- Replace default controls with your own buttons/UI.
- Use:
    - `viewport.zoomBy(factor)`
    - `viewport.panTo(point)`
    - `viewport.goHome()`
- Enables zoom-to-fit, custom animation speeds, zoom locks, etc.

---

### 4. **Deep Zoom & Tiled Image Support**
- Ideal for gigapixel images or large scanned documents.
- Works with Deep Zoom Image (DZI) format and IIIF.
- Loads tiles on demand to save bandwidth and memory.

---

### 5. **Gesture Support**
- Full support for:
    - Scroll wheel zoom
    - Click/tap/double-click zoom
    - Pinch-to-zoom on touchscreens
    - Drag to pan

---

### 6. **Annotations & Regions**
- Add interactive annotations using overlays or external tools (e.g., Annotorious).
- Enable use cases like:
    - Field validation
    - Region-specific feedback
    - Searchable zones

---

### 7. **Viewer Events & Hooks**
- Hook into lifecycle:
    - `viewer.addHandler('open', ...)`
    - `viewer.addHandler('zoom', ...)`
    - `viewer.addHandler('tile-drawn', ...)`

Great for:
- Triggering overlays
- Analytics
- Auto-fit or reset logic

---

Let me know when you're ready to dive into implementation — I can scaffold a component with support for any of these (e.g., overlays with tooltips, IIIF loader with validation zones, etc.).