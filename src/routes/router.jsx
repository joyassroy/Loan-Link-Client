import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// Public Pages
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import AllLoans from "../pages/AllLoans/AllLoans";
//import LoanDetails from "../pages/LoanDetails/LoanDetails";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import Contact from "../pages/Contact/Contact"; 
import About from "../pages/About/About";  
import MyLoans from "../pages/Dashboard/Borrower/MyLoans"; 
import Payment from "../pages/Dashboard/Borrower/Payment";
// পাথ (path) চেক করে নিও     
// Private Dashboard Pages
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute"; // Import the file you just made
import LoanDetails from "../pages/AllLoans/LoanDetails";
// Common
import Profile from "../pages/Dashboard/Profile";

// Admin
import ManageUsers from "../pages/Dashboard/Admin/ManageUsers";
import AdminAllLoans from "../pages/Dashboard/Admin/AdminAllLoans";
// Manager
import AddLoan from "../pages/Dashboard/Manager/AddLoan";
import ManageLoans from "../pages/Dashboard/Manager/ManageLoans";
import PendingLoans from "../pages/Dashboard/Manager/PendingLoans";
import LoanApplications from "../pages/Dashboard/Admin/LoanApplications";
import ApprovedLoans from "../pages/Dashboard/Manager/ApprovedLoans";
import LoanApplication from "../pages/AllLoans/LoanApplication";
// Borrower
//import MyLoans from "../pages/Dashboard/Borrower/MyLoans";


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
        // নোট: যদি চাও লগইন ছাড়াও দেখবে, তাহলে <PrivateRoute> সরিয়ে শুধু <LoanDetails /> দাও
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
    element: <PrivateRoute><DashboardLayout /></PrivateRoute>, // Protect Entire Dashboard
    children: [
      // Common Route
      {
        path: "profile",
        element: <Profile />,
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
      // You can add 'admin-all-loans' here similarly

      // --- MANAGER ROUTES ---
      {
        path: "add-loan",
        element: <AddLoan />, // Wrap in <ManagerRoute> if you created it
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
        element: <ApprovedLoans />, // Can wrap in ManagerRoute
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