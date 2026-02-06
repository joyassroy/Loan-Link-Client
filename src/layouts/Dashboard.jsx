import { NavLink, Outlet } from "react-router-dom";
import useRole from "../hooks/useRole"; // Custom hook to get role from DB

const Dashboard = () => {
    const [role] = useRole(); // Assume this hook returns 'admin', 'manager', or 'user'

    return (
        <div className="flex">
            {/* Sidebar */}
            <div className="w-64 min-h-screen bg-orange-400">
                <ul className="menu p-4">
                    {
                        role === 'admin' && <>
                            <li><NavLink to="/dashboard/adminHome">Admin Home</NavLink></li>
                            <li><NavLink to="/dashboard/manage-users">Manage Users</NavLink></li>
                            <li><NavLink to="/dashboard/all-loan">All Loans</NavLink></li>
                        </>
                    }
                    {
                        role === 'manager' && <>
                            <li><NavLink to="/dashboard/managerHome">Manager Home</NavLink></li>
                            <li><NavLink to="/dashboard/add-loan">Add Loan</NavLink></li>
                            <li><NavLink to="/dashboard/pending-loans">Pending Applications</NavLink></li>
                        </>
                    }
                    {
                        role === 'user' && <>
                            <li><NavLink to="/dashboard/userHome">User Home</NavLink></li>
                            <li><NavLink to="/dashboard/my-loans">My Loans</NavLink></li>
                        </>
                    }
                    <div className="divider"></div>
                    <li><NavLink to="/">Home</NavLink></li>
                </ul>
            </div>
            {/* Main Content */}
            <div className="flex-1 p-8">
                <Outlet></Outlet>
            </div>
        </div>
    );
};

export default Dashboard;