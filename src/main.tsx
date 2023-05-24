import React from 'react'

import ReactDOM from 'react-dom/client'

import { RouterProvider } from 'react-router-dom'

import { router } from './router.tsx'
import './index.css'

if (import.meta.env.DEV) {
  const { worker } = await import('@/mocks/browser')
  worker.start()
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
