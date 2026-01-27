import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import Router from './Router.tsx'
import './index.css'
import 'leaflet/dist/leaflet.css';
import Message from './components/ui/Message.tsx'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient} >
      <BrowserRouter>
        <Router />
        <Message />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
