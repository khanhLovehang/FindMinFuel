import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import './index.css'
// import App from './App.tsx'
// import CrudDashboard from '../crud-dashboard/CrudDashboard.tsx'
import MapDashboard from '../crud-dashboard/MapDashboard.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MapDashboard />
  </StrictMode>,
)
