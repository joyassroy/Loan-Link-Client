import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router-dom";
import router from "./routes/router";

// 1. Import Providers
import AuthProvider from './providers/AuthProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// 🚀 2. GLOBAL THEME INITIALIZER (Reload Fix)
// রিয়্যাক্ট লোড হওয়ার আগেই ব্রাউজারের থিম সেট করে দেবে
const savedTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", savedTheme);

// 3. Create Query Client
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     {/* Wrap everything with AuthProvider */}
     <AuthProvider>
        {/* Wrap with QueryClientProvider for TanStack Query */}
        <QueryClientProvider client={queryClient}>
          
          {/* The Router */}
          <RouterProvider router={router} />
          
          {/* Toast Notification Container */}
          <Toaster />
          
        </QueryClientProvider>
     </AuthProvider>
  </React.StrictMode>,
)