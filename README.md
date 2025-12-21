# BC Weather & Roads 🏔️🚗

A high-performance Progressive Web App (PWA) designed specifically for travelers and residents in British Columbia.

## 🚀 Troubleshooting GitHub Pages (Blank Screen Fix)

If you see a blank screen or 404 errors in the console (F12) after deploying to GitHub Pages, follow these steps. GitHub Pages is a "dumb" static host and needs explicit instructions to handle TypeScript files.

### 1. The "No-Build" Fast Fix
If you want to just upload files directly to GitHub and have them work:
- **Rename your files**: Rename `index.tsx` to `index.js` and `App.tsx` to `App.js`.
- **Update index.html**: Change the bottom script tag to `<script type="module" src="./index.js"></script>`.
- **Add Extensions to Imports**: Browsers running native modules **require** extensions. 
  - In `index.js`, use `import App from './App.js'`.
  - In `App.js`, use `import SettingsModal from './components/SettingsModal.js'`.
- **Check Case Sensitivity**: GitHub is case-sensitive. Ensure `App.js` isn't named `app.js` on your computer.

### 2. The Professional Fix (Recommended)
Use **Vite** to build your project. This is the industry standard for React apps.
1. Install [Node.js](https://nodejs.org/).
2. Run `npm create vite@latest my-weather-app -- --template react-ts` in a terminal.
3. Move these files into the `src` folder of that new project.
4. Run `npm run build`.
5. Upload the contents of the generated `dist` folder to your GitHub repository.

## 🌟 Key Features
- **Hyper-Local Weather**: Real-time conditions and 3-day forecasts for BC municipalities.
- **Highway Alerts**: Live DriveBC data for specific routes (Coquihalla, etc.).
- **Offline Capability**: Service Worker caching for mountain passes without cell signal.
- **Dynamic UI**: Theme colors change based on current weather conditions.

## 📱 Installation Instructions
- **Android**: Open URL in Chrome > ⋮ Menu > **Install App**.
- **iOS**: Open URL in Safari > Share Button > **Add to Home Screen**.

---
*Note: This application is a traveler's tool. Always check official signs and DriveBC for safety-critical decisions.*