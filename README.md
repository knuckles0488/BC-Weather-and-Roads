# BC Weather & Roads 🏔️🚗

A specialized Progressive Web App (PWA) built for British Columbia travelers. It combines hyper-local weather forecasting with real-time highway incident data from DriveBC (Open511).

## 🌟 Key Features
- **3-Day Detailed Forecasts**: View morning, afternoon, and evening conditions for major BC municipalities.
- **Live Highway Alerts**: Real-time integration with Open511 for closures, incidents, and road conditions on major routes like the Coquihalla (Hwy 5) and Sea-to-Sky (Hwy 99).
- **Dynamic Theming**: The UI background and gradients shift automatically based on the current weather (Sunny, Snowing, Stormy, etc.).
- **Smart Notifications**: Automatic alerts for road closures on your tracked highways.
- **Mobile First**: Designed to feel like a native Android/iOS app with smooth transitions and a "glassmorphism" aesthetic.

## 🛠️ Tech Stack
- **React 19**: Using the latest features and ESM modules.
- **Tailwind CSS**: For high-performance, utility-first styling.
- **Lucide React**: Beautiful, consistent iconography.
- **Open-Meteo API**: Professional-grade weather data.
- **BC Open511 API**: Official highway events from the Ministry of Transportation and Infrastructure.
- **Babel Standalone**: Used for on-the-fly TSX compilation (Zero-build architecture).

## 🚦 Getting Started
Simply open `index.html` in a local web server (like VS Code Live Server) or deploy to a static host.

---

## 🚀 How to Deploy to Vercel (via GitHub)

Vercel is the recommended hosting platform for this app because it handles SSL and high-speed delivery automatically.

### Step 1: Push your code to GitHub
1. Create a new repository on [GitHub](https://github.com/new).
2. Upload all the files in this project to the `main` branch.
   *   *Note: Ensure `.nojekyll` is included if you ever switch to GitHub Pages, though Vercel doesn't need it.*

### Step 2: Connect to Vercel
1. Go to [Vercel.com](https://vercel.com) and sign in with your GitHub account.
2. Click **"Add New..."** > **"Project"**.
3. Find your `BC-Weather-and-Roads` repository in the list and click **"Import"**.
4. **Important Framework Preset**: In the "Build and Output Settings", Vercel might try to detect a framework. Since we are using a "no-build" setup:
   - Ensure **Framework Preset** is set to **"Other"**.
   - Keep the Build Command and Output Directory **empty**.
5. Click **"Deploy"**.

### Step 3: Access your App
Vercel will provide you with a URL (e.g., `bc-weather-roads.vercel.app`). 
- Open this on your Android/iOS device.
- Select "Add to Home Screen" to install it as a PWA!

---
*Disclaimer: This app is a tool for situational awareness. Always consult official DriveBC signs and local authorities for safety-critical travel decisions.*