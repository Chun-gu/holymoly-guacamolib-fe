import { createBrowserRouter } from 'react-router-dom'

import { Layout } from '@/components'
import { MainPage, TopicPage } from '@/pages'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <MainPage /> },
      { path: 'topics/:topicId', element: <TopicPage /> },
    ],
  },
])
