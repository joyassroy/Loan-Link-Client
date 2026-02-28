import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// Public Pages
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import AllLoans from "../pages/AllLoans/AllLoans";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import Contact from "../pages/Contact/Contact"; 
import About from "../pages/About/About";  
import MyLoans from "../pages/Dashboard/Borrower/MyLoans"; 
import Payment from "../pages/Dashboard/Borrower/Payment";

// Private Dashboard Pages
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute"; 
import LoanDetails from "../pages/AllLoans/LoanDetails";

// Common
import Profile from "../pages/Dashboard/Profile";
import Overview from "../pages/Dashboard/Overview/Overview"; // ✅ নতুন Overview কম্পোনেন্ট ইমপোর্ট করা হলো

// Admin
import ManageUsers from "../pages/Dashboard/Admin/ManageUsers";
import AdminAllLoans from "../pages/Dashboard/Admin/AdminAllLoans";
import LoanApplications from "../pages/Dashboard/Admin/LoanApplications";

// Manager
import AddLoan from "../pages/Dashboard/Manager/AddLoan";
import ManageLoans from "../pages/Dashboard/Manager/ManageLoans";
import PendingLoans from "../pages/Dashboard/Manager/PendingLoans";
import ApprovedLoans from "../pages/Dashboard/Manager/ApprovedLoans";
import LoanApplication from "../pages/AllLoans/LoanApplication";

// --- ডামি কম্পোনেন্ট (যেগুলোর ফাইল এখনো বানানো হয়নি) ---
import Settings from "../pages/Dashboard/Borrower/Settings";
import Reports from "../pages/Dashboard/Admin/Reports";


const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "all-loans",
        element: <AllLoans />,
      },
      { path: "contact", element: <Contact /> },
      { path: "about", element: <About /> },
      {
        path: "loans/:id", 
        element: <PrivateRoute><LoanDetails></LoanDetails></PrivateRoute> 
      },
      {
        path: "application/:id",
        element: <PrivateRoute><LoanApplication></LoanApplication></PrivateRoute>
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
  {
    path: "dashboard",
    element: <PrivateRoute><DashboardLayout /></PrivateRoute>, 
    children: [
      
      // ✅ COMMON ROUTES (Admin, Manager, User সবাই দেখতে পাবে)
      {
        index: true, // ✅ এটি /dashboard এ গেলে ডিফল্টভাবে Overview পেজ দেখাবে
        element: <Overview />, 
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "settings", // ✅ নতুন Settings রাউট
        element: <Settings />,
      },
      {
          path: "payment/:id",
          element: <Payment />,
      },

      // --- ADMIN ROUTES ---
      {
        path: "manage-users",
        element: <AdminRoute><ManageUsers /></AdminRoute>,
      },
      {
        path: "admin-all-loans",
        element: <AdminRoute><AdminAllLoans /></AdminRoute>,
      },
      {
        path: "loan-applications",
        element: <AdminRoute><LoanApplications /></AdminRoute>,
      },
      {
        path: "reports", // ✅ নতুন Reports রাউট (শুধু Admin এর জন্য)
        element: <AdminRoute><Reports /></AdminRoute>,
      },

      // --- MANAGER ROUTES ---
      {
        path: "add-loan",
        element: <AddLoan />, 
      },
      {
        path: "manage-loans",
        element: <ManageLoans />,
      },
      {
        path: "pending-loans",
        element: <PendingLoans />,
      },
      {
        path: "approved-loans",
        element: <ApprovedLoans />, 
      },

      // --- BORROWER ROUTES ---
      {
        path: "my-loans",
        element: <MyLoans />,
      },
    ],
  },
]);

export default router;