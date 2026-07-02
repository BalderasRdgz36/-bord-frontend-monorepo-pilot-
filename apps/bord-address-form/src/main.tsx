import React from 'react';

import { RouterProvider } from '@tanstack/react-router';
import ReactDOM from 'react-dom/client';

import { getRouter } from './router';

const router = getRouter();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
