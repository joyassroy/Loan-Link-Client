import { Outlet } from "react-router-dom";
import Navbar from "../pages/Shared/Navbar"; // You need to create this
import Footer from "../pages/Shared/Footer"; // You need to create this

const MainLayout = () => {
    return (
        <div>
            <Navbar />
            <div className="min-h-screen">
                {/* This is where Home, AllLoans, Login content will appear */}
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};
export default MainLayout;