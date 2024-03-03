import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { UserSessionProvider } from './Context/Context.jsx'
import { HelmetProvider } from './Components/Helmet/Helmet.jsx'

const queryClient = new QueryClient();


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserSessionProvider>
        <QueryClientProvider client={queryClient}>
          <HelmetProvider/>
          <App />
        </QueryClientProvider>
      </UserSessionProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
