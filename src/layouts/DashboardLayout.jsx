import { Link, Outlet, NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { 
    FaBars, FaHome, FaUser, FaUsers, FaMoneyBillWave, 
    FaFileInvoiceDollar, FaPlusCircle, FaListAlt, FaSignOutAlt, 
    FaCheckCircle, FaWallet, FaPowerOff 
} from "react-icons/fa";
import Swal from "sweetalert2";

const DashboardLayout = () => {
    const { user, logOut, loading } = useAuth();
    const axiosSecure = useAxiosSecure();

    // 1. Role Fetching
    const { data: userRole = null, isLoading: roleLoading } = useQuery({
        queryKey: ['role', user?.email],
        enabled: !!user?.email && !loading,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/role/${user.email}`);
            return res.data?.role;
        }
    });

    if (loading || roleLoading) {
        return <div className="flex justify-center items-center h-screen"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
    }

    const role = userRole?.toLowerCase() || 'borrower';
    const isAdmin = role === 'admin';
    const isManager = role === 'manager';
    const isBorrower = !isAdmin && !isManager;

    const navLinkClass = ({ isActive }) => 
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm md:text-base mb-1 ${
            isActive 
            ? "bg-primary text-white shadow-lg shadow-primary/30 translate-x-1" 
            : "text-gray-500 hover:bg-gray-100 hover:text-primary"
        }`;

    const handleLogout = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You will be logged out of your session.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, Logout'
        }).then((result) => {
            if (result.isConfirmed) {
                logOut();
            }
        });
    };

    return (
        <div className="drawer lg:drawer-open bg-base-200 font-sans">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            
            {/* --- MAIN CONTENT AREA --- */}
            <div className="drawer-content flex flex-col h-full">
                {/* Mobile Top Navbar */}
                <div className="w-full navbar bg-base-100 shadow-sm lg:hidden sticky top-0 z-50 px-4 border-b">
                    <div className="flex-none">
                        <label htmlFor="my-drawer-2" className="btn btn-square btn-ghost text-primary">
                            <FaBars size={24} />
                        </label>
                    </div>
                    <div className="flex-1 px-2 mx-2">
                        <Link to="/" className="text-xl font-bold text-gray-800">
                            Loan<span className="text-primary">Link</span>
                        </Link>
                    </div>
                    <div className="flex-none">
                        <div className="avatar">
                            <div className="w-9 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                <img src={user?.photoURL} alt="user" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <div className="p-4 md:p-8 min-h-screen overflow-y-auto">
                    <Outlet />
                </div>
            </div> 
            
            {/* --- PREMIUM SIDEBAR --- */}
            <div className="drawer-side z-50">
                <label htmlFor="my-drawer-2" className="drawer-overlay"></label> 
                
                <aside className="w-72 h-screen bg-white text-base-content flex flex-col shadow-2xl border-r border-gray-100 sticky top-0">
                    
                    {/* 1. Sidebar Header (Logo) */}
                    <div className="h-20 flex items-center px-8 border-b border-gray-100">
                        <Link to="/" className="text-2xl font-extrabold tracking-wide text-gray-800 flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-tr from-primary to-secondary rounded-lg flex items-center justify-center text-white text-sm shadow-md">LL</div>
                            Loan<span className="text-primary">Link</span>
                        </Link>
                    </div>

                    {/* 2. Scrollable Menu Area */}
                    <div className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
                        
                        {/* Profile Summary Widget */}
                        <div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <div className="avatar online">
                                <div className="w-12 rounded-full">
                                    <img src={user?.photoURL || "https://i.ibb.co/hYsm3PL/user.png"} alt="User" />
                                </div>
                            </div>
                            <div className="overflow-hidden">
                                <h4 className="font-bold text-gray-800 truncate text-sm">{user?.displayName?.split(' ')[0]}</h4>
                                <span className="text-[10px] uppercase font-bold tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                    {role}
                                </span>
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <ul className="space-y-1">
                            {/* --- ADMIN --- */}
                            {isAdmin && <>
                                <li className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 mt-2 pl-2">Admin</li>
                                <li><NavLink to="/dashboard/manage-users" className={navLinkClass}><FaUsers /> Manage Users</NavLink></li>
                                <li><NavLink to="/dashboard/admin-all-loans" className={navLinkClass}><FaListAlt /> All Loans</NavLink></li>
                                <li><NavLink to="/dashboard/loan-applications" className={navLinkClass}><FaFileInvoiceDollar /> Applications</NavLink></li>
                            </>}

                            {/* --- MANAGER --- */}
                            {isManager && <>
                                <li className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 mt-2 pl-2">Manager</li>
                                <li><NavLink to="/dashboard/add-loan" className={navLinkClass}><FaPlusCircle /> Add Loan</NavLink></li>
                                <li><NavLink to="/dashboard/manage-loans" className={navLinkClass}><FaListAlt /> Manage Loans</NavLink></li>
                                <li><NavLink to="/dashboard/pending-loans" className={navLinkClass}><FaMoneyBillWave /> Pending Loans</NavLink></li>
                                <li><NavLink to="/dashboard/approved-loans" className={navLinkClass}><FaCheckCircle /> Approved Loans</NavLink></li>
                            </>}

                            {/* --- BORROWER --- */}
                            {isBorrower && <>
                                <li className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 mt-2 pl-2">Borrower</li>
                                <li><NavLink to="/dashboard/my-loans" className={navLinkClass}><FaWallet /> My Loans</NavLink></li>
                                <li><NavLink to="/dashboard/apply-loan" className={navLinkClass}><FaMoneyBillWave /> Apply Loan</NavLink></li>
                            </>}

                            <div className="divider my-4"></div>

                            {/* --- GENERAL --- */}
                            <li><NavLink to="/dashboard/profile" className={navLinkClass}><FaUser /> Profile</NavLink></li>
                            <li><NavLink to="/" className={navLinkClass}><FaHome /> Home</NavLink></li>
                        </ul>
                    </div>

                    {/* 3. PREMIUM LOGOUT SECTION (Fixed at Bottom) */}
                    <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                        <button 
                            onClick={handleLogout}
                            className="group flex items-center gap-3 w-full px-4 py-4 rounded-2xl transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-red-100 border border-transparent hover:border-red-100"
                        >
                            {/* Icon Box */}
                            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center text-lg group-hover:bg-red-500 group-hover:text-white transition-colors duration-300">
                                <FaPowerOff />
                            </div>
                            
                            {/* Text Info */}
                            <div className="text-left">
                                <p className="font-bold text-gray-700 text-sm group-hover:text-red-600 transition-colors">Log Out</p>
                                <p className="text-xs text-gray-400">End your session</p>
                            </div>
                        </button>
                    </div>

                </aside>
            </div>
        </div>
    );
};

export default DashboardLayout;