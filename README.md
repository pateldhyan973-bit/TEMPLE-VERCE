<div align="center">

# 🛕 TempleVerse

### AI-Powered Pilgrim Crowd Management System

A smart crowd-monitoring and temple-management platform designed to improve pilgrim safety, manage visitor flow, and support faster operational decisions through real-time dashboards, predictive insights, and emergency coordination.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Website-orange?style=for-the-badge)](https://crowd-rgbr.vercel.app/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)

</div>

---

## 📌 Overview

TempleVerse is a full-stack crowd-management solution focused on large temples, religious gatherings, and high-footfall events. It brings crowd information and operational controls together in a centralized dashboard.

The platform is designed to help administrators and security teams:

- Monitor crowd levels across different temple zones.
- View crowd-density heatmaps and camera-network status.
- Track detection events and potential crowd anomalies.
- Review short-term crowd forecasts and risk indicators.
- Manage entry gates and visitor movement.
- Coordinate emergency and evacuation procedures.
- Support pilgrims with virtual queue passes and time-slot booking.
- Review footfall and operational analytics.
- Manage notifications across supported communication channels.

> **Project note:** The repository includes a real-time simulation/state engine and API endpoints for the monitoring experience. AI detection and prediction figures should be treated as application outputs or simulated metrics unless connected to and validated against actual deployed camera and machine-learning services.

## ✨ Key Features

### 1. Crowd Monitoring Dashboard
- Centralized overview of pilgrim count and gate status.
- Zone-wise crowd-density information.
- Real-time dashboard updates through WebSockets.

### 2. Crowd Heatmap
- Visual representation of crowd density across temple zones.
- Helps operators identify high-density areas.
- Supports quicker crowd-flow decisions.

### 3. Camera & Detection Monitoring
- Camera-node status, FPS, latency, and count information.
- Detection-event feed for monitoring activity.
- Anomaly-event visibility for operational awareness.

### 4. Crowd Prediction & Risk Insights
- Forecast endpoint for short-term crowd-surge predictions.
- Risk scores to help operators plan ahead.
- Designed around an LSTM-based prediction workflow.

### 5. Smart Gate & Route Management
- View gate and route status.
- Open or close gates through operator controls.
- Support controlled diversion of visitor movement.

### 6. Emergency Management
- View emergency-protocol status.
- Trigger an evacuation sequence.
- Reset the emergency protocol after the situation is resolved.

### 7. Virtual Queue & Entry Passes
- View registered virtual queue passes.
- Book visitor entry time slots.
- Help distribute visitor arrivals across time periods.

### 8. Analytics
- Daily footfall summary.
- Peak-hour information.
- AI/system performance metrics exposed by the application.

### 9. Notification Management
- Notification templates and delivery logs.
- Send individual or broadcast notifications.
- Preference settings for SMS, email, push, and WhatsApp channels.
- Language preferences and quiet-hour settings.

---

## 🧰 Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS 4 |
| Backend | Node.js, Express 5, TypeScript |
| Real-time communication | WebSocket (`ws`) |
| UI and visualization | Recharts, Three.js, React Three Fiber, React Three Drei |
| Data / services | Firebase |
| Validation | Zod |
| Internationalization | i18next, react-i18next |
| PDF generation | jsPDF, jsPDF AutoTable |
| Build tools | Vite, TypeScript, TSX |

---

## 🏗️ System Architecture

```text
              ┌──────────────────────────────┐
              │       React Dashboard        │
              │     React + TypeScript       │
              └──────────────┬───────────────┘
                             │
                 REST API    │    WebSocket
                 /api/*      │    /ws/live
                             │
              ┌──────────────▼───────────────┐
              │       Express Server         │
              │       Node.js + TS            │
              └──────────────┬───────────────┘
                             │
              ┌──────────────▼───────────────┐
              │   Simulation / State Engine  │
              │ Crowd, gates, cameras,       │
              │ heatmaps and emergency data │
              └──────────────────────────────┘
```

The frontend communicates with the backend through REST APIs for application operations and a WebSocket connection for live updates.

---

## 📂 Project Structure

```text
TEMPLE-VERCE/
│
├── public/
│   └── assets/              # Public assets
│
├── src/                     # React frontend application
│   ├── components/          # Reusable UI components
│   ├── pages/               # Application pages
│   └── ...                  # App entry points, styles and utilities
│
├── server/                  # Express backend
│   ├── routes/              # API route modules
│   └── ...                  # Server and simulation logic
│
├── .figma/
├── index.html
├── package.json
├── package-lock.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

Install the following before running the project:

- [Node.js](https://nodejs.org/) (Node.js 22 is recommended by the deployment configuration)
- npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/pateldhyan973-bit/TEMPLE-VERCE.git
```

### 2. Open the project folder

```bash
cd TEMPLE-VERCE
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the backend

Open a terminal and run:

```bash
npm run server
```

The backend uses port `5000` by default, subject to the server configuration and environment.

### 5. Start the frontend

Open a second terminal in the project folder:

```bash
npm run dev
```

Open the local URL printed by Vite in your terminal. The configured development port may vary.

### 6. Build for production

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

To run the unified server after building:

```bash
npm start
```

---

## 🔌 API Overview

The backend exposes REST endpoints for the main application modules.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Server health and version |
| GET | `/api/overview` | Crowd overview and gate status |
| GET | `/api/crowd/zones` | Zone-wise crowd information |
| GET | `/api/crowd/heatmap` | Crowd heatmap data |
| GET | `/api/detection/cameras` | Camera-node status |
| GET | `/api/detection/events` | Detection and anomaly events |
| GET | `/api/prediction/forecast` | Crowd forecast and risk scores |
| GET | `/api/routes/gates` | Gate and route status |
| POST | `/api/routes/toggle-gate` | Change gate state |
| GET | `/api/emergency/status` | Emergency protocol status |
| POST | `/api/emergency/trigger` | Trigger emergency procedure |
| POST | `/api/emergency/reset` | Reset emergency procedure |
| GET | `/api/analytics/summary` | Analytics summary |
| GET | `/api/virtual-queue/passes` | List virtual queue passes |
| POST | `/api/virtual-queue/book` | Book a virtual entry slot |
| WS | `/ws/live` | Real-time update stream |

Additional notification endpoints are available under `/api/notifications`. Refer to the backend route implementation for request bodies, authentication requirements, and response formats.

---

## 🌐 Live Demo

Explore the deployed application:

**[TempleVerse Live Demo](https://crowd-rgbr.vercel.app/)**

**GitHub Repository:**  
[https://github.com/pateldhyan973-bit/TEMPLE-VERCE](https://github.com/pateldhyan973-bit/TEMPLE-VERCE)

---

## 🔮 Future Scope

- Integration with real CCTV streams and edge-based person detection.
- Validation and deployment of trained crowd-prediction models.
- Improved crowd-flow optimization using historical and live data.
- Integration with verified SMS, email, push, and WhatsApp providers.
- Multilingual pilgrim-facing assistance.
- Stronger role-based access control and audit logging.
- Load testing and reliability improvements for large events.

---

## 🤝 Contributing

Contributions, suggestions, and bug reports are welcome.

1. Fork the repository.
2. Create a feature branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Commit your changes:

   ```bash
   git commit -m "Add: your feature description"
   ```

4. Push the branch:

   ```bash
   git push origin feature/your-feature-name
   ```

5. Open a Pull Request.

---

## 👨‍💻 Author

**Dhyan Patel**

- GitHub: [@pateldhyan973-bit](https://github.com/pateldhyan973-bit)

---

## 📄 License

No license file is currently specified in this repository. Unless a license is added, standard copyright restrictions apply to reuse and redistribution.

---

<div align="center">

**Built to make large-scale pilgrim movement safer, smarter, and more organized. 🛕**

</div>
