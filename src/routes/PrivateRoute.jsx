import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    // 1. যদি লোডিং হয়, তবে স্পিনার দেখাও (Redirect করো না)
    if (loading) {
        return <progress className="progress w-56"></progress>;
    }

    // 2. ইউজার থাকলে পেজে যেতে দাও
    if (user) {
        return children;
    }

    // 3. না থাকলে লগইন পেজে পাঠাও
    return <Navigate to="/login" state={{ from: location }} replace></Navigate>;
};

export default PrivateRoute;