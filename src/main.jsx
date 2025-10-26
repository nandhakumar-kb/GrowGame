import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { register as registerServiceWorker, setupInstallPrompt } from './utils/pwaUtils'
registerServiceWorker();
setupInstallPrompt();
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
