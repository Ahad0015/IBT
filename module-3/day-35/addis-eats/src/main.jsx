import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './auth/AuthProvider'
import { ThemeProvider } from './theme/ThemeContext'
import { ToastProvider } from './ui/Toast'

import './home/home.css'
import './menu/menu.css'
import './cart/cart.css'
import './checkout/checkout.css'
import './orders/orders.css'
import './auth/auth.css'
import './admin/admin.css'

// Provider order: theme and toasts are needed everywhere, auth guards the customer routes.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>,
)
