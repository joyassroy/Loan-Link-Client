import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    // 1. 🚀 PREMIUM FULL-SCREEN LOADING ANIMATION
    if (loading) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-base-200 transition-colors duration-300 z-[100]">
                {/* Branded Logo Bounce */}
                <div className="w-16 h-16 bg-gradient-to-tr from-primary to-secondary rounded-2xl flex items-center justify-center text-white text-2xl font-extrabold shadow-lg shadow-primary/30 animate-bounce mb-4">
                    LL
                </div>
                {/* Loading Text */}
                <div className="flex items-center gap-3 text-base-content/70 font-medium tracking-wide">
                    <span className="loading loading-ring loading-md text-primary"></span>
                    Authenticating securely...
                </div>
            </div>
        );
    }

    // 2. ইউজার থাকলে পেজে যেতে দাও
    if (user) {
        return children;
    }

    // 3. না থাকলে লগইন পেজে পাঠাও
    return <Navigate to="/login" state={{ from: location }} replace></Navigate>;
};

export default PrivateRoute;