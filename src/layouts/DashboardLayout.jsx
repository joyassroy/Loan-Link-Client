import { Link, Outlet, NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const DashboardLayout = () => {
    const { user, logOut, loading } = useAuth(); // loading state আনলাম
    const axiosSecure = useAxiosSecure();

    // 1. Role Fetching with Better Logic
    const { data: userRole = null, isLoading: roleLoading } = useQuery({
        queryKey: ['role', user?.email],
        enabled: !!user?.email && !loading, // Auth loading শেষ হলে এবং ইমেইল থাকলেই কল হবে
        queryFn: async () => {
            console.log("Checking Role for:", user.email); // Debugging Log
            const res = await axiosSecure.get(`/users/role/${user.email}`);
            console.log("Role Received:", res.data?.role); // Debugging Log
            return res.data?.role;
        }
    });

    // 2. Loading State Handling
    if (loading || roleLoading) {
        return <div className="flex justify-center items-center h-screen"><span className="loading loading-spinner loading-lg"></span></div>;
    }

    // 3. Role Checking (Case Insensitive)
    const role = userRole?.toLowerCase() || 'borrower';
    const isAdmin = role === 'admin';
    const isManager = role === 'manager';
    const isBorrower = !isAdmin && !isManager;

    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            
            {/* Page Content */}
            <div className="drawer-content flex flex-col p-5">
                <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden mb-4 w-fit">Open Menu</label>
                <Outlet />
            </div> 
            
            {/* Sidebar */}
            <div className="drawer-side">
                <label htmlFor="my-drawer-2" className="drawer-overlay"></label> 
                <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
                    
                    {/* User Profile Info */}
                    <div className="mb-6 text-center">
                        <div className="avatar">
                            <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                <img src={user?.photoURL || "https://i.ibb.co/hYsm3PL/user.png"} alt="User" />
                            </div>
                        </div>
                        <p className="font-bold mt-2">{user?.displayName}</p>
                        <p className="text-xs badge badge-secondary uppercase">{role}</p>
                    </div>

                    {/* --- ADMIN MENU --- */}
                    {isAdmin && <>
                        <li><NavLink to="/dashboard/manage-users">Manage Users</NavLink></li>
                        <li><NavLink to="/dashboard/admin-all-loans">All Loans</NavLink></li>
                        <li><NavLink to="/dashboard/loan-applications">Loan Applications</NavLink></li>
                    </>}

                    {/* --- MANAGER MENU --- */}
                    {isManager && <>
                        <li><NavLink to="/dashboard/add-loan">Add Loan</NavLink></li>
                        <li><NavLink to="/dashboard/manage-loans">Manage Loans</NavLink></li>
                        <li><NavLink to="/dashboard/pending-loans">Pending Loans</NavLink></li>
                        <li><NavLink to="/dashboard/approved-loans">Approved Loans</NavLink></li>
                    </>}

                    {/* --- BORROWER MENU --- */}
                    {isBorrower && <>
                        <li><NavLink to="/dashboard/my-loans">My Loans</NavLink></li>
                    </>}

                    <div className="divider"></div>

                    {/* --- SHARED MENU --- */}
                    <li><NavLink to="/dashboard/profile">My Profile</NavLink></li>
                    <li><NavLink to="/">Home</NavLink></li>
                    <li><button onClick={logOut} className="btn btn-sm btn-ghost mt-4">Logout</button></li>
                </ul>
            </div>
        </div>
    );
};

export default DashboardLayout;