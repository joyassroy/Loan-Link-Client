import { Link, Outlet, NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { 
    FaBars, FaHome, FaUser, FaUsers, FaMoneyBillWave, 
    FaFileInvoiceDollar, FaPlusCircle, FaListAlt, FaSignOutAlt, 
    FaCheckCircle, FaWallet, FaPowerOff, FaChartPie, FaCog, FaChartLine 
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

    // --- 🚀 FULL DASHBOARD SKELETON LOADER ---
    if (loading || roleLoading) {
        return (
            <div className="flex h-screen bg-base-200 transition-colors duration-300 overflow-hidden">
                {/* Skeleton Sidebar (Hidden on mobile) */}
                <div className="hidden lg:flex w-72 bg-base-100 border-r border-base-300 flex-col animate-pulse z-10">
                    <div className="h-20 border-b border-base-300 flex items-center px-8">
                        <div className="h-8 w-32 bg-base-300/50 rounded-lg"></div>
                    </div>
                    <div className="p-4 space-y-4 mt-6">
                        <div className="flex items-center gap-4 mb-8 p-4 bg-base-200 rounded-2xl">
                            <div className="w-12 h-12 rounded-full bg-base-300/50"></div>
                            <div className="space-y-2">
                                <div className="h-4 w-24 bg-base-300/50 rounded"></div>
                                <div className="h-3 w-12 bg-base-300/50 rounded-full"></div>
                            </div>
                        </div>
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-12 w-full bg-base-300/50 rounded-xl"></div>
                        ))}
                    </div>
                </div>

                {/* Skeleton Main Content */}
                <div className="flex-1 flex flex-col animate-pulse">
                    {/* Mobile Navbar Skeleton */}
                    <div className="h-16 bg-base-100 border-b border-base-300 lg:hidden flex items-center justify-between px-4">
                        <div className="h-8 w-8 bg-base-300/50 rounded-md"></div>
                        <div className="h-6 w-24 bg-base-300/50 rounded-md"></div>
                        <div className="h-9 w-9 bg-base-300/50 rounded-full"></div>
                    </div>
                    {/* Page Content Skeleton */}
                    <div className="p-4 md:p-8 space-y-6">
                        <div className="h-10 w-1/3 max-w-[200px] bg-base-300/50 rounded-xl"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-32 bg-base-100 rounded-2xl border border-base-300"></div>
                            ))}
                        </div>
                        <div className="h-64 w-full bg-base-100 rounded-3xl border border-base-300 mt-8"></div>
                    </div>
                </div>
            </div>
        );
    }

    const role = userRole?.toLowerCase() || 'borrower';
    const isAdmin = role === 'admin';
    const isManager = role === 'manager';
    const isBorrower = !isAdmin && !isManager;

    const navLinkClass = ({ isActive }) => 
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm md:text-base mb-1 ${
            isActive 
            ? "bg-primary text-white shadow-lg shadow-primary/30 translate-x-1" 
            : "text-base-content/70 hover:bg-base-200 hover:text-primary"
        }`;

    const handleLogout = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You will be logged out of your session.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, Logout',
            background: 'var(--fallback-b1,oklch(var(--b1)))',
            color: 'var(--fallback-bc,oklch(var(--bc)))'
        }).then((result) => {
            if (result.isConfirmed) {
                logOut();
            }
        });
    };

    return (
        <div className="drawer lg:drawer-open bg-base-200 font-sans transition-colors duration-300">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            
            {/* --- MAIN CONTENT AREA --- */}
            <div className="drawer-content flex flex-col h-full">
                {/* Mobile Top Navbar */}
                <div className="w-full navbar bg-base-100 shadow-sm lg:hidden sticky top-0 z-50 px-4 border-b border-base-300 transition-colors duration-300">
                    <div className="flex-none">
                        <label htmlFor="my-drawer-2" className="btn btn-square btn-ghost text-primary">
                            <FaBars size={24} />
                        </label>
                    </div>
                    <div className="flex-1 px-2 mx-2">
                        <Link to="/" className="text-xl font-bold text-base-content">
                            Loan<span className="text-primary">Link</span>
                        </Link>
                    </div>
                    <div className="flex-none">
                        <div className="avatar">
                            <div className="w-9 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                <img src={user?.photoURL || "https://i.ibb.co/hYsm3PL/user.png"} alt="user" />
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
                
                <aside className="w-72 h-screen bg-base-100 text-base-content flex flex-col shadow-2xl border-r border-base-300 sticky top-0 transition-colors duration-300">
                    
                    {/* 1. Sidebar Header (Logo) */}
                    <div className="h-20 flex items-center px-8 border-b border-base-300">
                        <Link to="/" className="text-2xl font-extrabold tracking-wide flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-tr from-primary to-secondary rounded-lg flex items-center justify-center text-white text-sm shadow-md">LL</div>
                            Loan<span className="text-primary">Link</span>
                        </Link>
                    </div>

                    {/* 2. Scrollable Menu Area */}
                    <div className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
                        
                        {/* Profile Summary Widget */}
                        <div className="flex items-center gap-4 mb-8 p-4 bg-base-200 rounded-2xl border border-base-300 transition-colors">
                            <div className="avatar online">
                                <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                    <img src={user?.photoURL || "https://i.ibb.co/hYsm3PL/user.png"} alt="User" />
                                </div>
                            </div>
                            <div className="overflow-hidden">
                                <h4 className="font-bold text-base-content truncate text-sm">{user?.displayName?.split(' ')[0] || 'User'}</h4>
                                <span className="text-[10px] uppercase font-bold tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full mt-1 inline-block">
                                    {role}
                                </span>
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <ul className="space-y-1">
                            
                            {/* ================= ADMIN MENU (Min 6) ================= */}
                            {isAdmin && <>
                                <li className="text-xs font-bold text-base-content/40 uppercase tracking-widest mb-3 mt-2 pl-2">Admin Dashboard</li>
                                <li><NavLink to="/dashboard" end className={navLinkClass}><FaChartPie /> Overview</NavLink></li>
                                <li><NavLink to="/dashboard/manage-users" className={navLinkClass}><FaUsers /> Manage Users</NavLink></li>
                                <li><NavLink to="/dashboard/loan-applications" className={navLinkClass}><FaFileInvoiceDollar /> All Applications</NavLink></li>
                                <li><NavLink to="/dashboard/admin-all-loans" className={navLinkClass}><FaListAlt /> Manage Loans</NavLink></li>
                                <li><NavLink to="/dashboard/reports" className={navLinkClass}><FaChartLine /> Reports</NavLink></li>
                                <li><NavLink to="/dashboard/settings" className={navLinkClass}><FaCog /> Settings</NavLink></li>
                            </>}

                            {/* ================= MANAGER MENU ================= */}
                            {isManager && <>
                                <li className="text-xs font-bold text-base-content/40 uppercase tracking-widest mb-3 mt-2 pl-2">Manager Dashboard</li>
                                <li><NavLink to="/dashboard" end className={navLinkClass}><FaChartPie /> Overview</NavLink></li>
                                <li><NavLink to="/dashboard/add-loan" className={navLinkClass}><FaPlusCircle /> Add Loan</NavLink></li>
                                <li><NavLink to="/dashboard/manage-loans" className={navLinkClass}><FaListAlt /> Manage Loans</NavLink></li>
                                <li><NavLink to="/dashboard/pending-loans" className={navLinkClass}><FaMoneyBillWave /> Pending Loans</NavLink></li>
                                <li><NavLink to="/dashboard/approved-loans" className={navLinkClass}><FaCheckCircle /> Approved Loans</NavLink></li>
                            </>}

                            {/* ================= BORROWER MENU (Min 4) ================= */}
                            {isBorrower && <>
                                <li className="text-xs font-bold text-base-content/40 uppercase tracking-widest mb-3 mt-2 pl-2">User Dashboard</li>
                                <li><NavLink to="/dashboard" end className={navLinkClass}><FaChartPie /> Overview</NavLink></li>
                                <li><NavLink to="/dashboard/my-loans" className={navLinkClass}><FaWallet /> My Applications</NavLink></li>
                                <li><NavLink to="/dashboard/profile" className={navLinkClass}><FaUser /> Profile</NavLink></li>
                                <li><NavLink to="/dashboard/settings" className={navLinkClass}><FaCog /> Settings</NavLink></li>
                            </>}

                            <div className="divider my-4 opacity-50"></div>

                            {/* --- GENERAL HOME LINK --- */}
                            <li><NavLink to="/" className={navLinkClass}><FaHome /> Back to Home</NavLink></li>
                        </ul>
                    </div>

                    {/* 3. PREMIUM LOGOUT SECTION (Fixed at Bottom) */}
                    <div className="p-4 border-t border-base-300 bg-base-200 transition-colors duration-300">
                        <button 
                            onClick={handleLogout}
                            className="group flex items-center gap-3 w-full px-4 py-4 rounded-2xl transition-all duration-300 hover:bg-base-100 hover:shadow-lg hover:shadow-error/10 border border-transparent hover:border-error/20"
                        >
                            {/* Icon Box */}
                            <div className="w-10 h-10 rounded-xl bg-error/10 text-error flex items-center justify-center text-lg group-hover:bg-error group-hover:text-white transition-colors duration-300">
                                <FaPowerOff />
                            </div>
                            
                            {/* Text Info */}
                            <div className="text-left">
                                <p className="font-bold text-base-content text-sm group-hover:text-error transition-colors">Log Out</p>
                                <p className="text-xs text-base-content/50">End your session</p>
                            </div>
                        </button>
                    </div>

                </aside>
            </div>
        </div>
    );
};

export default DashboardLayout;