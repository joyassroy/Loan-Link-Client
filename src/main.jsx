import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router-dom";
import router from "./routes/router";

// 1. Import Providers
import AuthProvider from './providers/AuthProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// 2. Create Query Client
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     {/* 3. Wrap everything with AuthProvider */}
     <AuthProvider>
        {/* 4. Wrap with QueryClientProvider for TanStack Query */}
        <QueryClientProvider client={queryClient}>
          
          {/* 5. The Router */}
          <RouterProvider router={router} />
          
          {/* 6. Toast Notification Container */}
          <Toaster />
          
        </QueryClientProvider>
     </AuthProvider>
  </React.StrictMode>,
)