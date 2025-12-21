# BC Weather & Roads 🏔️🚗

A high-performance Progressive Web App (PWA) designed specifically for travelers and residents in British Columbia. This app provides a unified view of weather conditions and real-time highway alerts to help you navigate BC's unique geography and changing climate.

## 🚀 Quick Start: Deploy to GitHub Pages

The easiest way to get this app on your phone is via GitHub Pages:

1.  **Create a Repository**: Create a new public repository on GitHub (e.g., `bc-weather`).
2.  **Upload Files**: Upload all files in this project to the `main` branch.
3.  **Enable Pages**: 
    - Go to **Settings** > **Pages**.
    - Under **Build and deployment** > **Source**, select "Deploy from a branch".
    - Select the `main` branch and `/ (root)` folder. Click **Save**.
4.  **Access & Install**: After ~2 minutes, your site will be live at `https://<username>.github.io/bc-weather/`. Open this link on your phone to install it as a PWA!

## 🌟 Key Features

- **Hyper-Local Weather**: Real-time conditions and 3-day forecasts for major BC municipalities.
- **Highway Alerts (Live 511)**: Real-time DriveBC data for specific highways.
- **Offline Mode**: Uses Service Workers to cache data for when you're in mountain dead-zones.
- **Visual Context**: UI colors shift dynamically based on weather conditions.

## 📱 Installation Instructions

### Android (Chrome)
1. Navigate to your GitHub Pages URL.
2. Tap the three dots (⋮) in the top right.
3. Select **"Install app"** or **"Add to Home Screen"**.

### iOS (Safari)
1. Navigate to your GitHub Pages URL.
2. Tap the **Share** button (📤) at the bottom.
3. Scroll down and tap **"Add to Home Screen"**.

## 🛠️ Technical Stack

- **Framework**: [React](https://react.dev/) (v19) via ESM modules.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/).
- **Data Sources**: [Open-Meteo](https://open-meteo.com/) and [BC Government Open511](https://open511.gov.bc.ca/).

---

*Note: This application is a traveler's tool. Always check official sources like DriveBC and Environment Canada for safety-critical decisions during extreme weather events.*