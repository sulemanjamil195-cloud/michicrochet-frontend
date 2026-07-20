import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            fontFamily: "'DM Sans', sans-serif",
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#5A7355', secondary: '#fff' } },
          error: { iconTheme: { primary: '#D95F7A', secondary: '#fff' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)
