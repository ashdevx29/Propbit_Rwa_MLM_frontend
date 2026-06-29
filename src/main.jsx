// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App.jsx'
// import { QueryClientProvider } from "@tanstack/react-query";
// import { queryClient } from "./api/queryClient.js";
// import './index.css'

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <QueryClientProvider client={queryClient}>
//       <App />
//     </QueryClientProvider>
//   </React.StrictMode>,
// )

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from 'react'
import App from './App.jsx'
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./api/queryClient.js";
import './index.css';
import "leaflet/dist/leaflet.css";
// import './indexPage.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
)