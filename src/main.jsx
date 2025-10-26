import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { register as registerServiceWorker, setupInstallPrompt } from './utils/pwaUtils'

// Only register service worker in production
if (import.meta.env.PROD) {
  registerServiceWorker();
  setupInstallPrompt();
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
