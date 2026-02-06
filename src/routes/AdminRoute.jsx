import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useRole from "../hooks/useRole";

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth(); 
    const [role, isRoleLoading] = useRole();
    const location = useLocation();

    if (loading || isRoleLoading) {
        return <progress className="progress w-56"></progress>
    }

    if (user && role === 'admin') {
        return children;
    }
    return <Navigate to="/" state={{ from: location }} replace></Navigate>
};

export default AdminRoute;